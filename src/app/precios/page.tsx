"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const brands = ["Apple", "Samsung", "Xiaomi", "Google", "Huawei", "OnePlus"];

const brandLogos: Record<string, string> = {
  Apple:   "/images/Apple.png",
  Samsung: "/images/Samsung.png",
  Xiaomi:  "/images/Xiaomi.png",
  Google:  "/images/GooglePixel.png",
  Huawei:  "/images/huawei.png",
  OnePlus: "/images/oneplus.png",
};

type Brand = (typeof brands)[number];

interface RepairPrice {
  model: string;
  screen: string;
  battery: string;
  port: string;
  camera: string;
}

const priceData: Record<Brand, RepairPrice[]> = {
  Apple: [
    { model: "iPhone 16 Pro Max", screen: "289€", battery: "79€", port: "89€", camera: "149€" },
    { model: "iPhone 16 Pro", screen: "269€", battery: "79€", port: "89€", camera: "139€" },
    { model: "iPhone 16", screen: "219€", battery: "69€", port: "79€", camera: "119€" },
    { model: "iPhone 15 Pro Max", screen: "269€", battery: "69€", port: "79€", camera: "139€" },
    { model: "iPhone 15 Pro", screen: "249€", battery: "69€", port: "79€", camera: "129€" },
    { model: "iPhone 15", screen: "199€", battery: "59€", port: "69€", camera: "109€" },
    { model: "iPhone 14 Pro Max", screen: "249€", battery: "59€", port: "69€", camera: "129€" },
    { model: "iPhone 14", screen: "179€", battery: "49€", port: "59€", camera: "99€" },
    { model: "iPhone 13", screen: "149€", battery: "49€", port: "49€", camera: "89€" },
    { model: "iPhone 12", screen: "119€", battery: "45€", port: "45€", camera: "79€" },
  ],
  Samsung: [
    { model: "Galaxy S24 Ultra", screen: "329€", battery: "79€", port: "79€", camera: "149€" },
    { model: "Galaxy S24+", screen: "279€", battery: "69€", port: "69€", camera: "129€" },
    { model: "Galaxy S24", screen: "229€", battery: "59€", port: "59€", camera: "109€" },
    { model: "Galaxy Z Fold5", screen: "489€", battery: "89€", port: "89€", camera: "159€" },
    { model: "Galaxy Z Flip5", screen: "389€", battery: "79€", port: "79€", camera: "129€" },
    { model: "Galaxy S23 Ultra", screen: "299€", battery: "69€", port: "69€", camera: "139€" },
    { model: "Galaxy S23", screen: "199€", battery: "55€", port: "55€", camera: "99€" },
    { model: "Galaxy A54", screen: "129€", battery: "45€", port: "45€", camera: "69€" },
    { model: "Galaxy A34", screen: "109€", battery: "39€", port: "39€", camera: "59€" },
  ],
  Xiaomi: [
    { model: "14 Ultra", screen: "249€", battery: "59€", port: "49€", camera: "119€" },
    { model: "14 Pro", screen: "219€", battery: "55€", port: "45€", camera: "99€" },
    { model: "13T Pro", screen: "189€", battery: "49€", port: "39€", camera: "89€" },
    { model: "13T", screen: "149€", battery: "45€", port: "35€", camera: "69€" },
    { model: "Redmi Note 13 Pro+", screen: "109€", battery: "39€", port: "35€", camera: "59€" },
    { model: "Redmi Note 13", screen: "79€", battery: "35€", port: "29€", camera: "49€" },
    { model: "POCO F5 Pro", screen: "169€", battery: "49€", port: "39€", camera: "79€" },
    { model: "POCO X5", screen: "89€", battery: "35€", port: "29€", camera: "49€" },
  ],
  Google: [
    { model: "Pixel 8 Pro", screen: "259€", battery: "69€", port: "69€", camera: "129€" },
    { model: "Pixel 8", screen: "209€", battery: "59€", port: "59€", camera: "109€" },
    { model: "Pixel 7 Pro", screen: "229€", battery: "59€", port: "59€", camera: "109€" },
    { model: "Pixel 7a", screen: "149€", battery: "49€", port: "45€", camera: "79€" },
    { model: "Pixel 7", screen: "189€", battery: "55€", port: "49€", camera: "99€" },
    { model: "Pixel 6a", screen: "119€", battery: "45€", port: "39€", camera: "69€" },
  ],
  Huawei: [
    { model: "P60 Pro", screen: "269€", battery: "69€", port: "59€", camera: "129€" },
    { model: "Mate 50 Pro", screen: "289€", battery: "69€", port: "69€", camera: "139€" },
    { model: "P50 Pro", screen: "229€", battery: "55€", port: "55€", camera: "109€" },
    { model: "Nova 11", screen: "129€", battery: "45€", port: "39€", camera: "69€" },
    { model: "P40 Pro", screen: "189€", battery: "49€", port: "49€", camera: "89€" },
    { model: "P30 Pro", screen: "149€", battery: "45€", port: "39€", camera: "69€" },
  ],
  OnePlus: [
    { model: "12", screen: "239€", battery: "65€", port: "55€", camera: "119€" },
    { model: "11", screen: "199€", battery: "55€", port: "49€", camera: "99€" },
    { model: "Nord 3", screen: "129€", battery: "45€", port: "39€", camera: "69€" },
    { model: "Nord CE3", screen: "99€", battery: "39€", port: "35€", camera: "55€" },
    { model: "10 Pro", screen: "179€", battery: "49€", port: "45€", camera: "89€" },
  ],
};

