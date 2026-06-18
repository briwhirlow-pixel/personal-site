import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

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

const SIZE = 1080;
const SCALE = SIZE / 360;

// Palettes (mirror /ig-profile page) ──────────────────────────
const BONE = "#F2EAD6";
const BONE_LIGHT = "#F5EBDF";
const CREAM_WARM = "#FAF5E9";
const CREAM_DINER = "#FDF6E3";
const INK_DEEP = "#1A1814";
const RISO_BLUE = "#1F3CFF";
const RISO_PINK = "#FF4FA3";
const DINER_RED = "#C8231C";
const SIGN_BROWN = "#3A1F0F";
const FELT_RED = "#7A1F1A";
const FELT_RED_DARK = "#5C1612";
const PATCH_CREAM = "#F0E6CC";

// H1 — Letterpress ─────────────────────────────────────────────
function renderH1() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: BONE,
      backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent ${3 * SCALE}px, rgba(26,24,20,0.018) ${3 * SCALE}px, rgba(26,24,20,0.018) ${4 * SCALE}px)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans",
      padding: 40 * SCALE,
      position: "relative",
    }}>
      <span style={{ position: "absolute", top: 64 * SCALE, fontSize: 16 * SCALE, color: INK_DEEP, letterSpacing: "0.5em", fontWeight: 600, opacity: 0.55 }}>EST · 2024</span>
      <span style={{
        fontSize: 96 * SCALE * 0.34, fontWeight: 500, color: INK_DEEP, letterSpacing: "-0.025em",
        textShadow: `${1.5 * SCALE}px ${1.5 * SCALE}px 0 rgba(26,24,20,0.18)`,
      }}>builtbybrian</span>
      <div style={{ width: 90 * SCALE, height: SCALE, background: INK_DEEP, opacity: 0.4, marginTop: 14 * SCALE }} />
      <span style={{ fontSize: 11 * SCALE, fontWeight: 600, color: INK_DEEP, opacity: 0.65, letterSpacing: "0.36em", marginTop: 12 * SCALE }}>WEB DESIGN</span>
      <span style={{ position: "absolute", bottom: 64 * SCALE, fontSize: 18 * SCALE, color: INK_DEEP, opacity: 0.5 }}>⁂</span>
    </div>
  );
}

// H2 — Riso Two-Color ─────────────────────────────────────────
function renderH2() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: BONE_LIGHT,
      backgroundImage: `radial-gradient(circle at ${1.5 * SCALE}px ${1.5 * SCALE}px, rgba(26,24,20,0.07) ${0.7 * SCALE}px, transparent 0)`,
      backgroundSize: `${5 * SCALE}px ${5 * SCALE}px`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans",
    }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{
          position: "absolute", top: 4 * SCALE, left: 4 * SCALE,
          fontSize: 30 * SCALE, fontWeight: 700, color: RISO_PINK, letterSpacing: "-0.025em",
        }}>builtbybrian</span>
        <span style={{
          fontSize: 30 * SCALE, fontWeight: 700, color: RISO_BLUE, letterSpacing: "-0.025em",
        }}>builtbybrian</span>
        <span style={{
          marginTop: 22 * SCALE, fontSize: 11 * SCALE, fontWeight: 700, color: RISO_BLUE, letterSpacing: "0.4em",
        }}>WEB · DESIGN</span>
      </div>
    </div>
  );
}

// H3 — Site logo mirror (icon + bold wordmark, "by" in sky blue) ─
function renderH3() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#EAE3D5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans",
      padding: 40 * SCALE,
    }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 18 * SCALE }}>
        <svg width={76 * SCALE} height={62 * SCALE} viewBox="0 0 24 20" fill="none">
          <rect x="3" y="1" width="18" height="13" rx="2" stroke="#0E0C0A" strokeWidth="1.5" />
          <path d="M1 16.5h22" stroke="#0E0C0A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 14v2.5M16 14v2.5" stroke="#0E0C0A" strokeWidth="1.2" opacity="0.4" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <div style={{ display: "flex", flexDirection: "row", fontSize: 32 * SCALE, fontWeight: 800, letterSpacing: "-0.025em" }}>
            <span style={{ color: "#0E0C0A" }}>built</span>
            <span style={{ color: "#0EA5E9" }}>by</span>
            <span style={{ color: "#0E0C0A" }}>brian</span>
          </div>
          <span style={{ fontSize: 10 * SCALE, color: "rgba(14,12,10,0.55)", letterSpacing: "0.32em", marginTop: 8 * SCALE, fontWeight: 500 }}>
            web design
          </span>
        </div>
      </div>
    </div>
  );
}

