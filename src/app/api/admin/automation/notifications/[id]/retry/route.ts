import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireApiUser } from '@/lib/auth';
import { triggerAutomationInline } from '@/server/automation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireApiUser(['admin']); } catch (r) { return r as Response; }
  const { id } = await params;

  const db = createSupabaseAdminClient();
  // Reabrir la notificación → pending y programada para enviarse ya.
  const { error } = await db
    .from('notifications')
    .update({ status: 'pending', last_error: null, scheduled_for: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await triggerAutomationInline();

  return NextResponse.json({ ok: true });
}
