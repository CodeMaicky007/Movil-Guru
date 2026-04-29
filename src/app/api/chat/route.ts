import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';

export const dynamic = 'force-dynamic';

const MAX_MESSAGES = 20;
const MAX_INPUT_LENGTH = 500;

// Lee todas las keys disponibles. Soporta múltiples keys separadas por coma
// en GROQ_API_KEYS o GROQ_API_KEY (ambas variables, cualquier formato).
function getGroqKeys(): string[] {
  const raw = process.env.GROQ_API_KEYS ?? process.env.GROQ_API_KEY ?? '';
  return raw.split(',').map((k) => k.trim()).filter(Boolean);
}

function isRateLimit(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes('429') || msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('rate_limit');
}

// Intenta la llamada a Groq con cada key en orden.
// Si una devuelve 429, pasa automáticamente a la siguiente.
async function callGroq(
  keys: string[],
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
): Promise<string> {
  let lastError: unknown;

  for (let i = 0; i < keys.length; i++) {
    try {
      const groq = new Groq({ apiKey: keys[i] });
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 150,
        messages,
      });
      return response.choices[0].message.content ?? '';
    } catch (err) {
      lastError = err;
      if (isRateLimit(err) && i < keys.length - 1) {
        console.warn(`[chat] key ${i + 1} rate-limited, switching to key ${i + 2}`);
        continue;
      }
      break;
    }
  }

  throw lastError;
}

export async function POST(req: Request) {
  const keys = getGroqKeys();
  if (keys.length === 0) {
    return new Response('Servicio no disponible.', { status: 503 });
  }

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
        const text = await callGroq(keys, [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        ]);

        const words = text.split(' ');
        for (let i = 0; i < words.length; i++) {
          controller.enqueue(encoder.encode(i < words.length - 1 ? words[i] + ' ' : words[i]));
          await new Promise((r) => setTimeout(r, 15));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[chat] all keys failed:', msg);
        const reply = isRateLimit(err)
          ? 'Estoy recibiendo muchas consultas ahora mismo. Espera unos segundos e inténtalo de nuevo.'
          : 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.';
        controller.enqueue(encoder.encode(reply));
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
