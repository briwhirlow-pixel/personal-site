import Reveal from "./Reveal";

const reviews = [
  {
    name: "Nick M.",
    text: "Brian completely transformed our online presence. Within the first month we saw a noticeable uptick in bookings coming directly through the website.",
    tag: "Restaurant",
  },
  {
    name: "Priya S.",
    text: "He designed every page from scratch and integrated our product catalog, loyalty rewards, and email capture. The site looks stunning.",
    tag: "E-Commerce",
  },
  {
    name: "Joseph D.",
    text: "Brian nailed it on the first revision. He set it up on a CMS so I can update galleries myself. I've already gotten two client inquiries through the contact form.",
    tag: "Portfolio",
  },
  {
    name: "Deanna P.",
    text: "My photography site got a major upgrade. Love it Brian thanks!",
    tag: "Photography",
  },
  {
    name: "Jim B.",
    text: "Professional, fast, and the end result speaks for itself. Would absolutely work with Brian again.",
    tag: "Local Business",
  },
  {
    name: "Rocco S.",
    text: "Exceeded every expectation. Our new site gets compliments from customers every week.",
    tag: "Service",
  },
] as const;

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={11} height={11} viewBox="0 0 24 24" fill="#FACC15" className="flex-shrink-0" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: typeof reviews[number] }) {
  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px] bg-paper border border-rule p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-clay">{review.tag}</span>
          <Stars />
        </div>
        <p className="text-[13px] sm:text-[14px] text-ink leading-[1.55] font-medium">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>
      <p className="text-[13px] font-semibold text-ink mt-4">{review.name}</p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="relative bg-paper-soft text-ink py-14 sm:py-18 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 mb-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
                style={{ fontSize: 'clamp(24px, 3.5vw, 38px)' }}
              >
                What clients have said.
              </h2>
              <p className="text-ink-soft text-[14px] mt-2 font-medium">
                5.0 average across {reviews.length} reviews.
              </p>
            </div>
            <Stars />
          </div>
        </Reveal>
      </div>

      {/* Auto-scrolling marquee of review cards */}
      <div className="relative">
        <div className="reviews-marquee flex gap-4 sm:gap-5 w-max">
          {reviews.map((r) => (
            <ReviewCard key={r.name} review={r} />
          ))}
          {reviews.map((r) => (
            <ReviewCard key={`dup-${r.name}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
