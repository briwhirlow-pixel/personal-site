import { siteConfig } from "@/lib/data";
import { Linkedin, Settings } from "lucide-react";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-paper text-ink border-t border-rule">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-20 pb-10">

        {/* Top — large editorial signature */}
        <div className="pb-12 mb-12 border-b border-rule">
          <p className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-muted mb-4 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay" aria-hidden />
            Philadelphia / South Jersey
          </p>
          <h2 className="font-serif text-[clamp(40px,7vw,84px)] leading-[0.95] tracking-[-0.025em] text-ink font-normal max-w-3xl">
            Let&apos;s build something <span className="italic text-forest">together.</span>
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 mt-8">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 bg-forest text-paper font-semibold px-6 py-3.5 rounded-[6px] hover:bg-forest-deep transition-colors text-[14px]"
              style={{ boxShadow: "0 8px 24px -8px rgba(45,106,79,0.5)" }}
            >
              Start a project
              <span aria-hidden className="font-serif text-[17px] leading-none transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">↗</span>
            </a>
            {/* Hand-signed sign-off — Caveat. Genuine personality detail. */}
            <span
              className="text-ink-soft text-[28px] sm:text-[34px] leading-none -translate-y-1"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              — Brian
            </span>
          </div>
        </div>

        {/* Mid grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pb-10 mb-10 border-b border-rule">
          <div>
            <div className="inline-flex items-baseline gap-2">
              <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-forest translate-y-[-2px]" />
              <span className="font-serif text-[22px] leading-none tracking-tight text-ink">
                Built<span className="italic text-clay px-[1px]">by</span>Brian
              </span>
            </div>
            <p className="text-ink-soft text-[13px] mt-3 leading-relaxed font-medium max-w-xs">
              {siteConfig.tagline}.<br />
              Hand-built websites for small businesses.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-ink-muted mb-4">Navigation</p>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-[14px] text-ink-soft hover:text-forest transition-colors font-medium w-fit">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-ink-muted mb-4">Get in touch</p>
            <a href={`mailto:${siteConfig.email}`} className="text-[14px] text-ink hover:text-forest transition-colors font-semibold block">
              {siteConfig.email}
            </a>
            <p className="text-ink-muted text-[12.5px] mt-2 font-medium leading-relaxed">
              Response within 24 hours — usually same day.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-ink-muted tracking-wide">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-ink-muted hover:text-forest transition-colors"
            >
              <Linkedin size={15} strokeWidth={1.75} />
            </a>
            <a href="/admin" aria-label="Admin" className="text-ink-muted/60 hover:text-ink-muted transition-colors">
              <Settings size={15} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
