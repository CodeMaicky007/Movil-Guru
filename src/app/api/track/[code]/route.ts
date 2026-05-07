import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { REPAIR_STATUSES, type RepairStatus } from '@/lib/repair-status';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Endpoint público de seguimiento. NO devuelve PII del cliente:
// sólo dispositivo, estado, fechas, tienda y nombre de pila del técnico.
// Suficiente para que el cliente confirme su reparación sin filtrar
// teléfono ni email a quien adivine códigos.

const STEP_ORDER: RepairStatus[] = ['recibido','diagnostico','reparando','control','listo'];

const STEP_LABELS: Record<RepairStatus, string> = {
  recibido:    'Recibido en taller',
  diagnostico: 'Diagnóstico completado',
  reparando:   'En reparación',
  control:     'Control de calidad',
  listo:       'Listo para recoger',
  cancelada:   'Reparación cancelada',
};

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = await params;
  const code = (rawCode ?? '').trim().toUpperCase();
  if (!/^MG-\d+$/.test(code)) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
  }

  const db = createSupabaseAdminClient();
  const { data: r, error } = await db
    .from('reservations')
    .select(`
      id, code, device, status, created_at, scheduled_for, store_id, technician_id,
      services(nombre),
      tiendas(nombre)
    `)
    .eq('code', code)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!r)    return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // Casts limpios para los datos de joins (Supabase los tipa amplio).
  const services = r.services as { nombre: string } | { nombre: string }[] | null;
  const tiendas  = r.tiendas as { nombre: string } | { nombre: string }[] | null;
  const serviceName = Array.isArray(services) ? services[0]?.nombre : services?.nombre;
  const storeName   = Array.isArray(tiendas)  ? tiendas[0]?.nombre  : tiendas?.nombre;

  const [historyRes, techRes] = await Promise.all([
    db.from('reservation_history')
      .select('to_status, created_at')
      .eq('reservation_id', r.id)
      .order('created_at', { ascending: true }),
    r.technician_id
      ? db.from('profiles').select('full_name').eq('id', r.technician_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const history = (historyRes.data ?? []) as Array<{ to_status: string; created_at: string }>;
  const techFullName = (techRes.data as { full_name?: string } | null)?.full_name ?? null;

  // Construye los timestamps de cada estado alcanzado.
  // El estado inicial 'recibido' viene del created_at de la reserva.
  const timestamps: Partial<Record<RepairStatus, string>> = { recibido: r.created_at };
  for (const h of history) {
    if (REPAIR_STATUSES.includes(h.to_status as RepairStatus)) {
      timestamps[h.to_status as RepairStatus] = h.created_at;
    }
  }

  const isCancelled = r.status === 'cancelada';
  const currentIdx = isCancelled ? -1 : STEP_ORDER.indexOf(r.status as RepairStatus);

  const steps = STEP_ORDER.map((key, i) => ({
    key,
    label: STEP_LABELS[key],
    done: !isCancelled && i <= currentIdx,
    time: timestamps[key] ?? null,
  }));

  return NextResponse.json({
    reservation: {
      code: r.code,
      device: r.device,
      issue: serviceName ?? 'Reparación',
      status: r.status,
      created_at: r.created_at,
      scheduled_for: r.scheduled_for,
      store: storeName ?? null,
      technician: techFullName ? techFullName.split(' ')[0] : null,
    },
    steps,
  });
}
