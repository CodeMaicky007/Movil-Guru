"use client";

import { useEffect, useRef } from "react";

const BRANDS = [
  { src: "/images/Apple.png", alt: "Apple" },
  { src: "/images/Samsung.png", alt: "Samsung" },
  { src: "/images/GooglePixel.png", alt: "Pixel" },
  { src: "/images/Xiaomi.png", alt: "Xiaomi" },
  { src: "/images/huawei.png", alt: "Huawei" },
  { src: "/images/motorola.png", alt: "Motorola" },
];

const W: Record<"A" | "B" | "C" | "D" | "E", number> = {
  A: 0.18,
  B: 0.26,
  C: 0.24,
  D: 0.14,
  E: 0.18,
};

export function ScrollPhone3D() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rxRef = useRef<HTMLElement>(null);
  const ryRef = useRef<HTMLElement>(null);
  const rzRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const pin = pinRef.current;
    if (!scroller || !pin) return;

    const root = scroller;
    const secs = Array.from(pin.querySelectorAll<HTMLDivElement>(".sp3d-sec"));

    let s = 0;
    const boundaries: Record<string, [number, number]> = {};
    (["A", "B", "C", "D", "E"] as const).forEach((k) => {
      boundaries[k] = [s, s + W[k]];
      s += W[k];
    });

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const smooth = (t: number) => {
      t = clamp(t, 0, 1);
      return t * t * (3 - 2 * t);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = scroller.getBoundingClientRect();
        const vh = window.innerHeight;
        const travel = rect.height - vh;
        const p = clamp(-rect.top / travel, 0, 1);

        root.style.setProperty("--p", p.toFixed(4));

        let active: "A" | "B" | "C" | "D" | "E" = "A";
        for (const k of ["A", "B", "C", "D", "E"] as const) {
          const [a, b] = boundaries[k];
          const t = clamp((p - a) / (b - a), 0, 1);
          root.style.setProperty(`--s${k}`, smooth(t).toFixed(4));
          if (p >= a && p < b) active = k;
          if (p >= 0.999) active = "E";
        }

        secs.forEach((el) => {
          el.classList.toggle("sp3d-visible", el.dataset.sec === active);
        });
        pin.setAttribute("data-active-sec", active);

        const parseV = (name: string) =>
          parseFloat(getComputedStyle(root).getPropertyValue(name) || "0");
        const sA = parseV("--sA");
        const sB = parseV("--sB");
        const sC = parseV("--sC");
        const sD = parseV("--sD");
        const sE = parseV("--sE");
        const rx = -4 + sA * 2 + sB * 8 + sC * 4 + sD * -6;
        const ry = -16 + sA * 8 + sB * 360 + sC * -20 + sD * 10 + sE * -8;
        const rz = sB * 2 + sD * -3;
        if (rxRef.current) rxRef.current.textContent = `${rx.toFixed(0)}°`;
        if (ryRef.current)
          ryRef.current.textContent = `${(((ry % 360) + 360) % 360).toFixed(0)}°`;
        if (rzRef.current) rzRef.current.textContent = `${rz.toFixed(1)}°`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="sp3d-root theme-blue tone-warm ori-yx">
      <div className="sp3d-scroller" ref={scrollerRef}>
        <div className="sp3d-pin" ref={pinRef}>
          {/* Atmosphere */}
          <div className="sp3d-floor" aria-hidden />
          <div className="sp3d-streak s1" />
          <div className="sp3d-streak s2" />
          <div className="sp3d-streak s3" />
          <div className="sp3d-ring" aria-hidden />
          <div className="sp3d-halo" aria-hidden />

          <div className="sp3d-bignum" aria-hidden>
            03
          </div>

          {/* 3D phone */}
          <div className="sp3d-stage">
            <div className="sp3d-phone-wrap">
              <div className="sp3d-phone-shadow" />
              <div className="sp3d-phone">
                <div className="sp3d-frame" />
                <span className="sp3d-btn sp3d-btn-vu" />
                <span className="sp3d-btn sp3d-btn-vd" />
                <span className="sp3d-btn sp3d-btn-pw" />
                <div className="sp3d-screen">
                  <div className="sp3d-island">
                    <span className="sp3d-eye" />
                    <span className="sp3d-eye green" />
                  </div>
                  <div className="sp3d-ui">
                    <div className="sp3d-status">
                      <span>9:41</span>
                      <span>●●●● · 5G · 92%</span>
                    </div>
                    <div className="sp3d-body">
                      <div className="sp3d-card-track">
                        <div className="sp3d-ct-row">
                          <span className="sp3d-ct-tag">● Reparación activa</span>
                          <span className="sp3d-ct-id">#MG-2845-71</span>
                        </div>
                        <div className="sp3d-ct-title">
                          iPhone 17 Pro — Pantalla OLED
                        </div>
                        <div className="sp3d-ct-sub">
                          Pieza OEM · Garantía de por vida · Recogida hoy 18:40
                        </div>
                        <div className="sp3d-prog">
                          <b className="on" />
                          <b className="on" />
                          <b className="active" />
                          <b />
                          <b />
                        </div>
                      </div>
                      <div className="sp3d-svc-row">
                        <div className="sp3d-svc hero">
                          <div className="sp3d-ic">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="6" y="2" width="12" height="20" rx="2" />
                              <path d="M11 18h2" />
                            </svg>
                          </div>
                          <div className="sp3d-lb">Pantalla</div>
                        </div>
                        <div className="sp3d-svc">
                          <div className="sp3d-ic">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="18" height="10" rx="2" />
                              <path d="M22 10v4" />
                              <path d="M6 12h8" />
                            </svg>
                          </div>
                          <div className="sp3d-lb">Batería</div>
                        </div>
                        <div className="sp3d-svc">
                          <div className="sp3d-ic">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="13" r="4" />
                              <path d="M4 8h4l2-3h4l2 3h4v11H4z" />
                            </svg>
                          </div>
                          <div className="sp3d-lb">Cámara</div>
                        </div>
                        <div className="sp3d-svc">
                          <div className="sp3d-ic">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 3l-1 4h4l-6 14 1-9H8l6-9z" />
                            </svg>
                          </div>
                          <div className="sp3d-lb">Carga</div>
                        </div>
                      </div>
                      <div className="sp3d-promo">
                        <div className="sp3d-pm">
                          <div className="sp3d-h">Hoy · Express</div>
                          <div className="sp3d-t">
                            Cambio
                            <br />
                            en 47 min
                          </div>
                          <div className="sp3d-c">RESERVAR ›</div>
                        </div>
                        <div className="sp3d-ps">
                          <div className="sp3d-h">Garantía</div>
                          <div>
                            <div className="sp3d-big">∞</div>
                            <div className="sp3d-sub">De por vida</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="sp3d-home-ind" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee (section D) */}
          <div className="sp3d-marquee-wrap" aria-hidden>
            <div className="sp3d-marquee">
              <span className="o">Reparado</span>
              <span>
                <em>hoy</em>
              </span>
              <span className="o">Certificado</span>
              <span>OEM</span>
              <span className="o">Reparado</span>
              <span>
                <em>hoy</em>
              </span>
              <span className="o">Certificado</span>
              <span>OEM</span>
            </div>
            <div className="sp3d-marquee r">
              <span>47 min</span>
              <span className="o">Garantía</span>
              <span>de por vida</span>
              <span className="o">iPhone · Galaxy · Pixel</span>
              <span>47 min</span>
              <span className="o">Garantía</span>
              <span>de por vida</span>
              <span className="o">iPhone · Galaxy · Pixel</span>
            </div>
          </div>

          {/* Section copy overlays */}
          <div className="sp3d-sections">
            {/* 01 HERO */}
            <div className="sp3d-sec sp3d-sec-hero sp3d-visible" data-sec="A">
              <div className="sp3d-copy-left">
                <div className="sp3d-kicker">
                  <span className="sp3d-bar" />
                  01 · Hero · Movil Guru
                </div>
                <h2 className="sp3d-display sp3d-h1">
                  Cada marca,
                  <br />
                  <em>reparada</em>
                  <br />
                  en un día.
                </h2>
                <p className="sp3d-lede">
                  Un laboratorio. Una garantía. Piezas OEM, técnicos certificados y
                  trazabilidad ISO en cada reparación. Desplázate para ver el proceso.
                </p>
                <div className="sp3d-brands">
                  {BRANDS.map((b) => (
                    <img key={b.alt} src={b.src} alt={b.alt} />
                  ))}
                </div>
              </div>
              <div className="sp3d-copy-right">
                <div className="sp3d-scroll-hint">
                  <span>Desplázate</span>
                  <span className="sp3d-line" />
                  <span>para activar</span>
                </div>
              </div>
            </div>

            {/* 02 360 */}
            <div className="sp3d-sec sp3d-sec-360" data-sec="B">
              <div className="sp3d-copy-left">
                <div className="sp3d-eyebrow">
                  <span className="sp3d-num">02</span>
                  360° · Inspección completa
                </div>
                <h2 className="sp3d-display sp3d-h2">
                  Cada
                  <br />
                  <em>ángulo</em>,<br />
                  cada pieza.
                </h2>
                <p className="sp3d-lede">
                  Rotamos el dispositivo sobre 3 ejes para verificar chasis, lentes,
                  botones y puertos antes de abrir nada. Sin reparación a ciegas.
                </p>
                <div className="sp3d-axes">
                  <div className="sp3d-axis">
                    Rx <b ref={rxRef}>0°</b>
                  </div>
                  <div className="sp3d-axis">
                    Ry <b ref={ryRef}>0°</b>
                  </div>
                  <div className="sp3d-axis">
                    Rz <b ref={rzRef}>0°</b>
                  </div>
                </div>
              </div>
              <div className="sp3d-copy-right">
                <div className="sp3d-smallcaps">Escena 02 / 05</div>
                <h3 className="sp3d-display sp3d-h3" style={{ marginTop: 14 }}>
                  Inspección
                  <br />
                  rotacional
                  <br />
                  completa.
                </h3>
                <p className="sp3d-lede sp3d-lede-right">
                  Lente telemétrica 120°.
                  <br />
                  Registro en tiempo real.
                </p>
              </div>
            </div>

            {/* 03 DETAIL */}
            <div className="sp3d-sec sp3d-sec-detail" data-sec="C">
              <div className="sp3d-copy-left">
                <div className="sp3d-eyebrow">
                  <span className="sp3d-num">03</span>
                  Detalle · Capa a capa
                </div>
                <h2 className="sp3d-display sp3d-h2">
                  Cristal.
                  <br />
                  Panel.
                  <br />
                  <em>Chasis.</em>
                </h2>
                <p className="sp3d-lede">
                  Hacemos zoom hasta lo invisible. Cada componente se cataloga, prueba y
                  sustituye con piezas certificadas.
                </p>
                <div className="sp3d-stats">
                  <div className="sp3d-stat">
                    <b>120Hz</b>
                    <span>OLED</span>
                  </div>
                  <div className="sp3d-stat">
                    <b>IP68</b>
                    <span>Sellado</span>
                  </div>
                  <div className="sp3d-stat">
                    <b>&lt;400</b>
                    <span>Ciclos</span>
                  </div>
                </div>
              </div>
              <div className="sp3d-copy-right">
                <div className="sp3d-smallcaps">Aumento · 4.8×</div>
                <h3 className="sp3d-display sp3d-h3" style={{ marginTop: 14 }}>
                  Todo lo que
                  <br />
                  no ves.
                </h3>
              </div>
            </div>

            {/* 04 AIR GAP */}
            <div className="sp3d-sec sp3d-sec-air" data-sec="D">
              <div className="sp3d-copy-left">
                <div className="sp3d-eyebrow">
                  <span className="sp3d-num">04</span>
                  Aire · Transición
                </div>
                <h2 className="sp3d-display sp3d-h2">
                  Un
                  <br />
                  respiro.
                </h2>
                <p className="sp3d-lede">
                  Cada reparación tiene un paso de control silencioso: QC, limpieza,
                  calibración. Luego, listo para recoger.
                </p>
              </div>
            </div>

            {/* 05 CTA */}
            <div className="sp3d-sec sp3d-sec-cta" data-sec="E">
              <div className="sp3d-cta-core">
                <div
                  className="sp3d-eyebrow"
                  style={{ justifyContent: "center" }}
                >
                  <span className="sp3d-num">05</span>
                  Listo para reparar
                </div>
                <p
                  className="sp3d-lede"
                  style={{ margin: "0 auto 8px" }}
                >
                  +180 tiendas · Recogida a domicilio · Diagnóstico gratuito
                </p>
                <div className="sp3d-cta-actions">
                  <a className="sp3d-pill blue" href="/marcas">
                    Reservar ahora <span className="sp3d-arr">›</span>
                  </a>
                  <a className="sp3d-pill" href="/marcas">
                    Rastrear mi reparación <span className="sp3d-arr">›</span>
                  </a>
                </div>
                <div className="sp3d-cta-grid">
                  <div className="sp3d-cta-card">
                    <div className="sp3d-h">Pantallas desde</div>
                    <div className="sp3d-t">
                      <em>39 €</em> · 47 min
                    </div>
                  </div>
                  <div className="sp3d-cta-card">
                    <div className="sp3d-h">Garantía</div>
                    <div className="sp3d-t">
                      De por <em>vida</em>
                    </div>
                  </div>
                  <div className="sp3d-cta-card">
                    <div className="sp3d-h">Piezas</div>
                    <div className="sp3d-t">
                      <em>OEM</em> · trazabilidad ISO
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sp3d-root {
          --blue: #0038ff;
          --lime: #ccff00;
          --ink: #0a0a0a;
          --paper: #ffffff;
          --mute: rgba(10, 10, 10, 0.55);
          --hair: rgba(10, 10, 10, 0.08);
          --ff-display: var(--font-display), "Syne", "Helvetica Neue", Helvetica, Arial, sans-serif;
          --ff-mono: ui-monospace, "SF Mono", Menlo, monospace;
          --halo: 0.7;
          --p: 0;
          --sA: 0;
          --sB: 0;
          --sC: 0;
          --sD: 0;
          --sE: 0;
          display: block;
          position: relative;
          background: #ffffff;
          color: var(--ink);
          font-family: var(--ff-display);
          -webkit-font-smoothing: antialiased;
        }
        .sp3d-root :global(*) {
          box-sizing: border-box;
        }

        .sp3d-scroller {
          position: relative;
          height: 560vh;
        }
        .sp3d-pin {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        .sp3d-stage {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          perspective: 2400px;
          perspective-origin: 50% 45%;
          z-index: 3;
        }

        .sp3d-floor {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 55%;
          perspective: 1200px;
          perspective-origin: 50% 0%;
          pointer-events: none;
          opacity: 0.7;
        }
        .sp3d-floor::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, transparent 0%, rgba(0, 56, 255, 0.06) 70%, transparent 100%),
            repeating-linear-gradient(to right, rgba(10, 10, 10, 0.08) 0 1px, transparent 1px 90px),
            repeating-linear-gradient(to bottom, rgba(10, 10, 10, 0.08) 0 1px, transparent 1px 90px);
          transform: rotateX(68deg);
          transform-origin: 50% 0%;
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
        }

        .sp3d-halo {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 1100px;
          height: 1100px;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(204, 255, 0, calc(0.55 * var(--halo))) 0%,
            transparent 45%
          );
          filter: blur(60px);
          z-index: 1;
          opacity: calc(0.35 + var(--sB) * 0.35 + var(--sC) * 0.2);
          transform: translate(-50%, -50%) scale(calc(0.9 + var(--p) * 0.25));
          transition: opacity 0.2s linear;
        }

        .sp3d-streak {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 720px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
          filter: blur(1px);
          opacity: 0.18;
          transform-origin: center;
          animation: sp3d-streak-rot 18s linear infinite;
          z-index: 1;
        }
        .sp3d-streak.s2 {
          width: 1000px;
          opacity: 0.1;
          background: linear-gradient(90deg, transparent, var(--lime), transparent);
          animation-duration: 24s;
          animation-direction: reverse;
        }
        .sp3d-streak.s3 {
          width: 1400px;
          opacity: 0.06;
          animation-duration: 32s;
        }
        @keyframes sp3d-streak-rot {
          from {
            transform: translate(-50%, -50%) rotate(0);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .sp3d-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 820px;
          height: 820px;
          border: 1px dashed rgba(10, 10, 10, 0.14);
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(calc(var(--sB) * 360deg));
          pointer-events: none;
          z-index: 2;
        }
        .sp3d-ring::before,
        .sp3d-ring::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--blue);
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
        }
        .sp3d-ring::after {
          background: var(--lime);
          top: auto;
          bottom: -5px;
        }

        .sp3d-phone-wrap {
          position: relative;
          width: 380px;
          height: 780px;
          transform-style: preserve-3d;
          --rx: calc(
            -4deg + var(--sA) * 2deg + var(--sB) * 8deg + var(--sC) * 4deg +
              var(--sD) * -6deg + var(--sE) * 0deg
          );
          --ry: calc(
            -16deg + var(--sA) * 8deg + var(--sB) * 360deg + var(--sC) * -20deg +
              var(--sD) * 10deg + var(--sE) * -8deg
          );
          --rz: calc(0deg + var(--sB) * 2deg + var(--sD) * -3deg);
          --scale: calc(
            0.82 + var(--sA) * 0.12 + var(--sB) * 0.08 + var(--sC) * 0.4 +
              var(--sD) * -0.15 + var(--sE) * -0.1
          );
          --ty: calc(var(--sC) * -40px + var(--sD) * 20px);
          transform: translateY(var(--ty)) rotateX(var(--rx)) rotateY(var(--ry))
            rotateZ(var(--rz)) scale(var(--scale));
          transition: transform 0.05s linear;
        }

        .sp3d-phone-shadow {
          position: absolute;
          left: 50%;
          top: 86%;
          width: 520px;
          height: 160px;
          transform: translate(-50%, 0) scale(calc(0.7 + var(--sC) * 0.5));
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.55) 0%,
            rgba(0, 0, 0, 0.22) 30%,
            transparent 70%
          );
          filter: blur(26px);
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
        }

        .sp3d-phone {
          position: absolute;
          inset: 0;
          border-radius: 54px;
          transform-style: preserve-3d;
          z-index: 3;
        }
        .sp3d-frame {
          position: absolute;
          inset: 0;
          border-radius: 54px;
          background: linear-gradient(135deg, #3a4250 0%, #1a1f28 40%, #0e1218 70%, #2a313c 100%);
          box-shadow:
            0 2px 0 #4a525e inset,
            0 -2px 0 #0a0d12 inset,
            2px 0 0 #2a303a inset,
            -2px 0 0 #2a303a inset,
            0 60px 120px -20px rgba(0, 0, 0, 0.85),
            0 30px 60px -15px rgba(0, 0, 0, 0.6),
            0 0 60px rgba(0, 56, 255, 0.08);
        }
        .sp3d-frame::before {
          content: "";
          position: absolute;
          inset: 6px;
          border-radius: 48px;
          background: linear-gradient(160deg, #0d1116 0%, #161b23 50%, #0a0d12 100%);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08) inset, 0 -1px 0 rgba(0, 0, 0, 0.6) inset;
        }
        .sp3d-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 54px;
          background: linear-gradient(
            115deg,
            transparent 42%,
            rgba(255, 255, 255, 0.22) 50%,
            transparent 58%
          );
          mix-blend-mode: screen;
          pointer-events: none;
          opacity: calc(0.4 + var(--sB) * 0.6);
          transform: translateX(calc(var(--sB) * 40px - 20px));
        }
        .sp3d-btn {
          position: absolute;
          width: 4px;
          border-radius: 2px;
          background: linear-gradient(to right, #1a1f28, #3a424f 60%, #1a1f28);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .sp3d-btn-vu {
          left: -2px;
          top: 170px;
          height: 56px;
        }
        .sp3d-btn-vd {
          left: -2px;
          top: 240px;
          height: 56px;
        }
        .sp3d-btn-pw {
          right: -2px;
          top: 200px;
          height: 84px;
        }

        .sp3d-screen {
          position: absolute;
          inset: 14px;
          border-radius: 42px;
          background: #000;
          overflow: hidden;
          box-shadow: 0 0 0 2px #000 inset, 0 0 40px rgba(0, 56, 255, 0.1) inset;
          transform: translateZ(1px);
        }
        .sp3d-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            125deg,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0) 70%,
            rgba(255, 255, 255, 0.1) 100%
          );
          mix-blend-mode: screen;
          transform: translateX(calc(var(--p) * 30px - 15px));
        }
        .sp3d-island {
          position: absolute;
          left: 50%;
          top: 12px;
          transform: translateX(-50%);
          width: 108px;
          height: 30px;
          border-radius: 18px;
          background: #000;
          z-index: 20;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
        }
        .sp3d-eye {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #2a3340, #050709 70%);
          box-shadow: inset 0 0 0 1px #1a1f28;
        }
        .sp3d-eye.green {
          background: radial-gradient(circle at 30% 30%, #aaffcc 0%, #0a3a20 60%, #050709 100%);
        }

        .sp3d-ui {
          position: absolute;
          inset: 0;
          color: #fff;
          font-family: var(--ff-display);
          opacity: calc(0.2 + var(--sA) * 0.8);
        }
        .sp3d-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 26px 4px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }
        .sp3d-body {
          padding: 6px 18px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: calc(100% - 20px);
        }
        .sp3d-card-track {
          border-radius: 20px;
          padding: 14px;
          background: radial-gradient(140% 120% at 0% 0%, #0b1016 0%, #0b0f12 60%);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .sp3d-card-track::before {
          content: "";
          position: absolute;
          right: -30px;
          top: -30px;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: radial-gradient(circle, #ccff00 0%, transparent 70%);
          opacity: 0.22;
        }
        .sp3d-ct-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .sp3d-ct-tag {
          font-family: var(--ff-mono);
          font-size: 8px;
          letter-spacing: 0.22em;
          color: var(--lime);
          text-transform: uppercase;
        }
        .sp3d-ct-id {
          font-family: var(--ff-mono);
          font-size: 8px;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.45);
        }
        .sp3d-ct-title {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .sp3d-ct-sub {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.3;
        }
        .sp3d-prog {
          display: flex;
          gap: 3px;
          margin-top: 10px;
        }
        .sp3d-prog b {
          flex: 1;
          height: 5px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.08);
        }
        .sp3d-prog b.on {
          background: var(--lime);
        }
        .sp3d-prog b.active {
          background: rgba(204, 255, 0, 0.35);
        }
        .sp3d-svc-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }
        .sp3d-svc {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 10px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.85);
        }
        .sp3d-ic {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(135deg, #161c24, #0a0d12);
          display: grid;
          place-items: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .sp3d-svc.hero .sp3d-ic {
          background: var(--lime);
        }
        .sp3d-svc.hero .sp3d-ic :global(svg) {
          stroke: #0b0f12;
        }
        .sp3d-svc .sp3d-ic :global(svg) {
          stroke: #fff;
        }
        .sp3d-lb {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-align: center;
        }
        .sp3d-promo {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 6px;
          flex: 1;
          min-height: 0;
        }
        .sp3d-pm {
          background: var(--lime);
          color: var(--ink);
          border-radius: 16px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .sp3d-pm .sp3d-h {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .sp3d-pm .sp3d-t {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 0.98;
        }
        .sp3d-pm .sp3d-c {
          font-size: 9px;
          font-weight: 700;
          background: var(--ink);
          color: var(--lime);
          align-self: flex-start;
          padding: 4px 8px;
          border-radius: 999px;
          letter-spacing: 0.1em;
        }
        .sp3d-ps {
          background: var(--blue);
          color: #fff;
          border-radius: 16px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .sp3d-ps .sp3d-h {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .sp3d-ps .sp3d-big {
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.9;
        }
        .sp3d-ps .sp3d-sub {
          font-size: 9px;
          opacity: 0.8;
        }
        .sp3d-home-ind {
          position: absolute;
          left: 50%;
          bottom: 6px;
          transform: translateX(-50%);
          width: 110px;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.55);
        }

        /* Marquee */
        .sp3d-marquee-wrap {
          position: absolute;
          left: 0;
          right: 0;
          top: 24vh;
          bottom: 24vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          pointer-events: none;
          opacity: calc(var(--sD) * 1.4 - 0.15);
          z-index: 4;
        }
        .sp3d-marquee {
          display: flex;
          gap: 60px;
          white-space: nowrap;
          font-family: var(--ff-display);
          font-weight: 700;
          letter-spacing: -0.035em;
          font-size: clamp(80px, 12vw, 200px);
          line-height: 0.92;
          animation: sp3d-mq 30s linear infinite;
          width: max-content;
        }
        .sp3d-marquee.r {
          animation-direction: reverse;
          animation-duration: 40s;
        }
        .sp3d-marquee em {
          font-style: normal;
          color: var(--ink);
          -webkit-text-stroke: 0;
        }
        .sp3d-marquee .o {
          color: transparent;
          -webkit-text-stroke: 1.5px var(--ink);
        }
        @keyframes sp3d-mq {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        /* Giant vertical number marker */
        .sp3d-bignum {
          position: absolute;
          right: 40px;
          top: 14vh;
          font-family: var(--ff-display);
          font-weight: 700;
          font-size: clamp(140px, 22vw, 320px);
          line-height: 0.8;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(10, 10, 10, 0.1);
          letter-spacing: -0.05em;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        /* Section copy overlays */
        .sp3d-sections {
          position: absolute;
          inset: 0;
          z-index: 7;
          pointer-events: none;
        }
        .sp3d-sec {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 0 80px;
          opacity: 0;
          transition: opacity 0.25s linear;
          pointer-events: none;
        }
        .sp3d-copy-left {
          grid-column: 1;
          max-width: 560px;
        }
        .sp3d-copy-right {
          grid-column: 2;
          justify-self: end;
          text-align: right;
          max-width: 480px;
        }
        .sp3d-sec.sp3d-visible {
          opacity: 1;
        }

        .sp3d-eyebrow {
          font-family: var(--ff-mono);
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--blue);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .sp3d-num {
          background: var(--ink);
          color: var(--lime);
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .sp3d-display {
          font-family: var(--ff-display);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 0.88;
          margin: 0 0 18px;
          color: inherit;
        }
        .sp3d-h1 {
          font-size: clamp(60px, 7.2vw, 124px);
        }
        .sp3d-h2 {
          font-size: clamp(46px, 5.6vw, 92px);
        }
        .sp3d-h3 {
          font-size: clamp(28px, 3.2vw, 48px);
          line-height: 1;
        }
        .sp3d-sec-cta .sp3d-display {
          color: var(--blue);
        }
        .sp3d-display em {
          font-style: normal;
          color: var(--blue);
        }

        .sp3d-lede {
          font-family: var(--ff-display);
          font-size: 17px;
          line-height: 1.55;
          color: var(--mute);
          max-width: 38ch;
          margin: 0 0 26px;
          font-weight: 400;
        }
        .sp3d-lede-right {
          margin-left: auto;
        }

        .sp3d-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 20px;
        }
        .sp3d-stat {
          border-top: 1px solid var(--hair);
          padding-top: 12px;
        }
        .sp3d-stat b {
          display: block;
          font-family: var(--ff-display);
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .sp3d-stat span {
          display: block;
          font-family: var(--ff-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--mute);
          margin-top: 4px;
        }

        /* Hero */
        .sp3d-sec-hero .sp3d-copy-left {
          max-width: 640px;
        }
        .sp3d-kicker {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          font-family: var(--ff-mono);
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--mute);
        }
        .sp3d-bar {
          width: 48px;
          height: 2px;
          background: var(--blue);
        }
        .sp3d-brands {
          display: flex;
          gap: 26px;
          align-items: center;
          margin-top: 40px;
          opacity: 0.85;
          flex-wrap: wrap;
        }
        .sp3d-brands :global(img) {
          height: 22px;
          width: auto;
          filter: grayscale(1) contrast(1.2);
          opacity: 0.7;
        }
        .sp3d-sec-hero .sp3d-copy-right {
          align-self: end;
          padding-bottom: 14vh;
          max-width: 360px;
        }
        .sp3d-scroll-hint {
          display: inline-flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
          font-family: var(--ff-mono);
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--mute);
        }
        .sp3d-scroll-hint .sp3d-line {
          width: 1px;
          height: 40px;
          background: var(--ink);
          opacity: 0.5;
          position: relative;
          overflow: hidden;
        }
        .sp3d-scroll-hint .sp3d-line::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -40px;
          height: 40px;
          background: var(--blue);
          animation: sp3d-drip 2s ease-in-out infinite;
        }
        @keyframes sp3d-drip {
          0% {
            top: -40px;
          }
          100% {
            top: 40px;
          }
        }

        /* 360 section */
        .sp3d-sec-360 .sp3d-copy-left {
          max-width: 480px;
        }
        .sp3d-axes {
          display: flex;
          gap: 18px;
          margin-top: 22px;
          font-family: var(--ff-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .sp3d-axis {
          padding: 8px 12px;
          border: 1px solid var(--hair);
          border-radius: 8px;
          color: var(--mute);
        }
        .sp3d-axis b {
          color: var(--blue);
          font-weight: 600;
        }

        /* CTA */
        .sp3d-sec-cta {
          padding: 0 60px;
        }
        .sp3d-cta-core {
          grid-column: 1 / -1;
          justify-self: center;
          text-align: center;
          max-width: 960px;
        }
        .sp3d-sec-cta .sp3d-h2 {
          font-size: clamp(64px, 8vw, 148px);
        }
        .sp3d-cta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 40px;
        }
        .sp3d-cta-card {
          border: 1px solid var(--hair);
          border-radius: 20px;
          padding: 22px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          text-align: left;
        }
        .sp3d-cta-card .sp3d-h {
          font-family: var(--ff-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--mute);
          margin-bottom: 10px;
        }
        .sp3d-cta-card .sp3d-t {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .sp3d-cta-card .sp3d-t em {
          font-style: normal;
          color: var(--blue);
        }
        .sp3d-cta-actions {
          display: inline-flex;
          gap: 12px;
          margin-top: 30px;
        }
        .sp3d-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          border-radius: 999px;
          background: var(--ink);
          color: #fff;
          font-family: var(--ff-display);
          font-weight: 600;
          font-size: 15px;
          letter-spacing: -0.01em;
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s;
          text-decoration: none;
        }
        .sp3d-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
        }
        .sp3d-pill.blue {
          background: var(--blue);
          color: #fff;
        }
        .sp3d-arr {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          display: grid;
          place-items: center;
          font-size: 10px;
        }

        .sp3d-smallcaps {
          font-family: var(--ff-mono);
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--mute);
        }

        @media (max-width: 900px) {
          .sp3d-sec {
            grid-template-columns: 1fr;
            padding: 24px;
          }
          .sp3d-copy-right {
            display: none;
          }
          .sp3d-sec-hero .sp3d-copy-right {
            display: block;
            grid-column: 1;
            text-align: left;
            padding-bottom: 0;
          }
          .sp3d-phone-wrap {
            width: 260px;
            height: 540px;
          }
          .sp3d-bignum {
            display: none;
          }
          .sp3d-ring {
            width: 520px;
            height: 520px;
          }
          .sp3d-cta-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sp3d-streak,
          .sp3d-marquee,
          .sp3d-scroll-hint .sp3d-line::after {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
