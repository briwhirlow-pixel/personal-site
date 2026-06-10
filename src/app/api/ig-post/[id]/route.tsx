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
        bg: "#00754A",
        bgGradient: "linear-gradient(180deg, #00854F 0%, #006338 100%)",
        ink: "#FFFFFF",
        inkSoft: "rgba(255,255,255,0.92)",
        inkMuted: "rgba(255,255,255,0.7)",
        accent: "#C8C5BD",
        italicAccent: "#FFD23D",
        chipBg: "rgba(255,255,255,0.18)",
        chipText: "#FFFFFF",
        ruleColor: "rgba(255,255,255,0.3)",
        numBg: "rgba(255,210,61,0.22)",
        numText: "#FFD23D",
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
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
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
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
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
    const bulbaUrl  = `${origin}/images/bulbasaur-cut.png`;
    const charmUrl  = `${origin}/images/charmander-cut.png`;
    const squirtUrl = `${origin}/images/squirtle-cut.png`;
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
            <div style={{ display: "flex" }} />
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

          {/* CENTERED HEADLINE — big serif stack */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 26 }}>
            {post.titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 108,
                  lineHeight: 0.96,
                  letterSpacing: -2.6,
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

          {/* SUB — centered */}
          {post.sub && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
              <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.4, color: p.inkSoft, fontWeight: 500, textAlign: "center", maxWidth: 720, display: "flex" }}>
                {post.sub}
              </div>
            </div>
          )}

          {/* Smaller spacer — pull Pokemon closer to headline + sub */}
          <div style={{ height: 60, display: "flex" }} />

          {/* POKEMON ROW — trading cards: white outer, type-color inner, transparent character */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", marginBottom: 14, gap: 22 }}>

            {/* Bulbasaur card */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{
                display: "flex",
                width: 320,
                height: 320,
                background: "#FFFFFF",
                borderRadius: 20,
                padding: 12,
                boxShadow: "0 18px 30px rgba(0,0,0,0.28)",
              }}>
                <div style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  background: "#A2E09E",
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bulbaUrl}
                    alt="Bulbasaur"
                    width={280}
                    height={280}
                    style={{ display: "flex", width: 280, height: 280, objectFit: "contain" }}
                  />
                </div>
              </div>
              <div style={{
                fontFamily: "JetBrains Mono",
                fontSize: 13,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "#5AB568",
                padding: "9px 16px",
                borderRadius: 999,
                fontWeight: 800,
                display: "flex",
                marginTop: 16,
                boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
              }}>
                Grass · Starter · $750
              </div>
            </div>

            {/* Charmander card */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{
                display: "flex",
                width: 320,
                height: 320,
                background: "#FFFFFF",
                borderRadius: 20,
                padding: 12,
                boxShadow: "0 18px 30px rgba(0,0,0,0.28)",
              }}>
                <div style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  background: "#F7B26C",
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={charmUrl}
                    alt="Charmander"
                    width={280}
                    height={280}
                    style={{ display: "flex", width: 280, height: 280, objectFit: "contain" }}
                  />
                </div>
              </div>
              <div style={{
                fontFamily: "JetBrains Mono",
                fontSize: 13,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "#F18C32",
                padding: "9px 16px",
                borderRadius: 999,
                fontWeight: 800,
                display: "flex",
                marginTop: 16,
                boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
              }}>
                Fire · Pro · $1,200
              </div>
            </div>

            {/* Squirtle card */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{
                display: "flex",
                width: 320,
                height: 320,
                background: "#FFFFFF",
                borderRadius: 20,
                padding: 12,
                boxShadow: "0 18px 30px rgba(0,0,0,0.28)",
              }}>
                <div style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  background: "#8BD3F4",
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={squirtUrl}
                    alt="Squirtle"
                    width={280}
                    height={280}
                    style={{ display: "flex", width: 280, height: 280, objectFit: "contain" }}
                  />
                </div>
              </div>
              <div style={{
                fontFamily: "JetBrains Mono",
                fontSize: 13,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: "#55A8DC",
                padding: "9px 16px",
                borderRadius: 999,
                fontWeight: 800,
                display: "flex",
                marginTop: 16,
                boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
              }}>
                Water · Custom · $3K+
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
    const swoopUrl = `${origin}/images/swoop-cut.png`;
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
          {/* SWOOP — large, bottom-right anchored, dominates the right half */}
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: 0,
              width: 720,
              height: 920,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={swoopUrl}
              alt="Swoop — Eagles mascot"
              width={720}
              height={920}
              style={{ display: "flex", width: 720, height: 920, objectFit: "contain", objectPosition: "right bottom" }}
            />
          </div>

          {/* Dramatic ember halo behind Swoop's head — adds depth */}
          <div
            style={{
              position: "absolute",
              top: 220,
              right: 60,
              width: 560,
              height: 560,
              borderRadius: 560,
              background: "radial-gradient(closest-side, rgba(255,184,92,0.28) 0%, rgba(255,184,92,0) 70%)",
              display: "flex",
            }}
          />

          {/* TOP META */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", position: "relative" }}>
            <div style={{ display: "flex" }} />
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* MAIN content — left column, narrow, dominant typography */}
          <div style={{ display: "flex", flex: 1, marginTop: 40, alignItems: "flex-start", width: "100%", position: "relative" }}>

            <div style={{ display: "flex", flexDirection: "column", width: 480, paddingRight: 12, justifyContent: "flex-start", paddingTop: 30 }}>
              {/* Kicker */}
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex", marginBottom: 22 }}>
                {post.kicker}
              </div>

              {/* HUGE headline */}
              <div style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
                {post.titleLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: "Instrument Serif",
                      fontSize: 110,
                      lineHeight: 0.92,
                      letterSpacing: -3,
                      color: line.italic ? p.italicAccent : p.ink,
                      fontStyle: line.italic ? "italic" : "normal",
                      display: "flex",
                      textShadow: "0 4px 24px rgba(0,0,0,0.35)",
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Sub */}
              {post.sub && (
                <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.4, color: p.inkSoft, fontWeight: 500, maxWidth: 440, display: "flex", marginBottom: 22 }}>
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
    const spideyUrl = `${origin}/images/webslinger-cut.png`;
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
            <div style={{ display: "flex" }} />
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* SPIDER-MAN — MASSIVE, dominating the upper 55% of canvas */}
          <div
            style={{
              position: "absolute",
              top: 110,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", width: 940, height: 540, overflow: "hidden", borderRadius: 24, position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spideyUrl}
                alt="Spider-Man"
                width={940}
                height={540}
                style={{ display: "flex", width: 940, height: 540, objectFit: "cover", objectPosition: "center 30%" }}
              />
            </div>
          </div>

          {/* Soft gradient transition under Spider-Man — full bleed, fades in AND out so no box edge */}
          <div
            style={{
              position: "absolute",
              top: 540,
              left: 0,
              right: 0,
              height: 280,
              background: "linear-gradient(180deg, rgba(10,26,58,0) 0%, rgba(10,26,58,0.55) 40%, rgba(10,26,58,0.55) 60%, rgba(10,26,58,0) 100%)",
              display: "flex",
            }}
          />

          {/* Extra web pattern across the canvas bottom — radiating from Spider-Man toward headline */}
          {[12, 24, 36, 48, 60].map((deg, i) => (
            <div
              key={`bottom-web-${deg}`}
              style={{
                position: "absolute",
                top: 700,
                left: 540,
                width: 700,
                height: 1.5,
                background: `rgba(255,255,255,${0.06 + i * 0.012})`,
                transformOrigin: "0 0",
                transform: `rotate(${180 + deg}deg)`,
                display: "flex",
              }}
            />
          ))}

          {/* Main content — bottom anchored, headline OVERLAPS Spider-Man slightly */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "flex-end", position: "relative", marginTop: 12 }}>

            {/* Kicker */}
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex", marginBottom: 18 }}>
              {post.kicker}
            </div>

            {/* Headline — huge */}
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
              {post.titleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "Instrument Serif",
                    fontSize: 110,
                    lineHeight: 0.92,
                    letterSpacing: -2.8,
                    color: line.italic ? p.italicAccent : p.ink,
                    fontStyle: line.italic ? "italic" : "normal",
                    display: "flex",
                    textShadow: "0 4px 24px rgba(0,0,0,0.5)",
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
    const phanaticUrl = `${origin}/images/phanatic-cut.png`;
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
            <div style={{ display: "flex" }} />
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

            {/* RIGHT — Phanatic column, MASSIVE, bottom anchored */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", justifyContent: "flex-end", position: "relative" }}>

              {/* Phanatic image — huge */}
              <div style={{ display: "flex", width: 500, height: 980, alignItems: "flex-end", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={phanaticUrl}
                  alt="Phillie Phanatic"
                  width={500}
                  height={960}
                  style={{ display: "flex", width: 500, height: 960, objectFit: "contain", objectPosition: "center bottom" }}
                />
              </div>
            </div>
          </div>

          {/* Bell icon — large decorative, top-right */}
          <div
            style={{
              position: "absolute",
              top: 130,
              right: 90,
              width: 90,
              height: 90,
              borderRadius: 90,
              background: p.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-12deg)",
              boxShadow: "0 8px 0 rgba(0,0,0,0.22)",
            }}
          >
            <div style={{ fontFamily: "Instrument Serif", fontSize: 56, color: "#0B2D6A", fontStyle: "italic", lineHeight: 1, display: "flex" }}>
              ’26
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

  // ─── CALENDAR TILE LAYOUT — Tuesday post, full calendar grid bg ─────────────
  if (post.customLayout === "calendar-tile") {
    const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const COLS = 7;
    const ROWS = 6;
    const CELL_W = 1080 / COLS;       // ~154
    const CELL_H = 1350 / (ROWS + 1); // header row + 6 weeks
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
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* Calendar tile pattern — full bleed, behind everything */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              opacity: 0.18,
            }}
          >
            {/* Day-name header row */}
            <div style={{ display: "flex", flexDirection: "row", height: CELL_H * 0.6, borderBottom: `2px solid ${p.ink}` }}>
              {DAYS.map((d) => (
                <div
                  key={d}
                  style={{
                    width: CELL_W,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "JetBrains Mono",
                    fontSize: 16,
                    letterSpacing: 4,
                    color: d === "TUE" ? p.italicAccent : p.ink,
                    fontWeight: 700,
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Date number grid */}
            {Array.from({ length: ROWS }).map((_, r) => (
              <div key={r} style={{ display: "flex", flexDirection: "row", flex: 1 }}>
                {Array.from({ length: COLS }).map((_, c) => {
                  const dayNum = r * COLS + c + 1;
                  const isTuesday = c === 1;
                  return (
                    <div
                      key={c}
                      style={{
                        width: CELL_W,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        padding: "10px 14px",
                        borderRight: `1px solid ${p.ink}`,
                        borderBottom: `1px solid ${p.ink}`,
                        background: isTuesday ? `${p.italicAccent}` : "transparent",
                        fontFamily: "Instrument Serif",
                        fontSize: 32,
                        color: isTuesday ? p.bg : p.ink,
                        fontWeight: 400,
                      }}
                    >
                      {dayNum <= 31 ? dayNum : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Main content overlay */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: `${PAD_Y}px ${PAD_X}px`,
            }}
          >
            {/* TOP META */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex" }} />
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex" }}>
                {post.topRightLabel}
              </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1, display: "flex" }} />

            {/* TUESDAY pill — sits ABOVE the headline like a calendar callout */}
            <div style={{ display: "flex", marginBottom: 20 }}>
              <div style={{
                display: "flex",
                background: p.italicAccent,
                color: p.bg,
                padding: "10px 22px",
                borderRadius: 999,
                fontFamily: "JetBrains Mono",
                fontSize: 18,
                letterSpacing: 6,
                textTransform: "uppercase",
                fontWeight: 800,
                boxShadow: "0 8px 0 rgba(0,0,0,0.18)",
              }}>
                {post.kicker} · TUE
              </div>
            </div>

            {/* HEADLINE — anchored over the calendar grid */}
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 28 }}>
              {post.titleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "Instrument Serif",
                    fontSize: 110,
                    lineHeight: 0.94,
                    letterSpacing: -2.8,
                    color: line.italic ? p.italicAccent : p.ink,
                    fontStyle: line.italic ? "italic" : "normal",
                    display: "flex",
                    textShadow: "0 4px 24px rgba(0,0,0,0.18)",
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>

            {/* Sub */}
            {post.sub && (
              <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.4, color: p.inkSoft, fontWeight: 500, maxWidth: 760, display: "flex", marginBottom: 22 }}>
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
                      color: p.bg,
                      background: p.ink,
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

            {/* BOTTOM ROW */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 22,
                borderTop: `1px solid ${p.ruleColor}`,
                width: "100%",
                marginTop: 14,
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
        </div>
      ),
      responseOpts
    );
  }

  // ─── BOARDWALK LAYOUT — Summer Shore post w/ full-bleed boardwalk photo ─────
  if (post.customLayout === "boardwalk") {
    const boardwalkUrl = `${origin}/images/boardwalk.jpg`;
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundImage: `url(${boardwalkUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundColor: p.bg,
            color: p.ink,
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* DARKENING — top band so meta strip reads */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 160,
              display: "flex",
              background: "linear-gradient(180deg, rgba(0,12,26,0.7) 0%, rgba(0,12,26,0) 100%)",
            }}
          />

          {/* DARKENING — heavy bottom block so headline + body read on the busy boardwalk crowd */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 760,
              display: "flex",
              background: "linear-gradient(180deg, rgba(0,12,26,0) 0%, rgba(0,12,26,0.92) 60%, rgba(0,12,26,0.97) 100%)",
            }}
          />
          {/* TOP META */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", position: "relative" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* Spacer pushes content down */}
          <div style={{ flex: 1, display: "flex", position: "relative" }} />

          {/* KICKER */}
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.italicAccent, fontWeight: 700, display: "flex", marginBottom: 18, textShadow: "0 2px 12px rgba(0,0,0,0.6)", position: "relative" }}>
            {post.kicker}
          </div>

          {/* HEADLINE — huge serif, with strong text shadow for photo legibility */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 28, position: "relative" }}>
            {post.titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 108,
                  lineHeight: 0.94,
                  letterSpacing: -2.6,
                  color: line.italic ? p.italicAccent : p.ink,
                  fontStyle: line.italic ? "italic" : "normal",
                  display: "flex",
                  textShadow: "0 4px 28px rgba(0,0,0,0.7)",
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Sub */}
          {post.sub && (
            <div style={{ fontFamily: "Outfit", fontSize: 22, lineHeight: 1.45, color: p.ink, fontWeight: 500, maxWidth: 700, display: "flex", marginBottom: 22, textShadow: "0 2px 10px rgba(0,0,0,0.6)", position: "relative" }}>
              {post.sub}
            </div>
          )}

          {/* Tag chips — shore towns */}
          {post.tagRow && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8, position: "relative" }}>
              {post.tagRow.map((tag, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 13,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: p.bg,
                    background: p.italicAccent,
                    padding: "7px 14px",
                    borderRadius: 999,
                    fontWeight: 800,
                    display: "flex",
                    boxShadow: "0 4px 0 rgba(0,0,0,0.25)",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* BOTTOM ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 22,
              borderTop: `1px solid rgba(255,255,255,0.3)`,
              width: "100%",
              marginTop: 14,
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
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: p.ink, fontWeight: 600, display: "flex", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
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

  // ─── ABOUT-DESIGNER LAYOUT — throwback photo + receipts + rankings ──────────
  if (post.customLayout === "about-designer") {
    const photoUrl = `${origin}/images/brian-young.jpg`;
    const kajeetUrl = `${origin}/images/kajeet-phone.png`;

    // Inline brand-logo SVG glyphs. Tiny, single-color, designed to read at 16-18px.
    const LOGOS: Record<string, React.ReactNode> = {
      apple: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <path d="M17.05 12.04c-.03-3.16 2.58-4.7 2.7-4.77-1.47-2.15-3.76-2.44-4.57-2.47-1.94-.2-3.79 1.14-4.78 1.14-.98 0-2.51-1.11-4.13-1.08C4.18 4.9 2.27 6.08 1.24 7.93-.86 11.66.69 17.17 2.72 20.18c.99 1.48 2.18 3.14 3.74 3.08 1.5-.06 2.07-.97 3.88-.97 1.81 0 2.32.97 3.91.94 1.61-.03 2.63-1.51 3.62-2.99 1.14-1.71 1.61-3.37 1.64-3.46-.04-.02-3.15-1.2-3.18-4.74M14.04 3.56c.83-1 1.39-2.4 1.23-3.78-1.19.05-2.63.79-3.48 1.79-.77.88-1.44 2.3-1.26 3.66 1.33.11 2.69-.67 3.51-1.67" fill="#000000"/>
        </svg>
      ),
      apple_white: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <path d="M17.05 12.04c-.03-3.16 2.58-4.7 2.7-4.77-1.47-2.15-3.76-2.44-4.57-2.47-1.94-.2-3.79 1.14-4.78 1.14-.98 0-2.51-1.11-4.13-1.08C4.18 4.9 2.27 6.08 1.24 7.93-.86 11.66.69 17.17 2.72 20.18c.99 1.48 2.18 3.14 3.74 3.08 1.5-.06 2.07-.97 3.88-.97 1.81 0 2.32.97 3.91.94 1.61-.03 2.63-1.51 3.62-2.99 1.14-1.71 1.61-3.37 1.64-3.46-.04-.02-3.15-1.2-3.18-4.74M14.04 3.56c.83-1 1.39-2.4 1.23-3.78-1.19.05-2.63.79-3.48 1.79-.77.88-1.44 2.3-1.26 3.66 1.33.11 2.69-.67 3.51-1.67" fill="#FFFFFF"/>
        </svg>
      ),
      android: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <path d="M17.6 9.48l1.84-3.18a.4.4 0 0 0-.69-.4L16.9 9.1A11.3 11.3 0 0 0 12 8a11.3 11.3 0 0 0-4.9 1.1L5.25 5.9a.4.4 0 0 0-.69.4l1.84 3.18A10.36 10.36 0 0 0 1 18h22a10.36 10.36 0 0 0-5.4-8.52M7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5m10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5" fill="#A4C639"/>
        </svg>
      ),
      spotify: (
        <svg width={18} height={18} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="11" fill="#1DB954"/>
          <path d="M17.5 16.3a.7.7 0 0 1-1 .25c-2.75-1.7-6.2-2.07-10.28-1.14a.7.7 0 1 1-.32-1.4c4.45-1 8.27-.6 11.34 1.27.34.2.45.66.26 1.02m1.5-3.4a.9.9 0 0 1-1.25.3c-3.15-1.94-7.95-2.5-11.67-1.37a.9.9 0 1 1-.52-1.74c4.25-1.27 9.55-.65 13.15 1.55.42.26.55.81.3 1.26m.13-3.55c-3.77-2.24-10-2.44-13.6-1.35a1.1 1.1 0 1 1-.63-2.1c4.13-1.24 11-1 15.34 1.58a1.08 1.08 0 1 1-1.11 1.87" fill="#FFFFFF"/>
        </svg>
      ),
      apple_music: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <rect width="24" height="24" rx="6" fill="#FA243C"/>
          <path d="M9 8l7-1.5v8.5a2 2 0 1 1-1.4-1.9V8.9l-4.2.9v6.2a2 2 0 1 1-1.4-1.9V8z" fill="#FFFFFF"/>
        </svg>
      ),
      nintendo: (
        <svg width={18} height={18} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <rect x="3" y="3" width="7" height="18" rx="2" fill="#E60012"/>
          <rect x="14" y="3" width="7" height="18" rx="2" fill="#1F1F1F"/>
          <circle cx="6.5" cy="9" r="1.2" fill="#FFFFFF"/>
          <rect x="5.5" y="13" width="2" height="0.6" fill="#FFFFFF"/>
          <rect x="6.2" y="12.3" width="0.6" height="2" fill="#FFFFFF"/>
        </svg>
      ),
      xbox: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="11" fill="#107C10"/>
          <path d="M7 6c1.5 0 3 1 5 4-2 3-3.5 5-5 6-1.5-2-2.2-5.5-.5-9zm10 0c-1.5 0-3 1-5 4 2 3 3.5 5 5 6 1.5-2 2.2-5.5.5-9z" fill="#FFFFFF"/>
        </svg>
      ),
      playstation: (
        <svg width={20} height={16} viewBox="0 0 30 24" style={{ display: "flex" }}>
          <text x="0" y="18" fontFamily="Outfit" fontSize="20" fontWeight="900" fill="#FFFFFF">PS</text>
        </svg>
      ),
      instagram: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <defs>
            <linearGradient id="igGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEDA75"/>
              <stop offset="25%" stopColor="#FA7E1E"/>
              <stop offset="50%" stopColor="#D62976"/>
              <stop offset="75%" stopColor="#962FBF"/>
              <stop offset="100%" stopColor="#4F5BD5"/>
            </linearGradient>
          </defs>
          <rect width="22" height="22" x="1" y="1" rx="6" fill="url(#igGrad)"/>
          <rect width="22" height="22" x="1" y="1" rx="6" fill="none" stroke="#FFFFFF" strokeWidth="0"/>
          <circle cx="12" cy="12" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="#FFFFFF"/>
        </svg>
      ),
      tiktok: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <path d="M16.6 5.8a4.6 4.6 0 0 1-3.3-1.4V15a5.5 5.5 0 1 1-5.5-5.5l1 .1v2.8c-.3-.1-.7-.2-1-.2a2.7 2.7 0 1 0 2.7 2.7V0h2.8c0 1.5 1.2 4 4.3 4z" fill="#FFFFFF"/>
          <path d="M16.6 5.8a4.6 4.6 0 0 1-3.3-1.4V15a5.5 5.5 0 1 1-5.5-5.5l1 .1v2.8c-.3-.1-.7-.2-1-.2a2.7 2.7 0 1 0 2.7 2.7V0h2.8c0 1.5 1.2 4 4.3 4z" fill="#25F4EE" transform="translate(-1.5 1)" opacity=".8"/>
          <path d="M16.6 5.8a4.6 4.6 0 0 1-3.3-1.4V15a5.5 5.5 0 1 1-5.5-5.5l1 .1v2.8c-.3-.1-.7-.2-1-.2a2.7 2.7 0 1 0 2.7 2.7V0h2.8c0 1.5 1.2 4 4.3 4z" fill="#FE2C55" transform="translate(1.5 -1)" opacity=".8"/>
        </svg>
      ),
      x: (
        <svg width={14} height={14} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#FFFFFF"/>
        </svg>
      ),
      facebook: (
        <svg width={16} height={16} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="11" fill="#1877F2"/>
          <path d="M15.5 12.5h-2.5V21H10v-8.5H8V10h2V8.5c0-2 .8-3.5 3.2-3.5h2v2.6H14c-.7 0-1 .3-1 1V10h2.7z" fill="#FFFFFF"/>
        </svg>
      ),
    };

    // Brand-colored ranking chips: [name, brandColor, contrastText, logoKey]
    type ChipMeta = { name: string; bg: string; fg: string; logo?: string };
    type Rank = { winner: ChipMeta; losers: ChipMeta[] };
    const RANKINGS: Rank[] = [
      {
        winner: { name: "iOS",     bg: "#FFFFFF", fg: "#000000", logo: "apple" },
        losers: [{ name: "Android", bg: "#2B2D33", fg: "#A4C639", logo: "android" }],
      },
      {
        winner: { name: "Spotify",     bg: "#1DB954", fg: "#FFFFFF", logo: "spotify" },
        losers: [{ name: "Apple Music", bg: "#1A1A2E", fg: "#FA243C", logo: "apple_music" }],
      },
      {
        winner: { name: "Nintendo",   bg: "#E60012", fg: "#FFFFFF", logo: "nintendo" },
        losers: [
          { name: "Xbox",        bg: "#107C10", fg: "#FFFFFF", logo: "xbox" },
          { name: "PlayStation", bg: "#003791", fg: "#FFFFFF", logo: "playstation" },
        ],
      },
      {
        winner: { name: "Instagram", bg: "linear-gradient(135deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)", fg: "#FFFFFF", logo: "instagram" },
        losers: [
          { name: "TikTok",   bg: "#010101", fg: "#FFFFFF", logo: "tiktok" },
          { name: "X",        bg: "#000000", fg: "#FFFFFF", logo: "x" },
          { name: "Facebook", bg: "#1877F2", fg: "#FFFFFF", logo: "facebook" },
        ],
      },
    ];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(180deg, #0F1117 0%, #13161F 65%, #0F1117 100%)",
            color: "#FFFFFF",
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* TOP META */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: "#22D3EE", fontWeight: 700, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* KICKER — centered */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 22 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, letterSpacing: 4, textTransform: "uppercase", color: "#22D3EE", fontWeight: 700, display: "flex" }}>
              {post.kicker}
            </div>
          </div>

          {/* HEADLINE — centered */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 10, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "wrap" }}>
              {post.titleLines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "Instrument Serif",
                    fontSize: 96,
                    lineHeight: 0.96,
                    letterSpacing: -2.4,
                    color: line.italic ? "#22D3EE" : "#FFFFFF",
                    fontStyle: line.italic ? "italic" : "normal",
                    display: "flex",
                    paddingRight: i < post.titleLines.length - 1 ? 14 : 0,
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>

          {/* Sub — centered byline */}
          {post.sub && (
            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 14 }}>
              <div style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 22, lineHeight: 1.35, color: "rgba(255,255,255,0.65)", maxWidth: 700, display: "flex", textAlign: "center" }}>
                {post.sub}
              </div>
            </div>
          )}

          {/* THROWBACK PHOTO — straight, bigger */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 22 }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              background: "#F4EFE4",
              padding: 14,
              paddingBottom: 30,
              boxShadow: "0 28px 40px rgba(0,0,0,0.55), 0 6px 0 rgba(0,0,0,0.18)",
              alignItems: "center",
              width: 860,
            }}>
              <div style={{ display: "flex", width: 832, height: 440, overflow: "hidden", borderRadius: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Brian as a kid at a CRT computer"
                  width={832}
                  height={440}
                  style={{ display: "flex", width: 832, height: 440, objectFit: "cover", objectPosition: "center 35%" }}
                />
              </div>
              <div style={{
                marginTop: 10,
                fontFamily: "JetBrains Mono",
                fontSize: 15,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.6)",
                fontWeight: 700,
                display: "flex",
              }}>
                90&apos;S BABY · STILL AT THE KEYBOARD
              </div>
            </div>
          </div>

          {/* TWO COLUMNS — Receipts + Rankings */}
          <div style={{ display: "flex", flexDirection: "row", gap: 28, marginTop: 4 }}>

            {/* LEFT — Receipts */}
            <div style={{ display: "flex", flexDirection: "column", width: 380 }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#22D3EE", fontWeight: 700, display: "flex", marginBottom: 10 }}>
                Official Receipts
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "flex", marginBottom: 4 }}>
                    Degree
                  </div>
                  <div style={{ fontFamily: "Instrument Serif", fontSize: 22, color: "#FFFFFF", lineHeight: 1.1, display: "flex" }}>
                    BS · Management Information Systems
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  borderRadius: 10,
                  padding: "12px 14px",
                }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "flex", marginBottom: 4 }}>
                    In Progress
                  </div>
                  <div style={{ fontFamily: "Instrument Serif", fontSize: 22, color: "#FFFFFF", lineHeight: 1.1, display: "flex" }}>
                    MBA · <span style={{ fontStyle: "italic", color: "#22D3EE", paddingLeft: 8, display: "flex" }}>Spring &apos;27</span>
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px dashed rgba(255,255,255,0.25)",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}>
                  {/* Kajeet phone photo inline */}
                  <div style={{ display: "flex", width: 56, height: 68, overflow: "hidden", borderRadius: 6, background: "#FFFFFF" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={kajeetUrl}
                      alt="LG Kajeet phone"
                      width={56}
                      height={68}
                      style={{ display: "flex", width: 56, height: 68, objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "flex", marginBottom: 4 }}>
                      First Phone
                    </div>
                    <div style={{ fontFamily: "Instrument Serif", fontSize: 22, color: "#FFFFFF", lineHeight: 1.1, display: "flex" }}>
                      <span style={{ fontStyle: "italic", color: "#FB7185", paddingRight: 8, display: "flex" }}>LG</span> Kajeet
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Rankings */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#FACC15", fontWeight: 700, display: "flex", marginBottom: 10 }}>
                Unofficial Rankings
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RANKINGS.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    {/* Winner — full color + logo */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: r.winner.bg,
                      color: r.winner.fg,
                      padding: "5px 11px 5px 7px",
                      borderRadius: 999,
                      fontFamily: "Outfit",
                      fontSize: 13,
                      fontWeight: 700,
                      boxShadow: "0 3px 0 rgba(0,0,0,0.3)",
                    }}>
                      {r.winner.logo && LOGOS[r.winner.logo === "apple" ? (r.winner.fg === "#FFFFFF" ? "apple_white" : "apple") : r.winner.logo]}
                      <div style={{ display: "flex" }}>{r.winner.name}</div>
                    </div>
                    {r.losers.map((l, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ fontFamily: "JetBrains Mono", fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 700, display: "flex" }}>
                          &gt;
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          background: l.bg,
                          color: l.fg,
                          padding: "4px 10px 4px 7px",
                          borderRadius: 999,
                          fontFamily: "Outfit",
                          fontSize: 12,
                          fontWeight: 600,
                          opacity: 0.75,
                        }}>
                          {l.logo && LOGOS[l.logo === "apple" ? (l.fg === "#FFFFFF" ? "apple_white" : "apple") : l.logo]}
                          <div style={{ display: "flex" }}>{l.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1, display: "flex" }} />

          {/* BOTTOM ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 22,
              borderTop: "1px solid rgba(255,255,255,0.15)",
              width: "100%",
              marginTop: 14,
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
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontWeight: 600, display: "flex" }}>
                {post.cta}
              </div>
              {post.ctaArrow !== false && (
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: "#22D3EE", fontWeight: 700, marginLeft: 8, display: "flex" }}>→</div>
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
          <div style={{ display: "flex" }} />
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
