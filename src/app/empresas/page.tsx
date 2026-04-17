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
const plans = [
  {
    name: "Empresa",
    tag: "Más popular",
    price: "Desde 15€",
    unit: "/ reparación",
    description: "Para PYMEs y equipos de hasta 50 dispositivos al mes.",
    color: "#0038FF",
    accent: "#CCFF00",
    features: [
      "Gestor de cuenta asignado",
      "Recogida y entrega en oficina",
      "Factura mensual consolidada",
      "Garantía extendida 18 meses",
      "Portal de seguimiento en tiempo real",
      "SLA: entrega en 24 h laborables",
    ],
  },
  {
    name: "Corporativo",
    tag: "Flota grande",
    price: "A medida",
    unit: "presupuesto cerrado",
    description: "Para flotas de +50 dispositivos con necesidades específicas.",
    color: "#CCFF00",
    accent: "#0038FF",
    features: [
      "Todo lo del plan Empresa",
      "Técnico desplazado a sede",
      "Contrato anual con precio fijo",
      "Reporting mensual detallado",
      "Protocolo RGPD certificado",
      "Integración con MDM / ITSM",
    ],
  },
  {
    name: "Starter B2B",
    tag: "Para empezar",
    price: "Sin mínimos",
    unit: "pago por uso",
    description: "Sin compromisos. Descuento B2B desde la primera reparación.",
    color: "#080e14",
    accent: "#CCFF00",
    features: [
      "10% descuento sobre tarifa estándar",
      "Facturación a 30 días",
      "Portal de seguimiento",
      "Garantía estándar 12 meses",
      "Soporte prioritario por WhatsApp",
    ],
  },
];

const sectors = [
  { tag: "01", accent: "#0038FF", name: "Oficinas y corporaciones", desc: "Flotas de smartphones y tablets para equipos comerciales y dirección." },
  { tag: "02", accent: "#CCFF00", name: "Hoteles y hostelería", desc: "TPVs, tablets de recepción, handhelds de servicio y móviles de staff." },
  { tag: "03", accent: "#0038FF", name: "Logística y transporte", desc: "Scanners, ruggedized devices y smartphones de repartidores." },
  { tag: "04", accent: "#CCFF00", name: "Clínicas y salud", desc: "Dispositivos médicos compatibles, tablets de gestión y móviles de guardia." },
  { tag: "05", accent: "#0038FF", name: "Educación", desc: "Chromebooks, tablets de alumnos y dispositivos de administración." },
  { tag: "06", accent: "#CCFF00", name: "Servicios técnicos", desc: "Herramientas de campo, lectores de código de barras y dispositivos industriales." },
];

const stats = [
  { value: "500+", label: "Empresas clientes" },
  { value: "24h", label: "SLA estándar" },
  { value: "98%", label: "Satisfacción B2B" },
  { value: "∞", label: "Garantía piezas OEM" },
];

