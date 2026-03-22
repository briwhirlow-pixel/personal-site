"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section className="relative min-h-screen bg-black flex flex-col justify-end overflow-hidden">
      {/* Background grid/texture — subtle */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Large decorative number — Squarespace editorial touch */}
      <div
        className={`absolute top-[15%] right-[5%] text-[20vw] font-black text-white select-none pointer-events-none leading-none transition-opacity duration-1000 ${
          loaded ? "opacity-[0.04]" : "opacity-0"
        }`}
        aria-hidden
      >
        BW
      </div>

      {/* Main content — bottom-aligned editorial style */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pb-20 pt-40 w-full">
        {/* Eyebrow */}
        <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase mb-8 font-medium">
          Freelance Web Design & Development
        </p>

        {/* Headline */}
        <h1
          className={`text-[clamp(48px,8vw,96px)] font-black text-white leading-[0.95] tracking-tight mb-10 max-w-5xl transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Websites
          <br />
          <span className="italic font-light">that work</span>
          <br />
          as hard
          <br />
          as you do.
        </h1>

        {/* Divider line */}
        <div className="w-16 h-px bg-white/30 mb-8" />

        {/* Sub + CTAs */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <p className="text-white/50 text-[15px] leading-relaxed max-w-sm">
            I design and build fast, beautiful websites that help businesses grow — from brochure sites to full e-commerce stores.
          </p>
          <div className="flex gap-4 flex-shrink-0">
            <a
              href="#portfolio"
              className="text-[12px] tracking-widest uppercase font-semibold text-white/60 border-b border-white/20 pb-0.5 hover:text-white hover:border-white transition-colors"
            >
              See My Work
            </a>
            <a
              href="#contact"
              className="text-[12px] tracking-widest uppercase font-semibold bg-white text-black px-6 py-3 hover:bg-white/90 transition-colors"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
