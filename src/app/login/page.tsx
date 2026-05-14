"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Fingerprint, Mail, ShieldCheck, Clock, Star, X, Tag } from "lucide-react";
import Image from "next/image";
import logoImg from "../../../images/logo/logo-Photoroom.png";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/* ─────────────────────────── Pupil ─────────────────────────── */
interface PupilProps {
  size?: number; maxDistance?: number; pupilColor?: string;
  forceLookX?: number; forceLookY?: number;
}
const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "#060d12", forceLookX, forceLookY }: PupilProps) => {
  const [mx, setMx] = useState(0), [my, setMy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { setMx(e.clientX); setMy(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  const pos = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const a = Math.atan2(dy, dx);
    return { x: Math.cos(a) * dist, y: Math.sin(a) * dist };
  };
  const p = pos();
  return <div ref={ref} className="rounded-full" style={{ width: size, height: size, backgroundColor: pupilColor, transform: `translate(${p.x}px,${p.y}px)`, transition: "transform 0.1s ease-out" }} />;
};

/* ─────────────────────────── EyeBall ─────────────────────────── */
interface EyeBallProps {
  size?: number; pupilSize?: number; maxDistance?: number;
  eyeColor?: string; pupilColor?: string; isBlinking?: boolean;
  forceLookX?: number; forceLookY?: number;
}
const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "#060d12", isBlinking = false, forceLookX, forceLookY }: EyeBallProps) => {
  const [mx, setMx] = useState(0), [my, setMy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { setMx(e.clientX); setMy(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  const pos = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const a = Math.atan2(dy, dx);
    return { x: Math.cos(a) * dist, y: Math.sin(a) * dist };
  };
  const p = pos();
  return (
    <div ref={ref} className="rounded-full flex items-center justify-center transition-all duration-150" style={{ width: size, height: isBlinking ? 2 : size, backgroundColor: eyeColor, overflow: "hidden" }}>
      {!isBlinking && <div className="rounded-full" style={{ width: pupilSize, height: pupilSize, backgroundColor: pupilColor, transform: `translate(${p.x}px,${p.y}px)`, transition: "transform 0.1s ease-out" }} />}
    </div>
  );
};

/* ─────────────────────────── Oferta Modal ─────────────────────────── */
function OfertaModal({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(6,13,18,0.85)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md w-full"
          onClick={e => e.stopPropagation()}
        >
          {/* Glow border */}
          <div aria-hidden className="absolute -inset-px rounded-[28px]" style={{ background: "linear-gradient(140deg,rgba(204,255,0,0.5),rgba(255,255,255,0.06) 40%,rgba(0,56,255,0.3))", filter: "blur(0.5px)" }} />

          <div className="relative rounded-[28px] border border-white/[0.08] bg-[#070c10]/95 p-8 overflow-hidden">
            {/* Background glow */}
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(400px circle at 50% 0%, rgba(204,255,0,0.08), transparent 60%)" }} />

            {/* Close */}
            <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white/80 transition-colors p-1">
              <X className="size-5" />
            </button>

            {/* Badge */}
            <div className="flex justify-center mb-5">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="size-20 rounded-full bg-[#CCFF00] flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(204,255,0,0.8)]">
                  <Tag className="size-10 text-black" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute -top-1 -right-1 size-7 rounded-full bg-[#0038FF] border-2 border-[#070c10] flex items-center justify-center"
                >
                  <span className="text-[8px] font-black text-white">5%</span>
                </motion.div>
              </motion.div>
            </div>

            <div className="text-center mb-6">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs font-black uppercase tracking-[0.3em] text-[#CCFF00] mb-2"
              >
                / Oferta exclusiva · Cliente
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-3xl font-black text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-display,inherit)" }}
              >
                ¡Bienvenido, {name}!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/55 text-sm leading-relaxed"
              >
                Por iniciar sesión hoy, tienes un <span className="text-[#CCFF00] font-bold">5% de descuento</span> en tu próximo servicio de reparación.
              </motion.p>
            </div>

            {/* Código */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-6 p-4 rounded-2xl border border-[#CCFF00]/20 bg-[#CCFF00]/5"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2 font-bold text-center">Tu código</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-black tracking-[0.2em] text-[#CCFF00]" style={{ fontFamily: "monospace" }}>GURU5OFF</span>
                <button
                  onClick={() => { navigator.clipboard.writeText("GURU5OFF"); }}
                  className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#CCFF00] px-3 py-1.5 rounded-full hover:bg-[#b8e600] transition-colors"
                >
                  Copiar
                </button>
              </div>
              <p className="text-[10px] text-white/30 text-center mt-2">Válido solo hoy · No acumulable</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium"
              >
                Después
              </button>
              <Link
                href="/track"
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-[#CCFF00] text-sm font-bold text-black text-center hover:bg-[#b8e600] transition-colors shadow-[0_10px_30px_-8px_rgba(204,255,0,0.5)]"
              >
                Usar ahora
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOferta, setShowOferta] = useState(false);
  const [userName, setUserName] = useState("");

  const [mouseX, setMouseX] = useState(0), [mouseY, setMouseY] = useState(0);
  const [purpleBlink, setPurpleBlink] = useState(false);
  const [blackBlink, setBlackBlink] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lookEachOther, setLookEachOther] = useState(false);
  const [purplePeek, setPurplePeek] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useEffect(() => {
    const blink = (set: (v: boolean) => void): ReturnType<typeof setTimeout> => {
      const t = setTimeout(() => { set(true); setTimeout(() => { set(false); blink(set); }, 150); }, Math.random() * 4000 + 3000);
      return t;
    };
    const t1 = blink(setPurpleBlink), t2 = blink(setBlackBlink);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (isTyping) { setLookEachOther(true); const t = setTimeout(() => setLookEachOther(false), 800); return () => clearTimeout(t); }
    setLookEachOther(false);
  }, [isTyping]);

  useEffect(() => {
    if (password.length > 0 && showPw) {
      const t = setTimeout(() => { setPurplePeek(true); setTimeout(() => setPurplePeek(false), 800); }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    }
    setPurplePeek(false);
  }, [password, showPw, purplePeek]);

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const dx = mouseX - (r.left + r.width / 2), dy = mouseY - (r.top + r.height / 3);
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const pp = calcPos(purpleRef), bp = calcPos(blackRef), yp = calcPos(yellowRef), op = calcPos(orangeRef);
  const pwHidden = password.length > 0 && !showPw;
  const pwVisible = password.length > 0 && showPw;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      setIsLoading(false);
      return;
    }

    // Obtener nombre del perfil si existe
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.user.id)
        .single();

      const name = profile?.full_name || data.user.email?.split("@")[0] || "Cliente";
      setUserName(name);
    }

    setIsLoading(false);
    setShowOferta(true);
  };

  const handleCloseOferta = () => {
    setShowOferta(false);
    router.push("/perfil");
  };

  return (
    <>
      {showOferta && <OfertaModal name={userName} onClose={handleCloseOferta} />}

      <div className="min-h-screen grid lg:grid-cols-2 font-sans">

        {/* ══════════ LEFT – Characters ══════════ */}
        <div className="relative hidden lg:flex flex-col justify-between bg-[#060d12] p-12 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(700px circle at 20% 30%, rgba(204,255,0,0.09), transparent 60%), radial-gradient(800px circle at 80% 70%, rgba(0,56,255,0.08), transparent 60%)" }} />
          <div aria-hidden className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse at center,black 40%,transparent 80%)" }} />

          <Link href="/" className="relative z-10 w-fit opacity-90 hover:opacity-100 transition-opacity">
            <Image src={logoImg} alt="MovilGuru" height={150} style={{ width: "auto", height: 150 }} priority />
          </Link>

          <div className="relative z-10 flex items-end justify-center h-[560px]">
            <div className="relative" style={{ width: 680, height: 490 }}>

              {/* Purple (lime) – back */}
              <div ref={purpleRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: 86, width: 222, height: pwHidden || isTyping ? 540 : 490, backgroundColor: "#CCFF00", borderRadius: "12px 12px 0 0", zIndex: 1,
                  transform: pwVisible ? "skewX(0deg)" : isTyping || pwHidden ? `skewX(${(pp.bodySkew || 0) - 12}deg) translateX(48px)` : `skewX(${pp.bodySkew || 0}deg)`,
                  transformOrigin: "bottom center"
                }}>
                <div className="absolute flex gap-10 transition-all duration-700 ease-in-out"
                  style={{ left: pwVisible ? 24 : lookEachOther ? 68 : 55 + pp.faceX, top: pwVisible ? 42 : lookEachOther ? 80 : 50 + pp.faceY }}>
                  {[0, 1].map(i => <EyeBall key={i} size={22} pupilSize={9} maxDistance={6} eyeColor="#060d12" pupilColor="#CCFF00"
                    isBlinking={purpleBlink}
                    forceLookX={pwVisible ? (purplePeek ? 4 : -4) : lookEachOther ? 3 : undefined}
                    forceLookY={pwVisible ? (purplePeek ? 5 : -4) : lookEachOther ? 4 : undefined} />)}
                </div>
              </div>

              {/* Black – mid */}
              <div ref={blackRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: 296, width: 148, height: 382, backgroundColor: "#111827", borderRadius: "10px 10px 0 0", border: "1px solid rgba(204,255,0,0.15)", zIndex: 2,
                  transform: pwVisible ? "skewX(0deg)" : lookEachOther ? `skewX(${(bp.bodySkew || 0) * 1.5 + 10}deg) translateX(24px)` : isTyping || pwHidden ? `skewX(${(bp.bodySkew || 0) * 1.5}deg)` : `skewX(${bp.bodySkew || 0}deg)`,
                  transformOrigin: "bottom center"
                }}>
                <div className="absolute flex gap-7 transition-all duration-700 ease-in-out"
                  style={{ left: pwVisible ? 12 : lookEachOther ? 40 : 32 + bp.faceX, top: pwVisible ? 34 : lookEachOther ? 14 : 40 + bp.faceY }}>
                  {[0, 1].map(i => <EyeBall key={i} size={20} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#060d12"
                    isBlinking={blackBlink}
                    forceLookX={pwVisible ? -4 : lookEachOther ? 0 : undefined}
                    forceLookY={pwVisible ? -4 : lookEachOther ? -4 : undefined} />)}
                </div>
              </div>

              {/* Blue semicircle – front left */}
              <div ref={orangeRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: 0, width: 296, height: 247, backgroundColor: "#0038FF", borderRadius: "148px 148px 0 0", zIndex: 3,
                  transform: pwVisible ? "skewX(0deg)" : `skewX(${op.bodySkew || 0}deg)`, transformOrigin: "bottom center"
                }}>
                <div className="absolute flex gap-10 transition-all duration-200 ease-out"
                  style={{ left: pwVisible ? 62 : 101 + (op.faceX || 0), top: pwVisible ? 104 : 111 + (op.faceY || 0) }}>
                  <Pupil size={15} maxDistance={6} pupilColor="white" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
                  <Pupil size={15} maxDistance={6} pupilColor="white" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
                </div>
              </div>

              {/* Yellow rounded – front right */}
              <div ref={yellowRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                style={{
                  left: 383, width: 173, height: 284, backgroundColor: "#CCFF00", borderRadius: "87px 87px 0 0", zIndex: 4,
                  transform: pwVisible ? "skewX(0deg)" : `skewX(${yp.bodySkew || 0}deg)`, transformOrigin: "bottom center"
                }}>
                <div className="absolute flex gap-7 transition-all duration-200 ease-out"
                  style={{ left: pwVisible ? 24 : 64 + (yp.faceX || 0), top: pwVisible ? 42 : 50 + (yp.faceY || 0) }}>
                  <Pupil size={15} maxDistance={6} pupilColor="#060d12" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
                  <Pupil size={15} maxDistance={6} pupilColor="#060d12" forceLookX={pwVisible ? -5 : undefined} forceLookY={pwVisible ? -4 : undefined} />
                </div>
                <div className="absolute rounded-full" style={{ width: 98, height: 5, backgroundColor: "#060d12", left: pwVisible ? 12 : 49 + (yp.faceX || 0), top: pwVisible ? 108 : 108 + (yp.faceY || 0) }} />
              </div>

            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#CCFF00] mb-3">/ Acceso · clientes</p>
            <h2 className="text-4xl font-black text-white leading-[0.95] tracking-tight" style={{ fontFamily: "var(--font-display,inherit)" }}>
              Entra a tu<br />
              <span className="text-[#CCFF00]" style={{ textShadow: "0 0 30px rgba(204,255,0,0.4)" }}>taller</span> digital.
            </h2>
            <div className="mt-5 flex items-center gap-6 text-xs text-white/40">
              <a href="#" className="hover:text-white/70 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white/70 transition-colors">Términos</a>
              <a href="#" className="hover:text-white/70 transition-colors">Contacto</a>
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT – Form ══════════ */}
        <div className="flex items-center justify-center p-8 bg-[#060d12] relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(500px circle at 70% 30%, rgba(0,56,255,0.06), transparent 60%)" }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[480px]"
          >
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-10">
              <Link href="/">
                <Image src={logoImg} alt="MovilGuru" height={52} style={{ width: "auto", height: 52 }} priority />
              </Link>
            </div>

            {/* Oferta banner */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-5 flex items-center gap-3 p-3.5 rounded-2xl border border-[#CCFF00]/20 bg-[#CCFF00]/5"
            >
              <div className="size-8 rounded-full bg-[#CCFF00] flex items-center justify-center flex-shrink-0">
                <Tag className="size-4 text-black" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#CCFF00]">5% de descuento al entrar</p>
                <p className="text-[10px] text-white/40">Inicia sesión hoy y desbloquea tu oferta exclusiva.</p>
              </div>
            </motion.div>

            {/* Glow border */}
            <div aria-hidden className="absolute -inset-px rounded-[28px]" style={{ background: "linear-gradient(140deg,rgba(204,255,0,0.3),rgba(255,255,255,0.04) 40%,rgba(0,56,255,0.2))", filter: "blur(0.5px)" }} />

            <div className="relative rounded-[28px] border border-white/[0.07] bg-[#070c10]/90 p-10 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">

              {/* Trust bar */}
              <div className="flex items-center gap-4 mb-8 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                {[
                  { icon: ShieldCheck, label: "Datos seguros" },
                  { icon: Clock, label: "Acceso 24/7" },
                  { icon: Star, label: "99% satisfechos" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <Icon className="size-4 text-[#CCFF00]" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 text-center">{label}</span>
                  </div>
                ))}
              </div>

              {/* Header */}
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-display,inherit)" }}>
                Inicia sesión
              </h1>
              <p className="text-white/50 text-sm mb-8">
                ¿Nuevo por aquí?{" "}
                <Link href="/registro" className="text-[#CCFF00] hover:underline font-semibold">Crea una cuenta</Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Correo electrónico</span>
                  <div className="mt-2 group relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 focus-within:border-[#CCFF00]/50 focus-within:bg-white/[0.05] transition-colors">
                    <Mail className="size-4 text-white/35 group-focus-within:text-[#CCFF00] transition-colors flex-shrink-0" />
                    <input type="email" value={email} autoComplete="email" onChange={e => setEmail(e.target.value)} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} required placeholder="tu@correo.com"
                      className="w-full bg-transparent px-3 py-4 text-sm text-white placeholder:text-white/25 outline-none" />
                  </div>
                </label>

                {/* Password */}
                <label className="block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">Contraseña</span>
                  <div className="mt-2 group relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 focus-within:border-[#CCFF00]/50 focus-within:bg-white/[0.05] transition-colors">
                    <svg className="size-4 text-white/35 group-focus-within:text-[#CCFF00] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                      className="w-full bg-transparent px-3 py-4 text-sm text-white placeholder:text-white/25 outline-none" />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="text-white/40 hover:text-white/80 transition-colors" aria-label="Mostrar contraseña">
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </label>

                {/* Options */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-white/60 cursor-pointer select-none">
                    <input type="checkbox" className="appearance-none size-4 rounded border border-white/20 bg-white/5 checked:bg-[#CCFF00] checked:border-[#CCFF00] transition-colors" />
                    Mantener sesión
                  </label>
                  <a href="#" className="text-white/60 hover:text-[#CCFF00] transition-colors">¿Olvidaste tu contraseña?</a>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
                  className="group relative w-full overflow-hidden rounded-full bg-[#CCFF00] py-4 font-bold text-black shadow-[0_10px_30px_-8px_rgba(204,255,0,0.55)] disabled:opacity-60">
                  <span className="relative z-10 flex items-center justify-center gap-2 text-[15px]">
                    {isLoading ? "Iniciando sesión..." : "Entrar y ver oferta"}
                    {!isLoading && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-4 text-white/30 text-xs">
                  <div className="h-px flex-1 bg-white/10" />
                  <span>o continúa con</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Social */}
                <div className="grid grid-cols-2 gap-3">
                  {["Google", "Apple"].map(s => (
                    <button key={s} type="button" className="rounded-full border border-white/10 bg-white/[0.02] py-3.5 text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors">{s}</button>
                  ))}
                </div>

                {/* Biometric */}
                <button type="button" className="group w-full flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-3.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors">
                  <Fingerprint className="size-4 text-[#CCFF00]" />
                  Acceso biométrico
                </button>
              </form>
            </div>
          </motion.div>
        </div>

      </div>
    </>
  );
}
