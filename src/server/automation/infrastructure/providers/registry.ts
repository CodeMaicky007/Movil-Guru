import type { NotificationChannel } from '../../domain/notification';
import type { NotificationProvider } from './notification-provider';
import { ResendEmailProvider } from './resend-email-provider';
import { ConsoleEmailProvider } from './console-email-provider';

// Resolución de provider por canal. Centralizado aquí para que el worker no
// tenga que conocer ninguna implementación concreta.

let cached: Partial<Record<NotificationChannel, NotificationProvider>> | null = null;

function build(): Partial<Record<NotificationChannel, NotificationProvider>> {
  const providers: Partial<Record<NotificationChannel, NotificationProvider>> = {};

  // Email — Resend si hay API key, fallback a console en dev.
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM ?? 'Movil Guru <reparaciones@movilguru.com>';
  const resendReplyTo = process.env.RESEND_REPLY_TO;
  if (resendKey) {
    providers.email = new ResendEmailProvider(resendKey, resendFrom, resendReplyTo);
  } else {
    providers.email = new ConsoleEmailProvider();
  }

  // whatsapp / sms / push: pendiente. La interfaz está lista — añade aquí
  // cuando contrates Meta WhatsApp Cloud, Twilio, etc.

  return providers;
}

export function getProvider(channel: NotificationChannel): NotificationProvider | null {
  if (!cached) cached = build();
  return cached[channel] ?? null;
}

// Para tests / hot-reload
export function resetProviderCache() { cached = null; }
