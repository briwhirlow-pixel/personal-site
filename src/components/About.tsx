import Image from "next/image";
import { Linkedin, Facebook, Mail } from "lucide-react";
import { siteConfig } from "@/lib/data";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <div className="grid md:grid-cols-12 gap-x-10 gap-y-12 items-stretch pt-4">

          {/* Left — card with name, socials, photos */}
          <Reveal className="md:col-span-5 flex">
            <div className="bg-paper-soft border border-rule p-5 sm:p-7 flex flex-col w-full">

              <h1
                className="font-display font-extrabold leading-[1.05] tracking-[-0.025em] text-ink text-center"
                style={{ fontSize: 'clamp(28px, 5vw, 42px)' }}
              >
                Brian Whirlow
              </h1>
              <p className="font-display font-extrabold tracking-[-0.025em] text-ink-soft text-[14px] sm:text-[15px] mt-1 text-center">
                Designer & Developer · South Jersey / Philadelphia
              </p>

              <div className="flex items-center justify-center gap-2 mt-5 mb-6">
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

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-2">
                  <div className="overflow-hidden border border-rule">
                    <Image
                      src="/images/brian-young.jpg"
                      alt="Brian as a kid at the computer"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      sizes="(min-width: 768px) 180px, 40vw"
                    />
                  </div>
                  <div className="overflow-hidden border border-rule">
                    <Image
                      src="/images/brian-beach.jpg"
                      alt="Brian at the beach"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      sizes="(min-width: 768px) 180px, 40vw"
                    />
                  </div>
                </div>
                <div className="overflow-hidden border border-rule relative">
                  <Image
                    src="/images/brian-now.jpg"
                    alt="Brian today"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 180px, 40vw"
                  />
                </div>
              </div>

            </div>
          </Reveal>

          {/* Right — bio */}
          <Reveal delay={100} className="md:col-span-7">
            <h2
              className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
              style={{ fontSize: 'clamp(30px, 5vw, 50px)' }}
            >
              I build websites that convert visitors into customers.
            </h2>

            <div className="space-y-4 text-ink-soft text-[15px] sm:text-[16px] leading-[1.65] mt-7 mb-8 font-medium">
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
                in Business Analytics and Management. When I&apos;m not building websites, I&apos;m
                hiking, working out, traveling, and spending time with family and friends.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
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
          </Reveal>
        </div>
      </div>
    </section>
  );
}
