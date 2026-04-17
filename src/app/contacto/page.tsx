"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle,
  Wrench, Shield, Building2, MessageCircle, ChevronDown,
} from "lucide-react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

const contactInfo = [
  { icon: MapPin, label: "Tienda principal", value: "Calle Gran Vía, 28 · Madrid, 28013", sub: "Metro Gran Vía (L1, L5)" },
  { icon: Phone, label: "Teléfono", value: "+34 911 234 567", sub: "Lun–Vie 9:00–20:00" },
  { icon: Mail, label: "Email general", value: "hola@movilguru.es", sub: "Respuesta en < 24 h" },
  { icon: Clock, label: "Horario de atención", value: "Lun–Vie 9:00–20:00", sub: "Sáb 10:00–14:00 · Dom cerrado" },
];

const departments = [
  {
    icon: Wrench,
    label: "Soporte técnico",
    email: "soporte@movilguru.es",
    desc: "Consultas sobre reparaciones en curso, presupuestos y estado de tu dispositivo.",
    responseTime: "< 4 horas laborables",
  },
  {
    icon: Shield,
    label: "Reclamaciones y garantías",
    email: "garantia@movilguru.es",
    desc: "Gestión de reclamaciones de garantía, devoluciones y disputas sobre reparaciones realizadas.",
    responseTime: "< 24 horas laborables",
  },
  {
    icon: Building2,
    label: "Empresas y B2B",
    email: "empresas@movilguru.es",
    desc: "Acuerdos de mantenimiento para flotas de dispositivos, precios especiales y facturación empresarial.",
    responseTime: "< 24 horas laborables",
  },
  {
    icon: MessageCircle,
    label: "Prensa y colaboraciones",
    email: "prensa@movilguru.es",
    desc: "Notas de prensa, colaboraciones con medios, afiliados y propuestas de contenido patrocinado.",
    responseTime: "< 48 horas laborables",
  },
];

