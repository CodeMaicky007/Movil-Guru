import type { Notification, RenderedEmail, SendResult } from '../../domain/notification';

// Contrato común para cualquier proveedor de envío. Implementaciones nuevas
// (SendGrid, Twilio, Meta WhatsApp...) sólo necesitan satisfacer esta interfaz.
export interface NotificationProvider {
  readonly name: string;
  readonly channel: 'email' | 'whatsapp' | 'sms' | 'push';
  send(notification: Notification, rendered: RenderedEmail | string): Promise<SendResult>;
}
