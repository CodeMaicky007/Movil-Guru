"use client";
import React, { useState } from "react";

interface AccordionItemData {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface AccordionItemProps {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
}

const AccordionItem = ({ item, isActive, onMouseEnter }: AccordionItemProps) => (
  <div
    className={`relative h-[420px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${
      isActive ? "flex-[5]" : "flex-[1]"
    }`}
    onMouseEnter={onMouseEnter}
  >
    <img
      src={item.imageUrl}
      alt={item.title}
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    {/* Lime accent top bar */}
    <div
      className={`absolute top-0 left-0 h-1 bg-[#CCFF00] transition-all duration-700 ${
        isActive ? "w-full" : "w-0"
      }`}
    />

    {/* Caption - horizontal when active, vertical when collapsed */}
    <div
      className={`absolute transition-all duration-500 ${
        isActive
          ? "bottom-6 left-6 right-6 opacity-100"
          : "bottom-20 left-1/2 -translate-x-1/2 opacity-70 rotate-90 whitespace-nowrap"
      }`}
    >
      <p
        className={`text-white font-black leading-tight transition-all duration-500 ${
          isActive ? "text-xl" : "text-sm"
        }`}
        style={{ fontFamily: "var(--font-display, inherit)" }}
      >
        {item.title}
      </p>
      {isActive && (
        <p className="text-white/70 text-xs mt-1 font-medium">{item.subtitle}</p>
      )}
    </div>
  </div>
);

interface LandingAccordionProps {
  heading?: string;
  subheading?: string;
  items?: AccordionItemData[];
  ctaText?: string;
  ctaHref?: string;
}

const defaultItems: AccordionItemData[] = [
  {
    id: 1,
    title: "Pantallas OLED",
    subtitle: "iPhone, Samsung, Pixel y más",
    imageUrl: "https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&w=800",
  },
  {
    id: 2,
    title: "Baterías",
    subtitle: "Restaura la autonomía en 20 min",
    imageUrl: "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&w=800",
  },
  {
    id: 3,
    title: "Daño por Agua",
    subtitle: "Limpieza ultrasónica de placa",
    imageUrl: "https://images.pexels.com/photos/6046183/pexels-photo-6046183.jpeg?auto=compress&w=800",
  },
  {
    id: 4,
    title: "Plegables",
    subtitle: "Especialistas en Z Fold y Z Flip",
    imageUrl: "https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&w=800",
  },
  {
    id: 5,
    title: "Recuperación de Datos",
    subtitle: "Rescatamos lo que otros no pueden",
    imageUrl: "https://images.pexels.com/photos/4195504/pexels-photo-4195504.jpeg?auto=compress&w=800",
  },
];

export function LandingAccordionItem({
  heading = "Cada reparación es nuestra especialidad",
  subheading = "Cinco años perfeccionando cada tipo de reparación. Sin excepciones.",
  items = defaultItems,
  ctaText = "Ver todos los servicios",
  ctaHref = "/reparacion-pantalla",
}: LandingAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 md:py-28 px-4 bg-[#060812]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-block bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 text-xs font-black px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Nuestros Servicios
            </div>
            <h2
              className="text-3xl md:text-5xl font-black text-white leading-tight max-w-lg"
              style={{ fontFamily: "var(--font-display, inherit)" }}
            >
              {heading}
            </h2>
            <p className="text-white/45 mt-3 text-sm md:text-base font-medium max-w-md">
              {subheading}
            </p>
          </div>
          <a
            href={ctaHref}
            className="shrink-0 flex items-center gap-2 bg-[#0038FF] text-white font-black text-sm px-6 py-3 rounded-full hover:bg-[#0028CC] transition-colors active:scale-95"
          >
            {ctaText}
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
              <path d="M5.5 12l4.5-4-4.5-4 .75-.75 5.25 4.75-5.25 4.75z" />
            </svg>
          </a>
        </div>

        {/* Accordion — horizontal on md+, stacked on mobile */}
        <div className="hidden md:flex flex-row gap-3 w-full">
          {items.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              isActive={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Mobile: simple grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {items.map((item) => (
            <div key={item.id} className="relative h-48 rounded-2xl overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-black text-base">{item.title}</p>
                <p className="text-white/70 text-xs mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
