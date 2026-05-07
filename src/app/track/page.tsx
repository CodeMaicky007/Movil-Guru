"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

// ─── Tipos (los datos vienen del endpoint real /api/track/[code]) ──────────
type RepairStatus = "recibido" | "diagnostico" | "reparando" | "control" | "listo" | "cancelada";

interface RepairResult {
  code: string;
  device: string;
  issue: string;
  status: RepairStatus;
  created_at: string;
  scheduled_for: string | null;
  store: string | null;
  technician: string | null;
  steps: { key: RepairStatus; label: string; time: string | null; done: boolean }[];
}

function fmtShort(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch { return iso; }
}

function pickupHint(r: { status: RepairStatus; scheduled_for: string | null }): string {
  if (r.status === "listo") return "Disponible para recoger";
  if (r.status === "cancelada") return "—";
  if (r.scheduled_for) {
    try {
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit",
      }).format(new Date(r.scheduled_for));
    } catch { return r.scheduled_for; }
  }
  return "Te avisaremos cuando esté lista";
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: RepairStatus }) {
  const map: Record<RepairStatus, { label: string; bg: string; text: string }> = {
    recibido:    { label: "Recibido",            bg: "bg-white/15",      text: "text-white"       },
    diagnostico: { label: "En diagnóstico",      bg: "bg-amber-100",     text: "text-amber-700"   },
    reparando:   { label: "En reparación",       bg: "bg-white/15",      text: "text-white"       },
    control:     { label: "Control de calidad",  bg: "bg-purple-100",    text: "text-purple-700"  },
    listo:       { label: "Listo para recoger",  bg: "bg-[#CCFF00]/90",  text: "text-black"       },
    cancelada:   { label: "Cancelada",           bg: "bg-red-100",       text: "text-red-700"     },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      <span className="relative flex h-2 w-2">
        {status !== "listo" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40" />
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
      </span>
      {s.label}
    </span>
  );
}

function Timeline({ steps }: { steps: RepairResult["steps"] }) {
  return (
    <div className="relative pl-6 mt-6 space-y-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="relative pb-6 last:pb-0"
          >
            {!isLast && (
              <div
                className="absolute left-[-18px] top-[22px] w-0.5 h-[calc(100%-6px)]"
                style={{ backgroundColor: step.done ? "#0038FF" : "#080e1415" }}
              />
            )}
            <div
              className="absolute left-[-22px] top-[6px] w-[9px] h-[9px] rounded-full border-2"
              style={{
                borderColor: step.done ? "#0038FF" : "#080e1420",
                backgroundColor: step.done ? "#0038FF" : "white",
              }}
            />
            <p className={`text-sm font-semibold leading-tight ${step.done ? "text-[#080e14]" : "text-[#080e14]/35"}`}>
              {step.label}
            </p>
            {step.done && step.time && <p className="text-xs text-[#080e14]/40 mt-0.5">{fmtShort(step.time)}</p>}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackPageContent />
    </Suspense>
  );
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [code, setCode]         = useState("");
  const [result, setResult]     = useState<RepairResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const search = useCallback(async (rawCode: string) => {
    const trimmed = rawCode.trim().toUpperCase();
    setResult(null);
    setNotFound(false);
    setError(null);
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(trimmed)}`, { cache: 'no-store' });
      if (res.status === 404) {
        setNotFound(true);
      } else if (!res.ok) {
        setError("No pudimos comprobar el estado. Inténtalo de nuevo en un momento.");
      } else {
        const data = await res.json();
        setResult(data.reservation ? { ...data.reservation, steps: data.steps } : null);
      }
    } catch {
      setError("Sin conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-buscar si llega ?code=MG-XXXX en la URL (deep link desde emails).
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setCode(urlCode);
      search(urlCode);
    }
  }, [searchParams, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    search(code);
  }

  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero con Lamp ── */}
      <LampContainer className="min-h-screen">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            Movil Guru · Seguimiento
          </span>
        </motion.div>

        {/* Title */}
        <div className="flex flex-col gap-1 md:gap-2 text-center mb-8">
          <motion.h1
            initial={{ opacity: 0.5, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            className="text-[clamp(3rem,10vw,120px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0"
            style={{ fontFamily: 'var(--font-display), sans-serif', textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99" }}
          >
            RASTREAR
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0.5, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="text-[clamp(3rem,10vw,120px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            REPARACIÓN
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/60 text-sm md:text-base text-center max-w-md mb-10"
        >
          Introduce el código de tu reparación para ver el estado en tiempo real.
        </motion.p>

        {/* Search form — inside lamp */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full max-w-xl bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-2 flex items-center gap-2"
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej: MG-2026-4821"
            className="flex-1 px-5 py-4 text-base font-bold text-white placeholder:text-white/35 bg-transparent focus:outline-none tracking-widest uppercase"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#CCFF00] text-black font-black text-sm px-8 py-4 rounded-xl hover:bg-[#d9ff33] transition-colors duration-200 active:scale-95 disabled:opacity-60 shrink-0"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Buscando
              </span>
            ) : (
              "Rastrear"
            )}
          </button>
        </motion.form>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-white/35 mt-3"
        >
          Encuentra tu código en el correo de confirmación o en tu comprobante de tienda.
        </motion.p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-red-300 mt-3"
          >
            {error}
          </motion.p>
        )}
      </LampContainer>

      {/* ── Result ── */}
      <section className="max-w-3xl mx-auto px-6 relative z-20">
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.code}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-[#080e14]/8 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-[#080e14]/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-[#080e14]/35 mb-0.5">Código de reparación</p>
                    <p className="text-2xl font-black text-[#080e14] tracking-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>{result.code}</p>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Dispositivo", value: result.device },
                    { label: "Reparación",  value: result.issue },
                    ...(result.technician ? [{ label: "Técnico", value: result.technician }] : []),
                    ...(result.store ? [{ label: "Tienda", value: result.store }] : []),
                    { label: "Recogida",    value: pickupHint(result) },
                  ].map((d) => (
                    <div key={d.label}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#080e14]/30 mb-0.5">{d.label}</p>
                      <p className="text-sm font-semibold text-[#080e14]/75">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 md:p-8">
                <p className="text-xs font-black uppercase tracking-wider text-[#080e14]/35 mb-2">Progreso</p>
                <div className="w-full h-1.5 bg-[#080e14]/5 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.steps.filter((s) => s.done).length / result.steps.length) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: result.status === "listo" ? "linear-gradient(90deg, #0038FF, #CCFF00)" : "#0038FF" }}
                  />
                </div>
                <p className="text-xs text-[#080e14]/40 mb-4">
                  {result.steps.filter((s) => s.done).length} de {result.steps.length} pasos completados
                </p>
                <Timeline steps={result.steps} />

                {result.status === "listo" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-[#CCFF00]/15 border border-[#CCFF00]/40 rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center shrink-0">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <path d="M1 5l4 4L13 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#080e14]">¡Tu dispositivo está listo!</p>
                      <p className="text-xs text-[#080e14]/60 mt-0.5">
                        Puedes pasar a recogerlo en horario de taller. Recuerda traer tu comprobante de reparación.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-[#080e14]/5 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#080e14" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><path d="M8 11h6" />
                </svg>
              </div>
              <p className="text-lg font-bold text-[#080e14]">No encontramos esa reparación</p>
              <p className="text-sm text-[#080e14]/50 mt-1 max-w-sm mx-auto">
                Verifica que el código sea correcto. Lo encontrarás en tu comprobante con el formato MG-XXXX-XXXX.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── How it works ── */}
      <section className="bg-[#080e14] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-3">Transparencia total</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>
              Sabes exactamente <span className="text-[#0038FF]">dónde está</span> tu <span className="text-[#CCFF00]">móvil</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { tag: "01", titleParts: ["Seguimiento en ", "tiempo real"],   desc: "Cada fase de la reparación se actualiza al instante. Sin llamadas, sin esperas por información." },
              { tag: "02", titleParts: ["Notificación ", "automática"],       desc: "Recibes un mensaje por WhatsApp o SMS cuando tu dispositivo cambia de estado y cuando está listo." },
              { tag: "03", titleParts: ["Historial ", "completo"],            desc: "Fecha y hora de cada paso. Quién realizó la reparación. Qué pieza se instaló. Todo documentado." },
            ].map((item, i) => (
              <motion.div
                key={item.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-white/8 rounded-2xl p-6"
              >
                <p className="text-4xl font-black mb-4 leading-none" style={{ fontFamily: 'var(--font-display), sans-serif', WebkitTextStroke: "1.5px #CCFF00", color: "transparent" }}>
                  {item.tag}
                </p>
                <h3 className="text-white font-bold text-base mb-2">
                  {item.titleParts[0]}<span className="text-[#CCFF00]">{item.titleParts[1]}</span>
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-[#0038FF] overflow-hidden p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4" style={{ fontFamily: "var(--font-display, inherit)" }}>
              ¿Necesitas una reparación?<br /><span className="text-[#CCFF00]">Reserva ahora.</span>
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto mb-8">Diagnóstico gratuito. La mayoría de reparaciones en menos de 1 hora.</p>
            <a href="/marcas" className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-black text-base px-8 py-3.5 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95">
              Reservar reparación
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
