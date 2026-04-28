"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// ─── Inline Marquee (no external dep) ────────────────────────────────────────
const MARQUEE_STYLES = `
@keyframes about-marquee-x {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.about-marquee-track {
  animation: about-marquee-x 35s linear infinite;
  will-change: transform;
}
.about-marquee-track:hover {
  animation-play-state: paused;
}

/* Blob ambient animations */
@keyframes blob-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(60px, -40px) scale(1.1); }
  66%       { transform: translate(-40px, 30px) scale(0.95); }
}
@keyframes blob-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40%       { transform: translate(-80px, 50px) scale(1.08); }
  70%       { transform: translate(50px, -30px) scale(1.02); }
}
@keyframes blob-drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(30px, 60px) scale(1.06); }
}
.blob-1 { animation: blob-drift-1 14s ease-in-out infinite; }
.blob-2 { animation: blob-drift-2 18s ease-in-out infinite; }
.blob-3 { animation: blob-drift-3 12s ease-in-out infinite; }
`;

// ─── Brand SVG icons (inline, no deps) ───────────────────────────────────────
const brandIcons = [
  { logo: "/images/Apple.png",      bg: "#1d1d1f", invert: true,  label: "Apple"   },
  { logo: "/images/Samsung.png",    bg: "#1428A0", invert: true,  label: "Samsung" },
  { logo: "/images/Xiaomi.png",     bg: "#FF6900", invert: true,  label: "Xiaomi"  },
  { logo: "/images/GooglePixel.png",bg: "#ffffff", invert: false, label: "Pixel"   },
  { logo: "/images/huawei.png",     bg: "#0d0d0d", invert: false, label: "Huawei"  },
  { logo: "/images/oneplus.png",    bg: "#F5010C", invert: true,  label: "OnePlus" },
];

