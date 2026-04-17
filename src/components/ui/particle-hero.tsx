"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  speed: number
  opacity: number
  fadeDelay: number
  fadeStart: number
  fadingOut: boolean
  reset: () => void
  update: () => void
  draw: (ctx: CanvasRenderingContext2D) => void
}

export function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const particle = {
      x: 0,
      y: 0,
      speed: 0,
      opacity: 1,
      fadeDelay: 0,
      fadeStart: 0,
      fadingOut: false,
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.speed = Math.random() / 5 + 0.1
        this.opacity = 1
        this.fadeDelay = Math.random() * 600 + 100
        this.fadeStart = Date.now() + this.fadeDelay
        this.fadingOut = false
      },
      update() {
        this.y -= this.speed
        if (this.y < 0) this.reset()
        if (!this.fadingOut && Date.now() > this.fadeStart) this.fadingOut = true
        if (this.fadingOut) {
          this.opacity -= 0.008
          if (this.opacity <= 0) this.reset()
        }
      },
      draw(ctx: CanvasRenderingContext2D) {
        // Neon lime-yellow particles to match brand
        const r = 180 + Math.floor(Math.random() * 75)
        const g = 230 + Math.floor(Math.random() * 25)
        const b = Math.floor(Math.random() * 30)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`
        ctx.fillRect(this.x, this.y, 0.5, Math.random() * 3 + 1)
      },
    }
    particle.reset()
    particle.y = Math.random() * canvas.height
    particle.fadeDelay = Math.random() * 600 + 100
    particle.fadeStart = Date.now() + particle.fadeDelay
    particle.fadingOut = false
    return particle
  }

  const initParticles = (canvas: HTMLCanvasElement) => {
    const count = Math.floor((canvas.width * canvas.height) / 5000)
    particlesRef.current = []
    for (let i = 0; i < count; i++) particlesRef.current.push(createParticle(canvas))
  }

  const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesRef.current.forEach((p) => { p.update(); p.draw(ctx) })
    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initParticles(canvas)
    animate(canvas, ctx)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: "560px",
        background: "linear-gradient(160deg, #001EB0 0%, #0038FF 40%, #0025CC 70%, #000D5C 100%)",
      }}
    >
      {/* Spotlight beams */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {["-20deg", "0deg", "20deg"].map((rot, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 mx-auto top-0"
            style={{
              width: "600px",
              height: "100%",
              backgroundImage:
                "conic-gradient(from 0deg at 50% -5%, transparent 44%, rgba(204,255,0,.12) 49%, rgba(204,255,0,.2) 50%, rgba(204,255,0,.12) 51%, transparent 56%)",
              transform: `rotate(${rot})`,
              transformOrigin: "50% 0",
              filter: "blur(12px)",
              animation: `spotlight-${i} ${14 + i * 4}s ease-in-out infinite ${i % 2 === 0 ? "" : "reverse"}`,
            }}
          />
        ))}
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Horizontal grid lines */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        {[120, 200, 280, 360, 440].map((top, i) => (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(204,255,0,0.12), transparent)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center h-full text-center px-6"
        style={{ zIndex: 2 }}
      >
        <p
          className="text-xs font-bold tracking-[0.35em] uppercase mb-6"
          style={{
            color: "#CCFF00",
            animation: "fadeUp 0.8s ease-out 0.2s both",
          }}
        >
          Movil Guru
        </p>

        <h1
          className="font-black leading-none mb-6"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            letterSpacing: "-0.03em",
            color: "white",
            textShadow: "0 0 60px rgba(0,56,255,0.8), 0 2px 40px rgba(0,0,0,0.4)",
            animation: "fadeUp 0.8s ease-out 0.4s both",
          }}
        >
          Nuestras
          <br />
          <span style={{ color: "#CCFF00", textShadow: "0 0 40px rgba(204,255,0,0.6)" }}>
            Tiendas
          </span>
        </h1>

        <p
          className="text-lg max-w-md"
          style={{
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7,
            animation: "fadeUp 0.8s ease-out 0.6s both",
          }}
        >
          Visítanos y descubre la experiencia Movil Guru en persona.
          <br />
          Reparaciones, accesorios y mucho más.
        </p>

        <div
          className="flex items-center gap-2 mt-8"
          style={{ animation: "fadeUp 0.8s ease-out 0.8s both" }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#CCFF00", boxShadow: "0 0 8px #CCFF00" }} />
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            4 tiendas disponibles
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
