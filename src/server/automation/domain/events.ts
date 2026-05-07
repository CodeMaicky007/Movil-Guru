export const REPAIR_STATUSES = [
  'recibido',
  'diagnostico',
  'reparando',
  'control',
  'listo',
  'cancelada',
] as const;

export type RepairStatus = (typeof REPAIR_STATUSES)[number];

export type ReservationSnapshot = {
  id: string;
  code: string;
  customer_name: string;
  email: string | null;
  phone: string | null;
  device: string;
  service_id: string | null;
  store_id: string | null;
  technician_id: string | null;
  scheduled_for: string | null;
  price: number;
  status: RepairStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AutomationEventType =
  | 'repair.created'
  | 'repair.status_changed'
  | 'customer.satisfaction_survey';

export type AutomationEventPayloadMap = {
  'repair.created': { reservation: ReservationSnapshot };
  'repair.status_changed': {
    from: RepairStatus;
    to: RepairStatus;
    reservation: ReservationSnapshot;
  };
  'customer.satisfaction_survey': { reservation: ReservationSnapshot };
};

export type AutomationEvent<T extends AutomationEventType = AutomationEventType> = {
  id: string;
  type: T;
  payload: AutomationEventPayloadMap[T];
  source_table: string | null;
  source_id: string | null;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  attempts: number;
  last_error: string | null;
  processed_at: string | null;
  created_at: string;
};
