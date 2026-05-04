import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import ServiciosClient from './client';

export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const me = await requireUser(['admin','manager']);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('services').select('*').order('nombre');
  return <ServiciosClient me={me} initial={data ?? []} />;
}
