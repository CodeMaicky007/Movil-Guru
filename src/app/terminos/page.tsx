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
    id: "objeto",
    title: "1. Objeto y ámbito de aplicación",
    subsections: [
      {
        subtitle: "Alcance del contrato",
        content:
          "Las presentes Condiciones Generales de Contratación (en adelante, «Condiciones») regulan la relación contractual entre Movil Guru S.L. (en adelante, «Movil Guru» o «el prestador») y cualquier persona física o jurídica (en adelante, «el cliente» o «el usuario») que contrate servicios de reparación de dispositivos móviles, adquiera productos a través de la tienda online o acceda al sitio web movilguru.es.",
      },
      {
        subtitle: "Aceptación",
        content:
          "El acceso, la navegación o la utilización del sitio web, así como la contratación de cualquier servicio o producto, implica la aceptación íntegra, plena y sin reservas de estas Condiciones en la versión publicada en el momento de la contratación. Si no estás de acuerdo con alguna de las cláusulas aquí recogidas, debes abstenerte de utilizar el servicio.",
      },
      {
        subtitle: "Idioma",
        content:
          "El idioma aplicable al contrato es el español. En caso de que se publiquen versiones en otros idiomas por razones informativas, la versión en español prevalecerá en caso de discrepancia interpretativa.",
      },
    ],
  },
  {
    id: "usuario",
    title: "2. Registro y cuenta de usuario",
    subsections: [
      {
        subtitle: "Creación de cuenta",
        content:
          "Para contratar determinados servicios o acceder al historial de reparaciones, es necesario crear una cuenta de usuario. El usuario debe facilitar información veraz, completa y actualizada. Movil Guru se reserva el derecho de rechazar o cancelar registros que incumplan estas condiciones o que resulten falsos, duplicados o realizados con fines fraudulentos.",
      },
      {
        subtitle: "Seguridad de la cuenta",
        content:
          "El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso (correo y contraseña) y de todas las actividades que se realicen bajo su cuenta. Ante cualquier acceso no autorizado o brecha de seguridad, debes notificarlo inmediatamente a soporte@movilguru.es. Movil Guru no será responsable de los daños derivados del incumplimiento de esta obligación.",
      },
      {
        subtitle: "Cancelación de cuenta",
        content:
          "El usuario puede solicitar la cancelación de su cuenta en cualquier momento enviando un email a soporte@movilguru.es. La cancelación no afecta a las reparaciones en curso ni a las obligaciones contractuales ya adquiridas. Movil Guru conservará los datos contables conforme a la legislación fiscal aplicable.",
      },
    ],
  },
  {
    id: "proceso-reparacion",
    title: "3. Proceso de reparación",
    subsections: [
      {
        subtitle: "Diagnóstico y presupuesto",
        content:
          "Antes de iniciar cualquier intervención técnica sobre el dispositivo, Movil Guru realizará un diagnóstico del problema y emitirá un presupuesto vinculante detallado que incluirá: descripción de la avería, piezas necesarias (con indicación de su categoría: original OEM, premium compatible o estándar), coste de mano de obra, IVA aplicable, plazo estimado de reparación y tipo de garantía asociada.",
      },
      {
        subtitle: "Aceptación del presupuesto",
        content:
          "El presupuesto deberá ser aceptado expresamente por el cliente antes de iniciar la reparación. La aceptación podrá realizarse de forma presencial mediante firma, telefónicamente (con grabación de la llamada) o por escrito a través de correo electrónico o SMS. Ningún trabajo será iniciado sin conformidad previa del cliente.",
      },
      {
        subtitle: "Modificaciones durante la reparación",
        content:
          "En caso de que durante la reparación se detecten averías adicionales no contempladas en el presupuesto inicial, el técnico suspenderá el trabajo y contactará al cliente para emitir un presupuesto complementario. El cliente podrá aceptar la ampliación o solicitar la devolución del dispositivo en el estado en que se encuentre, con cargo al coste del diagnóstico si este ya se ha realizado.",
      },
      {
        subtitle: "Recogida a domicilio",
        content:
          "Para el servicio de recogida y entrega a domicilio, el cliente deberá respetar la franja horaria acordada. En caso de ausencia en el momento de la recogida, se realizará un segundo intento sin coste adicional. A partir del tercer intento fallido, se podrá aplicar un suplemento de desplazamiento de 5 €. El cliente es responsable de embalar adecuadamente el dispositivo para el envío.",
      },
    ],
  },
  {
    id: "plazos",
    title: "4. Plazos de entrega y demoras",
    subsections: [
      {
        subtitle: "Plazos orientativos",
        content:
          "Los plazos de reparación indicados en el presupuesto son orientativos. Reparaciones estándar (pantalla, batería, conector de carga): 1–2 horas en tienda o 24–48 h en servicio de recogida. Reparaciones de placa base o microsoldadura: 3–7 días laborables. Recuperación de datos: 3–10 días laborables dependiendo del estado del dispositivo.",
      },
      {
        subtitle: "Causas de retraso justificadas",
        content:
          "No se considerará incumplimiento de plazo cuando la demora sea atribuible a: disponibilidad de piezas de repuesto por parte del fabricante o distribuidor, situaciones de fuerza mayor (huelgas, catástrofes naturales, interrupciones de suministro), retrasos de las empresas de mensajería por causas ajenas a Movil Guru, o necesidad de consultar con el cliente por averías adicionales detectadas.",
      },
      {
        subtitle: "Comunicación de retrasos",
        content:
          "En caso de que la reparación supere en más de un 50 % el plazo estimado por causas no imputables al cliente, Movil Guru se compromete a comunicarlo de forma proactiva y a ofrecer una nueva fecha de entrega. Si el retraso total supera los 10 días laborables sobre el plazo acordado por causas imputables a Movil Guru, el cliente tendrá derecho a solicitar la devolución del dispositivo sin coste.",
      },
    ],
  },
  {
    id: "precios",
    title: "5. Precios, facturación y forma de pago",
    subsections: [
      {
        subtitle: "Precios y IVA",
        content:
          "Todos los precios publicados en el sitio web y en los presupuestos incluyen el Impuesto sobre el Valor Añadido (IVA) al tipo vigente en España (21 % en el momento de redacción de estas condiciones). Movil Guru se reserva el derecho de modificar sus tarifas sin previo aviso general, si bien los presupuestos ya aceptados tienen precio fijo.",
      },
      {
        subtitle: "Formas de pago aceptadas",
        content:
          "Aceptamos los siguientes medios de pago: tarjeta de crédito/débito Visa, Mastercard y American Express (a través de pasarela segura PCI-DSS), Bizum, transferencia bancaria (para importes superiores a 200 €), y efectivo en tienda física (con un máximo de 1.000 € conforme a la Ley 11/2021 de medidas de prevención y lucha contra el fraude fiscal). No aceptamos cheques.",
      },
      {
        subtitle: "Facturación",
        content:
          "Una vez completada la reparación, Movil Guru emitirá una factura electrónica que será enviada al correo electrónico del cliente. Si necesitas factura con datos de empresa o NIF específico, deberás indicarlo antes de aceptar el presupuesto. No es posible cambiar los datos de facturación una vez emitida la misma.",
      },
      {
        subtitle: "Impago",
        content:
          "En caso de impago, Movil Guru podrá retener el dispositivo reparado hasta la cancelación de la deuda. Si transcurridos 30 días desde la notificación de finalización de la reparación el cliente no ha abonado el importe y recogido el dispositivo, se devengará un cargo de custodia de 2 € por día. Tras 60 días adicionales, el dispositivo podrá ser considerado abandonado conforme a la normativa aplicable.",
      },
    ],
  },
  {
    id: "garantias",
    title: "6. Garantías de reparación",
    subsections: [
      {
        subtitle: "Piezas originales OEM — Garantía de por vida",
        content:
          "Las piezas con certificación OEM (Original Equipment Manufacturer) de fabricantes como Apple, Samsung o Google están cubiertas de por vida contra defectos de fabricación propios de la pieza. Si la pieza falla por un defecto intrínseco, será reemplazada sin coste adicional. Esta garantía no cubre daños por mal uso, golpes, humedad, oxidación o intervención posterior por terceros.",
      },
      {
        subtitle: "Piezas premium compatible — Garantía 12 meses",
        content:
          "Las piezas de calidad premium compatible (alto rendimiento, no originales de fábrica) están cubiertas durante 12 meses desde la fecha de entrega del dispositivo reparado. En caso de fallo demostrado de la pieza dentro del plazo, será sustituida sin coste. El cliente deberá entregar el dispositivo en nuestras instalaciones o mediante el servicio de recogida.",
      },
      {
        subtitle: "Mano de obra — Garantía 90 días",
        content:
          "Todo el trabajo técnico realizado está garantizado durante 90 días naturales. Si el mismo problema reaparece y se demuestra que es consecuencia de un error en la intervención, será subsanado sin coste. La garantía de mano de obra no cubre averías nuevas o sobrevenidas no relacionadas con la reparación original.",
      },
      {
        subtitle: "Exclusiones de garantía",
        content:
          "Quedan excluidos de la cobertura de garantía los siguientes supuestos: daños físicos por impacto o caída posteriores a la entrega, entrada de líquidos tras la reparación, apertura o manipulación del dispositivo por personas ajenas a Movil Guru, instalación de software no oficial o modificaciones del sistema operativo (root, jailbreak), y deterioro por condiciones ambientales extremas (temperaturas fuera del rango especificado por el fabricante).",
      },
    ],
  },
  {
    id: "responsabilidad",
    title: "7. Responsabilidad y limitaciones",
    subsections: [
      {
        subtitle: "Pérdida de datos",
        content:
          "Movil Guru no se hace responsable de la pérdida, deterioro o acceso no autorizado a los datos personales, fotografías, contactos, mensajes u otra información almacenada en el dispositivo. Es responsabilidad exclusiva del cliente realizar una copia de seguridad completa antes de entregar el dispositivo para su reparación. Esta obligación se reitera expresamente en el resguardo de entrega que deberá firmar el cliente.",
      },
      {
        subtitle: "Limitación de responsabilidad",
        content:
          "La responsabilidad máxima de Movil Guru frente al cliente, cualquiera que sea la causa (negligencia, incumplimiento contractual, daño extracontractual), no podrá exceder del valor de la reparación facturada. Movil Guru no será responsable de daños indirectos, pérdidas de beneficios, pérdidas de oportunidad de negocio ni daños consecuentes, salvo en casos de dolo o negligencia grave.",
      },
      {
        subtitle: "Daños preexistentes",
        content:
          "En el momento de la entrega del dispositivo, el técnico consignará en el resguardo de entrega el estado físico externo del mismo. Movil Guru no responderá de daños estéticos o funcionales preexistentes a la entrega que no hayan sido documentados en dicho resguardo. El cliente puede solicitar fotografías del estado de recepción.",
      },
    ],
  },
  {
    id: "desistimiento",
    title: "8. Desistimiento, cancelación y devoluciones",
    subsections: [
      {
        subtitle: "Derecho de desistimiento en compras online",
        content:
          "Para la compra de productos físicos a través de la tienda online, el cliente consumidor dispone de un plazo de 14 días naturales desde la recepción del producto para ejercer su derecho de desistimiento sin necesidad de alegar causa, conforme al Real Decreto Legislativo 1/2007 (TRLGDCU). El producto deberá ser devuelto en perfectas condiciones y en su embalaje original. Los gastos de devolución corren a cargo del cliente, salvo que el producto sea defectuoso.",
      },
      {
        subtitle: "Cancelación de servicio de reparación",
        content:
          "El cliente podrá cancelar la orden de reparación sin coste alguno antes de que comience la intervención técnica. Una vez iniciada la reparación, si el cliente decide no continuarla, deberá abonar el coste del diagnóstico (máximo 15 €) y el coste de los materiales ya utilizados. Si la reparación ya ha sido completada, el cliente deberá abonar el importe íntegro del presupuesto aceptado.",
      },
      {
        subtitle: "Productos defectuosos",
        content:
          "Si el producto recibido presenta un defecto de fabricación, el cliente dispone de 2 años de garantía legal desde la entrega conforme al TRLGDCU. Dentro de los primeros 6 meses desde la entrega, se presume que el defecto es de origen y Movil Guru deberá demostrar lo contrario. A partir del séptimo mes, corresponde al cliente demostrar que el defecto existía en el momento de la entrega.",
      },
    ],
  },
  {
    id: "propiedad-intelectual",
    title: "9. Propiedad intelectual e industrial",
    subsections: [
      {
        subtitle: "Contenidos del sitio web",
        content:
          "Todos los contenidos del sitio web movilguru.es (textos, imágenes, logotipos, diseños, código fuente, vídeos, marcas) son propiedad de Movil Guru S.L. o de sus licenciantes y están protegidos por la normativa española e internacional sobre propiedad intelectual e industrial. Queda expresamente prohibida su reproducción, distribución, transformación o comunicación pública sin autorización escrita previa.",
      },
      {
        subtitle: "Uso permitido",
        content:
          "Se autoriza al usuario a visualizar y descargar los contenidos del sitio web exclusivamente para uso personal, privado y no comercial, siempre que se mantengan intactos todos los avisos de propiedad intelectual e industrial. Cualquier otro uso requerirá autorización previa por escrito de Movil Guru.",
      },
    ],
  },
  {
    id: "conducta",
    title: "10. Conducta del usuario y usos prohibidos",
    subsections: [
      {
        subtitle: "Obligaciones generales",
        content:
          "El usuario se compromete a utilizar el sitio web y los servicios de conformidad con la ley, la moral, el orden público y las presentes Condiciones, y a abstenerse de utilizarlos con fines o efectos ilícitos, lesivos de derechos de terceros, o que puedan dañar, inutilizar o deteriorar los sistemas de Movil Guru.",
      },
      {
        subtitle: "Usos prohibidos",
        content:
          "Está expresamente prohibido: intentar acceder a áreas restringidas del sistema sin autorización, realizar scraping masivo o automatizado del sitio, enviar comunicaciones masivas no solicitadas (spam) a través de los formularios, suplantar la identidad de otro usuario, proporcionar datos falsos en el proceso de contratación, y utilizar el servicio para actividades que infrinjan la normativa española o de la UE.",
      },
    ],
  },
  {
    id: "ley-jurisdiccion",
    title: "11. Ley aplicable, jurisdicción y resolución de conflictos",
    subsections: [
      {
        subtitle: "Ley aplicable",
        content:
          "Las presentes Condiciones se rigen e interpretan de conformidad con la legislación española, en particular el Real Decreto Legislativo 1/2007 (TRLGDCU), la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI), el Código Civil y el Código de Comercio.",
      },
      {
        subtitle: "Resolución alternativa de litigios (RAL/ODR)",
        content:
          "Antes de acudir a la vía judicial, te invitamos a intentar resolver cualquier discrepancia a través de nuestro servicio de atención al cliente en soporte@movilguru.es. También puedes acceder a la plataforma europea de Resolución de Litigios en Línea (ODR) de la Comisión Europea en ec.europa.eu/consumers/odr para resolver disputas relacionadas con contratos online.",
      },
      {
        subtitle: "Jurisdicción",
        content:
          "Para cualquier controversia derivada de la aplicación, interpretación o ejecución de estas Condiciones, las partes se someten a los juzgados y tribunales del domicilio del consumidor. Si el cliente actúa en calidad de empresario, ambas partes se someten a los juzgados y tribunales de la ciudad de Madrid, renunciando expresamente a cualquier otro fuero.",
      },
    ],
  },
  {
    id: "modificaciones-tc",
    title: "12. Modificación de las condiciones",
    subsections: [
      {
        subtitle: "Actualización y notificación",
        content:
          "Movil Guru se reserva el derecho de modificar, ampliar o actualizar estas Condiciones en cualquier momento. La versión vigente siempre estará disponible en esta página con la fecha de última actualización indicada. Si los cambios afectan a contratos en ejecución o implican un empeoramiento significativo para el usuario, se notificarán con al menos 15 días de antelación mediante correo electrónico o aviso destacado en el sitio web. El uso continuado del servicio tras la entrada en vigor de las modificaciones implica su aceptación.",
      },
    ],
  },
];

