# Admin Backend — Diseño

**Fecha:** 2026-04-28
**Stack:** Next.js 14 App Router + Supabase (Postgres + Auth + RLS)

## Objetivo

Sustituir los datos mock del panel `/admin` por un backend real que permita:

1. Gestionar empleados con roles (admin / manager / técnico) y multi-tienda.
2. CRUD real de reservas con asignación a técnico y estados.
3. Fichaje (clock in/out) de empleados desde la web.
4. Catálogo editable de servicios; clientes derivados de reservas.
5. Métricas: ingresos, conversión, ranking de técnicos, horas trabajadas.

## Decisiones (brainstorm)

- Persistencia: **Supabase** (Postgres + Auth + Storage + RLS).
- Roles: `admin`, `manager`, `tecnico`. Manager por tienda. 4 tiendas físicas.
- Alta de empleados: solo invitación desde el panel (admin / manager).
- Login: email + contraseña via Supabase Auth.
- Eliminado el login por `ADMIN_PASSWORD` y la cookie `admin_session`.
- Bootstrapping: script `scripts/create-admin.mjs` con `service_role` para crear el primer admin.

## Esquema (resumen)

- `tiendas(id, nombre, direccion, telefono, activa)` — 4 filas seed.
- `profiles(id=auth.users.id, email, full_name, role, store_id, active)` — fila por empleado.
- `services(id, nombre, descripcion, precio_base, duracion_min, activo)` — catálogo editable.
- `reservations(id, code, customer_name, phone, email, device, service_id, store_id, technician_id, scheduled_for, price, status, notes, created_at, updated_at)` — código `MG-XXXX` autogenerado.
- `reservation_history(id, reservation_id, changed_by, from_status, to_status, note, created_at)` — auditoría de cambios de estado.
- `time_entries(id, profile_id, store_id, clock_in, clock_out, break_minutes, note)` — fichajes.

RLS activado en todas. Políticas: admin global; manager limitado a su `store_id`; técnico solo a sus filas (reservas asignadas, fichajes propios, perfil propio).

## Endpoints

- `POST /api/admin/users` — invitar empleado (admin, manager).
- `GET  /api/admin/users` — listar empleados.
- `PATCH /api/admin/users/:id` — cambiar rol / activo / tienda.
- `GET/POST/PATCH/DELETE /api/admin/reservations[/:id]` — CRUD reservas.
- `GET/POST/PATCH/DELETE /api/admin/services[/:id]` — catálogo.
- `POST /api/admin/time-entries/clock-in`, `POST /api/admin/time-entries/clock-out`, `GET /api/admin/time-entries` — fichaje.
- `GET /api/admin/metrics/overview?period=day|week|month` — agregados para el Resumen.

Auth: middleware verifica sesión Supabase en `/admin/*` y `/api/admin/*` (excepto `/admin/login`). Cada endpoint vuelve a validar rol con `requireRole(...)`.

## Cambios en el front

- `src/app/admin/login/page.tsx` — formulario email + password contra `supabase.auth.signInWithPassword`.
- `src/app/admin/page.tsx` — datos reales vía server components; tabs adaptan UI según rol.
- Nuevas páginas: `src/app/admin/empleados/page.tsx`, `src/app/admin/fichaje/page.tsx`.
- Sidebar: añadir "Empleados" (admin/manager) y "Fichaje" (todos).
- Mock `src/app/admin/_data/mock.ts` — eliminar al final.

## Bootstrap

1. Crear proyecto Supabase, copiar URL + anon key + service_role key a `.env.local`.
2. Ejecutar `supabase/migrations/0001_init.sql` en el SQL editor (o `supabase db push`).
3. `node scripts/create-admin.mjs <email> <password> <full_name>` para crear el primer admin.
4. Login en `/admin/login` con esas credenciales.
