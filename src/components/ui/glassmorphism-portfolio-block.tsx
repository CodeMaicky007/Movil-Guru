"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "motion/react";
import { ArrowUpRight, Star, MessageCircle } from "lucide-react";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

type Highlight = { title: string; description: string };
type ContactLink = { label: string; handle: string; href: string; icon: React.ElementType };

const listVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface GlassmorphismTeamBlockProps {
  badgeLabel?: string;
  name?: string;
  role?: string;
  bio?: string;
  avatarSrc?: string;
  highlights?: Highlight[];
  contactLinks?: ContactLink[];
  ctaText?: string;
  ctaHref?: string;
}

const defaultHighlights: Highlight[] = [
  {
    title: "Especialidad principal",
    description: "Microsoldadura y diagnóstico a nivel de componente. Reparaciones que otros talleres rechazan.",
  },
  {
    title: "Formación",
    description: "Certificado por Apple (AASP), Samsung Premium Service y formación en reparación de plegables.",
  },
  {
    title: "Disponibilidad",
    description: "Lunes a viernes 9h–19h · Sábados 9h–14h · Servicio urgente con cita previa.",
  },
];

const defaultContactLinks: ContactLink[] = [
  { label: "Instagram", handle: "@movilguru", href: "#", icon: InstagramLogoIcon },
  { label: "Google Reviews", handle: "4.9★ · 2,400+ reseñas", href: "#", icon: Star },
  { label: "WhatsApp", handle: "+34 600 000 000", href: "https://wa.me/34600000000", icon: MessageCircle },
  { label: "LinkedIn", handle: "Movil Guru", href: "#", icon: LinkedInLogoIcon },
];

export function GlassmorphismTeamBlock({
  badgeLabel = "Nuestro Equipo",
  name = "Carlos Mendoza",
  role = "Técnico Principal · Fundador",
  bio = "Más de 8 años reparando dispositivos móviles de todas las marcas. Fundé Movil Guru con una idea simple: reparaciones honestas, transparentes y con garantía real.",
  avatarSrc = "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=400",
  highlights = defaultHighlights,
  contactLinks = defaultContactLinks,
  ctaText = "Reservar con Carlos",
  ctaHref = "/servicios",
}: GlassmorphismTeamBlockProps = {}) {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-[0_8px_48px_rgba(0,0,0,0.08)] md:p-12"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0038FF]/[0.03] via-transparent to-transparent pointer-events-none" />

          <div className="relative grid gap-12 lg:grid-cols-2">
            {/* Left — main content */}
            <div className="space-y-8">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-2 rounded-full border-black/15 bg-black/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-black/70"
              >
                {badgeLabel}
              </Badge>

              <div className="space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-black tracking-tight text-black md:text-3xl"
                  style={{ fontFamily: "var(--font-display, inherit)" }}
                >
                  <span className="text-[#0038FF]">{name}</span>, {role}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-xl text-base leading-relaxed text-black/70"
                >
                  {bio}
                </motion.p>
              </div>

              {/* Highlights */}
              <div className="grid gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ y: -3 }}
                    className="group relative overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] p-5 transition-all hover:border-black/20 hover:bg-black/[0.05]"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0038FF] mb-2">
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed text-black/70">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  size="lg"
                  className="h-12 gap-2 rounded-full px-8 text-sm font-black uppercase tracking-[0.15em] bg-[#0038FF] text-white hover:bg-[#0028CC] hover:shadow-lg transition-all"
                  asChild
                >
                  <a href={ctaHref}>
                    {ctaText}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Right — profile card */}
            <div className="relative">
              <div className="absolute inset-0 rounded-[32px] bg-[#0038FF]/8 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-black/10 bg-white p-8">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-6"
                  >
                    <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0038FF]/10 blur-2xl" />
                    <img
                      src={avatarSrc}
                      alt={name}
                      className="relative h-28 w-28 rounded-full border-2 border-black/10 object-cover shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                    />
                    {/* Online badge */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#CCFF00] rounded-full border-2 border-white shadow-sm" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-1"
                  >
                    <h3 className="text-xl font-black tracking-tight text-black">
                      <span className="text-[#0038FF]">{name?.split(" ")[0]}</span>{" "}
                      {name?.split(" ").slice(1).join(" ")}
                    </h3>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0038FF]">
                      {role}
                    </p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4 max-w-xs text-sm leading-relaxed text-black/60"
                  >
                    Disponible hoy para tu reparación.
                  </motion.p>
                </div>

                {/* Contact links */}
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mt-8 flex flex-col gap-3"
                >
                  {contactLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.label}
                        variants={itemVariants}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-black/20 hover:bg-white hover:shadow-sm"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.985 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-black/70">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-black">{link.label}</p>
                            <p className="text-xs text-black/50">{link.handle}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-black/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black/60" />
                      </motion.a>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
