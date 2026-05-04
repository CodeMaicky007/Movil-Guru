"use client";
import React from "react";
import { motion } from "motion/react";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/movilguru",
    hoverBg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    hoverShadow: "0 0 24px rgba(225,48,108,0.7)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/movilguru",
    hoverBg: "#1877f2",
    hoverShadow: "0 0 24px rgba(24,119,242,0.7)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/34600000000",
    hoverBg: "#25d366",
    hoverShadow: "0 0 24px rgba(37,211,102,0.7)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    label: "Google",
    href: "https://g.page/movilguru",
    hoverBg: "#ea4335",
    hoverShadow: "0 0 24px rgba(234,67,53,0.7)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    ),
  },
];

export function SocialConnect() {
  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: "#0A1028" }}
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <p
          className="text-[10px] font-black uppercase tracking-[0.4em] mb-4"
          style={{ color: "#CCFF00" }}
        >
          ◆ Síguenos
        </p>
        <h2
          className="text-4xl md:text-6xl font-black uppercase leading-[0.92] tracking-[-0.04em]"
          style={{ color: "#FFFFFF" }}
        >
          Conéctate{" "}
          <span style={{ color: "#CCFF00" }}>con nosotros</span>
        </h2>
        <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.45)" }}>
          Únete a nuestra comunidad y mantente al día con novedades, ofertas y consejos de reparación.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {SOCIALS.map((s, i) => (
            <SocialIcon key={s.label} {...s} delay={i * 0.08} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function SocialIcon({
  label,
  href,
  icon,
  hoverBg,
  hoverShadow,
  delay,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  hoverBg: string;
  hoverShadow: string;
  delay: number;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-3 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { y: -10, scale: 1.12 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center w-20 h-20 rounded-full"
        style={{
          background: hovered ? hoverBg : "rgba(255,255,255,0.06)",
          boxShadow: hovered ? hoverShadow : "0 8px 32px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {icon}
      </motion.div>
      <span
        className="text-xs font-semibold uppercase tracking-wider transition-opacity duration-300"
        style={{ color: hovered ? "#CCFF00" : "rgba(255,255,255,0.5)" }}
      >
        {label}
      </span>
    </motion.a>
  );
}
