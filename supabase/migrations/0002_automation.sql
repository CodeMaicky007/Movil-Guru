-- Movil Guru — capa de automatización (event bus + notification engine)
-- Patrón: transactional outbox. Los triggers escriben eventos en la misma transacción
-- que los cambios de negocio, garantizando que ningún cambio se pierda. Workers
-- (Vercel Cron) procesan los eventos de forma asíncrona con retries y backoff.

-- =============================================================
-- 1. Normalización de statuses de reservations
--    Antes: pendiente / en_curso / completada / cancelada
--    Ahora: recibido / diagnostico / reparando / control / listo / cancelada
--    (alineado con el flujo real visible en /track)
-- =============================================================

alter table public.reservations drop constraint if exists reservations_status_check;

update public.reservations set status = 'recibido'  where status = 'pendiente';
update public.reservations set status = 'reparando' where status = 'en_curso';
update public.reservations set status = 'listo'     where status = 'completada';

alter table public.reservations
  add constraint reservations_status_check
  check (status in ('recibido','diagnostico','reparando','control','listo','cancelada'));

alter table public.reservations alter column status set default 'recibido';

-- =============================================================
-- 2. Tabla automation_events (outbox)
-- =============================================================

create table if not exists public.automation_events (
  id            uuid primary key default gen_random_uuid(),
  type          text not null,
  payload       jsonb not null default '{}'::jsonb,
  source_table  text,
  source_id     uuid,
  status        text not null default 'pending'
                check (status in ('pending','processing','processed','failed')),
  attempts      integer not null default 0,
  last_error    text,
  processed_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists idx_ae_pending
  on public.automation_events (created_at)
  where status = 'pending';

create index if not exists idx_ae_source
  on public.automation_events (source_table, source_id);

create index if not exists idx_ae_type
  on public.automation_events (type);

-- =============================================================
-- 3. Tabla notifications (cola de envíos)
-- =============================================================

create table if not exists public.notifications (
  id             uuid primary key default gen_random_uuid(),
  event_id       uuid references public.automation_events(id) on delete set null,
  channel        text not null check (channel in ('email','whatsapp','sms','push')),
  template       text not null,
  recipient      text not null,
  payload        jsonb not null default '{}'::jsonb,
  status         text not null default 'pending'
                 check (status in ('pending','sending','sent','failed','cancelled')),
  attempts       integer not null default 0,
  max_attempts   integer not null default 5,
  last_error     text,
  scheduled_for  timestamptz not null default now(),
  sent_at        timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists idx_notif_due
  on public.notifications (scheduled_for)
  where status = 'pending';

create index if not exists idx_notif_event
  on public.notifications (event_id);

create index if not exists idx_notif_recipient
  on public.notifications (recipient, channel);

-- =============================================================
-- 4. Tabla notification_logs (auditoría de cada intento)
-- =============================================================

create table if not exists public.notification_logs (
  id              uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  attempt         integer not null,
  status          text not null check (status in ('sent','failed','skipped')),
  provider        text,
  provider_id     text,
  error           text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_nlog_notif on public.notification_logs (notification_id, created_at);

-- =============================================================
-- 5. Trigger: emitir eventos desde reservations (transactional outbox)
-- =============================================================

create or replace function public.emit_reservation_event()
returns trigger language plpgsql security definer as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.automation_events (type, payload, source_table, source_id)
    values (
      'repair.created',
      jsonb_build_object('reservation', to_jsonb(new)),
      'reservations',
      new.id
    );
    return new;
  end if;

  if (tg_op = 'UPDATE' and new.status is distinct from old.status) then
    insert into public.automation_events (type, payload, source_table, source_id)
    values (
      'repair.status_changed',
      jsonb_build_object(
        'from', old.status,
        'to', new.status,
        'reservation', to_jsonb(new)
      ),
      'reservations',
      new.id
    );
  end if;

  return new;
end $$;

drop trigger if exists trg_reservations_emit_event on public.reservations;
create trigger trg_reservations_emit_event
  after insert or update on public.reservations
  for each row execute function public.emit_reservation_event();

-- =============================================================
-- 6. RLS — sólo admin lee. El worker usa service_role y bypassa RLS.
-- =============================================================

alter table public.automation_events enable row level security;
alter table public.notifications     enable row level security;
alter table public.notification_logs enable row level security;

drop policy if exists ae_admin_read on public.automation_events;
create policy ae_admin_read on public.automation_events
  for select to authenticated using (public.is_admin());

drop policy if exists notif_admin_read on public.notifications;
create policy notif_admin_read on public.notifications
  for select to authenticated using (public.is_admin());

drop policy if exists nlog_admin_read on public.notification_logs;
create policy nlog_admin_read on public.notification_logs
  for select to authenticated using (public.is_admin());
