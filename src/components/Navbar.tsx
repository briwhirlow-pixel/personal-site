"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/data";

const navLinks = [
  { label: "About", href: "#about", id: "about" },
  { label: "Services", href: "#services", id: "services" },
  { label: "Work", href: "#portfolio", id: "portfolio" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers = navLinks.map(link => {
      const el = document.getElementById(link.id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(link.id); },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E5E4DF]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a
          href="#"
          className={`font-bold text-[15px] tracking-widest uppercase transition-colors ${
            scrolled ? "text-[#1A1A1A]" : "text-white"
          }`}
        >
          {siteConfig.name}
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[13px] tracking-wide font-medium transition-all relative ${
                activeSection === link.id
                  ? 'text-[#2563EB]'
                  : scrolled ? "text-[#737373] hover:text-[#1A1A1A]" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </a>
          ))}
          <a
            href="#contact"
            className="text-[13px] font-semibold bg-[#2563EB] text-white px-5 py-2.5 rounded-full hover:bg-[#1D4ED8] transition-all hover:scale-[1.04] active:scale-[0.97]"
          >
            Let&apos;s Talk
          </a>
        </div>

        <a
          href="#contact"
          className="md:hidden text-[12px] font-semibold bg-[#2563EB] text-white px-4 py-2 rounded-full hover:bg-[#1D4ED8] transition-colors"
        >
          Talk
        </a>
      </nav>
    </header>
  );
}
