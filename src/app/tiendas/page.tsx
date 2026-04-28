"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Phone, ArrowRight, Navigation, Zap, Tag, Bell, Lock, Mail, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);
const ParticleHero = dynamic(
  () => import("@/components/ui/particle-hero").then((m) => m.ParticleHero),
  { ssr: false }
);
const LocationMap = dynamic(
  () => import("@/components/ui/expand-map").then((m) => m.LocationMap),
  { ssr: false }
);
const MapLibre = dynamic(
  () => import("@/components/ui/map").then((m) => m.Map),
  { ssr: false }
);
const MapMarker = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapMarker),
  { ssr: false }
);
const MarkerContent = dynamic(
  () => import("@/components/ui/map").then((m) => m.MarkerContent),
  { ssr: false }
);
const MarkerTooltip = dynamic(
  () => import("@/components/ui/map").then((m) => m.MarkerTooltip),
  { ssr: false }
);
const MapControls = dynamic(
  () => import("@/components/ui/map").then((m) => m.MapControls),
  { ssr: false }
);
const Phone3DSection = dynamic(
  () => import("@/components/ui/phone-3d-section").then((m) => m.Phone3DSection),
  { ssr: false }
);

// ─── Data ──────────────────────────────────────────────────────────────────
const stores = [
  {
    id: "valladolid-centro",
    name: "Valladolid Centro",
    address: "C/ Santiago, 3",
    city: "Valladolid, 47001",
    phone: "+34 983 000 000",
    hours: "Lun–Sáb 10:00–20:00",
    coordinates: "41.6523° N, 4.7245° W",
    lng: -4.7245,
    lat: 41.6523,
    image: "/Vall1.png",
    tag: "Calle Principal",
  },
  {
    id: "valladolid-plaza",
    name: "Valladolid Plaza",
    address: "Centro Comercial Vallsur",
    city: "Valladolid, 47008",
    phone: "+34 983 000 001",
    hours: "Lun–Dom 10:00–22:00",
    coordinates: "41.6380° N, 4.7290° W",
    lng: -4.729,
    lat: 41.638,
    image: "/Vall2.png",
    tag: "Centro Comercial",
  },
  {
    id: "burgos",
    name: "Burgos",
    address: "C/ Vitoria, 14",
    city: "Burgos, 09004",
    phone: "+34 947 000 000",
    hours: "Lun–Sáb 10:00–20:00",
    coordinates: "42.3440° N, 3.6969° W",
    lng: -3.6969,
    lat: 42.344,
    image: "/Burgos.png",
    tag: "Calle Principal",
  },
  {
    id: "leon",
    name: "León / Ponferrada",
    address: "Av. de los Cubos, 5",
    city: "León, 24007",
    phone: "+34 987 000 000",
    hours: "Lun–Sáb 10:00–20:00",
    coordinates: "42.5987° N, 5.5671° W",
    lng: -5.5671,
    lat: 42.5987,
    image: "/Leon.png",
    tag: "León · Ponferrada",
  },
];

// ─── Marker Icon ────────────────────────────────────────────────────────────
function StorePin({ name }: { name: string }) {
  return (
    <div className="relative group">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: "#CCFF00",
          border: "3px solid #000",
          boxShadow: "0 0 20px rgba(204,255,0,0.6), 0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        <MapPin className="w-5 h-5 text-black" />
      </div>
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0"
        style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #CCFF00" }}
      />
    </div>
  );
}

