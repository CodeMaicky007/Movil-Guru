'use client';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { SessionUser } from '@/lib/auth';

type Service = {
  id: string; nombre: string; descripcion: string | null;
  precio_base: number; duracion_min: number; activo: boolean;
};

export default function ServiciosClient({ me, initial }: { me: SessionUser; initial: Service[] }) {
  const [list, setList] = useState<Service[]>(initial);
  const [open, setOpen] = useState(false);
  const canWrite = me.role === 'admin';

  async function patch(id: string, body: Partial<Service>) {
    setList(prev => prev.map(s => s.id === id ? { ...s, ...body } as Service : s));
    await fetch(`/api/admin/services/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
  }
  async function remove(id: string) {
    if (!confirm('¿Eliminar servicio?')) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (res.ok) setList(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">{list.length} servicios</p>
        {canWrite && (
          <button onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white">
            <Plus size={14} /> Nuevo servicio
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
        <ul className="divide-y divide-white/5">
          {list.map(s => (
            <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <input
                    value={s.nombre}
                    onChange={e => setList(prev => prev.map(x => x.id === s.id ? { ...x, nombre: e.target.value } : x))}
                    onBlur={e => patch(s.id, { nombre: e.target.value })}
                    disabled={!canWrite}
                    className="bg-transparent text-sm font-medium text-neutral-100 outline-none disabled:opacity-100"
                  />
                  <button
                    onClick={() => canWrite && patch(s.id, { activo: !s.activo })}
                    className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest"
                    style={{ color: s.activo ? '#4BC48A' : '#888' }}
                  >
                    {s.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
                <input
                  value={s.descripcion ?? ''}
                  onChange={e => setList(prev => prev.map(x => x.id === s.id ? { ...x, descripcion: e.target.value } : x))}
                  onBlur={e => patch(s.id, { descripcion: e.target.value })}
                  disabled={!canWrite}
                  placeholder="Descripción"
                  className="mt-0.5 w-full bg-transparent text-xs text-neutral-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <label className="text-neutral-500">€</label>
                <input type="number" step="0.01" value={s.precio_base}
                  onChange={e => setList(prev => prev.map(x => x.id === s.id ? { ...x, precio_base: Number(e.target.value) } : x))}
                  onBlur={e => patch(s.id, { precio_base: Number(e.target.value) })}
                  disabled={!canWrite}
                  className="w-24 rounded-md border border-white/10 bg-[#0e0e10] px-2 py-1 text-right text-neutral-100" />
                <label className="text-neutral-500">min</label>
                <input type="number" value={s.duracion_min}
                  onChange={e => setList(prev => prev.map(x => x.id === s.id ? { ...x, duracion_min: Number(e.target.value) } : x))}
                  onBlur={e => patch(s.id, { duracion_min: Number(e.target.value) })}
                  disabled={!canWrite}
                  className="w-20 rounded-md border border-white/10 bg-[#0e0e10] px-2 py-1 text-right text-neutral-100" />
                {canWrite && (
                  <button onClick={() => remove(s.id)} className="text-neutral-500 transition hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </li>
          ))}
          {list.length === 0 && <li className="px-5 py-12 text-center text-sm text-neutral-500">Sin servicios.</li>}
        </ul>
      </div>

      {open && <NewServiceModal onClose={() => setOpen(false)} onCreated={s => { setList(prev => [...prev, s].sort((a,b) => a.nombre.localeCompare(b.nombre))); setOpen(false); }} />}
    </div>
  );
}

function NewServiceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (s: Service) => void }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [duracion, setDuracion] = useState(60);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/admin/services', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, precio_base: precio, duracion_min: duracion }),
    });
    setBusy(false);
    if (res.ok) { const { service } = await res.json(); onCreated(service); }
    else alert('Error al crear');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-white/8 bg-[#111113] p-6">
        <h2 className="text-sm font-semibold text-neutral-100">Nuevo servicio</h2>
        <label className="mt-4 block text-xs font-medium text-neutral-400">Nombre</label>
        <input required value={nombre} onChange={e => setNombre(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100 outline-none focus:border-[#4B7BD4]" />
        <label className="mt-3 block text-xs font-medium text-neutral-400">Descripción</label>
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100 outline-none focus:border-[#4B7BD4]" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400">Precio (€)</label>
            <input type="number" step="0.01" value={precio} onChange={e => setPrecio(Number(e.target.value))}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400">Duración (min)</label>
            <input type="number" value={duracion} onChange={e => setDuracion(Number(e.target.value))}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-100">Cancelar</button>
          <button type="submit" disabled={busy} className="rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 hover:bg-white disabled:opacity-40">
            {busy ? 'Creando…' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}
