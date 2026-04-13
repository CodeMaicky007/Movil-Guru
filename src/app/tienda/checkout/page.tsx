"use client"

import dynamic from "next/dynamic"
import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "next-view-transitions"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import {
  Check, ArrowLeft, ArrowRight, CreditCard, Smartphone, Lock,
  Truck, Package, Shield,
} from "lucide-react"

const Header = dynamic(() => import("@/components/ui/header-3").then(m => m.Header), { ssr: false })

const STEPS = ["Envío", "Pago", "Revisión"]

// ─── Visual Credit Card ───────────────────────────────────────────────────────
function CreditCardVisual({ number, holder, expiry, flipped }: {
  number: string; holder: string; expiry: string; flipped: boolean
}) {
  const raw = number.replace(/\s/g, "")
  const display = (raw + "················").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()

  return (
    <div className="w-full max-w-sm mx-auto select-none" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full"
        style={{
          paddingBottom: "56.25%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-5 md:p-6 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #0038FF 0%, #001ea8 55%, #060812 100%)",
            boxShadow: "0 20px 60px rgba(0,56,255,0.45), 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex justify-between items-start">
            {/* Chip */}
            <div className="w-10 h-7 rounded bg-gradient-to-br from-[#CCFF00]/30 to-[#CCFF00]/10 border border-[#CCFF00]/20 grid grid-cols-2 gap-[2px] p-1 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#CCFF00]/35 rounded-[1px]" />
              ))}
            </div>
            <div className="text-right leading-none">
              <div className="text-white font-black text-sm tracking-widest">MOVIL</div>
              <div className="text-[#CCFF00] font-black text-sm tracking-widest">GURU</div>
            </div>
          </div>

          <div className="font-mono text-white font-bold text-lg md:text-xl tracking-[0.22em] mt-2">
            {display}
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div className="text-white/35 text-[9px] uppercase tracking-[0.2em] mb-0.5">Titular</div>
              <div className="text-white font-bold text-sm uppercase tracking-wider truncate max-w-[160px]">
                {holder || "NOMBRE APELLIDO"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/35 text-[9px] uppercase tracking-[0.2em] mb-0.5">Válida hasta</div>
              <div className="text-white font-bold text-sm">{expiry || "MM/AA"}</div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #111827 0%, #060812 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          <div className="w-full h-11 bg-black mt-8" />
          <div className="px-6 mt-5">
            <div className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-1.5 text-right">CVV</div>
            <div className="bg-white rounded h-9 flex items-center justify-end px-4">
              <span className="font-mono text-black font-bold tracking-[0.4em] text-sm">•••</span>
            </div>
          </div>
          <div className="mt-5 px-6 flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-[#CCFF00]" />
            <span className="text-white/25 text-[10px] font-semibold">Movil Guru · Secure Payments</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder = "", type = "text", className = "" }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CCFF00]/60 transition-colors"
      />
    </div>
  )
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1.5">
            <div className={`size-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
              i < current ? "bg-[#CCFF00] text-black shadow-[0_0_16px_rgba(204,255,0,0.5)]"
              : i === current ? "bg-white text-black"
              : "bg-white/[0.06] text-white/25 border border-white/[0.08]"
            }`}>
              {i < current ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
              i <= current ? "text-white" : "text-white/25"
            }`}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-12 md:w-20 mx-2 mb-4 transition-colors duration-500 ${
              i < current ? "bg-[#CCFF00]" : "bg-white/[0.08]"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function OrderSidebar({ shippingCost }: { shippingCost: number }) {
  const { items, total } = useCart()
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 flex flex-col gap-5">
      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">Tu pedido</h3>
      <div className="flex flex-col gap-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative size-12 rounded-xl overflow-hidden bg-white/[0.04] shrink-0">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute -top-1 -right-1 size-4 bg-[#CCFF00] text-black rounded-full flex items-center justify-center font-black text-[9px]">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{item.name}</p>
              <p className="text-white/35 text-[11px]">{item.color}</p>
            </div>
            <span className="text-white font-bold text-xs shrink-0">
              {(item.price * item.quantity).toFixed(2)}€
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.07] pt-4 flex flex-col gap-2 text-sm">
        <div className="flex justify-between text-white/40">
          <span>Subtotal</span><span>{total.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-white/40">
          <span>Envío</span>
          {shippingCost === 0 ? <span className="text-[#CCFF00] font-bold">Gratis</span> : <span>{shippingCost.toFixed(2)}€</span>}
        </div>
        <div className="flex justify-between font-black text-white text-base pt-2 border-t border-white/[0.07]">
          <span>Total</span>
          <span>{(total + shippingCost).toFixed(2)}€</span>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()
  const { clearCart, total } = useCart()

  const [sh, setSh] = useState({
    email: "", phone: "", firstName: "", lastName: "",
    address: "", floor: "", postalCode: "", city: "", province: "",
    method: "standard" as "standard" | "express",
  })
  const [pay, setPay] = useState({
    method: "card" as "card" | "bizum" | "paypal",
    cardNumber: "", cardHolder: "", expiry: "", cvv: "", bizumPhone: "",
  })
  const [cvvFocused, setCvvFocused] = useState(false)
  const [terms, setTerms] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const shippingCost = sh.method === "express" ? 4.90 : total >= 50 ? 0 : 4.90

  const fmtCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()

  const fmtExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4)
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }

  const handleConfirm = async () => {
    if (!terms) return
    setConfirming(true)
    await new Promise(r => setTimeout(r, 1400))
    const orderNum = `MG-${Date.now().toString().slice(-6)}`
    clearCart()
    router.push(`/tienda/checkout/confirmacion?order=${orderNum}`)
  }

  return (
    <main className="w-full bg-[#060812] min-h-screen">
      <Header dark />

      {/* ── Top bar ── */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <nav className="flex items-center gap-2 text-white/25 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/tienda" className="hover:text-white transition-colors">Tienda</Link>
            <span>/</span>
            <Link href="/tienda/carrito" className="hover:text-white transition-colors">Carrito</Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </nav>
          <StepIndicator current={step} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 pb-24">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 xl:gap-16 items-start">

          {/* ── Main form ── */}
          <AnimatePresence mode="wait">

            {/* STEP 0 — Envío */}
            {step === 0 && (
              <motion.div key="envio"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}
                className="flex flex-col gap-8"
              >
                <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
                  Dirección<br />de envío
                </h2>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-4">Contacto</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Email" value={sh.email} onChange={v => setSh(s => ({...s, email: v}))} placeholder="tu@email.com" type="email" className="col-span-2 sm:col-span-1" />
                    <Field label="Teléfono" value={sh.phone} onChange={v => setSh(s => ({...s, phone: v}))} placeholder="+34 600 000 000" className="col-span-2 sm:col-span-1" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-4">Destinatario</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Nombre" value={sh.firstName} onChange={v => setSh(s => ({...s, firstName: v}))} placeholder="Carlos" />
                    <Field label="Apellidos" value={sh.lastName} onChange={v => setSh(s => ({...s, lastName: v}))} placeholder="Mendoza García" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-4">Dirección</p>
                  <div className="flex flex-col gap-4">
                    <Field label="Dirección" value={sh.address} onChange={v => setSh(s => ({...s, address: v}))} placeholder="Calle Mayor, 15" />
                    <Field label="Piso / Pta (opcional)" value={sh.floor} onChange={v => setSh(s => ({...s, floor: v}))} placeholder="2ºA" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Código postal" value={sh.postalCode} onChange={v => setSh(s => ({...s, postalCode: v}))} placeholder="28001" />
                      <Field label="Ciudad" value={sh.city} onChange={v => setSh(s => ({...s, city: v}))} placeholder="Madrid" />
                    </div>
                    <Field label="Provincia" value={sh.province} onChange={v => setSh(s => ({...s, province: v}))} placeholder="Madrid" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-4">Método de envío</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { id: "standard", label: "Estándar", sub: "3–5 días hábiles", price: total >= 50 ? "Gratis" : "4.90€" },
                      { id: "express", label: "Express 24h", sub: "Pedidos antes de las 17h", price: "4.90€" },
                    ].map(opt => (
                      <button key={opt.id}
                        onClick={() => setSh(s => ({...s, method: opt.id as "standard" | "express"}))}
                        className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                          sh.method === opt.id
                            ? "border-[#CCFF00] bg-[#CCFF00]/5"
                            : "border-white/[0.08] hover:border-white/20 bg-white/[0.02]"
                        }`}
                      >
                        <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          sh.method === opt.id ? "border-[#CCFF00]" : "border-white/20"
                        }`}>
                          {sh.method === opt.id && <div className="size-2.5 rounded-full bg-[#CCFF00]" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white text-sm">{opt.label}</div>
                          <div className="text-white/35 text-xs mt-0.5">{opt.sub}</div>
                        </div>
                        <span className={`font-black text-sm ${sh.method === opt.id ? "text-[#CCFF00]" : "text-white/50"}`}>
                          {opt.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-3 bg-[#CCFF00] text-black font-black text-sm uppercase tracking-[0.25em] py-5 rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-[0_0_40px_rgba(204,255,0,0.2)]"
                >
                  Continuar al pago
                  <ArrowRight className="size-4" strokeWidth={3} />
                </button>
              </motion.div>
            )}

            {/* STEP 1 — Pago */}
            {step === 1 && (
              <motion.div key="pago"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}
                className="flex flex-col gap-8"
              >
                <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
                  Método<br />de pago
                </h2>

                {/* Method tabs */}
                <div className="flex gap-1.5 p-1.5 bg-white/[0.03] rounded-2xl border border-white/[0.07]">
                  {[
                    { id: "card", label: "Tarjeta", Icon: CreditCard },
                    { id: "bizum", label: "Bizum", Icon: Smartphone },
                    { id: "paypal", label: "PayPal", Icon: Lock },
                  ].map(({ id, label, Icon }) => (
                    <button key={id}
                      onClick={() => setPay(p => ({...p, method: id as "card" | "bizum" | "paypal"}))}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all ${
                        pay.method === id
                          ? "bg-[#CCFF00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <Icon className="size-4" strokeWidth={2} />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {pay.method === "card" && (
                    <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
                      <CreditCardVisual number={pay.cardNumber} holder={pay.cardHolder} expiry={pay.expiry} flipped={cvvFocused} />
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Número de tarjeta</label>
                          <input
                            value={pay.cardNumber}
                            onChange={e => setPay(p => ({...p, cardNumber: fmtCard(e.target.value)}))}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white font-mono text-base tracking-[0.15em] placeholder:text-white/20 focus:outline-none focus:border-[#CCFF00]/60 transition-colors"
                          />
                        </div>
                        <Field label="Titular" value={pay.cardHolder} onChange={v => setPay(p => ({...p, cardHolder: v.toUpperCase()}))} placeholder="CARLOS MENDOZA" />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Caducidad</label>
                            <input
                              value={pay.expiry}
                              onChange={e => setPay(p => ({...p, expiry: fmtExpiry(e.target.value)}))}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white font-mono text-base placeholder:text-white/20 focus:outline-none focus:border-[#CCFF00]/60 transition-colors"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">CVV</label>
                            <input
                              value={pay.cvv}
                              onChange={e => setPay(p => ({...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4)}))}
                              placeholder="•••"
                              maxLength={4}
                              onFocus={() => setCvvFocused(true)}
                              onBlur={() => setCvvFocused(false)}
                              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white font-mono text-base placeholder:text-white/20 focus:outline-none focus:border-[#CCFF00]/60 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {pay.method === "bizum" && (
                    <motion.div key="bizum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <div className="rounded-2xl border border-[#0038FF]/20 bg-[#0038FF]/5 p-8 text-center flex flex-col items-center gap-5">
                        <div className="size-16 rounded-full bg-[#0038FF]/10 flex items-center justify-center">
                          <Smartphone className="size-8 text-[#0038FF]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-white mb-1">Paga con Bizum</h3>
                          <p className="text-white/45 text-sm">Introduce tu teléfono y recibirás la solicitud.</p>
                        </div>
                        <Field label="Teléfono Bizum" value={pay.bizumPhone} onChange={v => setPay(p => ({...p, bizumPhone: v}))} placeholder="+34 600 000 000" className="w-full text-left" />
                      </div>
                    </motion.div>
                  )}

                  {pay.method === "paypal" && (
                    <motion.div key="paypal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 text-center flex flex-col items-center gap-4">
                        <div className="size-16 rounded-full bg-[#003087]/20 flex items-center justify-center">
                          <Lock className="size-8 text-[#009cde]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-black text-xl text-white mb-1">Pagar con PayPal</h3>
                          <p className="text-white/45 text-sm">Al confirmar serás redirigido a PayPal para completar el pago de forma segura.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 font-black text-sm uppercase tracking-[0.2em] py-4 rounded-2xl transition-colors"
                  >
                    <ArrowLeft className="size-4" strokeWidth={3} />
                    Atrás
                  </button>
                  <button onClick={() => setStep(2)}
                    className="flex-[2] flex items-center justify-center gap-3 bg-[#CCFF00] text-black font-black text-sm uppercase tracking-[0.25em] py-4 rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-transform"
                  >
                    Revisar pedido
                    <ArrowRight className="size-4" strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Revisión */}
            {step === 2 && (
              <motion.div key="revision"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}
                className="flex flex-col gap-8"
              >
                <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">
                  Revisa<br />tu pedido
                </h2>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden divide-y divide-white/[0.06]">
                  {[
                    {
                      Icon: Truck, color: "#0038FF",
                      label: "Envío a",
                      value: `${sh.firstName} ${sh.lastName}`,
                      sub: `${sh.address}${sh.floor ? `, ${sh.floor}` : ""} · ${sh.postalCode} ${sh.city}`,
                      onEdit: () => setStep(0),
                    },
                    {
                      Icon: CreditCard, color: "#CCFF00",
                      label: "Pago",
                      value: pay.method === "card"
                        ? `Tarjeta •••• ${pay.cardNumber.replace(/\s/g, "").slice(-4) || "0000"}`
                        : pay.method === "bizum" ? "Bizum" : "PayPal",
                      sub: "",
                      onEdit: () => setStep(1),
                    },
                    {
                      Icon: Package, color: "#CCFF00",
                      label: "Entrega estimada",
                      value: sh.method === "express" ? "Mañana (antes de 17h)" : "3–5 días hábiles",
                      sub: "",
                      onEdit: null,
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-4 p-5">
                      <div
                        className="size-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${row.color}18` }}
                      >
                        <row.Icon className="size-5" style={{ color: row.color }} strokeWidth={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 mb-0.5">{row.label}</div>
                        <div className="font-bold text-white text-sm truncate">{row.value}</div>
                        {row.sub && <div className="text-white/40 text-xs mt-0.5 truncate">{row.sub}</div>}
                      </div>
                      {row.onEdit && (
                        <button onClick={row.onEdit} className="text-white/25 hover:text-[#CCFF00] text-xs font-bold transition-colors shrink-0">
                          Editar
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <button onClick={() => setTerms(t => !t)} className="flex items-start gap-3 text-left group">
                  <div className={`size-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                    terms ? "bg-[#CCFF00] border-[#CCFF00]" : "border-white/20 group-hover:border-white/40"
                  }`}>
                    {terms && <Check className="size-3 text-black" strokeWidth={3} />}
                  </div>
                  <span className="text-white/45 text-sm">
                    He leído y acepto los{" "}
                    <span className="text-white underline decoration-white/30">términos y condiciones</span>
                    {" "}y la{" "}
                    <span className="text-white underline decoration-white/30">política de privacidad</span>.
                  </span>
                </button>

                <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
                  <Shield className="size-5 text-[#CCFF00] shrink-0" strokeWidth={1.8} />
                  <p className="text-white/35 text-xs font-medium">
                    Pago cifrado con SSL 256-bit. No almacenamos datos de tarjeta.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)}
                    className="flex-1 flex items-center justify-center gap-2 border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 font-black text-sm uppercase tracking-[0.2em] py-4 rounded-2xl transition-colors"
                  >
                    <ArrowLeft className="size-4" strokeWidth={3} />
                    Atrás
                  </button>
                  <button onClick={handleConfirm} disabled={!terms || confirming}
                    className="flex-[2] flex items-center justify-center gap-3 bg-[#CCFF00] text-black font-black text-sm uppercase tracking-[0.2em] py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:scale-[1.01] active:enabled:scale-[0.99]"
                  >
                    {confirming ? (
                      <>
                        <div className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        Confirmar pedido
                        <ArrowRight className="size-4" strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <OrderSidebar shippingCost={shippingCost} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
