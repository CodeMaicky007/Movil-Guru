// Punto de entrada público del módulo de automatización.
// Otras partes del backend deberían importar SOLO desde aquí.

export { AutomationDispatcher } from './application/dispatcher';
export { NotificationWorker } from './application/worker';
export { isAuthorizedCronRequest } from './auth';
export { createLogger } from './logger';

export type { AutomationEvent, AutomationEventType, RepairStatus, ReservationSnapshot } from './domain/events';
export type { Notification, NotificationDraft, NotificationChannel, NotificationStatus } from './domain/notification';
