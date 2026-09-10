"use client";

import { motion, Transition } from "framer-motion";

/**
 * npm i framer-motion
 *
 * Navbar is intentionally skipped — you already have it.
 *
 * The bee is a real animated GIF (Pixabay, royalty-free) flying a hand-
 * tuned path that weaves up/down/across the three lines of the headline —
 * not a random float. It has its own wing-bob layered on top, and a ground
 * shadow underneath that grows/shrinks and dims/brightens depending on
 * how "high" the bee currently is in the path, so it reads as swooping
 * rather than sliding around on rails.
 */

const BEE_GIF = "https://cdn.pixabay.com/animation/2024/03/13/01/06/01-06-07-149_512.gif";

const float = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
});

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-black bg-[#f5f5f4] px-6 py-24 sm:px-10">
      {/* background decorative bits (unrelated to the bee's path) */}
      <FloatingBlob className="right-[8%] top-8 h-9 w-10" duration={9} />
      <FloatingOrb className="left-[59%] top-10 h-4 w-4 bg-[#ff5a1f]" duration={6} />
      <FloatingOrb className="left-[56%] top-24 h-3 w-3 bg-black/15" duration={7} delay={0.5} />
      <FloatingGrapes className="left-[40%] top-28" duration={10} />

      {/* headline + bee share this box, so the bee's path is measured
          against the actual text block, not the whole footer */}
      <div className="relative mx-auto max-w-6xl">
        <h2 className="relative z-10 text-center text-[52px] font-extrabold uppercase leading-[0.95] tracking-tight text-[#0b1f14] sm:text-[76px] md:text-[92px]">
          Let&apos;s create
          <br />a remarkable
          <br />journey
        </h2>

        <BeeFlight />
      </div>

      {/* bottom row */}
      <div className="relative z-10 mt-20 flex flex-wrap items-center justify-between gap-4 text-sm text-[#0b1f14]/70">
        <a href="#credits" className="transition-colors hover:text-[#0b1f14]">
          Credits
        </a>
        <p className="flex gap-2">
          <a href="#" className="transition-colors hover:text-[#0b1f14]">
            Instagram
          </a>
          <span>•</span>
          <a href="mailto:lparpeix@gmail.com" className="transition-colors hover:text-[#0b1f14]">
            lparpeix@gmail.com
          </a>
          <span>•</span>
          <a href="#" className="transition-colors hover:text-[#0b1f14]">
            Linkedin
          </a>
        </p>
        <p>© 2026</p>
      </div>
    </footer>
  );
}

function BeeFlight() {
  // Hand-placed waypoints (percent of the headline box) tracing a loop that
  // dips into the gaps between "LET'S / CREATE", across "A REMARKABLE", and
  // back up past "JOURNEY" — not a straight line, not a random wobble.
  const left = [4, 24, 18, 42, 38, 64, 58, 82, 70, 30, 4];
  const top = [62, 30, 8, 45, 70, 25, 55, 40, 75, 55, 62];
  const rotate = [-8, 22, 35, -18, -30, 20, -22, 15, -10, -30, -8];
  const times = [0, 0.09, 0.18, 0.28, 0.38, 0.48, 0.58, 0.7, 0.82, 0.92, 1];

  // Shadow tracks the same horizontal path, sits on a fixed "ground" line,
  // and grows/darkens when the bee's `top` value is large (closer to the
  // ground) and shrinks/fades when the bee is higher up.
  const shadowScale = top.map((t) => Number((0.45 + (t / 100) * 0.65).toFixed(2)));
  const shadowOpacity = top.map((t) => Number((0.12 + (t / 100) * 0.22).toFixed(2)));

  const pathTransition: Transition = {
    duration: 26,
    times,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  };

  return (
    <>
      <motion.div
        className="pointer-events-none absolute z-0 h-2 w-10 rounded-full bg-black/20 blur-[5px]"
        style={{ top: "88%" }}
        animate={{ left: left.map((v) => `${v}%`), scale: shadowScale, opacity: shadowOpacity }}
        transition={pathTransition}
      />
      <motion.div
        className="pointer-events-none absolute z-20"
        animate={{ left: left.map((v) => `${v}%`), top: top.map((v) => `${v}%`), rotate }}
        transition={pathTransition}
      >
        {/* wing-bob, layered independently on top of the path animation */}
        <motion.img
          src={BEE_GIF}
          alt=""
          className="h-10 w-10 select-none object-contain sm:h-12 sm:w-12"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </motion.div>
    </>
  );
}

function FloatingGrapes({ className, duration, delay = 0 }: { className?: string; duration: number; delay?: number }) {
  return (
    <motion.div
      className={`absolute z-0 select-none ${className}`}
      animate={{ x: [0, -20, 15, 0], y: [0, 18, -10, 0], rotate: [0, -6, 4, 0] }}
      transition={float(duration, delay)}
    >
      <span className="relative text-3xl leading-none">🍇</span>
    </motion.div>
  );
}

function FloatingBlob({ className, duration, delay = 0 }: { className?: string; duration: number; delay?: number }) {
  return (
    <motion.div
      className={`absolute z-0 bg-black/15 ${className}`}
      style={{ borderRadius: "58% 42% 63% 37% / 41% 55% 45% 59%" }}
      animate={{ x: [0, 18, -12, 0], y: [0, -14, 10, 0], rotate: [0, 15, -10, 0] }}
      transition={float(duration, delay)}
    />
  );
}

function FloatingOrb({ className, duration, delay = 0 }: { className?: string; duration: number; delay?: number }) {
  return (
    <motion.div
      className={`absolute z-0 rounded-full ${className}`}
      animate={{ y: [0, -16, 0], opacity: [1, 0.75, 1] }}
      transition={float(duration, delay)}
    />
  );
}