'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

export type RuleId = 'garantia' | 'rapidez';

interface FeatureMetric {
  label: string;
  value: number;
  display?: string;
  icon: LucideIcon;
}

interface RuleData {
  id: RuleId;
  number: string;
  label: string;
  title: string;
  headline: string;
  description: string;
  centerIcon: LucideIcon;
  primary: string;
  glow: string;
  status: string;
  features: FeatureMetric[];
  cta: string;
}

const RULES: Record<RuleId, RuleData> = {
  garantia: {
    id: 'garantia',
    number: '01',
    label: 'Garantía',
    title: 'De por vida.',
    headline: 'Cobertura 100%',
    description:
      'Cada reparación cubierta para siempre. Si algo vuelve a fallar, lo arreglamos sin discusión, sin coste, sin letra pequeña. Punto.',
    centerIcon: ShieldCheck,
    primary: '#CCFF00',
    glow: 'rgba(204, 255, 0, 0.45)',
    status: 'Garantía activa',
    cta: 'Activa al salir del taller',
    features: [
      { label: 'Piezas cubiertas', value: 100, icon: ShieldCheck },
      { label: 'Mano de obra', value: 100, icon: Award },
    ],
  },
  rapidez: {
    id: 'rapidez',
    number: '02',
    label: 'Rapidez',
    title: 'En solo\n30 min.',
    headline: '~30 min',
    description:
      'La mayoría de averías resueltas en menos de 30 minutos. Pantallas, baterías y conectores en el día. Sin colas, sin esperas eternas.',
    centerIcon: Zap,
    primary: '#5B7BFF',
    glow: 'rgba(0, 56, 255, 0.55)',
    status: 'Tiempo medio',
    cta: 'Diagnóstico instantáneo',
    features: [
      { label: 'Reparaciones en el día', value: 95, icon: Clock },
      { label: 'Diagnóstico al momento', value: 100, icon: Sparkles },
    ],
  },
};

const ANIMATIONS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  } as Variants,
  item: {
    hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 110, damping: 20 },
    },
    exit: { opacity: 0, y: -10, filter: 'blur(5px)' },
  } as Variants,
  scrollGroup: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
  } as Variants,
  scrollFade: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  } as Variants,
  scrollReveal: {
    hidden: { opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
    },
  } as Variants,
  centerIcon: (isFirst: boolean): Variants => ({
    initial: {
      opacity: 0,
      scale: 0.55,
      filter: 'blur(15px)',
      rotate: isFirst ? -25 : 25,
      x: isFirst ? -60 : 60,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      rotate: 0,
      x: 0,
      transition: { type: 'spring', stiffness: 230, damping: 22 },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      filter: 'blur(20px)',
      transition: { duration: 0.25 },
    },
  }),
};

const BackgroundFx = ({ isFirst }: { isFirst: boolean }) => (
  <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Grid texture (dark lines on white) */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}
    />
    {/* Animated radial gradient — soft brand wash */}
    <motion.div
      animate={{
        background: isFirst
          ? 'radial-gradient(circle at 28% 50%, rgba(204, 255, 0, 0.35), transparent 55%)'
          : 'radial-gradient(circle at 72% 50%, rgba(0, 56, 255, 0.18), transparent 55%)',
      }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    />
  </div>
);

