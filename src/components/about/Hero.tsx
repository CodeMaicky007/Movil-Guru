"use client";
import { hero } from "@/app/about-preview/content";
import Phone3D from "./Phone3D";

export function Hero() {
  return (
    <section
      role="region"
      aria-labelledby="about-hero-title"
      className="relative min-h-screen w-full overflow-hidden bg-white"
    >
      {/* grain layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* radial brand wash — top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[640px] w-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,56,255,0.10), rgba(0,56,255,0) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-between px-6 pt-32 pb-12 md:px-10 lg:px-16">
        {/* eyebrow */}
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-black/55">
          <span className="inline-block h-px w-10 bg-black/40" />
          {hero.eyebrow}
        </div>

        {/* main block */}
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1
              id="about-hero-title"
              className="font-display font-bold leading-[0.92] text-[#0A0A0A]"
              style={{
                fontSize: "clamp(56px, 8vw, 120px)",
                letterSpacing: "-0.035em",
              }}
            >
              Somos <span className="italic text-[#0038FF]">Movil</span>
              <br />
              Guru<span className="text-[#CCFF00]">.</span>
            </h1>
            <p
              className="mt-8 max-w-[520px] text-[20px] leading-[1.55] text-black/70"
              style={{ fontFamily: "var(--font-body, inherit)" }}
            >
              {hero.subtitle}
            </p>

            <a
              href={hero.cta.href}
              aria-label="Ir a la sección del equipo"
              className="group mt-10 inline-flex items-center gap-3 border-b border-black/30 pb-2 text-sm uppercase tracking-[0.24em] text-black transition-[border-color,transform] duration-300 hover:border-[#0038FF] hover:text-[#0038FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
            >
              {hero.cta.label}
              <span
                aria-hidden
                className="translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1"
              >
                ↓
              </span>
            </a>
          </div>

          {/* 3D phone desktop only */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="relative aspect-[4/5] w-full">
              <Phone3D staticPose="hero" className="absolute inset-0" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
              />
            </div>
          </div>
        </div>

        {/* bottom rule */}
        <div className="mt-12 flex items-end justify-between text-[11px] uppercase tracking-[0.24em] text-black/45">
          <span>Madrid · Multimarca</span>
          <span className="hidden md:inline">
            Scroll <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </section>
  );
}
