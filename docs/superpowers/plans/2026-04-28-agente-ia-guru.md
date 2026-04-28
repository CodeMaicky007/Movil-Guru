# Agente IA "Gurú" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un widget de chat flotante en todas las páginas que conecta con Claude via tool calling para responder dudas, buscar servicios/productos y crear reservas contra Supabase en tiempo real.

**Architecture:** Next.js 14 App Router API route (`/api/chat`) que recibe mensajes, llama a Claude con streaming y ejecuta tools contra Supabase server-side. El frontend consume el stream mediante un hook React y muestra el widget flotante en el layout raíz.

**Tech Stack:** `@anthropic-ai/sdk`, Next.js 14 App Router, Supabase SSR (`@supabase/ssr`), TypeScript, Tailwind CSS, Framer Motion, Lucide React.

---

## File Map

| Acción | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Modificar | `.env.local` | Corregir formato de ANTHROPIC_API_KEY |
| Crear | `src/lib/chat/system-prompt.ts` | Texto del system prompt de Gurú |
| Crear | `src/lib/chat/tools.ts` | Definiciones JSON de tools + funciones ejecutoras |
| Crear | `src/app/api/chat/route.ts` | API route: streaming + loop de tool calling |
| Crear | `src/components/chat/useChat.ts` | Hook: estado de mensajes + fetch streaming |
| Crear | `src/components/chat/ChatWidget.tsx` | UI: botón flotante + panel de chat |
| Modificar | `src/app/layout.tsx` | Añadir `<ChatWidget />` al body |

---

## Task 1: Corregir `.env.local` e instalar SDK

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Corregir el formato de la API key**

El archivo actual tiene `const AI_API_KEY = 'sk-ant-...'` que es sintaxis JS inválida en .env.
Reemplazar esa línea por:

```
ANTHROPIC_API_KEY=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
```

> Usa el valor exacto que ya tienes en el archivo — solo elimina `const AI_API_KEY = ` y las comillas.

- [ ] **Step 2: Instalar el SDK de Anthropic**

```bash
npm install @anthropic-ai/sdk
```

Salida esperada: `added 1 package` (o similar, sin errores).

- [ ] **Step 3: Verificar que el servidor arranca**

```bash
npm run dev
```

