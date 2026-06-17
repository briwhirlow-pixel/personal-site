'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function Hero() {
  return (
    <section className="relative bg-paper text-ink min-h-[100dvh] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-16 sm:pb-20 w-full text-center">

        {/* Animated hero logo */}
        <div className="flex justify-center mb-12 sm:mb-16 editorial-rise">
          <Logo animated />
        </div>

        <h1
          className="font-display font-medium leading-[1.05] tracking-[-0.035em] text-ink text-balance editorial-rise"
          style={{ fontSize: 'clamp(28px, 5vw, 52px)', animationDelay: '0.12s' }}
        >
          Hand-coded.
          <br />
          Personally designed.
          <br />
          Yours forever.
        </h1>

        <p
          className="mt-8 sm:mt-10 text-ink-soft text-[16px] sm:text-[18px] leading-[1.5] max-w-lg mx-auto text-pretty editorial-rise"
          style={{ animationDelay: '0.22s' }}
        >
          Custom websites for restaurants, shops, studios, and service
          businesses. One designer, start to finish. You own every line of code.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center editorial-rise"
          style={{ animationDelay: '0.3s' }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 bg-clay text-ink px-7 py-4 font-semibold text-[15px] hover:bg-clay-deep transition-colors active:scale-[0.98]"
            style={{ boxShadow: '0 8px 24px -8px rgba(14,165,233,0.35)', minHeight: 48 }}
          >
            Start a project
            <span aria-hidden className="text-[16px] leading-none">→</span>
          </Link>
          <Link
            href="/work"
            className="group inline-flex items-center justify-center gap-2 text-forest text-[15px] font-semibold hover:text-forest-bright transition-colors py-3 sm:py-0"
          >
            See the work
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
