import Reveal from "./Reveal";

const stats = [
  {
    value: "72hr",
    label: "First Draft Delivered",
    sub: "From discovery call to design in your hands.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
  },
  {
    value: "5.0★",
    label: "Client Rating",
    sub: "Every project handed off with pride — no exceptions.",
    icon: (
      <svg width="20" height="20" fill="#2563EB" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    value: "15+",
    label: "Industries Served",
    sub: "Restaurants, e-commerce, portfolios, agencies, and more.",
    icon: (
      <svg width="20" height="20" fill="none" stroke="#2563EB" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
      </svg>
    ),
  },
];

export default function SocialProof() {
  return (
    <section className="bg-[#FAFAF7] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <Reveal>
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-[#AEACA6] mb-6 sm:mb-8">
            Why clients choose byBrian
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="group bg-white border border-[#E5E4DF] rounded-2xl p-6 sm:p-7 flex flex-col gap-4 hover:border-[#2563EB]/25 hover:shadow-[0_8px_32px_rgba(37,99,235,0.07)] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <p className="text-[32px] sm:text-[36px] font-black text-[#1A1A1A] leading-none tracking-tight">
                    {stat.value}
                  </p>
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A1A] mb-1">{stat.label}</p>
                  <p className="text-[13px] text-[#737373] leading-relaxed">{stat.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
            <p className="text-[13px] text-[#AEACA6]">Ready to get started?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-[#2563EB] font-semibold text-[13px] hover:gap-3 transition-all"
            >
              Book a free discovery call
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
