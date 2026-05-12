"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Header = dynamic(
  () => import("@/components/ui/header-3").then((m) => m.Header),
  { ssr: false }
);

const HeroComponent = dynamic(
  () => import("@/components/ui/hero").then((m) => m.HeroComponent),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/ui/footer-section").then((m) => m.Footer),
  { ssr: false }
);

const RulesShowcase = dynamic(
  () => import("@/components/ui/spatial-rules-showcase"),
  { ssr: false }
);

const MovilGuruBento = dynamic(
  () => import("@/components/ui/movil-guru-bento"),
  { ssr: false }
);

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function useHorizontalScroll() {
  useIsoLayoutEffect(() => {
    const outer = document.querySelector<HTMLElement>(".mg-content-outer");
    const track = document.querySelector<HTMLElement>(".mg-content-track");
    if (!outer || !track) return;

    if (window.matchMedia("(max-width: 1023.98px)").matches) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          pin: true,
          pinType: "transform",
          scrub: 1.2,
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          invalidateOnRefresh: true,
        },
      });

      track.querySelectorAll<HTMLElement>(".mg-h-section").forEach((section) => {
        const els = section.querySelectorAll<HTMLElement>(".anim-title");
        const subs = section.querySelectorAll<HTMLElement>(".anim-sub");
        els.forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 80, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 1.15,
              delay: i * 0.08,
              ease: "power4.out",
              scrollTrigger: {
                trigger: section,
                containerAnimation: tween,
                start: "left 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
        subs.forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.15 + i * 0.07,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                containerAnimation: tween,
                start: "left 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        const cards = section.querySelectorAll<HTMLElement>(
          ".story-facts .fact, .founders-gallery .founder-item"
        );
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: section,
                containerAnimation: tween,
                start: "left 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);
}

function useVerticalAnimations() {
  useIsoLayoutEffect(() => {
    let refreshTimers: ReturnType<typeof setTimeout>[] = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".v-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 80, clipPath: "inset(0 0 100% 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".v-fade-up").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".v-stagger-group").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>(":scope > *");
        if (items.length === 0) return;
        const fromLeft = group.dataset.from === "left";
        gsap.fromTo(
          items,
          fromLeft
            ? { opacity: 0, x: -60 }
            : { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    refreshTimers.push(setTimeout(() => ScrollTrigger.refresh(), 300));
    refreshTimers.push(setTimeout(() => ScrollTrigger.refresh(), 1200));
    refreshTimers.push(setTimeout(() => ScrollTrigger.refresh(), 2500));

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      refreshTimers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);
}


const proceso = [
  {
    n: "01",
    title: "Diagnóstico gratis",
    body: "Revisión completa en 15 minutos. Te decimos qué pasa y cuánto cuesta antes de hacer nada.",
  },
  {
    n: "02",
    title: "Presupuesto cerrado",
    body: "Precio fijo por escrito. Sin extras ni letra pequeña al recoger.",
  },
  {
    n: "03",
    title: "Reparación al momento",
    body: "La mayoría de averías resueltas en el día. Pantallas, baterías y conectores en 30 min.",
  },
  {
    n: "04",
    title: "Test 360°",
    body: "Revisamos el móvil entero antes de entregártelo. Garantía activada desde ese segundo.",
  },
];

const testimonios = [
  {
    quote:
      "Me cambiaron la pantalla del iPhone en 25 minutos y me dieron garantía de por vida. Nunca más pisé otra tienda.",
    name: "Laura G.",
    meta: "iPhone 14 Pro · Pantalla",
  },
  {
    quote:
      "Llevé un Samsung que otros habían rechazado por daño por agua. Me lo arreglaron y sigue funcionando dos años después.",
    name: "Diego R.",
    meta: "Galaxy S22 · Placa base",
  },
  {
    quote:
      "Transparencia total. Me enseñaron la batería original y la nueva antes de montarla. Ojalá todos los negocios fueran así.",
    name: "Marta P.",
    meta: "Pixel 7 · Batería",
  },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useHorizontalScroll();
  useVerticalAnimations();

  useEffect(() => {
    const canvas = canvasRef.current;
    const loaderEl = loaderRef.current;
    const progressBar = progressRef.current;
    if (!canvas || !loaderEl || !progressBar) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (renderer as any).outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x88aaff, 1.2);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, 3, -6);
    scene.add(rimLight);
    const accent = new THREE.PointLight(0xffaa66, 1.5, 20);
    accent.position.set(3, -2, 3);
    scene.add(accent);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 256;
    envCanvas.height = 256;
    const ectx = envCanvas.getContext("2d")!;
    const grad = ectx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#a8b5d4");
    grad.addColorStop(0.5, "#4a5570");
    grad.addColorStop(1, "#111218");
    ectx.fillStyle = grad;
    ectx.fillRect(0, 0, 256, 256);
    const rg = ectx.createRadialGradient(154, 64, 10, 154, 64, 128);
    rg.addColorStop(0, "rgba(255,255,255,0.85)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    ectx.fillStyle = rg;
    ectx.fillRect(0, 0, 256, 256);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmrem.fromEquirectangular(envTex).texture;
    envTex.dispose();
    pmrem.dispose();

    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    let phoneModel: THREE.Object3D | null = null;
    let modelReady = false;
    let rafId = 0;
    let disposed = false;

    const animate = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);
      if (phoneModel) {
        phoneGroup.position.x +=
          Math.sin(performance.now() * 0.0008) * 0.00005;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const BLUE = { r: 0, g: 56, b: 255 };
    const DEEP = { r: 10, g: 10, b: 31 };
    const bgState = { r: BLUE.r, g: BLUE.g, b: BLUE.b };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const applyBg = () => {
      document.body.style.backgroundColor = `rgb(${bgState.r | 0}, ${bgState.g | 0
        }, ${bgState.b | 0})`;
    };
    applyBg();

    const triggers: ScrollTrigger[] = [];

    const initScrollTimelines = () => {
      if (!modelReady) return;

      gsap.to(".sec-hero .hero-text-block", {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.15,
        ease: "power3.out",
      });
      gsap.to(".sec-hero .hint", {
        opacity: 1,
        duration: 1,
        delay: 1,
        ease: "power2.out",
      });

      const isMobile = window.innerWidth < 768;
      const sideOffset = isMobile ? 0 : 1.6;

      triggers.push(
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            progressBar.style.width = self.progress * 100 + "%";
          },
        })
      );

      const t1 = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".sec-zoom",
            start: "top bottom",
            end: "top top",
            scrub: 1.5,
          },
        })
        .to(
          phoneGroup.position,
          { x: 0, y: 0, z: 0, ease: "power2.inOut" },
          0
        )
        .to(
          phoneGroup.scale,
          { x: 1.0, y: 1.0, z: 1.0, ease: "power2.inOut" },
          0
        )
        .to(phoneGroup.rotation, { y: 0, ease: "none" }, 0);
      if (t1.scrollTrigger) triggers.push(t1.scrollTrigger);

      const t2 = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".sec-zoom",
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        })
        .to(
          phoneGroup.position,
          {
            x: sideOffset * 0.5,
            y: 0,
            z: 0.8,
            ease: "power1.inOut",
          },
          0
        )
        .to(
          phoneGroup.scale,
          { x: 1.05, y: 1.05, z: 1.05, ease: "power1.inOut" },
          0
        )
        .to(
          phoneGroup.rotation,
          { y: THREE.MathUtils.degToRad(15), ease: "power1.inOut" },
          0
        )
        .fromTo(
          ".sec-zoom .text-block",
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, ease: "power2.out", duration: 0.35 },
          0
        )
        .to(
          ".sec-zoom .text-block",
          { opacity: 0, x: -20, ease: "power1.in", duration: 0.25 },
          0.85
        );
      if (t2.scrollTrigger) triggers.push(t2.scrollTrigger);

      const t3 = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".sec-spin",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
            onUpdate: (self) => {
              const t = gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.7);
              bgState.r = lerp(BLUE.r, DEEP.r, t);
              bgState.g = lerp(BLUE.g, DEEP.g, t);
              bgState.b = lerp(BLUE.b, DEEP.b, t);
              applyBg();
            },
          },
        })
        .to(
          phoneGroup.position,
          { x: 0, y: 0, z: 0.4, ease: "power1.inOut" },
          0
        )
        .to(
          phoneGroup.scale,
          { x: 1.15, y: 1.15, z: 1.15, ease: "power1.inOut" },
          0
        )
        .to(
          phoneGroup.rotation,
          { y: THREE.MathUtils.degToRad(15 + 360), ease: "none" },
          0
        )
        .fromTo(
          ".sec-spin .text-block",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 },
          0.05
        )
        .to(
          ".sec-spin .text-block",
          { opacity: 0, y: -30, ease: "power1.in", duration: 0.3 },
          0.78
        );
      if (t3.scrollTrigger) triggers.push(t3.scrollTrigger);

      const t4 = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".sec-camera",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        })
        .to(
          phoneGroup.position,
          { x: -sideOffset, y: 0.0, z: 0.8, ease: "power2.inOut" },
          0
        )
        .to(
          phoneGroup.scale,
          { x: 1.05, y: 1.05, z: 1.05, ease: "power2.inOut" },
          0
        )
        .to(
          phoneGroup.rotation,
          {
            y: THREE.MathUtils.degToRad(15 + 360 + 180),
            x: THREE.MathUtils.degToRad(-4),
            ease: "power2.inOut",
          },
          0
        )
        .fromTo(
          ".sec-camera .text-block",
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, ease: "power2.out", duration: 0.35 },
          0.05
        )
        .to(
          ".sec-camera .text-block",
          { opacity: 0, x: 20, ease: "power1.in", duration: 0.25 },
          0.85
        );
      if (t4.scrollTrigger) triggers.push(t4.scrollTrigger);

      const t5 = gsap
        .timeline({
          scrollTrigger: {
            trigger: ".sec-cta",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.5,
            onUpdate: (self) => {
              const t = gsap.utils.clamp(0, 1, self.progress / 0.6);
              bgState.r = lerp(DEEP.r, BLUE.r, t);
              bgState.g = lerp(DEEP.g, BLUE.g, t);
              bgState.b = lerp(DEEP.b, BLUE.b, t);
              applyBg();
            },
          },
        })
        .to(
          phoneGroup.position,
          { x: 0, y: -0.2, z: 0, ease: "power2.inOut" },
          0
        )
        .to(
          phoneGroup.scale,
          { x: 0.92, y: 0.92, z: 0.92, ease: "power2.inOut" },
          0
        )
        .to(
          phoneGroup.rotation,
          {
            y: THREE.MathUtils.degToRad(15 + 360 + 360),
            x: 0,
            ease: "power2.inOut",
          },
          0
        );
      if (t5.scrollTrigger) triggers.push(t5.scrollTrigger);

      const ctaH2 = gsap.to(".sec-cta h2", {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        duration: 1,
        scrollTrigger: {
          trigger: ".sec-cta",
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });
      if (ctaH2.scrollTrigger) triggers.push(ctaH2.scrollTrigger);

      const ctaWrap = gsap.to(".sec-cta .cta-wrap", {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        duration: 1,
        delay: 0.15,
        scrollTrigger: {
          trigger: ".sec-cta",
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });
      if (ctaWrap.scrollTrigger) triggers.push(ctaWrap.scrollTrigger);

      const canvasFadeIn = gsap.fromTo(
        "#webgl",
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".sec-hero",
            start: "top 95%",
            end: "top 50%",
            scrub: true,
          },
        }
      );
      if (canvasFadeIn.scrollTrigger) triggers.push(canvasFadeIn.scrollTrigger);

      const canvasFade = gsap.to("#webgl", {
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".sec-story",
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        },
      });
      if (canvasFade.scrollTrigger) triggers.push(canvasFade.scrollTrigger);

      ScrollTrigger.refresh();
    };

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/models/iphone17pro.glb",
      (gltf) => {
        phoneModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(phoneModel);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        phoneModel.position.sub(center);
        const s = 3.2 / size.y;
        phoneModel.scale.setScalar(s);

        phoneModel.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh && mesh.material) {
            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            mats.forEach((m) => {
              const mm = m as THREE.MeshStandardMaterial;
              if (
                (mm as THREE.MeshStandardMaterial).isMeshStandardMaterial ||
                (m as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial
              ) {
                mm.envMapIntensity = 1.2;
                if (mm.metalness !== undefined && mm.metalness > 0.5) {
                  mm.envMapIntensity = 1.6;
                }
              }
            });
          }
        });

        phoneGroup.add(phoneModel);
        phoneGroup.position.set(0, -1.6, 0);
        phoneGroup.scale.setScalar(0.7);
        phoneGroup.rotation.set(0, 0, 0);

        modelReady = true;
        loaderEl.classList.add("hidden");
        initScrollTimelines();
      },
      undefined,
      (err) => {
        console.error("Error loading GLB:", err);
        const fallback = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 3, 0.18),
          new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.25,
            envMapIntensity: 1.5,
          })
        );
        phoneGroup.add(fallback);
        phoneModel = fallback;
        phoneGroup.position.set(0, -1.6, 0);
        phoneGroup.scale.setScalar(0.7);
        modelReady = true;
        loaderEl.classList.add("hidden");
        initScrollTimelines();
      }
    );

    const ctaEl = ctaRef.current;
    const onCta = () => {
      gsap.fromTo(
        ctaEl,
        { scale: 1 },
        {
          scale: 0.95,
          yoyo: true,
          repeat: 1,
          duration: 0.15,
          ease: "power2.out",
        }
      );
    };
    ctaEl?.addEventListener("click", onCta);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      ctaEl?.removeEventListener("click", onCta);
      triggers.forEach((t) => t.kill());
      renderer.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((m) => (m as THREE.Material).dispose());
        }
      });
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --mg-blue: #0038ff;
          --mg-blue-deep: #001a99;
          --mg-blue-ink: #001166;
          --mg-lime: #ccff00;
          --mg-ink: #080e14;
          --mg-white: #ffffff;
        }
        html,
        body {
          background: var(--mg-blue);
          color: var(--mg-white);
          font-family: var(--font-display), "Syne", -apple-system,
            BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: clip;
        }
        body {
          transition: background-color 0.1s linear;
        }
        body::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
          opacity: 0.9;
        }
        #webgl {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
        }
        #mg-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--mg-blue);
          color: var(--mg-white);
          z-index: 100;
          font-weight: 600;
          letter-spacing: 0.08em;
          font-size: 14px;
          text-transform: uppercase;
          transition: opacity 0.6s ease;
        }
        #mg-loader.hidden {
          opacity: 0;
          pointer-events: none;
        }
        #mg-loader .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--mg-lime);
          margin: 0 3px;
          animation: mgPulse 1.4s ease-in-out infinite;
          display: inline-block;
        }
        #mg-loader .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        #mg-loader .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes mgPulse {
          0%,
          80%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        main.mg-about {
          position: relative;
          z-index: 2;
        }
        main.mg-about section.scene {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 6vw;
        }
        .mg-about .eyebrow {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-weight: 800;
          color: var(--mg-lime);
          margin-bottom: 22px;
        }
        .mg-about h1,
        .mg-about h2 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.95;
          text-wrap: balance;
          text-transform: uppercase;
        }
        .mg-shadow-triple {
          text-shadow: 2px 2px 0 var(--mg-blue-deep),
            4px 4px 0 var(--mg-blue-deep), 6px 6px 0 var(--mg-blue-deep);
        }
        .mg-about .headline-xl {
          font-size: clamp(32px, 6vw, 88px);
          font-weight: 800;
          letter-spacing: -0.05em;
          color: var(--mg-lime);
          line-height: 0.9;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: manual;
        }
        .mg-about .headline-lg {
          font-size: clamp(34px, 6vw, 92px);
          font-weight: 800;
          letter-spacing: -0.035em;
          color: var(--mg-white);
          line-height: 0.95;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: manual;
        }
        .mg-about .hl-lime {
          color: var(--mg-lime);
        }
        .mg-about .hl-blue {
          color: var(--mg-blue);
        }
        .mg-about .sec-spin .headline-lg {
          color: var(--mg-lime);
        }
        .mg-about p.sub {
          margin-top: 22px;
          font-size: clamp(15px, 1.2vw, 19px);
          font-weight: 500;
          color: var(--mg-white);
          max-width: 460px;
          line-height: 1.55;
          letter-spacing: -0.005em;
          text-transform: none;
        }
        .mg-about .sec-hero {
          justify-content: center;
          align-items: center;
          text-align: center;
          flex-direction: column;
          background: transparent;
          padding-bottom: 28vh;
        }
        .mg-about .sec-hero::after {
          content: "";
          position: absolute;
          right: 8vw;
          top: 18vh;
          width: 90px;
          height: 90px;
          background: var(--mg-lime);
          border: 3px solid var(--mg-ink);
          border-radius: 50%;
          box-shadow: 6px 6px 0 var(--mg-ink);
          opacity: 0.95;
          z-index: -1;
        }
        .mg-about .hero-text-block {
          opacity: 0;
          transform: translateY(20px);
        }
        .mg-about .sec-hero .hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.35em;
          color: var(--mg-lime);
          text-transform: uppercase;
          font-weight: 800;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0;
        }
        .mg-about .sec-hero .hint .line {
          width: 2px;
          height: 40px;
          background: linear-gradient(to bottom, var(--mg-lime), transparent);
          animation: mgScrollHint 2s ease-in-out infinite;
        }
        @keyframes mgScrollHint {
          0%,
          100% {
            transform: scaleY(1);
            transform-origin: top;
          }
          50% {
            transform: scaleY(0.3);
            transform-origin: top;
          }
        }
        .mg-about .sec-zoom {
          justify-content: flex-start;
        }
        .mg-about .sec-zoom .text-block {
          max-width: min(520px, 44vw);
          opacity: 0;
          transform: translateX(-30px);
        }
        .mg-about .sec-spin {
          justify-content: center;
          text-align: center;
          flex-direction: column;
        }
        .mg-about .sec-spin .text-block {
          opacity: 0;
          transform: translateY(30px);
        }
        .mg-about .sec-camera {
          justify-content: flex-end;
          text-align: right;
        }
        .mg-about .sec-camera .text-block {
          max-width: min(520px, 44vw);
          opacity: 0;
          transform: translateX(30px);
        }
        .mg-about .sec-camera p.sub {
          margin-left: auto;
        }
        .mg-about .sec-cta {
          justify-content: center;
          text-align: center;
          flex-direction: column;
        }
        .mg-about .sec-cta h2 {
          opacity: 0;
          transform: translateY(20px);
        }
        .mg-about .sec-cta .cta-wrap {
          opacity: 0;
          transform: translateY(20px);
          margin-top: 40px;
        }
        .mg-about .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 22px 44px;
          background: var(--mg-lime);
          color: var(--mg-ink);
          border-radius: 999px;
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          text-decoration: none;
          border: 3px solid var(--mg-ink);
          cursor: pointer;
          box-shadow: 6px 6px 0 var(--mg-ink);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
            background 0.3s ease;
        }
        .mg-about .cta-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0 var(--mg-ink);
          background: #dfff4a;
        }
        .mg-about .cta-btn:active {
          transform: translate(3px, 3px);
          box-shadow: 2px 2px 0 var(--mg-ink);
        }
        .mg-about .cta-btn .arrow {
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .mg-about .cta-btn:hover .arrow {
          transform: translateX(4px);
        }
        #mg-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: var(--mg-lime);
          width: 0%;
          z-index: 50;
          transition: width 0.1s linear;
          box-shadow: 0 0 12px rgba(204, 255, 0, 0.7);
        }
        .mg-about .scene-badge {
          display: none;
          position: absolute;
          top: 40px;
          left: 6vw;
          font-size: 11px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--mg-lime);
          font-weight: 800;
          padding: 8px 14px;
          border: 2px solid var(--mg-lime);
          border-radius: 999px;
          background: rgba(0, 17, 102, 0.35);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .mg-about .sec-camera .scene-badge {
          left: auto;
          right: 6vw;
        }

        .mg-content {
          position: relative;
          z-index: 3;
          background: var(--mg-ink);
          color: var(--mg-white);
        }
        .mg-content .sec-story {
          padding: clamp(96px, 14vh, 180px) 6vw;
          background: var(--mg-ink);
          position: relative;
          overflow: hidden;
        }
        .mg-content .sec-story::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.04) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
          pointer-events: none;
        }
        .mg-content .story-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 900px) {
          .mg-content .story-inner {
            grid-template-columns: 1.1fr 1fr;
            gap: 80px;
            align-items: center;
          }
        }
        .mg-content .story-head h2 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(40px, 6vw, 88px);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 0.95;
          letter-spacing: -0.035em;
          color: var(--mg-white);
        }
        .mg-content .story-head p {
          margin-top: 24px;
          font-size: 17px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.72);
          max-width: 520px;
          text-transform: none;
        }
        .mg-content .story-facts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .mg-content .story-facts .fact {
          border: 2px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.02);
          padding: 22px 22px 26px;
          border-radius: 14px;
        }
        .mg-content .story-facts .fact b {
          display: block;
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 800;
          color: var(--mg-lime);
          letter-spacing: -0.02em;
          line-height: 1;
          margin-bottom: 10px;
        }
        .mg-content .story-facts .fact span {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 600;
        }

        .mg-content .sec-founders {
          background: var(--mg-blue);
          padding: clamp(80px, 12vh, 140px) 6vw;
          position: relative;
          overflow: hidden;
        }
        .mg-content .sec-founders::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          pointer-events: none;
        }
        .mg-content .founders-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }
        .mg-content .founders-label {
          font-size: 12px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--mg-lime);
          font-weight: 800;
          margin-bottom: 18px;
        }
        .mg-content .founders-title {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(40px, 7vw, 104px);
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.92;
          color: var(--mg-lime);
          max-width: 900px;
          margin-bottom: 56px;
        }
        .mg-content .founders-gallery {
          display: flex;
          align-items: stretch;
          gap: 10px;
          height: 480px;
          width: 100%;
        }
        .mg-content .founder-item {
          position: relative;
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: 80px;
          min-width: 80px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid var(--mg-ink);
          box-shadow: 5px 5px 0 var(--mg-ink);
          transition: flex-basis 0.55s cubic-bezier(0.4, 0, 0.2, 1),
            flex-grow 0.55s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.3s ease;
        }
        .mg-content .founders-gallery:hover .founder-item {
          flex-grow: 0.3;
        }
        .mg-content .founders-gallery .founder-item:hover {
          flex-grow: 4;
          box-shadow: 8px 8px 0 var(--mg-ink);
        }
        .mg-content .founder-item img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mg-content .founder-item:hover img {
          transform: scale(1.04);
        }
        .mg-content .founder-item .founder-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 17, 102, 0.92) 0%,
            rgba(0, 17, 102, 0.5) 40%,
            transparent 70%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px 22px;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .mg-content .founder-item:hover .founder-overlay {
          opacity: 1;
        }
        .mg-content .founder-item .founder-tag {
          position: absolute;
          top: 18px;
          left: 18px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--mg-lime);
          background: var(--mg-ink);
          padding: 5px 10px;
          border-radius: 999px;
          border: 1.5px solid var(--mg-lime);
          white-space: nowrap;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s;
        }
        .mg-content .founder-item:hover .founder-tag {
          opacity: 1;
          transform: translateY(0);
        }
        .mg-content .founder-overlay h3 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: var(--mg-white);
          line-height: 1.05;
          transform: translateY(8px);
          transition: transform 0.35s ease 0.05s;
          white-space: nowrap;
        }
        .mg-content .founder-item:hover .founder-overlay h3 {
          transform: translateY(0);
        }
        .mg-content .founder-overlay p {
          margin-top: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.45;
          text-transform: none;
          transform: translateY(8px);
          transition: transform 0.35s ease 0.1s;
          max-width: 260px;
        }
        .mg-content .founder-item:hover .founder-overlay p {
          transform: translateY(0);
        }
        @media (max-width: 640px) {
          .mg-content .founders-gallery {
            height: 320px;
          }
          .mg-content .founder-item {
            min-width: 48px;
          }
        }

        .mg-content .sec-values {
          background: var(--mg-white);
          color: var(--mg-ink);
          padding: clamp(96px, 14vh, 180px) 6vw;
        }
        .mg-content .values-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .mg-content .values-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 40px;
          flex-wrap: wrap;
          margin-bottom: 64px;
        }
        .mg-content .values-head .eyebrow {
          color: var(--mg-blue);
          font-size: 12px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          font-weight: 800;
        }
        .mg-content .values-head h2 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(40px, 6vw, 92px);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: var(--mg-ink);
          margin-top: 14px;
          max-width: 780px;
        }
        .mg-content .values-head p {
          max-width: 380px;
          font-size: 16px;
          line-height: 1.6;
          color: rgba(8, 14, 20, 0.65);
          text-transform: none;
          font-weight: 500;
        }
        .mg-content .values-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 700px) {
          .mg-content .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .mg-content .values-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .mg-content .value-card {
          background: var(--mg-ink);
          color: var(--mg-white);
          border-radius: 18px;
          padding: 36px 28px 32px;
          position: relative;
          overflow: hidden;
          border: 3px solid var(--mg-ink);
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
            background 0.35s ease, color 0.35s ease;
        }
        .mg-content .value-card .num {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: var(--mg-lime);
          margin-bottom: 44px;
        }
        .mg-content .value-card h3 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(22px, 2vw, 28px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin-bottom: 14px;
        }
        .mg-content .value-card p {
          font-size: 14.5px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.72);
          text-transform: none;
          font-weight: 500;
        }
        .mg-content .value-card:hover {
          transform: translateY(-4px);
          background: var(--mg-blue);
        }
        .mg-content .value-card:nth-child(4n + 2):hover {
          background: var(--mg-lime);
          color: var(--mg-ink);
        }
        .mg-content .value-card:nth-child(4n + 2):hover p {
          color: rgba(8, 14, 20, 0.75);
        }
        .mg-content .value-card:nth-child(4n + 2):hover .num {
          color: var(--mg-ink);
        }

        .mg-content .sec-process {
          background: var(--mg-blue);
          padding: clamp(96px, 14vh, 180px) 6vw;
          position: relative;
          overflow: hidden;
        }
        .mg-content .sec-process::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          pointer-events: none;
        }
        .mg-content .process-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }
        .mg-content .process-head .eyebrow {
          color: var(--mg-lime);
        }
        .mg-content .process-head h2 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(40px, 6vw, 92px);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: var(--mg-white);
          margin-top: 14px;
          max-width: 900px;
        }
        .mg-content .process-head h2 em {
          font-style: normal;
          color: var(--mg-lime);
        }
        .mg-content .process-grid {
          margin-top: 72px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          border-top: 2px solid rgba(255, 255, 255, 0.18);
        }
        .mg-content .process-row {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 24px;
          padding: 28px 0 26px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.18);
          align-items: start;
        }
        @media (min-width: 900px) {
          .mg-content .process-row {
            grid-template-columns: 140px 1.1fr 1.2fr;
            gap: 48px;
            align-items: center;
          }
        }
        .mg-content .process-row .n {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(32px, 3vw, 44px);
          font-weight: 800;
          color: var(--mg-lime);
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .mg-content .process-row h3 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(22px, 2.4vw, 34px);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.025em;
          color: var(--mg-white);
          line-height: 1.05;
        }
        .mg-content .process-row p {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.78);
          text-transform: none;
          font-weight: 500;
          max-width: 460px;
        }

        .mg-content .sec-testimonios {
          background: var(--mg-white);
          color: var(--mg-ink);
          padding: clamp(96px, 14vh, 180px) 6vw;
        }
        .mg-content .testimonios-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .mg-content .testimonios-head .eyebrow {
          color: var(--mg-blue);
        }
        .mg-content .testimonios-head h2 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(40px, 6vw, 92px);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: var(--mg-ink);
          margin-top: 14px;
          max-width: 900px;
        }
        .mg-content .testimonios-head h2 em {
          font-style: normal;
          color: var(--mg-blue);
        }
        .mg-content .testimonios-grid {
          margin-top: 64px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 900px) {
          .mg-content .testimonios-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .mg-content .t-card {
          background: var(--mg-white);
          border: 3px solid var(--mg-ink);
          border-radius: 18px;
          padding: 34px 28px 30px;
          box-shadow: 6px 6px 0 var(--mg-ink);
          display: flex;
          flex-direction: column;
          gap: 18px;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
            box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .mg-content .t-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0 var(--mg-ink);
        }
        .mg-content .t-card .stars {
          color: var(--mg-lime);
          font-size: 18px;
          letter-spacing: 2px;
          -webkit-text-stroke: 1px var(--mg-ink);
        }
        .mg-content .t-card blockquote {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(17px, 1.4vw, 20px);
          font-weight: 600;
          line-height: 1.45;
          color: var(--mg-ink);
          text-transform: none;
          letter-spacing: -0.01em;
        }
        .mg-content .t-card .who {
          margin-top: auto;
          padding-top: 10px;
          border-top: 2px dashed rgba(8, 14, 20, 0.15);
        }
        .mg-content .t-card .who .n {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--mg-ink);
        }
        .mg-content .t-card .who .m {
          font-size: 12px;
          font-weight: 600;
          color: rgba(8, 14, 20, 0.55);
          margin-top: 2px;
          text-transform: none;
        }

        .mg-content .sec-contact {
          background: var(--mg-ink);
          padding: clamp(96px, 14vh, 180px) 6vw;
          text-align: center;
        }
        .mg-content .contact-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .mg-content .contact-inner h2 {
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: clamp(36px, 5.5vw, 80px);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--mg-white);
        }
        .mg-content .contact-inner h2 em {
          font-style: normal;
          color: var(--mg-lime);
        }
        .mg-content .contact-inner p {
          margin-top: 22px;
          font-size: 17px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          text-transform: none;
          font-weight: 500;
        }
        .mg-content .contact-actions {
          margin-top: 44px;
          display: inline-flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .mg-content .contact-actions a {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 34px;
          border-radius: 999px;
          font-family: var(--font-display), "Syne", sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          border: 2px solid var(--mg-lime);
          color: var(--mg-lime);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
            background 0.3s ease, color 0.3s ease;
        }
        .mg-content .contact-actions a:hover {
          background: var(--mg-lime);
          color: var(--mg-ink);
          transform: translateY(-3px);
        }
        .mg-content .contact-actions a.primary {
          background: var(--mg-lime);
          color: var(--mg-ink);
          border-color: var(--mg-lime);
          box-shadow: 6px 6px 0 var(--mg-blue-deep);
        }
        .mg-content .contact-actions a.primary:hover {
          background: #dfff4a;
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0 var(--mg-blue-deep);
        }

        .mg-content-outer {
          overflow: hidden;
          position: relative;
          z-index: 3;
        }
        .mg-content-track {
          display: flex;
          flex-direction: row;
          will-change: transform;
        }
        .mg-h-section {
          width: 100vw;
          min-height: 100vh;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (max-width: 1023.98px) {
          .mg-content-outer { overflow: visible; }
          .mg-content-track {
            flex-direction: column;
            transform: none !important;
          }
          .mg-h-section {
            width: 100%;
            min-height: auto;
            padding: 4rem 1.5rem;
          }
        }
        .anim-title {
          opacity: 0;
          transform: translateY(55px);
        }
        .anim-sub {
          opacity: 0;
          transform: translateY(30px);
        }
        .v-reveal {
          opacity: 0;
        }
        .v-fade-up {
          opacity: 0;
        }
        .v-stagger-group > * {
          opacity: 0;
        }

        @media (max-width: 1024px) {
          .mg-about .sec-zoom .text-block,
          .mg-about .sec-camera .text-block {
            max-width: 52vw;
          }
        }
        header a[href="/tienda"] {
          color: #CCFF00 !important;
        }

        @media (max-width: 768px) {
          main.mg-about section.scene {
            padding: 0 24px;
          }
          .mg-about .sec-zoom,
          .mg-about .sec-camera {
            justify-content: center;
            text-align: center;
          }
          .mg-about .sec-camera p.sub {
            margin-left: auto;
            margin-right: auto;
          }
          .mg-about .sec-zoom .text-block,
          .mg-about .sec-camera .text-block {
            transform: translateY(30px) translateX(0);
            max-width: 100%;
          }
          .mg-about .scene-badge {
            left: 24px !important;
            right: auto !important;
          }
          .mg-about .sec-camera .scene-badge {
            left: auto !important;
            right: 24px !important;
          }
          .mg-about .headline-xl {
            font-size: clamp(28px, 8vw, 60px);
          }
          .mg-about .headline-lg {
            font-size: clamp(32px, 9vw, 64px);
          }
        }
      `}</style>

      <div id="mg-loader" ref={loaderRef}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <div id="mg-progress" ref={progressRef} />

      <canvas id="webgl" ref={canvasRef} />

      <Header dark />

      <div style={{ position: "relative", zIndex: 2 }}>
        <HeroComponent />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <MovilGuruBento />
      </div>

      <main className="mg-about">
        <section className="scene sec-hero">
          <span className="scene-badge">01 — Movil Guru</span>
          <div className="hero-text-block">
            <span className="eyebrow">Expertos reparando móviles</span>
            <h1 className="headline-xl mg-shadow-triple">
              ¿Pantalla rota?
              <br />
              <span
                style={{ color: "var(--mg-white)" }}
                className="mg-shadow-triple"
              >
                Te lo reparamos.
              </span>
            </h1>
          </div>
          <div className="hint">
            <span>Scroll</span>
            <span className="line" />
          </div>
        </section>

        <section className="scene sec-zoom">
          <span className="scene-badge">02 — Servicio</span>
          <div className="text-block">
            <span className="eyebrow">En el día</span>
            <h2 className="headline-lg mg-shadow-triple">
              Listo en
              <br />
              <span className="hl-lime mg-shadow-triple">30 minutos.</span>
            </h2>
            <p className="sub">
              La mayoría de averías resueltas en menos de 30 minutos. Pantallas,
              baterías, cámaras y conectores reparados con piezas originales.
            </p>
          </div>
        </section>

        <section className="scene sec-spin">
          <span className="scene-badge">03 — Diagnóstico</span>
          <div className="text-block">
            <span className="eyebrow">Revisión 360°</span>
            <h2 className="headline-lg mg-shadow-triple">
              Cada <span className="hl-lime">detalle</span>
              <br />
              importa.
            </h2>
            <p
              className="sub"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              Revisamos tu móvil por completo antes y después de cada
              reparación. Sin sorpresas, sin atajos.
            </p>
          </div>
        </section>

        <section className="scene sec-camera">
          <span className="scene-badge">04 — Garantía</span>
          <div className="text-block">
            <span className="eyebrow">De por vida</span>
            <h2 className="headline-lg mg-shadow-triple">
              Garantía
              <br />
              <span className="hl-lime mg-shadow-triple">de por vida.</span>
            </h2>
            <p className="sub">
              Cada reparación que hacemos está cubierta para siempre. Si algo
              vuelve a fallar, lo arreglamos. Así de simple.
            </p>
          </div>
        </section>

        <section className="scene sec-cta">
          <span className="scene-badge">05 — Empieza ya</span>
          <h2 className="headline-lg mg-shadow-triple">
            Tráenos tu
            <br />
            <span className="hl-lime mg-shadow-triple">móvil hoy.</span>
          </h2>
          <div className="cta-wrap">
            <button className="cta-btn" ref={ctaRef}>
              Pedir Reparación
              <svg
                className="arrow"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </section>
      </main>


      <div className="mg-content">
        <RulesShowcase />

        <section className="sec-process">
          <div className="process-inner">
            <div className="process-head">
              <span className="eyebrow v-fade-up">Nuestro proceso</span>
              <h2 className="v-reveal">
                De la puerta al <em>móvil reparado</em> en cuatro pasos.
              </h2>
            </div>
            <div className="process-grid v-stagger-group" data-from="left">
              {proceso.map((p) => (
                <div className="process-row" key={p.n}>
                  <div className="n">{p.n}</div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec-testimonios">
          <div className="testimonios-inner">
            <div className="testimonios-head">
              <span className="eyebrow v-fade-up">Lo que dicen</span>
              <h2 className="v-reveal">
                Clientes que <em>vuelven</em>, no casualidades.
              </h2>
            </div>
            <div className="testimonios-grid v-stagger-group">
              {testimonios.map((t) => (
                <article className="t-card" key={t.name}>
                  <div className="stars">★★★★★</div>
                  <blockquote>"{t.quote}"</blockquote>
                  <div className="who">
                    <div className="n">{t.name}</div>
                    <div className="m">{t.meta}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec-contact">
          <div className="contact-inner">
            <h2 className="v-reveal">
              ¿Tu móvil <em>falla?</em>
              <br />
              Vamos a arreglarlo.
            </h2>
            <p className="v-fade-up">
              Presupuesto gratis y sin compromiso en menos de 15 minutos.
              Reserva tu hueco o pásate por el taller — te atendemos al momento.
            </p>
            <div className="contact-actions v-stagger-group">
              <a href="/reservar" className="primary">
                Pedir Reparación
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a href="/contacto">Ver tienda</a>
            </div>
          </div>
        </section>
      </div>

      <div style={{ background: "#ffffff", position: "relative", zIndex: 3 }}>
        <Footer />
      </div>

    </>
  );
}
