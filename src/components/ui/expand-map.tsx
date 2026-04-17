"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

interface LocationMapProps {
  location?: string
  coordinates?: string
  address?: string
  hours?: string
  className?: string
}

export function LocationMap({
  location = "Valladolid Centro",
  coordinates = "41.6523° N, 4.7245° W",
  address = "C/ Santiago, 3, Valladolid",
  hours = "Lun–Sáb 10:00–20:00",
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative cursor-pointer select-none ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          background: "linear-gradient(135deg, #0d0d1a 0%, #0a1240 100%)",
          borderColor: isExpanded ? "#CCFF00" : "rgba(0,56,255,0.4)",
          boxShadow: isExpanded
            ? "0 0 30px rgba(204,255,0,0.2), 0 20px 60px rgba(0,0,0,0.5)"
            : "0 8px 40px rgba(0,0,0,0.4)",
        }}
        animate={{
          width: isExpanded ? 340 : 260,
          height: isExpanded ? 300 : 160,
          borderColor: isExpanded ? "#CCFF00" : "rgba(0,56,255,0.4)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        {/* Map visual when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Blue map bg */}
              <div className="absolute inset-0" style={{ background: "#050d1f" }} />

              {/* Street grid */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {[35, 65].map((y, i) => (
                  <motion.line
                    key={`h${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke="#0038FF" strokeWidth="4" strokeOpacity="0.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  />
                ))}
                {[30, 70].map((x, i) => (
                  <motion.line
                    key={`v${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    stroke="#0038FF" strokeWidth="3" strokeOpacity="0.4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  />
                ))}
                {[20, 50, 80].map((y, i) => (
                  <motion.line
                    key={`hs${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke="#0038FF" strokeWidth="1" strokeOpacity="0.2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                  />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <motion.line
                    key={`vs${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    stroke="#0038FF" strokeWidth="1" strokeOpacity="0.15"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }}
                  />
                ))}
              </svg>

              {/* Buildings */}
              {[
                { top: "40%", left: "10%", w: "15%", h: "18%" },
                { top: "15%", left: "35%", w: "12%", h: "14%" },
                { top: "68%", left: "72%", w: "16%", h: "16%" },
                { top: "20%", right: "8%", w: "10%", h: "22%" },
                { top: "55%", left: "5%", w: "8%", h: "12%" },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-sm"
                  style={{ ...b, background: "rgba(0,56,255,0.25)", border: "1px solid rgba(0,56,255,0.4)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                />
              ))}

              {/* Pin */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
              >
                <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24S32 27 32 16C32 7.163 24.837 0 16 0z" fill="#CCFF00"/>
                  <circle cx="16" cy="16" r="6" fill="#000"/>
                </svg>
                <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(204,255,0,0.4) 0%, transparent 70%)", transform: "scale(2.5)" }} />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid dots when collapsed */}
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{ opacity: isExpanded ? 0 : 0.05 }}
        >
          <svg width="100%" height="100%">
            <defs>
              <pattern id={`grid-${location}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0L0 0 0 20" fill="none" stroke="#CCFF00" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${location})`} />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-start justify-between">
            <motion.svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              animate={{ filter: isHovered ? "drop-shadow(0 0 8px rgba(204,255,0,0.8))" : "drop-shadow(0 0 4px rgba(204,255,0,0.3))" }}
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </motion.svg>

            <motion.div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ background: "rgba(204,255,0,0.1)", border: "1px solid rgba(204,255,0,0.2)" }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#CCFF00" }} />
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#CCFF00" }}>
                Abierto
              </span>
            </motion.div>
          </div>

          <div className="space-y-1">
            <motion.h3
              className="font-bold text-sm"
              style={{ color: "white", letterSpacing: "-0.01em" }}
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="space-y-1"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                >
                  <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{address}</p>
                  <p className="text-xs" style={{ color: "rgba(204,255,0,0.7)" }}>{hours}</p>
                  <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>{coordinates}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="h-px"
              style={{ background: "linear-gradient(90deg, #CCFF00, rgba(204,255,0,0.2), transparent)" }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              initial={{ scaleX: 0.3, originX: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      <motion.p
        className="absolute -bottom-6 left-1/2 text-[10px] whitespace-nowrap"
        style={{ x: "-50%", color: "rgba(255,255,255,0.4)" }}
        animate={{ opacity: isHovered && !isExpanded ? 1 : 0, y: isHovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
      >
        Clic para ver detalles
      </motion.p>
    </motion.div>
  )
}
