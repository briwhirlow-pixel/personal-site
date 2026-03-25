'use client';
import { websiteTypes, WebsiteType } from "@/lib/data";
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
    <section id="portfolio" className="bg-[#FAFAF7] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[#2563EB] text-[12px] font-semibold tracking-widest uppercase mb-4">
              What I Build
            </p>
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black text-[#1A1A1A] leading-tight tracking-tight">
              Types of websites<br />I specialize in.
            </h2>
          </div>
          <p className="text-[#737373] text-[15px] leading-relaxed max-w-xs">
            Every business is different. Here are the most popular types of sites I build — each tailored to your goals.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {websiteTypes.map((type: WebsiteType, i: number) => (
            <Reveal key={type.name} delay={i * 80} direction="up">
              <TiltCard className="h-full">
                <div className="group bg-white rounded-2xl overflow-hidden border border-[#E5E4DF] hover:border-[#2563EB]/20 hover:shadow-2xl hover:shadow-[#2563EB]/8 transition-all duration-300 flex flex-col h-full">
                  <div className="p-3 pb-0">
                    <BrowserMockup mockupKey={type.mockupKey} />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{type.emoji}</span>
                      <div>
                        <p className="text-[#2563EB] text-[11px] font-semibold tracking-wide uppercase leading-none mb-0.5">
                          {type.tagline}
                        </p>
                        <h3 className="text-[17px] font-black text-[#1A1A1A] tracking-tight">{type.name}</h3>
                      </div>
                    </div>
                    <p className="text-[#737373] text-[13px] leading-relaxed mb-4">{type.description}</p>
                    <ul className="mt-auto space-y-1.5">
                      {type.includes.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-[12px] text-[#4A4A4A]">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                            <svg width="7" height="7" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a href="/contact" className="mt-4 block text-center py-2.5 px-4 rounded-full border border-[#E5E4DF] text-[12px] font-semibold text-[#737373] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all">
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
