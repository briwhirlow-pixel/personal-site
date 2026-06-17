"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
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
          boxShadow: "0 8px 24px -6px rgba(232,88,58,0.5)",
          minHeight: 44,
        }}
        className={`fixed right-5 z-40 inline-flex items-center gap-2 bg-clay text-ink font-semibold px-5 py-3 hover:bg-clay-deep transition-all duration-300 text-[13px] active:scale-[0.97] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        Start a project
        <span aria-hidden className="text-[14px] leading-none">→</span>
      </a>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          minWidth: 44,
          minHeight: 44,
        }}
        className={`fixed left-5 z-40 w-11 h-11 bg-paper-soft border border-rule flex items-center justify-center text-ink-muted hover:text-forest hover:border-rule-bright transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={14} strokeWidth={2} />
      </button>
    </>
  );
}
