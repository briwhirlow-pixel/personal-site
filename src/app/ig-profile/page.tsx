// Brian's IG profile pic preview — NOT linked from the main site.
// Six anti-AI directions. Plus Jakarta Sans wordmark = same font as the site.
// Wordmark: "builtbybrian" (lowercase, matches the URL).

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IG Profile Picture Preview",
  robots: { index: false, follow: false },
};

const FONT = jakarta.style.fontFamily;

// Palettes ─────────────────────────────────────────────────────
const BONE = "#F2EAD6";
const BONE_LIGHT = "#F5EBDF";
const CREAM_WARM = "#FAF5E9";
const CREAM_DINER = "#FDF6E3";
const INK_DEEP = "#1A1814";
const INK = "#0A0A1F";

const RISO_BLUE = "#1F3CFF";
const RISO_PINK = "#FF4FA3";

const DINER_RED = "#C8231C";
const SIGN_BROWN = "#3A1F0F";

const FELT_RED = "#7A1F1A";
const FELT_RED_DARK = "#5C1612";
const PATCH_CREAM = "#F0E6CC";

// All variants are downloadable
const DOWNLOADABLE = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

function VariantFrame({ id, name, description, children }: { id: string; name: string; description: string; children: React.ReactNode }) {
  const canDownload = DOWNLOADABLE.has(id);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div id={id} style={{ width: 360, height: 360, borderRadius: "50%", overflow: "hidden", boxShadow: "0 14px 40px rgba(0,0,0,0.18)", border: `4px solid ${BONE_LIGHT}` }}>
        {children}
      </div>
      <div style={{ textAlign: "center", fontFamily: FONT, maxWidth: 360 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: INK_DEEP }}>{name}</div>
        <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, marginBottom: 10, lineHeight: 1.5 }}>{description}</div>
        {canDownload && (
          <a
            href={`/api/ig-logo/${id}`}
            download={`builtbybrian-ig-${id}.png`}
            style={{
              display: "inline-block",
              padding: "8px 18px",
              background: INK_DEEP,
              color: BONE_LIGHT,
              borderRadius: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textDecoration: "none",
            }}
          >
            ↓ DOWNLOAD 1080×1080
          </a>
        )}
      </div>
    </div>
  );
}

// H1 — Letterpress (bone + ink) ────────────────────────────────
function H1() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: BONE,
      backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(26,24,20,0.018) 3px, rgba(26,24,20,0.018) 4px)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT,
      padding: 40,
      position: "relative",
    }}>
      <span style={{ position: "absolute", top: 64, fontSize: 16, color: INK_DEEP, letterSpacing: "0.5em", fontWeight: 600, opacity: 0.55 }}>EST · 2024</span>
      <span style={{
        fontSize: 32, fontWeight: 500, color: INK_DEEP, letterSpacing: "-0.025em",
        textShadow: `0.5px 0.5px 0 rgba(26,24,20,0.18)`,
      }}>builtbybrian</span>
      <div style={{ width: 90, height: 1, background: INK_DEEP, opacity: 0.4, marginTop: 14 }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: INK_DEEP, opacity: 0.65, letterSpacing: "0.36em", marginTop: 12 }}>WEB DESIGN</span>
      <span style={{ position: "absolute", bottom: 64, fontSize: 18, color: INK_DEEP, opacity: 0.5 }}>⁂</span>
    </div>
  );
}

// H2 — Riso Two-Color (misregister) ───────────────────────────
function H2() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: BONE_LIGHT,
      backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(26,24,20,0.07) 0.7px, transparent 0)`,
      backgroundSize: "5px 5px",
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      fontFamily: FONT,
    }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Pink layer (offset) */}
        <span style={{
          position: "absolute", top: 4, left: 4,
          fontSize: 30, fontWeight: 700, color: RISO_PINK, letterSpacing: "-0.025em",
          mixBlendMode: "multiply",
        }}>builtbybrian</span>
        {/* Blue layer (on top) */}
        <span style={{
          fontSize: 30, fontWeight: 700, color: RISO_BLUE, letterSpacing: "-0.025em",
          mixBlendMode: "multiply",
        }}>builtbybrian</span>
        <span style={{
          marginTop: 22, fontSize: 11, fontWeight: 700, color: RISO_BLUE, letterSpacing: "0.4em",
        }}>WEB · DESIGN</span>
      </div>
    </div>
  );
}

// H3 — Bold wordmark + hand-drawn underline + WEB DESIGN ─────
function H3() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: CREAM_WARM,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT,
      padding: 40,
    }}>
      <div style={{
        transform: "rotate(-1.5deg)",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.015em" }}>
          <span style={{ color: "#0E0C0A" }}>built</span>
          <span style={{ color: "#0EA5E9" }}>by</span>
          <span style={{ color: "#0E0C0A" }}>brian</span>
        </span>
        <span style={{ fontSize: 17, color: "#0E0C0A", letterSpacing: "0.42em", marginTop: 18, fontWeight: 700 }}>WEB DESIGN</span>
      </div>
    </div>
  );
}

// H4 — Sign Painter / Diner ──────────────────────────────────
function H4() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: CREAM_DINER,
      backgroundImage: `radial-gradient(circle at 50% 50%, ${CREAM_DINER} 0%, #F5EBC7 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT,
      padding: 40,
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: SIGN_BROWN, letterSpacing: "0.36em", marginBottom: 16 }}>★ PHILADELPHIA ★</span>
      <span style={{
        fontSize: 34, fontWeight: 800, color: DINER_RED, letterSpacing: "-0.015em",
        textShadow: `3px 3px 0 ${SIGN_BROWN}`,
      }}>builtbybrian</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
        <span style={{ width: 18, height: 1, background: SIGN_BROWN }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: SIGN_BROWN, letterSpacing: "0.36em" }}>WEB DESIGN</span>
        <span style={{ width: 18, height: 1, background: SIGN_BROWN }} />
      </div>
    </div>
  );
}

