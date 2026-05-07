'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarClock, Wrench, Users, LogOut, Clock, UserCog, Activity,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SessionUser } from '@/lib/auth';

type Item = { href: string; label: string; icon: React.ReactNode; roles?: SessionUser['role'][] };

const ITEMS: Item[] = [
  { href: '/admin',           label: 'Resumen',   icon: <LayoutDashboard size={15} />, roles: ['admin','manager'] },
  { href: '/admin/reservas',  label: 'Reservas',  icon: <CalendarClock size={15} /> },
  { href: '/admin/servicios', label: 'Servicios', icon: <Wrench size={15} />,          roles: ['admin','manager'] },
  { href: '/admin/clientes',  label: 'Clientes',  icon: <Users size={15} />,           roles: ['admin','manager'] },
  { href: '/admin/empleados', label: 'Empleados', icon: <UserCog size={15} />,         roles: ['admin','manager'] },
  { href: '/admin/automatizaciones', label: 'Automatización', icon: <Activity size={15} />, roles: ['admin'] },
  { href: '/admin/fichaje',   label: 'Fichaje',   icon: <Clock size={15} /> },
];

export default function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  const items = ITEMS.filter(i => !i.roles || i.roles.includes(user.role));
  const active = items.find(i => i.href === pathname || (i.href !== '/admin' && pathname.startsWith(i.href)));
  const title = active?.label ?? 'Admin';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0b0d] text-neutral-200">
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-white/5 bg-[#0e0e10]">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#0038FF] to-[#4B7BD4]" />
          <span className="text-sm font-semibold tracking-tight">Movil Guru</span>
          <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-neutral-500">Admin</span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {items.map(it => {
            const isActive = it.href === pathname || (it.href !== '/admin' && pathname.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: isActive ? '#f5f5f5' : '#8a8a90',
                }}
              >
                {it.icon}{it.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="mb-2 px-3 text-[11px] text-neutral-500">
            <div className="truncate text-neutral-300">{user.full_name || user.email}</div>
            <div className="text-[10px] uppercase tracking-widest">{user.role}</div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-neutral-400 transition hover:bg-white/[0.04] hover:text-neutral-100"
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-8">
          <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>
          <div className="text-xs text-neutral-500">
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
