'use client';
import { useEffect, useState } from 'react';
import { Play, Square } from 'lucide-react';
import type { SessionUser } from '@/lib/auth';

type Entry = {
  id: string; clock_in: string; clock_out: string | null;
  break_minutes: number; note: string | null;
};

function fmtDuration(ms: number) {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2,'0')}m`;
}

export default function FichajeClient({
  me, initialOpen, initialRecent,
}: { me: SessionUser; initialOpen: Entry | null; initialRecent: Entry[] }) {
  const [open, setOpen] = useState<Entry | null>(initialOpen);
  const [recent, setRecent] = useState<Entry[]>(initialRecent);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [breakMin, setBreakMin] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [open]);

  async function clockIn() {
    setBusy(true);
    const res = await fetch('/api/admin/time-entries/clock-in', { method: 'POST' });
    setBusy(false);
    if (res.ok) {
      const { entry } = await res.json();
      setOpen(entry);
    } else alert('Error al fichar entrada');
  }

  async function clockOut() {
    setBusy(true);
    const res = await fetch('/api/admin/time-entries/clock-out', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ break_minutes: breakMin, note: note || null }),
    });
    setBusy(false);
    if (res.ok) {
      const { entry } = await res.json();
      setOpen(null);
      setRecent(prev => [entry, ...prev]);
      setBreakMin(0); setNote('');
    } else alert('Error al fichar salida');
  }

  const totalToday = recent
    .filter(e => e.clock_out && new Date(e.clock_in).toDateString() === new Date().toDateString())
    .reduce((s, e) => s + (new Date(e.clock_out!).getTime() - new Date(e.clock_in).getTime() - e.break_minutes * 60_000), 0)
    + (open ? now - new Date(open.clock_in).getTime() : 0);

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-white/8 bg-[#111113] p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Hola, {me.full_name?.split(' ')[0] ?? 'compañero'}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-50">
              {open ? 'Estás trabajando' : 'No has fichado'}
            </h2>
            {open ? (
              <p className="mt-2 text-sm text-neutral-400">
                Entrada: {new Date(open.clock_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} ·{' '}
                <span className="font-mono text-neutral-200">{fmtDuration(now - new Date(open.clock_in).getTime())}</span>
              </p>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">Pulsa entrada cuando empieces tu jornada.</p>
            )}
          </div>

          {!open ? (
            <button onClick={clockIn} disabled={busy}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-40">
              <Play size={16} /> Fichar entrada
            </button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-xs">
                <label className="text-neutral-500">Pausa (min)</label>
                <input type="number" min={0} value={breakMin} onChange={e => setBreakMin(Number(e.target.value))}
                  className="w-20 rounded-md border border-white/10 bg-[#0e0e10] px-2 py-1 text-neutral-100" />
              </div>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Nota (opcional)"
                className="w-64 rounded-md border border-white/10 bg-[#0e0e10] px-3 py-1.5 text-xs text-neutral-100" />
              <button onClick={clockOut} disabled={busy}
                className="inline-flex items-center gap-2 rounded-md bg-rose-500 px-5 py-3 text-sm font-medium text-rose-950 transition hover:bg-rose-400 disabled:opacity-40">
                <Square size={16} /> Fichar salida
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
          <div>
            <p className="text-xs text-neutral-500">Total hoy</p>
            <p className="mt-1 font-mono text-lg text-neutral-100">{fmtDuration(totalToday)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Estado</p>
            <p className="mt-1 text-sm text-neutral-300">{open ? 'Trabajando' : 'Fuera'}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-neutral-200">Historial reciente</h3>
        <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left text-xs font-medium text-neutral-500">
                <th className="px-5 py-3">Día</th>
                <th className="px-5 py-3">Entrada</th>
                <th className="px-5 py-3">Salida</th>
                <th className="px-5 py-3 text-right">Pausas</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-neutral-500">Sin fichajes registrados.</td></tr>
              )}
              {recent.map(e => {
                const ms = e.clock_out
                  ? new Date(e.clock_out).getTime() - new Date(e.clock_in).getTime() - e.break_minutes * 60_000
                  : 0;
                return (
                  <tr key={e.id} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3 text-neutral-300">
                      {new Date(e.clock_in).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-5 py-3 text-neutral-400">{new Date(e.clock_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-5 py-3 text-neutral-400">
                      {e.clock_out ? new Date(e.clock_out).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right text-neutral-400">{e.break_minutes}m</td>
                    <td className="px-5 py-3 text-right font-mono text-neutral-100">{e.clock_out ? fmtDuration(ms) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
