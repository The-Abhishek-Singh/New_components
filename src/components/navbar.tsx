"use client";

import { useState } from "react";

const NAV_LINKS = ["About", "Blog", "Work", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/25 bg-[#FF4D0A]">
      <div className="mx-auto flex items-center justify-between px-6 py-4 sm:px-10">
        <a href="/" className="text-2xl font-semibold tracking-tight text-white">
          copula
        </a>

        <nav className="flex items-center gap-3">
          {open &&
            NAV_LINKS.map((label, i) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="nav-pill whitespace-nowrap rounded-full bg-[#F6F1E7] px-5 py-2.5 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-white"
                style={{ animationDelay: `${(NAV_LINKS.length - 1 - i) * 70}ms` }}
              >
                {label}
              </a>
            ))}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F6F1E7] text-[#FF4D0A] transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={`transition-transform duration-300 ${
                open ? "rotate-45" : "rotate-0"
              }`}
            >
              <path d="M8 0V16" stroke="currentColor" strokeWidth="2" />
              <path d="M0 8H16" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </nav>
      </div>

      <style jsx>{`
        .nav-pill {
          opacity: 0;
          transform: translateX(24px);
          animation: slideIn 0.35s ease-out forwards;
        }
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-pill {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </header>
  );
}