const faqs = [
  {
    q: "¿Hay un mínimo de dispositivos para acceder al precio B2B?",
    a: "No. Desde la primera reparación puedes facturar como empresa y beneficiarte del descuento B2B. Para el plan Empresa o Corporativo recomendamos un volumen mínimo de 5 dispositivos al mes.",
  },
  {
    q: "¿Cómo funciona la recogida y entrega en oficina?",
    a: "Coordinamos una ruta mensual o semanal según tu volumen. Un técnico recoge los dispositivos, los repara en taller y los devuelve en el plazo acordado — sin que tu equipo pierda tiempo.",
  },
  {
    q: "¿Cumplen con RGPD para datos corporativos?",
    a: "Sí. Todos los dispositivos pasan por nuestro protocolo de privacidad certificado: sin acceso a datos, sin copia de contenidos. Los clientes Corporativo reciben un certificado de custodia por cada dispositivo.",
  },
  {
    q: "¿Puedo integrar vuestro portal con nuestro sistema ITSM?",
    a: "Disponible en el plan Corporativo. Ofrecemos integración vía API REST con Jira, ServiceNow y sistemas MDM principales. Contacta con nosotros para un piloto.",
  },
  {
    q: "¿La garantía aplica igual que a particulares?",
    a: "Las empresas tienen garantía extendida: 18 meses en plan Empresa y 24 meses en Corporativo sobre piezas premium. Las piezas originales OEM mantienen garantía de por vida en todos los planes.",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="border-b border-white/10"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-white font-semibold text-base pr-4 group-hover:text-[#CCFF00] transition-colors duration-200">
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
            <p className="text-white/60 text-sm leading-relaxed pb-5 pr-12">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function EmpresasPage() {
  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_65%)] pointer-events-none" />
        {/* Briefcase watermark */}
        <div className="absolute right-[-2%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none">
          <svg width="520" height="520" viewBox="0 0 24 24" fill="white">
            <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
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
              Movil Guru · B2B
            </span>
          </motion.div>

          <div className="flex flex-col gap-1 md:gap-2">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,11vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              PARA
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,11vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 pl-[8%]"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              <span className="text-white">EM</span><span className="text-[#CCFF00]">PRESAS</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-md">
              Gestión integral de la flota de dispositivos de tu empresa. Precios cerrados, recogida en oficina, factura mensual y garantía extendida.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <div className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                Sin mínimos
              </div>
              <div className="border border-white/30 text-white/80 text-sm px-5 py-2 rounded-full font-semibold">
                500+ empresas
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <p
                className="text-[clamp(2.5rem,6vw,4rem)] font-black text-[#0038FF] leading-none tracking-tighter"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {s.value}
              </p>
              <p className="text-[#080e14]/50 text-sm mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
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
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              Cero fricción para
              <br />
              <span className="text-[#CCFF00]">tu departamento</span>{" "}
              <span className="text-[#0038FF]">IT.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {[
              { step: "01", title: "Alta como empresa", body: "Rellena el formulario B2B. En menos de 2 horas tienes tu cuenta activa con acceso al portal." },
              { step: "02", title: "Solicitas recogida", body: "Desde el portal o por WhatsApp. Indicamos fecha, hora y número de dispositivos." },
              { step: "03", title: "Recogemos en oficina", body: "Nuestro técnico va a tu sede, entrega albarán por cada dispositivo y lo traslada al taller." },
              { step: "04", title: "Reparamos en 24 h", body: "Diagnóstico, reparación y control de calidad. Seguimiento en tiempo real desde el portal." },
              { step: "05", title: "Devolución y factura", body: "Entregamos los dispositivos reparados. Factura consolidada a 30 días al cierre de mes." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative border-t border-white/10 md:border-t-0 md:border-l first:border-l-0 border-white/10 pt-8 md:pt-0 md:pl-6 first:pl-0 pb-8"
              >
                <p
                  className="text-5xl font-black text-white/5 leading-none mb-4 select-none"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  {s.step}
                </p>
                <div className="w-7 h-7 rounded-full bg-[#0038FF] flex items-center justify-center mb-4">
                  <span className="text-[#CCFF00] text-xs font-black">{i + 1}</span>
                </div>
                <h3 className="text-white font-bold text-sm mb-2">
                  {s.title.split(' ').map((word, wi) =>
                    wi === 0
                      ? <span key={wi} className="text-[#CCFF00]">{word}{' '}</span>
                      : <span key={wi}>{word}{wi < s.title.split(' ').length - 1 ? ' ' : ''}</span>
                  )}
                </h3>
                <p className="text-white/45 text-xs leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF] mb-3">
            Planes
          </p>
          <h2
            className="text-3xl md:text-5xl font-black text-black leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            El plan que{" "}
            <span className="text-[#0038FF]">se adapta</span>
            <br />
            <span className="text-[#CCFF00]" style={{ WebkitTextStroke: "1px #b8e600" }}>a tu flota.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: plan.color }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: plan.accent }}
              />

              <div className="p-7 md:p-8 flex flex-col flex-1">
                {/* Tag */}
                <span
                  className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-5 w-fit"
                  style={{
                    backgroundColor: plan.accent,
                    color: plan.accent === "#CCFF00" ? "#000" : "#fff",
                  }}
                >
                  {plan.tag}
                </span>

                <p
                  className="text-sm font-bold mb-1"
                  style={{
                    color: plan.color === "#CCFF00" ? "#000" : "#fff",
                    opacity: 0.6,
                  }}
                >
                  {plan.name}
                </p>
                <p
                  className="text-4xl font-black leading-none mb-1"
                  style={{
                    fontFamily: "var(--font-display, inherit)",
                    color: plan.accent,
                  }}
                >
                  {plan.price}
                </p>
                <p
                  className="text-xs mb-4"
                  style={{
                    color: plan.color === "#CCFF00" ? "#000" : "#fff",
                    opacity: 0.45,
                  }}
                >
                  {plan.unit}
                </p>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{
                    color: plan.color === "#CCFF00" ? "#000" : "#fff",
                    opacity: 0.65,
                  }}
                >
                  {plan.description}
                </p>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-xs"
                      style={{ color: plan.color === "#CCFF00" ? "#000" : "#fff" }}
                    >
                      <span
                        className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: plan.accent }}
                      >
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path
                            d="M1 3l2 2 4-4"
                            stroke={plan.accent === "#CCFF00" ? "#000" : "#fff"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span style={{ opacity: 0.85 }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contacto"
                  className="block text-center font-black text-sm py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  style={{
                    backgroundColor: plan.accent,
                    color: plan.accent === "#CCFF00" ? "#000" : "#fff",
                    boxShadow:
                      plan.accent === "#CCFF00"
                        ? "0 0 20px rgba(204,255,0,0.3)"
                        : "0 0 20px rgba(0,56,255,0.3)",
                  }}
                >
                  Solicitar información
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Sectors ── */}
      <section className="bg-[#f5f5f5] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF] mb-3">
              Sectores
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-[#080e14] leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              Trabajamos con <span className="text-[#0038FF]">todos</span> los <span className="text-[#0038FF]">sectores</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sectors.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group bg-white rounded-2xl p-6 border border-[#080e14]/5 hover:border-[#0038FF]/20 hover:shadow-[0_4px_24px_rgba(0,56,255,0.07)] transition-all duration-200 overflow-hidden relative"
              >
                {/* Accent bar top */}
                <div
                  className="absolute top-0 left-0 w-full h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: s.accent }}
                />
                {/* Number */}
                <p
                  className="text-[3.5rem] font-black leading-none mb-4 select-none"
                  style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    WebkitTextStroke: `2px ${s.accent}`,
                    color: "transparent",
                  }}
                >
                  {s.tag}
                </p>
                <h3 className="font-black text-[#080e14] text-sm mb-1.5">
                  <span style={{ color: s.accent }}>{s.name.split(' ')[0]}</span>{' '}
                  {s.name.split(' ').slice(1).join(' ')}
                </h3>
                <p className="text-[#080e14]/50 text-xs leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
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
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              Todo lo que <span className="text-[#CCFF00]">necesita saber</span> tu IT
            </h2>
          </motion.div>
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section id="contacto" className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-[#0038FF] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.08),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-16 items-center">
            <div>
              <span className="bg-white/10 border border-white/20 text-white/70 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-6">
                Habla con nosotros
              </span>
              <h2
                className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-4"
                style={{ fontFamily: "var(--font-display, inherit)" }}
              >
                Gestiona la flota de
                <br />
                <span className="text-[#CCFF00]">tu empresa hoy.</span>
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Cuéntanos el tamaño de tu flota y te preparamos un presupuesto cerrado en menos de 24 horas. Sin compromiso.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="space-y-3">
                {[
                  { label: "Nombre y empresa", type: "text", placeholder: "Acme Corp — Ana García" },
                  { label: "Email corporativo", type: "email", placeholder: "ana@acmecorp.com" },
                  { label: "Nº aproximado de dispositivos / mes", type: "text", placeholder: "Ej: 20 móviles y 10 tablets" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-white/60 text-xs font-semibold mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CCFF00] transition-colors duration-200"
                    />
                  </div>
                ))}
                <button className="w-full mt-2 bg-[#CCFF00] text-black font-black text-sm py-3 rounded-xl hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] hover:scale-[1.02] transition-all duration-200 active:scale-95">
                  Solicitar presupuesto B2B
                </button>
                <p className="text-white/30 text-xs text-center">
                  Respuesta garantizada en menos de 24 h laborables
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
