'use client';

import Link from 'next/link';
import { Search, Smartphone, Share2, MapPin, Zap, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ width: "130px" }}>
      <div
        className="relative bg-[#1d1d1f] rounded-[22px] p-[3px]"
        style={{ boxShadow: "0 16px 40px -8px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06) inset" }}
      >
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[28px] h-[8px] bg-[#1d1d1f] rounded-full z-10" />
        <div className="rounded-[19px] overflow-hidden" style={{ aspectRatio: "9/19.5" }}>
          {children}
        </div>
        <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[32%] h-[2.5px] bg-white/15 rounded-full" />
      </div>
    </div>
  );
}

function StatusBar({ light = false }: { light?: boolean }) {
  const c = light ? "text-white" : "text-[#1a1a1a]";
  return (
    <div className={`flex items-center justify-between px-4 pt-[14px] pb-1 ${c}`}>
      <span className="text-[7px] font-semibold">9:41</span>
      <div className="flex items-center gap-[3px]">
        <svg width="10" height="7" viewBox="0 0 16 12" fill="currentColor"><rect x="0" y="6" width="3" height="6" rx="0.5" opacity="0.3"/><rect x="4.5" y="4" width="3" height="8" rx="0.5" opacity="0.5"/><rect x="9" y="2" width="3" height="10" rx="0.5" opacity="0.7"/><rect x="13.5" y="0" width="3" height="12" rx="0.5"/></svg>
        <svg width="10" height="7" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4C5.6 2.4 3.4 3.4 1.8 5L0 3.2C2.2 1.2 5 0 8 0s5.8 1.2 8 3.2L14.2 5C12.6 3.4 10.4 2.4 8 2.4z" opacity="0.3"/><path d="M8 5.6c-1.6 0-3 .6-4 1.6L2.2 5.4C3.6 4 5.7 3.2 8 3.2s4.4.8 5.8 2.2L12 7.2c-1-.9-2.4-1.6-4-1.6z" opacity="0.6"/><path d="M8 8.8c-.8 0-1.6.4-2 .8L4.4 8c1-1 2.2-1.6 3.6-1.6s2.6.6 3.6 1.6L10 9.6c-.4-.4-1.2-.8-2-.8z"/><circle cx="8" cy="11.5" r="1.2"/></svg>
        <svg width="16" height="8" viewBox="0 0 28 14" fill="currentColor"><rect x="0" y="1" width="23" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="24" y="4.5" width="2.5" height="5" rx="1" opacity="0.4"/><rect x="1.5" y="2.5" width="16" height="9" rx="1.2" opacity="0.9"/></svg>
      </div>
    </div>
  );
}