Esperar `✓ Ready` en la consola. Abrir `http://localhost:3000` y confirmar que la web carga sin errores. Parar con Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.local
git commit -m "chore: install @anthropic-ai/sdk and fix ANTHROPIC_API_KEY env format"
```

---

## Task 2: System prompt y definiciones de tools

**Files:**
- Create: `src/lib/chat/system-prompt.ts`
- Create: `src/lib/chat/tools.ts`

- [ ] **Step 1: Crear el system prompt**

Crear `src/lib/chat/system-prompt.ts`:

```typescript
export const SYSTEM_PROMPT = `Eres Gurú, el asistente virtual de movil.guru. \
Hablas en español de España, eres cercano y usas el tú. Tu objetivo es ayudar \
al usuario a encontrar el servicio de reparación que necesita, resolver dudas \
sobre precios y garantías, buscar productos en la tienda y gestionar sus reservas.

Sé conciso y directo. No inventes precios ni disponibilidad — consulta siempre \
las tools disponibles antes de responder con datos concretos. Si el usuario necesita \
ir a una página concreta, usa la tool navegar_a y el widget le mostrará el enlace. \
Si una acción requiere estar logueado y el usuario no lo está, invítale amablemente \
a registrarse o iniciar sesión en /login.

Cuando uses una tool, no expliques que la estás usando — responde directamente \
con el resultado de forma natural.`;
```

- [ ] **Step 2: Crear las definiciones de tools**

Crear `src/lib/chat/tools.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'buscar_servicios',
    description: 'Busca servicios de reparación disponibles. Úsala cuando el usuario pregunte por precios, tipos de reparación o qué servicios hay disponibles.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Término de búsqueda, por ejemplo "pantalla iPhone" o "batería Samsung"',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'consultar_disponibilidad',
    description: 'Consulta los huecos disponibles para reservar una cita. Úsala cuando el usuario quiera pedir cita o saber cuándo puede venir.',
    input_schema: {
      type: 'object',
      properties: {
        fecha: {
          type: 'string',
          description: 'Fecha en formato YYYY-MM-DD, por ejemplo "2026-05-10"',
        },
      },
      required: ['fecha'],
    },
  },
  {
    name: 'crear_reserva',
    description: 'Crea una nueva reserva para el usuario. Solo disponible si el usuario está logueado. Requiere nombre del cliente, dispositivo y fecha/hora.',
    input_schema: {
      type: 'object',
      properties: {
        customer_name: { type: 'string', description: 'Nombre completo del cliente' },
        phone: { type: 'string', description: 'Teléfono de contacto' },
        device: { type: 'string', description: 'Dispositivo a reparar, ej: "iPhone 15 Pro"' },
        service_id: { type: 'string', description: 'ID del servicio de la tool buscar_servicios' },
        scheduled_for: { type: 'string', description: 'Fecha y hora en formato ISO, ej: "2026-05-10T10:00:00"' },
        notes: { type: 'string', description: 'Notas adicionales opcionales' },
      },
      required: ['customer_name', 'device'],
    },
  },
  {
    name: 'buscar_productos',
    description: 'Busca productos en la tienda online de movil.guru (fundas, cargadores, cristales, etc.).',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Término de búsqueda, por ejemplo "funda iPhone 15" o "cargador rápido"',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'ver_mis_reservas',
    description: 'Muestra las reservas del usuario logueado. Solo disponible si el usuario está logueado.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'navegar_a',
    description: 'Devuelve una URL interna del sitio para que el usuario pueda navegar a ella. Úsala cuando el usuario quiera ir a una sección específica.',
    input_schema: {
      type: 'object',
      properties: {
        ruta: {
          type: 'string',
          description: 'Ruta interna, por ejemplo "/tienda", "/tiendas", "/precios", "/contacto", "/faq", "/guia", "/marcas", "/reparacion"',
        },
        label: {
          type: 'string',
          description: 'Texto descriptivo del enlace para mostrar al usuario',
        },
      },
      required: ['ruta', 'label'],
    },
  },
];
```

- [ ] **Step 3: Añadir las funciones ejecutoras de tools al mismo archivo**

Añadir al final de `src/lib/chat/tools.ts`:

```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ToolInput = Record<string, string | undefined>;

export async function executeTool(
  name: string,
  input: ToolInput,
  userId: string | null,
): Promise<string> {
  const supabase = createSupabaseServerClient();

  switch (name) {
    case 'buscar_servicios': {
      const { data, error } = await supabase
        .from('services')
        .select('id, nombre, descripcion, precio_base, duracion_min')
        .ilike('nombre', `%${input.query}%`)
        .eq('activo', true)
        .limit(5);
      if (error) return `Error buscando servicios: ${error.message}`;
      if (!data || data.length === 0) return 'No encontré servicios que coincidan con esa búsqueda.';
      return JSON.stringify(data);
    }

    case 'consultar_disponibilidad': {
      const fecha = input.fecha;
      if (!fecha) return 'Indica una fecha para consultar disponibilidad.';
      const inicio = `${fecha}T00:00:00`;
      const fin = `${fecha}T23:59:59`;
      const { data, error } = await supabase
        .from('reservations')
        .select('scheduled_for')
        .gte('scheduled_for', inicio)
        .lte('scheduled_for', fin)
        .in('status', ['pendiente', 'confirmada']);
      if (error) return `Error consultando disponibilidad: ${error.message}`;
      const ocupadas = (data ?? []).map((r) => r.scheduled_for);
      const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];
      const libres = horas.filter((h) => !ocupadas.some((o) => o?.includes(h)));
      if (libres.length === 0) return `El ${fecha} está completo. Prueba con otro día.`;
      return `Horas disponibles el ${fecha}: ${libres.join(', ')}`;
    }

    case 'crear_reserva': {
      if (!userId) return JSON.stringify({ error: 'requiere_login', mensaje: 'Necesitas iniciar sesión para crear una reserva.' });
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          customer_name: input.customer_name,
          phone: input.phone ?? null,
          email: userData?.user?.email ?? null,
          device: input.device,
          service_id: input.service_id ?? null,
          scheduled_for: input.scheduled_for ?? null,
          notes: input.notes ?? null,
          status: 'pendiente',
          price: 0,
        })
        .select('id, code, scheduled_for, status')
        .single();
      if (error) return `Error creando la reserva: ${error.message}`;
      return JSON.stringify({ ok: true, reserva: data });
    }

    case 'buscar_productos': {
      const { data, error } = await supabase
        .from('products')
        .select('id, nombre, descripcion, precio, categoria, imagen_url')
        .ilike('nombre', `%${input.query}%`)
        .limit(5);
      if (error) return `Error buscando productos: ${error.message}`;
      if (!data || data.length === 0) return 'No encontré productos que coincidan con esa búsqueda.';
      return JSON.stringify(data);
    }

    case 'ver_mis_reservas': {
      if (!userId) return JSON.stringify({ error: 'requiere_login', mensaje: 'Necesitas iniciar sesión para ver tus reservas.' });
      const { data, error } = await supabase
        .from('reservations')
        .select('id, code, device, scheduled_for, status, services(nombre)')
        .eq('email', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) return `Error consultando reservas: ${error.message}`;
      if (!data || data.length === 0) return 'No tienes reservas registradas.';
      return JSON.stringify(data);
    }

    case 'navegar_a': {
      return JSON.stringify({ ruta: input.ruta, label: input.label });
    }

    default:
      return `Tool desconocida: ${name}`;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/chat/
