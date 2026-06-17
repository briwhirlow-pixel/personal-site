import Link from "next/link";
import { liveProjects } from "@/lib/data";
import { Check } from "lucide-react";
import Reveal from "./Reveal";

export default function FeaturedProject() {
  const project = liveProjects[0];
  if (!project) return null;

  const hostname = project.url.replace(/^https?:\/\//, "");

  return (
    <section className="relative bg-paper-soft text-ink py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-[-0.025em] text-ink"
              style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
            >
              A live sample build.
            </h2>
            <p className="text-ink-soft text-[16px] sm:text-[17px] leading-relaxed font-medium mt-4 max-w-xl">
              I built APEX Performance Studio end to end as a portfolio piece, designed, coded, deployed, and live. Click through to see the full site.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden border border-rule hover:border-rule-bright transition-colors bg-paper"
          >
            <div className="grid md:grid-cols-12">
              {/* Mock preview */}
              <div className="md:col-span-7 p-4 sm:p-5 md:p-6">
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
                        {hostname}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex flex-col"
                    style={{
                      height: "calc(100% - 24px)",
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
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

                    <div
                      className="flex-1 flex flex-col justify-end p-4 relative"
                      style={{
                        backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.65)), url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <p
                        className="leading-[0.95] tracking-[-0.02em] font-bold"
                        style={{ color: "#ffffff", fontSize: "clamp(18px, 3vw, 32px)" }}
                      >
                        An hour<br />at the limit.
                      </p>
                      <p className="text-[8px] sm:text-[10px] leading-snug mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Six disciplines. Three resident coaches.
                      </p>
                      <div className="flex gap-1.5 mt-2.5">
                        <span className="h-6 px-3 flex items-center text-[8px] tracking-[0.01em] font-semibold" style={{ background: "#ffffff", color: "#1f2535" }}>
                          Get Your Free Pass
                        </span>
                        <span className="h-6 px-3 flex items-center text-[8px] tracking-[0.01em] font-semibold" style={{ border: "1px solid rgba(255,255,255,0.3)", color: "#ffffff" }}>
                          View Programs
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between px-3 py-1.5 bg-black/60 text-[6px] text-white/50">
                      <span>Open today · 5am–10pm</span>
                      <span>(610) 555-0174</span>
                      <span>First class free</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project info */}
              <div className="md:col-span-5 p-6 sm:p-8 md:py-10 md:pr-10 flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-forest bg-forest/10 px-2 py-1">
                    {project.tag}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-ink-muted bg-paper-soft border border-rule px-2 py-1">
                    Sample
                  </span>
                </div>
                <h3
                  className="font-display font-extrabold text-ink leading-tight tracking-tight mb-3"
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
                  Visit the sample site
                  <span aria-hidden className="text-[16px] leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </div>
              </div>
            </div>
          </a>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-rule">
            <p className="text-ink-muted text-[13px] font-medium">
              More categories I build across: restaurants, ecommerce, photography, and studio work.
            </p>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 text-forest font-semibold text-[14px] border-b border-forest/30 pb-0.5 hover:text-forest-bright hover:border-forest transition-colors"
            >
              See all the work
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
