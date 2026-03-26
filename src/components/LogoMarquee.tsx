const items = [
  "Fast Turnaround", "Mobile-First", "Ranks on Google", "Easy to Update",
  "Secure", "Custom Design", "You Own the Code", "Built to Convert",
  "Fully Responsive", "Clean Code", "SEO Optimized", "No Lock-In", "No Templates", "Converts Visitors",
];

export default function LogoMarquee() {
  return (
    <div className="bg-[#F2F1EC] border-y border-[#E5E4DF] py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {items.map((item, i) => (
            <span key={i} className="text-[12px] sm:text-[13px] font-semibold text-[#737373] tracking-wide whitespace-nowrap flex items-center gap-2">
              {i > 0 && <span className="text-[#CECCC6] text-[8px]">✦</span>}
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
