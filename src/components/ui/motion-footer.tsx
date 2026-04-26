"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Brand tokens ───────────────────────────────────────────────────────────
const BRAND = {
  bg: "#ffffff",
  blue: "#0038FF",
  lime: "#CCFF00",
  white: "#0a0a0a",
  muted: "rgba(10,10,10,0.45)",
  border: "rgba(10,10,10,0.08)",
};

// ─── Inline styles ──────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.mg-footer {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

@keyframes mg-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes mg-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.9; }
}

@keyframes mg-heartbeat {
  0%, 100% { transform: scale(1); }
  15%, 45% { transform: scale(1.25); }
  30%      { transform: scale(1); }
}

.mg-marquee-track { animation: mg-marquee 40s linear infinite; }
.mg-breathe       { animation: mg-breathe 8s ease-in-out infinite alternate; }
.mg-heartbeat     { animation: mg-heartbeat 2s cubic-bezier(0.25,1,0.5,1) infinite; }

.mg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, rgba(10,10,10,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(10,10,10,0.05) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

.mg-giant-text {
  font-size: clamp(6rem, 22vw, 320px);
  line-height: 0.8;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(10,10,10,0.07);
  background: linear-gradient(180deg, rgba(0,56,255,0.06) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
}

.mg-heading-glow {
  background: linear-gradient(180deg, #0a0a0a 0%, rgba(10,10,10,0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 28px rgba(0,56,255,0.10));
}

.mg-pill {
  background: linear-gradient(145deg, rgba(10,10,10,0.04) 0%, rgba(10,10,10,0.02) 100%);
  border: 1px solid rgba(10,10,10,0.10);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 8px 24px -8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
  transition: background 0.35s cubic-bezier(0.16,1,0.3,1),
              border-color 0.35s cubic-bezier(0.16,1,0.3,1),
              box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
              color 0.2s ease;
  color: rgba(10,10,10,0.55);
}

.mg-pill:hover {
  background: linear-gradient(145deg, rgba(0,56,255,0.06) 0%, rgba(0,56,255,0.02) 100%);
  border-color: rgba(0,56,255,0.25);
  box-shadow: 0 16px 40px -10px rgba(0,56,255,0.10), inset 0 1px 0 rgba(0,56,255,0.08);
  color: #0038FF;
}

.mg-pill-primary {
  background: linear-gradient(145deg, rgba(0,56,255,0.08) 0%, rgba(0,56,255,0.03) 100%);
  border: 1px solid rgba(0,56,255,0.22);
  box-shadow: 0 8px 24px -8px rgba(0,56,255,0.15), inset 0 1px 0 rgba(0,56,255,0.10);
  color: #0038FF;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: background 0.35s cubic-bezier(0.16,1,0.3,1),
              border-color 0.35s cubic-bezier(0.16,1,0.3,1),
              box-shadow 0.35s cubic-bezier(0.16,1,0.3,1),
              color 0.2s ease;
}

.mg-pill-primary:hover {
  background: linear-gradient(145deg, rgba(0,56,255,0.14) 0%, rgba(0,56,255,0.06) 100%);
  border-color: rgba(0,56,255,0.45);
  box-shadow: 0 16px 40px -8px rgba(0,56,255,0.20), inset 0 1px 0 rgba(0,56,255,0.18);
  color: #001f8f;
}
`;

// ─── Magnetic Button ─────────────────────────────────────────────────────────
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const el = localRef.current;
      if (!el) return;

      const ctx = gsap.context(() => {
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          gsap.to(el, { x: x * 0.35, y: y * 0.35, rotationX: -y * 0.12, rotationY: x * 0.12, scale: 1.05, ease: "power2.out", duration: 0.4 });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1,0.3)", duration: 1.2 });
        };
        el.addEventListener("mousemove", onMove as any);
        el.addEventListener("mouseleave", onLeave);
        return () => { el.removeEventListener("mousemove", onMove as any); el.removeEventListener("mouseleave", onLeave); };
      }, el);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// ─── Marquee row ─────────────────────────────────────────────────────────────
const MarqueeItem = () => (
  <div className="flex items-center gap-12 px-6 shrink-0">
    <span>Reparación Garantizada</span>
    <span style={{ color: "#0038FF", opacity: 0.4 }}>✦</span>
    <span>Diagnóstico Gratis</span>
    <span style={{ color: "#0038FF", opacity: 0.4 }}>✦</span>
    <span>Técnicos Certificados</span>
    <span style={{ color: "#0038FF", opacity: 0.4 }}>✦</span>
    <span>Garantía Real</span>
    <span style={{ color: "#0038FF", opacity: 0.4 }}>✦</span>
    <span>Todas las Marcas</span>
    <span style={{ color: "#0038FF", opacity: 0.4 }}>✦</span>
  </div>
);

// ─── Main export ─────────────────────────────────────────────────────────────
export function CinematicFooter() {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const innerRef     = useRef<HTMLDivElement>(null);
  const giantRef     = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const linksRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Giant text parallax
      gsap.fromTo(
        giantRef.current,
        { y: 80, scale: 0.85, opacity: 0 },
        {
          y: 0, scale: 1, opacity: 1, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top 20%", scrub: 1.2 },
        }
      );
      // Content reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", end: "top 10%", scrub: 1 },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Full-screen section — no fixed positioning, no z-index wars */}
      <section
        ref={sectionRef}
        className="mg-footer relative w-full min-h-screen flex flex-col justify-between overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        {/* Aurora glow */}
        <div
          className="mg-breathe absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: "70vw", height: "55vh",
            background: `radial-gradient(circle, rgba(0,56,255,0.06) 0%, rgba(204,255,0,0.05) 50%, transparent 75%)`,
            filter: "blur(70px)",
          }}
        />

        {/* Grid */}
        <div className="mg-grid absolute inset-0 pointer-events-none" />

        {/* Giant background text */}
        <div
          ref={giantRef}
          className="mg-giant-text absolute bottom-0 left-1/2 -translate-x-1/2"
        >
          MOVIL GURU
        </div>

        {/* ── Marquee ── */}
        <div
          className="relative z-10 w-full overflow-hidden py-4 -rotate-1 scale-105 mt-16"
          style={{
            borderTop: `1px solid rgba(10,10,10,0.08)`,
            borderBottom: `1px solid rgba(10,10,10,0.08)`,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            className="mg-marquee-track flex w-max text-xs md:text-sm font-bold tracking-[0.28em] uppercase"
            style={{ color: "#0038FF" }}
          >
            <MarqueeItem />
            <MarqueeItem />
            <MarqueeItem />
          </div>
        </div>

        {/* ── Center content ── */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 w-full max-w-5xl mx-auto">
          <h2
            ref={headingRef}
            className="mg-heading-glow text-5xl md:text-8xl font-black tracking-tighter mb-12 text-center"
          >
            ¿Listo para empezar?
          </h2>

          <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
            {/* Primary CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton
                as="a"
                href="/reparacion-pantalla"
                className="mg-pill-primary px-10 py-5 rounded-full font-bold text-sm md:text-base flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Reparar mi móvil
              </MagneticButton>

              <MagneticButton
                as="a"
                href="/track"
                className="mg-pill px-10 py-5 rounded-full font-bold text-sm md:text-base flex items-center gap-3"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Rastrear reparación
              </MagneticButton>
            </div>

            {/* Secondary links */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-2">
              {[
                { label: "Opiniones", href: "/opiniones" },
                { label: "Quiénes somos", href: "/about" },
                { label: "Contacto", href: "/contact" },
              ].map((l) => (
                <MagneticButton
                  key={l.href}
                  as="a"
                  href={l.href}
                  className="mg-pill px-6 py-3 rounded-full font-medium text-xs md:text-sm"
                >
                  {l.label}
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderTop: `1px solid ${BRAND.border}` }}
        >
          {/* Copyright */}
          <p className="text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1" style={{ color: BRAND.muted }}>
            © 2026 Movil Guru. Todos los derechos reservados.
          </p>

          {/* Made with love badge */}
          <div
            className="mg-pill px-5 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default"
          >
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.muted }}>Hecho con</span>
            <span className="mg-heartbeat text-sm" style={{ color: "#ef4444" }}>❤</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.muted }}>en</span>
            <span className="font-black text-xs md:text-sm tracking-normal ml-0.5" style={{ color: BRAND.white }}>Barcelona</span>
          </div>

          {/* Back to top */}
          <MagneticButton
            as="button"
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full mg-pill flex items-center justify-center group order-3"
            aria-label="Volver arriba"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </MagneticButton>
        </div>
      </section>
    </>
  );
}
