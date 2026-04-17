"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

// ─── Data ─────────────────────────────────────────────────────────────────────
interface GuideStep {
  title: string;
  body: string;
  tip?: string;
}

interface Guide {
  id: string;
  tag: string;
  accent: string;
  title: string;
  subtitle: string;
  difficulty: "Fácil" | "Medio" | "Avanzado";
  time: string;
  warning?: string;
  steps: GuideStep[];
}

const guides: Guide[] = [
  {
    id: "pantalla-rota",
    tag: "01",
    accent: "#0038FF",
    title: "Tu pantalla está rota",
    subtitle: "Qué hacer paso a paso antes de ir al taller",
    difficulty: "Fácil",
    time: "5 min lectura",
    steps: [
      {
        title: "No quites los trozos de cristal",
        body: "Si la pantalla está agrietada pero funciona, no intentes retirar fragmentos de cristal. Puedes dañar el digitalizador táctil debajo.",
        tip: "Pon un cristal templado por encima para evitar cortes mientras lo usas temporalmente.",
      },
      {
        title: "Haz una copia de seguridad inmediata",
        body: "Si la pantalla aún responde al tacto, haz backup ahora. En iCloud / Google Drive. Incluye fotos, WhatsApp y contactos.",
        tip: "Si no puedes tocar la pantalla, conecta un ratón USB-C OTG para navegar.",
      },
      {
        title: "Comprueba si la pantalla es solo el cristal o también el LCD/OLED",
        body: "Si ves colores correctos y no hay manchas negras/verdes, probablemente solo se haya roto el cristal exterior. Si hay líneas de colores, el panel OLED está afectado — la reparación será diferente.",
      },
      {
        title: "Trae el dispositivo al taller",
        body: "No necesitas cita. Diagnóstico gratuito en 10 minutos. Te damos precio cerrado y tiempo estimado antes de empezar.",
        tip: "Si el móvil no enciende, tráelo igual — podemos diagnosticarlo.",
      },
    ],
  },
  {
    id: "bateria-hinchada",
    tag: "02",
    accent: "#CCFF00",
    title: "Tu batería se hincha o se calienta",
    subtitle: "Esto es urgente — sigue estos pasos",
    difficulty: "Fácil",
    time: "3 min lectura",
    warning: "Una batería hinchada puede ser peligrosa. No la pinches, no la cargues y no la dejes al sol.",
    steps: [
      {
        title: "Deja de usar el dispositivo inmediatamente",
        body: "No lo cargues, no lo pongas en el bolsillo. Si la carcasa trasera se ha levantado, es señal clara de hinchazón.",
      },
      {
        title: "No intentes abrirlo tú mismo",
        body: "Perforar una batería de litio puede causar un incendio. Déjalo en una superficie no inflamable, lejos de materiales combustibles.",
      },
      {
        title: "Tráelo al taller lo antes posible",
        body: "Sustituimos la batería en menos de 30 minutos en la mayoría de modelos. Retiramos y reciclamos la batería antigua de forma segura y certificada.",
        tip: "Si no puedes venir hoy, guárdalo apagado en un recipiente metálico o de cerámica.",
      },
    ],
  },
  {
    id: "no-carga",
    tag: "03",
    accent: "#0038FF",
    title: "Tu móvil no carga",
    subtitle: "Antes de pensar lo peor, comprueba esto",
    difficulty: "Fácil",
    time: "4 min lectura",
    steps: [
      {
        title: "Prueba con otro cable y otro cargador",
        body: "El 40% de los problemas de carga son por un cable deteriorado o un cargador que no da suficiente amperaje. Usa el original si es posible.",
      },
      {
        title: "Limpia el puerto de carga",
        body: "Con un palillo de madera (nunca metal), retira la pelusa acumulada del puerto. Es la causa más habitual — y la más fácil de resolver.",
        tip: "Usa una lupa y una linterna para ver bien el interior del puerto.",
      },
      {
        title: "Prueba la carga inalámbrica (si tu modelo lo soporta)",
        body: "Si carga por Qi pero no por cable, el problema es del puerto o del conector. Si no carga por ningún método, puede ser un fallo de placa.",
      },
      {
        title: "Si nada funciona, trae el dispositivo",
        body: "Diagnosticamos si es el puerto (reparación rápida ~30 min) o un problema de placa base (más complejo pero posible con microsoldadura).",
      },
    ],
  },
  {
    id: "agua",
    tag: "04",
    accent: "#CCFF00",
    title: "Se ha mojado tu móvil",
    subtitle: "El arroz NO funciona — haz esto en su lugar",
    difficulty: "Medio",
    time: "5 min lectura",
    warning: "Cada minuto cuenta. Actúa rápido para maximizar las posibilidades de recuperación.",
    steps: [
      {
        title: "Apágalo inmediatamente",
        body: "Si el móvil aún funciona, apágalo. No lo cargues. No lo sacudas. Cada circuito activo con agua dentro multiplica el daño por cortocircuito.",
      },
      {
        title: "Seca el exterior con un paño",
        body: "Retira la funda y la tarjeta SIM. Seca el exterior con un paño que no suelte pelusa. No uses secador de pelo — el calor puede dañar componentes.",
      },
      {
        title: "NO lo metas en arroz",
        body: "El arroz no absorbe humedad del interior del móvil. Además, el almidón puede dejar residuos en el puerto de carga. Es un mito.",
        tip: "Si tienes bolsas de gel de sílice en casa, coloca el móvil junto a ellas en un recipiente cerrado.",
      },
      {
        title: "Tráelo al taller en las siguientes 24 horas",
        body: "Realizamos limpieza ultrasónica de la placa base y secado profesional. Cuanto antes llega, mayor es la tasa de recuperación (>80% si llega en <12h).",
      },
    ],
  },
  {
    id: "lento",
    tag: "05",
    accent: "#0038FF",
    title: "Tu móvil va muy lento",
    subtitle: "Antes de comprar uno nuevo, prueba esto",
    difficulty: "Medio",
    time: "6 min lectura",
    steps: [
      {
        title: "Comprueba el almacenamiento disponible",
        body: "Si tienes menos del 10% de espacio libre, el sistema se ralentiza. Borra fotos duplicadas, apps que no usas y descargas antiguas.",
        tip: "iPhone: Ajustes > General > Almacenamiento. Android: Ajustes > Almacenamiento.",
      },
      {
        title: "Reinicia el dispositivo",
        body: "Un reinicio completo cierra procesos en segundo plano y libera RAM. Suena simple, pero resuelve el 30% de los problemas de rendimiento.",
      },
      {
        title: "Actualiza el sistema operativo",
        body: "Las actualizaciones de iOS/Android incluyen correcciones de rendimiento. Si tu modelo ya no recibe actualizaciones, considera si es viable seguir usándolo.",
      },
      {
        title: "Valora un cambio de batería",
        body: "Una batería degradada (<80% de salud) limita el rendimiento del procesador en iPhone (y en algunos Android). Cambiar la batería puede hacer que el móvil vuelva a ir como nuevo.",
        tip: "Comprueba la salud de la batería: iPhone en Ajustes > Batería > Salud. Android con apps como AccuBattery.",
      },
      {
        title: "Restablecimiento de fábrica (último recurso)",
        body: "Si nada funciona, un restablecimiento de fábrica elimina software corrupto. Haz backup completo antes. Si después del reseteo sigue lento, el problema puede ser de hardware.",
      },
    ],
  },
  {
    id: "datos",
    tag: "06",
    accent: "#CCFF00",
    title: "Has perdido datos o fotos",
    subtitle: "Hay opciones de recuperación — no todo está perdido",
    difficulty: "Avanzado",
    time: "5 min lectura",
    steps: [
      {
        title: "Comprueba la nube primero",
        body: "Google Photos, iCloud Photos, OneDrive. Muchas veces las fotos están sincronizadas sin que lo recuerdes. Comprueba también la papelera (se conservan 30-60 días).",
      },
      {
        title: "No instales apps ni hagas fotos nuevas",
        body: "Si los datos se borraron del almacenamiento interno, cada dato nuevo que escribas puede sobrescribir los archivos eliminados, haciéndolos irrecuperables.",
      },
      {
        title: "Contacta con nosotros para recuperación avanzada",
        body: "Ofrecemos recuperación de datos a nivel de chip de memoria (chip-off). Es un proceso de microsoldadura que permite extraer datos incluso de dispositivos que no encienden.",
        tip: "Tasa de éxito ~70-85% dependiendo del tipo de daño. Diagnosticamos antes de presupuestar.",
      },
    ],
  },
];

