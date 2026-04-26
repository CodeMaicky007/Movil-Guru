"use client";
import { useRef, useState, useEffect } from "react";
import { mission } from "@/app/about-preview/content";
import { useScrollHijack, useReducedMotion } from "./MissionPath.hooks";
import Phone3D from "./Phone3D";

const Reveal = ({
  visible,
  delay = 0,
  children,
}: {
  visible: boolean;
  delay?: number;
  children: React.ReactNode;
}) => (
  <div
    style={{
      clipPath: visible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
      transition: `clip-path 900ms cubic-bezier(0.77,0,0.18,1) ${delay}ms`,
      willChange: "clip-path",
    }}
  >
    {children}
  </div>
);

export function MissionPath() {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReduced(useReducedMotion());
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  useScrollHijack({ containerRef, setProgress, reducedMotion: reduced || isMobile });

  // phase flags
  const inA = progress < 0.33;
  const inB = progress >= 0.33 && progress < 0.66;
  const inC = progress >= 0.66;

  // On mobile/reduced, show all three blocks stacked
  if (isMobile || reduced) {
    return (
      <section
        ref={containerRef}
        role="region"
        aria-labelledby="mission-title"
        className="relative bg-white px-6 py-24 md:px-10"
      >
        <h2 id="mission-title" className="sr-only">
          Nuestra misión
        </h2>
        {[mission.phaseA, mission.phaseB, mission.phaseC].map((p, i) => (
          <div key={i} className="mx-auto mb-24 max-w-[960px] last:mb-0">
            <div className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#0038FF]">
              {p.eyebrow}
            </div>
            <h3
              className="font-display font-bold leading-[1.02] text-[#0A0A0A]"
              style={{ fontSize: "clamp(36px,6vw,68px)", letterSpacing: "-0.03em" }}
            >
              {p.title}
            </h3>
            {"body" in p && (
              <p className="mt-6 max-w-[620px] text-[17px] leading-[1.7] text-black/70">
                {p.body}
              </p>
            )}
            {"pillars" in p && (
              <ul className="mt-8 space-y-6">
                {p.pillars.map((x) => (
                  <li key={x.k} className="border-t border-black/10 pt-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0A0A0A]">
                      {x.k}
                    </div>
                    <p className="mt-2 max-w-[620px] text-[16px] leading-[1.7] text-black/65">
                      {x.v}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      role="region"
      aria-labelledby="mission-title"
      className="relative bg-white"
      style={{ height: "100vh" }}
    >
      <h2 id="mission-title" className="sr-only">
        Nuestra misión
      </h2>

      {/* fixed 3D canvas — right half only so content reads on left */}
      <Phone3D
        progress={progress}
        className="pointer-events-none fixed right-0 top-0 z-0 h-screen w-[55vw] lg:w-[48vw]"
      />

      {/* progress indicator */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      >
        {["01", "02", "03"].map((n, i) => {
          const active = (i === 0 && inA) || (i === 1 && inB) || (i === 2 && inC);
          return (
            <div key={n} className="flex items-center gap-3">
              <div
                className="h-[1px] bg-black/30 transition-all duration-500"
                style={{ width: active ? 48 : 16 }}
              />
              <span
                className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-500 ${
                  active ? "text-[#0A0A0A]" : "text-black/40"
                }`}
              >
                {n}
              </span>
            </div>
          );
        })}
      </div>

      {/* phase content — absolutely positioned, switches by flag */}
      <div className="relative z-10 mx-auto flex h-screen max-w-[1440px] items-center px-6 md:px-10 lg:px-16">
        {/* Phase A */}
        <div
          className="absolute inset-0 flex items-center px-6 md:px-10 lg:px-16"
          style={{
            opacity: inA ? 1 : 0,
            transition: "opacity 400ms ease",
            pointerEvents: inA ? "auto" : "none",
          }}
        >
          <div className="max-w-[640px]">
            <div className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#0038FF]">
              <Reveal visible={inA}>{mission.phaseA.eyebrow}</Reveal>
            </div>
            <h3
              className="font-display font-bold leading-[0.98] text-[#0A0A0A]"
              style={{ fontSize: "clamp(44px,6.2vw,88px)", letterSpacing: "-0.035em" }}
            >
              <Reveal visible={inA} delay={80}>
                {mission.phaseA.title}
              </Reveal>
            </h3>
            <div className="mt-8">
              <Reveal visible={inA} delay={200}>
                <p className="max-w-[540px] text-[18px] leading-[1.7] text-black/70">
                  {mission.phaseA.body}
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Phase B */}
        <div
          className="absolute inset-0 flex items-center px-6 md:px-10 lg:px-16"
          style={{
            opacity: inB ? 1 : 0,
            transition: "opacity 400ms ease",
            pointerEvents: inB ? "auto" : "none",
          }}
        >
          <div className="grid w-full grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5">
              <div className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#0038FF]">
                <Reveal visible={inB}>{mission.phaseB.eyebrow}</Reveal>
              </div>
              <h3
                className="font-display font-bold leading-[1] text-[#0A0A0A]"
                style={{ fontSize: "clamp(40px,5vw,72px)", letterSpacing: "-0.03em" }}
              >
                <Reveal visible={inB} delay={80}>
                  {mission.phaseB.title}
                </Reveal>
              </h3>
            </div>
            <ul className="col-span-12 space-y-6 lg:col-span-6 lg:col-start-7">
              {mission.phaseB.pillars.map((x, i) => (
                <li key={x.k} className="border-t border-black/10 pt-5">
                  <Reveal visible={inB} delay={160 + i * 120}>
                    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0A0A0A]">
                      {x.k}
                    </div>
                    <p className="mt-2 text-[16px] leading-[1.65] text-black/65">{x.v}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Phase C */}
        <div
          className="absolute inset-0 flex items-center px-6 md:px-10 lg:px-16"
          style={{
            opacity: inC ? 1 : 0,
            transition: "opacity 400ms ease",
            pointerEvents: inC ? "auto" : "none",
          }}
        >
          <div className="max-w-[1000px]">
            <div className="mb-4 text-[11px] uppercase tracking-[0.24em] text-[#0038FF]">
              <Reveal visible={inC}>{mission.phaseC.eyebrow}</Reveal>
            </div>
            <h3
              className="font-display font-bold leading-[0.95] text-[#0A0A0A]"
              style={{ fontSize: "clamp(48px,7vw,112px)", letterSpacing: "-0.04em" }}
            >
              <Reveal visible={inC} delay={80}>
                {mission.phaseC.title}
              </Reveal>
            </h3>
            <div className="mt-8">
              <Reveal visible={inC} delay={220}>
                <p className="max-w-[640px] text-[19px] leading-[1.65] text-black/70">
                  {mission.phaseC.body}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
