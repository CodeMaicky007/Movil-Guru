'use client';
import { useMemo, useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import StatusPill from '../_components/status-pill';
import type { SessionUser } from '@/lib/auth';

type Status = 'pendiente'|'en_curso'|'completada'|'cancelada';
type Reservation = {
  id: string; code: string; customer_name: string; phone: string|null; email: string|null;
  device: string; service_id: string|null; store_id: string|null; technician_id: string|null;
  scheduled_for: string|null; price: number; status: Status;
  services: { nombre: string } | null;
};
type Service = { id: string; nombre: string; precio_base: number };
type Tienda = { id: string; nombre: string };
type Tecnico = { id: string; full_name: string|null; email: string; store_id: string|null };

const STATUS_LABEL: Record<Status, string> = {
  pendiente: 'Pendiente', en_curso: 'En curso', completada: 'Completada', cancelada: 'Cancelada',
};

function brandLogo(device: string) {
  if (/iphone/i.test(device))  return '/images/Apple.png';
  if (/samsung|galaxy/i.test(device)) return '/images/Samsung.png';
  if (/xiaomi|redmi|poco/i.test(device)) return '/images/Xiaomi.png';
  if (/pixel/i.test(device))   return '/images/GooglePixel.png';
  if (/huawei/i.test(device))  return '/images/huawei.png';
  if (/oneplus/i.test(device)) return '/images/oneplus.png';
  if (/motorola|moto/i.test(device)) return '/images/motorola.png';
  return null;
}

export default function ReservasClient({
  me, initialRows, services, tiendas, tecnicos,
}: {
  me: SessionUser;
  initialRows: Reservation[];
  services: Service[];
  tiendas: Tienda[];
  tecnicos: Tecnico[];
}) {
  const [rows, setRows] = useState<Reservation[]>(initialRows);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Status | 'todas'>('todas');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => rows.filter(r => {
    if (filter !== 'todas' && r.status !== filter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return [r.customer_name, r.device, r.code, r.services?.nombre ?? '', r.email ?? '', r.phone ?? '']
      .some(v => v.toLowerCase().includes(q));
  }), [rows, filter, query]);

  async function patch(id: string, body: Partial<Reservation>) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...body } as Reservation : r));
    const res = await fetch(`/api/admin/reservations/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!res.ok) {
      // revert
      setRows(initialRows);
      alert('Error al guardar');
    }
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar reserva?')) return;
    const res = await fetch(`/api/admin/reservations/${id}`, { method: 'DELETE' });
    if (res.ok) setRows(prev => prev.filter(r => r.id !== id));
  }

  const canEdit = me.role !== 'tecnico';
  const tecnicosVisibles = me.role === 'manager'
    ? tecnicos.filter(t => t.store_id === me.store_id)
    : tecnicos;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px] flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por cliente, dispositivo, código…"
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
              {s === 'todas' ? 'Todas' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        {canEdit && (
          <button
            onClick={() => setOpen(true)}
            className="ml-auto inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white"
          >
            <Plus size={14} /> Nueva reserva
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left text-xs font-medium text-neutral-500">
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Dispositivo</th>
                <th className="px-5 py-3">Servicio</th>
                <th className="px-5 py-3">Técnico</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3 text-right">Importe</th>
                <th className="px-5 py-3">Estado</th>
                {canEdit && <th className="px-5 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={canEdit ? 9 : 8} className="px-5 py-12 text-center text-neutral-500">Sin resultados.</td></tr>
              )}
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/5 last:border-0 transition hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{r.code}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-neutral-100">{r.customer_name}</div>
                    <div className="text-xs text-neutral-500">{r.phone}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {brandLogo(r.device) && <img src={brandLogo(r.device)!} alt="" className="h-4 w-4 object-contain opacity-70" />}
                      <span className="text-neutral-300">{r.device}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-300">{r.services?.nombre ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    {canEdit ? (
                      <select
                        value={r.technician_id ?? ''}
                        onChange={e => patch(r.id, { technician_id: e.target.value || null })}
                        className="rounded border border-white/10 bg-[#0e0e10] px-2 py-1 text-xs text-neutral-200"
                      >
                        <option value="">Sin asignar</option>
                        {tecnicosVisibles.map(t => (
                          <option key={t.id} value={t.id}>{t.full_name || t.email}</option>
                        ))}
                      </select>
                    ) : <span className="text-xs text-neutral-400">{tecnicos.find(t => t.id === r.technician_id)?.full_name ?? '—'}</span>}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-500">
                    {r.scheduled_for ? new Date(r.scheduled_for).toLocaleDateString('es-ES') : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-neutral-100">{Number(r.price).toFixed(0)} €</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={r.status}
                      onChange={e => patch(r.id, { status: e.target.value as Status })}
                      className="rounded border border-white/10 bg-[#0e0e10] px-2 py-1 text-xs text-neutral-200 outline-none focus:border-[#4B7BD4]"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_curso">En curso</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </td>
                  {canEdit && (
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => remove(r.id)} className="text-neutral-500 transition hover:text-red-400" aria-label="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <NewReservationModal
          me={me} services={services} tiendas={tiendas}
          onClose={() => setOpen(false)}
          onCreated={(r) => { setRows(prev => [r, ...prev]); setOpen(false); }}
        />
      )}
    </div>
  );
}

function NewReservationModal({
  me, services, tiendas, onClose, onCreated,
}: {
  me: SessionUser; services: Service[]; tiendas: Tienda[];
  onClose: () => void; onCreated: (r: Reservation) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customer_name: '', phone: '', email: '', device: '',
    service_id: services[0]?.id ?? '',
    store_id: me.store_id ?? tiendas[0]?.id ?? '',
    scheduled_for: '',
    price: services[0]?.precio_base ?? 0,
    notes: '',
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    const res = await fetch('/api/admin/reservations', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || 'Error'); return; }
    const { reservation } = await res.json();
    const svc = services.find(s => s.id === reservation.service_id);
    onCreated({ ...reservation, services: svc ? { nombre: svc.nombre } : null });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-white/8 bg-[#111113] p-6">
        <h2 className="text-sm font-semibold text-neutral-100">Nueva reserva</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Cliente" required value={form.customer_name} onChange={v => setForm({ ...form, customer_name: v })} />
          <Field label="Teléfono" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
          <Field label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <Field label="Dispositivo" required value={form.device} onChange={v => setForm({ ...form, device: v })} />

          <div>
            <label className="block text-xs font-medium text-neutral-400">Servicio</label>
            <select value={form.service_id} onChange={e => {
              const s = services.find(x => x.id === e.target.value);
              setForm({ ...form, service_id: e.target.value, price: s?.precio_base ?? form.price });
            }} className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100">
              {services.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400">Tienda</label>
            <select value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })}
              disabled={me.role === 'manager'}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100">
              {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>

          <Field label="Fecha programada" type="datetime-local" value={form.scheduled_for} onChange={v => setForm({ ...form, scheduled_for: v })} />
          <Field label="Importe (€)" type="number" value={String(form.price)} onChange={v => setForm({ ...form, price: Number(v) })} />
        </div>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:text-neutral-100">Cancelar</button>
          <button type="submit" disabled={busy} className="rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white disabled:opacity-40">
            {busy ? 'Creando…' : 'Crear reserva'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-400">{label}</label>
      <input type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100 outline-none focus:border-[#4B7BD4]" />
    </div>
  );
}
