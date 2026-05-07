import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { AutomationDispatcher } from './application/dispatcher';
import { NotificationWorker } from './application/worker';
import { createLogger } from './logger';

// Trigger inline para automatización: dispara el dispatcher y el worker
// inmediatamente después de un cambio relevante (ej. crear/actualizar reserva).
//
// Diseño: el cron diario sigue siendo la red de seguridad, pero la mayoría
// de notificaciones reactivas se envían en ~1-2 segundos sin esperar al cron.
// Si algo falla aquí (timeout, network), el evento queda en la tabla
// automation_events y el siguiente cron tick lo recoge.
//
// IMPORTANTE: nunca tira de la request original — captura todos los errores.

const log = createLogger('automation:inline');

export async function triggerAutomationInline(): Promise<void> {
  try {
    const db = createSupabaseAdminClient();
    const dispatcher = new AutomationDispatcher(db);
    const worker = new NotificationWorker(db);

    // Limit pequeño: en una request inline sólo procesamos lo recién creado.
    // Lo masivo (backlog, retries) lo deja para el cron diario.
    const dispatchResult = await dispatcher.tick(10);
    const sendResult = await worker.tick(10);

    log.info('inline.done', { ...dispatchResult, ...sendResult });
  } catch (e) {
    // Nunca propagar — la request principal ya tuvo éxito y el evento
    // está persistido. El cron lo recogerá.
    const error = e instanceof Error ? e.message : String(e);
    log.error('inline.error', { error });
  }
}
