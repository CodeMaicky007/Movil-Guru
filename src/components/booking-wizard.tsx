"use client";
import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
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
  categoryId: CategoryId;
  heroTitle1: string;
  heroTitle2: string;
  heroTag: string;
  heroBadges: { text: string; primary?: boolean }[];
  stepTitle?: string;
}

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

// ─── Brands & models ────────────────────────────────────────────────────────────
const brands: Brand[] = [
  {
    id: "iphone", name: "Apple iPhone", shortName: "iPhone", accentColor: "#1d1d1f", logo: "/images/Apple.png",
    models: [
      { name: "iPhone 16 Pro Max",  repairs: makeRepairs([349,229,159], 79, 89, 149, 89, 199, 59, 49) },
      { name: "iPhone 16 Pro",      repairs: makeRepairs([319,209,149], 79, 89, 139, 89, 189, 55, 45) },
      { name: "iPhone 16",          repairs: makeRepairs([269,179,119], 69, 79, 119, 79, 179, 49, 39) },
      { name: "iPhone 15 Pro Max",  repairs: makeRepairs([299,189,139], 69, 79, 139, 85, 189, 55, 45) },
      { name: "iPhone 15 Pro",      repairs: makeRepairs([269,169,119], 69, 75, 129, 85, 179, 49, 39) },
      { name: "iPhone 15",          repairs: makeRepairs([229,149, 99], 59, 69, 109, 75, 169, 45, 35) },
      { name: "iPhone 14 Pro Max",  repairs: makeRepairs([259,169,119], 59, 69, 129, 79, 179, 49, 39) },
      { name: "iPhone 14 Pro",      repairs: makeRepairs([239,159,109], 59, 65, 119, 79, 169, 45, 35) },
      { name: "iPhone 14",          repairs: makeRepairs([199,139, 95], 49, 59,  99, 69, 159, 39, 29) },
      { name: "iPhone 13",          repairs: makeRepairs([179,119, 79], 49, 49,  89, 65, 149, 35, 25) },
      { name: "iPhone 12",          repairs: makeRepairs([159,109, 69], 45, 45,  79, 59, 139, 29, 25) },
      { name: "iPhone 11",          repairs: makeRepairs([119, 79, 55], 39, 39,  69, 55, 129, 25, 19) },
      { name: "iPhone SE (3ª gen)", repairs: makeRepairs([109, 69, 45], 35, 35,  59, 49, 119, 22, 19) },
    ],
  },
  {
    id: "samsung", name: "Samsung Galaxy", shortName: "Samsung", accentColor: "#1428A0", logo: "/images/Samsung.png",
    models: [
      { name: "Galaxy S24 Ultra",  repairs: makeRepairs([329,219,149], 79, 79, 149,  99, 219, 59, 49) },
      { name: "Galaxy S24+",       repairs: makeRepairs([279,179,129], 69, 69, 129,  89, 199, 49, 39) },
      { name: "Galaxy S24",        repairs: makeRepairs([249,159,119], 59, 59, 109,  79, 179, 45, 35) },
      { name: "Galaxy Z Fold6",    repairs: makeRepairs([329,  0,  0], 89, 89, 159, 119, 259, 59, 49, 649, 249, 199) },
      { name: "Galaxy Z Fold5",    repairs: makeRepairs([  0,  0,  0], 89, 89, 159, 119, 259, 59, 49, 599, 219, 189) },
      { name: "Galaxy Z Flip6",    repairs: makeRepairs([  0,  0,  0], 79, 79, 129, 109, 239, 55, 45, 449, 149, 179) },
      { name: "Galaxy Z Flip5",    repairs: makeRepairs([  0,  0,  0], 79, 79, 129, 109, 239, 55, 45, 399, 129, 169) },
      { name: "Galaxy S23 Ultra",  repairs: makeRepairs([299,199,139], 69, 69, 139,  89, 199, 49, 39) },
      { name: "Galaxy S23",        repairs: makeRepairs([199,139, 99], 55, 55,  99,  75, 169, 39, 29) },
      { name: "Galaxy A54",        repairs: makeRepairs([129, 89, 65], 45, 45,  69,  59, 139, 29, 22) },
      { name: "Galaxy A34",        repairs: makeRepairs([109, 75, 55], 39, 39,  59,  49, 119, 25, 19) },
    ],
  },
  {
    id: "xiaomi", name: "Xiaomi", shortName: "Xiaomi", accentColor: "#FF6900", logo: "/images/Xiaomi.png",
    models: [
      { name: "14 Ultra",          repairs: makeRepairs([249,169,119], 59, 49, 119, 79, 179, 45, 35) },
      { name: "14 Pro",            repairs: makeRepairs([219,149, 99], 55, 45,  99, 69, 169, 39, 29) },
      { name: "13T Pro",           repairs: makeRepairs([189,129, 89], 49, 39,  89, 65, 159, 35, 25) },
      { name: "13T",               repairs: makeRepairs([149, 99, 69], 45, 35,  69, 55, 139, 29, 22) },
      { name: "Redmi Note 13 Pro+",repairs: makeRepairs([109, 79, 55], 39, 35,  59, 49, 119, 25, 19) },
      { name: "Redmi Note 13",     repairs: makeRepairs([ 79, 55, 39], 35, 29,  49, 45, 109, 22, 15) },
      { name: "POCO F5 Pro",       repairs: makeRepairs([169,119, 85], 49, 39,  79, 59, 149, 29, 25) },
      { name: "POCO X5",           repairs: makeRepairs([ 89, 65, 45], 35, 29,  49, 45, 109, 22, 15) },
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
      { name: "Pixel 7a",          repairs: makeRepairs([149, 99, 69], 45, 39,  69,  55, 129, 25, 19) },
    ],
  },
  {
    id: "oneplus", name: "OnePlus", shortName: "OnePlus", accentColor: "#F5010C", logo: "/images/oneplus.png",
    models: [
      { name: "OnePlus Open",        repairs: makeRepairs([  0,  0,  0], 65, 55, 119, 75, 179, 39, 29, 549, 199, 189) },
      { name: "OnePlus 12",          repairs: makeRepairs([229,149, 99], 65, 55, 119, 75, 179, 39, 29) },
      { name: "OnePlus 11",          repairs: makeRepairs([199,119, 85], 55, 49,  99, 69, 159, 35, 25) },
      { name: "OnePlus Nord 4",      repairs: makeRepairs([159,109, 79], 45, 39,  69, 55, 139, 29, 22) },
      { name: "OnePlus Nord CE 4",   repairs: makeRepairs([129, 89, 65], 39, 35,  55, 49, 119, 25, 19) },
    ],
  },
  {
    id: "huawei", name: "Huawei", shortName: "Huawei", accentColor: "#CF0A2C", logo: "/images/huawei.png",
    models: [
      { name: "Mate X5 (plegable)",  repairs: makeRepairs([  0,  0,  0], 69, 69, 139, 89, 199, 49, 39, 599,   0, 199) },
      { name: "P60 Pro",             repairs: makeRepairs([269,179,129], 69, 59, 129, 85, 189, 45, 35) },
      { name: "Mate 50 Pro",         repairs: makeRepairs([289,189,139], 69, 69, 139, 89, 199, 49, 39) },
      { name: "P50 Pro",             repairs: makeRepairs([229,149,109], 55, 55, 109, 79, 169, 39, 29) },
      { name: "Nova 12 Pro",         repairs: makeRepairs([159,109, 75], 45, 39,  79, 59, 139, 29, 22) },
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
];

// ─── Component ─────────────────────────────────────────────────────────────────
export function BookingWizard({
  categoryId,
  heroTitle1,
  heroTitle2,
  heroTag,
  heroBadges,
  stepTitle,
}: BookingWizardProps) {
  const [selectedBrand, setSelectedBrand]   = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel]   = useState<PhoneModel | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<RepairOption | null>(null);
  const [selectedDate, setSelectedDate]     = useState<string | null>(null);
  const [selectedTime, setSelectedTime]     = useState<string | null>(null);
  const [customerName, setCustomerName]     = useState("");
  const [customerPhone, setCustomerPhone]   = useState("");
  const [confirmed, setConfirmed]           = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const days = getNextDays(7);

  // Filter brands to only those that have at least one model with this category
  const filteredBrands = brands.filter((b) =>
    b.models.some((m) => (m.repairs[categoryId] ?? []).some((r) => r.price > 0))
  );

  let currentStep = 1;
  if (selectedBrand)  currentStep = 2;
  if (selectedModel)  currentStep = 3;
  if (selectedRepair) currentStep = 4;
  if (selectedDate && selectedTime) currentStep = 5;

  const stepLabels = [
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
    if (confirmed)                   { setConfirmed(false); return; }
    if (selectedDate || selectedTime){ setSelectedDate(null); setSelectedTime(null); return; }
    if (selectedRepair)              { setSelectedRepair(null); return; }
    if (selectedModel)               { setSelectedModel(null); return; }
    if (selectedBrand)               { setSelectedBrand(null); return; }
  }

  // Models for selected brand that have this category
  const availableModels = selectedBrand
    ? selectedBrand.models.filter((m) => (m.repairs[categoryId] ?? []).some((r) => r.price > 0))
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
            <motion.h1 initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(3rem,10vw,130px)] font-black leading-[0.82] tracking-tighter uppercase text-[#CCFF00] m-0" style={{ fontFamily: 'var(--font-display), sans-serif', textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99" }}>
              {heroTitle1}
            </motion.h1>
            <motion.h1 initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="text-[clamp(3rem,10vw,130px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 pl-[6%]" style={{ fontFamily: 'var(--font-display), sans-serif', textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99" }}>
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
            {currentStep > 1 && !confirmed && (
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
                    { label: "Reparación",    value: selectedRepair?.name ?? "" },
                    { label: "Precio cerrado",value: `${selectedRepair?.price}€ (IVA incl.)` },
                    { label: "Tiempo est.",   value: selectedRepair?.time ?? "" },
                    { label: "Garantía",      value: selectedRepair?.warranty ?? "" },
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
                <button onClick={() => { setSelectedBrand(null); setSelectedModel(null); setSelectedRepair(null); setSelectedDate(null); setSelectedTime(null); setCustomerName(""); setCustomerPhone(""); setConfirmed(false); }} className="text-[#0038FF] font-bold text-sm underline underline-offset-4 hover:no-underline">
                  Hacer otra reserva
                </button>
              </motion.div>
            )}

            {/* STEP 1: BRAND */}
            {!confirmed && currentStep === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 1 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>¿De qué marca es tu móvil?</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredBrands.map((brand, i) => (
                    <motion.button key={brand.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }} onClick={() => { setSelectedBrand(brand); scrollUp(); }} className="group relative bg-white rounded-2xl p-6 border border-[#0a0a0a]/5 hover:border-[#0038FF]/30 hover:shadow-[0_8px_32px_rgba(0,56,255,0.1)] transition-all duration-200 text-left">
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" style={{ backgroundColor: brand.accentColor }} />
                      <div className="w-10 h-10 rounded-xl border border-[#0a0a0a]/5 flex items-center justify-center mb-4" style={{ backgroundColor: `${brand.accentColor}12` }}>
                        <img src={brand.logo} alt={brand.shortName} className="w-6 h-6 object-contain" />
                      </div>
                      <p className="text-2xl font-black text-[#0a0a0a] group-hover:text-[#0038FF] transition-colors duration-200" style={{ fontFamily: "var(--font-display, inherit)" }}>{brand.shortName}</p>
                      <p className="text-xs text-[#0a0a0a]/35 mt-1 font-medium">{brand.models.filter((m) => (m.repairs[categoryId] ?? []).some((r) => r.price > 0)).length} modelos</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: MODEL */}
            {!confirmed && currentStep === 2 && selectedBrand && !selectedModel && (
              <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 2 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>Selecciona tu {selectedBrand.shortName}</h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">{availableModels.length} modelos disponibles</p>
                </div>
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

            {/* STEP 3: REPAIR OPTIONS */}
            {!confirmed && selectedModel && !selectedRepair && (
              <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 3 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>
                    {stepTitle ?? `Elige la opción para tu ${selectedModel.name}`}
                  </h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">Precio cerrado, sin sorpresas</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(selectedModel.repairs[categoryId] ?? []).filter((r) => r.price > 0).map((repair, i) => {
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
            {!confirmed && selectedRepair && (!selectedDate || !selectedTime) && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 4 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>Elige fecha y hora</h2>
                  <p className="text-[#0a0a0a]/40 mt-2 text-sm font-medium">Selecciona cuándo quieres venir al taller</p>
                </div>
                <div className="bg-[#0a0a0a]/[0.03] rounded-2xl p-5 mb-8 flex flex-wrap gap-x-8 gap-y-3">
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Dispositivo</p><p className="text-sm font-bold text-[#0a0a0a]">{selectedBrand?.shortName} {selectedModel?.name}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Reparación</p><p className="text-sm font-bold text-[#0a0a0a]">{selectedRepair.name}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Precio</p><p className="text-sm font-black text-[#0038FF]">{selectedRepair.price}€</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#0a0a0a]/30">Duración</p><p className="text-sm font-bold text-[#0a0a0a]">{selectedRepair.time}</p></div>
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
            {!confirmed && selectedDate && selectedTime && selectedRepair && (
              <motion.div key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <div className="mb-10">
                  <div className="inline-block bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Paso 5 de 5</div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0a0a0a] leading-tight" style={{ fontFamily: "var(--font-display, inherit)" }}>Confirma tu reserva</h2>
                </div>
                <div className="max-w-xl">
                  <div className="bg-[#0a0a0a]/[0.03] rounded-2xl p-6 mb-6 space-y-4">
                    {[
                      { label: "Dispositivo",   value: `${selectedBrand?.shortName} ${selectedModel?.name}` },
                      { label: "Reparación",    value: selectedRepair.name },
                      { label: "Precio cerrado",value: `${selectedRepair.price}€ (IVA incl.)` },
                      { label: "Tiempo est.",   value: selectedRepair.time },
                      { label: "Garantía",      value: selectedRepair.warranty },
                      { label: "Fecha",         value: `${days.find((d) => d.date === selectedDate)?.label}` },
                      { label: "Hora",          value: selectedTime },
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
