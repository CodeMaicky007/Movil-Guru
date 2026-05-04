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

// ─── Types ─────────────────────────────────────────────────────────────────────
type Quality = "Original" | "Premium" | "Compatible";

export type CategoryId =
  | "pantalla"
  | "bateria"
  | "carga"
  | "camara"
  | "agua"
  | "placa"
  | "altavoz"
  | "boton"
  | "plegables"
  | "recuperacion";

interface RepairOption {
  name: string;
  quality: Quality;
  price: number;
  time: string;
  warranty: string;
  description: string;
}

interface PhoneModel {
  name: string;
  repairs: Record<string, RepairOption[]>;
}

interface Brand {
  id: string;
  name: string;
  shortName: string;
  accentColor: string;
  logo: string;
  models: PhoneModel[];
}

export interface BookingWizardProps {
  categoryId?: CategoryId;
  preselectedBrandId?: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTag: string;
  heroBadges: { text: string; primary?: boolean }[];
  stepTitle?: string;
}

// ─── Repair categories for brand-first flow ─────────────────────────────────
const repairCategories: { id: CategoryId; label: string; description: string; svgPath: string; color: string }[] = [
  { id: "pantalla",    label: "Pantalla",             description: "Rota, táctil, OLED quemada, líneas, píxeles", svgPath: "M5 2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zm0 0v18", color: "#0038FF" },
  { id: "bateria",     label: "Batería",               description: "Sin autonomía, hinchada, apagados repentinos", svgPath: "M9 3h6v2H9V3zm-2 2h10a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm6 5v4H9v-4h4z", color: "#16A34A" },
  { id: "carga",       label: "Puerto de carga",       description: "No carga, USB-C, Lightning, carga lenta", svgPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", color: "#D97706" },
  { id: "camara",      label: "Cámara",                description: "Rota, borrosa, no enfoca, flash, periscópica", svgPath: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z", color: "#7C3AED" },
  { id: "altavoz",     label: "Sonido y audio",        description: "Altavoz, micrófono, jack, sin sonido", svgPath: "M11 5L6 9H2v6h4l5 4V5zm4.07-.07a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07", color: "#DC2626" },
  { id: "agua",        label: "Daño por agua",         description: "Humedad, oxidación, corrosión, líquidos", svgPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z", color: "#0891B2" },
  { id: "placa",       label: "Placa base",            description: "Microsoldadura, cortocircuito, chips dañados", svgPath: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18", color: "#B45309" },
  { id: "boton",       label: "Botones",               description: "Encendido, volumen, silencio, home, flex", svgPath: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-6a4 4 0 100-8 4 4 0 000 8z", color: "#059669" },
  { id: "plegables",   label: "Plegables",             description: "Pantalla interior flexible, bisagra, cover", svgPath: "M12 2H6a2 2 0 00-2 2v16a2 2 0 002 2h6m0-20h6a2 2 0 012 2v16a2 2 0 01-2 2h-6m0-20v20", color: "#6D28D9" },
  { id: "recuperacion",label: "Recuperación de datos", description: "Fotos, WhatsApp, contactos, iCloud, chip-off", svgPath: "M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7h16M7 7V5a1 1 0 011-1h8a1 1 0 011 1v2", color: "#0F766E" },
];

// ─── Detailed fault types (from PDF catalogue) ─────────────────────────────────
const faultTypes: Record<CategoryId, { label: string; price: string }[]> = {
  pantalla: [
    { label: "Pantalla rota o agrietada", price: "30€ – 250€" },
    { label: "Pantalla LCD fracturada",   price: "25€ – 180€" },
    { label: "OLED quemada",              price: "60€ – 350€" },
    { label: "Pantalla negra",            price: "30€ – 200€" },
    { label: "Píxeles muertos",           price: "40€ – 220€" },
    { label: "Líneas o rayas",            price: "35€ – 210€" },
    { label: "Táctil sin respuesta",      price: "30€ – 180€" },
    { label: "Toques fantasma",           price: "30€ – 170€" },
    { label: "Cristal exterior",          price: "20€ – 120€" },
    { label: "Flex / conector",           price: "25€ – 100€" },
    { label: "Chip backlight",            price: "40€ – 150€" },
    { label: "Chip táctil",              price: "40€ – 160€" },
  ],
  bateria: [
    { label: "Batería agotada",           price: "25€ – 120€" },
    { label: "Batería hinchada",          price: "30€ – 130€" },
    { label: "No carga",                  price: "25€ – 100€" },
    { label: "Descarga rápida",           price: "25€ – 120€" },
    { label: "Apagados repentinos",       price: "25€ – 120€" },
    { label: "Sobrecalentamiento",        price: "25€ – 130€" },
    { label: "Porcentaje incorrecto",     price: "25€ – 120€" },
  ],
  carga: [
    { label: "Puerto USB-C",              price: "25€ – 90€" },
    { label: "Puerto Micro-USB",          price: "20€ – 70€" },
    { label: "Puerto Lightning",          price: "30€ – 100€" },
    { label: "Puerto obstruido",          price: "10€ – 30€" },
    { label: "Carga inalámbrica Qi",      price: "40€ – 150€" },
    { label: "Chip IC de carga",          price: "50€ – 180€" },
    { label: "Chip gestión energía",      price: "60€ – 200€" },
    { label: "Carga lenta",              price: "20€ – 90€" },
  ],
  camara: [
    { label: "Cámara trasera rota",       price: "30€ – 200€" },
    { label: "Cámara delantera rota",     price: "20€ – 120€" },
    { label: "Cristal de cámara",         price: "15€ – 60€" },
    { label: "Polvo interno",             price: "25€ – 90€" },
    { label: "Sin enfocar",              price: "30€ – 150€" },
    { label: "No abre la app",            price: "15€ – 60€" },
    { label: "Cámara periscópica",        price: "60€ – 280€" },
    { label: "OIS dañado",               price: "40€ – 180€" },
    { label: "Flash LED",                 price: "20€ – 80€" },
    { label: "Sensor ToF / 3D",          price: "40€ – 160€" },
  ],
  altavoz: [
    { label: "Altavoz principal",         price: "20€ – 90€" },
    { label: "Auricular interno",         price: "20€ – 80€" },
    { label: "Micrófono principal",       price: "20€ – 80€" },
    { label: "Micrófono secundario",      price: "25€ – 90€" },
    { label: "Jack 3.5 mm",              price: "15€ – 60€" },
  ],
  agua: [
    { label: "Entrada de agua",           price: "40€ – 200€" },
    { label: "Humedad interna",           price: "35€ – 150€" },
    { label: "Oxidación",                 price: "50€ – 220€" },
    { label: "Corrosión de placa",        price: "60€ – 300€" },
    { label: "Sellado hermético",         price: "30€ – 100€" },
  ],
  placa: [
    { label: "Cortocircuito",             price: "60€ – 350€" },
    { label: "Placa quemada",             price: "80€ – 400€" },
    { label: "Daño por caída / golpe",    price: "60€ – 300€" },
    { label: "Microsoldadura",            price: "50€ – 200€" },
    { label: "CPU / SoC dañado",          price: "100€ – 500€" },
    { label: "RAM dañada",               price: "80€ – 350€" },
    { label: "eMMC / UFS dañado",        price: "80€ – 350€" },
    { label: "Baseband",                  price: "80€ – 300€" },
    { label: "Chip de audio",             price: "60€ – 250€" },
    { label: "Chip NFC",                  price: "50€ – 200€" },
  ],
  boton: [
    { label: "Botón de encendido",        price: "20€ – 80€" },
    { label: "Volumen +",                 price: "15€ – 70€" },
    { label: "Volumen –",                 price: "15€ – 70€" },
    { label: "Botón silencio",            price: "20€ – 80€" },
    { label: "Home físico",              price: "25€ – 100€" },
    { label: "Flex de botones",           price: "20€ – 80€" },
  ],
  plegables: [
    { label: "Pantalla interior OLED",    price: "129€ – 649€" },
    { label: "Cover display (exterior)",  price: "109€ – 259€" },
    { label: "Bisagra completa",          price: "149€ – 219€" },
  ],
  recuperacion: [
    { label: "Recuperación lógica",       price: "50€ – 300€" },
    { label: "Chip-off NAND / UFS",      price: "150€ – 400€" },
    { label: "Recuperación microSD",      price: "30€ – 150€" },
  ],
};

// ─── Quality config ────────────────────────────────────────────────────────────
const qualityConfig: Record<Quality, { bg: string; text: string; border: string; label: string }> = {
  Original:   { bg: "bg-[#CCFF00]",        text: "text-black",        border: "#CCFF00", label: "Original OEM" },
  Premium:    { bg: "bg-[#0038FF]",         text: "text-white",        border: "#0038FF", label: "Premium" },
  Compatible: { bg: "bg-[#0a0a0a]/10",      text: "text-[#0a0a0a]/70", border: "#e5e7eb", label: "Compatible" },
};

// ─── Time slots ────────────────────────────────────────────────────────────────
function getNextDays(count: number) {
  const days: { label: string; short: string; date: string; isToday: boolean }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dow = d.toLocaleDateString("es-ES", { weekday: "short" });
    const day = d.getDate();
    const month = d.toLocaleDateString("es-ES", { month: "short" });
    days.push({
      label: i === 0 ? "Hoy" : i === 1 ? "Mañana" : `${dow} ${day}`,
      short: `${day} ${month}`,
      date: d.toISOString().slice(0, 10),
      isToday: i === 0,
    });
  }
  return days;
}

const timeSlots = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","16:00","16:30","17:00",
  "17:30","18:00","18:30","19:00",
];

// ─── Repair data builder ────────────────────────────────────────────────────────
function makeRepairs(
  screenPrices: [number, number, number],
  batteryPrice: number,
  portPrice: number,
  cameraPrice: number,
  waterPrice: number,
  boardPrice: number,
  speakerPrice: number,
  buttonPrice: number,
  plegablesInner = 0,
  plegablesOuter = 0,
  plegablesHinge = 0,
  dataRecoveryPrice = 89
): Record<string, RepairOption[]> {
  return {
    pantalla: [
      { name: "Pantalla OLED Original", quality: "Original", price: screenPrices[0], time: "45–60 min", warranty: "De por vida", description: "Pieza OEM certificada del fabricante. Máxima calidad de color, brillo y respuesta táctil." },
      { name: "Pantalla OLED Premium",  quality: "Premium",  price: screenPrices[1], time: "45–60 min", warranty: "12 meses",    description: "Calidad equivalente a original. Colores precisos, tacto suave. Mejor relación calidad-precio." },
      ...(screenPrices[2] > 0 ? [{ name: "Pantalla Compatible", quality: "Compatible" as Quality, price: screenPrices[2], time: "30–45 min", warranty: "6 meses", description: "Opción económica funcional. Ideal para uso diario básico." }] : []),
    ],
    bateria: [
      { name: "Batería Original OEM", quality: "Original", price: batteryPrice,                    time: "20–30 min", warranty: "De por vida", description: "Batería certificada del fabricante. Capacidad y rendimiento idénticos al de fábrica." },
      { name: "Batería Premium",      quality: "Premium",  price: Math.round(batteryPrice * 0.75), time: "20–30 min", warranty: "12 meses",    description: "Alta capacidad certificada. Rendimiento equivalente a original." },
    ],
    carga: [
      { name: "Puerto de carga Original", quality: "Original", price: portPrice,                    time: "30–45 min", warranty: "De por vida", description: "Conector original del fabricante. Carga rápida garantizada." },
      { name: "Puerto de carga Premium",  quality: "Premium",  price: Math.round(portPrice * 0.7),  time: "30–45 min", warranty: "12 meses",    description: "Conector de alta calidad. Compatible con carga rápida." },
    ],
    camara: [
      { name: "Módulo de cámara Original", quality: "Original", price: cameraPrice,                    time: "30–45 min", warranty: "De por vida", description: "Módulo de cámara original. Misma calidad de imagen que de fábrica." },
      { name: "Módulo de cámara Premium",  quality: "Premium",  price: Math.round(cameraPrice * 0.7),  time: "30–45 min", warranty: "12 meses",    description: "Módulo compatible de alta resolución." },
    ],
    agua: [
      { name: "Tratamiento completo por daño de líquido", quality: "Premium", price: waterPrice, time: "2–4 horas", warranty: "90 días", description: "Limpieza ultrasónica de placa base, secado profesional, diagnóstico completo y sustitución de componentes afectados." },
    ],
    placa: [
      { name: "Microsoldadura / Reparación de placa", quality: "Premium", price: boardPrice, time: "2–6 horas", warranty: "90 días", description: "Diagnóstico a nivel de componente bajo microscopio. Reparación de ICs, reballing BGA y sustitución de chips dañados." },
    ],
    altavoz: [
      { name: "Altavoz / Micrófono Original", quality: "Original", price: speakerPrice,                    time: "20–30 min", warranty: "De por vida", description: "Módulo de audio original. Sonido idéntico al de fábrica." },
      { name: "Altavoz / Micrófono Premium",  quality: "Premium",  price: Math.round(speakerPrice * 0.7),  time: "20–30 min", warranty: "12 meses",    description: "Módulo de audio de alta calidad." },
    ],
    boton: [
      { name: "Reparación de botones", quality: "Premium", price: buttonPrice, time: "30–45 min", warranty: "12 meses", description: "Sustitución o reparación de botón de encendido, volumen o silencio." },
    ],
    plegables: [
      ...(plegablesInner > 0 ? [{ name: "Pantalla interior OLED flexible", quality: "Original" as Quality, price: plegablesInner, time: "75–90 min", warranty: "12 meses", description: "Panel OLED flexible completo con film de pliegue. Proceso en condiciones controladas con técnico certificado." }] : []),
      ...(plegablesOuter > 0 ? [{ name: "Pantalla exterior (cover display)", quality: "Premium" as Quality, price: plegablesOuter, time: "40–50 min", warranty: "12 meses", description: "Panel de cobertura independiente. No requiere tocar el OLED interior ni la bisagra." }] : []),
      ...(plegablesHinge > 0 ? [{ name: "Bisagra completa", quality: "Premium" as Quality, price: plegablesHinge, time: "65–75 min", warranty: "12 meses", description: "Sustitución del mecanismo de bisagra con calibración de ángulo de cierre y test de ciclos." }] : []),
    ],
    recuperacion: [
      { name: "Recuperación lógica de datos", quality: "Premium", price: dataRecoveryPrice, time: "4–8 horas", warranty: "Sin datos = sin coste", description: "Fotos, mensajes, WhatsApp, contactos y documentos. Si no recuperamos nada, no cobras." },
      { name: "Recuperación chip-off (NAND/UFS)", quality: "Original", price: Math.round(dataRecoveryPrice * 2.2), time: "24–72 horas", warranty: "Diagnóstico previo", description: "Para dispositivos completamente muertos. Extracción física del chip de almacenamiento y lectura directa." },
    ],
  };
}

// ─── Repair tier presets (shared across similar models) ────────────────────────
const RP = {
  // iPhone
  IP_MAX: makeRepairs([349,229,159], 79, 89, 149, 89, 199, 59, 49),
  IP_PRO: makeRepairs([319,209,149], 79, 89, 139, 89, 189, 55, 45),
  IP_STD: makeRepairs([269,179,119], 69, 79, 119, 79, 179, 49, 39),
  IP_MID: makeRepairs([229,149, 99], 59, 69, 109, 75, 169, 45, 35),
  IP_OLD: makeRepairs([179,119, 79], 49, 49,  89, 65, 149, 35, 25),
  IP_VLD: makeRepairs([119, 79, 55], 39, 39,  69, 55, 129, 25, 19),
  IP_LEG: makeRepairs([ 89, 65, 45], 35, 35,  59, 49, 119, 22, 19),
  // Samsung
  SA_P:   makeRepairs([329,219,149], 79, 79, 149,  99, 219, 59, 49),
  SA_M:   makeRepairs([199,149,109], 65, 59, 109,  79, 179, 45, 38),
  SA_B:   makeRepairs([129, 89, 65], 45, 45,  69,  59, 139, 29, 22),
  SA_VB:  makeRepairs([109, 75, 55], 39, 39,  59,  49, 119, 25, 19),
  SA_EB:  makeRepairs([ 89, 65, 45], 35, 35,  49,  45,  99, 22, 16),
  // Xiaomi
  XI_P:   makeRepairs([249,169,119], 59, 49, 119, 79, 179, 45, 35),
  XI_M:   makeRepairs([149, 99, 69], 45, 35,  69, 55, 139, 29, 22),
  XI_B:   makeRepairs([ 89, 65, 45], 35, 29,  49, 45, 109, 22, 15),
  XI_EB:  makeRepairs([ 69, 49, 35], 29, 25,  39, 39,  89, 18, 12),
  // Huawei
  HW_P:   makeRepairs([289,189,139], 69, 69, 139, 89, 199, 49, 39),
  HW_M:   makeRepairs([189,129, 95], 55, 55, 109, 79, 169, 39, 29),
  HW_B:   makeRepairs([129, 89, 65], 45, 39,  79, 59, 139, 29, 22),
  // LG
  LG_P:   makeRepairs([179,129, 89], 59, 49,  99, 69, 149, 39, 29),
  LG_M:   makeRepairs([139,109, 79], 52, 42,  85, 62, 135, 33, 25),
  LG_B:   makeRepairs([109, 79, 59], 45, 35,  69, 55, 119, 29, 22),
  // Sony
  SO_P:   makeRepairs([229,159,  0], 69, 59, 119, 79, 169, 45, 35),
  SO_M:   makeRepairs([179,129,  0], 62, 52, 104, 72, 149, 40, 30),
  SO_B:   makeRepairs([149,109,  0], 55, 45,  89, 65, 139, 35, 29),
  // Vivo
  VI_P:   makeRepairs([219,149,109], 65, 55, 109, 75, 159, 42, 32),
  VI_M:   makeRepairs([159,109, 85], 55, 45,  89, 62, 139, 35, 27),
  VI_B:   makeRepairs([119, 89, 65], 49, 39,  79, 59, 129, 32, 25),
  // Nokia
  NO_M:   makeRepairs([129, 95, 69], 49, 39,  79, 59, 129, 32, 25),
  NO_B:   makeRepairs([109, 79, 59], 45, 35,  69, 55, 119, 29, 22),
  NO_VB:  makeRepairs([ 79, 59, 45], 39, 29,  59, 45,  99, 25, 18),
  // BQ
  BQ_M:   makeRepairs([ 99, 75, 55], 45, 35,  69, 55, 119, 29, 22),
  BQ_B:   makeRepairs([ 79, 59, 42], 39, 29,  59, 45,  99, 25, 18),
  // HTC
  HT_P:   makeRepairs([159,119, 85], 55, 49,  89, 65, 139, 35, 25),
  HT_M:   makeRepairs([129, 95, 69], 49, 39,  79, 59, 129, 32, 25),
  HT_B:   makeRepairs([ 99, 75, 55], 45, 35,  69, 55, 119, 29, 22),
  // Meizu
  MZ_P:   makeRepairs([199,139, 99], 65, 55, 109, 75, 159, 42, 32),
  MZ_M:   makeRepairs([169,119, 89], 59, 49,  99, 69, 149, 39, 29),
  MZ_B:   makeRepairs([139, 99, 75], 52, 42,  85, 62, 135, 33, 25),
  // Asus
  AS_P:   makeRepairs([289,199,149], 79, 69, 139, 89, 189, 55, 45),
  AS_M:   makeRepairs([219,149,109], 65, 55, 109, 75, 159, 42, 32),
  AS_B:   makeRepairs([179,129, 99], 59, 49,  99, 69, 149, 39, 29),
};

// ─── Brands & models ────────────────────────────────────────────────────────────
const brands: Brand[] = [
  {
    id: "iphone", name: "Apple iPhone", shortName: "iPhone", accentColor: "#1d1d1f", logo: "/images/Apple.png",
    models: [
      { name: "iPhone 16 Pro Max",  repairs: RP.IP_MAX },
      { name: "iPhone 16 Pro",      repairs: RP.IP_PRO },
      { name: "iPhone 16 Plus",     repairs: RP.IP_STD },
      { name: "iPhone 16",          repairs: RP.IP_STD },
      { name: "iPhone 15 Pro Max",  repairs: makeRepairs([299,189,139], 69, 79, 139, 85, 189, 55, 45) },
      { name: "iPhone 15 Pro",      repairs: makeRepairs([269,169,119], 69, 75, 129, 85, 179, 49, 39) },
      { name: "iPhone 15 Plus",     repairs: RP.IP_MID },
      { name: "iPhone 15",          repairs: RP.IP_MID },
      { name: "iPhone 14 Pro Max",  repairs: makeRepairs([259,169,119], 59, 69, 129, 79, 179, 49, 39) },
      { name: "iPhone 14 Pro",      repairs: makeRepairs([239,159,109], 59, 65, 119, 79, 169, 45, 35) },
      { name: "iPhone 14 Plus",     repairs: makeRepairs([199,139, 95], 49, 59,  99, 69, 159, 39, 29) },
      { name: "iPhone 14",          repairs: makeRepairs([199,139, 95], 49, 59,  99, 69, 159, 39, 29) },
      { name: "iPhone 13 Pro Max",  repairs: makeRepairs([219,149,105], 55, 59, 109, 72, 165, 42, 32) },
      { name: "iPhone 13 Pro",      repairs: makeRepairs([199,135, 95], 52, 55, 105, 69, 159, 39, 29) },
      { name: "iPhone 13",          repairs: RP.IP_OLD },
      { name: "iPhone 13 mini",     repairs: makeRepairs([169,109, 75], 45, 45,  85, 62, 145, 32, 22) },
      { name: "iPhone 12 Pro Max",  repairs: makeRepairs([179,119, 79], 49, 49,  89, 65, 149, 35, 25) },
      { name: "iPhone 12 Pro",      repairs: makeRepairs([169,114, 75], 47, 47,  85, 62, 145, 32, 22) },
      { name: "iPhone 12",          repairs: makeRepairs([159,109, 69], 45, 45,  79, 59, 139, 29, 25) },
      { name: "iPhone 12 mini",     repairs: makeRepairs([149,104, 65], 42, 42,  75, 55, 135, 27, 22) },
      { name: "iPhone 11 Pro Max",  repairs: makeRepairs([139, 95, 65], 42, 42,  75, 58, 135, 27, 22) },
      { name: "iPhone 11 Pro",      repairs: makeRepairs([129, 89, 59], 40, 40,  72, 56, 132, 26, 20) },
      { name: "iPhone 11",          repairs: RP.IP_VLD },
      { name: "iPhone XS Max",      repairs: makeRepairs([109, 75, 49], 37, 37,  65, 52, 125, 24, 18) },
      { name: "iPhone XS",          repairs: makeRepairs([105, 72, 47], 35, 35,  62, 50, 122, 23, 17) },
      { name: "iPhone XR",          repairs: makeRepairs([ 99, 69, 45], 35, 35,  60, 48, 118, 22, 17) },
      { name: "iPhone X",           repairs: makeRepairs([ 95, 65, 42], 35, 35,  58, 46, 115, 22, 16) },
      { name: "iPhone SE (3ª gen)", repairs: RP.IP_LEG },
      { name: "iPhone SE (2ª gen)", repairs: makeRepairs([ 85, 62, 42], 33, 33,  56, 46, 112, 21, 16) },
      { name: "iPhone 8 Plus",      repairs: makeRepairs([ 79, 58, 39], 32, 32,  54, 44, 109, 20, 15) },
      { name: "iPhone 8",           repairs: makeRepairs([ 75, 55, 37], 30, 30,  52, 42, 105, 19, 14) },
    ],
  },
  {
    id: "samsung", name: "Samsung Galaxy", shortName: "Samsung", accentColor: "#1428A0", logo: "/images/Samsung.png",
    models: [
      { name: "Galaxy S25 Ultra",   repairs: makeRepairs([349,229,159], 85, 85, 159, 105, 229, 62, 52) },
      { name: "Galaxy S25+",        repairs: makeRepairs([299,199,139], 75, 75, 139,  95, 209, 52, 42) },
      { name: "Galaxy S25",         repairs: makeRepairs([269,169,129], 65, 65, 119,  85, 189, 48, 38) },
      { name: "Galaxy S24 Ultra",   repairs: RP.SA_P },
      { name: "Galaxy S24+",        repairs: makeRepairs([279,179,129], 69, 69, 129,  89, 199, 49, 39) },
      { name: "Galaxy S24",         repairs: makeRepairs([249,159,119], 59, 59, 109,  79, 179, 45, 35) },
      { name: "Galaxy S24 FE",      repairs: makeRepairs([199,139, 99], 55, 55,  99,  75, 169, 39, 29) },
      { name: "Galaxy Z Fold6",     repairs: makeRepairs([329,  0,  0], 89, 89, 159, 119, 259, 59, 49, 649, 249, 199) },
      { name: "Galaxy Z Fold5",     repairs: makeRepairs([  0,  0,  0], 89, 89, 159, 119, 259, 59, 49, 599, 219, 189) },
      { name: "Galaxy Z Fold4",     repairs: makeRepairs([  0,  0,  0], 85, 85, 149, 109, 249, 55, 45, 549, 199, 179) },
      { name: "Galaxy Z Fold3",     repairs: makeRepairs([  0,  0,  0], 79, 79, 139,  99, 229, 49, 39, 499, 179, 169) },
      { name: "Galaxy Z Flip6",     repairs: makeRepairs([  0,  0,  0], 79, 79, 129, 109, 239, 55, 45, 449, 149, 179) },
      { name: "Galaxy Z Flip5",     repairs: makeRepairs([  0,  0,  0], 79, 79, 129, 109, 239, 55, 45, 399, 129, 169) },
      { name: "Galaxy Z Flip4",     repairs: makeRepairs([  0,  0,  0], 75, 75, 119, 105, 229, 52, 42, 369, 119, 159) },
      { name: "Galaxy Z Flip3",     repairs: makeRepairs([  0,  0,  0], 72, 72, 115, 99,  219, 49, 39, 349, 109, 149) },
      { name: "Galaxy S23 Ultra",   repairs: makeRepairs([299,199,139], 69, 69, 139,  89, 199, 49, 39) },
      { name: "Galaxy S23+",        repairs: makeRepairs([249,159,119], 59, 59, 119,  79, 179, 45, 35) },
      { name: "Galaxy S23",         repairs: makeRepairs([199,139, 99], 55, 55,  99,  75, 169, 39, 29) },
      { name: "Galaxy S23 FE",      repairs: RP.SA_M },
      { name: "Galaxy S22 Ultra",   repairs: makeRepairs([279,185,129], 65, 65, 129,  85, 189, 45, 35) },
      { name: "Galaxy S22+",        repairs: makeRepairs([229,149,109], 59, 59, 109,  79, 175, 41, 31) },
      { name: "Galaxy S22",         repairs: makeRepairs([189,129, 95], 52, 52,  95,  72, 165, 37, 27) },
      { name: "Galaxy S21 Ultra",   repairs: makeRepairs([259,175,119], 62, 62, 119,  82, 185, 43, 33) },
      { name: "Galaxy S21+",        repairs: makeRepairs([209,145,105], 57, 57, 105,  76, 170, 39, 29) },
      { name: "Galaxy S21",         repairs: makeRepairs([175,119, 89], 50, 50,  89,  69, 159, 35, 25) },
      { name: "Galaxy S21 FE",      repairs: RP.SA_M },
      { name: "Galaxy S20 Ultra",   repairs: makeRepairs([249,165,119], 59, 59, 119,  79, 179, 43, 33) },
      { name: "Galaxy S20+",        repairs: makeRepairs([199,135, 99], 52, 52,  99,  72, 165, 38, 28) },
      { name: "Galaxy S20",         repairs: makeRepairs([169,115, 85], 48, 48,  85,  65, 155, 34, 24) },
      { name: "Galaxy S20 FE",      repairs: RP.SA_B },
      { name: "Galaxy A55",         repairs: makeRepairs([149,105, 75], 48, 48,  79,  62, 145, 32, 24) },
      { name: "Galaxy A54",         repairs: RP.SA_B },
      { name: "Galaxy A53",         repairs: makeRepairs([129, 89, 65], 45, 45,  69,  59, 139, 29, 22) },
      { name: "Galaxy A35",         repairs: makeRepairs([129, 89, 65], 43, 43,  69,  57, 135, 28, 21) },
      { name: "Galaxy A34",         repairs: RP.SA_VB },
      { name: "Galaxy A33",         repairs: makeRepairs([109, 75, 55], 39, 39,  59,  49, 119, 25, 19) },
      { name: "Galaxy A25",         repairs: makeRepairs([109, 75, 55], 38, 38,  57,  47, 115, 24, 18) },
      { name: "Galaxy A23",         repairs: RP.SA_VB },
      { name: "Galaxy A15",         repairs: makeRepairs([ 95, 65, 49], 35, 35,  52,  44, 105, 22, 16) },
      { name: "Galaxy A14",         repairs: RP.SA_VB },
      { name: "Galaxy A13",         repairs: makeRepairs([ 89, 62, 45], 34, 34,  50,  42, 102, 21, 15) },
      { name: "Galaxy A12",         repairs: RP.SA_EB },
      { name: "Galaxy A52s 5G",     repairs: makeRepairs([129, 89, 65], 45, 45,  69,  59, 139, 29, 22) },
      { name: "Galaxy A52",         repairs: RP.SA_B },
      { name: "Galaxy A72",         repairs: makeRepairs([139, 97, 69], 46, 46,  72,  60, 142, 30, 23) },
      { name: "Galaxy A32",         repairs: RP.SA_VB },
      { name: "Galaxy A22",         repairs: makeRepairs([ 99, 69, 49], 37, 37,  55,  46, 110, 23, 17) },
      { name: "Galaxy M55",         repairs: makeRepairs([145,102, 74], 47, 47,  77,  61, 143, 31, 23) },
      { name: "Galaxy M35",         repairs: makeRepairs([119, 85, 62], 43, 43,  65,  55, 129, 27, 20) },
      { name: "Galaxy M23",         repairs: RP.SA_VB },
    ],
  },
  {
    id: "xiaomi", name: "Xiaomi", shortName: "Xiaomi", accentColor: "#FF6900", logo: "/images/Xiaomi.png",
    models: [
      { name: "Xiaomi 15 Ultra",       repairs: makeRepairs([269,179,129], 65, 55, 129, 85, 189, 48, 38) },
      { name: "Xiaomi 15 Pro",         repairs: makeRepairs([249,169,119], 62, 52, 119, 82, 185, 46, 36) },
      { name: "Xiaomi 15",             repairs: makeRepairs([229,159,109], 59, 49, 109, 78, 179, 44, 34) },
      { name: "Xiaomi 14 Ultra",       repairs: RP.XI_P },
      { name: "Xiaomi 14 Pro",         repairs: makeRepairs([219,149, 99], 55, 45,  99, 69, 169, 39, 29) },
      { name: "Xiaomi 14",             repairs: makeRepairs([199,139, 99], 52, 42,  95, 65, 159, 37, 27) },
      { name: "Xiaomi 13 Ultra",       repairs: makeRepairs([239,159,115], 57, 47, 115, 77, 175, 43, 33) },
      { name: "Xiaomi 13 Pro",         repairs: makeRepairs([219,149, 99], 55, 45,  99, 69, 169, 39, 29) },
      { name: "Xiaomi 13T Pro",        repairs: makeRepairs([189,129, 89], 49, 39,  89, 65, 159, 35, 25) },
      { name: "Xiaomi 13T",            repairs: makeRepairs([149, 99, 69], 45, 35,  69, 55, 139, 29, 22) },
      { name: "Xiaomi 13",             repairs: makeRepairs([179,122, 85], 48, 38,  85, 62, 155, 36, 26) },
      { name: "Xiaomi 12T Pro",        repairs: makeRepairs([169,119, 85], 47, 37,  79, 59, 149, 33, 23) },
      { name: "Xiaomi 12T",            repairs: makeRepairs([149, 99, 69], 44, 34,  69, 55, 139, 29, 22) },
      { name: "Xiaomi 12 Pro",         repairs: makeRepairs([189,129, 89], 49, 39,  89, 65, 159, 35, 25) },
      { name: "Xiaomi 12",             repairs: makeRepairs([159,109, 75], 44, 34,  75, 57, 145, 31, 23) },
      { name: "Xiaomi 11T Pro",        repairs: makeRepairs([169,119, 85], 47, 37,  79, 59, 149, 33, 23) },
      { name: "Xiaomi 11T",            repairs: makeRepairs([145, 99, 69], 43, 33,  69, 55, 139, 29, 22) },
      { name: "Xiaomi 11",             repairs: makeRepairs([159,109, 75], 44, 34,  75, 57, 145, 31, 23) },
      { name: "MIX Fold 3",            repairs: makeRepairs([  0,  0,  0], 75, 65, 139, 95, 209, 55, 45, 569, 229, 189) },
      { name: "Redmi Note 13 Pro+",    repairs: makeRepairs([109, 79, 55], 39, 35,  59, 49, 119, 25, 19) },
      { name: "Redmi Note 13 Pro",     repairs: makeRepairs([105, 75, 52], 38, 34,  57, 47, 115, 24, 18) },
      { name: "Redmi Note 13",         repairs: makeRepairs([ 79, 55, 39], 35, 29,  49, 45, 109, 22, 15) },
      { name: "Redmi Note 12 Pro+",    repairs: makeRepairs([109, 79, 55], 39, 35,  59, 49, 119, 25, 19) },
      { name: "Redmi Note 12 Pro",     repairs: makeRepairs([ 99, 72, 49], 37, 33,  55, 46, 113, 23, 17) },
      { name: "Redmi Note 12",         repairs: makeRepairs([ 79, 55, 39], 34, 28,  47, 43, 107, 21, 14) },
      { name: "Redmi Note 12S",        repairs: makeRepairs([ 85, 59, 42], 35, 29,  49, 45, 109, 22, 15) },
      { name: "Redmi Note 11 Pro",     repairs: makeRepairs([ 89, 65, 45], 35, 29,  49, 45, 109, 22, 15) },
      { name: "Redmi Note 11S",        repairs: makeRepairs([ 79, 55, 38], 33, 27,  45, 42, 105, 20, 14) },
      { name: "Redmi Note 11",         repairs: RP.XI_B },
      { name: "Redmi Note 10 Pro",     repairs: makeRepairs([ 85, 59, 42], 35, 29,  49, 45, 109, 22, 15) },
      { name: "Redmi Note 10S",        repairs: RP.XI_B },
      { name: "Redmi Note 10",         repairs: makeRepairs([ 75, 52, 37], 32, 26,  43, 40, 102, 19, 13) },
      { name: "Redmi Note 9 Pro",      repairs: makeRepairs([ 79, 55, 39], 33, 27,  45, 42, 105, 20, 14) },
      { name: "Redmi Note 9S",         repairs: RP.XI_B },
      { name: "Redmi Note 9",          repairs: makeRepairs([ 69, 49, 34], 29, 24,  39, 38,  98, 17, 12) },
      { name: "Redmi Note 8 Pro",      repairs: makeRepairs([ 75, 52, 37], 31, 25,  43, 40, 100, 19, 13) },
      { name: "Redmi Note 8",          repairs: RP.XI_EB },
      { name: "Redmi 13",              repairs: makeRepairs([ 75, 52, 37], 32, 26,  43, 40, 100, 19, 13) },
      { name: "Redmi 12",              repairs: RP.XI_B },
      { name: "Redmi 12C",             repairs: makeRepairs([ 69, 48, 33], 29, 23,  38, 37,  96, 17, 12) },
      { name: "Redmi 10C",             repairs: RP.XI_EB },
      { name: "Redmi 9T",              repairs: RP.XI_EB },
      { name: "Redmi 9",               repairs: makeRepairs([ 65, 45, 32], 27, 21,  35, 35,  92, 16, 11) },
      { name: "Redmi A3",              repairs: makeRepairs([ 62, 43, 30], 26, 20,  33, 33,  89, 15, 10) },
      { name: "Redmi A2",              repairs: RP.XI_EB },
      { name: "POCO F5 Pro",           repairs: makeRepairs([169,119, 85], 49, 39,  79, 59, 149, 29, 25) },
      { name: "POCO F5",               repairs: makeRepairs([155,109, 75], 46, 36,  75, 56, 143, 27, 22) },
      { name: "POCO F4 GT",            repairs: makeRepairs([165,115, 82], 48, 38,  78, 58, 147, 28, 23) },
      { name: "POCO F4",               repairs: makeRepairs([149, 99, 69], 44, 34,  69, 54, 138, 28, 22) },
      { name: "POCO F3",               repairs: makeRepairs([139, 95, 65], 42, 32,  65, 52, 133, 27, 21) },
      { name: "POCO X6 Pro",           repairs: makeRepairs([149, 99, 69], 44, 34,  69, 54, 138, 28, 22) },
      { name: "POCO X6",               repairs: makeRepairs([129, 89, 62], 41, 31,  62, 50, 128, 26, 20) },
      { name: "POCO X5 Pro",           repairs: makeRepairs([119, 85, 59], 39, 29,  59, 47, 121, 24, 18) },
      { name: "POCO X5",               repairs: RP.XI_B },
      { name: "POCO X4 Pro",           repairs: makeRepairs([109, 79, 55], 38, 28,  55, 45, 116, 23, 17) },
      { name: "POCO X4 GT",            repairs: makeRepairs([105, 76, 53], 37, 27,  53, 44, 113, 22, 16) },
      { name: "POCO M5s",              repairs: makeRepairs([ 89, 65, 45], 35, 25,  49, 43, 109, 21, 15) },
      { name: "POCO M5",               repairs: RP.XI_B },
      { name: "POCO M4 Pro",           repairs: makeRepairs([ 95, 69, 47], 36, 26,  51, 44, 111, 22, 16) },
      { name: "POCO M3",               repairs: RP.XI_EB },
    ],
  },
  {
    id: "pixel", name: "Google Pixel", shortName: "Pixel", accentColor: "#4285F4", logo: "/images/GooglePixel.png",
    models: [
      { name: "Pixel 9 Pro Fold",  repairs: makeRepairs([  0,  0,  0], 69, 69, 129,  89, 189, 45, 35, 679, 259, 199) },
      { name: "Pixel 9 Pro XL",    repairs: makeRepairs([269,179,129], 69, 69, 129,  89, 189, 45, 35) },
      { name: "Pixel 9 Pro",       repairs: makeRepairs([249,169,119], 65, 59, 119,  85, 179, 39, 29) },
      { name: "Pixel 9",           repairs: makeRepairs([219,149,109], 59, 49, 109,  75, 169, 35, 25) },
      { name: "Pixel 8 Pro",       repairs: makeRepairs([229,149,  0], 59, 55, 109,  79, 169, 35, 29) },
      { name: "Pixel 8",           repairs: makeRepairs([189,129, 95], 55, 45,  89,  69, 149, 29, 22) },
      { name: "Pixel 8a",          repairs: makeRepairs([159,109, 75], 48, 38,  75,  60, 139, 27, 20) },
      { name: "Pixel 7a",          repairs: makeRepairs([149, 99, 69], 45, 39,  69,  55, 129, 25, 19) },
      { name: "Pixel 7 Pro",       repairs: makeRepairs([199,135, 99], 52, 45,  99,  69, 155, 31, 23) },
      { name: "Pixel 7",           repairs: makeRepairs([169,115, 85], 47, 40,  85,  62, 145, 27, 20) },
      { name: "Pixel 6 Pro",       repairs: makeRepairs([179,122, 89], 49, 42,  89,  64, 149, 29, 22) },
      { name: "Pixel 6a",          repairs: makeRepairs([139, 95, 67], 43, 36,  67,  55, 129, 25, 18) },
      { name: "Pixel 6",           repairs: makeRepairs([155,105, 77], 45, 38,  77,  58, 135, 26, 19) },
    ],
  },
  {
    id: "oneplus", name: "OnePlus", shortName: "OnePlus", accentColor: "#F5010C", logo: "/images/oneplus.png",
    models: [
      { name: "OnePlus Open",        repairs: makeRepairs([  0,  0,  0], 65, 55, 119, 75, 179, 39, 29, 549, 199, 189) },
      { name: "OnePlus 13",          repairs: makeRepairs([249,165, 115], 67, 57, 125, 79, 185, 42, 32) },
      { name: "OnePlus 12R",         repairs: makeRepairs([199,135,  95], 57, 47, 105, 69, 165, 36, 26) },
      { name: "OnePlus 12",          repairs: makeRepairs([229,149, 99], 65, 55, 119, 75, 179, 39, 29) },
      { name: "OnePlus 11",          repairs: makeRepairs([199,119, 85], 55, 49,  99, 69, 159, 35, 25) },
      { name: "OnePlus Nord 4",      repairs: makeRepairs([159,109, 79], 45, 39,  69, 55, 139, 29, 22) },
      { name: "OnePlus Nord CE 4",   repairs: makeRepairs([129, 89, 65], 39, 35,  55, 49, 119, 25, 19) },
      { name: "OnePlus Nord 3",      repairs: makeRepairs([149, 99, 69], 43, 37,  65, 52, 132, 27, 20) },
      { name: "OnePlus Nord CE 3",   repairs: makeRepairs([119, 83, 59], 37, 33,  51, 46, 115, 23, 17) },
      { name: "OnePlus 10 Pro",      repairs: makeRepairs([189,129, 89], 53, 47,  89, 65, 155, 33, 24) },
      { name: "OnePlus 10T",         repairs: makeRepairs([169,115, 79], 47, 41,  79, 59, 145, 29, 22) },
      { name: "OnePlus 9 Pro",       repairs: makeRepairs([179,122, 85], 50, 44,  85, 62, 149, 31, 23) },
      { name: "OnePlus 9",           repairs: makeRepairs([155,105, 73], 44, 38,  73, 55, 139, 27, 20) },
    ],
  },
  {
    id: "huawei", name: "Huawei", shortName: "Huawei", accentColor: "#CF0A2C", logo: "/images/huawei.png",
    models: [
      { name: "Pura 70 Pro+",        repairs: makeRepairs([299,199,145], 72, 72, 145, 92, 209, 52, 42) },
      { name: "Pura 70 Pro",         repairs: makeRepairs([279,185,135], 70, 70, 135, 89, 199, 49, 39) },
      { name: "Pura 70",             repairs: makeRepairs([239,159,115], 64, 64, 115, 82, 185, 44, 34) },
      { name: "Mate X5 (plegable)",  repairs: makeRepairs([  0,  0,  0], 69, 69, 139, 89, 199, 49, 39, 599,   0, 199) },
      { name: "Mate 60 Pro",         repairs: makeRepairs([309,205,149], 74, 74, 149, 95, 215, 54, 44) },
      { name: "Mate 60",             repairs: makeRepairs([269,179,129], 68, 68, 129, 87, 195, 48, 38) },
      { name: "P60 Pro",             repairs: makeRepairs([269,179,129], 69, 59, 129, 85, 189, 45, 35) },
      { name: "P60 Art",             repairs: makeRepairs([289,189,139], 70, 70, 139, 89, 199, 49, 39) },
      { name: "Mate 50 Pro",         repairs: RP.HW_P },
      { name: "Mate 40 Pro",         repairs: makeRepairs([259,172,125], 65, 65, 125, 83, 187, 46, 36) },
      { name: "P50 Pocket (pleg.)",  repairs: makeRepairs([  0,  0,  0], 65, 65, 115, 79, 175, 43, 33, 459, 159, 159) },
      { name: "P50 Pro",             repairs: RP.HW_M },
      { name: "P40 Pro+",            repairs: makeRepairs([249,165,119], 61, 61, 119, 80, 179, 44, 34) },
      { name: "P40 Pro",             repairs: makeRepairs([229,152,109], 57, 57, 109, 77, 172, 41, 31) },
      { name: "P40",                 repairs: makeRepairs([199,132, 95], 52, 52,  95, 70, 159, 37, 27) },
      { name: "P30 Pro",             repairs: makeRepairs([179,119, 85], 49, 49,  85, 64, 149, 34, 24) },
      { name: "P30",                 repairs: makeRepairs([149, 99, 71], 44, 44,  71, 57, 135, 30, 22) },
      { name: "Nova 12 Pro",         repairs: makeRepairs([159,109, 75], 45, 39,  79, 59, 139, 29, 22) },
      { name: "Nova 12",             repairs: makeRepairs([139, 95, 67], 42, 36,  67, 55, 129, 27, 20) },
      { name: "Nova 11 Pro",         repairs: makeRepairs([149,101, 71], 44, 38,  71, 56, 132, 28, 21) },
      { name: "Nova 11",             repairs: RP.HW_B },
      { name: "Nova 10 Pro",         repairs: makeRepairs([139, 95, 67], 42, 36,  67, 54, 129, 27, 20) },
      { name: "Nova 10",             repairs: makeRepairs([129, 89, 62], 40, 34,  62, 51, 122, 25, 19) },
      { name: "Nova 9 Pro",          repairs: makeRepairs([135, 92, 65], 41, 35,  65, 52, 125, 26, 20) },
      { name: "Nova 9",              repairs: RP.HW_B },
      { name: "Y90",                 repairs: makeRepairs([115, 79, 55], 38, 32,  55, 47, 109, 23, 17) },
      { name: "Y70 Plus",            repairs: makeRepairs([105, 72, 49], 36, 30,  49, 44, 102, 21, 15) },
    ],
  },
  {
    id: "motorola", name: "Motorola Razr", shortName: "Motorola", accentColor: "#e2001a", logo: "/images/motorola.png",
    models: [
      { name: "Razr 50 Ultra",  repairs: makeRepairs([0,0,0], 65, 55, 119, 75, 179, 39, 29, 479, 169, 179) },
      { name: "Razr 50",        repairs: makeRepairs([0,0,0], 59, 49,  99, 69, 159, 35, 25, 399, 149, 169) },
      { name: "Razr 40 Ultra",  repairs: makeRepairs([0,0,0], 59, 49,  89, 69, 149, 35, 25, 369, 139, 159) },
      { name: "Razr 40",        repairs: makeRepairs([0,0,0], 55, 45,  79, 65, 139, 29, 22, 329, 129, 149) },
    ],
  },
  {
    id: "lg", name: "LG", shortName: "LG", accentColor: "#A50034", logo: "https://www.google.com/s2/favicons?domain=lg.com&sz=64",
    models: [
      { name: "V60 ThinQ 5G",   repairs: RP.LG_P },
      { name: "V50 ThinQ 5G",   repairs: makeRepairs([169,122, 84], 57, 47,  95, 67, 145, 37, 27) },
      { name: "V40 ThinQ",      repairs: makeRepairs([159,115, 79], 54, 44,  90, 64, 139, 35, 25) },
      { name: "G8 ThinQ",       repairs: makeRepairs([149,109, 79], 55, 45,  89, 65, 139, 35, 25) },
      { name: "G8X ThinQ",      repairs: makeRepairs([155,112, 80], 56, 46,  90, 65, 141, 35, 25) },
      { name: "G7 ThinQ",       repairs: makeRepairs([135, 99, 69], 51, 41,  82, 60, 132, 32, 23) },
      { name: "G6",             repairs: makeRepairs([119, 85, 59], 46, 36,  72, 55, 122, 28, 20) },
      { name: "Velvet",         repairs: makeRepairs([159,119, 85], 55, 49,  89, 65, 139, 35, 25) },
      { name: "Wing",           repairs: makeRepairs([  0,  0,  0], 65, 55, 119, 75, 169, 45, 35, 349, 189, 219) },
      { name: "K61",            repairs: RP.LG_M },
      { name: "K52",            repairs: makeRepairs([125, 92, 64], 48, 38,  79, 58, 127, 31, 23) },
      { name: "K42",            repairs: RP.LG_B },
      { name: "K22",            repairs: makeRepairs([105, 76, 53], 43, 33,  68, 52, 112, 27, 19) },
      { name: "Q60",            repairs: RP.LG_M },
      { name: "Q70",            repairs: makeRepairs([135, 99, 69], 51, 41,  82, 60, 132, 32, 23) },
    ],
  },
  {
    id: "sony", name: "Sony Xperia", shortName: "Sony", accentColor: "#000000", logo: "https://www.google.com/s2/favicons?domain=sony.com&sz=64",
    models: [
      { name: "Xperia 1 VI",    repairs: makeRepairs([249,169,  0], 72, 62, 129, 82, 179, 48, 38) },
      { name: "Xperia 5 VI",    repairs: makeRepairs([219,149,  0], 68, 58, 119, 78, 169, 45, 35) },
      { name: "Xperia 10 VI",   repairs: makeRepairs([169,119,  0], 58, 48,  99, 68, 149, 38, 30) },
      { name: "Xperia 1 V",     repairs: RP.SO_P },
      { name: "Xperia 5 V",     repairs: makeRepairs([199,139,  0], 65, 55, 109, 75, 159, 42, 32) },
      { name: "Xperia 10 V",    repairs: makeRepairs([149,109,  0], 55, 45,  89, 65, 139, 35, 29) },
      { name: "Xperia Pro-I",   repairs: makeRepairs([259,175,  0], 74, 64, 135, 84, 185, 50, 40) },
      { name: "Xperia 1 IV",    repairs: makeRepairs([219,149,  0], 65, 55, 109, 75, 159, 42, 32) },
      { name: "Xperia 5 IV",    repairs: makeRepairs([195,135,  0], 62, 52, 104, 72, 154, 40, 32) },
      { name: "Xperia 10 IV",   repairs: makeRepairs([145,105,  0], 53, 43,  85, 62, 135, 34, 27) },
      { name: "Xperia 1 III",   repairs: makeRepairs([209,142,  0], 63, 53, 102, 72, 152, 41, 31) },
      { name: "Xperia 5 III",   repairs: RP.SO_M },
      { name: "Xperia 10 III",  repairs: makeRepairs([139,101,  0], 52, 42,  82, 60, 131, 33, 26) },
      { name: "Xperia 5 II",    repairs: makeRepairs([169,119,  0], 57, 47,  95, 67, 147, 38, 29) },
      { name: "Xperia 10 II",   repairs: RP.SO_B },
      { name: "Xperia L4",      repairs: makeRepairs([129, 92,  0], 49, 39,  75, 58, 129, 32, 25) },
    ],
  },
  {
    id: "vivo", name: "Vivo", shortName: "Vivo", accentColor: "#415FFF", logo: "https://www.google.com/s2/favicons?domain=vivo.com&sz=64",
    models: [
      { name: "X200 Pro",    repairs: makeRepairs([239,159,115], 67, 57, 119, 80, 175, 44, 34) },
      { name: "X200",        repairs: makeRepairs([209,142,102], 62, 52, 109, 74, 165, 41, 31) },
      { name: "X100 Pro",    repairs: RP.VI_P },
      { name: "X100",        repairs: makeRepairs([199,135, 99], 62, 52, 104, 72, 154, 40, 30) },
      { name: "X90 Pro",     repairs: makeRepairs([209,142, 102], 63, 53, 102, 72, 152, 41, 31) },
      { name: "X80 Pro",     repairs: makeRepairs([199,139, 99], 65, 55, 109, 75, 159, 42, 32) },
      { name: "X70 Pro",     repairs: makeRepairs([185,127,  92], 60, 50,  95, 68, 148, 39, 29) },
      { name: "X60 Pro",     repairs: makeRepairs([175,119,  86], 57, 47,  90, 65, 142, 37, 27) },
      { name: "V29",         repairs: makeRepairs([169,119, 89], 59, 49,  99, 69, 149, 39, 29) },
      { name: "V29e",        repairs: makeRepairs([155,109, 79], 56, 46,  92, 65, 142, 36, 26) },
      { name: "V27",         repairs: RP.VI_M },
      { name: "V25",         repairs: makeRepairs([149,105, 76], 54, 44,  85, 61, 136, 35, 27) },
      { name: "V23",         repairs: makeRepairs([145,102, 74], 53, 43,  82, 59, 132, 34, 26) },
      { name: "V21",         repairs: makeRepairs([139, 97, 70], 51, 41,  78, 57, 128, 33, 25) },
      { name: "V20",         repairs: RP.VI_M },
      { name: "Y100",        repairs: makeRepairs([125, 87, 63], 47, 37,  72, 54, 120, 30, 23) },
      { name: "Y77",         repairs: RP.VI_B },
      { name: "Y76",         repairs: makeRepairs([119, 89, 65], 49, 39,  79, 59, 129, 32, 25) },
      { name: "Y35",         repairs: makeRepairs([112, 79, 57], 45, 35,  69, 52, 115, 28, 21) },
      { name: "Y22",         repairs: RP.VI_B },
      { name: "Y16",         repairs: makeRepairs([105, 74, 53], 43, 33,  65, 50, 110, 27, 20) },
    ],
  },
  {
    id: "nokia", name: "Nokia", shortName: "Nokia", accentColor: "#124191", logo: "https://www.google.com/s2/favicons?domain=nokia.com&sz=64",
    models: [
      { name: "XR21",       repairs: makeRepairs([149,105, 75], 52, 42,  85, 62, 135, 34, 26) },
      { name: "G60 5G",     repairs: RP.NO_M },
      { name: "X30 5G",     repairs: makeRepairs([139, 99, 75], 49, 39,  79, 59, 129, 32, 25) },
      { name: "G42 5G",     repairs: makeRepairs([119, 84, 60], 46, 36,  72, 54, 120, 29, 22) },
      { name: "G22",        repairs: makeRepairs([115, 82, 58], 45, 35,  70, 53, 118, 29, 22) },
      { name: "G21",        repairs: makeRepairs([112, 79, 56], 44, 34,  68, 52, 115, 28, 21) },
      { name: "G20",        repairs: makeRepairs([109, 77, 54], 43, 33,  66, 51, 112, 27, 20) },
      { name: "G10",        repairs: RP.NO_B },
      { name: "T21",        repairs: makeRepairs([115, 82, 58], 45, 35,  70, 53, 118, 29, 22) },
      { name: "C32",        repairs: makeRepairs([105, 74, 52], 42, 32,  64, 49, 108, 26, 19) },
      { name: "C31",        repairs: RP.NO_B },
      { name: "C22",        repairs: makeRepairs([100, 70, 49], 40, 30,  60, 47, 104, 25, 18) },
      { name: "C21 Plus",   repairs: makeRepairs([ 99, 69, 48], 39, 29,  59, 46, 102, 24, 18) },
      { name: "C21",        repairs: RP.NO_B },
      { name: "8.3 5G",     repairs: makeRepairs([139, 99, 69], 49, 39,  79, 59, 129, 32, 25) },
      { name: "7.3",        repairs: makeRepairs([125, 87, 61], 46, 36,  70, 53, 118, 29, 22) },
      { name: "6.3",        repairs: makeRepairs([115, 80, 56], 43, 33,  65, 50, 110, 27, 20) },
      { name: "5.3",        repairs: RP.NO_VB },
      { name: "4.2",        repairs: makeRepairs([ 75, 54, 38], 37, 27,  55, 43,  96, 23, 17) },
      { name: "5310",       repairs: RP.NO_VB },
    ],
  },
  {
    id: "bq", name: "BQ", shortName: "BQ", accentColor: "#E8002D", logo: "https://www.google.com/s2/favicons?domain=bq.com&sz=64",
    models: [
      { name: "Aquaris X2 Pro", repairs: RP.BQ_M },
      { name: "Aquaris X2",     repairs: makeRepairs([ 89, 65, 49], 42, 32, 65, 52, 109, 27, 20) },
      { name: "Aquaris X Pro",  repairs: makeRepairs([ 89, 65, 49], 42, 32, 65, 52, 109, 27, 20) },
      { name: "Aquaris X",      repairs: makeRepairs([ 85, 62, 45], 40, 30, 62, 49, 105, 25, 19) },
      { name: "Aquaris V Plus", repairs: RP.BQ_B },
      { name: "Aquaris V",      repairs: makeRepairs([ 75, 55, 39], 38, 28,  57, 44,  97, 23, 17) },
      { name: "Aquaris VS",     repairs: RP.BQ_B },
      { name: "Aquaris VS Plus",repairs: makeRepairs([ 79, 57, 40], 38, 28,  58, 45,  99, 24, 17) },
      { name: "Aquaris M5.5",   repairs: makeRepairs([ 79, 57, 40], 38, 28,  58, 45,  99, 24, 17) },
      { name: "Aquaris M5",     repairs: RP.BQ_B },
      { name: "Aquaris U2 Lite",repairs: makeRepairs([ 72, 52, 36], 35, 25,  52, 41,  92, 21, 15) },
      { name: "Aquaris U Lite", repairs: makeRepairs([ 69, 49, 34], 33, 23,  49, 39,  89, 20, 14) },
      { name: "Aquaris C",      repairs: makeRepairs([ 65, 47, 32], 31, 21,  46, 37,  85, 19, 13) },
    ],
  },
  {
    id: "htc", name: "HTC", shortName: "HTC", accentColor: "#69BE28", logo: "https://www.google.com/s2/favicons?domain=htc.com&sz=64",
    models: [
      { name: "U23 Pro",        repairs: RP.HT_P },
      { name: "U23",            repairs: makeRepairs([149,109, 77], 53, 43,  84, 61, 135, 33, 24) },
      { name: "U12+",           repairs: makeRepairs([155,115, 81], 55, 45,  87, 63, 138, 34, 25) },
      { name: "U11+",           repairs: makeRepairs([145,107, 75], 52, 42,  82, 60, 132, 33, 24) },
      { name: "U11",            repairs: makeRepairs([139,102, 72], 51, 41,  79, 58, 128, 32, 23) },
      { name: "Desire 21 Pro",  repairs: RP.HT_M },
      { name: "Desire 21 Pro 5G", repairs: makeRepairs([135, 99, 69], 50, 40,  79, 58, 129, 32, 24) },
      { name: "Desire 20 Pro",  repairs: makeRepairs([125, 92, 64], 48, 38,  75, 55, 122, 30, 22) },
      { name: "Desire 12s",     repairs: RP.HT_B },
      { name: "Wildfire E3",    repairs: makeRepairs([115, 84, 58], 46, 36,  70, 52, 115, 28, 21) },
      { name: "Wildfire R70",   repairs: RP.HT_B },
      { name: "U Ultra",        repairs: makeRepairs([139,109, 79], 52, 42, 85, 62, 135, 33, 25) },
      { name: "One M9",         repairs: makeRepairs([ 99, 72, 50], 43, 33,  65, 49, 105, 25, 18) },
      { name: "One M8",         repairs: makeRepairs([ 89, 65, 45], 40, 30,  60, 46,  99, 23, 17) },
    ],
  },
  {
    id: "meizu", name: "Meizu", shortName: "Meizu", accentColor: "#F2643C", logo: "https://www.google.com/s2/favicons?domain=meizu.com&sz=64",
    models: [
      { name: "21 Pro",       repairs: RP.MZ_P },
      { name: "21",           repairs: makeRepairs([179,129, 95], 62, 52, 104, 72, 154, 40, 30) },
      { name: "20 Pro",       repairs: makeRepairs([189,132,  96], 63, 53, 105, 73, 156, 41, 31) },
      { name: "20",           repairs: RP.MZ_M },
      { name: "20 Classic",   repairs: makeRepairs([162,114,  82], 58, 48,  97, 68, 148, 38, 28) },
      { name: "Note 21",      repairs: makeRepairs([155,109,  79], 56, 46,  92, 65, 142, 36, 26) },
      { name: "Note 20",      repairs: makeRepairs([145,102,  74], 53, 43,  86, 62, 135, 34, 25) },
      { name: "18X",          repairs: RP.MZ_M },
      { name: "18 Pro",       repairs: makeRepairs([179,126,  91], 61, 51, 101, 71, 152, 40, 30) },
      { name: "18s",          repairs: makeRepairs([169,119,  86], 59, 49,  96, 68, 147, 39, 29) },
      { name: "18",           repairs: makeRepairs([159,112,  81], 57, 47,  93, 66, 143, 37, 28) },
      { name: "17 Pro",       repairs: makeRepairs([152,107,  77], 55, 45,  90, 64, 139, 36, 27) },
      { name: "17",           repairs: RP.MZ_B },
      { name: "16 Plus",      repairs: makeRepairs([142,100,  72], 53, 43,  85, 62, 135, 34, 25) },
      { name: "16s Pro",      repairs: makeRepairs([148,104,  75], 54, 44,  87, 63, 137, 35, 26) },
    ],
  },
  {
    id: "asus", name: "ASUS", shortName: "Asus", accentColor: "#00539B", logo: "https://www.google.com/s2/favicons?domain=asus.com&sz=64",
    models: [
      { name: "ROG Phone 9 Pro", repairs: makeRepairs([309,209,159], 82, 72, 149, 92, 199, 58, 48) },
      { name: "ROG Phone 9",     repairs: makeRepairs([289,195,149], 79, 69, 139, 89, 189, 55, 45) },
      { name: "ROG Phone 8 Pro", repairs: RP.AS_P },
      { name: "ROG Phone 8",     repairs: makeRepairs([279,189,139], 77, 67, 135, 87, 185, 53, 43) },
      { name: "ROG Phone 7 Pro", repairs: makeRepairs([269,182,132], 76, 66, 132, 86, 182, 52, 42) },
      { name: "ROG Phone 7",     repairs: makeRepairs([259,179,129], 75, 65, 129, 85, 179, 50, 40) },
      { name: "ROG Phone 6 Pro", repairs: makeRepairs([255,172,124], 73, 63, 126, 83, 176, 49, 39) },
      { name: "ROG Phone 6",     repairs: makeRepairs([245,165,119], 71, 61, 122, 81, 172, 47, 37) },
      { name: "ROG Phone 5s Pro",repairs: makeRepairs([239,162,117], 70, 60, 119, 79, 169, 46, 36) },
      { name: "ROG Phone 5",     repairs: makeRepairs([235,159,115], 69, 59, 117, 78, 167, 45, 35) },
      { name: "ZenFone 11 Ultra",repairs: makeRepairs([249,169,119], 68, 58, 119, 79, 175, 45, 35) },
      { name: "ZenFone 10",      repairs: RP.AS_M },
      { name: "ZenFone 9",       repairs: makeRepairs([199,139, 99], 62, 52, 104, 72, 154, 40, 30) },
      { name: "ZenFone 8 Flip",  repairs: makeRepairs([209,145,105], 64, 54, 108, 74, 158, 41, 31) },
      { name: "ZenFone 8",       repairs: RP.AS_M },
      { name: "ZenFone 7 Pro",   repairs: makeRepairs([199,139, 99], 62, 52, 104, 72, 154, 40, 30) },
      { name: "ZenFone 7",       repairs: makeRepairs([189,132, 95], 60, 50, 100, 70, 150, 38, 29) },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export function BookingWizard({
  categoryId,
  preselectedBrandId,
  heroTitle1,
  heroTitle2,
  heroTag,
  heroBadges,
  stepTitle,
}: BookingWizardProps) {
  const [selectedBrand, setSelectedBrand]       = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel]       = useState<PhoneModel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedFaultType, setSelectedFaultType] = useState<{ label: string; price: string } | null>(null);
  const [selectedRepair, setSelectedRepair]     = useState<RepairOption | null>(null);
  const [selectedDate, setSelectedDate]         = useState<string | null>(null);
  const [selectedTime, setSelectedTime]         = useState<string | null>(null);
  const [customerName, setCustomerName]         = useState("");
  const [customerPhone, setCustomerPhone]       = useState("");
  const [confirmed, setConfirmed]               = useState(false);
  const [searchQuery, setSearchQuery]           = useState("");
  const [modelSearch, setModelSearch]           = useState("");

  const sectionRef = useRef<HTMLDivElement>(null);
  const days = getNextDays(7);

  // Brand-first mode: brand is pre-selected from URL, user picks model → avería → repair
  const isBrandFirst = !!preselectedBrandId;

  // Auto-select brand in brand-first mode
  useEffect(() => {
    if (preselectedBrandId) {
      const brand = brands.find((b) => b.id === preselectedBrandId) ?? null;
      setSelectedBrand(brand);
    }
  }, [preselectedBrandId]);

  // All brands visible on every repair page; search filters by brand name or model name
  const filteredBrands = (() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return brands;
    return brands.filter((b) =>
      b.shortName.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.models.some((m) => m.name.toLowerCase().includes(q))
    );
  })();

  // Effective category: brand-first uses selectedCategory, category-first uses prop
  const effectiveCategoryId = isBrandFirst ? selectedCategory : (categoryId ?? null);

  // Step calculation — different for brand-first vs category-first
  let currentStep = 1;
  if (isBrandFirst) {
    if (selectedModel)      currentStep = 2;
    if (selectedCategory)   currentStep = 3;
    if (selectedFaultType)  currentStep = 4;
    if (selectedDate && selectedTime) currentStep = 5;
  } else {
    if (selectedBrand)  currentStep = 2;
    if (selectedModel)  currentStep = 3;
    if (selectedRepair) currentStep = 4;
    if (selectedDate && selectedTime) currentStep = 5;
  }

  const stepLabels = isBrandFirst
    ? [
        { n: 1, label: "Modelo" },
        { n: 2, label: "Avería" },
        { n: 3, label: "Tipo" },
        { n: 4, label: "Fecha y hora" },
        { n: 5, label: "Confirmar" },
      ]
    : [
        { n: 1, label: "Marca" },
        { n: 2, label: "Modelo" },
        { n: 3, label: "Opción" },
        { n: 4, label: "Fecha y hora" },
        { n: 5, label: "Confirmar" },
      ];

  function scrollUp() {
    setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function handleBack() {
    if (confirmed) { setConfirmed(false); return; }
    if (selectedDate || selectedTime) { setSelectedDate(null); setSelectedTime(null); return; }
    if (isBrandFirst) {
      if (selectedFaultType) { setSelectedFaultType(null); return; }
      if (selectedCategory)  { setSelectedCategory(null); return; }
      if (selectedModel)     { setSelectedModel(null); setModelSearch(""); return; }
    } else {
      if (selectedRepair) { setSelectedRepair(null); return; }
      if (selectedModel)  { setSelectedModel(null); setModelSearch(""); return; }
      if (selectedBrand)  { setSelectedBrand(null); setModelSearch(""); return; }
    }
  }

  // Models for selected brand — in brand-first mode show all (category not chosen yet)
  const availableModels = selectedBrand
    ? (() => {
        let base: typeof selectedBrand.models;
        if (isBrandFirst) {
          base = selectedBrand.models;
        } else {
          const specific = selectedBrand.models.filter((m) => (m.repairs[categoryId ?? ""] ?? []).some((r) => r.price > 0));
          base = specific.length > 0 ? specific : selectedBrand.models;
        }
        const q = modelSearch.toLowerCase().trim();
        return q ? base.filter((m) => m.name.toLowerCase().includes(q)) : base;
      })()
    : [];

  return (
    <main className="w-full bg-white">
      <Header />

      {/* Hero */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_65%)] pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-4">
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">{heroTag}</span>
          </motion.div>
          <div className="flex flex-col gap-1 md:gap-2">
            <motion.h1 initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} className="text-[1.6rem] sm:text-[2.2rem] md:text-[2.8rem] lg:text-[clamp(2rem,5vw,72px)] font-black leading-[0.88] tracking-tighter uppercase text-[#CCFF00] m-0" style={{ fontFamily: 'var(--font-display), sans-serif', textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99" }}>
              {heroTitle1}
            </motion.h1>
            <motion.h1 initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="text-[1.6rem] sm:text-[2.2rem] md:text-[2.8rem] lg:text-[clamp(2rem,5vw,72px)] font-black leading-[0.88] tracking-tighter uppercase text-white m-0 pl-[6%]" style={{ fontFamily: 'var(--font-display), sans-serif', textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99" }}>
              {heroTitle2}
            </motion.h1>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-8 flex flex-wrap gap-3">
            {heroBadges.map((b) => (
              b.primary
                ? <div key={b.text} className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)]">{b.text}</div>
                : <div key={b.text} className="border border-white/30 text-white/80 text-sm px-5 py-2 rounded-full font-semibold">{b.text}</div>
            ))}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }} />
      </div>

      {/* Wizard */}
      <section ref={sectionRef} className="py-16 md:py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10 pb-8 border-b border-[#0a0a0a]/8 flex-wrap gap-4">
            <div className="flex items-center gap-1 flex-wrap">
              {stepLabels.map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className={`flex items-center gap-1.5 transition-opacity duration-200 ${currentStep === s.n ? "opacity-100" : currentStep > s.n ? "opacity-60" : "opacity-25"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors duration-200 ${
                      currentStep > s.n ? "bg-[#CCFF00] text-black" : currentStep === s.n ? "bg-[#0038FF] text-white ring-4 ring-[#0038FF]/15" : "bg-[#0a0a0a]/10 text-[#0a0a0a]/30"
                    }`}>
                      {currentStep > s.n
                        ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : s.n}
                    </div>
                    <span className={`text-xs font-bold hidden sm:inline ${currentStep === s.n ? "text-[#0038FF]" : "text-[#0a0a0a]/40"}`}>{s.label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-6 h-px mx-0.5 transition-colors ${currentStep > s.n ? "bg-[#0038FF]" : "bg-[#0a0a0a]/10"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            {currentStep > 1 && !confirmed && !(isBrandFirst && currentStep === 1) && (
              <button onClick={() => { handleBack(); scrollUp(); }} className="flex items-center gap-1.5 text-xs font-black text-[#0a0a0a]/40 hover:text-[#0038FF] transition-colors uppercase tracking-wide">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M10 12L5.5 8 10 4l-.75-.75L4 8l5.25 4.75z"/></svg>
                Volver
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">

            {/* CONFIRMED */}
            {confirmed && (
              <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="max-w-2xl mx-auto text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 200 }} className="w-20 h-20 rounded-full bg-[#CCFF00] flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none"><path d="M2 12l10 10L30 2" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] tracking-tight mb-3" style={{ fontFamily: "var(--font-display, inherit)" }}>¡Reserva confirmada!</h2>
                <p className="text-[#0a0a0a]/50 text-base leading-relaxed mb-8 max-w-md mx-auto">Recibirás un mensaje de confirmación por WhatsApp con todos los detalles de tu cita.</p>
                <div className="bg-[#0a0a0a]/[0.03] rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto mb-8">
                  {[
                    { label: "Dispositivo",   value: `${selectedBrand?.shortName} ${selectedModel?.name}` },
                    { label: "Reparación",    value: isBrandFirst ? (selectedFaultType?.label ?? "") : (selectedRepair?.name ?? "") },
                    { label: "Precio",        value: isBrandFirst ? (selectedFaultType?.price ?? "") : `${selectedRepair?.price}€ (IVA incl.)` },
                    ...(!isBrandFirst ? [
                      { label: "Tiempo est.", value: selectedRepair?.time ?? "" },
                      { label: "Garantía",    value: selectedRepair?.warranty ?? "" },
                    ] : []),
                    { label: "Cita",          value: `${days.find((d) => d.date === selectedDate)?.label} a las ${selectedTime}` },
                    { label: "Cliente",       value: customerName },
                    { label: "Teléfono",      value: customerPhone },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-start gap-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a]/35">{item.label}</span>
                      <span className="text-sm font-semibold text-[#0a0a0a] text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { if (!isBrandFirst) setSelectedBrand(null); setSelectedModel(null); setSelectedCategory(null); setSelectedFaultType(null); setSelectedRepair(null); setSelectedDate(null); setSelectedTime(null); setCustomerName(""); setCustomerPhone(""); setConfirmed(false); }} className="text-[#0038FF] font-bold text-sm underline underline-offset-4 hover:no-underline">
                  Hacer otra reserva
                </button>
              </motion.div>
            )}

            {/* STEP 1: BRAND (category-first mode only) */}
            {!confirmed && currentStep === 1 && !isBrandFirst && (
              <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 1 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>¿De qué marca es tu móvil?</h2>
                </div>

                {/* Search box */}
                <div className="relative mb-8 max-w-xl">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-[#0038FF]">
                      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2"/>
                      <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Busca tu marca o modelo…"
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-[#0038FF]/25 bg-white text-[#0a0a0a] text-sm font-semibold placeholder:text-[#0a0a0a]/30 outline-none focus:border-[#0038FF] focus:shadow-[0_0_0_4px_rgba(0,56,255,0.08)] transition-all duration-200"
                    style={{ fontFamily: "var(--font-display, inherit)" }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-3 flex items-center px-1 text-[#0a0a0a]/30 hover:text-[#0038FF] transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                    </button>
                  )}
                </div>

                {filteredBrands.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#0038FF]/8 flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-[#0038FF]">
                        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-[#0a0a0a]/40 text-sm font-semibold">No encontramos resultados para <span className="text-[#0038FF]">"{searchQuery}"</span></p>
                    <button onClick={() => setSearchQuery("")} className="mt-3 text-xs font-black text-[#0038FF] underline underline-offset-4 hover:no-underline">Limpiar búsqueda</button>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-md:gap-3">
                  {filteredBrands.map((brand, i) => (
                    <motion.button key={brand.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }} onClick={() => { setSelectedBrand(brand); scrollUp(); }} className="group relative bg-white rounded-2xl p-4 md:p-6 border border-[#0a0a0a]/5 hover:border-[#0038FF]/30 hover:shadow-[0_8px_32px_rgba(0,56,255,0.1)] transition-all duration-200 text-left overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" style={{ backgroundColor: brand.accentColor }} />
                      <div className="w-10 h-10 rounded-xl border border-[#0a0a0a]/5 flex items-center justify-center mb-4" style={{ backgroundColor: `${brand.accentColor}12` }}>
                        <img src={brand.logo} alt={brand.shortName} className="w-6 h-6 object-contain" />
                      </div>
                      <p className="text-base sm:text-xl md:text-2xl font-black text-[#0a0a0a] group-hover:text-[#0038FF] transition-colors duration-200 truncate" style={{ fontFamily: "var(--font-display, inherit)" }}>{brand.shortName}</p>
                      <p className="text-xs text-[#0a0a0a]/35 mt-1 font-medium">{brand.models.length} modelos</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP MODEL (step 1 in brand-first / step 2 in category-first) */}
            {!confirmed && selectedBrand && !selectedModel && (isBrandFirst ? currentStep === 1 : currentStep === 2) && (
              <motion.div key="s-model" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                    {isBrandFirst ? "Paso 1 de 5" : "Paso 2 de 5"}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>Selecciona tu {selectedBrand.shortName}</h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">{availableModels.length} modelos disponibles</p>
                </div>

                {/* Model search box */}
                <div className="relative mb-6 max-w-xl">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-[#0038FF]">
                      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2"/>
                      <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    placeholder={`Busca tu modelo ${selectedBrand.shortName}…`}
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-[#0038FF]/25 bg-white text-[#0a0a0a] text-sm font-semibold placeholder:text-[#0a0a0a]/30 outline-none focus:border-[#0038FF] focus:shadow-[0_0_0_4px_rgba(0,56,255,0.08)] transition-all duration-200"
                    style={{ fontFamily: "var(--font-display, inherit)" }}
                  />
                  {modelSearch && (
                    <button
                      onClick={() => setModelSearch("")}
                      className="absolute inset-y-0 right-3 flex items-center px-1 text-[#0a0a0a]/30 hover:text-[#0038FF] transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                    </button>
                  )}
                </div>

                {availableModels.length === 0 && modelSearch && (
                  <div className="py-14 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#0038FF]/8 flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-[#0038FF]">
                        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="text-[#0a0a0a]/40 text-sm font-semibold">No encontramos <span className="text-[#0038FF]">"{modelSearch}"</span> en {selectedBrand.shortName}</p>
                    <button onClick={() => setModelSearch("")} className="mt-3 text-xs font-black text-[#0038FF] underline underline-offset-4 hover:no-underline">Ver todos los modelos</button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableModels.map((model, i) => (
                    <motion.button key={model.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.3 }} onClick={() => { setSelectedModel(model); scrollUp(); }} className="group flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-[#0a0a0a]/5 hover:border-[#0038FF] hover:shadow-[0_4px_20px_rgba(0,56,255,0.08)] transition-all duration-200 text-left">
                      <span className="font-black text-sm text-[#0a0a0a] group-hover:text-[#0038FF] transition-colors">{model.name}</span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-[#0a0a0a]/15 group-hover:text-[#0038FF] transition-colors"><path d="M5.5 12l4.5-4-4.5-4 .75-.75 5.25 4.75-5.25 4.75z"/></svg>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2 (brand-first): CATEGORY / TIPO DE AVERÍA */}
            {!confirmed && isBrandFirst && selectedModel && !selectedCategory && (
              <motion.div key="s-category" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 2 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>
                    ¿Qué le pasa a tu {selectedModel.name}?
                  </h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">Selecciona el tipo de avería</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repairCategories.map((cat, i) => {
                    const repairs = (selectedModel.repairs[cat.id] ?? []).filter((r) => r.price > 0);
                    if (repairs.length === 0) return null;
                    return (
                      <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.32 }}
                        onClick={() => { setSelectedCategory(cat.id); scrollUp(); }}
                        className="group relative flex flex-col gap-3 bg-white rounded-2xl p-5 border border-[#0a0a0a]/6 hover:border-[#0038FF]/35 hover:shadow-[0_8px_32px_rgba(0,56,255,0.1)] transition-all duration-200 text-left overflow-hidden"
                      >
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" style={{ backgroundColor: cat.color }} />
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}14` }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: cat.color }}>
                            <path d={cat.svgPath} />
                          </svg>
                        </div>
                        <div>
                          <p className="font-black text-[#0a0a0a] group-hover:text-[#0038FF] transition-colors text-base" style={{ fontFamily: "var(--font-display, inherit)" }}>{cat.label}</p>
                          <p className="text-xs text-[#0a0a0a]/40 mt-0.5 leading-snug">{cat.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#0a0a0a]/5">
                          <span className="text-xs font-bold text-[#0a0a0a]/30">{repairs.length} opción{repairs.length > 1 ? "es" : ""}</span>
                          <span className="text-xs font-black" style={{ color: cat.color }}>Desde {Math.min(...repairs.map((r) => r.price))}€</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3 (brand-first): FAULT TYPE SELECTION */}
            {!confirmed && isBrandFirst && selectedCategory && !selectedFaultType && (
              <motion.div key="s-faulttype" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 3 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>
                    ¿Cuál es exactamente el problema?
                  </h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">
                    {repairCategories.find(c => c.id === selectedCategory)?.label} · Selecciona el tipo de reparación
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(faultTypes[selectedCategory] ?? []).map((fault, i) => (
                    <motion.button
                      key={fault.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      onClick={() => { setSelectedFaultType(fault); scrollUp(); }}
                      className="group flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-[#0a0a0a]/5 hover:border-[#0038FF] hover:shadow-[0_4px_20px_rgba(0,56,255,0.08)] transition-all duration-200 text-left"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <span className="font-black text-sm text-[#0a0a0a] group-hover:text-[#0038FF] transition-colors block">{fault.label}</span>
                        <span className="text-xs font-bold text-[#0038FF]/60 mt-0.5 block">{fault.price}</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-[#0a0a0a]/15 group-hover:text-[#0038FF] transition-colors shrink-0"><path d="M5.5 12l4.5-4-4.5-4 .75-.75 5.25 4.75-5.25 4.75z"/></svg>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP REPAIR OPTIONS (category-first mode only) */}
            {!confirmed && !isBrandFirst && selectedModel && !selectedRepair && currentStep === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 3 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>
                    {isBrandFirst
                      ? `Elige la opción de ${repairCategories.find(c => c.id === selectedCategory)?.label ?? ""} para tu ${selectedModel.name}`
                      : (stepTitle ?? `Elige la opción para tu ${selectedModel.name}`)
                    }
                  </h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">Precio cerrado, sin sorpresas</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(selectedModel.repairs[effectiveCategoryId ?? ""] ?? []).filter((r) => r.price > 0).map((repair, i) => {
                    const cfg = qualityConfig[repair.quality];
                    return (
                      <motion.button key={repair.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} onClick={() => { setSelectedRepair(repair); scrollUp(); }} className="group relative flex flex-col bg-white rounded-2xl overflow-hidden text-left transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,56,255,0.1)]" style={{ border: `2px solid ${cfg.border}` }}>
                        {repair.quality === "Original" && (
                          <div className="absolute -top-px left-5">
                            <div className="bg-[#CCFF00] text-black text-[9px] font-black px-3 py-0.5 rounded-b-lg uppercase tracking-widest">Recomendado</div>
                          </div>
                        )}
                        <div className="p-5 flex flex-col gap-3 flex-1">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full w-fit ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#0a0a0a] text-sm mb-1">{repair.name}</h3>
                            <p className="text-[#0a0a0a]/45 text-xs leading-relaxed">{repair.description}</p>
                          </div>
                          <div className="flex items-end justify-between gap-2 pt-2 border-t border-[#0a0a0a]/5">
                            <div>
                              <span className="text-3xl font-black text-[#0a0a0a]">{repair.price}€</span>
                              <span className="text-[10px] text-[#0a0a0a]/35 ml-1">IVA incl.</span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-[#0038FF]">{repair.time}</p>
                              <p className="text-[10px] text-[#0a0a0a]/30">Garantía {repair.warranty}</p>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: DATE & TIME */}
            {!confirmed && (isBrandFirst ? !!selectedFaultType : !!selectedRepair) && (!selectedDate || !selectedTime) && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 4 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>Elige fecha y hora</h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">Selecciona cuándo quieres venir al taller</p>
                </div>
                <div className="bg-[#0a0a0a]/[0.03] rounded-2xl p-5 mb-8 flex flex-wrap gap-x-8 gap-y-3">
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Dispositivo</p><p className="text-sm font-bold text-[#0a0a0a]">{selectedBrand?.shortName} {selectedModel?.name}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Reparación</p><p className="text-sm font-bold text-[#0a0a0a]">{isBrandFirst ? selectedFaultType?.label : selectedRepair?.name}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Precio</p><p className="text-sm font-black text-[#0038FF]">{isBrandFirst ? selectedFaultType?.price : `${selectedRepair?.price}€`}</p></div>
                  {!isBrandFirst && <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Duración</p><p className="text-sm font-bold text-[#0a0a0a]">{selectedRepair?.time}</p></div>}
                </div>
                <div className="mb-8">
                  <p className="text-sm font-black text-[#0a0a0a] mb-4 uppercase tracking-wide">Selecciona el día</p>
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => (
                      <button key={day.date} onClick={() => setSelectedDate(day.date)} className="flex flex-col items-center px-4 py-3 rounded-xl border transition-all duration-200 active:scale-95" style={{ backgroundColor: selectedDate === day.date ? "#0038FF" : "#fff", borderColor: selectedDate === day.date ? "#0038FF" : "#0a0a0a10", color: selectedDate === day.date ? "#fff" : "#0a0a0a" }}>
                        <span className="text-xs font-bold">{day.label}</span>
                        <span className="text-[10px] opacity-60">{day.short}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    <p className="text-sm font-black text-[#0a0a0a] mb-4 uppercase tracking-wide">Selecciona la hora</p>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((slot) => (
                        <button key={slot} onClick={() => setSelectedTime(slot)} className="px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 active:scale-95" style={{ backgroundColor: selectedTime === slot ? "#0038FF" : "#fff", borderColor: selectedTime === slot ? "#0038FF" : "#0a0a0a10", color: selectedTime === slot ? "#fff" : "#0a0a0a80" }}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 5: CONFIRM */}
            {!confirmed && selectedDate && selectedTime && (isBrandFirst ? !!selectedFaultType : !!selectedRepair) && (
              <motion.div key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 5 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>Confirma tu reserva</h2>
                </div>
                <div className="max-w-xl">
                  <div className="bg-[#0a0a0a]/[0.03] rounded-2xl p-6 mb-6 space-y-4">
                    {[
                      { label: "Dispositivo",   value: `${selectedBrand?.shortName} ${selectedModel?.name}` },
                      { label: "Reparación",    value: isBrandFirst ? (selectedFaultType?.label ?? "") : (selectedRepair?.name ?? "") },
                      { label: "Precio",        value: isBrandFirst ? (selectedFaultType?.price ?? "") : `${selectedRepair?.price}€ (IVA incl.)` },
                      ...(!isBrandFirst ? [
                        { label: "Tiempo est.", value: selectedRepair?.time ?? "" },
                        { label: "Garantía",    value: selectedRepair?.warranty ?? "" },
                      ] : []),
                      { label: "Fecha",         value: `${days.find((d) => d.date === selectedDate)?.label}` },
                      { label: "Hora",          value: selectedTime ?? "" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-start gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a]/35">{item.label}</span>
                        <span className="text-sm font-semibold text-[#0a0a0a] text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 mb-6">
                    <input type="text" placeholder="Tu nombre" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-[#0a0a0a]/10 text-sm font-medium focus:outline-none focus:border-[#0038FF] transition-colors" />
                    <input type="tel" placeholder="Número de teléfono (WhatsApp)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-[#0a0a0a]/10 text-sm font-medium focus:outline-none focus:border-[#0038FF] transition-colors" />
                  </div>
                  <button onClick={() => { if (customerName && customerPhone) { setConfirmed(true); scrollUp(); } }} disabled={!customerName || !customerPhone} className="w-full bg-[#0038FF] text-white font-black text-base py-4 rounded-xl hover:bg-[#0028cc] active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed">
                    Confirmar reserva →
                  </button>
                  <p className="text-[10px] text-[#0a0a0a]/30 text-center mt-3">Te avisamos por WhatsApp · Precio cerrado garantizado</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
