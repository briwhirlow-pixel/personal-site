'use client';
import { websiteTypes, liveProjects, WebsiteType } from "@/lib/data";
import { ShoppingBag, Frame, UtensilsCrossed, Briefcase, Home, Dumbbell, Check, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const iconByKey: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  ecommerce: ShoppingBag,
  portfolio: Frame,
  restaurant: UtensilsCrossed,
  business: Briefcase,
  realestate: Home,
  health: Dumbbell,
};

// Each mockup is an art-directed editorial preview, not a wireframe.
// brand = small wordmark in the bar; label = mono kicker; h1/accent = serif headline;
// cta = pill button text. Placeholder names are fictional but tonally fitting.
const mockupThemes: Record<
  string,
  {
    navBg: string;
    heroBg: string;
    headline: string;
    accent: string;
    imgBg: string;
    brand: string;
    label: string;
    h1: string;
    accentWord: string;
    cta: string;
  }
> = {
  ecommerce: {
    navBg: '#FFFFFF', heroBg: '#F8F4EF', headline: '#0F172A', accent: '#1F2937', imgBg: '#E8DCC9',
    brand: 'BLOOM', label: 'New season', h1: 'Spring pieces,', accentWord: 'now live.', cta: 'Shop',
  },
  portfolio: {
    navBg: '#0F0F0F', heroBg: '#0F0F0F', headline: '#F5F1EA', accent: '#D4B68A', imgBg: '#2A2A2A',
    brand: 'MARA WONG', label: 'Selected works', h1: 'Photographs,', accentWord: '2024–2026.', cta: 'Archive',
  },
  restaurant: {
    navBg: '#FBF7EF', heroBg: '#FBF7EF', headline: '#2C1A0E', accent: '#B45309', imgBg: '#E9C97A',
    brand: 'Maison Vert', label: "Tonight's menu", h1: 'Seasonal · local,', accentWord: 'open from five.', cta: 'Reserve',
  },
  business: {
    navBg: '#0F1F3D', heroBg: '#0F1F3D', headline: '#F1F5F9', accent: '#60A5FA', imgBg: '#1E3A8A',
    brand: 'NORTHCAP', label: 'Advisory', h1: 'Capital strategy,', accentWord: 'made calm.', cta: 'Talk to us',
  },
  realestate: {
    navBg: '#F5F0E8', heroBg: '#F5F0E8', headline: '#1C2B1A', accent: '#4A7C59', imgBg: '#C9D6B8',
    brand: 'Pinewood', label: 'Featured listings', h1: 'Homes across', accentWord: 'South Jersey.', cta: 'Browse',
  },
  health: {
    navBg: '#FFFFFF', heroBg: '#EFEAE2', headline: '#1A2E22', accent: '#3F6B4A', imgBg: '#C7D3BC',
    brand: 'STILLWATER', label: 'Pilates studio', h1: 'Strong,', accentWord: 'breath-led classes.', cta: 'Book',
  },
};

