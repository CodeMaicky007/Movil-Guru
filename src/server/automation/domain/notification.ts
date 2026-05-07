export const NOTIFICATION_CHANNELS = ['email', 'whatsapp', 'sms', 'push'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_STATUSES = [
  'pending',
  'sending',
  'sent',
  'failed',
  'cancelled',
] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export type Notification = {
  id: string;
  event_id: string | null;
  channel: NotificationChannel;
  template: string;
  recipient: string;
  payload: Record<string, unknown>;
  status: NotificationStatus;
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  scheduled_for: string;
  sent_at: string | null;
  created_at: string;
};

export type NotificationDraft = {
  event_id?: string | null;
  channel: NotificationChannel;
  template: string;
  recipient: string;
  payload: Record<string, unknown>;
  scheduled_for?: Date;
  max_attempts?: number;
};

export type SendResult =
  | { ok: true; provider: string; provider_id?: string }
  | { ok: false; provider: string; error: string; retryable: boolean };

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};
