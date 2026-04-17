"use client";
import dynamic from "next/dynamic";
import React from "react";

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
const CinematicFooter = dynamic(
  () => import("@/components/ui/motion-footer").then((m) => m.CinematicFooter),
  { ssr: false }
);
const AboutHero = dynamic(
  () => import("@/components/ui/about-hero").then((m) => m.AboutHero),
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
  { src: "/images/Apple.png",       alt: "Apple"       },
  { src: "/images/Samsung.png",     alt: "Samsung"     },
  { src: "/images/Xiaomi.png",      alt: "Xiaomi"      },
  { src: "/images/huawei.png",      alt: "Huawei"      },
  { src: "/images/oneplus.png",     alt: "OnePlus"     },
  { src: "/images/GooglePixel.png", alt: "Google Pixel"},
];

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero ── */}
      <AboutHero />

      {/* ── About3 — Company overview ── */}
      <About3
        title={<>MOVIL <span className="text-[#0038FF]">GURU.</span> <span className="text-[#CCFF00] [text-shadow:0_2px_12px_rgba(204,255,0,0.25)]">PUNTO.</span></>}
        description="Cinco años. Más de 10.000 móviles reparados. Una sola regla: si no lo arreglamos, no cobras. Así de simple."
        mainImage={{
          src: "https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&w=1200",
          alt: "Taller Movil Guru",
        }}
        secondaryImage={{
          src: "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&w=600",
          alt: "Reparación de móvil",
        }}
        breakout={{
          src: "",
          alt: "Movil Guru",
          title: "Sin letra pequeña. Sin sorpresas.",
          description: "Piezas originales o de calidad OEM. Garantía de por vida. Te mostramos la pieza antes de cambiarla. No cobramos si no reparamos.",
          buttonText: "Ver garantía",
          buttonUrl: "/garantia",
        }}
        companiesTitle="Todas las marcas. Sin excepción."
        companies={companies}
        achievementsTitle={<>LOS <span className="text-[#CCFF00]">NÚMEROS</span> NO <span className="text-[#CCFF00] [text-shadow:0_0_20px_rgba(204,255,0,0.4)]">MIENTEN</span></>}
        achievementsDescription="Cada cifra es un móvil reparado, un cliente que volvió, una garantía que cumplimos."
        achievements={achievements}
      />

      {/* ── ContainerScroll — Cinematic workshop shot ── */}
      <div className="bg-white">
        <ContainerScroll
          titleComponent={
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF] mb-4">
                Nuestro Taller · Desde 2019
              </p>
              <h2
                className="text-4xl md:text-6xl font-black text-black leading-tight"
                style={{ fontFamily: "var(--font-display, inherit)" }}
              >
                Tu móvil{" "}
                <span className="text-[#0038FF]">en manos</span>
                <br />
                <span className="text-[#CCFF00] [text-shadow:0_2px_12px_rgba(204,255,0,0.25)]">
                  de expertos
                </span>
              </h2>
              <p className="text-black/50 mt-4 text-base max-w-md mx-auto">
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
        heading={<>Lo que otros <span className="text-[#0038FF]">rechazan,</span> nosotros <span className="text-[#CCFF00] [text-shadow:0_2px_16px_rgba(204,255,0,0.3)]">lo reparamos.</span></>}
        subheading="Pantallas OLED, plegables, daño por agua, microsoldadura — sin excepciones, entregado hoy."
        ctaText="Ver todos los servicios"
        ctaHref="/servicios"
      />

      {/* ── GlassmorphismTeamBlock — Team profile ── */}
      <GlassmorphismTeamBlock
        badgeLabel="Quién hay detrás"
        name="Carlos Mendoza"
        role="Fundador · Técnico Principal"
        bio="8 años reparando lo que otros no pueden. Fundé Movil Guru con una regla: si no lo arreglamos, no cobras. Nada de excusas, nada de letra pequeña."
        avatarSrc="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=400"
        highlights={[
          {
            title: "Lo que nadie más toca",
            description: "Microsoldadura a nivel de componente, logic boards, pantallas plegables y recuperación de datos. Reparaciones que el resto rechaza.",
          },
          {
            title: "Certificaciones reales",
            description: "Apple AASP, Samsung Premium Service Partner. No son títulos en la pared — son las mismas certificaciones que exige Apple a sus propios técnicos.",
          },
          {
            title: "Nuestra promesa",
            description: "Te mostramos la pieza antes de cambiarla. No cobramos si no podemos reparar. Garantía de por vida en piezas originales. Sin negociación.",
          },
        ]}
        ctaText="Reservar ahora"
        ctaHref="/servicios"
      />

      <CinematicFooter />

      <Footer />
    </main>
  );
}
