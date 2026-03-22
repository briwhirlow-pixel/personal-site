import Reveal from "./Reveal";

const skills = [
  "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Node.js", "Supabase", "Shopify", "Framer",
  "Figma", "SEO", "E-Commerce", "CMS",
];

const highlights = [
  { value: "5+", label: "Years of Experience" },
  { value: "40+", label: "Sites Launched" },
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
                {/* Initials placeholder — swap for a real <img> when you have a photo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[120px] font-black text-white/10 select-none leading-none">BW</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: 'linear-gradient(to top, rgba(6,9,31,0.9), transparent)' }}>
                  <p className="text-white font-black text-xl tracking-tight">Brian Whirlow</p>
                  <p className="text-white/50 text-sm mt-0.5">Web Designer & Developer</p>
                </div>

                {/* Floating badges — stacked under BW initials */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3 w-[calc(100%-40px)]">
                  {[
                    { value: "40+", label: "Sites Built" },
                    { value: "5+", label: "Years Exp." },
                    { value: "100%", label: "Satisfaction" },
                    { value: "3×", label: "Traffic Growth" },
                  ].map((badge) => (
                    <div key={badge.label} className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 text-center">
                      <p className="text-white font-black text-xl leading-none">{badge.value}</p>
                      <p className="text-white/50 text-[9px] uppercase tracking-widest mt-1 font-medium">{badge.label}</p>
                    </div>
                  ))}
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
                Hey — I&apos;m Brian. I&apos;m a freelance web designer and developer with over 5 years of experience helping businesses of all sizes build their online presence.
              </p>
              <p>
                I started out as a self-taught developer and grew into design, realizing that the best websites aren&apos;t just technically solid — they&apos;re also <span className="text-[#1A1A1A] font-semibold">visually compelling and strategically built to convert</span>. That combination is what I bring to every project. I&apos;m constantly staying on top of the latest in design and tech so your site is always built with modern best practices.
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
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#1D4ED8] transition-all hover:scale-[1.03] active:scale-[0.97] text-[14px]"
              >
                Work with me
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
              <a
                href="#services"
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
