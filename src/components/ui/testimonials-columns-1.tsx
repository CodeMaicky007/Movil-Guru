"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-7 rounded-2xl border border-border shadow-[0_4px_24px_rgba(0,56,255,0.06)] max-w-xs w-full bg-white"
                key={i}
              >
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const testimonials = [
  {
    text: "Cracked my iPhone 15 Pro Max screen on a Monday morning. Movil Guru had it fixed by lunch. The tech showed me the original part before replacing it — that kind of transparency is rare.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah M.",
    role: "iPhone 15 Pro Max",
  },
  {
    text: "Samsung quoted me $340 and a 5-day wait. Movil Guru did it same-day for $235 with a lifetime warranty. Not even close.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Marcus T.",
    role: "Samsung Galaxy S24 Ultra",
  },
  {
    text: "We manage 40 corporate devices. Movil Guru handles everything under an SLA contract — average response under 4 hours. It's changed how we deal with downtime.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Priya K.",
    role: "Operations Manager",
  },
  {
    text: "Dropped my Pixel 9 in the sink. They ran a diagnostic in 20 minutes, cleaned the board, and saved everything. Three months later it still works perfectly.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Jordan L.",
    role: "Google Pixel 9 Pro",
  },
  {
    text: "The inner display on my Z Fold started separating. No other shop would even look at it. Movil Guru had a foldable specialist who turned it around in 48 hours.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Alex W.",
    role: "Samsung Galaxy Z Fold 6",
  },
  {
    text: "They never once asked for my passcode. There's a data privacy protocol posted right at the counter. That alone made me trust them with my device.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Diana R.",
    role: "iPhone 14 Pro",
  },
  {
    text: "Battery was dying after 18 months. Replaced in 20 minutes, $65 total, lifetime warranty. I thought I needed a new phone. I didn't.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Naomi S.",
    role: "Samsung Galaxy A54",
  },
  {
    text: "The back glass shattered on my 13 Pro. They matched the exact original color — the repair is invisible. Genuinely can't tell it was ever broken.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Thomas B.",
    role: "iPhone 13 Pro",
  },
  {
    text: "Our IT team switched all device repairs to Movil Guru — iPhones, Androids, even foldables. Clean billing, fast turnarounds, one point of contact.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Carlos V.",
    role: "IT Director",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-background py-20 md:py-28 relative">
      <div className="max-w-6xl z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="bg-[#0038FF]/8 text-[#0038FF] border border-[#0038FF]/20 py-1 px-4 rounded-full text-sm font-semibold tracking-wide">
              Testimonials
            </div>
          </div>
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mt-5 text-center"
            style={{ fontFamily: "var(--font-display, inherit)" }}
          >
            Trusted by thousands of customers
          </h2>
          <p className="text-center mt-4 opacity-60 text-sm md:text-base leading-relaxed">
            Real repairs. Real results. See what our customers have to say.
          </p>
        </motion.div>
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
