"use client"

import dynamic from "next/dynamic"
import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart, CartItem } from "@/context/cart-context"
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, Truck, Shield, Zap } from "lucide-react"

const Header = dynamic(() => import("@/components/ui/header-3").then(m => m.Header), { ssr: false })
const Footer = dynamic(() => import("@/components/ui/footer-section").then(m => m.Footer), { ssr: false })

// ─── Cart Item Row ────────────────────────────────────────────────────────────
function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.22 } }}
      className="group flex gap-5 py-6 border-b border-white/[0.06]"
    >
      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-white/[0.04] shrink-0 border border-white/[0.06]">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        {item.tag && (
          <div className="absolute top-1.5 left-1.5 bg-[#CCFF00] text-black text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-full leading-none">
            {item.tag}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-bold text-white text-base md:text-lg leading-tight truncate">
              {item.name}
            </h3>
            <p className="text-white/40 text-xs mt-1 font-medium">{item.color}</p>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="size-7 flex items-center justify-center rounded-full text-white/20 hover:text-white hover:bg-white/10 transition-all shrink-0"
            aria-label="Eliminar"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center rounded-full border border-white/10 overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="size-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <Minus className="size-3" strokeWidth={3} />
            </button>
            <span className="w-8 text-center text-white font-black text-sm select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="size-9 flex items-center justify-center bg-[#CCFF00] text-black hover:bg-[#d4ff33] transition-colors"
            >
              <Plus className="size-3" strokeWidth={3} />
            </button>
          </div>

          <div className="text-right">
            <div className="font-black text-white text-base md:text-lg">
              {(item.price * item.quantity).toFixed(2)}€
            </div>
            {item.quantity > 1 && (
              <div className="text-white/25 text-xs">
                {item.price.toFixed(2)}€ × {item.quantity}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-8">
      <div className="relative">
        <div className="size-32 rounded-full border border-white/[0.08] flex items-center justify-center bg-white/[0.02]">
          <ShoppingBag className="size-12 text-white/15" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-2 -right-2 size-8 rounded-full bg-[#CCFF00] flex items-center justify-center font-black text-black text-sm shadow-[0_0_24px_rgba(204,255,0,0.4)]">
          0
        </div>
      </div>
      <div className="text-center">
        <h2 className="font-black text-4xl md:text-5xl uppercase text-white tracking-tight leading-none">
          Carrito vacío
        </h2>
        <p className="text-white/35 mt-3 text-base">Aún no has añadido ningún producto.</p>
      </div>
      <Link
        href="/tienda"
        className="inline-flex items-center gap-3 bg-[#CCFF00] text-black font-black text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:scale-[1.03] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(204,255,0,0.3)]"
      >
        Ir a la tienda
        <ArrowRight className="size-4" strokeWidth={3} />
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CarritoPage() {
  const { items, total, count } = useCart()
  const [promo, setPromo] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState("")
  const router = useRouter()

  const shipping = total >= 50 ? 0 : 4.90
  const discount = promoApplied ? +(total * 0.1).toFixed(2) : 0
  const finalTotal = total + shipping - discount

  const applyPromo = () => {
    if (promo.toUpperCase() === "GURU10") {
      setPromoApplied(true)
      setPromoError("")
    } else {
      setPromoError("Código no válido. Prueba GURU10")
      setPromoApplied(false)
    }
  }

  return (
    <main className="w-full bg-[#060d12] min-h-screen">
      <Header dark />

      {/* ── Top bar ── */}
      <div className="relative border-b border-white/[0.06] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle at 70% 60%, #0038FF 0%, transparent 55%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-10 flex items-end justify-between flex-wrap gap-5">
          <div>
            <nav className="flex items-center gap-2 text-white/25 text-[10px] font-black uppercase tracking-[0.25em] mb-4">
              <Link href="/tienda" className="hover:text-white transition-colors">Tienda</Link>
              <span>/</span>
              <span className="text-white">Carrito</span>
            </nav>
            <h1 className="font-black text-5xl md:text-7xl lg:text-8xl uppercase leading-none tracking-tight text-white">
              CARRITO
              <span
                className="ml-3 text-[#CCFF00]"
                style={{ textShadow: "0 0 30px rgba(204,255,0,0.5)" }}
              >
                ({count})
              </span>
            </h1>
          </div>
          <Link
            href="/tienda"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-semibold transition-colors"
          >
            ← Seguir comprando
          </Link>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-24">
        {count === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">

            {/* ── Items ── */}
            <div>
              <div className="flex items-center justify-between mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-white/20 border-b border-white/[0.06] pb-3">
                <span>Producto</span>
                <span>Importe</span>
              </div>

              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </AnimatePresence>

              {/* Value strip */}
              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, text: "Envío gratis +50€" },
                  { icon: Shield, text: "Garantía 30 días" },
                  { icon: Zap, text: "Entrega 24–48h" },
                ].map(v => (
                  <div
                    key={v.text}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] py-4 px-3 text-center"
                  >
                    <v.icon className="size-5 text-[#CCFF00]" strokeWidth={1.8} />
                    <span className="text-white/40 text-[11px] font-semibold leading-tight">{v.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Summary ── */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 flex flex-col gap-6">
                <h2 className="font-black text-lg uppercase tracking-[0.1em] text-white">
                  Resumen del pedido
                </h2>

                {/* Line items */}
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Subtotal ({count} art.)</span>
                    <span className="font-bold text-white">{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Envío</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-[#CCFF00]">Gratis</span>
                    ) : (
                      <span className="font-bold text-white">{shipping.toFixed(2)}€</span>
                    )}
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between">
                      <span className="text-[#CCFF00] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5">
                        <Tag className="size-3" />GURU10 (–10%)
                      </span>
                      <span className="font-bold text-[#CCFF00]">–{discount.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="border-t border-white/[0.08] pt-3 flex justify-between items-center">
                    <span className="font-black text-white uppercase tracking-tight">Total</span>
                    <span className="font-black text-2xl text-white">{finalTotal.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Promo code */}
                {!promoApplied ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                      Código promocional
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={promo}
                        onChange={e => { setPromo(e.target.value); setPromoError("") }}
                        onKeyDown={e => e.key === "Enter" && applyPromo()}
                        placeholder="GURU10"
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CCFF00]/50 transition-colors"
                      />
                      <button
                        onClick={applyPromo}
                        className="px-4 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white font-black text-xs uppercase tracking-[0.15em] rounded-xl transition-colors whitespace-nowrap"
                      >
                        OK
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-400 text-xs font-medium">{promoError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-xl px-4 py-3">
                    <Tag className="size-4 text-[#CCFF00] shrink-0" />
                    <span className="text-[#CCFF00] font-black text-xs uppercase tracking-[0.2em] flex-1">
                      10% aplicado
                    </span>
                    <button
                      onClick={() => { setPromoApplied(false); setPromo("") }}
                      className="text-[#CCFF00]/50 hover:text-[#CCFF00] transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => router.push("/tienda/checkout")}
                  className="w-full flex items-center justify-center gap-3 bg-[#CCFF00] text-black font-black text-sm uppercase tracking-[0.25em] py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_40px_rgba(204,255,0,0.25)]"
                >
                  Tramitar pedido
                  <ArrowRight className="size-4" strokeWidth={3} />
                </button>

                <p className="text-center text-white/20 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Pago 100% seguro · SSL cifrado
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
