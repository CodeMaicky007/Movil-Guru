"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Search,
  Zap,
  Truck,
  Shield,
  ArrowRight,
  Plus,
  Star,
} from "lucide-react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);
const LayeredText = dynamic(
  () => import("@/components/ui/layered-text").then((m) => m.LayeredText),
  { ssr: false }
);

// ─── Data ────────────────────────────────────────────────────────────────────
const categories = [
  {
    id: "fundas",
    name: "Fundas",
    count: 124,
    img: "/images/funda.jpg",
    accent: "#CCFF00",
  },
  {
    id: "cristales",
    name: "Cristales",
    count: 38,
    img: "/images/vidrio-templado-vidrio-telefono-inteligente-vidrio-iphone_967273-14518.jpg",
    accent: "#0038FF",
  },
  {
    id: "cargadores",
    name: "Cargadores",
    count: 56,
    img: "/images/cargador-inalambrico-ksix-3en1-15w-carga-rapida-simultanea-para-smartphones-qi-apple-watch-y-airpods-cargadorcable-negro.jpg",
    accent: "#CCFF00",
  },
  {
    id: "audio",
    name: "Audio",
    count: 42,
    img: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&w=800",
    accent: "#0038FF",
  },
  {
    id: "soportes",
    name: "Soportes",
    count: 19,
    img: "/images/soporte-movil-universal-ajustable-cellularline (1).jpg",
    accent: "#CCFF00",
  },
];

const featuredDrops = [
  {
    id: 1,
    name: "Funda Armor Kevlar",
    tag: "Drop exclusivo",
    price: "34.90",
    oldPrice: "49.90",
    color: "Negro militar",
    img: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=900",
    badge: "-30%",
  },
  {
    id: 2,
    name: "Cristal Templado 9H",
    tag: "Best seller",
    price: "12.90",
    oldPrice: null,
    color: "Transparente",
    img: "https://images.pexels.com/photos/1038628/pexels-photo-1038628.jpeg?auto=compress&w=900",
    badge: "NUEVO",
  },
  {
    id: 3,
    name: "Cargador GaN 65W",
    tag: "Pro Series",
    price: "44.90",
    oldPrice: "59.90",
    color: "Blanco mate",
    img: "https://images.pexels.com/photos/4526444/pexels-photo-4526444.jpeg?auto=compress&w=900",
    badge: "HOT",
  },
  {
    id: 4,
    name: "Auriculares Guru Buds",
    tag: "Edición Lima",
    price: "79.00",
    oldPrice: null,
    color: "Lima neón",
    img: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&w=900",
    badge: "EXCLUSIVO",
  },
];

const bestsellers = [
  {
    id: 10,
    name: "MagSafe Glow",
    price: "29.90",
    img: "https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&w=700",
    rating: 4.9,
    reviews: 1284,
  },
  {
    id: 11,
    name: "Funda Clear Shock",
    price: "19.90",
    img: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=700",
    rating: 4.8,
    reviews: 942,
  },
  {
    id: 12,
    name: "Llavero Guru Metal",
    price: "9.90",
    img: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&w=700",
    rating: 5.0,
    reviews: 312,
  },
  {
    id: 13,
    name: "Cable USB-C Braided",
    price: "14.90",
    img: "https://images.pexels.com/photos/4526446/pexels-photo-4526446.jpeg?auto=compress&w=700",
    rating: 4.7,
    reviews: 2104,
  },
  {
    id: 14,
    name: "Soporte Magnético Car",
    price: "24.90",
    img: "https://images.pexels.com/photos/3944405/pexels-photo-3944405.jpeg?auto=compress&w=700",
    rating: 4.8,
    reviews: 687,
  },
  {
    id: 15,
    name: "Anillo Pop Ring",
    price: "6.90",
    img: "https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&w=700",
    rating: 4.6,
    reviews: 1456,
  },
];

