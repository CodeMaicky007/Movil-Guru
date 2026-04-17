"use client";
import dynamic from "next/dynamic";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import {
  Smartphone,
  Calendar,
  Clock,
  Download,
  Bell,
  Shield,
  CreditCard,
  Settings,
  LogOut,
  MapPin,
  Award,
  TrendingUp,
  CheckCircle2,
  Wrench,
} from "lucide-react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

const repairs = [
  {
    id: "MG-2401",
    device: "iPhone 14 Pro",
    issue: "Cambio de pantalla",
    status: "En curso",
    eta: "Hoy · 17:30",
    progress: 65,
    color: "#CCFF00",
  },
  {
    id: "MG-2288",
    device: "Samsung Galaxy S23",
    issue: "Batería",
    status: "Entregada",
    eta: "03 Abr 2026",
    progress: 100,
    color: "#84cc16",
  },
  {
    id: "MG-2157",
    device: "Google Pixel 7",
    issue: "Puerto de carga",
    status: "Entregada",
    eta: "17 Feb 2026",
    progress: 100,
    color: "#84cc16",
  },
];

export default function PerfilPage() {
  const [tab, setTab] = React.useState("reparaciones");

  return (
    <main className="w-full bg-[#060d12] min-h-screen relative overflow-hidden">
      <Header dark />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px circle at 20% 0%, rgba(204,255,0,0.10), transparent 60%), radial-gradient(900px circle at 100% 40%, rgba(120,80,255,0.08), transparent 60%)",
        }}
      />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* Hero profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#070c10] via-[#070c10] to-[#0f1428] p-8 md:p-10 mb-8"
        >
          <div
            aria-hidden
            className="absolute -top-24 -right-24 size-64 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(204,255,0,0.25), transparent)",
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="size-24 rounded-2xl bg-gradient-to-br from-[#CCFF00] to-[#84cc16] p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#060d12] flex items-center justify-center text-3xl font-black text-[#CCFF00]">
                  CM
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#CCFF00] ring-4 ring-[#060d12]"
              />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00]">
                  Cliente · Oro
                </span>
                <Award className="size-4 text-[#CCFF00]" />
              </div>
              <h1
                className="text-3xl md:text-4xl font-black text-white tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Carlos Mendoza
              </h1>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/50">
                <span>carlos@correo.com</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" /> Madrid
                </span>
                <span>Miembro desde 2024</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { v: "3", l: "Reparaciones" },
                { v: "€248", l: "Ahorrados" },
                { v: "Oro", l: "Nivel" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center min-w-[90px]"
                >
                  <div
                    className="text-xl font-black text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.v}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50 mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Layout */}
        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-1">
            {[
              { id: "reparaciones", icon: Wrench, label: "Reparaciones" },
              { id: "dispositivos", icon: Smartphone, label: "Dispositivos" },
              { id: "facturacion", icon: CreditCard, label: "Facturación" },
              { id: "notificaciones", icon: Bell, label: "Notificaciones" },
              { id: "seguridad", icon: Shield, label: "Seguridad" },
              { id: "ajustes", icon: Settings, label: "Ajustes" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`group relative w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  tab === item.id
                    ? "bg-white/[0.06] text-white"
                    : "text-white/55 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {tab === item.id && (
                  <motion.span
                    layoutId="tabdot"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#CCFF00]"
                  />
                )}
                <item.icon className="size-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
            <div className="pt-3">
              <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/55 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                <LogOut className="size-4" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 space-y-6">
            {tab === "reparaciones" && (
              <>
                <div className="flex items-center justify-between">
                  <h2
                    className="text-2xl font-black text-white tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Tus reparaciones
                  </h2>
                  <Link
                    href="/servicios"
                    className="text-xs font-bold uppercase tracking-widest text-[#CCFF00] hover:underline"
                  >
                    + Nueva
                  </Link>
                </div>

                <div className="grid gap-4">
                  {repairs.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070c10]/70 p-5 backdrop-blur-sm hover:border-[#CCFF00]/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex gap-4 min-w-0">
                          <div className="size-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0">
                            <Smartphone className="size-5 text-[#CCFF00]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-bold truncate">
                              {r.device}
                            </div>
                            <div className="text-white/50 text-sm">
                              {r.issue} · #{r.id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              r.progress === 100
                                ? "bg-[#CCFF00]/10 text-[#CCFF00]"
                                : "bg-amber-400/10 text-amber-300"
                            }`}
                          >
                            {r.progress === 100 ? (
                              <CheckCircle2 className="size-3" />
                            ) : (
                              <Clock className="size-3" />
                            )}
                            {r.status}
                          </span>
                        </div>
                      </div>

                      <div className="relative h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.progress}%` }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.9 }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            backgroundColor: r.color,
                            boxShadow:
                              r.progress < 100
                                ? `0 0 20px ${r.color}`
                                : "none",
                          }}
                        />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-white/55">
                          <Calendar className="size-3" />
                          {r.eta}
                        </span>
                        <div className="flex gap-2">
                          {r.progress === 100 && (
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                              <Download className="size-3" />
                              Factura
                            </button>
                          )}
                          <Link
                            href="/track"
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#CCFF00] px-3 py-1.5 font-bold text-black hover:bg-[#b8e600] transition-colors"
                          >
                            Ver detalle
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {tab !== "reparaciones" && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/[0.08] bg-[#070c10]/70 p-10 text-center backdrop-blur-sm"
              >
                <TrendingUp className="mx-auto size-10 text-[#CCFF00] mb-4" />
                <h3
                  className="text-xl font-black text-white mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Próximamente
                </h3>
                <p className="text-white/50 max-w-sm mx-auto text-sm">
                  Esta sección estará disponible en breve. Mientras tanto
                  puedes gestionar tus reparaciones activas.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
