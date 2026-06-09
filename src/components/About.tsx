import { Linkedin, Facebook, Mail, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/data";
import Reveal from "./Reveal";

const skills = [
  "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Node.js", "Supabase", "Shopify", "Framer",
  "Figma", "SEO", "E-Commerce", "CMS",
];

const badges = [
  { value: "5-Day", label: "First Draft" },
  { value: "5+", label: "Years Exp." },
  { value: "5.0★", label: "Rating" },
];

export default function About() {
  return (
    <section id="about" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <div className="grid md:grid-cols-12 gap-x-10 gap-y-12 items-start pt-4">

          {/* Left — profile card */}
          <Reveal direction="left" className="md:col-span-5">
            <div className="relative">
              {/* Forest accent backdrop (straight, no rotation) */}
              <div
                aria-hidden
                className="absolute -inset-2 bg-forest rounded-[6px]"
              />

              <div className="relative bg-paper-soft border border-rule rounded-[4px] overflow-hidden">
                {/* Designer info — lives inside the blue */}
                <div
                  className="aspect-[4/5] relative overflow-hidden flex flex-col justify-center"
                  style={{ background: "linear-gradient(135deg, #2563EB, #1E40AF)" }}
                >
                  {/* Tech corner ticks */}
                  <span aria-hidden className="absolute top-3 left-3 w-3 h-3 border-t border-l border-paper/40" />
                  <span aria-hidden className="absolute top-3 right-3 w-3 h-3 border-t border-r border-paper/40" />
                  <span aria-hidden className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-paper/40" />
                  <span aria-hidden className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-paper/40" />

                  <div className="relative px-7 sm:px-8 py-10">
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/60">The designer</p>
                    <p className="font-serif text-[clamp(30px,4.5vw,40px)] leading-[1.05] tracking-tight mt-3 text-paper">
                      Brian <span className="italic">Whirlow</span>
                    </p>
                    <p className="text-paper/70 text-[13px] mt-2 font-medium">Lead Designer &amp; Developer · Phila / NJ</p>

                    <div className="flex items-center gap-2 mt-6">
                      <a
                        href={siteConfig.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="w-9 h-9 rounded-[6px] border border-paper/25 bg-paper/10 flex items-center justify-center text-paper hover:bg-paper hover:text-forest hover:border-paper transition-colors"
                      >
                        <Linkedin size={16} strokeWidth={1.75} />
                      </a>
                      <a
                        href="https://www.facebook.com/marketplace/profile/100001427946097/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="w-9 h-9 rounded-[6px] border border-paper/25 bg-paper/10 flex items-center justify-center text-paper hover:bg-paper hover:text-forest hover:border-paper transition-colors"
                      >
                        <Facebook size={16} strokeWidth={1.75} />
                      </a>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        aria-label="Email"
                        className="w-9 h-9 rounded-[6px] border border-paper/25 bg-paper/10 flex items-center justify-center text-paper hover:bg-paper hover:text-forest hover:border-paper transition-colors"
                      >
                        <Mail size={16} strokeWidth={1.75} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-3 gap-px bg-rule border-t border-rule">
                  {badges.map((b) => (
                    <div key={b.label} className="bg-paper-soft px-2 py-3 text-center">
                      <p className="font-sans font-bold text-ink text-[15px] leading-none">{b.value}</p>
                      <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-ink-muted mt-1.5">{b.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — bio + skills */}
          <Reveal direction="right" delay={100} className="md:col-span-7">
            <h2 className="font-serif text-[clamp(32px,5.5vw,64px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal">
              I build websites that{" "}
              <span className="italic text-forest">actually work.</span>
            </h2>

            <div className="space-y-4 text-ink-soft text-[15px] sm:text-[16px] leading-[1.65] mt-7 mb-8 font-medium">
              <p>
                I&apos;m Brian — a web designer and developer based in the Philadelphia / South Jersey area.
                With <span className="text-ink font-semibold">5 years of building websites</span> under my belt,
                I turned that passion into a business helping local brands grow online.
              </p>
              <p>
                I&apos;ve worked with restaurants, e-commerce brands, photographers, and service businesses —
                turning slow, outdated sites into their{" "}
                <span className="text-ink font-semibold">best-performing sales tool</span>.
                You&apos;ll always know where your project stands — no ghosting, no vague timelines,
                just clean work, delivered fast.
              </p>
              <p>
                I hold a degree in Management Information Systems and am currently finishing my MBA
                in Sustainable Business and Management. When I&apos;m not building websites, I&apos;m
                hiking, working out, traveling, and spending time with family and friends.
              </p>
            </div>

            {/* Skills */}
            <div className="mb-8 pb-8 border-b border-rule">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-muted mb-3">
                Tools & Technologies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[11px] tracking-wide bg-paper-soft border border-rule text-ink-soft px-2.5 py-1.5 rounded-[3px] hover:border-forest hover:text-forest transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 bg-forest text-paper font-semibold px-6 py-3.5 rounded-[6px] hover:bg-forest-deep transition-colors text-[14px]"
                style={{ boxShadow: "0 8px 24px -8px rgba(37,99,235,0.5)" }}
              >
                Work with me
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-ink font-semibold px-6 py-3.5 rounded-[6px] border border-rule hover:border-forest hover:text-forest transition-colors text-[14px]"
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
