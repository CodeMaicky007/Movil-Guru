'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

const Header = dynamic(
  () => import('@/components/ui/header-3').then((m) => m.Header),
  { ssr: false }
);

type Brand = {
  id: string;
  name: string;
  fullName: string;
  modelCount: string;
  description: string;
  badge: string;
  logoSrc: string;
  accentColor: string;
  href: string;
  tags: string[];
};

const brands: Brand[] = [
  {
    id: 'iphone',
    name: 'iPhone',
    fullName: 'Apple iPhone',
    modelCount: '40+ modelos',
    description: 'iPhone 4 al 16 Pro Max · Pantalla, batería, cámara y más',
    badge: 'Garantía de por vida',
    logoSrc: '/images/Apple.png',
    accentColor: '#1d1d1f',
    href: '/reparacion/iphone',
    tags: ['apple', 'iphone', 'ios'],
  },
  {
    id: 'samsung',
    name: 'Samsung',
    fullName: 'Samsung Galaxy',
    modelCount: '35+ modelos',
    description: 'Galaxy S, A, Z Fold y Flip · Plegables incluidos',
    badge: 'Mismo día',
    logoSrc: '/images/Samsung.png',
    accentColor: '#1428A0',
    href: '/reparacion/samsung',
    tags: ['samsung', 'galaxy', 'android'],
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    fullName: 'Xiaomi · Redmi · POCO',
    modelCount: '30+ modelos',
    description: 'Xiaomi, Redmi y POCO · Diagnóstico gratis',
    badge: 'Diagnóstico gratis',
    logoSrc: '/images/Xiaomi.png',
    accentColor: '#FF6900',
    href: '/reparacion/xiaomi',
    tags: ['xiaomi', 'redmi', 'poco', 'android'],
  },
  {
    id: 'huawei',
    name: 'Huawei',
    fullName: 'Huawei',
    modelCount: '18+ modelos',
    description: 'P, Mate, Nova y MediaPad · Presupuesto gratis',
    badge: 'Presupuesto gratis',
    logoSrc: '/images/huawei.png',
    accentColor: '#CF0A2C',
    href: '/reparacion/huawei',
    tags: ['huawei', 'android'],
  },
  {
    id: 'pixel',
    name: 'Google Pixel',
    fullName: 'Google Pixel',
    modelCount: '12+ modelos',
    description: 'Pixel 6 al 9 Pro Fold · Garantía incluida',
    badge: 'Garantía incluida',
    logoSrc: '/images/GooglePixel.png',
    accentColor: '#4285F4',
    href: '/reparacion/pixel',
    tags: ['google', 'pixel', 'android'],
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    fullName: 'OnePlus',
    modelCount: '16+ modelos',
    description: 'OnePlus 9 al 13 · Nord series · Técnicos certificados',
    badge: 'Técnicos certificados',
    logoSrc: '/images/oneplus.png',
    accentColor: '#F5010C',
    href: '/reparacion/oneplus',
    tags: ['oneplus', 'nord', 'android'],
  },
  {
    id: 'motorola',
    name: 'Motorola',
    fullName: 'Motorola Razr',
    modelCount: '15+ modelos',
    description: 'Razr 40, 40 Ultra, 50, 50 Ultra · Plegables',
    badge: 'Plegables incluidos',
    logoSrc: 'https://www.google.com/s2/favicons?domain=motorola.com&sz=64',
    accentColor: '#005EB8',
    href: '/reparacion/motorola',
    tags: ['motorola', 'razr', 'android'],
  },
  {
    id: 'sony',
    name: 'Sony Xperia',
    fullName: 'Sony Xperia',
    modelCount: '12+ modelos',
    description: 'Xperia 1, 5 y 10 series · Mismo día',
    badge: 'Mismo día',
    logoSrc: 'https://www.google.com/s2/favicons?domain=sony.com&sz=64',
    accentColor: '#000000',
    href: '/reparacion/sony',
    tags: ['sony', 'xperia', 'android'],
  },
  {
    id: 'lg',
    name: 'LG',
    fullName: 'LG',
    modelCount: '12+ modelos',
    description: 'G, V, Q y K series · Presupuesto gratis',
    badge: 'Presupuesto gratis',
    logoSrc: 'https://www.google.com/s2/favicons?domain=lg.com&sz=64',
    accentColor: '#A50034',
    href: '/reparacion/lg',
    tags: ['lg', 'android'],
  },
  {
    id: 'nokia',
    name: 'Nokia',
    fullName: 'Nokia',
    modelCount: '10+ modelos',
    description: 'G, C, X y XR series · Garantía incluida',
    badge: 'Garantía incluida',
    logoSrc: 'https://www.google.com/s2/favicons?domain=nokia.com&sz=64',
    accentColor: '#005AFF',
    href: '/reparacion/nokia',
    tags: ['nokia', 'android'],
  },
  {
    id: 'vivo',
    name: 'Vivo',
    fullName: 'Vivo',
    modelCount: '10+ modelos',
    description: 'X, V e Y series · Mismo día',
    badge: 'Mismo día',
    logoSrc: 'https://www.google.com/s2/favicons?domain=vivo.com&sz=64',
    accentColor: '#415FFF',
    href: '/reparacion/vivo',
    tags: ['vivo', 'android'],
  },
  {
    id: 'htc',
    name: 'HTC',
    fullName: 'HTC',
    modelCount: '8+ modelos',
    description: 'U, One y Desire series · Garantía incluida',
    badge: 'Garantía incluida',
    logoSrc: 'https://www.google.com/s2/favicons?domain=htc.com&sz=64',
    accentColor: '#69BE28',
    href: '/reparacion/htc',
    tags: ['htc', 'android'],
  },
  {
    id: 'bq',
    name: 'BQ',
    fullName: 'BQ Aquaris',
    modelCount: '6+ modelos',
    description: 'Aquaris X, V, U y M series · Diagnóstico gratis',
    badge: 'Diagnóstico gratis',
    logoSrc: 'https://www.google.com/s2/favicons?domain=bq.com&sz=64',
    accentColor: '#E4002B',
    href: '/reparacion/bq',
    tags: ['bq', 'aquaris', 'android'],
  },
  {
    id: 'meizu',
    name: 'Meizu',
    fullName: 'Meizu',
    modelCount: '10+ modelos',
    description: 'Meizu 16–21 · Pro · MX series · Garantía incluida',
    badge: 'Garantía incluida',
    logoSrc: 'https://www.google.com/s2/favicons?domain=meizu.com&sz=64',
    accentColor: '#0066CC',
    href: '/reparacion/meizu',
    tags: ['meizu', 'android'],
  },
  {
    id: 'asus',
    name: 'ASUS',
    fullName: 'ASUS ROG · ZenFone',
    modelCount: '17+ modelos',
    description: 'ROG Phone · ZenFone series · Técnicos certificados',
    badge: 'Técnicos certificados',
    logoSrc: 'https://www.google.com/s2/favicons?domain=asus.com&sz=64',
    accentColor: '#00539B',
    href: '/reparacion/asus',
    tags: ['asus', 'rog', 'zenfone', 'android'],
  },
];

