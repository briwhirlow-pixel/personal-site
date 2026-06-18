import { siteConfig } from "@/lib/data";
import { Linkedin } from "lucide-react";
import Logo from "./Logo";

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
    <footer className="relative bg-paper-soft text-ink border-t border-rule">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-20 pb-10">

        <div className="pb-12 mb-12 border-b border-rule">
          <p className="text-ink-muted text-[14px] font-medium mb-4">
            Philadelphia / South Jersey
          </p>
          <h2
            className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink max-w-3xl"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
          >
            Let&apos;s build something great.
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
            <a
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-clay text-ink font-semibold px-6 py-4 hover:bg-clay-deep transition-colors text-[14px] active:scale-[0.98]"
              style={{ boxShadow: "0 8px 24px -8px rgba(14,165,233,0.35)", minHeight: 48 }}
            >
              Start a project
              <span aria-hidden className="text-[15px] leading-none">→</span>
            </a>
            <span className="text-ink-soft text-[15px] font-display font-medium">
              Brian Whirlow
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-8 md:gap-10 pb-10 mb-10 border-b border-rule">
          <div>
            <Logo />
            <p className="text-ink-soft text-[13px] mt-3 leading-relaxed font-medium max-w-xs">
              {siteConfig.tagline}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-ink-muted mb-4">Navigation</p>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-[14px] text-ink-soft hover:text-forest transition-colors font-medium w-fit py-2 block" style={{ minHeight: 44 }}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-ink-muted mb-4">Get in touch</p>
            <a href={`mailto:${siteConfig.email}`} className="text-[14px] text-ink hover:text-forest transition-colors font-semibold block py-2">
              {siteConfig.email}
            </a>
            <p className="text-ink-muted text-[12.5px] mt-2 font-medium leading-relaxed">
              Response within 24 hours, usually same day.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-ink-muted font-medium tracking-wide">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-11 h-11 flex items-center justify-center text-ink-muted hover:text-forest transition-colors"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <Linkedin size={15} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
