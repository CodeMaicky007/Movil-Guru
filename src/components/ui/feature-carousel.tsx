"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Smartphone,
  BatteryCharging,
  Plug,
  Camera,
  Volume2,
  Droplets,
  Layers,
  Cpu,
  Clock,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "screen",
    label: "Pantallas",
    icon: Smartphone,
    image: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Reemplazo de pantallas OLED y LCD con partes de calidad OEM.",
  },
  {
    id: "battery",
    label: "Baterías",
    icon: BatteryCharging,
    image: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Restaura la autonomía de tu dispositivo con una batería nueva.",
  },
  {
    id: "charging",
    label: "Puerto de Carga",
    icon: Plug,
    image: "https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Reparación de puertos USB-C y Lightning en el mismo día.",
  },
  {
    id: "camera",
    label: "Cámaras",
    icon: Camera,
    image: "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Cambio de módulos de cámara frontal y trasera de cualquier marca.",
  },
  {
    id: "speaker",
    label: "Altavoz y Micro",
    icon: Volume2,
    image: "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Recupera el sonido claro en llamadas y multimedia.",
  },
  {
    id: "water",
    label: "Daño por Agua",
    icon: Droplets,
    image: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Diagnóstico y limpieza ultrasónica para daños por líquidos.",
  },
  {
    id: "glass",
    label: "Tapa Trasera",
    icon: Layers,
    image: "https://images.pexels.com/photos/4195504/pexels-photo-4195504.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Cambio de cristal trasero dejando tu móvil como nuevo.",
  },
  {
    id: "board",
    label: "Placa Base",
    icon: Cpu,
    image: "https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Microsoldadura y reparación a nivel de componente.",
  },
  {
    id: "sameday",
    label: "Servicio Express",
    icon: Clock,
    image: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "La mayoría de reparaciones listas en menos de 60 minutos.",
  },
  {
    id: "other",
    label: "Piezas Pequeñas",
    icon: Wrench,
    image: "https://images.pexels.com/photos/4195504/pexels-photo-4195504.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Botones, vibrador, lector de huellas y más componentes.",
  },
];

const AUTO_PLAY_INTERVAL = 3000;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev: number) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s: number) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <section className="w-full bg-white py-16 md:py-24">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-10 md:mb-14">
        <p
          className="text-xs font-semibold uppercase tracking-[0.25em] mb-3"
          style={{ color: "#0038FF" }}
        >
          Nuestros Servicios
        </p>
        <h2
          className="font-black text-4xl md:text-5xl lg:text-6xl uppercase leading-none tracking-tight text-black"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          <span style={{ color: "#0038FF" }}>Todo</span> tipo de
          <br />
          <span style={{ color: "#0038FF" }}>repar</span><span style={{ color: "#CCFF00", WebkitTextStroke: "1px #b8e600" }}>ación</span>
        </h2>
      </div>

      {/* Carousel */}
      <div className="w-full max-w-7xl mx-auto md:px-8">
        <div
          className="relative overflow-hidden rounded-none md:rounded-[2.5rem] lg:rounded-[3rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-black/10"
        >
          {/* Left panel — feature list */}
          <div
            className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16"
            style={{ backgroundColor: "#0038FF" }}
          >
            {/* Top fade */}
            <div
              className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 z-40"
              style={{
                background:
                  "linear-gradient(to bottom, #0038FF 0%, rgba(0,56,255,0.8) 60%, transparent 100%)",
              }}
            />
            {/* Bottom fade */}
            <div
              className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 z-40"
              style={{
                background:
                  "linear-gradient(to top, #0038FF 0%, rgba(0,56,255,0.8) 60%, transparent 100%)",
              }}
            />

            <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
              {FEATURES.map((feature, index) => {
                const isActive = index === currentIndex;
                const distance = index - currentIndex;
                const wrappedDistance = wrap(
                  -(FEATURES.length / 2),
                  FEATURES.length / 2,
                  distance
                );
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.id}
                    style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                    animate={{
                      y: wrappedDistance * ITEM_HEIGHT,
                      opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 22,
                      mass: 1,
                    }}
                    className="absolute flex items-center justify-start"
                  >
                    <button
                      onClick={() => handleChipClick(index)}
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                      className={cn(
                        "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-colors duration-500 text-left group border",
                        isActive
                          ? "border-[#CCFF00] z-10"
                          : "bg-transparent border-white/20 hover:border-white/40"
                      )}
                      style={
                        isActive
                          ? { backgroundColor: "#CCFF00", color: "#0038FF" }
                          : { color: "rgba(255,255,255,0.6)" }
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center transition-colors duration-500",
                          isActive ? "text-[#0038FF]" : "text-white/40"
                        )}
                      >
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <span
                        className="font-semibold text-sm md:text-[15px] tracking-tight whitespace-nowrap uppercase"
                        style={{ fontFamily: "var(--font-display), sans-serif" }}
                      >
                        {feature.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right panel — image cards */}
          <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-black/10 bg-gray-50">
            <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
              {FEATURES.map((feature, index) => {
                const status = getCardStatus(index);
                const isActive = status === "active";
                const isPrev = status === "prev";
                const isNext = status === "next";
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.id}
                    initial={false}
                    animate={{
                      x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                      scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                      opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                      rotate: isPrev ? -3 : isNext ? 3 : 0,
                      zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                      mass: 0.8,
                    }}
                    className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 bg-white origin-center"
                    style={{ borderColor: "#ffffff" }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.label}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700",
                        isActive
                          ? "grayscale-0 blur-0"
                          : "grayscale blur-[2px] brightness-75"
                      )}
                    />

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute inset-x-0 bottom-0 p-8 pt-32 flex flex-col justify-end pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
                          }}
                        >
                          <div
                            className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] w-fit mb-3"
                            style={{
                              backgroundColor: "#CCFF00",
                              color: "#0038FF",
                              fontFamily: "var(--font-display), sans-serif",
                            }}
                          >
                            {index + 1} · {feature.label}
                          </div>
                          <p className="text-white font-normal text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight">
                            {feature.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      className={cn(
                        "absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <div
                        className="w-2 h-2 rounded-full shadow-[0_0_10px_white]"
                        style={{ backgroundColor: "#CCFF00" }}
                      />
                      <span className="text-white/80 text-[10px] font-normal uppercase tracking-[0.3em] font-mono">
                        Movil Guru
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureCarousel;
