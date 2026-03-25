"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "How much does a website cost?",
    a: "Every project is different, but most sites I build range from $500 for a simple landing page to $5,000+ for a full custom e-commerce store. After a quick discovery call I can give you an exact quote — no surprises.",
  },
  {
    q: "How long does it take?",
    a: "You'll have a first draft in your hands within 72 hours of the discovery call. Full projects typically wrap in 1–4 weeks depending on scope and how quickly feedback comes in.",
  },
  {
    q: "How many revisions do I get?",
    a: "As many as it takes to get it right. I don't cap revisions — I'd rather take an extra round than hand you something you're not proud of.",
  },
  {
    q: "Do I need to provide content and copy?",
    a: "Not necessarily. I can work with content you provide, or help you structure and write copy that converts. Just let me know where you're at and we'll figure it out together.",
  },
  {
    q: "Will my site work on mobile?",
    a: "Every site I build is fully responsive — tested across phones, tablets, and desktops before it ever goes live. Mobile-first is the default, not an afterthought.",
  },
  {
    q: "How does payment work?",
    a: "50% upfront to secure your project slot, 50% on delivery before files are handed over. For larger projects I offer a 3-payment split: 33% to start, 33% at design approval, 33% on launch. No work begins until the deposit is received.",
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
    <section id="faq" className="bg-[#FAFAF7] py-28">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-[12px] font-semibold tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-[clamp(30px,4vw,48px)] font-black text-[#1A1A1A] leading-tight tracking-tight">
              Questions people actually ask.
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 40}>
              <div
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  open === i ? "border-[#2563EB]/30 bg-white shadow-[0_4px_24px_rgba(37,99,235,0.06)]" : "border-[#E5E4DF] bg-white hover:border-[#2563EB]/20"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left gap-3 sm:gap-4"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-[13px] sm:text-[15px] font-bold text-[#1A1A1A] leading-snug">{faq.q}</span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    open === i ? "bg-[#2563EB] border-[#2563EB] rotate-45" : "border-[#E5E4DF] text-[#737373]"
                  }`}>
                    <svg width="12" height="12" fill="none" stroke={open === i ? "white" : "currentColor"} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open === i ? "max-h-48" : "max-h-0"}`}>
                  <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-[#737373] text-[13px] sm:text-[14px] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="text-center text-[#AEACA6] text-[13px] mt-10">
            Still have questions?{" "}
            <a href="/contact" className="text-[#2563EB] font-semibold hover:underline">
              Send me a message →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
