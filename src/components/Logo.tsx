interface LogoProps {
  light?: boolean;
}

export default function Logo({ light = false }: LogoProps) {
  const textColor = light ? "#ffffff" : "#1A1A1A";
  const subColor = light ? "rgba(255,255,255,0.45)" : "#2563EB";

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      {/* Icon mark — proper geometric B with gradient */}
      <div className="w-8 h-8 rounded-[8px] bg-[#2563EB] flex items-center justify-center flex-shrink-0">
        <span className="text-white font-black text-[20px] leading-none" style={{ marginTop: '2px' }}>B</span>
      </div>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span
          className="font-black tracking-tight text-[15px] leading-none"
          style={{ color: textColor }}
        >
          By<span style={{ color: "#2563EB" }}>Brian</span>
        </span>
        <span
          className="text-[8.5px] font-semibold tracking-[0.18em] uppercase mt-[3px] leading-none"
          style={{ color: subColor }}
        >
          Web Design
        </span>
      </span>
    </span>
  );
}
