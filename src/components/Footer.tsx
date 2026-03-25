import { siteConfig } from "@/lib/data";
import { Github, Linkedin } from "lucide-react";
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
    <footer style={{ background: 'linear-gradient(135deg, #06091F 0%, #0D1B45 100%)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-10">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-10 sm:mb-14 pb-10 sm:pb-14 border-b border-white/[0.08]">
          <div>
            <a href="/">
              <Logo light />
            </a>
            <p className="text-white/30 text-[13px] mt-2 leading-relaxed">
              {siteConfig.tagline}<br />Based remotely · Available worldwide.
            </p>
          </div>
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Navigation</p>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-[14px] text-white/50 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Start A Project</p>
            <p className="text-white/40 text-[13px] leading-relaxed mb-5">
              Ready to work together? I&apos;d love to hear about your project.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#1D4ED8] transition-colors text-[13px]">
              Get in touch
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-[12px]">© {year} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href={siteConfig.social.github} aria-label="GitHub" className="text-white/25 hover:text-white transition-colors"><Github size={16} /></a>
            <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="text-white/25 hover:text-white transition-colors"><Linkedin size={16} /></a>
            <a href="/admin" aria-label="Admin" className="text-white/15 hover:text-white/40 transition-colors">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth={2}/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
