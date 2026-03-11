import { services } from "@/lib/data";
import { Check } from "lucide-react";
import { clsx } from "clsx";

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-medium text-sm uppercase tracking-widest mb-3">
            Services & Pricing
          </p>
          <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            No hidden fees. Pick the package that fits your needs, or reach out
            for a custom quote.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((tier) => (
            <div
              key={tier.name}
              className={clsx(
                "rounded-2xl border p-8 flex flex-col",
                tier.highlighted
                  ? "border-indigo-600 shadow-lg shadow-indigo-100 bg-indigo-50"
                  : "border-zinc-200 bg-white"
              )}
            >
              {tier.highlighted && (
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-4">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-zinc-900 mb-1">
                {tier.name}
              </h3>
              <p className="text-2xl font-bold text-indigo-600 mb-4">
                {tier.price}
              </p>
              <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                {tier.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      size={16}
                      className="text-indigo-600 mt-0.5 shrink-0"
                    />
                    <span className="text-zinc-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={clsx(
                  "block text-center py-3 px-6 rounded-lg font-medium text-sm transition-colors",
                  tier.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-zinc-300 text-zinc-800 hover:border-indigo-600 hover:text-indigo-600"
                )}
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
