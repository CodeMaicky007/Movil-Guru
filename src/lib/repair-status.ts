// Estados reales de una reparación. Fuente de verdad para UI y APIs.
// El mismo set vive replicado en el CHECK de la migración 0002 — si añades
// un estado, actualiza los dos sitios.

export const REPAIR_STATUSES = [
  'recibido',
  'diagnostico',
  'reparando',
  'control',
  'listo',
  'cancelada',
] as const;

export type RepairStatus = (typeof REPAIR_STATUSES)[number];

export const REPAIR_STATUS_META: Record<RepairStatus, { label: string; dot: string }> = {
  recibido:    { label: 'Recibido',    dot: '#D4A84B' },
  diagnostico: { label: 'Diagnóstico', dot: '#D4A84B' },
  reparando:   { label: 'Reparando',   dot: '#4B7BD4' },
  control:     { label: 'Control QA',  dot: '#A06FD4' },
  listo:       { label: 'Listo',       dot: '#4BC48A' },
  cancelada:   { label: 'Cancelada',   dot: '#D46B6B' },
};

export const REPAIR_STATUS_LABEL: Record<RepairStatus, string> = Object.fromEntries(
  Object.entries(REPAIR_STATUS_META).map(([k, v]) => [k, v.label]),
) as Record<RepairStatus, string>;

// Estados que cuentan como "abiertos" (no cerrados ni cancelados).
export const OPEN_REPAIR_STATUSES: RepairStatus[] = ['recibido','diagnostico','reparando','control'];
export const TERMINAL_REPAIR_STATUSES: RepairStatus[] = ['listo','cancelada'];
