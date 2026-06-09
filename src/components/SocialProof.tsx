import { ShieldCheck, Clock, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const stats = [
  {
    value: "5.0",
    suffix: "★",
    label: "Average review",
    sub: "Every project to date has shipped with a five-star rating.",
    Icon: ShieldCheck,
  },
  {
    value: "24",
    suffix: "hr",
    label: "Response time",
    sub: "You'll hear back within a day — usually the same one.",
    Icon: Clock,
  },
];

export default function SocialProof() {
  return (
    <section className="relative bg-paper text-ink py-16 sm:py-20">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-10">

        {/* Editorial section header */}
        <Reveal>
          <div className="flex items-baseline justify-between pb-4 border-b border-rule mb-10">
            <span className="font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay pulse-dot" aria-hidden />
              Why clients choose BuiltbyBrian
            </span>
            <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
              Index / 001b
            </span>
          </div>
        </Reveal>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="group bg-paper-soft border border-rule rounded-[6px] p-6 sm:p-7 flex flex-col gap-4 h-full hover:border-forest/40 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-[32px] sm:text-[40px] font-bold text-ink leading-none tracking-tight tabular-nums">
                    {stat.value}
                    <span className="text-ink-soft text-[18px] sm:text-[22px] font-semibold ml-0.5">{stat.suffix}</span>
                  </p>
                  <div className="w-10 h-10 rounded-[6px] bg-forest/8 border border-forest/15 flex items-center justify-center flex-shrink-0">
                    <stat.Icon size={18} className="text-forest" strokeWidth={1.75} />
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted font-semibold mb-1.5">
                    {stat.label}
                  </p>
                  <p className="text-[13.5px] text-ink-soft leading-relaxed font-medium">{stat.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA strip */}
        <Reveal delay={240}>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center">
            <p className="text-ink-muted text-[13px] font-medium">Ready to get started?</p>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 text-forest font-semibold text-[13px] border-b border-forest/30 pb-0.5 hover:border-forest hover:text-forest-deep transition-colors"
            >
              Book a free discovery call
              <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
