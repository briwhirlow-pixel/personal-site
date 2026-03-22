import { services } from "@/lib/data";
import { Check } from "lucide-react";

export default function Services() {
  return (
    <section id="services" className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 pb-8 border-b border-zinc-200">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-4">
              Services & Pricing
            </p>
            <h2 className="text-[clamp(36px,5vw,60px)] font-black text-black leading-tight tracking-tight">
              Simple,
              <br />
              transparent pricing.
            </h2>
          </div>
          <p className="text-zinc-500 text-[15px] leading-relaxed max-w-xs md:text-right">
            No hidden fees. Pick the package that fits, or reach out for something custom.
          </p>
        </div>

        {/* Pricing tiers — horizontal list style */}
        <div className="divide-y divide-zinc-100">
          {services.map((tier, i) => (
            <div
              key={tier.name}
              className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-8 items-start py-10 group"
            >
              {/* Name + price */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[11px] tracking-widest text-zinc-300 font-medium">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl font-black text-black tracking-tight">{tier.name}</h3>
                  {tier.highlighted && (
                    <span className="text-[10px] tracking-widest uppercase bg-black text-white px-2 py-0.5 font-semibold">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-black mt-2">{tier.price}</p>
              </div>

              {/* Description */}
              <p className="text-zinc-500 text-[14px] leading-relaxed">{tier.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13px] text-zinc-600">
                    <Check size={13} className="text-black mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#contact"
                className="text-[11px] tracking-widest uppercase font-semibold border border-black text-black px-6 py-3 hover:bg-black hover:text-white transition-all whitespace-nowrap self-start"
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
