import Reveal from "./Reveal";

const reviews = [
  {
    name: "Nick M.",
    date: "September 2025",
    avatar: "NM",
    rating: 5,
    text: "Brian completely transformed our online presence. Before working with him, our old site was basically just a phone number on a white page. Within the first month we saw a noticeable uptick in bookings coming directly through the website. He was responsive the entire time and delivered ahead of schedule. 10/10 would recommend to any local business owner.",
    highlight: "Bookings up within the first month",
    tag: "Restaurant",
  },
  {
    name: "Priya S.",
    date: "November 2025",
    avatar: "PS",
    rating: 5,
    text: "I came to Brian needing a Shopify store that actually felt premium — not just a generic template. He designed every page from scratch and integrated our product catalog, a loyalty rewards app, and email capture. He also handled our SEO setup so we started showing up in Google searches we never ranked for before. Super professional, great communicator, and the site looks stunning.",
    highlight: "Ranking on Google + higher checkout conversion",
    tag: "E-Commerce",
  },
  {
    name: "Joseph D.",
    date: "February 2026",
    avatar: "JD",
    rating: 5,
    text: "I needed a portfolio site that could show off my photography without looking cluttered or cheap. Brian nailed it on the first revision. He set it up on a CMS so I can update galleries myself without touching code, which was a huge deal for me. I've already gotten two client inquiries directly through the contact form he built. Really glad I hired him.",
    highlight: "2 client inquiries through the contact form already",
    tag: "Portfolio",
  },
  {
    name: "Deanna P.",
    date: "October 2025",
    avatar: "DP",
    rating: 5,
    text: "My photography site got a major upgrade. Love it Brian thanks!",
    highlight: null,
    tag: "Photography",
  },
  {
    name: "Jim B.",
    date: "December 2025",
    avatar: "JB",
    rating: 5,
    text: null,
    highlight: null,
    tag: null,
  },
  {
    name: "Rocco S.",
    date: "January 2026",
    avatar: "RS",
    rating: 5,
    text: null,
    highlight: null,
    tag: null,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#E8B85F" className="flex-shrink-0">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="relative bg-paper text-ink pt-20 pb-24">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Section header */}
        <Reveal>
          <div className="flex items-baseline justify-between pb-4 border-b border-rule mb-12">
            <span className="font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase flex items-center gap-2.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay pulse-dot" aria-hidden />
              Client Reviews
            </span>
            <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.22em] text-ink-muted uppercase">
              Index / 004
            </span>
          </div>
        </Reveal>

        <Reveal className="max-w-3xl mb-14">
          <h2 className="font-serif text-[clamp(36px,6vw,72px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal">
            Don&apos;t take my word{" "}
            <span className="italic text-forest">for it.</span>
          </h2>
          <p className="text-ink-soft text-[17px] mt-5 leading-relaxed font-medium">
            Here&apos;s what real clients have said after working with me.
          </p>
        </Reveal>

        {/* Review grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: "1fr" }}>
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 80} className="h-full">
              <div className="group relative bg-paper-soft border border-rule rounded-[6px] p-5 flex flex-col h-full hover:border-forest/40 transition-colors">

                {/* Top row — tag + rating */}
                <div className="flex items-center justify-between mb-4">
                  {review.tag ? (
                    <span className="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase text-forest bg-forest/10 px-2 py-1 rounded-[3px]">
                      {review.tag}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-muted">
                      Verified client
                    </span>
                  )}
                  <StarRating count={review.rating} />
                </div>

                {/* Quote or stars-only */}
                <div className="flex-1 flex flex-col justify-start">
                  {review.text ? (
                    <>
                      <span className="font-serif italic text-forest text-[40px] leading-none mb-1">“</span>
                      <p className="text-ink text-[13.5px] leading-[1.65] font-medium -mt-2">
                        {review.text}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <StarRating count={5} />
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ink-muted">
                        Left a 5-star rating
                      </p>
                    </div>
                  )}
                </div>

                {/* Highlight */}
                {review.highlight && (
                  <div className="bg-forest/5 border border-forest/15 rounded-[4px] px-3 py-2 mt-4 mb-1">
                    <p className="font-mono text-[10.5px] tracking-wide text-forest font-medium leading-snug">
                      <span className="text-clay mr-1.5">✦</span>
                      {review.highlight}
                    </p>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-rule">
                  <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                    <span className="text-paper text-[10px] font-bold tracking-wide font-mono">{review.avatar}</span>
                  </div>
                  <div>
                    <p className="text-ink text-[12.5px] font-semibold leading-tight">{review.name}</p>
                    <p className="font-mono text-[10px] text-ink-muted mt-0.5 tracking-wide">{review.date}</p>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom trust bar */}
        <Reveal delay={300}>
          <div className="mt-14 pt-8 border-t border-rule grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-8">
            <div className="flex items-center gap-2">
              <StarRating count={5} />
              <span className="text-ink text-[13px] font-semibold">5.0 average rating</span>
            </div>
            <p className="text-ink-soft text-[13px] font-medium">5-day average first draft — every project</p>
            <p className="text-ink-soft text-[13px] font-medium">No project too small or too ambitious</p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
