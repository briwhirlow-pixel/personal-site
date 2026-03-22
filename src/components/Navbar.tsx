"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white border-b border-zinc-200" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a
          href="#"
          className={`font-bold text-[15px] tracking-widest uppercase transition-colors ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          {siteConfig.name}
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[13px] tracking-widest uppercase font-medium transition-colors hover:opacity-60 ${
                scrolled ? "text-black" : "text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={`text-[13px] tracking-widest uppercase font-medium border px-5 py-2.5 transition-all hover:opacity-70 ${
              scrolled
                ? "border-black text-black hover:bg-black hover:text-white"
                : "border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile CTA */}
        <a
          href="#contact"
          className={`md:hidden text-[12px] tracking-widest uppercase font-medium border px-4 py-2 transition-all ${
            scrolled
              ? "border-black text-black"
              : "border-white text-white"
          }`}
        >
          Talk
        </a>
      </nav>
    </header>
  );
}
