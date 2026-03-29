'use client';
import { websiteTypes, liveProjects, WebsiteType } from "@/lib/data";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

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
    <div className="w-full rounded-xl overflow-hidden border border-black/[0.06]" style={{ aspectRatio: '16/10' }}>
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
            {[24,18,22,16].map((w, i) => (
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
    <section id="portfolio" className="py-28" style={{ background: 'linear-gradient(160deg, #0A1230 0%, #122558 50%, #0C1835 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top row: heading left, APEX card right */}
        <div className="grid md:grid-cols-2 gap-10 items-start mb-12">
          <Reveal>
            <p className="text-[#60A5FA] text-[12px] font-semibold tracking-widest uppercase mb-4">What I Build</p>
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black text-white leading-tight tracking-tight mb-4">
              Types of websites<br />I specialize in.
            </h2>
            <p className="text-white/40 text-[15px] leading-relaxed">
              Every business is different. Here are the most popular types of sites I build — each tailored to your goals.
            </p>
          </Reveal>

          {liveProjects.length > 0 && (
            <Reveal delay={100}>
              <p className="text-[#60A5FA] text-[12px] font-semibold tracking-widest uppercase mb-4">Example Project</p>
              {(() => {
                const project = liveProjects[0];
                return (
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                    className="group rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#2563EB]/50 transition-all duration-300 flex flex-col"
                    style={{ background: `linear-gradient(135deg, ${project.bgFrom} 0%, ${project.bgTo} 100%)` }}>
                    <div className="p-3 pb-0">
                      <div className="w-full rounded-xl overflow-hidden border border-white/[0.06]" style={{ aspectRatio: '16/9' }}>
                        <div className="flex items-center gap-1.5 px-3 h-[22px] bg-[#1a1a1a]">
                          <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                          <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                          <div className="w-2 h-2 rounded-full bg-[#28CA41]" />
                          <div className="flex-1 mx-2 bg-white/10 rounded-full h-3 flex items-center px-2">
                            <span className="text-white/30 text-[8px] font-mono truncate">{project.url.replace('https://', '')}</span>
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
                                <span className="text-white text-[10px] font-black">{s}</span>
                                <span className="text-white/30 text-[8px]">stat</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase"
                          style={{ color: project.accentColor, background: `${project.accentColor}15` }}>
                          {project.tag}
                        </span>
                        <span className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                          Live
                        </span>
                      </div>
                      <h3 className="text-white font-black text-[15px] tracking-tight mb-1">{project.name}</h3>
                      <p className="text-white/40 text-[12px] leading-relaxed mb-3">{project.description}</p>
                      <ul className="mt-auto space-y-1.5">
                        {project.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-[12px] text-white/60">
                            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: `${project.accentColor}20` }}>
                              <svg width="7" height="7" fill="none" stroke={project.accentColor} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                              </svg>
                            </div>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-white/50 group-hover:text-white transition-colors">
                        View Live Site
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </div>
                    </div>
                  </a>
                );
              })()}
            </Reveal>
          )}
        </div>

        {/* Website type cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {websiteTypes.map((type: WebsiteType, i: number) => (
            <Reveal key={type.name} delay={i * 80} direction="up">
              <TiltCard className="h-full">
                <div className="group rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#2563EB]/50 transition-all duration-300 flex flex-col h-full"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', boxShadow: '0 0 0 0 rgba(37,99,235,0)' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px 0 rgba(37,99,235,0.18), inset 0 1px 0 rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(37,99,235,0)')}
                >
                  <div className="p-3 pb-0">
                    <BrowserMockup mockupKey={type.mockupKey} />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{type.emoji}</span>
                      <div>
                        <p className="text-[#60A5FA] text-[11px] font-semibold tracking-wide uppercase leading-none mb-0.5">{type.tagline}</p>
                        <h3 className="text-[17px] font-black text-white tracking-tight">{type.name}</h3>
                      </div>
                    </div>
                    <p className="text-white/40 text-[13px] leading-relaxed mb-4">{type.description}</p>
                    <ul className="mt-auto space-y-1.5">
                      {type.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[12px] text-white/60">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0">
                            <svg width="7" height="7" fill="none" stroke="#60A5FA" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a href="/contact" className="mt-4 block text-center py-2.5 px-4 rounded-full border border-white/10 text-[12px] font-semibold text-white/50 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all">
                      Get a quote →
                    </a>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
