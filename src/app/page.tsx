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

const FullScreenScrollFX = dynamic(
  () => import("@/components/ui/full-screen-scroll-fx").then((m) => m.FullScreenScrollFX),
  { ssr: false }
);

const scrollSections = [
  {
    leftLabel: "Speed",
    title: "FAST",
    rightLabel: "Speed",
    background: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg",
  },
  {
    leftLabel: "All Devices",
    title: "EVERY BRAND",
    rightLabel: "All Devices",
    background: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
  },
  {
    leftLabel: "Guarantee",
    title: "LIFETIME",
    rightLabel: "Guarantee",
    background: "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg",
  },
  {
    leftLabel: "Privacy",
    title: "DATA SAFE",
    rightLabel: "Privacy",
    background: "https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg",
  },
];

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
      <FullScreenScrollFX
        sections={scrollSections}
        header={
          <>
            <div>The Movil Guru</div>
            <div>Difference</div>
          </>
        }
        footer={<div></div>}
        showProgress
        durations={{ change: 0.7, snap: 800 }}
      />
      <CinematicHero
        brandName="MOVIL GURU"
        tagline1="Every brand."
        tagline2="Fixed today."
        cardHeading="Certified repairs. Lifetime guarantee."
        cardDescription={
          <>
            <span className="text-white font-semibold">Movil Guru</span> repairs
            iPhones, Samsung Galaxy, Google Pixel, foldables, and more — with
            OEM-quality parts and a lifetime warranty on every repair we perform.
          </>
        }
        metricValue={47}
        metricLabel="Min. Avg. Screen Repair"
        ctaHeading="Fixed today. Backed forever."
        ctaDescription="Walk in or ship it in. Same certified technicians, same lifetime warranty, same-day results for most repairs."
      />
      <Testimonials />
      <PricingSection />
      <Footer />
    </main>
  );
}
