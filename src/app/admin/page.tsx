'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarClock,
  Wrench,
  Users,
  LogOut,
  Search,
  TrendingUp,
  Euro,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { reservations, type Reservation, type ReservationStatus } from './_data/mock';

const brandLogo = (device: string) => {
  if (/iphone/i.test(device))  return '/images/Apple.png';
  if (/samsung|galaxy/i.test(device)) return '/images/Samsung.png';
  if (/xiaomi|redmi|poco/i.test(device)) return '/images/Xiaomi.png';
  if (/pixel/i.test(device))   return '/images/GooglePixel.png';
  if (/huawei/i.test(device))  return '/images/huawei.png';
  if (/oneplus/i.test(device)) return '/images/oneplus.png';
  if (/motorola|moto/i.test(device)) return '/images/motorola.png';
  return null;
};

const statusMeta: Record<ReservationStatus, { label: string; dot: string }> = {
  pendiente:  { label: 'Pendiente',  dot: '#D4A84B' },
  en_curso:   { label: 'En curso',   dot: '#4B7BD4' },
  completada: { label: 'Completada', dot: '#4BC48A' },
  cancelada:  { label: 'Cancelada',  dot: '#D46B6B' },
};

type Tab = 'resumen' | 'reservas' | 'servicios' | 'clientes';

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('resumen');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ReservationStatus | 'todas'>('todas');
  const [rows, setRows] = useState<Reservation[]>(reservations);

  const stats = useMemo(() => {
    const total = rows.length;
    const ingresos = rows.filter(r => r.status === 'completada').reduce((s, r) => s + r.price, 0);
    const pendientes = rows.filter(r => r.status === 'pendiente').length;
    const enCurso = rows.filter(r => r.status === 'en_curso').length;
    return { total, ingresos, pendientes, enCurso };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (filter !== 'todas' && r.status !== filter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.customer.toLowerCase().includes(q) ||
        r.device.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, query]);

  function updateStatus(id: string, status: ReservationStatus) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  const titles: Record<Tab, string> = {
    resumen: 'Resumen',
    reservas: 'Reservas',
    servicios: 'Servicios',
    clientes: 'Clientes',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0b0d] text-neutral-200">
      {/* Sidebar */}
      <aside className="flex h-full w-60 shrink-0 flex-col border-r border-white/5 bg-[#0e0e10]">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#0038FF] to-[#4B7BD4]" />
          <span className="text-sm font-semibold tracking-tight">Movil Guru</span>
          <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-neutral-500">
            Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          <NavBtn icon={<LayoutDashboard size={15} />} active={tab==='resumen'}   onClick={() => setTab('resumen')}  >Resumen</NavBtn>
          <NavBtn icon={<CalendarClock size={15} />}   active={tab==='reservas'}  onClick={() => setTab('reservas')} >Reservas</NavBtn>
          <NavBtn icon={<Wrench size={15} />}          active={tab==='servicios'} onClick={() => setTab('servicios')}>Servicios</NavBtn>
          <NavBtn icon={<Users size={15} />}           active={tab==='clientes'}  onClick={() => setTab('clientes')} >Clientes</NavBtn>
        </nav>

        <div className="border-t border-white/5 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-neutral-400 transition hover:bg-white/[0.04] hover:text-neutral-100"
          >
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-8">
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">{titles[tab]}</h1>
            <p className="text-xs text-neutral-500">
              {tab === 'resumen' && 'Vista general de la actividad'}
              {tab === 'reservas' && `${filtered.length} de ${rows.length} registros`}
              {tab === 'servicios' && 'Catálogo de reparaciones'}
              {tab === 'clientes' && 'Historial agrupado por cliente'}
            </p>
          </div>
          <div className="text-xs text-neutral-500">12 abr 2026</div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {tab === 'resumen' && <ResumenTab stats={stats} rows={rows} />}
          {tab === 'reservas' && (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="relative min-w-[260px] flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Buscar…"
                    className="w-full rounded-md border border-white/8 bg-[#111113] py-2 pl-9 pr-3 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none transition focus:border-[#4B7BD4]"
                  />
                </div>
                <div className="flex gap-0.5 rounded-md border border-white/8 bg-[#111113] p-0.5">
                  {(['todas','pendiente','en_curso','completada','cancelada'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className="rounded px-2.5 py-1.5 text-xs font-medium transition"
                      style={{
                        background: filter === s ? 'rgba(255,255,255,0.06)' : 'transparent',
                        color: filter === s ? '#f5f5f5' : '#8a8a90',
                      }}
                    >
                      {s === 'todas' ? 'Todas' : statusMeta[s].label}
                    </button>
                  ))}
                </div>
              </div>
              <ReservationsTable rows={filtered} onStatus={updateStatus} />
            </>
          )}
          {tab === 'servicios' && <ServiciosTab />}
          {tab === 'clientes' && <ClientesTab rows={rows} />}
        </div>
      </main>
    </div>
  );
}

