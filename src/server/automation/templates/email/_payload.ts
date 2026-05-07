// Forma del payload que los handlers inyectan en las notificaciones de email.
// Todos los templates de reparación lo consumen.

export type RepairEmailPayload = {
  code: string;
  customer_name: string;
  device: string;
  store_name?: string | null;
  technician_name?: string | null;
  tracking_url: string;
  // opcionales según template
  scheduled_for?: string | null;
  price?: number | null;
};

export function readRepairPayload(p: Record<string, unknown>): RepairEmailPayload {
  return {
    code: String(p.code ?? ''),
    customer_name: String(p.customer_name ?? 'Cliente'),
    device: String(p.device ?? ''),
    store_name: (p.store_name as string | null | undefined) ?? null,
    technician_name: (p.technician_name as string | null | undefined) ?? null,
    tracking_url: String(p.tracking_url ?? 'https://movilguru.com/track'),
    scheduled_for: (p.scheduled_for as string | null | undefined) ?? null,
    price: typeof p.price === 'number' ? p.price : null,
  };
}

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
