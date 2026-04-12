'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/admin';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({ error: 'Error' }));
      setError(data.error || 'Error');
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-lg border border-white/8 bg-[#111113] p-8"
    >
      <div className="mb-6 flex items-center gap-2.5">
        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#0038FF] to-[#4B7BD4]" />
        <span className="text-sm font-semibold tracking-tight">Movil Guru</span>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-widest text-neutral-500">
          Admin
        </span>
      </div>

      <h1 className="text-lg font-semibold tracking-tight text-neutral-50">Iniciar sesión</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Introduce la contraseña de administrador.
      </p>

      <label className="mt-6 block text-xs font-medium text-neutral-400">
        Contraseña
      </label>
      <input
        type="password"
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-white/10 bg-[#0e0e10] px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-[#4B7BD4]"
      />

      {error && (
        <p className="mt-3 text-xs text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="mt-6 w-full rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-white disabled:opacity-40"
      >
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0b0b0d] px-6 text-neutral-200">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
