"use client";
import dynamic from "next/dynamic";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Globe,
  Headphones,
  Wrench,
  Tag,
  ShieldCheck,
  Store,
  CheckCircle,
  Send,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquareQuote,
  Zap,
} from "lucide-react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

// ─── Categories ─────────────────────────────────────────────────────────────
const categories = [
  {
    key: "web",
    num: "01",
    icon: Globe,
    label: "Sitio web",
    desc: "Diseño, navegación, claridad de la información y velocidad de carga.",
  },
  {
    key: "soporte",
    num: "02",
    icon: Headphones,
    label: "Atención & Soporte",
    desc: "Rapidez de respuesta, trato del equipo y resolución de dudas.",
  },
  {
    key: "reparacion",
    num: "03",
    icon: Wrench,
    label: "Calidad de la reparación",
    desc: "Resultado técnico, acabado y tiempo de entrega del dispositivo.",
  },
  {
    key: "precio",
    num: "04",
    icon: Tag,
    label: "Precios & Transparencia",
    desc: "Relación calidad/precio y claridad del presupuesto sin sorpresas.",
  },
  {
    key: "garantia",
    num: "05",
    icon: ShieldCheck,
    label: "Garantía & Postventa",
    desc: "Cumplimiento, claridad de las condiciones y atención posterior.",
  },
  {
    key: "tienda",
    num: "06",
    icon: Store,
    label: "Tienda física",
    desc: "Ambiente, comodidad y profesionalidad del personal en tienda.",
  },
] as const;

const services = [
  "Pantalla",
  "Batería",
  "Cámara",
  "Conector de carga",
  "Daño por agua",
  "Placa base",
  "Plegables",
  "Recuperación de datos",
  "Tienda online",
  "Presupuesto",
];

const labelByScore: Record<number, string> = {
  0: "Sin valorar",
  1: "Muy malo",
  2: "Mejorable",
  3: "Aceptable",
  4: "Muy bueno",
  5: "Excelente",
};

// ─── Star rating ────────────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const active = i <= display;
          return (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange(i === value ? 0 : i)}
              className="group relative p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70"
              aria-label={`${i} estrellas`}
            >
              <Star
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-150 ${
                  active ? "scale-100" : "scale-95 group-hover:scale-100"
                }`}
                strokeWidth={2.4}
                style={{
                  color: active ? "#CCFF00" : "rgba(255,255,255,0.18)",
                  fill: active ? "#CCFF00" : "transparent",
                  filter: active
                    ? "drop-shadow(0 0 12px rgba(204,255,0,0.55))"
                    : "none",
                }}
              />
            </button>
          );
        })}
      </div>
      <span
        className={`text-xs font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-md transition-colors ${
          display
            ? "bg-[#CCFF00]/10 text-[#CCFF00]"
            : "bg-white/[0.04] text-white/35"
        }`}
      >
        {labelByScore[display] ?? "Sin valorar"}
      </span>
    </div>
  );
}

// ─── NPS scale ──────────────────────────────────────────────────────────────
function NPSScale({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (n: number) => void;
}) {
  const colorFor = (n: number) => {
    if (n <= 6) return { bg: "#FF3B30", text: "#fff" };
    if (n <= 8) return { bg: "#FFB020", text: "#000" };
    return { bg: "#CCFF00", text: "#000" };
  };
  return (
    <div>
      <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
        {Array.from({ length: 11 }, (_, n) => {
          const selected = value === n;
          const c = colorFor(n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="relative aspect-square rounded-xl border font-black text-base sm:text-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70"
              style={
                selected
                  ? {
                      background: c.bg,
                      color: c.text,
                      borderColor: "transparent",
                      boxShadow: `0 6px 24px ${c.bg}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
                      transform: "translateY(-2px)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      color: "rgba(255,255,255,0.7)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }
              }
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white/35 font-bold">
        <span>Nada probable</span>
        <span>Muy probable</span>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
