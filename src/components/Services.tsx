import { services } from "@/lib/data";
import { Check } from "lucide-react";
import Reveal from "./Reveal";

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
            One-time project fee. Pick the package that fits, or reach out for something custom. Hosting is optional — you always get your code.
          </p>
        </Reveal>

        {/* Scrolling marquee strip */}
        <div className="-mx-5 sm:-mx-8 md:-mx-12 overflow-hidden mb-10 sm:mb-16 py-1">
          <div
            className="flex gap-4"
            style={{ animation: prefersReducedMotion ? 'none' : 'marquee 22s linear infinite', width: 'max-content' }}
          >
            {[
              { icon: '⚡', label: 'Fast Turnaround', sub: '2–4 week delivery' },
              { icon: '📱', label: 'Mobile-First', sub: 'Looks great on every screen' },
              { icon: '🔍', label: 'SEO Ready', sub: 'Built to be found on Google' },
              { icon: '📁', label: 'You Own It', sub: 'Full code handoff, no lock-in' },
              { icon: '⚡', label: 'Fast Turnaround', sub: '2–4 week delivery' },
              { icon: '📱', label: 'Mobile-First', sub: 'Looks great on every screen' },
              { icon: '🔍', label: 'SEO Ready', sub: 'Built to be found on Google' },
              { icon: '📁', label: 'You Own It', sub: 'Full code handoff, no lock-in' },
            ].map((f, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-white rounded-xl px-5 py-3.5 border border-[#E5E4DF] shadow-sm">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A] whitespace-nowrap">{f.label}</p>
                  <p className="text-[12px] text-[#737373] whitespace-nowrap">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                        <Check size={8} strokeWidth={3} color={tier.highlighted ? 'white' : '#2563EB'} />
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
            <p className="text-[#737373] text-[13px]">Your project slot is secured with a 50% deposit.</p>
          </div>
        </Reveal>

        {/* Accepted payments */}
        <Reveal delay={180} className="mt-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-[#737373] text-[17px] font-bold uppercase tracking-widest">We accept</span>
            {/* Venmo */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5E4DF] rounded-full px-6 py-3">
              <svg width="24" height="24" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="111" height="111" rx="22" fill="#008CFF"/>
                <path d="M82.5 20.5c3.2 5.3 4.6 10.7 4.6 17.5 0 21.8-18.6 50.1-33.7 70H21.5L8 22.8l30.7-2.9 7.5 60.2c7-11.6 15.6-29.9 15.6-42.4 0-6.8-1.2-11.5-3-15.2L82.5 20.5z" fill="white"/>
              </svg>
              <span className="text-[16px] font-bold text-[#1A1A1A]">Venmo</span>
            </div>
            {/* PayPal */}
            <div className="flex items-center gap-2.5 bg-white border border-[#E5E4DF] rounded-full px-6 py-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.477z" fill="#009CDE"/>
                <path d="M6.635 7.025a.982.982 0 0 1 .97-.833h6.137c.728 0 1.4.047 2.011.145a8.1 8.1 0 0 1 .81.18 5.78 5.78 0 0 1 1.15.504c.346-2.208-.003-3.712-1.195-5.076C15.222.518 12.99 0 10.072 0H2.612C2.088 0 1.64.382 1.557.9L-1.05 20.658a.641.641 0 0 0 .633.74h4.604l1.156-7.326 1.292-7.047z" fill="#012169"/>
              </svg>
              <span className="text-[16px] font-bold text-[#1A1A1A]">PayPal</span>
            </div>
          </div>
        </Reveal>

        {/* After launch strip */}
        <Reveal delay={200} className="mt-8 sm:mt-10">
          <div className="border border-[#E5E4DF] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E4DF] bg-white text-center">
              <p className="text-[15px] font-black uppercase tracking-widest text-[#1A1A1A]">After Launch — Your Choice</p>
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
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#1A1A1A] text-[15px] mb-1">Managed care plans</p>
                  <p className="text-[#737373] text-[13px] leading-relaxed mb-4">
                    I handle hosting, SSL, and deployments. Pick the plan that fits — cancel anytime, pay yearly and save 2 months.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Basic", price: "$49/mo", features: ["Hosting + SSL", "Uptime monitoring", "Daily backups"] },
                      { name: "Starter", price: "$99/mo", features: ["Everything in Basic", "1 hr edits/month", "Priority support"], highlighted: true },
                      { name: "Growth", price: "$149/mo", features: ["Everything in Starter", "2 hrs edits/month", "Monthly SEO report"] },
                    ].map((plan) => (
                      <div key={plan.name} className={`rounded-xl p-3 border ${plan.highlighted ? 'border-[#2563EB]/40 bg-[#2563EB]/5' : 'border-[#E5E4DF] bg-[#F9F9F7]'}`}>
                        <p className="text-[10px] font-bold text-[#737373] uppercase tracking-wide mb-0.5">{plan.name}</p>
                        <p className="text-[14px] font-black text-[#2563EB] mb-2">{plan.price}</p>
                        <ul className="space-y-1">
                          {plan.features.map(f => (
                            <li key={f} className="text-[10px] text-[#737373] flex items-start gap-1 leading-snug">
                              <span className="text-[#2563EB] flex-shrink-0">✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
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