// ─── Store Card ─────────────────────────────────────────────────────────────
function StoreCard({ store, index }: { store: typeof stores[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Store photo */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-full object-cover"
          style={{ transition: "transform 0.6s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,20,0.8) 0%, transparent 60%)" }} />
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
          style={{ background: "#CCFF00", color: "#000" }}
        >
          {store.tag}
        </div>
      </div>

      {/* Store info */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-black" style={{ color: "#0a0a0a", letterSpacing: "-0.02em" }}>
          {store.name.split(" ").map((word, i) => (
            <span key={i} style={{ color: i % 2 === 0 ? "#0038FF" : "#CCFF00" }}>
              {word}{" "}
            </span>
          ))}
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#0038FF" }} />
            <div>
              <p className="text-sm" style={{ color: "#374151" }}>{store.address}</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>{store.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 flex-shrink-0" style={{ color: "#0038FF" }} />
            <p className="text-sm" style={{ color: "#374151" }}>{store.hours}</p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#0038FF" }} />
            <a
              href={`tel:${store.phone}`}
              className="text-sm hover:underline"
              style={{ color: "#374151" }}
            >
              {store.phone}
            </a>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <a
            href={`https://maps.google.com/?q=${store.lat},${store.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#0038FF", color: "#fff" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,56,255,0.3)" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "" }}
          >
            <Navigation className="w-4 h-4" />
            Cómo llegar
          </a>
          <a
            href={`tel:${store.phone}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#f3f4f6", color: "#0a0a0a", border: "1px solid #e5e7eb" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#e5e7eb" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6" }}
          >
            <Phone className="w-4 h-4" />
            Llamar
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TiendasPage() {
  const centerLng = stores.reduce((s, t) => s + t.lng, 0) / stores.length;
  const centerLat = stores.reduce((s, t) => s + t.lat, 0) / stores.length;

  return (
    <main style={{ background: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* Hero */}
      <ParticleHero />

      {/* Store Cards Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: "#0038FF" }}
            >
              Encuéntranos
            </p>
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{ color: "#0a0a0a", letterSpacing: "-0.03em" }}
            >
              <span style={{ color: "#0038FF" }}>4</span>{" "}
              tiendas.
              <br />
              Un{" "}
              <span style={{ color: "#CCFF00" }}>solo</span>{" "}
              <span style={{ color: "#0038FF" }}>guru.</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "#6b7280", lineHeight: 1.7 }}>
              Visítanos en cualquiera de nuestras tiendas en{" "}
              <span style={{ color: "#0038FF", fontWeight: 600 }}>Valladolid</span>,{" "}
              <span style={{ color: "#CCFF00", fontWeight: 600 }}>Burgos</span> o{" "}
              <span style={{ color: "#0038FF", fontWeight: 600 }}>León</span>.{" "}
              Expertos listos para ayudarte.
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {stores.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>

        </div>
      </section>

      {/* Full Map Section */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#CCFF00" }}>
              Mapa interactivo
            </p>
            <h2 className="text-3xl font-black" style={{ color: "#0a0a0a", letterSpacing: "-0.02em" }}>
              Encuentra tu{" "}
              <span style={{ color: "#0038FF" }}>tienda</span>{" "}
              más{" "}
              <span style={{ color: "#CCFF00" }}>cercana</span>
            </h2>
          </motion.div>

          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{
              height: "500px",
              border: "1px solid rgba(0,56,255,0.3)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <MapLibre
              center={[centerLng, centerLat]}
              zoom={7}
            >
              <MapControls showZoom showLocate showFullscreen position="bottom-right" />
              {stores.map((store) => (
                <MapMarker key={store.id} longitude={store.lng} latitude={store.lat}>
                  <MarkerContent>
                    <StorePin name={store.name} />
                  </MarkerContent>
                  <MarkerTooltip>
                    <div className="space-y-0.5">
                      <p className="font-black text-sm">{store.name}</p>
                      <p className="text-xs font-normal" style={{ color: "rgba(0,0,0,0.6)" }}>{store.address}</p>
                    </div>
                  </MarkerTooltip>
                </MapMarker>
              ))}
            </MapLibre>
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ background: "#000", transform: "skewY(-2deg)", transformOrigin: "center", padding: "12px 0", margin: "40px 0" }}>
        <motion.div
          className="flex whitespace-nowrap gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="text-xs font-black tracking-[0.25em]"
              style={{ color: item === "·" ? "#CCFF00" : item.includes("EXCLUSIVAS") || item.includes("MIEMBROS") ? "#0038FF" : "#6b7280" }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Offers / Login Section */}
      <OffersSection />

      {/* 3D Phone Cinematic Section — desktop only */}
      <div className="hidden lg:block">
        <Phone3DSection />
      </div>

      {/* CTA Banner */}
      <section className="py-24 px-4" style={{ background: "#fff" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl p-12 text-center"
            style={{
              background: "linear-gradient(135deg, #0038FF 0%, #001EB0 100%)",
              border: "1px solid rgba(204,255,0,0.3)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 left-0 w-24 h-24" style={{ background: "radial-gradient(circle at 0% 0%, rgba(204,255,0,0.2), transparent 70%)" }} />
            <div className="absolute bottom-0 right-0 w-32 h-32" style={{ background: "radial-gradient(circle at 100% 100%, rgba(204,255,0,0.15), transparent 70%)" }} />

            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#CCFF00" }}>
              Sin esperas
            </p>
            <h3 className="text-3xl md:text-4xl font-black mb-4" style={{ letterSpacing: "-0.03em" }}>
              <span style={{ color: "white" }}>¿Necesitas </span>
              <span style={{ color: "#CCFF00" }}>reparación </span>
              <span style={{ color: "white" }}>urgente?</span>
            </h3>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
              Llámanos o pasa directamente por la tienda.<br />
              Servicio en el día garantizado.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/registro"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm tracking-wide transition-transform hover:-translate-y-1"
                style={{ background: "#CCFF00", color: "#000", boxShadow: "0 8px 30px rgba(204,255,0,0.4)" }}
              >
                Reservar cita <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="tel:+34983000000"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm tracking-wide border transition-all hover:bg-white/10"
                style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
              >
                <Phone className="w-4 h-4" />
                Llamar ahora
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ─── Floating offer card data ────────────────────────────────────────────────
const offerCards = [
  { store: "Valladolid Centro", offer: "20% dto. fundas", color: "#CCFF00" },
  { store: "Burgos", offer: "Pantalla desde 29€", color: "#0038FF" },
  { store: "Valladolid Plaza", offer: "Batería gratis >100€", color: "#CCFF00" },
  { store: "León / Ponferrada", offer: "2×1 en cristales", color: "#0038FF" },
  { store: "Todas las tiendas", offer: "Diagnóstico gratis", color: "#CCFF00" },
  { store: "Burgos", offer: "Puerto USB-C 19€", color: "#0038FF" },
];

const tickerItems = [
  "VALLADOLID CENTRO", "·", "BURGOS", "·", "VALLADOLID PLAZA", "·",
  "LEÓN · PONFERRADA", "·", "OFERTAS EXCLUSIVAS", "·", "SOLO PARA MIEMBROS", "·",
];

// ─── Offers Section ──────────────────────────────────────────────────────────
function OffersSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveCard((c) => (c + 1) % offerCards.length), 2200);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "#ffffff" }}>

      {/* Subtle dot grid */}
      <div className="pointer-events-none absolute inset-0" style={{ opacity: 0.06 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="offers-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#0038FF" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#offers-grid)" />
        </svg>
      </div>

      {/* Radial glow blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 78%, transparent 100%)",
        }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{ width: 600, height: 600, top: "-20%", left: "-10%", background: "radial-gradient(circle, rgba(0,56,255,0.07) 0%, transparent 70%)" }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ width: 500, height: 500, bottom: "-15%", right: "-5%", background: "radial-gradient(circle, rgba(204,255,0,0.15) 0%, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy + form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{ background: "rgba(0,56,255,0.06)", border: "1px solid rgba(0,56,255,0.2)" }}>
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: "#0038FF" }}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#0038FF" }}>
                Ofertas exclusivas
              </span>
            </div>

            <h2 className="font-black mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              <span style={{ color: "#0a0a0a" }}>Accede a las</span>
              <br />
              <span style={{ color: "#CCFF00" }}>mejores ofertas</span>
              <br />
              <span style={{ color: "#0a0a0a" }}>de </span>
              <span style={{ color: "#0038FF" }}>tus tiendas.</span>
            </h2>

            <p className="mb-10 text-base" style={{ color: "#6b7280", lineHeight: 1.8, maxWidth: 440 }}>
              Inicia sesión y recibe <span style={{ color: "#0038FF", fontWeight: 700 }}>descuentos exclusivos</span>, alertas de stock y
              ofertas flash de las tiendas más cercanas a ti.
              Solo para miembros <span style={{ color: "#CCFF00", fontWeight: 700 }}>Movil Guru</span>.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Email input */}
                  <div
                    className="flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-300"
                    style={{
                      background: "#f9fafb",
                      border: `1.5px solid ${focused ? "#0038FF" : "#e5e7eb"}`,
                      boxShadow: focused ? "0 0 0 4px rgba(0,56,255,0.08)" : "none",
                    }}
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" style={{ color: focused ? "#0038FF" : "#9ca3af" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="tu@email.com"
                      required
                      className="flex-1 bg-transparent outline-none text-sm"
                      style={{ color: "#0a0a0a", caretColor: "#0038FF" }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm tracking-wide"
                      style={{ background: "#CCFF00", color: "#000" }}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(204,255,0,0.5)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Bell className="w-4 h-4" />
                      Quiero mis ofertas
                    </motion.button>
                    <motion.a
                      href="/login"
                      className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm"
                      style={{ background: "#ffffff", color: "#0038FF", border: "1.5px solid #0038FF" }}
                      whileHover={{ scale: 1.02, background: "#f0f4ff" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Lock className="w-4 h-4" />
                      Iniciar sesión
                    </motion.a>
                  </div>

                  <p className="text-xs" style={{ color: "#9ca3af", paddingLeft: 4 }}>
                    Sin spam. Cancela cuando quieras. Solo ofertas reales.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-8 text-center"
                  style={{ background: "rgba(0,56,255,0.04)", border: "1.5px solid rgba(0,56,255,0.2)" }}
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Zap className="w-12 h-12" style={{ color: "#0038FF" }} />
                  </motion.div>
                  <h3 className="font-black text-xl mb-2" style={{ color: "#0038FF" }}>¡Ya eres miembro!</h3>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Recibirás las mejores ofertas de tus tiendas Movil Guru.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right — animated offer cards stack */}
          <motion.div
            className="relative flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Pulsing glow behind cards */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="rounded-3xl"
                style={{ width: 300, height: 200, background: `radial-gradient(ellipse, ${offerCards[activeCard].color}22 0%, transparent 70%)` }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Card stack — ghost cards behind */}
            <div className="relative w-80" style={{ height: 220 }}>
              {/* Ghost card 2 */}
              <div
                className="absolute rounded-2xl"
                style={{
                  inset: 0,
                  background: "#f3f4f6",
                  border: "1.5px solid #e5e7eb",
                  transform: "translateY(16px) scale(0.92)",
                  zIndex: 1,
                }}
              />
              {/* Ghost card 1 */}
              <div
                className="absolute rounded-2xl"
                style={{
                  inset: 0,
                  background: "#f9fafb",
                  border: "1.5px solid #e5e7eb",
                  transform: "translateY(8px) scale(0.96)",
                  zIndex: 2,
                }}
              />

              {/* Active card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  className="absolute rounded-2xl p-6 flex flex-col justify-between"
                  style={{
                    inset: 0,
                    zIndex: 3,
                    background: `linear-gradient(135deg, #ffffff 0%, ${offerCards[activeCard].color === "#CCFF00" ? "#f5ffe0" : "#eef2ff"} 100%)`,
                    border: `1.5px solid ${offerCards[activeCard].color}`,
                    boxShadow: `0 24px 60px ${offerCards[activeCard].color}25, 0 0 0 1px ${offerCards[activeCard].color}15`,
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                >
                  <div className="flex items-start justify-between">
                    <Tag className="w-5 h-5" style={{ color: offerCards[activeCard].color === "#CCFF00" ? "#5c7a00" : "#0038FF" }} />
                    <motion.div
                      className="px-2.5 py-1 rounded-full text-xs font-black tracking-widest"
                      style={{
                        background: `${offerCards[activeCard].color}20`,
                        color: offerCards[activeCard].color,
                        border: `1px solid ${offerCards[activeCard].color}50`,
                      }}
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      OFERTA
                    </motion.div>
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-widest uppercase mb-2"
                      style={{ color: "#9ca3af" }}>
                      {offerCards[activeCard].store}
                    </p>
                    <p className="text-2xl font-black" style={{ color: offerCards[activeCard].color === "#CCFF00" ? "#5c7a00" : "#0038FF", letterSpacing: "-0.02em" }}>
                      {offerCards[activeCard].offer}
                    </p>
                    <div className="flex items-center gap-1.5 mt-4">
                      <Lock className="w-3 h-3" style={{ color: "#9ca3af" }} />
                      <span className="text-xs" style={{ color: "#9ca3af" }}>Solo para miembros</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicator dots */}
            <div className="flex gap-2 items-center" style={{ zIndex: 10 }}>
              {offerCards.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveCard(i)}
                  className="rounded-full"
                  animate={{
                    width: i === activeCard ? 24 : 6,
                    background: i === activeCard ? offerCards[i].color : "rgba(255,255,255,0.2)",
                  }}
                  style={{ height: 6, flexShrink: 0 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom perks row */}
        <motion.div
          className="mt-20 pt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          style={{ borderTop: "1px solid #e5e7eb" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { Icon: Zap, label: "Ofertas flash", desc: "Antes que nadie", color: "#CCFF00" },
            { Icon: MapPin, label: "Por tienda", desc: "Solo las tuyas", color: "#0038FF" },
            { Icon: Sparkles, label: "Regalos", desc: "Por cada revisita", color: "#CCFF00" },
            { Icon: Lock, label: "100% privado", desc: "Sin datos de más", color: "#0038FF" },
          ].map((perk, i) => (
            <motion.div
              key={i}
              className="flex flex-col gap-2"
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <perk.Icon className="w-5 h-5" style={{ color: perk.color === "#CCFF00" ? "#5c7a00" : "#0038FF" }} />
              <p className="font-black text-sm" style={{ color: perk.color === "#CCFF00" ? "#5c7a00" : "#0038FF" }}>{perk.label}</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>{perk.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
