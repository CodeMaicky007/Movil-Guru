import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import FichajeClient from './client';

export const dynamic = 'force-dynamic';

export default async function FichajePage() {
  const me = await requireUser();
  const supabase = await createSupabaseServerClient();

  const since = new Date();
  since.setDate(since.getDate() - 14);

  const [{ data: openEntry }, { data: recent }] = await Promise.all([
    supabase.from('time_entries').select('*').eq('profile_id', me.id).is('clock_out', null).maybeSingle(),
    supabase.from('time_entries').select('id, clock_in, clock_out, break_minutes, note')
      .eq('profile_id', me.id).gte('clock_in', since.toISOString())
      .order('clock_in', { ascending: false }).limit(30),
  ]);

  return <FichajeClient me={me} initialOpen={openEntry ?? null} initialRecent={recent ?? []} />;
}