function HomepageMini() {
  return (
    <div className="phone-auto-1">
      {/* SAGE GREEN + WARM CREAM — clean business homepage — Garamond serif */}
      <div className="bg-[#FEFBF6]" style={{ fontFamily: "'EB Garamond', 'Garamond', 'Palatino Linotype', serif", minHeight: 350 }}>
        <StatusBar />
        <div className="bg-[#1B4332] px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[7px] font-black text-white tracking-[0.12em]" style={{ fontFamily: "'Didot', 'Bodoni MT', 'Playfair Display', serif" }}>GREENLEAF</span>
            <div className="flex gap-2">
              <span className="text-[4.5px] text-white/60">Shop</span>
              <span className="text-[4.5px] text-white/60">About</span>
              <span className="text-[4.5px] text-white/60">Contact</span>
            </div>
          </div>
          <p className="text-[10px] text-white leading-tight italic" style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}>Sustainable<br />Living, Made Simple</p>
          <p className="text-[5px] text-[#A8D5BA] mt-1 leading-relaxed" style={{ fontFamily: "'Gill Sans', 'Century Gothic', 'Trebuchet MS', sans-serif" }}>Eco-friendly essentials for your everyday routine.</p>
          <div className="mt-2 mb-1.5">
            <div className="bg-[#A8D5BA] rounded-sm px-2 py-1 inline-block">
              <span className="text-[5px] font-bold text-[#1B4332]" style={{ fontFamily: "'Gill Sans', 'Century Gothic', sans-serif" }}>Shop Now →</span>
            </div>
          </div>
        </div>
        <div className="px-2.5 mt-2.5">
          <p className="text-[5px] font-bold text-[#1B4332] tracking-wider mb-1.5" style={{ fontFamily: "'Gill Sans', 'Century Gothic', sans-serif" }}>BESTSELLERS</p>
          <div className="flex gap-1.5">
            {[
              { name: "Bamboo Set", price: "$28", color: "#2D6A4F" },
              { name: "Soap Kit", price: "$16", color: "#52B788" },
              { name: "Tote Bag", price: "$22", color: "#74C69D" },
            ].map(item => (
              <div key={item.name} className="flex-1 bg-[#F0F7F2] rounded p-1.5">
                <div className="w-full h-[22px] rounded-sm flex items-center justify-center" style={{ background: item.color }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <p className="text-[4.5px] font-semibold text-[#1B4332] mt-1">{item.name}</p>
                <p className="text-[4px] text-[#2D6A4F]/60">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-2.5 mt-2.5 bg-[#1B4332] rounded-lg p-2">
          <p className="text-[5px] text-[#A8D5BA] font-semibold">Free shipping on orders $50+</p>
          <div className="flex items-center gap-1 mt-1">
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#A8D5BA" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p className="text-[4.5px] text-white/50">Philadelphia & South Jersey</p>
          </div>
        </div>
        <div className="flex justify-around mt-2 pt-2 border-t border-[#E8E8E0] px-3">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="#1B4332"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="1.5" opacity="0.3"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="1.5" opacity="0.3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="1.5" opacity="0.3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </div>
    </div>
  );
}

function FitnessMini() {
  return (
    <div className="phone-auto-2">
      {/* BLACK + NEON GREEN — dark fitness dashboard — DM Sans + monospace numbers */}
      <div className="bg-[#0e0e0e]" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", minHeight: 350 }}>
        <StatusBar light />
        <div className="px-3 pt-1 pb-2">
          <p className="text-[6px] text-white/40">Good evening</p>
          <p className="text-[9px] font-bold text-white leading-tight">Sarah&apos;s Dashboard</p>
        </div>
        <div className="flex gap-1.5 px-2.5">
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-2">
            <p className="text-[14px] font-black text-[#39ff14] leading-none" style={{ fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" }}>142</p>
            <p className="text-[4.5px] text-white/30 mt-0.5">Workouts</p>
          </div>
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-2">
            <p className="text-[14px] font-black text-white leading-none" style={{ fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" }}>28</p>
            <p className="text-[4.5px] text-white/30 mt-0.5">Day Streak</p>
          </div>
        </div>
        <div className="mx-2.5 mt-2 bg-[#1a1a1a] rounded-lg p-2">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[5px] font-bold text-white/70">This Week</p>
            <p className="text-[5px] text-[#39ff14]">+12%</p>
          </div>
          <div className="flex items-end gap-[3px] h-[28px]">
            {[65, 45, 80, 55, 90, 70, 40].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 4 ? "#39ff14" : "rgba(57,255,20,0.2)" }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <span key={i} className="text-[3.5px] text-white/20 flex-1 text-center">{d}</span>
            ))}
          </div>
        </div>
        <div className="px-2.5 mt-2">
          <p className="text-[5px] font-bold text-white/70 mb-1.5">Today&apos;s Classes</p>
          {[
            { t: "HIIT Burn", time: "6:00 PM", trainer: "Mike", color: "#39ff14" },
            { t: "Boxing", time: "7:30 PM", trainer: "Lex", color: "#ff6b35" },
          ].map(cls => (
            <div key={cls.t} className="flex items-center gap-2 py-1.5 border-b border-white/5">
              <div className="w-[3px] h-[18px] rounded-full" style={{ background: cls.color }} />
              <div className="flex-1">
                <p className="text-[6px] font-bold text-white">{cls.t}</p>
                <p className="text-[4.5px] text-white/30">{cls.time} · {cls.trainer}</p>
              </div>
              <div className="text-[5px] text-[#0e0e0e] bg-[#39ff14] rounded px-1.5 py-0.5 font-bold">Book</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SportsMini() {
  return (
    <div className="phone-auto-3">
      {/* WHITE + ROYAL BLUE + SCARLET — sports scores app — Impact condensed */}
      <div className="bg-[#F4F5F7]" style={{ fontFamily: "'Arial Narrow', 'Barlow Condensed', 'Oswald', sans-serif", minHeight: 350 }}>
        <StatusBar />
        <div className="bg-[#002B5C] px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-white tracking-[0.08em]" style={{ fontFamily: "Impact, 'Arial Black', 'Bebas Neue', sans-serif" }}>GAMEDAY</span>
            <div className="flex items-center gap-1">
              <div className="w-[5px] h-[5px] rounded-full bg-[#C8102E] animate-pulse" />
              <span className="text-[4.5px] text-[#C8102E] font-bold">LIVE</span>
            </div>
          </div>
          <p className="text-[4.5px] text-white/40 mt-0.5">Tuesday, Jun 17</p>
        </div>
        <div className="mx-2.5 mt-2 bg-white rounded-lg p-2 border border-[#E0E4EA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-[14px] h-[14px] rounded-full bg-[#002B5C] flex items-center justify-center">
                <span className="text-[5px] font-black text-white">P</span>
              </div>
              <div>
                <p className="text-[6px] font-bold text-[#1a1a2e]">PHI Eagles</p>
                <p className="text-[4px] text-[#1a1a2e]/40">Home · Lincoln Financial</p>
              </div>
            </div>
            <span className="text-[12px] font-black text-[#002B5C]" style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>24</span>
          </div>
          <div className="w-full h-[1px] bg-[#E0E4EA] my-1.5" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-[14px] h-[14px] rounded-full bg-[#C8102E] flex items-center justify-center">
                <span className="text-[5px] font-black text-white">G</span>
              </div>
              <div>
                <p className="text-[6px] font-bold text-[#1a1a2e]">NY Giants</p>
                <p className="text-[4px] text-[#1a1a2e]/40">Away</p>
              </div>
            </div>
            <span className="text-[12px] font-black text-[#1a1a2e]/40" style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>17</span>
          </div>
          <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#E0E4EA]">
            <span className="text-[4px] text-[#C8102E] font-bold">Q3 · 8:42</span>
            <span className="text-[4px] text-[#002B5C]/50">ESPN</span>
          </div>
        </div>
        <div className="px-2.5 mt-2">
          <p className="text-[5px] font-bold text-[#1a1a2e] tracking-wider mb-1.5">UPCOMING</p>
          {[
            { home: "DAL", away: "WSH", time: "4:25 PM", homeC: "#002B5C", awayC: "#773141" },
            { home: "SF", away: "SEA", time: "8:20 PM", homeC: "#AA0000", awayC: "#002244" },
          ].map(g => (
            <div key={g.home} className="flex items-center justify-between py-1.5 border-b border-[#E0E4EA]/60">
              <div className="flex items-center gap-1">
                <div className="w-[10px] h-[10px] rounded-full flex items-center justify-center" style={{ background: g.homeC }}>
                  <span className="text-[4px] font-bold text-white">{g.home[0]}</span>
                </div>
                <span className="text-[5px] font-bold text-[#1a1a2e]">{g.home}</span>
              </div>
              <span className="text-[4.5px] text-[#1a1a2e]/30">vs</span>
              <div className="flex items-center gap-1">
                <span className="text-[5px] font-bold text-[#1a1a2e]">{g.away}</span>
                <div className="w-[10px] h-[10px] rounded-full flex items-center justify-center" style={{ background: g.awayC }}>
                  <span className="text-[4px] font-bold text-white">{g.away[0]}</span>
                </div>
              </div>
              <span className="text-[4px] text-[#002B5C]/50">{g.time}</span>
            </div>
          ))}
        </div>
        <div className="mx-2.5 mt-2 bg-[#002B5C] rounded-lg p-2">
          <p className="text-[5px] font-bold text-white mb-1 tracking-wider">STANDINGS</p>
          {[
            { team: "PHI", w: 11, l: 2 },
            { team: "DAL", w: 9, l: 4 },
            { team: "NYG", w: 5, l: 8 },
          ].map((t, i) => (
            <div key={t.team} className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-1">
                <span className="text-[4.5px] text-white/30 w-[6px]">{i + 1}</span>
                <span className="text-[5px] font-bold text-white">{t.team}</span>
              </div>
              <span className="text-[4.5px] text-white/50">{t.w}-{t.l}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-around mt-2 pt-2 border-t border-[#E0E4EA] px-3">
          {["Scores", "News", "Standings", "Profile"].map(t => (
            <span key={t} className={`text-[5px] ${t === "Scores" ? "text-[#002B5C] font-bold" : "text-[#1a1a2e]/30"}`}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-paper text-ink min-h-[100dvh] flex flex-col justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-16 sm:pb-20 w-full">

        {/* Static logo at top center — large */}
        <div className="flex justify-center mb-10 sm:mb-14 editorial-rise">
          <Logo size="hero" />
        </div>

        {/* Auto-sliding carousel */}
        <div className="relative w-full overflow-hidden">
          <div className="hero-carousel flex w-[400%]">

            {/* Slide 1: Heading + description + CTAs */}
            <div className="w-1/4 flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
              <h1
                className="font-display font-medium leading-[1.05] tracking-[-0.035em] text-ink text-balance"
                style={{ fontSize: 'clamp(22px, 3.5vw, 38px)' }}
              >
                Hand-coded.
                <br />
                Personally designed.
                <br />
                Yours forever.
              </h1>

              <p className="mt-4 sm:mt-6 text-ink-soft text-[16px] leading-[1.5] max-w-md mx-auto text-pretty">
                Custom websites for restaurants, shops, studios, and service
                businesses. One designer, start to finish. You own every line of code.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-clay text-ink px-6 py-3 font-semibold text-[14px] hover:bg-clay-deep transition-colors active:scale-[0.98]"
                  style={{ boxShadow: '0 8px 24px -8px rgba(14,165,233,0.35)', minHeight: 44 }}
                >
                  Start a project
                  <span aria-hidden className="text-[14px] leading-none">→</span>
                </Link>
                <Link
                  href="/work"
                  className="group inline-flex items-center justify-center gap-2 text-forest text-[14px] font-semibold hover:text-forest-bright transition-colors py-3 sm:py-0"
                  style={{ minHeight: 44 }}
                >
                  See the work
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Slide 2: Mobile-first phones */}
            <div className="w-1/4 flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
              <h2
                className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
                style={{ fontSize: "clamp(22px, 3.5vw, 38px)" }}
              >
                Mobile-first. Always.
              </h2>
              <p className="text-ink-soft text-[16px] leading-relaxed font-medium mt-2 max-w-md">
                Every site works perfectly on the device your customers actually use.
              </p>

              <div className="flex items-start justify-center gap-4 sm:gap-6 mt-8">
                <PhoneFrame className="mt-8 hidden sm:block">
                  <HomepageMini />
                </PhoneFrame>
                <PhoneFrame>
                  <FitnessMini />
                </PhoneFrame>
                <PhoneFrame className="mt-8 hidden sm:block">
                  <SportsMini />
                </PhoneFrame>
              </div>
            </div>

            {/* Slide 3: Platforms / 90+ — no dark bg, blends with site */}
            <div className="w-1/4 flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
              <p
                className="font-display font-medium text-ink leading-[0.85] tracking-[-0.04em]"
                style={{ fontSize: "clamp(52px, 8vw, 80px)" }}
              >
                90<span className="text-forest">+</span>
              </p>
              <p className="text-ink-muted text-[13px] font-medium mt-2 max-w-xs leading-snug">
                Lighthouse performance score on every site I deliver.
              </p>

              <div className="mt-6 max-w-lg">
                <h2
                  className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
                  style={{ fontSize: "clamp(18px, 3vw, 28px)" }}
                >
                  Your site works everywhere your customers are.
                </h2>
                <p className="text-ink-soft text-[13px] font-medium mt-2 leading-relaxed">
                  SEO, mobile optimization, social preview cards, and performance tuning baked in from day one.
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" className="text-ink/35"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" className="text-ink/35"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" className="text-ink/35"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.68-.04-.85.27l-1.87 3.23A10.46 10.46 0 0 0 12 8c-1.58 0-3.07.36-4.44.93L5.68 5.7c-.16-.31-.54-.43-.85-.27-.31.17-.43.55-.27.86L6.4 9.48A9.84 9.84 0 0 0 2 17h20a9.84 9.84 0 0 0-4.4-7.52zM7 14.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-x-4 gap-y-3 max-w-xl">
                {[
                  { name: "Google SEO", Icon: Search },
                  { name: "Mobile Ready", Icon: Smartphone },
                  { name: "Social Cards", Icon: Share2 },
                  { name: "Google Maps", Icon: MapPin },
                  { name: "Fast Loading", Icon: Zap },
                  { name: "Secure", Icon: ShieldCheck },
                ].map((p) => (
                  <div key={p.name} className="flex flex-col items-center gap-1">
                    <p.Icon size={14} strokeWidth={1.75} className="text-forest" />
                    <p className="text-[9px] font-medium text-ink-muted leading-tight text-center">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide 4: Duplicate of slide 1 for seamless left loop */}
            <div className="w-1/4 flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
              <h1
                className="font-display font-medium leading-[1.05] tracking-[-0.035em] text-ink text-balance"
                style={{ fontSize: 'clamp(22px, 3.5vw, 38px)' }}
                aria-hidden
              >
                Hand-coded.
                <br />
                Personally designed.
                <br />
                Yours forever.
              </h1>
              <p className="mt-4 sm:mt-6 text-ink-soft text-[16px] leading-[1.5] max-w-md mx-auto text-pretty">
                Custom websites for restaurants, shops, studios, and service
                businesses. One designer, start to finish. You own every line of code.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-clay text-ink px-6 py-3 font-semibold text-[14px] hover:bg-clay-deep transition-colors active:scale-[0.98]"
                  style={{ boxShadow: '0 8px 24px -8px rgba(14,165,233,0.35)', minHeight: 44 }}
                  tabIndex={-1}
                >
                  Start a project
                  <span aria-hidden className="text-[14px] leading-none">→</span>
                </Link>
                <Link
                  href="/work"
                  className="group inline-flex items-center justify-center gap-2 text-forest text-[14px] font-semibold hover:text-forest-bright transition-colors py-3 sm:py-0"
                  tabIndex={-1}
                  style={{ minHeight: 44 }}
                >
                  See the work
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
