'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, Mail, AlertTriangle, Clock, CheckCircle2, Send, RotateCw,
  X, ChevronRight, Zap, MailX,
} from 'lucide-react';

// ─── tipos ──────────────────────────────────────────────────────────────────
export type EventRow = {
  id: string;
  type: string;
  status: 'pending'|'processing'|'processed'|'failed';
  attempts: number;
  last_error: string | null;
  processed_at: string | null;
  created_at: string;
  source_table: string | null;
  source_id: string | null;
  payload: Record<string, unknown>;
};

export type NotificationRow = {
  id: string;
  event_id: string | null;
  channel: 'email'|'whatsapp'|'sms'|'push';
  template: string;
  recipient: string;
  status: 'pending'|'sending'|'sent'|'failed'|'cancelled';
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  scheduled_for: string;
  sent_at: string | null;
  created_at: string;
};

export type LogRow = {
  id: string;
  notification_id: string;
  attempt: number;
  status: 'sent'|'failed'|'skipped';
  provider: string | null;
  provider_id: string | null;
  error: string | null;
  created_at: string;
};

export type Kpis = {
  notifications24h: number;
  sent24h: number;
  pending: number;
  failed: number;
  events24h: number;
  eventsFailed: number;
};

// ─── colores por estado ─────────────────────────────────────────────────────
const STATUS_COLOR = {
  pending:    { dot: '#D4A84B', label: 'Pendiente'  },
  processing: { dot: '#4B7BD4', label: 'Procesando' },
  processed:  { dot: '#4BC48A', label: 'Procesado'  },
  sending:    { dot: '#4B7BD4', label: 'Enviando'   },
  sent:       { dot: '#4BC48A', label: 'Enviado'    },
  failed:     { dot: '#D46B6B', label: 'Fallido'    },
  cancelled:  { dot: '#6B7280', label: 'Cancelado'  },
} as const;

const TEMPLATE_LABEL: Record<string, string> = {
  'repair-received':     'Reparación recibida',
  'repair-in-diagnosis': 'En diagnóstico',
  'repair-in-progress':  'En reparación',
  'repair-in-qc':        'Control de calidad',
  'repair-ready':        'Lista para recoger',
  'repair-cancelled':    'Cancelada',
  'satisfaction-survey': 'Encuesta satisfacción',
};

const EVENT_LABEL: Record<string, string> = {
  'repair.created':         'Reparación creada',
  'repair.status_changed':  'Cambio de estado',
  'customer.satisfaction_survey': 'Encuesta programada',
};

