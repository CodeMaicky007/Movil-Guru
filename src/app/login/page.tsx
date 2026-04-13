"use client";
import dynamic from "next/dynamic";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Fingerprint } from "lucide-react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

export default function LoginPage() {
  const [showPw, setShowPw] = React.useState(false);

  return (
    <main className="w-full bg-[#060812] min-h-screen relative overflow-hidden">
      <Header dark />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 15% 20%, rgba(204,255,0,0.10), transparent 60%), radial-gradient(800px circle at 85% 80%, rgba(120,80,255,0.08), transparent 60%)",
        }}
      />
      {/* Grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-56px)] max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        {/* Left – decorative */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:block"
        >
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#CCFF00] mb-6">
            / Acceso · clientes
          </p>
          <h1
            className="text-5xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            Entra a tu
            <br />
            <span
              className="text-[#CCFF00]"
              style={{ textShadow: "0 0 40px rgba(204,255,0,0.4)" }}
            >
              taller
            </span>{" "}
            digital.
          </h1>
          <p className="mt-6 max-w-md text-white/55 text-base leading-relaxed">
            Consulta el estado de tu reparación, historial de dispositivos y
            descarga tus facturas. Todo en un mismo lugar.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-sm">
            {[
              { v: "10k+", l: "Reparaciones" },
              { v: "47 min", l: "Media" },
              { v: "99%", l: "Satisfechos" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
              >
                <div
                  className="text-2xl font-black text-[#CCFF00]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.v}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.aside>

        {/* Right – card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            aria-hidden
            className="absolute -inset-px rounded-[28px]"
            style={{
              background:
                "linear-gradient(140deg, rgba(204,255,0,0.35), rgba(255,255,255,0.05) 40%, rgba(120,80,255,0.25))",
              filter: "blur(0.5px)",
            }}
          />
          <div className="relative rounded-[28px] border border-white/[0.08] bg-[#0a0d1a]/85 p-8 md:p-10 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 mb-8">
              <div className="font-black text-xs px-2.5 py-1 rounded-xl rounded-bl-sm bg-white text-black">
                MOVIL
              </div>
              <div className="bg-[#CCFF00] text-black font-black text-xs px-2.5 py-1 rounded-full">
                GURU
              </div>
            </div>

            <h2
              className="text-3xl font-black text-white mb-2 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Inicia sesión
            </h2>
            <p className="text-white/50 text-sm mb-8">
              ¿Nuevo por aquí?{" "}
              <Link
                href="/registro"
                className="text-[#CCFF00] hover:underline font-semibold"
              >
                Crea una cuenta
              </Link>
            </p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Field
                icon={Mail}
                label="Correo electrónico"
                type="email"
                placeholder="tu@correo.com"
              />
              <Field
                icon={Lock}
                label="Contraseña"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="text-white/40 hover:text-white/80 transition-colors"
                    aria-label="Mostrar contraseña"
                  >
                    {showPw ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/60 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="appearance-none size-4 rounded border border-white/20 bg-white/5 checked:bg-[#CCFF00] checked:border-[#CCFF00] transition-colors"
                  />
                  Mantener sesión
                </label>
                <Link
                  href="#"
                  className="text-white/60 hover:text-[#CCFF00] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group relative w-full overflow-hidden rounded-full bg-[#CCFF00] py-3.5 font-bold text-black shadow-[0_10px_30px_-8px_rgba(204,255,0,0.6)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Entrar
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.button>

              <div className="flex items-center gap-4 text-white/30 text-xs">
                <div className="h-px flex-1 bg-white/10" />
                <span>o continúa con</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SocialBtn label="Google" />
                <SocialBtn label="Apple" />
              </div>

              <button
                type="button"
                className="group w-full flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-3 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <Fingerprint className="size-4 text-[#CCFF00]" />
                Acceso biométrico
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  trailing,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  trailing?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
        {label}
      </span>
      <div className="mt-2 group relative flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 focus-within:border-[#CCFF00]/60 focus-within:bg-white/[0.05] transition-colors">
        <Icon className="size-4 text-white/40 group-focus-within:text-[#CCFF00] transition-colors" />
        <input
          {...props}
          className="w-full bg-transparent px-3 py-3.5 text-sm text-white placeholder:text-white/25 outline-none"
        />
        {trailing}
      </div>
    </label>
  );
}

function SocialBtn({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-full border border-white/10 bg-white/[0.02] py-3 text-sm font-medium text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors"
    >
      {label}
    </button>
  );
}
