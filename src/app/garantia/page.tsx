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
const warrantyTiers = [
  {
    label: "Piezas Originales",
    duration: "De por vida",
    color: "#CCFF00",
    textColor: "#000",
    description:
      "Todas las piezas con certificación OEM (Original Equipment Manufacturer) están cubiertas de por vida contra defectos de fabricación. Si la pieza falla por un defecto propio, la sustituimos sin coste.",
    icon: "∞",
    includes: [
      "Pantallas originales Apple, Samsung, Google",
      "Baterías OEM certificadas",
      "Conectores de carga originales",
      "Cámaras originales",
    ],
  },
  {
    label: "Piezas Premium",
    duration: "12 meses",
    color: "#0038FF",
    textColor: "#fff",
    description:
      "Las piezas de calidad Premium (compatible de alto rendimiento) tienen 12 meses de cobertura completa. Misma garantía que la pieza original, precio más ajustado.",
    icon: "12",
    includes: [
      "Pantallas Premium Compatible AMOLED/LCD",
      "Baterías de alta capacidad certificadas",
      "Módulos de cámara compatibles",
      "Cristales traseros premium",
    ],
  },
  {
    label: "Mano de Obra",
    duration: "90 días",
    color: "#080e14",
    textColor: "#fff",
    description:
      "Todo el trabajo técnico realizado en tu dispositivo está garantizado durante 90 días. Si el mismo problema reaparece por un error nuestro, lo resolvemos gratis.",
    icon: "90",
    includes: [
      "Soldadura y microsoldadura",
      "Sustitución de conectores",
      "Diagnóstico y reparación de placa base",
      "Calibración de sensores",
    ],
  },
];

const faqs = [
  {
    q: "¿Cómo activo la garantía?",
    a: "La garantía se activa automáticamente desde el momento en que recoges tu dispositivo. No necesitas registro ni trámites. Conserva el comprobante de reparación — es tu única acreditación.",
  },
  {
    q: "¿Qué pasa si el móvil sufre otro daño después de la reparación?",
    a: "Cubrimos exclusivamente la reparación realizada. Si el dispositivo sufre una caída, contacto con líquidos u otro daño externo posterior, ese nuevo daño queda fuera de la garantía. La reparación original sigue cubierta.",
  },
  {
    q: "¿Puedo llevar el móvil a otro taller y conservar la garantía?",
    a: "No. Si el dispositivo es manipulado por un tercero o el cliente retira componentes nuestros, la garantía queda anulada. Es una condición estándar para proteger la integridad de la reparación.",
  },
  {
    q: "¿Cuánto tiempo tengo para reclamar?",
    a: "Puedes presentar una reclamación en cualquier momento dentro del periodo de garantía aplicable (90 días, 12 meses o de por vida según el tipo de pieza). Lleva el dispositivo al taller con el comprobante.",
  },
  {
    q: "¿La garantía cubre la pérdida de datos?",
    a: "No. Recomendamos siempre hacer una copia de seguridad antes de entregar el dispositivo. Aunque utilizamos protocolos de privacidad estrictos, la pérdida de datos no está cubierta por la garantía de reparación.",
  },
  {
    q: "¿Qué ocurre si no podéis reparar el dispositivo?",
    a: "Si tras el diagnóstico no podemos repararlo, no cobramos nada — ni la revisión. Solo pagamos si hay resultado.",
  },
];

const exclusions = [
  "Daños por caída, golpe o presión externa tras la reparación",
  "Daños por contacto con líquidos posteriores a la reparación",
  "Manipulación del dispositivo por terceros no autorizados",
  "Daños por software, virus o actualizaciones de sistema",
  "Desgaste normal de baterías por uso cotidiano",
  "Pérdida o robo del dispositivo",
  "Daños estéticos (arañazos, marcas de uso, decoloración)",
  "Reparaciones realizadas con piezas suministradas por el cliente",
];

