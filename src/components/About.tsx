import Image from "next/image";
import { Linkedin, Facebook, Mail } from "lucide-react";
import { siteConfig } from "@/lib/data";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <div className="max-w-2xl bg-paper-soft border border-rule p-6 sm:p-8 md:p-10">

            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.025em] text-ink"
              style={{ fontSize: 'clamp(32px, 6vw, 56px)' }}
            >
              Brian Whirlow
            </h1>
            <p className="font-display font-extrabold tracking-[-0.025em] text-ink-soft text-[15px] sm:text-[17px] mt-1">
              Designer & Developer · Philadelphia / South Jersey
            </p>

            <div className="flex items-center gap-2 mt-5">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 border border-rule bg-paper flex items-center justify-center text-ink-soft hover:bg-forest hover:text-white hover:border-forest transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <Linkedin size={16} strokeWidth={1.75} />
              </a>
              <a
                href="https://www.facebook.com/marketplace/profile/100001427946097/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 border border-rule bg-paper flex items-center justify-center text-ink-soft hover:bg-forest hover:text-white hover:border-forest transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <Facebook size={16} strokeWidth={1.75} />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="w-11 h-11 border border-rule bg-paper flex items-center justify-center text-ink-soft hover:bg-forest hover:text-white hover:border-forest transition-colors"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <Mail size={16} strokeWidth={1.75} />
              </a>
            </div>

            <div className="space-y-4 text-ink-soft text-[15px] sm:text-[16px] leading-[1.65] mt-7 mb-7 font-medium">
              <p>
                I&apos;m Brian, a web designer and developer based in the Philadelphia/South Jersey area.
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
                in Business Analytics. When I&apos;m not building websites, I&apos;m
                hiking, working out, traveling, and spending time with family and friends.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-clay text-ink font-semibold px-6 py-4 hover:bg-clay-deep transition-colors text-[14px] active:scale-[0.98]"
                style={{ boxShadow: "0 8px 24px -8px rgba(14,165,233,0.35)", minHeight: 48 }}
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

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="overflow-hidden border border-rule">
                <Image
                  src="/images/brian-young.jpg"
                  alt="Brian as a kid at the computer"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  sizes="(min-width: 768px) 300px, 45vw"
                />
              </div>
              <div className="overflow-hidden border border-rule">
                <Image
                  src="/images/brian-now.jpg"
                  alt="Brian today"
                  width={800}
                  height={1000}
                  className="w-full h-auto"
                  sizes="(min-width: 768px) 300px, 45vw"
                />
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
