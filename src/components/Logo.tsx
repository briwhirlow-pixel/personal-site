interface LogoProps {
  light?: boolean;
  showTagline?: boolean;
}

// The logo is the existing BuiltByBrian wordmark, displayed as if it were
// rendered on a small computer monitor. The bezel + neck + base read as a
// screen, which is the meta-cute brand move for a web designer.
export default function Logo({ light: _light = false, showTagline = true }: LogoProps) {
  return (
    <span className="inline-flex flex-col items-center select-none">
      {/* Monitor screen with bezel */}
      <span
        className="bg-ink rounded-[6px] p-[2.5px] block"
        style={{ boxShadow: "0 2px 6px -2px rgba(26,26,46,0.18)" }}
      >
        <span className="bg-paper-soft rounded-[4px] px-2.5 pt-[6px] pb-[5px] block">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="w-1 h-1 rounded-full bg-forest flex-shrink-0" />
            <span className="font-serif text-[15px] sm:text-[16px] leading-none text-ink tracking-tight whitespace-nowrap wordmark-draw inline-block">
              Built<span className="italic text-clay px-[1px]">by</span>Brian
            </span>
          </span>
          {showTagline && (
            <span className="block font-mono text-[6.5px] sm:text-[7px] tracking-[0.28em] uppercase text-ink-muted leading-none font-semibold mt-[4px] text-center">
              Web Design
            </span>
          )}
        </span>
      </span>

      {/* Monitor stand — neck + base */}
      <span aria-hidden className="block w-[10px] h-[3px] bg-ink/80" />
      <span aria-hidden className="block w-[28px] h-[2px] bg-ink/80 rounded-full mt-[0.5px]" />
    </span>
  );
}
