import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { triggerAutomationInline } from '@/server/automation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// API pública para reservas desde el wizard de la web.
// No requiere autenticación — cualquier visitante puede reservar.
// Usa admin client para insertar, pero solo expone campos necesarios.

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }

  const customerName = (body.customer_name as string | undefined)?.trim();
  const phone        = (body.phone as string | undefined)?.trim() ?? null;
  const email        = (body.email as string | undefined)?.trim() ?? null;
  const device       = (body.device as string | undefined)?.trim();
  const scheduledFor = (body.scheduled_for as string | undefined) ?? null;
  const price        = typeof body.price === 'number' ? body.price : null;
  const notes        = (body.notes as string | undefined)?.trim() ?? null;

  if (!customerName || !device) {
    return NextResponse.json({ error: 'customer_name y device son obligatorios' }, { status: 400 });
  }

  const db = createSupabaseAdminClient();
  const { data, error } = await db
    .from('reservations')
    .insert({
      customer_name: customerName,
      phone,
      email,
      device,
      scheduled_for: scheduledFor,
      price: price ?? 0,
      status: 'recibido',
      notes,
    })
    .select('id, code')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await triggerAutomationInline();

  return NextResponse.json({ reservation: data });
}
