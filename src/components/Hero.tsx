'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #06091F 0%, #0D1B45 50%, #081229 100%)' }}
    >
      {/* Subtle static gradient orbs — no animation */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.12] pointer-events-none" style={{ background: '#2563EB' }} />
      <div className="absolute bottom-1/4 left-1/5 w-[400px] h-[400px] rounded-full blur-[130px] opacity-[0.08] pointer-events-none" style={{ background: '#6366F1' }} />

      <div className={`relative max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-14 sm:pb-16 w-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
          <span className="text-white/50 text-[11px] sm:text-[12px] tracking-wide font-medium">Available for new projects — 2026</span>
        </div>

        {/* Headline — static, no rotating words */}
        <h1 className="text-[clamp(36px,8vw,88px)] font-black text-white leading-[1.05] tracking-tight mb-6 sm:mb-8">
          Websites that
          <br />
          <span className="text-[#60A5FA]">convert</span>
          <br />
          your business.
        </h1>

        <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-sm sm:max-w-lg mb-8 sm:mb-10">
          I design and build beautiful websites that turn visitors into customers — from brochure sites to full e-commerce stores.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-14">
          <a href="/contact" className="group inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-[#1D4ED8] transition-colors text-[14px] sm:text-[15px]">
            Get a free quote
            <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/work" className="inline-flex items-center justify-center gap-2 text-white/60 font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-white/10 hover:border-white/30 hover:text-white transition-colors text-[14px] sm:text-[15px]">
            See examples I&apos;ve built
          </a>
        </div>

        {/* Website types — static pill list, no scrolling */}
        <div className="flex flex-wrap gap-2 mb-10 sm:mb-14">
          {[
            { emoji: '🛍️', label: 'E-Commerce' },
            { emoji: '🍕', label: 'Restaurant' },
            { emoji: '📸', label: 'Photography' },
            { emoji: '💼', label: 'Portfolio' },
            { emoji: '🏠', label: 'Real Estate' },
            { emoji: '💈', label: 'Salon & Spa' },
            { emoji: '🏋️', label: 'Fitness' },
            { emoji: '🏗️', label: 'Construction' },
            { emoji: '📱', label: 'SaaS / App' },
            { emoji: '🎓', label: 'Education' },
          ].map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium text-white/40 border border-white/[0.08] rounded-full px-3 py-1.5"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-6 sm:gap-12 pt-6 sm:pt-8 border-t border-white/[0.08]">
          {[
            { value: '72hr', label: 'First Draft' },
            { value: '100%', label: 'Satisfaction' },
            { value: '3×', label: 'Lead Increase' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[28px] sm:text-[36px] font-black text-white leading-none">{stat.value}</p>
              <p className="text-white/35 text-[11px] sm:text-[13px] mt-1 sm:mt-1.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
