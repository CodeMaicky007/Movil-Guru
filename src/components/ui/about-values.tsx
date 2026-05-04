"use client";

import React, { useRef, useEffect } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import {
  ShieldCheck,
  Sparkles,
  Wrench,
  Clock,
  HeartHandshake,
  Leaf,
  Award,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Garantía real",
    body:
      "De por vida en cada reparación. Sin asteriscos, sin condiciones ocultas. Si vuelve a fallar, lo arreglamos.",
  },
  {
    icon: HeartHandshake,
    title: "Honestidad primero",
    body:
      "Te decimos lo que pasa, lo que cuesta y lo que no merece la pena reparar. Sin sobrecostes ni piezas que no necesitas.",
  },
  {
    icon: Wrench,
    title: "Piezas originales",
    body:
      "Trabajamos solo con componentes certificados. La calidad de la pieza es la calidad del arreglo.",
  },
  {
    icon: Clock,
    title: "Entrega exprés",
    body:
      "El 80% de las reparaciones salen el mismo día. Pantallas en 47 minutos. Tu vida no espera.",
  },
  {
    icon: Sparkles,
    title: "Datos protegidos",
    body:
      "Protocolo de privacidad estricto. Reparamos sin formatear, sin acceder a tus datos personales.",
  },
  {
    icon: Leaf,
    title: "Reparar es sostenible",
    body:
      "Cada teléfono que rescatamos son 70 kg de CO₂ que no llegan al vertedero. Reparar es el nuevo lujo.",
  },
];

const stats = [
  { icon: Award, value: 10000, label: "Reparaciones", suffix: "+" },
  { icon: Users, value: 8500, label: "Clientes felices", suffix: "+" },
  { icon: Calendar, value: 5, label: "Años cuidando", suffix: "" },
  { icon: TrendingUp, value: 99, label: "% Satisfacción", suffix: "" },
];

function StatCounter({
  icon: Icon,
  value,
  label,
  suffix,
  delay,
}: {
  icon: typeof Award;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}) {
  const ref = useRef(null);
  const spring = useSpring(0, { stiffness: 60, damping: 15 });
  const display = useTransform(spring, (v) => Math.floor(v).toLocaleString("es-ES"));

  useEffect(() => {
    const t = setTimeout(() => spring.set(value), delay * 1000 + 300);
    return () => clearTimeout(t);
  }, [value, spring, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-[#0A1F3A]/10 bg-white p-6 transition-all duration-300 hover:border-[#0038FF]/40 hover:shadow-[0_30px_60px_-30px_rgba(0,56,255,0.35)]"
    >
      <div
        className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#CCFF00]/0 blur-2xl transition-all duration-500 group-hover:bg-[#CCFF00]/40"
      />
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0038FF]/10 text-[#0038FF] transition-colors duration-300 group-hover:bg-[#0038FF] group-hover:text-white">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[#0A1F3A]/15 to-transparent" />
      </div>
      <div className="relative z-10 mt-5 flex items-baseline">
        <motion.span
          className="text-5xl font-black tracking-tight text-[#0A1F3A]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {display}
        </motion.span>
        <span
          className="ml-1 text-3xl font-black text-[#0038FF]"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {suffix}
        </span>
      </div>
      <p className="relative z-10 mt-1 text-sm font-semibold uppercase tracking-wider text-[#0A1F3A]/60">
        {label}
      </p>
    </motion.div>
  );
}

export function AboutValues() {
  const ref = useRef(null);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#FAFDEE] px-4 py-32 text-[#0A1F3A] sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 0%, rgba(204,255,0,0.18) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(0,56,255,0.08) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* heading */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0A1F3A]/15 bg-white/70 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-[#0038FF] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0038FF]" />
              Lo que nos define
            </span>
            <h2
              className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-6xl"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              No vendemos <br />
              reparaciones. <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-[#0A1F3A]">Devolvemos</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-[#CCFF00]"
                />
              </span>{" "}
              <span className="text-[#0038FF]">tranquilidad.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#0A1F3A]/70">
              Cada teléfono que entra por nuestra puerta lleva dentro fotos,
              mensajes, recuerdos. No reparamos hardware: rescatamos pedazos
              de vida. Y eso nos toma muy en serio.
            </p>
          </motion.div>

          {/* values grid */}
          <div className="lg:col-span-7">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-[#0A1F3A]/10 bg-[#0A1F3A]/10 sm:grid-cols-2">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.15 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative bg-white p-7 transition-colors duration-300 hover:bg-[#0A1F3A]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0038FF]/10 text-[#0038FF] transition-all duration-300 group-hover:bg-[#CCFF00] group-hover:text-[#0A1F3A]">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <h3
                      className="mt-5 text-xl font-black uppercase tracking-tight text-[#0A1F3A] transition-colors duration-300 group-hover:text-white"
                      style={{ fontFamily: "var(--font-display), sans-serif" }}
                    >
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#0A1F3A]/65 transition-colors duration-300 group-hover:text-white/70">
                      {v.body}
                    </p>
                    <span className="absolute right-4 top-4 text-[10px] font-black tracking-widest text-[#0A1F3A]/20 transition-colors duration-300 group-hover:text-[#CCFF00]">
                      0{i + 1}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* divider numbers */}
        <div className="my-24 flex items-center gap-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0A1F3A]/40">
            Los números
          </span>
          <div className="h-px flex-1 bg-[#0A1F3A]/15" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0A1F3A]/40">
            2019 → hoy
          </span>
        </div>

        {/* stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCounter key={s.label} {...s} delay={i * 0.1} />
          ))}
        </div>

        {/* CTA bar */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-24 overflow-hidden rounded-3xl bg-[#0A1F3A] p-10 sm:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(204,255,0,0.35) 0%, transparent 60%)",
              filter: "blur(20px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,56,255,0.35) 0%, transparent 60%)",
              filter: "blur(20px)",
            }}
          />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CCFF00]">
                ¿Listo para hablar?
              </span>
              <h3
                className="mt-3 text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Tráenos tu móvil. <br />
                <span className="text-[#CCFF00]">Te lo devolvemos como nuevo.</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <a
                href="/reparacion"
                className="group inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-7 py-4 text-sm font-black uppercase tracking-wider text-[#0A1F3A] shadow-[0_15px_40px_-10px_rgba(204,255,0,0.6)] transition-transform duration-200 hover:scale-[1.03] active:scale-95"
              >
                Reservar
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-wider text-white backdrop-blur transition-colors duration-200 hover:bg-white/10"
              >
                Contactar
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
