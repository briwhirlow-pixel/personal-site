export default function Logo({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <span className="inline-flex flex-col items-center select-none">
      <span
        className="bg-ink rounded-[6px] p-[2.5px] block"
        style={{ boxShadow: '0 2px 6px -2px rgba(240,236,228,0.08)' }}
      >
        <span className="bg-paper-soft rounded-[4px] px-2.5 pt-[6px] pb-[5px] block">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="w-1 h-1 rounded-full bg-forest flex-shrink-0" />
            <span className="font-display text-[15px] sm:text-[16px] leading-none text-ink tracking-tight whitespace-nowrap font-bold">
              Built<span className="text-clay px-[1px]">by</span>Brian
            </span>
          </span>
          {showTagline && (
            <span className="block text-[7.5px] sm:text-[8px] tracking-[0.24em] uppercase text-ink-muted leading-none mt-[4px] text-center font-semibold">
              Web Design
            </span>
          )}
        </span>
      </span>
      <span aria-hidden className="block w-[10px] h-[3px] bg-ink/80" />
      <span aria-hidden className="block w-[28px] h-[2px] bg-ink/80 rounded-full mt-[0.5px]" />
    </span>
  );
}
