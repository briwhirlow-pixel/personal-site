import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Lab — pick a direction",
  robots: { index: false, follow: false },
};

export default function DesignLab() {
  return (
    <main style={{ background: "#1a1a1a" }}>
      <Intro />
      <IndieStudioTile />
      <SwissTile />
      <FriendlyTile />
      <NoirTile />
      <Outro />
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* INTRO                                                                */
/* ──────────────────────────────────────────────────────────────────── */

function Intro() {
  return (
    <section
      style={{
        background: "#0E0F12",
        color: "#F0F0F0",
        padding: "80px 0 60px",
        fontFamily: "var(--font-outfit), system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 16,
          }}
        >
          ✦ Internal preview · Not indexed · Four directions
        </p>
        <h1
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "clamp(48px, 7vw, 88px)",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            margin: 0,
          }}
        >
          Pick a direction.
          <span style={{ fontStyle: "italic", color: "#A8B5C8" }}> Then we build.</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: "#A8B5C8",
            maxWidth: 640,
            marginTop: 24,
          }}
        >
          Four complete aesthetic directions for BuiltByBrian, each rendered with
          its actual fonts, colors, and signature design details. Scroll through.
          Tell me which number resonates and I'll build the entire site in that
          direction.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* 01 — INDIE STUDIO                                                    */
/* ──────────────────────────────────────────────────────────────────── */

