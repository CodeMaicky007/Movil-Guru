"use client";

import * as React from "react";
import { BentoGridShowcase } from "@/components/ui/bento-grid";

const cardBase: React.CSSProperties = {
  background: "#ffffff",
  border: "2.5px solid var(--mg-ink, #080e14)",
  borderRadius: 18,
  boxShadow: "5px 5px 0 var(--mg-ink, #080e14)",
  height: "100%",
  width: "100%",
  position: "relative",
  overflow: "hidden",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display), Syne, sans-serif",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "-0.025em",
  color: "var(--mg-ink, #080e14)",
  lineHeight: 1.05,
};

const bodyStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(8,14,20,0.65)",
  lineHeight: 1.55,
  fontWeight: 500,
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "var(--font-display), Syne, sans-serif",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "var(--mg-blue, #0038ff)",
};

const BRANDS = [
  { src: "/images/Apple.png", alt: "Apple" },
  { src: "/images/Samsung.png", alt: "Samsung" },
  { src: "/images/GooglePixel.png", alt: "Pixel" },
  { src: "/images/Xiaomi.png", alt: "Xiaomi" },
  { src: "/images/huawei.png", alt: "Huawei" },
  { src: "/images/motorola.png", alt: "Motorola" },
];

const MarcasCard = () => (
  <div style={{ ...cardBase, padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18 }}>
    <div>
      <p style={eyebrowStyle}>Marcas</p>
      <h3 style={{ ...titleStyle, fontSize: 22, marginTop: 8 }}>
        Reparamos <span style={{ color: "var(--mg-blue, #0038ff)" }}>todo</span>
      </h3>
      <p style={{ ...bodyStyle, marginTop: 8 }}>
        iPhone, Samsung, Pixel, Xiaomi, Huawei, Motorola y más.
      </p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
      {BRANDS.map((b) => (
        <div
          key={b.alt}
          style={{
            aspectRatio: "1 / 1",
            border: "1.5px solid rgba(8,14,20,0.12)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
            background: "#fafafa",
          }}
        >
          <img src={b.src} alt={b.alt} style={{ width: "75%", height: "75%", objectFit: "contain" }} />
        </div>
      ))}
    </div>
  </div>
);

const ServiciosCard = () => {
  const tags = [
    { label: "Pantalla", solid: false },
    { label: "Batería", solid: true },
    { label: "Placa Base", solid: false },
    { label: "Cámara", solid: true },
    { label: "Daño por agua", solid: false },
  ];
  return (
    <div style={{ ...cardBase, padding: 26, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
      <p style={{ ...eyebrowStyle, marginBottom: 4 }}>Servicios</p>
      {tags.map((t) => (
        <span
          key={t.label}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            fontFamily: "var(--font-display), Syne, sans-serif",
            fontSize: 13,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            width: "fit-content",
            background: t.solid ? "var(--mg-lime, #ccff00)" : "transparent",
            color: t.solid ? "var(--mg-ink, #080e14)" : "var(--mg-blue, #0038ff)",
            border: t.solid ? "2px solid var(--mg-ink, #080e14)" : "2px solid var(--mg-blue, #0038ff)",
          }}
        >
          {t.label}
          <span style={{ fontSize: 10 }}>+</span>
        </span>
      ))}
    </div>
  );
};

const BrokenPhoneCard = () => (
  <div
    style={{
      ...cardBase,
      background: "var(--mg-ink, #080e14)",
      minHeight: 480,
    }}
  >
    <img
      src="/images/GURU_BOT/GURU_phone.png"
      alt="Pantalla de móvil rota"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        zIndex: 1,
        filter: "saturate(0.85) contrast(1.05)",
      }}
      draggable={false}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(0,17,102,0.85) 0%, rgba(8,14,20,0.45) 45%, rgba(8,14,20,0.15) 100%)",
        zIndex: 2,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 24,
        zIndex: 10,
        background: "var(--mg-lime, #ccff00)",
        border: "2px solid var(--mg-ink, #080e14)",
        borderRadius: 999,
        padding: "8px 14px",
        boxShadow: "3px 3px 0 var(--mg-ink, #080e14)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display), Syne, sans-serif",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--mg-ink, #080e14)",
          margin: 0,
        }}
      >
        Sin drama
      </p>
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        padding: "26px 24px 28px",
      }}
    >
      <h3
        style={{
          ...titleStyle,
          color: "#ffffff",
          fontSize: 32,
          margin: 0,
        }}
      >
        Pantalla rota.
        <br />
        <span style={{ color: "var(--mg-lime, #ccff00)" }}>La arreglamos.</span>
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.82)",
          marginTop: 10,
          fontWeight: 500,
          lineHeight: 1.5,
          maxWidth: 320,
        }}
      >
        Cristal, cámara, batería o placa base. Sea lo que sea, lo arreglamos hoy.
      </p>
    </div>
  </div>
);

