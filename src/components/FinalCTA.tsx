import Link from "next/link";
import Reveal from "./Reveal";

export default function FinalCTA() {
  return (
    <section className="relative bg-paper text-ink py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 md:px-12 text-center">
        <Reveal>
          <h2
            className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
            style={{ fontSize: "clamp(32px, 5.5vw, 56px)" }}
          >
            Ready to build something real?
          </h2>
          <p className="text-ink-soft text-[16px] sm:text-[17px] leading-relaxed font-medium mt-5 max-w-lg mx-auto">
            Tell me about your business and I&apos;ll send a free project
            estimate within 72 hours.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-clay text-ink px-8 py-4 font-semibold text-[15px] hover:bg-clay-deep transition-colors active:scale-[0.98]"
              style={{
                boxShadow: "0 8px 24px -8px rgba(14,165,233,0.35)",
                minHeight: 48,
              }}
            >
              Start a project
              <span aria-hidden className="text-[16px] leading-none">
                →
              </span>
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 text-ink-soft text-[15px] font-medium hover:text-ink transition-colors py-3"
              style={{ minHeight: 44 }}
            >
              View pricing
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
