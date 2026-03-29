import Reveal from "./Reveal";

const skills = [
  "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Node.js", "Supabase", "Shopify", "Framer",
  "Figma", "SEO", "E-Commerce", "CMS",
];

const highlights = [
  { value: "5+", label: "Years of Experience" },
  { value: "72hr", label: "Avg. First Draft" },
  { value: "15+", label: "Industries Served" },
];

export default function About() {
  return (
    <section id="about" className="bg-[#F2F1EC] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — photo placeholder + stats */}
          <Reveal direction="left">
            <div className="relative">
              {/* Avatar / photo area */}
              <div
                className="w-full aspect-[4/5] rounded-3xl overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #0D1B45 0%, #1E3A8A 100%)' }}
              >
                {/* Photo */}
                <img
                  src="/images/download.png"
                  alt="Brian Whirlow"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[88%] w-auto object-contain object-bottom select-none"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: 'linear-gradient(to top, rgba(6,9,31,0.95) 0%, rgba(6,9,31,0.4) 60%, transparent 100%)' }}>
                  <p className="text-white font-black text-xl tracking-tight">Brian Whirlow</p>
                  <p className="text-white/50 text-sm mt-0.5">Web Designer & Developer</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — bio + skills */}
          <Reveal direction="right" delay={100}>
            <p className="text-[#2563EB] text-[12px] font-semibold tracking-widest uppercase mb-4">
              About Me
            </p>
            <h2 className="text-[clamp(32px,4vw,52px)] font-black text-[#1A1A1A] leading-tight tracking-tight mb-6">
              I build websites that
              <br />
              <span className="text-[#2563EB]">actually work.</span>
            </h2>

            <div className="space-y-4 text-[#555555] text-[15px] leading-relaxed mb-8">
              <p>
                I build websites that get businesses more customers. I&apos;ve worked with restaurants, e-commerce brands, photographers, and service businesses — turning slow, outdated sites into their <span className="text-[#1A1A1A] font-semibold">best-performing sales tool</span>.
              </p>
              <p>
                I started out self-taught and grew into design, realizing that the best websites aren&apos;t just technically solid — they&apos;re strategically built to convert. Every project I take on gets my full attention, from the first wireframe to launch day.
              </p>
            </div>

            {/* Skills chips */}
            <div className="mb-8">
              <p className="text-[11px] text-[#AEACA6] uppercase tracking-widest font-semibold mb-3">Tools & Technologies</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-white border border-[#E5E4DF] text-[#4A4A4A] text-[12px] font-semibold px-3 py-1.5 rounded-full hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#1D4ED8] transition-all hover:scale-[1.03] active:scale-[0.97] text-[14px]"
              >
                Work with me
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-[#737373] font-semibold px-6 py-3.5 rounded-full border border-[#E5E4DF] hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-all text-[14px]"
              >
                View services
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
