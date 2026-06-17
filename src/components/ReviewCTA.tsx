"use client";

import { useState } from "react";
import { Mail, Star, Check } from "lucide-react";
import Reveal from "./Reveal";

type View = "cta" | "form" | "sent";

export default function ReviewCTA() {
  const [view, setView] = useState<View>("cta");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");

  const canSend = rating > 0 && review.trim().length >= 10 && name.trim().length > 0;

  const sendReview = () => {
    if (!canSend) return;
    const subject = encodeURIComponent(
      `Review: ${rating} star${rating !== 1 ? "s" : ""} , BuiltbyBrian Web Design`
    );
    const body = encodeURIComponent(
      [
        `Rating: ${"★".repeat(rating)}${"☆".repeat(5 - rating)}  (${rating}/5)`,
        ``,
        `Experience with BuiltbyBrian Web Design:`,
        review.trim(),
        ``,
        `, ${name.trim()}`,
      ].join("\n")
    );
    window.location.href = `mailto:brianwhirlowbusiness@gmail.com?subject=${subject}&body=${body}`;
    setView("sent");
  };

  return (
    <section className="relative bg-paper-soft text-ink py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 md:px-12">
        <Reveal>
          <div className="bg-paper-soft border border-rule p-8 sm:p-10">

            {view === "cta" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                <div className="flex-1">
                  <h3
                    className="font-display font-medium leading-tight tracking-[-0.02em] text-ink"
                    style={{ fontSize: 'clamp(24px, 3.5vw, 32px)' }}
                  >
                    Worked together?
                  </h3>
                  <p className="text-ink-soft text-[14px] sm:text-[15px] leading-relaxed mt-2 font-medium">
                    Leave a quick rating and a sentence or two , I&apos;ll ask before posting it anywhere.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView("form")}
                  className="inline-flex items-center gap-2 bg-clay text-ink font-semibold px-5 py-3 hover:bg-clay-deep transition-colors text-[14px] flex-shrink-0 active:scale-[0.98]"
                  style={{ minHeight: 48 }}
                >
                  <Star size={15} strokeWidth={1.75} />
                  Write a review
                </button>
              </div>
            )}

            {view === "form" && (
              <div>
                <h3
                  className="font-display font-medium leading-tight tracking-[-0.02em] text-ink"
                  style={{ fontSize: 'clamp(22px, 3.2vw, 28px)' }}
                >
                  Tell me about working with BuiltbyBrian.
                </h3>
                <p className="text-ink-soft text-[13px] mt-2 font-medium">
                  Takes about a minute. Sends straight to my inbox , nothing publishes without your OK.
                </p>

                <div className="mt-6">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-ink-muted font-semibold mb-3">
                    Your rating
                  </p>
                  <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating from 1 to 5 stars">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const active = (hover || rating) >= n;
                      return (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={rating === n}
                          aria-label={`${n} star${n !== 1 ? "s" : ""}`}
                          onMouseEnter={() => setHover(n)}
                          onMouseLeave={() => setHover(0)}
                          onFocus={() => setHover(n)}
                          onBlur={() => setHover(0)}
                          onClick={() => setRating(n)}
                          className="p-1.5 -m-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-forest/40"
                          style={{ minWidth: 44, minHeight: 44 }}
                        >
                          <Star
                            size={28}
                            strokeWidth={1.5}
                            className={active ? "text-butter" : "text-ink-muted/30"}
                            fill={active ? "#FACC15" : "none"}
                          />
                        </button>
                      );
                    })}
                    <span className="text-ink-muted text-[12px] font-semibold ml-3 tracking-wide">
                      {rating > 0 ? `${rating} / 5` : "Pick one"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="review-text" className="block text-[10px] tracking-[0.12em] uppercase text-ink-muted font-semibold mb-2">
                    Describe your experience
                  </label>
                  <textarea
                    id="review-text"
                    rows={5}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="What was the project? How did it go? Anything stand out?"
                    className="w-full bg-paper border border-rule px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition font-medium resize-none"
                  />
                  <p className="text-ink-muted text-[11px] mt-1.5 font-medium">
                    {review.trim().length < 10 ? "A sentence or two is plenty." : "Looks good."}
                  </p>
                </div>

                <div className="mt-5">
                  <label htmlFor="review-name" className="block text-[10px] tracking-[0.12em] uppercase text-ink-muted font-semibold mb-2">
                    Your name
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane S."
                    className="w-full bg-paper border border-rule px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 transition font-medium"
                  />
                </div>

                <div className="mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setView("cta")}
                    className="text-ink-muted hover:text-ink-soft text-[13px] font-medium transition-colors sm:mr-auto"
                    style={{ minHeight: 44 }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={sendReview}
                    disabled={!canSend}
                    className="inline-flex items-center justify-center gap-2 bg-clay text-ink font-semibold px-5 py-3 hover:bg-clay-deep disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[14px] active:scale-[0.98]"
                    style={{ minHeight: 48 }}
                  >
                    <Mail size={15} strokeWidth={1.75} />
                    Send review
                  </button>
                </div>
              </div>
            )}

            {view === "sent" && (
              <div role="status" aria-live="polite" className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-12 h-12 bg-forest flex items-center justify-center flex-shrink-0">
                  <Check size={20} className="text-paper" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-medium text-[24px] text-ink leading-tight tracking-[-0.02em]">
                    Thanks, {name.split(" ")[0] || "friend"}.
                  </h3>
                  <p className="text-ink-soft text-[14px] mt-1 font-medium">
                    Your email client should have opened with the review pre-filled. Just hit send and I&apos;ll see it.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setView("cta");
                      setRating(0);
                      setName("");
                      setReview("");
                    }}
                    className="text-forest hover:text-forest-deep text-[13px] font-semibold border-b border-forest/30 pb-0.5 mt-3"
                    style={{ minHeight: 44 }}
                  >
                    Leave another →
                  </button>
                </div>
              </div>
            )}

          </div>
        </Reveal>
      </div>
    </section>
  );
}
