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

const mockupThemes: Record<string, { navBg: string; heroBg: string; headline: string; accent: string; imgBg: string; }> = {
  ecommerce: { navBg: '#FFFFFF', heroBg: '#F8FFFE', headline: '#0F172A', accent: '#0EA5E9', imgBg: '#BAE6FD' },
  portfolio:  { navBg: '#0F0F0F', heroBg: '#0F0F0F', headline: '#FFFFFF', accent: '#E5E5E5', imgBg: '#2A2A2A' },
  restaurant: { navBg: '#2C1A0E', heroBg: '#FDF6EE', headline: '#2C1A0E', accent: '#B45309', imgBg: '#FDE68A' },
  business:   { navBg: '#0F1F3D', heroBg: '#0F1F3D', headline: '#FFFFFF', accent: '#3B82F6', imgBg: '#1E40AF' },
  realestate: { navBg: '#1C2B1A', heroBg: '#F5F0E8', headline: '#1C2B1A', accent: '#4A7C59', imgBg: '#BBF7D0' },
  health:     { navBg: '#ECFDF5', heroBg: '#ECFDF5', headline: '#064E3B', accent: '#10B981', imgBg: '#A7F3D0' },
};

function BrowserMockup({ mockupKey }: { mockupKey: string }) {
  const t = mockupThemes[mockupKey] ?? mockupThemes.business;
  return (
    <div className="w-full rounded-[6px] overflow-hidden border border-rule" style={{ aspectRatio: '16/10' }}>
      <div className="flex items-center gap-1.5 px-3 h-[26px] bg-[#242424]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        <div className="flex-1 mx-3 bg-white/10 rounded-full h-3.5 flex items-center justify-center">
          <div className="w-20 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="flex flex-col" style={{ height: 'calc(100% - 26px)', background: t.heroBg }}>
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0" style={{ background: t.navBg }}>
          <div className="w-14 h-2 rounded-sm" style={{ background: t.accent }} />
          <div className="flex gap-2">
            {[24, 18, 22, 16].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: w, background: t.headline, opacity: 0.25 }} />
            ))}
          </div>
          <div className="w-14 h-5 rounded-full" style={{ background: t.accent }} />
        </div>
        <div className="flex-1 px-4 pt-4 flex flex-col gap-2">
          <div className="w-[60%] h-3 rounded-sm" style={{ background: t.headline, opacity: 0.8 }} />
          <div className="w-[45%] h-3 rounded-sm" style={{ background: t.headline, opacity: 0.5 }} />
          <div className="w-[75%] h-1.5 rounded-full mt-1" style={{ background: t.headline, opacity: 0.15 }} />
          <div className="w-[60%] h-1.5 rounded-full" style={{ background: t.headline, opacity: 0.15 }} />
          <div className="w-16 h-6 rounded-full mt-2" style={{ background: t.accent }} />
        </div>
        <div className="mx-4 mb-4 rounded-lg flex-shrink-0" style={{ height: '32%', background: t.imgBg, opacity: 0.6 }} />
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
              Types of websites{" "}
              <span className="italic text-forest">I specialize in.</span>
            </h2>
            <p className="text-ink-soft text-[16px] leading-relaxed font-medium max-w-xl">
              Every business is different. Here are the most popular types of sites I build —
              each tailored to your goals.
            </p>
          </Reveal>

          {liveProjects.length > 0 && (
            <Reveal delay={100} className="flex flex-col">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted mb-3">
                Example Project
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
                          <div className="flex flex-col gap-2 p-4" style={{ height: 'calc(100% - 22px)', background: project.bgFrom }}>
                            <div className="w-16 h-1.5 rounded-full" style={{ background: project.accentColor }} />
                            <div className="w-32 h-5 rounded-sm bg-white/80" />
                            <div className="w-24 h-5 rounded-sm bg-white/40" />
                            <div className="flex gap-2 mt-1">
                              <div className="h-7 w-24 rounded" style={{ background: project.accentColor }} />
                              <div className="h-7 w-20 rounded border border-white/20" />
                            </div>
                            <div className="flex gap-3 mt-auto pt-2 border-t border-white/10">
                              {['1,200+', '40+', '4.9★'].map((s) => (
                                <div key={s} className="flex flex-col">
                                  <span className="text-white text-[10px] font-bold">{s}</span>
                                  <span className="text-white/30 text-[8px]">stat</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-forest bg-forest/10 px-2 py-1 rounded-[3px]">
                            {project.tag}
                          </span>
                          <span className="font-mono text-[10px] font-medium text-clay flex items-center gap-1.5 tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-clay pulse-dot inline-block" />
                            Live
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
                          View Live Site
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
