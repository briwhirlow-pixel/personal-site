import Reveal from "./Reveal";

const capabilities = [
  {
    title: "Custom design",
    description:
      "Every layout, color, and interaction is built specifically for your business. No templates, no themes.",
  },
  {
    title: "Clean code",
    description:
      "Hand-written HTML, CSS, and JavaScript. Your site is lightweight, fast, and yours to own forever.",
  },
  {
    title: "Built to perform",
    description:
      "SEO, mobile optimization, and Core Web Vitals baked in from day one. Your site works before you promote it.",
  },
];

export default function Capabilities() {
  return (
    <section className="relative bg-paper text-ink pb-20 sm:pb-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 80}>
              <div>
                <h3 className="font-display font-medium text-[18px] sm:text-[20px] tracking-[-0.02em] text-ink leading-tight">
                  {cap.title}
                </h3>
                <p className="text-ink-soft text-[15px] leading-[1.6] mt-2 font-medium">
                  {cap.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
