import Link from "next/link";
import { liveProjects } from "@/lib/data";
import { Check } from "lucide-react";
import Reveal from "./Reveal";

export default function FeaturedProject() {
  const project = liveProjects[0];
  if (!project) return null;

  const hostname = project.url.replace(/^https?:\/\//, "");

  return (
    <section className="relative bg-paper text-ink py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Editorial intro , no kicker pill, no "Index/00X" */}
        <Reveal>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <span className="font-serif font-semibold text-[10.5px] tracking-[0.22em] uppercase text-ink-muted font-semibold flex items-center gap-2.5 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay pulse-dot" aria-hidden />
              Sample build · Live
            </span>
            <h2 className="font-serif text-[clamp(36px,6vw,68px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal">
              A live sample build.
            </h2>
            <p className="text-ink-soft text-[16px] sm:text-[17px] leading-relaxed font-medium mt-4 max-w-xl">
              I built APEX Performance Studio end to end as a portfolio piece , designed, coded, deployed, and live. Click through to see the full site.
            </p>
          </div>
        </Reveal>

        {/* Featured card */}
        <Reveal delay={100}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-[8px] overflow-hidden border border-rule hover:border-forest/40 transition-colors bg-paper-soft"
          >
            <div className="grid md:grid-cols-12">
              {/* Mock preview */}
              <div className="md:col-span-7 p-4 sm:p-5 md:p-6">
                <div
                  className="w-full rounded-[6px] overflow-hidden border border-rule"
                  style={{ aspectRatio: "16/10" }}
                >
                  <div className="flex items-center gap-1.5 px-3 h-[24px] bg-[#1a1a1a]">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                    <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#28CA41]" />
                    <div className="flex-1 mx-3 bg-white/10 rounded-full h-3.5 flex items-center px-3">
                      <span className="text-white/40 text-[10px] font-serif font-semibold truncate">
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
                    {/* Top info bar */}
                    <div className="flex items-center justify-between px-4 h-[18px] bg-[#111] text-[7px] text-white/50">
                      <span>2847 N Clark St, Chicago</span>
                      <span>(312) 555-0174</span>
                    </div>

                    {/* Nav bar with logo */}
                    <div className="flex items-center justify-between px-4 h-[28px] bg-white border-b border-[#eee]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-[#e41313] rounded-[2px] flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold leading-none">A</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#1a1a1a]">APEX</span>
                      </div>
                      <div className="flex gap-3 text-[7px] text-[#555]">
                        <span>Classes</span>
                        <span>Trainers</span>
                        <span>Pricing</span>
                      </div>
                    </div>

                    {/* Hero with gym photo background */}
                    <div
                      className="flex-1 flex flex-col items-center justify-center text-center relative"
                      style={{
                        backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <p
                        className="leading-[1.15] tracking-wide uppercase font-semibold px-4"
                        style={{
                          color: "#ffffff",
                          fontSize: "clamp(16px, 2.8vw, 30px)",
                        }}
                      >
                        Experience the APEX Difference
                      </p>

                      <p
                        className="text-[8px] sm:text-[10px] leading-snug mt-1.5"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        No pressure, no gimmicks , just results.
                      </p>

                      <span
                        className="mt-2.5 h-6 px-3.5 flex items-center text-[8px] uppercase tracking-[0.08em] font-semibold"
                        style={{
                          background: "#e41313",
                          color: "#ffffff",
                          borderRadius: 9999,
                        }}
                      >
                        Sign Up Today
                      </span>
                    </div>

                    {/* Bottom image cards row */}
                    <div className="flex gap-1.5 px-2 py-2 bg-white">
                      {["Packages", "Trainers", "Schedule", "About"].map((label) => (
                        <div key={label} className="flex-1 relative h-[42px] rounded-[3px] overflow-hidden bg-[#333]">
                          <div className="absolute inset-0 bg-black/40" />
                          <span className="absolute bottom-1.5 left-2 text-white text-[7px] font-semibold uppercase tracking-wide">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project info */}
              <div className="md:col-span-5 p-6 sm:p-8 md:py-10 md:pr-10 flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="font-serif font-semibold text-[10px] font-semibold tracking-[0.18em] uppercase text-forest bg-forest/10 px-2 py-1 rounded-[3px]">
                    {project.tag}
                  </span>
                  <span className="font-serif font-semibold text-[10px] font-semibold tracking-[0.18em] uppercase text-ink-muted bg-paper border border-rule px-2 py-1 rounded-[3px]">
                    Sample
                  </span>
                  <span className="font-serif font-semibold text-[10px] font-medium text-clay flex items-center gap-1.5 tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay pulse-dot inline-block" />
                    Live demo
                  </span>
                </div>
                <h3 className="font-serif text-[clamp(24px,3vw,36px)] text-ink leading-tight tracking-tight mb-3">
                  {project.name}
                </h3>
                <p className="text-ink-soft text-[14px] sm:text-[15px] leading-relaxed mb-5 font-medium">
                  {project.description}
                </p>
                <ul className="space-y-2.5 mb-6">
                  {project.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[13px] text-ink-soft font-medium leading-snug"
                    >
                      <Check
                        size={13}
                        className="text-forest flex-shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-1.5 text-[13px] font-semibold text-ink group-hover:text-forest transition-colors">
                  Visit the sample site
                  <span aria-hidden className="font-serif text-[16px] leading-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </div>
              </div>
            </div>
          </a>
        </Reveal>

        {/* Quiet bottom link to the full work index */}
        <Reveal delay={200}>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-rule">
            <p className="text-ink-muted text-[13px] font-medium">
              More categories I build across , restaurants, ecommerce, photography, and studio work.
            </p>
            <Link
              href="/work"
              className="group inline-flex items-center gap-1.5 text-forest font-semibold text-[14px] border-b border-forest/30 pb-0.5 hover:text-forest-deep hover:border-forest transition-colors"
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
