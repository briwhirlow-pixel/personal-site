import Reveal from "./Reveal";

export default function ValueProp() {
  return (
    <section className="relative bg-paper text-ink py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        <Reveal>
          <p
            className="font-display font-medium leading-[1.15] tracking-[-0.025em] text-ink max-w-3xl text-pretty"
            style={{ fontSize: "clamp(22px, 3.5vw, 34px)" }}
          >
            I design and build websites from scratch for local businesses.
            No templates, no page builders, no monthly fees.{" "}
            <span className="text-ink-muted">
              You get a site that loads fast, ranks on Google, and actually
              brings in customers.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