function NavBtn({ children, icon, active, onClick }: { children: React.ReactNode; icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition"
      style={{
        background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: active ? '#f5f5f5' : '#8a8a90',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-[#111113] p-5">
      <div className="flex items-center justify-between text-neutral-500">
        <span className="text-xs font-medium">{label}</span>
        <span>{icon}</span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-neutral-50">{value}</div>
      {sub && <div className="mt-1 text-xs text-neutral-500">{sub}</div>}
    </div>
  );
}

function ResumenTab({ stats, rows }: { stats: { total: number; ingresos: number; pendientes: number; enCurso: number }; rows: Reservation[] }) {
  const recent = rows.slice(0, 6);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<TrendingUp size={14} />}   label="Reservas totales" value={String(stats.total)} sub="Histórico" />
        <StatCard icon={<Euro size={14} />}         label="Ingresos"         value={`${stats.ingresos} €`} sub="Completadas" />
        <StatCard icon={<Clock size={14} />}        label="Pendientes"       value={String(stats.pendientes)} />
        <StatCard icon={<CheckCircle2 size={14} />} label="En curso"         value={String(stats.enCurso)} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-200">Actividad reciente</h2>
          <span className="text-xs text-neutral-500">Últimas 6</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
          <ul className="divide-y divide-white/5">
            {recent.map(r => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-[11px] font-medium text-neutral-400">
                    {r.customer.split(' ').map(p => p[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-100">{r.customer}</div>
                    <div className="text-xs text-neutral-500">{r.device} · {r.service}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-neutral-500">{r.date}</span>
                  <StatusPill status={r.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function ReservationsTable({ rows, onStatus }: { rows: Reservation[]; onStatus: (id: string, s: ReservationStatus) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs font-medium text-neutral-500">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Dispositivo</th>
              <th className="px-5 py-3">Servicio</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3 text-right">Importe</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-neutral-500">Sin resultados.</td></tr>
            )}
            {rows.map(r => (
              <tr key={r.id} className="border-b border-white/5 last:border-0 transition hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{r.id}</td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-neutral-100">{r.customer}</div>
                  <div className="text-xs text-neutral-500">{r.phone}</div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {brandLogo(r.device) && (
                      <img src={brandLogo(r.device)!} alt="" className="h-4 w-4 object-contain opacity-70" />
                    )}
                    <span className="text-neutral-300">{r.device}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-neutral-300">{r.service}</td>
                <td className="px-5 py-3.5 text-neutral-500">{r.date}</td>
                <td className="px-5 py-3.5 text-right font-medium text-neutral-100">{r.price} €</td>
                <td className="px-5 py-3.5">
                  <select
                    value={r.status}
                    onChange={e => onStatus(r.id, e.target.value as ReservationStatus)}
                    className="rounded border border-white/10 bg-[#0e0e10] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-[#4B7BD4]"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_curso">En curso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ReservationStatus }) {
  const m = statusMeta[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

function ServiciosTab() {
  const items = [
    'Pantalla rota','Batería','Daño por agua','Cámara','Plegables','Recuperación de datos','Puerto de carga','Placa base',
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
      <ul className="divide-y divide-white/5">
        {items.map(s => (
          <li key={s} className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-medium text-neutral-100">{s}</div>
              <div className="text-xs text-neutral-500">Activo · precio dinámico</div>
            </div>
            <button className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/25 hover:text-neutral-100">
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClientesTab({ rows }: { rows: Reservation[] }) {
  const map = new Map<string, { name: string; phone: string; email: string; count: number; total: number }>();
  rows.forEach(r => {
    const cur = map.get(r.email) || { name: r.customer, phone: r.phone, email: r.email, count: 0, total: 0 };
    cur.count += 1;
    cur.total += r.status === 'completada' ? r.price : 0;
    map.set(r.email, cur);
  });
  const list = Array.from(map.values()).sort((a, b) => b.count - a.count);
  return (
    <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs font-medium text-neutral-500">
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Contacto</th>
              <th className="px-5 py-3 text-right">Reservas</th>
              <th className="px-5 py-3 text-right">Total gastado</th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-medium text-neutral-100">{c.name}</td>
                <td className="px-5 py-3.5 text-neutral-400">
                  <div>{c.email}</div>
                  <div className="text-xs text-neutral-500">{c.phone}</div>
                </td>
                <td className="px-5 py-3.5 text-right text-neutral-200">{c.count}</td>
                <td className="px-5 py-3.5 text-right font-medium text-neutral-100">{c.total} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