type Ratings = Record<(typeof categories)[number]["key"], number>;

export default function ValoracionPage() {
  const [ratings, setRatings] = useState<Ratings>({
    web: 0,
    soporte: 0,
    reparacion: 0,
    precio: 0,
    garantia: 0,
    tienda: 0,
  });
  const [usedServices, setUsedServices] = useState<string[]>([]);
  const [nps, setNps] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<"si" | "tal_vez" | "no" | null>(
    null
  );
  const [bestThing, setBestThing] = useState("");
  const [improvement, setImprovement] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const totalScore = useMemo(() => {
    const vals = Object.values(ratings).filter((v) => v > 0);
    if (!vals.length) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [ratings]);

  const completedCount = Object.values(ratings).filter((v) => v > 0).length;
  const completion = Math.round(
    ((completedCount / categories.length) * 0.6 +
      (nps !== null ? 0.2 : 0) +
      (recommend ? 0.1 : 0) +
      (consent ? 0.1 : 0)) *
      100
  );

  function toggleService(s: string) {
    setUsedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  }

  return (
    <main className="w-full bg-[#060d12] min-h-screen text-white">
      <Header dark />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#0038FF] overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 px-6">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.22),transparent_60%)] pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d12] to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2"
          >
            <span className="bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00] text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-[0.22em]">
              <Sparkles className="inline w-3 h-3 mr-1.5 -mt-0.5" />
              Movil Guru · Encuesta de satisfacción
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.6rem,13vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0 whitespace-nowrap"
            style={{
              fontFamily: "var(--font-display), sans-serif",
              textShadow: "3px 3px 0 #001A99, 6px 6px 0 #001A99",
            }}
          >
            TU OPINIÓN
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.6rem,13vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 whitespace-nowrap"
            style={{
              fontFamily: "var(--font-display), sans-serif",
              textShadow: "3px 3px 0 #001A99, 6px 6px 0 #001A99",
            }}
          >
            VALE ORO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 text-white/85 text-base md:text-lg max-w-2xl mx-auto"
            style={{ lineHeight: 1.7 }}
          >
            Tu opinión nos hace crecer. Califica cada parte de Movil Guru — la
            web, el soporte, la reparación — y dinos qué hacemos bien y qué
            podemos mejorar. <span className="text-[#CCFF00] font-bold">2 minutos.</span>
          </motion.p>

          {/* Hero stats pills */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { v: "4.9★", l: "Valoración media" },
              { v: "10.000+", l: "Opiniones recogidas" },
              { v: "99%", l: "Recomienda Movil Guru" },
            ].map((s) => (
              <div
                key={s.l}
                className="flex items-center gap-2 bg-black/30 backdrop-blur border border-white/15 rounded-full px-4 py-2"
              >
                <span
                  className="text-[#CCFF00] font-black text-sm"
                  style={{ textShadow: "0 0 14px rgba(204,255,0,0.45)" }}
                >
                  {s.v}
                </span>
                <span className="text-white/70 text-xs font-medium">{s.l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SUCCESS state ──────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.section
            key="sent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative px-6 py-20 md:py-28"
          >
            <div className="max-w-3xl mx-auto">
              <div
                className="relative bg-[#0a141c] border-2 border-[#CCFF00]/40 rounded-3xl p-10 md:p-14 text-center overflow-hidden"
                style={{ boxShadow: "0 0 80px rgba(204,255,0,0.12)" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.08),transparent_70%)] pointer-events-none" />
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#CCFF00]/15 mx-auto flex items-center justify-center mb-6">
                    <CheckCircle className="w-11 h-11 text-[#CCFF00]" />
                  </div>
                  <p className="text-[#CCFF00] text-xs font-black uppercase tracking-[0.3em] mb-3">
                    Valoración recibida
                  </p>
                  <h2
                    className="text-4xl md:text-6xl font-black mb-5 leading-[0.95]"
                    style={{
                      fontFamily: "var(--font-display), sans-serif",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    ¡Gracias por tu tiempo!
                  </h2>
                  <p
                    className="text-white/65 max-w-md mx-auto mb-3"
                    style={{ lineHeight: 1.7 }}
                  >
                    Cada respuesta llega directa al equipo. La leeremos de
                    verdad y la usaremos para seguir mejorando Movil Guru.
                  </p>
                  {totalScore > 0 && (
                    <p className="text-white/45 text-sm mb-8">
                      Has dado una media de{" "}
                      <span className="text-[#CCFF00] font-black">
                        {totalScore.toFixed(1)} / 5
                      </span>{" "}
                      en {completedCount} categoría
                      {completedCount === 1 ? "" : "s"}.
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="/"
                      className="inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-black text-sm px-7 py-3.5 rounded-full hover:scale-[1.03] active:scale-95 transition-transform"
                      style={{ boxShadow: "0 0 24px rgba(204,255,0,0.4)" }}
                    >
                      Volver al inicio
                    </a>
                    <a
                      href="/opiniones"
                      className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-bold text-sm px-7 py-3.5 rounded-full hover:border-white/60 hover:bg-white/10 transition"
                    >
                      Ver más opiniones
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            {/* ── PROGRESS sticky bar ─────────────────────────────────── */}
            <div className="sticky top-0 z-40 bg-[#060d12]/85 backdrop-blur-md border-b border-white/8">
              <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
                <Zap className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#CCFF00] to-[#a8d600]"
                    animate={{ width: `${completion}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ boxShadow: "0 0 12px rgba(204,255,0,0.55)" }}
                  />
                </div>
                <span className="text-xs font-black text-white/70 tabular-nums w-10 text-right">
                  {completion}%
                </span>
              </div>
            </div>

            {/* ── SECTION: services used ──────────────────────────────── */}
            <section className="px-6 pt-16 pb-10">
              <div className="max-w-3xl mx-auto">
                <SectionHeader
                  num="00"
                  title="¿Qué servicios has usado?"
                  desc="Marca todo lo que aplique. Nos ayuda a contextualizar tu valoración."
                />
                <div className="flex flex-wrap gap-2.5 mt-7">
                  {services.map((s) => {
                    const active = usedServices.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        className="group relative px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70"
                        style={
                          active
                            ? {
                                background: "#CCFF00",
                                color: "#000",
                                borderColor: "transparent",
                                boxShadow: "0 6px 20px rgba(204,255,0,0.35)",
                              }
                            : {
                                background: "rgba(255,255,255,0.03)",
                                color: "rgba(255,255,255,0.75)",
                                borderColor: "rgba(255,255,255,0.12)",
                              }
                        }
                      >
                        {active && (
                          <CheckCircle className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
                        )}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ── SECTION: per-category ratings ───────────────────────── */}
            <section className="px-6 py-10">
              <div className="max-w-3xl mx-auto">
                <SectionHeader
                  num="A"
                  title="Puntúa cada parte"
                  desc="Una estrella es muy malo, cinco es excelente. Sé honesto: leemos cada respuesta."
                />
                <div className="mt-8 space-y-5">
                  {categories.map((c, i) => (
                    <RatingCard
                      key={c.key}
                      index={i}
                      num={c.num}
                      Icon={c.icon}
                      label={c.label}
                      desc={c.desc}
                      value={ratings[c.key]}
                      onChange={(v) =>
                        setRatings((prev) => ({ ...prev, [c.key]: v }))
                      }
                    />
                  ))}
                </div>

                {/* live average */}
                {totalScore > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6 flex items-center justify-between bg-[#0038FF]/15 border border-[#0038FF]/40 rounded-2xl px-5 py-4"
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/45 font-black">
                        Tu valoración media
                      </p>
                      <p
                        className="text-2xl font-black text-[#CCFF00]"
                        style={{ textShadow: "0 0 18px rgba(204,255,0,0.4)" }}
                      >
                        {totalScore.toFixed(1)} <span className="text-white/40 text-base font-bold">/ 5</span>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-5 h-5"
                          style={{
                            color: i <= Math.round(totalScore) ? "#CCFF00" : "rgba(255,255,255,0.18)",
                            fill: i <= Math.round(totalScore) ? "#CCFF00" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </section>

            {/* ── SECTION: NPS ────────────────────────────────────────── */}
            <section className="px-6 py-10">
              <div className="max-w-3xl mx-auto">
                <SectionHeader
                  num="B"
                  title="¿Nos recomendarías a un amigo?"
                  desc="Del 0 al 10. Es la pregunta que más nos importa de toda la encuesta."
                />
                <div className="mt-8">
                  <NPSScale value={nps} onChange={setNps} />
                </div>

                {/* Recommend yes/maybe/no */}
                <div className="mt-10">
                  <p className="text-[10px] uppercase tracking-[0.25em] font-black text-white/45 mb-4">
                    Y de forma directa…
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { k: "si", label: "Sí, sin duda", icon: ThumbsUp, color: "#CCFF00" },
                      { k: "tal_vez", label: "Tal vez", icon: MessageSquareQuote, color: "#FFB020" },
                      { k: "no", label: "No", icon: ThumbsDown, color: "#FF3B30" },
                    ].map((o) => {
                      const active = recommend === o.k;
                      const Icon = o.icon;
                      return (
                        <button
                          key={o.k}
                          type="button"
                          onClick={() => setRecommend(o.k as typeof recommend)}
                          className="relative px-3 py-4 rounded-2xl border font-bold text-sm flex flex-col items-center gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00]/70"
                          style={
                            active
                              ? {
                                  background: o.color,
                                  color: o.color === "#FF3B30" ? "#fff" : "#000",
                                  borderColor: "transparent",
                                  boxShadow: `0 8px 28px ${o.color}55`,
                                  transform: "translateY(-2px)",
                                }
                              : {
                                  background: "rgba(255,255,255,0.03)",
                                  color: "rgba(255,255,255,0.7)",
                                  borderColor: "rgba(255,255,255,0.10)",
                                }
                          }
                        >
                          <Icon className="w-5 h-5" />
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION: open feedback ──────────────────────────────── */}
            <section className="px-6 py-10">
              <div className="max-w-3xl mx-auto">
                <SectionHeader
                  num="C"
                  title="Cuéntanos con tus palabras"
                  desc="Lo bueno, lo malo, y lo que falta. Sin filtro."
                />
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FeedbackTextarea
                    accent="#CCFF00"
                    label="Lo que más te gustó"
                    placeholder="Lo mejor de tu experiencia con Movil Guru…"
                    value={bestThing}
                    onChange={setBestThing}
                  />
                  <FeedbackTextarea
                    accent="#FFB020"
                    label="Lo que mejoraríamos"
                    placeholder="Algo que no funcionó, te frustró o falta…"
                    value={improvement}
                    onChange={setImprovement}
                  />
                </div>
              </div>
            </section>

            {/* ── SECTION: optional contact ───────────────────────────── */}
            <section className="px-6 py-10">
              <div className="max-w-3xl mx-auto">
                <SectionHeader
                  num="D"
                  title="¿Quieres que te contactemos?"
                  desc="Opcional. Solo si quieres que el equipo te responda directamente."
                />
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput
                    label="Nombre"
                    placeholder="Cómo te llamamos"
                    value={name}
                    onChange={setName}
                  />
                  <FieldInput
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={setEmail}
                  />
                </div>
              </div>
            </section>

            {/* ── SUBMIT bar ──────────────────────────────────────────── */}
            <section className="px-6 pt-6 pb-24">
              <div className="max-w-3xl mx-auto">
                <div
                  className="relative bg-[#0a141c] border border-white/10 rounded-3xl p-7 md:p-9"
                  style={{ boxShadow: "0 30px 80px -30px rgba(0,56,255,0.4)" }}
                >
                  <div className="absolute -top-3 left-7 bg-[#CCFF00] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.22em]">
                    Último paso
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#CCFF00] shrink-0"
                    />
                    <span className="text-white/55 text-xs leading-relaxed">
                      Acepto la{" "}
                      <a
                        href="/privacidad"
                        className="text-[#CCFF00]/80 underline underline-offset-2 hover:text-[#CCFF00]"
                      >
                        Política de Privacidad
                      </a>{" "}
                      y autorizo a Movil Guru a tratar las respuestas de esta
                      encuesta de forma anónima para mejorar el servicio.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!consent || loading}
                    className="group relative w-full flex items-center justify-center gap-2.5 bg-[#CCFF00] text-black font-black text-base py-5 rounded-2xl hover:translate-y-[-2px] active:translate-y-0 active:scale-[0.99] transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                    style={{
                      boxShadow:
                        "0 14px 40px rgba(204,255,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
                    }}
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar valoración
                        <span
                          className="ml-2 text-xs font-black bg-black text-[#CCFF00] px-2 py-1 rounded-md uppercase tracking-wider"
                          style={{ letterSpacing: "0.18em" }}
                        >
                          {completion}% completo
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-white/30 text-[11px] mt-4">
                    Tus respuestas se guardan de forma segura. Tiempo estimado:
                    menos de 2 minutos.
                  </p>
                </div>
              </div>
            </section>
          </motion.form>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionHeader({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start gap-5"
    >
      <div className="shrink-0 mt-1.5">
        <span
          className="block text-[#CCFF00] font-black text-3xl md:text-4xl leading-none"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            textShadow: "2px 2px 0 #001A99",
          }}
        >
          {num}
        </span>
        <div className="mt-2 h-[2px] w-8 bg-[#CCFF00]" />
      </div>
      <div>
        <h2
          className="text-2xl md:text-[34px] font-black leading-[1.05] text-white"
          style={{
            fontFamily: "var(--font-display), sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h2>
        <p className="text-white/45 text-sm md:text-[15px] mt-2 max-w-xl" style={{ lineHeight: 1.7 }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function RatingCard({
  index,
  num,
  Icon,
  label,
  desc,
  value,
  onChange,
}: {
  index: number;
  num: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const filled = value > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="relative group"
    >
      <div
        className="relative bg-[#0a141c] border rounded-3xl p-5 sm:p-6 transition-all duration-300"
        style={{
          borderColor: filled ? "rgba(204,255,0,0.35)" : "rgba(255,255,255,0.08)",
          boxShadow: filled
            ? "0 18px 50px -20px rgba(204,255,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div className="flex items-start gap-4">
          {/* number tag */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                filled
                  ? "bg-[#CCFF00] text-black"
                  : "bg-white/[0.04] border border-white/10 text-white/55"
              }`}
              style={
                filled ? { boxShadow: "0 8px 24px rgba(204,255,0,0.35)" } : {}
              }
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="mt-2 text-[10px] font-black tracking-[0.2em] text-white/35">
              {num}
            </span>
          </div>

          {/* label + desc + stars */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg md:text-xl font-black leading-tight"
              style={{
                fontFamily: "var(--font-display), sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {label}
            </h3>
            <p className="text-white/45 text-sm mt-1" style={{ lineHeight: 1.6 }}>
              {desc}
            </p>
            <div className="mt-4">
              <StarRating value={value} onChange={onChange} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeedbackTextarea({
  label,
  accent,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  accent: string;
  placeholder: string;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/55 mb-3">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}aa` }}
        />
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none transition-all resize-none"
        style={{
          ["--accent" as string]: accent,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = accent;
          e.currentTarget.style.boxShadow = `0 0 0 4px ${accent}22`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function FieldInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (s: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-black uppercase tracking-[0.22em] text-white/55 mb-3">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00]/60 transition-colors"
      />
    </div>
  );
}
