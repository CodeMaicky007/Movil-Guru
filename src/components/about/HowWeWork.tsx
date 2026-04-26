"use client";
import { howWeWork } from "@/app/about-preview/content";

export function HowWeWork() {
  return (
    <section
      role="region"
      aria-labelledby="how-title"
      className="relative bg-white px-6 py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex items-end justify-between border-b border-black/10 pb-6">
          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#0038FF]">
              Método
            </div>
            <h2
              id="how-title"
              className="font-display font-bold text-[#0A0A0A]"
              style={{ fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-0.03em", lineHeight: 1 }}
            >
              Cómo trabajamos
            </h2>
          </div>
          <span className="hidden text-[11px] uppercase tracking-[0.24em] text-black/45 md:inline">
            Tres pasos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-black/10">
          {howWeWork.map((item, i) => (
            <div
              key={item.n}
              className="group relative px-0 py-8 md:px-10 md:py-4 md:first:pl-0 md:last:pr-0"
            >
              <div
                className="font-display font-bold text-[#CCFF00]"
                style={{
                  fontSize: "clamp(64px,9vw,108px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  WebkitTextStroke: "1px rgba(10,10,10,0.08)",
                }}
              >
                {item.n}
              </div>
              <h3
                className="mt-8 font-display text-[#0A0A0A]"
                style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
              >
                {item.title}
              </h3>
              <p className="mt-4 text-[16px] leading-[1.65] text-black/65">{item.body}</p>

              <div
                aria-hidden
                className="mt-8 h-[1px] w-12 origin-left bg-[#0A0A0A] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-[4]"
              />
              {i < howWeWork.length - 1 && (
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 right-0 h-px bg-black/10 md:hidden"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
