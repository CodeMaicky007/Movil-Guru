import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import ReservasClient from './client';

export const dynamic = 'force-dynamic';

export default async function ReservasPage() {
  const me = await requireUser();
  const supabase = await createSupabaseServerClient();

  let tecnicosQ = supabase.from('profiles')
    .select('id, full_name, email, store_id')
    .eq('role','tecnico').eq('active', true);
  if (me.role === 'manager' && me.store_id) tecnicosQ = tecnicosQ.eq('store_id', me.store_id);

  const [{ data: reservations }, { data: services }, { data: tiendas }, { data: tecnicos }] = await Promise.all([
    supabase.from('reservations')
      .select('id, code, customer_name, phone, email, device, service_id, store_id, technician_id, scheduled_for, price, status, services(nombre)')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('services').select('id, nombre, precio_base').eq('activo', true).order('nombre'),
    supabase.from('tiendas').select('id, nombre').order('nombre'),
    tecnicosQ,
  ]);

  return (
    <ReservasClient
      me={me}
      initialRows={reservations ?? []}
      services={services ?? []}
      tiendas={tiendas ?? []}
      tecnicos={tecnicos ?? []}
    />
  );
}
