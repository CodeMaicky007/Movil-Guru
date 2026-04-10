"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { motion } from "motion/react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories = ["Todos", "Consejos", "Tecnología", "Guías", "Noticias"];

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const posts: Post[] = [
  {
    slug: "proteger-pantalla-movil",
    title: "7 formas reales de proteger la pantalla de tu móvil (que sí funcionan)",
    excerpt:
      "Más allá del cristal templado: lo que realmente marca la diferencia entre una pantalla intacta y una visita al taller.",
    category: "Consejos",
    date: "8 abril 2026",
    readTime: "5 min",
    image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&w=800",
    featured: true,
  },
  {
    slug: "bateria-se-gasta-rapido",
    title: "¿Por qué mi batería dura cada vez menos? La explicación técnica",
    excerpt:
      "Los ciclos de carga, la temperatura y los hábitos que destruyen tu batería más rápido de lo que crees.",
    category: "Tecnología",
    date: "3 abril 2026",
    readTime: "7 min",
    image: "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&w=800",
    featured: true,
  },
  {
    slug: "iphone-vs-samsung-reparabilidad",
    title: "iPhone vs Samsung: ¿cuál es más fácil (y barato) de reparar en 2026?",
    excerpt:
      "Comparamos precio de piezas, disponibilidad, tiempo de reparación y complejidad técnica modelo a modelo.",
    category: "Tecnología",
    date: "28 marzo 2026",
    readTime: "8 min",
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&w=800",
  },
  {
    slug: "copia-seguridad-antes-reparar",
    title: "Cómo hacer una copia de seguridad completa antes de reparar tu móvil",
    excerpt:
      "Paso a paso para iPhone y Android. Incluye fotos, WhatsApp, contactos y datos de apps.",
    category: "Guías",
    date: "22 marzo 2026",
    readTime: "6 min",
    image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&w=800",
  },
  {
    slug: "moviles-plegables-merecen-pena",
    title: "Móviles plegables en 2026: ¿merecen la pena o son un problema de reparación?",
    excerpt:
      "Analizamos la durabilidad real de Galaxy Z Fold, Z Flip y Motorola Razr tras miles de reparaciones.",
    category: "Tecnología",
    date: "15 marzo 2026",
    readTime: "9 min",
    image: "https://images.pexels.com/photos/13568327/pexels-photo-13568327.jpeg?auto=compress&w=800",
  },
  {
    slug: "agua-movil-que-hacer",
    title: "Se me ha caído el móvil al agua: lo que SÍ y lo que NO debes hacer",
    excerpt:
      "Olvida el arroz. Te contamos el protocolo real que maximiza las posibilidades de recuperación.",
    category: "Consejos",
    date: "8 marzo 2026",
    readTime: "4 min",
    image: "https://images.pexels.com/photos/1084510/pexels-photo-1084510.jpeg?auto=compress&w=800",
  },
  {
    slug: "derecho-reparar-europa",
    title: "El derecho a reparar llega a Europa: qué cambia para ti",
    excerpt:
      "La nueva normativa europea obliga a los fabricantes a dar acceso a piezas y manuales. Te explicamos qué significa.",
    category: "Noticias",
    date: "1 marzo 2026",
    readTime: "6 min",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&w=800",
  },
  {
    slug: "elegir-cristal-templado",
    title: "Guía definitiva para elegir cristal templado (no todos protegen igual)",
    excerpt:
      "Dureza 9H, borde curvado, oleofóbico… Separamos el marketing de lo que importa de verdad.",
    category: "Guías",
    date: "22 febrero 2026",
    readTime: "5 min",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&w=800",
  },
  {
    slug: "señales-cambiar-bateria",
    title: "5 señales de que necesitas cambiar la batería de tu móvil ya",
    excerpt:
      "No esperes a que se hinche. Estas son las señales tempranas que indican que tu batería está al límite.",
    category: "Consejos",
    date: "14 febrero 2026",
    readTime: "4 min",
    image: "https://images.pexels.com/photos/4195326/pexels-photo-4195326.jpeg?auto=compress&w=800",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const featured = posts.filter((p) => p.featured);
  const filtered =
    activeCategory === "Todos"
      ? posts.filter((p) => !p.featured)
      : posts.filter((p) => p.category === activeCategory && !p.featured);

  return (
    <main className="w-full bg-white">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-[#0038FF] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(204,255,0,0.1),transparent_65%)] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="bg-white/10 border border-white/20 text-white/80 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Movil Guru · Blog
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
              BLOG
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-white/70 text-base md:text-lg leading-relaxed max-w-lg"
          >
            Consejos prácticos, novedades del sector y guías que te ayudan a cuidar tu dispositivo y tomar mejores decisiones.
          </motion.p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
      </div>

      {/* ── Featured ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-black uppercase tracking-[0.25em] text-[#0038FF] mb-6"
        >
          Destacados
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((post, i) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[16/10] block"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-3">
                  {post.category}
                </span>
                <h3
                  className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight group-hover:text-[#CCFF00] transition-colors duration-300"
                  style={{ fontFamily: "var(--font-display, inherit)" }}
                >
                  {post.title}
                </h3>
                <p className="text-white/50 text-sm mt-2 leading-relaxed line-clamp-2 hidden md:block">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-white/40 font-medium">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{post.readTime} lectura</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── All posts ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: activeCategory === cat ? "#0038FF" : "#0a0a0a08",
                color: activeCategory === cat ? "#fff" : "#0a0a0a80",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-2xl overflow-hidden border border-[#0a0a0a]/5 hover:border-[#0038FF]/20 hover:shadow-[0_4px_24px_rgba(0,56,255,0.06)] transition-all duration-200 block"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0038FF]">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#0a0a0a]/15" />
                  <span className="text-[10px] text-[#0a0a0a]/35 font-medium">{post.readTime}</span>
                </div>
                <h3 className="font-bold text-[#0a0a0a] text-sm leading-snug mb-2 group-hover:text-[#0038FF] transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#0a0a0a]/45 text-xs leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <p className="text-[10px] text-[#0a0a0a]/30 font-medium mt-3">{post.date}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-bold text-[#0a0a0a]/40">No hay artículos en esta categoría todavía.</p>
          </div>
        )}
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-3">
              Newsletter
            </p>
            <h2
              className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              Recibe consejos que protegen tu móvil
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Un email al mes con guías, ofertas exclusivas y novedades del sector. Sin spam — lo prometemos.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 bg-white/10 border border-white/15 rounded-xl px-5 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#CCFF00] transition-colors duration-200"
              />
              <button
                type="submit"
                className="bg-[#CCFF00] text-black font-black text-sm px-6 py-3 rounded-xl hover:shadow-[0_0_24px_rgba(204,255,0,0.35)] hover:scale-[1.02] transition-all duration-200 active:scale-95 shrink-0"
              >
                Suscribirme
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
