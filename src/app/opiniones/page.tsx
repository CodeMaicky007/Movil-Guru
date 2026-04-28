"use client";
import dynamic from "next/dynamic";
import React from "react";
import { motion } from "motion/react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);
const GooeyText = dynamic(
  () => import("@/components/ui/gooey-text-morphing").then((m) => m.GooeyText),
  { ssr: false }
);
const WavePath = dynamic(
  () => import("@/components/ui/wave-path").then((m) => m.WavePath),
  { ssr: false }
);
const Testimonials3D = dynamic(
  () => import("@/components/ui/3d-testimonials").then((m) => m.Testimonials3D),
  { ssr: false }
);
const AnimatedTestimonialGrid = dynamic(
  () => import("@/components/ui/testimonial-2").then((m) => m.AnimatedTestimonialGrid),
  { ssr: false }
);
const Gravity = dynamic(
  () => import("@/components/ui/gravity").then((m) => m.Gravity),
  { ssr: false }
);
const MatterBody = dynamic(
  () => import("@/components/ui/gravity").then((m) => m.MatterBody),
  { ssr: false }
);



// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "4.9★", label: "Valoración media" },
  { value: "10k+", label: "Clientes satisfechos" },
  { value: "99%", label: "Tasa de resolución" },
  { value: "∞", label: "Garantía en piezas" },
];

