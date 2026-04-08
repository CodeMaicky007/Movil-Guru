'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  AtSign,
  PlayCircle,
  Briefcase,
} from 'lucide-react';

const InstagramIcon = AtSign;
const YoutubeIcon = PlayCircle;
const LinkedinIcon = Briefcase;

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Servicios',
    links: [
      { title: 'Reparación de pantalla', href: '#' },
      { title: 'Cambio de batería', href: '#' },
      { title: 'Daño por agua', href: '#' },
      { title: 'Reparación de plegables', href: '#' },
      { title: 'Recuperación de datos', href: '#' },
      { title: 'Placa base', href: '#' },
    ],
  },
  {
    label: 'Empresa',
    links: [
      { title: 'Quiénes somos', href: '/about' },
      { title: 'Nuestros técnicos', href: '/team' },
      { title: 'Política de garantía', href: '/warranty' },
      { title: 'B2B / Empresas', href: '/business' },
    ],
  },
  {
    label: 'Recursos',
    links: [
      { title: 'Rastrear mi reparación', href: '/track' },
      { title: 'Guía de reparación', href: '/guide' },
      { title: 'Blog', href: '/blog' },
      { title: 'Preguntas frecuentes', href: '/faq' },
    ],
  },
  {
    label: 'Síguenos',
    links: [
      { title: 'Instagram', href: '#', icon: InstagramIcon },
      { title: 'TikTok', href: '#', icon: YoutubeIcon },
      { title: 'YouTube', href: '#', icon: PlayCircle },
      { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
    ],
  },
];

export function Footer() {
  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />
      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="flex items-center gap-1.5">
            <div className="bg-foreground text-background font-black text-xs px-2.5 py-1 rounded-xl rounded-bl-sm">
              MOVIL
            </div>
            <div className="bg-[#CCFF00] text-black font-black text-xs px-2.5 py-1 rounded-full border border-foreground/10">
              GURU
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-3">
            Cada marca. Cada rotura. Reparado hoy.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            © {new Date().getFullYear()} Movil Guru. Todos los derechos reservados.
          </p>
        </AnimatedContainer>
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/50" style={{ fontFamily: "var(--font-display, inherit)" }}>{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="hover:text-foreground inline-flex items-center transition-all duration-300"
                      >
                        {link.icon && <link.icon className="me-1 size-4" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
