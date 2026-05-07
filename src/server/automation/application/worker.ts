import type { SupabaseClient } from '@supabase/supabase-js';
import type { Notification, RenderedEmail } from '../domain/notification';
import { NotificationsRepo } from '../infrastructure/db/notifications-repo';
import { getProvider } from '../infrastructure/providers/registry';
import { renderEmailTemplate } from '../templates/registry';
import { createLogger } from '../logger';

// Worker que procesa la cola de notificaciones. Estrategia:
//   - claim optimista (status pending → sending)
//   - render template
//   - llamada al provider
//   - éxito → marcar sent + log
//   - fallo retryable → reprogramar con backoff exponencial
//   - fallo no retryable o intentos agotados → marcar failed + log

const BASE_BACKOFF_SECONDS = 60;       // 1m, 2m, 4m, 8m, 16m
const MAX_BACKOFF_SECONDS = 60 * 60;   // tope 1h

export class NotificationWorker {
  private readonly log = createLogger('automation:worker');
  private readonly repo: NotificationsRepo;

  constructor(private readonly db: SupabaseClient) {
    this.repo = new NotificationsRepo(db);
  }

  async tick(limit = 50): Promise<{ sent: number; failed: number; retried: number }> {
    const due = await this.repo.fetchDue(limit);
    let sent = 0, failed = 0, retried = 0;

    for (const n of due) {
      const claimed = await this.repo.claim(n.id);
      if (!claimed) continue;

      const attempt = claimed.attempts + 1;
      const provider = getProvider(claimed.channel);

      if (!provider) {
        await this.repo.markFailed(claimed.id, attempt, `no provider for channel ${claimed.channel}`);
        await this.repo.log(claimed.id, attempt, 'failed', 'none', null, 'no provider configured');
        failed++;
        this.log.error('notification.no_provider', { id: claimed.id, channel: claimed.channel });
        continue;
      }

      let rendered: RenderedEmail | string;
      try {
        rendered = this.render(claimed);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await this.repo.markFailed(claimed.id, attempt, msg);
        await this.repo.log(claimed.id, attempt, 'failed', provider.name, null, `render: ${msg}`);
        failed++;
        this.log.error('notification.render_failed', { id: claimed.id, template: claimed.template, error: msg });
        continue;
      }

      const result = await provider.send(claimed, rendered);

      if (result.ok) {
        await this.repo.markSent(claimed.id, attempt);
        await this.repo.log(claimed.id, attempt, 'sent', result.provider, result.provider_id ?? null, null);
        sent++;
        this.log.info('notification.sent', { id: claimed.id, attempt, provider: result.provider });
        continue;
      }

      await this.repo.log(claimed.id, attempt, 'failed', result.provider, null, result.error);

      const exhausted = attempt >= claimed.max_attempts;
      if (!result.retryable || exhausted) {
        await this.repo.markFailed(claimed.id, attempt, result.error);
        failed++;
        this.log.warn('notification.failed', { id: claimed.id, attempt, retryable: result.retryable, exhausted, error: result.error });
        continue;
      }

      const nextAt = new Date(Date.now() + this.backoffSeconds(attempt) * 1000);
      await this.repo.scheduleRetry(claimed.id, attempt, nextAt, result.error);
      retried++;
      this.log.info('notification.retry', { id: claimed.id, attempt, next_at: nextAt.toISOString() });
    }

    return { sent, failed, retried };
  }

  private render(n: Notification): RenderedEmail | string {
    if (n.channel === 'email') return renderEmailTemplate(n.template, n.payload);
    // Otros canales: cuando se añadan, registra su renderer aquí.
    throw new Error(`channel not implemented: ${n.channel}`);
  }

  private backoffSeconds(attempt: number): number {
    // attempt 1 → 60s, 2 → 120s, 3 → 240s, 4 → 480s, 5 → 960s … capped at 1h
    const seconds = BASE_BACKOFF_SECONDS * Math.pow(2, Math.max(0, attempt - 1));
    return Math.min(seconds, MAX_BACKOFF_SECONDS);
  }
}
