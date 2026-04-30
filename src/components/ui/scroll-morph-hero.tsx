"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  useScroll,
} from "motion/react";

type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  alt: string;
  index: number;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 84;
const IMG_HEIGHT = 84;

function FlipCard({ src, alt, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            background: "#ffffff",
            border: "2.5px solid var(--mg-ink, #080e14)",
            boxShadow: "4px 4px 0 var(--mg-ink, #080e14)",
          }}
        >
          <img
            src={src}
            alt={alt}
            className="h-[60%] w-[60%] object-contain"
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl flex flex-col items-center justify-center p-2"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--mg-blue, #0038ff)",
            border: "2.5px solid var(--mg-ink, #080e14)",
            boxShadow: "4px 4px 0 var(--mg-ink, #080e14)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), Syne, sans-serif",
              fontSize: 9,
              fontWeight: 800,
              color: "var(--mg-lime, #ccff00)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Reparamos
          </p>
          <p
            style={{
              fontFamily: "var(--font-display), Syne, sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {alt}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const BRAND_LOGOS = [
  { src: "/images/Apple.png", alt: "Apple" },
  { src: "/images/Samsung.png", alt: "Samsung" },
  { src: "/images/GooglePixel.png", alt: "Pixel" },
  { src: "/images/Xiaomi.png", alt: "Xiaomi" },
  { src: "/images/huawei.png", alt: "Huawei" },
  { src: "/images/motorola.png", alt: "Motorola" },
  { src: "/images/oneplus.png", alt: "OnePlus" },
];

const TOTAL_IMAGES = 14;
const IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => BRAND_LOGOS[i % BRAND_LOGOS.length]);

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function ScrollMorphHero() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stickyRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(stickyRef.current);
    setContainerSize({
      width: stickyRef.current.offsetWidth,
      height: stickyRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const MAX_VIRTUAL = 3000;
  const virtualScroll = useTransform(scrollYProgress, [0, 1], [0, MAX_VIRTUAL]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 60);
    };
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"), 500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const scatterPositions = useMemo(() => {
    return IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => {
      u1();
      u2();
      u3();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div ref={outerRef} className="relative w-full" style={{ height: "200vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "100vh",
          background: "#ffffff",
          borderRadius: "0 0 clamp(36px, 6vw, 96px) clamp(36px, 6vw, 96px)",
          paddingBottom: "28vh",
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-[38%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full px-6">
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={
                introPhase === "circle" && morphValue < 0.5
                  ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, filter: "blur(10px)" }
              }
              transition={{ duration: 1 }}
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "var(--mg-ink, #080e14)",
                fontSize: "clamp(32px, 5vw, 64px)",
              }}
            >
              Cada marca.
              <br />
              <span style={{ color: "var(--mg-blue, #0038ff)" }}>
                Reparada hoy.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={
                introPhase === "circle" && morphValue < 0.5
                  ? { opacity: 0.7 - morphValue }
                  : { opacity: 0 }
              }
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                marginTop: 18,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.3em",
                color: "var(--mg-blue, #0038ff)",
                textTransform: "uppercase",
              }}
            >
              Scroll para ver
            </motion.p>
          </div>

          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute top-[8%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
          >
            <h2
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "var(--mg-ink, #080e14)",
                fontSize: "clamp(28px, 4.5vw, 56px)",
                marginBottom: 14,
              }}
            >
              Reparamos <span style={{ color: "var(--mg-blue, #0038ff)" }}>todas</span> las marcas.
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(8,14,20,0.7)",
                maxWidth: 520,
                lineHeight: 1.55,
                fontWeight: 500,
              }}
            >
              iPhone, Samsung, Pixel, Xiaomi, Huawei, Motorola y OnePlus.
              <br className="hidden md:block" />
              Piezas originales, presupuesto cerrado y garantía de por vida.
            </p>
          </motion.div>

          <div className="relative flex items-center justify-center w-full h-full">
            {IMAGES.map((logo, i) => {
              let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

              if (introPhase === "scatter") {
                target = scatterPositions[i];
              } else if (introPhase === "line") {
                const lineSpacing = 92;
                const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                const lineX = i * lineSpacing - lineTotalWidth / 2;
                target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
              } else {
                const isMobile = containerSize.width < 768;
                const minDimension = Math.min(containerSize.width, containerSize.height);
                const circleRadius = Math.min(minDimension * 0.32, 320);

                const circleAngle = (i / TOTAL_IMAGES) * 360;
                const circleRad = (circleAngle * Math.PI) / 180;
                const circlePos = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: 0,
                };

                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
                const arcApexY = containerSize.height * (isMobile ? 0.32 : 0.22);
                const arcCenterY = arcApexY + arcRadius;

                const spreadAngle = isMobile ? 100 : 130;
                const startAngle = -90 - spreadAngle / 2;
                const step = spreadAngle / (TOTAL_IMAGES - 1);

                const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                const maxRotation = spreadAngle * 0.8;
                const boundedRotation = -scrollProgress * maxRotation;

                const currentArcAngle = startAngle + i * step + boundedRotation;
                const arcRad = (currentArcAngle * Math.PI) / 180;

                const arcPos = {
                  x: Math.cos(arcRad) * arcRadius + parallaxValue,
                  y: Math.sin(arcRad) * arcRadius + arcCenterY,
                  rotation: 0,
                  scale: isMobile ? 1.4 : 1.7,
                };

                target = {
                  x: lerp(circlePos.x, arcPos.x, morphValue),
                  y: lerp(circlePos.y, arcPos.y, morphValue),
                  rotation: 0,
                  scale: lerp(1, arcPos.scale, morphValue),
                  opacity: 1,
                };
              }

              return (
                <FlipCard
                  key={i}
                  src={logo.src}
                  alt={logo.alt}
                  index={i}
                  target={target}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
