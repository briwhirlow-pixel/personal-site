import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logo Lab — internal preview",
  robots: { index: false, follow: false },
};

type Concept = {
  id: string;
  name: string;
  rationale: string;
  inspiredBy: string;
};

const concepts: Concept[] = [
  {
    id: "01",
    name: "Bracket Frame Emblem",
    rationale: "A unified [B] emblem — code-bracket frame in electric blue with a sharp B inside. Reads as both 'developer' and 'badge'. Strong as avatar.",
    inspiredBy: "Vercel · Cursor · Linear",
  },
  {
    id: "02",
    name: "Pixel Grid B",
    rationale: "A modular B drawn as a 5×4 grid of unit blocks. Plays directly on \"Built\" — architectural, computational, extremely distinct.",
    inspiredBy: "Replit · Pitch · constructive type",
  },
  {
    id: "03",
    name: "Hex Sigil",
    rationale: "Hexagonal blue emblem with a custom B inside. Premium tech-badge energy — feels like it belongs in an SDK or a credential.",
    inspiredBy: "Stripe · Discord · Notion enterprise",
  },
  {
    id: "04",
    name: "Chevron Prompt",
    rationale: "A blue ›_ chevron mark beside the wordmark — direct nod to a code prompt. Sharp, fast, energetic. Smallest visual footprint.",
    inspiredBy: "Raycast · Warp · GitHub Copilot",
  },
  {
    id: "05",
    name: "Stacked Block B",
    rationale: "A layered B with three offset plates giving depth. Dimensional, architectural, plays on \"Built\". Looks 3D-rendered without being skeuomorphic.",
    inspiredBy: "Figma · Framer · Linear updates",
  },
  {
    id: "06",
    name: "Sliced Sigil",
    rationale: "A square emblem with a B sliced diagonally — top half blue, bottom half outlined. Most dynamic, most energy. Strong at any size.",
    inspiredBy: "Arc · Rive · Loom",
  },
];

