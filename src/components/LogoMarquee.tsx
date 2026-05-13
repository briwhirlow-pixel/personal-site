'use client';

import { useEffect, useState } from 'react';

const items = [
  "5-Day First Drafts",
  "No Templates",
  "You Own the Code",
  "Built for Local Businesses",
  "More Inquiries · More Sales",
  "Mobile-First Always",
  "Live in 2–4 Weeks",
  "Cancel Hosting Anytime",
];

const doubled = [...items, ...items];

export default function LogoMarquee() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  return (
    <div className="bg-paper-soft border-y border-rule py-4 sm:py-5 overflow-hidden">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: reducedMotion ? 'none' : 'marquee 28s linear infinite', width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-[13px] sm:text-[14px] font-medium text-ink-soft tracking-tight flex items-center gap-3 flex-shrink-0"
          >
            <span className="text-clay text-[10px]" aria-hidden>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