function IndieStudioTile() {
  const palette = {
    paper: "#F6F4ED",
    paperSoft: "#ECE7D8",
    ink: "#1A1814",
    inkSoft: "#4A4540",
    inkMuted: "#807A6E",
    rule: "#D5D0C0",
    forest: "#2E5A47",
    forestDeep: "#1E3D2F",
    clay: "#C75D3B",
    butter: "#F4D78C",
  };

  return (
    <article style={{ background: palette.paper, color: palette.ink, position: "relative", overflow: "hidden" }}>
      <DirectionHeader id="01" name="Indie Studio" textColor={palette.inkMuted} ruleColor={palette.rule} />

      {/* Mini hero */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 32px 80px",
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Editorial meta strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingBottom: 16,
            borderBottom: `1px solid ${palette.rule}`,
            marginBottom: 56,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: palette.inkMuted,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ color: palette.clay, fontSize: 12 }}>✦</span>
            Studio of one · Philadelphia / South Jersey
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10.5,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: palette.inkMuted,
            }}
          >
            Issue 001 / Home
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,8fr) minmax(0,4fr)", gap: 48, alignItems: "start" }}>
          {/* Headline column */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-instrument), serif",
                fontSize: "clamp(56px, 9vw, 120px)",
                lineHeight: 0.92,
                letterSpacing: "-0.025em",
                fontWeight: 400,
                margin: 0,
              }}
            >
              Small business
              <br />
              websites,
              <br />
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ fontStyle: "italic" }}>built like they</span>
                <br />
                <span style={{ fontStyle: "italic" }}>matter.</span>
                <WavyUnderline color={palette.clay} />
              </span>
            </h2>

            <p
              style={{
                fontSize: 19,
                lineHeight: 1.55,
                color: palette.inkSoft,
                maxWidth: 560,
                marginTop: 48,
              }}
            >
              I design and build websites for restaurants, shops, studios, and the
              local businesses that put their name on the door.{" "}
              <span style={{ color: palette.ink, fontWeight: 500 }}>
                Five-day first drafts. One person, start to finish.
              </span>
            </p>

            <div style={{ display: "flex", gap: 28, alignItems: "center", marginTop: 40, flexWrap: "wrap" }}>
              <a
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: palette.forest,
                  color: palette.paper,
                  padding: "16px 28px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  boxShadow: `0 8px 24px -8px ${palette.forest}80`,
                }}
              >
                Start a project
                <span aria-hidden>↗</span>
              </a>
              <a
                style={{
                  color: palette.ink,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: `1px solid ${palette.ink}40`,
                  paddingBottom: 2,
                }}
              >
                See selected work →
              </a>
            </div>
          </div>

          {/* Studio card */}
          <div style={{ position: "relative" }}>
            {/* Forest accent backdrop, rotated */}
            <div
              style={{
                position: "absolute",
                inset: -8,
                background: palette.forest,
                borderRadius: 6,
                transform: "rotate(-1.5deg)",
              }}
              aria-hidden
            />

            {/* Card */}
            <div
              style={{
                position: "relative",
                background: palette.paperSoft,
                border: `1px solid ${palette.rule}`,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {/* Photo placeholder — illustrative */}
              <div
                style={{
                  aspectRatio: "3 / 4",
                  background: `linear-gradient(135deg, ${palette.forest}, ${palette.forestDeep})`,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: palette.butter,
                }}
              >
                {/* Monogram mark */}
                <span
                  style={{
                    fontFamily: "var(--font-instrument), serif",
                    fontSize: 140,
                    fontStyle: "italic",
                    lineHeight: 1,
                    opacity: 0.92,
                  }}
                >
                  B
                </span>
                {/* Sparkle accent */}
                <span style={{ position: "absolute", top: 24, right: 28, color: palette.butter, fontSize: 24 }}>✦</span>
                <span style={{ position: "absolute", bottom: 28, left: 24, color: palette.clay, fontSize: 14 }}>✦</span>
              </div>

              <div style={{ padding: 22, borderTop: `1px solid ${palette.rule}` }}>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9.5,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: palette.inkMuted,
                    margin: 0,
                  }}
                >
                  The designer
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-instrument), serif",
                    fontSize: 30,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    margin: "6px 0 0",
                  }}
                >
                  Brian <span style={{ fontStyle: "italic" }}>Whirlow</span>
                </p>
                <p style={{ fontSize: 13, color: palette.inkSoft, margin: "4px 0 0" }}>Designer & Developer</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: palette.clay, display: "inline-block" }} aria-hidden />
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: palette.inkMuted,
                    }}
                  >
                    Now accepting — limited spots
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip — oversized serif numbers */}
        <div
          style={{
            marginTop: 80,
            paddingTop: 32,
            borderTop: `1px solid ${palette.rule}`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {[
            { label: "First draft", value: "5", unit: "days", color: palette.forest },
            { label: "Client rating", value: "5.0", unit: "★", color: palette.butter },
            { label: "Starting at", value: "$750", unit: "", color: palette.clay },
          ].map((s) => (
            <div key={s.label}>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: palette.inkMuted,
                  margin: 0,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-instrument), serif",
                  fontSize: 56,
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  margin: "10px 0 0",
                }}
              >
                <span style={{ color: s.color }}>{s.value}</span>
                {s.unit && <span style={{ color: palette.inkSoft, fontSize: 32, marginLeft: 6 }}>{s.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <DirectionFooter
        bg={palette.paperSoft}
        textColor={palette.ink}
        mutedColor={palette.inkMuted}
        ruleColor={palette.rule}
        palette={[
          { name: "Paper", hex: palette.paper },
          { name: "Forest", hex: palette.forest },
          { name: "Clay", hex: palette.clay },
          { name: "Butter", hex: palette.butter },
          { name: "Ink", hex: palette.ink },
        ]}
        fonts={[
          { role: "Display", name: "Instrument Serif (italic)" },
          { role: "Body", name: "Outfit (geometric humanist)" },
          { role: "Mono", name: "JetBrains Mono" },
        ]}
        notAi="Warm distinct palette (forest green is rare in tech). Editorial italic serif. Hand-drawn clay underline. Magazine asymmetric layout. Real photo zone with stylized accent backdrop."
      />
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* 02 — SWISS MODERNIST                                                 */
/* ──────────────────────────────────────────────────────────────────── */

function SwissTile() {
  const palette = {
    white: "#FFFFFF",
    paper: "#FAFAFA",
    ink: "#0A0A0A",
    inkSoft: "#3A3A3A",
    inkMuted: "#888888",
    rule: "#E5E5E5",
    signal: "#FF5500",
  };

  return (
    <article style={{ background: palette.white, color: palette.ink, position: "relative" }}>
      <DirectionHeader id="02" name="Swiss Modernist" textColor={palette.inkMuted} ruleColor={palette.rule} />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 32px 80px",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          position: "relative",
        }}
      >
        {/* Top bar — grid index */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            paddingBottom: 16,
            borderBottom: `2px solid ${palette.ink}`,
            marginBottom: 56,
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span style={{ gridColumn: "span 4" }}>Brian Whirlow / Web Design</span>
          <span style={{ gridColumn: "span 4", textAlign: "center", color: palette.inkMuted }}>2024–2026</span>
          <span style={{ gridColumn: "span 4", textAlign: "right" }}>
            <span style={{ color: palette.signal }}>●</span> 01 / 01
          </span>
        </div>

        {/* Massive type headline */}
        <h2
          style={{
            fontFamily: "var(--font-archivo-black), system-ui, sans-serif",
            fontSize: "clamp(72px, 12vw, 180px)",
            lineHeight: 0.85,
            letterSpacing: "-0.045em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Built for
          <br />
          small <span style={{ color: palette.signal }}>business.</span>
          <br />
          Nothing more.
        </h2>

        {/* Grid below */}
        <div
          style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Body */}
          <div style={{ gridColumn: "span 6", fontFamily: "var(--font-outfit), system-ui, sans-serif" }}>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: palette.inkSoft, margin: 0 }}>
              Websites for restaurants, shops, studios, and service businesses.
              Designed and built by one person. Five-day first drafts. No
              templates, no fluff.
            </p>

            <div style={{ marginTop: 32, display: "flex", gap: 24, alignItems: "center" }}>
              <a
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: palette.ink,
                  color: palette.white,
                  padding: "16px 28px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                <span style={{ color: palette.signal }}>●</span>
                Start a project →
              </a>
              <a
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: palette.ink,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderBottom: `2px solid ${palette.ink}`,
                  paddingBottom: 2,
                }}
              >
                ↗ Selected work
              </a>
            </div>
          </div>

          {/* Right meta grid */}
          <div style={{ gridColumn: "span 6" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 13,
              }}
            >
              <tbody>
                {[
                  ["First draft", "5 days"],
                  ["Client rating", "5.0 / 5"],
                  ["Starting at", "$750"],
                  ["Built by", "One person"],
                  ["Location", "Philadelphia, NJ"],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: `1px solid ${palette.rule}` }}>
                    <td style={{ padding: "12px 0", color: palette.inkMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 11 }}>{k}</td>
                    <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DirectionFooter
        bg={palette.paper}
        textColor={palette.ink}
        mutedColor={palette.inkMuted}
        ruleColor={palette.rule}
        palette={[
          { name: "White", hex: palette.white },
          { name: "Ink", hex: palette.ink },
          { name: "Signal", hex: palette.signal },
        ]}
        fonts={[
          { role: "Display", name: "Archivo Black (ultra-heavy)" },
          { role: "Body", name: "Outfit" },
          { role: "Mono / UI", name: "JetBrains Mono" },
        ]}
        notAi="Brutal type-driven restraint. Three colors only. Type IS the design. One orange used surgically. Looks like a Pentagram or Studio Lin portfolio."
      />
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* 03 — FRIENDLY MAXIMALIST                                             */
/* ──────────────────────────────────────────────────────────────────── */

function FriendlyTile() {
  const palette = {
    cream: "#FAF7F0",
    creamDeep: "#F0EBDC",
    ink: "#1F1A14",
    inkSoft: "#4A453E",
    inkMuted: "#9C9586",
    yellow: "#FFD23F",
    magenta: "#E847A9",
    blue: "#4361EE",
    green: "#06D6A0",
  };

  return (
    <article style={{ background: palette.cream, color: palette.ink, position: "relative", overflow: "hidden" }}>
      <DirectionHeader id="03" name="Friendly Maximalist" textColor={palette.inkMuted} ruleColor={`${palette.ink}20`} />

      {/* Decorative blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 80,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
          background: palette.yellow,
          opacity: 0.6,
          filter: "blur(0px)",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 60,
          left: -80,
          width: 240,
          height: 240,
          borderRadius: "50% 60% 50% 40% / 40% 50% 60% 50%",
          background: palette.magenta,
          opacity: 0.35,
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 32px 80px",
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top sticker bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                background: palette.green,
                color: palette.ink,
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ● Available now
            </span>
            <span
              style={{
                background: palette.blue,
                color: palette.cream,
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ✦ Studio of one
            </span>
          </div>
          <span style={{ fontSize: 13, color: palette.inkSoft }}>Phila / NJ — 2026</span>
        </div>

        {/* Massive playful headline */}
        <h2
          style={{
            fontFamily: "var(--font-bricolage), system-ui, sans-serif",
            fontSize: "clamp(64px, 10vw, 140px)",
            lineHeight: 0.92,
            letterSpacing: "-0.035em",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Small business
          <br />
          websites <span style={{ color: palette.blue }}>that</span>
          <br />
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ fontStyle: "italic", color: palette.magenta }}>actually feel</span>
            <ScribbleUnderline color={palette.yellow} />
          </span>
          <br />
          <span style={{ color: palette.green }}>like yours.</span>
        </h2>

        <p style={{ fontSize: 19, lineHeight: 1.55, color: palette.inkSoft, maxWidth: 580, marginTop: 40 }}>
          I build websites for small businesses with{" "}
          <span style={{ background: palette.yellow, padding: "2px 6px", color: palette.ink, fontWeight: 600 }}>
            real personality
          </span>
          . No templates, no AI slop, no boring blue gradients. Five-day first drafts, every time.
        </p>

        <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 40, flexWrap: "wrap" }}>
          <a
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: palette.ink,
              color: palette.cream,
              padding: "18px 32px",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              border: `3px solid ${palette.ink}`,
              boxShadow: `6px 6px 0 ${palette.magenta}`,
            }}
          >
            Start a project →
          </a>
          <a
            style={{
              background: palette.cream,
              color: palette.ink,
              padding: "18px 28px",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              border: `3px solid ${palette.ink}`,
              boxShadow: `6px 6px 0 ${palette.yellow}`,
            }}
          >
            See selected work
          </a>
        </div>

        {/* Sticker stats */}
        <div style={{ display: "flex", gap: 16, marginTop: 64, flexWrap: "wrap" }}>
          {[
            { label: "FIRST DRAFT", value: "5 days", bg: palette.yellow, ink: palette.ink },
            { label: "CLIENT RATING", value: "5.0 ★", bg: palette.magenta, ink: palette.cream },
            { label: "STARTING AT", value: "$750", bg: palette.blue, ink: palette.cream },
            { label: "PERSON", value: "Just me", bg: palette.green, ink: palette.ink },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: s.bg,
                color: s.ink,
                padding: "16px 22px",
                borderRadius: 16,
                border: `3px solid ${palette.ink}`,
                boxShadow: `4px 4px 0 ${palette.ink}`,
                transform: `rotate(${(Math.random() - 0.5) * 2}deg)`,
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", margin: 0, opacity: 0.85 }}>{s.label}</p>
              <p
                style={{
                  fontFamily: "var(--font-bricolage), system-ui, sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  margin: "4px 0 0",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <DirectionFooter
        bg={palette.creamDeep}
        textColor={palette.ink}
        mutedColor={palette.inkMuted}
        ruleColor={`${palette.ink}20`}
        palette={[
          { name: "Cream", hex: palette.cream },
          { name: "Yellow", hex: palette.yellow },
          { name: "Magenta", hex: palette.magenta },
          { name: "Blue", hex: palette.blue },
          { name: "Green", hex: palette.green },
          { name: "Ink", hex: palette.ink },
        ]}
        fonts={[
          { role: "Display", name: "Bricolage Grotesque (variable, quirky)" },
          { role: "Body", name: "Outfit (humanist)" },
        ]}
        notAi="Multiple bold colors used confidently. Sticker buttons with hard offset shadows (no gradients). Highlighter background on key words. Slight tilt on stat cards. Hand-drawn squiggle. Nothing about this reads as AI-template."
      />
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* 04 — EDITORIAL NOIR                                                  */
/* ──────────────────────────────────────────────────────────────────── */

function NoirTile() {
  const palette = {
    sepia: "#1A1612",
    sepiaDeep: "#0F0C09",
    sepiaCard: "#221D17",
    cream: "#F5EFE3",
    creamSoft: "#D5CEB8",
    gold: "#D4AF37",
    goldDeep: "#A8861E",
    rust: "#C7593B",
    rule: "#3A332B",
  };

  return (
    <article style={{ background: palette.sepia, color: palette.cream, position: "relative", overflow: "hidden" }}>
      <DirectionHeader id="04" name="Editorial Noir" textColor={palette.creamSoft} ruleColor={palette.rule} />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 32px 80px",
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Editorial header — ornament + name */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ flex: 1, height: 1, background: palette.rule, maxWidth: 140 }} />
            <span style={{ color: palette.gold, fontSize: 16 }}>✦</span>
            <span style={{ flex: 1, height: 1, background: palette.rule, maxWidth: 140 }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: palette.creamSoft,
              margin: 0,
            }}
          >
            Brian Whirlow · Est. 2024 · Philadelphia
          </p>
        </div>

        {/* Centered editorial headline */}
        <h2
          style={{
            fontFamily: "var(--font-eb-garamond), serif",
            fontSize: "clamp(64px, 10vw, 144px)",
            lineHeight: 0.95,
            letterSpacing: "-0.015em",
            fontWeight: 400,
            margin: 0,
            textAlign: "center",
          }}
        >
          The websites
          <br />
          small businesses
          <br />
          <span style={{ fontStyle: "italic", color: palette.gold }}>deserve.</span>
        </h2>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: palette.creamSoft,
            maxWidth: 600,
            margin: "48px auto 0",
            textAlign: "center",
          }}
        >
          A studio of one, designing and building websites by hand for
          restaurants, shops, studios, and the local businesses that put their
          name on the door.
        </p>

        <div style={{ display: "flex", gap: 28, justifyContent: "center", alignItems: "center", marginTop: 48, flexWrap: "wrap" }}>
          <a
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: "transparent",
              color: palette.cream,
              padding: "16px 32px",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              border: `1px solid ${palette.gold}`,
            }}
          >
            <span style={{ color: palette.gold }}>—</span>
            Start a project
            <span style={{ color: palette.gold }}>—</span>
          </a>
          <a
            style={{
              fontFamily: "var(--font-eb-garamond), serif",
              color: palette.creamSoft,
              fontSize: 16,
              fontStyle: "italic",
              textDecoration: "none",
              borderBottom: `1px solid ${palette.gold}80`,
              paddingBottom: 2,
            }}
          >
            See selected work →
          </a>
        </div>

        {/* Folio stats — centered editorial */}
        <div
          style={{
            marginTop: 96,
            paddingTop: 32,
            borderTop: `1px solid ${palette.rule}`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {[
            { label: "First draft", value: "Five days" },
            { label: "Client rating", value: "Five point oh" },
            { label: "Starting at", value: "$750" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: palette.creamSoft,
                  margin: 0,
                  opacity: 0.7,
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-eb-garamond), serif",
                  fontStyle: "italic",
                  fontSize: 38,
                  lineHeight: 1.1,
                  color: palette.gold,
                  margin: "10px 0 0",
                  fontWeight: 400,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <DirectionFooter
        bg={palette.sepiaCard}
        textColor={palette.cream}
        mutedColor={palette.creamSoft}
        ruleColor={palette.rule}
        palette={[
          { name: "Sepia", hex: palette.sepia },
          { name: "Cream", hex: palette.cream },
          { name: "Gold", hex: palette.gold },
          { name: "Rust", hex: palette.rust },
        ]}
        fonts={[
          { role: "Display", name: "EB Garamond (italic emphasis)" },
          { role: "Body", name: "Outfit" },
          { role: "Mono", name: "JetBrains Mono" },
        ]}
        notAi="Warm sepia black (not blue-black) is rare. Gold + italic Garamond reads as restaurant menu / art gallery — premium without being cold. Centered editorial composition is uncommon in tech. Spelled-out numerals ('Five days') feel hand-set."
      />
    </article>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* OUTRO                                                                */
/* ──────────────────────────────────────────────────────────────────── */

function Outro() {
  return (
    <section
      style={{
        background: "#0E0F12",
        color: "#F0F0F0",
        padding: "80px 0",
        fontFamily: "var(--font-outfit), system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 16,
          }}
        >
          Next step
        </p>
        <h2
          style={{
            fontFamily: "var(--font-instrument), serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Tell me which number resonates.
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.55, color: "#A8B5C8", maxWidth: 580, marginTop: 24 }}>
          Say <span style={{ color: "#fff" }}>"go with 01"</span> (or whichever) and I'll lock the
          direction, then rebuild every page — Hero, Services, About, Reviews, Contact, Footer — in
          that aesthetic. We can also talk through the photo plan: a real photo, an illustrated
          alternative, or designing photo-free.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* Shared primitives                                                    */
/* ──────────────────────────────────────────────────────────────────── */

function DirectionHeader({ id, name, textColor, ruleColor }: { id: string; name: string; textColor: string; ruleColor: string }) {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "48px 32px 0",
        fontFamily: "var(--font-jetbrains-mono), monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          paddingBottom: 12,
          borderBottom: `1px solid ${ruleColor}`,
        }}
      >
        <p style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: textColor, margin: 0 }}>
          Direction {id} — {name}
        </p>
        <p style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: textColor, margin: 0 }}>
          0{id} / 04
        </p>
      </div>
    </div>
  );
}

