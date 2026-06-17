import { Search, Smartphone, Share2, MapPin, Zap, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" className={className}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function AndroidLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" className={className}>
      <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.86-.31-.16-.68-.04-.85.27l-1.87 3.23A10.46 10.46 0 0 0 12 8c-1.58 0-3.07.36-4.44.93L5.68 5.7c-.16-.31-.54-.43-.85-.27-.31.17-.43.55-.27.86L6.4 9.48A9.84 9.84 0 0 0 2 17h20a9.84 9.84 0 0 0-4.4-7.52zM7 14.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
    </svg>
  );
}

function ChromeLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="3.5"/>
      <path d="M12 2a10 10 0 0 1 8.66 5h-5.93A4.5 4.5 0 0 0 12 5.5a4.49 4.49 0 0 0-3.89 2.25L4.45 1.92A10 10 0 0 1 12 2z"/>
      <path d="M2 12a10 10 0 0 1 2.45-6.58l2.97 5.14A4.48 4.48 0 0 0 7.5 12c0 1.38.62 2.61 1.6 3.43l-2.97 5.14A10 10 0 0 1 2 12z"/>
      <path d="M12 22a10 10 0 0 1-5.87-1.93l2.97-5.14A4.47 4.47 0 0 0 12 16.5c1.66 0 3.1-.9 3.87-2.24l2.97 5.14A10 10 0 0 1 12 22z"/>
      <path d="M22 12a10 10 0 0 1-3.16 7.33l-2.97-5.14A4.48 4.48 0 0 0 16.5 12c0-.78-.2-1.52-.55-2.16l2.97-5.14A10 10 0 0 1 22 12z"/>
    </svg>
  );
}

const platforms = [
  { name: "Google SEO", desc: "Local search rankings", icon: Search },
  { name: "Mobile Ready", desc: "iOS + Android perfect", icon: Smartphone },
  { name: "Social Previews", desc: "Instagram & Facebook cards", icon: Share2 },
  { name: "Google Maps", desc: "Business profile linked", icon: MapPin },
  { name: "Fast Loading", desc: "Core Web Vitals passing", icon: Zap },
  { name: "Secure", desc: "HTTPS + best practices", icon: ShieldCheck },
];

export default function Platforms() {
  return (
    <section className="relative bg-ink text-white py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-10 sm:mb-14">
            <div className="md:col-span-4">
              <p
                className="font-display font-medium text-white leading-[0.85] tracking-[-0.04em]"
                style={{ fontSize: "clamp(72px, 12vw, 110px)" }}
              >
                90<span className="text-forest-bright">+</span>
              </p>
              <p className="text-white/35 text-[14px] font-medium mt-1 leading-snug">
                Lighthouse performance score on every site I deliver.
              </p>
            </div>
            <div className="md:col-span-8">
              <h2
                className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-white"
                style={{ fontSize: "clamp(26px, 4vw, 40px)" }}
              >
                Your site works everywhere<br className="hidden sm:block" /> your customers are.
              </h2>
              <p className="text-white/40 text-[15px] font-medium mt-3 max-w-lg leading-relaxed">
                Every build ships with SEO, mobile optimization, social preview cards, and performance tuning baked in from day one.
              </p>
              <div className="flex items-center gap-4 mt-5">
                <GoogleLogo className="text-white/60" />
                <AppleLogo className="text-white/60" />
                <AndroidLogo className="text-white/60" />
                <ChromeLogo className="text-white/60" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="border-t border-white/8 pt-8 sm:pt-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-6 gap-x-4">
              {platforms.map((p) => (
                <div key={p.name} className="flex items-start gap-2.5">
                  <p.icon
                    size={16}
                    strokeWidth={1.75}
                    className="text-forest-bright flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-white leading-tight">{p.name}</p>
                    <p className="text-[11px] text-white/30 mt-0.5 leading-snug">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
