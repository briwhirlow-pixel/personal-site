interface LogoProps {
  light?: boolean;
  showTagline?: boolean;
}

export default function Logo({ light: _light = false, showTagline = true }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-forest" />
      <span className="flex flex-col items-start leading-none gap-1">
        <span className="font-serif text-[20px] sm:text-[22px] leading-none text-ink tracking-tight">
          Built<span className="italic text-clay px-[1px]">by</span>Brian
        </span>
        {showTagline && (
          <span className="font-mono text-[8px] sm:text-[8.5px] tracking-[0.28em] uppercase text-ink-muted leading-none font-semibold">
            Web Design
          </span>
        )}
      </span>
    </span>
  );
}
