-- Movil Guru — esquema inicial del backend admin
-- Ejecutar una sola vez en el SQL editor de Supabase (o mediante `supabase db push`).

-- =============================================================
-- Extensiones
-- =============================================================
create extension if not exists "pgcrypto";

-- =============================================================
-- Tablas
-- =============================================================

create table if not exists public.tiendas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  direccion   text,
  telefono    text,
  activa      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  role        text not null check (role in ('admin','manager','tecnico')),
  store_id    uuid references public.tiendas(id) on delete set null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists idx_profiles_store on public.profiles(store_id);
create index if not exists idx_profiles_role  on public.profiles(role);

create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  descripcion   text,
  precio_base   numeric(10,2) not null default 0,
  duracion_min  integer not null default 60,
  activo        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Secuencia para el código humano de las reservas (MG-1042…)
create sequence if not exists public.reservation_code_seq start 1042;

create table if not exists public.reservations (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique default ('MG-' || nextval('public.reservation_code_seq')::text),
  customer_name   text not null,
  phone           text,
  email           text,
  device          text not null,
  service_id      uuid references public.services(id) on delete set null,
  store_id        uuid references public.tiendas(id) on delete set null,
  technician_id   uuid references public.profiles(id) on delete set null,
  scheduled_for   timestamptz,
  price           numeric(10,2) not null default 0,
  status          text not null default 'pendiente'
                  check (status in ('pendiente','en_curso','completada','cancelada')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_res_store      on public.reservations(store_id);
create index if not exists idx_res_tech       on public.reservations(technician_id);
create index if not exists idx_res_status     on public.reservations(status);
create index if not exists idx_res_scheduled  on public.reservations(scheduled_for);

create table if not exists public.reservation_history (
  id              uuid primary key default gen_random_uuid(),
  reservation_id  uuid not null references public.reservations(id) on delete cascade,
  changed_by      uuid references public.profiles(id) on delete set null,
  from_status     text,
  to_status       text,
  note            text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_rh_res on public.reservation_history(reservation_id);

create table if not exists public.time_entries (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  store_id        uuid references public.tiendas(id) on delete set null,
  clock_in        timestamptz not null default now(),
  clock_out       timestamptz,
  break_minutes   integer not null default 0,
  note            text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_te_profile on public.time_entries(profile_id);
create index if not exists idx_te_open    on public.time_entries(profile_id) where clock_out is null;

-- =============================================================
-- Triggers
-- =============================================================

-- Mantener updated_at en reservations
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_reservations_updated_at on public.reservations;
create trigger trg_reservations_updated_at
  before update on public.reservations
  for each row execute function public.set_updated_at();

-- Registrar cambio de estado en reservation_history
create or replace function public.log_reservation_status()
returns trigger language plpgsql security definer as $$
begin
  if (tg_op = 'UPDATE' and new.status is distinct from old.status) then
    insert into public.reservation_history (reservation_id, changed_by, from_status, to_status)
    values (new.id, auth.uid(), old.status, new.status);
  end if;
  return new;
end $$;

drop trigger if exists trg_reservations_log_status on public.reservations;
create trigger trg_reservations_log_status
  after update on public.reservations
  for each row execute function public.log_reservation_status();

-- Crear profile automáticamente cuando un invitado completa su alta.
-- Lee role / store_id / full_name desde raw_user_meta_data (los puso la invitación).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_role text;
  v_store uuid;
  v_name text;
begin
  v_role  := coalesce(new.raw_user_meta_data->>'role', 'tecnico');
  v_name  := new.raw_user_meta_data->>'full_name';
  v_store := nullif(new.raw_user_meta_data->>'store_id', '')::uuid;

  insert into public.profiles (id, email, full_name, role, store_id)
  values (new.id, new.email, v_name, v_role, v_store)
  on conflict (id) do nothing;

  return new;
end $$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Helpers de RLS (security definer para evitar recursión)
-- =============================================================

create or replace function public.current_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_store()
returns uuid language sql stable security definer set search_path = public as $$
  select store_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_manager_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('admin','manager') from public.profiles where id = auth.uid()), false);
$$;

-- =============================================================
-- RLS
-- =============================================================

alter table public.tiendas              enable row level security;
alter table public.profiles             enable row level security;
alter table public.services             enable row level security;
alter table public.reservations         enable row level security;
alter table public.reservation_history  enable row level security;
alter table public.time_entries         enable row level security;

-- ---- tiendas ----
drop policy if exists tiendas_select on public.tiendas;
create policy tiendas_select on public.tiendas
  for select to authenticated using (true);

drop policy if exists tiendas_admin_write on public.tiendas;
create policy tiendas_admin_write on public.tiendas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- profiles ----
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists profiles_manager_store on public.profiles;
create policy profiles_manager_store on public.profiles
  for select to authenticated
  using (public.current_role() = 'manager' and store_id = public.current_store());

drop policy if exists profiles_admin_write on public.profiles;
create policy profiles_admin_write on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- services ----
drop policy if exists services_select on public.services;
create policy services_select on public.services
  for select to authenticated using (true);

drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- reservations ----
drop policy if exists res_admin_all on public.reservations;
create policy res_admin_all on public.reservations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists res_manager_store on public.reservations;
create policy res_manager_store on public.reservations
  for all to authenticated
  using (public.current_role() = 'manager' and store_id = public.current_store())
  with check (public.current_role() = 'manager' and store_id = public.current_store());

drop policy if exists res_tech_assigned on public.reservations;
create policy res_tech_assigned on public.reservations
  for select to authenticated
  using (public.current_role() = 'tecnico' and technician_id = auth.uid());

drop policy if exists res_tech_update on public.reservations;
create policy res_tech_update on public.reservations
  for update to authenticated
  using (public.current_role() = 'tecnico' and technician_id = auth.uid())
  with check (public.current_role() = 'tecnico' and technician_id = auth.uid());

-- ---- reservation_history ----
drop policy if exists rh_admin on public.reservation_history;
create policy rh_admin on public.reservation_history
  for select to authenticated using (public.is_admin());

drop policy if exists rh_manager on public.reservation_history;
create policy rh_manager on public.reservation_history
  for select to authenticated
  using (
    public.current_role() = 'manager'
    and exists (
      select 1 from public.reservations r
      where r.id = reservation_history.reservation_id
        and r.store_id = public.current_store()
    )
  );

-- ---- time_entries ----
drop policy if exists te_self on public.time_entries;
create policy te_self on public.time_entries
  for all to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists te_admin on public.time_entries;
create policy te_admin on public.time_entries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists te_manager_store on public.time_entries;
create policy te_manager_store on public.time_entries
  for select to authenticated
  using (public.current_role() = 'manager' and store_id = public.current_store());

-- =============================================================
-- Seeds
-- =============================================================

insert into public.tiendas (nombre, direccion, telefono) values
  ('Valladolid Centro',     'C/ Santiago, 3',                '983 000 001'),
  ('Valladolid Plaza',      'Centro Comercial Vallsur',      '983 000 002'),
  ('Burgos',                'C/ Vitoria, 14',                '947 000 001'),
  ('León / Ponferrada',     'Av. de los Cubos, 5',           '987 000 001')
on conflict do nothing;

insert into public.services (nombre, descripcion, precio_base, duracion_min) values
  ('Pantalla rota',          'Sustitución de pantalla',                189, 60),
  ('Batería',                'Cambio de batería',                       59, 45),
  ('Daño por agua',          'Limpieza y diagnóstico tras inmersión',  120, 120),
  ('Cámara',                 'Reparación o sustitución de cámara',      85, 60),
  ('Plegables',              'Reparación específica de plegables',     320, 180),
  ('Recuperación de datos',  'Recuperación tras fallo lógico',         150, 240),
  ('Puerto de carga',        'Sustitución de puerto de carga',          45, 45),
  ('Placa base',             'Diagnóstico y reparación de placa',      240, 240)
on conflict do nothing;
