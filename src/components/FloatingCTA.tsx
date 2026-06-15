"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

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
      <a
        href="/contact"
        style={{
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          boxShadow: "0 8px 24px -6px rgba(45,106,79,0.5)",
        }}
        className={`fixed right-6 z-40 inline-flex items-center gap-2 bg-forest text-paper font-semibold px-5 py-3 rounded-[6px] hover:bg-forest-deep transition-all duration-300 text-[13px] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        Start a project
        <span aria-hidden className="font-serif text-[15px] leading-none">↗</span>
      </a>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        className={`fixed left-6 z-40 w-10 h-10 rounded-full bg-paper border border-rule flex items-center justify-center text-ink-muted hover:text-forest hover:border-forest/40 transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={14} strokeWidth={2} />
      </button>
    </>
  );
}
