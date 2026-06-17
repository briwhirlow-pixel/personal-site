'use client';
import { liveProjects } from "@/lib/data";
import Reveal from "./Reveal";

function BrowserChrome({ url, dark }: { url?: string; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 h-[20px] flex-shrink-0 ${dark ? 'bg-[#2a2a2c]' : 'bg-[#f0f0f2]'}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#28CA41]" />
      <div className={`flex-1 mx-2 rounded-full h-2.5 flex items-center px-2 ${dark ? 'bg-white/8' : 'bg-black/5'}`}>
        {url && <span className={`text-[6px] font-medium truncate ${dark ? 'text-white/25' : 'text-black/25'}`}>{url}</span>}
      </div>
    </div>
  );
}

function CardWrapper({ label, live, url, cardBg, labelColor, children }: {
  label: string; live?: boolean; url?: string; cardBg?: string; labelColor?: string; children: React.ReactNode;
}) {
  const href = url || "/contact";
  const isExternal = !!url;
  const isDark = cardBg ? ['#1a1a1a', '#0f172a', '#1f2535', '#14110d', '#2c1810', '#0d7264', '#2a2a2a', '#1e3a5f'].some(c => cardBg.toLowerCase().includes(c.slice(1))) : false;
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group block overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      style={{ background: cardBg || 'var(--color-paper)', borderRadius: '12px' }}
    >
      <div className="w-full overflow-hidden" style={{ aspectRatio: "4/3", borderRadius: '12px 12px 0 0' }}>
        {children}
      </div>
      <div className="px-4 py-3.5 flex items-center justify-between">
        <span className={`text-[13px] font-semibold ${isDark ? 'text-white' : 'text-ink'}`} style={labelColor ? { color: labelColor } : undefined}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {live && (
            <span className={`text-[10px] font-medium flex items-center gap-1.5 tracking-wide uppercase ${isDark ? 'text-green-400' : 'text-clay'}`}>
              <span className={`w-1.5 h-1.5 pulse-dot inline-block ${isDark ? 'bg-green-400' : 'bg-clay'}`} aria-hidden />
              Live
            </span>
          )}
          <span className={`text-[12px] transition-colors ${isDark ? 'text-white/50 group-hover:text-white' : 'text-ink-muted group-hover:text-forest'}`}>
            {isExternal ? "View site ↗" : "Get a quote →"}
          </span>
        </div>
      </div>
    </a>
  );
}

