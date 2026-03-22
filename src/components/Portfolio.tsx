'use client';
import { projects, Project } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";

const mockupThemes: Record<string, {
  navBg: string; heroBg: string; headline: string;
  accent: string; imgBg: string; domain: string;
}> = {
  oakwood: { navBg: '#1C2B1A', heroBg: '#F5EFE6', headline: '#1C2B1A', accent: '#4A7C59', imgBg: '#C5D5BC', domain: 'oakwoodrealty.com' },
  luma:    { navBg: '#FDF8F5', heroBg: '#FDF8F5', headline: '#2D1810', accent: '#D4826A', imgBg: '#F0D5CC', domain: 'lumaskincare.co' },
  catalyst:{ navBg: '#0F1F3D', heroBg: '#0F1F3D', headline: '#FFFFFF', accent: '#C9A84C', imgBg: '#1E3560', domain: 'catalystco.io' },
  nomad:   { navBg: '#2C1A0E', heroBg: '#F9F3EC', headline: '#2C1A0E', accent: '#8B5E3C', imgBg: '#D4B896', domain: 'nomadcoffee.com' },
  atlas:   { navBg: '#0A0A0A', heroBg: '#0A0A0A', headline: '#FFFFFF', accent: '#FF4500', imgBg: '#1A1A1A', domain: 'atlasfitness.app' },
  horizon: { navBg: '#FFFFFF', heroBg: '#F7F7F5', headline: '#111111', accent: '#111111', imgBg: '#D8D8D4', domain: 'horizonarch.studio' },
};

function BrowserMockup({ mockupKey }: { mockupKey: string }) {
  const t = mockupThemes[mockupKey] ?? mockupThemes.oakwood;
  return (
    <div className="w-full rounded-xl overflow-hidden border border-black/[0.06]" style={{ aspectRatio: '16/10' }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 h-[26px] bg-[#242424] flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        <div className="flex-1 mx-3 bg-white/10 rounded-full h-3.5 flex items-center justify-center">
          <span className="text-white/30 text-[7px] font-mono">{t.domain}</span>
        </div>
      </div>
      {/* Site preview */}
      <div className="flex flex-col" style={{ height: 'calc(100% - 26px)', background: t.heroBg }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-5 py-2.5 flex-shrink-0" style={{ background: t.navBg }}>
          <div className="w-16 h-2 rounded-sm" style={{ background: t.accent }} />
          <div className="hidden sm:flex gap-3">
            {[28, 22, 26, 20].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: w, background: t.headline, opacity: 0.3 }} />
            ))}
          </div>
          <div className="w-16 h-5 rounded-full flex items-center justify-center" style={{ background: t.accent }}>
            <div className="w-8 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.8)' }} />
          </div>
        </div>
        {/* Hero */}
        <div className="flex-1 px-5 pt-5 flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 w-fit rounded-full px-2.5 py-1 mb-1" style={{ background: `${t.accent}20` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.accent }} />
            <div className="w-10 h-1 rounded-full" style={{ background: t.accent }} />
          </div>
          <div className="w-[65%] h-3.5 rounded-sm" style={{ background: t.headline, opacity: 0.85 }} />
          <div className="w-[50%] h-3.5 rounded-sm" style={{ background: t.headline, opacity: 0.55 }} />
          <div className="w-[75%] h-1.5 rounded-full mt-1" style={{ background: t.headline, opacity: 0.18 }} />
          <div className="w-[60%] h-1.5 rounded-full" style={{ background: t.headline, opacity: 0.18 }} />
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2" style={{ background: t.accent }}>
              <div className="w-12 h-1.5 rounded-full bg-white/80" />
            </div>
          </div>
        </div>
        {/* Image block */}
        <div className="mx-5 mb-5 rounded-lg flex-shrink-0" style={{ height: '30%', background: t.imgBg, opacity: 0.7 }} />
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-[#F2F1EC] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[#FF5733] text-[12px] font-semibold tracking-widest uppercase mb-4">Selected Work</p>
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black text-[#1A1A1A] leading-tight tracking-tight">
              Recent projects.
            </h2>
          </div>
          <p className="text-[#737373] text-[15px] leading-relaxed max-w-xs">
            A selection of sites I&apos;ve designed and built. More available on request.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project, i: number) => (
            <Reveal key={project.name} delay={i * 80} direction="up">
              <TiltCard className="h-full">
                <a
                  href={project.url}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E5E4DF] hover:border-[#FF5733]/20 hover:shadow-2xl hover:shadow-[#FF5733]/8 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="p-3 pb-0 bg-white">
                    <BrowserMockup mockupKey={project.mockupKey} />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-[#FF5733] text-[11px] font-semibold tracking-wide uppercase mb-0.5">
                          {project.category}
                        </p>
                        <h3 className="text-[17px] font-black text-[#1A1A1A] tracking-tight">{project.name}</h3>
                      </div>
                      <ArrowUpRight
                        size={17}
                        className="text-[#CECCC6] group-hover:text-[#FF5733] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1"
                      />
                    </div>
                    <p className="text-[#737373] text-[13px] leading-relaxed flex-1">{project.description}</p>
                    <div className="mt-3 pt-3 border-t border-[#F2F1EC]">
                      <span className="text-[11px] text-[#AEACA6] font-mono">{project.domain}</span>
                    </div>
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
