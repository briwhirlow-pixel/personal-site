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

        {/* Static logo at top center */}
        <div className="flex justify-center mb-12 sm:mb-16 editorial-rise">
          <Logo animated={false} />
        </div>

        {/* Auto-sliding carousel */}
        <div className="relative w-full overflow-hidden">
          <div className="hero-carousel flex w-[300%]">

            {/* Slide 1: Heading + description + CTAs */}
            <div className="w-1/3 flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
              <h1
                className="font-display font-medium leading-[1.05] tracking-[-0.035em] text-ink text-balance"
                style={{ fontSize: 'clamp(28px, 5vw, 52px)' }}
              >
                Hand-coded.
                <br />
                Personally designed.
                <br />
                Yours forever.
              </h1>

              <p className="mt-6 sm:mt-8 text-ink-soft text-[16px] sm:text-[18px] leading-[1.5] max-w-lg mx-auto text-pretty">
                Custom websites for restaurants, shops, studios, and service
                businesses. One designer, start to finish. You own every line of code.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2.5 bg-clay text-ink px-7 py-4 font-semibold text-[15px] hover:bg-clay-deep transition-colors active:scale-[0.98]"
                  style={{ boxShadow: '0 8px 24px -8px rgba(14,165,233,0.35)', minHeight: 48 }}
                >
                  Start a project
                  <span aria-hidden className="text-[16px] leading-none">→</span>
                </Link>
                <Link
                  href="/work"
                  className="group inline-flex items-center justify-center gap-2 text-forest text-[15px] font-semibold hover:text-forest-bright transition-colors py-3 sm:py-0"
                >
                  See the work
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Slide 2: Mobile-first phones */}
            <div className="w-1/3 flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
              <h2
                className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
                style={{ fontSize: "clamp(28px, 5vw, 52px)" }}
              >
                Mobile-first. Always.
              </h2>
              <p className="text-ink-soft text-[15px] sm:text-[17px] leading-relaxed font-medium mt-3 max-w-md">
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
            <div className="w-1/3 flex-shrink-0">
              <div className="bg-ink rounded-xl px-6 sm:px-10 py-10 sm:py-14 text-white">
                <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-end">
                  <div className="md:col-span-4">
                    <p
                      className="font-display font-medium text-white leading-[0.85] tracking-[-0.04em]"
                      style={{ fontSize: "clamp(64px, 10vw, 96px)" }}
                    >
                      90<span className="text-forest-bright">+</span>
                    </p>
                    <p className="text-white/35 text-[13px] font-medium mt-1 leading-snug">
                      Lighthouse performance score on every site I deliver.
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <h2
                      className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-white"
                      style={{ fontSize: "clamp(22px, 3.5vw, 36px)" }}
                    >
                      Your site works everywhere<br className="hidden sm:block" /> your customers are.
                    </h2>
                    <p className="text-white/40 text-[14px] font-medium mt-3 max-w-lg leading-relaxed">
                      Every build ships with SEO, mobile optimization, social preview cards, and performance tuning baked in from day one.
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/8 pt-6 mt-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-5 gap-x-4">
                    {[
                      { name: "Google SEO", desc: "Local search rankings", Icon: Search },
                      { name: "Mobile Ready", desc: "iOS + Android perfect", Icon: Smartphone },
                      { name: "Social Previews", desc: "Instagram & Facebook cards", Icon: Share2 },
                      { name: "Google Maps", desc: "Business profile linked", Icon: MapPin },
                      { name: "Fast Loading", desc: "Core Web Vitals passing", Icon: Zap },
                      { name: "Secure", desc: "HTTPS + best practices", Icon: ShieldCheck },
                    ].map((p) => (
                      <div key={p.name} className="flex items-start gap-2">
                        <p.Icon size={14} strokeWidth={1.75} className="text-forest-bright flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[12px] font-semibold text-white leading-tight">{p.name}</p>
                          <p className="text-[10px] text-white/30 mt-0.5 leading-snug">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
