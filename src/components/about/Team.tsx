"use client";
import { team } from "@/app/about-preview/content";

export function Team() {
  return (
    <section
      id="equipo"
      role="region"
      aria-labelledby="team-title"
      className="relative bg-white px-6 py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex items-end justify-between border-b border-black/10 pb-6">
          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-[#0038FF]">
              Quién hay detrás
            </div>
            <h2
              id="team-title"
              className="font-display font-bold text-[#0A0A0A]"
              style={{ fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-0.03em", lineHeight: 1 }}
            >
              El equipo.
            </h2>
          </div>
          <span className="hidden text-[11px] uppercase tracking-[0.24em] text-black/45 md:inline">
            {team.length} técnicos · Madrid
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 md:gap-10 xl:grid-cols-4">
          {team.map((p) => (
            <article key={p.name} className="group">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F5]">
                <img
                  src={p.photo}
                  alt={p.name}
                  className="w-full h-full object-cover grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                />
                <div
                  aria-hidden
                  className="absolute left-4 top-4 h-2 w-2 rounded-full bg-[#CCFF00] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3
                  className="font-display text-[20px] font-bold text-[#0A0A0A]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {p.name}
                </h3>
              </div>
              <p className="mt-1 text-[13px] text-black/55">{p.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
