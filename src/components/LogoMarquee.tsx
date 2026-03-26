const row1 = [
  "Fast Loading", "Mobile Friendly", "Ranks on Google", "Easy to Update",
  "Secure", "Custom Design", "No Monthly Fees", "Built to Convert",
];

const row2 = [
  "Fully Responsive", "Clean Code", "SEO Optimized", "Looks Great on Any Device",
  "Launched Fast", "You Own It", "No Templates", "Converts Visitors",
];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex items-center overflow-hidden">
      <div
        className="marquee-track flex items-center gap-0 flex-shrink-0"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${reverse ? '34s' : '28s'} linear infinite`,
          willChange: 'transform',
        }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-0 flex-shrink-0">
            <span className="text-[12px] sm:text-[13px] font-semibold text-[#737373] tracking-wide whitespace-nowrap px-6 sm:px-8 hover:text-[#2563EB] transition-colors cursor-default">
              {item}
            </span>
            <span className="text-[#CECCC6] text-[9px] sm:text-[10px]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <div className="bg-[#F2F1EC] border-y border-[#E5E4DF] py-3 sm:py-4 overflow-hidden flex flex-col gap-2 sm:gap-2.5">
      <MarqueeRow items={row1} />
      <MarqueeRow items={row2} reverse />
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-reverse {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
