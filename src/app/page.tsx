"use client";
import dynamic from "next/dynamic";
import React from "react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);

const HeroComponent = dynamic(
  () => import("@/components/ui/hero").then((m) => m.HeroComponent),
  { ssr: false }
);

const FeatureCarousel = dynamic(
  () => import("@/components/ui/feature-carousel").then((m) => m.FeatureCarousel),
  { ssr: false }
);


const CinematicHero = dynamic(
  () => import("@/components/ui/cinematic-landing-hero").then((m) => m.CinematicHero),
  { ssr: false }
);

const Testimonials = dynamic(
  () => import("@/components/ui/testimonials-columns-1").then((m) => m.Testimonials),
  { ssr: false }
);

const PricingSection = dynamic(
  () => import("@/components/ui/pricing-section-3"),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <HeroComponent />
      <FeatureCarousel />
      <CinematicHero
        brandName="MOVIL GURU"
        tagline1="Cada marca."
        tagline2="Reparado hoy."
        cardHeading="Reparaciones certificadas. Garantía de por vida."
        cardDescription={
          <>
            <span className="text-white font-semibold">Movil Guru</span> repara
            iPhones, Samsung Galaxy, Google Pixel, plegables y más — con
            piezas de calidad OEM y garantía de por vida en cada reparación.
          </>
        }
        metricValue={47}
        metricLabel="Min. prom. reparación de pantalla"
        ctaHeading="Reparado hoy. Respaldado para siempre."
        ctaDescription="Ven a nuestra tienda o envíalo. Mismos técnicos certificados, misma garantía de por vida, resultados en el mismo día para la mayoría de reparaciones."
      />
      <Testimonials />
      <PricingSection />
      <Footer />
    </main>
  );
}
