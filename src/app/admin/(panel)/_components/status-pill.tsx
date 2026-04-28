const META: Record<string, { label: string; dot: string }> = {
  pendiente:  { label: 'Pendiente',  dot: '#D4A84B' },
  en_curso:   { label: 'En curso',   dot: '#4B7BD4' },
  completada: { label: 'Completada', dot: '#4BC48A' },
  cancelada:  { label: 'Cancelada',  dot: '#D46B6B' },
};

export default function StatusPill({ status }: { status: string }) {
  const m = META[status] ?? { label: status, dot: '#888' };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}
