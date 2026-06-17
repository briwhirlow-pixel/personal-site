'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-paper text-ink min-h-[100dvh] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-16 sm:pb-20 w-full">
        <p className="text-forest text-[13px] sm:text-[14px] font-medium tracking-wide mb-8 editorial-rise">
          Brian Whirlow · Philadelphia + South Jersey
        </p>

        <h1
          className="font-display font-extrabold leading-[0.90] tracking-[-0.03em] text-ink text-balance editorial-rise"
          style={{ fontSize: 'clamp(42px, 8.5vw, 92px)', animationDelay: '0.08s' }}
        >
          Hand-built websites
          <br className="hidden sm:inline" />
          {' '}for small businesses.
        </h1>

        <p
          className="mt-8 sm:mt-10 text-ink-soft text-[16px] sm:text-[18px] leading-[1.6] max-w-xl text-pretty editorial-rise"
          style={{ animationDelay: '0.16s' }}
        >
          Restaurants, shops, studios, service businesses. No templates.
          Five-day first drafts. You own every line of code.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center editorial-rise"
          style={{ animationDelay: '0.24s' }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 bg-clay text-ink px-7 py-4 font-semibold text-[15px] hover:bg-clay-deep transition-colors active:scale-[0.98]"
            style={{ boxShadow: '0 8px 24px -8px rgba(232,88,58,0.45)', minHeight: 48 }}
          >
            Start a project
            <span aria-hidden className="text-[16px] leading-none">→</span>
          </Link>
          <Link
            href="/work"
            className="group inline-flex items-center justify-center sm:justify-start gap-2 text-forest text-[15px] font-semibold hover:text-forest-bright transition-colors py-3 sm:py-0"
          >
            See the work
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
