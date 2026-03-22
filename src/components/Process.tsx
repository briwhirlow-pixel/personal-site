import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description: "We start with a free 30-minute call to understand your goals, audience, brand, and vision for the site.",
    icon: "💬",
  },
  {
    number: "02",
    title: "Design & Build",
    description: "I design your site and build it with regular check-ins so you're always in the loop and love what you're getting.",
    icon: "🎨",
  },
  {
    number: "03",
    title: "Launch & Grow",
    description: "Your site goes live. I handle the technical side so you can focus on your business — and I'm always here if you need me.",
    icon: "🚀",
  },
];

export default function Process() {
  return (
    <section className="bg-[#F2F1EC] py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="text-center mb-16">
          <p className="text-[#2563EB] text-[12px] font-semibold tracking-widest uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-black text-[#1A1A1A] leading-tight tracking-tight">
            Simple process. Real results.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-[#E5E4DF]" style={{ zIndex: 0 }} />

          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 150} direction="up">
              <div className="relative bg-white rounded-2xl p-8 border border-[#E5E4DF] hover:border-[#2563EB]/20 hover:shadow-lg transition-all text-center group">
                {/* Step icon circle */}
                <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2563EB] transition-colors">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div className="text-[#2563EB] text-[11px] font-black tracking-widest uppercase mb-2">{step.number}</div>
                <h3 className="text-[19px] font-black text-[#1A1A1A] tracking-tight mb-3">{step.title}</h3>
                <p className="text-[#737373] text-[14px] leading-relaxed">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#1D4ED8] transition-all hover:scale-[1.03] active:scale-[0.97] text-[15px]"
          >
            Start with a free call
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