export default function LogoLab() {
  return (
    <main className="min-h-screen bg-canvas text-fg pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="pb-6 border-b border-line mb-16">
          <p className="font-mono text-[10.5px] tracking-[0.18em] text-fg-muted uppercase flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent pulse-dot" aria-hidden />
            Internal preview · Not indexed
          </p>
          <h1 className="font-sans text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-0.03em] font-bold mt-4">
            Logo lab — <span className="text-accent italic font-semibold" style={{ textShadow: "0 0 30px rgba(77,124,255,0.4)" }}>six emblems</span>
          </h1>
          <p className="text-fg-soft text-[16px] md:text-[18px] mt-6 max-w-2xl leading-relaxed">
            Six emblem directions for <strong className="font-semibold text-fg">BuiltByBrian</strong>. Each shown
            on dark canvas, on a light surface, and as a 1:1 avatar for Instagram and favicon.
            Pick a number and I'll lock the final, replace the Navbar mark, and ship the matching
            social templates.
          </p>
        </div>

        {/* 01 — Bracket Frame */}
        <ConceptShell concept={concepts[0]}>
          <Tile bg="dark">
            <div className="flex items-center gap-5">
              <BracketEmblem variant="dark" size={72} />
              <Wordmark variant="dark" size="lg" />
            </div>
          </Tile>
          <Tile bg="light">
            <div className="flex items-center gap-5">
              <BracketEmblem variant="light" size={72} />
              <Wordmark variant="light" size="lg" />
            </div>
          </Tile>
          <Avatar bg="dark"><BracketEmblem variant="dark" size={120} /></Avatar>
        </ConceptShell>

        {/* 02 — Pixel Grid B */}
        <ConceptShell concept={concepts[1]}>
          <Tile bg="dark">
            <div className="flex items-center gap-5">
              <PixelB variant="dark" size={68} />
              <Wordmark variant="dark" size="lg" />
            </div>
          </Tile>
          <Tile bg="light">
            <div className="flex items-center gap-5">
              <PixelB variant="light" size={68} />
              <Wordmark variant="light" size="lg" />
            </div>
          </Tile>
          <Avatar bg="dark"><PixelB variant="dark" size={120} /></Avatar>
        </ConceptShell>

        {/* 03 — Hex Sigil */}
        <ConceptShell concept={concepts[2]}>
          <Tile bg="dark">
            <div className="flex items-center gap-5">
              <HexEmblem variant="dark" size={72} />
              <Wordmark variant="dark" size="lg" />
            </div>
          </Tile>
          <Tile bg="light">
            <div className="flex items-center gap-5">
              <HexEmblem variant="light" size={72} />
              <Wordmark variant="light" size="lg" />
            </div>
          </Tile>
          <Avatar bg="dark"><HexEmblem variant="dark" size={130} /></Avatar>
        </ConceptShell>

        {/* 04 — Chevron Prompt */}
        <ConceptShell concept={concepts[3]}>
          <Tile bg="dark">
            <div className="flex items-center gap-4">
              <ChevronMark variant="dark" size={56} />
              <Wordmark variant="dark" size="lg" />
            </div>
          </Tile>
          <Tile bg="light">
            <div className="flex items-center gap-4">
              <ChevronMark variant="light" size={56} />
              <Wordmark variant="light" size="lg" />
            </div>
          </Tile>
          <Avatar bg="dark"><ChevronMark variant="dark" size={110} avatar /></Avatar>
        </ConceptShell>

        {/* 05 — Stacked Block B */}
        <ConceptShell concept={concepts[4]}>
          <Tile bg="dark">
            <div className="flex items-center gap-5">
              <StackedB variant="dark" size={76} />
              <Wordmark variant="dark" size="lg" />
            </div>
          </Tile>
          <Tile bg="light">
            <div className="flex items-center gap-5">
              <StackedB variant="light" size={76} />
              <Wordmark variant="light" size="lg" />
            </div>
          </Tile>
          <Avatar bg="dark"><StackedB variant="dark" size={130} /></Avatar>
        </ConceptShell>

        {/* 06 — Sliced Sigil */}
        <ConceptShell concept={concepts[5]}>
          <Tile bg="dark">
            <div className="flex items-center gap-5">
              <SlicedSigil variant="dark" size={72} />
              <Wordmark variant="dark" size="lg" />
            </div>
          </Tile>
          <Tile bg="light">
            <div className="flex items-center gap-5">
              <SlicedSigil variant="light" size={72} />
              <Wordmark variant="light" size="lg" />
            </div>
          </Tile>
          <Avatar bg="dark"><SlicedSigil variant="dark" size={130} /></Avatar>
        </ConceptShell>

        {/* Footer note */}
        <div className="mt-20 pt-8 border-t border-line">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-fg-muted">
            Next step
          </p>
          <p className="text-fg-soft text-[16px] mt-3 max-w-2xl leading-relaxed">
            Tell me which concept (01 – 06) feels right — or which two to combine. I'll lock the
            final, replace the Navbar emblem, build a favicon set, and produce the Instagram avatar
            plus 3 post templates (announcement, case study, testimonial) using the same system.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* Layout primitives                                                    */
/* ──────────────────────────────────────────────────────────────────── */

function ConceptShell({ concept, children }: { concept: Concept; children: React.ReactNode }) {
  return (
    <section className="mb-20 md:mb-28">
      <div className="flex items-baseline justify-between pb-3 border-b border-line mb-3">
        <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-fg-muted">
          Concept {concept.id}
        </p>
        <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-fg-muted hidden sm:block">
          {concept.inspiredBy}
        </p>
      </div>
      <h2 className="font-sans text-[32px] md:text-[44px] tracking-[-0.025em] font-bold mb-3">
        {concept.name}
      </h2>
      <p className="text-fg-soft text-[15px] md:text-[16px] leading-relaxed max-w-2xl mb-8">
        {concept.rationale}
      </p>
      <div className="grid md:grid-cols-[1fr_1fr_220px] gap-4">{children}</div>
    </section>
  );
}

function Tile({ bg, children }: { bg: "dark" | "light"; children: React.ReactNode }) {
  return (
    <div
      className={`aspect-[4/3] flex items-center justify-center p-8 rounded-[4px] ${
        bg === "dark"
          ? "bg-canvas-soft border border-line"
          : "bg-[#F5F7FA] border border-[#D5DBE5]"
      }`}
    >
      {children}
    </div>
  );
}

function Avatar({ bg, children }: { bg: "dark" | "light"; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`aspect-square flex items-center justify-center rounded-full overflow-hidden ${
          bg === "dark" ? "bg-canvas-soft border border-line" : "bg-[#F5F7FA] border border-[#D5DBE5]"
        }`}
      >
        {children}
      </div>
      <p className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-fg-muted text-center">
        Avatar · Instagram 1:1
      </p>
    </div>
  );
}

function Wordmark({ variant, size }: { variant: "dark" | "light"; size: "md" | "lg" }) {
  const fg = variant === "dark" ? "#E8ECF5" : "#070A14";
  const fontSize = size === "lg" ? "text-[28px] md:text-[32px]" : "text-[20px]";
  return (
    <span className={`font-sans font-bold tracking-[-0.03em] leading-none ${fontSize}`} style={{ color: fg }}>
      Built<span className="text-accent">By</span>Brian
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* Emblem marks                                                         */
/* ──────────────────────────────────────────────────────────────────── */

const ACCENT = "#4D7CFF";
const ACCENT_GLOW = "rgba(77,124,255,0.45)";

function BracketEmblem({ variant, size }: { variant: "dark" | "light"; size: number }) {
  const inkLight = variant === "dark" ? "#E8ECF5" : "#070A14";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ filter: variant === "dark" ? `drop-shadow(0 0 18px ${ACCENT_GLOW})` : "none" }}>
      {/* Frame square */}
      <rect x="6" y="6" width="88" height="88" rx="10" fill="none" stroke={ACCENT} strokeWidth="3" />
      {/* Inner brackets */}
      <path d="M 28 26 L 22 26 L 22 74 L 28 74" stroke={ACCENT} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 72 26 L 78 26 L 78 74 L 72 74" stroke={ACCENT} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* B */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="44"
        fontWeight="800"
        fill={inkLight}
        style={{ letterSpacing: "-0.04em" }}
      >
        B
      </text>
    </svg>
  );
}

