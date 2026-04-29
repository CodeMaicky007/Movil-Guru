import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireApiUser(['admin']); } catch (r) { return r as Response; }
  const body = await req.json().catch(() => ({}));
  const allowed = ['nombre','descripcion','precio_base','duracion_min','activo'] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from('services').update(patch).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ service: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireApiUser(['admin']); } catch (r) { return r as Response; }
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('services').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
