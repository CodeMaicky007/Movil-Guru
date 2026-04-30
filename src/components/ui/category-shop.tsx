"use client"

import dynamic from "next/dynamic"
import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import {
  ArrowRight,
  Heart,
  Plus,
  Star,
  ChevronDown,
  SlidersHorizontal,
  Truck,
  Shield,
  Zap,
  Leaf,
  Wrench,
  RotateCcw,
  Grid3x3,
  LayoutGrid,
} from "lucide-react"
import type { CategoryData, CategoryProduct } from "@/data/shop-categories"
import { SHOP_CATEGORIES } from "@/data/shop-categories"
import { useCart } from "@/context/cart-context"

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
)
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
)

const ICONS = {
  shield: Shield,
  truck: Truck,
  zap: Zap,
  leaf: Leaf,
  tools: Wrench,
  refresh: RotateCcw,
} as const

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
  )
}

function ProductCard({
  product,
  accent,
  onAdd,
}: {
  product: CategoryProduct
  accent: string
  onAdd: (p: CategoryProduct) => void
}) {
  const [liked, setLiked] = useState(false)
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[0.04]">
        {product.badge && (
          <div
            className="absolute top-4 left-4 z-10 font-black text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{
              background: accent,
              color: accent === "#CCFF00" ? "#000" : "#fff",
              boxShadow: `0 0 24px ${accent}80`,
            }}
          >
            {product.badge}
          </div>
        )}

        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute top-4 right-4 z-10 size-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
          aria-label="Favorito"
        >
          <Heart
            className="size-4 transition-colors"
            style={{ color: liked ? accent : "#fff", fill: liked ? accent : "transparent" }}
            strokeWidth={2}
          />
        </button>

        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => onAdd(product)}
            className="w-full bg-black text-white font-black text-xs uppercase tracking-[0.25em] py-3.5 rounded-full hover:text-black transition-colors flex items-center justify-center gap-2 border border-white/10"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = accent
              e.currentTarget.style.color = accent === "#CCFF00" ? "#000" : "#fff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "black"
              e.currentTarget.style.color = "#fff"
            }}
          >
            <Plus className="size-4" strokeWidth={3} />
            Añadir
          </button>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-1">
        {product.tag && (
          <span
            className="text-[10px] font-black uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            {product.tag}
          </span>
        )}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-base leading-tight text-white">{product.name}</h3>
          <div className="text-right shrink-0">
            <div className="font-black text-base text-white">{product.price}€</div>
            {product.oldPrice && (
              <div className="text-xs line-through text-white/40">{product.oldPrice}€</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">{product.color}</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-white/50 font-semibold">
            <Star className="size-2.5 fill-white/70" strokeWidth={0} />
            {product.rating} · {product.reviews}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function FaqItem({
  q,
  a,
  accent,
  open,
  onToggle,
}: {
  q: string
  a: string
  accent: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-black/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="font-black text-xl md:text-2xl uppercase tracking-tight text-black group-hover:opacity-80 transition-opacity">
          {q}
        </span>
        <span
          className="size-10 rounded-full flex items-center justify-center shrink-0 transition-transform"
          style={{
            background: accent,
            color: accent === "#CCFF00" ? "#000" : "#fff",
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <ChevronDown className="size-5" strokeWidth={3} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-16 text-neutral-600 text-base leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CategoryShop({ category }: { category: CategoryData }) {
  const [activeFilter, setActiveFilter] = useState(category.filters[0])
  const [sort, setSort] = useState("Destacados")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [openFaq, setOpenFaq] = useState(0)
  const { addItem } = useCart()

  const related = useMemo(
    () => category.related.map((s) => SHOP_CATEGORIES[s]).filter(Boolean),
    [category.related]
  )

  const handleAdd = (p: CategoryProduct) => {
    addItem({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      img: p.img,
      color: p.color,
      tag: p.tag,
    })
  }

  const accent = category.accent
  const secondary = category.secondary
  const accentText = accent === "#CCFF00" ? "#000" : "#fff"

  return (
    <main className="w-full bg-white">
      <AnnouncementBar />
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative w-full bg-[#060d12] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-25"
            style={{
              background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full opacity-25"
            style={{
              background: `radial-gradient(circle, ${secondary} 0%, transparent 70%)`,
              filter: "blur(90px)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-20 md:pb-28">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-10"
          >
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/tienda" className="hover:text-white transition-colors">Tienda</Link>
            <span>/</span>
            <span style={{ color: "#CCFF00" }}>{category.name}</span>
          </motion.nav>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-end">
            <div className="flex flex-col gap-7 min-w-0">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex self-start items-center gap-2 bg-white/[0.04] border border-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/70"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: "#CCFF00", boxShadow: "0 0 10px #CCFF00" }}
                />
                {category.kicker}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-[clamp(3rem,7.5vw,7rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase text-white break-words"
              >
                {category.headline}
                <br />
                <span
                  className="italic"
                  style={{
                    color: accent,
                    textShadow: `0 0 60px ${accent}66`,
                  }}
                >
                  {category.headlineAccent}
                </span>
                <span style={{ color: "#CCFF00" }}>.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed"
              >
                <span className="font-black text-white">{category.tagline}.</span>{" "}
                {category.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <a
                  href="#productos"
                  className="inline-flex items-center gap-3 font-black text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:scale-[1.03] active:scale-[0.98] transition-transform"
                  style={{
                    background: accent,
                    color: accentText,
                    boxShadow: `0 0 40px ${accent}66`,
                  }}
                >
                  Ver productos
                  <ArrowRight className="size-4" strokeWidth={3} />
                </a>
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-3 bg-transparent border border-white/20 text-white font-semibold text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:border-white/60 hover:bg-white/5 transition-colors"
                >
                  Todas las categorías
                </Link>
              </motion.div>

              <div className="flex items-center gap-10 mt-2 border-t border-white/10 pt-6">
                {[
                  { v: `${category.count}`, l: "Productos", highlight: false },
                  { v: "24h", l: "Envío express", highlight: false },
                  { v: "4.8★", l: "Rating medio", highlight: true },
                ].map((s) => (
                  <div key={s.l}>
                    <div
                      className="font-black text-2xl"
                      style={{ color: s.highlight ? "#CCFF00" : "#fff" }}
                    >
                      {s.v}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT hero image card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative min-w-0"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                <img
                  src={category.heroImg}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060d12] via-transparent to-transparent" />

                <div
                  className="absolute top-6 right-6 rounded-2xl px-4 py-3 rotate-3"
                  style={{
                    background: accent,
                    color: accentText,
                    boxShadow: `0 10px 40px ${accent}66`,
                  }}
                >
                  <div className="text-[9px] font-black uppercase tracking-[0.25em]">
                    Desde
                  </div>
                  <div className="font-black text-2xl leading-none">
                    {category.products[0]?.price}€
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <div
                      className="text-[10px] font-black uppercase tracking-[0.3em] mb-1"
                      style={{ color: accent }}
                    >
                      Producto destacado
                    </div>
                    <div className="text-white font-bold text-lg leading-tight">
                      {category.products[0]?.name}
                    </div>
                  </div>
                  <a
                    href="#productos"
                    className="size-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: accent, color: accentText }}
                    aria-label="Ver producto"
                  >
                    <ArrowRight className="size-5" strokeWidth={3} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#060d12] to-transparent pointer-events-none" />
      </section>

      {/* ═══ FILTERS + GRID (dark) ═══ */}
      <section id="productos" className="relative w-full bg-[#060d12] py-16 md:py-24 overflow-hidden">
        <div
          className="absolute top-40 right-10 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${secondary} 0%, transparent 70%)`,
            filter: "blur(100px)",
          }}
        />

        <div className="relative max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="size-2 rounded-full animate-pulse"
                  style={{ background: "#CCFF00", boxShadow: "0 0 10px #CCFF00" }}
                />
                <p
                  className="text-xs font-black uppercase tracking-[0.3em]"
                  style={{ color: "#CCFF00" }}
                >
                  Todo el catálogo
                </p>
              </div>
              <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-white">
                Explora el{" "}
                <span className="italic" style={{ color: "#CCFF00" }}>
                  catálogo
                </span>
              </h2>
            </div>

            {/* Sort + view toggle */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-white/[0.04] border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full pl-5 pr-10 py-3 hover:border-white/30 transition-colors focus:outline-none cursor-pointer"
                >
                  <option>Destacados</option>
                  <option>Precio ↑</option>
                  <option>Precio ↓</option>
                  <option>Novedades</option>
                  <option>Más vendidos</option>
                </select>
                <ChevronDown className="size-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
              </div>

              <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`size-9 rounded-full flex items-center justify-center transition-colors ${view === "grid" ? "" : "text-white/40 hover:text-white"
                    }`}
                  style={view === "grid" ? { background: accent, color: accentText } : {}}
                  aria-label="Grid"
                >
                  <LayoutGrid className="size-4" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`size-9 rounded-full flex items-center justify-center transition-colors ${view === "list" ? "" : "text-white/40 hover:text-white"
                    }`}
                  style={view === "list" ? { background: accent, color: accentText } : {}}
                  aria-label="List"
                >
                  <Grid3x3 className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-white/[0.08]">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 pr-4">
              <SlidersHorizontal className="size-3.5" strokeWidth={2.5} />
              Filtrar
            </div>
            {category.filters.map((f) => {
              const active = activeFilter === f
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2.5 rounded-full border transition-colors ${active
                    ? ""
                    : "bg-transparent text-white/70 border-white/15 hover:border-white/40"
                    }`}
                  style={active ? { background: accent, color: accentText, borderColor: accent } : {}}
                >
                  {f}
                </button>
              )
            })}
          </div>

          {/* Grid */}
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                : "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            }
          >
            {category.products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              >
                <ProductCard
                  product={p}
                  accent={accent}
                  onAdd={handleAdd}
                />
              </motion.div>
            ))}
          </div>

          {/* Load more */}
          <div className="flex justify-center mt-16">
            <button className="group inline-flex items-center gap-3 bg-transparent border border-white/15 text-white font-black text-xs uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:border-white/50 hover:bg-white/[0.04] transition-colors">
              Cargar más
              <span
                className="size-6 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform"
                style={{ background: accent, color: accentText }}
              >
                <Plus className="size-3.5" strokeWidth={3} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS (light) ═══ */}
      <section className="w-full bg-white py-20 md:py-28">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.3em] mb-3"
                style={{ color: "#0038FF" }}
              >
                Por qué nosotros
              </p>
              <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-black">
                <span style={{ color: "#0038FF" }}>Probado.</span>
                <br />
                <span
                  style={{
                    color: "#CCFF00",
                    WebkitTextStroke: "1px #b8e600",
                  }}
                >
                  No inventado.
                </span>
              </h2>
            </div>
            <p className="text-neutral-500 max-w-xs text-sm leading-relaxed">
              Cada {category.name.toLowerCase()} de este catálogo pasa por nuestro taller antes
              de salir a la web. Si no cumple, fuera.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {category.benefits.map((b, i) => {
              const Icon = ICONS[b.icon]
              const iconColor = i === 1 ? "#CCFF00" : "#0038FF"
              const titleColor = i === 1 ? "#CCFF00" : "#0038FF"
              const titleStroke = i === 1 ? "1px #b8e600" : ""
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative rounded-2xl border border-black/10 p-8 overflow-hidden hover:border-black/30 transition-colors"
                >
                  <div
                    className="absolute -top-20 -right-20 size-48 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-30"
                    style={{ background: "#CCFF00" }}
                  />
                  <Icon
                    className="size-8 mb-4 relative z-10"
                    style={{ color: iconColor }}
                    strokeWidth={2}
                  />
                  <h3
                    className="font-black text-xl uppercase tracking-tight mb-2 relative z-10"
                    style={{ color: titleColor, WebkitTextStroke: titleStroke }}
                  >
                    {b.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed relative z-10">
                    {b.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ FAQ (light) ═══ */}
      <section className="w-full bg-white pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.3em] mb-3"
                style={{ color: "#0038FF" }}
              >
                Dudas frecuentes
              </p>
              <h2 className="font-black text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight text-black sticky top-24">
                Todo lo que{" "}
                <span className="italic" style={{ color: "#CCFF00", WebkitTextStroke: "1px #b8e600" }}>
                  preguntas.
                </span>
              </h2>
            </div>
            <div>
              {category.faqs.map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  accent={accent}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RELATED CATEGORIES ═══ */}
      <section className="w-full bg-[#060d12] py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute -top-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p
                className="text-xs font-black uppercase tracking-[0.3em] mb-3"
                style={{ color: "#CCFF00" }}
              >
                También te puede interesar
              </p>
              <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-white">
                Completa el{" "}
                <span className="italic" style={{ color: "#CCFF00" }}>
                  set.
                </span>
              </h2>
            </div>
            <Link
              href="/tienda"
              className="group flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
            >
              Todas las categorías
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-md:gap-3">
            {related.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/tienda/${cat.id}`}
                  className="group block relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.04]"
                >
                  <img
                    src={cat.heroBgImg}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <div
                    className="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center font-black text-[10px]"
                    style={{
                      background: cat.accent,
                      color: cat.accent === "#CCFF00" ? "#000" : "#fff",
                    }}
                  >
                    {cat.count}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3
                      className="font-black text-3xl md:text-4xl uppercase tracking-tight leading-none mb-2"
                      style={{ color: cat.accent }}
                    >
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">
                      Ver colección
                      <ArrowRight
                        className="size-3 group-hover:translate-x-1 transition-transform"
                        strokeWidth={3}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA NEWSLETTER ═══ */}
      <section className="w-full relative overflow-hidden py-20 md:py-28 bg-[#CCFF00]">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, #0038FF 0%, transparent 40%), radial-gradient(circle at 80% 80%, #000 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center px-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] mb-5 text-[#0038FF]">
            Drops exclusivos de {category.name}
          </p>
          <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight text-black mb-6">
            No te pierdas
            <br />
            <span className="italic text-[#0038FF]">el siguiente drop.</span>
          </h2>
          <p className="text-black/70 text-base md:text-lg mb-10 max-w-lg mx-auto">
            Accesorios nuevos, descuentos de catálogo y primeras unidades — directo a tu email.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="tu@email.com"
              className="flex-1 bg-black/10 border border-black/20 rounded-full px-6 py-4 text-black placeholder:text-black/40 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              className="bg-black text-[#CCFF00] font-black text-xs uppercase tracking-[0.25em] px-8 py-4 rounded-full hover:scale-[1.03] transition-transform"
            >
              Unirme
            </button>
          </form>
          <p className="text-black/50 text-[11px] mt-5 font-black uppercase tracking-[0.2em]">
            Sin spam. Solo lo bueno.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
