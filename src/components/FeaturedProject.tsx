import Link from "next/link";
import { liveProjects } from "@/lib/data";
import { ArrowUpRight, Check } from "lucide-react";
import Reveal from "./Reveal";

export default function FeaturedProject() {
  const project = liveProjects[0];
  if (!project) return null;

  const hostname = project.url.replace(/^https?:\/\//, "");

  return (
    <section className="relative bg-paper text-ink py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Editorial intro — no kicker pill, no "Index/00X" */}
        <Reveal>
          <div className="max-w-3xl mb-10 sm:mb-14">
            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted font-semibold flex items-center gap-2.5 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay pulse-dot" aria-hidden />
              Sample build · Live
            </span>
            <h2 className="font-serif text-[clamp(36px,6vw,68px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal">
              A live sample build.
            </h2>
            <p className="text-ink-soft text-[16px] sm:text-[17px] leading-relaxed font-medium mt-4 max-w-xl">
              I built APEX Performance Studio end-to-end as a portfolio piece — designed, coded, deployed, and live. Click through to see the full site.
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
                      <span className="text-white/40 text-[10px] font-mono truncate">
                        {hostname}
                      </span>
                    </div>
                  </div>
                  <div
                    className="px-5 sm:px-7 pt-3 sm:pt-4 pb-4 sm:pb-5 flex flex-col"
                    style={{
                      height: "calc(100% - 24px)",
                      background: project.bgFrom,
                      // APEX uses its own font stack so the preview reads as a
                      // separate brand, not an extension of BuiltbyBrian.
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    {/* Top editorial rail — Geist Mono, very tight */}
                    <div
                      className="flex items-center justify-between text-[7.5px] sm:text-[8.5px] tracking-[0.32em] uppercase font-medium pb-2 border-b"
                      style={{
                        color: "#5C4D3A",
                        borderColor: "rgba(28,18,8,0.25)",
                        fontFamily: "var(--font-geist-mono), monospace",
                      }}
                    >
                      <span>APEX / Chicago</span>
                      <span className="hidden sm:inline">Issue Nº 06 — Spring &apos;26</span>
                      <span>41.93°N · 87.64°W</span>
                    </div>

                    {/* Cover label row */}
                    <div
                      className="flex items-center justify-between mt-3"
                      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                    >
                      <span
                        className="text-[7.5px] sm:text-[8.5px] font-medium tracking-[0.35em] uppercase"
                        style={{ color: "#7A6A52" }}
                      >
                        Cover · Performance
                      </span>
                      <span
                        className="text-[7.5px] sm:text-[8.5px] tracking-[0.35em] uppercase"
                        style={{ color: "#7A6A52" }}
                      >
                        Nº 01 / 06
                      </span>
                    </div>

                    {/* Big, dense Fraunces headline with rust underline */}
                    <p
                      className="leading-[0.95] tracking-[-0.02em] mt-2"
                      style={{
                        color: "#1A1A1A",
                        fontSize: "clamp(26px, 3.6vw, 44px)",
                        fontWeight: 700,
                        fontFamily: "var(--font-fraunces), serif",
                        fontVariationSettings: '"SOFT" 0, "WONK" 0, "opsz" 100',
                      }}
                    >
                      An hour at{" "}
                      <span
                        className="relative inline-block"
                        style={{ fontStyle: "italic", fontWeight: 600 }}
                      >
                        {/* Marker-pen highlight behind the italic word — distinct from
                            the wavy SVG underline used on the BuiltbyBrian Hero. */}
                        <span
                          aria-hidden
                          className="absolute left-[-2px] right-[-2px]"
                          style={{
                            top: "52%",
                            bottom: "5%",
                            background: project.accentColor,
                            opacity: 0.7,
                            transform: "skew(-3deg)",
                            zIndex: 0,
                          }}
                        />
                        <span className="relative" style={{ zIndex: 1 }}>the limit.</span>
                      </span>
                    </p>

                    <p
                      className="text-[10px] sm:text-[12px] leading-snug mt-2 max-w-[88%]"
                      style={{
                        color: "#4A3F31",
                        fontFamily: "var(--font-fraunces), serif",
                        fontWeight: 500,
                      }}
                    >
                      Six disciplines. Three coaches. One uncompromising standard.
                    </p>

                    {/* CTAs — solid black sharp pill + underlined link */}
                    <div className="flex items-center gap-3 mt-3">
                      <span
                        className="h-7 px-3 flex items-center text-[9px] uppercase tracking-[0.18em]"
                        style={{
                          background: "#1A1A1A",
                          color: "#F5F1EA",
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontWeight: 700,
                          borderRadius: 2,
                        }}
                      >
                        Claim trial pass →
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-[0.18em] border-b pb-0.5"
                        style={{
                          color: "#1A1A1A",
                          borderColor: "#1A1A1A",
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontWeight: 600,
                        }}
                      >
                        View schedule
                      </span>
                    </div>

                    {/* Bottom data rail */}
                    <div
                      className="flex gap-5 mt-auto pt-3 border-t"
                      style={{
                        borderColor: "rgba(28,18,8,0.2)",
                        fontFamily: "var(--font-geist-mono), monospace",
                      }}
                    >
                      {[
                        { v: "41.93°N", l: "87.64°W" },
                        { v: "05:00–22:00", l: "CT, daily" },
                        { v: "06", l: "disciplines" },
                      ].map((s) => (
                        <div key={s.l} className="flex flex-col gap-0.5">
                          <span
                            className="text-[11px] font-bold tabular-nums leading-none"
                            style={{ color: "#1A1A1A" }}
                          >
                            {s.v}
                          </span>
                          <span
                            className="text-[8px] tracking-[0.16em] uppercase"
                            style={{ color: "#7A6A52" }}
                          >
                            {s.l}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project info */}
              <div className="md:col-span-5 p-6 sm:p-8 md:py-10 md:pr-10 flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
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
                  <ArrowUpRight
                    size={13}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
              </div>
            </div>
          </a>
        </Reveal>

        {/* Quiet bottom link to the full work index */}
        <Reveal delay={200}>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-rule">
            <p className="text-ink-muted text-[13px] font-medium">
              More categories I build across — restaurants, e-commerce, photography, and studio work.
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
