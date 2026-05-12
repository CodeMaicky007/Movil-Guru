import type { NotificationChannel } from '../../domain/notification';
import type { NotificationProvider } from './notification-provider';
import { BrevoEmailProvider } from './brevo-email-provider';
import { ConsoleEmailProvider } from './console-email-provider';

// Resolución de provider por canal. Centralizado aquí para que el worker no
// tenga que conocer ninguna implementación concreta.

let cached: Partial<Record<NotificationChannel, NotificationProvider>> | null = null;

function build(): Partial<Record<NotificationChannel, NotificationProvider>> {
  const providers: Partial<Record<NotificationChannel, NotificationProvider>> = {};

  // Email — Brevo SMTP si hay credenciales, fallback a console en dev.
  const brevoLogin    = process.env.BREVO_SMTP_LOGIN;
  const brevoPassword = process.env.BREVO_SMTP_PASSWORD;
  const brevoFromEmail = process.env.BREVO_FROM_EMAIL ?? 'ac.miguelangel.vega@gmail.com';
  const brevoFromName  = process.env.BREVO_FROM_NAME ?? 'Movil Guru';
  const brevoReplyTo   = process.env.BREVO_REPLY_TO;
  if (brevoLogin && brevoPassword) {
    providers.email = new BrevoEmailProvider(brevoLogin, brevoPassword, brevoFromEmail, brevoFromName, brevoReplyTo);
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
