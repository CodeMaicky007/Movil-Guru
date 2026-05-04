import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireApiUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/admin/users — listar empleados (RLS filtra automáticamente).
export async function GET() {
  try { await requireApiUser(['admin','manager']); } catch (r) { return r as Response; }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, store_id, active, created_at')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ users: data });
}

// POST /api/admin/users — invitar empleado.
// Body: { email, role, store_id?, full_name? }
export async function POST(req: Request) {
  let me;
  try { me = await requireApiUser(['admin','manager']); } catch (r) { return r as Response; }

  const body = await req.json().catch(() => ({}));
  const { email, role, full_name } = body;
  let { store_id } = body;

  if (!email || !role) {
    return NextResponse.json({ error: 'email y role son obligatorios' }, { status: 400 });
  }
  if (!['admin','manager','tecnico'].includes(role)) {
    return NextResponse.json({ error: 'role inválido' }, { status: 400 });
  }
  // Manager solo puede crear técnicos en su tienda.
  if (me.role === 'manager') {
    if (role !== 'tecnico') {
      return NextResponse.json({ error: 'Un manager solo puede crear técnicos' }, { status: 403 });
    }
    store_id = me.store_id;
  }

  const admin = createSupabaseAdminClient();
  const origin = req.headers.get('origin') ?? '';

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/admin/login`,
    data: { role, full_name: full_name ?? null, store_id: store_id ?? null },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ user: data.user });
}
