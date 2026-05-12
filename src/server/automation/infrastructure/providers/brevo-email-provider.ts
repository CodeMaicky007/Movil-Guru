import { createTransport } from 'nodemailer';
import type { Notification, RenderedEmail, SendResult } from '../../domain/notification';
import type { NotificationProvider } from './notification-provider';

export class BrevoEmailProvider implements NotificationProvider {
  readonly name = 'brevo';
  readonly channel = 'email' as const;

  private readonly transporter;

  constructor(
    smtpLogin: string,
    smtpPassword: string,
    private readonly fromEmail: string,
    private readonly fromName: string,
    private readonly replyTo?: string,
  ) {
    this.transporter = createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: { user: smtpLogin, pass: smtpPassword },
    });
  }

  async send(notification: Notification, rendered: RenderedEmail | string): Promise<SendResult> {
    if (typeof rendered === 'string') {
      return { ok: false, provider: this.name, error: 'Email provider requires RenderedEmail', retryable: false };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: notification.recipient,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        ...(this.replyTo ? { replyTo: this.replyTo } : {}),
        headers: { 'X-Entity-Ref-ID': notification.id },
      });

      console.log('[brevo-smtp] sent:', info.messageId, '→', notification.recipient);
      return { ok: true, provider: this.name, provider_id: info.messageId };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[brevo-smtp] error:', msg);
      return { ok: false, provider: this.name, error: msg, retryable: true };
    }
  }
}
