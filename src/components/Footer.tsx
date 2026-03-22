import { siteConfig } from "@/lib/data";
import { Github, Linkedin } from "lucide-react";

const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10">
        <div className="grid md:grid-cols-3 gap-10 mb-14 pb-14 border-b border-white/[0.08]">
          {/* Brand */}
          <div>
            <a href="#" className="font-black text-white text-[16px] tracking-widest uppercase">
              {siteConfig.name}
            </a>
            <p className="text-white/30 text-[13px] mt-2 leading-relaxed">
              {siteConfig.tagline}<br />Based remotely · Available worldwide.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Navigation</p>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Start a Project</p>
            <p className="text-white/40 text-[13px] leading-relaxed mb-5">
              Ready to work together? I&apos;d love to hear about your project.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#FF5733] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#E64A2A] transition-colors text-[13px]"
            >
              Get in touch
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-[12px]">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href={siteConfig.social.github} aria-label="GitHub" className="text-white/25 hover:text-white transition-colors">
              <Github size={16} />
            </a>
            <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="text-white/25 hover:text-white transition-colors">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