const faqs = [
  {
    q: "¿Cuánto tarda una reparación de pantalla?",
    a: "La mayoría de las reparaciones de pantalla se realizan en el mismo día, normalmente entre 1 y 2 horas una vez que el técnico confirma disponibilidad de la pieza. Para dispositivos menos comunes puede llevar 24-48 horas si hay que solicitar la pieza.",
  },
  {
    q: "¿Puedo enviar mi móvil por correo?",
    a: "Sí. Ofrecemos un servicio de recogida a domicilio mediante mensajería asegurada. Una vez aceptado el presupuesto online, programamos la recogida en la franja horaria que prefieras. El dispositivo viaja protegido y asegurado hasta nuestras instalaciones.",
  },
  {
    q: "¿Qué pasa si no acepto el presupuesto?",
    a: "Si después del diagnóstico decides no proceder con la reparación, el dispositivo te será devuelto en el mismo estado. El diagnóstico básico es gratuito en tienda. Para diagnósticos avanzados (placa base, microsoldadura) puede aplicarse un cargo de hasta 15 €.",
  },
  {
    q: "¿Reparan todas las marcas de móvil?",
    a: "Sí. Trabajamos con todas las marcas del mercado: Apple iPhone, Samsung Galaxy, Google Pixel, Xiaomi, Huawei, OnePlus, OPPO, Motorola, Sony y muchas más. También reparamos tablets y portátiles de las principales marcas.",
  },
  {
    q: "¿Cómo puedo hacer seguimiento de mi reparación?",
    a: "Una vez entregado el dispositivo, recibirás un código de seguimiento por SMS o email. Puedes consultar el estado en tiempo real desde la sección «Rastrear mi reparación» de nuestra web. También recibirás notificaciones automáticas en cada cambio de estado.",
  },
  {
    q: "¿Qué garantía tienen las reparaciones?",
    a: "Depende del tipo de pieza: piezas originales OEM con garantía de por vida, piezas premium compatible con 12 meses de garantía, y mano de obra con 90 días de garantía. En la página de garantía puedes consultar todos los detalles y exclusiones.",
  },
  {
    q: "¿Hacen reparaciones de móviles plegables?",
    a: "Sí, tenemos técnicos especializados en dispositivos plegables como el Samsung Galaxy Z Fold/Flip. Estas reparaciones requieren herramientas específicas y piezas originales. Consúltanos el modelo concreto para comprobar disponibilidad de piezas.",
  },
  {
    q: "¿Puedo pedir factura a nombre de mi empresa?",
    a: "Por supuesto. Indícanos el NIF/CIF y los datos de facturación al solicitar el presupuesto y emitiremos la factura a nombre de tu empresa. Ofrecemos condiciones especiales para empresas con varios dispositivos. Escríbenos a empresas@movilguru.es.",
  },
];

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", modelo: "", asunto: "", mensaje: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  }

  return (
    <main className="min-h-screen bg-[#080e14] text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#CCFF00]/4 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-5xl mx-auto relative text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              Contacto
            </span>
            <h1
              className="text-4xl md:text-6xl font-black leading-tight mb-5"
              style={{ fontFamily: "var(--font-display, inherit)", letterSpacing: "-0.03em" }}
            >
              Hablemos
            </h1>
            <p className="text-white/50 text-base max-w-xl mx-auto" style={{ lineHeight: "1.7" }}>
              ¿Tienes el móvil roto? ¿Necesitas un presupuesto? ¿Eres empresa? Elige el canal que mejor se adapte a tu
              consulta y te responderemos en tiempo récord.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-6 pb-14">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "+15.000", label: "Reparaciones al año" },
            { value: "< 2 h", label: "Tiempo medio en tienda" },
            { value: "98 %", label: "Clientes satisfechos" },
            { value: "< 4 h", label: "Respuesta soporte online" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 text-center"
            >
              <p className="text-2xl font-black text-[#CCFF00]" style={{ letterSpacing: "-0.03em" }}>
                {stat.value}
              </p>
              <p className="text-white/40 text-xs mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact info + Form */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="flex items-start gap-4 bg-white/[0.03] border border-white/8 rounded-2xl p-5"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#CCFF00]" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-white/90 text-sm font-medium">{item.value}</p>
                  <p className="text-white/35 text-xs mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-br from-[#CCFF00]/5 to-[#0038FF]/5 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-[#CCFF00]/50 mx-auto mb-2" />
                  <p className="text-white/30 text-xs">Gran Vía, 28 · Madrid</p>
                </div>
              </div>
              <div className="px-5 py-4">
                <p className="text-white/50 text-xs">
                  A 2 min a pie de Metro Gran Vía (L1, L5). Parking en Callao y en la propia Gran Vía.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#CCFF00]/10 flex items-center justify-center mb-2">
                    <CheckCircle className="w-9 h-9 text-[#CCFF00]" />
                  </div>
                  <h3 className="text-xl font-bold">¡Mensaje enviado!</h3>
                  <p className="text-white/50 text-sm max-w-xs" style={{ lineHeight: "1.7" }}>
                    Hemos recibido tu consulta y te responderemos en menos de 4 horas en días laborables. Revisa también
                    tu carpeta de spam.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ nombre: "", email: "", telefono: "", modelo: "", asunto: "", mensaje: "" });
                    }}
                    className="mt-2 text-[#CCFF00] text-sm underline underline-offset-4 hover:text-white transition-colors duration-200"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Envíanos un mensaje</p>
                    <p className="text-white/40 text-xs mb-5">
                      Rellena el formulario y te contactaremos lo antes posible.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Nombre *</label>
                      <input
                        type="text" name="nombre" required value={form.nombre} onChange={handleChange}
                        placeholder="Tu nombre completo"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00]/50 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Teléfono</label>
                      <input
                        type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                        placeholder="+34 600 000 000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00]/50 transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Email *</label>
                    <input
                      type="email" name="email" required value={form.email} onChange={handleChange}
                      placeholder="tu@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00]/50 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                      Modelo del dispositivo
                    </label>
                    <input
                      type="text" name="modelo" value={form.modelo} onChange={handleChange}
                      placeholder="Ej: iPhone 15 Pro, Samsung Galaxy S24..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00]/50 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Asunto *</label>
                    <select
                      name="asunto" required value={form.asunto} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#CCFF00]/50 transition-colors duration-200 appearance-none"
                    >
                      <option value="" className="bg-[#080e14]">Selecciona un asunto</option>
                      <option value="presupuesto" className="bg-[#080e14]">Solicitar presupuesto de reparación</option>
                      <option value="estado" className="bg-[#080e14]">Estado de mi reparación en curso</option>
                      <option value="garantia" className="bg-[#080e14]">Reclamación de garantía</option>
                      <option value="devolucion" className="bg-[#080e14]">Devolución o reembolso</option>
                      <option value="empresas" className="bg-[#080e14]">Colaboración B2B / Flota de dispositivos</option>
                      <option value="factura" className="bg-[#080e14]">Consulta de facturación</option>
                      <option value="otro" className="bg-[#080e14]">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                      Descripción detallada *
                    </label>
                    <textarea
                      name="mensaje" required value={form.mensaje} onChange={handleChange}
                      placeholder="Cuéntanos qué le pasa a tu dispositivo, qué síntomas tiene, si tiene algún daño visible, si se ha mojado, etc. Cuanta más información nos des, más preciso podremos ser en el presupuesto."
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#CCFF00]/50 transition-colors duration-200 resize-none"
                    />
                    <p className="text-white/25 text-xs mt-1.5">
                      Mínimo 20 caracteres. Cuanta más información, mejor presupuesto.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 bg-white/[0.02] border border-white/6 rounded-xl p-4">
                    <input
                      type="checkbox" id="privacy" required
                      className="mt-0.5 w-4 h-4 accent-[#CCFF00] shrink-0"
                    />
                    <label htmlFor="privacy" className="text-white/40 text-xs leading-relaxed">
                      He leído y acepto la{" "}
                      <a href="/privacidad" className="text-[#CCFF00]/70 underline underline-offset-2 hover:text-[#CCFF00]">
                        Política de Privacidad
                      </a>{" "}
                      y los{" "}
                      <a href="/terminos" className="text-[#CCFF00]/70 underline underline-offset-2 hover:text-[#CCFF00]">
                        Términos y Condiciones
                      </a>
                      . Consiento el tratamiento de mis datos para gestionar esta solicitud.
                    </label>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-bold text-sm py-4 rounded-xl hover:bg-[#d9ff33] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Departments */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-black" style={{ letterSpacing: "-0.03em" }}>
              Contacto por departamento
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Si tu consulta es específica, escríbenos directamente al equipo correspondiente.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {departments.map((dept, i) => (
              <motion.a
                key={dept.label}
                href={`mailto:${dept.email}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-[#CCFF00]/30 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center">
                    <dept.icon className="w-4 h-4 text-[#CCFF00]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{dept.label}</p>
                    <p className="text-[#CCFF00]/60 text-xs">{dept.email}</p>
                  </div>
                </div>
                <p className="text-white/45 text-xs mb-3" style={{ lineHeight: "1.7" }}>
                  {dept.desc}
                </p>
                <p className="text-white/30 text-xs">
                  ⏱ Tiempo de respuesta: <span className="text-white/50">{dept.responseTime}</span>
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-black" style={{ letterSpacing: "-0.03em" }}>
              Preguntas frecuentes antes de escribirnos
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Puede que la respuesta ya esté aquí. Si no, escríbenos sin problema.
            </p>
          </motion.div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                className="border border-white/8 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors duration-200 text-left gap-4"
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    className="px-6 pb-5 text-white/50 text-sm border-t border-white/6 pt-4"
                    style={{ lineHeight: "1.8" }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
