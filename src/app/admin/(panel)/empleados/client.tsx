'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Trash2 } from 'lucide-react';
import type { SessionUser, Role } from '@/lib/auth';

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  store_id: string | null;
  active: boolean;
  created_at: string;
};
type Tienda = { id: string; nombre: string };

export default function EmpleadosClient({
  me, initialUsers, tiendas,
}: { me: SessionUser; initialUsers: Profile[]; tiendas: Tienda[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Role>('tecnico');
  const [storeId, setStoreId] = useState<string>(me.store_id ?? tiendas[0]?.id ?? '');

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name: fullName, role, store_id: storeId || null }),
    });
    setBusy(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Error al invitar');
      return;
    }
    setOpen(false); setEmail(''); setFullName('');
    router.refresh();
  }

  async function patch(id: string, body: Partial<Profile>) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setUsers(u => u.map(p => p.id === id ? { ...p, ...body } as Profile : p));
  }

  async function remove(id: string) {
    if (!confirm('¿Eliminar este empleado? Esta acción no se puede deshacer.')) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers(u => u.filter(p => p.id !== id));
  }

  const tiendasMap = new Map(tiendas.map(t => [t.id, t.nombre]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">{users.length} empleados</p>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white"
        >
          <UserPlus size={14} /> Invitar empleado
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs font-medium text-neutral-500">
              <th className="px-5 py-3">Empleado</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Tienda</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-neutral-500">Sin empleados.</td></tr>
            )}
            {users.map(u => (
              <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-neutral-100">{u.full_name || '—'}</div>
                  <div className="text-xs text-neutral-500">{u.email}</div>
                </td>
                <td className="px-5 py-3.5">
                  {me.role === 'admin' && u.id !== me.id ? (
                    <select
                      value={u.role}
                      onChange={e => patch(u.id, { role: e.target.value as Role })}
                      className="rounded border border-white/10 bg-[#0e0e10] px-2 py-1 text-xs text-neutral-200"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="tecnico">Técnico</option>
                    </select>
                  ) : (
                    <span className="text-xs text-neutral-300">{u.role}</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-xs text-neutral-400">
                  {me.role === 'admin' ? (
                    <select
                      value={u.store_id ?? ''}
                      onChange={e => patch(u.id, { store_id: e.target.value || null })}
                      className="rounded border border-white/10 bg-[#0e0e10] px-2 py-1 text-xs text-neutral-200"
                    >
                      <option value="">—</option>
                      {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                  ) : (u.store_id ? tiendasMap.get(u.store_id) : '—')}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => patch(u.id, { active: !u.active })}
                    className="rounded border border-white/10 px-2 py-1 text-xs"
                    style={{ color: u.active ? '#4BC48A' : '#D46B6B' }}
                  >
                    {u.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right">
                  {me.role === 'admin' && u.id !== me.id && (
                    <button
                      onClick={() => remove(u.id)}
                      className="text-neutral-500 transition hover:text-red-400"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <form
            onSubmit={invite}
            className="w-full max-w-sm rounded-lg border border-white/8 bg-[#111113] p-6"
          >
            <h2 className="text-sm font-semibold text-neutral-100">Invitar empleado</h2>
            <p className="mt-1 text-xs text-neutral-500">Recibirá un email para fijar su contraseña.</p>

            <label className="mt-4 block text-xs font-medium text-neutral-400">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100 outline-none focus:border-[#4B7BD4]" />

            <label className="mt-3 block text-xs font-medium text-neutral-400">Nombre completo</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100 outline-none focus:border-[#4B7BD4]" />

            <label className="mt-3 block text-xs font-medium text-neutral-400">Rol</label>
            <select value={role} onChange={e => setRole(e.target.value as Role)}
              disabled={me.role === 'manager'}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100">
              {me.role === 'admin' && <option value="admin">Admin</option>}
              {me.role === 'admin' && <option value="manager">Manager</option>}
              <option value="tecnico">Técnico</option>
            </select>

            <label className="mt-3 block text-xs font-medium text-neutral-400">Tienda</label>
            <select value={storeId} onChange={e => setStoreId(e.target.value)}
              disabled={me.role === 'manager'}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100">
              <option value="">—</option>
              {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>

            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:text-neutral-100">
                Cancelar
              </button>
              <button type="submit" disabled={busy} className="rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white disabled:opacity-40">
                {busy ? 'Enviando…' : 'Enviar invitación'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
