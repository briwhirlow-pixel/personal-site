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

function RestaurantMini() {
  return (
    <div className="phone-auto-1">
      <div className="bg-[#1a1612]">
        <div className="h-[20px]" />
        <div className="px-3 h-[24px] flex items-center">
          <span className="text-[9px] text-[#c9a96e] tracking-[0.04em]" style={{ fontFamily: "Georgia, serif" }}>Rossi&apos;s</span>
        </div>
        <div className="relative" style={{ height: "130px", backgroundImage: "linear-gradient(to bottom, rgba(26,22,18,0.2), rgba(26,22,18,0.7))", backgroundSize: "cover" }}>
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-[15px] text-white font-light leading-[0.9]" style={{ fontFamily: "Georgia, serif" }}>
              Authentic<br/><span className="italic text-[#c9a96e]">Italian.</span>
            </p>
          </div>
        </div>
        <div className="px-3 py-3 bg-[#1a1612]">
          <p className="text-[7px] tracking-[0.12em] text-[#c9a96e] uppercase mb-2">Our Menu</p>
          {["Burrata & Heirloom Tomato $18", "Truffle Risotto $28", "Branzino al Forno $34", "Osso Buco $38"].map(m => (
            <div key={m} className="py-1 border-b border-white/8">
              <span className="text-[6.5px] text-white/60">{m}</span>
            </div>
          ))}
        </div>
        <div className="px-3 py-2 bg-[#1a1612] text-center">
          <div className="h-[18px] flex items-center justify-center text-[7px] font-semibold border border-[#c9a96e] text-[#c9a96e]">Order Online</div>
        </div>
      </div>
    </div>
  );
}

