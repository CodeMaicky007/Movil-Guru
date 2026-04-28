# Agente IA "Gurú" — Design Spec
**Fecha:** 2026-04-28
**Estado:** Aprobado

## Resumen

Widget de chat flotante en todas las páginas del sitio movil.guru. El agente "Gurú" usa la Claude API con tool calling para responder dudas sobre servicios/precios, buscar productos, consultar disponibilidad y crear reservas en tiempo real contra Supabase. Las respuestas llegan en streaming. Usuarios anónimos pueden hacer consultas; usuarios logueados tienen acceso a acciones adicionales (reservas, historial).

---

## Arquitectura

```
Usuario
  │
  ▼
[ChatWidget.tsx]  ← añadido en src/app/layout.tsx (una sola vez)
  │  streaming SSE (ReadableStream)
  ▼
[/api/chat/route.ts]  ← Next.js API Route (server-side)
  │
  ├─► Claude API (claude-sonnet-4-6, tool_use + streaming)
  │       │
  │       └─► Si llama a una tool → ejecutar contra Supabase (server-side)
  │                 └─► Devolver resultado a Claude → continuar stream
  │
  └─► Supabase (servicios, disponibilidad, reservas, productos, sesión)
```

**Historial de conversación:** estado React en el cliente (no persiste entre recargas). Sin coste de BD ni privacidad adicional. Mejora futura: persistir en Supabase para usuarios logueados.

---

## Tools del agente

| Tool | Descripción | Requiere login |
|------|-------------|---------------|
| `buscar_servicios` | Busca reparaciones por dispositivo/marca/tipo de avería | No |
| `consultar_disponibilidad` | Devuelve huecos libres para una fecha y servicio | No |
| `crear_reserva` | Crea una reserva en Supabase | Sí |
| `buscar_productos` | Busca productos en la tienda por nombre o categoría | No |
| `ver_mis_reservas` | Lista las reservas del usuario logueado | Sí |
| `navegar_a` | Devuelve una ruta interna para redirigir al usuario | No |

**Seguridad de tools:** Las tools que requieren login comprueban la sesión de Supabase en el servidor vía `createServerClient`. Si no hay sesión activa, la tool devuelve `{ error: "requiere_login" }` y Claude informa al usuario de que debe identificarse.

---

## Componentes

### `src/components/chat/ChatWidget.tsx`
- Botón flotante esquina inferior derecha (colores brand movil.guru)
- Panel de 380×520px con animación de apertura/cierre
- Header: nombre "Gurú", icono, botón cerrar
- Área de mensajes con scroll automático al último mensaje
- Indicador de "escribiendo..." durante el stream
- Input de texto + botón enviar (deshabilitado mientras carga)

### `src/components/chat/useChat.ts`
Hook personalizado que expone:
- `messages: Message[]` — historial de la conversación
- `sendMessage(text: string): void` — envía un mensaje y gestiona el stream
- `isLoading: boolean` — true mientras Claude responde
- `error: string | null` — último error si lo hay

Implementación interna: `fetch` al API route con `ReadableStream`, decodifica chunks de texto e inserta en el array de mensajes en tiempo real.

### `src/app/api/chat/route.ts`
- Recibe `POST { messages: Message[], userId?: string }`
- Lee sesión de Supabase desde cookies del servidor
- Construye el array de tools con sus schemas JSON
- Llama a `anthropic.messages.stream()` con el system prompt y las tools
- Cuando Claude invoca una tool: ejecuta la función correspondiente contra Supabase, devuelve el resultado, continúa el stream
- Retorna un `ReadableStream` con chunks de texto plano

---

## System prompt

```
Eres Gurú, el asistente virtual de movil.guru. Hablas en español de España,
eres cercano y usas el tú. Tu objetivo es ayudar al usuario a encontrar el
servicio de reparación que necesita, resolver dudas sobre precios y garantías,
buscar productos en la tienda y gestionar sus reservas.

Sé conciso y directo. Si el usuario necesita ir a una página concreta, usa la
tool navegar_a. Si una acción requiere estar logueado y el usuario no lo está,
invítale a registrarse o iniciar sesión.

No inventes precios ni disponibilidad — consulta siempre las tools.
```

---

## Flujo de datos — ejemplo completo

```
Usuario: "¿Cuánto cuesta cambiar la pantalla de un Samsung S24?"

1. Frontend → POST /api/chat { messages: [...] }
2. API route → Claude (stream: true, tools: [...])
3. Claude → tool_use: buscar_servicios({ dispositivo: "Samsung S24", tipo: "pantalla" })
4. API route → Supabase query → { precio: 129, tiempo: "1h", garantia: "6 meses" }
5. API route → Claude (tool_result: {...})
6. Claude → text: "Cambiar la pantalla de tu Samsung S24 cuesta 129 €..."
7. Stream → Frontend → ChatWidget muestra la respuesta en tiempo real
```

---

## Seguridad y límites

- **Rate limiting:** máximo 20 mensajes por IP cada 10 minutos (middleware de Next.js)
- **Longitud de input:** máximo 500 caracteres por mensaje del usuario
- **Historial enviado al API:** máximo 20 mensajes (para no exceder contexto ni coste)
- **API key:** solo en servidor, nunca expuesta al cliente — variable de entorno `ANTHROPIC_API_KEY`
- **Tool execution:** siempre server-side, el cliente nunca tiene acceso directo a Supabase desde el chat

---

## Archivos a crear/modificar

| Acción | Archivo |
|--------|---------|
| Crear | `src/components/chat/ChatWidget.tsx` |
| Crear | `src/components/chat/useChat.ts` |
| Crear | `src/app/api/chat/route.ts` |
| Modificar | `src/app/layout.tsx` (añadir `<ChatWidget />`) |
| Modificar | `.env.local` (añadir `ANTHROPIC_API_KEY`) |
| Instalar | `@anthropic-ai/sdk` |

---

## Fuera de alcance (posibles mejoras futuras)

- Persistencia del historial en Supabase por usuario
- Panel de admin para ver conversaciones
- Soporte multiidioma (español/inglés)
- Integración con WhatsApp o widget externo
