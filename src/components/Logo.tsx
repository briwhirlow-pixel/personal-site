interface LogoProps {
  light?: boolean;
}

export default function Logo({ light = false }: LogoProps) {
  const textColor = light ? "#ffffff" : "#1A1A1A";
  const subColor = light ? "rgba(255,255,255,0.45)" : "#2563EB";

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      {/* Icon mark — geometric B */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background square with rounded corners */}
        <rect width="32" height="32" rx="8" fill="#2563EB" />
        {/* Bold B letterform */}
        <path
          d="M9 8h8.5c2.5 0 4.5 1.8 4.5 4 0 1.2-.55 2.25-1.4 3 1.1.7 1.9 1.9 1.9 3.2 0 2.5-2 4.3-4.7 4.3H9V8z"
          fill="white"
        />
        <rect x="11.5" y="10.5" width="5.2" height="3.5" rx="1.75" fill="#2563EB" />
        <rect x="11.5" y="15.5" width="5.8" height="3.8" rx="1.9" fill="#2563EB" />
      </svg>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span
          className="font-black tracking-tight text-[15px] leading-none"
          style={{ color: textColor }}
        >
          by
          <span style={{ color: "#2563EB" }}>Brian</span>
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
