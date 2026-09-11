"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { div } from "framer-motion/m";

/**
 * npm i framer-motion
 *
 * ONE pinned panel for the whole "Selected Work" section — the page does
 * NOT scroll to a new slide per project. Scrolling through this section's
 * extra height just scrubs which project card is "expanded" inside the
 * fixed panel (a smooth grow/shrink on flexGrow, not a hard cut), while the
 * title on the left cross-fades to match. Only once the last card has had
 * its turn does the panel release and normal page scroll continues.
 *
 * Swap the gradient/badge per project for your real screenshots — the
 * layout, sizing, and scroll math are the real logic here.
 */

type Project = {
  title: string;
  tag: string;
  image: string; // random placeholder for now, swap for the real project screenshot/video
  badge: string; // placeholder emoji/mark overlaid on the card, swap for the real app icon
};

// random images from picsum.photos — seeded so each project keeps the same
// image on reload; swap the `image` field for your real screenshots later
const PROJECTS: Project[] = [
  {
    title: "iMotion",
    tag: "Selected Work",
    image: "https://framerusercontent.com/images/nyfpNDf6Z1yaoebgBMKncjMlR4.webp?scale-down-to=1024&width=1070&height=1037",
    badge: "iM",
  },
  {
    title: "FIGCOMS",
    tag: "Selected Work",
    image: "https://res.cloudinary.com/dnjdznswm/image/upload/v1773398269/11_absolute_PNG_olbbn7.png",
    badge: "◆",
  },
  {
    title: "Nimbus",
    tag: "Selected Work",
    image: "https://res.cloudinary.com/dnjdznswm/image/upload/v1773307911/what-is-1857_1_ppsbez.png",
    badge: "N",
  },
  {
    title: "Voxel",
    tag: "Selected Work",
    image: "https://res.cloudinary.com/dnjdznswm/image/upload/v1774330231/front_3x_xhhks0.png",
    badge: "V",
  },
    {
    title: "Voxel",
    tag: "Selected Work",
    image: "https://res.cloudinary.com/dnjdznswm/image/upload/v1774330231/front_3x_xhhks0.png",
    badge: "V",
  },
];

const N = PROJECTS.length;
const PEAK = 14; // flexGrow of the active card
const BASE = 1; // flexGrow of every other card

export default function SelectedWorkSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  return (
    <div ref={containerRef} style={{ height: `${N * 100}vh` }} className="relative bg-black">
      <div className="sticky top-6 flex h-[calc(100vh-3rem)] items-stretch px-6 sm:px-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-[32px] bg-[#1a1a19] md:grid-cols-2">
          {/* left: pill + title, swaps per active project */}
          <div className="relative flex flex-col justify-center px-10 py-12 sm:px-16">
            {/* <FlyMark className="absolute left-16 top-1/2 h-6 w-6 -translate-y-24 sm:left-24" /> */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-4"
              >
                <span className="shrink-0 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white">
                  {PROJECTS[active].tag}
                </span>
                <h3 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                  {PROJECTS[active].title}
                </h3>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* right: stacked cards, each one's flexGrow pulses as scroll passes its slice */}
          <div className="flex h-full flex-col gap-4 p-4">
            {PROJECTS.map((project, i) => (
              <Card key={`${project.title}-${i}`} project={project} index={i} total={N} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const start = index / total;
  const mid = (index + 0.5) / total;
  const end = (index + 1) / total;
  const flexGrow = useTransform(progress, [start, mid, end], [BASE, PEAK, BASE]);

  return (
    <motion.div
      style={{ flexGrow, flexBasis: 0, minHeight: 0 }}
      className="relative overflow-hidden rounded-2xl bg-black/10"
    >
      <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
      {/* subtle scrim so the badge stays legible over any photo */}
      <div className="absolute inset-0 bg-black/25" />
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold text-white backdrop-blur-sm sm:h-20 sm:w-20 sm:text-2xl">
          {project.badge}
        </div>
      </div> */}
    </motion.div>
  );
}

// function FlyMark({ className }: { className?: string }) {
//   return (
//     <motion.svg
//       viewBox="0 0 24 24"
//       fill="black"
//       className={className}
//       animate={{ rotate: [0, 8, -6, 0], y: [0, -3, 0] }}
//       transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
//     >
//       <ellipse cx="12" cy="13" rx="3" ry="5" />
//       <ellipse cx="6" cy="8" rx="4.5" ry="3" transform="rotate(-25 6 8)" opacity="0.85" />
//       <ellipse cx="18" cy="8" rx="4.5" ry="3" transform="rotate(25 18 8)" opacity="0.85" />
//       <circle cx="12" cy="6.5" r="1.6" />
//     </motion.svg>
//   );
// }