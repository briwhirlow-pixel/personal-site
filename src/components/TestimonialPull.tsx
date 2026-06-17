import Reveal from "./Reveal";

export default function TestimonialPull() {
  return (
    <section className="relative bg-ink text-white py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 md:px-12">
        <Reveal>
          <blockquote>
            <p
              className="font-display font-medium leading-[1.2] tracking-[-0.02em] text-white text-pretty"
              style={{ fontSize: "clamp(24px, 4vw, 40px)" }}
            >
              &ldquo;Brian completely transformed our online presence. Within the
              first month we saw a noticeable uptick in bookings coming directly
              through the website. He delivered ahead of schedule.&rdquo;
            </p>
            <footer className="mt-8 flex items-center gap-4">
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-[14px] font-semibold text-white">Nick M.</p>
                <p className="text-[13px] text-white/40 font-medium">
                  Restaurant owner
                </p>
              </div>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