// --- SAMPLE DATA FOR TESTIMONIAL GRID ---
const gridTestimonials = [
  { imgSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300', alt: 'Professional Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300', alt: 'Smiling Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300', alt: 'Professional Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300', alt: 'Smiling Woman' },
  { imgSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300', alt: 'Man in a suit' },
  { imgSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300', alt: 'Bearded Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=300', alt: 'Man in a blue shirt' },
  { imgSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300', alt: 'Older Man' },
  { imgSrc: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=300', alt: 'Woman with curly hair' },
  { imgSrc: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300', alt: 'Woman in an office' },
  { imgSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300', alt: 'Woman with glasses' },
  { imgSrc: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300', alt: 'Woman with a dog' },
];



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OpinionesPage() {



  return (
    <main className="w-full bg-[#060d12] min-h-screen">
      <Header dark />

      {/* ── Hero — Gravity ──────────────────────────────────────────────────
           h-[720px] is REQUIRED: Gravity renders as `absolute top-0 left-0 w-full h-full`.
           Percentage height only resolves when the parent has an explicit height — not
           min-height. Without this, Matter.js measures 0 px, places the floor at y=10,
           and all bodies pile up instantly in the top-left corner.
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[720px] bg-[#0038FF] overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.2),transparent_60%)] pointer-events-none z-0" />

        {/* ── Gravity fills the full 720 px — bodies fall the whole height ── */}
        <Gravity gravity={{ x: 0, y: 1 }} addTopWall={false} className="w-full h-full z-10">

          {/* Lime highlight pills */}
          <MatterBody matterBodyOptions={{ friction: 0.45, restitution: 0.45, density: 0.002 }} x="14%" y="5%" angle={-6}>
            <div className="flex items-center gap-1.5 bg-[#CCFF00] text-black font-black text-sm px-5 py-2.5 rounded-full whitespace-nowrap shadow-[0_6px_24px_rgba(204,255,0,0.55)]">
              ⭐⭐⭐⭐⭐ &nbsp;5 / 5
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.45, restitution: 0.45, density: 0.0018 }} x="88%" y="8%" angle={-9}>
            <div className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2.5 rounded-full whitespace-nowrap shadow-[0_6px_24px_rgba(204,255,0,0.55)]">
              Garantía ∞
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.45, restitution: 0.45, density: 0.0018 }} x="4%" y="9%" angle={7}>
            <div className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2.5 rounded-full whitespace-nowrap shadow-[0_6px_24px_rgba(204,255,0,0.55)]">
              ⚡ 47 min avg.
            </div>
          </MatterBody>

          {/* White pills */}
          <MatterBody matterBodyOptions={{ friction: 0.45, restitution: 0.4, density: 0.002 }} x="72%" y="4%" angle={5}>
            <div className="flex items-center gap-2 bg-white text-[#0038FF] font-black text-sm px-5 py-2.5 rounded-full whitespace-nowrap shadow-xl">
              🏆 10.000+ satisfechos
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.45, restitution: 0.35, density: 0.0018 }} x="53%" y="7%" angle={-5}>
            <div className="bg-white/20 border border-white/50 text-white font-bold text-sm px-5 py-2.5 rounded-full whitespace-nowrap">
              🔧 Reparado hoy
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.45, restitution: 0.35, density: 0.0018 }} x="76%" y="13%" angle={9}>
            <div className="bg-white/20 border border-white/50 text-white font-bold text-sm px-5 py-2.5 rounded-full whitespace-nowrap">
              📱 Todas las marcas
            </div>
          </MatterBody>

          {/* Customer quote cards — white bg for maximum contrast */}
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.3, density: 0.003 }} x="38%" y="5%" angle={3}>
            <div className="bg-white text-[#060d12] text-xs font-semibold leading-snug px-4 py-3 rounded-2xl shadow-2xl border-l-[3px] border-[#CCFF00]" style={{maxWidth: 210}}>
              "En 40 minutos, pantalla como nueva"
              <span className="block mt-1 text-[10px] text-[#0038FF] font-black">— María G. ⭐⭐⭐⭐⭐</span>
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.25, density: 0.003 }} x="60%" y="9%" angle={-4}>
            <div className="bg-white text-[#060d12] text-xs font-semibold leading-snug px-4 py-3 rounded-2xl shadow-2xl border-l-[3px] border-[#CCFF00]" style={{maxWidth: 210}}>
              "Recuperaron TODAS mis fotos del móvil"
              <span className="block mt-1 text-[10px] text-[#0038FF] font-black">— Laura M. ⭐⭐⭐⭐⭐</span>
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.25, density: 0.003 }} x="20%" y="11%" angle={-5}>
            <div className="bg-white text-[#060d12] text-xs font-semibold leading-snug px-4 py-3 rounded-2xl shadow-2xl border-l-[3px] border-[#CCFF00]" style={{maxWidth: 200}}>
              "Precio justo y garantía de por vida"
              <span className="block mt-1 text-[10px] text-[#0038FF] font-black">— Carlos R. ⭐⭐⭐⭐⭐</span>
            </div>
          </MatterBody>

          {/* Brand pills */}
          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.4, density: 0.0015 }} x="82%" y="6%" angle={-8}>
            <div className="bg-black text-white font-black text-sm px-4 py-2.5 rounded-full whitespace-nowrap border border-white/30 shadow-lg">
              🍎 iPhone ✓
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.4, density: 0.0015 }} x="10%" y="5%" angle={8}>
            <div className="bg-[#1428A0] text-white font-black text-sm px-4 py-2.5 rounded-full whitespace-nowrap shadow-lg">
              Samsung ✓
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.45, density: 0.0015 }} x="47%" y="3%" angle={-3}>
            <div className="bg-[#FF6900] text-white font-black text-sm px-4 py-2.5 rounded-full whitespace-nowrap shadow-lg">
              Xiaomi ✓
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.45, density: 0.0015 }} x="28%" y="4%" angle={5}>
            <div className="bg-[#4285F4] text-white font-black text-sm px-4 py-2.5 rounded-full whitespace-nowrap shadow-lg">
              Pixel ✓
            </div>
          </MatterBody>

          <MatterBody matterBodyOptions={{ friction: 0.5, restitution: 0.4, density: 0.0015 }} x="65%" y="5%" angle={6}>
            <div className="bg-[#F5010C] text-white font-black text-sm px-4 py-2.5 rounded-full whitespace-nowrap shadow-lg">
              OnePlus ✓
            </div>
          </MatterBody>
        </Gravity>

        {/* ── Heading floats above gravity ─── pointer-events-none lets clicks pass through ── */}
        <div className="absolute inset-x-0 top-0 z-20 flex flex-col items-center pt-16 md:pt-20 px-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span className="bg-[#CCFF00]/15 border border-[#CCFF00]/30 text-[#CCFF00] text-[9px] sm:text-xs font-black px-3 sm:px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
              Movil Guru · Lo que dicen nuestros clientes
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.4rem,11vw,130px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0 text-center"
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              textShadow: "3px 3px 0 #001A99,5px 5px 0 #001A99",
            }}
          >
            OPINIONES
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.4rem,11vw,130px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 text-center"
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              textShadow: "3px 3px 0 #001A99,5px 5px 0 #001A99",
            }}
          >
            DE CLIENTES
          </motion.h1>
        </div>

        {/* Soft gradient at bottom — pointer-events-none so bodies are still draggable there */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#060d12]/70 to-transparent pointer-events-none z-30" />
      </section>

      {/* ── GooeyText morphing — own section ───────────────────────────── */}
      <section className="relative bg-[#060d12] py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,56,255,0.12),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-4"
          >
            Por qué nos eligen
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl font-medium mb-10"
          >
            Todo lo que nos caracteriza en una palabra
          </motion.p>

          <div className="relative h-40 md:h-48 flex items-center justify-center">
            <GooeyText
              texts={["Confianza", "Calidad", "Garantía", "Rapidez", "Honestidad"]}
              morphTime={1.2}
              cooldownTime={2.5}
              className="h-40 md:h-48 w-full"
              textClassName="font-black text-white tracking-tight"
            />
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section className="bg-[#060d12] py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl py-6 px-4"
              style={{ boxShadow: "0 0 40px rgba(0,56,255,0.08)" }}
            >
              <span
                className="text-3xl md:text-4xl font-black text-[#CCFF00]"
                style={{ fontFamily: "var(--font-display, inherit)", textShadow: "0 0 30px rgba(204,255,0,0.3)" }}
              >
                {s.value}
              </span>
              <span className="text-white/40 text-xs font-medium text-center">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WavePath divider ─────────────────────────────────────────────── */}
      <div className="flex justify-center py-4 text-[#0038FF]/60">
        <WavePath />
      </div>

      {/* ── 3D Marquee Testimonials ───────────────────────────────────────── */}
      <section className="bg-[#060d12] py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-3">
              Opiniones verificadas
            </p>
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              Lo que dicen nuestros{" "}
              <span className="text-[#CCFF00]" style={{ textShadow: "0 0 40px rgba(204,255,0,0.35)" }}>
                clientes
              </span>
            </h2>
          </motion.div>

          <Testimonials3D />
        </div>
      </section>



      {/* ── Testimonial grid ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full mb-12">
        <AnimatedTestimonialGrid
          testimonials={gridTestimonials}
          badgeText="LO MÁS VIRAL"
          title={
            <>
              Las reseñas que más{" "}
              <span className="text-[#CCFF00]" style={{ textShadow: "0 0 40px rgba(204,255,0,0.35)" }}>
                resuenan
              </span>
            </>
          }
          description="Más de 10.000 clientes han confiado en nosotros. Sus palabras son nuestro mayor orgullo y representan siempre un móvil reparado con honestidad."
          ctaText="Reserva tu reparación"
          ctaHref="/reparacion-pantalla"
        />
      </div>

      {/* ── CTA bottom ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#0038FF] rounded-3xl p-12 overflow-hidden"
            style={{ boxShadow: "0 0 80px rgba(0,56,255,0.4), inset 0 1px 0 rgba(255,255,255,0.15)" }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_70%)]" />

            <div className="relative z-10">
              <p className="text-[#CCFF00] text-xs font-black uppercase tracking-[0.3em] mb-4">
                ¿Tu móvil necesita reparación?
              </p>
              <h2
                className="text-3xl md:text-5xl font-black text-white leading-tight mb-4"
                style={{ fontFamily: "var(--font-display, inherit)", textShadow: "2px 2px 0 #001A99" }}
              >
                Únete a los{" "}
                <span
                  className="text-[#CCFF00]"
                  style={{ textShadow: "0 0 40px rgba(204,255,0,0.5)" }}
                >
                  10.000+
                </span>
                {" "}clientes satisfechos
              </h2>
              <p className="text-white/65 mb-8 text-base leading-relaxed max-w-lg mx-auto">
                Reparación rápida, piezas originales y garantía de por vida. Descubre por qué somos el taller de confianza de miles de clientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/marcas"
                  className="inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-black text-sm px-8 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200"
                  style={{ boxShadow: "0 0 24px rgba(204,255,0,0.5)" }}
                >
                  Reservar reparación
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold text-sm px-8 py-3.5 rounded-full hover:border-white/60 hover:bg-white/10 transition-all duration-200"
                >
                  Conocer el equipo
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