function FitnessMini() {
  return (
    <div className="phone-auto-2">
      <div className="bg-white">
        <div className="h-[20px]" />
        <div className="px-3 h-[24px] flex items-center justify-between border-b border-[#e8e8ea]">
          <span className="text-[9px] font-bold tracking-[-0.02em] text-[#1f2535]">APEX</span>
          <span className="text-[6px] font-semibold text-white bg-[#0D7264] px-1.5 py-0.5">Free Pass</span>
        </div>
        <div className="relative" style={{ height: "130px", backgroundImage: "linear-gradient(to bottom, rgba(31,37,53,0.3), rgba(31,37,53,0.75))", backgroundSize: "cover" }}>
          <div className="absolute bottom-2 left-3 right-3">
            <p className="text-[16px] font-bold text-white leading-[0.9] tracking-[-0.02em]">An hour<br/>at the limit.</p>
          </div>
        </div>
        <div className="px-3 py-3 bg-[#FBFBFB]">
          <div className="grid grid-cols-2 gap-1">
            {["Boxing", "Yoga", "Cycling", "Recovery"].map(d => (
              <div key={d} className="bg-white border border-[#e8e8ea] px-1.5 py-1.5">
                <p className="text-[6px] font-bold text-[#1f2535]">{d}</p>
                <p className="text-[4.5px] text-[#999] mt-0.5">45-60 min</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 py-3 bg-white border-t border-[#e8e8ea]">
          <p className="text-[7px] font-bold text-[#1f2535] mb-1.5">Membership</p>
          {[{ t: "Drop-in", p: "$25/class" }, { t: "Monthly", p: "$149/mo" }, { t: "Annual", p: "$1,299/yr" }].map(m => (
            <div key={m.t} className="flex justify-between py-1 border-b border-[#f0f0f2] last:border-0">
              <span className="text-[6.5px] text-[#1f2535]">{m.t}</span>
              <span className="text-[6.5px] font-bold text-[#0D7264]">{m.p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalonMini() {
  return (
    <div className="phone-auto-3">
      <div className="bg-[#faf6f0]">
        <div className="h-[20px]" />
        <div className="px-3 h-[24px] flex items-center border-b border-[#ede8e0]">
          <span className="text-[8px] tracking-[0.04em] text-[#2c2420]" style={{ fontFamily: "Georgia, serif" }}>Golden Comb</span>
        </div>
        <div className="relative" style={{ height: "120px", backgroundImage: "linear-gradient(to bottom, rgba(250,246,240,0.1), rgba(250,246,240,0.6))", backgroundSize: "cover" }}>
          <div className="absolute bottom-2 left-3">
            <p className="text-[14px] text-[#2c2420] font-light leading-[0.9]" style={{ fontFamily: "Georgia, serif" }}>The <span className="italic">Golden</span><br/>Comb</p>
          </div>
        </div>
        <div className="px-3 py-3 bg-white">
          {[{ s: "Keratin Smoothing", p: "$300+" }, { s: "Bridal Styling", p: "$400+" }].map(svc => (
            <div key={svc.s} className="flex justify-between py-1 border-b border-[#f0ece6] last:border-0">
              <span className="text-[6.5px] text-[#2c2420]">{svc.s}</span>
              <span className="text-[6.5px] font-semibold text-[#b8956a]">{svc.p}</span>
            </div>
          ))}
        </div>
        <div className="px-3 py-3 bg-[#faf6f0] border-t border-[#ede8e0]">
          <p className="text-[6.5px] tracking-[0.1em] text-[#b8956a] uppercase mb-1.5">Stylists</p>
          {[{ n: "Danielle", t: "Owner · 14 years" }, { n: "Kayla", t: "Colorist · 8 years" }, { n: "Tess", t: "Lash Tech · 5 years" }].map(p => (
            <div key={p.n} className="flex items-center gap-1.5 py-1">
              <div className="w-5 h-5 rounded-full flex-shrink-0 bg-[#e0d4c8]" />
              <div>
                <p className="text-[6.5px] font-semibold text-[#2c2420]">{p.n}</p>
                <p className="text-[5px] text-[#8a7e72]">{p.t}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 py-3 bg-white border-t border-[#ede8e0] text-center">
          <div className="h-[18px] flex items-center justify-center text-[7px] font-semibold bg-[#b8956a] text-white">Book an Appointment</div>
          <p className="text-[5px] text-[#8a7e72] mt-1">Gift cards available</p>
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

              <p className="mt-4 sm:mt-6 text-ink-soft text-[14px] sm:text-[16px] leading-[1.5] max-w-md mx-auto text-pretty">
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
                  className="group inline-flex items-center justify-center gap-2 text-forest text-[14px] font-semibold hover:text-forest-bright transition-colors py-2 sm:py-0"
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
              <p className="text-ink-soft text-[14px] sm:text-[15px] leading-relaxed font-medium mt-2 max-w-md">
                Every site works perfectly on the device your customers actually use.
              </p>

              <div className="flex items-start justify-center gap-4 sm:gap-6 mt-8">
                <PhoneFrame className="mt-8 hidden sm:block">
                  <RestaurantMini />
                </PhoneFrame>
                <PhoneFrame>
                  <FitnessMini />
                </PhoneFrame>
                <PhoneFrame className="mt-8 hidden sm:block">
                  <SalonMini />
                </PhoneFrame>
              </div>
            </div>

            {/* Slide 3: Platforms / 90+ */}
            <div className="w-1/4 flex-shrink-0">
              <div className="bg-ink rounded-xl px-5 sm:px-8 py-8 sm:py-10 text-white">
                <div className="grid md:grid-cols-12 gap-5 md:gap-6 items-end">
                  <div className="md:col-span-4">
                    <p
                      className="font-display font-medium text-white leading-[0.85] tracking-[-0.04em]"
                      style={{ fontSize: "clamp(52px, 8vw, 80px)" }}
                    >
                      90<span className="text-forest-bright">+</span>
                    </p>
                    <p className="text-white/35 text-[12px] font-medium mt-1 leading-snug">
                      Lighthouse performance score on every site I deliver.
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <h2
                      className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-white"
                      style={{ fontSize: "clamp(18px, 3vw, 30px)" }}
                    >
                      Your site works everywhere<br className="hidden sm:block" /> your customers are.
                    </h2>
                    <p className="text-white/40 text-[13px] font-medium mt-2 max-w-lg leading-relaxed">
                      Every build ships with SEO, mobile optimization, social preview cards, and performance tuning baked in from day one.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" className="text-white/50"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" className="text-white/50"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                      <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" className="text-white/50"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.68-.04-.85.27l-1.87 3.23A10.46 10.46 0 0 0 12 8c-1.58 0-3.07.36-4.44.93L5.68 5.7c-.16-.31-.54-.43-.85-.27-.31.17-.43.55-.27.86L6.4 9.48A9.84 9.84 0 0 0 2 17h20a9.84 9.84 0 0 0-4.4-7.52zM7 14.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/8 pt-5 mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-4 gap-x-3">
                    {[
                      { name: "Google SEO", desc: "Local search rankings", Icon: Search },
                      { name: "Mobile Ready", desc: "iOS + Android perfect", Icon: Smartphone },
                      { name: "Social Previews", desc: "Instagram & Facebook cards", Icon: Share2 },
                      { name: "Google Maps", desc: "Business profile linked", Icon: MapPin },
                      { name: "Fast Loading", desc: "Core Web Vitals passing", Icon: Zap },
                      { name: "Secure", desc: "HTTPS + best practices", Icon: ShieldCheck },
                    ].map((p) => (
                      <div key={p.name} className="flex items-start gap-2">
                        <p.Icon size={13} strokeWidth={1.75} className="text-forest-bright flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-semibold text-white leading-tight">{p.name}</p>
                          <p className="text-[9px] text-white/30 mt-0.5 leading-snug">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <p className="mt-4 sm:mt-6 text-ink-soft text-[14px] sm:text-[16px] leading-[1.5] max-w-md mx-auto text-pretty">
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
                  className="group inline-flex items-center justify-center gap-2 text-forest text-[14px] font-semibold hover:text-forest-bright transition-colors py-2 sm:py-0"
                  tabIndex={-1}
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
