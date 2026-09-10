"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * npm i framer-motion
 *
 * The infinite scroll itself is plain CSS keyframes (cheap, GPU-friendly,
 * never drops frames) — each row's content is duplicated once so the loop
 * is seamless. The per-word hover effect (brighten + hand-drawn circle) is
 * framer-motion's `pathLength` trick: the oval "draws itself" on hover and
 * "erases itself" on hover-out, rather than just fading in/out.
 */

const ROW_1 = [
  "Station", "Grow", "20th Century Fox", "Springrole", "Toro", "Redef",
  "Curology", "Lifeease", "Henlo",
];
const ROW_2 = [
  "Connect", "Mindstamp", "Proof", "Guayaki", "Malu", "Science Inc",
  "Carblip", "Inspire", "Drivyn",
];
const ROW_3 = [
  "Tropical House Organics", "Asthmaniac", "Boss Plow", "Carbon Collective",
  "Convermat", "Daybreak",
];

export default function ClienteleMarquee() {
  return (
    <section className="overflow-hidden bg-black py-10">
      <MarqueeRow words={ROW_1} direction="left" duration={42} />
      <MarqueeRow words={ROW_2} direction="right" duration={48} />
      <MarqueeRow words={ROW_3} direction="left" duration={38} />

      <style jsx global>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function MarqueeRow({
  words,
  direction,
  duration,
}: {
  words: string[];
  direction: "left" | "right";
  duration: number;
}) {
  // duplicated once so translating exactly -50% loops seamlessly
  const doubled = [...words, ...words];

  return (
    <div className="flex w-max whitespace-nowrap will-change-transform" style={{
      animation: `marquee-${direction} ${duration}s linear infinite`,
    }}>
      {doubled.map((word, i) => (
        <div key={`${word}-${i}`} className="flex items-center">
          <MarqueeWord>{word}</MarqueeWord>
          <span className="mx-3 text-2xl font-extrabold text-white/25 sm:text-3xl">/</span>
        </div>
      ))}
    </div>
  );
}

function MarqueeWord({ children }: { children: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-block cursor-pointer px-4 py-1 text-2xl font-extrabold uppercase tracking-tight transition-colors duration-300 sm:text-3xl"
      style={{ color: hovered ? "#ffffff" : "rgba(255,255,255,0.28)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* hand-drawn oval, stretches to fit any word length via preserveAspectRatio="none" */}
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-y-2 -inset-x-3 h-[calc(100%+16px)] w-[calc(100%+24px)]"
      >
        <motion.path
          d="M8,20 C8,7 26,2 50,2 C74,2 92,7 92,20 C92,33 74,38 50,38 C26,38 9,34 8,22 C7.5,17 14,11 28,8"
          fill="none"
          stroke="white"
          strokeWidth={1.4}
          strokeLinecap="round"
          initial={false}
          animate={hovered ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
}