"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

const sections = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    subsections: [
      {
        subtitle: "Datos identificativos",
        content:
          "El responsable del tratamiento de los datos personales recabados a través de este sitio web es Movil Guru S.L., con domicilio social en Calle Gran Vía, 28, 28013 Madrid, España. CIF: B-XXXXXXXX. Inscrita en el Registro Mercantil de Madrid, Tomo XXXXX, Folio XX, Hoja M-XXXXXX.",
      },
      {
        subtitle: "Delegado de Protección de Datos (DPD)",
        content:
          "Movil Guru ha designado un Delegado de Protección de Datos (DPD) al que puedes dirigirte para cualquier cuestión relativa al tratamiento de tus datos personales o al ejercicio de tus derechos. Puedes contactar con el DPD en la dirección dpd@movilguru.es o mediante carta certificada al domicilio social indicado, haciendo constar en el asunto «Delegado de Protección de Datos».",
      },
    ],
  },
  {
    id: "datos-recogidos",
    title: "2. Datos personales que recopilamos",
    subsections: [
      {
        subtitle: "Datos facilitados directamente",
        content:
          "Cuando interactúas con nuestros servicios, es posible que nos proporciones: nombre y apellidos, dirección de correo electrónico, número de teléfono, dirección postal (para servicios de recogida y envío), modelo y número IMEI del dispositivo, y descripción de la avería o problema técnico. Todos estos datos son necesarios para la prestación del servicio y, en caso de no facilitarlos, no podremos atender tu solicitud.",
      },
      {
        subtitle: "Datos recabados automáticamente",
        content:
          "Al navegar por movilguru.es, nuestros sistemas recaban automáticamente cierta información técnica: dirección IP, tipo y versión del navegador, sistema operativo, páginas visitadas, tiempo de permanencia, fuente de tráfico (referral), y resolución de pantalla. Esta información se recoge mediante cookies y tecnologías similares descritas en la sección 9 de esta política.",
      },
      {
        subtitle: "Datos de transacciones",
        content:
          "Si realizas un pago a través de nuestra plataforma, los datos de tarjeta de crédito o débito son procesados directamente por nuestro proveedor de pagos certificado PCI-DSS (Stripe, Inc. o equivalente). Movil Guru no almacena ni accede a los datos completos de tu tarjeta en ningún momento. Únicamente conservamos un token de pago anonimizado para gestionar devoluciones.",
      },
      {
        subtitle: "Datos de menores",
        content:
          "Nuestros servicios no están dirigidos a menores de 14 años. Si eres menor de 14 años, debes obtener el consentimiento de tu padre, madre o tutor legal antes de facilitarnos cualquier dato personal. Si detectamos que hemos recogido datos de un menor sin el consentimiento verificable del tutor, los eliminaremos sin demora.",
      },
    ],
  },
  {
    id: "finalidades",
    title: "3. Finalidades y bases legales del tratamiento",
    subsections: [
      {
        subtitle: "Gestión del servicio de reparación (base: ejecución de contrato)",
        content:
          "Utilizamos tus datos para gestionar el presupuesto, la recogida del dispositivo, la reparación, la comunicación sobre el estado del servicio y la entrega del dispositivo reparado. Sin este tratamiento no es posible prestar el servicio contratado.",
      },
      {
        subtitle: "Facturación y obligaciones fiscales (base: obligación legal)",
        content:
          "Los datos de facturación se procesan para cumplir con las obligaciones contables y fiscales establecidas en la Ley 37/1992 del IVA, el Real Decreto Legislativo 1/2010 de Sociedades de Capital y demás normativa tributaria española aplicable.",
      },
      {
        subtitle: "Comunicaciones comerciales (base: consentimiento)",
        content:
          "Si has marcado expresamente la casilla de consentimiento durante el proceso de registro o compra, utilizaremos tu correo electrónico y/o teléfono para enviarte información sobre promociones, descuentos, lanzamientos de productos y novedades de Movil Guru. Puedes revocar este consentimiento en cualquier momento de forma gratuita mediante el enlace de baja incluido en cada comunicación o escribiendo a marketing@movilguru.es.",
      },
      {
        subtitle: "Mejora del servicio y analítica (base: interés legítimo)",
        content:
          "Analizamos el comportamiento agregado y anonimizado de los usuarios para mejorar la experiencia de navegación, detectar errores técnicos y optimizar el rendimiento del sitio. Este análisis no permite identificar a ningún usuario concreto y se realiza sobre datos previamente agregados.",
      },
      {
        subtitle: "Prevención del fraude (base: interés legítimo)",
        content:
          "Podemos procesar datos de navegación y transacción para detectar y prevenir actividades fraudulentas, intentos de acceso no autorizado, o usos abusivos de nuestros servicios. Este tratamiento es proporcional y se limita a lo estrictamente necesario para la seguridad de la plataforma.",
      },
    ],
  },
  {
    id: "conservacion",
    title: "4. Plazos de conservación",
    subsections: [
      {
        subtitle: "Criterios generales",
        content:
          "Conservamos tus datos durante el tiempo imprescindible para la finalidad para la que fueron recogidos. Una vez cumplida dicha finalidad, los datos se bloquearán y se conservarán únicamente a disposición de las Administraciones Públicas, jueces y tribunales para la atención de las posibles responsabilidades que pudieran surgir, hasta que prescriban las mismas. Transcurrido dicho plazo, los datos serán suprimidos definitivamente.",
      },
      {
        subtitle: "Plazos específicos por categoría",
        content:
          "Datos de reparación activa: durante toda la vigencia del servicio y la garantía aplicable (mínimo 12 meses desde la entrega). Datos de facturación: 5 años conforme a la Ley General Tributaria. Datos de comunicaciones comerciales: hasta que retires el consentimiento. Registros de navegación (logs): máximo 12 meses. Datos de prevención del fraude: máximo 3 años.",
      },
    ],
  },
  {
    id: "destinatarios",
    title: "5. Destinatarios y transferencias internacionales",
    subsections: [
      {
        subtitle: "Encargados del tratamiento",
        content:
          "Para prestar el servicio, Movil Guru puede compartir tus datos con terceros que actúan como encargados del tratamiento bajo un contrato de encargo ajustado al artículo 28 del RGPD. Los principales encargados son: empresas de mensajería y logística para la recogida y entrega de dispositivos, proveedores de infraestructura cloud (servidores y bases de datos), herramientas de análisis web (Google Analytics con IP anonimizada) y plataformas de email marketing bajo contrato DPA.",
      },
      {
        subtitle: "Transferencias internacionales",
        content:
          "Algunos de nuestros proveedores de servicios están establecidos fuera del Espacio Económico Europeo (EEE). En estos casos, nos aseguramos de que existan las garantías adecuadas mediante cláusulas contractuales tipo aprobadas por la Comisión Europea, mecanismos de certificación reconocidos o decisiones de adecuación. Puedes solicitar información sobre las garantías específicas aplicables contactando con nuestro DPD.",
      },
      {
        subtitle: "Cesiones a terceros",
        content:
          "Movil Guru no vende, alquila ni cede tus datos personales a terceros con fines comerciales. Los datos solo se comunicarán a terceros cuando exista obligación legal (Fuerzas y Cuerpos de Seguridad del Estado, Administración Tributaria, Juzgados y Tribunales) o cuando sea necesario para ejecutar el contrato contigo.",
      },
    ],
  },
  {
    id: "derechos",
    title: "6. Tus derechos",
    subsections: [
      {
        subtitle: "Catálogo de derechos RGPD",
        content:
          "De acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales (LOPDGDD), tienes los siguientes derechos: (a) Acceso: conocer qué datos tuyos tratamos y con qué finalidad. (b) Rectificación: corregir datos inexactos o incompletos. (c) Supresión («derecho al olvido»): solicitar la eliminación de tus datos cuando ya no sean necesarios. (d) Oposición: oponerte al tratamiento basado en interés legítimo. (e) Limitación: restringir el tratamiento mientras se resuelve una impugnación. (f) Portabilidad: recibir tus datos en formato estructurado y de uso común. (g) No ser objeto de decisiones automatizadas: derecho a intervención humana en decisiones significativas basadas exclusivamente en tratamiento automatizado.",
      },
      {
        subtitle: "Cómo ejercer tus derechos",
        content:
          "Puedes ejercer cualquiera de estos derechos enviando una solicitud escrita a derechos@movilguru.es, adjuntando copia de tu DNI, NIE, pasaporte u otro documento de identidad válido. Responderemos en el plazo máximo de un mes desde la recepción de la solicitud, prorrogable a dos meses adicionales en casos complejos. El ejercicio de derechos es gratuito.",
      },
      {
        subtitle: "Reclamación ante la AEPD",
        content:
          "Si consideras que el tratamiento de tus datos no se ajusta a la normativa vigente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), autoridad de control competente en España, a través de su sede electrónica en www.aepd.es. También puedes acudir previamente a nuestro DPD para intentar resolver la cuestión de forma amistosa.",
      },
    ],
  },
  {
    id: "seguridad",
    title: "7. Medidas de seguridad",
    subsections: [
      {
        subtitle: "Medidas técnicas implementadas",
        content:
          "Movil Guru aplica las medidas de seguridad técnicas y organizativas exigidas por el artículo 32 del RGPD: cifrado TLS 1.3 en todas las comunicaciones web, cifrado AES-256 de datos sensibles en reposo, autenticación multifactor para accesos administrativos, control de acceso basado en roles (RBAC), registros de auditoría (logs de acceso y modificación), y copias de seguridad automáticas cifradas con retención de 30 días.",
      },
      {
        subtitle: "Gestión de brechas de seguridad",
        content:
          "En caso de producirse una brecha de seguridad que suponga un riesgo para tus derechos y libertades, Movil Guru lo notificará a la AEPD en el plazo de 72 horas desde su detección. Si la brecha supone un riesgo elevado para ti, también recibirás una notificación directa con información clara sobre lo ocurrido, las consecuencias previsibles y las medidas adoptadas.",
      },
    ],
  },
  {
    id: "cookies",
    title: "8. Política de cookies",
    subsections: [
      {
        subtitle: "Tipos de cookies utilizadas",
        content:
          "Utilizamos los siguientes tipos de cookies: (a) Cookies estrictamente necesarias: imprescindibles para el funcionamiento del sitio (gestión de sesión, carrito, preferencias de accesibilidad). No requieren consentimiento. (b) Cookies analíticas: recogen información sobre el uso del sitio de forma agregada y anonimizada (Google Analytics con IP anonimizada, Hotjar). (c) Cookies de marketing: permiten mostrarte publicidad relevante en otras plataformas (Meta Pixel, Google Ads). Solo se activan con tu consentimiento expreso.",
      },
      {
        subtitle: "Gestión y revocación del consentimiento",
        content:
          "Puedes aceptar, rechazar o personalizar el uso de cookies en el panel de preferencias que aparece al acceder por primera vez al sitio web. También puedes gestionar las cookies desde la configuración de tu navegador: en Chrome (Configuración > Privacidad > Cookies), en Firefox (Opciones > Privacidad > Cookies), en Safari (Preferencias > Privacidad). La desactivación de cookies analíticas o de marketing no afecta a la funcionalidad del sitio.",
      },
      {
        subtitle: "Cookies de terceros",
        content:
          "Algunas cookies son instaladas por terceros (Google, Meta, Hotjar) cuando utilizas sus servicios integrados en nuestro sitio. Estas cookies están sujetas a las políticas de privacidad de dichos terceros. Te recomendamos consultar directamente la política de privacidad de cada proveedor para conocer cómo tratan tus datos.",
      },
    ],
  },
  {
    id: "modificaciones",
    title: "9. Cambios en esta política",
    subsections: [
      {
        subtitle: "Actualizaciones y vigencia",
        content:
          "Movil Guru puede actualizar esta Política de Privacidad para adaptarla a cambios legislativos, jurisprudenciales, prácticas del sector o decisiones corporativas. La versión vigente siempre estará disponible en esta página con la fecha de última actualización indicada en el encabezado. Si los cambios son significativos y afectan a tratamientos ya en curso, te notificaremos por correo electrónico o mediante un aviso destacado en el sitio web antes de que entren en vigor.",
      },
    ],
  },
];

