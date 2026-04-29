import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let me;
  try { me = await requireApiUser(); } catch (r) { return r as Response; }
  const body = await req.json().catch(() => ({}));
  const breakMinutes = Number(body.break_minutes ?? 0);
  const note: string | null = body.note ?? null;

  const supabase = createSupabaseServerClient();
  const { data: open, error: e1 } = await supabase
    .from('time_entries').select('id').eq('profile_id', me.id).is('clock_out', null).maybeSingle();
  if (e1) return NextResponse.json({ error: e1.message }, { status: 400 });
  if (!open) return NextResponse.json({ error: 'No hay fichaje abierto' }, { status: 400 });

  const { data, error } = await supabase
    .from('time_entries')
    .update({ clock_out: new Date().toISOString(), break_minutes: breakMinutes, note })
    .eq('id', open.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ entry: data });
}
