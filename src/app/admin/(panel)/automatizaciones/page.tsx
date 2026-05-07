import { requireUser } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import AutomatizacionesClient, {
  type EventRow, type NotificationRow, type Kpis,
} from './client';

export const dynamic = 'force-dynamic';

export default async function AutomatizacionesPage() {
  await requireUser(['admin']);
  // Admin client: bypass RLS, pero la página entera está gateada por requireUser('admin').
  const db = createSupabaseAdminClient();

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    eventsRes,
    notifRes,
    kpiAllRes, kpiSentRes, kpiPendRes, kpiFailRes,
    eventsTotalRes, eventsFailedRes,
  ] = await Promise.all([
    db.from('automation_events')
      .select('id, type, status, attempts, last_error, processed_at, created_at, source_table, source_id, payload')
      .order('created_at', { ascending: false })
      .limit(60),

    db.from('notifications')
      .select('id, event_id, channel, template, recipient, status, attempts, max_attempts, last_error, scheduled_for, sent_at, created_at')
      .order('created_at', { ascending: false })
      .limit(60),

    db.from('notifications').select('*', { count: 'exact', head: true }).gte('created_at', since24h),
    db.from('notifications').select('*', { count: 'exact', head: true }).eq('status','sent').gte('sent_at', since24h),
    db.from('notifications').select('*', { count: 'exact', head: true }).eq('status','pending'),
    db.from('notifications').select('*', { count: 'exact', head: true }).eq('status','failed'),

    db.from('automation_events').select('*', { count: 'exact', head: true }).gte('created_at', since24h),
    db.from('automation_events').select('*', { count: 'exact', head: true }).eq('status','failed'),
  ]);

  const kpis: Kpis = {
    notifications24h: kpiAllRes.count ?? 0,
    sent24h:          kpiSentRes.count ?? 0,
    pending:          kpiPendRes.count ?? 0,
    failed:           kpiFailRes.count ?? 0,
    events24h:        eventsTotalRes.count ?? 0,
    eventsFailed:     eventsFailedRes.count ?? 0,
  };

  return (
    <AutomatizacionesClient
      kpis={kpis}
      events={(eventsRes.data ?? []) as EventRow[]}
      notifications={(notifRes.data ?? []) as NotificationRow[]}
    />
  );
}
