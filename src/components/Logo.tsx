interface LogoProps {
  light?: boolean;
}

export default function Logo({ light: _light = false }: LogoProps) {
  return (
    <span className="inline-flex items-baseline gap-2 select-none">
      {/* Small forest dot — minimalist mark */}
      <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-forest translate-y-[-2px]" />
      {/* Wordmark in Instrument Serif */}
      <span className="font-serif text-[22px] leading-none text-ink tracking-tight">
        Built<span className="italic text-clay px-[1px]">by</span>Brian
      </span>
    </span>
  );
}
