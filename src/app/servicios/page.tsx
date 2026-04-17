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
        className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border-2 border-black/8 bg-[#F5F5F0] transition-all duration-300 hover:border-[#0038FF]/30 hover:shadow-[0_8px_40px_rgba(0,56,255,0.12)]"
        style={{ minHeight: 340 }}
      >
        {/* Image top */}
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#F5F5F0]" />

          {/* Blue top bar on hover */}
          <div
            className="absolute top-0 left-0 h-[3px] bg-[#0038FF] transition-all duration-500"
            style={{ width: hovered ? '100%' : '0%' }}
          />

          {/* category + time chips */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-white"
              style={{ background: '#0038FF' }}
            >
              {service.cat}
            </span>
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
              {service.time}
            </span>
          </div>
        </div>

        {/* Text bottom */}
        <div className="flex flex-1 flex-col p-5 pt-4">
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-300"
            style={{
              background: hovered ? '#0038FF' : '#EEF0FF',
              borderColor: hovered ? '#0038FF' : '#D0D5FF',
            }}
          >
            <Icon size={18} color={hovered ? '#CCFF00' : '#0038FF'} strokeWidth={2} />
          </div>

          <h3
            className="text-xl font-black uppercase leading-tight text-black"
            style={{ fontFamily: 'var(--font-display), sans-serif', letterSpacing: '-0.02em' }}
          >
            {index % 3 === 0 ? (
              <>
                <span className="text-[#0038FF]">{service.title.split(' ')[0]}</span>
                {service.title.includes(' ') ? ' ' + service.title.split(' ').slice(1).join(' ') : ''}
              </>
            ) : index % 3 === 1 ? (
              <>
                {service.title.split(' ').slice(0, -1).join(' ')}
                {service.title.includes(' ') ? ' ' : ''}
                <span className="text-[#0038FF]">{service.title.split(' ').slice(-1)[0]}</span>
              </>
            ) : (
              <>
                {service.title.split(' ')[0]}{' '}
                <span className="text-[#0038FF]">{service.title.split(' ').slice(1).join(' ') || service.title}</span>
              </>
            )}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-black/50">
            {service.desc}
          </p>

          {/* CTA row */}
          <div className="mt-5 flex items-center justify-between border-t-2 border-black/8 pt-4">
            <span
              className="text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300"
              style={{ color: hovered ? '#0038FF' : 'rgba(0,0,0,0.35)' }}
            >
              Ver detalles
            </span>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300"
              style={{
                background: hovered ? '#0038FF' : 'transparent',
                borderColor: hovered ? '#0038FF' : 'rgba(0,0,0,0.15)',
                transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
              }}
            >
              <ArrowUpRight size={14} color={hovered ? '#CCFF00' : '#000'} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServiciosPage() {
  return (
    <div className="relative w-full min-h-screen">

      <Header />

      {/* ── BLUE HERO HEADER ── */}
      <div className="relative bg-[#0038FF] w-full overflow-hidden">
        {/* Grid texture — same as hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right,rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.15) 1px,transparent 1px)',
            backgroundSize: '4rem 4rem',
          }}
        />

        <section className="relative mx-auto max-w-[1440px] px-6 pt-16 pb-32 md:pt-20 md:pb-48 flex flex-col items-center justify-center text-center">

          {/* Label badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-md"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]"
              style={{ boxShadow: '0 0 6px #CCFF00' }}
            />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/90">
              Movil Guru · Servicios
            </span>
          </motion.div>

          {/* Main headline — same style as hero */}
          <div className="w-full flex flex-col items-center space-y-2 md:space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(4rem,11vw,140px)] font-black uppercase leading-[0.85] tracking-tighter text-white m-0 p-0"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow:
                  '1px 1px 0 #001A99,2px 2px 0 #001A99,3px 3px 0 #001A99,4px 4px 0 #001A99,5px 5px 0 #001A99,6px 6px 0 #001A99,8px 8px 0 #001A99,10px 10px 0 #001A99,12px 12px 0 #001A99',
              }}
            >
              <span className="text-white">CADA</span>
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-[clamp(4.5rem,14vw,200px)] font-black uppercase leading-[0.85] tracking-tighter text-white m-0 p-0"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow:
                  '1px 1px 0 #001A99,2px 2px 0 #001A99,3px 3px 0 #001A99,4px 4px 0 #001A99,5px 5px 0 #001A99,6px 6px 0 #001A99,8px 8px 0 #001A99,10px 10px 0 #001A99,12px 12px 0 #001A99',
              }}
            >
              <span className="text-[#0038FF]" style={{ WebkitTextStroke: '2px #CCFF00' }}>REPAR</span><span className="text-white">ACIÓN</span>
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="text-[clamp(4rem,11vw,140px)] font-black uppercase leading-[0.85] tracking-tighter text-white m-0 p-0"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow:
                  '1px 1px 0 #001A99,2px 2px 0 #001A99,3px 3px 0 #001A99,4px 4px 0 #001A99,5px 5px 0 #001A99,6px 6px 0 #001A99,8px 8px 0 #001A99,10px 10px 0 #001A99,12px 12px 0 #001A99',
              }}
            >
              <span className="text-white">UNA </span><span className="text-[#CCFF00]">OBSESIÓN.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 max-w-md text-base font-semibold text-white/60 leading-relaxed"
          >
            Ocho especialidades. Técnicos certificados. Piezas originales y garantía real.
          </motion.p>
        </section>
      </div>

      {/* ── WHITE CARD SECTION — same transition as hero ── */}
      <section
        className="bg-white text-black rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-6 py-14 md:px-10 md:py-20 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] -mt-12 w-full"
      >
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/35 mb-1">
                Lo que hacemos
              </p>
              <h2
                className="text-3xl md:text-4xl font-black uppercase leading-tight tracking-tighter text-black"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                Nuestros <span className="text-[#0038FF]">servicios</span>
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-widest text-black/40">
                {services.length} especialidades
              </span>
              <div className="h-px w-12 bg-black/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s.href} service={s} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2rem] bg-[#0038FF] px-8 py-8 md:px-12"
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">
                ¿No encuentras lo que buscas?
              </p>
              <h3
                className="text-2xl md:text-3xl font-black uppercase leading-tight text-white tracking-tighter"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                Consulta gratis.<br />
                <span className="text-[#CCFF00]">Sin compromiso.</span>
              </h3>
            </div>
            <Link
              href="/track"
              className="flex-shrink-0 flex items-center gap-3 rounded-2xl bg-[#CCFF00] px-8 py-4 font-black text-sm uppercase tracking-[0.15em] text-black transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{
                boxShadow: '0 4px 20px rgba(204,255,0,0.35)',
              }}
            >
              Hacer consulta
              <ArrowUpRight size={16} strokeWidth={3} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