const RuleVisual = ({ data, isFirst }: { data: RuleData; isFirst: boolean }) => {
  const Icon = data.centerIcon;
  return (
    <motion.div
      layout="position"
      className="relative flex flex-col items-center shrink-0"
      style={{ fontFamily: 'var(--font-display), Syne, sans-serif' }}
    >
      {/* Disk wrapper — sizes to disk so the pill below can center under it */}
      <div className="relative">
      {/* Outer dashed rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-18%] rounded-full border border-dashed"
        style={{ borderColor: `${data.primary}33` }}
      />
      {/* Inner counter-rotating ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[6%] rounded-full border"
        style={{ borderColor: `${data.primary}1f` }}
      />
      {/* Pulsing glow */}
      <motion.div
        animate={{ scale: [1, 1.07, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: data.glow }}
      />

      {/* Center disk */}
      <div
        className="relative h-72 w-72 md:h-[420px] md:w-[420px] rounded-full flex items-center justify-center overflow-hidden border"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(0,17,102,0.55), rgba(8,14,20,0.85))',
          borderColor: `${data.primary}33`,
          boxShadow:
            'inset 0 0 80px rgba(0,0,0,0.45), 0 30px 80px rgba(0,0,0,0.55)',
        }}
      >
        {/* Inner micro-grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={data.id}
              variants={ANIMATIONS.centerIcon(isFirst)}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ color: data.primary }}
              className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
            >
              <Icon size={170} strokeWidth={1.4} absoluteStrokeWidth />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      </div>{/* end disk wrapper */}

      {/* Status pill — naturally centered below the disk via items-center */}
      <motion.div
        layout="position"
        className="mt-6 whitespace-nowrap"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            borderColor: `${data.primary}50`,
            color: 'rgba(255,255,255,0.78)',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: data.primary }}
          />
          <span>{data.status}</span>
          <span style={{ color: data.primary, fontWeight: 800 }}>
            {data.headline}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RuleDetails = ({ data, isFirst }: { data: RuleData; isFirst: boolean }) => {
  const align = isFirst ? 'items-start text-left' : 'items-end text-right';
  const flexDir = isFirst ? 'flex-row' : 'flex-row-reverse';
  const margin = isFirst ? 'mr-auto' : 'ml-auto';
  const fontFamily = 'var(--font-display), Syne, sans-serif';

  return (
    <motion.div
      variants={ANIMATIONS.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${align}`}
      style={{ fontFamily }}
    >
      <motion.span
        variants={ANIMATIONS.item}
        className="mb-3"
        style={{
          color: data.primary,
          fontSize: '11px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          fontWeight: 800,
        }}
      >
        Regla {data.number} · {data.label}
      </motion.span>
      <motion.h3
        variants={ANIMATIONS.item}
        className="mb-5"
        style={{
          fontFamily,
          color: '#ffffff',
          fontSize: 'clamp(36px, 5vw, 68px)',
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          fontWeight: 800,
          textTransform: 'uppercase',
          whiteSpace: 'pre',
        }}
      >
        {data.title}
      </motion.h3>
      <motion.p
        variants={ANIMATIONS.item}
        className={`mb-8 max-w-md ${margin}`}
        style={{
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: '17px',
          lineHeight: 1.55,
          fontWeight: 500,
        }}
      >
        {data.description}
      </motion.p>

      {/* Feature panel */}
      <motion.div
        variants={ANIMATIONS.item}
        className="w-full max-w-md p-6 rounded-2xl border space-y-5"
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.1)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {data.features.map((feature, idx) => {
          const FIcon = feature.icon;
          return (
            <div key={feature.label}>
              <div
                className={`flex items-center justify-between mb-2 ${flexDir}`}
              >
                <div
                  className="flex items-center gap-2"
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <FIcon size={15} strokeWidth={2} />
                  <span>{feature.label}</span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 800,
                  }}
                >
                  {feature.display ?? `${feature.value}%`}
                </span>
              </div>
              <div
                className="relative h-[5px] w-full rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${feature.value}%` }}
                  transition={{
                    duration: 1.1,
                    delay: 0.4 + idx * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`absolute top-0 bottom-0 ${
                    isFirst ? 'left-0' : 'right-0'
                  }`}
                  style={{
                    background: data.primary,
                    boxShadow: `0 0 12px ${data.primary}80`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div
          className={`pt-3 flex ${
            isFirst ? 'justify-start' : 'justify-end'
          }`}
        >
          <button
            type="button"
            className="flex items-center gap-2 transition-colors group"
            style={{
              color: data.primary,
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            <Sparkles size={13} />
            <span>{data.cta}</span>
            <ChevronRight
              size={13}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </motion.div>

      {/* Confirmation row */}
      <motion.div
        variants={ANIMATIONS.item}
        className={`mt-6 flex items-center gap-3 ${flexDir}`}
        style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        <CheckCircle2 size={16} style={{ color: data.primary }} />
        <span style={{ fontSize: '13px', fontWeight: 600 }}>
          Sin condiciones. Sin asteriscos.
        </span>
      </motion.div>
    </motion.div>
  );
};

const RuleSwitcher = ({
  activeId,
  onToggle,
}: {
  activeId: RuleId;
  onToggle: (id: RuleId) => void;
}) => {
  const options = (Object.values(RULES) as RuleData[]).map((r) => ({
    id: r.id,
    label: r.label,
    primary: r.primary,
  }));
  const fontFamily = 'var(--font-display), Syne, sans-serif';

  return (
    <div className="flex justify-center mt-12 md:mt-16">
      <motion.div
        layout
        className="flex items-center gap-1 p-1.5 rounded-full border"
        style={{
          background: '#080e14',
          borderColor: 'rgba(255,255,255,0.12)',
          boxShadow:
            '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {options.map((opt) => {
          const isActive = activeId === opt.id;
          return (
            <motion.button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              whileTap={{ scale: 0.96 }}
              className="relative h-12 w-32 md:w-36 rounded-full flex items-center justify-center focus:outline-none"
              style={{
                fontFamily,
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 800,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="rule-pill-bg"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, ${opt.primary}26, ${opt.primary}08)`,
                    border: `1px solid ${opt.primary}55`,
                    boxShadow: `inset 0 1px 0 ${opt.primary}33, 0 0 24px ${opt.primary}33`,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                />
              )}
              <span
                className="relative z-10 transition-colors duration-300"
                style={{
                  color: isActive ? opt.primary : 'rgba(255,255,255,0.5)',
                }}
              >
                {opt.label}
              </span>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, scaleX: 0.5 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  className="absolute -bottom-1 h-[3px] w-8 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${opt.primary}, transparent)`,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default function MovilGuruRulesShowcase() {
  const [active, setActive] = useState<RuleId>('garantia');
  const data = RULES[active];
  const isFirst = active === 'garantia';
  const fontFamily = 'var(--font-display), Syne, sans-serif';

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100vh',
        background: '#080e14',
        color: '#ffffff',
        fontFamily,
      }}
    >
      <BackgroundFx isFirst={isFirst} />

      <motion.div
        className="relative z-10 px-6 py-16 md:py-20 max-w-7xl mx-auto w-full"
        variants={ANIMATIONS.scrollGroup}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Section header */}
        <div className="mb-12 md:mb-16 max-w-6xl mx-auto text-center">
          <motion.span
            variants={ANIMATIONS.scrollFade}
            className="inline-block mb-3"
            style={{
              color: '#0038FF',
              fontSize: '12px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              fontWeight: 800,
            }}
          >
            Cómo trabajamos
          </motion.span>
          <motion.h2
            variants={ANIMATIONS.scrollReveal}
            style={{
              fontFamily,
              fontSize: 'clamp(34px, 4.6vw, 72px)',
              fontWeight: 800,
              textTransform: 'uppercase',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            Dos reglas que{' '}
            <em
              style={{
                fontStyle: 'normal',
                color: '#0038FF',
              }}
            >
              nunca
            </em>
            <br />
            nos faltan.
          </motion.h2>
        </div>

        <motion.div
          variants={ANIMATIONS.scrollFade}
          className={`flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24 w-full ${
            isFirst ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          <RuleVisual data={data} isFirst={isFirst} />

          <div className="w-full max-w-md md:min-h-[540px] md:flex md:items-center">
            <AnimatePresence mode="wait">
              <RuleDetails
                key={active}
                data={data}
                isFirst={isFirst}
              />
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={ANIMATIONS.scrollFade}>
          <RuleSwitcher activeId={active} onToggle={setActive} />
        </motion.div>
      </motion.div>
    </section>
  );
}
