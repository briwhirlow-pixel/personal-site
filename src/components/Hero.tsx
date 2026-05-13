'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const industries = [
  "E-Commerce", "Restaurant", "Photography", "Portfolio", "Real Estate",
  "Salon & Spa", "Fitness", "Construction", "SaaS / App", "Education",
];

export default function Hero() {
  return (
    <section className="relative bg-paper text-ink overflow-hidden">
      {/* Dot-grid background, masked to top */}
      <div
        aria-hidden
        className="absolute inset-0 dot-grid pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at top, black 35%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 35%, transparent 80%)",
        }}
      />

      {/* Top editorial meta */}
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-28 md:pt-32">
        <div className="flex items-center justify-between pb-4 border-b border-rule">
          <span className="font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay pulse-dot" aria-hidden />
            Now accepting new projects — limited spots
          </span>
          <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
            Index / 001
          </span>
        </div>
      </div>

      {/* Headline + content */}
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-14 sm:pt-16 pb-16 w-full">

        <h1 className="font-serif text-[clamp(48px,9vw,120px)] leading-[0.92] tracking-[-0.025em] text-ink font-normal editorial-rise">
          Small business
          <br />
          websites,
          <br />
          <span className="relative inline-block italic text-forest">
            built like they matter.
            <WavyUnderline />
          </span>
        </h1>

        <p className="mt-10 md:mt-12 text-ink-soft text-[17px] sm:text-[19px] leading-[1.55] max-w-2xl font-medium editorial-rise" style={{ animationDelay: '0.1s' }}>
          I design and build websites for restaurants, shops, studios, and the
          local businesses that put their name on the door.{" "}
          <span className="text-ink font-semibold">Five-day first drafts. One person, start to finish.</span>
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-5 items-start sm:items-center editorial-rise" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 bg-forest text-paper px-6 sm:px-7 py-3.5 sm:py-4 rounded-[6px] font-semibold text-[14px] sm:text-[15px] hover:bg-forest-deep transition-colors"
            style={{ boxShadow: "0 8px 24px -8px rgba(37,99,235,0.5)" }}
          >
            Start a project
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
          </Link>
          <Link
            href="/work"
            className="group inline-flex items-baseline gap-2 text-ink text-[14px] sm:text-[15px] font-semibold tracking-wide"
          >
            <span className="border-b border-ink/40 group-hover:border-clay group-hover:text-clay pb-0.5 transition-colors">
              See what I build
            </span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Industry chips — 2 rows of 5 */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-5 gap-2 editorial-rise" style={{ animationDelay: '0.3s' }}>
          {industries.map((label) => (
            <span
              key={label}
              className="inline-flex items-center justify-center font-mono text-[11px] sm:text-[12px] tracking-wide bg-paper-soft border border-rule text-ink-soft px-3 py-2 rounded-[4px] hover:border-forest hover:text-forest transition-colors"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Stats — 3 across, mono numbers for tech feel */}
        <div className="mt-14 sm:mt-16 grid grid-cols-3 gap-y-8 gap-x-3 sm:gap-x-6 pt-10 border-t-2 border-ink editorial-rise" style={{ animationDelay: '0.4s' }}>
          {[
            { label: "First draft", value: "5", unit: "days" },
            { label: "Client rating", value: "5.0", unit: "★" },
            { label: "Starting at", value: "$750", unit: "" },
          ].map((s, i) => (
            <div key={s.label}>
              <p className="font-mono text-[10px] tracking-[0.22em] text-ink-muted uppercase">
                <span className="text-clay mr-2">0{i + 1}</span>
                {s.label}
              </p>
              <p className="font-sans text-[clamp(32px,5vw,56px)] text-ink leading-none tracking-tight font-bold mt-3 tabular-nums">
                {s.value}
                {s.unit && <span className="text-ink-soft text-[clamp(18px,3vw,28px)] ml-2 font-semibold">{s.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WavyUnderline() {
  return (
    <svg
      aria-hidden
      className="absolute left-0 right-0 -bottom-2 w-full h-3"
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
    >
      <path
        d="M 2 6 Q 50 1 100 6 T 200 6 T 300 6 T 398 6"
        stroke="#0EA5E9"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
