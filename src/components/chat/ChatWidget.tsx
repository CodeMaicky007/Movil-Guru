'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, ExternalLink } from 'lucide-react';
import { useChat } from './useChat';

const NAV_REGEX = /\[\[NAV:([^|]+)\|([^\]]+)\]\]/g;

function parseMessageContent(content: string): Array<{ type: 'text'; text: string } | { type: 'nav'; ruta: string; label: string }> {
  const parts: Array<{ type: 'text'; text: string } | { type: 'nav'; ruta: string; label: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  NAV_REGEX.lastIndex = 0;
  while ((match = NAV_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', text: content.slice(lastIndex, match.index) });
    parts.push({ type: 'nav', ruta: match[1], label: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) parts.push({ type: 'text', text: content.slice(lastIndex) });
  return parts;
}

/* Liquid blob shapes — organic polygon keyframes */
const BLOB_SHAPES = [
  'polygon(50% 0%, 80% 10%, 100% 35%, 90% 70%, 60% 100%, 30% 95%, 5% 70%, 0% 35%, 20% 10%)',
  'polygon(40% 0%, 85% 5%, 100% 45%, 85% 85%, 55% 100%, 15% 90%, 0% 55%, 10% 15%, 25% 2%)',
  'polygon(55% 0%, 90% 15%, 98% 50%, 80% 90%, 50% 100%, 20% 88%, 2% 55%, 12% 20%, 35% 2%)',
  'polygon(45% 2%, 78% 8%, 100% 40%, 88% 78%, 58% 98%, 22% 95%, 0% 60%, 8% 25%, 28% 5%)',
  'polygon(52% 0%, 83% 12%, 100% 42%, 87% 75%, 55% 100%, 25% 92%, 3% 62%, 10% 22%, 30% 3%)',
];

function LiquidButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const [blobIdx, setBlobIdx] = useState(0);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setBlobIdx(i => (i + 1) % BLOB_SHAPES.length), 1800);
    return () => clearInterval(id);
  }, []);

  function handleClick() {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    onClick();
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 flex items-center justify-center focus-visible:outline-none"
      aria-label={open ? 'Cerrar asistente Gurú' : 'Abrir asistente Gurú'}
      style={{ filter: 'drop-shadow(0 8px 28px rgba(0,56,255,0.5))' }}
    >
      {/* Animated liquid blob */}
      <motion.span
        className="absolute inset-0"
        animate={{ clipPath: BLOB_SHAPES[blobIdx] }}
        transition={{ duration: 1.8, ease: [0.37, 0, 0.63, 1] }}
        style={{ background: 'linear-gradient(135deg, #0038FF 0%, #0025cc 100%)' }}
      />

      {/* Neon accent shimmer */}
      <motion.span
        className="absolute inset-0"
        animate={{ clipPath: BLOB_SHAPES[(blobIdx + 2) % BLOB_SHAPES.length], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle at 70% 30%, #CCFF00 0%, transparent 65%)' }}
      />

      {/* Click ripple */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            key="ripple"
            className="absolute"
            initial={{ width: 16, height: 16, borderRadius: '50%', x: -8, y: -8, opacity: 0.7 }}
            animate={{ width: 80, height: 80, x: -40, y: -40, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ background: '#0038FF', position: 'absolute', top: '50%', left: '50%' }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="relative z-10">
            <X size={22} className="text-white" strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} className="relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guru-bot.png" alt="Gurú" className="w-8 h-8 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
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
    const id = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(id);
  }, [open]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-28 right-6 z-50 flex flex-col"
            style={{
              width: 360,
              maxHeight: 560,
              borderRadius: 20,
              background: '#ffffff',
              border: '1.5px solid rgba(0,56,255,0.1)',
              boxShadow: '0 24px 72px rgba(0,56,255,0.12), 0 4px 16px rgba(0,0,0,0.07)',
              overflow: 'hidden',
              fontFamily: 'var(--font-display, Syne, sans-serif)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Chat con Gurú"
            onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ background: '#0038FF' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/guru-bot.png" alt="" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  </div>
                  {/* Online indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: '#CCFF00', border: '2px solid #0038FF' }}
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-none" style={{ letterSpacing: '-0.02em' }}>Gurú</p>
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: '#CCFF00' }}>Asistente de movil.guru</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/15 active:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Cerrar chat"
              >
                <X size={16} className="text-white/80" />
              </button>
            </div>

            {/* Accent stripe */}
            <div className="h-[3px] flex-shrink-0" style={{ background: 'linear-gradient(90deg, #CCFF00 0%, #0038FF 50%, #CCFF00 100%)' }} />

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent', background: '#f8f9ff' }}
              role="log"
              aria-live="polite"
            >
              {messages.map(msg => {
                const parts = msg.content ? parseMessageContent(msg.content) : [];
                const textParts = parts.filter(p => p.type === 'text');
                const navParts = parts.filter(p => p.type === 'nav');
                const textContent = textParts.map(p => p.type === 'text' ? p.text.trim() : '').join(' ').trim();

                return (
                  <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {(textContent || parts.length === 0) && (
                      <div
                        className="max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed"
                        style={msg.role === 'user' ? {
                          background: '#0038FF',
                          color: '#ffffff',
                          borderRadius: '16px 16px 4px 16px',
                          fontWeight: 600,
                          boxShadow: '0 2px 12px rgba(0,56,255,0.28)',
                          letterSpacing: '-0.01em',
                        } : {
                          background: '#ffffff',
                          color: '#0f172a',
                          borderRadius: '16px 16px 16px 4px',
                          border: '1px solid rgba(0,56,255,0.1)',
                          boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                        }}
                      >
                        {parts.length === 0 ? (
                          <span className="flex items-center gap-1.5">
                            {[0, 150, 300].map(delay => (
                              <span key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#0038FF', animationDelay: `${delay}ms` }} />
                            ))}
                          </span>
                        ) : textContent}
                      </div>
                    )}
                    {navParts.map((p, i) => p.type === 'nav' ? (
                      <a
                        key={i}
                        href={p.ruta}
                        className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF]"
                        style={{
                          background: '#CCFF00',
                          color: '#0a0a0a',
                          borderRadius: 10,
                          padding: '8px 14px',
                          letterSpacing: '-0.01em',
                          boxShadow: '0 3px 10px rgba(204,255,0,0.4)',
                        }}
                      >
                        <ExternalLink size={13} strokeWidth={2.5} />
                        {p.label}
                      </a>
                    ) : null)}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ background: '#ffffff', borderTop: '1px solid rgba(0,56,255,0.08)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                maxLength={500}
                placeholder="Escribe tu consulta..."
                disabled={isLoading}
                className="flex-1 text-sm outline-none disabled:opacity-50 placeholder:text-slate-400"
                style={{
                  background: '#f0f4ff',
                  border: '1.5px solid rgba(0,56,255,0.12)',
                  borderRadius: 10,
                  padding: '9px 14px',
                  color: '#0f172a',
                  fontFamily: 'var(--font-display, Syne, sans-serif)',
                  fontWeight: 500,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#0038FF')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,56,255,0.12)')}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] flex-shrink-0"
                style={{ background: '#0038FF', boxShadow: '0 2px 12px rgba(0,56,255,0.35)' }}
                aria-label="Enviar"
              >
                {isLoading
                  ? <Loader2 size={16} className="text-white animate-spin" />
                  : <Send size={15} className="text-white" strokeWidth={2.5} />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LiquidButton open={open} onClick={() => setOpen(v => !v)} />
    </>
  );
}
