import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Detalle de una notificación: la propia notif + sus logs ordenados.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireApiUser(['admin']); } catch (r) { return r as Response; }
  const { id } = await params;

  const db = createSupabaseAdminClient();
  const [{ data: notification, error: nErr }, { data: logs, error: lErr }] = await Promise.all([
    db.from('notifications').select('*').eq('id', id).maybeSingle(),
    db.from('notification_logs').select('*').eq('notification_id', id).order('created_at', { ascending: false }),
  ]);

  if (nErr || lErr) {
    return NextResponse.json({ error: nErr?.message ?? lErr?.message }, { status: 400 });
  }
  if (!notification) return NextResponse.json({ error: 'not found' }, { status: 404 });

  return NextResponse.json({ notification, logs: logs ?? [] });
}