/* ─── 1. APEX FITNESS — vertical scroll, detailed replica ─── */
function ApexMockup() {
  return (
    <CardWrapper label="Fitness Studio" live url={liveProjects[0]?.url} cardBg="#0D7264" labelColor="#fff">
      <BrowserChrome url="apex-fitness-navy.vercel.app" />
      <div className="mockup-scroll" style={{ fontFamily: "system-ui, sans-serif" }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-3 h-[22px] bg-[#FBFBFB] border-b border-[#e8e8ea]">
          <span className="text-[8px] font-extrabold tracking-[-0.04em] text-[#1f2535]">APEX</span>
          <div className="flex items-center gap-2">
            <span className="text-[5px] text-[#999]">Programs</span>
            <span className="text-[5px] text-[#999]">Coaches</span>
            <span className="text-[5px] text-[#999]">Membership</span>
            <span className="text-[6px] font-bold text-[#FBFBFB] bg-[#0D7264] px-1.5 py-0.5">Free Pass</span>
          </div>
        </div>

        {/* Hero — gym action shot */}
        <div className="relative" style={{
          height: "160px",
          backgroundImage: "linear-gradient(to bottom, rgba(31,37,53,0.15), rgba(31,37,53,0.7)), url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400)",
          backgroundSize: "cover", backgroundPosition: "center 30%",
        }}>
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-[16px] font-extrabold leading-[0.9] text-white tracking-[-0.03em]">An hour<br/>at the limit.</p>
            <p className="text-[6px] text-white/60 mt-1">Six disciplines. Three resident coaches. Your free trial is waiting.</p>
            <div className="flex gap-1 mt-2">
              <span className="h-[14px] px-2 flex items-center text-[5px] font-bold bg-white text-[#1f2535]">Get Your Free Pass</span>
              <span className="h-[14px] px-2 flex items-center text-[5px] font-semibold border border-white/30 text-white">View Programs</span>
            </div>
          </div>
        </div>

        {/* Disciplines grid */}
        <div className="px-3 py-4 bg-[#FBFBFB]">
          <p className="text-[7px] font-extrabold text-[#1f2535] mb-2 tracking-[-0.01em]">Six disciplines. One studio.</p>
          <div className="grid grid-cols-3 gap-1">
            {[
              { name: "Strength", time: "60 min", color: "#0D7264" },
              { name: "HIIT", time: "45 min", color: "#B45309" },
              { name: "Boxing", time: "60 min", color: "#DC2626" },
              { name: "Yoga", time: "75 min", color: "#7C3AED" },
              { name: "Cycling", time: "45 min", color: "#2563EB" },
              { name: "Recovery", time: "30 min", color: "#059669" },
            ].map(d => (
              <div key={d.name} className="bg-white border border-[#e8e8ea] p-1.5">
                <div className="w-3 h-0.5 mb-1" style={{ background: d.color }} />
                <p className="text-[6px] font-bold text-[#1f2535]">{d.name}</p>
                <p className="text-[5px] text-[#999]">{d.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coaches */}
        <div className="px-3 py-4 bg-white border-t border-[#e8e8ea]">
          <p className="text-[7px] font-extrabold text-[#1f2535] mb-2">Meet the coaches.</p>
          <div className="flex gap-2">
            {[
              { name: "Coach Rivera", spec: "Strength & HIIT" },
              { name: "Coach Tran", spec: "Boxing & Cycling" },
              { name: "Coach Fields", spec: "Yoga & Recovery" },
            ].map(c => (
              <div key={c.name} className="flex-1">
                <div className="aspect-[3/4] bg-gradient-to-b from-[#e8e8ea] to-[#d4d4d8] mb-1" />
                <p className="text-[6px] font-bold text-[#1f2535]">{c.name}</p>
                <p className="text-[4px] text-[#999]">{c.spec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="px-3 py-4 bg-[#FBFBFB] border-t border-[#e8e8ea]">
          <p className="text-[7px] font-extrabold text-[#1f2535] mb-2">Membership</p>
          <div className="flex gap-1">
            {[
              { t: "Drop-in", p: "$25", sub: "per class" },
              { t: "Monthly", p: "$149", sub: "unlimited", pop: true },
              { t: "Annual", p: "$1,299", sub: "best value" },
            ].map(m => (
              <div key={m.t} className={`flex-1 px-1.5 py-2 text-center border ${m.pop ? 'border-[#0D7264] bg-white' : 'border-[#e8e8ea] bg-white'}`}>
                <p className="text-[8px] font-extrabold text-[#0D7264]">{m.p}</p>
                <p className="text-[5px] font-bold text-[#1f2535] mt-0.5">{m.t}</p>
                <p className="text-[4px] text-[#999]">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 bg-[#1f2535] flex justify-between text-[5px] text-white/40">
          <span>APEX Performance Studio</span>
          <span>Built by Brian</span>
        </div>
      </div>
    </CardWrapper>
  );
}

/* ─── 2. RESTAURANT — zoom animation, warm editorial design ─── */
function RestaurantMockup() {
  return (
    <CardWrapper label="Italian Restaurant" cardBg="#2C1810" labelColor="#E8D5C4">
      <BrowserChrome url="rosalia-restaurant.com" dark />
      <div className="mockup-zoom" style={{ fontFamily: "Georgia, serif" }}>
        {/* Nav — thin elegant */}
        <div className="flex items-center justify-between px-4 h-[22px] bg-[#2C1810]">
          <span className="text-[9px] font-normal tracking-[0.15em] text-[#E8D5C4]" style={{ fontFamily: "Georgia, serif" }}>ROSALIA</span>
          <div className="flex items-center gap-3">
            <span className="text-[5px] text-[#E8D5C4]/50 tracking-[0.1em]">MENU</span>
            <span className="text-[5px] text-[#E8D5C4]/50 tracking-[0.1em]">RESERVE</span>
            <span className="text-[5px] text-[#B8433A] tracking-[0.1em]">BOOK A TABLE</span>
          </div>
        </div>

        {/* Hero — full bleed food photo */}
        <div className="relative" style={{
          height: "150px",
          backgroundImage: "linear-gradient(180deg, rgba(44,24,16,0.1) 0%, rgba(44,24,16,0.7) 100%), url(https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}>
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <p className="text-[5px] tracking-[0.25em] text-[#E8D5C4]/60 uppercase mb-1">Est. 2019 · South Philadelphia</p>
            <p className="text-[18px] leading-[0.85] text-[#E8D5C4] font-normal italic">Wood-fired.<br/>Locally sourced.</p>
            <div className="mt-2">
              <span className="inline-flex h-[14px] px-3 items-center text-[5px] tracking-[0.1em] uppercase bg-[#B8433A] text-white font-semibold" style={{ fontFamily: "system-ui" }}>Reserve a Table</span>
            </div>
          </div>
        </div>

        {/* Menu section — centered list, not cards */}
        <div className="px-5 py-4 bg-[#FBF8F5] text-center">
          <p className="text-[5px] tracking-[0.2em] text-[#B8433A] uppercase mb-1" style={{ fontFamily: "system-ui" }}>Tonight&apos;s Specials</p>
          <p className="text-[9px] text-[#2C1810] italic mb-2">From our kitchen to your table.</p>
          <div className="space-y-1.5 max-w-[70%] mx-auto">
            {[
              { dish: "Burrata con Pomodorini", price: "$18" },
              { dish: "Rigatoni alla Vodka", price: "$24" },
              { dish: "Branzino al Limone", price: "$32" },
              { dish: "Tiramisu della Casa", price: "$14" },
            ].map(item => (
              <div key={item.dish} className="flex items-center justify-between text-[6px]">
                <span className="text-[#2C1810] italic">{item.dish}</span>
                <span className="text-[#2C1810]/40 flex-1 mx-2 border-b border-dotted border-[#2C1810]/15" />
                <span className="text-[#B8433A] font-semibold" style={{ fontFamily: "system-ui" }}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Atmosphere — wide photo strip */}
        <div className="h-[50px]" style={{
          backgroundImage: "url(https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=400)",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />

        {/* Reservation CTA */}
        <div className="px-4 py-3 bg-[#2C1810] text-center">
          <p className="text-[8px] text-[#E8D5C4] italic">Private dining for every occasion.</p>
          <p className="text-[5px] text-[#E8D5C4]/40 mt-1" style={{ fontFamily: "system-ui" }}>12 – 80 guests · Full buyout available</p>
        </div>

        <div className="px-3 py-1.5 bg-[#1a0f08] text-[4px] text-[#E8D5C4]/30 flex justify-between" style={{ fontFamily: "system-ui" }}>
          <span>Rosalia · South Philadelphia</span>
          <span>Built by Brian</span>
        </div>
      </div>
    </CardWrapper>
  );
}

/* ─── 3. STREETWEAR MARKETPLACE — Grailed-style, Impact/condensed grotesque font ─── */
function EcommerceMockup() {
  const headFont = "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif";
  const bodyFont = "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  return (
    <CardWrapper label="Streetwear Marketplace" cardBg="#1a1a1a" labelColor="#fff">
      <BrowserChrome url="vaultarchive.com" dark />
      <div className="mockup-scroll-deep" style={{ fontFamily: bodyFont }}>

        {/* Top bar: logo + search + auth */}
        <div className="flex items-center justify-between px-3 h-[22px] bg-white border-b border-[#e5e5e5]">
          <span className="text-[10px] tracking-[0.06em] text-[#1a1a1a] uppercase" style={{ fontFamily: headFont }}>VAULT</span>
          <div className="flex-1 mx-2 h-[12px] bg-[#f5f5f5] border border-[#e0e0e0] flex items-center px-1.5">
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
            <span className="text-[4.5px] text-[#999] ml-1">Search for anything</span>
            <span className="ml-auto text-[4px] font-bold text-white bg-[#1a1a1a] px-1 py-[1px]">SEARCH</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[4.5px] font-bold text-[#1a1a1a] border border-[#1a1a1a] px-1 py-[1px]">SELL</span>
            <span className="text-[4.5px] text-[#666]">Sign Up</span>
            <span className="text-[4.5px] font-bold text-white bg-[#1a1a1a] px-1.5 py-[1px]">LOG IN</span>
          </div>
        </div>

        {/* Category nav */}
        <div className="flex items-center justify-center gap-3 px-3 h-[16px] bg-white border-b border-[#e5e5e5]">
          {["DESIGNERS", "MENSWEAR", "WOMENSWEAR", "SNEAKERS", "STAFF PICKS", "COLLECTIONS"].map(cat => (
            <span key={cat} className="text-[4px] font-bold text-[#1a1a1a] tracking-[0.04em]">{cat}</span>
          ))}
        </div>

        {/* Hero banner */}
        <div className="relative" style={{ height: "130px", background: "linear-gradient(135deg, #2c4a7c 0%, #1a3560 40%, #3a5a8a 100%)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(255,165,50,0.15) 0%, transparent 50%)" }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[5px] text-white/60 tracking-[0.15em] uppercase font-bold">Team Gear, Designer Collabs + More</p>
            <p className="text-[18px] text-white mt-1 leading-none tracking-[0.02em] uppercase" style={{ fontFamily: headFont }}>The Summer Edit</p>
            <div className="mt-2 h-[14px] px-3 flex items-center text-[5.5px] font-bold border border-white/50 text-white tracking-[0.1em] uppercase">
              Shop Now
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-[4px] h-[4px] rounded-full bg-white" />
            <div className="w-[4px] h-[4px] rounded-full bg-white/30" />
            <div className="w-[4px] h-[4px] rounded-full bg-white/30" />
            <div className="w-[4px] h-[4px] rounded-full bg-white/30" />
          </div>
          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[10px] text-white/40">‹</div>
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-white/40">›</div>
        </div>

        {/* Product sections */}
        <div className="bg-white px-3 pt-3 pb-2">
          <div className="mb-3">
            <p className="text-[4px] text-[#999] uppercase tracking-[0.05em]">Supreme, Chrome Hearts, Helmut Lang +More</p>
            <p className="text-[7px] font-bold text-[#1a1a1a] mb-1.5">Trending: Apparel</p>
            <div className="flex gap-1">
              {[
                { bg: "#8b7b6b", label: "Kapital", price: "$740" },
                { bg: "#5c5c5c", label: "Rick Owens", price: "$520" },
                { bg: "#a89080", label: "Needles", price: "$285" },
                { bg: "#6b6b5b", label: "Stüssy", price: "$95" },
              ].map(p => (
                <div key={p.label} className="flex-1">
                  <div className="aspect-square" style={{ background: p.bg }} />
                  <p className="text-[4.5px] text-[#1a1a1a] mt-0.5 truncate">{p.label}</p>
                  <p className="text-[4.5px] font-bold text-[#1a1a1a]">{p.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-[4px] text-[#999] uppercase tracking-[0.05em]">Nike, Jordan Brand, New Balance +More</p>
            <p className="text-[7px] font-bold text-[#1a1a1a] mb-1.5">Trending: Footwear</p>
            <div className="flex gap-1">
              {[
                { bg: "#d4cbc0", label: "AJ1 Chicago", price: "$380" },
                { bg: "#b8b0a4", label: "NB 990v6", price: "$175" },
                { bg: "#c7bdb0", label: "Dunk Low", price: "$140" },
                { bg: "#e0d8cc", label: "Gel-Kayano", price: "$160" },
              ].map(p => (
                <div key={p.label} className="flex-1">
                  <div className="aspect-square" style={{ background: p.bg }} />
                  <p className="text-[4.5px] text-[#1a1a1a] mt-0.5 truncate">{p.label}</p>
                  <p className="text-[4.5px] font-bold text-[#1a1a1a]">{p.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[4px] text-[#999] uppercase tracking-[0.05em]">From Vault</p>
            <p className="text-[7px] font-bold text-[#1a1a1a] mb-1.5">Staff Picks</p>
            <div className="flex gap-1">
              {[
                { bg: "#7a6a5a", label: "Margiela Tabi", price: "$620" },
                { bg: "#4a4a4a", label: "Raf Simons", price: "$450" },
                { bg: "#9a8a7a", label: "Visvim", price: "$890" },
                { bg: "#5a5a5a", label: "Undercover", price: "$340" },
              ].map(p => (
                <div key={p.label} className="flex-1">
                  <div className="aspect-square" style={{ background: p.bg }} />
                  <p className="text-[4.5px] text-[#1a1a1a] mt-0.5 truncate">{p.label}</p>
                  <p className="text-[4.5px] font-bold text-[#1a1a1a]">{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 py-2 bg-[#1a1a1a] flex justify-between text-[4.5px] text-white/40">
          <span>Vault Archive · Buy &amp; Sell</span>
          <span>Built by Brian</span>
        </div>
      </div>
    </CardWrapper>
  );
}

/* ─── 4. PHOTOGRAPHER — editorial poster with gallery, diagonal drift ─── */
function PortfolioMockup() {
  return (
    <CardWrapper label="Photography" cardBg="#2a2a2a" labelColor="#fff">
      <BrowserChrome url="marcellatapia.com" />
      <div className="mockup-drift" style={{ fontFamily: "system-ui, sans-serif" }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-4 h-[26px] bg-white border-b border-[#eee]">
          <span className="text-[10px] font-medium text-[#2a2a2a] tracking-[-0.01em]" style={{ fontFamily: "Georgia, serif" }}>Marcella Tapia</span>
          <div className="flex items-center gap-3 text-[6px] text-[#aaa]">
            <span>Weddings</span>
            <span>Portraits</span>
            <span>About</span>
            <span className="text-[#2a2a2a] font-semibold">Book</span>
          </div>
        </div>

        {/* Hero photo — dominant visual */}
        <div className="relative" style={{
          height: "195px",
          backgroundImage: "url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600)",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}>
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.85) 100%)",
          }} />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[26px] font-light text-white leading-[0.88]" style={{ fontFamily: "Georgia, serif" }}>
              Marcella<br/><span className="italic">Tapia</span>
            </p>
            <p className="text-[8px] text-white/45 mt-2">Wedding &amp; Portrait Photography</p>
          </div>
        </div>

        {/* Portfolio thumbnails — varied heights */}
        <div className="flex gap-[1px] bg-white">
          {[
            { bg: "#e8e2d8", h: 52 },
            { bg: "#d5ccc0", h: 60 },
            { bg: "#c7bdb0", h: 48 },
            { bg: "#dbd4c8", h: 56 },
            { bg: "#cfc5b8", h: 52 },
          ].map((t, i) => (
            <div key={i} className="flex-1" style={{ height: `${t.h}px`, background: t.bg }} />
          ))}
        </div>

        {/* Quote + CTA */}
        <div className="px-4 py-3 bg-white border-t border-[#eee]">
          <p className="text-[10px] text-[#2a2a2a] leading-[1.35]" style={{ fontFamily: "Georgia, serif" }}>
            &ldquo;I photograph people as they are,<br/>not as they pose.&rdquo;
          </p>
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-[7px] text-[#aaa]">Philadelphia · South Jersey</p>
            <span className="h-[16px] px-3 flex items-center text-[6px] font-semibold bg-[#2a2a2a] text-white tracking-[0.02em]">Inquire</span>
          </div>
        </div>

        {/* Booking bar */}
        <div className="px-4 py-2.5 bg-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <p className="text-[7px] text-white/50">Now booking 2025 weddings</p>
            <p className="text-[7px] text-white/25">marcellatapia.com</p>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}

/* ─── 5. LUXURY REAL ESTATE — Palatino serif headings, navy + gold, premium feel ─── */
function RealEstateMockup() {
  const headFont = "'Palatino Linotype', Palatino, 'Book Antiqua', serif";
  const bodyFont = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
  return (
    <CardWrapper label="Luxury Real Estate" cardBg="#1e3a5f" labelColor="#fff">
      <BrowserChrome url="baruhteam.com" dark />
      <div className="mockup-zoom-right" style={{ fontFamily: bodyFont }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-4 h-[24px] bg-white border-b border-[#eee]">
          <span className="text-[10px] tracking-[0.12em] text-[#1e3a5f] uppercase" style={{ fontFamily: headFont }}>Baruh</span>
          <div className="flex items-center gap-3 text-[5px] text-[#777]">
            <span>Listings</span>
            <span>Neighborhoods</span>
            <span>About</span>
            <span className="font-bold text-[#1e3a5f]">Contact</span>
          </div>
        </div>

        {/* Hero — full bleed property photo */}
        <div className="relative" style={{
          height: "140px",
          backgroundImage: "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.95) 100%), url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-[16px] leading-[1] text-[#1e3a5f] italic" style={{ fontFamily: headFont }}>
              Expertise. Integrity.<br/>Creativity.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mx-4 -mt-1 bg-white border border-[#e5e5e5] px-3 py-2 flex items-center gap-2">
          <span className="text-[6px] text-[#999]">Search by city, neighborhood, or address...</span>
          <span className="ml-auto text-[6px] font-bold text-white bg-[#1e3a5f] px-2 py-0.5">Search</span>
        </div>

        {/* Featured listings */}
        <div className="px-4 pt-4 pb-2 bg-white">
          <p className="text-[8px] text-[#1e3a5f] mb-2 italic" style={{ fontFamily: headFont }}>Featured Listings</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { addr: "814 Waverly Rd", loc: "Bryn Mawr", price: "$1,450,000", beds: 5, baths: 4, bg: "#e8e2d8" },
              { addr: "221 Merion Ave", loc: "Narberth", price: "$875,000", beds: 4, baths: 3, bg: "#d5ccc0" },
            ].map(p => (
              <div key={p.addr} className="border border-[#eee]">
                <div style={{ height: "55px", background: p.bg }} />
                <div className="p-2">
                  <p className="text-[10px] font-bold text-[#1e3a5f]" style={{ fontFamily: headFont }}>{p.price}</p>
                  <p className="text-[6px] text-[#1e3a5f] font-medium mt-0.5">{p.addr}</p>
                  <p className="text-[5px] text-[#999] mt-0.5">{p.loc} · {p.beds} beds · {p.baths} baths</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="px-4 py-3 bg-[#f8f7f5] border-t border-[#eee]">
          <p className="text-[8px] text-[#1e3a5f] mb-2 italic" style={{ fontFamily: headFont }}>Meet the Team</p>
          <div className="flex gap-2">
            {[
              { n: "Sarah Baruh", t: "Lead Agent" },
              { n: "Michael Chen", t: "Buyer Specialist" },
              { n: "Lisa Park", t: "Listing Agent" },
            ].map(a => (
              <div key={a.n} className="flex-1 text-center">
                <div className="w-8 h-8 mx-auto rounded-full bg-[#d5ccc0]" />
                <p className="text-[6px] font-bold text-[#1e3a5f] mt-1">{a.n}</p>
                <p className="text-[5px] text-[#999]">{a.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#1e3a5f] text-center">
          <p className="text-[5px] text-white/40">Philadelphia · Main Line · Jersey Shore</p>
        </div>
      </div>
    </CardWrapper>
  );
}

/* ─── 6. HAIR & BEAUTY — Didot/Bodoni fashion-editorial serif, blush + charcoal ─── */
function SalonMockup() {
  const headFont = "'Didot', 'Bodoni MT', 'Noto Serif Display', 'Times New Roman', serif";
  const bodyFont = "'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif";
  return (
    <CardWrapper label="Hair &amp; Beauty" cardBg="#f5e1d0">
      <BrowserChrome url="salonchristopher.com" />
      <div className="mockup-pan flex" style={{ fontFamily: bodyFont, width: "175%", height: "270px" }}>

        {/* Left: Brand panel — fashion editorial, Didot serif */}
        <div className="w-[35%] flex-shrink-0 bg-white flex flex-col items-center justify-center text-center px-6 relative">
          <p className="text-[9px] text-[#333] tracking-[0.2em] uppercase" style={{ fontFamily: bodyFont }}>Christopher</p>
          <p className="text-[28px] text-[#333] leading-[0.88] mt-2 tracking-[-0.01em] italic" style={{ fontFamily: headFont }}>
            Where<br/>artistry<br/>meets<br/><span className="not-italic text-[#c9a96e]">confidence.</span>
          </p>
          <div className="mt-5 h-[20px] px-5 flex items-center text-[7px] tracking-[0.12em] uppercase bg-[#333] text-white" style={{ fontFamily: bodyFont }}>
            Book Now
          </div>
        </div>

        {/* Center: Beauty photo */}
        <div className="w-[32%] flex-shrink-0 relative" style={{
          backgroundImage: "url(https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400)",
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }} />

        {/* Right: Services — Didot prices, thin body font */}
        <div className="flex-1 bg-[#faf9f7] flex flex-col justify-center px-6">
          <p className="text-[8px] text-[#333] uppercase tracking-[0.15em] mb-4" style={{ fontFamily: bodyFont }}>Services</p>
          {[
            { s: "Color & Highlights", p: "$165+" },
            { s: "Precision Cut", p: "$75+" },
            { s: "Balayage", p: "$210+" },
            { s: "Bridal", p: "$400+" },
          ].map(svc => (
            <div key={svc.s} className="flex justify-between py-2 border-b border-[#eee]">
              <span className="text-[11px] text-[#333]" style={{ fontFamily: bodyFont }}>{svc.s}</span>
              <span className="text-[12px] italic text-[#c9a96e]" style={{ fontFamily: headFont }}>{svc.p}</span>
            </div>
          ))}
          <p className="text-[6px] text-[#999] mt-3 uppercase tracking-[0.12em]" style={{ fontFamily: bodyFont }}>Sewell, NJ · Tues–Sat</p>
        </div>
      </div>
    </CardWrapper>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative bg-paper text-ink pt-20 pb-28">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        <Reveal>
          <h2
            className="font-display font-medium leading-[1.05] tracking-[-0.03em] text-ink max-w-3xl mb-5"
            style={{ fontSize: 'clamp(32px, 5.5vw, 56px)' }}
          >
            Work I do.
          </h2>
          <p className="text-ink-soft text-[16px] sm:text-[17px] leading-relaxed font-medium max-w-xl mb-12">
            Hover to preview each design. Every site is built from scratch for the specific business.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <Reveal><ApexMockup /></Reveal>
          <Reveal delay={80}><RestaurantMockup /></Reveal>
          <Reveal delay={160}><EcommerceMockup /></Reveal>
          <Reveal delay={240}><PortfolioMockup /></Reveal>
          <Reveal delay={320}><RealEstateMockup /></Reveal>
          <Reveal delay={400}><SalonMockup /></Reveal>
        </div>

        <Reveal delay={500}>
          <div className="mt-10 pt-6 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-ink-muted text-[13px] font-medium">
              Every project starts with a conversation. Tell me what you need.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-clay text-ink font-semibold px-5 py-3 hover:bg-clay-deep transition-colors text-[14px] active:scale-[0.98]"
              style={{ boxShadow: "0 8px 24px -8px rgba(14,165,233,0.35)", minHeight: 44 }}
            >
              Start a project <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
