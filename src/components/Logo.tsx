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

      <svg
        width={isHero ? 280 : 112}
        height={isHero ? 22 : 10}
        viewBox="0 0 260 22"
        className={isHero ? 'mt-2.5' : 'mt-[3px]'}
        aria-hidden
      >
        <path
          d="M 8 12 Q 40 5, 80 11 T 160 9 Q 200 15, 240 8 T 254 12"
          stroke={inkColor}
          strokeWidth={isHero ? 3.4 : 1.7}
          fill="none"
          strokeLinecap="round"
        />
      </svg>

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
