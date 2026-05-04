'use client';
import { motion } from 'motion/react';

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&fit=crop',
    eyebrow: 'Cofundador',
    label: 'Carlos · Valladolid 2016',
  },
  {
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80&fit=crop',
    eyebrow: 'Director técnico',
    label: 'Miguel · Jefe de taller',
  },
  {
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop',
    eyebrow: 'Operaciones',
    label: 'Laura · Expansión León',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop',
    eyebrow: 'Cofundador',
    label: 'Javier · Estrategia y visión',
  },
  {
    src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80&fit=crop',
    eyebrow: 'Equipo',
    label: 'Ana · Atención al cliente',
  },
];

export function ImageGallery() {
  return (
    <section className="relative w-full bg-white px-4">
      <div
        className="relative w-full overflow-hidden px-6 py-16 sm:px-12 sm:py-20"
        style={{ background: '#0038FF' }}
      >
        {/* Glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-0 h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(0,20,180,0.4), transparent 70%)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-5%] h-[300px] w-[300px] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(204,255,0,0.07), transparent 70%)' }}
        />

        <motion.div
          className="relative mx-auto max-w-3xl text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-[0.4em] mb-3"
            style={{ color: '#CCFF00' }}
          >
            ◆ Quiénes somos
          </p>
          <h2
            className="text-3xl md:text-4xl font-black uppercase leading-tight tracking-[-0.03em] text-white"
          >
            Los creadores detrás de{' '}
            <span style={{ color: '#CCFF00' }}>Movil Guru.</span>
          </h2>
          <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Un equipo apasionado de técnicos y emprendedores que apostaron por la honestidad y la calidad desde el primer día.
          </p>
        </motion.div>

        <motion.div
          className="relative flex items-stretch gap-2 h-[400px] w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="relative group flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ flexBasis: '18%', flexGrow: 1 }}
              onMouseEnter={(e) => {
                const parent = e.currentTarget.parentElement;
                if (!parent) return;
                Array.from(parent.children).forEach((child, i) => {
                  (child as HTMLElement).style.flexGrow = i === idx ? '3.5' : '0.55';
                });
              }}
              onMouseLeave={(e) => {
                const parent = e.currentTarget.parentElement;
                if (!parent) return;
                Array.from(parent.children).forEach((el) => {
                  (el as HTMLElement).style.flexGrow = '1';
                });
              }}
            >
              <img
                src={img.src}
                alt={img.label}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay — always present */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,16,60,0.9) 0%, rgba(0,16,60,0.3) 55%, transparent 100%)',
                }}
              />
              {/* Label — fades in on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span
                  className="block text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                  style={{ color: '#CCFF00' }}
                >
                  {img.eyebrow}
                </span>
                <span className="block text-sm font-black uppercase leading-tight text-white">
                  {img.label}
                </span>
              </div>
              {/* Lime border on hover */}
              <div
                className="absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ borderColor: '#CCFF00' }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
