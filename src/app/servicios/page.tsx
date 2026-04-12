'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Smartphone,
  Battery,
  Droplets,
  Camera,
  Layers,
  HardDrive,
  Plug,
  CircuitBoard,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const Header = dynamic(
  () => import('@/components/ui/header-3').then((m) => m.Header),
  { ssr: false }
);

type Service = {
  title: string;
  cat: string;
  desc: string;
  time: string;
  href: string;
  Icon: typeof Smartphone;
  accent: string;
};

const services: Service[] = [
  {
    title: 'Pantalla rota',
    cat: 'Display',
    desc: 'Cambio de cristal y LCD/OLED con piezas originales. Acabado de fábrica.',
    time: '≈ 47 min',
    href: '/reparacion-pantalla',
    Icon: Smartphone,
    accent: '#CCFF00',
  },
  {
    title: 'Cambio de batería',
    cat: 'Energía',
    desc: 'Recupera autonomía con baterías certificadas y calibración completa.',
    time: '≈ 20 min',
    href: '/reparacion-bateria',
    Icon: Battery,
    accent: '#39FF88',
  },
  {
    title: 'Daño por agua',
    cat: 'Líquidos',
    desc: 'Diagnóstico a placa, ultrasonidos y limpieza de corrosión.',
    time: 'Diagnóstico',
    href: '/reparacion-agua',
    Icon: Droplets,
    accent: '#00E5FF',
  },
  {
    title: 'Reparación de cámara',
    cat: 'Óptica',
    desc: 'Módulos delanteros y traseros, lente, estabilizador y sensor.',
    time: 'Mismo día',
    href: '/reparacion-camara',
    Icon: Camera,
    accent: '#CCFF00',
  },
  {
    title: 'Móviles plegables',
    cat: 'Plegables',
    desc: 'Especialistas en bisagra, lámina interna y pantallas flexibles.',
    time: 'Técnicos +5 años',
    href: '/reparacion-plegables',
    Icon: Layers,
    accent: '#A7FF00',
  },
  {
    title: 'Recuperación de datos',
    cat: 'Datos',
    desc: 'Rescatamos fotos, contactos y archivos. 100% privado.',
    time: '24-72 h',
    href: '/recuperacion-datos',
    Icon: HardDrive,
    accent: '#39FF88',
  },
  {
    title: 'Puerto de carga',
    cat: 'Conector',
    desc: 'Limpieza, resoldadura o cambio completo del puerto.',
    time: '≈ 35 min',
    href: '/reparacion-carga',
    Icon: Plug,
    accent: '#CCFF00',
  },
  {
    title: 'Placa base',
    cat: 'Microsoldadura',
    desc: 'Reballing, cambio de IC y reparación de pistas.',
    time: 'Según diagnóstico',
    href: '/reparacion-placa',
    Icon: CircuitBoard,
    accent: '#00E5FF',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 180,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 18,
  });
  const glowX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(my, [-0.5, 0.5], ['0%', '100%']);
  const [hovered, setHovered] = useState(false);

  const { Icon, accent } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <Link
        ref={ref}
        href={service.href}
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          mx.set(0);
          my.set(0);
        }}
        className="group relative block h-full"
      >
        <motion.div
          style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
          className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-sm transition-colors duration-300 group-hover:border-white/30"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: useTransform(
                [glowX, glowY],
                ([x, y]) =>
                  `radial-gradient(420px circle at ${x} ${y}, ${accent}22, transparent 60%)`
              ),
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -top-px left-6 right-6 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              opacity: hovered ? 1 : 0.4,
              transition: 'opacity 400ms',
            }}
          />

          <div className="flex items-start justify-between gap-4">
            <motion.div
              animate={{ rotate: hovered ? [0, -8, 8, 0] : 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${accent}30, transparent 70%)`,
                boxShadow: hovered ? `0 0 28px ${accent}55` : 'none',
                transition: 'box-shadow 400ms',
              }}
            >
              <Icon size={24} style={{ color: accent }} strokeWidth={1.8} />
            </motion.div>

            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-300 group-hover:rotate-45"
              style={{
                background: hovered ? accent : 'transparent',
                borderColor: hovered ? accent : 'rgba(255,255,255,0.2)',
              }}
            >
              <ArrowUpRight
                size={16}
                style={{ color: hovered ? '#000' : '#fff' }}
                strokeWidth={2.4}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <span
              className="text-[10px] font-black uppercase tracking-[0.25em]"
              style={{ color: accent }}
            >
              {service.cat}
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {service.time}
            </span>
          </div>

          <h3
            className="mt-3 text-2xl font-black leading-tight text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            {service.desc}
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/50 transition-colors group-hover:text-white">
            <span>Ver detalles</span>
            <motion.span
              aria-hidden
              initial={{ x: 0 }}
              animate={{ x: hovered ? 6 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ServiciosPage() {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(ellipse at 15% 0%, rgba(0,56,255,0.18) 0%, rgba(0,0,0,0) 55%), radial-gradient(ellipse at 90% 100%, rgba(30,80,220,0.12) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, #05060a 0%, #07090f 50%, #030406 100%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,56,255,0.18), transparent 65%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Header />

      <section className="relative mx-auto max-w-7xl px-6 pt-28 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <Sparkles size={14} style={{ color: '#CCFF00' }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/80">
            Movil Guru · Servicios
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 font-black uppercase leading-[0.82] tracking-tighter"
          style={{
            fontFamily: '"Arial Black", Impact, sans-serif',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            textShadow: '2px 2px 0 #001A99, 4px 4px 0 #001A99, 6px 6px 0 #001A99',
          }}
        >
          Cada reparación,
          <br />
          <span className="relative inline-block">
            <span style={{ color: '#CCFF00' }}>una obsesión.</span>
            <motion.span
              aria-hidden
              className="absolute -bottom-2 left-0 h-[3px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #CCFF00, #00E5FF)' }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-base text-white/60"
        >
          Ocho especialidades. Técnicos certificados. Piezas originales y
          garantía real. Explora la reparación que necesita tu móvil.
        </motion.p>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <ServiceCard key={s.href} service={s} index={i} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-10 backdrop-blur-md sm:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(204,255,0,0.25), transparent 70%)' }}
          />
          <h2
            className="relative font-black leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.03em' }}
          >
            ¿No encuentras tu avería?
          </h2>
          <p className="relative mt-3 text-white/55">
            Diagnóstico gratuito. Te decimos qué pasa y cuánto cuesta antes de tocar nada.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative mt-8 inline-block"
          >
            <Link
              href="/reparacion-pantalla"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-black"
              style={{
                background: '#CCFF00',
                boxShadow: '0 0 40px rgba(204,255,0,0.5)',
              }}
            >
              Reservar reparación
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
