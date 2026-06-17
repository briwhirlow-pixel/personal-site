import Reveal from "./Reveal";

function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ width: "155px" }}>
      <div
        className="relative bg-[#1d1d1f] rounded-[26px] p-[4px]"
        style={{ boxShadow: "0 20px 50px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset" }}
      >
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[34px] h-[10px] bg-[#1d1d1f] rounded-full z-10" />
        <div className="rounded-[23px] overflow-hidden" style={{ aspectRatio: "9/19.5" }}>
          {children}
        </div>
        <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[32%] h-[3px] bg-white/15 rounded-full" />
      </div>
    </div>
  );
}

function RestaurantPhone() {
  return (
    <div className="phone-auto-1">
      <div className="bg-[#1a1612]">
        {/* Status bar */}
        <div className="h-[24px] flex items-end justify-between px-5 pb-1">
          <span className="text-[7px] font-semibold text-white/80">9:41</span>
          <div className="flex items-center gap-1.5 text-[6px] text-white/60">
            <span>●●●●</span>
            <span>▮</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-4 h-[28px]">
          <span className="text-[11px] text-[#c9a96e] tracking-[0.04em]" style={{ fontFamily: "Georgia, serif" }}>Rossi&apos;s</span>
          <span className="text-[6px] text-white/40">☰</span>
        </div>

        {/* Hero */}
        <div className="relative" style={{
          height: "160px",
          backgroundImage: "linear-gradient(to bottom, rgba(26,22,18,0.2), rgba(26,22,18,0.7)), url(https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[18px] text-white font-light leading-[0.9]" style={{ fontFamily: "Georgia, serif" }}>
              Authentic<br/><span className="italic text-[#c9a96e]">Italian.</span>
            </p>
            <div className="mt-2 h-[20px] px-3 inline-flex items-center text-[7px] font-semibold bg-[#c9a96e] text-[#1a1612]">
              Reserve a Table
            </div>
          </div>
        </div>

        {/* Menu section */}
        <div className="px-4 py-4 bg-[#1a1612]">
          <p className="text-[8px] tracking-[0.15em] text-[#c9a96e] uppercase mb-3" style={{ fontFamily: "system-ui" }}>Our Menu</p>
          {[
            { d: "Burrata & Heirloom Tomato", p: "$18" },
            { d: "Truffle Risotto", p: "$28" },
            { d: "Branzino al Forno", p: "$34" },
            { d: "Osso Buco", p: "$38" },
            { d: "Pappardelle Bolognese", p: "$24" },
          ].map(m => (
            <div key={m.d} className="flex justify-between py-1.5 border-b border-white/8">
              <span className="text-[8px] text-white/70">{m.d}</span>
              <span className="text-[8px] text-[#c9a96e]">{m.p}</span>
            </div>
          ))}
        </div>

        {/* Hours */}
        <div className="px-4 py-3 bg-[#241f19]">
          <p className="text-[7px] text-white/40">Open Daily · 5pm–11pm</p>
          <p className="text-[7px] text-white/40 mt-0.5">128 Chestnut St, Philadelphia</p>
        </div>

        {/* Order CTA */}
        <div className="px-4 py-4 bg-[#1a1612] text-center">
          <div className="h-[24px] flex items-center justify-center text-[8px] font-semibold border border-[#c9a96e] text-[#c9a96e]">
            Order Online
          </div>
        </div>
      </div>
    </div>
  );
}

function FitnessPhone() {
  return (
    <div className="phone-auto-2">
      <div className="bg-white">
        {/* Status bar */}
        <div className="h-[24px] flex items-end justify-between px-5 pb-1">
          <span className="text-[7px] font-semibold text-[#1f2535]">9:41</span>
          <div className="flex items-center gap-1.5 text-[6px] text-[#1f2535]/60">
            <span>●●●●</span>
            <span>▮</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-4 h-[28px] border-b border-[#e8e8ea]">
          <span className="text-[11px] font-bold tracking-[-0.02em] text-[#1f2535]">APEX</span>
          <span className="text-[7px] font-semibold text-white bg-[#0D7264] px-2 py-0.5">Free Pass</span>
        </div>

        {/* Hero */}
        <div className="relative" style={{
          height: "170px",
          backgroundImage: "linear-gradient(to bottom, rgba(31,37,53,0.3), rgba(31,37,53,0.75)), url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=300)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[20px] font-bold text-white leading-[0.9] tracking-[-0.02em]">
              An hour<br/>at the limit.
            </p>
            <p className="text-[7px] text-white/60 mt-1.5">Six disciplines. Three coaches.</p>
            <div className="mt-2 h-[22px] px-3 inline-flex items-center text-[7px] font-semibold bg-white text-[#1f2535]">
              Get Your Free Pass
            </div>
          </div>
        </div>

        {/* Classes */}
        <div className="px-4 py-4 bg-[#FBFBFB]">
          <p className="text-[9px] font-bold text-[#1f2535] mb-2">Programs</p>
          <div className="grid grid-cols-2 gap-1.5">
            {["Strength", "HIIT", "Boxing", "Yoga", "Cycling", "Recovery"].map(d => (
              <div key={d} className="bg-white border border-[#e8e8ea] px-2 py-2">
                <p className="text-[7px] font-bold text-[#1f2535]">{d}</p>
                <p className="text-[5px] text-[#999] mt-0.5">45-60 min</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="px-4 py-4 bg-white border-t border-[#e8e8ea]">
          <p className="text-[9px] font-bold text-[#1f2535] mb-2">Membership</p>
          {[
            { t: "Drop-in", p: "$25/class" },
            { t: "Monthly", p: "$149/mo" },
            { t: "Annual", p: "$1,299/yr" },
          ].map(m => (
            <div key={m.t} className="flex justify-between py-1.5 border-b border-[#f0f0f2] last:border-0">
              <span className="text-[8px] text-[#1f2535]">{m.t}</span>
              <span className="text-[8px] font-bold text-[#0D7264]">{m.p}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#1f2535]">
          <p className="text-[7px] text-white/40">Open today · 5am–10pm</p>
          <p className="text-[7px] text-white/40 mt-0.5">(610) 555-0174</p>
        </div>
      </div>
    </div>
  );
}

function SalonPhone() {
  return (
    <div className="phone-auto-3">
      <div className="bg-[#faf6f0]">
        {/* Status bar */}
        <div className="h-[24px] flex items-end justify-between px-5 pb-1">
          <span className="text-[7px] font-semibold text-[#2c2420]">9:41</span>
          <div className="flex items-center gap-1.5 text-[6px] text-[#2c2420]/60">
            <span>●●●●</span>
            <span>▮</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-4 h-[28px] border-b border-[#ede8e0]">
          <span className="text-[10px] tracking-[0.04em] text-[#2c2420]" style={{ fontFamily: "Georgia, serif" }}>Golden Comb</span>
          <span className="text-[7px] font-semibold text-white bg-[#b8956a] px-2 py-0.5" style={{ fontFamily: "system-ui" }}>Book</span>
        </div>

        {/* Hero */}
        <div className="relative" style={{
          height: "155px",
          backgroundImage: "linear-gradient(to bottom, rgba(250,246,240,0.1), rgba(250,246,240,0.6)), url(https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[17px] text-[#2c2420] font-light leading-[0.9]" style={{ fontFamily: "Georgia, serif" }}>
              The <span className="italic">Golden</span><br/>Comb
            </p>
            <p className="text-[7px] text-[#8a7e72] mt-1.5" style={{ fontFamily: "system-ui" }}>Sewell, New Jersey</p>
          </div>
        </div>

        {/* Services */}
        <div className="px-4 py-4 bg-white">
          <p className="text-[8px] tracking-[0.12em] text-[#b8956a] uppercase mb-2" style={{ fontFamily: "system-ui" }}>Services</p>
          {[
            { s: "Precision Cut & Blowout", p: "$75+" },
            { s: "Full Highlight", p: "$165+" },
            { s: "Balayage & Toner", p: "$210+" },
            { s: "Keratin Smoothing", p: "$300+" },
            { s: "Bridal Styling", p: "$400+" },
          ].map(svc => (
            <div key={svc.s} className="flex justify-between py-1.5 border-b border-[#f0ece6] last:border-0">
              <span className="text-[8px] text-[#2c2420]">{svc.s}</span>
              <span className="text-[8px] font-semibold text-[#b8956a]" style={{ fontFamily: "system-ui" }}>{svc.p}</span>
            </div>
          ))}
        </div>

        {/* Stylists */}
        <div className="px-4 py-4 bg-[#faf6f0] border-t border-[#ede8e0]">
          <p className="text-[8px] tracking-[0.12em] text-[#b8956a] uppercase mb-2" style={{ fontFamily: "system-ui" }}>Stylists</p>
          {[
            { n: "Danielle", t: "Owner · 14 years", bg: "#e0d4c8" },
            { n: "Kayla", t: "Colorist · 8 years", bg: "#d6cabc" },
            { n: "Tess", t: "Lash Tech · 5 years", bg: "#dcd0c4" },
          ].map(p => (
            <div key={p.n} className="flex items-center gap-2 py-1.5">
              <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: p.bg }} />
              <div>
                <p className="text-[8px] font-semibold text-[#2c2420]">{p.n}</p>
                <p className="text-[6px] text-[#8a7e72]">{p.t}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Book */}
        <div className="px-4 py-4 bg-white border-t border-[#ede8e0] text-center">
          <div className="h-[24px] flex items-center justify-center text-[8px] font-semibold bg-[#b8956a] text-white" style={{ fontFamily: "system-ui" }}>
            Book an Appointment
          </div>
          <p className="text-[6px] text-[#8a7e72] mt-1.5" style={{ fontFamily: "system-ui" }}>Gift cards available</p>
        </div>
      </div>
    </div>
  );
}

export default function PhoneShowcase() {
  return (
    <section className="relative bg-paper text-ink py-16 sm:py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <div className="text-center max-w-lg mx-auto mb-10 sm:mb-14">
            <h2
              className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink"
              style={{ fontSize: "clamp(28px, 4.5vw, 44px)" }}
            >
              Mobile-first. Always.
            </h2>
            <p className="text-ink-soft text-[15px] leading-relaxed font-medium mt-3">
              Every site works perfectly on the device your customers actually use.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex items-start justify-center gap-5 sm:gap-7 md:gap-10">

            <PhoneFrame className="mt-10 hidden sm:block">
              <RestaurantPhone />
            </PhoneFrame>

            <PhoneFrame>
              <FitnessPhone />
            </PhoneFrame>

            <PhoneFrame className="mt-10 hidden sm:block">
              <SalonPhone />
            </PhoneFrame>

          </div>
        </Reveal>

      </div>
    </section>
  );
}
