import { siteConfig } from "@/lib/data";
import { Github, Linkedin } from "lucide-react";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <a
              href="#"
              className="text-zinc-900 font-semibold text-lg tracking-tight hover:text-indigo-600 transition-colors"
            >
              {siteConfig.name}
            </a>
            <p className="text-zinc-400 text-sm mt-1">{siteConfig.tagline}</p>
          </div>

          <nav className="flex gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={siteConfig.social.github}
              aria-label="GitHub"
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href={siteConfig.social.linkedin}
              aria-label="LinkedIn"
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
          <p className="text-zinc-400 text-sm">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