git commit -m "feat: add Gurú system prompt and tool definitions"
```

---

## Task 3: API route con streaming y tool calling

**Files:**
- Create: `src/app/api/chat/route.ts`

- [ ] **Step 1: Crear el API route**

Crear `src/app/api/chat/route.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import { TOOL_DEFINITIONS, executeTool, ToolInput } from '@/lib/chat/tools';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_MESSAGES = 20;
const MAX_INPUT_LENGTH = 500;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const rawMessages: { role: 'user' | 'assistant'; content: string }[] = body.messages ?? [];

  // Validar longitud del último mensaje del usuario
  const lastUser = rawMessages.filter((m) => m.role === 'user').at(-1);
  if (lastUser && lastUser.content.length > MAX_INPUT_LENGTH) {
    return new Response('Mensaje demasiado largo.', { status: 400 });
  }

  // Truncar historial
  const messages = rawMessages.slice(-MAX_MESSAGES);

  // Obtener usuario logueado
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Bucle: Claude puede llamar varias tools antes de responder
        const conversationMessages: Anthropic.MessageParam[] = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let continueLoop = true;
        while (continueLoop) {
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            tools: TOOL_DEFINITIONS,
            messages: conversationMessages,
            stream: false, // usamos el loop manual para poder ejecutar tools
          });

          if (response.stop_reason === 'tool_use') {
            // Ejecutar todas las tools que Claude ha pedido
            const assistantContent = response.content;
            conversationMessages.push({ role: 'assistant', content: assistantContent });

            const toolResults: Anthropic.ToolResultBlockParam[] = [];
            for (const block of assistantContent) {
              if (block.type === 'tool_use') {
                const result = await executeTool(block.name, block.input as ToolInput, userId);
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: result,
                });
              }
            }
            conversationMessages.push({ role: 'user', content: toolResults });
            // Continuar el bucle: Claude procesará los resultados
          } else {
            // stop_reason === 'end_turn': enviar la respuesta al cliente en streaming simulado
            for (const block of response.content) {
              if (block.type === 'text') {
                // Enviar chunk a chunk para simular streaming
                const words = block.text.split(' ');
                for (let i = 0; i < words.length; i++) {
                  const chunk = i === words.length - 1 ? words[i] : words[i] + ' ';
                  controller.enqueue(encoder.encode(chunk));
                  // Pequeña pausa para efecto streaming
                  await new Promise((r) => setTimeout(r, 15));
                }
              }
            }
            continueLoop = false;
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        controller.enqueue(encoder.encode(`Lo siento, ha ocurrido un error: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
}
```

- [ ] **Step 2: Probar el API route con curl**

Con el servidor corriendo (`npm run dev`), ejecutar en otra terminal:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola, qué servicios ofrecéis?"}]}'
```

Salida esperada: texto en español de España, Gurú responde sobre servicios de reparación. Si hay error de API key, revisar el `.env.local`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: add /api/chat route with Claude tool calling loop"
```

---

## Task 4: Hook useChat

**Files:**
- Create: `src/components/chat/useChat.ts`

- [ ] **Step 1: Crear el hook**

Crear `src/components/chat/useChat.ts`:

```typescript
'use client';

import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy Gurú, tu asistente de movil.guru. ¿En qué te puedo ayudar hoy?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Placeholder del asistente que iremos rellenando con el stream
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const allMessages = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error de conexión';
      setError(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.' }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  return { messages, sendMessage, isLoading, error };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/useChat.ts
git commit -m "feat: add useChat hook with streaming support"
```

---

## Task 5: ChatWidget UI

**Files:**
- Create: `src/components/chat/ChatWidget.tsx`

- [ ] **Step 1: Crear el componente**

Crear `src/components/chat/ChatWidget.tsx`:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useChat } from './useChat';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Foco al input cuando se abre
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Panel de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-4 z-50 w-[360px] max-h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.08)]"
            style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #111 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}>
                  G
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">Gurú</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Asistente de movil.guru</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10 active:bg-white/20"
                aria-label="Cerrar chat"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'text-gray-200 rounded-bl-sm'
                    }`}
                    style={
                      msg.role === 'user'
                        ? { background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }
                        : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                  >
                    {msg.content || (
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={500}
                placeholder="Escribe tu consulta..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40 active:scale-95 flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}
                aria-label="Enviar"
              >
                {isLoading ? (
                  <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                  <Send size={15} className="text-white" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,107,53,0.4),0_2px_8px_rgba(0,0,0,0.2)]"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}
        aria-label="Abrir asistente Gurú"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/chat/ChatWidget.tsx
git commit -m "feat: add ChatWidget floating UI component"
```