const difficultyColors: Record<string, string> = {
  "Fácil": "#CCFF00",
  "Medio": "#0038FF",
  "Avanzado": "#ff3d3d",
};

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function GuiaPage() {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_65%)] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Movil Guru · Guía
            </span>
          </motion.div>

          <div className="flex flex-col gap-1 md:gap-2">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,10vw,130px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              GUÍA DE
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,10vw,130px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 pl-[6%]"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              <span className="text-white">REPAR</span><span className="text-[#CCFF00]">ACIÓN</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 text-white/70 text-base md:text-lg leading-relaxed max-w-lg"
          >
            Selecciona tu problema. Te explicamos qué hacer ahora mismo, qué no hacer y cuándo necesitas un profesional.
          </motion.p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── Guide grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((guide, i) => (
            <motion.button
              key={guide.id}
              onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="relative text-left rounded-2xl overflow-hidden border transition-all duration-300 group"
              style={{
                borderColor: activeGuide === guide.id ? guide.accent : "#080e1410",
                boxShadow:
                  activeGuide === guide.id
                    ? `0 4px 32px ${guide.accent}18`
                    : "none",
              }}
            >
              {/* Top accent */}
              <div
                className="h-1 w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{
                  backgroundColor: guide.accent,
                  transform: activeGuide === guide.id ? "scaleX(1)" : undefined,
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p
                    className="text-[3rem] font-black leading-none select-none"
                    style={{
                      fontFamily: 'var(--font-display), sans-serif',
                      WebkitTextStroke: `2px ${guide.accent}`,
                      color: "transparent",
                    }}
                  >
                    {guide.tag}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: difficultyColors[guide.difficulty] + "20",
                        color: difficultyColors[guide.difficulty],
                      }}
                    >
                      {guide.difficulty}
                    </span>
                    <span className="text-[10px] text-[#080e14]/30 font-medium">{guide.time}</span>
                  </div>
                </div>

                <h3
                  className="font-black text-[#080e14] text-base mb-1 leading-tight transition-colors duration-200"
                  style={{ fontFamily: "var(--font-display, inherit)" }}
                >
                  <span className="text-[#0038FF]">{guide.title.split(' ')[0]}</span>{' '}
                  <span className="group-hover:text-[#0038FF] transition-colors duration-200">{guide.title.split(' ').slice(1).join(' ')}</span>
                </h3>
                <p className="text-[#080e14]/45 text-xs leading-relaxed">{guide.subtitle}</p>

                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#0038FF]/60">
                  <span>{activeGuide === guide.id ? "Cerrar guía" : "Ver guía"}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="transition-transform duration-300"
                    style={{
                      transform: activeGuide === guide.id ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Expanded guide ── */}
      <AnimatePresence>
        {activeGuide && (
          <motion.section
            key={activeGuide}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {(() => {
              const guide = guides.find((g) => g.id === activeGuide)!;
              return (
                <div className="bg-[#080e14] py-16 md:py-24">
                  <div className="max-w-3xl mx-auto px-6">
                    {/* Guide header */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="mb-10"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <p
                          className="text-5xl font-black leading-none select-none"
                          style={{
                            fontFamily: 'var(--font-display), sans-serif',
                            WebkitTextStroke: `2px ${guide.accent}`,
                            color: "transparent",
                          }}
                        >
                          {guide.tag}
                        </p>
                        <div>
                          <h2
                            className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight"
                            style={{ fontFamily: "var(--font-display, inherit)" }}
                          >
                            <span style={{ color: guide.accent }}>{guide.title.split(' ')[0]}</span>{' '}
                            {guide.title.split(' ').slice(1).join(' ')}
                          </h2>
                          <p className="text-white/40 text-sm">{guide.subtitle}</p>
                        </div>
                      </div>

                      {guide.warning && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                        >
                          <span className="shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mt-0.5">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M6 3v4M6 9h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </span>
                          <p className="text-red-300 text-sm leading-relaxed font-medium">
                            {guide.warning}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Steps */}
                    <div className="space-y-0">
                      {guide.steps.map((step, i) => (
                        <motion.div
                          key={step.title}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                          className="relative pl-10 pb-8 last:pb-0"
                        >
                          {/* Line */}
                          {i < guide.steps.length - 1 && (
                            <div
                              className="absolute left-[13px] top-[28px] w-0.5 h-[calc(100%-12px)]"
                              style={{ backgroundColor: guide.accent + "30" }}
                            />
                          )}
                          {/* Dot */}
                          <div
                            className="absolute left-0 top-[6px] w-[27px] h-[27px] rounded-full flex items-center justify-center text-xs font-black"
                            style={{
                              backgroundColor: guide.accent,
                              color: guide.accent === "#CCFF00" ? "#000" : "#fff",
                            }}
                          >
                            {i + 1}
                          </div>

                          <h3 className="text-white font-bold text-base mb-1.5">
                            {step.title.split(' ').map((word, wi) =>
                              wi === step.title.split(' ').length - 1
                                ? <span key={wi} style={{ color: guide.accent }}>{word}</span>
                                : <span key={wi}>{word}{' '}</span>
                            )}
                          </h3>
                          <p className="text-white/55 text-sm leading-relaxed">{step.body}</p>

                          {step.tip && (
                            <div className="mt-3 bg-white/5 border border-white/8 rounded-lg p-3 flex items-start gap-2">
                              <span
                                className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                                style={{
                                  backgroundColor: guide.accent + "20",
                                  color: guide.accent,
                                }}
                              >
                                Tip
                              </span>
                              <p className="text-white/45 text-xs leading-relaxed">{step.tip}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom action */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-10 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <p className="text-white/40 text-sm">
                        ¿Necesitas ayuda profesional? Diagnóstico gratuito.
                      </p>
                      <a
                        href="/servicios"
                        className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-black text-sm px-6 py-2.5 rounded-full hover:shadow-[0_0_24px_rgba(204,255,0,0.3)] hover:scale-105 transition-all duration-200 active:scale-95"
                      >
                        Reservar reparación
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </motion.div>
                  </div>
                </div>
              );
            })()}
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-[#0038FF] overflow-hidden p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.08),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              ¿Prefieres que lo haga
              <br />
              <span className="text-[#CCFF00]">un profesional?</span>
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed mb-8">
              Trae tu dispositivo sin cita previa. Diagnóstico gratuito y presupuesto al momento. Solo reparamos si tú decides.
            </p>
            <a
              href="/servicios"
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-black text-base px-8 py-3.5 rounded-full shadow-[0_0_30px_rgba(204,255,0,0.35)] hover:shadow-[0_0_50px_rgba(204,255,0,0.55)] hover:scale-105 transition-transform duration-200 active:scale-95"
            >
              Solicitar reparación
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
