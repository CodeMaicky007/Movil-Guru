import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import EmpleadosClient from './client';

export const dynamic = 'force-dynamic';

export default async function EmpleadosPage() {
  const me = await requireUser(['admin','manager']);
  const supabase = await createSupabaseServerClient();

  const [{ data: users }, { data: tiendas }] = await Promise.all([
    supabase.from('profiles').select('id, email, full_name, role, store_id, active, created_at').order('created_at', { ascending: false }),
    supabase.from('tiendas').select('id, nombre').order('nombre'),
  ]);

  return (
    <EmpleadosClient
      me={me}
      initialUsers={users ?? []}
      tiendas={tiendas ?? []}
    />
  );
}
