import { siteConfig } from "@/lib/data";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12 pb-12 border-b border-white/10">
          <a href="#" className="font-black text-[13px] tracking-[0.3em] uppercase text-white">
            {siteConfig.name}
          </a>

          <nav className="flex gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-widest uppercase font-medium text-white/40 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="text-[11px] tracking-widest uppercase font-semibold border border-white/20 text-white/60 px-5 py-2.5 hover:border-white hover:text-white transition-all self-start"
          >
            Start a project
          </a>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-white/20 text-[12px] tracking-wide">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-white/20 text-[12px] tracking-wide">
            {siteConfig.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
