"use client";
import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Args = {
  containerRef: RefObject<HTMLElement | null>;
  setProgress: (p: number) => void;
  reducedMotion: boolean;
};

export function useScrollHijack({ containerRef, setProgress, reducedMotion }: Args) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1280px)",
        tablet: "(min-width: 768px) and (max-width: 1279px)",
      },
      (ctx) => {
        const isDesktop = ctx.conditions?.desktop;
        const pinHeight = isDesktop ? "+=300%" : "+=180%";

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: pinHeight,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => setProgress(self.progress),
        });

        return () => st.kill();
      }
    );

    return () => mm.revert();
  }, [containerRef, setProgress, reducedMotion]);
}

export function useReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