// H5 — Stadium Patch (chenille felt) ──────────────────────────
function H5() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: FELT_RED,
      backgroundImage: `repeating-linear-gradient(45deg, ${FELT_RED} 0px, ${FELT_RED} 2px, ${FELT_RED_DARK} 2px, ${FELT_RED_DARK} 3px)`,
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      fontFamily: FONT,
      padding: 26,
    }}>
      <div style={{
        width: "100%", height: "100%",
        border: `3px dashed ${PATCH_CREAM}`,
        borderRadius: "50%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: 28,
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: PATCH_CREAM, letterSpacing: "0.5em", opacity: 0.85, marginBottom: 14 }}>EST · 2024</span>
        <span style={{
          fontSize: 28, fontWeight: 800, color: PATCH_CREAM, letterSpacing: "-0.015em",
          textShadow: `0 2px 0 ${FELT_RED_DARK}, 0 0 0 1px ${FELT_RED_DARK}`,
        }}>builtbybrian</span>
        <div style={{ width: 50, height: 2, background: PATCH_CREAM, marginTop: 16, opacity: 0.7 }} />
        <span style={{ fontSize: 11, fontWeight: 800, color: PATCH_CREAM, letterSpacing: "0.42em", marginTop: 14 }}>PHILLY</span>
      </div>
    </div>
  );
}

// H6 — Photocopy Zine (B&W) ───────────────────────────────────
function H6() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#FFFFFF",
      backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 3px), repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: FONT,
      padding: 40,
      position: "relative",
    }}>
      <div style={{
        width: 220, height: 220, border: "3px solid #000",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        transform: "rotate(-2deg)",
        background: "#FFFFFF",
        padding: 14,
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: "#000", letterSpacing: "0.42em", marginBottom: 14 }}>BB · ZINE</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#000", letterSpacing: "-0.02em", textAlign: "center", lineHeight: 1.1 }}>
          builtby<br />brian
        </span>
        <div style={{ width: 80, height: 4, background: "#000", marginTop: 14 }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: "#000", letterSpacing: "0.36em", marginTop: 12 }}>NO. 01</span>
      </div>
    </div>
  );
}

// PAGE ─────────────────────────────────────────────────────────
export default function IGProfilePreview() {
  const variants = [
    { id: "h1", Component: H1, name: "H1 — Letterpress", description: "Bone paper + ink black. Pressed metal-type feel with letterpress shadow and a printer's ornament." },
    { id: "h2", Component: H2, name: "H2 — Riso Two-Color", description: "Ultramarine + hot pink double-print with misregister offset and halftone dot grain. Indie print shop." },
    { id: "h3", Component: H3, name: "H3 — Bold + Sky Blue 'by'", description: "Bold wordmark with 'by' colored sky blue (#0EA5E9, same as the Start a project button). Hand-drawn underline + WEB DESIGN tagline. NOW LIVE AS THE SITE LOGO." },
    { id: "h4", Component: H4, name: "H4 — Diner Sign Painter", description: "Cream + diner red with hand-painted shadow + stars. Mid-century shop sign / hometown menu." },
    { id: "h5", Component: H5, name: "H5 — Stadium Patch", description: "Chenille felt diagonal weave, dashed embroidered border, varsity-block wordmark. Philly sports patch." },
    { id: "h6", Component: H6, name: "H6 — Photocopy Zine", description: "B&W with intentional photocopy noise, slight rotation, hand-stamped 'NO. 01' label. Anti-polish on purpose." },
  ];

  return (
    <main className={jakarta.className} style={{ minHeight: "100vh", background: BONE_LIGHT, padding: "60px 24px", fontFamily: FONT }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <header style={{ marginBottom: 56, textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.36em", fontWeight: 700, color: INK_DEEP, marginBottom: 12, opacity: 0.65 }}>
            INTERNAL PREVIEW · ANTI-SLOP DIRECTION
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 600, color: INK_DEEP, letterSpacing: "-0.025em", marginBottom: 16, lineHeight: 1 }}>
            IG Profile Picture — Hand-Made Directions
          </h1>
          <p style={{ fontSize: 15, color: "#475569", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>
            Six directions that read as <em>made by a human</em>, not generated. Same font as the site (Plus Jakarta Sans). Each preview shown as IG will crop it (circle). Click DOWNLOAD to grab the 1080×1080 PNG.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 48, justifyItems: "center" }}>
          {variants.map(({ id, Component, name, description }) => (
            <VariantFrame key={id} id={id} name={name} description={description}>
              <Component />
            </VariantFrame>
          ))}
        </div>

        <footer style={{ marginTop: 72, paddingTop: 32, borderTop: `1px solid #E5DBC2`, textAlign: "center", fontSize: 13, color: "#64748B", fontFamily: FONT }}>
          Pick one (H1–H6) and I&apos;ll lock it in across the rest of the IG kit (posts, Reels covers, story stickers).
        </footer>
      </div>
    </main>
  );
}
