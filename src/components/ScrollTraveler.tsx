'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function ScrollTraveler() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number>(0);

  const update = useCallback(() => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH > 0) setProgress(Math.min(window.scrollY / docH, 1));
  }, []);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  if (!mounted) return null;

  const xSway = Math.sin(progress * Math.PI * 4) * 6;
  const rotation = Math.sin(progress * Math.PI * 3) * 8;

  return (
    <div
      className="fixed left-6 xl:left-10 top-0 bottom-0 z-30 hidden lg:block pointer-events-none"
      aria-hidden
    >
      {/* Dotted track — full height between margins */}
      <div
        className="absolute left-[11px] w-px"
        style={{
          top: '10vh',
          height: '80vh',
          backgroundImage: 'repeating-linear-gradient(to bottom, var(--color-rule) 0px, var(--color-rule) 4px, transparent 4px, transparent 12px)',
        }}
      />

      {/* Progress fill — scaleY instead of height animation */}
      <div
        className="absolute left-[11px] w-px bg-forest/30 origin-top"
        style={{
          top: '10vh',
          height: '80vh',
          transform: `scaleY(${progress})`,
          transition: 'transform 120ms ease-out',
        }}
      />

      {/* Section markers */}
      {[0.25, 0.5, 0.75].map((p) => (
        <div
          key={p}
          className="absolute left-[8px] w-[7px] h-[7px] rounded-full border border-rule bg-paper"
          style={{
            top: `calc(10vh + ${p * 80}vh)`,
            transform: 'translateY(-50%)',
            ...(progress >= p ? { borderColor: 'var(--color-forest)', background: 'var(--color-forest)', opacity: 0.4 } : {}),
          }}
        />
      ))}

      {/* Traveling icon — translateY from fixed origin instead of animating top */}
      <div
        className="absolute left-0"
        style={{
          top: '10vh',
          transform: `translate(${xSway}px, calc(${progress * 80}vh - 50%)) rotate(${rotation}deg)`,
          transition: 'transform 120ms ease-out',
        }}
      >
        <div
          className="w-6 h-6 bg-paper border border-forest/40 flex items-center justify-center shadow-sm"
          style={{ borderRadius: '7px' }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-forest"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