export default function TerminosPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#080e14] text-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-[#0038FF]/6 rounded-full blur-[130px]" />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-[#0038FF]/10 border border-[#0038FF]/30 text-[#4d7fff] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              Legal · Contrato
            </span>
            <h1
              className="text-4xl md:text-6xl font-black leading-tight mb-5"
              style={{ fontFamily: "var(--font-display, inherit)", letterSpacing: "-0.03em" }}
            >
              Términos y Condiciones
            </h1>
            <p className="text-white/50 text-sm mb-2">
              Última actualización:{" "}
              {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-white/40 text-sm max-w-2xl" style={{ lineHeight: "1.8" }}>
              Por favor, lee detenidamente estas condiciones antes de contratar cualquier servicio o realizar una
              compra en movilguru.es. Regulan todos los aspectos de la relación contractual entre tú y Movil Guru,
              incluyendo el proceso de reparación, plazos, precios, garantías, responsabilidades y derechos de ambas
              partes.
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
                  className="text-sm text-white/50 hover:text-[#4d7fff] transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-[#0038FF]/50 text-xs">{String(i + 1).padStart(2, "0")}</span>
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
              transition={{ delay: i * 0.03, duration: 0.6 }}
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
                animate={{
                  height: activeSection === section.id ? "auto" : 0,
                  opacity: activeSection === section.id ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-6 pb-6 space-y-6 border-t border-white/6 pt-5">
                  {section.subsections.map((sub) => (
                    <div key={sub.subtitle} className="pl-4 border-l border-[#0038FF]/35">
                      <p className="text-xs font-semibold text-[#4d7fff]/90 uppercase tracking-widest mb-2">
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto mt-10 bg-[#0038FF]/5 border border-[#0038FF]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">¿Necesitas aclarar algún punto?</p>
            <p className="text-white/50 text-sm">
              Nuestro equipo jurídico y de atención al cliente está disponible para resolver cualquier duda sobre estas
              condiciones antes de contratar.
            </p>
          </div>
          <a
            href="/contacto"
            className="shrink-0 bg-[#0038FF] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#1a4fff] active:scale-[0.98] transition-all duration-200"
          >
            Contactar
          </a>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
