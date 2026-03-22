'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';

const words = ['grow', 'convert', 'scale', 'stand out'];

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

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; opacity: number; color: string };
    const colors = ['rgba(37,99,235,', 'rgba(99,102,241,', 'rgba(147,197,253,'];
    const particles: Particle[] = Array.from({ length: 55 }, () => ({
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
      style={{ background: 'linear-gradient(135deg, #06091F 0%, #0D1B45 45%, #081229 100%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.15] pointer-events-none" style={{ background: '#2563EB' }} />
      <div className="absolute bottom-1/4 left-1/5 w-[400px] h-[400px] rounded-full blur-[110px] opacity-[0.10] pointer-events-none" style={{ background: '#6366F1' }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 w-full">
        {/* Pill badge */}
        <div className={`inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
          <span className="text-white/50 text-[12px] tracking-wide font-medium">Available for new projects — 2026</span>
        </div>

        {/* Headline */}
        <h1 className={`text-[clamp(42px,7vw,88px)] font-black text-white leading-[1.0] tracking-tight mb-8 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Websites that
          <br />
          <span
            className="text-[#60A5FA] inline-block"
            style={{
              opacity: fade ? 1 : 0,
              transform: fade ? 'translateY(0)' : 'translateY(-12px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {words[wordIndex]}
          </span>
          <br />
          your business.
        </h1>

        <p className={`text-white/45 text-[17px] leading-relaxed max-w-lg mb-10 transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          I design and build fast, beautiful websites that convert visitors into customers — from brochure sites to full e-commerce stores.
        </p>

        <div className={`flex flex-wrap gap-4 mb-20 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a href="#contact" className="group inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-7 py-4 rounded-full hover:bg-[#1D4ED8] transition-all text-[15px] hover:scale-[1.03] active:scale-[0.97]">
            Get a free quote
            <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="#portfolio" className="inline-flex items-center gap-2 text-white/60 font-semibold px-7 py-4 rounded-full border border-white/10 hover:border-white/30 hover:text-white transition-all text-[15px] hover:scale-[1.03] active:scale-[0.97]">
            See my work
          </a>
        </div>

        {/* Stats */}
        <div className={`flex flex-wrap gap-12 pt-8 border-t border-white/[0.08] transition-all duration-700 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { target: 40, suffix: '+', label: 'Sites Launched' },
            { target: 98, suffix: '%', label: 'Client Satisfaction' },
            { target: 3, suffix: '×', label: 'Avg. Lead Increase' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[36px] font-black text-white leading-none tabular-nums">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="text-white/35 text-[13px] mt-1.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
        <div className="relative h-12 w-px bg-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#60A5FA] to-transparent" style={{ animation: 'scrollLine 1.8s ease-in-out infinite' }} />
        </div>
      </div>
      <style>{`@keyframes scrollLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }`}</style>
    </section>
  );
}
