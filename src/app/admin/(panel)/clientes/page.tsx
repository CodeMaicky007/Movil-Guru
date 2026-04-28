import { requireUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  await requireUser(['admin','manager']);
  const supabase = createSupabaseServerClient();
  const since = new Date(); since.setFullYear(since.getFullYear() - 1);
  const { data: rows } = await supabase
    .from('reservations')
    .select('customer_name, phone, email, price, status')
    .gte('created_at', since.toISOString())
    .limit(5000);

  type Group = { name: string; phone: string|null; email: string|null; count: number; total: number };
  const map = new Map<string, Group>();
  (rows ?? []).forEach(r => {
    const key = r.email || r.phone || r.customer_name;
    const g = map.get(key) || { name: r.customer_name, phone: r.phone, email: r.email, count: 0, total: 0 };
    g.count += 1;
    g.total += r.status === 'completada' ? Number(r.price ?? 0) : 0;
    map.set(key, g);
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
            {list.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-neutral-500">Sin clientes todavía.</td></tr>
            )}
            {list.map(c => (
              <tr key={c.name + c.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 font-medium text-neutral-100">{c.name}</td>
                <td className="px-5 py-3.5 text-neutral-400">
                  <div>{c.email}</div>
                  <div className="text-xs text-neutral-500">{c.phone}</div>
                </td>
                <td className="px-5 py-3.5 text-right text-neutral-200">{c.count}</td>
                <td className="px-5 py-3.5 text-right font-medium text-neutral-100">{c.total.toFixed(0)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
