interface LogoProps {
  light?: boolean;
}

export default function Logo({ light = false }: LogoProps) {
  const textColor = light ? "#ffffff" : "#1A1A1A";
  const subColor = light ? "rgba(255,255,255,0.45)" : "#2563EB";

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      {/* Icon mark — proper geometric B with gradient */}
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5B9BF8" />
            <stop offset="100%" stopColor="#1A3EBF" />
          </linearGradient>
        </defs>

        {/* Background tile */}
        <rect width="34" height="34" rx="9" fill="url(#logoGrad)" />

        {/* Subtle inner highlight */}
        <rect width="34" height="17" rx="9" fill="white" fillOpacity="0.06" />

        {/*
          B letterform using evenodd fill rule.
          Outer silhouette + two counter cutouts.

          Coordinate space: 34×34 box.
          B occupies roughly x=7..25, y=7..27.

          Outer path traces the full B silhouette (stem + both bumps as one shape).
          Two sub-paths are the interior holes (counters).
          fillRule="evenodd" punches the holes automatically.
        */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="white"
          d="
            M 7 7
            L 7 27
            L 19 27
            Q 26 27 26 21.5
            Q 26 16 19 16
            Q 23.5 16 23.5 12
            Q 23.5 7 17 7
            Z

            M 10.5 10
            L 16.5 10
            Q 20.5 10 20.5 12
            Q 20.5 14 16.5 14
            L 10.5 14
            Z

            M 10.5 18.5
            L 18.5 18.5
            Q 22.5 18.5 22.5 21.5
            Q 22.5 24.5 18.5 24.5
            L 10.5 24.5
            Z
          "
        />
      </svg>

      {/* Wordmark */}
      <span className="flex flex-col leading-none">
        <span
          className="font-black tracking-tight text-[15px] leading-none"
          style={{ color: textColor }}
        >
          by<span style={{ color: "#2563EB" }}>Brian</span>
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
