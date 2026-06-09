'use client';

import { Download, FileImage } from 'lucide-react';
import { useState } from 'react';

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
            The wordmark, displayed on a small monitor — same identity as the navbar logo,
            sized for Instagram, Facebook, X, and other social profile pics. Download as PNG
            (lossless, IG/FB recommend this) or JPEG (smaller file).
          </p>
        </div>

        {/* Size previews row */}
        <section className="mb-16">
          <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted mb-6">
            How it appears at social sizes
          </p>
          <div className="flex flex-wrap items-end gap-8">
            {[
              { size: 64, label: "Comment / search · 64px" },
              { size: 110, label: "Mobile profile · 110px" },
              { size: 160, label: "Desktop profile · 160px" },
              { size: 220, label: "Story bubble · 220px" },
            ].map(({ size, label }) => (
              <div key={size} className="flex flex-col items-center gap-3">
                <BrandAvatar size={size} circle />
                <p className="font-mono text-[10px] tracking-[0.15em] text-ink-muted text-center max-w-[140px]">
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
              Wordmark — for business cards, email signature
            </p>
            <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
              Brand / 002
            </p>
          </div>
          <div className="bg-paper-soft border border-rule rounded-[6px] p-12 flex items-center justify-center">
            <span className="inline-flex items-center gap-3 select-none">
              <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-forest" />
              <span className="font-serif text-[44px] leading-none text-ink tracking-tight">
                Built<span className="italic text-clay px-[2px]">by</span>Brian
              </span>
            </span>
          </div>
        </section>

        {/* Instagram bio */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between pb-3 border-b border-rule mb-6">
            <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
              Instagram bio — copy / paste
            </p>
            <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">
              Brand / 003
            </p>
          </div>
          <div className="bg-paper-soft border border-rule rounded-[6px] p-6 font-sans text-ink leading-[1.55] text-[15px] whitespace-pre-wrap select-text">
{`Hand-built websites for small businesses
📍 NJ + PHL · Designer & Developer
✦ 5-day first drafts · You own the code
👇 Start a project`}
          </div>
          <p className="text-ink-muted text-[12.5px] mt-3 font-medium">
            Paste into Instagram &rarr; Edit Profile &rarr; Bio.
          </p>
        </section>

        {/* Notes */}
        <section className="pt-8 border-t border-rule">
          <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted mb-3">
            Notes
          </p>
          <ul className="text-ink-soft text-[14px] leading-relaxed space-y-2 font-medium">
            <li>• The avatar is the BuiltByBrian wordmark rendered inside a small monitor — same brand identity as the navbar, scaled for social.</li>
            <li>• PNG = lossless, slightly larger file. JPEG = smaller, very subtle compression. IG/FB accept both; use whichever your platform asks for.</li>
            <li>• Instagram and most platforms crop profile pics to a circle. The monitor + stand sits in the center so the circular crop never clips the wordmark.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* BrandAvatar — wordmark on a tiny monitor (proportional to size)      */
/* ──────────────────────────────────────────────────────────────────── */

function BrandAvatar({ size = 640, circle = false }: { size?: number; circle?: boolean }) {
  const bezelRadius = circle ? size / 2 : size * 0.10;
  const screenW = size * 0.72;
  const screenH = size * 0.42;
  const screenRadius = size * 0.025;
  const bezelPad = size * 0.02;
  const wordSize = size * 0.11;
  const dotSize = size * 0.018;
  const dividerW = size * 0.18;
  const tagSize = size * 0.032;
  const neckW = size * 0.085;
  const neckH = size * 0.035;
  const baseW = size * 0.25;
  const baseH = size * 0.015;
  const showTagline = size >= 110; // tagline disappears at tiny avatar sizes

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#E9EDF3",
        borderRadius: bezelRadius,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Monitor bezel */}
      <div
        style={{
          background: "#1A1A2E",
          borderRadius: size * 0.035,
          padding: bezelPad,
        }}
      >
        {/* Inner screen */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: screenRadius,
            width: screenW,
            height: screenH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: size * 0.018,
          }}
        >
          <span
            aria-hidden
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize,
              background: "#2D6A4F",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-instrument), Georgia, serif",
              fontSize: wordSize,
              color: "#1A1A2E",
              lineHeight: 1,
              letterSpacing: "-0.025em",
              whiteSpace: "nowrap",
            }}
          >
            Built
            <span style={{ fontStyle: "italic", color: "#0EA5E9", padding: "0 0.05em" }}>
              by
            </span>
            Brian
          </span>
        </div>
      </div>

      {/* Monitor stand neck + base */}
      <span
        aria-hidden
        style={{ width: neckW, height: neckH, background: "#1A1A2E", marginTop: size * 0.005, display: "block" }}
      />
      <span
        aria-hidden
        style={{ width: baseW, height: baseH, background: "#1A1A2E", borderRadius: baseH, marginTop: 1, display: "block" }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/* Download UI — server PNG + client-side JPEG conversion               */
/* ──────────────────────────────────────────────────────────────────── */

function DownloadableAvatar() {
  const [jpegStatus, setJpegStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleJpegDownload = async () => {
    setJpegStatus("loading");
    try {
      const res = await fetch("/api/brand-avatar");
      if (!res.ok) throw new Error(`Avatar fetch failed: ${res.status}`);
      const pngBlob = await res.blob();

      // Decode the PNG → draw onto a canvas with a solid paper background
      // (JPEG has no transparency) → export as JPEG.
      const imgUrl = URL.createObjectURL(pngBlob);
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image decode failed"));
        img.src = imgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      ctx.fillStyle = "#E9EDF3";
      ctx.fillRect(0, 0, 1080, 1080);
      ctx.drawImage(img, 0, 0, 1080, 1080);
      URL.revokeObjectURL(imgUrl);

      const jpegBlob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.95)
      );
      if (!jpegBlob) throw new Error("JPEG encode failed");

      const url = URL.createObjectURL(jpegBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "builtbybrian-avatar.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setJpegStatus("idle");
    } catch (err) {
      console.error(err);
      setJpegStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-paper-soft border border-rule rounded-[8px] p-8 flex items-center justify-center overflow-hidden">
        <BrandAvatar size={480} circle={false} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="/api/brand-avatar"
          download="builtbybrian-avatar.png"
          className="inline-flex items-center gap-2 bg-forest text-paper font-semibold px-5 py-3 rounded-[6px] hover:bg-forest-deep transition-colors text-[14px]"
          style={{ boxShadow: "0 8px 24px -8px rgba(37,99,235,0.5)" }}
        >
          <Download size={15} strokeWidth={2} />
          Download PNG
        </a>
        <button
          type="button"
          onClick={handleJpegDownload}
          disabled={jpegStatus === "loading"}
          className="inline-flex items-center gap-2 bg-paper-soft border border-rule text-ink font-semibold px-5 py-3 rounded-[6px] hover:border-forest hover:text-forest transition-colors text-[14px] disabled:opacity-60 disabled:cursor-wait"
        >
          <FileImage size={15} strokeWidth={2} />
          {jpegStatus === "loading" ? "Generating…" : "Download JPEG"}
        </button>
        <p className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-muted">
          1080 × 1080 · Sized for IG / FB / X
        </p>
        {jpegStatus === "error" && (
          <p className="text-clay text-[12px] font-medium w-full">
            JPEG conversion failed — try the PNG download instead, or hard-refresh and retry.
          </p>
        )}
      </div>
    </div>
  );
}