const includes = [
  "Diagnóstico gratuito sin compromiso",
  "Piezas de calidad certificadas",
  "Garantía mínima de 12 meses",
  "IVA incluido en todos los precios",
  "Sin costes ocultos ni tasas de gestión",
  "No cobramos si no reparamos",
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PreciosPage() {
  const [activeBrand, setActiveBrand] = useState<Brand>("Apple");
  const rows = priceData[activeBrand];

  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_65%)] pointer-events-none" />
        <div
          className="absolute right-[2%] top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none select-none text-white font-black"
          style={{ fontSize: "28rem", fontFamily: '"Arial Black", Impact, sans-serif', lineHeight: 1 }}
        >
          €
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Movil Guru · Tarifas
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
              PRECIOS
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.5rem,11vw,140px)] font-black leading-[0.82] tracking-tighter uppercase text-white m-0 pl-[6%]"
              style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                textShadow: "2px 2px 0 #001A99,4px 4px 0 #001A99,6px 6px 0 #001A99",
              }}
            >
              CLAROS
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md">
              Precios cerrados por modelo. Sin sorpresas al recoger. El precio incluye pieza premium + mano de obra + IVA.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <div className="bg-[#CCFF00] text-black font-black text-sm px-5 py-2 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                IVA incluido
              </div>
              <div className="border border-white/30 text-white/80 text-sm px-5 py-2 rounded-full font-semibold">
                Presupuesto cerrado
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── Price Table ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        {/* Brand tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: activeBrand === brand ? "#0038FF" : "#0a0a0a08",
                color: activeBrand === brand ? "#fff" : "#0a0a0a80",
              }}
            >
              <img
                src={brandLogos[brand]}
                alt={brand}
                className="w-5 h-5 object-contain"
                style={{ filter: activeBrand === brand ? "brightness(0) invert(1)" : "none" }}
              />
              {brand}
            </button>
          ))}
        </motion.div>

        {/* Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBrand}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b-2 border-[#0a0a0a]/8">
                  <th className="text-left py-3 px-4 text-xs font-black uppercase tracking-wider text-[#0a0a0a]/40">
                    Modelo
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-[#0a0a0a]/40">
                    Pantalla
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-[#0a0a0a]/40">
                    Batería
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-[#0a0a0a]/40">
                    Puerto carga
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-black uppercase tracking-wider text-[#0a0a0a]/40">
                    Cámara
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={row.model}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="border-b border-[#0a0a0a]/5 hover:bg-[#0038FF]/[0.02] transition-colors duration-150 group"
                  >
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-bold text-[#0a0a0a] group-hover:text-[#0038FF] transition-colors duration-200">
                        {row.model}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-black text-[#0038FF]">{row.screen}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-semibold text-[#0a0a0a]/70">{row.battery}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-semibold text-[#0a0a0a]/70">{row.port}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm font-semibold text-[#0a0a0a]/70">{row.camera}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-[#0a0a0a]/35 mt-4"
        >
          * Precios con pieza premium. Pieza original OEM disponible — consulta precio. ¿No ves tu modelo? Contáctanos.
        </motion.p>
      </section>

      {/* ── What's included ── */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-3">
                Todo incluido
              </p>
              <h2
                className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-display, inherit)" }}
              >
                Sin sorpresas.
                <br />
                <span className="text-[#CCFF00]">Nunca.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ul className="space-y-4">
                {includes.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#CCFF00] flex items-center justify-center">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-white/75 text-sm font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-[#0038FF] overflow-hidden p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.08),transparent_70%)] pointer-events-none" />
          <div className="relative z-10">
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              ¿Tu modelo no aparece?
              <br />
              <span className="text-[#CCFF00]">Te damos precio al instante.</span>
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed mb-8">
              Escríbenos con el modelo y la avería. Te respondemos con presupuesto cerrado en menos de 15 minutos.
            </p>
            <a
              href="/reparacion-pantalla"
              className="inline-flex items-center gap-2 bg-[#CCFF00] text-black font-black text-base px-8 py-3.5 rounded-full shadow-[0_0_30px_rgba(204,255,0,0.35)] hover:shadow-[0_0_50px_rgba(204,255,0,0.55)] hover:scale-105 transition-transform duration-200 active:scale-95"
            >
              Solicitar presupuesto
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
