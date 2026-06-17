import { Linkedin, Facebook, Mail } from "lucide-react";
import { siteConfig } from "@/lib/data";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <div className="grid md:grid-cols-12 gap-x-10 gap-y-12 items-start pt-4">

          {/* Left — photo card, no decorative frame */}
          <Reveal className="md:col-span-5">
            <div className="relative bg-paper-soft border border-rule overflow-hidden">
              <div
                className="aspect-[4/5] relative overflow-hidden flex flex-col justify-center"
                style={{
                  backgroundImage: "url(/images/about-marbled.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(12,10,8,0.5) 0%, rgba(12,10,8,0.65) 45%, rgba(12,10,8,0.5) 100%)",
                  }}
                />

                <div
                  className="relative z-10 px-7 sm:px-8 py-10 text-center"
                  style={{ textShadow: "0 2px 18px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.8)" }}
                >
                  <p
                    className="font-display font-extrabold leading-[1.05] tracking-tight mt-3 text-ink"
                    style={{ fontSize: 'clamp(28px, 4.5vw, 38px)' }}
                  >
                    Brian Whirlow
                  </p>
                  <p className="text-ink-soft text-[13px] mt-2 font-medium">
                    Designer & Developer · Phila / South Jersey
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-6">
                    <a
                      href={siteConfig.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="w-11 h-11 border border-ink/20 bg-ink/10 flex items-center justify-center text-ink hover:bg-forest hover:text-paper hover:border-forest transition-colors"
                      style={{ minWidth: 44, minHeight: 44 }}
                    >
                      <Linkedin size={16} strokeWidth={1.75} />
                    </a>
                    <a
                      href="https://www.facebook.com/marketplace/profile/100001427946097/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-11 h-11 border border-ink/20 bg-ink/10 flex items-center justify-center text-ink hover:bg-forest hover:text-paper hover:border-forest transition-colors"
                      style={{ minWidth: 44, minHeight: 44 }}
                    >
                      <Facebook size={16} strokeWidth={1.75} />
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      aria-label="Email"
                      className="w-11 h-11 border border-ink/20 bg-ink/10 flex items-center justify-center text-ink hover:bg-forest hover:text-paper hover:border-forest transition-colors"
                      style={{ minWidth: 44, minHeight: 44 }}
                    >
                      <Mail size={16} strokeWidth={1.75} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — bio */}
          <Reveal delay={100} className="md:col-span-7">
            <h2
              className="font-display font-extrabold leading-[0.95] tracking-[-0.025em] text-ink"
              style={{ fontSize: 'clamp(32px, 5.5vw, 56px)' }}
            >
              I build websites that convert visitors into customers.
            </h2>

            <div className="space-y-4 text-ink-soft text-[15px] sm:text-[16px] leading-[1.65] mt-7 mb-8 font-medium">
              <p>
                I&apos;m Brian, a web designer and developer based in the Philadelphia / South Jersey area.
                With <span className="text-ink font-semibold">5 years of building websites</span> under my belt,
                I turned that into a business helping local brands grow online.
              </p>
              <p>
                I&apos;ve worked with restaurants, ecommerce brands, photographers, and service businesses,
                turning slow, outdated sites into their{" "}
                <span className="text-ink font-semibold">best performing sales tool</span>.
                You&apos;ll always know where your project stands. No vague timelines, just clean work, delivered fast.
              </p>
              <p>
                I hold a degree in Management Information Systems and am currently finishing my MBA
                in Sustainable Business and Management. When I&apos;m not building websites, I&apos;m
                hiking, working out, traveling, and spending time with family and friends.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-clay text-ink font-semibold px-6 py-4 hover:bg-clay-deep transition-colors text-[14px] active:scale-[0.98]"
                style={{ boxShadow: "0 8px 24px -8px rgba(232,88,58,0.45)", minHeight: 48 }}
              >
                Work with me
                <span aria-hidden className="text-[15px] leading-none">→</span>
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 text-ink font-semibold px-6 py-4 border border-rule hover:border-forest hover:text-forest transition-colors text-[14px]"
                style={{ minHeight: 48 }}
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
