import { Linkedin } from "lucide-react";
import { siteConfig } from "@/lib/data";
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
    <section id="about" className="bg-[#F2F1EC] py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left — photo placeholder + stats */}
          <Reveal direction="left">
            <div className="relative">
              <div
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #0D1B45 0%, #1E3A8A 100%)' }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[100px] font-black text-white/10 select-none leading-none">BW</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: 'linear-gradient(to top, rgba(6,9,31,0.9), transparent)' }}>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-black text-lg tracking-tight">Brian Whirlow</p>
                      <p className="text-white/50 text-[13px] mt-0.5">Web Designer & Developer</p>
                    </div>
                    <a
                      href={siteConfig.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#2563EB] hover:border-[#2563EB] transition-all"
                    >
                      <Linkedin size={18} className="text-white" />
                    </a>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 grid grid-cols-2 sm:flex gap-2 w-[calc(100%-32px)] sm:w-[calc(100%-40px)]">
                  {[
                    { value: "72hr", label: "First Draft" },
                    { value: "5+", label: "Years Exp." },
                    { value: "100%", label: "Satisfaction" },
                    { value: "5.0★", label: "Avg. Rating" },
                  ].map((badge) => (
                    <div key={badge.label} className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-2 text-center">
                      <p className="text-white font-black text-sm sm:text-base leading-none">{badge.value}</p>
                      <p className="text-white/50 text-[8px] uppercase tracking-widest mt-1 font-medium">{badge.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — bio + skills */}
          <Reveal direction="right" delay={100}>
            <p className="text-[#2563EB] text-[13px] font-semibold tracking-widest uppercase mb-3">
              About Me
            </p>
            <h2 className="text-[clamp(24px,2.8vw,38px)] font-black text-[#1A1A1A] leading-tight tracking-tight mb-4">
              I build websites that
              <br />
              <span className="text-[#2563EB]">actually work.</span>
            </h2>

            <div className="space-y-3 text-[#555555] text-[14px] leading-relaxed mb-6">
              <p>
                I build websites that get businesses more customers. I&apos;ve worked with restaurants, e-commerce brands, photographers, and service businesses — turning slow, outdated sites into their <span className="text-[#1A1A1A] font-semibold">best-performing sales tool</span>.
              </p>
              <p>
                I started out self-taught and grew into design, realizing that the best websites aren&apos;t just technically solid — they&apos;re strategically built to convert. Every project I take on gets my full attention, from the first wireframe to launch day.
              </p>
            </div>

            {/* Skills chips */}
            <div className="mb-5">
              <p className="text-[11px] text-[#AEACA6] uppercase tracking-widest font-semibold mb-2.5">Tools & Technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-white border border-[#E5E4DF] text-[#4A4A4A] text-[11px] font-semibold px-2.5 py-1 rounded-full hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-5 py-3 rounded-full hover:bg-[#1D4ED8] transition-all hover:scale-[1.03] active:scale-[0.97] text-[13px]"
              >
                Work with me
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-[#737373] font-semibold px-5 py-3 rounded-full border border-[#E5E4DF] hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-all text-[13px]"
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
