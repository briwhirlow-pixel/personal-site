import { siteConfig } from "@/lib/data";
import { Linkedin } from "lucide-react";

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
          <p className="text-[11px] tracking-[0.12em] uppercase text-ink-muted font-semibold mb-4 flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 bg-clay" aria-hidden />
            Philadelphia / South Jersey
          </p>
          <h2
            className="font-display font-extrabold leading-[0.95] tracking-[-0.025em] text-ink max-w-3xl"
            style={{ fontSize: 'clamp(40px, 7vw, 84px)' }}
          >
            Let&apos;s build something great.
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-clay text-ink font-semibold px-6 py-4 hover:bg-clay-deep transition-colors text-[14px] active:scale-[0.98]"
              style={{ boxShadow: "0 8px 24px -8px rgba(232,88,58,0.45)", minHeight: 48 }}
            >
              Start a project
              <span aria-hidden className="text-[15px] leading-none">→</span>
            </a>
            <span className="text-ink-soft text-[15px] font-display font-bold">
              Brian Whirlow
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-8 md:gap-10 pb-10 mb-10 border-b border-rule">
          <div>
            <div className="inline-flex items-baseline gap-2">
              <span aria-hidden className="inline-block w-1.5 h-1.5 bg-forest translate-y-[-2px]" />
              <span className="font-display font-bold text-[22px] leading-none tracking-tight text-ink">
                Built<span className="text-clay px-[1px]">by</span>Brian
              </span>
            </div>
            <p className="text-ink-soft text-[13px] mt-3 leading-relaxed font-medium max-w-xs">
              {siteConfig.tagline}.<br />
              Hand built websites for small businesses.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-ink-muted mb-4">Navigation</p>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-[14px] text-ink-soft hover:text-forest transition-colors font-medium w-fit">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-ink-muted mb-4">Get in touch</p>
            <a href={`mailto:${siteConfig.email}`} className="text-[14px] text-ink hover:text-forest transition-colors font-semibold block">
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
