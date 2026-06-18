import { services } from "@/lib/data";
import { Check, FolderArchive, Globe } from "lucide-react";
import Reveal from "./Reveal";

const carePlans = [
  { name: "Basic", price: "$49/mo", features: ["Hosting + SSL", "Uptime monitoring", "Daily backups"] },
  { name: "Starter", price: "$99/mo", features: ["Everything in Basic", "1 hr edits/month", "Priority support"], highlighted: true },
  { name: "Growth", price: "$149/mo", features: ["Everything in Starter", "2 hrs edits/month", "Monthly SEO report"] },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal className="max-w-3xl mb-10">
          <h1
            className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
            style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}
          >
            Simple, transparent pricing.
          </h1>
          <p className="text-ink-soft text-[17px] md:text-[19px] mt-6 leading-relaxed max-w-2xl font-medium">
            One time project fee. Pick the package that fits, or reach out for something custom.
            Hosting is optional. You always get your code.
          </p>
        </Reveal>

        {/* Value props — inline text, not icon cards */}
        <Reveal className="mb-16">
          <p className="text-ink text-[14px] font-medium leading-relaxed border-t border-b border-rule py-4">
            <span className="text-forest font-semibold">Fast turnaround</span> · 2 to 4 week delivery
            <span className="text-ink-muted mx-3">|</span>
            <span className="text-forest font-semibold">Mobile first</span> · tested on every screen
            <span className="text-ink-muted mx-3 hidden sm:inline">|</span>
            <br className="sm:hidden" />
            <span className="text-forest font-semibold">SEO ready</span> · built to be found
            <span className="text-ink-muted mx-3">|</span>
            <span className="text-forest font-semibold">You own it</span> · full code handoff
          </p>
        </Reveal>

        {/* All three tiers in one row */}
        <div className="grid sm:grid-cols-3 gap-5">
          {services.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80}>
              <div
                className={`relative p-6 sm:p-7 flex flex-col h-full bg-paper-soft border ${
                  tier.highlighted ? "border-forest" : "border-rule hover:border-rule-bright"
                } transition-colors`}
                style={tier.highlighted ? { boxShadow: "0 24px 60px -24px rgba(37,99,235,0.12)" } : undefined}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-forest mb-2">Most popular</span>
                )}
                <h3 className="font-display font-medium text-[22px] tracking-tight text-ink leading-tight">
                  {tier.name}
                </h3>
                <p className="text-forest font-semibold text-[15px] mt-1">{tier.price}</p>

                <p className="text-ink-soft text-[13px] leading-relaxed my-4 pb-4 border-b border-rule font-medium">
                  {tier.description}
                </p>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[13px]">
                      <Check size={13} className="text-forest flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span className="text-ink-soft leading-relaxed font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/contact"
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 font-semibold text-[13px] transition-colors active:scale-[0.98] ${
                    tier.highlighted
                      ? "bg-clay text-ink hover:bg-clay-deep"
                      : "border border-rule text-ink hover:border-forest hover:text-forest"
                  }`}
                  style={tier.highlighted
                    ? { boxShadow: "0 8px 24px -6px rgba(14,165,233,0.35)", minHeight: 44 }
                    : { minHeight: 44 }
                  }
                >
                  {tier.cta} <span aria-hidden>→</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Payment methods */}
        <Reveal delay={120} className="mt-6">
          <div className="flex items-center justify-center gap-6 py-4 border border-rule bg-paper-soft">
            <span className="text-ink-muted text-[13px] font-medium">We accept</span>
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#008CFF"/>
                <path d="M17.3 7.8l-1.2 7.6c-.1.4-.3.6-.7.6h-1.1l.3-1.8-2.8.0c-.2 0-.3-.1-.3-.3l.1-.5 3-6.9c.1-.3.4-.5.7-.5h1.3c.4 0 .6.2.6.5l.1.3zm-5.8.0c.1-.3.4-.5.7-.5H13.5c.4 0 .6.2.5.5l-2.1 7.2c-.1.3-.4.5-.7.5H9.9c-.4 0-.6-.2-.5-.5L11.5 7.8z" fill="white"/>
              </svg>
              <span className="text-[14px] font-semibold text-[#008CFF]">Venmo</span>
            </div>
            <div className="w-[1px] h-5 bg-rule" />
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#6D1ED4"/>
                <path d="M7 8.5h2.5l1.5 4.5L14.5 8.5H17l-4 8H10.5L7 8.5z" fill="white"/>
              </svg>
              <span className="text-[14px] font-semibold text-[#6D1ED4]">Zelle</span>
            </div>
          </div>
        </Reveal>

        {/* Payment terms */}
        <Reveal delay={160} className="mt-12">
          <div className="bg-paper-soft border border-rule p-6 grid md:grid-cols-3 gap-6">
            {[
              { label: "Standard terms", value: "50% deposit · 50% on delivery" },
              { label: "Larger projects", value: "⅓ / ⅓ / ⅓ milestone splits" },
              { label: "Slot reserved", value: "Project secured with deposit" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] tracking-[0.12em] uppercase text-ink-muted font-semibold">{item.label}</p>
                <p className="text-ink text-[14px] mt-2 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* After launch — two options, asymmetric */}
        <Reveal delay={200} className="mt-16">
          <h2
            className="font-display font-medium text-ink mb-8"
            style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
          >
            After launch, your choice.
          </h2>

          <div className="grid md:grid-cols-[1.3fr_1fr] gap-5">
            <div className="bg-paper-soft border border-rule p-7">
              <FolderArchive size={20} className="text-forest mb-4" strokeWidth={1.75} />
              <h3 className="font-display font-medium text-[20px] text-ink tracking-tight mb-2">Take your files</h3>
              <p className="text-ink-soft text-[13px] leading-relaxed mb-4 font-medium">
                Get the full source code delivered via Google Drive. Host it anywhere. Vercel,
                Netlify, your own server. You own it completely.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Full source code", "Host anywhere", "One time cost"].map((tag) => (
                  <span key={tag} className="text-[10px] tracking-[0.1em] uppercase bg-paper text-ink-soft border border-rule px-2.5 py-1 font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-paper-soft border border-rule p-7">
              <Globe size={20} className="text-forest mb-4" strokeWidth={1.75} />
              <h3 className="font-display font-medium text-[20px] text-ink tracking-tight mb-2">Managed care plans</h3>
              <p className="text-ink-soft text-[13px] leading-relaxed mb-5 font-medium">
                I handle hosting, SSL, and deployments. Cancel anytime.
              </p>
              <div className="space-y-2">
                {carePlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`flex items-center justify-between p-3 border ${
                      plan.highlighted ? "border-forest bg-forest/5" : "border-rule bg-paper"
                    }`}
                  >
                    <div>
                      <span className="text-[13px] font-semibold text-ink">{plan.name}</span>
                      {plan.highlighted && (
                        <span className="text-[9px] tracking-[0.12em] uppercase text-forest font-semibold ml-2">Popular</span>
                      )}
                    </div>
                    <span className="text-forest text-[14px] font-semibold">{plan.price}</span>
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