// ─── componente principal ──────────────────────────────────────────────────
export default function AutomatizacionesClient({
  kpis, events, notifications,
}: {
  kpis: Kpis;
  events: EventRow[];
  notifications: NotificationRow[];
}) {
  type NotifFilter = 'todas'|'pending'|'sent'|'failed';
  const [filter, setFilter] = useState<NotifFilter>('todas');
  const [openNotif, setOpenNotif] = useState<NotificationRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filteredNotifs = useMemo(() => {
    if (filter === 'todas') return notifications;
    return notifications.filter(n => n.status === filter);
  }, [notifications, filter]);

  async function retryNotification(id: string) {
    setBusyId(id);
    const r = await fetch(`/api/admin/automation/notifications/${id}/retry`, { method: 'POST' });
    setBusyId(null);
    if (r.ok) location.reload();
  }

  async function retryEvent(id: string) {
    setBusyId(id);
    const r = await fetch(`/api/admin/automation/events/${id}/retry`, { method: 'POST' });
    setBusyId(null);
    if (r.ok) location.reload();
  }

  return (
    <div className="space-y-8">
      {/* ─── KPIs ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Kpi icon={<Mail size={14} />}         label="Emails 24 h"     value={kpis.notifications24h} />
        <Kpi icon={<Send size={14} />}         label="Enviados 24 h"   value={kpis.sent24h}          tone="green" />
        <Kpi icon={<Clock size={14} />}        label="En cola"         value={kpis.pending}          tone={kpis.pending > 0 ? 'amber' : 'neutral'} />
        <Kpi icon={<MailX size={14} />}        label="Fallidos"        value={kpis.failed}           tone={kpis.failed > 0 ? 'red' : 'neutral'} />
        <Kpi icon={<Activity size={14} />}     label="Eventos 24 h"    value={kpis.events24h} />
        <Kpi icon={<AlertTriangle size={14} />} label="Eventos fallo"  value={kpis.eventsFailed}     tone={kpis.eventsFailed > 0 ? 'red' : 'neutral'} />
      </div>

      {/* ─── Banner de fallos ────────────────────────────────────────────── */}
      {(kpis.failed > 0 || kpis.eventsFailed > 0) && (
        <div className="flex items-start gap-3 rounded-lg border border-[#D46B6B]/25 bg-[#D46B6B]/[0.06] p-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#D46B6B]" />
          <div className="text-sm">
            <div className="font-medium text-neutral-100">
              Hay {kpis.failed + kpis.eventsFailed} elementos que requieren atención
            </div>
            <div className="mt-0.5 text-xs text-neutral-400">
              Filtra por <button onClick={() => setFilter('failed')} className="underline underline-offset-2 hover:text-neutral-100">Fallidos</button> y reintenta manualmente. Los detalles completos están a un click en cada fila.
            </div>
          </div>
        </div>
      )}

      {/* ─── Notifications panel ─────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
        <header className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-sm font-semibold text-neutral-100">Notificaciones</h3>
            <span className="text-xs text-neutral-500">Últimas {notifications.length}</span>
          </div>
          <div className="flex gap-0.5 rounded-md border border-white/8 bg-[#0e0e10] p-0.5">
            {(['todas','pending','sent','failed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="rounded px-2.5 py-1 text-xs font-medium transition"
                style={{
                  background: filter === s ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: filter === s ? '#f5f5f5' : '#8a8a90',
                }}
              >
                {s === 'todas' ? 'Todas' : STATUS_COLOR[s].label}
              </button>
            ))}
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs font-medium text-neutral-500">
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Plantilla</th>
                <th className="px-5 py-3">Destinatario</th>
                <th className="px-5 py-3">Canal</th>
                <th className="px-5 py-3">Programada</th>
                <th className="px-5 py-3 text-center">Intentos</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifs.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-xs text-neutral-500">Sin notificaciones que mostrar.</td></tr>
              )}
              {filteredNotifs.map(n => {
                const isFuture = new Date(n.scheduled_for).getTime() > Date.now() && n.status === 'pending';
                return (
                  <tr
                    key={n.id}
                    onClick={() => setOpenNotif(n)}
                    className="cursor-pointer border-b border-white/5 last:border-0 transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-3.5">
                      <StatusBadge status={n.status} />
                    </td>
                    <td className="px-5 py-3.5 text-neutral-200">
                      {TEMPLATE_LABEL[n.template] ?? n.template}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-400">{n.recipient}</td>
                    <td className="px-5 py-3.5">
                      <ChannelChip channel={n.channel} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-neutral-400">
                      {isFuture ? <span className="text-[#D4A84B]">⏱ {fmtRelative(n.scheduled_for)}</span> : fmtDate(n.scheduled_for)}
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs text-neutral-400">
                      <span className={n.attempts >= n.max_attempts ? 'text-[#D46B6B]' : ''}>
                        {n.attempts} / {n.max_attempts}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {(n.status === 'failed' || n.status === 'pending') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); retryNotification(n.id); }}
                          disabled={busyId === n.id}
                          className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-neutral-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-neutral-100 disabled:opacity-50"
                        >
                          {busyId === n.id ? <RotateCw size={11} className="animate-spin" /> : <Zap size={11} />}
                          Reintentar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Events feed ─────────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-lg border border-white/8 bg-[#111113]">
        <header className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-sm font-semibold text-neutral-100">Eventos del sistema</h3>
            <span className="text-xs text-neutral-500">Outbox · Últimas {events.length}</span>
          </div>
          <span className="text-[11px] text-neutral-600">Auditoría inmutable</span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs font-medium text-neutral-500">
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Origen</th>
                <th className="px-5 py-3">Cuándo</th>
                <th className="px-5 py-3">Procesado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-xs text-neutral-500">Sin eventos todavía.</td></tr>
              )}
              {events.map(e => (
                <tr key={e.id} className="border-b border-white/5 last:border-0 transition hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5"><StatusBadge status={e.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="text-neutral-200">{EVENT_LABEL[e.type] ?? e.type}</div>
                    <div className="font-mono text-[10px] text-neutral-600">{e.type}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">
                    {e.source_table ? `${e.source_table.slice(0,3)}…${(e.source_id ?? '').slice(-6)}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-neutral-400">{fmtDate(e.created_at)}</td>
                  <td className="px-5 py-3.5 text-xs text-neutral-500">
                    {e.processed_at ? fmtDate(e.processed_at) : (e.last_error ? <span className="text-[#D46B6B]">{trim(e.last_error, 40)}</span> : '—')}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {e.status === 'failed' && (
                      <button
                        onClick={() => retryEvent(e.id)}
                        disabled={busyId === e.id}
                        className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-neutral-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-neutral-100 disabled:opacity-50"
                      >
                        {busyId === e.id ? <RotateCw size={11} className="animate-spin" /> : <Zap size={11} />}
                        Reintentar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Drawer: detalle de notificación ─────────────────────────────── */}
      {openNotif && (
        <NotificationDrawer
          notif={openNotif}
          onClose={() => setOpenNotif(null)}
          onRetry={() => retryNotification(openNotif.id)}
        />
      )}
    </div>
  );
}

