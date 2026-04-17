"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import type React from "react"

interface LayeredTextProps {
  lines?: Array<{ top: string; bottom: string }>
  fontSize?: string
  fontSizeMd?: string
  lineHeight?: number
  lineHeightMd?: number
  className?: string
}

export function LayeredText({
  lines = [
    { top: "\u00A0", bottom: "INFINITE" },
    { top: "INFINITE", bottom: "PROGRESS" },
    { top: "PROGRESS", bottom: "INNOVATION" },
    { top: "INNOVATION", bottom: "FUTURE" },
    { top: "FUTURE", bottom: "DREAMS" },
    { top: "DREAMS", bottom: "ACHIEVEMENT" },
    { top: "ACHIEVEMENT", bottom: "\u00A0" },
  ],
  fontSize = "72px",
  fontSizeMd = "36px",
  lineHeight = 60,
  lineHeightMd = 35,
  className = "",
}: LayeredTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | undefined>(undefined)

  const calculateTranslateX = (index: number) => {
    const baseOffset = 35
    const baseOffsetMd = 20
    const centerIndex = Math.floor(lines.length / 2)
    return {
      desktop: (index - centerIndex) * baseOffset,
      mobile: (index - centerIndex) * baseOffsetMd,
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const paragraphs = Array.from(container.querySelectorAll("p"))
    const yOffset = window.innerWidth >= 768 ? -lineHeight : -lineHeightMd

    const handleMouseEnter = () => {
      gsap.to(paragraphs, {
        y: yOffset,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        overwrite: "auto",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(paragraphs, {
        y: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.04,
        overwrite: "auto",
      })
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
      gsap.killTweensOf(paragraphs)
    }
  }, [lines, lineHeight, lineHeightMd])

  return (
    <div
      ref={containerRef}
      className={`mx-auto py-24 font-black tracking-[-2px] uppercase antialiased cursor-pointer ${className}`}
      style={{ fontSize, fontFamily: "var(--font-display), sans-serif", ["--md-font-size" as string]: fontSizeMd } as React.CSSProperties}
    >
      <ul className="list-none p-0 m-0 flex flex-col items-center">
        {lines.map((line, index) => {
          const translateX = calculateTranslateX(index)
          return (
            <li
              key={index}
              className="overflow-hidden relative"
              style={
                {
                  height: `${lineHeight}px`,
                  transform: `translateX(${translateX.desktop}px) skew(${index % 2 === 0 ? "60deg, -30deg" : "0deg, -30deg"}) scaleY(${index % 2 === 0 ? "0.66667" : "1.33333"})`,
                  ["--md-height" as string]: `${lineHeightMd}px`,
                  ["--md-translateX" as string]: `${translateX.mobile}px`,
                } as React.CSSProperties
              }
            >
              <p
                className="px-[15px] align-top whitespace-nowrap m-0"
                style={
                  {
                    height: `${lineHeight}px`,
                    lineHeight: `${lineHeight}px`,
                  } as React.CSSProperties
                }
              >
                {line.top}
              </p>
              <p
                className="px-[15px] align-top whitespace-nowrap m-0"
                style={
                  {
                    height: `${lineHeight}px`,
                    lineHeight: `${lineHeight}px`,
                  } as React.CSSProperties
                }
              >
                {line.bottom}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
