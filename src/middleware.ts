import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from './lib/supabase/middleware';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/admin/auth/callback']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi  = pathname.startsWith('/api/admin');
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // /admin/login es público; el endpoint de logout también.
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();
  if (pathname === '/api/admin/login') return NextResponse.next();

  const { supabase, res } = createSupabaseMiddlewareClient(req);
  // getSession lee la cookie sin llamar a Supabase (sin red).
  // La validación real la hace RLS + requireUser() en cada page/handler.
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
