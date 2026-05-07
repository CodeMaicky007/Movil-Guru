import type { Notification, RenderedEmail, SendResult } from '../../domain/notification';
import type { NotificationProvider } from './notification-provider';
import { createLogger } from '../../logger';

// Provider de desarrollo: imprime el email en consola en lugar de enviarlo.
// Se usa cuando RESEND_API_KEY no está configurada — útil en local sin tocar nada.
export class ConsoleEmailProvider implements NotificationProvider {
  readonly name = 'console';
  readonly channel = 'email' as const;
  private readonly log = createLogger('automation:provider:console');

  async send(notification: Notification, rendered: RenderedEmail | string): Promise<SendResult> {
    if (typeof rendered === 'string') {
      return { ok: false, provider: this.name, error: 'Email provider requires RenderedEmail', retryable: false };
    }
    this.log.info('email.sent (dev)', {
      to: notification.recipient,
      subject: rendered.subject,
      template: notification.template,
      preview: rendered.text.slice(0, 200),
    });
    return { ok: true, provider: this.name, provider_id: `dev_${notification.id}` };
  }
}
