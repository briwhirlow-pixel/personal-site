import { services } from "@/lib/data";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="bg-[#FAFAF7] py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <Reveal className="max-w-2xl mb-10 sm:mb-16">
          <p className="text-[#2563EB] text-[12px] font-semibold tracking-widest uppercase mb-4">
            Services & Pricing
          </p>
          <h2 className="text-[clamp(32px,4.5vw,56px)] font-black text-[#1A1A1A] leading-tight tracking-tight mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-[#737373] text-[17px] leading-relaxed">
            No hidden fees. Pick the package that fits, or reach out for something custom.
          </p>
        </Reveal>

        <Reveal delay={100} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-16">
          {[
            { icon: '⚡', label: 'Fast Delivery', sub: '2–4 week turnaround' },
            { icon: '📱', label: 'Fully Responsive', sub: 'Every screen size' },
            { icon: '🔍', label: 'SEO Optimized', sub: 'Built to be found' },
            { icon: '♾️', label: 'Ongoing Support', sub: "I don't disappear" },
          ].map((f) => (
            <div key={f.label} className="bg-white rounded-xl p-4 border border-[#E5E4DF] hover:border-[#2563EB]/30 hover:shadow-md transition-all group cursor-default">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <p className="text-[13px] font-bold text-[#1A1A1A]">{f.label}</p>
              <p className="text-[12px] text-[#737373] mt-0.5">{f.sub}</p>
            </div>
          ))}
        </Reveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {services.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 120} direction="up">
              <div className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                tier.highlighted
                  ? "bg-[#111111] text-white shadow-2xl shadow-black/20 scale-[1.02]"
                  : "bg-white border border-[#E5E4DF] hover:border-[#2563EB]/30 hover:shadow-xl hover:shadow-[#2563EB]/5"
              }`}>
                {tier.highlighted && (
                  <span className="absolute -top-3 left-6 bg-[#2563EB] text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <h3 className={`text-xl font-black tracking-tight mb-1 ${tier.highlighted ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    {tier.name}
                  </h3>
                  <p className="text-2xl font-black text-[#2563EB]">{tier.price}</p>
                </div>
                <p className={`text-[14px] leading-relaxed mb-6 ${tier.highlighted ? 'text-white/60' : 'text-[#737373]'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3 flex-1 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-[13px]">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${tier.highlighted ? 'bg-[#2563EB]' : 'bg-[#2563EB]/10'}`}>
                        <svg width="8" height="8" fill="none" stroke={tier.highlighted ? 'white' : '#2563EB'} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </div>
                      <span className={tier.highlighted ? 'text-white/80' : 'text-[#4A4A4A]'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="/contact" className={`block text-center py-3.5 px-6 rounded-full font-semibold text-[14px] transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  tier.highlighted
                    ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "bg-[#F2F1EC] text-[#1A1A1A] hover:bg-[#2563EB] hover:text-white"
                }`}>
                  {tier.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