// ─── piezas ────────────────────────────────────────────────────────────────

function Kpi({
  icon, label, value, tone = 'neutral',
}: { icon: React.ReactNode; label: string; value: number; tone?: 'neutral'|'green'|'amber'|'red' }) {
  const colors: Record<typeof tone, string> = {
    neutral: 'text-neutral-100',
    green:   'text-[#4BC48A]',
    amber:   'text-[#D4A84B]',
    red:     'text-[#D46B6B]',
  };
  return (
    <div className="rounded-lg border border-white/8 bg-[#111113] p-4">
      <div className="flex items-center justify-between text-neutral-500">
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className={`mt-2.5 text-2xl font-semibold tabular-nums tracking-tight ${colors[tone]}`}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: keyof typeof STATUS_COLOR }) {
  const m = STATUS_COLOR[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300">
      <span className="relative flex h-1.5 w-1.5">
        {(status === 'pending' || status === 'processing' || status === 'sending') && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-50"
                style={{ background: m.dot }} />
        )}
        <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      </span>
      {m.label}
    </span>
  );
}

function ChannelChip({ channel }: { channel: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    email:    { label: 'Email',    bg: 'rgba(75, 123, 212, 0.12)', fg: '#7DA8E8' },
    whatsapp: { label: 'WhatsApp', bg: 'rgba(75, 196, 138, 0.12)', fg: '#7DD9A8' },
    sms:      { label: 'SMS',      bg: 'rgba(212, 168, 75, 0.12)', fg: '#E8C470' },
    push:     { label: 'Push',     bg: 'rgba(160, 111, 212, 0.12)', fg: '#BC9AE0' },
  };
  const m = map[channel] ?? map.email;
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
          style={{ background: m.bg, color: m.fg }}>
      {m.label}
    </span>
  );
}

