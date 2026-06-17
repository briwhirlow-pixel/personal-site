import Reveal from "./Reveal";

const reviews = [
  {
    name: "Nick M.",
    date: "September 2025",
    rating: 5,
    text: "Brian completely transformed our online presence. Before working with him, our old site was basically just a phone number on a white page. Within the first month we saw a noticeable uptick in bookings coming directly through the website. He was responsive the entire time and delivered ahead of schedule. 10/10 would recommend to any local business owner.",
    tag: "Restaurant",
  },
  {
    name: "Priya S.",
    date: "November 2025",
    rating: 5,
    text: "I came to Brian needing a Shopify store that actually felt premium , not just a generic template. He designed every page from scratch and integrated our product catalog, a loyalty rewards app, and email capture. He also handled our SEO setup so we started showing up in Google searches we never ranked for before. Super professional, great communicator, and the site looks stunning.",
    tag: "E-Commerce",
  },
  {
    name: "Joseph D.",
    date: "February 2026",
    rating: 5,
    text: "I needed a portfolio site that could show off my photography without looking cluttered or cheap. Brian nailed it on the first revision. He set it up on a CMS so I can update galleries myself without touching code, which was a huge deal for me. I've already gotten two client inquiries directly through the contact form he built. Really glad I hired him.",
    tag: "Portfolio",
  },
  {
    name: "Deanna P.",
    date: "October 2025",
    rating: 5,
    text: "My photography site got a major upgrade. Love it Brian thanks!",
    tag: "Photography",
  },
] as const;

const starsOnly = [
  { name: "Jim B.", date: "December 2025" },
  { name: "Rocco S.", date: "January 2026" },
] as const;

function Stars({ size = 13 }: { size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#FACC15" className="flex-shrink-0" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="relative bg-paper-soft text-ink pt-20 pb-24">
      <div className="relative max-w-3xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Narrow editorial column — structurally different from other sections */}
        <Reveal className="mb-20 pt-4">
          <h2
            className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)' }}
          >
            What clients have said.
          </h2>
          <p className="text-ink-soft text-[15px] mt-4 leading-relaxed font-medium">
            Pulled straight from the reviews. Nothing rewritten, nothing trimmed.
          </p>
        </Reveal>

        <div className="space-y-20 sm:space-y-24">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 60}>
              <article className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-clay">
                    {review.tag}
                  </span>
                  <span aria-hidden className="flex-1 border-t border-rule" />
                  <span className="text-[11px] text-ink-muted font-medium">
                    {review.date}
                  </span>
                </div>

                <blockquote
                  className="font-display font-medium leading-[1.3] tracking-[-0.02em] text-ink"
                  style={{ fontSize: 'clamp(20px, 2.8vw, 30px)' }}
                >
                  <span aria-hidden className="text-clay text-[1.4em] leading-[0] align-[-0.2em] mr-1">&ldquo;</span>
                  {review.text}
                  <span aria-hidden className="text-clay text-[1.4em] leading-[0] align-[-0.3em] ml-1">&rdquo;</span>
                </blockquote>

                <div className="mt-6 flex items-center gap-4">
                  <Stars />
                  <span className="text-ink text-[14px] font-semibold">{review.name}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240}>
          <div className="mt-24 pt-10 border-t border-rule">
            <p className="text-[11px] tracking-[0.12em] uppercase text-ink-muted font-semibold mb-5">
              And five-star ratings from
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {starsOnly.map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <Stars size={11} />
                  <span className="text-ink text-[14px] font-semibold">{r.name}</span>
                  <span className="text-[11px] text-ink-muted font-medium">{r.date}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-16 pt-8 border-t border-rule flex items-center gap-3">
            <Stars />
            <span className="text-ink text-[13px] font-semibold">
              5.0 average across {reviews.length + starsOnly.length} client reviews
            </span>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
