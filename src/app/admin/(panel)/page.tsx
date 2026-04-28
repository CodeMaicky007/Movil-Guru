import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { TrendingUp, Euro, Clock, CheckCircle2 } from 'lucide-react';
import StatusPill from './_components/status-pill';

export const dynamic = 'force-dynamic';

function startOfMonth() {
  const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d;
}
function startOfWeek() {
  const d = new Date(); const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day); d.setHours(0,0,0,0); return d;
}

export default async function ResumenPage() {
  const me = await requireUser(['admin','manager']);
  const supabase = createSupabaseServerClient();

  const monthStart = startOfMonth().toISOString();
  const weekStart  = startOfWeek().toISOString();

  // Queries paralelas y acotadas. Los counts no devuelven filas (head:true).
  const [
    totalCount, pendientesCount, enCursoCount,
    monthRowsRes, recentRes, tiendasRes, tecnicosRes, shiftsRes,
  ] = await Promise.all([
    supabase.from('reservations').select('*', { count: 'exact', head: true }),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status','pendiente'),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status','en_curso'),

    // Sólo lo necesario para ranking + ingresos del mes.
    supabase.from('reservations')
      .select('price, store_id, technician_id, status')
      .gte('created_at', monthStart),

    // Actividad reciente.
    supabase.from('reservations')
      .select('id, customer_name, device, status, services(nombre)')
      .order('created_at', { ascending: false })
      .limit(6),

    supabase.from('tiendas').select('id, nombre'),
    supabase.from('profiles').select('id, full_name, email').eq('role','tecnico').eq('active', true),

    supabase.from('time_entries')
      .select('profile_id, clock_in, clock_out, break_minutes')
      .gte('clock_in', weekStart),
  ]);

  const total      = totalCount.count ?? 0;
  const pendientes = pendientesCount.count ?? 0;
  const enCurso    = enCursoCount.count ?? 0;
  const monthList  = monthRowsRes.data ?? [];
  const recent     = recentRes.data ?? [];
  const tiendas    = tiendasRes.data ?? [];
  const tecnicos   = tecnicosRes.data ?? [];
  const shifts     = shiftsRes.data ?? [];

  let ingresos = 0;
  const techMap  = new Map<string, { reps: number; revenue: number }>();
  const storeMap = new Map<string, number>();
  for (const r of monthList) {
    if (r.status !== 'completada') continue;
    const price = Number(r.price ?? 0);
    ingresos += price;
    if (r.technician_id) {
      const cur = techMap.get(r.technician_id) ?? { reps: 0, revenue: 0 };
      cur.reps += 1; cur.revenue += price;
      techMap.set(r.technician_id, cur);
    }
    if (r.store_id) storeMap.set(r.store_id, (storeMap.get(r.store_id) ?? 0) + price);
  }

  const topTechs = tecnicos
    .map(t => ({ ...t, ...(techMap.get(t.id) ?? { reps: 0, revenue: 0 }) }))
    .sort((a, b) => b.reps - a.reps).slice(0, 5);

  const tiendasIngreso = tiendas
    .map(t => ({ nombre: t.nombre, total: storeMap.get(t.id) ?? 0 }))
    .sort((a, b) => b.total - a.total);

  const hoursMap = new Map<string, number>();
  for (const e of shifts) {
    if (!e.clock_out) continue;
    const ms = new Date(e.clock_out).getTime() - new Date(e.clock_in).getTime() - (e.break_minutes ?? 0) * 60_000;
    hoursMap.set(e.profile_id, (hoursMap.get(e.profile_id) ?? 0) + ms);
  }
  const horas = tecnicos
    .map(t => ({ nombre: t.full_name || t.email, horas: (hoursMap.get(t.id) ?? 0) / 3600_000 }))
    .filter(h => h.horas > 0)
    .sort((a, b) => b.horas - a.horas).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={<TrendingUp size={14} />}   label="Reservas totales" value={String(total)} sub="Histórico" />
        <StatCard icon={<Euro size={14} />}         label="Ingresos del mes" value={`${ingresos.toFixed(0)} €`} sub="Completadas" />
        <StatCard icon={<Clock size={14} />}        label="Pendientes"       value={String(pendientes)} />
        <StatCard icon={<CheckCircle2 size={14} />} label="En curso"         value={String(enCurso)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top técnicos (este mes)" subtitle="Por reparaciones completadas">
          {topTechs.length === 0 ? <Empty>Sin datos todavía.</Empty> : (
            <ul className="divide-y divide-white/5">
              {topTechs.map((t, i) => (
                <li key={t.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-4 font-mono text-xs text-neutral-500">{i + 1}</span>
                    <span className="text-neutral-100">{t.full_name || t.email}</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <span className="text-neutral-400">{t.reps} reparaciones</span>
                    <span className="font-medium text-neutral-100">{t.revenue.toFixed(0)} €</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Ingresos por tienda" subtitle="Mes en curso">
          {tiendasIngreso.length === 0 ? <Empty>Sin tiendas.</Empty> : (
            <ul className="divide-y divide-white/5">
              {tiendasIngreso.map(t => {
                const max = Math.max(...tiendasIngreso.map(x => x.total), 1);
                const pct = (t.total / max) * 100;
                return (
                  <li key={t.nombre} className="px-5 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-100">{t.nombre}</span>
                      <span className="font-medium text-neutral-100">{t.total.toFixed(0)} €</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-white/5">
                      <div className="h-1 rounded-full bg-[#4B7BD4]" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Horas esta semana" subtitle="Top técnicos por horas fichadas">
          {horas.length === 0 ? <Empty>Sin fichajes esta semana.</Empty> : (
            <ul className="divide-y divide-white/5">
              {horas.map(h => (
                <li key={h.nombre} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-neutral-100">{h.nombre}</span>
                  <span className="font-mono text-neutral-100">{h.horas.toFixed(1)} h</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Actividad reciente" subtitle="Últimas 6 reservas">
          {recent.length === 0 ? <Empty>Sin actividad todavía.</Empty> : (
            <ul className="divide-y divide-white/5">
              {recent.map((r: any) => (
                <li key={r.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <div className="font-medium text-neutral-100">{r.customer_name}</div>
                    <div className="text-xs text-neutral-500">{r.device} · {r.services?.nombre ?? '—'}</div>
                  </div>
                  <StatusPill status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <p className="text-[11px] text-neutral-600">Sesión de {me.full_name || me.email} · {me.role}</p>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-[#111113] p-5">
      <div className="flex items-center justify-between text-neutral-500">
        <span className="text-xs font-medium">{label}</span>{icon}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-neutral-50">{value}</div>
      {sub && <div className="mt-1 text-xs text-neutral-500">{sub}</div>}
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
      <header className="flex items-baseline justify-between border-b border-white/5 px-5 py-3">
        <h3 className="text-sm font-semibold text-neutral-200">{title}</h3>
        {subtitle && <span className="text-xs text-neutral-500">{subtitle}</span>}
      </header>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-10 text-center text-xs text-neutral-500">{children}</div>;
}
