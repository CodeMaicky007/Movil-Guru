'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, ExternalLink } from 'lucide-react';
import { useChat } from './useChat';

const NAV_REGEX = /\[\[NAV:([^|]+)\|([^\]]+)\]\]/g;

function parseMessageContent(content: string): Array<{ type: 'text'; text: string } | { type: 'nav'; ruta: string; label: string }> {
  const parts: Array<{ type: 'text'; text: string } | { type: 'nav'; ruta: string; label: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  NAV_REGEX.lastIndex = 0;
  while ((match = NAV_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'nav', ruta: match[1], label: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', text: content.slice(lastIndex) });
  }
  return parts;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(id);
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
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-24 right-4 z-50 w-[360px] max-h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.08)]"
            style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Chat con Gurú"
            onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
          >
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
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10 active:bg-white/20 focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:outline-none"
                aria-label="Cerrar chat"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }} role="log" aria-live="polite" aria-label="Conversación con Gurú">
              {messages.map((msg) => {
                const parts = msg.content ? parseMessageContent(msg.content) : [];
                return (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                    {/* Burbuja de texto */}
                    {(parts.length === 0 || parts.some((p) => p.type === 'text' && p.text.trim())) && (
                      <div
                        className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' ? 'text-white rounded-br-sm' : 'text-gray-200 rounded-bl-sm'
                        }`}
                        style={
                          msg.role === 'user'
                            ? { background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }
                            : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }
                        }
                      >
                        {parts.length === 0 ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        ) : (
                          parts.filter((p) => p.type === 'text').map((p, i) =>
                            p.type === 'text' ? <span key={i}>{p.text.trim()}</span> : null
                          )
                        )}
                      </div>
                    )}
                    {/* Botones de navegación */}
                    {parts.filter((p) => p.type === 'nav').map((p, i) =>
                      p.type === 'nav' ? (
                        <a
                          key={i}
                          href={p.ruta}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 active:opacity-75 focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:outline-none"
                          style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}
                        >
                          <ExternalLink size={14} />
                          {p.label}
                        </a>
                      ) : null
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

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
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40 active:scale-95 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:outline-none"
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

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(255,107,53,0.4),0_2px_8px_rgba(0,0,0,0.2)]"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C42)' }}
        aria-label={open ? 'Cerrar asistente Gurú' : 'Abrir asistente Gurú'}
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
