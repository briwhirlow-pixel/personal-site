"use client";

import { useEffect, useState } from "react";
import { igPosts } from "@/lib/igPosts";

/* ------------------------------------------------------------------
   AnimatedReels
   - Three looping reel-style previews for the Social Media admin tab.
   - Pure CSS animations, no JS animation loops. Lightweight, deterministic.
   - Each reel is a 9:16 phone-frame mockup. To post: screen-record the
     phone-frame area at 1080×1920 (e.g. macOS Cmd-Shift-5, region capture).
   - Mobile: Tap "Record" on any reel — it opens a fullscreen looping
     view sized for your phone, then you use iOS Control Center / Android
     Quick Settings to start the OS screen recorder. Stop, crop, upload.
   ------------------------------------------------------------------- */

type ReelMeta = {
  id: string;
  postId: string;          // pairs to an entry in lib/igPosts.ts for caption/tags reuse
  label: string;           // mono caption shown above the preview
  title: string;           // human title under the preview
  blurb: string;
  loopSec: number;
};

const REELS: ReelMeta[] = [
  {
    id: "reel-timeline",
    postId: "07",
    label: "REEL · 0:08 LOOP · 9:16",
    title: "Day 01 → Day 05",
    blurb: "5-day build timeline as a ticking-day animation. Pairs with Post 07 caption + Day 1–5 hashtags.",
    loopSec: 8,
  },
  {
    id: "reel-math",
    postId: "05",
    label: "REEL · 0:09 LOOP · 9:16",
    title: "The $16/mo math, visualized",
    blurb: "Live counter compares 'rent' vs 'own'. Pairs with Post 05 (subscription rot) caption.",
    loopSec: 9,
  },
  {
    id: "reel-speed",
    postId: "18",
    label: "REEL · 0:07 LOOP · 9:16",
    title: "Site speed — before / after",
    blurb: "Speedometer swings from 6.4s → 1.4s. Pairs with Post 18 (hidden cost of slow sites).",
    loopSec: 7,
  },
];

