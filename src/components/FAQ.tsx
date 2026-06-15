"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "How much does a website cost?",
    a: "Every project is different, but most sites I build range from $750 for a simple landing page to $5,000+ for a full custom ecommerce store. After a quick discovery call I can give you an exact quote , no surprises.",
  },
  {
    q: "How long does it take?",
    a: "You'll have a first draft in your hands within 5 days of the discovery call. Full projects typically wrap in 1 to 4 weeks depending on scope and how quickly feedback comes in.",
  },
  {
    q: "How many revisions do I get?",
    a: "Every package includes 2 rounds of revisions. Additional rounds are available at $75 each , though in practice, most projects are dialed in within those two rounds.",
  },
  {
    q: "Do I need to provide content and copy?",
    a: "Not necessarily. I can work with content you provide, or help you structure and write copy that converts. Just let me know where you're at and we'll figure it out together.",
  },
  {
    q: "Will my site work on mobile?",
    a: "Every site I build is fully responsive , tested across phones, tablets, and desktops before it ever goes live. Mobile first is the default, not an afterthought.",
  },
  {
    q: "How does payment work?",
    a: "50% upfront to secure your project slot, 50% on delivery before files are handed over. For larger projects I offer a 3 payment split: 33% to start, 33% at design approval, 33% on launch. No work begins until the deposit is received.",
  },
  {
    q: "Do you offer ongoing maintenance?",
    a: "Yes. Once your site launches I offer monthly maintenance packages that cover updates, security checks, performance monitoring, and content changes. Ask me about it during the discovery call.",
  },
  {
    q: "Can I update the site myself after launch?",
    a: "Absolutely. I set up a CMS (like Sanity or Contentful) when it makes sense so you can update text, images, and blog posts without touching any code.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-paper text-ink pt-16 pb-24">
      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Section header */}
        <Reveal>
          <div className="flex items-baseline pb-4 border-b border-rule mb-12">
            <span className="font-serif font-semibold text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
              Frequently Asked
            </span>
          </div>
        </Reveal>

        <Reveal className="mb-12">
          <h2 className="font-serif text-[clamp(36px,5.5vw,64px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal">
            Questions people{" "}
            <span className="italic text-forest">actually ask.</span>
          </h2>
        </Reveal>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 40}>
              <div
                className={`border rounded-[6px] overflow-hidden transition-all duration-300 ${
                  open === i ? "border-forest/40 bg-paper-soft" : "border-rule bg-paper-soft/40 hover:border-rule-bright"
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 text-left gap-4"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-serif font-semibold text-[10px] tracking-[0.22em] uppercase text-clay font-semibold flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-semibold text-ink leading-snug">{faq.q}</span>
                  </span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-[4px] flex items-center justify-center border transition-all duration-300 ${
                      open === i ? "bg-forest border-forest rotate-45" : "border-rule text-ink-soft"
                    }`}
                  >
                    <Plus size={13} strokeWidth={2.5} className={open === i ? "text-paper" : ""} />
                  </span>
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open === i ? "max-h-96" : "max-h-0"}`}>
                  <p className="px-5 sm:px-6 pb-5 pl-12 sm:pl-14 text-ink-soft text-[13.5px] sm:text-[14.5px] leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="text-center text-ink-muted text-[13px] mt-12 font-medium">
            Still have questions?{" "}
            <a href="/contact" className="text-forest font-semibold hover:text-forest-bright transition-colors border-b border-forest/30 hover:border-forest pb-0.5">
              Send me a message →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
