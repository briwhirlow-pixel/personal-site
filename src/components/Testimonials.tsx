import Reveal from "./Reveal";

const reviews = [
  {
    name: "Marcus D.",
    role: "Owner, Ember & Oak Restaurant",
    avatar: "MD",
    rating: 5,
    text: "Brian completely transformed our online presence. Before working with him, our old site was basically just a phone number on a white page. Within the first month we saw a noticeable uptick in bookings coming directly through the website. He was responsive the entire time and delivered ahead of schedule. 10/10 would recommend to any local business owner.",
    highlight: "Bookings up within the first month",
    tag: "Restaurant",
  },
  {
    name: "Priya S.",
    role: "Founder, Luminary Skincare Co.",
    avatar: "PS",
    rating: 5,
    text: "I came to Brian needing a Shopify store that actually felt premium — not just a generic template. He designed every page from scratch and integrated our product catalog, a loyalty rewards app, and email capture. He also handled our SEO setup so we started showing up in Google searches we never ranked for before. Super professional, great communicator, and the site looks stunning.",
    highlight: "Ranking on Google + higher checkout conversion",
    tag: "E-Commerce",
  },
  {
    name: "Jordan T.",
    role: "Freelance Photographer, JT Visual",
    avatar: "JT",
    rating: 5,
    text: "I needed a portfolio site that could show off my photography without looking cluttered or cheap. Brian nailed it on the first revision. He set it up on a CMS so I can update galleries myself without touching code, which was a huge deal for me. I've already gotten two client inquiries directly through the contact form he built. Really glad I hired him.",
    highlight: "2 client inquiries through the contact form already",
    tag: "Portfolio",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#2563EB" className="flex-shrink-0">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[#2563EB] text-[12px] font-semibold tracking-widest uppercase mb-4">Client Reviews</p>
            <h2 className="text-[clamp(32px,4vw,52px)] font-black text-[#1A1A1A] leading-tight tracking-tight">
              Don&apos;t take my word for it.
            </h2>
            <p className="text-[#737373] text-[16px] mt-4 max-w-xl mx-auto leading-relaxed">
              Here&apos;s what real clients have said after working with me.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 100}>
              <div className="group relative bg-[#FAFAF7] border border-[#E5E4DF] rounded-2xl p-7 flex flex-col h-full hover:border-[#2563EB]/30 hover:shadow-[0_8px_40px_rgba(37,99,235,0.08)] transition-all duration-300">

                {/* Tag + rating row */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full">
                    {review.tag}
                  </span>
                  <StarRating count={review.rating} />
                </div>

                {/* Quote */}
                <div className="mb-6 flex-1">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="mb-3 text-[#2563EB]/20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 20V12.8C0 9.06667 0.933333 5.93333 2.8 3.4C4.66667 0.866667 7.46667 0 11.2 0V3.6C9.33333 3.6 7.93333 4.33333 7 5.8C6.06667 7.26667 5.6 9.06667 5.6 11.2H11.2V20H0ZM16.8 20V12.8C16.8 9.06667 17.7333 5.93333 19.6 3.4C21.4667 0.866667 24.2667 0 28 0V3.6C26.1333 3.6 24.7333 4.33333 23.8 5.8C22.8667 7.26667 22.4 9.06667 22.4 11.2H28V20H16.8Z" fill="currentColor"/>
                  </svg>
                  <p className="text-[#555555] text-[14px] leading-relaxed">{review.text}</p>
                </div>

                {/* Highlight callout */}
                <div className="bg-[#EFF6FF] border border-[#2563EB]/10 rounded-xl px-4 py-2.5 mb-5">
                  <p className="text-[#2563EB] text-[12px] font-semibold">
                    ✦ {review.highlight}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#E5E4DF]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[11px] font-black tracking-wide">{review.avatar}</span>
                  </div>
                  <div>
                    <p className="text-[#1A1A1A] text-[13px] font-bold leading-tight">{review.name}</p>
                    <p className="text-[#AEACA6] text-[11px] mt-0.5">{review.role}</p>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom trust bar */}
        <Reveal delay={300}>
          <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#2563EB">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#1A1A1A] text-[14px] font-bold">5.0 average rating</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-[#E5E4DF]" />
            <p className="text-[#737373] text-[14px]">72hr average first draft delivery — every project</p>
            <div className="hidden sm:block w-px h-5 bg-[#E5E4DF]" />
            <p className="text-[#737373] text-[14px]">No project too small or too ambitious</p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
