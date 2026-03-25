"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

type DeliveryData = {
  projectName: string;
  clientName: string;
  driveLink: string;
  credentials: string | null;
  daysLeft: number | null;
  expiresAt: string | null;
  deliveryType: string;
  monthlyRate: number;
};

function LockIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth={2} strokeLinecap="round" />
      <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12" />
    </svg>
  );
}

export default function DeliveryPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DeliveryData | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/delivery/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error); return; }
      setData(json);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!data?.driveLink) return;
    setDownloaded(true);
    window.open(data.driveLink, "_blank");
    await fetch(`/api/delivery/${params.token}`, { method: "PATCH" });
  };

  const annualPrice = data ? (data.monthlyRate * 10).toFixed(0) : "490";
  const annualSavings = data ? (data.monthlyRate * 2).toFixed(0) : "98";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #06091F 0%, #0D1B45 45%, #081229 100%)" }}>
      {/* Nav */}
      <div className="px-6 py-5 flex items-center">
        <a href="/"><Logo light /></a>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        {!data ? (
          /* ── Login screen ── */
          <div className="w-full max-w-md">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 sm:p-10">
              <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-[#60A5FA] mb-6">
                <LockIcon />
              </div>
              <h1 className="text-white font-black text-2xl tracking-tight mb-1">Your site is ready.</h1>
              <p className="text-white/40 text-[14px] mb-8">Enter the password Brian provided to access your delivery.</p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <input
                  type="text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="e.g. pine-4829"
                  className="w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-[#2563EB]/60 focus:ring-1 focus:ring-[#2563EB]/40 text-[15px] tracking-widest font-mono transition"
                  autoFocus
                />
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <p className="text-red-400 text-[13px]">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-[#2563EB] text-white font-bold py-3.5 rounded-xl hover:bg-[#1D4ED8] disabled:opacity-40 transition text-[14px]"
                >
                  {loading ? "Checking…" : "Access My Delivery →"}
                </button>
              </form>

              <p className="text-white/20 text-[12px] text-center mt-6">
                Don&apos;t have a password? Contact{" "}
                <a href="mailto:brianwhirlowbusiness@gmail.com" className="text-white/40 hover:text-white transition underline">
                  Brian
                </a>
              </p>
            </div>
          </div>
        ) : (
          /* ── Delivery content ── */
          <div className="w-full max-w-2xl space-y-5">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[12px] font-semibold tracking-wide">Delivery Ready</span>
              </div>
              <h1 className="text-white font-black text-[clamp(24px,5vw,40px)] tracking-tight">
                {data.projectName}
              </h1>
              {data.clientName && (
                <p className="text-white/40 text-[14px] mt-1">Prepared for {data.clientName}</p>
              )}
            </div>

            {/* Expiry warning */}
            {data.daysLeft !== null && (
              <div className={`flex items-start gap-3 rounded-2xl px-5 py-4 border ${
                data.daysLeft <= 7
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-amber-500/10 border-amber-500/20"
              }`}>
                <span className="text-xl mt-0.5">{data.daysLeft <= 7 ? "🚨" : "⏳"}</span>
                <div>
                  <p className={`font-bold text-[14px] ${data.daysLeft <= 7 ? "text-red-400" : "text-amber-400"}`}>
                    {data.daysLeft === 0 ? "Expires today!" : `${data.daysLeft} day${data.daysLeft !== 1 ? "s" : ""} remaining`}
                  </p>
                  <p className="text-white/40 text-[13px] mt-0.5">
                    Your files are stored until {new Date(data.expiresAt!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. After this date, files are permanently removed from storage. Download and back them up now.
                  </p>
                </div>
              </div>
            )}

            {/* Download card */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
              <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Your Website Files</p>
              <p className="text-white/60 text-[14px] leading-relaxed mb-6">
                Your complete website source code is ready to download from Google Drive. This includes all files needed to deploy your site with any hosting provider.
              </p>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] text-[15px]"
              >
                <DownloadIcon />
                {downloaded ? "Opening Google Drive…" : "Download Website Files"}
              </button>
              {downloaded && (
                <p className="text-green-400/70 text-[12px] text-center mt-3">✓ Download started — save these files somewhere safe.</p>
              )}
            </div>

            {/* Credentials */}
            {data.credentials && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Credentials & Notes</p>
                <pre className="text-white/60 text-[13px] leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-xl p-4">
                  {data.credentials}
                </pre>
              </div>
            )}

            {/* Hosting CTA */}
            <div className="bg-gradient-to-br from-[#1E3A8A]/60 to-[#1D4ED8]/40 border border-[#2563EB]/30 rounded-2xl p-6 sm:p-8">
              <p className="text-[#60A5FA] text-[11px] uppercase tracking-widest font-semibold mb-3">Skip the Hassle</p>
              <h3 className="text-white font-black text-xl mb-2">Let us handle hosting.</h3>
              <p className="text-white/50 text-[14px] leading-relaxed mb-5">
                Don&apos;t want to deal with hosting setup, SSL, or deployments? Stay on our managed plan and we handle everything — including 1 hour of free edits every month.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/[0.06] rounded-xl p-4 text-center border border-white/10">
                  <p className="text-white font-black text-2xl">${data.monthlyRate}</p>
                  <p className="text-white/40 text-[11px] mt-1">per month</p>
                </div>
                <div className="bg-[#2563EB]/20 rounded-xl p-4 text-center border border-[#2563EB]/30 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-[#2563EB] text-white text-[9px] font-black px-2 py-0.5 rounded-full">SAVE ${annualSavings}</div>
                  <p className="text-white font-black text-2xl">${annualPrice}</p>
                  <p className="text-white/40 text-[11px] mt-1">per year (2 months free)</p>
                </div>
              </div>
              <p className="text-white/30 text-[11px] mb-4">Includes: Hosting · SSL · Uptime monitoring · 1hr edits/month</p>
              <a
                href="mailto:brianwhirlowbusiness@gmail.com?subject=Managed Hosting Inquiry"
                className="flex items-center justify-center gap-2 bg-white text-[#1A1A1A] font-bold py-3 rounded-xl hover:bg-white/90 transition text-[14px]"
              >
                Stay on managed hosting →
              </a>
            </div>

            {/* Footer note */}
            <p className="text-white/20 text-[12px] text-center pb-4">
              Questions? Email{" "}
              <a href="mailto:brianwhirlowbusiness@gmail.com" className="text-white/40 hover:text-white transition underline">
                brianwhirlowbusiness@gmail.com
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
