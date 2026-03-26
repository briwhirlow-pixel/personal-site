"use client";

import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setVisible(window.scrollY > heroHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Get a Quote button */}
      <a
        href="/contact"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        className={`fixed right-6 z-40 flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-5 py-3.5 rounded-full shadow-[0_8px_32px_rgba(37,99,235,0.35)] hover:bg-[#1D4ED8] hover:scale-[1.05] active:scale-[0.97] transition-all duration-300 text-[13px] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse flex-shrink-0" />
        Get a Free Quote
      </a>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        className={`fixed left-6 z-40 w-11 h-11 rounded-full bg-white border border-[#E5E4DF] shadow-md flex items-center justify-center text-[#737373] hover:text-[#2563EB] hover:border-[#2563EB]/40 hover:scale-[1.08] active:scale-[0.95] transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
