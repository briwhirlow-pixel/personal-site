'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';

const words = ['grow', 'convert', 'scale', 'elevate'];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % words.length);
        setFade(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { setLoaded(true); }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 55;

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; opacity: number; color: string };
    const colors = ['rgba(37,99,235,', 'rgba(99,102,241,', 'rgba(147,197,253,'];
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.45 + 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Skip O(n²) line drawing on mobile — too GPU-heavy
      if (!isMobile) {
        particles.forEach((p, i) => {
          particles.slice(i + 1).forEach(q => {
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(147,197,253,${(1 - dist / 120) * 0.06})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      }
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section

      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A1230 0%, #122558 45%, #0C1835 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />


      <div className="hidden sm:block absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.15] pointer-events-none" style={{ background: '#2563EB' }} />
      <div className="hidden sm:block absolute bottom-1/4 left-1/5 w-[400px] h-[400px] rounded-full blur-[110px] opacity-[0.10] pointer-events-none" style={{ background: '#6366F1' }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-14 sm:pb-16 w-full">
        {/* Pill badge */}
        <div className={`inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
          <span className="text-white/50 text-[11px] sm:text-[12px] tracking-wide font-medium">Taking 4 new projects in April — spots limited</span>
        </div>

        {/* Headline with rotating word */}
        <h1 className={`text-[clamp(36px,8vw,88px)] font-black text-white leading-[1.05] tracking-tight mb-6 sm:mb-8 transition-opacity duration-700 delay-100 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          Websites that
          <br />
          <span
            className="text-[#60A5FA] inline-block"
            style={{
              opacity: fade ? 1 : 0,
              transform: fade ? 'translateY(0)' : 'translateY(-12px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              filter: fade ? 'drop-shadow(0 0 24px rgba(96,165,250,0.5))' : 'none',
            }}
          >
            {words[wordIndex]}
          </span>
          <br />
          your business.
        </h1>

        <p className={`text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-sm sm:max-w-lg mb-8 sm:mb-10 transition-opacity duration-700 delay-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          I design and build websites that turn visitors into paying customers — fast.
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-3 sm:mb-4 transition-opacity duration-700 delay-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <a href="/contact" className="group inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-[#1D4ED8] transition-all text-[14px] sm:text-[15px] hover:scale-[1.03] active:scale-[0.97]">
            Get a free quote
            <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/work" className="inline-flex items-center justify-center gap-2 text-white/60 font-semibold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full border border-white/10 hover:border-white/30 hover:text-white transition-all text-[14px] sm:text-[15px] hover:scale-[1.03] active:scale-[0.97]">
            See what I build →
          </a>
        </div>


        {/* Website type pills — 2 rows of 5, full width */}
        <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8 sm:mb-12 transition-opacity duration-700 delay-400 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { emoji: '🛍️', label: 'E-Commerce' },
            { emoji: '🍕', label: 'Restaurant' },
            { emoji: '📸', label: 'Photography' },
            { emoji: '💼', label: 'Portfolio' },
            { emoji: '🏠', label: 'Real Estate' },
            { emoji: '💈', label: 'Salon & Spa' },
            { emoji: '🏋️', label: 'Fitness' },
            { emoji: '🏗️', label: 'Construction' },
            { emoji: '📱', label: 'SaaS / App' },
            { emoji: '🎓', label: 'Education' },
          ].map((item) => (
            <span
              key={item.label}
              className="flex items-center justify-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-white/70 border border-white/20 bg-white/[0.06] rounded-full py-2 px-3"
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className={`flex flex-wrap justify-center gap-8 sm:gap-12 pt-6 sm:pt-8 border-t border-white/[0.08] transition-all duration-700 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { target: 72, suffix: 'hr', label: 'First Draft' },
            { target: 100, suffix: '%', label: 'Client Satisfaction' },
            { target: 5, suffix: '.0★', label: 'Avg. Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[28px] sm:text-[36px] font-black text-white leading-none tabular-nums">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="text-white/35 text-[11px] sm:text-[13px] mt-1 sm:mt-1.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
