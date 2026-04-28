# Admin Backend — Guía de instalación

Pasos para activar el backend de admin con Supabase.

## 1. Crear proyecto en Supabase

1. Entra en https://supabase.com y crea cuenta gratis.
2. **New project**: nombre `movil-guru`, contraseña BD (guárdala), región Frankfurt o Madrid.
3. Espera a que el proyecto arranque (~2 min).
4. **Project Settings → API**, copia tres valores:
   - **Project URL** (ej. `https://xxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (¡secreta, no compartir!)

## 2. Configurar `.env.local`

Copia `.env.local.example` a `.env.local` y rellena:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 3. Ejecutar la migración

En el dashboard de Supabase:

1. **SQL Editor → New query**.
2. Copia el contenido de `supabase/migrations/0001_init.sql` y ejecuta.
3. Comprueba en **Table Editor** que aparecen `tiendas`, `profiles`, `services`, `reservations`, `reservation_history`, `time_entries`. La tabla `tiendas` viene precargada con las 4 tiendas, y `services` con los 8 servicios base.

## 4. Configurar Auth (URLs)

En **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000` (en producción, tu dominio).
- **Redirect URLs**: añade `http://localhost:3000/admin/login` y tu dominio de producción.

En **Authentication → Email Templates**, opcionalmente personaliza el de "Invitación".

## 5. Crear el primer admin

Instala dependencias y ejecuta el script:

```bash
npm install
node scripts/create-admin.mjs tu-email@dominio.com TuPassword123 "Tu Nombre"
```

Esto crea un usuario en `auth.users` con `role=admin` (vía `user_metadata`); el trigger `handle_new_user` crea automáticamente la fila en `profiles`.

## 6. Entrar al panel

```bash
npm run dev
```

Visita http://localhost:3000/admin/login y entra con las credenciales del paso 5.

Desde ahí ya puedes:
- **Empleados** → invitar managers y técnicos por email.
- **Servicios** → editar catálogo y precios.
- **Reservas** → crear, asignar a técnicos, cambiar estado.
- **Resumen** → ver KPIs, ranking de técnicos, ingresos por tienda, horas trabajadas.

Los empleados invitados reciben un email con un enlace; al hacer click eligen contraseña y entran al panel. Los técnicos solo ven sus reservas asignadas y la página de fichaje.

## Roles y permisos

| Acción | Admin | Manager (su tienda) | Técnico |
|---|---|---|---|
| Ver resumen / métricas | ✅ | ✅ (su tienda) | ❌ |
| Ver/crear/editar reservas | ✅ todas | ✅ su tienda | ✅ asignadas (solo estado) |
| Editar catálogo de servicios | ✅ | 👀 ver | 👀 ver |
| Invitar empleados | ✅ cualquier rol | ✅ solo técnicos en su tienda | ❌ |
| Eliminar empleados | ✅ | ❌ | ❌ |
| Fichar entrada/salida | ✅ | ✅ | ✅ |

## Solución de problemas

- **"ADMIN_PASSWORD no configurada"** — esa variable ya no se usa, puedes borrarla del `.env.local`.
- **Email de invitación no llega** — Supabase usa un servidor de pruebas con cuotas bajas. Para producción configura un SMTP propio (Auth → SMTP Settings).
- **"new row violates row-level security policy"** al crear reservas — significa que el manager intenta crear una reserva en una tienda distinta a la suya. Verifica `store_id`.
- **Bucle de redirect** — comprueba que el usuario tiene fila en `profiles` y `active=true`.