// H4 — Sign Painter / Diner ──────────────────────────────────
function renderH4() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `radial-gradient(circle at 50% 50%, ${CREAM_DINER} 0%, #F5EBC7 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans",
      padding: 40 * SCALE,
    }}>
      <span style={{ fontSize: 11 * SCALE, fontWeight: 700, color: SIGN_BROWN, letterSpacing: "0.36em", marginBottom: 16 * SCALE }}>★ PHILADELPHIA ★</span>
      <span style={{
        fontSize: 34 * SCALE, fontWeight: 800, color: DINER_RED, letterSpacing: "-0.015em",
        textShadow: `${3 * SCALE}px ${3 * SCALE}px 0 ${SIGN_BROWN}`,
      }}>builtbybrian</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 * SCALE, marginTop: 20 * SCALE }}>
        <span style={{ width: 18 * SCALE, height: SCALE, background: SIGN_BROWN }} />
        <span style={{ fontSize: 11 * SCALE, fontWeight: 700, color: SIGN_BROWN, letterSpacing: "0.36em" }}>WEB DESIGN</span>
        <span style={{ width: 18 * SCALE, height: SCALE, background: SIGN_BROWN }} />
      </div>
    </div>
  );
}

// H5 — Stadium Patch ──────────────────────────────────────────
function renderH5() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: FELT_RED,
      backgroundImage: `repeating-linear-gradient(45deg, ${FELT_RED} 0px, ${FELT_RED} ${2 * SCALE}px, ${FELT_RED_DARK} ${2 * SCALE}px, ${FELT_RED_DARK} ${3 * SCALE}px)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans",
      padding: 26 * SCALE,
    }}>
      <div style={{
        width: "100%", height: "100%",
        border: `${3 * SCALE}px dashed ${PATCH_CREAM}`,
        borderRadius: "50%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 28 * SCALE,
      }}>
        <span style={{ fontSize: 10 * SCALE, fontWeight: 800, color: PATCH_CREAM, letterSpacing: "0.5em", opacity: 0.85, marginBottom: 14 * SCALE }}>EST · 2024</span>
        <span style={{
          fontSize: 28 * SCALE, fontWeight: 800, color: PATCH_CREAM, letterSpacing: "-0.015em",
          textShadow: `0 ${2 * SCALE}px 0 ${FELT_RED_DARK}`,
        }}>builtbybrian</span>
        <div style={{ width: 50 * SCALE, height: 2 * SCALE, background: PATCH_CREAM, marginTop: 16 * SCALE, opacity: 0.7 }} />
        <span style={{ fontSize: 11 * SCALE, fontWeight: 800, color: PATCH_CREAM, letterSpacing: "0.42em", marginTop: 14 * SCALE }}>PHILLY</span>
      </div>
    </div>
  );
}

// H6 — Photocopy Zine ─────────────────────────────────────────
function renderH6() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#FFFFFF",
      backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent ${2 * SCALE}px, rgba(0,0,0,0.025) ${2 * SCALE}px, rgba(0,0,0,0.025) ${3 * SCALE}px), repeating-linear-gradient(90deg, transparent 0px, transparent ${3 * SCALE}px, rgba(0,0,0,0.015) ${3 * SCALE}px, rgba(0,0,0,0.015) ${4 * SCALE}px)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "Plus Jakarta Sans",
      padding: 40 * SCALE,
    }}>
      <div style={{
        width: 220 * SCALE, height: 220 * SCALE, border: `${3 * SCALE}px solid #000`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        transform: "rotate(-2deg)",
        background: "#FFFFFF",
        padding: 14 * SCALE,
      }}>
        <span style={{ fontSize: 10 * SCALE, fontWeight: 800, color: "#000", letterSpacing: "0.42em", marginBottom: 14 * SCALE }}>BB · ZINE</span>
        <span style={{ fontSize: 22 * SCALE, fontWeight: 800, color: "#000", letterSpacing: "-0.02em", textAlign: "center", lineHeight: 1.1, display: "flex", flexDirection: "column" }}>
          <span>builtby</span>
          <span>brian</span>
        </span>
        <div style={{ width: 80 * SCALE, height: 4 * SCALE, background: "#000", marginTop: 14 * SCALE }} />
        <span style={{ fontSize: 9 * SCALE, fontWeight: 700, color: "#000", letterSpacing: "0.36em", marginTop: 12 * SCALE }}>NO. 01</span>
      </div>
    </div>
  );
}

const RENDERERS: Record<string, () => React.ReactElement> = {
  h1: renderH1, h2: renderH2, h3: renderH3,
  h4: renderH4, h5: renderH5, h6: renderH6,
};

export async function GET(_req: NextRequest, ctx: { params: Promise<{ variant: string }> }) {
  const { variant } = await ctx.params;
  const renderer = RENDERERS[variant];
  if (!renderer) {
    return new Response(`Unknown variant: ${variant}`, { status: 404 });
  }

  const [jk500, jk700, jk800] = await Promise.all([
    loadGoogleFont("family=Plus+Jakarta+Sans:wght@500&text=builtbyrian"),
    loadGoogleFont("family=Plus+Jakarta+Sans:wght@700&text=BUILTBYRIANWEBDESIGN·PHILADELPHIA★NO.012024EST"),
    loadGoogleFont("family=Plus+Jakarta+Sans:wght@800&text=builtbyrianPHILY·BBZINENO.012024EST"),
  ]);

  return new ImageResponse(renderer(), {
    width: SIZE,
    height: SIZE,
    fonts: [
      { name: "Plus Jakarta Sans", data: jk500, weight: 500, style: "normal" },
      { name: "Plus Jakarta Sans", data: jk700, weight: 700, style: "normal" },
      { name: "Plus Jakarta Sans", data: jk800, weight: 800, style: "normal" },
    ],
  });
}
