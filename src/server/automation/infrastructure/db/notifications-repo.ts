import type { SupabaseClient } from '@supabase/supabase-js';
import type { Notification, NotificationDraft } from '../../domain/notification';

const TABLE = 'notifications';
const LOGS = 'notification_logs';

export class NotificationsRepo {
  constructor(private readonly db: SupabaseClient) {}

  async create(draft: NotificationDraft): Promise<string> {
    const row = {
      event_id: draft.event_id ?? null,
      channel: draft.channel,
      template: draft.template,
      recipient: draft.recipient,
      payload: draft.payload,
      scheduled_for: (draft.scheduled_for ?? new Date()).toISOString(),
      max_attempts: draft.max_attempts ?? 5,
    };
    const { data, error } = await this.db.from(TABLE).insert(row).select('id').single();
    if (error) throw new Error(`createNotification: ${error.message}`);
    return (data as { id: string }).id;
  }

  async fetchDue(limit: number): Promise<Notification[]> {
    const nowIso = new Date().toISOString();
    const { data, error } = await this.db
      .from(TABLE)
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', nowIso)
      .order('scheduled_for', { ascending: true })
      .limit(limit);
    if (error) throw new Error(`fetchDue: ${error.message}`);
    return (data ?? []) as Notification[];
  }

  async claim(id: string): Promise<Notification | null> {
    const { data, error } = await this.db
      .from(TABLE)
      .update({ status: 'sending' })
      .eq('id', id)
      .eq('status', 'pending')
      .select()
      .maybeSingle();
    if (error) throw new Error(`claim: ${error.message}`);
    return (data as Notification | null) ?? null;
  }

  async markSent(id: string, attempt: number): Promise<void> {
    const { error } = await this.db
      .from(TABLE)
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        attempts: attempt,
        last_error: null,
      })
      .eq('id', id);
    if (error) throw new Error(`markSent: ${error.message}`);
  }

  async scheduleRetry(id: string, attempt: number, nextAt: Date, error: string): Promise<void> {
    const { error: e } = await this.db
      .from(TABLE)
      .update({
        status: 'pending',
        attempts: attempt,
        last_error: error.slice(0, 1000),
        scheduled_for: nextAt.toISOString(),
      })
      .eq('id', id);
    if (e) throw new Error(`scheduleRetry: ${e.message}`);
  }

  async markFailed(id: string, attempt: number, error: string): Promise<void> {
    const { error: e } = await this.db
      .from(TABLE)
      .update({
        status: 'failed',
        attempts: attempt,
        last_error: error.slice(0, 1000),
      })
      .eq('id', id);
    if (e) throw new Error(`markFailed: ${e.message}`);
  }

  async log(notificationId: string, attempt: number, status: 'sent' | 'failed' | 'skipped', provider: string, providerId: string | null, error: string | null): Promise<void> {
    const { error: e } = await this.db.from(LOGS).insert({
      notification_id: notificationId,
      attempt,
      status,
      provider,
      provider_id: providerId,
      error: error?.slice(0, 1000) ?? null,
    });
    if (e) throw new Error(`log: ${e.message}`);
  }
}