function NotificationDrawer({
  notif, onClose, onRetry,
}: { notif: NotificationRow; onClose: () => void; onRetry: () => void }) {
  const [logs, setLogs] = useState<LogRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/automation/notifications/${notif.id}`)
      .then(r => r.json())
      .then(d => setLogs(d.logs ?? []))
      .finally(() => setLoading(false));
  }, [notif.id]);

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/40 backdrop-blur-[2px]" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-[520px] flex-col overflow-y-auto border-l border-white/8 bg-[#0e0e10] shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Notificación</div>
            <div className="mt-0.5 text-sm font-semibold text-neutral-100">
              {TEMPLATE_LABEL[notif.template] ?? notif.template}
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1.5 text-neutral-400 transition hover:bg-white/5 hover:text-neutral-100">
            <X size={16} />
          </button>
        </header>

        <div className="space-y-6 p-6">
          {/* Estado y CTAs */}
          <div className="flex items-center justify-between">
            <StatusBadge status={notif.status} />
            {(notif.status === 'failed' || notif.status === 'pending') && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white"
              >
                <Zap size={12} /> Reintentar ahora
              </button>
            )}
          </div>

          {/* Meta */}
          <Section title="Datos del envío">
            <Field label="Destinatario" mono>{notif.recipient}</Field>
            <Field label="Canal">{notif.channel}</Field>
            <Field label="Plantilla" mono>{notif.template}</Field>
            <Field label="Programada">{fmtFull(notif.scheduled_for)}</Field>
            {notif.sent_at && <Field label="Enviada">{fmtFull(notif.sent_at)}</Field>}
            <Field label="Intentos">{notif.attempts} / {notif.max_attempts}</Field>
            {notif.event_id && <Field label="Evento" mono>{notif.event_id.slice(0, 8)}…</Field>}
          </Section>

          {notif.last_error && (
            <Section title="Último error">
              <pre className="overflow-x-auto rounded border border-[#D46B6B]/20 bg-[#D46B6B]/[0.05] p-3 text-[11px] text-[#E89A9A]">
                {notif.last_error}
              </pre>
            </Section>
          )}

          {/* Logs */}
          <Section title={`Historial de envíos${logs ? ` · ${logs.length}` : ''}`}>
            {loading && <div className="text-xs text-neutral-500">Cargando…</div>}
            {!loading && logs && logs.length === 0 && (
              <div className="text-xs text-neutral-500">Sin intentos registrados.</div>
            )}
            {!loading && logs && logs.length > 0 && (
              <ul className="divide-y divide-white/5 rounded-md border border-white/8 bg-[#111113]">
                {logs.map(l => (
                  <li key={l.id} className="flex items-start gap-3 px-3.5 py-2.5 text-xs">
                    {l.status === 'sent' ? (
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#4BC48A]" />
                    ) : (
                      <AlertTriangle size={13} className="mt-0.5 shrink-0 text-[#D46B6B]" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-neutral-300">
                          Intento #{l.attempt} · <span className="text-neutral-500">{l.provider ?? '—'}</span>
                        </span>
                        <span className="text-[10px] text-neutral-500">{fmtFull(l.created_at)}</span>
                      </div>
                      {l.error && <div className="mt-1 text-[#E89A9A]">{l.error}</div>}
                      {l.provider_id && <div className="mt-1 font-mono text-[10px] text-neutral-600">{l.provider_id}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/5 py-2 last:border-0">
      <span className="text-[11px] uppercase tracking-wider text-neutral-500">{label}</span>
      <span className={`text-right text-xs ${mono ? 'font-mono text-neutral-300' : 'text-neutral-200'}`}>{children}</span>
    </div>
  );
}

// ─── helpers ───────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch { return iso; }
}

function fmtFull(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(new Date(iso));
  } catch { return iso; }
}

function fmtRelative(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const m = Math.round(diff / 60000);
  if (m < 60)         return `en ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24)         return `en ${h} h`;
  const d = Math.round(h / 24);
  return `en ${d} d`;
}

function trim(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
