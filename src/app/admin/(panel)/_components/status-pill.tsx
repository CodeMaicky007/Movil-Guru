import { REPAIR_STATUS_META } from '@/lib/repair-status';

export default function StatusPill({ status }: { status: string }) {
  const m = REPAIR_STATUS_META[status as keyof typeof REPAIR_STATUS_META]
    ?? { label: status, dot: '#888' };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}
