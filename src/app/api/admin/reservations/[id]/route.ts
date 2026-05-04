import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireApiUser(); } catch (r) { return r as Response; }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const allowed = ['customer_name','phone','email','device','service_id','store_id','technician_id','scheduled_for','price','status','notes'] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('reservations').update(patch).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ reservation: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireApiUser(['admin','manager']); } catch (r) { return r as Response; }
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('reservations').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
