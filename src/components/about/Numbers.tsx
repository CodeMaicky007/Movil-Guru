"use client";
import NumberFlow from "@number-flow/react";
import { useEffect, useRef, useState } from "react";
import { numbers } from "@/app/about-preview/content";

export function Numbers() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setLive(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      role="region"
      aria-labelledby="numbers-title"
      className="relative overflow-hidden bg-[#0A0A0A] px-6 py-28 md:px-10 lg:px-16"
    >
      {/* subtle brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,56,255,0.25), rgba(0,56,255,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-16 flex items-end justify-between border-b border-white/10 pb-6">
          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#CCFF00]">
              Resultados
            </div>
            <h2
              id="numbers-title"
              className="font-display font-bold text-white"
              style={{ fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-0.03em", lineHeight: 1 }}
            >
              Los números no mienten.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.label} className="group">
              <div
                className="font-display font-bold text-white tabular-nums"
                style={{
                  fontSize: "clamp(48px,7vw,96px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                }}
              >
                <NumberFlow value={live ? n.value : 0} />
                <span className="text-[#CCFF00]">{n.suffix}</span>
              </div>
              <div className="mt-4 h-[1px] w-10 bg-white/30 transition-all duration-500 group-hover:w-16 group-hover:bg-[#CCFF00]" />
              <div className="mt-4 text-[12px] uppercase tracking-[0.2em] text-white/55">
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
