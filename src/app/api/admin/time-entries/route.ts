import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireApiUser } from '@/lib/auth';

// GET /api/admin/time-entries?profile_id=...&from=YYYY-MM-DD&to=...
// - Por defecto: últimos 30 días del usuario actual.
// - Admin/manager pueden pasar profile_id; RLS filtra el resto.
export async function GET(req: Request) {
  let me;
  try { me = await requireApiUser(); } catch (r) { return r as Response; }

  const url = new URL(req.url);
  const profileId = url.searchParams.get('profile_id') ?? me.id;
  const from = url.searchParams.get('from');
  const to   = url.searchParams.get('to');

  const supabase = createSupabaseServerClient();
  let q = supabase
    .from('time_entries')
    .select('id, profile_id, store_id, clock_in, clock_out, break_minutes, note')
    .eq('profile_id', profileId)
    .order('clock_in', { ascending: false })
    .limit(100);
  if (from) q = q.gte('clock_in', from);
  if (to)   q = q.lte('clock_in', to);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ entries: data });
}
