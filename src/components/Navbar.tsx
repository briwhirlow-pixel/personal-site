"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Reviews", href: "/reviews" },
  { label: "Work", href: "/work" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isHome = pathname === "/";
  const lightNav = !scrolled && isHome && !menuOpen;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome || menuOpen
        ? "bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E5E4DF]"
        : "bg-transparent"
    }`}>
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-[#2563EB] transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />

      <nav className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo light={lightNav} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`text-[13px] tracking-wide font-medium transition-all relative ${
                  active ? "text-[#2563EB]"
                  : scrolled || !isHome ? "text-[#737373] hover:text-[#1A1A1A]"
                  : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {active && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />}
              </Link>
            );
          })}
          <Link href="/contact"
            className="text-[13px] font-semibold bg-[#2563EB] text-white px-5 py-2.5 rounded-full hover:bg-[#1D4ED8] transition-all hover:scale-[1.04] active:scale-[0.97]"
          >
            Contact
          </Link>
        </div>

        {/* Mobile — hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${lightNav ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${lightNav ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${lightNav ? "bg-white" : "bg-[#1A1A1A]"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-[#FAFAF7] border-t border-[#E5E4DF] px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`py-3 px-4 rounded-xl text-[15px] font-medium transition-colors ${
                  active ? "text-[#2563EB] bg-[#EFF6FF]" : "text-[#1A1A1A] hover:bg-[#F2F1EC]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/contact"
            className="mt-2 py-3 px-4 rounded-xl text-[15px] font-bold text-center bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