function BrowserMockup({ mockupKey }: { mockupKey: string }) {
  const t = mockupThemes[mockupKey] ?? mockupThemes.business;
  return (
    <div
      className="w-full rounded-[6px] overflow-hidden border border-rule"
      style={{ aspectRatio: '16/10', background: t.heroBg }}
    >
      {/* Refined header bar — wordmark + nav, no garish chrome dots */}
      <div className="flex items-center justify-between h-[22px] px-3" style={{ background: t.navBg }}>
        <span
          className="text-[8px] font-mono font-bold tracking-[0.18em] uppercase leading-none"
          style={{ color: t.headline }}
        >
          {t.brand}
        </span>
        <div className="flex gap-2">
          {[10, 8, 10].map((w, i) => (
            <span
              key={i}
              className="h-[2px] rounded-full"
              style={{ width: w, background: t.headline, opacity: 0.35 }}
            />
          ))}
        </div>
      </div>

      {/* Hero — kicker + serif headline + CTA + thumbnail row */}
      <div className="px-4 pt-3.5 pb-3 flex flex-col" style={{ height: 'calc(100% - 22px)' }}>
        <span
          className="text-[7px] font-mono font-bold tracking-[0.22em] uppercase leading-none"
          style={{ color: t.accent }}
        >
          {t.label}
        </span>
        <span
          className="font-serif tracking-tight mt-2 leading-[1.05]"
          style={{ color: t.headline, fontSize: 'clamp(15px, 2.2vw, 21px)' }}
        >
          {t.h1}
          <br />
          <span className="italic" style={{ color: t.accent }}>{t.accentWord}</span>
        </span>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span
            className="inline-flex items-center text-[8px] font-semibold font-mono uppercase tracking-[0.15em] px-2.5 py-1 rounded-full leading-none"
            style={{ background: t.accent, color: t.navBg }}
          >
            {t.cta} →
          </span>
          <div className="flex gap-1">
            <span className="w-6 h-6 rounded-[3px]" style={{ background: t.imgBg }} />
            <span className="w-6 h-6 rounded-[3px]" style={{ background: t.imgBg, opacity: 0.6 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Section header */}
        <Reveal>
          <div className="flex items-baseline justify-between pb-4 border-b border-rule mb-12">
            <span className="font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay pulse-dot" aria-hidden />
              What I Build
            </span>
            <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
              Index / 007
            </span>
          </div>
        </Reveal>

        {/* Heading + live project */}
        <div className="grid sm:grid-cols-3 gap-5 mb-5">
          <Reveal className="sm:col-span-2 flex flex-col justify-start">
            <h2 className="font-serif text-[clamp(36px,6vw,72px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal mb-5">
              Types of sites I build.
            </h2>
            <p className="text-ink-soft text-[16px] leading-relaxed font-medium max-w-xl">
              Restaurants, shops, studios, services. Each one needs a different rhythm — these are the categories I take on most.
            </p>
          </Reveal>

          {liveProjects.length > 0 && (
            <Reveal delay={100} className="flex flex-col">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted mb-3">
                Sample Build
              </p>
              {(() => {
                const project = liveProjects[0];
                return (
                  <div className="flex-1">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-[6px] overflow-hidden border border-rule hover:border-forest/40 transition-colors flex-col flex bg-paper-soft"
                    >
                      <div className="p-3 pb-0">
                        <div className="w-full rounded-[4px] overflow-hidden border border-rule" style={{ aspectRatio: '16/9' }}>
                          <div className="flex items-center gap-1.5 px-3 h-[22px] bg-[#1a1a1a]">
                            <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                            <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2 h-2 rounded-full bg-[#28CA41]" />
                            <div className="flex-1 mx-2 bg-white/10 rounded-full h-3 flex items-center px-2">
                              <span className="text-white/40 text-[8px] font-mono truncate">{project.url.replace('https://', '')}</span>
                            </div>
                          </div>
                          <div
                            className="flex flex-col gap-1.5 p-4"
                            style={{ height: 'calc(100% - 22px)', background: `linear-gradient(135deg, ${project.bgFrom}, ${project.bgTo})` }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[8.5px] font-mono font-bold tracking-[0.22em] uppercase" style={{ color: project.accentColor }}>
                                APEX · Lincoln Park
                              </span>
                              <span className="text-[7.5px] font-mono tracking-[0.2em] uppercase text-white/40">Nº 01/06</span>
                            </div>
                            <p className="font-serif leading-[1.05] tracking-tight text-white/95" style={{ fontSize: 'clamp(13px,1.6vw,18px)' }}>
                              An hour at <span className="italic">the limit.</span>
                            </p>
                            <p className="text-white/55 text-[9px] font-medium leading-snug">
                              Six disciplines. Three coaches.
                            </p>
                            <div className="flex gap-1.5 mt-1">
                              <span className="h-5 px-2 rounded-full flex items-center text-[7.5px] font-bold uppercase tracking-wider" style={{ background: project.accentColor, color: project.bgFrom }}>
                                Claim trial →
                              </span>
                              <span className="h-5 px-2 rounded-full border border-white/20 flex items-center text-[7.5px] font-medium text-white/80">
                                Schedule
                              </span>
                            </div>
                            <div className="flex gap-3 mt-auto pt-1.5 border-t border-white/10">
                              {[
                                { v: '41.93°N', l: '87.64°W' },
                                { v: '05:00–22:00', l: 'CT' },
                                { v: '06', l: 'disciplines' },
                              ].map((s) => (
                                <div key={s.l} className="flex flex-col">
                                  <span className="text-white text-[8.5px] font-mono font-bold tabular-nums leading-none">{s.v}</span>
                                  <span className="text-white/40 text-[7px] tracking-wider uppercase font-mono mt-0.5">{s.l}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-forest bg-forest/10 px-2 py-1 rounded-[3px]">
                            {project.tag}
                          </span>
                          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-muted bg-paper border border-rule px-2 py-1 rounded-[3px]">
                            Sample
                          </span>
                          <span className="font-mono text-[10px] font-medium text-clay flex items-center gap-1.5 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-clay pulse-dot inline-block" />
                            Live demo
                          </span>
                        </div>
                        <h3 className="font-serif text-[22px] text-ink leading-tight tracking-tight mb-1">{project.name}</h3>
                        <p className="text-ink-soft text-[12.5px] leading-relaxed mb-3 font-medium">{project.description}</p>
                        <ul className="mt-auto space-y-1.5">
                          {project.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-[12px] text-ink-soft font-medium">
                              <Check size={11} className="text-forest flex-shrink-0" strokeWidth={2.5} />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft group-hover:text-forest transition-colors">
                          Visit the sample site
                          <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })()}
            </Reveal>
          )}
        </div>

        {/* Website type cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {websiteTypes.map((type: WebsiteType, i: number) => {
            const Icon = iconByKey[type.mockupKey] || Briefcase;
            return (
              <Reveal key={type.name} delay={i * 80} direction="up">
                <div className="group rounded-[6px] overflow-hidden border border-rule hover:border-forest/40 transition-colors flex flex-col h-full bg-paper-soft">
                  <div className="p-3 pb-0">
                    <BrowserMockup mockupKey={type.mockupKey} />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-[6px] bg-forest/10 border border-forest/15 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-forest" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[9.5px] font-semibold tracking-[0.18em] uppercase text-forest leading-none mb-1.5">
                          {type.tagline}
                        </p>
                        <h3 className="font-serif text-[20px] text-ink tracking-tight leading-tight">{type.name}</h3>
                      </div>
                    </div>
                    <p className="text-ink-soft text-[13px] leading-relaxed mb-4 font-medium">{type.description}</p>
                    <ul className="mt-auto space-y-1.5">
                      {type.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[12px] text-ink-soft font-medium">
                          <Check size={11} className="text-forest flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/contact"
                      className="mt-4 block text-center py-2.5 px-4 rounded-[6px] border border-rule text-[12.5px] font-semibold text-ink hover:bg-forest hover:text-paper hover:border-forest transition-colors"
                    >
                      Get a quote →
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
