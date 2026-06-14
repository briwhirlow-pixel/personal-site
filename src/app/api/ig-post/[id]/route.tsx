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

  // Hide top-right and bottom-right labels from all posts
  post.topRightLabel = "";
  post.cta = "";
  post.ctaArrow = false;

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

  const [instrumentRegular, instrumentItalic, outfitMedium, outfitBold, jetbrainsMono, interMedium, interBold, interBlack] =
    await Promise.all([
      loadGoogleFont("family=Instrument+Serif"),
      loadGoogleFont("family=Instrument+Serif:ital@1"),
      loadGoogleFont("family=Outfit:wght@500"),
      loadGoogleFont("family=Outfit:wght@700"),
      loadGoogleFont("family=JetBrains+Mono:wght@600"),
      loadGoogleFont("family=Inter:wght@500"),
      loadGoogleFont("family=Inter:wght@700"),
      loadGoogleFont("family=Inter:wght@900"),
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
      { name: "Inter", data: interMedium, weight: 500 as const, style: "normal" as const },
      { name: "Inter", data: interBold, weight: 700 as const, style: "normal" as const },
      { name: "Inter", data: interBlack, weight: 900 as const, style: "normal" as const },
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

  // ─── ILLUMINATE BEAUTY BAR — Homepage Preview (client mockup) ─────────────
  if (post.customLayout === "illuminate-preview") {
    const PREV_W = 1080;
    const PREV_H = 1620;
    const previewOpts = {
      ...responseOpts,
      width: PREV_W,
      height: PREV_H,
    };

    // Soft palette pulled from Kelli's brief: nude/tan, light pink, gold, white
    const cream = "#F4ECDE";
    const creamSoft = "#EDE2D0";
    const ink = "#2C2620";
    const inkSoft = "rgba(44,38,32,0.65)";
    const gold = "#B08D5A";
    const goldDeep = "#8A6F44";
    const pink = "#E8CFC9";

    // Star path used as the stardust accent (5-point star)
    const Star = ({ size, top, left, opacity, rot = 0 }: { size: number; top: number; left: number; opacity: number; rot?: number }) => (
      <div style={{ position: "absolute", top, left, opacity, transform: `rotate(${rot}deg)`, display: "flex" }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "flex" }}>
          <path d="M50 5 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z" fill={gold}/>
        </svg>
      </div>
    );

    return new ImageResponse(
      (
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: cream,
          fontFamily: "Inter",
          position: "relative",
        }}>

          {/* ─── BROWSER CHROME ─── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#E8E2D6",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            padding: "14px 22px",
            gap: 8,
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 12, background: "#FF6058" }} />
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 12, background: "#FEBD2D" }} />
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 12, background: "#28C840" }} />
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginLeft: 26,
              background: "#F8F4ED",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 8,
              padding: "8px 16px",
              fontFamily: "Inter",
              fontSize: 16,
              color: inkSoft,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "flex" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <div style={{ display: "flex" }}>illuminatebeautybar.com</div>
            </div>
          </div>

          {/* ─── TOP NAV ─── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 56px",
            background: cream,
            position: "relative",
          }}>
            {/* Logo lockup */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="22" height="22" viewBox="0 0 100 100" style={{ display: "flex" }}>
                <path d="M50 5 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z" fill={gold}/>
              </svg>
              <div style={{
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontSize: 30,
                color: ink,
                letterSpacing: 0.5,
                display: "flex",
              }}>
                Illuminate
              </div>
            </div>
            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {["Services", "Bridal", "Gallery", "About", "Contact"].map((l) => (
                <div key={l} style={{
                  fontFamily: "Inter",
                  fontSize: 14,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: ink,
                  fontWeight: 500,
                  display: "flex",
                }}>
                  {l}
                </div>
              ))}
              <div style={{
                display: "flex",
                background: ink,
                color: cream,
                fontFamily: "Inter",
                fontSize: 13,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 600,
                padding: "11px 22px",
                borderRadius: 999,
              }}>
                Book Now
              </div>
            </div>
          </div>

          {/* ─── HERO SECTION ─── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "70px 56px 90px",
            position: "relative",
            background: cream,
            flexShrink: 0,
          }}>
            {/* Stardust accents — scattered stars */}
            <Star size={18} top={20} left={120} opacity={0.55} />
            <Star size={10} top={80} left={220} opacity={0.4} rot={20} />
            <Star size={14} top={140} left={90} opacity={0.5} rot={-15} />
            <Star size={22} top={30} left={880} opacity={0.55} rot={10} />
            <Star size={12} top={120} left={950} opacity={0.45} rot={-20} />
            <Star size={9} top={200} left={850} opacity={0.35} />
            <Star size={16} top={250} left={150} opacity={0.4} rot={25} />
            <Star size={11} top={310} left={920} opacity={0.45} rot={-10} />

            {/* Curved stardust arc — hand-drawn feel */}
            <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", display: "flex" }}>
              <svg width="640" height="60" viewBox="0 0 640 60" style={{ display: "flex" }}>
                <path d="M20 40 Q160 5 320 30 Q480 55 620 20"
                  stroke={gold} strokeWidth="1" fill="none" opacity="0.45" strokeLinecap="round"
                  strokeDasharray="2 6"/>
              </svg>
            </div>

            {/* Eyebrow */}
            <div style={{
              fontFamily: "Inter",
              fontSize: 13,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: gold,
              fontWeight: 600,
              display: "flex",
              marginBottom: 24,
              position: "relative",
            }}>
              ✦  Modern Luxe Beauty Studio  ✦
            </div>

            {/* Big wordmark */}
            <div style={{
              fontFamily: "Instrument Serif",
              fontSize: 132,
              lineHeight: 0.92,
              letterSpacing: -1,
              color: ink,
              display: "flex",
              position: "relative",
              marginBottom: 4,
            }}>
              Illuminate
            </div>
            <div style={{
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 56,
              lineHeight: 1,
              letterSpacing: 1,
              color: goldDeep,
              display: "flex",
              position: "relative",
              marginBottom: 36,
            }}>
              Beauty Bar
            </div>

            {/* Tagline */}
            <div style={{
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 30,
              lineHeight: 1.35,
              color: inkSoft,
              maxWidth: 720,
              display: "flex",
              textAlign: "center",
              marginBottom: 36,
              position: "relative",
            }}>
              Where the magic happens, every appointment.
            </div>

            {/* CTA button */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: gold,
              color: "#FFFFFF",
              fontFamily: "Inter",
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "20px 38px",
              borderRadius: 999,
              marginBottom: 24,
              boxShadow: "0 14px 28px rgba(176,141,90,0.32)",
              position: "relative",
            }}>
              Book Your Appointment
            </div>

            {/* Meta line */}
            <div style={{
              fontFamily: "Inter",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: inkSoft,
              fontWeight: 500,
              display: "flex",
              position: "relative",
            }}>
              Haddon Township, NJ  ·  Color  ·  Cut  ·  Bridal  ·  Makeup
            </div>
          </div>

          {/* ─── SERVICES STRIP ─── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            background: creamSoft,
            padding: "40px 56px 44px",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              marginBottom: 26,
            }}>
              <div style={{ width: 28, height: 1, background: gold, display: "flex" }} />
              <div style={{
                fontFamily: "Inter",
                fontSize: 12,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: gold,
                fontWeight: 700,
                display: "flex",
              }}>
                The Services
              </div>
              <div style={{ width: 28, height: 1, background: gold, display: "flex" }} />
            </div>

            <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
              {[
                { name: "Color",      from: "$115",  desc: "Touch ups, balayage, full color" },
                { name: "Cut",        from: "$65",   desc: "Precision cut + blowdry" },
                { name: "Extensions", from: "$250",  desc: "Hand tied, tape in, beaded" },
                { name: "Makeup",     from: "$185",  desc: "Soft glam, editorial, bridal" },
              ].map((s) => (
                <div key={s.name} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "#FFFFFF",
                  border: `1px solid ${pink}`,
                  borderRadius: 14,
                  padding: "22px 18px",
                  width: 230,
                  boxShadow: "0 8px 18px rgba(44,38,32,0.06)",
                }}>
                  <div style={{
                    fontFamily: "Instrument Serif",
                    fontSize: 30,
                    color: ink,
                    display: "flex",
                    marginBottom: 4,
                  }}>
                    {s.name}
                  </div>
                  <div style={{
                    fontFamily: "Inter",
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: gold,
                    fontWeight: 600,
                    display: "flex",
                    marginBottom: 10,
                  }}>
                    from {s.from}
                  </div>
                  <div style={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    lineHeight: 1.45,
                    color: inkSoft,
                    display: "flex",
                    textAlign: "center",
                    fontWeight: 500,
                  }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── BRIDAL FEATURE ─── */}
          <div style={{
            display: "flex",
            background: cream,
            padding: "40px 56px",
            gap: 32,
            alignItems: "center",
            flex: 1,
            position: "relative",
          }}>
            {/* Photo placeholder — soft pink panel with star */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 280,
              height: 220,
              background: `linear-gradient(135deg, ${pink} 0%, #F2D9D2 100%)`,
              borderRadius: 14,
              flexShrink: 0,
              position: "relative",
            }}>
              <svg width="44" height="44" viewBox="0 0 100 100" style={{ display: "flex", opacity: 0.7 }}>
                <path d="M50 5 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z" fill="#FFFFFF"/>
              </svg>
              <div style={{
                position: "absolute",
                bottom: 14,
                left: 16,
                fontFamily: "Inter",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: ink,
                fontWeight: 600,
                display: "flex",
                opacity: 0.7,
              }}>
                Gallery preview
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{
                fontFamily: "Inter",
                fontSize: 12,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: gold,
                fontWeight: 700,
                display: "flex",
                marginBottom: 12,
              }}>
                Bridal, By Appointment
              </div>
              <div style={{
                fontFamily: "Instrument Serif",
                fontSize: 44,
                lineHeight: 1.05,
                color: ink,
                display: "flex",
                marginBottom: 10,
                maxWidth: 540,
              }}>
                Your day deserves more <span style={{ fontStyle: "italic", color: goldDeep, paddingLeft: 6, display: "flex" }}>than a chair.</span>
              </div>
              <div style={{
                fontFamily: "Inter",
                fontSize: 15,
                lineHeight: 1.55,
                color: inkSoft,
                display: "flex",
                marginBottom: 18,
                maxWidth: 520,
                fontWeight: 500,
              }}>
                Bridal hair and makeup with a luxury one on one setting. Tell me about your day and I&apos;ll write back inside 24 hours.
              </div>
              <div style={{ display: "flex" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: `1.5px solid ${ink}`,
                  color: ink,
                  fontFamily: "Inter",
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "13px 24px",
                  borderRadius: 999,
                }}>
                  Inquire About Your Wedding
                </div>
              </div>
            </div>
          </div>

          {/* ─── FOOTER PEEK ─── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: ink,
            color: cream,
            padding: "22px 56px",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="14" height="14" viewBox="0 0 100 100" style={{ display: "flex" }}>
                <path d="M50 5 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z" fill={gold}/>
              </svg>
              <div style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 22, display: "flex" }}>
                Illuminate Beauty Bar
              </div>
            </div>
            <div style={{
              fontFamily: "Inter",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(244,236,222,0.55)",
              fontWeight: 500,
              display: "flex",
            }}>
              @illuminatebeautybykelli  ·  Haddon Twp  ·  856.905.5615
            </div>
          </div>
        </div>
      ),
      previewOpts
    );
  }

  // ─── OUTAGE STORY (9:16) — Instagram + Facebook outage reactive post ──────
  if (post.customLayout === "outage-story") {
    const STORY_W = 1080;
    const STORY_H = 1920;
    const PAD = 80;
    const igIconUrl = `${origin}/images/instagram-icon-cut.png`;
    const fbIconUrl = `${origin}/images/facebook-icon-cut.png`;

    const storyOpts = {
      ...responseOpts,
      width: STORY_W,
      height: STORY_H,
    };

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(165deg, #2B0F60 0%, #6B1E78 22%, #BA1559 48%, #D85B2E 72%, #5B1A14 100%)",
            color: "#FFFFFF",
            padding: `${PAD}px ${PAD}px`,
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* Dark overlay — pulls the IG-gradient bg into a moody silhouette */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.75) 100%)",
            display: "flex",
          }} />

          {/* Giant ghosted IG camera silhouette behind everything */}
          <div style={{
            position: "absolute",
            top: 460,
            left: -160,
            opacity: 0.07,
            display: "flex",
          }}>
            <svg width="1180" height="1180" viewBox="0 0 64 64" style={{ display: "flex" }}>
              <rect width="64" height="64" rx="16" fill="none" stroke="#FFFFFF" strokeWidth="3.5"/>
              <circle cx="32" cy="32" r="14" fill="none" stroke="#FFFFFF" strokeWidth="3.5"/>
              <circle cx="48" cy="16" r="3.5" fill="#FFFFFF"/>
            </svg>
          </div>

          {/* TODAY mono label — centered above the banner */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", position: "relative", marginBottom: 14 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontWeight: 600, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* BREAKING NEWS — huge centered banner */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", position: "relative" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: "#DC2626",
              padding: "20px 38px",
              borderRadius: 10,
              boxShadow: "0 14px 36px rgba(220,38,38,0.55), 0 5px 0 rgba(0,0,0,0.32)",
            }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: 18,
                background: "#FFFFFF",
                display: "flex",
                boxShadow: "0 0 16px rgba(255,255,255,0.95)",
              }} />
              <div style={{
                fontFamily: "Inter",
                fontSize: 52,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: "#FFFFFF",
                fontWeight: 900,
                display: "flex",
              }}>
                Breaking News
              </div>
            </div>
          </div>

          {/* OUTAGE NOTIFICATION CARDS — bigger, straight, proper IG + FB logos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 56, alignItems: "center", width: "100%", position: "relative" }}>
            {/* Instagram card */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 28,
              padding: "26px 34px",
              width: 880,
              boxShadow: "0 28px 56px rgba(0,0,0,0.6)",
            }}>
              {/* Instagram icon — user-uploaded cutout */}
              <div style={{ display: "flex", flexShrink: 0, width: 104, height: 104, alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={igIconUrl} alt="Instagram" width={104} height={104} style={{ display: "flex", width: 104, height: 104, objectFit: "contain" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "Inter", fontSize: 38, fontWeight: 700, color: "#FFFFFF", display: "flex", letterSpacing: -0.5 }}>
                    Instagram
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: "rgba(255,255,255,0.55)", display: "flex" }}>
                    7:42 AM
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 10, background: "#F87171", display: "flex" }} />
                  <div style={{ fontFamily: "Outfit", fontSize: 22, color: "rgba(255,255,255,0.78)", display: "flex" }}>
                    Outage detected · servers unreachable
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook card */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 28,
              padding: "26px 34px",
              width: 880,
              boxShadow: "0 28px 56px rgba(0,0,0,0.6)",
            }}>
              {/* Facebook icon — user-uploaded cutout */}
              <div style={{ display: "flex", flexShrink: 0, width: 104, height: 104, alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fbIconUrl} alt="Facebook" width={104} height={104} style={{ display: "flex", width: 104, height: 104, objectFit: "contain" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "Inter", fontSize: 38, fontWeight: 700, color: "#FFFFFF", display: "flex", letterSpacing: -0.5 }}>
                    Facebook
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, color: "rgba(255,255,255,0.55)", display: "flex" }}>
                    7:51 AM
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 10, background: "#F87171", display: "flex" }} />
                  <div style={{ fontFamily: "Outfit", fontSize: 22, color: "rgba(255,255,255,0.78)", display: "flex" }}>
                    Outage detected · servers unreachable
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HEADLINE — centered */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 76, position: "relative" }}>
            {post.titleLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "Instrument Serif",
                  fontSize: 128,
                  lineHeight: 0.94,
                  letterSpacing: -3.6,
                  color: line.italic ? "#FFB347" : "#FFFFFF",
                  fontStyle: line.italic ? "italic" : "normal",
                  display: "flex",
                  textShadow: "0 4px 24px rgba(0,0,0,0.65)",
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Sub — full Meta-outage context, hosting close, centered, Inter for clean readability */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40, position: "relative" }}>
            <div style={{
              fontFamily: "Inter",
              fontSize: 32,
              lineHeight: 1.42,
              color: "#FFFFFF",
              maxWidth: 940,
              display: "flex",
              textAlign: "center",
              fontWeight: 500,
              textShadow: "0 2px 14px rgba(0,0,0,0.55)",
            }}>
              This morning Meta had an outage and Facebook, Instagram, Threads, and Messenger were all down briefly. This should never happen to your website. I hand-build websites that live on their own infrastructure. 99.99% uptime, no single point of failure. Take the code home or let me host it, your choice.
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1, display: "flex" }} />

          {/* PRICE NOTE — italic annotation, centered */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginBottom: 32,
            position: "relative",
          }}>
            <div style={{ width: 56, height: 2, background: "#FFB347", display: "flex" }} />
            <div style={{
              fontFamily: "Inter",
              fontSize: 34,
              color: "#FFFFFF",
              fontWeight: 700,
              display: "flex",
              textShadow: "0 2px 12px rgba(0,0,0,0.55)",
            }}>
              Managed hosting starting at $49 / month
            </div>
            <div style={{ width: 56, height: 2, background: "#FFB347", display: "flex" }} />
          </div>

          {/* BOTTOM ROW — logo + CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 28,
              borderTop: "1px solid rgba(255,255,255,0.18)",
              width: "100%",
            }}
          >
            {/* Built by Brian monitor logo */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ background: "#1A1A2E", borderRadius: 12, padding: 5, display: "flex" }}>
                <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 22px 11px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 10, height: 10, borderRadius: 10, background: "#2563EB", display: "flex", marginRight: 10 }} />
                    <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Instrument Serif", fontSize: 38, color: "#1A1A2E", lineHeight: 1 }}>
                      <div style={{ display: "flex" }}>Built</div>
                      <div style={{ fontStyle: "italic", color: "#0EA5E9", padding: "0 3px", display: "flex" }}>by</div>
                      <div style={{ display: "flex" }}>Brian</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#64748B", fontWeight: 600, marginTop: 6, display: "flex" }}>
                    Web Design
                  </div>
                </div>
              </div>
              <div style={{ width: 22, height: 6, background: "#1A1A2E", marginTop: 2, display: "flex" }} />
              <div style={{ width: 56, height: 4, background: "#1A1A2E", borderRadius: 4, marginTop: 1, display: "flex" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.75)", fontWeight: 600, display: "flex" }}>
                {post.cta}
              </div>
            </div>
          </div>
        </div>
      ),
      storyOpts
    );
  }

  // ─── ABOUT-DESIGNER LAYOUT — throwback photo + receipts + rankings ──────────
  if (post.customLayout === "about-designer") {
    const photoUrl = `${origin}/images/brian-young.jpg`;
    const kajeetUrl = `${origin}/images/kajeet-cut.png`;
    const rowanUrl = `${origin}/images/rowan-cut.png`;

    // Brand-icon SVGs — Satori-safe (only path/circle/rect/line, no defs/
    // gradients/text). Each is a self-contained 20x20 branded badge so it
    // works on any chip background. Stylized identifiers, not exact brand
    // logos, for editorial use.
    const LOGOS: Record<string, React.ReactNode> = {
      apple: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#FFFFFF"/>
          <path d="M16.4 17c-.6.9-1.3 1.8-2.3 1.8-1 0-1.3-.6-2.5-.6-1.2 0-1.5.6-2.4.6-1 0-1.7-.9-2.4-1.9-1.4-2-2.4-5.5-1-7.9.7-1.2 1.9-1.9 3.2-2 1 0 1.9.7 2.5.7.6 0 1.7-.8 2.9-.7.5 0 1.9.2 2.8 1.5-.1.1-1.7 1-1.6 2.9 0 2.3 2 3.1 2.1 3.1-.1.1-.3 1.1-1 2.2-.6.9-1.2 1.8-2.3 1.3z" fill="#000000"/>
          <path d="M13.6 6.5c.5-.6.8-1.5.7-2.4-.7 0-1.6.5-2.1 1.2-.5.5-.9 1.4-.8 2.2.9.1 1.7-.4 2.2-1z" fill="#000000"/>
        </svg>
      ),
      apple_white: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#FFFFFF"/>
          <path d="M16.4 17c-.6.9-1.3 1.8-2.3 1.8-1 0-1.3-.6-2.5-.6-1.2 0-1.5.6-2.4.6-1 0-1.7-.9-2.4-1.9-1.4-2-2.4-5.5-1-7.9.7-1.2 1.9-1.9 3.2-2 1 0 1.9.7 2.5.7.6 0 1.7-.8 2.9-.7.5 0 1.9.2 2.8 1.5-.1.1-1.7 1-1.6 2.9 0 2.3 2 3.1 2.1 3.1-.1.1-.3 1.1-1 2.2-.6.9-1.2 1.8-2.3 1.3z" fill="#000000"/>
          <path d="M13.6 6.5c.5-.6.8-1.5.7-2.4-.7 0-1.6.5-2.1 1.2-.5.5-.9 1.4-.8 2.2.9.1 1.7-.4 2.2-1z" fill="#000000"/>
        </svg>
      ),
      android: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#A4C639"/>
          <path d="M6 13.5 Q6 9 12 9 Q18 9 18 13.5 L18 16 L6 16 Z" fill="#FFFFFF"/>
          <line x1="8" y1="6" x2="9" y2="9" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"/>
          <line x1="16" y1="6" x2="15" y2="9" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="9.5" cy="12.5" r="0.8" fill="#A4C639"/>
          <circle cx="14.5" cy="12.5" r="0.8" fill="#A4C639"/>
        </svg>
      ),
      spotify: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#1DB954"/>
          <path d="M6 9 Q12 7.5 18 10" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M6.8 12.5 Q12 11 17.2 13" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M7.5 15.5 Q12 14.3 16.5 16" stroke="#FFFFFF" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        </svg>
      ),
      apple_music: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <rect width="24" height="24" rx="6" fill="#FA243C"/>
          <path d="M10 17.5 A1.8 1.8 0 1 1 11.8 15.7 L11.8 9 L16 7.5 L16 14.5 A1.8 1.8 0 1 1 14.2 12.7 L14.2 9.5 L11.8 10.2" fill="#FFFFFF"/>
        </svg>
      ),
      nintendo: (
        <svg width={22} height={20} viewBox="0 0 28 24" style={{ display: "flex" }}>
          <rect x="1" y="2" width="10" height="20" rx="3" fill="#E60012"/>
          <rect x="17" y="2" width="10" height="20" rx="3" fill="#1F1F1F"/>
          <circle cx="6" cy="8" r="1.5" fill="#FFFFFF"/>
          <line x1="4.5" y1="14" x2="7.5" y2="14" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="6" y1="12.5" x2="6" y2="15.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="22" cy="14" r="1.5" fill="#FFFFFF"/>
        </svg>
      ),
      xbox: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#107C10"/>
          <path d="M7 6 Q9 7 12 11 Q15 7 17 6 Q19 9 18.5 14 Q16 18 12 19 Q8 18 5.5 14 Q5 9 7 6z" fill="none" stroke="#FFFFFF" strokeWidth="1.6"/>
          <path d="M7 18 Q12 12 17 6" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
      ),
      playstation: (
        <svg width={22} height={20} viewBox="0 0 28 24" style={{ display: "flex" }}>
          <rect width="28" height="24" rx="4" fill="#003791"/>
          <polygon points="7,5 4,10 10,10" fill="none" stroke="#1A8E5B" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="20" cy="7.5" r="2.8" fill="none" stroke="#E45353" strokeWidth="1.5"/>
          <line x1="4.5" y1="14" x2="9.5" y2="19" stroke="#56A8E0" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="9.5" y1="14" x2="4.5" y2="19" stroke="#56A8E0" strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="17" y="14" width="5.5" height="5.5" fill="none" stroke="#E48EBE" strokeWidth="1.5"/>
        </svg>
      ),
      instagram: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <rect x="1" y="1" width="22" height="22" rx="6" fill="#D62976"/>
          <rect x="1" y="1" width="22" height="22" rx="6" fill="#962FBF" opacity="0.5"/>
          <circle cx="12" cy="12" r="5" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
          <circle cx="17.5" cy="6.5" r="1.3" fill="#FFFFFF"/>
        </svg>
      ),
      tiktok: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#010101"/>
          <path d="M13.5 6 L13.5 14.5 A2.3 2.3 0 1 1 11.2 12.2 L11.2 9 L15 9 Q15.5 8 16 8 L16 6 Z" fill="#FFFFFF"/>
          <circle cx="11.2" cy="14.5" r="2.3" fill="none" stroke="#25F4EE" strokeWidth="1.2" opacity="0.7" transform="translate(-1 1)"/>
          <circle cx="11.2" cy="14.5" r="2.3" fill="none" stroke="#FE2C55" strokeWidth="1.2" opacity="0.7" transform="translate(1 -1)"/>
        </svg>
      ),
      x: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#000000"/>
          <path d="M7 7 L17 17" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round"/>
          <path d="M17 7 L7 17" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round"/>
        </svg>
      ),
      facebook: (
        <svg width={20} height={20} viewBox="0 0 24 24" style={{ display: "flex" }}>
          <circle cx="12" cy="12" r="12" fill="#1877F2"/>
          <path d="M15.5 8 L14 8 Q12.5 8 12.5 9.5 L12.5 11.5 L10.5 11.5 L10.5 13.8 L12.5 13.8 L12.5 19 L14.8 19 L14.8 13.8 L16.5 13.8 L16.8 11.5 L14.8 11.5 L14.8 10 Q14.8 9.5 15.3 9.5 L16 9.5 Z" fill="#FFFFFF"/>
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
            background: "linear-gradient(180deg, #FFA94D 0%, #FF7847 40%, #D44A23 75%, #6B1F0B 100%)",
            color: "#FFFFFF",
            padding: `${PAD_Y}px ${PAD_X}px`,
            fontFamily: "Outfit",
            position: "relative",
          }}
        >
          {/* TOP META */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", color: "#FFE9A8", fontWeight: 700, display: "flex" }}>
              {post.topRightLabel}
            </div>
          </div>

          {/* KICKER — centered */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 22 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, letterSpacing: 4, textTransform: "uppercase", color: "#FFE9A8", fontWeight: 700, display: "flex" }}>
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
                    color: line.italic ? "#FFE9A8" : "#FFFFFF",
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

          {/* THROWBACK PHOTO — slimmer to give receipts + rankings room */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 18, marginBottom: 16 }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              background: "#F4EFE4",
              padding: 12,
              paddingBottom: 24,
              boxShadow: "0 22px 32px rgba(0,0,0,0.5), 0 5px 0 rgba(0,0,0,0.16)",
              alignItems: "center",
              width: 720,
            }}>
              <div style={{ display: "flex", width: 696, height: 320, overflow: "hidden", borderRadius: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Brian as a kid at a CRT computer"
                  width={696}
                  height={320}
                  style={{ display: "flex", width: 696, height: 320, objectFit: "cover", objectPosition: "center 35%" }}
                />
              </div>
              <div style={{
                marginTop: 8,
                fontFamily: "JetBrains Mono",
                fontSize: 13,
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

          {/* TWO COLUMNS — Receipts + Rankings — flex:1 to fill down to logo */}
          <div style={{ display: "flex", flexDirection: "row", gap: 28, marginTop: 4, flex: 1 }}>

            {/* LEFT — Receipts */}
            <div style={{ display: "flex", flexDirection: "column", width: 420 }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#FFE9A8", fontWeight: 700, display: "flex", marginBottom: 14 }}>
                Official Receipts
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, justifyContent: "space-between" }}>
                {/* BS Degree row with Rowan owl */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "rgba(255,233,168,0.12)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  borderRadius: 14,
                  padding: "16px 18px",
                }}>
                  <div style={{ display: "flex", width: 68, height: 68, alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rowanUrl} alt="Rowan University" width={68} height={68} style={{ display: "flex", width: 68, height: 68, objectFit: "contain" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", display: "flex", marginBottom: 4, fontWeight: 600 }}>
                      Bachelor&apos;s · Rowan University
                    </div>
                    <div style={{ fontFamily: "Instrument Serif", fontSize: 26, color: "#FFFFFF", lineHeight: 1.1, display: "flex" }}>
                      Management Information Systems
                    </div>
                  </div>
                </div>

                {/* MBA row with Rowan owl */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "rgba(255,233,168,0.12)",
                  border: "1px solid rgba(34,211,238,0.25)",
                  borderRadius: 14,
                  padding: "16px 18px",
                }}>
                  <div style={{ display: "flex", width: 68, height: 68, alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rowanUrl} alt="Rowan University" width={68} height={68} style={{ display: "flex", width: 68, height: 68, objectFit: "contain" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", display: "flex", marginBottom: 4, fontWeight: 600 }}>
                      MBA · In Progress
                    </div>
                    <div style={{ fontFamily: "Instrument Serif", fontSize: 26, color: "#FFFFFF", lineHeight: 1.1, display: "flex" }}>
                      Finishing <span style={{ fontStyle: "italic", color: "#FFE9A8", paddingLeft: 6, display: "flex" }}>Spring &apos;27</span>
                    </div>
                  </div>
                </div>

                {/* Kajeet phone — cutout on gray panel */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "linear-gradient(135deg, #3A3F4B 0%, #25282F 100%)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  padding: "14px 18px",
                }}>
                  <div style={{ display: "flex", width: 68, height: 82, alignItems: "center", justifyContent: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={kajeetUrl} alt="LG Kajeet phone" width={68} height={82} style={{ display: "flex", width: 68, height: 82, objectFit: "contain" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", display: "flex", marginBottom: 4, fontWeight: 600 }}>
                      First Phone
                    </div>
                    <div style={{ fontFamily: "Instrument Serif", fontSize: 26, color: "#FFFFFF", lineHeight: 1.1, display: "flex" }}>
                      <span style={{ fontStyle: "italic", color: "#FB7185", paddingRight: 8, display: "flex" }}>LG</span> Kajeet
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Rankings — spread across column height to match receipts */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontFamily: "JetBrains Mono", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#FACC15", fontWeight: 700, display: "flex", marginBottom: 14 }}>
                Unofficial Rankings
              </div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                {RANKINGS.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    {/* Winner — full color + logo */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: r.winner.bg,
                      color: r.winner.fg,
                      padding: "8px 14px 8px 10px",
                      borderRadius: 999,
                      fontFamily: "Outfit",
                      fontSize: 16,
                      fontWeight: 700,
                      boxShadow: "0 3px 0 rgba(0,0,0,0.3)",
                    }}>
                      {r.winner.logo && LOGOS[r.winner.logo === "apple" ? (r.winner.fg === "#FFFFFF" ? "apple_white" : "apple") : r.winner.logo]}
                      <div style={{ display: "flex" }}>{r.winner.name}</div>
                    </div>
                    {r.losers.map((l, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ fontFamily: "JetBrains Mono", fontSize: 16, color: "rgba(255,255,255,0.55)", fontWeight: 700, display: "flex" }}>
                          &gt;
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: l.bg,
                          color: l.fg,
                          padding: "7px 12px 7px 9px",
                          borderRadius: 999,
                          fontFamily: "Outfit",
                          fontSize: 14,
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
                <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, color: "#FFE9A8", fontWeight: 700, marginLeft: 8, display: "flex" }}>→</div>
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
