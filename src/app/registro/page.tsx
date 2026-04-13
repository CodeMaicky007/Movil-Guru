"use client";
import dynamic from "next/dynamic";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "next-view-transitions";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Zap,
  Gift,
} from "lucide-react";

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);
const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

const steps = [
  { title: "Tus datos", desc: "Cómo te llamamos" },
  { title: "Seguridad", desc: "Protege tu cuenta" },
  { title: "Listo", desc: "Bienvenido a bordo" },
];

export default function RegistroPage() {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <main className="w-full bg-[#060812] min-h-screen relative overflow-hidden">
      <Header dark />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at 80% 10%, rgba(204,255,0,0.10), transparent 60%), radial-gradient(900px circle at 10% 90%, rgba(80,120,255,0.08), transparent 60%)",
        }}
      />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#CCFF00] mb-3">
            / Únete a Movil Guru
          </p>
          <h1
            className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Crea tu cuenta
            <br />
            <span className="text-white/40">en menos de</span>{" "}
            <span
              className="text-[#CCFF00]"
              style={{ textShadow: "0 0 40px rgba(204,255,0,0.4)" }}
            >
              60 segundos
            </span>
          </h1>
        </motion.div>

        {/* Stepper */}
        <div className="mx-auto mb-10 max-w-2xl">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <React.Fragment key={s.title}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <motion.div
                    animate={{
                      backgroundColor:
                        i <= step ? "#CCFF00" : "rgba(255,255,255,0.05)",
                      color: i <= step ? "#000" : "rgba(255,255,255,0.4)",
                      scale: i === step ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="size-10 rounded-full flex items-center justify-center font-black text-sm border border-white/10"
                  >
                    {i < step ? <Check className="size-4" /> : i + 1}
                  </motion.div>
                  <div className="mt-2 hidden md:block text-center">
                    <div className="text-white text-xs font-bold">
                      {s.title}
                    </div>
                    <div className="text-white/40 text-[10px]">{s.desc}</div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="relative flex-1 mx-2 h-px bg-white/10">
                    <motion.div
                      initial={false}
                      animate={{ scaleX: i < step ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-[#CCFF00] origin-left"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="relative mx-auto max-w-2xl">
          <div
            aria-hidden
            className="absolute -inset-px rounded-[28px]"
            style={{
              background:
                "linear-gradient(140deg, rgba(204,255,0,0.3), rgba(255,255,255,0.04) 40%, rgba(120,80,255,0.2))",
            }}
          />
          <div className="relative rounded-[28px] border border-white/[0.08] bg-[#0a0d1a]/85 p-8 md:p-12 backdrop-blur-xl overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <SectionTitle
                    title="Cuéntanos quién eres"
                    sub="Solo lo esencial, prometido."
                  />
                  <Field
                    icon={User}
                    label="Nombre completo"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Carlos Mendoza"
                  />
                  <Field
                    icon={Mail}
                    label="Correo electrónico"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="tu@correo.com"
                  />
                  <Field
                    icon={Phone}
                    label="Teléfono"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="+34 600 000 000"
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-5"
                >
                  <SectionTitle
                    title="Blindamos tu cuenta"
                    sub="Una buena contraseña, y listo."
                  />
                  <Field
                    icon={Lock}
                    label="Contraseña"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Mínimo 8 caracteres"
                  />
                  <PwStrength value={form.password} />
                  <label className="flex items-start gap-3 text-sm text-white/60 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 appearance-none size-4 rounded border border-white/20 bg-white/5 checked:bg-[#CCFF00] checked:border-[#CCFF00] transition-colors"
                    />
                    <span>
                      Acepto los{" "}
                      <Link
                        href="#"
                        className="text-[#CCFF00] hover:underline"
                      >
                        términos
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="#"
                        className="text-[#CCFF00] hover:underline"
                      >
                        política de privacidad
                      </Link>
                      .
                    </span>
                  </label>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 15, -10, 0] }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="mx-auto mb-6 size-20 rounded-full bg-[#CCFF00] flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(204,255,0,0.7)]"
                  >
                    <Check className="size-10 text-black" strokeWidth={3} />
                  </motion.div>
                  <h3
                    className="text-3xl font-black text-white mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ¡Bienvenido, {form.name.split(" ")[0] || "amigo"}!
                  </h3>
                  <p className="text-white/55 max-w-sm mx-auto mb-8">
                    Tu cuenta está lista. Desbloqueaste estos beneficios:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 text-left">
                    {[
                      {
                        icon: Shield,
                        t: "Garantía extendida",
                        d: "+30 días en cada reparación",
                      },
                      {
                        icon: Zap,
                        t: "Reparación prioritaria",
                        d: "Primero en cola",
                      },
                      {
                        icon: Gift,
                        t: "10% primer servicio",
                        d: "Código enviado al email",
                      },
                    ].map((b) => (
                      <div
                        key={b.t}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <b.icon className="size-5 text-[#CCFF00] mb-2" />
                        <div className="text-white text-sm font-bold">
                          {b.t}
                        </div>
                        <div className="text-white/50 text-xs mt-0.5">
                          {b.d}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/perfil"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-6 py-3 font-bold text-black hover:bg-[#b8e600] transition-colors"
                  >
                    Ir a mi perfil <ArrowRight className="size-4" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 2 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 disabled:opacity-30 hover:bg-white/5 transition-colors"
                >
                  <ArrowLeft className="size-4" /> Atrás
                </button>
                <button
                  onClick={next}
                  className="group flex items-center gap-2 rounded-full bg-[#CCFF00] px-6 py-3 text-sm font-bold text-black shadow-[0_10px_30px_-8px_rgba(204,255,0,0.6)] hover:bg-[#b8e600] transition-colors"
                >
                  {step === 1 ? "Crear cuenta" : "Continuar"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/40">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-[#CCFF00] hover:underline font-semibold"
          >
            Inicia sesión
          </Link>
        </p>
      </section>

      <Footer />
    </main>
  );
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-2">
      <h2
        className="text-2xl font-black text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <p className="text-white/50 text-sm mt-1">{sub}</p>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
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
      </div>
    </label>
  );
}

function PwStrength({ value }: { value: string }) {
  const score = Math.min(
    4,
    (value.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(value) ? 1 : 0) +
      (/\d/.test(value) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(value) ? 1 : 0)
  );
  const labels = ["Muy débil", "Débil", "Aceptable", "Fuerte", "Excelente"];
  const colors = ["#ef4444", "#f59e0b", "#eab308", "#84cc16", "#CCFF00"];
  return (
    <div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor:
                i < score ? colors[score] : "rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.3 }}
            className="h-1 flex-1 rounded-full"
          />
        ))}
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-widest text-white/50">
        Fuerza: {value.length ? labels[score] : "—"}
      </div>
    </div>
  );
}
