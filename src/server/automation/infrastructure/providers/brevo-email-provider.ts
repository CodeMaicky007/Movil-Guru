import type { Notification, RenderedEmail, SendResult } from '../../domain/notification';
import type { NotificationProvider } from './notification-provider';

export class BrevoEmailProvider implements NotificationProvider {
  readonly name = 'brevo';
  readonly channel = 'email' as const;

  constructor(
    private readonly apiKey: string,
    private readonly fromEmail: string,
    private readonly fromName: string,
    private readonly replyTo?: string,
  ) {}

  async send(notification: Notification, rendered: RenderedEmail | string): Promise<SendResult> {
    if (typeof rendered === 'string') {
      return { ok: false, provider: this.name, error: 'Email provider requires RenderedEmail', retryable: false };
    }

    let res: Response;
    try {
      res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: this.fromEmail, name: this.fromName },
          to: [{ email: notification.recipient }],
          subject: rendered.subject,
          htmlContent: rendered.html,
          textContent: rendered.text,
          ...(this.replyTo ? { replyTo: { email: this.replyTo } } : {}),
          headers: { 'X-Entity-Ref-ID': notification.id },
        }),
      });
    } catch (e) {
      return {
        ok: false,
        provider: this.name,
        error: e instanceof Error ? e.message : 'network error',
        retryable: true,
      };
    }

    let body: { messageId?: string; message?: string; code?: string } = {};
    try { body = await res.json() as typeof body; } catch { /* ignore */ }

    if (res.ok && body.messageId) {
      return { ok: true, provider: this.name, provider_id: body.messageId };
    }

    const retryable = res.status === 429 || res.status >= 500;
    return {
      ok: false,
      provider: this.name,
      error: body.message ?? body.code ?? `HTTP ${res.status}`,
      retryable,
    };
  }
}
