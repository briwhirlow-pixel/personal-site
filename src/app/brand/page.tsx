'use client';

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
            Paste into Instagram &rarr; Edit Profile &rarr; Bio. The arrow at the end points to your link sticker / website URL.
          </p>
        </section>

        {/* Notes */}
        <section className="pt-8 border-t border-rule">
          <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted mb-3">
            Notes
          </p>
          <ul className="text-ink-soft text-[14px] leading-relaxed space-y-2 font-medium">
            <li>• Avatar matches the navbar wordmark: white card, forest dot, dark serif wordmark with italic sky-blue &ldquo;by&rdquo;, mono WEB DESIGN tagline.</li>
            <li>• Instagram crops profile pics to a circle — the centered layout works in both square and circular crops.</li>
            <li>• Border is subtle slate (#E2E8F0) so the avatar stays defined against Instagram&apos;s white feed without going heavy.</li>
            <li>• For a darker / branded alternative (e.g. profile pic on a dark social platform like X), use the blue gradient version of the wordmark on builtbybwhirl.com/about.</li>
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
  const dotSize = size * 0.022;
  const dividerWidth = size * 0.20;
  const radius = circle ? size / 2 : size * 0.10;

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#FFFFFF",
        border: `${Math.max(1, size * 0.002)}px solid #E2E8F0`,
        borderRadius: radius,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.025,
        flexShrink: 0,
      }}
    >
      {/* Forest dot — accent above wordmark */}
      <div
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: "#2D6A4F",
          marginBottom: size * 0.005,
        }}
        aria-hidden
      />

      {/* Wordmark */}
      <div
        style={{
          fontFamily: "var(--font-instrument), Georgia, serif",
          color: "#1A1A2E",
          textAlign: "center",
          lineHeight: 0.92,
          letterSpacing: "-0.025em",
        }}
      >
        <div style={{ fontSize: titleSize, fontWeight: 400 }}>Built</div>
        <div style={{ fontSize: titleSize, fontWeight: 400, marginTop: size * 0.01 }}>
          <span style={{ fontStyle: "italic", color: "#0EA5E9" }}>by </span>
          Brian
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: dividerWidth,
          height: Math.max(1, size * 0.0035),
          background: "#CBD5E1",
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
          color: "#64748B",
          fontWeight: 600,
        }}
      >
        Web Design
      </div>
    </div>
  );
}

/* Big preview + server-generated PNG download via /api/brand-avatar */
function DownloadableAvatar() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-paper-soft border border-rule rounded-[8px] p-8 flex items-center justify-center overflow-hidden">
        <BrandAvatar size={480} circle={false} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <a
          href="/api/brand-avatar"
          download="builtbybrian-avatar.png"
          className="inline-flex items-center gap-2 bg-forest text-paper font-semibold px-6 py-3 rounded-[6px] hover:bg-forest-deep transition-colors text-[14px]"
          style={{ boxShadow: "0 8px 24px -8px rgba(37,99,235,0.5)" }}
        >
          <Download size={15} strokeWidth={2} />
          Download PNG (1080×1080)
        </a>
        <p className="text-ink-muted text-[13px] font-medium">
          The PNG is generated server-side and downloads automatically.
        </p>
      </div>
    </div>
  );
}
