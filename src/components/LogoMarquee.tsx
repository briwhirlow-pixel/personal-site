'use client';

import { useEffect, useState } from 'react';

const items = [
  "Fast Turnaround", "Mobile-First", "Ranks on Google", "Easy to Update",
  "Secure", "Custom Design", "You Own the Code", "Built to Convert",
  "Live in 2–4 Weeks", "First Draft in 5 Days", "SEO Optimized", "No Lock-In", "No Templates", "More Inquiries, More Sales",
];

const doubled = [...items, ...items];

export default function LogoMarquee() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  return (
    <div className="bg-[#F2F1EC] border-y border-[#E5E4DF] py-4 sm:py-5 overflow-hidden">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: reducedMotion ? 'none' : 'marquee 30s linear infinite', width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-[12px] sm:text-[13px] font-semibold text-[#737373] tracking-wide flex items-center gap-3 flex-shrink-0"
          >
            <span className="text-[#CECCC6] text-[8px]">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
