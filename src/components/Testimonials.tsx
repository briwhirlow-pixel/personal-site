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
        <svg key={i} width={10} height={10} viewBox="0 0 24 24" fill="#FACC15" className="flex-shrink-0" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="relative bg-paper-soft text-ink py-14 sm:py-18">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <h2
          className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink mb-8"
          style={{ fontSize: 'clamp(24px, 3.5vw, 38px)' }}
        >
          What clients have said.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div key={r.name} className="bg-paper border border-rule p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-clay">{r.tag}</span>
                <Stars />
              </div>
              <p className="text-[13px] text-ink leading-[1.55] font-medium">
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-[13px] font-semibold text-ink mt-3">{r.name}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
