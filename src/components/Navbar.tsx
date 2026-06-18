"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-paper/95 backdrop-blur-md border-b border-rule"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          aria-label="BuiltByBrian home"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] tracking-wide transition-colors ${
                  active ? "text-ink font-semibold" : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[13px] font-semibold bg-clay text-ink px-5 py-2.5 hover:bg-clay-deep transition-colors active:scale-[0.98]"
            style={{ boxShadow: "0 4px 16px -6px rgba(14,165,233,0.35)" }}
          >
            Start a project
            <span aria-hidden className="text-[11px]">→</span>
          </Link>
        </div>

        <button
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <span className={`block h-px w-6 bg-ink transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block h-px w-6 bg-ink transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-ink transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-paper border-t border-rule px-5 pb-6 flex flex-col">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[17px] py-4 border-b border-rule font-display font-medium ${active ? "text-forest" : "text-ink-soft"}`}
                style={{ minHeight: 48 }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="mt-6 text-center text-[15px] font-semibold bg-clay text-ink px-5 py-4 hover:bg-clay-deep transition-colors"
            style={{ minHeight: 48 }}
          >
            Start a project →
          </Link>
        </div>
      )}
    </header>
  );
}
