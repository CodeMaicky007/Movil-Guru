"use client";

/**
 * /about — Página About con storytelling scroll-driven (estilo Apple).
 *
 * Reglas:
 *  - No redefine tipografías ni colores globales (usa los del CSS base).
 *  - Reutiliza Header y Footer del sistema existente.
 *  - Animaciones ligadas al scroll con motion/react (ya en el stack).
 *  - Estructura modular: cada bloque es un componente independiente.
 *  - Pinning vía `position: sticky` (sin overrides globales).
 */

import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";
import { Skiper19 } from "@/components/ui/svg-follow-scroll";
import { ParallaxFeatureSection } from "@/components/ui/parallax-scroll-feature-section";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { Features as FeaturesSection } from "@/components/ui/features-9";
import { AboutServicesGrid } from "@/components/ui/about-services-grid";
import { Testimonials } from "@/components/ui/testimonials-columns-1";

/**
 * Items del zoom parallax — el slot central (index 0) es el vídeo que avanza
 * con el scroll; el resto son fotografías del taller Movil Guru.
 */
const ZOOM_IMAGES = [
  {
    type: "video" as const,
    src: "/images/about/hero-video.mp4",
    alt: "Movil Guru en acción",
  },
  {
    src: "/images/about/closeup-shot-person-repair-mobile-mobile-repair-smartphone-workshop.jpg",
    alt: "Reparación de placa base en taller",
  },
  {
    src: "/images/about/hands-remove-gsm-sim-card-from-nest-motherboard-electronic-device-that-was-broken.jpg",
    alt: "Extracción de tarjeta SIM",
  },
  {
    src: "/images/about/electronic-technician-showing-modern-smartphone-with-broken-body-repair-shop.jpg",
    alt: "Móvil con cuerpo roto en reparación",
  },
  {
    src: "/images/about/electronic-technician-holds-two-identical-smartphones-comparison-one-hand-broken-another-new.jpg",
    alt: "Comparación de móvil roto y nuevo",
  },
  {
    src: "/images/about/attractive-young-man-technician-using-soldering-iron-while-trying-fix-hardware-damaged-smartphone.jpg",
    alt: "Técnico soldando placa de smartphone",
  },
  {
    src: "/images/about/closeup-shot-person-repair-mobile-mobile-repair-smartphone-workshop.jpg",
    alt: "Detalle de reparación",
  },
];

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

/* ─────────────────────────────────────────────────────────────────────
 * Indicador de scroll: barra fina superior que crece con el progreso.
 * ──────────────────────────────────────────────────────────────────── */
function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
      style={{ scaleX, background: "#CCFF00" }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Helper: revelado de palabras dependiente del progreso de un ref.
 * Cada palabra recibe una ventana del rango [0,1] y se opacifica al pasar.
 * ──────────────────────────────────────────────────────────────────── */
function ScrollRevealHeading({
  text,
  className = "",
  start = 0,
  end = 1,
  progress,
}: {
  text: string;
  className?: string;
  start?: number;
  end?: number;
  progress: MotionValue<number>;
}) {
  const words = text.split(" ");
  return (
    <h2 className={className} aria-label={text}>
      {words.map((w, i) => {
        const span = (end - start) / words.length;
        const wStart = start + span * i;
        const wEnd = wStart + span * 0.9;
        return (
          <Word key={i} progress={progress} start={wStart} end={wEnd}>
            {w}
          </Word>
        );
      })}
    </h2>
  );
}

function Word({
  children,
  progress,
  start,
  end,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);
  return (
    <motion.span
      aria-hidden
      style={{ opacity, y, display: "inline-block" }}
      className="mr-[0.25em]"
    >
      {children}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * 1. INTRO — headline que se construye palabra a palabra con el scroll.
 * ──────────────────────────────────────────────────────────────────── */
function IntroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax sutil sobre el badge superior
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[180vh] w-full"
      style={{ background: "#FFFFFF", color: "#0A1F3A" }}
    >
      {/* Sticky stage */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-6">
        <motion.span
          style={{ y: badgeY, opacity: badgeOpacity }}
          className="absolute top-32 text-[10px] font-black uppercase tracking-[0.4em]"
        >
          ◆ Movil Guru — Capítulo 01
        </motion.span>

        <ScrollRevealHeading
          progress={scrollYProgress}
          start={0.05}
          end={0.7}
          text="Reparar no es un servicio. Es un acto de cuidado."
          className="max-w-5xl text-center text-5xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-[112px]"
        />

        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.6, 0.85], [0, 1]),
            y: useTransform(scrollYProgress, [0.6, 0.85], [30, 0]),
          }}
          className="absolute bottom-24 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] opacity-60">
            Sigue bajando
          </span>
          <div className="h-10 w-[1px] bg-[#0A1F3A]/30">
            <motion.div
              className="h-full w-full origin-top"
              style={{ background: "#0038FF" }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * 2. HISTORIA — ahora vive en `ParallaxFeatureSection` (componente externo).
 * ──────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────
 * 3. FILOSOFÍA — sección sticky con frases que se intercambian al scrollear.
 *    Ocupa 4×100vh de altura: el contenedor está pinneado y el texto
 *    interno cambia según el progreso.
 * ──────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────
 * 4. CIERRE — mensaje final cinematográfico.
 * ──────────────────────────────────────────────────────────────────── */
function ClosingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [0.9, 1]);
  const lineWidth = useTransform(scrollYProgress, [0.3, 0.9], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[120vh] w-full items-center justify-center overflow-hidden px-6"
      style={{ background: "#FFFFFF", color: "#0A1F3A" }}
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative flex max-w-5xl flex-col items-center text-center"
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.4em]"
          style={{ color: "#0038FF" }}
        >
          ◆ Cierre
        </span>
        <h2 className="mt-8 text-5xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-[120px]">
          Tu móvil <br />
          merece volver <br />
          <span className="relative inline-block">
            a sentirse
            <motion.span
              aria-hidden
              className="absolute bottom-2 left-0 h-3"
              style={{ width: lineWidth, background: "#CCFF00" }}
            />
          </span>{" "}
          <span style={{ color: "#0038FF" }}>nuevo.</span>
        </h2>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="/reparacion"
            className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-black uppercase tracking-wider shadow-[0_15px_40px_-10px_rgba(204,255,0,0.6)] transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            style={{ background: "#CCFF00", color: "#0A1F3A" }}
          >
            Reservar reparación
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full border border-[#0A1F3A]/20 px-8 py-4 text-sm font-black uppercase tracking-wider transition-colors duration-200 hover:bg-[#0A1F3A] hover:text-white"
          >
            Hablar con un guru
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Página
 * ──────────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <main className="relative w-full">
      <ScrollIndicator />
      <Header />
      <Skiper19 />
      <ParallaxFeatureSection />
      <ZoomParallax items={ZOOM_IMAGES} />
      <Testimonials />
      <AboutServicesGrid />
      <FeaturesSection />
      <ClosingSection />
      <Footer />
    </main>
  );
}
