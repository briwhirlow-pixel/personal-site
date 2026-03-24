"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/lib/data";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Reviews", href: "/reviews" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E5E4DF]"
          : "bg-transparent"
      }`}
    >
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-[#2563EB] transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />

      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={`font-bold text-[15px] tracking-widest uppercase transition-colors ${
            scrolled || !isHome ? "text-[#1A1A1A]" : "text-white"
          }`}
        >
          {siteConfig.name}
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] tracking-wide font-medium transition-all relative ${
                  active
                    ? "text-[#2563EB]"
                    : scrolled || !isHome
                    ? "text-[#737373] hover:text-[#1A1A1A]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="text-[13px] font-semibold bg-[#2563EB] text-white px-5 py-2.5 rounded-full hover:bg-[#1D4ED8] transition-all hover:scale-[1.04] active:scale-[0.97]"
          >
            Let&apos;s Talk
          </Link>
        </div>

        <Link
          href="/contact"
          className="md:hidden text-[12px] font-semibold bg-[#2563EB] text-white px-4 py-2 rounded-full hover:bg-[#1D4ED8] transition-colors"
        >
          Talk
        </Link>
      </nav>
    </header>
  );
}