---

## Task 6: Añadir ChatWidget al layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Importar y añadir ChatWidget**

Editar `src/app/layout.tsx`. El archivo actual tiene:

```tsx
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { ViewTransitions } from 'next-view-transitions';
import "./globals.css";
```

Añadir el import de ChatWidget y renderizarlo dentro de `<body>`:

```tsx
import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { ViewTransitions } from 'next-view-transitions';
import ChatWidget from '@/components/chat/ChatWidget';
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Movil Guru",
  description: "A comprehensive website with all components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="es">
        <body className={`${syne.variable} ${syne.className}`}>
          {children}
          <ChatWidget />
        </body>
      </html>
    </ViewTransitions>
  );
}
```

- [ ] **Step 2: Verificar que compila sin errores**

```bash
npm run build 2>&1 | tail -20
```

Salida esperada: `✓ Compiled successfully` sin errores de TypeScript. Si hay errores, corregirlos antes de continuar.

- [ ] **Step 3: Prueba manual completa**

Arrancar el servidor:

```bash
npm run dev
```

Abrir `http://localhost:3000` y verificar:
1. El botón naranja flotante aparece en la esquina inferior derecha.
2. Al hacer clic se abre el panel con el mensaje de bienvenida de Gurú.
3. Escribir "¿Cuánto cuesta cambiar la pantalla?" y pulsar Enter.
4. Gurú responde en tiempo real (efecto streaming).
5. El widget aparece en otras páginas (p.ej. `/tienda`, `/faq`).
6. Al cerrar y reabrir, el historial se mantiene (está en memoria React).

- [ ] **Step 4: Commit final**

```bash
git add src/app/layout.tsx
git commit -m "feat: add Gurú AI chat widget to root layout"
```

---

## Notas para la implementación

**Si `buscar_productos` falla** (tabla `products` no existe en Supabase): la tool devuelve el error de Supabase. En ese caso, revisar el nombre real de la tabla en el panel de Supabase y actualizar `src/lib/chat/tools.ts` en el case `buscar_productos`.

**Si `ver_mis_reservas` no encuentra reservas por email**: la query usa `email` del usuario. Si el campo en `reservations` no coincide con el email del auth, ajustar la query a `.eq('user_id', userId)` según el esquema real de la tabla.

**Rate limiting**: no está implementado en este plan. Si el tráfico lo requiere, añadir middleware de Next.js con un contador en Redis o similar como mejora futura.
