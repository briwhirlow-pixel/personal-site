import { projects } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-medium text-sm uppercase tracking-widest mb-3">
            Portfolio
          </p>
          <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">
            Recent work
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            A selection of projects I&apos;ve designed and built. More available
            on request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.name}
              className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all"
            >
              {/* Placeholder thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                <span className="text-zinc-400 text-sm font-medium">
                  {project.imageAlt}
                </span>
              </div>

              <div className="p-6">
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 mt-1 mb-2">
                  {project.name}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                <a
                  href={project.url}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  View project
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
