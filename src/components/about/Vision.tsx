"use client";
import { vision } from "@/app/about-preview/content";
import Phone3D from "./Phone3D";

export function Vision() {
  return (
    <section
      role="region"
      aria-labelledby="vision-title"
      className="relative overflow-hidden bg-white px-6 py-32 md:px-10 lg:px-16"
    >
      {/* decorative 3D phone */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-[820px] w-[820px] -translate-y-1/2 md:block"
        style={{ opacity: 0.08 }}
      >
        <Phone3D staticPose="vision" className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-[1100px] text-center">
        <div className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[#0038FF]">
          {vision.eyebrow}
        </div>
        <h2
          id="vision-title"
          className="font-display font-bold text-[#0A0A0A]"
          style={{
            fontSize: "clamp(40px,5vw,72px)",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
          }}
        >
          {vision.title}
        </h2>
        <p className="mx-auto mt-8 max-w-[560px] text-[18px] leading-[1.7] text-black/65">
          {vision.body}
        </p>

        <a
          href={vision.cta.href}
          className="group relative mt-12 inline-flex items-center gap-3 bg-[#0038FF] px-8 py-4 text-sm uppercase tracking-[0.22em] text-white transition-[background-color,transform] duration-300 hover:bg-[#0028CC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] focus-visible:ring-offset-4 focus-visible:ring-offset-white active:scale-[0.98]"
          style={{
            boxShadow:
              "0 10px 30px -10px rgba(0,56,255,0.45), 0 2px 0 0 rgba(0,56,255,0.3) inset",
          }}
        >
          {vision.cta.label}
          <span
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </div>
    </section>
  );
}