function PixelB({ variant, size }: { variant: "dark" | "light"; size: number }) {
  const accent = ACCENT;
  const accentSoft = variant === "dark" ? "#1B2440" : "#D5DBE5";
  // 5 rows × 4 cols, B-shaped grid
  const grid = [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ];
  const cell = 18;
  const gap = 3;
  const w = 4 * cell + 3 * gap;
  const h = 5 * cell + 4 * gap;
  return (
    <svg width={size} height={(size * h) / w} viewBox={`0 0 ${w} ${h}`} aria-hidden style={{ filter: variant === "dark" ? `drop-shadow(0 0 16px ${ACCENT_GLOW})` : "none" }}>
      {grid.map((row, r) =>
        row.map((cellVal, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * (cell + gap)}
            y={r * (cell + gap)}
            width={cell}
            height={cell}
            rx={3}
            fill={cellVal ? accent : accentSoft}
            opacity={cellVal ? 1 : 0.3}
          />
        ))
      )}
    </svg>
  );
}

function HexEmblem({ variant, size }: { variant: "dark" | "light"; size: number }) {
  const inkLight = variant === "dark" ? "#E8ECF5" : "#070A14";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ filter: variant === "dark" ? `drop-shadow(0 0 20px ${ACCENT_GLOW})` : "none" }}>
      {/* Outer hex — filled blue */}
      <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" fill={ACCENT} />
      {/* Inner hex notch — adds depth */}
      <polygon points="50,16 82,33 82,67 50,84 18,67 18,33" fill="none" stroke={variant === "dark" ? "#070A14" : "#FFFFFF"} strokeWidth="1.5" opacity="0.4" />
      {/* B */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="44"
        fontWeight="800"
        fill={variant === "dark" ? "#070A14" : "#FFFFFF"}
        style={{ letterSpacing: "-0.04em" }}
      >
        B
      </text>
      {/* tiny corner indicator */}
      <circle cx="50" cy="6" r="2.5" fill={inkLight} opacity="0.6" />
    </svg>
  );
}

