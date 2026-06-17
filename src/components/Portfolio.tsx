'use client';
import { websiteTypes, liveProjects, WebsiteType } from "@/lib/data";
import { Check } from "lucide-react";
import Reveal from "./Reveal";

export default function Portfolio() {
  const project = liveProjects[0];

  return (
    <section id="portfolio" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <h2
            className="font-display font-extrabold leading-[0.95] tracking-[-0.025em] text-ink max-w-3xl mb-5"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}
          >
            Types of sites I build.
          </h2>
          <p className="text-ink-soft text-[16px] sm:text-[17px] leading-relaxed font-medium max-w-xl mb-14">
            Restaurants, shops, studios, services. Each one needs a different rhythm , these are the categories I take on most.
          </p>
        </Reveal>

        {/* Live project — featured, asymmetric */}
        {project && (
          <Reveal delay={60}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden border border-rule hover:border-rule-bright transition-colors bg-paper-soft mb-14"
            >
              <div className="grid md:grid-cols-[1.3fr_1fr]">
                <div className="p-4 sm:p-5 md:p-6">
                  <div
                    className="w-full overflow-hidden border border-rule"
                    style={{ aspectRatio: "16/10" }}
                  >
                    <div className="flex items-center gap-1.5 px-3 h-[24px] bg-[#f0f0f2]">
                      <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                      <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                      <div className="w-2 h-2 rounded-full bg-[#28CA41]" />
                      <div className="flex-1 mx-3 bg-black/5 rounded-full h-3.5 flex items-center px-3">
                        <span className="text-black/30 text-[10px] font-semibold truncate">
                          {project.url.replace('https://', '')}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex flex-col"
                      style={{ height: "calc(100% - 24px)", fontFamily: "system-ui, sans-serif" }}
                    >
                      <div className="flex items-center justify-between px-4 h-[28px] bg-white/90 border-b border-[#e8e8ea]">
                        <span className="text-[10px] font-bold tracking-[-0.02em] text-[#1f2535]">APEX</span>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-3 text-[7px] text-[#777]">
                            <span>Programs</span><span>Coaches</span><span>Membership</span>
                          </div>
                          <span className="text-[7px] font-semibold text-white bg-[#0D7264] px-2 py-0.5">Free Pass</span>
                        </div>
                      </div>
                      <div
                        className="flex-1 flex flex-col justify-end p-4"
                        style={{
                          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600)",
                          backgroundSize: "cover", backgroundPosition: "center",
                        }}
                      >
                        <p className="leading-[0.95] tracking-[-0.02em] font-bold" style={{ color: "#fff", fontSize: "clamp(18px, 3vw, 32px)" }}>
                          An hour<br />at the limit.
                        </p>
                        <div className="flex gap-1.5 mt-2.5">
                          <span className="h-6 px-3 flex items-center text-[8px] font-semibold" style={{ background: "#fff", color: "#1f2535" }}>Get Your Free Pass</span>
                        </div>
                      </div>
                      <div className="flex justify-between px-3 py-1.5 bg-black/60 text-[6px] text-white/50">
                        <span>Open today · 5am–10pm</span><span>(610) 555-0174</span><span>First class free</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 md:py-8 md:pr-8 flex flex-col">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-forest bg-forest/10 px-2 py-1">{project.tag}</span>
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ink-muted bg-paper border border-rule px-2 py-1">Sample</span>
                    <span className="text-[10px] font-medium text-clay flex items-center gap-1.5 tracking-wide uppercase">
                      <span className="w-1.5 h-1.5 bg-clay pulse-dot inline-block" aria-hidden />
                      Live
                    </span>
                  </div>
                  <h3
                    className="font-display font-extrabold text-ink leading-tight tracking-tight mb-2"
                    style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
                  >
                    {project.name}
                  </h3>
                  <p className="text-ink-soft text-[13px] leading-relaxed mb-4 font-medium">{project.description}</p>
                  <ul className="space-y-2 mb-5">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[12px] text-ink-soft font-medium leading-snug">
                        <Check size={12} className="text-forest flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center gap-1.5 text-[13px] font-semibold text-ink group-hover:text-forest transition-colors">
                    Visit the sample site
                    <span aria-hidden className="text-[16px] leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                  </div>
                </div>
              </div>
            </a>
          </Reveal>
        )}

        {/* Website types — alternating layout, not identical cards */}
        <Reveal delay={120}>
          <h3
            className="font-display font-bold text-ink mb-8"
            style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
          >
            Categories I take on.
          </h3>
        </Reveal>

        <div className="space-y-4">
          {websiteTypes.map((type: WebsiteType, i: number) => (
            <Reveal key={type.name} delay={140 + i * 50}>
              <div className="grid md:grid-cols-[1fr_1.6fr] gap-4 border border-rule hover:border-rule-bright transition-colors bg-paper-soft p-5 sm:p-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-forest">
                    {type.tagline}
                  </span>
                  <h4 className="font-display font-bold text-[20px] sm:text-[22px] text-ink tracking-tight leading-tight mt-1">
                    {type.name}
                  </h4>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-forest font-semibold text-[13px] mt-3 border-b border-forest/30 pb-0.5 hover:text-forest-bright hover:border-forest transition-colors"
                  >
                    Get a quote <span aria-hidden>→</span>
                  </a>
                </div>
                <div>
                  <p className="text-ink-soft text-[13px] leading-relaxed font-medium mb-3">{type.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {type.includes.map((item) => (
                      <span key={item} className="flex items-center gap-1.5 text-[11px] text-ink-muted font-medium">
                        <Check size={10} className="text-forest flex-shrink-0" strokeWidth={2.5} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
