import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase/server';

export type Role = 'admin' | 'manager' | 'tecnico';

export type SessionUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  store_id: string | null;
  active: boolean;
};

/**
 * Devuelve el perfil del usuario autenticado, o null si no hay sesión.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, store_id, active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.active) return null;
  return profile as SessionUser;
});

/**
 * Para Server Components / pages: redirige a /admin/login si no hay sesión.
 * Si se pasan roles, exige que el usuario tenga uno de ellos.
 */
export async function requireUser(roles?: Role[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  if (roles && !roles.includes(user.role)) {
    // Técnicos siempre van a fichaje. Resto a la home del panel.
    redirect(user.role === 'tecnico' ? '/admin/fichaje' : '/admin');
  }
  return user;
}

/**
 * Para route handlers (API): devuelve el user o lanza Response 401/403.
 */
export async function requireApiUser(roles?: Role[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  if (roles && !roles.includes(user.role)) {
    throw new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { 'Content-Type': 'application/json' },
    });
  }
  return user;
}
