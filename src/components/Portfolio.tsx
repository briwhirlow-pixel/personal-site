import { projects } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-black py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20 pb-8 border-b border-white/10">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/30 font-medium mb-4">
              Selected Work
            </p>
            <h2 className="text-[clamp(36px,5vw,60px)] font-black text-white leading-tight tracking-tight">
              Recent
              <br />
              projects.
            </h2>
          </div>
          <p className="text-white/40 text-[15px] leading-relaxed max-w-xs md:text-right">
            A selection of sites I&apos;ve designed and built. More available on request.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.06]">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              className="group bg-black block overflow-hidden relative"
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-zinc-900 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:from-zinc-700 group-hover:to-zinc-800 transition-all duration-500">
                  <span className="text-white/20 text-sm font-medium tracking-wide">{project.imageAlt}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-white/30 font-medium mb-1">
                    {project.category}
                  </p>
                  <h3 className="text-lg font-black text-white tracking-tight">{project.name}</h3>
                  <p className="text-white/40 text-[13px] leading-relaxed mt-2">{project.description}</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
