import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try { await requireApiUser(); } catch (r) { return r as Response; }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('services')
    .select('*').order('nombre');
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ services: data });
}

export async function POST(req: Request) {
  try { await requireApiUser(['admin']); } catch (r) { return r as Response; }
  const body = await req.json().catch(() => ({}));
  if (!body.nombre) return NextResponse.json({ error: 'nombre obligatorio' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('services').insert({
    nombre: body.nombre,
    descripcion: body.descripcion ?? null,
    precio_base: body.precio_base ?? 0,
    duracion_min: body.duracion_min ?? 60,
    activo: body.activo ?? true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ service: data });
}
