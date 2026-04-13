'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Smartphone,
  Battery,
  Droplets,
  Camera,
  Layers,
  HardDrive,
  Plug,
  CircuitBoard,
  Sparkles,
  ArrowUpRight,
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
  image: string;
};

const services: Service[] = [
  {
    title: 'Pantalla rota',
    cat: 'Display',
    desc: 'Cambio de cristal y LCD/OLED con piezas originales. Acabado de fábrica.',
    time: '≈ 47 min',
    href: '/reparacion-pantalla',
    Icon: Smartphone,
    image: 'https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&w=700',
  },
  {
    title: 'Cambio de batería',
    cat: 'Energía',
    desc: 'Recupera autonomía con baterías certificadas y calibración completa.',
    time: '≈ 20 min',
    href: '/reparacion-bateria',
    Icon: Battery,
    image: 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&w=700',
  },
  {
    title: 'Daño por agua',
    cat: 'Líquidos',
    desc: 'Diagnóstico a placa, ultrasonidos y limpieza de corrosión.',
    time: 'Diagnóstico',
    href: '/reparacion-agua',
    Icon: Droplets,
    image: 'https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&w=700',
  },
  {
    title: 'Reparación de cámara',
    cat: 'Óptica',
    desc: 'Módulos delanteros y traseros, lente, estabilizador y sensor.',
    time: 'Mismo día',
    href: '/reparacion-camara',
    Icon: Camera,
    image: 'https://images.pexels.com/photos/4195504/pexels-photo-4195504.jpeg?auto=compress&w=700',
  },
  {
    title: 'Móviles plegables',
    cat: 'Plegables',
    desc: 'Especialistas en bisagra, lámina interna y pantallas flexibles.',
    time: 'Técnicos +5 años',
    href: '/reparacion-plegables',
    Icon: Layers,
    image: 'https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&w=700',
  },
  {
    title: 'Recuperación de datos',
    cat: 'Datos',
    desc: 'Rescatamos fotos, contactos y archivos. 100% privado.',
    time: '24-72 h',
    href: '/recuperacion-datos',
    Icon: HardDrive,
    image: 'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&w=700',
  },
  {
    title: 'Puerto de carga',
    cat: 'Conector',
    desc: 'Limpieza, resoldadura o cambio completo del puerto.',
    time: '≈ 35 min',
    href: '/reparacion-carga',
    Icon: Plug,
    image: 'https://images.pexels.com/photos/4195326/pexels-photo-4195326.jpeg?auto=compress&w=700',
  },
  {
    title: 'Placa base',
    cat: 'Microsoldadura',
    desc: 'Reballing, cambio de IC y reparación de pistas.',
    time: 'Según diagnóstico',
    href: '/reparacion-placa',
    Icon: CircuitBoard,
    image: 'https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&w=700',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { Icon } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={service.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#060812] transition-colors duration-300 hover:border-[#CCFF00]/30"
        style={{ minHeight: 340 }}
      >
        {/* ── Image top half ── */}
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* gradient bridge */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-[#060812]" />

          {/* lime top-bar on hover */}
          <div
            className="absolute top-0 left-0 h-[2px] bg-[#CCFF00] transition-all duration-500"
            style={{ width: hovered ? '100%' : '0%' }}
          />

          {/* category + time chips */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em]"
              style={{
                background: 'rgba(204,255,0,0.12)',
                color: '#CCFF00',
                border: '1px solid rgba(204,255,0,0.2)',
              }}
            >
              {service.cat}
            </span>
            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/50 backdrop-blur-sm">
              {service.time}
            </span>
          </div>
        </div>

        {/* ── Text bottom half ── */}
        <div className="flex flex-1 flex-col p-5 pt-4">
          {/* icon */}
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition-all duration-300"
            style={{
              background: hovered
                ? 'rgba(0,56,255,0.25)'
                : 'rgba(0,56,255,0.10)',
              boxShadow: hovered ? '0 0 20px rgba(0,56,255,0.4)' : 'none',
            }}
          >
            <Icon size={18} color={hovered ? '#CCFF00' : '#0038FF'} strokeWidth={2} />
          </div>

          <h3
            className="text-xl font-black leading-tight text-white"
            style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
          >
            {service.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
            {service.desc}
          </p>

          {/* CTA row */}
          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span
              className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300"
              style={{ color: hovered ? '#CCFF00' : 'rgba(255,255,255,0.35)' }}
            >
              Ver detalles
            </span>
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300"
              style={{
                background: hovered ? '#CCFF00' : 'transparent',
                borderColor: hovered ? '#CCFF00' : 'rgba(255,255,255,0.15)',
                transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
              }}
            >
              <ArrowUpRight size={13} color={hovered ? '#000' : '#fff'} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServiciosPage() {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden text-white"
      style={{ background: '#060812' }}
    >
      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Blue ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,56,255,0.18), transparent 65%)', filter: 'blur(40px)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-32 h-[400px] w-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #CCFF00, transparent 70%)', filter: 'blur(60px)' }}
      />

      <Header />

      {/* ── Hero header ── */}
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
          className="mt-6 font-black uppercase leading-[0.85] tracking-tighter"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
          }}
        >
          Cada reparación,
          <br />
          <span className="relative inline-block" style={{ color: '#CCFF00' }}>
            una obsesión.
            <motion.span
              aria-hidden
              className="absolute -bottom-2 left-0 h-[3px] rounded-full"
              style={{ background: 'linear-gradient(90deg, #CCFF00, #0038FF)' }}
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
          className="mx-auto mt-6 max-w-xl text-base text-white/50"
        >
          Ocho especialidades. Técnicos certificados. Piezas originales y garantía real.
        </motion.p>
      </section>

      {/* ── Service grid ── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-28">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <ServiceCard key={s.href} service={s} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
