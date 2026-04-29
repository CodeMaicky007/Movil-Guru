import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';

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
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 512,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          ],
        });

        const text = response.choices[0].message.content ?? '';
        const words = text.split(' ');
        for (let i = 0; i < words.length; i++) {
          controller.enqueue(encoder.encode(i < words.length - 1 ? words[i] + ' ' : words[i]));
          await new Promise((r) => setTimeout(r, 15));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[chat] error:', msg);
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
