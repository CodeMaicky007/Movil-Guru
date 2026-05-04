import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/users/:id — actualizar role / store_id / active / full_name
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let me;
  try { me = await requireApiUser(['admin','manager']); } catch (r) { return r as Response; }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const allowed = ['role','store_id','active','full_name'] as const;
  const patch: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) patch[k] = body[k];

  if (me.role === 'manager') {
    delete patch.role;
    delete patch.store_id;
  }
  if ('role' in patch && !['admin','manager','tecnico'].includes(patch.role as string)) {
    return NextResponse.json({ error: 'role inválido' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('profiles').update(patch).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ user: data });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireApiUser(['admin']); } catch (r) { return r as Response; }
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
