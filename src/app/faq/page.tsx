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
const categories = [
  {
    id: "reparacion",
    label: "Reparación",
    tag: "01",
    accent: "#0038FF",
    questions: [
      {
        q: "¿Cuánto tarda una reparación de pantalla?",
        a: "La mayoría de reparaciones de pantalla se completan en 30–60 minutos. Puedes esperar en el taller o volver cuando esté lista. Para modelos más complejos (plegables, Pro Max) puede ser hasta 90 minutos.",
      },
      {
        q: "¿Necesito pedir cita previa?",
        a: "No es obligatorio, pero lo recomendamos para evitar esperas. Puedes reservar cita online en menos de 2 minutos o llamarnos directamente. Las citas tienen prioridad sobre las entradas sin reserva.",
      },
      {
        q: "¿Puedo traer la pieza yo mismo?",
        a: "Sí, aceptamos piezas del cliente, pero en ese caso la garantía cubre únicamente la mano de obra (90 días) y no la pieza suministrada. Recomendamos nuestras piezas para una cobertura completa.",
      },
      {
        q: "¿Qué pasa si no pueden reparar mi dispositivo?",
        a: "Si tras el diagnóstico no podemos repararlo, no te cobramos nada — ni el diagnóstico. Solo pagamos si hay resultado.",
      },
      {
        q: "¿Reparáis dispositivos con daño por agua?",
        a: "Sí. El tratamiento por líquidos incluye limpieza ultrasónica de placa base, diagnóstico completo y sustitución de componentes afectados. La tasa de recuperación depende del tiempo de exposición y el tipo de líquido.",
      },
      {
        q: "¿Hacéis reparaciones de microsoldadura?",
        a: "Sí, es una de nuestras especialidades. Reparamos componentes a nivel de placa base: conectores de carga rotos internamente, chips de carga, amplificadores de audio y recuperación de datos con fallo de memoria.",
      },
    ],
  },
  {
    id: "precio",
    label: "Precios",
    tag: "02",
    accent: "#CCFF00",
    questions: [
      {
        q: "¿Cómo se calcula el precio de una reparación?",
        a: "El precio depende del modelo del dispositivo, el tipo de reparación y la calidad de la pieza elegida (original OEM vs. premium compatible). Siempre damos presupuesto cerrado antes de empezar — sin sorpresas al recoger.",
      },
      {
        q: "¿Cobráis el diagnóstico aunque no repare?",
        a: "No. El diagnóstico es gratuito. Solo pagas si decides continuar con la reparación. Si rechazas el presupuesto, te devolvemos el dispositivo sin cargo.",
      },
      {
        q: "¿Aceptáis todas las formas de pago?",
        a: "Aceptamos efectivo, tarjeta de débito/crédito, Bizum y transferencia bancaria. Para empresas también facturamos a 30 días.",
      },
      {
        q: "¿Hay descuento si traigo más de un dispositivo?",
        a: "Sí. A partir de 2 dispositivos del mismo propietario aplicamos un 10% de descuento en la segunda reparación y siguientes. Para flotas de empresa consulta nuestras tarifas B2B.",
      },
      {
        q: "¿El precio incluye IVA?",
        a: "Todos los precios mostrados en el taller y en la web incluyen IVA (21%). No hay cargos ocultos ni gastos de gestión.",
      },
    ],
  },
  {
    id: "garantia",
    label: "Garantía",
    tag: "03",
    accent: "#0038FF",
    questions: [
      {
        q: "¿Qué garantía tienen las reparaciones?",
        a: "Depende del tipo de pieza: piezas originales OEM tienen garantía de por vida, piezas premium 12 meses, y la mano de obra 90 días. En todos los casos la garantía se activa automáticamente al recoger el dispositivo.",
      },
      {
        q: "¿Cómo reclamo la garantía?",
        a: "Trae el dispositivo al taller con tu comprobante de reparación. Sin formularios ni trámites. Si el fallo está dentro de la cobertura, lo reparamos gratis ese mismo día.",
      },
      {
        q: "¿La garantía cubre si se me cae el teléfono después?",
        a: "No. La garantía cubre defectos de la pieza instalada o errores en la reparación, no daños externos posteriores (caídas, golpes, líquidos). La reparación original sigue cubierta aunque exista un daño nuevo.",
      },
      {
        q: "¿Puedo llevar el móvil a otro taller y conservar la garantía?",
        a: "No. Si el dispositivo es manipulado por un tercero o el cliente retira nuestros componentes, la garantía queda anulada. Es una condición estándar para proteger la integridad de la reparación.",
      },
    ],
  },
  {
    id: "datos",
    label: "Privacidad",
    tag: "04",
    accent: "#CCFF00",
    questions: [
      {
        q: "¿Accedéis a mis datos personales durante la reparación?",
        a: "No. Nuestro protocolo estricto prohíbe acceder a fotos, mensajes, contactos o cualquier contenido del dispositivo. En reparaciones que requieren acceso al sistema (calibración, diagnóstico de software), lo hacemos con el cliente presente si lo prefiere.",
      },
      {
        q: "¿Debo hacer copia de seguridad antes de traer el móvil?",
        a: "Siempre lo recomendamos. Aunque tomamos todas las precauciones, algunas reparaciones conllevan riesgo residual de pérdida de datos (p.ej. sustitución de placa base). La pérdida de datos no está cubierta por la garantía.",
      },
      {
        q: "¿Qué hacéis con los datos si el dispositivo no se puede recuperar?",
        a: "Si el dispositivo queda irreparable y el cliente lo cede para reciclaje, realizamos un borrado seguro certificado (estándar DoD 5220.22-M) antes de procesarlo. Emitimos certificado de destrucción si se solicita.",
      },
      {
        q: "¿Cumplís con el RGPD?",
        a: "Sí. Tratamos los datos conforme al Reglamento General de Protección de Datos (UE 2016/679). Puedes ejercer tus derechos de acceso, rectificación y supresión contactándonos directamente.",
      },
    ],
  },
  {
    id: "marcas",
    label: "Marcas y modelos",
    tag: "05",
    accent: "#0038FF",
    questions: [
      {
        q: "¿Qué marcas reparáis?",
        a: "Reparamos todas las marcas principales: Apple (iPhone, iPad), Samsung (Galaxy S, A, Z), Google Pixel, Xiaomi, Huawei, OnePlus, Motorola, Sony y más. Si tu modelo no aparece en la web, consúltanos directamente.",
      },
      {
        q: "¿Reparáis móviles plegables?",
        a: "Sí. Somos especialistas en plegables Samsung (Z Fold, Z Flip) y Motorola Razr. Son reparaciones más complejas y con piezas de mayor coste, pero contamos con las herramientas y la experiencia específica.",
      },
      {
        q: "¿Podéis reparar iPhones fuera de garantía Apple?",
        a: "Sí. Reparamos iPhones con piezas de calidad OEM o piezas Apple originales (en modelos que lo permiten). Para modelos con True Tone o Face ID, utilizamos procesos de calibración para preservar todas las funciones.",
      },
      {
        q: "¿Reparáis tablets y iPads?",
        a: "Sí. Pantallas, baterías, conectores y cámaras en iPads de todas las generaciones y en tablets Android de las principales marcas.",
      },
    ],
  },
];