const ReparacionExpressCard = () => (
  <div
    style={{
      ...cardBase,
      background: "var(--mg-ink, #080e14)",
      padding: 0,
    }}
  >
    <img
      src="/images/GURU_BOT/GURU_BOT.png"
      alt="Guru Bot — el asistente de Movil Guru"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      draggable={false}
    />
  </div>
);

const StatsCard = () => (
  <div
    style={{
      ...cardBase,
      background: "var(--mg-lime, #ccff00)",
      padding: 28,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: 380,
    }}
  >
    <div style={{ position: "relative", zIndex: 2 }}>
      <p style={{ ...eyebrowStyle, color: "var(--mg-ink, #080e14)" }}>Garantía</p>
      <h3 style={{ ...titleStyle, fontSize: 22, marginTop: 8 }}>
        De por vida.
      </h3>
    </div>
    <div style={{ 
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      height: "240px",
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      zIndex: 1,
      pointerEvents: "none"
    }}>
      <img 
        src="/images/GURU_BOT/emociones/alucinando.png" 
        alt="Guru alucinando" 
        style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(2.2)" }}
        draggable={false}
      />
    </div>
    <div style={{ position: "relative", zIndex: 2 }}>
      <p
        style={{
          fontFamily: "var(--font-display), Syne, sans-serif",
          fontSize: 96,
          fontWeight: 800,
          color: "var(--mg-ink, #080e14)",
          letterSpacing: "-0.05em",
          lineHeight: 0.85,
          margin: 0,
        }}
      >
        ∞
      </p>
      <p
        style={{
          fontFamily: "var(--font-display), Syne, sans-serif",
          fontSize: 14,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--mg-ink, #080e14)",
          marginTop: 12,
        }}
      >
        500+ reparaciones · 4.9/5 ★
      </p>
      <p
        style={{
          ...bodyStyle,
          color: "rgba(8,14,20,0.7)",
          marginTop: 8,
        }}
      >
        Si vuelve a fallar, lo arreglamos. Sin letra pequeña.
      </p>
    </div>
  </div>
);

const JourneyCard = () => {
  const steps = ["Diagnóstico", "Presupuesto", "Reparación", "Garantía"];
  return (
    <div
      style={{
        ...cardBase,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <p style={eyebrowStyle}>Tu paso a paso</p>
        <h3 style={{ ...titleStyle, fontSize: 22, marginTop: 8 }}>
          De la puerta al móvil reparado.
        </h3>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                fontSize: 11,
                fontWeight: 800,
                color: "var(--mg-blue, #0038ff)",
                width: 24,
                letterSpacing: "0.1em",
              }}
            >
              0{i + 1}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--mg-ink, #080e14)",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MovilGuruBento() {
  return (
    <section
      style={{
        position: "relative",
        background: "#ffffff",
        padding: "clamp(56px, 8vw, 120px) clamp(24px, 5vw, 80px)",
        borderRadius: "0 0 clamp(36px, 6vw, 96px) clamp(36px, 6vw, 96px)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: "clamp(32px, 5vw, 56px)", textAlign: "center" }}>
          <p style={{ ...eyebrowStyle, marginBottom: 14 }}>Por qué Movil Guru</p>
          <h2
            style={{
              ...titleStyle,
              fontSize: "clamp(34px, 5vw, 64px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            Cada marca.
            <br />
            <span style={{ color: "var(--mg-blue, #0038ff)" }}>Reparada hoy.</span>
          </h2>
        </div>

        <BentoGridShowcase
          integrations={<MarcasCard />}
          featureTags={<ServiciosCard />}
          mainFeature={<BrokenPhoneCard />}
          secondaryFeature={<ReparacionExpressCard />}
          statistic={<StatsCard />}
          journey={<JourneyCard />}
        />
      </div>
    </section>
  );
}
