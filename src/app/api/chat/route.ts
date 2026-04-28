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
            stream: false,
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
          } else {
            // stop_reason === 'end_turn': enviar la respuesta al cliente
            for (const block of response.content) {
              if (block.type === 'text') {
                const words = block.text.split(' ');
                for (let i = 0; i < words.length; i++) {
                  const chunk = i === words.length - 1 ? words[i] : words[i] + ' ';
                  controller.enqueue(encoder.encode(chunk));
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
