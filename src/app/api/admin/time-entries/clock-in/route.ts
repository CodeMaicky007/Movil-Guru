import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireApiUser } from '@/lib/auth';

export async function POST() {
  let me;
  try { me = await requireApiUser(); } catch (r) { return r as Response; }

  const supabase = createSupabaseServerClient();

  // Si ya hay un fichaje abierto, devolver ése.
  const { data: open } = await supabase
    .from('time_entries')
    .select('*')
    .eq('profile_id', me.id)
    .is('clock_out', null)
    .maybeSingle();
  if (open) return NextResponse.json({ entry: open, alreadyOpen: true });

  const { data, error } = await supabase
    .from('time_entries')
    .insert({ profile_id: me.id, store_id: me.store_id })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ entry: data });
}
