import Link from "next/link";
import { liveProjects } from "@/lib/data";
import { Check } from "lucide-react";
import Reveal from "./Reveal";

export default function FeaturedProject() {
  const project = liveProjects[0];
  if (!project) return null;

  const hostname = project.url.replace(/^https?:\/\//, "");

  return (
    <section className="relative bg-paper-soft text-ink py-14 sm:py-16">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <div className="max-w-3xl mb-7 sm:mb-10">
            <h2
              className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
              style={{ fontSize: 'clamp(28px, 4.5vw, 44px)' }}
            >
              See it live.
            </h2>
            <p className="text-ink-soft text-[15px] leading-relaxed font-medium mt-3 max-w-lg">
              Hover to scroll through the page. Click to visit the live site.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden border border-rule hover:border-forest/40 transition-colors bg-paper"
          >
            <div className="grid md:grid-cols-12">
              {/* Animated mockup preview */}
              <div className="md:col-span-7 p-3 sm:p-4">
                <div
                  className="w-full overflow-hidden border border-rule"
                  style={{ aspectRatio: "4/3" }}
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-3 h-[24px] bg-[#f0f0f2] flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                    <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#28CA41]" />
                    <div className="flex-1 mx-3 bg-black/5 rounded-full h-3.5 flex items-center px-3">
                      <span className="text-black/30 text-[10px] font-semibold truncate">
                        {hostname}
                      </span>
                    </div>
                  </div>

                  {/* Scrollable content — animates on hover */}
                  <div className="mockup-scroll" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {/* APEX Nav */}
                    <div className="flex items-center justify-between px-4 h-[28px] bg-white/90 border-b border-[#e8e8ea]">
                      <span className="text-[10px] font-bold tracking-[-0.02em] text-[#1f2535]">APEX</span>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-3 text-[7px] text-[#777]">
                          <span>Programs</span>
                          <span>Coaches</span>
                          <span>Membership</span>
                        </div>
                        <span className="text-[7px] font-semibold text-white bg-[#0D7264] px-2 py-0.5">Free Pass</span>
                      </div>
                    </div>

                    {/* APEX Hero */}
                    <div
                      className="flex flex-col justify-end p-4 relative"
                      style={{
                        height: "180px",
                        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <p className="leading-[0.95] tracking-[-0.02em] font-bold" style={{ color: "#ffffff", fontSize: "clamp(16px, 2.5vw, 28px)" }}>
                        An hour<br />at the limit.
                      </p>
                      <p className="text-[8px] sm:text-[9px] leading-snug mt-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Six disciplines. Three resident coaches.
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        <span className="h-5 px-2.5 flex items-center text-[7px] font-semibold" style={{ background: "#ffffff", color: "#1f2535" }}>Get Your Free Pass</span>
                        <span className="h-5 px-2.5 flex items-center text-[7px] font-semibold" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff" }}>View Programs</span>
                      </div>
                    </div>

                    {/* APEX Programs section */}
                    <div className="px-4 py-5 bg-[#FBFBFB]">
                      <p className="text-[9px] font-bold text-[#1f2535] tracking-[-0.01em] mb-3">Six disciplines. One studio.</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["Strength", "HIIT", "Boxing", "Yoga", "Cycling", "Recovery"].map((d) => (
                          <div key={d} className="bg-white border border-[#e8e8ea] px-2 py-2">
                            <p className="text-[7px] font-bold text-[#1f2535]">{d}</p>
                            <p className="text-[5px] text-[#999] mt-0.5">45-60 min</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* APEX Coaches section */}
                    <div className="px-4 py-5 bg-white border-t border-[#e8e8ea]">
                      <p className="text-[9px] font-bold text-[#1f2535] tracking-[-0.01em] mb-3">Meet the coaches.</p>
                      <div className="flex gap-3">
                        {["Coach A", "Coach B", "Coach C"].map((c) => (
                          <div key={c} className="flex-1">
                            <div className="aspect-[3/4] bg-[#e8e8ea] mb-1.5" />
                            <p className="text-[7px] font-bold text-[#1f2535]">{c}</p>
                            <p className="text-[5px] text-[#999]">Strength & HIIT</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* APEX Pricing section */}
                    <div className="px-4 py-5 bg-[#FBFBFB] border-t border-[#e8e8ea]">
                      <p className="text-[9px] font-bold text-[#1f2535] tracking-[-0.01em] mb-3">Membership</p>
                      <div className="flex gap-2">
                        {[{ t: "Drop-in", p: "$25" }, { t: "Monthly", p: "$149" }, { t: "Annual", p: "$1,299" }].map((m) => (
                          <div key={m.t} className="flex-1 bg-white border border-[#e8e8ea] px-2 py-2 text-center">
                            <p className="text-[7px] font-bold text-[#0D7264]">{m.p}</p>
                            <p className="text-[6px] text-[#999] mt-0.5">{m.t}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* APEX Footer */}
                    <div className="flex justify-between px-3 py-2 bg-[#1f2535] text-[6px] text-white/50">
                      <span>Open today · 5am-10pm</span>
                      <span>(610) 555-0174</span>
                      <span>First class free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project info */}
              <div className="md:col-span-5 p-5 sm:p-6 md:py-8 md:pr-8 flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-forest bg-forest/10 px-2 py-1">
                    {project.tag}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ink-muted bg-paper-soft border border-rule px-2 py-1">
                    Sample
                  </span>
                </div>
                <h3
                  className="font-display font-bold text-ink leading-tight tracking-tight mb-3"
                  style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
                >
                  {project.name}
                </h3>
                <p className="text-ink-soft text-[14px] sm:text-[15px] leading-relaxed mb-5 font-medium">
                  {project.description}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-ink-soft font-medium leading-snug">
                      <Check size={13} className="text-forest flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-1.5 text-[13px] font-semibold text-ink group-hover:text-forest transition-colors">
                  Visit the live site
                  <span aria-hidden className="text-[16px] leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </div>
              </div>
            </div>
          </a>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-rule">
            <p className="text-ink-muted text-[13px] font-medium">
              More projects in progress. Restaurants, ecommerce, photography, and studio work.
            </p>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 text-forest font-semibold text-[14px] border-b border-forest/30 pb-0.5 hover:text-forest-bright hover:border-forest transition-colors"
            >
              See all work
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
