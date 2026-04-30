"use client"

import dynamic from "next/dynamic"
import React, { Suspense } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check, Package, Truck, Home, ArrowRight, RotateCcw, MapPin } from "lucide-react"

const Header = dynamic(() => import("@/components/ui/header-3").then(m => m.Header), { ssr: false })

// ─── Main content (needs Suspense for useSearchParams) ────────────────────────
function ConfirmContent() {
  const searchParams = useSearchParams()
  const orderNum = searchParams.get("order") ?? "MG-000000"

  const delivery = new Date()
  delivery.setDate(delivery.getDate() + 3)
  const deliveryStr = delivery.toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  })

  const timeline = [
    { Icon: Check,   label: "Pedido recibido",    sub: "Ahora mismo",  done: true,  active: false },
    { Icon: Package, label: "Preparando tu pedido", sub: "Hoy",         done: false, active: true  },
    { Icon: Truck,   label: "En camino",            sub: deliveryStr,   done: false, active: false },
    { Icon: MapPin,  label: "Entregado",            sub: "Firma requerida", done: false, active: false },
  ]

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 py-24 text-center">

      {/* ── Animated success ring ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
        className="relative mb-12"
      >
        <div className="absolute inset-[-20px] rounded-full border border-[#CCFF00]/15 animate-[ping_2.5s_ease-out_infinite]" />
        <div className="absolute inset-[-10px] rounded-full border border-[#CCFF00]/25 animate-[ping_2.5s_ease-out_infinite_0.4s]" />
        <div
          className="size-28 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #CCFF00 0%, #a3e635 100%)",
            boxShadow: "0 0 60px rgba(204,255,0,0.55), 0 0 120px rgba(204,255,0,0.2)",
          }}
        >
          <Check className="size-14 text-black" strokeWidth={3} />
        </div>
      </motion.div>

      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#CCFF00] mb-3">
          Pedido confirmado
        </p>
        <h1 className="font-black text-6xl md:text-8xl uppercase leading-none tracking-tight text-white mb-4">
          ¡Gracias!
        </h1>
        <p className="text-white/45 text-lg max-w-md mx-auto">
          Recibirás un email de confirmación en breve con todos los detalles.
        </p>
      </motion.div>

      {/* ── Order card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden mb-8"
      >
        {/* Order number header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#CCFF00]/[0.06] border-b border-white/[0.06]">
          <div className="text-left">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/35 mb-0.5">
              Número de pedido
            </div>
            <div className="font-black text-2xl text-white tracking-widest">{orderNum}</div>
          </div>
          <div
            className="size-11 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(204,255,0,0.15)", boxShadow: "0 0 20px rgba(204,255,0,0.2)" }}
          >
            <Package className="size-5 text-[#CCFF00]" strokeWidth={2} />
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          <div className="flex flex-col gap-0">
            {timeline.map(({ Icon, label, sub, done, active }, i) => (
              <div key={label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`size-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                    done
                      ? "bg-[#CCFF00] border-[#CCFF00] shadow-[0_0_16px_rgba(204,255,0,0.4)]"
                      : active
                      ? "bg-[#CCFF00]/10 border-[#CCFF00]"
                      : "bg-white/[0.03] border-white/[0.08]"
                  }`}>
                    <Icon className={`size-3.5 ${done ? "text-black" : active ? "text-[#CCFF00]" : "text-white/20"}`} strokeWidth={2.5} />
                  </div>
                  {i < timeline.length - 1 && (
                    <div className={`w-px h-8 my-1 ${done || active ? "bg-[#CCFF00]/25" : "bg-white/[0.05]"}`} />
                  )}
                </div>
                <div className="pb-2 pt-1">
                  <div className={`font-bold text-sm ${done || active ? "text-white" : "text-white/25"}`}>
                    {label}
                  </div>
                  <div className={`text-xs mt-0.5 capitalize ${done || active ? "text-white/45" : "text-white/20"}`}>
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── CTAs ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        <Link
          href="/track"
          className="flex-1 flex items-center justify-center gap-2 border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl transition-colors"
        >
          <RotateCcw className="size-4" strokeWidth={2.5} />
          Rastrear pedido
        </Link>
        <Link
          href="/tienda"
          className="flex-1 flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(204,255,0,0.25)]"
        >
          Seguir comprando
          <ArrowRight className="size-4" strokeWidth={3} />
        </Link>
      </motion.div>
    </div>
  )
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────
export default function ConfirmacionPage() {
  return (
    <main className="w-full bg-[#060d12] min-h-screen relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(204,255,0,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #0038FF 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Header dark />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
            <div className="size-8 border-2 border-white/15 border-t-[#CCFF00] rounded-full animate-spin" />
          </div>
        }
      >
        <ConfirmContent />
      </Suspense>
    </main>
  )
}
