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
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.87.67 3.55 1.76-3.13 1.77-2.62 5.92.35 7.14-.65 1.58-1.57 3.1-2.57 4.03zm-3.21-14.7c-.55 1.4-1.89 2.37-3.25 2.28.09-1.5 1.05-2.82 2.38-3.4 1.25-.57 2.66-.41 3.25.04-.15.35-.26.72-.38 1.08z"/>
  </svg>
);
const SamsungIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
    <path d="M19.15 10.84a3.4 3.4 0 00-2.4-1.01H7.25a3.4 3.4 0 00-3.4 3.4v1.54a3.4 3.4 0 003.4 3.4h9.5a3.4 3.4 0 003.4-3.4v-1.54a3.4 3.4 0 00-1-.99zm-9.4 3.43H8.6v-2.54h.56c.3 0 .45.14.45.43v1.68c0 .29-.15.43-.46.43zm2.4 0h-1.02v-2.54h1.02v2.54zm2.9 0h-.94l-.63-1.5v1.5h-.93v-2.54h.93l.64 1.49v-1.49h.93v2.54zm2.5-.85c0 .52-.3.85-.86.85h-1.4v-2.54h1.4c.56 0 .86.33.86.85v.84zm-.86-.42c0-.14-.06-.2-.2-.2h-.27v1.24h.27c.14 0 .2-.06.2-.2v-.84z"/>
  </svg>
);
const XiaomiIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
    <path d="M6.5 4A2.5 2.5 0 004 6.5v11A2.5 2.5 0 006.5 20h11a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0017.5 4h-11zm1 5h2v6h-2V9zm3.5 0h2c1.1 0 2 .9 2 2v4h-2v-4h-2v4h-2v-4c0-1.1.9-2 2-2z"/>
  </svg>
);
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const HuaweiIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#CF0A2C]" fill="currentColor">
    <path d="M12 2C9.8 4.2 8 7.9 8 10c0 2.2 1.8 4 4 4s4-1.8 4-4c0-2.1-1.8-5.8-4-8zM4.9 7C3 9.5 2 12.1 2 14c0 3.3 2 5.7 4.5 6.8L8 14.7C6.6 13.6 6 12 6 10c0-1.1.3-2.1.9-3zM19.1 7c.6.9.9 1.9.9 3 0 2-.6 3.6-2 4.7l1.5 6.1C22 19.7 22 17.3 22 14c0-2.1-1-4.5-2.9-7zM12 16c-1.4 0-2.7-.3-3.8-.9l-1.5 6C8.3 21.7 10.1 22 12 22s3.7-.3 5.3-.9l-1.5-6c-1.1.6-2.4.9-3.8.9z"/>
  </svg>
);
const OnePlusIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
    <path d="M17 2H7a5 5 0 00-5 5v10a5 5 0 005 5h10a5 5 0 005-5V7a5 5 0 00-5-5zm-4.5 14.5v-4H10v-2h2.5V8h2v2.5H17v2h-2.5v4h-2z"/>
  </svg>
);

const brandIcons = [
  { Icon: AppleIcon,   bg: "#1d1d1f", color: "#ffffff", label: "Apple"   },
  { Icon: SamsungIcon, bg: "#1428A0", color: "#ffffff", label: "Samsung" },
  { Icon: XiaomiIcon,  bg: "#FF6900", color: "#ffffff", label: "Xiaomi"  },
  { Icon: GoogleIcon,  bg: "#ffffff", color: "#000000", label: "Pixel"   },
  { Icon: HuaweiIcon,  bg: "#0d0d0d", color: "#CF0A2C", label: "Huawei"  },
  { Icon: OnePlusIcon, bg: "#F5010C", color: "#ffffff", label: "OnePlus" },
];

