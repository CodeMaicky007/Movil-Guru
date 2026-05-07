import type { Notification, RenderedEmail, SendResult } from '../../domain/notification';
import type { NotificationProvider } from './notification-provider';

// Resend HTTP API directo — sin dependencia del SDK. Si más adelante quieres
// el SDK, cámbialo aquí sin tocar el resto del sistema.
export class ResendEmailProvider implements NotificationProvider {
  readonly name = 'resend';
  readonly channel = 'email' as const;

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly replyTo?: string,
  ) {}

  async send(notification: Notification, rendered: RenderedEmail | string): Promise<SendResult> {
    if (typeof rendered === 'string') {
      return { ok: false, provider: this.name, error: 'Email provider requires RenderedEmail', retryable: false };
    }

    let res: Response;
    try {
      res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: [notification.recipient],
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
          ...(this.replyTo ? { reply_to: this.replyTo } : {}),
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

    let body: { id?: string; message?: string; name?: string } = {};
    try { body = await res.json() as typeof body; } catch { /* ignore */ }

    if (res.ok && body.id) {
      return { ok: true, provider: this.name, provider_id: body.id };
    }

    // 4xx (excepto 429) son errores de cliente — no reintentar.
    const retryable = res.status === 429 || res.status >= 500;
    return {
      ok: false,
      provider: this.name,
      error: body.message ?? body.name ?? `HTTP ${res.status}`,
      retryable,
    };
  }
}
