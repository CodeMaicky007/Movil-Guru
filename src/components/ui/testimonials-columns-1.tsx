"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-7 rounded-2xl border border-border shadow-[0_4px_24px_rgba(0,56,255,0.06)] max-w-xs w-full bg-white"
                key={i}
              >
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const testimonials = [
  {
    text: "Rompí la pantalla de mi iPhone 15 Pro Max un lunes por la mañana. En Movil Guru la tenía arreglada antes del almuerzo. El técnico me mostró la pieza original antes de cambiarla — ese nivel de transparencia es difícil de encontrar.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah M.",
    role: "iPhone 15 Pro Max",
  },
  {
    text: "Samsung me presupuestó $340 y cinco días de espera. Movil Guru lo hizo el mismo día por $235 con garantía de por vida. Sin comparación.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Marcus T.",
    role: "Samsung Galaxy S24 Ultra",
  },
  {
    text: "Gestionamos 40 dispositivos corporativos. Movil Guru lo maneja todo con un contrato SLA — respuesta media en menos de 4 horas. Ha cambiado por completo cómo gestionamos el tiempo de inactividad.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Priya K.",
    role: "Directora de Operaciones",
  },
  {
    text: "Se me cayó el Pixel 9 al fregadero. Hicieron el diagnóstico en 20 minutos, limpiaron la placa y salvaron todo. Tres meses después sigue funcionando perfectamente.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Jordan L.",
    role: "Google Pixel 9 Pro",
  },
  {
    text: "La pantalla interior de mi Z Fold empezó a despegarse. Ninguna otra tienda quiso ni mirarlo. Movil Guru tenía un especialista en plegables y lo resolvió en 48 horas.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Alex W.",
    role: "Samsung Galaxy Z Fold 6",
  },
  {
    text: "Ni una sola vez me pidieron el código de desbloqueo. Tienen un protocolo de privacidad de datos publicado en el mostrador. Solo eso ya me hizo confiarles mi dispositivo.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Diana R.",
    role: "iPhone 14 Pro",
  },
  {
    text: "La batería se agotaba a los 18 meses. La cambiaron en 20 minutos, $65 en total, con garantía de por vida. Creía que necesitaba un móvil nuevo. No era así.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Naomi S.",
    role: "Samsung Galaxy A54",
  },
  {
    text: "Se rompió el cristal trasero de mi 13 Pro. Coincidieron exactamente con el color original — la reparación es invisible. De verdad no se nota que estuvo roto.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Thomas B.",
    role: "iPhone 13 Pro",
  },
  {
    text: "Nuestro equipo de IT trasladó todas las reparaciones a Movil Guru — iPhones, Androids, hasta plegables. Facturación limpia, entregas rápidas, un solo punto de contacto.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Carlos V.",
    role: "Director de TI",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-background py-20 md:py-28 relative">
      <div className="max-w-6xl z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 py-1 px-4 rounded-full text-sm font-semibold tracking-wide">
              Testimonios
            </div>
          </div>
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mt-5 text-center"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            La confianza de <span style={{ color: "#0038FF" }}>miles</span> de <span style={{ color: "#0038FF" }}>clientes</span>
          </h2>
          <p className="text-center mt-4 opacity-60 text-sm md:text-base leading-relaxed">
            Reparaciones reales. Resultados reales. Descubre lo que dicen nuestros clientes.
          </p>
        </motion.div>
        <motion.div
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
          }}
        >
          {[
            { testimonials: firstColumn, duration: 15, className: "" },
            { testimonials: secondColumn, duration: 19, className: "hidden md:block" },
            { testimonials: thirdColumn, duration: 17, className: "hidden lg:block" },
          ].map((col, i) => (
            <motion.div
              key={i}
              className={col.className}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <TestimonialsColumn testimonials={col.testimonials} duration={col.duration} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
