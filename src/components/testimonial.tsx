"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useAnimationFrame,
  useScroll,
  useVelocity,
} from "framer-motion";

/**
 * npm i framer-motion
 *
 * The motion recipe here is the well-known Framer Motion "velocity marquee"
 * pattern: a constant base drift (right -> left) runs every frame via
 * useAnimationFrame, and the page's scroll velocity is blended on top of
 * it. Scroll down hard -> velocity briefly flips the row fast left -> right.
 * Scroll up hard -> it flips fast right -> left (i.e. faster in its own
 * idle direction). Stop scrolling and it eases back to the slow idle drift.
 */

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  variant: "cream" | "red";
};

const TESTIMONIALS: Testimonial[] = [
  { quote: "The team has been epic to work with. Their creativity is not just aesthetically impressive, it drives business value.", name: "Jeff Mziray", role: "DashQ, CEO", variant: "cream" },
  { quote: "They are the best design team we have worked with. Their work immediately brought more credibility and authenticity to our long term goal of building community.", name: "@phobosdei", role: "Dogelon Mars", variant: "red" },
  { quote: "We loved working with the team. They took the time to really understand who we are and brought our vision to life through a beautiful new logo, website, and admissions materials.", name: "Ashley Warren", role: "Director of Enrollment", variant: "red" },
  { quote: "They have reinforced the value of collaboration and pushing boundaries. The experience has been beyond wonderful, and I view them as a partner in our company's growth strategy.", name: "Nate Towers", role: "Five Pathways, CEO", variant: "cream" },
  { quote: "Wildly creative, professional in all the right ways, and made the whole process of rebranding our company fun and effortless.", name: "Ryan Keisel", role: "Elevate, CEO", variant: "cream" },
  { quote: "Since launching the new pages, visitors are spending over twice as long on service pages, the bounce rate dropped to 20–33%, and conversions are up to 6–7%.", name: "Yuri Pereira", role: "Hugo, Marketing & Growth", variant: "red" },
  { quote: "We experienced an exponential surge in client acquisition, skyrocketing from zero to thousands within a year of launching our brand and website.", name: "Matan Slagter", role: "Armadillo, CEO", variant: "cream" },
  { quote: "Extremely dedicated to delivering high-quality results. From the initial consultation to the final product, the team demonstrated exceptional creativity and attention to detail.", name: "Vidya Plainfield", role: "TechSpeed, Member of the Board", variant: "cream" },
  { quote: "The ideal creative partner — strong design chops combined with digital, showing how pieces of the branding system come to life across enablement materials.", name: "Mike Weber", role: "Upshop, Chief Growth Officer", variant: "red" },
  { quote: "A thoughtful, collaborative partner — helping us build on our newly refreshed brand to create a digital experience that feels true to who we are.", name: "Shannon Hill", role: "New Engen, Sr. Director of Marketing", variant: "cream" },
];

// deterministic scatter pattern so cards feel tossed down, not perfectly gridded
const ROTATE = [-4, 3, -6, 5, -2, 4, -5, 2, -3, 6];
const OFFSET_Y = [0, 46, -18, 30, -34, 16, -24, 38, -12, 22];

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export default function TestimonialMarquee() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-20 sm:px-10">
      <div className="mb-24 flex items-start justify-between">
        <nav className="space-y-1 text-sm text-white/80">
          <p>Work (28)</p>
          <p>Agency</p>
          <p>Services</p>
          <p>Brand Guide</p>
        </nav>

        <h2 className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-center font-serif text-5xl text-[#f7f0d8] sm:text-6xl md:text-7xl">
          Client
          <br />
          <span className="italic">Confessions</span>
        </h2>

        <a
          href="#contact"
          className="rounded-md bg-[#ff3b30] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
        >
          Let&apos;s Connect
        </a>
      </div>

      <MarqueeRow />
    </section>
  );
}

function MarqueeRow() {
  const baseX = useMotionValue(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- scroll velocity feeding the marquee speed/direction ---
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2500, 0, 2500], [-5, 0, 5], { clamp: false });

  const directionFactor = useRef(-1); // idle default: right -> left
  const BASE_SPEED = 2.2; // %/sec idle drift

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * BASE_SPEED * (delta / 1000);

    // a real scroll flips the direction: scroll down -> left-to-right,
    // scroll up -> right-to-left (faster than idle either way)
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get()) * 3;
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  // --- custom drag-hint cursor, replaces the pointer while hovering the row ---
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const smoothCursorY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden py-10"
      style={{ cursor: hovering ? "none" : "auto" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={(e) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;
        cursorX.set(e.clientX - rect.left);
        cursorY.set(e.clientY - rect.top);
      }}
    >
      <motion.div className="flex w-max gap-8" style={{ x }}>
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} rotate={ROTATE[i % ROTATE.length]} offsetY={OFFSET_Y[i % OFFSET_Y.length]} />
        ))}
      </motion.div>

      {/* drag-hint cursor, swap the emoji for a real gif/lottie whenever you have one */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ff3b30] bg-black/40 backdrop-blur-sm"
        style={{ x: smoothCursorX, y: smoothCursorY, opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.6 }}
        transition={{ duration: 0.2 }}
      >
        <DragHint />
      </motion.div>
    </div>
  );
}

function TestimonialCard({ t, rotate, offsetY }: { t: Testimonial; rotate: number; offsetY: number }) {
  const isCream = t.variant === "cream";
  return (
    <div
      className={`w-[360px] shrink-0 rounded-2xl p-6 shadow-xl sm:w-[400px] ${
        isCream ? "bg-[#f7f0d8] text-[#ff3b30]" : "bg-[#ff3b30] text-[#f7f0d8]"
      }`}
      style={{ transform: `rotate(${rotate}deg) translateY(${offsetY}px)` }}
    >
      <div className="flex justify-end text-3xl font-serif">&rdquo;</div>
      <p className="min-h-[140px] text-center text-[15px] font-medium leading-relaxed">{t.quote}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-2xl font-serif">&ldquo;</div>
        <div className="text-right">
          <p className="text-sm font-bold">{t.name}</p>
          <p className="text-xs opacity-80">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function DragHint() {
  return (
    <motion.div
      className="flex items-center gap-1 text-[#ff3b30]"
      animate={{ x: [-3, 3, -3] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-xs">‹</span>
      <span className="text-lg">🖐️</span>
      <span className="text-xs">›</span>
    </motion.div>
  );
}