import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try { await requireApiUser(); } catch (r) { return r as Response; }
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const supabase = createSupabaseServerClient();
  let q = supabase
    .from('reservations')
    .select('id, code, customer_name, phone, email, device, service_id, store_id, technician_id, scheduled_for, price, status, notes, created_at, services(nombre), tiendas(nombre)')
    .order('created_at', { ascending: false });
  if (status && status !== 'todas') q = q.eq('status', status);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ reservations: data });
}

export async function POST(req: Request) {
  let me;
  try { me = await requireApiUser(['admin','manager']); } catch (r) { return r as Response; }

  const body = await req.json().catch(() => ({}));
  const supabase = createSupabaseServerClient();
  const insert = {
    customer_name: body.customer_name,
    phone: body.phone ?? null,
    email: body.email ?? null,
    device: body.device,
    service_id: body.service_id ?? null,
    store_id: body.store_id ?? me.store_id ?? null,
    technician_id: body.technician_id ?? null,
    scheduled_for: body.scheduled_for ?? null,
    price: body.price ?? 0,
    status: body.status ?? 'pendiente',
    notes: body.notes ?? null,
  };
  if (!insert.customer_name || !insert.device) {
    return NextResponse.json({ error: 'customer_name y device son obligatorios' }, { status: 400 });
  }
  const { data, error } = await supabase.from('reservations').insert(insert).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ reservation: data });
}
