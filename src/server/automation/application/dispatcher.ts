import type { SupabaseClient } from '@supabase/supabase-js';
import type { AutomationEvent, RepairStatus, ReservationSnapshot } from '../domain/events';
import type { NotificationDraft } from '../domain/notification';
import { EventsRepo } from '../infrastructure/db/events-repo';
import { NotificationsRepo } from '../infrastructure/db/notifications-repo';
import { StoreContext } from './store-context';
import { createLogger } from '../logger';

// Dispatcher: convierte eventos del outbox en notificaciones encoladas.
// Las reglas de negocio (qué evento dispara qué notificación) viven aquí,
// declarativas y fáciles de modificar.

const TRACK_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://movilguru.com';

const STATUS_TO_TEMPLATE: Partial<Record<RepairStatus, string>> = {
  recibido:    'repair-received',
  diagnostico: 'repair-in-diagnosis',
  reparando:   'repair-in-progress',
  control:     'repair-in-qc',
  listo:       'repair-ready',
  cancelada:   'repair-cancelled',
};

export class AutomationDispatcher {
  private readonly log = createLogger('automation:dispatcher');
  private readonly events: EventsRepo;
  private readonly notifications: NotificationsRepo;
  private readonly stores: StoreContext;

  constructor(private readonly db: SupabaseClient) {
    this.events = new EventsRepo(db);
    this.notifications = new NotificationsRepo(db);
    this.stores = new StoreContext(db);
  }

  /**
   * Procesa hasta `limit` eventos pendientes. Devuelve cuántos procesó.
   */
  async tick(limit = 50): Promise<{ processed: number; failed: number }> {
    const pending = await this.events.fetchPending(limit);
    let processed = 0, failed = 0;

    for (const evt of pending) {
      const claimed = await this.events.claim(evt.id);
      if (!claimed) continue; // otro worker se lo llevó

      try {
        const drafts = await this.handle(claimed);
        for (const d of drafts) await this.notifications.create(d);
        await this.events.markProcessed(claimed.id);
        processed++;
        this.log.info('event.processed', { id: claimed.id, type: claimed.type, drafts: drafts.length });
      } catch (e) {
        failed++;
        const msg = e instanceof Error ? e.message : String(e);
        // Errores del dispatcher = bug en handler. No reintentamos infinitamente.
        await this.events.markFailed(claimed.id, msg);
        this.log.error('event.failed', { id: claimed.id, type: claimed.type, error: msg });
      }
    }

    return { processed, failed };
  }

  private async handle(evt: AutomationEvent): Promise<NotificationDraft[]> {
    switch (evt.type) {
      case 'repair.created':
        return this.onRepairCreated(evt as AutomationEvent<'repair.created'>);
      case 'repair.status_changed':
        return this.onRepairStatusChanged(evt as AutomationEvent<'repair.status_changed'>);
      case 'customer.satisfaction_survey':
        return this.onSatisfactionSurvey(evt as AutomationEvent<'customer.satisfaction_survey'>);
      default:
        this.log.warn('event.unhandled', { type: evt.type });
        return [];
    }
  }

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  private async onRepairCreated(evt: AutomationEvent<'repair.created'>): Promise<NotificationDraft[]> {
    const r = evt.payload.reservation;
    if (!r.email) return [];
    const payload = await this.repairPayload(r);
    return [
      { event_id: evt.id, channel: 'email', template: 'repair-received', recipient: r.email, payload },
    ];
  }

  private async onRepairStatusChanged(evt: AutomationEvent<'repair.status_changed'>): Promise<NotificationDraft[]> {
    const { to, reservation: r } = evt.payload;
    if (!r.email) return [];
    const template = STATUS_TO_TEMPLATE[to];
    if (!template) return [];

    // No enviamos un "received" en cambios de estado (sólo en creación).
    if (template === 'repair-received') return [];

    const payload = await this.repairPayload(r);
    const drafts: NotificationDraft[] = [
      { event_id: evt.id, channel: 'email', template, recipient: r.email, payload },
    ];

    // Cuando llega a "listo", programamos la encuesta de satisfacción a 3 días.
    if (to === 'listo') {
      const surveyAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      drafts.push({
        event_id: evt.id,
        channel: 'email',
        template: 'satisfaction-survey',
        recipient: r.email,
        payload,
        scheduled_for: surveyAt,
        max_attempts: 3,
      });
    }

    return drafts;
  }

  private async onSatisfactionSurvey(evt: AutomationEvent<'customer.satisfaction_survey'>): Promise<NotificationDraft[]> {
    const r = evt.payload.reservation;
    if (!r.email) return [];
    const payload = await this.repairPayload(r);
    return [
      { event_id: evt.id, channel: 'email', template: 'satisfaction-survey', recipient: r.email, payload, max_attempts: 3 },
    ];
  }

  // ------------------------------------------------------------------

  private async repairPayload(r: ReservationSnapshot): Promise<Record<string, unknown>> {
    const [store_name, technician_name] = await Promise.all([
      this.stores.storeName(r.store_id),
      this.stores.technicianName(r.technician_id),
    ]);
    return {
      code: r.code,
      customer_name: r.customer_name,
      device: r.device,
      store_name,
      technician_name,
      tracking_url: `${TRACK_BASE_URL}/track?code=${encodeURIComponent(r.code)}`,
      scheduled_for: r.scheduled_for,
      price: r.price,
    };
  }
}
