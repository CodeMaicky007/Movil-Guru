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
  { src: "https://placehold.co/90x32/000000/FFFFFF?text=Apple&font=montserrat", alt: "Apple" },
  { src: "https://placehold.co/120x32/1428A0/FFFFFF?text=Samsung&font=montserrat", alt: "Samsung" },
  { src: "https://placehold.co/100x32/FF6900/FFFFFF?text=Xiaomi&font=montserrat", alt: "Xiaomi" },
  { src: "https://placehold.co/110x32/CF0A2C/FFFFFF?text=Huawei&font=montserrat", alt: "Huawei" },
  { src: "https://placehold.co/110x32/F5010C/FFFFFF?text=OnePlus&font=montserrat", alt: "OnePlus" },
  { src: "https://placehold.co/110x32/4285F4/FFFFFF?text=Pixel&font=montserrat", alt: "Google Pixel" },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-[#060812]">
      <Header dark />

      {/* ── Hero ── */}
      <AboutHero />

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
      <div className="bg-[#060812]">
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

      <CinematicFooter />

      <Footer />
    </main>
  );
}
