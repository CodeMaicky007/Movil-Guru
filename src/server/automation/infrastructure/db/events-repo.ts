import type { SupabaseClient } from '@supabase/supabase-js';
import type { AutomationEvent, AutomationEventType } from '../../domain/events';

const TABLE = 'automation_events';

export class EventsRepo {
  constructor(private readonly db: SupabaseClient) {}

  async fetchPending(limit: number): Promise<AutomationEvent[]> {
    const { data, error } = await this.db
      .from(TABLE)
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) throw new Error(`fetchPending: ${error.message}`);
    return (data ?? []) as AutomationEvent[];
  }

  async claim(id: string): Promise<AutomationEvent | null> {
    // Optimistic claim: sólo gana quien encuentra el row aún en pending.
    const { data, error } = await this.db
      .from(TABLE)
      .update({ status: 'processing', attempts: 1 })
      .eq('id', id)
      .eq('status', 'pending')
      .select()
      .maybeSingle();
    if (error) throw new Error(`claim: ${error.message}`);
    return (data as AutomationEvent | null) ?? null;
  }

  async markProcessed(id: string): Promise<void> {
    const { error } = await this.db
      .from(TABLE)
      .update({ status: 'processed', processed_at: new Date().toISOString(), last_error: null })
      .eq('id', id);
    if (error) throw new Error(`markProcessed: ${error.message}`);
  }

  async markFailed(id: string, error: string): Promise<void> {
    const { error: e } = await this.db
      .from(TABLE)
      .update({ status: 'failed', last_error: error.slice(0, 1000) })
      .eq('id', id);
    if (e) throw new Error(`markFailed: ${e.message}`);
  }

  async release(id: string, error: string): Promise<void> {
    // Devuelve el evento a pending para reintento posterior.
    const { error: e } = await this.db
      .from(TABLE)
      .update({ status: 'pending', last_error: error.slice(0, 1000) })
      .eq('id', id);
    if (e) throw new Error(`release: ${e.message}`);
  }

  async insert(type: AutomationEventType, payload: Record<string, unknown>, source?: { table: string; id: string }): Promise<string> {
    const { data, error } = await this.db
      .from(TABLE)
      .insert({
        type,
        payload,
        source_table: source?.table ?? null,
        source_id: source?.id ?? null,
      })
      .select('id')
      .single();
    if (error) throw new Error(`insert: ${error.message}`);
    return (data as { id: string }).id;
  }
}
