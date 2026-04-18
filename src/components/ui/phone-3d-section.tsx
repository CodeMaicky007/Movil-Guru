"use client";

import { useEffect, useRef } from "react";

export function Phone3DSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => {
      const wrap = wrapRef.current;
      const stage = stageRef.current;
      if (!wrap || !stage) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const sx = w / 1920;
      const sy = h / 1080;
      const s = Math.min(sx, sy);
      stage.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <section className="mg3d-section">
      <div className="mg3d-wrap" ref={wrapRef}>
        <div className="mg3d-stage" ref={stageRef}>
          {/* BG layers */}
          <div className="mg3d-floor" />
          <div className="mg3d-streak s1" />
          <div className="mg3d-streak s2" />
          <div className="mg3d-streak s3" />

          {/* HUD */}
          <div className="mg3d-hud">
            <div />
            <div className="mg3d-hud-right">
              <span>
                <span className="mg3d-rec-dot" />
                REC · 4K · 24FPS
              </span>
              <span>PROD-04 / SCENE-01</span>
              <span style={{ color: "#0038ff" }}>ONLINE</span>
            </div>
          </div>

          {/* 3D Phone */}
          <div className="mg3d-scene">
            <div className="mg3d-phone-wrap">
              <div className="mg3d-halo" />
              <div className="mg3d-shadow" />
              <div className="mg3d-phone">
                <div className="mg3d-frame" />
                <div className="mg3d-btn mg3d-btn-vu" />
                <div className="mg3d-btn mg3d-btn-vd" />
                <div className="mg3d-btn mg3d-btn-pw" />

                <div className="mg3d-screen">
                  <div className="mg3d-island">
                    <span className="mg3d-eye" />
                    <span className="mg3d-eye green" />
                  </div>

                  <div className="mg3d-screen-inner">
                    <div className="mg3d-ui-stack">
                      {/* BOOT */}
                      <div className="mg3d-ui-layer boot">
                        <div className="mg3d-boot-center">
                          <div className="mg3d-boot-logo">
                            <span className="mg3d-pill-sm k">MOVIL</span>
                            <span className="mg3d-pill-sm l">GURU</span>
                          </div>
                          <div className="mg3d-boot-bar" />
                        </div>
                      </div>

                      {/* HOME */}
                      <div className="mg3d-ui-layer home">
                        <div className="mg3d-status">
                          <span>9:41</span>
                          <span className="mg3d-status-right">
                            <span className="mg3d-bars">
                              <b /><b /><b /><b />
                            </span>
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                              <path d="M1 5 Q 8 -2 15 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                              <path d="M3 7.5 Q 8 3 13 7.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                              <circle cx="8" cy="10" r="1.2" fill="white" />
                            </svg>
                            <span className="mg3d-batt" />
                          </span>
                        </div>

                        <div className="mg3d-home-pad">
                          <div className="mg3d-track">
                            <div className="mg3d-tc-top">
                              <span className="mg3d-tc-label">● Reparación activa</span>
                              <span className="mg3d-tc-id">#MG-2845-71</span>
                            </div>
                            <div>
                              <div className="mg3d-tc-title">iPhone 17 Pro — Pantalla OLED</div>
                              <div className="mg3d-tc-sub">
                                Pieza OEM · Garantía de por vida · Recogida hoy 18:40
                              </div>
                            </div>
                            <div className="mg3d-progress">
                              <b className="on" />
                              <b className="on" />
                              <b className="active" />
                              <b />
                              <b />
                            </div>
                            <div className="mg3d-steps">
                              <b className="on">RECIBIDO</b>
                              <b className="on">DIAG</b>
                              <b className="on">REPAR.</b>
                              <b>QC</b>
                              <b>LISTO</b>
                            </div>
                          </div>

                          <div className="mg3d-svc-row">
                            <div className="mg3d-svc hero">
                              <div className="mg3d-ic">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="6" y="2" width="12" height="20" rx="2" />
                                  <path d="M11 18h2" />
                                </svg>
                              </div>
                              <div className="mg3d-lb">Pantalla</div>
                            </div>
                            <div className="mg3d-svc">
                              <div className="mg3d-ic">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="7" width="18" height="10" rx="2" />
                                  <path d="M22 10v4" />
                                  <path d="M6 12h8" />
                                </svg>
                              </div>
                              <div className="mg3d-lb">Batería</div>
                            </div>
                            <div className="mg3d-svc">
                              <div className="mg3d-ic">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="13" r="4" />
                                  <path d="M4 8h4l2-3h4l2 3h4v11H4z" />
                                </svg>
                              </div>
                              <div className="mg3d-lb">Cámara</div>
                            </div>
                            <div className="mg3d-svc">
                              <div className="mg3d-ic">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 3l-1 4h4l-6 14 1-9H8l6-9z" />
                                </svg>
                              </div>
                              <div className="mg3d-lb">Carga</div>
                            </div>
                          </div>

                          <div className="mg3d-promo">
                            <div className="mg3d-promo-main">
                              <div className="mg3d-h">Hoy · Express</div>
                              <div className="mg3d-t">
                                Cambio<br />en 47 min<br />promedio
                              </div>
                              <div className="mg3d-c">RESERVAR ›</div>
                            </div>
                            <div className="mg3d-promo-side">
                              <div className="mg3d-h">Garantía</div>
                              <div>
                                <div className="mg3d-big">∞</div>
                                <div className="mg3d-sub">De por vida en cada reparación</div>
                              </div>
                            </div>
                          </div>

                          <div className="mg3d-dock">
                            <div className="mg3d-app a">
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.7 6.3l3 3L9 18l-4 1 1-4z" />
                                <path d="M13 8l3 3" />
                              </svg>
                            </div>
                            <div className="mg3d-app b">
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21s-7-4.5-7-11a7 7 0 0114 0c0 6.5-7 11-7 11z" />
                                <circle cx="12" cy="10" r="2.5" />
                              </svg>
                            </div>
                            <div className="mg3d-app c">
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a4 4 0 01-4 4H7l-4 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
                              </svg>
                            </div>
                            <div className="mg3d-app d">
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 7v5l3 2" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="mg3d-home-ind" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating data tags */}
          <div className="mg3d-tag tag-1">
            <span>
              <span className="mg3d-dot" />Vidrio Ceramic Shield · 2.4mm
            </span>
            <span className="mg3d-tag-big">Certificado OEM</span>
            <span className="mg3d-tag-sub">Piezas originales · trazabilidad ISO</span>
          </div>
          <div className="mg3d-tag tag-2">
            <span>
              <span className="mg3d-dot" />Tiempo medio
            </span>
            <span className="mg3d-tag-big">47 min</span>
            <span className="mg3d-tag-sub">Pantalla · Hoy en tienda</span>
          </div>
          <div className="mg3d-tag tag-3">
            <span>
              <span className="mg3d-dot" />Compatible con
            </span>
            <span className="mg3d-tag-big">iPhone · Galaxy · Pixel</span>
            <span className="mg3d-tag-sub">+ plegables · Xiaomi · Motorola</span>
          </div>
          <div className="mg3d-tag tag-4">
            <span>
              <span className="mg3d-dot" />Garantía
            </span>
            <span className="mg3d-tag-big">De por vida</span>
            <span className="mg3d-tag-sub">En cada reparación certificada</span>
          </div>

          {/* Ticker */}
          <div className="mg3d-ticker">
            <div className="mg3d-ticker-track">
              <span>● Reparación express</span><span>— <em>47 min</em> pantalla</span>
              <span>● Piezas OEM certificadas</span><span>— <em>Garantía de por vida</em></span>
              <span>● Recogida hoy</span><span>— <em>+180 tiendas</em></span>
              <span>● iPhone 17 Pro · Galaxy S26 · Pixel 10</span>
              <span>● Diagnóstico gratuito</span>
              <span>● Reparación express</span><span>— <em>47 min</em> pantalla</span>
              <span>● Piezas OEM certificadas</span><span>— <em>Garantía de por vida</em></span>
              <span>● Recogida hoy</span><span>— <em>+180 tiendas</em></span>
              <span>● iPhone 17 Pro · Galaxy S26 · Pixel 10</span>
              <span>● Diagnóstico gratuito</span>
            </div>
          </div>

          {/* Footer copy */}
          <div className="mg3d-foot">
            <div className="mg3d-tagline">
              Cada marca.<br />Reparado <em>hoy</em>.
            </div>
            <div className="mg3d-meta">
              <span className="mg3d-meta-big">movilguru.com</span>
              <span>C/ MAYOR · BURGOS · LEÓN · VALLADOLID</span><br />
              <span>24 / 7 / 365 — 900 00 00 00</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mg3d-section {
          position: relative;
          width: 100%;
          background: #ffffff;
          overflow: hidden;
        }
        .mg3d-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #ffffff;
        }
        .mg3d-stage {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1920px;
          height: 1080px;
          transform-origin: center center;
          overflow: hidden;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          color: #0a0a0a;
          background: #ffffff;
        }
        .mg3d-stage::before {
          content: none;
        }

        .mg3d-floor {
          position: absolute; inset: 55% 0 0 0;
          perspective: 1200px;
          perspective-origin: 50% 0%;
          pointer-events: none;
        }
        .mg3d-floor::before {
          content: ""; position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, transparent 0%, rgba(0,56,255,0.05) 70%, transparent 100%),
            repeating-linear-gradient(to right, rgba(10,10,10,0.07) 0 1px, transparent 1px 80px),
            repeating-linear-gradient(to bottom, rgba(10,10,10,0.07) 0 1px, transparent 1px 80px);
          transform: rotateX(68deg);
          transform-origin: 50% 0%;
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
        }

        .mg3d-streak {
          position: absolute; width: 600px; height: 2px;
          background: linear-gradient(90deg, transparent, #0038ff, transparent);
          filter: blur(1px); opacity: 0.28;
          left: 50%; top: 50%;
          transform-origin: center;
        }
        .mg3d-streak.s1 { animation: mg3d-streak-rot 14s linear infinite; }
        .mg3d-streak.s2 { animation: mg3d-streak-rot 18s linear infinite reverse; width: 800px; opacity: 0.14; background: linear-gradient(90deg, transparent, #ccff00, transparent); }
        .mg3d-streak.s3 { animation: mg3d-streak-rot 22s linear infinite; width: 1000px; opacity: 0.08; }
        @keyframes mg3d-streak-rot {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .mg3d-hud {
          position: absolute; top: 56px; left: 72px; right: 72px;
          display: flex; justify-content: space-between; align-items: center;
          z-index: 20; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(10,10,10,0.55);
        }
        .mg3d-logo-mini { display: flex; gap: 8px; align-items: center; }
        .mg3d-hud-right { display: flex; align-items: center; gap: 24px; }
        .mg3d-pill {
          display: inline-flex; align-items: center; padding: 8px 18px; border-radius: 999px;
          font-weight: 700; font-size: 14px; letter-spacing: 0.08em;
        }
        .mg3d-pill.black { background: #0b0f12; color: #fff; }
        .mg3d-pill.lime  { background: #ccff00; color: #0b0f12; }
        .mg3d-rec-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #ff3b3b;
          animation: mg3d-blink 1.2s ease-in-out infinite;
          margin-right: 8px; display: inline-block; vertical-align: middle;
        }
        @keyframes mg3d-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        .mg3d-foot {
          position: absolute; bottom: 56px; left: 72px; right: 72px;
          display: flex; justify-content: space-between; align-items: flex-end;
          z-index: 20; color: rgba(10,10,10,0.6);
        }
        .mg3d-tagline {
          font-weight: 700; font-size: 56px; line-height: 0.95;
          letter-spacing: -0.03em; color: #0a0a0a; max-width: 640px;
        }
        .mg3d-tagline em { font-style: normal; color: #0038ff; }
        .mg3d-meta {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 12px; letter-spacing: 0.18em;
          text-align: right; color: rgba(10,10,10,0.5);
        }
        .mg3d-meta-big {
          display: block;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-weight: 700; font-size: 28px;
          color: #0a0a0a; letter-spacing: -0.01em; margin-bottom: 4px;
        }

        .mg3d-ticker {
          position: absolute; left: 0; right: 0; bottom: 180px; overflow: hidden;
          height: 44px; z-index: 10;
          border-top: 1px solid rgba(10,10,10,0.08);
          border-bottom: 1px solid rgba(10,10,10,0.08);
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px);
        }
        .mg3d-ticker-track {
          display: flex; gap: 48px; white-space: nowrap;
          padding: 14px 0;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(10,10,10,0.6);
          animation: mg3d-tick 40s linear infinite;
          width: max-content;
        }
        .mg3d-ticker-track span em { color: #0038ff; font-style: normal; }
        @keyframes mg3d-tick {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .mg3d-scene {
          position: absolute; inset: 0;
          display: grid; place-items: center;
          perspective: 2400px;
          perspective-origin: 50% 45%;
          z-index: 5;
        }
        .mg3d-phone-wrap {
          width: 420px; height: 860px;
          position: relative;
          transform-style: preserve-3d;
          animation: mg3d-orbit 14s cubic-bezier(.45,.05,.55,.95) infinite;
        }
        @keyframes mg3d-orbit {
          0%   { transform: rotateX(-4deg) rotateY(-22deg) rotateZ(-1deg); }
          25%  { transform: rotateX(-6deg) rotateY(12deg) rotateZ(1deg); }
          50%  { transform: rotateX(-3deg) rotateY(28deg) rotateZ(0.5deg); }
          75%  { transform: rotateX(-5deg) rotateY(-8deg) rotateZ(-0.5deg); }
          100% { transform: rotateX(-4deg) rotateY(-22deg) rotateZ(-1deg); }
        }

        .mg3d-shadow {
          position: absolute; left: 50%; top: 85%;
          width: 520px; height: 160px; transform: translate(-50%, 0);
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 30%, transparent 70%);
          filter: blur(24px);
          animation: mg3d-shadow-breath 14s ease-in-out infinite;
          z-index: 1;
        }
        @keyframes mg3d-shadow-breath {
          0%, 100% { transform: translate(-50%, 0) scale(1, 1); opacity: 0.55; }
          50%      { transform: translate(-50%, 0) scale(1.15, 0.9); opacity: 0.4; }
        }
        .mg3d-halo {
          position: absolute; left: 50%; top: 50%;
          width: 900px; height: 900px; transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(204,255,0,0.75) 0%, transparent 45%);
          filter: blur(40px);
          animation: mg3d-halo-pulse 6s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes mg3d-halo-pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.75; transform: translate(-50%,-50%) scale(1.06); }
        }

        .mg3d-phone {
          position: absolute; inset: 0;
          border-radius: 56px;
          transform-style: preserve-3d;
          z-index: 2;
        }
        .mg3d-frame {
          position: absolute; inset: 0;
          border-radius: 56px;
          background: linear-gradient(135deg, #3a4250 0%, #1a1f28 40%, #0e1218 70%, #2a313c 100%);
          box-shadow:
            0 2px 0 #4a525e inset,
            0 -2px 0 #0a0d12 inset,
            2px 0 0 #2a303a inset,
            -2px 0 0 #2a303a inset,
            0 60px 120px -20px rgba(0,0,0,0.9),
            0 30px 60px -15px rgba(0,0,0,0.7),
            0 0 60px rgba(204,255,0,0.08);
        }
        .mg3d-frame::before {
          content: ""; position: absolute; inset: 6px;
          border-radius: 50px;
          background: linear-gradient(160deg, #0d1116 0%, #161b23 50%, #0a0d12 100%);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.08) inset,
            0 -1px 0 rgba(0,0,0,0.6) inset;
        }
        .mg3d-frame::after {
          content: ""; position: absolute; inset: 0; border-radius: 56px;
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          mix-blend-mode: screen; pointer-events: none;
          animation: mg3d-sweep 14s linear infinite;
        }
        @keyframes mg3d-sweep {
          0%   { opacity: 0;   transform: translateX(-10%); }
          15%  { opacity: 0.9; }
          45%  { opacity: 0;   transform: translateX(15%); }
          100% { opacity: 0;   transform: translateX(15%); }
        }

        .mg3d-btn {
          position: absolute; width: 4px; border-radius: 2px;
          background: linear-gradient(to right, #1a1f28, #3a424f 60%, #1a1f28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .mg3d-btn-vu { left: -2px; top: 180px; height: 60px; }
        .mg3d-btn-vd { left: -2px; top: 260px; height: 60px; }
        .mg3d-btn-pw { right: -2px; top: 210px; height: 90px; }

        .mg3d-screen {
          position: absolute; inset: 14px;
          border-radius: 44px;
          background: #000;
          overflow: hidden;
          box-shadow:
            0 0 0 2px #000 inset,
            0 0 40px rgba(204,255,0,0.12) inset;
          transform: translateZ(1px);
        }
        .mg3d-screen::after {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.08) 100%);
          mix-blend-mode: screen;
          animation: mg3d-glass-sweep 14s ease-in-out infinite;
        }
        @keyframes mg3d-glass-sweep {
          0%, 100% { transform: translateX(-8%); opacity: 0.5; }
          50%      { transform: translateX(8%);  opacity: 0.9; }
        }

        .mg3d-island {
          position: absolute; left: 50%; top: 14px; transform: translateX(-50%);
          width: 120px; height: 34px; border-radius: 20px;
          background: #000;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03);
          z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 10px;
        }
        .mg3d-eye {
          width: 10px; height: 10px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #2a3340, #050709 70%);
          box-shadow: inset 0 0 0 1px #1a1f28;
        }
        .mg3d-eye.green {
          background: radial-gradient(circle at 30% 30%, #aaffcc 0%, #0a3a20 60%, #050709 100%);
        }

        .mg3d-screen-inner {
          position: absolute; inset: 0;
          opacity: 0;
          animation: mg3d-screen-on 14s linear infinite;
        }
        @keyframes mg3d-screen-on {
          0%   { opacity: 0; filter: brightness(0); }
          6%   { opacity: 1; filter: brightness(0.2); }
          10%  { filter: brightness(1); }
          92%  { opacity: 1; filter: brightness(1); }
          100% { opacity: 0; filter: brightness(0); }
        }

        .mg3d-ui-stack { position: absolute; inset: 0; }
        .mg3d-ui-layer {
          position: absolute; inset: 0;
          opacity: 0;
          display: flex; flex-direction: column;
        }
        .mg3d-ui-layer.boot { animation: mg3d-ui-boot 14s linear infinite; }
        .mg3d-ui-layer.home { animation: mg3d-ui-home 14s linear infinite; background: #0b0f12; }
        @keyframes mg3d-ui-boot {
          0%, 6% { opacity: 0; }
          8% { opacity: 1; }
          14% { opacity: 1; }
          17% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes mg3d-ui-home {
          0%, 16% { opacity: 0; }
          19% { opacity: 1; }
          92% { opacity: 1; }
          96% { opacity: 0; }
          100% { opacity: 0; }
        }

        .mg3d-boot-center {
          position: absolute; inset: 0; display: grid; place-items: center;
          background: radial-gradient(circle at 50% 50%, #0b0f12 0%, #000 100%);
        }
        .mg3d-boot-logo {
          display: flex; gap: 6px;
          animation: mg3d-boot-scale 3s ease-out infinite;
        }
        @keyframes mg3d-boot-scale {
          0% { transform: scale(0.92); opacity: 0; }
          30% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .mg3d-pill-sm {
          padding: 6px 14px; border-radius: 999px; font-weight: 700; font-size: 18px;
          letter-spacing: 0.06em;
        }
        .mg3d-pill-sm.k { background: #0b0f12; color: #fff; border: 1px solid #1a1f28; }
        .mg3d-pill-sm.l { background: #ccff00; color: #0b0f12; }
        .mg3d-boot-bar {
          position: absolute; left: 50%; bottom: 120px; transform: translateX(-50%);
          width: 180px; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,0.08); overflow: hidden;
        }
        .mg3d-boot-bar::after {
          content: ""; position: absolute; left: 0; top: 0; height: 100%; width: 40%;
          background: #ccff00;
          animation: mg3d-boot-fill 2.2s ease-out infinite;
        }
        @keyframes mg3d-boot-fill {
          0% { width: 0; }
          100% { width: 100%; }
        }

        .mg3d-status {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 30px 6px 30px; font-size: 15px; font-weight: 600; color: #fff;
        }
        .mg3d-status-right { display: flex; gap: 6px; align-items: center; }
        .mg3d-bars { display: inline-flex; gap: 2px; align-items: flex-end; }
        .mg3d-bars b { width: 3px; background: #fff; border-radius: 1px; display: block; }
        .mg3d-bars b:nth-child(1) { height: 4px; }
        .mg3d-bars b:nth-child(2) { height: 6px; }
        .mg3d-bars b:nth-child(3) { height: 8px; }
        .mg3d-bars b:nth-child(4) { height: 10px; }
        .mg3d-batt {
          width: 24px; height: 12px; border: 1px solid #fff; border-radius: 3px; position: relative;
        }
        .mg3d-batt::after {
          content: ""; position: absolute; right: -4px; top: 3px; width: 2px; height: 6px;
          background: #fff; border-radius: 1px;
        }
        .mg3d-batt::before {
          content: ""; position: absolute; left: 1px; top: 1px; bottom: 1px; width: 82%;
          background: #ccff00; border-radius: 1px;
        }

        .mg3d-home-pad {
          padding: 6px 24px 22px 24px;
          display: flex; flex-direction: column; gap: 14px;
          height: 100%;
        }

        .mg3d-track {
          border-radius: 22px; padding: 18px;
          background:
            radial-gradient(140% 120% at 0% 0%, #0b1016 0%, #0b0f12 60%),
            #0b0f12;
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
          display: flex; flex-direction: column; gap: 12px;
          position: relative; overflow: hidden;
        }
        .mg3d-track::before {
          content: ""; position: absolute; right: -30px; top: -30px; width: 130px; height: 130px; border-radius: 50%;
          background: radial-gradient(circle, #ccff00 0%, transparent 70%); opacity: 0.25;
        }
        .mg3d-tc-top { display: flex; justify-content: space-between; align-items: center; }
        .mg3d-tc-label {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px; letter-spacing: 0.22em; color: #ccff00; text-transform: uppercase;
        }
        .mg3d-tc-id {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 9px; letter-spacing: 0.18em; color: rgba(255,255,255,0.45);
        }
        .mg3d-tc-title { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
        .mg3d-tc-sub { font-size: 11px; color: rgba(255,255,255,0.55); line-height: 1.3; }
        .mg3d-progress { display: flex; gap: 4px; margin-top: 2px; }
        .mg3d-progress b {
          flex: 1; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08);
          display: block; position: relative; overflow: hidden;
        }
        .mg3d-progress b.on { background: #ccff00; }
        .mg3d-progress b.active { background: rgba(204,255,0,0.25); }
        .mg3d-progress b.active::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(90deg, #ccff00 0%, #ccff00 50%, transparent 50%, transparent 100%);
          background-size: 200% 100%;
          animation: mg3d-fill 2s ease-in-out infinite;
        }
        @keyframes mg3d-fill {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .mg3d-steps {
          display: flex; justify-content: space-between;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 8px; letter-spacing: 0.1em; color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }
        .mg3d-steps b { font-weight: 500; }
        .mg3d-steps b.on { color: #ccff00; }

        .mg3d-svc-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .mg3d-svc {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px; padding: 12px 6px;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: rgba(255,255,255,0.85);
          animation: mg3d-svc-pulse 4s ease-in-out infinite;
        }
        .mg3d-svc:nth-child(1) { animation-delay: 0s; }
        .mg3d-svc:nth-child(2) { animation-delay: 0.3s; }
        .mg3d-svc:nth-child(3) { animation-delay: 0.6s; }
        .mg3d-svc:nth-child(4) { animation-delay: 0.9s; }
        @keyframes mg3d-svc-pulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .mg3d-ic {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #161c24, #0a0d12);
          display: grid; place-items: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .mg3d-svc.hero .mg3d-ic { background: #ccff00; }
        .mg3d-svc.hero .mg3d-ic svg { stroke: #0b0f12; }
        .mg3d-ic svg { stroke: #fff; }
        .mg3d-lb { font-size: 9px; font-weight: 600; letter-spacing: 0.04em; text-align: center; }

        .mg3d-promo { display: grid; grid-template-columns: 1.3fr 1fr; gap: 8px; }
        .mg3d-promo-main {
          background: #ccff00; color: #0b0f12; border-radius: 18px; padding: 12px;
          display: flex; flex-direction: column; justify-content: space-between;
          min-height: 110px; position: relative; overflow: hidden;
        }
        .mg3d-promo-main .mg3d-h { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.7; }
        .mg3d-promo-main .mg3d-t { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; line-height: 0.98; }
        .mg3d-promo-main .mg3d-c {
          font-size: 10px; font-weight: 600;
          background: #0b0f12; color: #ccff00; align-self: flex-start;
          padding: 4px 8px; border-radius: 999px; letter-spacing: 0.1em;
        }
        .mg3d-promo-side {
          background: #0038ff; color: #fff; border-radius: 18px; padding: 12px;
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .mg3d-promo-side .mg3d-h { font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.7; }
        .mg3d-promo-side .mg3d-big {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 34px; font-weight: 800; letter-spacing: -0.04em; line-height: 0.9;
        }
        .mg3d-promo-side .mg3d-sub { font-size: 9px; opacity: 0.75; }
        .mg3d-promo-side::before {
          content: ""; position: absolute; right: -20px; bottom: -20px; width: 80px; height: 80px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .mg3d-dock {
          margin-top: auto;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 22px;
          padding: 10px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
        }
        .mg3d-app {
          width: 100%; aspect-ratio: 1; border-radius: 14px;
          display: grid; place-items: center;
          font-size: 20px; font-weight: 700;
        }
        .mg3d-app.a { background: linear-gradient(135deg, #ccff00, #8dbf00); color: #0b0f12; }
        .mg3d-app.b { background: linear-gradient(135deg, #0038ff, #001f8f); color: #fff; }
        .mg3d-app.c { background: linear-gradient(135deg, #1a1f28, #0b0f12); color: #fff; border: 1px solid rgba(255,255,255,0.08); }
        .mg3d-app.d { background: linear-gradient(135deg, #fff, #c6cbd4); color: #0b0f12; }

        .mg3d-home-ind {
          position: absolute; left: 50%; bottom: 8px; transform: translateX(-50%);
          width: 120px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.55);
        }

        .mg3d-tag {
          position: absolute;
          padding: 10px 14px; border-radius: 14px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(10,10,10,0.08);
          box-shadow: 0 12px 32px rgba(0,56,255,0.08), 0 2px 8px rgba(0,0,0,0.06);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px; letter-spacing: 0.12em;
          color: #0a0a0a; text-transform: uppercase;
          z-index: 8;
          animation: mg3d-float-in 14s ease-in-out infinite;
        }
        .mg3d-dot {
          display: inline-block; width: 6px; height: 6px; border-radius: 50%;
          background: #0038ff; margin-right: 8px; vertical-align: middle;
          box-shadow: 0 0 8px rgba(0,56,255,0.6);
        }
        .mg3d-tag-big {
          display: block;
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 22px; font-weight: 700; letter-spacing: -0.02em;
          text-transform: none; color: #0a0a0a; margin-top: 4px;
        }
        .mg3d-tag-sub {
          display: block; color: rgba(10,10,10,0.5); font-size: 9px; margin-top: 2px;
        }
        @keyframes mg3d-float-in {
          0%, 18% { opacity: 0; transform: translate(0, 16px) scale(0.96); }
          24% { opacity: 1; transform: translate(0, 0) scale(1); }
          86% { opacity: 1; transform: translate(0, 0) scale(1); }
          92% { opacity: 0; transform: translate(0, -8px) scale(0.98); }
          100% { opacity: 0; }
        }
        .mg3d-tag.tag-1 { left: 68%; top: 28%; animation-delay: 0s; }
        .mg3d-tag.tag-2 { left: 12%; top: 42%; animation-delay: 0.3s; }
        .mg3d-tag.tag-3 { left: 72%; top: 58%; animation-delay: 0.6s; }
        .mg3d-tag.tag-4 { left: 16%; top: 66%; animation-delay: 0.9s; }
      `}</style>
    </section>
  );
}
