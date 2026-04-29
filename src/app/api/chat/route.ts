import Groq from 'groq-sdk';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import { TOOL_DEFINITIONS, executeTool, ToolInput } from '@/lib/chat/tools';

export const dynamic = 'force-dynamic';

const MAX_MESSAGES = 20;
const MAX_INPUT_LENGTH = 500;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return new Response('Servicio no disponible.', { status: 503 });
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const body = await req.json().catch(() => ({}));
  const rawMessages: { role: 'user' | 'assistant'; content: string }[] = body.messages ?? [];

  if (!Array.isArray(rawMessages)) {
    return new Response('Formato inválido.', { status: 400 });
  }
  for (const m of rawMessages) {
    if (m.role !== 'user' && m.role !== 'assistant') {
      return new Response('Rol de mensaje inválido.', { status: 400 });
    }
    if (typeof m.content !== 'string') {
      return new Response('Contenido de mensaje inválido.', { status: 400 });
    }
  }

  const lastUser = rawMessages.filter((m) => m.role === 'user').at(-1);
  if (lastUser && lastUser.content.length > MAX_INPUT_LENGTH) {
    return new Response('Mensaje demasiado largo.', { status: 400 });
  }

  const messages = rawMessages.slice(-MAX_MESSAGES);

  let userId: string | null = null;
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // Supabase not configured or unavailable — proceed without user context
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        type ChatMessage =
          | { role: 'system' | 'user' | 'assistant'; content: string }
          | { role: 'tool'; tool_call_id: string; content: string };

        const conversationMessages: ChatMessage[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        ];

        let continueLoop = true;
        let iterations = 0;
        const MAX_TOOL_ITERATIONS = 5;
        let navLink: { ruta: string; label: string } | null = null;

        while (continueLoop) {
          if (iterations++ >= MAX_TOOL_ITERATIONS) {
            controller.enqueue(encoder.encode('Lo siento, no he podido completar la solicitud en este momento.'));
            break;
          }

          const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 1024,
            tools: TOOL_DEFINITIONS,
            tool_choice: 'auto',
            messages: conversationMessages as Parameters<typeof groq.chat.completions.create>[0]['messages'],
          });

          const choice = response.choices[0];
          const message = choice.message;

          if (choice.finish_reason === 'tool_calls' && message.tool_calls?.length) {
            conversationMessages.push({
              role: 'assistant',
              content: message.content ?? '',
              // @ts-expect-error tool_calls is valid here
              tool_calls: message.tool_calls,
            });

            for (const toolCall of message.tool_calls) {
              const input = JSON.parse(toolCall.function.arguments || '{}') as ToolInput;
              const result = await executeTool(toolCall.function.name, input, userId);

              // Capturar el destino de navegar_a para inyectarlo al final del stream
              if (toolCall.function.name === 'navegar_a') {
                try {
                  navLink = JSON.parse(result) as { ruta: string; label: string };
                } catch { /* ignorar */ }
              }

              conversationMessages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: result,
              });
            }
          } else {
            // Respuesta final — enviar al cliente palabra a palabra
            const text = message.content ?? '';
            const words = text.split(' ');
            for (let i = 0; i < words.length; i++) {
              const chunk = i === words.length - 1 ? words[i] : words[i] + ' ';
              controller.enqueue(encoder.encode(chunk));
              await new Promise((r) => setTimeout(r, 15));
            }

            // Si hubo navegación, añadir token especial que el widget convierte en botón
            if (navLink) {
              controller.enqueue(encoder.encode(`\n[[NAV:${navLink.ruta}|${navLink.label}]]`));
            }

            continueLoop = false;
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : '';
        console.error('[chat] error:', msg, stack);
        controller.enqueue(encoder.encode('Lo siento, ha ocurrido un error. Inténtalo de nuevo.'));
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
