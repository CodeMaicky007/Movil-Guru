"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { useRef } from "react";

export default function AboutSection2() {
  const heroRef = useRef<HTMLDivElement>(null);

  const ease = [0.22, 1, 0.36, 1] as const;

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 1.2, duration: 0.8, ease },
    }),
    hidden: { filter: "blur(12px)", y: 40, opacity: 0 },
  };

  const textVariants = {
    visible: (i: number) => ({
      filter: "blur(0px)",
      opacity: 1,
      transition: { delay: i * 0.35, duration: 0.7, ease },
    }),
    hidden: { filter: "blur(10px)", opacity: 0 },
  };

  return (
    <section className="relative w-full bg-white px-4">
      <div
        className="relative w-full overflow-hidden px-6 py-20 sm:px-12 sm:py-32"
        style={{ background: "#0038FF", color: "#FFFFFF" }}
      >
        {/* Glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-10%] top-0 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(0,20,180,0.35), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-[-5%] h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(204,255,0,0.08), transparent 70%)" }}
        />

        <div className="relative max-w-5xl mx-auto" ref={heroRef as React.RefObject<HTMLDivElement>}>
          <div className="flex flex-col lg:flex-row items-start gap-16">
            <div className="flex-1">
              <TimelineContent
                as="h2"
                animationNum={0}
                timelineRef={heroRef}
                customVariants={revealVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.92] tracking-[-0.04em]"
              >
                Somos{" "}
                <TimelineContent
                  as="span"
                  animationNum={1}
                  timelineRef={heroRef}
                  customVariants={textVariants}
                  className="inline-block border-2 border-dotted px-3 rounded-lg"
                  style={{ color: "#CCFF00", borderColor: "#CCFF00" }}
                >
                  expertos
                </TimelineContent>{" "}
                que reinventan la reparación para que sea más honesta y siempre{" "}
                <TimelineContent
                  as="span"
                  animationNum={2}
                  timelineRef={heroRef}
                  customVariants={textVariants}
                  className="inline-block border-2 border-dotted px-3 rounded-lg"
                  style={{ color: "#CCFF00", borderColor: "rgba(255,255,255,0.4)" }}
                >
                  centrada en ti.
                </TimelineContent>
              </TimelineContent>

              <div className="mt-14 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <TimelineContent
                  as="div"
                  animationNum={3}
                  timelineRef={heroRef}
                  customVariants={textVariants}
                  className="text-base sm:text-lg"
                >
                  <div className="font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
                    Somos Movil Guru y vamos a
                  </div>
                  <div className="font-black uppercase tracking-wider text-xl" style={{ color: "#CCFF00" }}>
                    llevarte más lejos
                  </div>
                </TimelineContent>

                <TimelineContent
                  as="a"
                  animationNum={4}
                  timelineRef={heroRef}
                  customVariants={textVariants}
                  href="/marcas"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-black uppercase tracking-wider transition-transform duration-200 hover:scale-[1.04] active:scale-95 cursor-pointer"
                  style={{ background: "#CCFF00", color: "#0A1F3A" }}
                >
                  Pedir reparación →
                </TimelineContent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
