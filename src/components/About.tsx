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

        <div className="grid md:grid-cols-2 gap-10 items-start">

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
                  <div className="flex flex-col items-center gap-2">
                    <a
                      href={siteConfig.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#2563EB] hover:border-[#2563EB] transition-all"
                    >
                      <Linkedin size={18} className="text-white" />
                    </a>
                    <div className="text-center">
                      <p className="text-white font-black text-lg tracking-tight">Brian Whirlow</p>
                      <p className="text-white/50 text-[13px] mt-0.5">Web Designer & Developer</p>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 grid grid-cols-2 sm:flex gap-2 w-[calc(100%-32px)] sm:w-[calc(100%-40px)]">
                  {[
                    { value: "72hr", label: "First Draft" },
                    { value: "5+", label: "Years Exp." },
                    { value: "100%", label: "Satisfaction" },
                    { value: "5.0★", label: "Avg. Rating" },
                  ].map((badge) => (
                    <div key={badge.label} className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-3 text-center">
                      <p className="text-white font-black text-lg sm:text-xl leading-none">{badge.value}</p>
                      <p className="text-white/50 text-[9px] uppercase tracking-widest mt-1.5 font-medium">{badge.label}</p>
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
                Welcome to BuiltByBrian! I&apos;m a web designer and developer based in the Philadelphia/South Jersey area. I started building sites for fun, realized I had a knack for making them actually convert, and turned that passion into a business.
              </p>
              <p>
                I&apos;ve worked with restaurants, e-commerce brands, photographers, and service businesses — turning slow, outdated sites into their <span className="text-[#1A1A1A] font-semibold">best-performing sales tool</span>. You&apos;ll always know where your project stands — no ghosting, no vague timelines, just clean work delivered fast.
              </p>
              <p>
                I hold a degree in Management Information Systems and am currently finishing my MBA in Sustainable Business and Management — meaning I think about your website as a business tool, not just a design project. Outside of work I&apos;m hiking, working out, traveling, and spending time with family and friends.
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
