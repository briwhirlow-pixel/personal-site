import { Mail } from "lucide-react";
import Reveal from "./Reveal";

const SUBJECT = encodeURIComponent("Review for BuiltbyBrian");
const BODY = encodeURIComponent(
  "Hey Brian,\n\nHere's a quick review of working with you:\n\n" +
    "[Your review here]\n\n" +
    "Feel free to use this on your site.\n\n— "
);

export default function ReviewCTA() {
  return (
    <section className="relative bg-paper text-ink py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-12">
        <Reveal>
          <div className="bg-paper-soft border border-rule rounded-[8px] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
            <div className="flex-1">
              <h3 className="font-serif text-[clamp(24px,3.5vw,32px)] leading-tight tracking-tight text-ink font-normal">
                Worked together?
              </h3>
              <p className="text-ink-soft text-[14px] sm:text-[15px] leading-relaxed mt-2 font-medium">
                I&apos;d be grateful for a quick note about how the project went — a sentence or two
                is plenty. I&apos;ll ask before posting it anywhere.
              </p>
            </div>
            <a
              href={`mailto:brianwhirlowbusiness@gmail.com?subject=${SUBJECT}&body=${BODY}`}
              className="inline-flex items-center gap-2 bg-forest text-paper font-semibold px-5 py-3 rounded-[6px] hover:bg-forest-deep transition-colors text-[14px] flex-shrink-0"
            >
              <Mail size={15} strokeWidth={1.75} />
              Write a review
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
