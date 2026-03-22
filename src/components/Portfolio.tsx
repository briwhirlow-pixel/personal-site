import { projects, Project } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

// Browser mockup themes for each project
const mockupThemes: Record<string, {
  navBg: string; navText: string; heroBg: string;
  headline: string; headlineColor: string;
  accent: string; imgBg: string; tagline: string;
}> = {
  oakwood: {
    navBg: "#1C2B1A", navText: "#A8C5A0", heroBg: "#F5EFE6",
    headline: "Find Your Dream Home", headlineColor: "#1C2B1A",
    accent: "#4A7C59", imgBg: "#C5D5BC", tagline: "Luxury Properties",
  },
  luma: {
    navBg: "#FDF8F5", navText: "#C4896F", heroBg: "#FDF8F5",
    headline: "Glow From Within", headlineColor: "#2D1810",
    accent: "#D4826A", imgBg: "#F0D5CC", tagline: "Clean Beauty",
  },
  catalyst: {
    navBg: "#0F1F3D", navText: "#8BA5CC", heroBg: "#0F1F3D",
    headline: "Strategy That Scales", headlineColor: "#FFFFFF",
    accent: "#C9A84C", imgBg: "#1E3560", tagline: "Consulting",
  },
  nomad: {
    navBg: "#2C1A0E", navText: "#C4956A", heroBg: "#F9F3EC",
    headline: "Coffee Worth the Journey", headlineColor: "#2C1A0E",
    accent: "#8B5E3C", imgBg: "#D4B896", tagline: "Specialty Roasters",
  },
  atlas: {
    navBg: "#0A0A0A", navText: "#888888", heroBg: "#0A0A0A",
    headline: "Train Like an Athlete", headlineColor: "#FFFFFF",
    accent: "#FF4500", imgBg: "#1A1A1A", tagline: "Elite Fitness",
  },
  horizon: {
    navBg: "#FFFFFF", navText: "#999999", heroBg: "#F7F7F5",
    headline: "Space. Form. Function.", headlineColor: "#111111",
    accent: "#111111", imgBg: "#D8D8D4", tagline: "Architecture Studio",
  },
};

function BrowserMockup({ mockupKey }: { mockupKey: string }) {
  const t = mockupThemes[mockupKey] ?? mockupThemes.oakwood;
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-xl border border-black/[0.07]" style={{ aspectRatio: "16/10" }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 h-[26px] bg-[#2A2A2A] flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        <div className="flex-1 mx-3 bg-white/10 rounded-full h-3.5 flex items-center justify-center">
          <span className="text-white/30 text-[7px] font-medium">www.{mockupKey}.com</span>
        </div>
      </div>

      {/* Website preview */}
      <div className="w-full" style={{ height: 'calc(100% - 26px)', background: t.heroBg }}>
        {/* Fake nav */}
        <div
          className="flex items-center justify-between px-5 py-2"
          style={{ background: t.navBg }}
        >
          <div className="w-14 h-2 rounded-sm" style={{ background: t.accent }} />
          <div className="hidden sm:flex gap-3">
            {[28, 20, 24, 18].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full opacity-50" style={{ width: w, background: t.navText }} />
            ))}
          </div>
          <div className="w-14 h-5 rounded-full flex items-center justify-center" style={{ background: t.accent }}>
            <div className="w-8 h-1.5 rounded-full bg-white/70" />
          </div>
        </div>

        {/* Hero area */}
        <div className="px-5 pt-4 pb-3">
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 mb-2" style={{ background: `${t.accent}20` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.accent }} />
            <div className="w-12 h-1 rounded-full" style={{ background: t.accent }} />
          </div>
          {/* Headline lines */}
          <div className="mb-1.5 w-[70%] h-3 rounded-sm" style={{ background: t.headlineColor, opacity: 0.85 }} />
          <div className="mb-3 w-[55%] h-3 rounded-sm" style={{ background: t.headlineColor, opacity: 0.55 }} />
          {/* Body text lines */}
          <div className="w-[80%] h-1.5 rounded-full mb-1" style={{ background: t.headlineColor, opacity: 0.2 }} />
          <div className="w-[65%] h-1.5 rounded-full mb-4" style={{ background: t.headlineColor, opacity: 0.2 }} />
          {/* CTA */}
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: t.accent }}>
            <div className="w-10 h-1.5 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Image block */}
        <div className="mx-5 rounded-lg" style={{ height: '35%', background: t.imgBg }}>
          <div className="w-full h-full rounded-lg opacity-30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: t.accent }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="bg-[#F2F1EC] py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[#FF5733] text-[12px] font-semibold tracking-widest uppercase mb-4">
              Selected Work
            </p>
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-black text-[#1A1A1A] leading-tight tracking-tight">
              Recent projects.
            </h2>
          </div>
          <p className="text-[#737373] text-[15px] leading-relaxed max-w-xs">
            A selection of sites I&apos;ve designed and built. More available on request.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project) => (
            <a
              key={project.name}
              href={project.url}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E5E4DF] hover:border-[#FF5733]/20 hover:shadow-xl hover:shadow-[#FF5733]/5 transition-all duration-300 flex flex-col"
            >
              {/* Browser Mockup */}
              <div className="p-3 pb-0 bg-white">
                <BrowserMockup mockupKey={project.mockupKey} />
              </div>

              {/* Card info */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-[#FF5733] text-[11px] font-semibold tracking-wide uppercase mb-0.5">
                      {project.category}
                    </p>
                    <h3 className="text-[17px] font-black text-[#1A1A1A] tracking-tight">
                      {project.name}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={17}
                    className="text-[#CECCC6] group-hover:text-[#FF5733] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1"
                  />
                </div>
                <p className="text-[#737373] text-[13px] leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="mt-3 pt-3 border-t border-[#F2F1EC]">
                  <span className="text-[11px] text-[#AEACA6] font-mono">{project.domain}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
