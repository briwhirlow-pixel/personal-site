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

        {/* Payment terms */}
        <Reveal delay={160} className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 bg-white border border-[#E5E4DF] rounded-2xl px-6 py-4">
            <p className="text-[#737373] text-[13px]">
              <span className="font-bold text-[#1A1A1A]">Payment terms:</span> 50% deposit to start · 50% on delivery
            </p>
            <span className="hidden sm:block w-px h-4 bg-[#E5E4DF]" />
            <p className="text-[#737373] text-[13px]">
              <span className="font-bold text-[#1A1A1A]">Larger projects:</span> ⅓ / ⅓ / ⅓ milestone splits available
            </p>
            <span className="hidden sm:block w-px h-4 bg-[#E5E4DF]" />
            <p className="text-[#737373] text-[13px]">No work begins without a deposit.</p>
          </div>
        </Reveal>

        {/* After launch strip */}
        <Reveal delay={200} className="mt-8 sm:mt-10">
          <div className="border border-[#E5E4DF] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E4DF] bg-white">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#737373]">After launch — your choice</p>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E4DF] bg-white">
              {/* File Handoff */}
              <div className="p-6 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#F2F1EC] flex items-center justify-center flex-shrink-0 text-lg">📁</div>
                <div>
                  <p className="font-black text-[#1A1A1A] text-[15px] mb-1">Take your files</p>
                  <p className="text-[#737373] text-[13px] leading-relaxed mb-3">
                    Get the full source code delivered via Google Drive. Host it anywhere — Vercel, Netlify, your own server. You own it completely.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Full source code", "Host anywhere", "One-time cost"].map(tag => (
                      <span key={tag} className="text-[11px] font-semibold bg-[#F2F1EC] text-[#4A4A4A] px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Managed Hosting */}
              <div className="p-6 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0 text-lg">🌐</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-[#1A1A1A] text-[15px]">Managed hosting</p>
                    <span className="text-[10px] font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded-full">$49/mo</span>
                  </div>
                  <p className="text-[#737373] text-[13px] leading-relaxed mb-3">
                    We handle hosting, SSL, uptime, and deployments. Includes 1 hour of free edits every month. Pay yearly and get 2 months free.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Hosting + SSL", "1hr edits/mo", "$490/yr saves $98"].map(tag => (
                      <span key={tag} className="text-[11px] font-semibold bg-[#2563EB]/8 text-[#2563EB] px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
