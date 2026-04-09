"use client";
import dynamic from "next/dynamic";
import React from "react";
import { motion } from "motion/react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);
const ContainerScroll = dynamic(
  () => import("@/components/ui/container-scroll-animation").then((m) => m.ContainerScroll),
  { ssr: false }
);
const About3 = dynamic(
  () => import("@/components/ui/about-3").then((m) => m.About3),
  { ssr: false }
);
const LandingAccordionItem = dynamic(
  () => import("@/components/ui/interactive-image-accordion").then((m) => m.LandingAccordionItem),
  { ssr: false }
);
const GlassmorphismTeamBlock = dynamic(
  () => import("@/components/ui/glassmorphism-portfolio-block").then((m) => m.GlassmorphismTeamBlock),
  { ssr: false }
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const achievements = [
  { label: "Años de experiencia", value: "5+" },
  { label: "Reparaciones realizadas", value: "10k+" },
  { label: "Clientes satisfechos", value: "99%" },
  { label: "Garantía en piezas", value: "∞" },
];

const companies = [
  { src: "https://placehold.co/90x32/000000/FFFFFF?text=Apple&font=montserrat", alt: "Apple" },
  { src: "https://placehold.co/120x32/1428A0/FFFFFF?text=Samsung&font=montserrat", alt: "Samsung" },
  { src: "https://placehold.co/100x32/FF6900/FFFFFF?text=Xiaomi&font=montserrat", alt: "Xiaomi" },
  { src: "https://placehold.co/110x32/CF0A2C/FFFFFF?text=Huawei&font=montserrat", alt: "Huawei" },
  { src: "https://placehold.co/110x32/F5010C/FFFFFF?text=OnePlus&font=montserrat", alt: "OnePlus" },
  { src: "https://placehold.co/110x32/4285F4/FFFFFF?text=Pixel&font=montserrat", alt: "Google Pixel" },
];

export default function AboutPage() {
  return (
    <main className="w-full">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Movil Guru · Quiénes Somos
            </span>
          </motion.div>

          <div className="flex flex-col gap-1 md:gap-2">
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,11vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              QUIÉNES
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,11vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 pl-[8%]"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              SOMOS
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-md">
              Un taller de confianza con más de 5 años reparando móviles de todas las marcas — con honestidad, transparencia y garantía real.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <div className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                Desde 2019
              </div>
              <div className="border border-white/30 text-white/80 text-sm px-5 py-2 rounded-full font-semibold">
                10.000+ reparaciones
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── About3 — Company overview ── */}
      <About3
        title="Somos Movil Guru"
        description="Un taller especializado fundado en 2019 con una misión clara: reparar cualquier móvil de cualquier marca con piezas de calidad, técnicos certificados y una garantía que realmente cumplimos."
        mainImage={{
          src: "https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg?auto=compress&w=1200",
          alt: "Taller Movil Guru",
        }}
        secondaryImage={{
          src: "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&w=600",
          alt: "Reparación de móvil",
        }}
        breakout={{
          src: "",
          alt: "Movil Guru",
          title: "Tu móvil, nuestra responsabilidad",
          description: "Nunca usamos piezas de baja calidad. Cada reparación lleva garantía mínima de 90 días — de por vida en piezas originales.",
          buttonText: "Ver política de garantía",
          buttonUrl: "/warranty",
        }}
        companiesTitle="Reparamos todas las marcas principales"
        companies={companies}
        achievementsTitle="Números que lo dicen todo"
        achievementsDescription="Cada cifra representa un cliente que confió en nosotros y no se arrepintió."
        achievements={achievements}
      />

      {/* ── ContainerScroll — Cinematic workshop shot ── */}
      <div className="bg-[#0a0a0a]">
        <ContainerScroll
          titleComponent={
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-4">
                Nuestro Taller
              </p>
              <h2
                className="text-4xl md:text-6xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-display, inherit)" }}
              >
                Tu móvil en manos
                <br />
                <span
                  className="text-[#CCFF00]"
                  style={{
                    textShadow: "0 0 40px rgba(204,255,0,0.4)",
                  }}
                >
                  de expertos
                </span>
              </h2>
              <p className="text-white/50 mt-4 text-base max-w-md mx-auto">
                Equipamiento profesional, técnicos certificados y protocolos de privacidad estrictos en cada reparación.
              </p>
            </div>
          }
        >
          <div className="relative w-full h-full">
            <img
              src="https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&w=1400"
              alt="Taller Movil Guru"
              className="w-full h-full object-cover"
            />
            {/* Overlay stats */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-10 flex items-end gap-8">
              {[
                { value: "47 min", label: "Rep. promedio de pantalla" },
                { value: "100%", label: "Datos siempre privados" },
                { value: "∞", label: "Garantía en piezas originales" },
              ].map((stat) => (
                <div key={stat.label} className="hidden md:block">
                  <div
                    className="text-2xl font-black text-[#CCFF00]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/60 text-xs mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ContainerScroll>
      </div>

      {/* ── LandingAccordionItem — Services ── */}
      <LandingAccordionItem
        heading="Cada reparación es nuestra especialidad"
        subheading="Cinco años perfeccionando cada tipo de reparación. Sin excepciones, sin sorpresas."
        ctaText="Ver precios"
        ctaHref="/reparacion-pantalla"
      />

      {/* ── GlassmorphismTeamBlock — Team profile ── */}
      <GlassmorphismTeamBlock
        badgeLabel="Nuestro Equipo Técnico"
        name="Carlos Mendoza"
        role="Técnico Principal · Fundador"
        bio="Más de 8 años reparando dispositivos móviles de todas las marcas. Fundé Movil Guru con una idea simple: reparaciones honestas, transparentes y con una garantía que realmente se cumple."
        avatarSrc="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=400"
        highlights={[
          {
            title: "Especialidad principal",
            description: "Microsoldadura y diagnóstico a nivel de componente. Reparaciones que otros talleres rechazan — pantallas plegables, logic boards y recuperación de datos.",
          },
          {
            title: "Certificaciones",
            description: "Certificado por Apple (AASP), Samsung Premium Service Partner y formación especializada en reparación de dispositivos plegables.",
          },
          {
            title: "Compromiso",
            description: "Mostramos la pieza original antes de cambiarla. No cobramos si no podemos reparar. Garantía de por vida en piezas originales.",
          },
        ]}
        ctaText="Reservar reparación"
        ctaHref="/reparacion-pantalla"
      />

      <Footer />
    </main>
  );
}
