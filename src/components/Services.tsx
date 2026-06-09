import { services } from "@/lib/data";
import { Check, Zap, Smartphone, Search, Package, FolderArchive, Globe } from "lucide-react";
import Reveal from "./Reveal";

const tierAccents = [
  { label: "Tier 01", color: "text-ink-muted", glow: "rgba(100,116,139,0.2)" },
  { label: "Tier 02", color: "text-forest", glow: "rgba(37,99,235,0.3)" },
  { label: "Tier 03", color: "text-ink-muted", glow: "rgba(100,116,139,0.2)" },
] as const;

const valueProps = [
  { Icon: Zap, label: "Fast turnaround", sub: "2–4 week delivery" },
  { Icon: Smartphone, label: "Mobile-first", sub: "Tested on every screen" },
  { Icon: Search, label: "SEO ready", sub: "Built to be found" },
  { Icon: Package, label: "You own it", sub: "Full code handoff" },
];

const carePlans = [
  { name: "Basic", price: "$49/mo", features: ["Hosting + SSL", "Uptime monitoring", "Daily backups"] },
  { name: "Starter", price: "$99/mo", features: ["Everything in Basic", "1 hr edits/month", "Priority support"], highlighted: true },
  { name: "Growth", price: "$149/mo", features: ["Everything in Starter", "2 hrs edits/month", "Monthly SEO report"] },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <Reveal>
          <div className="flex items-baseline justify-between pb-4 border-b border-rule mb-12">
            <span className="font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay pulse-dot" aria-hidden />
              Services & Pricing
            </span>
            <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
              Index / 002
            </span>
          </div>
        </Reveal>

        <Reveal className="max-w-3xl mb-16">
          <h1 className="font-serif text-[clamp(40px,7vw,84px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal">
            Simple, transparent{" "}
            <span className="italic text-forest">pricing.</span>
          </h1>
          <p className="text-ink-soft text-[17px] md:text-[19px] mt-6 leading-relaxed max-w-2xl font-medium">
            One-time project fee. Pick the package that fits, or reach out for something custom.
            Hosting is optional — you always get your code.
          </p>
        </Reveal>

        {/* Value props strip */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
            {valueProps.map(({ Icon, label, sub }) => (
              <div key={label} className="bg-paper-soft border border-rule rounded-[4px] p-5">
                <Icon size={18} className="text-forest mb-3" strokeWidth={1.75} />
                <p className="text-[14px] font-semibold text-ink leading-tight">{label}</p>
                <p className="text-[12px] text-ink-muted mt-1 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Tier cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((tier, i) => {
            const accent = tierAccents[i];
            const isHighlighted = tier.highlighted;
            return (
              <Reveal key={tier.name} delay={i * 100} direction="up">
                <div
                  className={`relative rounded-[6px] p-7 flex flex-col h-full transition-all duration-300 bg-paper-soft ${
                    isHighlighted ? "border border-forest" : "border border-rule hover:border-rule-bright"
                  }`}
                  style={
                    isHighlighted
                      ? { boxShadow: `0 24px 60px -24px ${accent.glow}` }
                      : undefined
                  }
                >
                  <div className="mb-5">
                    <p className={`font-mono text-[10px] tracking-[0.22em] uppercase ${accent.color}`}>
                      {accent.label}
                    </p>
                    <h3 className="font-serif text-[32px] font-normal tracking-tight text-ink mt-2 leading-tight">
                      {tier.name}
                    </h3>
                    <p className="text-forest font-mono text-[15px] font-semibold mt-2">{tier.price}</p>
                  </div>

                  <p className="text-ink-soft text-[14px] leading-relaxed mb-6 pb-6 border-b border-rule font-medium">
                    {tier.description}
                  </p>

                  <ul className="space-y-3 flex-1 mb-7">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[13px]">
                        <Check size={14} className="text-forest flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="text-ink-soft leading-relaxed font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/contact"
                    className={`group inline-flex items-center justify-center gap-2 py-3 px-5 rounded-[6px] font-semibold text-[13px] transition-colors ${
                      isHighlighted
                        ? "bg-forest text-paper hover:bg-forest-deep"
                        : "bg-paper border border-rule text-ink hover:border-forest hover:text-forest"
                    }`}
                    style={
                      isHighlighted
                        ? { boxShadow: "0 8px 24px -6px rgba(37,99,235,0.4)" }
                        : undefined
                    }
                  >
                    {tier.cta}
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Payment terms — editorial data row */}
        <Reveal delay={160} className="mt-12">
          <div className="bg-paper-soft border border-rule rounded-[6px] px-6 py-6 grid md:grid-cols-3 gap-y-5 gap-x-8">
            <div className="relative pl-4">
              <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-forest" aria-hidden />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted">Standard terms</p>
              <p className="text-ink text-[14px] mt-2 font-medium">50% deposit · 50% on delivery</p>
            </div>
            <div className="relative pl-4">
              <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-clay" aria-hidden />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted">Larger projects</p>
              <p className="text-ink text-[14px] mt-2 font-medium">⅓ / ⅓ / ⅓ milestone splits</p>
            </div>
            <div className="relative pl-4">
              <span className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-butter" aria-hidden />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted">Slot reserved</p>
              <p className="text-ink text-[14px] mt-2 font-medium">Project secured with deposit</p>
            </div>
          </div>
        </Reveal>

        {/* Accepted payments */}
        <Reveal delay={180} className="mt-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted">We accept</span>
            <div className="flex items-center gap-2.5 bg-paper-soft border border-rule rounded-[6px] px-4 py-2.5">
              <svg width="20" height="20" viewBox="0 0 111 111" fill="none">
                <rect width="111" height="111" rx="22" fill="#008CFF" />
                <path d="M82.5 20.5c3.2 5.3 4.6 10.7 4.6 17.5 0 21.8-18.6 50.1-33.7 70H21.5L8 22.8l30.7-2.9 7.5 60.2c7-11.6 15.6-29.9 15.6-42.4 0-6.8-1.2-11.5-3-15.2L82.5 20.5z" fill="white" />
              </svg>
              <span className="text-[13px] font-semibold text-ink">Venmo</span>
            </div>
            <div className="flex items-center gap-2.5 bg-paper-soft border border-rule rounded-[6px] px-4 py-2.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" fill="#009CDE" />
                <path d="M6.635 7.025a.982.982 0 0 1 .97-.833h6.137c.728 0 1.4.047 2.011.145a8.1 8.1 0 0 1 .81.18 5.78 5.78 0 0 1 1.15.504c.346-2.208-.003-3.712-1.195-5.076C15.222.518 12.99 0 10.072 0H2.612C2.088 0 1.64.382 1.557.9L-1.05 20.658a.641.641 0 0 0 .633.74h4.604l1.156-7.326 1.292-7.047z" fill="#012169" />
              </svg>
              <span className="text-[13px] font-semibold text-ink">PayPal</span>
            </div>
          </div>
        </Reveal>

        {/* After launch */}
        <Reveal delay={200} className="mt-16">
          <div className="flex items-baseline justify-between pb-3 border-b border-rule mb-8">
            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">After launch — your choice</span>
            <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted">Index / 002b</span>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* File handoff */}
            <div className="bg-paper-soft border border-rule rounded-[6px] p-7">
              <FolderArchive size={20} className="text-forest mb-4" strokeWidth={1.75} />
              <h3 className="font-serif text-[24px] font-normal text-ink tracking-tight mb-2">Take your files</h3>
              <p className="text-ink-soft text-[13px] leading-relaxed mb-4 font-medium">
                Get the full source code delivered via Google Drive. Host it anywhere — Vercel,
                Netlify, your own server. You own it completely.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Full source code", "Host anywhere", "One-time cost"].map((tag) => (
                  <span key={tag} className="font-mono text-[10px] tracking-[0.15em] uppercase bg-paper text-ink-soft border border-rule px-2.5 py-1 rounded-[3px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Managed hosting */}
            <div className="bg-paper-soft border border-rule rounded-[6px] p-7">
              <Globe size={20} className="text-forest mb-4" strokeWidth={1.75} />
              <h3 className="font-serif text-[24px] font-normal text-ink tracking-tight mb-2">Managed care plans</h3>
              <p className="text-ink-soft text-[13px] leading-relaxed mb-5 font-medium">
                I handle hosting, SSL, and deployments. Pick the plan that fits — cancel anytime,
                pay yearly and save 2 months.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {carePlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-[4px] p-3 border ${
                      plan.highlighted ? "border-forest bg-forest/5" : "border-rule bg-paper"
                    }`}
                  >
                    <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ink-muted">{plan.name}</p>
                    <p className="text-forest text-[13px] font-semibold mt-1.5 mb-2 font-mono">{plan.price}</p>
                    <ul className="space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="text-[10px] text-ink-soft flex items-start gap-1 leading-snug">
                          <Check size={9} className="text-forest flex-shrink-0 mt-0.5" strokeWidth={3} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