// ─── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({
  q,
  a,
  accent,
  index,
}: {
  q: string;
  a: string;
  accent: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="border-b border-[#080e14]/8 last:border-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between py-5 text-left group gap-4"
      >
        <span className="font-semibold text-[#080e14] text-sm md:text-base leading-snug group-hover:text-[#0038FF] transition-colors duration-200">
          {q}
        </span>
        <span
          className="shrink-0 mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300"
          style={{
            borderColor: open ? accent : "#080e1420",
            backgroundColor: open ? accent : "transparent",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1v8M1 5h8"
              stroke={open ? (accent === "#CCFF00" ? "#000" : "#fff") : "#080e14"}
              strokeOpacity={open ? 1 : 0.4}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[#080e14]/55 text-sm leading-relaxed pb-5 pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("reparacion");
  const current = categories.find((c) => c.id === activeCategory)!;

  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_65%)] pointer-events-none" />
        {/* Question mark watermark */}
        <div
          className="absolute right-[2%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none text-white font-black leading-none"
          style={{
            fontSize: "32rem",
            fontFamily: 'var(--font-display), sans-serif',
            lineHeight: 1,
          }}
        >
          ?
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Movil Guru · FAQ
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
              PREGUNTAS
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
              FRECUENTES
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 text-white/70 text-base md:text-lg leading-relaxed max-w-lg"
          >
            Todo lo que necesitas saber antes, durante y después de tu reparación. Sin tecnicismos, sin letra pequeña.
          </motion.p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── Main content ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 md:gap-16 items-start">

          {/* Sidebar — categories */}
          <div className="md:sticky md:top-24">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#080e14]/40 mb-4">
              Categorías
            </p>
            <nav className="space-y-1">
              {categories.map((cat) => {
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group"
                    style={{
                      backgroundColor: isActive ? cat.accent : "transparent",
                    }}
                  >
                    <span
                      className="font-bold text-sm transition-colors duration-200"
                      style={{
                        color: isActive
                          ? cat.accent === "#CCFF00"
                            ? "#000"
                            : "#fff"
                          : "#080e14",
                        opacity: isActive ? 1 : 0.6,
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      className="text-xs font-black tabular-nums transition-all duration-200"
                      style={{
                        color: isActive
                          ? cat.accent === "#CCFF00"
                            ? "#00000060"
                            : "#ffffff60"
                          : "#080e1430",
                      }}
                    >
                      {cat.questions.length}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Contact nudge */}
            <div className="mt-8 p-5 rounded-2xl bg-[#0038FF]/5 border border-[#0038FF]/10">
              <p className="text-xs font-black text-[#0038FF] mb-1">¿No encuentras tu respuesta?</p>
              <p className="text-xs text-[#080e14]/50 leading-relaxed mb-3">
                Escríbenos por WhatsApp y te respondemos en minutos.
              </p>
              <a
                href="/servicios"
                className="inline-flex items-center gap-1.5 bg-[#0038FF] text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-[#0030e0] transition-colors duration-200"
              >
                Contactar
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Questions panel */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Category header */}
                <div className="flex items-end gap-4 mb-8 pb-6 border-b border-[#080e14]/8">
                  <p
                    className="text-[5rem] font-black leading-none select-none"
                    style={{
                      fontFamily: 'var(--font-display), sans-serif',
                      WebkitTextStroke: `2px ${current.accent}`,
                      color: "transparent",
                    }}
                  >
                    {current.tag}
                  </p>
                  <div className="pb-2">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#080e14]/35 mb-0.5">
                      Categoría
                    </p>
                    <h2
                      className="text-2xl md:text-3xl font-black leading-tight tracking-tight"
                      style={{ fontFamily: "var(--font-display, inherit)" }}
                    >
                      <span className="text-[#080e14]">{current.label.split(" ")[0]}</span>
                      {current.label.split(" ").length > 1 && (
                        <> <span style={{ color: current.accent }}>{current.label.split(" ").slice(1).join(" ")}</span></>
                      )}
                      {current.label.split(" ").length === 1 && (
                        <span style={{ color: current.accent }}>.</span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* Questions */}
                <div>
                  {current.questions.map((item, i) => (
                    <FaqItem
                      key={item.q}
                      q={item.q}
                      a={item.a}
                      accent={current.accent}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── All questions count bar ── */}
      <section className="bg-[#080e14] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById("faq-main")?.scrollIntoView({ behavior: "smooth" });
                }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="text-left p-4 rounded-xl border transition-all duration-200 group"
                style={{
                  borderColor:
                    activeCategory === cat.id ? cat.accent : "rgba(255,255,255,0.08)",
                  backgroundColor:
                    activeCategory === cat.id ? "rgba(255,255,255,0.05)" : "transparent",
                }}
              >
                <p
                  className="text-2xl font-black leading-none mb-1"
                  style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    color: cat.accent,
                  }}
                >
                  {cat.questions.length}
                </p>
                <p className="text-white/50 text-xs font-medium">{cat.label}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

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
            <span className="bg-white/10 border border-white/20 text-white/70 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-6">
              ¿Listo?
            </span>
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              ¿Tienes el <span className="text-[#CCFF00]">móvil</span> roto?
              <br />
              Lo <span className="text-[#CCFF00]">reparamos</span> hoy.
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed mb-8">
              Sin cita previa obligatoria. Diagnóstico gratuito. Garantía incluida desde el primer día.
            </p>
            <a
              href="/servicios"
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-black text-base px-8 py-3.5 rounded-full shadow-[0_0_30px_rgba(204,255,0,0.35)] hover:shadow-[0_0_50px_rgba(204,255,0,0.55)] hover:scale-105 transition-transform transition-shadow duration-200 active:scale-95"
            >
              Reservar reparación
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