export default function MarcasPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return brands;
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.fullName.toLowerCase().includes(q) ||
        b.tags.some((t) => t.includes(q)) ||
        b.description.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="relative w-full min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <div className="relative bg-[#0038FF] w-full overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right,rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.12) 1px,transparent 1px)',
            backgroundSize: '4rem 4rem',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(204,255,0,0.08), transparent 65%)' }} />

        <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-36 md:pt-28 md:pb-44">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#CCFF00]" style={{ boxShadow: '0 0 6px #CCFF00' }} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/90">
              Movil Guru · {brands.length} marcas
            </span>
          </motion.div>

          <div className="flex flex-col gap-1 md:gap-2">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,10vw,130px)] font-black leading-[0.88] tracking-tighter uppercase text-[#CCFF00] m-0"
              style={{ fontFamily: 'var(--font-display), sans-serif', textShadow: '2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99' }}
            >
              TODAS
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,10vw,130px)] font-black leading-[0.88] tracking-tighter uppercase text-white m-0 pl-[6%]"
              style={{ fontFamily: 'var(--font-display), sans-serif', textShadow: '2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99' }}
            >
              LAS MARCAS
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-md text-base font-semibold text-white/60 leading-relaxed"
          >
            Reparamos cualquier móvil. Técnicos certificados, piezas originales y garantía real en cada reparación.
          </motion.p>
        </section>

        <div className="absolute bottom-0 left-0 right-0 h-14 bg-white" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </div>

      {/* ── BRANDS GRID ── */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Search */}
          <div className="relative mb-12 max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-[#0038FF]">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca tu marca de móvil…"
              className="w-full pl-11 pr-11 py-4 rounded-2xl border-2 border-[#0038FF]/20 bg-white text-[#0a0a0a] text-sm font-semibold placeholder:text-[#0a0a0a]/30 outline-none focus:border-[#0038FF] transition-all duration-200 shadow-sm"
              style={{ fontFamily: 'var(--font-display), sans-serif', boxShadow: '0 0 0 0 transparent' }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 4px rgba(0,56,255,0.08)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0 transparent')}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-4 flex items-center text-[#0a0a0a]/30 hover:text-[#0038FF] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0a0a0a]/35 mb-0.5">Marcas disponibles</p>
              <h2 className="text-2xl md:text-3xl font-black text-[#0a0a0a] tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                {search
                  ? <><span className="text-[#0038FF]">{filtered.length}</span> resultado{filtered.length !== 1 ? 's' : ''} para "{search}"</>
                  : <>{brands.length} <span className="text-[#0038FF]">marcas</span></>
                }
              </h2>
            </div>
            {search && filtered.length > 0 && (
              <button onClick={() => setSearch('')} className="text-xs font-black text-[#0038FF] underline underline-offset-4 hover:no-underline">
                Ver todas
              </button>
            )}
          </div>

          {/* Empty state */}
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="py-24 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0038FF]/8 flex items-center justify-center mx-auto mb-5">
                  <svg width="26" height="26" viewBox="0 0 20 20" fill="none" className="text-[#0038FF]">
                    <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2" />
                    <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[#0a0a0a]/40 text-sm font-semibold mb-3">
                  No encontramos <span className="text-[#0038FF]">"{search}"</span>
                </p>
                <button onClick={() => setSearch('')} className="text-xs font-black text-[#0038FF] underline underline-offset-4 hover:no-underline">
                  Ver todas las marcas
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((brand, i) => (
                <motion.div
                  key={brand.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={brand.href}
                    className="group relative flex flex-col items-center gap-4 bg-white rounded-2xl p-5 border border-[#0a0a0a]/6 hover:border-[#0038FF]/35 hover:shadow-[0_8px_32px_rgba(0,56,255,0.1)] transition-all duration-200 text-center overflow-hidden h-full"
                  >
                    {/* Accent bar on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"
                      style={{ backgroundColor: brand.accentColor }}
                    />

                    {/* Logo */}
                    <div
                      className="w-14 h-14 rounded-2xl border border-[#0a0a0a]/6 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
                      style={{ backgroundColor: `${brand.accentColor}12` }}
                    >
                      <img
                        src={brand.logoSrc}
                        alt={brand.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Name */}
                    <div className="flex-1 flex flex-col items-center gap-1.5">
                      <p
                        className="font-black text-[#0a0a0a] group-hover:text-[#0038FF] transition-colors text-sm leading-tight"
                        style={{ fontFamily: 'var(--font-display), sans-serif' }}
                      >
                        {brand.name}
                      </p>
                      <p className="text-[10px] text-[#0a0a0a]/35 font-medium">{brand.modelCount}</p>
                    </div>

                    {/* Badge */}
                    <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0038FF]/6 text-[#0038FF] group-hover:bg-[#0038FF] group-hover:text-white transition-all duration-200">
                      {brand.badge}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2rem] bg-[#0038FF] px-8 py-8 md:px-12"
          >
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">
                ¿No encuentras tu marca?
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
              href="/contacto"
              className="flex-shrink-0 flex items-center gap-3 rounded-2xl bg-[#CCFF00] px-8 py-4 font-black text-sm uppercase tracking-[0.15em] text-black transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{ boxShadow: '0 4px 20px rgba(204,255,0,0.35)' }}
            >
              Contactar ahora
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
