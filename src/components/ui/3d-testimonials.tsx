"use client";

import React, { ComponentPropsWithoutRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Marquee ─────────────────────────────────────────────────────────────────

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...props}
      ref={marqueeRef}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        !vertical ? "flex-row" : "flex-col",
        className
      )}
    >
      {React.useMemo(
        () => (
          <>
            {Array.from({ length: repeat }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "flex shrink-0 justify-around",
                  !vertical
                    ? "animate-marquee flex-row [gap:var(--gap)]"
                    : "animate-marquee-vertical flex-col [gap:var(--gap)]",
                  pauseOnHover && "group-hover:[animation-play-state:paused]",
                  reverse && "[animation-direction:reverse]"
                )}
              >
                {children}
              </div>
            ))}
          </>
        ),
        [repeat, children, vertical, pauseOnHover, reverse]
      )}
    </div>
  );
}

// ─── Testimonial data ─────────────────────────────────────────────────────────

export const testimonials = [
  {
    name: "María García",
    username: "@maria_garcia",
    body: "Llegué con la pantalla rota un martes y en menos de una hora estaba como nueva. Técnico súper profesional. 100% recomendado.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    rating: 5,
    service: "Pantalla iPhone 14 Pro",
  },
  {
    name: "Carlos Rodríguez",
    username: "@carlosrod_biz",
    body: "Llevé mi Samsung con la batería hinchada. En 45 minutos lo devolvieron perfecto. Precio justo y garantía de por vida.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    rating: 5,
    service: "Batería Samsung Galaxy S24",
  },
  {
    name: "Laura Martínez",
    username: "@lauramtz",
    body: "Pensé que había perdido 3 años de fotos. Movil Guru no solo lo reparó sino que recuperó TODOS mis datos. 🥹",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
    rating: 5,
    service: "Recuperación de datos",
  },
  {
    name: "Javier López",
    username: "@javi_tech",
    body: "Cambié la batería del Pixel 8 y ahora dura un día entero. Rápido, limpio y a buen precio. El mejor taller.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Javier",
    rating: 5,
    service: "Batería Google Pixel 8",
  },
  {
    name: "Ana Sánchez",
    username: "@anasanchez_ux",
    body: "Honestidad ante todo. Me dijeron el coste exacto desde el principio, sin sorpresas. Servicio de 10.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    rating: 5,
    service: "Reparación Xiaomi 13",
  },
  {
    name: "Roberto Fernández",
    username: "@roberto_foto",
    body: "Soy fotógrafo y mi móvil es mi herramienta. Me dieron cita en el día y en 1h estaba listo. Profesionalidad total.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
    rating: 5,
    service: "Pantalla OnePlus 12",
  },
  {
    name: "Pablo Moreno",
    username: "@pablomoreno_es",
    body: "Pantalla nueva en 40 minutos con piezas originales. Otros sitios me pedían el doble. Movil Guru siempre. 🙌",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pablo",
    rating: 5,
    service: "Pantalla iPhone 15",
  },
  {
    name: "Elena Vega",
    username: "@elenavega_pro",
    body: "Diagnóstico exacto y precio claro en menos de una hora. Sin letra pequeña. Transparencia total. ⭐⭐⭐⭐⭐",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    rating: 5,
    service: "Diagnóstico + reparación",
  },
  {
    name: "David Castillo",
    username: "@david_castillo",
    body: "Tercera vez que vengo y siempre igual de bien. El equipo te trata genial. La garantía de por vida marca la diferencia.",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    rating: 5,
    service: "Varias reparaciones",
  },
];

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function Stars({ count = 5 }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < count ? "text-[#CCFF00]" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialCard({
  img,
  name,
  username,
  body,
  rating,
  service,
}: (typeof testimonials)[number]) {
  return (
    <div
      className="w-64 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Avatar className="size-9 border border-[#0038FF]/40 shrink-0">
          <AvatarImage src={img} alt={name} />
          <AvatarFallback className="bg-[#0038FF]/20 text-white text-xs font-bold">
            {name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate leading-tight">{name}</span>
          <span className="text-[11px] text-white/40 truncate">{username}</span>
        </div>
      </div>

      {/* Stars + service */}
      <div className="flex items-center justify-between">
        <Stars count={rating} />
        <span className="text-[10px] text-[#CCFF00]/70 font-semibold truncate ml-2">
          {service}
        </span>
      </div>

      {/* Body */}
      <blockquote className="text-xs text-white/70 leading-relaxed">
        "{body}"
      </blockquote>
    </div>
  );
}

// ─── 3-D Marquee block ────────────────────────────────────────────────────────

export function Testimonials3D() {
  // Split testimonials into 4 columns
  const col1 = testimonials.filter((_, i) => i % 4 === 0);
  const col2 = testimonials.filter((_, i) => i % 4 === 1);
  const col3 = testimonials.filter((_, i) => i % 4 === 2);
  const col4 = testimonials.filter((_, i) => i % 4 === 3);

  return (
    <div className="relative flex h-[520px] w-full flex-row items-center justify-center overflow-hidden gap-3 [perspective:400px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-80px) translateY(0px) translateZ(-80px) rotateX(18deg) rotateY(-8deg) rotateZ(18deg)",
        }}
      >
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:38s] h-full">
          {col1.map((r) => (
            <TestimonialCard key={r.username} {...r} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:42s] h-full">
          {col2.map((r) => (
            <TestimonialCard key={r.username} {...r} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:36s] h-full">
          {col3.map((r) => (
            <TestimonialCard key={r.username} {...r} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:44s] h-full">
          {col4.map((r) => (
            <TestimonialCard key={r.username} {...r} />
          ))}
        </Marquee>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#060812]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#060812]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#060812]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#060812]" />
      </div>
    </div>
  );
}