export default function PrivacidadPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#080e14] text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-[#CCFF00]/5 rounded-full blur-[130px]" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              Legal · RGPD
            </span>
            <h1
              className="text-4xl md:text-6xl font-black leading-tight mb-5"
              style={{ fontFamily: "var(--font-display, inherit)", letterSpacing: "-0.03em" }}
            >
              Política de Privacidad
            </h1>
            <p className="text-white/50 text-sm mb-2">
              Última actualización:{" "}
              {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-white/40 text-sm max-w-2xl" style={{ lineHeight: "1.8" }}>
              En Movil Guru respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política
              explica quiénes somos, qué datos recogemos, con qué finalidad, cuánto tiempo los conservamos y cuáles son
              tus derechos conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Index */}
      <section className="px-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
          >
            <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Índice de contenidos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm text-white/50 hover:text-[#CCFF00] transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-[#CCFF00]/40 text-xs">{String(i + 1).padStart(2, "0")}</span>
                  {s.title.replace(/^\d+\. /, "")}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-32">
        <div className="max-w-4xl mx-auto space-y-3">
          {sections.map((section, i) => (
            <motion.div
              id={section.id}
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.6 }}
              className="border border-white/8 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] transition-colors duration-200 text-left"
              >
                <h2 className="text-base font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  {section.title}
                </h2>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 shrink-0 ml-4 transition-transform duration-300 ${
                    activeSection === section.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              <motion.div
                initial={false}
                animate={{ height: activeSection === section.id ? "auto" : 0, opacity: activeSection === section.id ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-6 pb-6 space-y-6 border-t border-white/6 pt-5">
                  {section.subsections.map((sub) => (
                    <div key={sub.subtitle} className="pl-4 border-l border-[#CCFF00]/25">
                      <p className="text-xs font-semibold text-[#CCFF00]/80 uppercase tracking-widest mb-2">
                        {sub.subtitle}
                      </p>
                      <p className="text-white/55 text-sm" style={{ lineHeight: "1.85" }}>
                        {sub.content}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact DPD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto mt-10 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">¿Tienes dudas sobre tu privacidad?</p>
            <p className="text-white/50 text-sm">
              Contacta con nuestro Delegado de Protección de Datos directamente. Responderemos en un plazo máximo de 30
              días hábiles.
            </p>
          </div>
          <a
            href="mailto:dpd@movilguru.es"
            className="shrink-0 bg-[#CCFF00] text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#d9ff33] active:scale-[0.98] transition-all duration-200"
          >
            dpd@movilguru.es
          </a>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
