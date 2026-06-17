interface LogoProps {
  light?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  size?: 'default' | 'hero';
}

export default function Logo({ light = false, showTagline: _showTagline = true, animated = false, size = 'default' }: LogoProps) {
  const iconColor = light ? "#fff" : "var(--color-ink)";
  const isHero = size === 'hero';

  return (
    <span
      className={`inline-flex items-center select-none ${isHero ? "gap-5" : "gap-2"} ${animated ? "hero-logo-float" : ""}`}
      aria-label="builtbybrian web design"
    >
      <svg
        width={isHero ? "96" : "22"}
        height={isHero ? "78" : "18"}
        viewBox="0 0 24 20"
        fill="none"
        aria-hidden
        className={animated ? "hero-screen-glow rounded" : ""}
      >
        <rect x="3" y="1" width="18" height="13" rx="2" stroke={iconColor} strokeWidth="1.5" />
        <path d="M1 16.5h22" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 14v2.5M16 14v2.5" stroke={iconColor} strokeWidth="1.2" opacity="0.4" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-medium tracking-[-0.03em] ${isHero ? "text-[38px] sm:text-[46px]" : "text-[15px] sm:text-[16px]"} ${light ? "text-white" : "text-ink"}`}>
          builtbybrian
        </span>
        <span className={`tracking-[0.1em] font-medium ${isHero ? "text-[13px] sm:text-[16px] mt-[3px]" : "text-[8px] sm:text-[9px] mt-[1px]"} ${light ? "text-white/45" : "text-ink-muted"}`}>
          web design
        </span>
      </span>
    </span>
  );
}
