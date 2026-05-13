'use client';

import { useRef } from 'react';
import { Download } from 'lucide-react';

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-paper text-ink pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="pb-5 border-b border-rule mb-12">
          <p className="font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
            ✦ Internal · Brand Assets
          </p>
          <h1 className="font-serif text-[clamp(36px,5.5vw,64px)] leading-[0.95] tracking-[-0.025em] mt-3">
            Brand <span className="italic text-forest">assets.</span>
          </h1>
          <p className="text-ink-soft text-[16px] mt-5 leading-relaxed max-w-2xl font-medium">
            Instagram avatar at 1:1, plus size previews. Click <strong className="text-ink">Download PNG</strong> below
            to save the 1080×1080 version (Instagram&apos;s recommended size for profile pics).
          </p>
        </div>

        {/* Size previews row */}
        <section className="mb-16">
          <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted mb-6">
            How it appears at IG sizes
          </p>
          <div className="flex flex-wrap items-end gap-8">
            {[
              { size: 40, label: "Comment / search · 40px" },
              { size: 64, label: "Story bubble · 64px" },
              { size: 110, label: "Mobile profile · 110px" },
              { size: 160, label: "Desktop profile · 160px" },
            ].map(({ size, label }) => (
              <div key={size} className="flex flex-col items-center gap-3">
                <BrandAvatar size={size} circle />
                <p className="font-mono text-[10px] tracking-[0.15em] text-ink-muted text-center max-w-[120px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Big preview + download */}
        <section className="mb-16">
          <div className="flex items-baseline justify-between pb-3 border-b border-rule mb-6">
            <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
              Primary mark · 1080×1080
            </p>
            <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
              Brand / 001
            </p>
          </div>
          <DownloadableAvatar />
        </section>

        {/* Wordmark version for site */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between pb-3 border-b border-rule mb-6">
            <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
              Wordmark (used in navbar)
            </p>
            <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
              Brand / 002
            </p>
          </div>
          <div className="bg-paper-soft border border-rule rounded-[6px] p-12 flex items-center justify-center">
            <span className="inline-flex items-center gap-3 select-none">
              <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-forest" />
              <span className="flex flex-col items-start leading-none gap-1.5">
                <span className="font-serif text-[44px] leading-none text-ink tracking-tight">
                  Built<span className="italic text-clay px-[2px]">by</span>Brian
                </span>
                <span className="font-mono text-[12px] tracking-[0.32em] uppercase text-ink-muted leading-none font-semibold">
                  Web Design
                </span>
              </span>
            </span>
          </div>
        </section>

        {/* Notes */}
        <section className="pt-8 border-t border-rule">
          <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted mb-3">
            Notes
          </p>
          <ul className="text-ink-soft text-[14px] leading-relaxed space-y-2 font-medium">
            <li>• Avatar uses primary blue gradient (#2563EB → #1E40AF) with white wordmark.</li>
            <li>• Instagram crops profile pics to a circle — the avatar is designed to work in both square and circular crops.</li>
            <li>• If the wordmark needs to appear on a light background (business card, email signature), use the Wordmark version above on white/cream.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* Avatar component — proportional to size                              */
/* ──────────────────────────────────────────────────────────────────── */

function BrandAvatar({ size = 640, circle = false }: { size?: number; circle?: boolean }) {
  const titleSize = size * 0.155;
  const tagSize = size * 0.042;
  const dividerWidth = size * 0.20;
  const radius = circle ? size / 2 : size * 0.10;

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
        borderRadius: radius,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.025,
        boxShadow: size > 200 ? "0 12px 40px -8px rgba(37,99,235,0.45)" : undefined,
        flexShrink: 0,
      }}
    >
      {/* Subtle sparkle accents — only visible at larger sizes */}
      {size >= 200 && (
        <>
          <span style={{ position: "absolute", top: size * 0.075, right: size * 0.10, color: "rgba(255,255,255,0.45)", fontSize: size * 0.04, lineHeight: 1 }} aria-hidden>✦</span>
          <span style={{ position: "absolute", bottom: size * 0.095, left: size * 0.08, color: "rgba(255,255,255,0.30)", fontSize: size * 0.028, lineHeight: 1 }} aria-hidden>✦</span>
        </>
      )}

      {/* Wordmark */}
      <div
        style={{
          fontFamily: "var(--font-instrument), Georgia, serif",
          color: "#FFFFFF",
          textAlign: "center",
          lineHeight: 0.92,
          letterSpacing: "-0.025em",
        }}
      >
        <div style={{ fontSize: titleSize, fontWeight: 400 }}>Built</div>
        <div style={{ fontSize: titleSize, fontWeight: 400, marginTop: size * 0.01 }}>
          <span style={{ fontStyle: "italic", opacity: 0.78 }}>by </span>
          Brian
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: dividerWidth,
          height: Math.max(1, size * 0.0035),
          background: "rgba(255,255,255,0.45)",
        }}
        aria-hidden
      />

      {/* Tagline */}
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
          fontSize: tagSize,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.95)",
          fontWeight: 600,
        }}
      >
        Web Design
      </div>
    </div>
  );
}

/* Big version with download — uses html-to-canvas via dom-to-image fallback. */
function DownloadableAvatar() {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const node = targetRef.current;
    if (!node) return;

    // Use html2canvas-style approach via foreignObject + SVG → canvas → PNG.
    // No external lib: render the DOM node into an SVG <foreignObject>, then
    // draw the SVG onto a canvas, then export as PNG.
    const SIZE = 1080;
    const html = node.outerHTML;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${SIZE}px;height:${SIZE}px;">
          ${html}
        </div>
      </foreignObject>
    </svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "builtbybrian-avatar.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };
    img.onerror = () => {
      // Fallback: open SVG in a new tab and instruct user to screenshot/save.
      window.open(url, "_blank");
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-paper-soft border border-rule rounded-[8px] p-8 flex items-center justify-center overflow-hidden">
        <div ref={targetRef} style={{ display: "inline-block" }}>
          <BrandAvatar size={480} circle={false} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 bg-forest text-paper font-semibold px-6 py-3 rounded-[6px] hover:bg-forest-deep transition-colors text-[14px]"
          style={{ boxShadow: "0 8px 24px -8px rgba(37,99,235,0.5)" }}
        >
          <Download size={15} strokeWidth={2} />
          Download PNG (1080×1080)
        </button>
        <p className="text-ink-muted text-[13px] font-medium">
          If the auto-download doesn&apos;t produce a clean PNG, you can also screenshot the preview above at full resolution.
        </p>
      </div>
    </div>
  );
}