// ─── FAQ Accordion ─────────────────────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-white/10"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-white font-semibold text-base md:text-lg pr-4 group-hover:text-[#CCFF00] transition-colors duration-200">
          {q}
        </span>
        <span
          className="shrink-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-[#CCFF00]"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke={open ? "#CCFF00" : "white"}
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
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="text-white/60 text-sm md:text-base leading-relaxed pb-5 pr-12">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function GarantiaPage() {
  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        {/* Lime radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_65%)] pointer-events-none" />
        {/* Shield watermark */}
        <div className="absolute right-[-4%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none">
          <svg width="480" height="540" viewBox="0 0 24 24" fill="white">
            <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Movil Guru · Garantía
            </span>
          </motion.div>

          <div className="flex flex-col gap-1 md:gap-2">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,90px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              POLÍTICA
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,90px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 pl-[8%]"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              GARANTÍA
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-md">
              Cada reparación tiene una garantía real, por escrito y sin letra pequeña. Porque si no lo podemos garantizar, no lo hacemos.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <div className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                Sin letra pequeña
              </div>
              <div className="border border-white/30 text-white/80 text-sm px-5 py-2 rounded-full font-semibold">
                Vigente desde 2019
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── Warranty Tiers ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF] mb-3">
            Coberturas
          </p>
          <h2
            className="text-3xl md:text-5xl font-black text-[#080e14] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            Tres <span className="text-[#0038FF]">niveles,</span>
            <br />
            una <span className="text-[#CCFF00]" style={{ WebkitTextStroke: "1px #080e14" }}>sola</span> <span className="text-[#0038FF]">promesa.</span>
          </h2>
          <p className="mt-4 text-[#080e14]/50 max-w-lg mx-auto leading-relaxed">
            La duración de la garantía depende del tipo de pieza instalada. Siempre te informamos antes de la reparación cuál aplica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warrantyTiers.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden"
              style={{ backgroundColor: tier.color }}
            >
              {/* Top accent line */}
              {tier.color === "#CCFF00" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038FF]" />
              )}
              {tier.color === "#0038FF" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#CCFF00]" />
              )}
              {tier.color === "#080e14" && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0038FF]" />
              )}

              <div className="p-7 md:p-8">
                {/* Duration badge */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p
                      className="text-xs font-black uppercase tracking-wider mb-1"
                      style={{ color: tier.textColor, opacity: 0.5 }}
                    >
                      {tier.label}
                    </p>
                    <p
                      className="text-3xl font-black leading-none"
                      style={{
                        fontFamily: "var(--font-display, inherit)",
                        color: tier.color === "#CCFF00" ? "#0038FF" : "#CCFF00",
                      }}
                    >
                      {tier.duration}
                    </p>
                  </div>
                  <span
                    className="text-4xl font-black leading-none"
                    style={{
                      color: tier.color === "#CCFF00" ? "#0038FF" : "#CCFF00",
                      fontFamily: 'var(--font-display), sans-serif',
                      opacity: 0.9,
                    }}
                  >
                    {tier.icon}
                  </span>
                </div>

                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: tier.textColor, opacity: 0.75 }}
                >
                  {tier.description}
                </p>

                <ul className="space-y-2">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs"
                      style={{ color: tier.textColor }}
                    >
                      <span
                        className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            tier.color === "#CCFF00"
                              ? "#0038FF"
                              : "#CCFF00",
                        }}
                      >
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path
                            d="M1 3l2 2 4-4"
                            stroke={tier.color === "#CCFF00" ? "#fff" : "#000"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span style={{ opacity: 0.85 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How to Claim ── */}
      <section className="bg-[#080e14] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-3">
              Proceso
            </p>
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight"
              style={{}}
            >
              Reclamar <span className="text-[#CCFF00]">la garantía</span>
              <br />
              es <span className="text-[#0038FF]">fácil.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              {
                step: "01",
                titleParts: [
                  { text: "Detectas ", color: "white" },
                  { text: "el problema", color: "#CCFF00" },
                ],
                body: "Observas que la reparación no funciona correctamente o el mismo fallo ha reaparecido.",
              },
              {
                step: "02",
                titleParts: [
                  { text: "Nos ", color: "white" },
                  { text: "contactas", color: "#CCFF00" },
                ],
                body: "Escríbenos por WhatsApp o llama directamente. Sin formularios, sin burocracia.",
              },
              {
                step: "03",
                titleParts: [
                  { text: "Traes ", color: "white" },
                  { text: "el dispositivo", color: "#CCFF00" },
                ],
                body: "Visita el taller con tu comprobante de reparación. Es el único documento que necesitas.",
              },
              {
                step: "04",
                titleParts: [
                  { text: "Lo resolvemos ", color: "white" },
                  { text: "gratis", color: "#CCFF00" },
                ],
                body: "Diagnosticamos y reparamos de nuevo sin coste si el fallo está dentro de la garantía.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative border-t border-white/10 md:border-t-0 md:border-l first:border-l-0 border-white/10 pt-8 md:pt-0 md:pl-8 first:pl-0 pb-8"
              >
                <p
                  className="text-5xl font-black text-white/5 leading-none mb-4 select-none"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  {s.step}
                </p>
                <div className="w-8 h-8 rounded-full bg-[#0038FF] flex items-center justify-center mb-4">
                  <span className="text-[#CCFF00] text-xs font-black">{i + 1}</span>
                </div>
                <h3 className="font-bold text-base mb-2">
                  {s.titleParts.map((part, pi) => (
                    <span key={pi} style={{ color: part.color }}>{part.text}</span>
                  ))}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exclusions ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF] mb-3">
              Exclusiones
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-[#080e14] leading-tight tracking-tight mb-5"
              style={{}}
            >
              Qué no <span className="text-[#0038FF]">cubre</span>
              <br />
              <span className="text-[#CCFF00]">la garantía</span>
            </h2>
            <p className="text-[#080e14]/55 text-base leading-relaxed">
              La transparencia incluye también decirte lo que no está cubierto. Sin sorpresas en el momento menos oportuno.
            </p>

            <div className="mt-8 p-5 rounded-xl border-l-4 border-[#0038FF] bg-[#0038FF]/5">
              <p className="text-sm text-[#0038FF] font-semibold leading-relaxed">
                Si tienes dudas sobre si tu caso está cubierto, consúltanos antes de venir — te damos una respuesta honesta en minutos.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <ul className="space-y-3">
              {exclusions.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 border-[#080e14]/15 flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M2 2l4 4M6 2l-4 4"
                        stroke="#080e14"
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[#080e14]/65 text-sm leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#080e14] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-3">
              Preguntas frecuentes
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight"
              style={{}}
            >
              Todo lo que <span className="text-[#0038FF]">necesitas</span>{" "}
              <span className="text-[#CCFF00]">saber</span>
            </h2>
          </motion.div>

          <div>
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
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
          {/* Grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.08),transparent_70%)] pointer-events-none" />

          <div className="relative z-10">
            <span className="bg-white/10 border border-white/20 text-white/70 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-6">
              ¿Listo para reparar?
            </span>
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4"
              style={{}}
            >
              Tu <span className="text-[#CCFF00]">reparación</span> viene
              <br />
              con <span className="text-[#CCFF00]">garantía</span> incluida.
            </h2>
            <p className="text-white/65 text-base md:text-lg max-w-md mx-auto leading-relaxed mb-8">
              Sin coste si no podemos arreglarlo. Sin sorpresas en el precio. Con garantía real desde el primer día.
            </p>
            <a
              href="/reparacion-pantalla"
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-black text-base px-8 py-3.5 rounded-full shadow-[0_0_30px_rgba(204,255,0,0.35)] hover:shadow-[0_0_50px_rgba(204,255,0,0.55)] hover:scale-105 transition-transform transition-shadow duration-200 active:scale-95"
            >
              Solicitar reparación
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
