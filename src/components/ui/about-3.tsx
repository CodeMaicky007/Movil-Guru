import { Button } from "@/components/ui/button";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: { src: string; alt: string };
  secondaryImage?: { src: string; alt: string };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{ src: string; alt: string }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{ label: string; value: string }>;
}

export const About3 = ({
  title = "Quiénes Somos",
  description = "Somos un equipo apasionado de técnicos especializados en reparación de dispositivos móviles.",
  mainImage = { src: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&w=800", alt: "Taller" },
  secondaryImage = { src: "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&w=400", alt: "Reparación" },
  breakout = {
    src: "",
    alt: "logo",
    title: "Tu móvil, nuestra responsabilidad",
    description: "Trabajamos con piezas de calidad OEM y técnicos certificados.",
    buttonText: "Ver garantía",
    buttonUrl: "/warranty",
  },
  companiesTitle = "Reparamos todas las marcas",
  companies = [],
  achievementsTitle = "Números que lo dicen todo",
  achievementsDescription = "Cada cifra representa un cliente que confió en nosotros y no se arrepintió.",
  achievements = [],
}: About3Props = {}) => {
  return (
    <section className="py-20 md:py-28 bg-[#060812] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="mb-14 grid gap-5 text-center md:grid-cols-2 md:text-left">
          <h2
            className="text-4xl md:text-5xl font-black leading-tight text-white"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            {title}
          </h2>
          <p className="text-white/50 text-lg leading-relaxed self-center">{description}</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          <img
            src={mainImage.src}
            alt={mainImage.alt}
            className="size-full max-h-[620px] rounded-2xl object-cover lg:col-span-2"
          />
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-2xl bg-white/[0.05] border border-white/10 p-7 md:w-1/2 lg:w-auto">
              <div className="flex items-center gap-2">
                <div className="bg-white text-black font-black text-xs px-2.5 py-1 rounded-xl rounded-bl-sm">
                  MOVIL
                </div>
                <div className="bg-[#CCFF00] text-black font-black text-xs px-2.5 py-1 rounded-full border border-foreground/10">
                  GURU
                </div>
              </div>
              <div>
                <p className="mb-2 text-lg font-black text-white">{breakout.title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{breakout.description}</p>
              </div>
              <Button variant="outline" className="mr-auto border-white/20 text-white hover:bg-white/10 hover:text-white" asChild>
                <a href={breakout.buttonUrl}>{breakout.buttonText}</a>
              </Button>
            </div>
            <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="grow basis-0 rounded-2xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
            />
          </div>
        </div>

        {/* Companies / Brands */}
        {companies.length > 0 && (
          <div className="py-20">
            <p className="text-center text-sm font-black uppercase tracking-widest text-white/40">
              {companiesTitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {companies.map((company, idx) => (
                <div key={idx} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.04]">
                  <img
                    src={company.src}
                    alt={company.alt}
                    className="h-5 w-auto md:h-6 object-contain"
                    style={{ filter: 'none' }}
                  />
                  <span className="text-xs font-semibold text-white/70">{company.alt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-[#0038FF] p-10 md:p-16">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-4 text-center md:text-left">
              <h3
                className="text-3xl md:text-4xl font-black text-white"
                style={{ fontFamily: "var(--font-display, inherit)" }}
              >
                {achievementsTitle}
              </h3>
              <p className="max-w-lg text-white/70 text-sm leading-relaxed">
                {achievementsDescription}
              </p>
            </div>
            <div className="relative z-10 mt-10 flex flex-wrap justify-between gap-10 text-center">
              {achievements.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <p className="text-white/60 text-sm font-semibold">{item.label}</p>
                  <span
                    className="text-4xl md:text-5xl font-black text-[#CCFF00]"
                    style={{ fontFamily: "var(--font-display, inherit)" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