function ChevronMark({ variant, size, avatar = false }: { variant: "dark" | "light"; size: number; avatar?: boolean }) {
  // Renders ›_ — chevron + cursor underline
  const accent = ACCENT;
  const ink = variant === "dark" ? "#E8ECF5" : "#070A14";
  const w = avatar ? 100 : 100;
  const h = avatar ? 100 : 70;
  return (
    <svg width={size} height={(size * h) / w} viewBox={`0 0 ${w} ${h}`} aria-hidden style={{ filter: variant === "dark" ? `drop-shadow(0 0 16px ${ACCENT_GLOW})` : "none" }}>
      {avatar ? (
        <>
          {/* Chevron centered */}
          <path
            d="M 30 28 L 58 50 L 30 72"
            stroke={accent}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cursor bar */}
          <rect x="62" y="66" width="20" height="6" rx="2" fill={ink} />
        </>
      ) : (
        <>
          <path
            d="M 18 18 L 42 35 L 18 52"
            stroke={accent}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="48" y="46" width="22" height="5" rx="2" fill={ink} />
        </>
      )}
    </svg>
  );
}

function StackedB({ variant, size }: { variant: "dark" | "light"; size: number }) {
  const accent = ACCENT;
  const accentDeep = "#2D5DDB";
  const accentBright = "#6E94FF";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ filter: variant === "dark" ? `drop-shadow(0 0 18px ${ACCENT_GLOW})` : "none" }}>
      {/* Back plate */}
      <rect x="14" y="14" width="68" height="68" rx="10" fill={accentDeep} opacity="0.65" />
      {/* Mid plate offset */}
      <rect x="20" y="20" width="68" height="68" rx="10" fill={accent} opacity="0.85" />
      {/* Front plate with B */}
      <rect x="26" y="26" width="68" height="68" rx="10" fill={accentBright} />
      <text
        x="60"
        y="80"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="56"
        fontWeight="900"
        fill="#070A14"
        style={{ letterSpacing: "-0.05em" }}
      >
        B
      </text>
    </svg>
  );
}

function SlicedSigil({ variant, size }: { variant: "dark" | "light"; size: number }) {
  const ink = variant === "dark" ? "#E8ECF5" : "#070A14";
  const accent = ACCENT;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ filter: variant === "dark" ? `drop-shadow(0 0 18px ${ACCENT_GLOW})` : "none" }}>
      <defs>
        <clipPath id="slice-top">
          <polygon points="0,0 100,0 100,40 0,75" />
        </clipPath>
        <clipPath id="slice-bottom">
          <polygon points="0,75 100,40 100,100 0,100" />
        </clipPath>
      </defs>
      {/* Top half — solid blue */}
      <g clipPath="url(#slice-top)">
        <rect x="6" y="6" width="88" height="88" rx="10" fill={accent} />
      </g>
      {/* Bottom half — outlined */}
      <g clipPath="url(#slice-bottom)">
        <rect x="6" y="6" width="88" height="88" rx="10" fill="none" stroke={ink} strokeWidth="3" />
      </g>
      {/* Frame outline overall */}
      <rect x="6" y="6" width="88" height="88" rx="10" fill="none" stroke={accent} strokeWidth="2" opacity="0.6" />
      {/* Slice line */}
      <line x1="6" y1="75" x2="94" y2="40" stroke={accent} strokeWidth="2" />
      {/* B — split treatment */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="50"
        fontWeight="900"
        fill={variant === "dark" ? "#070A14" : "#FFFFFF"}
        style={{ letterSpacing: "-0.05em" }}
      >
        B
      </text>
    </svg>
  );
}