// ─── Small components ────────────────────────────────────────────────────────
function AnnouncementBar() {
  return (
    <div className="w-full bg-[#CCFF00] text-black text-xs font-black uppercase tracking-[0.25em] py-2.5 overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap animate-[slide_28s_linear_infinite]">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-16 shrink-0">
            <span>🔥 Envío gratis +50€</span>
            <span>⚡ Entrega en 24h</span>
            <span>♻ Garantía de por vida</span>
            <span>★ 10.000+ clientes</span>
            <span>🔥 Envío gratis +50€</span>
            <span>⚡ Entrega en 24h</span>
            <span>♻ Garantía de por vida</span>
            <span>★ 10.000+ clientes</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function ProductCard({
  product,
  dark = false,
}: {
  product: {
    id: number;
    name: string;
    price: string;
    oldPrice?: string | null;
    tag?: string;
    color?: string;
    img: string;
    badge?: string;
  };
  dark?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col"
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-2xl ${dark ? "bg-white/[0.04]" : "bg-neutral-100"
          }`}
      >
        {/* Badge */}
        {product.badge && (
          <div
            className="absolute top-4 left-4 z-10 bg-[#CCFF00] text-black font-black text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{ boxShadow: "0 0 24px rgba(204,255,0,0.5)" }}
          >
            {product.badge}
          </div>
        )}

        {/* Like */}
        <button
          onClick={() => setLiked((v) => !v)}
          className={`absolute top-4 right-4 z-10 size-9 rounded-full flex items-center justify-center transition-all ${dark
            ? "bg-white/10 hover:bg-white/20 border border-white/10"
            : "bg-white/90 hover:bg-white shadow-sm"
            }`}
          aria-label="Favorito"
        >
          <Heart
            className={`size-4 transition-colors ${liked ? "fill-[#CCFF00] text-[#CCFF00]" : dark ? "text-white" : "text-black"
              }`}
            strokeWidth={2}
          />
        </button>

        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Quick add */}
        <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-full bg-black text-white font-black text-xs uppercase tracking-[0.25em] py-3.5 rounded-full hover:bg-[#CCFF00] hover:text-black transition-colors flex items-center justify-center gap-2">
            <Plus className="size-4" strokeWidth={3} />
            Añadir
          </button>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-1">
        {product.tag && (
          <span
            className={`text-[10px] font-black uppercase tracking-[0.25em] ${dark ? "text-[#CCFF00]" : "text-[#0038FF]"
              }`}
          >
            {product.tag}
          </span>
        )}
        <div className="flex items-start justify-between gap-3">
          <h3 className={`font-bold text-base leading-tight ${dark ? "text-white" : "text-black"}`}>
            {product.name}
          </h3>
          <div className="text-right shrink-0">
            <div className={`font-black text-base ${dark ? "text-white" : "text-black"}`}>
              {product.price}€
            </div>
            {product.oldPrice && (
              <div className={`text-xs line-through ${dark ? "text-white/40" : "text-neutral-400"}`}>
                {product.oldPrice}€
              </div>
            )}
          </div>
        </div>
        {product.color && (
          <span className={`text-xs ${dark ? "text-white/50" : "text-neutral-500"}`}>
            {product.color}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TiendaPage() {
  return (
    <main className="w-full bg-white">
      <AnnouncementBar />
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative w-full bg-[#060d12] overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-25"
            style={{
              background: "radial-gradient(circle, #CCFF00 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, #0038FF 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-24">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-end">
            {/* LEFT: Copy */}
            <div className="flex flex-col gap-8">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex self-start items-center gap-2 bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/70"
              >
                <span className="size-1.5 rounded-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]" />
                Nueva colección · Otoño 2026
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.82] tracking-[-0.04em] uppercase text-white"
              >
                Protege
                <br />
                <span className="text-[#0038FF]">con</span>{" "}
                <span
                  className="text-[#CCFF00] italic"
                  style={{ textShadow: "0 0 60px rgba(204,255,0,0.4)" }}
                >
                  estilo
                </span>
                <span className="text-[#CCFF00]">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed"
              >
                Fundas, cristales, cargadores y accesorios diseñados para durar.
                Probados en nuestro propio taller — los que usamos, los que recomendamos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  href="#drops"
                  className="inline-flex items-center gap-3 bg-[#CCFF00] text-black font-black text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(204,255,0,0.4)]"
                >
                  Comprar ahora
                  <ArrowRight className="size-4" strokeWidth={3} />
                </Link>
                <Link
                  href="#categorias"
                  className="inline-flex items-center gap-3 bg-transparent border border-white/20 text-white font-semibold text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:border-white/60 hover:bg-white/5 transition-colors"
                >
                  Ver categorías
                </Link>
              </motion.div>

              {/* Stats */}
              <div className="flex items-center gap-10 mt-4 border-t border-white/10 pt-6">
                {[
                  { v: "10k+", l: "Pedidos" },
                  { v: "24h", l: "Envío express" },
                  { v: "4.9★", l: "Rating" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-black text-2xl text-white">{s.v}</div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Featured product */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                <img
                  src="https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=1200"
                  alt="Funda destacada"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d12] via-transparent to-transparent" />

              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section id="categorias" className="w-full bg-white py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF] mb-3">
                Categorías
              </p>
              <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-black">
                <span className="text-[#0038FF]">Compra</span> por
                <br />
                <span className="text-[#CCFF00]">lo que </span><span className="text-black">necesitas</span>
              </h2>
            </div>
            <Link
              href="#"
              className="group flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-black hover:text-[#0038FF] transition-colors"
            >
              Ver todo
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/tienda/${cat.id}`}
                  className="group block relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div
                    className="absolute top-3 right-3 size-7 rounded-full flex items-center justify-center font-black text-[10px]"
                    style={{ background: cat.accent, color: cat.accent === "#CCFF00" ? "#000" : "#fff" }}
                  >
                    {cat.count}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3
                      className="font-black text-xl md:text-2xl uppercase tracking-tight leading-none"
                      style={{ color: cat.accent }}
                    >
                      {cat.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em]">
                      Ver
                      <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED DROPS ═══ */}
      <section id="drops" className="w-full bg-[#060d12] py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute -top-20 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #CCFF00 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="size-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00]">
                  Drops de la semana
                </p>
              </div>
              <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-white">
                Los más{" "}
                <span className="text-[#CCFF00] italic">buscados</span>
              </h2>
            </div>
            <div className="flex gap-2">
              {["Todo", "Nuevo", "Ofertas", "Premium"].map((f, i) => (
                <button
                  key={f}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-full border transition-colors ${i === 0
                    ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                    : "bg-transparent text-white/70 border-white/15 hover:border-white/40"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredDrops.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <ProductCard product={p} dark />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BESTSELLERS ═══ */}
      <section className="w-full bg-white py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF] mb-3">
                Más vendidos
              </p>
              <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-black">
                <span className="text-[#0038FF]">Probados</span> por
                <br />
                <span className="text-[#CCFF00]" style={{WebkitTextStroke:"1px #b8e600"}}>miles.</span>
              </h2>
            </div>
            <p className="text-neutral-500 max-w-xs text-sm leading-relaxed">
              Los accesorios que más han pasado por nuestro taller —
              y los que menos han vuelto.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {bestsellers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group flex flex-col"
              >
                <Link href="#" className="block relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-black">
                    <Star className="size-2.5 fill-black" strokeWidth={0} />
                    {p.rating}
                  </div>
                </Link>
                <h3 className="font-bold text-sm text-black leading-tight line-clamp-1">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-black text-sm text-black">{p.price}€</span>
                  <span className="text-[10px] text-neutral-500 font-semibold">
                    {p.reviews} reseñas
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUE BANNER ═══ */}
      <section className="w-full bg-white pb-20 md:pb-28">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Truck, title: "Envío 24h", desc: "Pedidos antes de las 17h, entrega al día siguiente." },
              { icon: Shield, title: "Garantía real", desc: "Cambio sin preguntas durante los primeros 30 días." },
              { icon: Zap, title: "Probado en taller", desc: "Solo vendemos lo que usamos en nuestras reparaciones." },
            ].map((v) => (
              <div
                key={v.title}
                className="group relative rounded-2xl border border-black/10 p-8 overflow-hidden hover:border-black/30 transition-colors"
              >
                <div className="absolute -top-20 -right-20 size-48 rounded-full bg-[#CCFF00]/0 group-hover:bg-[#CCFF00]/30 blur-2xl transition-colors duration-500" />
                <v.icon className="size-8 text-[#0038FF] mb-4 relative z-10" strokeWidth={2} />
                <h3 className="font-black text-xl text-black uppercase tracking-tight mb-2 relative z-10">
                  <span className="text-[#0038FF]">{v.title}</span>
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed relative z-10">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER CTA ═══ */}
      <section className="w-full bg-[#060d12] relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 30%, #0038FF 0%, transparent 40%), radial-gradient(circle at 20% 80%, #CCFF00 0%, transparent 40%)",
            filter: "blur(100px)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center px-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-5">
            Drop list
          </p>
          <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-white mb-6">
            Entra antes
            <br />
            <span className="text-[#CCFF00] italic">que los demás.</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg mb-10 max-w-lg mx-auto">
            Acceso anticipado a drops, descuentos exclusivos y las primeras unidades de cada colección.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="tu@email.com"
              className="flex-1 bg-white/5 border border-white/15 rounded-full px-6 py-4 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#CCFF00] transition-colors"
            />
            <button
              type="submit"
              className="bg-[#CCFF00] text-black font-black text-xs uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:scale-[1.03] transition-transform"
            >
              Unirme
            </button>
          </form>
          <p className="text-white/30 text-[11px] mt-5 font-semibold uppercase tracking-[0.2em]">
            Sin spam. Solo lo bueno.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
