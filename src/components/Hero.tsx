import { siteConfig } from "@/lib/data";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-zinc-50 to-white pt-16">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-indigo-600 font-medium text-sm uppercase tracking-widest mb-4">
            Freelance Web Designer & Developer
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 leading-tight tracking-tight mb-6">
            I build websites that{" "}
            <span className="text-indigo-600">get results.</span>
          </h1>
          <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-2xl">
            {siteConfig.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-zinc-200 text-zinc-800 font-medium hover:border-zinc-400 transition-colors"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Get a free quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
