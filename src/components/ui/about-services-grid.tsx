"use client"

import { useState, useEffect, useRef } from "react"
import {
  Smartphone,
  Zap,
  Shield,
  Cpu,
  HardDrive,
  ShoppingBag,
  ArrowRight,
  Award,
  Users,
  MapPin,
  Clock,
} from "lucide-react"
import { motion, useInView, useSpring, useTransform } from "motion/react"

interface ServiceItemProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  direction: "left" | "right"
}

function ServiceItem({ icon, title, description, delay, direction }: ServiceItemProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      className="flex flex-col group"
      initial={{ opacity: 0, x: direction === "left" ? -24 : 24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative p-3 rounded-xl bg-[#0038FF]/10 text-[#0038FF] transition-colors duration-300 group-hover:bg-[#0038FF]/20">
          {icon}
        </div>
        <h3 className="text-base font-bold uppercase tracking-[0.06em] text-[#0A1F3A] group-hover:text-[#0038FF] transition-colors duration-300">
          {title}
        </h3>
      </div>
      <p className="text-sm text-[#0A1F3A]/60 leading-relaxed pl-12">
        {description}
      </p>
      <div className="mt-3 pl-12 h-px w-0 group-hover:w-12 bg-[#CCFF00] transition-all duration-300" />
    </motion.div>
  )
}

function StatCounter({
  icon,
  value,
  label,
  suffix,
  delay,
}: {
  icon: React.ReactNode
  value: number
  label: string
  suffix: string
  delay: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const springValue = useSpring(0, { stiffness: 50, damping: 12 })
  const displayValue = useTransform(springValue, (v) => Math.floor(v).toLocaleString("es-ES"))

  useEffect(() => {
    if (isInView) springValue.set(value)
  }, [isInView, value, springValue])

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center group p-6 rounded-2xl border border-[#0038FF]/10 bg-white hover:border-[#CCFF00] hover:shadow-[0_8px_30px_-8px_rgba(204,255,0,0.3)] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-12 h-12 rounded-full bg-[#0038FF]/8 flex items-center justify-center mb-3 text-[#0038FF] group-hover:bg-[#0038FF]/15 transition-colors duration-300">
        {icon}
      </div>
      <div className="text-3xl font-black text-[#0A1F3A] flex items-baseline gap-0.5">
        <motion.span>{displayValue}</motion.span>
        <span className="text-[#0038FF]">{suffix}</span>
      </div>
      <p className="text-xs text-[#0A1F3A]/55 mt-1 uppercase tracking-[0.12em] font-semibold">{label}</p>
      <div className="w-8 h-0.5 bg-[#CCFF00] mt-3 group-hover:w-14 transition-all duration-500" />
    </motion.div>
  )
}

const SERVICES = [
  {
    icon: <Smartphone className="w-5 h-5" />,
    title: "Diagnóstico",
    description: "Revisión completa del dispositivo sin coste ni compromiso. Te decimos exactamente qué falla.",
    position: "left" as const,
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Reparación Express",
    description: "La mayoría de reparaciones en menos de 90 minutos. Sin citas, sin esperas innecesarias.",
    position: "left" as const,
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Garantía de por vida",
    description: "Cada reparación lleva nuestra garantía permanente. Si vuelve a fallar, lo arreglamos sin coste.",
    position: "left" as const,
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Micro-soldadura",
    description: "Reparación de placa base y componentes internos con equipos de precisión profesional.",
    position: "right" as const,
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    title: "Recuperación de datos",
    description: "Rescatamos tus fotos, contactos y archivos incluso de dispositivos con daño grave.",
    position: "right" as const,
  },
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: "Tienda de accesorios",
    description: "Fundas, cristales templados, cargadores y más. Todo lo que tu móvil necesita en un solo sitio.",
    position: "right" as const,
  },
]

const STATS = [
  { icon: <Users className="w-5 h-5" />, value: 15000, label: "Clientes satisfechos", suffix: "+" },
  { icon: <Clock className="w-5 h-5" />, value: 90, label: "Min. reparación promedio", suffix: "" },
  { icon: <MapPin className="w-5 h-5" />, value: 4, label: "Tiendas en Castilla y León", suffix: "" },
  { icon: <Award className="w-5 h-5" />, value: 99, label: "% Clientes recomiendan", suffix: "%" },
]

export function AboutServicesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 })

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 px-4 bg-white text-[#0A1F3A] overflow-hidden relative"
    >
      {/* Background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-5%] top-1/4 h-[600px] w-[600px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(0,56,255,0.05), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-5%] bottom-1/4 h-[400px] w-[400px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(204,255,0,0.07), transparent 70%)" }}
      />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block h-px w-8" style={{ background: "#CCFF00" }} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0038FF]">
              Nuestros servicios
            </span>
            <span className="inline-block h-px w-8" style={{ background: "#CCFF00" }} />
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-[-0.035em]"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            Todo lo que tu <span style={{ color: "#0038FF" }}>móvil</span>{" "}
            <span style={{ color: "#CCFF00" }}>necesita.</span>
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left column */}
          <div className="space-y-12">
            {SERVICES.filter((s) => s.position === "left").map((s, i) => (
              <ServiceItem key={s.title} {...s} delay={i * 0.15} direction="left" />
            ))}
          </div>

          {/* Center image */}
          <div className="flex justify-center items-center order-first md:order-none mb-8 md:mb-0">
            <div className="relative w-full max-w-xs">
              {/* Lime border accent */}
              <div
                className="absolute -inset-[3px] rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #CCFF00 0%, #0038FF 60%, transparent 100%)",
                  opacity: 0.6,
                }}
              />
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&w=800"
                  alt="Técnico reparando móvil"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,56,255,0.55) 0%, transparent 60%)" }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <a
                    href="/reparacion"
                    className="flex items-center justify-center gap-2 w-full rounded-full py-3 text-sm font-black uppercase tracking-wider transition-transform duration-200 hover:scale-[1.03] active:scale-95"
                    style={{ background: "#CCFF00", color: "#0A1F3A" }}
                  >
                    Reservar reparación <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-12">
            {SERVICES.filter((s) => s.position === "right").map((s, i) => (
              <ServiceItem key={s.title} {...s} delay={i * 0.15} direction="right" />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <StatCounter key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          ref={ctaRef}
          className="mt-14 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "#0038FF" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h3 className="text-2xl font-black uppercase text-white leading-tight tracking-[-0.02em]">
              ¿Tu móvil tiene algún problema?
            </h3>
            <p className="text-white/70 mt-1 text-sm">Diagnóstico gratuito, sin compromiso, en cualquiera de nuestras tiendas.</p>
          </div>
          <a
            href="/reparacion"
            className="shrink-0 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black uppercase tracking-wider transition-transform duration-200 hover:scale-[1.04] active:scale-95 shadow-[0_10px_30px_-8px_rgba(204,255,0,0.5)]"
            style={{ background: "#CCFF00", color: "#0A1F3A" }}
          >
            Pedir cita <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