function DirectionFooter({
  bg,
  textColor,
  mutedColor,
  ruleColor,
  palette,
  fonts,
  notAi,
}: {
  bg: string;
  textColor: string;
  mutedColor: string;
  ruleColor: string;
  palette: { name: string; hex: string }[];
  fonts: { role: string; name: string }[];
  notAi: string;
}) {
  return (
    <div style={{ background: bg, borderTop: `1px solid ${ruleColor}`, padding: "32px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr", gap: 40 }}>
        {/* Palette */}
        <div>
          <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: mutedColor, margin: 0 }}>
            Palette
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {palette.map((p) => (
              <div key={p.name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 28, height: 28, background: p.hex, borderRadius: 3, border: `1px solid ${ruleColor}` }} />
                <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 8, color: mutedColor, margin: "6px 0 0", letterSpacing: "0.08em" }}>
                  {p.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div>
          <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: mutedColor, margin: 0 }}>
            Typography
          </p>
          <div style={{ marginTop: 12 }}>
            {fonts.map((f) => (
              <p key={f.role} style={{ fontSize: 12, color: textColor, margin: "2px 0", fontFamily: "var(--font-outfit), system-ui, sans-serif" }}>
                <span style={{ color: mutedColor, marginRight: 8 }}>{f.role}</span>
                {f.name}
              </p>
            ))}
          </div>
        </div>

        {/* Why not AI */}
        <div>
          <p style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: mutedColor, margin: 0 }}>
            Why this doesn't read as AI
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.5, color: textColor, margin: "12px 0 0", fontFamily: "var(--font-outfit), system-ui, sans-serif" }}>
            {notAi}
          </p>
        </div>
      </div>
    </div>
  );
}

function WavyUnderline({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      style={{ position: "absolute", left: 0, right: 0, bottom: -8, width: "100%", height: 12 }}
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
    >
      <path
        d="M 2 6 Q 50 1 100 6 T 200 6 T 300 6 T 398 6"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScribbleUnderline({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      style={{ position: "absolute", left: -4, right: -4, bottom: -10, width: "calc(100% + 8px)", height: 14 }}
      viewBox="0 0 400 14"
      preserveAspectRatio="none"
    >
      <path
        d="M 2 8 Q 30 2 60 8 T 120 8 Q 150 13 180 7 T 240 8 Q 270 2 300 8 T 398 8"
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
