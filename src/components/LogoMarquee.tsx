import Logo from "./Logo";

export default function LogoMarquee() {
  return (
    <div className="relative bg-ink overflow-hidden py-3" aria-hidden>
      <div className="marquee-track flex items-center gap-16 whitespace-nowrap">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-16 flex-shrink-0">
            <Logo light />
            <span className="text-white/20 text-[13px] font-medium tracking-wide">
              ·
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
