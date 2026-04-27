"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Esencial",
    description:
      "Reparaciones comunes para cualquier dispositivo y marca. Listo el mismo día.",
    price: 89,
    yearlyPrice: 109,
    buttonText: "Reservar",
    buttonVariant: "outline" as const,
    features: [
      { text: "Cambio de pantalla", icon: <Briefcase size={20} /> },
      { text: "Cambio de batería", icon: <Database size={20} /> },
      { text: "Reparación de puerto de carga", icon: <Server size={20} /> },
    ],
    includes: [
      "Qué incluye:",
      "Piezas de calidad OEM",
      "Servicio en el mismo día",
      "Garantía 90 días",
    ],
  },
  {
    name: "Plus",
    description:
      "Reparaciones avanzadas y dispositivos insignia con opciones de piezas premium.",
    price: 159,
    yearlyPrice: 189,
    buttonText: "Reservar",
    buttonVariant: "outline" as const,
    features: [
      { text: "Cristal trasero y cámara", icon: <Briefcase size={20} /> },
      { text: "Piezas OEM genuinas disponibles", icon: <Database size={20} /> },
      { text: "Diagnóstico de daño por agua", icon: <Server size={20} /> },
    ],
    includes: [
      "Todo lo de Esencial, más:",
      "Soporte para gama alta",
      "Recuperación de daño por agua",
      "Garantía 1 año",
    ],
  },
  {
    name: "Pro",
    description:
      "Plegables, placa base y recuperación de datos por especialistas certificados.",
    price: 249,
    yearlyPrice: 299,
    popular: true,
    buttonText: "Reservar",
    buttonVariant: "default" as const,
    features: [
      { text: "Pantalla plegable y bisagra", icon: <Briefcase size={20} /> },
      { text: "Diagnóstico de placa base", icon: <Database size={20} /> },
      { text: "Recuperación profesional de datos", icon: <Server size={20} /> },
    ],
    includes: [
      "Todo lo de Plus, más:",
      "Reparación especializada en plegables",
      "Recuperación de datos",
      "Garantía de por vida",
    ],
  },
];

const PricingSwitch = ({
  onSwitch,
  className,
}: {
  onSwitch: (value: string) => void;
  className?: string;
}) => {
  const [selected, setSelected] = useState("0");
  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-50 border border-gray-200 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit sm:h-12 cursor-pointer h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0"
              ? "text-black"
              : "text-muted-foreground hover:text-black"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-neutral-300 border-neutral-300 bg-gradient-to-t from-neutral-100 via-neutral-200 to-neutral-300"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">En tienda</span>
        </button>
        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1"
              ? "text-black"
              : "text-muted-foreground hover:text-black"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-neutral-300 border-neutral-300 bg-gradient-to-t from-neutral-100 via-neutral-200 to-neutral-300"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Envío postal{" "}
            <span className="rounded-full bg-[#CCFF00] px-2 py-0.5 text-xs font-bold text-black">
              Envío gratis
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.4, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="px-4 md:px-6 py-20 md:py-28 max-w-6xl mx-auto relative"
      ref={pricingRef}
    >
      <article className="flex lg:flex-row flex-col lg:pb-0 pb-4 lg:items-center items-start justify-between gap-6">
        <div className="text-left mb-6">
          <h2
            className="text-4xl font-bold leading-[130%] text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            <span className="inline-flex flex-wrap gap-x-2 items-baseline">
              <span style={{ color: "#0038FF" }}>
                <VerticalCutReveal
                  splitBy="words"
                  staggerDuration={0.15}
                  staggerFrom="first"
                  reverse={true}
                  containerClassName="justify-start"
                  transition={{ type: "spring", stiffness: 250, damping: 40, delay: 0 }}
                >
                  Precios de
                </VerticalCutReveal>
              </span>
              <span style={{ color: "#080e14" }}>
                <VerticalCutReveal
                  splitBy="words"
                  staggerDuration={0.15}
                  staggerFrom="first"
                  reverse={true}
                  containerClassName="justify-start"
                  transition={{ type: "spring", stiffness: 250, damping: 40, delay: 0.3 }}
                >
                  Reparación
                </VerticalCutReveal>
              </span>
            </span>
          </h2>
          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
            customVariants={revealVariants}
            className="text-gray-600 w-[80%]"
          >
            Precios fijos y transparentes. Sin diagnósticos ocultos, sin sorpresas — solo costes de reparación honestos desde el primer momento.
          </TimelineContent>
        </div>
        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} className="shrink-0" />
        </TimelineContent>
      </article>
      <TimelineContent
        as="div"
        animationNum={2}
        timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
        customVariants={revealVariants}
        className="grid lg:grid-cols-3 gap-4 mx-auto bg-gradient-to-b from-neutral-100 to-neutral-200 sm:p-3 rounded-lg max-lg:gap-6"
      >
        {plans.map((plan, index) => (
          <TimelineContent
            as="div"
            key={plan.name}
            animationNum={index + 3}
            timelineRef={pricingRef as React.RefObject<HTMLElement | null>}
            customVariants={revealVariants}
          >
            <Card
              className={`relative flex-col flex justify-between ${
                plan.popular
                  ? "lg:scale-110 ring-2 ring-neutral-900 bg-gradient-to-t from-black to-neutral-900 text-white"
                  : "border-none shadow-none bg-transparent pt-4 text-gray-900"
              }`}
            >
              <CardContent className="pt-0">
                <div className="space-y-2 pb-3">
                  {plan.popular && (
                    <div className="pt-4">
                      <span className="bg-neutral-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Más popular
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold">
                      $
                      <NumberFlow
                        format={{ currency: "USD" }}
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-4xl font-semibold"
                      />
                    </span>
                    <span
                      className={
                        plan.popular
                          ? "text-neutral-200 ml-1"
                          : "text-gray-600 ml-1"
                      }
                    >
                      {isYearly ? " / envío postal" : " / en tienda"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold mb-2">
                    <span style={{ color: plan.popular ? "#CCFF00" : "#0038FF" }}>{plan.name}</span>
                  </h3>
                </div>
                <p
                  className={
                    plan.popular
                      ? "text-sm text-neutral-200 mb-4"
                      : "text-sm text-gray-600 mb-4"
                  }
                >
                  {plan.description}
                </p>
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <h4 className="font-medium text-base mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span
                          className={
                            plan.popular
                              ? "text-white h-6 w-6 bg-neutral-600 border border-neutral-500 rounded-full grid place-content-center mt-0.5 mr-3"
                              : "text-black h-6 w-6 bg-white border border-black rounded-full grid place-content-center mt-0.5 mr-3"
                          }
                        >
                          <CheckCheck className="h-4 w-4" />
                        </span>
                        <span
                          className={
                            plan.popular
                              ? "text-sm text-neutral-100"
                              : "text-sm text-gray-600"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <a
                  href="/servicios"
                  className={`w-full mb-6 p-4 text-xl rounded-xl block text-center ${
                    plan.popular
                      ? "bg-gradient-to-t from-neutral-100 to-neutral-300 font-semibold shadow-lg shadow-neutral-500 border border-neutral-400 text-black"
                      : "bg-gradient-to-t from-neutral-900 to-neutral-600 shadow-lg shadow-neutral-900 border border-neutral-700 text-white"
                  }`}
                >
                  {plan.buttonText}
                </a>
              </CardFooter>
            </Card>
          </TimelineContent>
        ))}
      </TimelineContent>
    </div>
  );
}
