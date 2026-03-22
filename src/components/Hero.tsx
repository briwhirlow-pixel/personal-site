"use client";

import { useEffect, useState } from "react";

const stats = [
  { value: "40+", label: "Sites Launched" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "3×", label: "Avg. Lead Increase" },
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <section className="relative min-h-screen bg-[#111111] flex flex-col justify-center overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #FF5733 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 w-full">
        {/* Eyebrow pill */}
        <div className={`inline-flex items-center gap-2 bg-white/[0.07] border border-white/10 rounded-full px-4 py-1.5 mb-8 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5733] animate-pulse" />
          <span className="text-white/60 text-[12px] tracking-wide font-medium">Available for new projects</span>
        </div>

        {/* Headline */}
        <h1
          className={`text-[clamp(44px,7.5vw,90px)] font-black text-white leading-[1.0] tracking-tight mb-8 max-w-4xl transition-all duration-700 delay-100 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Websites that
          <br />
          <span className="text-[#FF5733]">grow</span> your
          <br />
          business.
        </h1>

        {/* Subtext */}
        <p
          className={`text-white/50 text-[17px] leading-relaxed max-w-lg mb-10 transition-all duration-700 delay-200 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          I design and build fast, beautiful websites that convert visitors into customers — from brochure sites to full e-commerce stores.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-wrap gap-4 mb-20 transition-all duration-700 delay-300 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#FF5733] text-white font-semibold px-7 py-4 rounded-full hover:bg-[#E64A2A] transition-colors text-[15px]"
          >
            Get a free quote
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 text-white/70 font-semibold px-7 py-4 rounded-full border border-white/10 hover:border-white/30 hover:text-white transition-all text-[15px]"
          >
            See my work
          </a>
        </div>

        {/* Stats bar */}
        <div className={`flex flex-wrap gap-12 pt-8 border-t border-white/10 transition-all duration-700 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[32px] font-black text-white leading-none">{stat.value}</p>
              <p className="text-white/40 text-[13px] mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
