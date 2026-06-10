import { ImageResponse } from "next/og";
import { igPosts } from "@/lib/igPosts";

export const runtime = "edge";

async function loadGoogleFont(query: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?${query}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('([^']+)'\)/);
  if (!match) throw new Error(`No font URL parsed from CSS for ${query}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to fetch font (${res.status})`);
  return res.arrayBuffer();
}

type Palette = {
  bg: string;
  bgGradient?: string;
  ink: string;
  inkSoft: string;
  inkMuted: string;
  accent: string;
  italicAccent: string;
  chipBg: string;
  chipText: string;
  ruleColor: string;
  numBg: string;
  numText: string;
};

function getPalette(variant: string): Palette {
  switch (variant) {
    case "dark":
      return {
        bg: "#1A1A2E",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.78)",
        inkMuted: "rgba(255,255,255,0.6)",
        accent: "#38BDF8",
        italicAccent: "#38BDF8",
        chipBg: "rgba(255,255,255,0.14)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(255,255,255,0.18)",
        numBg: "rgba(255,255,255,0.16)",
        numText: "#FFFFFF",
      };
    case "blue":
      return {
        bg: "#2563EB",
        bgGradient: "linear-gradient(160deg, #2563EB 0%, #1E40AF 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.85)",
        inkMuted: "rgba(255,255,255,0.7)",
        accent: "#FDE047",
        italicAccent: "#FDE047",
        chipBg: "rgba(255,255,255,0.18)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(255,255,255,0.25)",
        numBg: "rgba(255,255,255,0.18)",
        numText: "#FFFFFF",
      };
    case "cream":
      return {
        bg: "#E9EDF3",
        ink: "#1A1A2E",
        inkSoft: "#475569",
        inkMuted: "#64748B",
        accent: "#2563EB",
        italicAccent: "#2563EB",
        chipBg: "rgba(37,99,235,0.1)",
        chipText: "#2563EB",
        ruleColor: "#CBD5E1",
        numBg: "rgba(37,99,235,0.12)",
        numText: "#2563EB",
      };
    case "eagles":
      return {
        bg: "#004C54",
        bgGradient: "linear-gradient(180deg, #004C54 0%, #003B40 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.86)",
        inkMuted: "rgba(255,255,255,0.65)",
        accent: "#A5ACAF",
        italicAccent: "#A5ACAF",
        chipBg: "rgba(165,172,175,0.18)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(165,172,175,0.3)",
        numBg: "rgba(165,172,175,0.2)",
        numText: "#FFFFFF",
      };
    case "phillies":
      return {
        bg: "#E81828",
        bgGradient: "linear-gradient(180deg, #E81828 0%, #B81020 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.9)",
        inkMuted: "rgba(255,255,255,0.7)",
        accent: "#FEF3C7",
        italicAccent: "#FEF3C7",
        chipBg: "rgba(255,255,255,0.18)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(255,255,255,0.28)",
        numBg: "rgba(255,255,255,0.2)",
        numText: "#FFFFFF",
      };
    case "amber":
      return {
        bg: "#F59E0B",
        bgGradient: "linear-gradient(180deg, #F59E0B 0%, #D97706 100%)",
        ink: "#1A1A2E",
        inkSoft: "rgba(26,26,46,0.82)",
        inkMuted: "rgba(26,26,46,0.6)",
        accent: "#1A1A2E",
        italicAccent: "#7C2D12",
        chipBg: "rgba(26,26,46,0.12)",
        chipText: "#1A1A2E",
        ruleColor: "rgba(26,26,46,0.22)",
        numBg: "rgba(26,26,46,0.14)",
        numText: "#1A1A2E",
      };
    case "plum":
      return {
        bg: "#6B21A8",
        bgGradient: "linear-gradient(180deg, #6B21A8 0%, #4C1D95 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.88)",
        inkMuted: "rgba(255,255,255,0.65)",
        accent: "#FCD34D",
        italicAccent: "#FCD34D",
        chipBg: "rgba(252,211,77,0.18)",
        chipText: "#FCD34D",
        ruleColor: "rgba(252,211,77,0.3)",
        numBg: "rgba(252,211,77,0.18)",
        numText: "#FCD34D",
      };
    case "ocean":
      return {
        bg: "#0B5F75",
        bgGradient: "linear-gradient(180deg, #0B5F75 0%, #1B4F66 55%, #F4C97A 100%)",
        ink: "#FFFAF1",
        inkSoft: "rgba(255,250,241,0.88)",
        inkMuted: "rgba(255,250,241,0.66)",
        accent: "#FFD58A",
        italicAccent: "#FFB85C",
        chipBg: "rgba(255,250,241,0.18)",
        chipText: "#FFFAF1",
        ruleColor: "rgba(255,250,241,0.28)",
        numBg: "rgba(255,250,241,0.2)",
        numText: "#FFFAF1",
      };
    case "citrus":
      return {
        bg: "#FF7849",
        bgGradient: "linear-gradient(180deg, #FFB45C 0%, #FF7849 50%, #E94560 100%)",
        ink: "#231016",
        inkSoft: "rgba(35,16,22,0.82)",
        inkMuted: "rgba(35,16,22,0.6)",
        accent: "#FFF1A8",
        italicAccent: "#3A1B23",
        chipBg: "rgba(35,16,22,0.12)",
        chipText: "#231016",
        ruleColor: "rgba(35,16,22,0.22)",
        numBg: "rgba(35,16,22,0.14)",
        numText: "#231016",
      };
    case "swoop":
      return {
        bg: "#013228",
        bgGradient: "linear-gradient(180deg, #013228 0%, #002820 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.9)",
        inkMuted: "rgba(255,255,255,0.7)",
        accent: "#C8C5BD",
        italicAccent: "#FFB85C",
        chipBg: "rgba(200,197,189,0.18)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(200,197,189,0.3)",
        numBg: "rgba(255,184,92,0.18)",
        numText: "#FFB85C",
      };
    case "phanatic":
      return {
        bg: "#0B2D6A",
        bgGradient: "linear-gradient(180deg, #E81828 0%, #B81020 38%, #0B2D6A 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.92)",
        inkMuted: "rgba(255,255,255,0.7)",
        accent: "#7DC242",
        italicAccent: "#FFF1A8",
        chipBg: "rgba(125,194,66,0.22)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(255,255,255,0.28)",
        numBg: "rgba(125,194,66,0.22)",
        numText: "#FFFFFF",
      };
    case "webslinger":
      return {
        bg: "#0A1A3A",
        bgGradient: "linear-gradient(160deg, #0A1A3A 0%, #1A0F2E 55%, #B0151E 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.9)",
        inkMuted: "rgba(255,255,255,0.66)",
        accent: "#FF3B47",
        italicAccent: "#56B0FF",
        chipBg: "rgba(255,59,71,0.22)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(255,255,255,0.24)",
        numBg: "rgba(86,176,255,0.22)",
        numText: "#56B0FF",
      };
    case "starter":
      return {
        bg: "#0A1F44",
        bgGradient: "linear-gradient(180deg, #FFD93D 0%, #FFCB05 14%, #2A75BB 32%, #0A1F44 78%, #0A1F44 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.92)",
        inkMuted: "rgba(255,255,255,0.7)",
        accent: "#FF1B1B",
        italicAccent: "#FFD93D",
        chipBg: "rgba(255,217,61,0.22)",
        chipText: "#FFD93D",
        ruleColor: "rgba(255,217,61,0.42)",
        numBg: "rgba(255,27,27,0.28)",
        numText: "#FFD93D",
      };
    case "studio":
    default:
      return {
        bg: "#FFFFFF",
        bgGradient: "linear-gradient(180deg, #FFFFFF 0%, #E9EDF3 100%)",
        ink: "#1A1A2E",
        inkSoft: "#475569",
        inkMuted: "#64748B",
        accent: "#2563EB",
        italicAccent: "#2563EB",
        chipBg: "rgba(37,99,235,0.1)",
        chipText: "#2563EB",
        ruleColor: "#E2E8F0",
        numBg: "rgba(37,99,235,0.12)",
        numText: "#2563EB",
      };
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = igPosts.find((p) => p.id === id);

  if (!post) {
    return new Response(`Post ${id} not found`, { status: 404 });
  }

  // Slide handling: cover is slide 1; spotlight slides are 2..(numList+1); CTA is last
  const reqUrl = new URL(req.url);
  const totalSlides = post.numList ? post.numList.length + 2 : 1;
  const slideRaw = parseInt(reqUrl.searchParams.get("slide") || "1", 10);
  const slideNum = Math.max(1, Math.min(totalSlides, isNaN(slideRaw) ? 1 : slideRaw));
  const isCover = slideNum === 1;
  const isClosing = slideNum === totalSlides && totalSlides > 1;
  const spotlightIdx = !isCover && !isClosing ? slideNum - 2 : -1;
  const spotlightItem = spotlightIdx >= 0 && post.numList ? post.numList[spotlightIdx] : null;

  const origin = reqUrl.origin;
  const bottomImageSrc = post.bottomImage
    ? (post.bottomImage.src.startsWith("http")
        ? post.bottomImage.src
        : `${origin}${post.bottomImage.src}`)
    : null;

  const [instrumentRegular, instrumentItalic, outfitMedium, outfitBold, jetbrainsMono] =
    await Promise.all([
      loadGoogleFont("family=Instrument+Serif"),
      loadGoogleFont("family=Instrument+Serif:ital@1"),
      loadGoogleFont("family=Outfit:wght@500"),
      loadGoogleFont("family=Outfit:wght@700"),
      loadGoogleFont("family=JetBrains+Mono:wght@600"),
    ]);

  const p = getPalette(post.variant);

  // Layout constants for 1080x1350 canvas
  const PAD_X = 80;
  const PAD_Y = 70;

  const responseOpts = {
    width: 1080,
    height: 1350,
    fonts: [
      { name: "Instrument Serif", data: instrumentRegular, weight: 400 as const, style: "normal" as const },
      { name: "Instrument Serif", data: instrumentItalic, weight: 400 as const, style: "italic" as const },
      { name: "Outfit", data: outfitMedium, weight: 500 as const, style: "normal" as const },
      { name: "Outfit", data: outfitBold, weight: 700 as const, style: "normal" as const },
      { name: "JetBrains Mono", data: jetbrainsMono, weight: 600 as const, style: "normal" as const },
    ],
    headers: {
      "Content-Disposition": `inline; filename="builtbybrian-ig-post-${id}-slide-${slideNum}.png"`,
      "Cache-Control": "public, max-age=600",
    },
  };

  // ─── SPOTLIGHT SLIDE — one numList item, big ─────────────────
  if (spotlightItem) {
    const slideLabel = `${String(slideNum).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: p.bgGradient ?? p.bg,
            color: p.ink,
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
          }}
        >
          {/* TOP ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: p.inkMuted,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  background: p.accent,
                  marginRight: 14,
                  display: "flex",
                }}
              />
              {post.topLeftLabel}
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: p.inkMuted,
                fontWeight: 600,
                display: "flex",
              }}
            >
              {slideLabel}
            </div>
          </div>

          {/* SPOTLIGHT BODY */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* HUGE number */}
            <div
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 260,
                lineHeight: 0.9,
                color: p.italicAccent,
                fontStyle: "italic",
                letterSpacing: -6,
                marginBottom: 8,
                display: "flex",
              }}
            >
              {spotlightItem.n}
            </div>
            {/* Tip text */}
            <div
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 88,
                lineHeight: 1.04,
                letterSpacing: -2.2,
                color: p.ink,
                maxWidth: 880,
                display: "flex",
              }}
            >
              {spotlightItem.text}
            </div>
          </div>

          {/* BOTTOM ROW — same monitor logo + swipe */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 24,
              borderTop: `1px solid ${p.ruleColor}`,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "#1A1A2E",
                  borderRadius: 9,
                  padding: 4,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 6,
                    padding: "8px 16px 7px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 8,
                        background: "#2563EB",
                        display: "flex",
                        marginRight: 8,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        fontFamily: "Instrument Serif",
                        fontSize: 30,
                        color: "#1A1A2E",
                        lineHeight: 1,
                      }}
                    >
                      <div style={{ display: "flex" }}>Built</div>
                      <div
                        style={{
                          fontStyle: "italic",
                          color: "#0EA5E9",
                          padding: "0 2px",
                          display: "flex",
                        }}
                      >
                        by
                      </div>
                      <div style={{ display: "flex" }}>Brian</div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 9,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      color: "#64748B",
                      fontWeight: 600,
                      marginTop: 5,
                      display: "flex",
                    }}
                  >
                    Web Design
                  </div>
                </div>
              </div>
              <div style={{ width: 16, height: 4, background: "#1A1A2E", marginTop: 1, display: "flex" }} />
              <div style={{ width: 42, height: 3, background: "#1A1A2E", borderRadius: 4, marginTop: 1, display: "flex" }} />
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: p.inkMuted,
                fontWeight: 600,
                display: "flex",
              }}
            >
              Swipe
              <div style={{ marginLeft: 10, display: "flex" }}>→</div>
            </div>
          </div>
        </div>
      ),
      responseOpts
    );
  }

  // ─── CLOSING CTA SLIDE — last slide of a carousel ────────────
  if (isClosing) {
    const slideLabel = `${String(slideNum).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: p.bgGradient ?? p.bg,
            color: p.ink,
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
          }}
        >
          {/* TOP */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: p.inkMuted,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  background: p.accent,
                  marginRight: 14,
                  display: "flex",
                }}
              />
              YOUR MOVE
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: p.inkMuted,
                fontWeight: 600,
                display: "flex",
              }}
            >
              {slideLabel}
            </div>
          </div>

          {/* BODY */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 20,
                letterSpacing: 4.4,
                textTransform: "uppercase",
                color: p.inkMuted,
                fontWeight: 600,
                marginBottom: 24,
                display: "flex",
              }}
            >
              READY WHEN YOU ARE
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 26 }}>
              <div
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 110,
                  lineHeight: 1,
                  letterSpacing: -3,
                  color: p.ink,
                  display: "flex",
                }}
              >
                Let&apos;s
              </div>
              <div
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 110,
                  lineHeight: 1,
                  letterSpacing: -3,
                  color: p.italicAccent,
                  fontStyle: "italic",
                  display: "flex",
                }}
              >
                build it.
              </div>
            </div>
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: 28,
                lineHeight: 1.5,
                color: p.inkSoft,
                fontWeight: 500,
                maxWidth: 820,
                marginBottom: 28,
                display: "flex",
              }}
            >
              Free 30-min discovery call. No hard sell. Just see if we&apos;re a fit.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {["DM TO START", "LINK IN BIO", "5-DAY DRAFT"].map((t) => (
                <div
                  key={t}
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 17,
                    letterSpacing: 1.8,
                    background: p.chipBg,
                    color: p.chipText,
                    padding: "10px 16px",
                    borderRadius: 5,
                    marginRight: 10,
                    marginBottom: 10,
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM — monitor logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 24,
              borderTop: `1px solid ${p.ruleColor}`,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  background: "#1A1A2E",
                  borderRadius: 9,
                  padding: 4,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 6,
                    padding: "8px 16px 7px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 8,
                        background: "#2563EB",
                        display: "flex",
                        marginRight: 8,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        fontFamily: "Instrument Serif",
                        fontSize: 30,
                        color: "#1A1A2E",
                        lineHeight: 1,
                      }}
                    >
                      <div style={{ display: "flex" }}>Built</div>
                      <div
                        style={{
                          fontStyle: "italic",
                          color: "#0EA5E9",
                          padding: "0 2px",
                          display: "flex",
                        }}
                      >
                        by
                      </div>
                      <div style={{ display: "flex" }}>Brian</div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 9,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      color: "#64748B",
                      fontWeight: 600,
                      marginTop: 5,
                      display: "flex",
                    }}
                  >
                    Web Design
                  </div>
                </div>
              </div>
              <div style={{ width: 16, height: 4, background: "#1A1A2E", marginTop: 1, display: "flex" }} />
              <div style={{ width: 42, height: 3, background: "#1A1A2E", borderRadius: 4, marginTop: 1, display: "flex" }} />
            </div>
            <div
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: p.inkMuted,
                fontWeight: 600,
                display: "flex",
              }}
            >
              {post.cta}
            </div>
          </div>
        </div>
      ),
      responseOpts
    );
  }

  // ─── MONITOR LAYOUT — special intro post w/ Philly photo ─────
  if (post.customLayout === "monitor") {
    const skylineUrl = `${origin}/images/philly-skyline-new.jpg`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "70px 50px",
            backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.25) 0%, rgba(15,23,42,0.55) 100%), url(${skylineUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            fontFamily: "Outfit",
          }}
        >
            {/* MONITOR */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
            {/* Bezel */}
            <div
              style={{
                background: "#1A1A2E",
                borderRadius: 28,
                padding: 22,
                display: "flex",
              }}
            >
              {/* Screen */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 14,
                  padding: "60px 64px 50px",
                  display: "flex",
                  flexDirection: "column",
                  width: 860,
                  height: 780,
                }}
              >
                {/* Centered body */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Title — centered */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 30 }}>
                    {post.titleLines.map((line, i) => (
                      <div
                        key={i}
                        style={{
                          fontFamily: "Instrument Serif",
                          fontSize: 96,
                          lineHeight: 1.02,
                          letterSpacing: -2.4,
                          color: line.italic ? "#2563EB" : "#1A1A2E",
                          fontStyle: line.italic ? "italic" : "normal",
                          display: "flex",
                          textAlign: "center",
                        }}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>

                  {/* Sub — centered */}
                  {post.sub && (
                    <div
                      style={{
                        fontFamily: "Outfit",
                        fontSize: 23,
                        lineHeight: 1.5,
                        color: "#475569",
                        fontWeight: 500,
                        maxWidth: 700,
                        marginBottom: 26,
                        display: "flex",
                        textAlign: "center",
                      }}
                    >
                      {post.sub}
                    </div>
                  )}

                  {/* Tag row — centered */}
                  {post.tagRow && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {post.tagRow.map((tag, i) => (
                        <div
                          key={i}
                          style={{
                            fontFamily: "JetBrains Mono",
                            fontSize: 15,
                            letterSpacing: 1.8,
                            background: "rgba(37,99,235,0.1)",
                            color: "#2563EB",
                            padding: "9px 14px",
                            borderRadius: 5,
                            marginRight: 8,
                            marginBottom: 8,
                            fontWeight: 600,
                            display: "flex",
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom row inside screen */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: 22,
                    borderTop: "1px solid #E2E8F0",
                    marginTop: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      fontFamily: "Instrument Serif",
                      fontSize: 30,
                      color: "#1A1A2E",
                    }}
                  >
                    <div style={{ display: "flex" }}>Built</div>
                    <div
                      style={{
                        fontStyle: "italic",
                        color: "#0EA5E9",
                        padding: "0 3px",
                        display: "flex",
                      }}
                    >
                      by
                    </div>
                    <div style={{ display: "flex" }}>Brian</div>
                  </div>
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 13,
                      letterSpacing: 3.5,
                      textTransform: "uppercase",
                      color: "#64748B",
                      fontWeight: 600,
                      display: "flex",
                    }}
                  >
                    {post.cta}
                  </div>
                </div>
              </div>
            </div>

            {/* Stand neck */}
            <div
              style={{
                width: 60,
                height: 18,
                background: "#1A1A2E",
                display: "flex",
              }}
            />
            {/* Stand base */}
            <div
              style={{
                width: 220,
                height: 8,
                background: "#1A1A2E",
                borderRadius: 8,
                marginTop: 2,
                display: "flex",
              }}
            />
          </div>

          {/* BuiltbyBrian monitor logo — bottom left */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Mini monitor bezel */}
            <div
              style={{
                background: "#1A1A2E",
                borderRadius: 14,
                padding: 7,
                display: "flex",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              {/* Screen */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 9,
                  padding: "14px 24px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Wordmark */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 12,
                      background: "#2563EB",
                      display: "flex",
                      marginRight: 10,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      fontFamily: "Instrument Serif",
                      fontSize: 42,
                      color: "#1A1A2E",
                      lineHeight: 1,
                    }}
                  >
                    <div style={{ display: "flex" }}>Built</div>
                    <div style={{ fontStyle: "italic", color: "#0EA5E9", padding: "0 3px", display: "flex" }}>by</div>
                    <div style={{ display: "flex" }}>Brian</div>
                  </div>
                </div>
                {/* Tagline */}
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    color: "#64748B",
                    fontWeight: 600,
                    marginTop: 6,
                    display: "flex",
                  }}
                >
                  Web Design
                </div>
              </div>
            </div>
            {/* Mini stand */}
            <div style={{ width: 24, height: 6, background: "#1A1A2E", marginTop: 2, display: "flex" }} />
            <div style={{ width: 60, height: 5, background: "#1A1A2E", borderRadius: 6, marginTop: 1, display: "flex" }} />
          </div>
        </div>
      ),
      responseOpts
    );
  }


  // ─── STARTER TRIO LAYOUT — Pokemon post w/ characters flanking headline ───
  if (post.customLayout === "starter-trio") {
    const trioUrl = `${origin}/images/pokemon-starters.jpg`;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: p.bgGradient ?? p.bg,
            color: p.ink,
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
          }}
        >
          {/* TOP ROW — meta */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: p.accent, marginRight: 12, display: "flex" }} />
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.topLeftLabel}
              </div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* KICKER — centered */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: p.accent, fontWeight: 700, display: "flex" }}>
              {post.kicker}
            </div>
          </div>

          {/* MAIN ROW — Bulbasaur | TITLE | Charmander */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, width: "100%" }}>

            {/* Left — Bulbasaur cropped from banner */}
            <div style={{ display: "flex", width: 270, height: 460, overflow: "hidden", borderRadius: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trioUrl}
                alt="Bulbasaur"
                width={270}
                height={460}
                style={{ display: "flex", width: 270, height: 460, objectFit: "cover", objectPosition: "8% center" }}
              />
            </div>

            {/* Center — title stack */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, padding: "0 24px" }}>
              {post.titleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "Instrument Serif",
                    fontSize: 92,
                    lineHeight: 0.98,
                    letterSpacing: -2.2,
                    color: line.italic ? p.italicAccent : p.ink,
                    fontStyle: line.italic ? "italic" : "normal",
                    display: "flex",
                    textAlign: "center",
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>

            {/* Right — Charmander cropped from banner */}
            <div style={{ display: "flex", width: 270, height: 460, overflow: "hidden", borderRadius: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trioUrl}
                alt="Charmander"
                width={270}
                height={460}
                style={{ display: "flex", width: 270, height: 460, objectFit: "cover", objectPosition: "50% center" }}
              />
            </div>
          </div>

          {/* SUB — centered */}
          {post.sub && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
              <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.45, color: p.inkSoft, fontWeight: 500, textAlign: "center", maxWidth: 760, display: "flex" }}>
                {post.sub}
              </div>
            </div>
          )}

          {/* SQUIRTLE row — small centered + tagRow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 22 }}>
            <div style={{ display: "flex", width: 200, height: 180, overflow: "hidden", borderRadius: 14 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trioUrl}
                alt="Squirtle"
                width={200}
                height={180}
                style={{ display: "flex", width: 200, height: 180, objectFit: "cover", objectPosition: "92% center" }}
              />
            </div>
          </div>

          {/* TYPE CHIPS — three side by side */}
          {post.tagRow && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 18, gap: 12 }}>
              {post.tagRow.map((tag, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: p.chipText,
                    background: p.chipBg,
                    padding: "8px 14px",
                    borderRadius: 999,
                    fontWeight: 700,
                    display: "flex",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1, display: "flex" }} />

          {/* BOTTOM ROW — logo + CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 22,
              borderTop: `1px solid ${p.ruleColor}`,
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#1A1A2E", borderRadius: 9, padding: 4, display: "flex" }}>
                <div style={{ background: "#FFFFFF", borderRadius: 6, padding: "8px 16px 7px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 8, background: "#2563EB", display: "flex", marginRight: 8 }} />
                    <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Instrument Serif", fontSize: 30, color: "#1A1A2E", lineHeight: 1 }}>
                      <div style={{ display: "flex" }}>Built</div>
                      <div style={{ fontStyle: "italic", color: "#0EA5E9", padding: "0 2px", display: "flex" }}>by</div>
                      <div style={{ display: "flex" }}>Brian</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#64748B", fontWeight: 600, marginTop: 5, display: "flex" }}>
                    Web Design
                  </div>
                </div>
              </div>
              <div style={{ width: 16, height: 4, background: "#1A1A2E", marginTop: 1, display: "flex" }} />
              <div style={{ width: 42, height: 3, background: "#1A1A2E", borderRadius: 4, marginTop: 1, display: "flex" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.cta}
              </div>
              {post.ctaArrow !== false && (
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: p.accent, fontWeight: 700, marginLeft: 8, display: "flex" }}>→</div>
              )}
            </div>
          </div>
        </div>
      ),
      responseOpts
    );
  }

  // ─── SWOOP-FLEX LAYOUT — Eagles mascot posing with the headline ─────────────
  if (post.customLayout === "swoop-flex") {
    const swoopUrl = `${origin}/images/swoop.png`;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: p.bgGradient ?? p.bg,
            color: p.ink,
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* Subtle wing arc behind the composition */}
          <div
            style={{
              position: "absolute",
              top: 100,
              right: -80,
              width: 700,
              height: 700,
              borderRadius: 700,
              background: "radial-gradient(closest-side, rgba(255,184,92,0.18) 0%, rgba(255,184,92,0) 70%)",
              display: "flex",
            }}
          />

          {/* TOP META */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: p.accent, marginRight: 12, display: "flex" }} />
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.topLeftLabel}
              </div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* MAIN — two-column */}
          <div style={{ display: "flex", flex: 1, marginTop: 36, alignItems: "stretch", width: "100%" }}>

            {/* LEFT — headline column */}
            <div style={{ display: "flex", flexDirection: "column", width: 460, paddingRight: 24, justifyContent: "center" }}>
              {/* Kicker */}
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex", marginBottom: 18 }}>
                {post.kicker}
              </div>

              {/* Headline */}
              <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
                {post.titleLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "Instrument Serif",
                      fontSize: 88,
                      lineHeight: 0.96,
                      letterSpacing: -2,
                      color: line.italic ? p.italicAccent : p.ink,
                      fontStyle: line.italic ? "italic" : "normal",
                      display: "flex",
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Sub */}
              {post.sub && (
                <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.4, color: p.inkSoft, fontWeight: 500, maxWidth: 420, display: "flex", marginBottom: 22 }}>
                  {post.sub}
                </div>
              )}

              {/* Tag chips */}
              {post.tagRow && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {post.tagRow.map((tag, i) => (
                    <div
                      key={i}
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 13,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        color: p.chipText,
                        background: p.chipBg,
                        padding: "7px 14px",
                        borderRadius: 999,
                        fontWeight: 700,
                        display: "flex",
                      }}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Swoop column */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", justifyContent: "flex-end", position: "relative" }}>
              {/* Speech bubble — "FLY!" */}
              <div
                style={{
                  position: "absolute",
                  top: 30,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  background: p.italicAccent,
                  color: "#013228",
                  borderRadius: 22,
                  padding: "10px 18px",
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontSize: 36,
                  fontWeight: 500,
                  letterSpacing: -1,
                  transform: "rotate(-6deg)",
                  boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
                }}
              >
                fly!
              </div>

              {/* Directional arrow toward headline */}
              <div
                style={{
                  position: "absolute",
                  top: 110,
                  left: -20,
                  fontFamily: "JetBrains Mono",
                  fontSize: 56,
                  color: p.italicAccent,
                  fontWeight: 700,
                  transform: "rotate(165deg)",
                  display: "flex",
                }}
              >
                ↗
              </div>

              {/* Swoop image */}
              <div style={{ display: "flex", width: 500, height: 600, alignItems: "flex-end", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={swoopUrl}
                  alt="Swoop"
                  width={500}
                  height={580}
                  style={{ display: "flex", width: 500, height: 580, objectFit: "contain", objectPosition: "center bottom" }}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM ROW — logo + CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 22,
              borderTop: `1px solid ${p.ruleColor}`,
              width: "100%",
              marginTop: 12,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#1A1A2E", borderRadius: 9, padding: 4, display: "flex" }}>
                <div style={{ background: "#FFFFFF", borderRadius: 6, padding: "8px 16px 7px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 8, background: "#2563EB", display: "flex", marginRight: 8 }} />
                    <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Instrument Serif", fontSize: 30, color: "#1A1A2E", lineHeight: 1 }}>
                      <div style={{ display: "flex" }}>Built</div>
                      <div style={{ fontStyle: "italic", color: "#0EA5E9", padding: "0 2px", display: "flex" }}>by</div>
                      <div style={{ display: "flex" }}>Brian</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#64748B", fontWeight: 600, marginTop: 5, display: "flex" }}>
                    Web Design
                  </div>
                </div>
              </div>
              <div style={{ width: 16, height: 4, background: "#1A1A2E", marginTop: 1, display: "flex" }} />
              <div style={{ width: 42, height: 3, background: "#1A1A2E", borderRadius: 4, marginTop: 1, display: "flex" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.cta}
              </div>
              {post.ctaArrow !== false && (
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: p.italicAccent, fontWeight: 700, marginLeft: 8, display: "flex" }}>→</div>
              )}
            </div>
          </div>
        </div>
      ),
      responseOpts
    );
  }

  // ─── SPIDEY-SWING LAYOUT — Spider-Man swinging across, web pattern ──────────
  if (post.customLayout === "spidey-swing") {
    const spideyUrl = `${origin}/images/webslinger.png`;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: p.bgGradient ?? p.bg,
            color: p.ink,
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* Web pattern — concentric arcs in upper-left */}
          {[280, 380, 480, 580, 680].map((r, i) => (
            <div
              key={r}
              style={{
                position: "absolute",
                top: -r * 0.5,
                left: -r * 0.5,
                width: r,
                height: r,
                borderRadius: r,
                border: `1px solid rgba(255,255,255,${0.04 + i * 0.015})`,
                display: "flex",
              }}
            />
          ))}
          {/* Web radial lines */}
          {[15, 30, 45, 60, 75].map((deg, i) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                top: -8,
                left: -8,
                width: 700,
                height: 1,
                background: `rgba(255,255,255,${0.05 + i * 0.01})`,
                transformOrigin: "0 0",
                transform: `rotate(${deg}deg)`,
                display: "flex",
              }}
            />
          ))}

          {/* TOP META */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: p.accent, marginRight: 12, display: "flex" }} />
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.topLeftLabel}
              </div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* Spider-Man — swinging into upper-right, rotated */}
          <div
            style={{
              position: "absolute",
              top: 130,
              right: 24,
              display: "flex",
              transform: "rotate(8deg)",
            }}
          >
            <div style={{ display: "flex", width: 560, height: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spideyUrl}
                alt="Spider-Man"
                width={560}
                height={320}
                style={{ display: "flex", width: 560, height: 320, objectFit: "contain", borderRadius: 18 }}
              />
            </div>
          </div>

          {/* SWING LINE — diagonal across post */}
          <div
            style={{
              position: "absolute",
              top: 480,
              left: 40,
              width: 700,
              height: 3,
              background: `linear-gradient(90deg, ${p.accent}00 0%, ${p.accent} 50%, ${p.accent}00 100%)`,
              transform: "rotate(-12deg)",
              display: "flex",
              opacity: 0.65,
            }}
          />

          {/* Main content — bottom anchored */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "flex-end", position: "relative", marginTop: 12 }}>

            {/* Kicker */}
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex", marginBottom: 18 }}>
              {post.kicker}
            </div>

            {/* Headline */}
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
              {post.titleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "Instrument Serif",
                    fontSize: 100,
                    lineHeight: 0.95,
                    letterSpacing: -2.4,
                    color: line.italic ? p.italicAccent : p.ink,
                    fontStyle: line.italic ? "italic" : "normal",
                    display: "flex",
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>

            {/* Sub */}
            {post.sub && (
              <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.4, color: p.inkSoft, fontWeight: 500, maxWidth: 660, display: "flex", marginBottom: 22 }}>
                {post.sub}
              </div>
            )}

            {/* Tag chips */}
            {post.tagRow && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                {post.tagRow.map((tag, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 13,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      color: p.chipText,
                      background: p.chipBg,
                      padding: "7px 14px",
                      borderRadius: 999,
                      fontWeight: 700,
                      display: "flex",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTTOM ROW — logo + CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 22,
              borderTop: `1px solid ${p.ruleColor}`,
              width: "100%",
              marginTop: 12,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#1A1A2E", borderRadius: 9, padding: 4, display: "flex" }}>
                <div style={{ background: "#FFFFFF", borderRadius: 6, padding: "8px 16px 7px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 8, background: "#2563EB", display: "flex", marginRight: 8 }} />
                    <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Instrument Serif", fontSize: 30, color: "#1A1A2E", lineHeight: 1 }}>
                      <div style={{ display: "flex" }}>Built</div>
                      <div style={{ fontStyle: "italic", color: "#0EA5E9", padding: "0 2px", display: "flex" }}>by</div>
                      <div style={{ display: "flex" }}>Brian</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#64748B", fontWeight: 600, marginTop: 5, display: "flex" }}>
                    Web Design
                  </div>
                </div>
              </div>
              <div style={{ width: 16, height: 4, background: "#1A1A2E", marginTop: 1, display: "flex" }} />
              <div style={{ width: 42, height: 3, background: "#1A1A2E", borderRadius: 4, marginTop: 1, display: "flex" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.cta}
              </div>
              {post.ctaArrow !== false && (
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: p.accent, fontWeight: 700, marginLeft: 8, display: "flex" }}>→</div>
              )}
            </div>
          </div>
        </div>
      ),
      responseOpts
    );
  }

  // ─── PHANATIC-HYPE LAYOUT — Phanatic bringing the noise with a speech bubble ─
  if (post.customLayout === "phanatic-hype") {
    const phanaticUrl = `${origin}/images/phanatic.png`;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: p.bgGradient ?? p.bg,
            color: p.ink,
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* Baseball stitch lines — decorative */}
          <div
            style={{
              position: "absolute",
              top: 90,
              right: -120,
              width: 480,
              height: 480,
              borderRadius: 480,
              border: `3px dashed ${p.accent}`,
              opacity: 0.18,
              display: "flex",
            }}
          />

          {/* TOP META */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: p.accent, marginRight: 12, display: "flex" }} />
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.topLeftLabel}
              </div>
            </div>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* MAIN — two-column */}
          <div style={{ display: "flex", flex: 1, marginTop: 36, alignItems: "stretch", width: "100%", position: "relative" }}>

            {/* LEFT — headline column */}
            <div style={{ display: "flex", flexDirection: "column", width: 500, paddingRight: 18, justifyContent: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.accent, fontWeight: 700, display: "flex", marginBottom: 18 }}>
                {post.kicker}
              </div>

              <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
                {post.titleLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "Instrument Serif",
                      fontSize: 92,
                      lineHeight: 0.96,
                      letterSpacing: -2.2,
                      color: line.italic ? p.italicAccent : p.ink,
                      fontStyle: line.italic ? "italic" : "normal",
                      display: "flex",
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {post.sub && (
                <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.4, color: p.inkSoft, fontWeight: 500, maxWidth: 460, display: "flex", marginBottom: 22 }}>
                  {post.sub}
                </div>
              )}

              {post.tagRow && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {post.tagRow.map((tag, i) => (
                    <div
                      key={i}
                      style={{
                        fontFamily: "JetBrains Mono",
                        fontSize: 13,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        color: p.chipText,
                        background: p.chipBg,
                        padding: "7px 14px",
                        borderRadius: 999,
                        fontWeight: 700,
                        display: "flex",
                      }}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Phanatic column */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", justifyContent: "flex-end", position: "relative" }}>

              {/* Speech bubble — "ATTA BABE!" */}
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  right: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    background: p.accent,
                    color: "#0B2D6A",
                    borderRadius: 26,
                    padding: "14px 22px",
                    fontFamily: "Instrument Serif",
                    fontStyle: "italic",
                    fontSize: 42,
                    fontWeight: 500,
                    letterSpacing: -1.2,
                    transform: "rotate(5deg)",
                    boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
                    display: "flex",
                  }}
                >
                  Atta babe!
                </div>
              </div>

              {/* Phanatic image */}
              <div style={{ display: "flex", width: 380, height: 600, alignItems: "flex-end", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={phanaticUrl}
                  alt="Phillie Phanatic"
                  width={380}
                  height={600}
                  style={{ display: "flex", width: 380, height: 600, objectFit: "contain", objectPosition: "center bottom" }}
                />
              </div>

              {/* Sticker — RING THE BELL */}
              <div
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: 0,
                  display: "flex",
                  background: "#FFFFFF",
                  color: "#E81828",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontFamily: "JetBrains Mono",
                  fontSize: 16,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontWeight: 800,
                  transform: "rotate(-8deg)",
                  border: "3px solid #0B2D6A",
                  boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
                }}
              >
                Ring · the · bell
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 22,
              borderTop: `1px solid ${p.ruleColor}`,
              width: "100%",
              marginTop: 12,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#1A1A2E", borderRadius: 9, padding: 4, display: "flex" }}>
                <div style={{ background: "#FFFFFF", borderRadius: 6, padding: "8px 16px 7px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 8, background: "#2563EB", display: "flex", marginRight: 8 }} />
                    <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Instrument Serif", fontSize: 30, color: "#1A1A2E", lineHeight: 1 }}>
                      <div style={{ display: "flex" }}>Built</div>
                      <div style={{ fontStyle: "italic", color: "#0EA5E9", padding: "0 2px", display: "flex" }}>by</div>
                      <div style={{ display: "flex" }}>Brian</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#64748B", fontWeight: 600, marginTop: 5, display: "flex" }}>
                    Web Design
                  </div>
                </div>
              </div>
              <div style={{ width: 16, height: 4, background: "#1A1A2E", marginTop: 1, display: "flex" }} />
              <div style={{ width: 42, height: 3, background: "#1A1A2E", borderRadius: 4, marginTop: 1, display: "flex" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.inkMuted, fontWeight: 600, display: "flex" }}>
                {post.cta}
              </div>
              {post.ctaArrow !== false && (
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: p.accent, fontWeight: 700, marginLeft: 8, display: "flex" }}>→</div>
              )}
            </div>
          </div>
        </div>
      ),
      responseOpts
    );
  }

  // ─── STANDARD LAYOUT — every other post ──────────────────────
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: p.bgGradient ?? p.bg,
          color: p.ink,
          padding: `${PAD_Y}px ${PAD_X}px`,
          fontFamily: "Outfit",
        }}
      >
        {/* TOP ROW — small mono labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "JetBrains Mono",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: p.inkMuted,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 12,
                background: p.accent,
                marginRight: 14,
                display: "flex",
              }}
            />
            {post.topLeftLabel}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: p.inkMuted,
              fontWeight: 600,
              display: "flex",
            }}
          >
            {post.topRightLabel}
          </div>
        </div>

        {/* MIDDLE BODY — flex-1, centered */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "30px 0",
          }}
        >
          {/* Kicker */}
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: 4.4,
              textTransform: "uppercase",
              color: p.inkMuted,
              fontWeight: 600,
              marginBottom: 24,
              display: "flex",
            }}
          >
            {post.kicker}
          </div>

          {/* Price (optional) */}
          {post.price && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 140,
                  lineHeight: 1,
                  color: p.italicAccent,
                  display: "flex",
                }}
              >
                {post.price.v}
              </div>
              <div
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 60,
                  lineHeight: 1,
                  color: p.italicAccent,
                  opacity: 0.85,
                  marginLeft: 6,
                  display: "flex",
                }}
              >
                {post.price.s}
              </div>
            </div>
          )}

          {/* Title — stacked lines */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 26 }}>
            {post.titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 96,
                  lineHeight: 1.02,
                  letterSpacing: -2.4,
                  color: line.italic ? p.italicAccent : p.ink,
                  fontStyle: line.italic ? "italic" : "normal",
                  display: "flex",
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Sub text (optional) */}
          {post.sub && (
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: 26,
                lineHeight: 1.45,
                color: p.inkSoft,
                fontWeight: 500,
                maxWidth: 820,
                marginBottom: 22,
                display: "flex",
              }}
            >
              {post.sub}
            </div>
          )}

          {/* Num list (optional) */}
          {post.numList && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 6,
                marginBottom: 18,
              }}
            >
              {post.numList.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "JetBrains Mono",
                      fontSize: 22,
                      background: p.numBg,
                      color: p.numText,
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginRight: 22,
                      fontWeight: 700,
                    }}
                  >
                    {item.n}
                  </div>
                  <div
                    style={{
                      fontFamily: "Outfit",
                      fontSize: 28,
                      lineHeight: 1.4,
                      color: p.ink,
                      fontWeight: 500,
                      paddingTop: 4,
                      display: "flex",
                      flex: 1,
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tag row (optional) */}
          {post.tagRow && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {post.tagRow.map((tag, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 17,
                    letterSpacing: 1.8,
                    background: p.chipBg,
                    color: p.chipText,
                    padding: "10px 16px",
                    borderRadius: 5,
                    marginRight: 10,
                    marginBottom: 10,
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Bottom sub (optional) */}
          {post.subBottom && (
            <div
              style={{
                fontFamily: "Outfit",
                fontSize: 24,
                lineHeight: 1.5,
                color: p.inkSoft,
                fontWeight: 500,
                maxWidth: 800,
                marginTop: 22,
                display: "flex",
              }}
            >
              {post.subBottom}
            </div>
          )}
        </div>

        {/* BOTTOM IMAGE — three layouts: hero (character art), banner (wide trio), logo (small) */}

        {/* HERO: large character art, tagline below, centered */}
        {post.bottomImage && bottomImageSrc && post.bottomImage.size === "hero" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 14,
              paddingBottom: 16,
              width: "100%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bottomImageSrc}
              alt={post.bottomImage.alt}
              width={520}
              height={420}
              style={{ display: "flex", width: 520, height: 420, objectFit: "contain" }}
            />
            {post.bottomImage.tagline && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 22,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    color: p.ink,
                    fontWeight: 700,
                    display: "flex",
                  }}
                >
                  {post.bottomImage.tagline}
                </div>
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 13,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: p.inkMuted,
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  {post.bottomImage.alt}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BANNER: wide full-width art (e.g. Pokemon trio) */}
        {post.bottomImage && bottomImageSrc && post.bottomImage.size === "banner" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              paddingBottom: 18,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 920,
                height: 392,
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bottomImageSrc}
                alt={post.bottomImage.alt}
                width={920}
                height={392}
                style={{ display: "flex", width: 920, height: 392, objectFit: "cover" }}
              />
            </div>
            {post.bottomImage.tagline && (
              <div
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 20,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  color: p.ink,
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                {post.bottomImage.tagline}
              </div>
            )}
          </div>
        )}

        {/* LOGO: original small-logo layout (eagles #22, phillies #23) */}
        {post.bottomImage && bottomImageSrc && (!post.bottomImage.size || post.bottomImage.size === "logo") && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 28,
              paddingBottom: 30,
            }}
          >
            {post.bottomImage.tagline && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 22,
                    letterSpacing: 5,
                    textTransform: "uppercase",
                    color: p.ink,
                    fontWeight: 700,
                    display: "flex",
                  }}
                >
                  {post.bottomImage.tagline}
                </div>
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: p.inkMuted,
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  {post.bottomImage.alt}
                </div>
              </div>
            )}
            {post.bottomImage.background === "circle-white" ? (
              <div
                style={{
                  width: 200,
                  height: 200,
                  background: "#FFFFFF",
                  borderRadius: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bottomImageSrc}
                  alt={post.bottomImage.alt}
                  width={140}
                  height={140}
                  style={{ display: "flex", width: 140, height: 140, objectFit: "contain" }}
                />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={bottomImageSrc}
                alt={post.bottomImage.alt}
                width={180}
                height={180}
                style={{ display: "flex", width: 180, height: 180, objectFit: "contain" }}
              />
            )}
          </div>
        )}

        {/* BOTTOM ROW — monitor logo + CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: `1px solid ${p.ruleColor}`,
            width: "100%",
          }}
        >
          {/* Brand monitor logo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Bezel */}
            <div
              style={{
                background: "#1A1A2E",
                borderRadius: 9,
                padding: 4,
                display: "flex",
              }}
            >
              {/* Screen */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 6,
                  padding: "8px 16px 7px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Wordmark */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      background: "#2563EB",
                      display: "flex",
                      marginRight: 8,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      fontFamily: "Instrument Serif",
                      fontSize: 30,
                      color: "#1A1A2E",
                      lineHeight: 1,
                    }}
                  >
                    <div style={{ display: "flex" }}>Built</div>
                    <div
                      style={{
                        fontStyle: "italic",
                        color: "#0EA5E9",
                        padding: "0 2px",
                        display: "flex",
                      }}
                    >
                      by
                    </div>
                    <div style={{ display: "flex" }}>Brian</div>
                  </div>
                </div>
                {/* Tagline */}
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 9,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: "#64748B",
                    fontWeight: 600,
                    marginTop: 5,
                    display: "flex",
                  }}
                >
                  Web Design
                </div>
              </div>
            </div>
            {/* Stand neck */}
            <div
              style={{
                width: 16,
                height: 4,
                background: "#1A1A2E",
                marginTop: 1,
                display: "flex",
              }}
            />
            {/* Stand base */}
            <div
              style={{
                width: 42,
                height: 3,
                background: "#1A1A2E",
                borderRadius: 4,
                marginTop: 1,
                display: "flex",
              }}
            />
          </div>

          {/* CTA */}
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: p.inkMuted,
              fontWeight: 600,
              display: "flex",
            }}
          >
            {post.cta}
            {post.ctaArrow && (
              <div style={{ marginLeft: 10, display: "flex" }}>→</div>
            )}
          </div>
        </div>
      </div>
    ),
    responseOpts
  );
}