// ─── Repair service cards for marquee ────────────────────────────────────────
const services = [
  {
    title: "Pantalla rota",
    sub: "Reparación en 47 min",
    img: "https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&w=400",
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
    img: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&w=400",
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
    img: "https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg?auto=compress&w=400",
    tag: "Certificado",
    tagColor: "#0038FF",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function AboutHero() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_STYLES }} />

      <div className="relative w-full bg-[#060812] overflow-hidden">

        {/* ── Ambient blobs ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="blob-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #0038FF 0%, transparent 70%)", filter: "blur(60px)" }}
          />
          <div
            className="blob-2 absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #CCFF00 0%, transparent 70%)", filter: "blur(80px)" }}
          />
          <div
            className="blob-3 absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #0038FF 0%, transparent 70%)", filter: "blur(70px)" }}
          />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* ── Main glass card ── */}
        <div className="relative z-10 px-4 pt-10 pb-0 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-7xl rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm shadow-[0_0_80px_rgba(0,56,255,0.08)] p-8 md:p-14 lg:p-20 flex flex-col gap-10 md:gap-14"
          >

            {/* ── Row 1: "QUIÉNES" + description ── */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-14">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(4rem,13vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] shrink-0 mix-blend-plus-lighter"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: "0 0 60px rgba(204,255,0,0.3)",
                }}
              >
                QUIÉNES
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-col gap-4 max-w-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00]/70">
                  Movil Guru · Desde 2019
                </span>
                <p className="text-white/60 text-base md:text-lg leading-relaxed font-medium">
                  Un taller de confianza con más de 5 años reparando móviles de todas las marcas — con honestidad, transparencia y garantía real.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-[#CCFF00] text-black font-black text-xs px-4 py-1.5 rounded-full shadow-[0_0_16px_rgba(204,255,0,0.4)]">
                    10k+ reparaciones
                  </span>
                  <span className="border border-white/20 text-white/70 text-xs px-4 py-1.5 rounded-full font-semibold">
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
              className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
            >
              {/* Overlapping brand circles */}
              <div className="flex -space-x-4">
                {brandIcons.map(({ Icon, bg, color, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    title={label}
                    className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#060812] shadow-xl shrink-0 cursor-default"
                    style={{ background: bg, color, zIndex: brandIcons.length - i }}
                  >
                    <Icon />
                  </motion.div>
                ))}
              </div>

              <motion.h1
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(4rem,13vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-white mix-blend-plus-lighter"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: "0 0 60px rgba(255,255,255,0.12)",
                }}
              >
                SOMOS
              </motion.h1>
            </motion.div>

            {/* ── Row 3: "MOVIL GURU" + CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col lg:flex-row lg:items-end gap-8"
            >
              {/* Logo: MOVIL + GURU pill */}
              <div
                className="flex items-center gap-4 md:gap-6"
                style={{ filter: "drop-shadow(0 0 40px rgba(204,255,0,0.2))" }}
              >
                <span
                  className="text-[clamp(3.5rem,10vw,120px)] font-black leading-none tracking-tighter uppercase text-white"
                  style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
                >
                  MOVIL
                </span>
                <span
                  className="text-[clamp(3.5rem,10vw,120px)] font-black leading-none tracking-tighter uppercase text-black px-6 md:px-8 rounded-[0.35em]"
                  style={{
                    fontFamily: '"Arial Black", Impact, sans-serif',
                    background: "#CCFF00",
                    boxShadow: "0 0 48px rgba(204,255,0,0.5)",
                  }}
                >
                  GURU
                </span>
              </div>

              <a
                href="/reparacion-pantalla"
                className="shrink-0 inline-flex items-center gap-3 bg-[#CCFF00] text-black font-black text-sm md:text-base px-10 py-5 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-[0_0_32px_rgba(204,255,0,0.45)] mb-2"
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
            className="text-center text-white/35 text-xs font-black uppercase tracking-[0.3em] mb-7"
          >
            Nuestros servicios más solicitados
          </motion.p>

          <div className="overflow-hidden w-full">
            <div className="about-marquee-track flex w-max gap-4 px-4">
              {[...services, ...services].map((s, i) => (
                <div
                  key={i}
                  className="relative flex items-center gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm min-w-[240px] group hover:border-white/20 transition-colors duration-300"
                >
                  {/* Tag */}
                  <div
                    className="absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: s.tagColor === "#CCFF00" ? "rgba(204,255,0,0.15)" : "rgba(0,56,255,0.2)",
                      color: s.tagColor,
                      border: `1px solid ${s.tagColor}30`,
                    }}
                  >
                    {s.tag}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col px-5 py-5 pt-10 flex-1 min-w-[130px]">
                    <h3 className="font-black text-white text-base leading-tight">{s.title}</h3>
                    <p className="text-white/45 text-xs mt-1 font-medium">{s.sub}</p>
                  </div>

                  {/* Photo */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-r-2xl">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#060812]/60 to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#060812] to-transparent pointer-events-none z-20" />
      </div>
    </>
  );
}
