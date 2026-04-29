import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Logout: cierra la sesión Supabase. El login se hace desde el cliente.
export async function DELETE() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