export default function AnimatedReels() {
  const [mounted, setMounted] = useState(false);
  const [recording, setRecording] = useState<ReelMeta | null>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (recording) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [recording]);

  return (
    <section className="mb-8">
      {/* Section header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/35 mb-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#22D3EE]"
              style={{ animation: "reel-pulse 1.8s ease-in-out infinite" }}
            />
            Animated Reels · Studio Drafts
          </p>
          <h3 className="text-white font-serif text-[24px] sm:text-[28px] leading-none tracking-tight">
            Three reels{" "}
            <span className="italic text-[#22D3EE]">looping live</span>
          </h3>
          <p className="text-white/55 text-[13px] sm:text-[14px] leading-relaxed max-w-2xl mt-2">
            CSS-animated mockups of three reel concepts already paired with caption + hashtags from the post library below. Screen-record the phone frame (Cmd-Shift-5 → region) to post as a real Instagram reel.
          </p>
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/35 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34D399]" />
          {mounted ? "Playback · Live" : "Loading"}
        </div>
      </div>

      {/* Reels strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {REELS.map((r) => (
          <ReelCard key={r.id} meta={r} onRecord={() => setRecording(r)} />
        ))}
      </div>

      {/* Mobile screen-recording instructions */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#13161F] border border-[#2A2D3A] rounded-[10px] p-4">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#22D3EE] mb-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            iPhone — Record a Reel
          </p>
          <ol className="text-white/75 text-[12.5px] leading-relaxed space-y-1.5 list-decimal pl-5">
            <li>Tap <strong className="text-white">Record</strong> on any reel above — opens fullscreen.</li>
            <li>Swipe down from top-right → tap red <strong className="text-white">●</strong> screen-record button.</li>
            <li>Wait one full loop (5–9 sec), tap red bar at top → Stop.</li>
            <li>Open Photos → trim the recording → upload to Instagram as a Reel.</li>
          </ol>
        </div>
        <div className="bg-[#13161F] border border-[#2A2D3A] rounded-[10px] p-4">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#22D3EE] mb-2 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" strokeLinejoin="round"><polygon points="14 2 18 2 18 22 14 22 14 2"/><polygon points="6 2 10 2 10 22 6 22 6 2"/></svg>
            Android — Record a Reel
          </p>
          <ol className="text-white/75 text-[12.5px] leading-relaxed space-y-1.5 list-decimal pl-5">
            <li>Tap <strong className="text-white">Record</strong> on any reel above — opens fullscreen.</li>
            <li>Swipe down twice for Quick Settings → tap <strong className="text-white">Screen Record</strong>.</li>
            <li>Wait one loop, slide notification → Stop.</li>
            <li>Open Photos / Gallery → trim → upload to Instagram as a Reel.</li>
          </ol>
        </div>
      </div>

      {/* Fullscreen recording overlay */}
      {recording && <RecordOverlay meta={recording} onClose={() => setRecording(null)} />}

      {/* Animation keyframes — scoped via global style tag, but only one of each */}
      <style jsx global>{`
        @keyframes reel-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes reel-day-cycle {
          0%, 18%   { transform: translateY(0); }
          20%, 38%  { transform: translateY(-100%); }
          40%, 58%  { transform: translateY(-200%); }
          60%, 78%  { transform: translateY(-300%); }
          80%, 100% { transform: translateY(-400%); }
        }
        @keyframes reel-day-bar {
          0%   { width: 8%; }
          25%  { width: 28%; }
          50%  { width: 50%; }
          75%  { width: 72%; }
          100% { width: 100%; }
        }
        @keyframes reel-money-tick {
          0%   { content: counter(year, decimal-leading-zero); }
          100% { content: counter(year, decimal-leading-zero); }
        }
        @keyframes reel-money-grow {
          0%   { transform: scaleY(0.05); }
          100% { transform: scaleY(1); }
        }
        @keyframes reel-counter {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes reel-needle {
          0%, 5%    { transform: rotate(-78deg); }
          45%, 60%  { transform: rotate(78deg); }
          85%, 100% { transform: rotate(-78deg); }
        }
        @keyframes reel-fade-cycle {
          0%, 8%   { opacity: 1; }
          10%, 90% { opacity: 0; }
          92%, 100% { opacity: 1; }
        }
        @keyframes reel-check {
          0%, 30%  { opacity: 0; transform: scale(0.6); }
          45%, 100% { opacity: 1; transform: scale(1); }
        }
        @keyframes reel-stripe {
          0%   { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes reel-grain {
          0%, 100% { transform: translate(0, 0); }
          25%      { transform: translate(-3%, 1%); }
          50%      { transform: translate(2%, -2%); }
          75%      { transform: translate(-1%, 3%); }
        }
        @keyframes reel-glow {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        @keyframes reel-cursor {
          0%, 50%  { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ─── Phone-frame wrapper ─────────────────────────────────────────── */

function ReelCard({ meta, onRecord }: { meta: ReelMeta; onRecord: () => void }) {
  const Reel =
    meta.id === "reel-timeline" ? ReelTimeline :
    meta.id === "reel-math"     ? ReelMath :
                                  ReelSpeed;

  return (
    <article className="bg-[#13161F] border border-[#2A2D3A] rounded-[14px] overflow-hidden flex flex-col">
      {/* Phone frame */}
      <div className="relative bg-[#0A0C12] p-4 flex items-center justify-center" style={{ minHeight: 420 }}>
        {/* Ambient corner glow */}
        <div
          className="absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(34,211,238,0.18)", animation: "reel-glow 4s ease-in-out infinite" }}
          aria-hidden
        />
        <div
          className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(124,58,237,0.18)", animation: "reel-glow 4s ease-in-out infinite 1s" }}
          aria-hidden
        />

        {/* The phone */}
        <div
          className="relative bg-black rounded-[28px] p-[6px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
          style={{ width: 200, aspectRatio: "9 / 16" }}
        >
          {/* Notch */}
          <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-b-[10px] z-20" aria-hidden />

          {/* Screen */}
          <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-black">
            <Reel />
          </div>
        </div>

        {/* Right-side mono meta */}
        <div className="absolute right-5 top-5 font-mono text-[9px] tracking-[0.28em] uppercase text-white/40 leading-tight text-right">
          REC<br />
          <span className="text-[#FB7185] inline-flex items-center gap-1">
            <span
              className="inline-block w-1 h-1 rounded-full bg-[#FB7185]"
              style={{ animation: "reel-pulse 1.2s ease-in-out infinite" }}
              aria-hidden
            />
            LIVE
          </span>
        </div>
        <div className="absolute left-5 bottom-5 font-mono text-[9px] tracking-[0.22em] uppercase text-white/30">
          {meta.label}
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 border-t border-[#2A2D3A]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-white text-[15px] font-bold leading-tight">{meta.title}</p>
          <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-white/35">
            Post {meta.postId}
          </span>
        </div>
        <p className="text-white/55 text-[12.5px] leading-relaxed">{meta.blurb}</p>

        <div className="flex gap-2 mt-1 pt-3 border-t border-[#2A2D3A]">
          <button
            onClick={onRecord}
            className="flex-1 bg-[#FB7185] hover:bg-[#F43F5E] text-white text-[11.5px] font-bold tracking-[0.1em] uppercase py-2.5 rounded-[6px] transition shadow-[0_4px_12px_-4px_rgba(251,113,133,0.7)] inline-flex items-center justify-center gap-2"
          >
            <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-white" />
            Record
          </button>
          <a
            href={`/api/ig-post/${meta.postId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white text-[11.5px] font-bold tracking-[0.1em] uppercase py-2.5 rounded-[6px] text-center transition"
          >
            Cover
          </a>
          <button
            onClick={() => {
              const el = document.getElementById(`igpost-${meta.postId}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="flex-1 bg-white/[0.06] hover:bg-white/[0.12] text-white text-[11.5px] font-bold tracking-[0.1em] uppercase py-2.5 rounded-[6px] border border-white/15 transition"
          >
            Caption
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Fullscreen Record overlay — phone-fills the screen for OS screen-record ─── */

function RecordOverlay({ meta, onClose }: { meta: ReelMeta; onClose: () => void }) {
  const Reel =
    meta.id === "reel-timeline" ? ReelTimeline :
    meta.id === "reel-math"     ? ReelMath :
                                  ReelSpeed;

  const post = igPosts.find((p) => p.id === meta.postId);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hideUI, setHideUI] = useState(false);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    });
  };

  // Auto-hide chrome after 5s in record mode for a clean recording capture
  useEffect(() => {
    if (!hideUI) return;
    // nothing to clean up
  }, [hideUI]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex flex-col"
      style={{ touchAction: "manipulation" }}
    >
      {/* Top control bar — hidden in record-clean mode */}
      {!hideUI && (
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black border-b border-white/10">
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 -ml-2 inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.18em] uppercase"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Close
          </button>
          <div className="text-white text-[12px] font-mono tracking-[0.22em] uppercase truncate px-2">
            {meta.title}
          </div>
          <button
            onClick={() => setHideUI(true)}
            className="bg-[#FB7185] hover:bg-[#F43F5E] text-white px-3 py-2 -mr-2 rounded text-[11px] font-mono tracking-[0.18em] uppercase font-bold inline-flex items-center gap-1.5"
          >
            <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-white" />
            Hide UI
          </button>
        </div>
      )}

      {/* Reel container — sized to phone-fill */}
      <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
        <div
          className="relative bg-black"
          style={{
            width: "min(94vw, calc(94vh * 9 / 16))",
            aspectRatio: "9 / 16",
            maxHeight: "94vh",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Reel />
          </div>
        </div>

        {/* Tap-to-show overlay when UI is hidden */}
        {hideUI && (
          <button
            onClick={() => setHideUI(false)}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white/50 hover:text-white p-2 rounded-full backdrop-blur-sm transition"
            aria-label="Show controls"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </button>
        )}
      </div>

      {/* Bottom action strip — caption / hashtags / cover-image — hidden in clean record mode */}
      {!hideUI && post && (
        <div className="flex-shrink-0 bg-black border-t border-white/10 p-3 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => copy(post.caption, "caption")}
              className={`flex-1 text-[11px] font-mono font-bold tracking-[0.15em] uppercase py-2.5 rounded transition ${
                copiedKey === "caption" ? "bg-[#0EA5E9] text-white" : "bg-[#2563EB] text-white hover:bg-[#1E40AF]"
              }`}
            >
              {copiedKey === "caption" ? "Caption Copied" : "Copy Caption"}
            </button>
            <button
              onClick={() => copy(post.hashtags, "tags")}
              className={`flex-1 text-[11px] font-mono font-bold tracking-[0.15em] uppercase py-2.5 rounded transition ${
                copiedKey === "tags" ? "bg-[#0EA5E9] text-white" : "bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15"
              }`}
            >
              {copiedKey === "tags" ? "Tags Copied" : "Copy Hashtags"}
            </button>
          </div>
          <p className="text-white/50 text-[11px] text-center font-mono leading-relaxed">
            Tap <strong className="text-white">Hide UI</strong> → use phone screen recorder → loop runs {meta.loopSec}s.
          </p>
        </div>
      )}

      {/* Tap-anywhere-to-restore in clean mode */}
      {hideUI && (
        <button
          onClick={() => setHideUI(false)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 hover:bg-black/70 text-white/60 hover:text-white text-[10px] font-mono tracking-[0.22em] uppercase px-4 py-2 rounded-full backdrop-blur-sm transition"
        >
          Show Controls
        </button>
      )}
    </div>
  );
}

/* ─── Reel 1 — Day 01 → 05 timeline ───────────────────────────────── */

function ReelTimeline() {
  const days = [
    { n: "01", word: "Kickoff", sub: "questions, on purpose" },
    { n: "02", word: "Words", sub: "copy before pixels" },
    { n: "03", word: "Design", sub: "type · color · system" },
    { n: "04", word: "Build", sub: "real code, not template" },
    { n: "05", word: "Draft", sub: "in your inbox" },
  ];
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: "linear-gradient(165deg, #0A1A3A 0%, #1A0F2E 100%)" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "120px 120px",
          animation: "reel-grain 0.5s steps(4) infinite",
        }}
        aria-hidden
      />

      {/* Top meta */}
      <div className="relative z-10 px-4 pt-4 flex items-center justify-between font-mono text-[7px] tracking-[0.28em] uppercase">
        <span className="text-white/65">BuiltbyBrian</span>
        <span className="text-[#56B0FF]">5-DAY · BUILD</span>
      </div>

      {/* Center day cycler */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-white/55 mb-1">DAY</p>
        <div
          className="overflow-hidden"
          style={{ height: 64, width: 84 }}
        >
          <div
            style={{
              animation: "reel-day-cycle 8s steps(5, end) infinite",
            }}
          >
            {days.map((d) => (
              <div key={d.n} style={{ height: 64 }} className="flex items-center justify-center">
                <span className="font-serif text-white leading-none" style={{ fontSize: 58, fontWeight: 500 }}>
                  {d.n}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center overflow-hidden" style={{ height: 22 }}>
          <div style={{ animation: "reel-day-cycle 8s steps(5, end) infinite" }}>
            {days.map((d) => (
              <div key={d.n} style={{ height: 22 }} className="flex items-center justify-center">
                <span className="font-serif italic text-[#56B0FF] text-[18px] leading-none">{d.word}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 text-center overflow-hidden" style={{ height: 16 }}>
          <div style={{ animation: "reel-day-cycle 8s steps(5, end) infinite" }}>
            {days.map((d) => (
              <div key={d.n} style={{ height: 16 }} className="flex items-center justify-center">
                <span className="font-mono text-[7.5px] tracking-[0.18em] uppercase text-white/70">{d.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-4 pb-4">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #56B0FF 0%, #FF3B47 100%)",
              animation: "reel-day-bar 8s steps(5, end) infinite",
            }}
          />
        </div>
        <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-white/45 text-center mt-2">
          DRAFT · IN · YOUR · INBOX
        </p>
      </div>
    </div>
  );
}

/* ─── Reel 2 — $16/mo vs $750 once ────────────────────────────────── */

function ReelMath() {
  // Show years climbing on the "rent" side, flat on the "own" side
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: "linear-gradient(170deg, #1A1A2E 0%, #2C1A4A 100%)" }}
    >
      {/* Top meta */}
      <div className="relative z-10 px-4 pt-4 flex items-center justify-between font-mono text-[7px] tracking-[0.28em] uppercase">
        <span className="text-white/65">THE · MATH</span>
        <span className="text-[#FACC15]">YR · 01 → 05</span>
      </div>

      {/* Title */}
      <div className="relative z-10 px-4 mt-3 text-center">
        <p className="font-serif text-white text-[18px] leading-tight">
          Rent it{" "}
          <span className="italic text-[#FB7185]">forever</span>
        </p>
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-white/55 mt-1">
          OR · OWN · IT · ONCE
        </p>
      </div>

      {/* Two columns */}
      <div className="relative z-10 flex-1 grid grid-cols-2 gap-3 px-4 mt-4">
        {/* RENT column — growing bar */}
        <div className="relative flex flex-col items-center justify-end pb-2">
          <span className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#FB7185] mb-1">RENT</span>
          <div className="relative w-full bg-white/5 rounded-md overflow-hidden flex-1 flex items-end">
            <div
              className="w-full"
              style={{
                background: "linear-gradient(180deg, #FB7185 0%, #BE123C 100%)",
                height: "100%",
                transformOrigin: "bottom",
                animation: "reel-money-grow 9s ease-in-out infinite",
              }}
            />
            <span
              className="absolute left-1/2 -translate-x-1/2 top-2 font-serif text-white"
              style={{ fontSize: 14 }}
            >
              $$$
            </span>
          </div>
          {/* Counter cycle */}
          <div className="mt-2 overflow-hidden" style={{ height: 16 }}>
            <div style={{ animation: "reel-day-cycle 9s steps(5, end) infinite" }}>
              {["$192", "$384", "$576", "$768", "$960"].map((v) => (
                <div key={v} style={{ height: 16 }} className="flex items-center justify-center">
                  <span className="font-mono text-[11px] text-white leading-none">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OWN column — flat bar */}
        <div className="relative flex flex-col items-center justify-end pb-2">
          <span className="font-mono text-[7px] tracking-[0.22em] uppercase text-[#34D399] mb-1">OWN</span>
          <div className="relative w-full bg-white/5 rounded-md overflow-hidden flex-1 flex items-end">
            <div
              className="w-full"
              style={{
                background: "linear-gradient(180deg, #34D399 0%, #047857 100%)",
                height: "18%",
              }}
            />
            <span
              className="absolute left-1/2 -translate-x-1/2 top-2 font-serif text-white italic"
              style={{ fontSize: 12 }}
            >
              once
            </span>
          </div>
          <div className="mt-2 font-mono text-[11px] text-white">$750</div>
        </div>
      </div>

      {/* Bottom punchline */}
      <div className="relative z-10 px-4 pb-4 mt-2">
        <p className="font-serif text-white text-[13px] text-center leading-tight">
          Year 5 of Wix{" "}
          <span className="italic text-[#FACC15]">=</span>
          <br />
          year 1 of mine.
        </p>
        <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-white/45 text-center mt-2">
          BUILT · BY · BRIAN
        </p>
      </div>
    </div>
  );
}

/* ─── Reel 3 — Speed audit ────────────────────────────────────────── */

function ReelSpeed() {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ background: "linear-gradient(170deg, #1A0E14 0%, #2A0F10 50%, #6B1E12 100%)" }}
    >
      {/* Top meta */}
      <div className="relative z-10 px-4 pt-4 flex items-center justify-between font-mono text-[7px] tracking-[0.28em] uppercase">
        <span className="text-white/65">PAGE · SPEED</span>
        <span className="text-[#FFB85C]">AUDIT · LIVE</span>
      </div>

      {/* Gauge */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-2">
        <div className="relative" style={{ width: 130, height: 70 }}>
          {/* Gauge arc */}
          <svg width="130" height="70" viewBox="0 0 130 70" className="overflow-visible">
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#FB7185" />
              </linearGradient>
            </defs>
            {/* Arc */}
            <path
              d="M 10 65 A 55 55 0 0 1 120 65"
              stroke="url(#gaugeGrad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tick marks */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = -90 + i * 45;
              const rad = (angle * Math.PI) / 180;
              const x1 = 65 + Math.cos(rad) * 47;
              const y1 = 65 + Math.sin(rad) * 47;
              const x2 = 65 + Math.cos(rad) * 41;
              const y2 = 65 + Math.sin(rad) * 41;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                />
              );
            })}
            {/* Needle pivot */}
            <circle cx="65" cy="65" r="4" fill="#FFFFFF" />
          </svg>

          {/* Animated needle */}
          <div
            className="absolute"
            style={{
              left: 63,
              top: 18,
              width: 4,
              height: 49,
              background: "#FFFFFF",
              transformOrigin: "50% 95.9%",
              borderRadius: 2,
              animation: "reel-needle 7s ease-in-out infinite",
              boxShadow: "0 2px 8px rgba(255,255,255,0.4)",
            }}
            aria-hidden
          />
        </div>

        {/* Number flip */}
        <div className="mt-3 overflow-hidden" style={{ height: 38 }}>
          <div
            style={{
              animation: "reel-day-cycle 7s steps(2, end) infinite",
            }}
          >
            <div style={{ height: 38 }} className="flex items-baseline justify-center gap-1">
              <span className="font-serif text-[#FB7185] leading-none" style={{ fontSize: 32, fontWeight: 500 }}>
                6.4
              </span>
              <span className="font-mono text-[10px] text-[#FB7185]">s</span>
            </div>
            <div style={{ height: 38 }} className="flex items-baseline justify-center gap-1">
              <span className="font-serif text-[#34D399] leading-none" style={{ fontSize: 32, fontWeight: 500 }}>
                1.4
              </span>
              <span className="font-mono text-[10px] text-[#34D399]">s</span>
            </div>
          </div>
        </div>

        <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-white/55 mt-1 text-center">
          BEFORE · AFTER
        </p>
      </div>

      {/* Checklist popping in */}
      <div className="relative z-10 px-4 pb-4 space-y-1.5">
        {[
          "Lazy-loaded photos",
          "Compressed assets",
          "Code-split routes",
        ].map((line, i) => (
          <div
            key={line}
            className="flex items-center gap-2 font-mono text-[8px] tracking-[0.18em] uppercase text-white/85"
            style={{
              animation: `reel-check 7s ease-in-out infinite ${i * 0.4 + 1}s`,
            }}
          >
            <span
              className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-[#34D399] text-[#0A0C12]"
              style={{ fontSize: 8 }}
            >
              ✓
            </span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
