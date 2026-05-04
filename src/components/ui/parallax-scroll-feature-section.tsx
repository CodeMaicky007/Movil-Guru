"use client";

/**
 * ParallaxFeatureSection — bloque storytelling con filas alternadas (texto ↔ imagen).
 * Cada fila revela su imagen mediante un clip-path animado por scroll, y el texto
 * desliza con parallax suave. Adaptado al sistema visual de Movil Guru:
 * fondo navy continuo, marco blanco lateral, sin rounded superior para fundirse
 * con el slab "MOVIL GURU" del hero.
 *
 * El componente original (2.txt) llamaba useRef/useScroll dentro de un .map(),
 * lo que es frágil ante cambios de longitud. Aquí cada fila es su propio
 * componente, así los hooks viven en el nivel correcto.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export type FeatureItem = {
  id: number | string;
  eyebrow?: string;
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
};

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    id: 1,
    eyebrow: "2026 · Valladolid",
    title: "Un taller. Una promesa.",
    description:
      "Abrimos en el centro de Valladolid con tres herramientas y una convicción: un móvil roto no debería significar empezar de cero. Cada reparación se hace a la vista del cliente, sin sustos ni asteriscos.",
    imageUrl:
      "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&w=1000",
    reverse: false,
  },
  {
    id: 2,
    eyebrow: "2026 · León",
    title: "Cruzamos provincia.",
    description:
      "El boca a boca nos lleva a León. Misma garantía de por vida, mismo trato honesto, las mismas piezas originales certificadas. Una segunda casa para nuestros gurus reparadores.",
    imageUrl:
      "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&w=1000",
    reverse: true,
  },
  {
    id: 3,
    eyebrow: "Hoy · Castilla y León",
    title: "Cuatro tiendas, una filosofía.",
    description:
      "1 en León, 2 en Valladolid, 1 en Burgos. Una red completa al servicio de Castilla y León — sin perder lo que nos hace pequeños: el cuidado, la cercanía y la palabra dada.",
    imageUrl:
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&w=1000",
    reverse: false,
  },
];

/* ─────────────────────────────────────────────────────────────────────
 * Fila individual: gestiona su propio scroll-progress y animaciones.
 * ──────────────────────────────────────────────────────────────────── */
function FeatureRow({ item }: { item: FeatureItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  // Imagen: aparece y se descubre de izquierda a derecha
  const imageOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const imageClip = useTransform(
    scrollYProgress,
    [0, 0.7],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );

  // Texto: parallax sutil
  const textY = useTransform(scrollYProgress, [0, 1], [-40, 0]);

  return (
    <div
      ref={ref}
      className={`flex min-h-screen flex-col items-center justify-center gap-12 py-24 md:flex-row md:gap-32 md:py-0 ${
        item.reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Texto */}
      <motion.div style={{ y: textY }} className="max-w-md flex-1">
        {item.eyebrow && (
          <span
            className="text-[10px] font-black uppercase tracking-[0.4em]"
            style={{ color: "#CCFF00" }}
          >
            {item.eyebrow}
          </span>
        )}
        <h3
          className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          {item.title}
        </h3>
        <p className="mt-6 text-base leading-relaxed text-white/65 sm:text-lg">
          {item.description}
        </p>
      </motion.div>

      {/* Imagen con clip-path animado */}
      <motion.div
        style={{ opacity: imageOpacity, clipPath: imageClip }}
        className="relative shrink-0 overflow-hidden rounded-2xl"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="size-72 object-cover sm:size-80 lg:size-[420px]"
        />
        {/* Tinte azul sutil para integrar con el sistema visual */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ background: "rgba(0,56,255,0.15)" }}
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Componente principal
 * ──────────────────────────────────────────────────────────────────── */
export function ParallaxFeatureSection({
  items = DEFAULT_FEATURES,
  eyebrow = "02 · Historia",
  className = "",
}: {
  items?: FeatureItem[];
  eyebrow?: string;
  className?: string;
}) {
  return (
    <section className={`relative w-full bg-white px-4 ${className}`}>
      <div
        className="relative w-full rounded-b-[2.5rem] px-6 py-20 sm:px-12 sm:py-28"
        style={{ background: "#0A1F3A", color: "#FFFFFF" }}
      >
        <div className="mx-auto max-w-6xl">
          <span className="block text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
            {eyebrow}
          </span>

          <div className="mt-12 flex flex-col">
            {items.map((item) => (
              <FeatureRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
