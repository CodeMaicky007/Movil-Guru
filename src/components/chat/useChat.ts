'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Mensajes enviados al API: solo los últimos N intercambios para ahorrar tokens.
// El usuario ve toda la conversación en pantalla, pero la IA solo recibe contexto reciente.
const CONTEXT_WINDOW = 6; // 3 intercambios usuario/asistente

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy Gurú, tu asistente de movil.guru. ¿En qué te puedo ayudar hoy?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(messages);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      // Solo enviamos los últimos CONTEXT_WINDOW mensajes al API (sin el mensaje de bienvenida)
      const history = [...messagesRef.current, userMessage]
        .filter((m) => m.id !== 'welcome')
        .slice(-CONTEXT_WINDOW)
        .map(({ role, content }) => ({ role, content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: abort.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
          );
        }
        const remaining = decoder.decode();
        if (remaining) {
          accumulated += remaining;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m)),
          );
        }
      } finally {
        reader.cancel();
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
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
  }, [isLoading]);

  return { messages, sendMessage, isLoading };
}
