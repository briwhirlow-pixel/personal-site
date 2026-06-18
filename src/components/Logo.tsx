interface LogoProps {
  light?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  size?: 'default' | 'hero';
}

const BLUE = '#0EA5E9';

export default function Logo({ light = false, showTagline = true, animated = false, size = 'default' }: LogoProps) {
  const isHero = size === 'hero';
  const inkColor = light ? '#FFFFFF' : '#0E0C0A';
  const inkClass = light ? 'text-white' : 'text-ink';
  const taglineClass = light ? 'text-white/65' : 'text-ink-muted';

  return (
    <span
      className={`inline-flex flex-col items-center select-none leading-none ${animated ? 'hero-logo-float' : ''}`}
      aria-label="builtbybrian web design"
    >
      <span
        className={`font-display font-extrabold tracking-[-0.025em] ${
          isHero ? 'text-[44px] sm:text-[60px]' : 'text-[18px] sm:text-[20px]'
        }`}
      >
        <span className={inkClass}>built</span>
        <span style={{ color: BLUE }}>by</span>
        <span className={inkClass}>brian</span>
      </span>

      {showTagline && (
        <span
          className={`font-bold uppercase ${taglineClass} ${
            isHero
              ? 'tracking-[0.42em] text-[14px] sm:text-[16px] mt-4'
              : 'tracking-[0.34em] text-[10px] sm:text-[11px] mt-2'
          }`}
        >
          web design
        </span>
      )}
    </span>
  );
}
