"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

/**
 * npm i framer-motion
 *
 * ONE pinned section, like an Instagram/WhatsApp story: the viewport
 * never moves to a "next slide". Scrolling just advances progress through
 * a single sticky screen — the progress bar fills segment by segment, and
 * the heading/copy/gif for the active service swap in place. Only after
 * all 4 segments are filled does normal page scroll resume and the
 * section releases.
 *
 * Swap PLACEHOLDER_GIF / icon URLs for your real assets whenever ready.
 */

type Service = {
  eyebrowRegular: string;
  eyebrowItalic: string;
  description: string;
  bullets: string[];
  gif: string;
  icon: string;
};

const PLACEHOLDER_GIF = (seed: string) => `https://cataas.com/cat/gif?width=520&height=520&seed=${seed}`;
const icon = (name: string) => `https://api.iconify.design/ph/${name}.svg?color=%23ffffff`;

const SERVICES: Service[] = [
  {
    eyebrowRegular: "Brand",
    eyebrowItalic: "Identity.",
    description:
      "Creating a strong brand identity helps your business stand out and connect with your audience. Our services focus on understanding your core values and making sure they come through clearly. We work closely with you to build a consistent and meaningful brand presence.",
    bullets: ["Logo Design", "Corporate Identity", "Pitch Decks and Presentations", "Social Media Assets"],
    gif: PLACEHOLDER_GIF("brand"),
    icon: icon("bag-simple-bold"),
  },
  {
    eyebrowRegular: "Customer",
    eyebrowItalic: "Experience.",
    description:
      "Our UX services focus on understanding user needs and behaviours to create interfaces that are easy to navigate and use. We collaborate with you to ensure the user experience aligns with your business goals and provides real value to your customers.",
    bullets: ["User Research", "Wireframing and Prototyping", "User Testing", "Interaction Design"],
    gif: PLACEHOLDER_GIF("ux"),
    icon: icon("squares-four-bold"),
  },
  {
    eyebrowRegular: "User Interface",
    eyebrowItalic: "Design.",
    description:
      "Our UI services aim to create designs that are not only attractive but also functional. We work on making sure every visual element supports the overall user experience and is consistent with your brand identity.",
    bullets: ["Visual Design", "Style Guides", "Responsive Design", "Design Systems"],
    gif: PLACEHOLDER_GIF("ui"),
    icon: icon("puzzle-piece-bold"),
  },
  {
    eyebrowRegular: "Frontend",
    eyebrowItalic: "Development.",
    description:
      "Bringing your designs to life requires skilled front-end development. Our team focuses on building websites and applications that are fast, responsive, and accessible. We use the latest technologies to ensure your digital products perform well across all devices and provide a seamless user experience.",
    bullets: ["Website Development", "Responsive Design & Development", "Performance Optimization"],
    gif: PLACEHOLDER_GIF("dev"),
    icon: icon("code-bold"),
  },
];

const N = SERVICES.length;
const CHAR_TRAVEL = 260; // px the gif drifts left -> right within its own segment

export default function ServicesScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // One scroll range for the whole section. 0 -> 1 across all N services.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Which service is active right now, kept in React state so the text/gif can swap.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  // Character sawtooth: 0 -> CHAR_TRAVEL within each segment, resets at each boundary.
  const eps = 0.0005;
  const xInput: number[] = [];
  const xOutput: number[] = [];
  SERVICES.forEach((_, i) => {
    const start = i / N;
    const end = (i + 1) / N;
    xInput.push(start, end - eps);
    xOutput.push(0, CHAR_TRAVEL);
    if (i < N - 1) {
      xInput.push(end);
      xOutput.push(0);
    }
  });
  const charX = useTransform(progress, xInput, xOutput);

  const service = SERVICES[active];

  return (
    // Total scrollable height = N screens' worth. This is what the browser
    // actually scrolls through; the inner div below stays pinned the whole time.
    <div ref={containerRef} style={{ height: `${N * 100}vh` }} className="relative bg-[#1a1a1c]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 sm:px-10">
        {/* grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          {/* left: copy — swaps per active service, one story frame at a time */}
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                  {service.eyebrowRegular}{" "}
                  <span className="font-serif italic font-normal">{service.eyebrowItalic}</span>
                </h2>
                <p className="mb-6 max-w-md text-[15px] leading-relaxed text-white/50">{service.description}</p>
                <ul className="space-y-2">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] text-white/50">
                      <span className="h-1 w-1 rounded-full bg-white/50" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* right: character, drifts left -> right within the active segment only */}
          <div className="relative hidden h-[420px] items-end justify-end md:flex">
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={service.gif}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ x: charX }}
                className="h-[400px] w-auto object-contain"
              />
            </AnimatePresence>
          </div>
        </div>

        {/* bottom: story-style progress bar, one section for the whole thing */}
        <div className="relative mt-16 grid grid-cols-4 gap-6 sm:mt-24">
          {SERVICES.map((s, k) => (
            <div key={s.eyebrowRegular} className="flex flex-col gap-3">
              <img src={s.icon} alt="" className={`h-5 w-5 transition-opacity ${k <= active ? "opacity-100" : "opacity-30"}`} />
              <div className="h-[2px] w-full bg-white/15">
                <SegmentBar progress={progress} index={k} total={N} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SegmentBar({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  // Each segment fills 0% -> 100% only while overall progress is inside its
  // own [index/total, (index+1)/total] range; clamps to full before, empty after.
  const width = useTransform(progress, [index / total, (index + 1) / total], ["0%", "100%"]);
  return <motion.div className="h-full bg-white" style={{ width }} />;
}