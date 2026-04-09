"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

// ─── Types ────────────────────────────────────────────────────────────────────
type Quality = "Original" | "Premium" | "Compatible";

interface Part {
  name: string;
  quality: Quality;
  price: number;
  description: string;
}
interface PhoneModel {
  name: string;
  parts: Part[];
}
interface Brand {
  id: string;
  name: string;
  shortName: string;
  accentColor: string;
  models: PhoneModel[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const brands: Brand[] = [
  {
    id: "iphone",
    name: "Apple iPhone",
    shortName: "iPhone",
    accentColor: "#1d1d1f",
    models: [
      {
        name: "iPhone 16 Pro Max",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 349, description: "Pieza OEM certificada. Color perfecto, brillo máximo, Face ID 100% funcional." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 229, description: "Calidad equivalente a original. Colores precisos, tacto suave, garantía 1 año." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 159, description: "Opción económica funcional. Ideal para uso básico diario." },
        ],
      },
      {
        name: "iPhone 16 Pro",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 319, description: "Pieza OEM certificada. Face ID 100% funcional." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 209, description: "Calidad equivalente a original. Garantía 1 año." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 149, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 15 Pro Max",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 299, description: "Pieza OEM certificada. Face ID 100% funcional." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 189, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 139, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 15 Pro",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 269, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 169, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 119, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 15",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 229, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 149, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 99, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 14 Pro Max",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 259, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 169, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 119, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 14 Pro",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 239, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 159, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 109, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 14",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 199, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 139, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 95, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 13 Pro Max",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 219, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 149, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 99, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 13",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 179, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 119, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 79, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 12",
        parts: [
          { name: "Pantalla OLED Original Apple", quality: "Original", price: 159, description: "Pieza OEM certificada." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 109, description: "Calidad equivalente a original." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 69, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone 11",
        parts: [
          { name: "Pantalla LCD Original Apple", quality: "Original", price: 119, description: "Panel LCD IPS original de alta calidad." },
          { name: "Pantalla LCD Premium", quality: "Premium", price: 79, description: "Panel LCD de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 55, description: "Opción económica funcional." },
        ],
      },
      {
        name: "iPhone SE (3ª gen)",
        parts: [
          { name: "Pantalla LCD Original Apple", quality: "Original", price: 109, description: "Panel LCD original." },
          { name: "Pantalla LCD Premium", quality: "Premium", price: 69, description: "Panel LCD de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 45, description: "Opción económica funcional." },
        ],
      },
    ],
  },
  {
    id: "samsung",
    name: "Samsung Galaxy",
    shortName: "Samsung",
    accentColor: "#1428A0",
    models: [
      {
        name: "Galaxy S24 Ultra",
        parts: [
          { name: "Pantalla Dynamic AMOLED 2X Original", quality: "Original", price: 329, description: "Panel original Samsung. S Pen compatible, 2600 nits, 120Hz adaptativo." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 219, description: "Panel AMOLED de alta calidad. Colores vívidos, 120Hz." },
        ],
      },
      {
        name: "Galaxy S24+",
        parts: [
          { name: "Pantalla Dynamic AMOLED 2X Original", quality: "Original", price: 279, description: "Panel Dynamic AMOLED 2X original Samsung." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 179, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 129, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Galaxy S24",
        parts: [
          { name: "Pantalla Dynamic AMOLED 2X Original", quality: "Original", price: 249, description: "Panel Dynamic AMOLED 2X original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 159, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 119, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Galaxy S23 Ultra",
        parts: [
          { name: "Pantalla Dynamic AMOLED 2X Original", quality: "Original", price: 299, description: "Panel Dynamic AMOLED 2X original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 199, description: "Panel AMOLED de alta calidad." },
        ],
      },
      {
        name: "Galaxy S23",
        parts: [
          { name: "Pantalla Dynamic AMOLED 2X Original", quality: "Original", price: 219, description: "Panel Dynamic AMOLED 2X original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 149, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 99, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Galaxy A55",
        parts: [
          { name: "Pantalla Super AMOLED Original", quality: "Original", price: 169, description: "Panel Super AMOLED original Samsung." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 109, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 79, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Galaxy A54",
        parts: [
          { name: "Pantalla Super AMOLED Original", quality: "Original", price: 149, description: "Panel Super AMOLED original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 99, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 69, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Galaxy Z Fold 6 (interior)",
        parts: [
          { name: "Pantalla Interior Foldable Original", quality: "Original", price: 489, description: "Panel plegable UTG original Samsung. Solo instalación por técnico especialista." },
          { name: "Pantalla Interior Foldable Premium", quality: "Premium", price: 329, description: "Panel plegable de alta durabilidad." },
        ],
      },
      {
        name: "Galaxy Z Flip 6",
        parts: [
          { name: "Pantalla Interior Foldable Original", quality: "Original", price: 329, description: "Panel plegable UTG original Samsung." },
          { name: "Pantalla Interior Foldable Premium", quality: "Premium", price: 219, description: "Panel plegable premium." },
        ],
      },
    ],
  },
  {
    id: "xiaomi",
    name: "Xiaomi / Redmi",
    shortName: "Xiaomi",
    accentColor: "#FF6900",
    models: [
      {
        name: "Xiaomi 14 Ultra",
        parts: [
          { name: "Pantalla LTPO AMOLED Original Xiaomi", quality: "Original", price: 269, description: "Panel LTPO AMOLED original. 120Hz, resolución 3200×1440." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 179, description: "Panel AMOLED de alta calidad." },
        ],
      },
      {
        name: "Xiaomi 14 Pro",
        parts: [
          { name: "Pantalla LTPO AMOLED Original Xiaomi", quality: "Original", price: 239, description: "Panel LTPO AMOLED original Xiaomi." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 159, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 109, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Xiaomi 14",
        parts: [
          { name: "Pantalla AMOLED Original Xiaomi", quality: "Original", price: 199, description: "Panel AMOLED original Xiaomi." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 139, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 95, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Redmi Note 13 Pro+",
        parts: [
          { name: "Pantalla CrystalRes AMOLED Original", quality: "Original", price: 169, description: "Panel CrystalRes AMOLED original. Display 1.5K." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 109, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 79, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Redmi Note 13 Pro",
        parts: [
          { name: "Pantalla AMOLED Original Xiaomi", quality: "Original", price: 139, description: "Panel AMOLED original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 89, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 65, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Redmi Note 13",
        parts: [
          { name: "Pantalla AMOLED Original Xiaomi", quality: "Original", price: 99, description: "Panel AMOLED original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 69, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 49, description: "Opción económica funcional." },
        ],
      },
      {
        name: "POCO X6 Pro",
        parts: [
          { name: "Pantalla Flow AMOLED Original", quality: "Original", price: 149, description: "Panel Flow AMOLED 1.5K original Xiaomi." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 99, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 75, description: "Opción económica funcional." },
        ],
      },
    ],
  },
  {
    id: "huawei",
    name: "Huawei",
    shortName: "Huawei",
    accentColor: "#CF0A2C",
    models: [
      {
        name: "Pura 70 Pro",
        parts: [
          { name: "Pantalla OLED Original Huawei", quality: "Original", price: 239, description: "Panel OLED 6.8\" original Huawei. 120Hz, alta fidelidad de color." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 159, description: "Panel OLED de alta calidad." },
        ],
      },
      {
        name: "P60 Pro",
        parts: [
          { name: "Pantalla OLED Quad-Curve Original", quality: "Original", price: 209, description: "Panel OLED curvo original Huawei. LTPO 120Hz." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 139, description: "Panel OLED de alta calidad." },
        ],
      },
      {
        name: "P50 Pro",
        parts: [
          { name: "Pantalla OLED Original Huawei", quality: "Original", price: 189, description: "Panel OLED original Huawei." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 129, description: "Panel OLED de alta calidad." },
        ],
      },
      {
        name: "Mate 50 Pro",
        parts: [
          { name: "Pantalla OLED Curvo Original Huawei", quality: "Original", price: 219, description: "Panel OLED curvo original." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 149, description: "Panel OLED de alta calidad." },
        ],
      },
      {
        name: "Nova 12 Pro",
        parts: [
          { name: "Pantalla OLED Original Huawei", quality: "Original", price: 159, description: "Panel OLED original Huawei." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 109, description: "Panel OLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 75, description: "Opción económica funcional." },
        ],
      },
    ],
  },
  {
    id: "oneplus",
    name: "OnePlus",
    shortName: "OnePlus",
    accentColor: "#F5010C",
    models: [
      {
        name: "OnePlus 12 Pro",
        parts: [
          { name: "Pantalla LTPO3 ProXDR Original", quality: "Original", price: 229, description: "Panel LTPO3 ProXDR AMOLED original. 120Hz, 2K+, 4500 nits." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 149, description: "Panel AMOLED de alta calidad." },
        ],
      },
      {
        name: "OnePlus 12",
        parts: [
          { name: "Pantalla LTPO AMOLED Original", quality: "Original", price: 199, description: "Panel LTPO 3.0 AMOLED original OnePlus." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 139, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 99, description: "Opción económica funcional." },
        ],
      },
      {
        name: "OnePlus 11",
        parts: [
          { name: "Pantalla LTPO2 AMOLED Original", quality: "Original", price: 179, description: "Panel LTPO2 AMOLED original OnePlus." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 119, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 85, description: "Opción económica funcional." },
        ],
      },
      {
        name: "OnePlus Nord 4",
        parts: [
          { name: "Pantalla AMOLED Original OnePlus", quality: "Original", price: 159, description: "Panel AMOLED 120Hz original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 109, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 79, description: "Opción económica funcional." },
        ],
      },
      {
        name: "OnePlus Nord CE 4",
        parts: [
          { name: "Pantalla AMOLED Original OnePlus", quality: "Original", price: 129, description: "Panel AMOLED original." },
          { name: "Pantalla AMOLED Premium", quality: "Premium", price: 89, description: "Panel AMOLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 65, description: "Opción económica funcional." },
        ],
      },
    ],
  },
  {
    id: "pixel",
    name: "Google Pixel",
    shortName: "Pixel",
    accentColor: "#4285F4",
    models: [
      {
        name: "Pixel 9 Pro XL",
        parts: [
          { name: "Pantalla LTPO OLED Super Actua Original", quality: "Original", price: 269, description: "Panel LTPO OLED Super Actua original Google. 120Hz, 3000 nits." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 179, description: "Panel OLED de alta calidad." },
        ],
      },
      {
        name: "Pixel 9 Pro",
        parts: [
          { name: "Pantalla OLED Super Actua Original", quality: "Original", price: 249, description: "Panel OLED Super Actua original Google." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 169, description: "Panel OLED de alta calidad." },
        ],
      },
      {
        name: "Pixel 9",
        parts: [
          { name: "Pantalla Actua OLED Original Google", quality: "Original", price: 219, description: "Panel Actua OLED original Google." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 149, description: "Panel OLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 109, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Pixel 8 Pro",
        parts: [
          { name: "Pantalla LTPO OLED Original Google", quality: "Original", price: 229, description: "Panel LTPO OLED original Google." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 149, description: "Panel OLED de alta calidad." },
        ],
      },
      {
        name: "Pixel 8",
        parts: [
          { name: "Pantalla Actua OLED Original Google", quality: "Original", price: 189, description: "Panel Actua OLED original." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 129, description: "Panel OLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 95, description: "Opción económica funcional." },
        ],
      },
      {
        name: "Pixel 7a",
        parts: [
          { name: "Pantalla OLED Original Google", quality: "Original", price: 149, description: "Panel OLED original Google." },
          { name: "Pantalla OLED Premium", quality: "Premium", price: 99, description: "Panel OLED de alta calidad." },
          { name: "Pantalla Compatible", quality: "Compatible", price: 69, description: "Opción económica funcional." },
        ],
      },
    ],
  },
];

// ─── Quality config ───────────────────────────────────────────────────────────
const qualityConfig: Record<Quality, { bg: string; text: string; borderColor: string; ringColor: string; label: string; blurb: string }> = {
  Original: {
    bg: "bg-[#CCFF00]",
    text: "text-black",
    borderColor: "#CCFF00",
    ringColor: "rgba(204,255,0,0.3)",
    label: "Original",
    blurb: "Pieza OEM del fabricante",
  },
  Premium: {
    bg: "bg-[#0038FF]",
    text: "text-white",
    borderColor: "#0038FF",
    ringColor: "rgba(0,56,255,0.2)",
    label: "Premium",
    blurb: "Alta calidad, equivalente a original",
  },
  Compatible: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    borderColor: "#e5e7eb",
    ringColor: "transparent",
    label: "Compatible",
    blurb: "Funcional, opción económica",
  },
};

// ─── Brand SVG logos ──────────────────────────────────────────────────────────
function AppleLogo() {
  return (
    <svg viewBox="0 0 814 1000" className="w-9 h-9" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-157.2-108.1c-44.4-62.4-83.1-158.2-83.1-248.1 0-182.9 119.8-279.7 237.9-279.7 79.3 0 145.1 52.2 194.9 52.2 47.2 0 121-55.5 213-55.5zM649.9 76.6c34.8-41.2 60.3-98.4 60.3-155.5 0-8.3-.7-16.6-1.9-24.2-57.1 2.2-124.3 38.5-164.9 85.7-32.2 36.7-62.2 93.8-62.2 152.8 0 9.9 1.6 19.7 2.2 23.1 3.2.6 8.3 1.3 13.4 1.3 51.3 0 113.5-34.2 153.1-83.2z" />
    </svg>
  );
}
function SamsungLogo() {
  return (
    <svg viewBox="0 0 100 30" className="w-20 h-7" fill="#1428A0">
      <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="26" letterSpacing="-1">SAMSUNG</text>
    </svg>
  );
}
function XiaomiLogo() {
  return (
    <svg viewBox="0 0 60 30" className="w-14 h-8" fill="#FF6900">
      <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="26">mi</text>
    </svg>
  );
}
function HuaweiLogo() {
  return (
    <svg viewBox="0 0 90 30" className="w-20 h-7" fill="#CF0A2C">
      <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" letterSpacing="-0.5">HUAWEI</text>
    </svg>
  );
}
function OnePlusLogo() {
  return (
    <svg viewBox="0 0 50 30" className="w-14 h-8" fill="#F5010C">
      <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="28">1+</text>
    </svg>
  );
}
function PixelLogo() {
  return (
    <svg viewBox="0 0 120 30" className="w-24 h-7">
      <text x="0" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#4285F4">G</text>
      <text x="24" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#EA4335">o</text>
      <text x="40" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#FBBC05">o</text>
      <text x="56" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#34A853">g</text>
      <text x="70" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#4285F4">l</text>
      <text x="79" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#EA4335">e</text>
    </svg>
  );
}

const brandLogo: Record<string, React.ReactNode> = {
  iphone: <AppleLogo />,
  samsung: <SamsungLogo />,
  xiaomi: <XiaomiLogo />,
  huawei: <HuaweiLogo />,
  oneplus: <OnePlusLogo />,
  pixel: <PixelLogo />,
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({
  step,
  brandName,
  modelName,
}: {
  step: number;
  brandName?: string;
  modelName?: string;
}) {
  const steps = [
    { n: 1, label: step >= 2 ? brandName ?? "Marca" : "Selecciona marca" },
    { n: 2, label: step >= 3 ? modelName ?? "Modelo" : "Selecciona modelo" },
    { n: 3, label: "Elige tu pantalla" },
  ];
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className={`flex items-center gap-1.5 transition-opacity ${step === s.n ? "opacity-100" : step > s.n ? "opacity-70" : "opacity-30"}`}>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                step > s.n
                  ? "bg-[#CCFF00] text-black"
                  : step === s.n
                  ? "bg-[#0038FF] text-white ring-4 ring-[#0038FF]/20"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {step > s.n ? (
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="currentColor">
                  <path d="M8.5 2L4 7 1.5 4.5l-.7.7L4 8.4 9.2 2.7z" />
                </svg>
              ) : (
                s.n
              )}
            </div>
            <span
              className={`text-xs font-bold ${
                step === s.n ? "text-[#0038FF]" : step > s.n ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`w-6 h-px mx-1 transition-colors ${step > i + 1 ? "bg-[#0038FF]" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Selector component ───────────────────────────────────────────────────────
function ScreenRepairSelector() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const step = selectedModel ? 3 : selectedBrand ? 2 : 1;

  function scrollToSection() {
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleBrandSelect(brand: Brand) {
    setSelectedBrand(brand);
    setSelectedModel(null);
    scrollToSection();
  }

  function handleModelSelect(model: PhoneModel) {
    setSelectedModel(model);
    scrollToSection();
  }

  function handleBack() {
    if (selectedModel) {
      setSelectedModel(null);
    } else {
      setSelectedBrand(null);
    }
    scrollToSection();
  }

  function handleAddCart(partName: string) {
    setCartFeedback(partName);
    setTimeout(() => setCartFeedback(null), 2200);
  }

  function buildWhatsApp(brand: Brand, model: PhoneModel, part: Part) {
    const msg = `Hola, me interesa la reparación de pantalla de mi ${model.name}.\nPieza: ${part.name} (${part.quality}) — $${part.price}\n¿Podéis indicarme disponibilidad y tiempo de entrega?`;
    return `https://wa.me/34600000000?text=${encodeURIComponent(msg)}`;
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-4 bg-white scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top bar: step indicator + back */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4 pb-8 border-b border-gray-100">
          <StepIndicator
            step={step}
            brandName={selectedBrand?.shortName}
            modelName={selectedModel?.name}
          />
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-[#0038FF] transition-colors uppercase tracking-wide"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M10 12L5.5 8 10 4l-.75-.75L4 8l5.25 4.75z" />
              </svg>
              Volver
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {/* ── PASO 1: MARCA ── */}
          {step === 1 && (
            <motion.div
              key="step-brands"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-10">
                <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Paso 1 de 3
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                  style={{ fontFamily: "var(--font-display, inherit)" }}
                >
                  ¿De qué marca es tu móvil?
                </h2>
                <p className="text-gray-400 mt-2 text-sm font-medium">
                  Selecciona la marca para ver los modelos disponibles
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {brands.map((brand, i) => (
                  <motion.button
                    key={brand.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => handleBrandSelect(brand)}
                    className="group relative bg-white rounded-2xl p-7 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,56,255,0.12)] hover:border-[#0038FF]/30 transition-all duration-300 text-left overflow-hidden cursor-pointer"
                    style={{ willChange: "transform" }}
                  >
                    {/* Hover color wash */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none"
                      style={{ backgroundColor: brand.accentColor }}
                    />
                    {/* Bottom accent bar */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none"
                      style={{ backgroundColor: brand.accentColor }}
                    />

                    <div className="relative z-10 flex flex-col gap-5">
                      {/* Logo */}
                      <div className="h-10 flex items-center">
                        <div className="group-hover:scale-105 transition-transform duration-300 origin-left">
                          {brandLogo[brand.id]}
                        </div>
                      </div>
                      {/* Info */}
                      <div>
                        <div className="font-black text-gray-900 text-base">{brand.shortName}</div>
                        <div className="text-xs text-gray-400 mt-1 font-semibold">
                          {brand.models.length} modelos disponibles
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-gray-50 group-hover:bg-[#0038FF] flex items-center justify-center transition-colors duration-300">
                      <svg
                        viewBox="0 0 16 16"
                        className="w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-colors"
                        fill="currentColor"
                      >
                        <path d="M5.5 12l4.5-4-4.5-4 .75-.75 5.25 4.75-5.25 4.75z" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PASO 2: MODELO ── */}
          {step === 2 && selectedBrand && (
            <motion.div
              key="step-models"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-10 flex items-start gap-4">
                <div>
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                    Paso 2 de 3
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                    style={{ fontFamily: "var(--font-display, inherit)" }}
                  >
                    Selecciona tu modelo
                  </h2>
                  <p className="text-gray-400 mt-2 text-sm font-medium">
                    {selectedBrand.name} — {selectedBrand.models.length} modelos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedBrand.models.map((model, i) => (
                  <motion.button
                    key={model.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    onClick={() => handleModelSelect(model)}
                    className="group flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:border-[#0038FF] hover:shadow-[0_4px_20px_rgba(0,56,255,0.1)] transition-all duration-200 text-left cursor-pointer"
                  >
                    <div>
                      <div className="font-black text-gray-900 group-hover:text-[#0038FF] transition-colors text-sm">
                        {model.name}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 font-semibold">
                        {model.parts.length} opciones de pantalla
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full border border-gray-100 group-hover:bg-[#0038FF] group-hover:border-[#0038FF] flex items-center justify-center transition-all duration-200 shrink-0">
                      <svg
                        viewBox="0 0 16 16"
                        className="w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-colors"
                        fill="currentColor"
                      >
                        <path d="M5.5 12l4.5-4-4.5-4 .75-.75 5.25 4.75-5.25 4.75z" />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PASO 3: PIEZAS ── */}
          {step === 3 && selectedBrand && selectedModel && (
            <motion.div
              key="step-parts"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="mb-10">
                <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Paso 3 de 3
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black text-gray-900 leading-tight"
                  style={{ fontFamily: "var(--font-display, inherit)" }}
                >
                  {selectedModel.name}
                </h2>
                <p className="text-gray-400 mt-2 text-sm font-medium">
                  Elige la calidad de pantalla que mejor se adapte a tus necesidades
                </p>
              </div>

              {/* Quality legend */}
              <div className="flex flex-wrap gap-3 mb-8">
                {(["Original", "Premium", "Compatible"] as Quality[]).map((q) => {
                  const cfg = qualityConfig[q];
                  return (
                    <div key={q} className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{cfg.blurb}</span>
                    </div>
                  );
                })}
              </div>

              {/* Part cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {selectedModel.parts.map((part, i) => {
                  const cfg = qualityConfig[part.quality];
                  const isAdded = cartFeedback === part.name;
                  return (
                    <motion.div
                      key={part.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="relative flex flex-col bg-white rounded-2xl overflow-hidden"
                      style={{
                        border: `2px solid ${cfg.borderColor}`,
                        boxShadow: `0 4px 24px ${cfg.ringColor}`,
                      }}
                    >
                      {/* Recommended ribbon */}
                      {part.quality === "Original" && (
                        <div className="absolute -top-px left-6">
                          <div className="bg-[#CCFF00] text-black text-[9px] font-black px-3 py-1 rounded-b-lg uppercase tracking-widest shadow-sm">
                            Recomendado
                          </div>
                        </div>
                      )}

                      <div className="p-6 flex flex-col gap-4 flex-1">
                        {/* Badge */}
                        <div className="pt-2">
                          <span className={`text-xs font-black px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </div>

                        {/* Name + description */}
                        <div className="flex-1">
                          <h3 className="font-black text-gray-900 text-base leading-snug mb-2">
                            {part.name}
                          </h3>
                          <p className="text-gray-500 text-xs leading-relaxed">{part.description}</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-4xl font-black text-gray-900 leading-none">${part.price}</span>
                          <span className="text-xs text-gray-400 font-semibold">mano de obra incluida</span>
                        </div>
                      </div>

                      {/* CTA footer */}
                      <div className="px-6 pb-6 flex flex-col gap-2 border-t border-gray-50 pt-4">
                        <button
                          onClick={() => handleAddCart(part.name)}
                          className={`w-full py-3 px-4 rounded-xl font-black text-sm transition-all duration-200 active:scale-95 ${
                            isAdded
                              ? "bg-[#CCFF00] text-black"
                              : "bg-[#0038FF] text-white hover:bg-[#0028CC]"
                          }`}
                        >
                          {isAdded ? "Añadido al carrito" : "Añadir al carrito"}
                        </button>
                        <a
                          href={buildWhatsApp(selectedBrand, selectedModel, part)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl font-black text-sm border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-200 active:scale-95 text-center flex items-center justify-center gap-2"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Pedir por WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Info strip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {[
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    title: "Garantía incluida",
                    desc: "Mínimo 90 días. De por vida en piezas Original.",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    ),
                    title: "Servicio en el mismo día",
                    desc: "La mayoría de reparaciones listas en menos de 90 minutos.",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M15 9l-6 6M9 9l6 6" />
                      </svg>
                    ),
                    title: "Sin coste si no reparamos",
                    desc: "Diagnóstico gratuito. Si no podemos, no cobras nada.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-gray-50 rounded-2xl p-5 flex items-start gap-4"
                  >
                    <div className="w-9 h-9 bg-[#0038FF]/10 rounded-xl flex items-center justify-center text-[#0038FF] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-black text-gray-900 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReparacionPantalla() {
  return (
    <main className="w-full">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="flex flex-col gap-1 md:gap-2">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                Movil Guru · Servicios
              </span>
            </motion.div>

            {/* Main title stack */}
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,11vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                textShadow:
                  "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99,8px 8px 0 #001A99",
              }}
            >
              REPARACIÓN
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,11vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 pl-[8%]"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                textShadow:
                  "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99,8px 8px 0 #001A99",
              }}
            >
              DE PANTALLA
            </motion.h1>
          </div>

          {/* Sub-row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6"
          >
            <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-md">
              Encuentra la pantalla exacta para tu dispositivo — original, premium o compatible, instalada ese mismo día.
            </p>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                Desde $45
              </div>
              <div className="border border-white/30 text-white/80 text-sm px-5 py-2 rounded-full font-semibold">
                6 marcas · 50+ modelos
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom curve into white */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── Selector ── */}
      <ScreenRepairSelector />

      <Footer />
    </main>
  );
}
