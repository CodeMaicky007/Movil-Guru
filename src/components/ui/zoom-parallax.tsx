"use client";

/**
 * ZoomParallax — galería con efecto de zoom encadenado al scroll.
 * El contenedor tiene 300vh y queda pinneado mediante `sticky`.
 * Cada item (imagen o vídeo) escala con un factor distinto (4×, 5×, 6×, 8×, 9×)
 * según el progreso del scroll. Las posiciones de los 7 slots están calibradas
 * con %vh/vw para una composición orgánica.
 *
 * Si un item es de tipo "video", su `currentTime` se mapea al scrollYProgress
 * → el vídeo avanza/retrocede a medida que el usuario hace scroll, sin reproducirse
 * automáticamente. Esto crea el efecto cinematográfico tipo Apple.
 */

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

interface BaseItem {
  alt?: string;
}

interface ImageItem extends BaseItem {
  type?: "image";
  src: string;
}

interface VideoItem extends BaseItem {
  type: "video";
  src: string;
  /** Posters opcional para frame inicial */
  poster?: string;
}

export type ZoomParallaxItem = ImageItem | VideoItem;

interface ZoomParallaxProps {
  /** Array de items (máximo 7) — imágenes y/o vídeos */
  items: ZoomParallaxItem[];
}

/* ─────────────────────────────────────────────────────────────────────
 * Vídeo gateado por scroll: se queda pausado en el frame inicial mientras
 * el usuario sigue scrolleando dentro del bloque zoom-parallax. En cuanto
 * el progreso llega al final (≥ 0.98) el vídeo arranca y se reproduce en
 * loop. Si el usuario vuelve a subir, el vídeo se pausa y se reinicia.
 * ──────────────────────────────────────────────────────────────────── */
function ScrollVideo({
  src,
  poster,
  alt,
  progress,
}: {
  src: string;
  poster?: string;
  alt?: string;
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const PLAY_THRESHOLD = 0.98; // Solo reproducir tras completar el scroll

    const unsubscribe = progress.on("change", (value) => {
      if (value >= PLAY_THRESHOLD) {
        // Si está pausado, lanzar reproducción (puede fallar si el navegador
        // bloquea autoplay; al estar muted suele permitirse).
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });

    return () => unsubscribe();
  }, [progress]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={alt}
      muted
      loop
      playsInline
      preload="auto"
      className="h-full w-full object-cover"
    />
  );
}

export function ZoomParallax({ items }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Cinco curvas de escalado distintas para variar el ritmo visual
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        {items.map((item, index) => {
          const scale = scales[index % scales.length];
          const isVideo = item.type === "video";

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${
                index === 1
                  ? "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]"
                  : ""
              } ${
                index === 2
                  ? "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]"
                  : ""
              } ${
                index === 3
                  ? "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]"
                  : ""
              } ${
                index === 4
                  ? "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]"
                  : ""
              } ${
                index === 5
                  ? "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]"
                  : ""
              } ${
                index === 6
                  ? "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]"
                  : ""
              } `}
            >
              <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-xl">
                {isVideo ? (
                  <ScrollVideo
                    src={item.src}
                    poster={item.poster}
                    alt={item.alt}
                    progress={scrollYProgress}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt || `Parallax image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
