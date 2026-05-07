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
  // Reabrir el evento → pending. Aplicable a estados failed o processed (force-replay).
  const { error } = await db
    .from('automation_events')
    .update({ status: 'pending', last_error: null, processed_at: null })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Procesa inline para que el admin vea el resultado al instante.
  await triggerAutomationInline();

  return NextResponse.json({ ok: true });
}