// ─── Repair service cards for marquee ────────────────────────────────────────
const services = [
  {
    title: "Pantalla rota",
    sub: "Reparación en 47 min",
    img: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&w=400",
    tag: "Más frecuente",
    tagColor: "#CCFF00",
  },
  {
    title: "Batería",
    sub: "Original · Garantía ∞",
    img: "https://images.pexels.com/photos/163007/phone-mobile-smartphone-3g-163007.jpeg?auto=compress&w=400",
    tag: "Garantía vitalicia",
    tagColor: "#0038FF",
  },
  {
    title: "Cámara",
    sub: "Diagnóstico gratis",
    img: "https://images.pexels.com/photos/4195504/pexels-photo-4195504.jpeg?auto=compress&w=400",
    tag: "Pieza original",
    tagColor: "#CCFF00",
  },
  {
    title: "Puerto USB-C",
    sub: "Reparado el mismo día",
    img: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&w=400",
    tag: "Express",
    tagColor: "#0038FF",
  },
  {
    title: "Software & datos",
    sub: "100% privado",
    img: "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&w=400",
    tag: "Sin borrar datos",
    tagColor: "#CCFF00",
  },
  {
    title: "Altavoz",
    sub: "Todas las marcas",
    img: "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&w=400",
    tag: "Certificado",
    tagColor: "#0038FF",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function AboutHero() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_STYLES }} />

      <div className="relative w-full bg-[#0038FF] overflow-hidden">

        {/* ── Ambient blobs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="blob-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #001A99 0%, transparent 70%)", filter: "blur(60px)" }}
          />
          <div
            className="blob-2 absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #CCFF00 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="blob-3 absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #001A99 0%, transparent 70%)", filter: "blur(70px)" }}
          />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* ── Main glass card ── */}
        <div className="relative z-10 px-4 pt-12 pb-0 md:px-8 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-6xl rounded-2xl border-2 border-[#CCFF00] bg-white/[0.02] backdrop-blur-sm shadow-[0_0_60px_rgba(204,255,0,0.2)] p-6 md:p-10 flex flex-col gap-3 md:gap-4 overflow-hidden"
          >

            {/* ── Row 1: "QUIÉNES" + description ── */}
            <div className="flex flex-row items-center gap-4 md:gap-6">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,8vw,92px)] font-black leading-[0.85] tracking-tighter uppercase text-[#CCFF00] shrink-0"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  textShadow: "0 0 40px rgba(204,255,0,0.3)",
                }}
              >
                QUIÉNES
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-col gap-1.5 ml-auto"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#CCFF00]/70">
                  Movil Guru · Desde 2019
                </span>
                <p className="text-white/70 text-[10px] leading-snug font-medium max-w-[200px]">
                  5 años, todas las marcas. Honestidad y garantía real.
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="bg-[#CCFF00] text-black font-black text-[9px] px-2.5 py-1 rounded-full">
                    10k+ reparaciones
                  </span>
                  <span className="border border-white/20 text-white/70 text-[9px] px-2.5 py-1 rounded-full font-semibold">
                    99% satisfacción
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── Row 2: brand icons + "SOMOS" ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-row items-center gap-4 md:gap-6"
            >
              {/* Overlapping brand circles */}
              <div className="flex -space-x-3">
                {brandIcons.map(({ logo, bg, invert, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    title={label}
                    className="relative flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-[#0038FF] shadow-xl shrink-0 cursor-default overflow-hidden"
                    style={{ background: bg, zIndex: brandIcons.length - i }}
                  >
                    <img
                      src={logo}
                      alt={label}
                      className="w-4 h-4 md:w-6 md:h-6 object-contain"
                      style={{ filter: invert ? 'brightness(0) invert(1)' : 'none' }}
                    />
                  </motion.div>
                ))}
              </div>

              <motion.h1
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,8vw,92px)] font-black leading-[0.85] tracking-tighter uppercase text-white"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  textShadow: "0 0 40px rgba(255,255,255,0.12)",
                }}
              >
                SOMOS
              </motion.h1>
            </motion.div>

            {/* ── Row 3: "MOVIL GURU" ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-row items-center gap-2 md:gap-3 w-full"
            >
              <span
                className="text-[clamp(2.5rem,8vw,92px)] font-black leading-none tracking-tighter uppercase text-black px-3 md:px-4 rounded-[0.3em] shrink-0"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  background: "#ffffff",
                }}
              >
                MOVIL
              </span>
              <span
                className="text-[clamp(2.5rem,8vw,92px)] font-black leading-none tracking-tighter uppercase text-black px-3 md:px-4 rounded-[0.3em] shrink-0"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  background: "#CCFF00",
                  boxShadow: "0 0 40px rgba(204,255,0,0.5)",
                }}
              >
                GURU
              </span>
            </motion.div>

            {/* ── Row 4: CTA button ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="/marcas"
                className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-black text-sm px-7 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-[0_0_24px_rgba(204,255,0,0.45)]"
              >
                Reservar reparación
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.div>

          </motion.div>
        </div>

        {/* ── Marquee: repair services ── */}
        <div className="relative z-10 w-full pt-10 pb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-center text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-7"
          >
            Nuestros servicios más solicitados
          </motion.p>

          <div className="overflow-hidden w-full">
            <div className="about-marquee-track flex w-max gap-4 px-4">
              {[...services, ...services].map((s, i) => (
                <div
                  key={i}
                  className="relative flex items-center gap-0 overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.08] min-w-[240px] group hover:border-white/25 transition-colors duration-300"
                >
                  {/* Tag */}
                  <div
                    className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: s.tagColor === "#CCFF00" ? "rgba(204,255,0,0.2)" : "rgba(255,255,255,0.15)",
                      color: s.tagColor === "#CCFF00" ? "#CCFF00" : "#ffffff",
                      border: `1px solid ${s.tagColor === "#CCFF00" ? "rgba(204,255,0,0.4)" : "rgba(255,255,255,0.25)"}`,
                    }}
                  >
                    {s.tag}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col px-5 py-5 pt-10 flex-1 min-w-[130px]">
                    <h3 className="font-black text-white text-base leading-tight">{s.title}</h3>
                    <p className="text-white/55 text-xs mt-1 font-medium">{s.sub}</p>
                  </div>

                  {/* Photo */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-r-2xl">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0038FF]/70 to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade into white */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
      </div>
    </>
  );
}
