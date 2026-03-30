"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type LeadStatus = "new" | "contacted" | "call_scheduled" | "proposal_sent" | "won" | "lost" | "archived";
type ProjectStatus = "discovery" | "building" | "review" | "launched";

interface Lead {
  id: string;
  name: string;
  email: string;
  website_type: string | null;
  budget: string | null;
  launch_date: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  lead_id: string | null;
  name: string;
  client_name: string | null;
  client_email: string | null;
  agreed_budget: string | null;
  start_date: string | null;
  deadline: string | null;
  status: ProjectStatus;
  site_url: string | null;
  notes: string;
  created_at: string;
  // Delivery fields
  delivery_type: "managed" | "handoff" | null;
  monthly_rate: number | null;
  billing_start: string | null;
  next_billing_date: string | null;
  hosting_status: "active" | "overdue" | "cancelled" | null;
  drive_link: string | null;
  delivery_token: string | null;
  delivery_password: string | null;
  delivery_sent_at: string | null;
  delivery_expires_at: string | null;
  files_downloaded: boolean;
  files_uploaded: boolean;
  page_sent: boolean;
  client_credentials: string | null;
  hosting_requested: boolean;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const LEAD_STATUSES: { key: LeadStatus; label: string; color: string; bg: string }[] = [
  { key: "new",           label: "New",             color: "#60A5FA", bg: "#1E3A5F" },
  { key: "contacted",     label: "Contacted",       color: "#FBBF24", bg: "#3D2E0A" },
  { key: "call_scheduled",label: "Call Scheduled",  color: "#A78BFA", bg: "#2D1F5E" },
  { key: "proposal_sent", label: "Proposal Sent",   color: "#FB923C", bg: "#3D200A" },
  { key: "won",           label: "Won",             color: "#34D399", bg: "#0D3D2A" },
  { key: "lost",          label: "Lost",            color: "#9CA3AF", bg: "#1F2937" },
];

const PROJECT_STATUSES: { key: ProjectStatus; label: string; color: string }[] = [
  { key: "discovery", label: "Discovery",  color: "#60A5FA" },
  { key: "building",  label: "Building",   color: "#A78BFA" },
  { key: "review",    label: "Review",     color: "#FBBF24" },
  { key: "launched",  label: "Launched",   color: "#34D399" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const s = LEAD_STATUSES.find(x => x.key === status)!;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ color: s.color, background: s.bg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

function ProjectBadge({ status }: { status: ProjectStatus }) {
  const s = PROJECT_STATUSES.find(x => x.key === status)!;
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ color: s.color, background: s.color + "22" }}>
      {s.label}
    </span>
  );
}

// ─── Project Card with Delivery ───────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition font-mono">
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function ProjectCard({ p, token, invoices, onStatusChange, onUpdate, onInvoiceCreated }: {
  p: Project; token: string;
  invoices: Invoice[];
  onStatusChange: (id: string, status: ProjectStatus) => void;
  onUpdate: (p: Project) => void;
  onInvoiceCreated: (inv: Invoice) => void;
}) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const projectInvoices = invoices.filter(i => i.project_id === p.id);
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const invoiceTotal = (inv: Invoice) => inv.line_items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const [driveLink, setDriveLink] = useState(p.drive_link || "");
  const [credentials, setCredentials] = useState(p.client_credentials || "");
  const [monthlyRate, setMonthlyRate] = useState(p.monthly_rate || 49);
  const [billingStart, setBillingStart] = useState(p.billing_start || "");

  const deliveryUrl = p.delivery_token ? `${typeof window !== "undefined" ? window.location.origin : ""}/delivery/${p.delivery_token}` : null;
  const daysLeft = p.delivery_expires_at
    ? Math.max(0, Math.ceil((new Date(p.delivery_expires_at).getTime() - Date.now()) / 86400000))
    : null;

  const generateDelivery = async () => {
    setGenerating(true);
    const res = await fetch(`/api/admin/projects/${p.id}/delivery`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ driveLink, credentials }),
    });
    if (res.ok) {
      const data = await res.json();
      onUpdate({ ...p, delivery_token: data.token, delivery_password: data.password, delivery_expires_at: data.expiresAt, drive_link: driveLink, client_credentials: credentials, page_sent: true, files_uploaded: !!driveLink });
    }
    setGenerating(false);
  };

  const saveHosting = async () => {
    const nextBilling = billingStart ? new Date(new Date(billingStart).setMonth(new Date(billingStart).getMonth() + 1)).toISOString().split("T")[0] : null;
    const res = await fetch(`/api/admin/projects/${p.id}/delivery`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ delivery_type: "managed", monthly_rate: monthlyRate, billing_start: billingStart || null, next_billing_date: nextBilling }),
    });
    if (res.ok) onUpdate({ ...p, delivery_type: "managed", monthly_rate: monthlyRate, billing_start: billingStart, next_billing_date: nextBilling });
  };

  const setHandoff = async () => {
    const res = await fetch(`/api/admin/projects/${p.id}/delivery`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ delivery_type: "handoff" }),
    });
    if (res.ok) onUpdate({ ...p, delivery_type: "handoff" });
  };

  const toggleCheck = async (field: string, val: boolean) => {
    const res = await fetch(`/api/admin/projects/${p.id}/delivery`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: val }),
    });
    if (res.ok) onUpdate({ ...p, [field]: val } as Project);
  };

  return (
    <div className={`bg-[#1A1D27] rounded-2xl overflow-hidden ${p.hosting_requested ? "border-2 border-amber-400/60" : "border border-[#2A2D3A]"}`}>
      {/* Hosting request banner */}
      {p.hosting_requested && (
        <div className="bg-amber-400/10 border-b border-amber-400/30 px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🔔</span>
            <div>
              <p className="text-amber-300 font-bold text-[13px]">Client requested managed hosting</p>
              <p className="text-amber-300/60 text-[12px]">{p.client_name || p.client_email} opted in — reach out to confirm billing details.</p>
            </div>
          </div>
          <button
            onClick={() => toggleCheck("hosting_requested", false)}
            className="text-amber-300/50 hover:text-amber-300 text-[11px] font-semibold uppercase tracking-widest transition flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Row */}
      <div className="p-5">
        {/* Top: name + delivery button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-white font-bold text-[15px] truncate">{p.name}</p>
              <ProjectBadge status={p.status} />
              {p.delivery_type === "managed" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400">HOSTED</span>
              )}
              {p.delivery_type === "handoff" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/30">HANDED OFF</span>
              )}
            </div>
            <p className="text-white/40 text-[13px] truncate">{p.client_email}</p>
            {/* Budget / MRR / Expiry — shown inline on mobile */}
            <div className="flex flex-wrap gap-4 mt-2">
              {p.agreed_budget && (
                <div>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">Budget</p>
                  <p className="text-white text-[13px] font-semibold">{p.agreed_budget}</p>
                </div>
              )}
              {p.delivery_type === "managed" && p.monthly_rate && (
                <div>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">MRR</p>
                  <p className="text-green-400 text-[13px] font-semibold">${p.monthly_rate}/mo</p>
                </div>
              )}
              {daysLeft !== null && p.delivery_type === "handoff" && (
                <div>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">Expires</p>
                  <p className={`text-[13px] font-semibold ${daysLeft <= 7 ? "text-red-400" : "text-amber-400"}`}>{daysLeft}d left</p>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => setOpen(o => !o)}
            className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition">
            {open ? "▲ Close" : "📦 Delivery"}
          </button>
        </div>

        {/* Status stepper — full width, labels always visible */}
        <div className="flex items-center gap-0">
          {PROJECT_STATUSES.map((s, i) => {
            const isActive = p.status === s.key;
            const isPast = PROJECT_STATUSES.findIndex(x => x.key === p.status) > i;
            return (
              <div key={s.key} className="flex items-center flex-1">
                <button
                  onClick={() => onStatusChange(p.id, s.key)}
                  className="flex flex-col items-center gap-1 flex-1 group"
                  title={s.label}
                >
                  <div
                    className="w-7 h-7 rounded-full border-2 transition-all group-hover:scale-110 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: s.color,
                      background: isActive ? s.color : isPast ? `${s.color}30` : "transparent",
                    }}
                  >
                    {(isActive || isPast) && (
                      <svg width="10" height="10" fill="none" stroke={isActive ? "#fff" : s.color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[10px] font-semibold leading-tight text-center"
                    style={{ color: isActive ? s.color : isPast ? `${s.color}80` : "rgba(255,255,255,0.25)" }}
                  >
                    {s.label}
                  </span>
                </button>
                {i < PROJECT_STATUSES.length - 1 && (
                  <div
                    className="h-[2px] flex-1 mx-1 rounded-full transition-all"
                    style={{ background: isPast ? `${PROJECT_STATUSES[i].color}50` : "rgba(255,255,255,0.08)" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery panel */}
      {open && (
        <div className="border-t border-[#2A2D3A] p-5 space-y-5">

          {/* Type toggle */}
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-3">Delivery Type</p>
            <div className="flex gap-2">
              <button onClick={setHandoff}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition border ${p.delivery_type === "handoff" ? "bg-white/10 border-white/30 text-white" : "border-[#2A2D3A] text-white/30 hover:text-white"}`}>
                📁 File Handoff
              </button>
              <button onClick={() => onUpdate({ ...p, delivery_type: "managed" })}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition border ${p.delivery_type === "managed" ? "bg-green-500/15 border-green-500/30 text-green-400" : "border-[#2A2D3A] text-white/30 hover:text-white"}`}>
                🌐 Managed Hosting
              </button>
            </div>
          </div>

          {/* Handoff section */}
          {p.delivery_type !== "managed" && (
            <div className="space-y-4">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-2">Google Drive Link</p>
                <input value={driveLink} onChange={e => setDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-[#2563EB]/50 transition" />
              </div>
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-2">Client Credentials / Notes</p>
                <textarea value={credentials} onChange={e => setCredentials(e.target.value)} rows={3}
                  placeholder="Hosting provider, login details, domain info..."
                  className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-[#2563EB]/50 transition resize-none font-mono" />
              </div>

              {p.delivery_token ? (
                <div className="bg-[#0F1117] border border-[#2A2D3A] rounded-xl p-4 space-y-3">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">Delivery Credentials — Send These to Client</p>
                  <div className="flex items-center justify-between gap-3 bg-black/20 rounded-lg px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-white/30 text-[10px] mb-0.5">Delivery URL</p>
                      <p className="text-[#60A5FA] text-[12px] font-mono truncate">{deliveryUrl}</p>
                    </div>
                    <CopyButton value={deliveryUrl || ""} />
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-black/20 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-white/30 text-[10px] mb-0.5">Password</p>
                      <p className="text-white font-mono text-[15px] font-bold tracking-widest">{p.delivery_password}</p>
                    </div>
                    <CopyButton value={p.delivery_password || ""} />
                  </div>
                  {daysLeft !== null && (
                    <p className={`text-[11px] ${daysLeft <= 7 ? "text-red-400" : "text-amber-400/70"}`}>
                      ⏳ Files expire in {daysLeft} day{daysLeft !== 1 ? "s" : ""} — {new Date(p.delivery_expires_at!).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    </p>
                  )}
                </div>
              ) : (
                <button onClick={generateDelivery} disabled={generating}
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[13px] transition disabled:opacity-50">
                  {generating ? "Generating…" : "🔑 Generate Delivery Page + Password"}
                </button>
              )}

              {/* Checklist */}
              {p.delivery_token && (
                <div className="space-y-2">
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">Handoff Checklist</p>
                  {[
                    { label: "Files uploaded to Drive", field: "files_uploaded", checked: p.files_uploaded },
                    { label: "Delivery page sent to client", field: "page_sent", checked: p.page_sent },
                    { label: "Client downloaded files", field: "files_downloaded", checked: p.files_downloaded },
                  ].map(item => (
                    <label key={item.field} className="flex items-center gap-3 cursor-pointer group">
                      <button onClick={() => toggleCheck(item.field, !item.checked)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition flex-shrink-0 ${item.checked ? "bg-green-500 border-green-500" : "border-[#3A3D4A] group-hover:border-white/30"}`}>
                        {item.checked && <svg width="10" height="10" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                      </button>
                      <span className={`text-[13px] ${item.checked ? "text-white/50 line-through" : "text-white/70"}`}>{item.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Managed hosting section */}
          {p.delivery_type === "managed" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-2">Monthly Rate ($)</p>
                  <input type="number" value={monthlyRate} onChange={e => setMonthlyRate(Number(e.target.value))}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-2">Billing Start</p>
                  <input type="date" value={billingStart} onChange={e => setBillingStart(e.target.value)}
                    className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
                </div>
              </div>
              {p.next_billing_date && (
                <p className="text-green-400/60 text-[12px]">Next billing: {new Date(p.next_billing_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              )}
              <div className="flex gap-3">
                <button onClick={saveHosting} className="flex-1 py-2.5 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 font-bold text-[13px] transition border border-green-500/20">
                  Save Hosting Plan
                </button>
                <div className="bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-center">
                  <p className="text-white/20 text-[10px]">Annual</p>
                  <p className="text-white font-bold text-[13px]">${(monthlyRate * 10).toFixed(0)}/yr</p>
                </div>
              </div>
            </div>
          )}
          {/* Invoices section */}
          <div className="border-t border-[#2A2D3A] pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">Invoices</p>
              <button onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-1.5 text-[#60A5FA] text-[12px] font-semibold hover:text-white transition">
                + Generate Invoice
              </button>
            </div>
            {projectInvoices.length === 0 ? (
              <p className="text-white/20 text-[12px]">No invoices yet for this project.</p>
            ) : (
              <div className="space-y-2">
                {projectInvoices.map(inv => {
                  const statusColor = inv.status === "paid" ? "text-green-400" : inv.status === "sent" ? "text-blue-400" : "text-white/30";
                  return (
                    <div key={inv.id} className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-2.5">
                      <div>
                        <p className="text-white text-[13px] font-semibold">{inv.invoice_number}</p>
                        <p className={`text-[11px] uppercase tracking-widest font-bold ${statusColor}`}>{inv.status}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-white font-bold text-[14px]">{fmt(invoiceTotal(inv))}</p>
                        <a href={`/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#60A5FA] hover:text-white transition px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10">
                          View →
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {showInvoiceModal && (
        <NewInvoiceModal
          token={token}
          prefill={{ client_name: p.client_name || "", client_email: p.client_email || "", project_name: p.name, project_id: p.id }}
          onClose={() => setShowInvoiceModal(false)}
          onCreated={inv => { onInvoiceCreated(inv); setShowInvoiceModal(false); }}
        />
      )}
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("admin_token", token);
      onLogin(token);
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0D14" }}>
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="text-white font-black text-2xl">byBrian Admin</h1>
          <p className="text-white/40 text-sm mt-1">Enter your password to continue</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            placeholder="Admin password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-[#2563EB] text-[15px]"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#2563EB] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1D4ED8] transition disabled:opacity-50 text-[15px]">
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Lead Detail Panel ────────────────────────────────────────────────────────

function LeadPanel({
  lead, token, onClose, onUpdate, onConvert,
}: {
  lead: Lead;
  token: string;
  onClose: () => void;
  onUpdate: (updated: Lead) => void;
  onConvert: (lead: Lead) => void;
}) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, notes }),
    });
    setSaving(false);
    if (res.ok) onUpdate(await res.json());
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-[#0F1117] border-l border-[#2A2D3A] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2D3A]">
          <div>
            <h2 className="text-white font-black text-lg">{lead.name}</h2>
            <a href={`mailto:${lead.email}`} className="text-[#60A5FA] text-sm hover:underline">{lead.email}</a>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition p-1">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Budget", value: lead.budget },
              { label: "Website Type", value: lead.website_type },
              { label: "Launch Date", value: lead.launch_date },
              { label: "Submitted", value: timeAgo(lead.created_at) },
            ].map(({ label, value }) => value ? (
              <div key={label} className="bg-[#1A1D27] rounded-xl p-3">
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">{label}</p>
                <p className="text-white text-[13px] font-medium">{value}</p>
              </div>
            ) : null)}
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-2">Message</p>
              <div className="bg-[#1A1D27] rounded-xl p-4 text-white/70 text-[14px] leading-relaxed whitespace-pre-wrap">
                {lead.message}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-2">Pipeline Status</p>
            <div className="grid grid-cols-2 gap-2">
              {LEAD_STATUSES.map(s => (
                <button key={s.key} onClick={() => setStatus(s.key)}
                  className="px-3 py-2.5 rounded-xl text-[12px] font-semibold text-left transition border"
                  style={{
                    color: s.color,
                    background: status === s.key ? s.bg : "transparent",
                    borderColor: status === s.key ? s.color + "55" : "#2A2D3A",
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Add notes about this lead…"
              className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-3 text-white/80 text-[14px] placeholder-white/20 focus:outline-none focus:border-[#2563EB] resize-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#2A2D3A] space-y-3">
          <div className="flex gap-3">
            <button onClick={save} disabled={saving}
              className="flex-1 bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-[#1D4ED8] transition disabled:opacity-50 text-[14px]">
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {lead.status === "won" && (
              <button onClick={() => onConvert(lead)}
                className="flex-1 bg-[#0D3D2A] text-[#34D399] font-semibold py-3 rounded-xl hover:bg-[#10B98133] transition text-[14px] border border-[#34D39933]">
                Convert to Project
              </button>
            )}
          </div>
          {lead.status !== "archived" ? (
            <button onClick={async () => {
              setStatus("archived");
              setSaving(true);
              const res = await fetch(`/api/admin/leads/${lead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: "archived", notes }),
              });
              setSaving(false);
              if (res.ok) { onUpdate(await res.json()); onClose(); }
            }} disabled={saving}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white/30 hover:text-white/60 border border-[#2A2D3A] hover:border-white/20 transition">
              Archive Lead
            </button>
          ) : (
            <button onClick={async () => {
              setStatus("new");
              setSaving(true);
              const res = await fetch(`/api/admin/leads/${lead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: "new", notes }),
              });
              setSaving(false);
              if (res.ok) { onUpdate(await res.json()); onClose(); }
            }} disabled={saving}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-[#60A5FA] border border-[#60A5FA]/20 hover:bg-[#60A5FA]/10 transition">
              Restore to Pipeline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── New Project Modal ────────────────────────────────────────────────────────

function NewProjectModal({
  lead, token, onClose, onCreated,
}: {
  lead: Lead | null;
  token: string;
  onClose: () => void;
  onCreated: (p: Project) => void;
}) {
  const [form, setForm] = useState({
    name: lead ? `${lead.name}'s Website` : "",
    agreed_budget: lead?.budget || "",
    deadline: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        lead_id: lead?.id || null,
        name: form.name,
        client_name: lead?.name || "",
        client_email: lead?.email || "",
        agreed_budget: form.agreed_budget,
        deadline: form.deadline || null,
        notes: form.notes,
      }),
    });
    setSaving(false);
    if (res.ok) onCreated(await res.json());
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-2">{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-3 text-white text-[14px] placeholder-white/20 focus:outline-none focus:border-[#2563EB]"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0F1117] border border-[#2A2D3A] rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-white font-black text-lg mb-6">New Project</h2>
        <form onSubmit={submit} className="space-y-4">
          {field("Project Name", "name", "text", "Client's Website")}
          {field("Agreed Budget", "agreed_budget", "text", "$1,500")}
          {field("Deadline", "deadline", "date")}
          <div>
            <label className="block text-white/40 text-[11px] uppercase tracking-widest font-semibold mb-2">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
              className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-3 text-white text-[14px] placeholder-white/20 focus:outline-none focus:border-[#2563EB] resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-[#2A2D3A] text-white/50 font-semibold py-3 rounded-xl hover:text-white hover:border-white/20 transition text-[14px]">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-[#1D4ED8] transition disabled:opacity-50 text-[14px]">
              {saving ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tab, setTab] = useState<"pipeline" | "projects" | "playbook" | "budget" | "expenses" | "templates" | "discovery" | "calendar" | "marketing" | "emails">("pipeline");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectLead, setNewProjectLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [pipelineView, setPipelineView] = useState<"kanban" | "archive">("kanban");

  // Check for saved token on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchData = useCallback(async (t: string) => {
    setLoading(true);
    const [leadsRes, projRes, invRes] = await Promise.all([
      fetch("/api/admin/leads", { headers: { Authorization: `Bearer ${t}` } }),
      fetch("/api/admin/projects", { headers: { Authorization: `Bearer ${t}` } }),
      fetch("/api/admin/invoices", { headers: { Authorization: `Bearer ${t}` } }),
    ]);
    if (leadsRes.status === 401) { localStorage.removeItem("admin_token"); setToken(null); return; }
    try {
      const leadsData = await leadsRes.json();
      const projData = await projRes.json();
      const invData = await invRes.json();
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setProjects(Array.isArray(projData) ? projData : []);
      setInvoices(Array.isArray(invData) ? invData : []);
      if (!Array.isArray(leadsData)) setFetchError("DB tables not set up yet — run supabase/schema.sql in your Supabase SQL editor.");
    } catch {
      setFetchError("Failed to load data. Check your Supabase connection.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) fetchData(token);
  }, [token, fetchData]);

  if (!token) return <LoginScreen onLogin={setToken} />;

  const activeLeads = leads.filter(l => l.status !== "archived");
  const archivedLeads = leads.filter(l => l.status === "archived");
  const newCount = leads.filter(l => l.status === "new").length;
  const activeProjects = projects.filter(p => p.status !== "launched").length;
  const wonCount = leads.filter(l => l.status === "won").length;

  return (
    <div className="min-h-screen" style={{ background: "#0A0D14", color: "white" }}>
      {/* Top bar */}
      <div className="border-b border-[#2A2D3A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-[13px] font-black">B</div>
          <div>
            <p className="text-white font-bold text-[15px] leading-none">byBrian Admin</p>
            <p className="text-white/30 text-[11px] mt-0.5">CRM Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => fetchData(token)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white text-[13px] transition">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>
          <a href="https://builtbybwhirl.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/30 hover:text-white text-[13px] transition">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            <span className="hidden sm:inline">View Site</span>
          </a>
          <button onClick={() => { localStorage.removeItem("admin_token"); setToken(null); }}
            className="flex items-center gap-1.5 text-white/30 hover:text-red-400 text-[13px] transition">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* DB error banner */}
        {fetchError && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-4 text-yellow-300 text-[13px]">
            ⚠️ {fetchError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "New Leads", value: newCount, icon: "🔵", note: "Need response" },
            { label: "Total Leads", value: leads.length, icon: "📋", note: "All time" },
            { label: "Deals Won", value: wonCount, icon: "✅", note: "Converted" },
            { label: "Active Projects", value: activeProjects, icon: "⚡", note: "In progress" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#1A1D27] rounded-2xl p-5 border border-[#2A2D3A]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-white/20 text-[11px] uppercase tracking-widest">{stat.note}</span>
              </div>
              <p className="text-white font-black text-3xl leading-none">{loading ? "—" : stat.value}</p>
              <p className="text-white/40 text-[13px] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-[#1A1D27] rounded-xl p-1 w-fit border border-[#2A2D3A]">
          {(["pipeline", "projects", "calendar", "playbook", "budget", "expenses", "templates", "discovery", "marketing", "emails"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition ${
                tab === t ? "bg-[#2563EB] text-white" : "text-white/40 hover:text-white"
              }`}>
              {t === "pipeline" ? `Pipeline (${activeLeads.length})` : t === "projects" ? `Projects (${projects.length})` : t === "calendar" ? "📅 Calendar" : t === "playbook" ? "📋 Playbook" : t === "budget" ? "💰 Budget Tiers" : t === "expenses" ? "🧾 Expenses" : t === "templates" ? "🗂️ Templates" : t === "discovery" ? "📞 Discovery Call" : t === "marketing" ? "📣 Marketing" : "📧 Emails"}
            </button>
          ))}
        </div>

        {/* Pipeline view */}
        {tab === "pipeline" && (
          <div>
            {/* Kanban / Archive toggle header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-1 bg-[#1A1D27] rounded-lg p-1 border border-[#2A2D3A]">
                <button onClick={() => setPipelineView("kanban")}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition ${pipelineView === "kanban" ? "bg-[#2563EB] text-white" : "text-white/40 hover:text-white"}`}>
                  Pipeline
                </button>
                <button onClick={() => setPipelineView("archive")}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition flex items-center gap-1.5 ${pipelineView === "archive" ? "bg-[#2563EB] text-white" : "text-white/40 hover:text-white"}`}>
                  🗃️ Archive
                  {archivedLeads.length > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${pipelineView === "archive" ? "bg-white/20" : "bg-white/10"}`}>{archivedLeads.length}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Kanban view */}
            {pipelineView === "kanban" && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {LEAD_STATUSES.map(s => {
                  const colLeads = activeLeads.filter(l => l.status === s.key);
                  return (
                    <div key={s.key} className="bg-[#1A1D27] rounded-2xl p-4 border border-[#2A2D3A] min-h-[200px]">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.label}</p>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color }}>
                          {colLeads.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {colLeads.map(lead => (
                          <button key={lead.id} onClick={() => setSelectedLead(lead)}
                            className="w-full text-left bg-[#0F1117] hover:bg-[#16191F] border border-[#2A2D3A] hover:border-[#3A3D4A] rounded-xl p-3 transition">
                            <p className="text-white text-[13px] font-semibold leading-tight truncate">{lead.name}</p>
                            {lead.budget && <p className="text-white/40 text-[11px] mt-1 truncate">{lead.budget}</p>}
                            <p className="text-white/20 text-[10px] mt-1.5">{timeAgo(lead.created_at)}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Archive view */}
            {pipelineView === "archive" && (
              <div>
                <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5 mb-4">
                  <p className="text-white font-black text-[15px] mb-1">🗃️ Archived Leads</p>
                  <p className="text-white/35 text-[13px]">These leads are removed from your pipeline but never deleted. Click any lead to restore it.</p>
                </div>
                {archivedLeads.length === 0 ? (
                  <div className="text-center py-16 text-white/20 text-[14px]">No archived leads yet.</div>
                ) : (
                  <div className="space-y-2">
                    {archivedLeads.map(lead => (
                      <button key={lead.id} onClick={() => setSelectedLead(lead)}
                        className="w-full text-left bg-[#1A1D27] hover:bg-[#1F2230] border border-[#2A2D3A] hover:border-[#3A3D4A] rounded-xl p-4 transition flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-white/70 text-[14px] font-semibold truncate">{lead.name}</p>
                          <p className="text-white/30 text-[12px] mt-0.5">{lead.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {lead.budget && <p className="text-white/40 text-[12px]">{lead.budget}</p>}
                          <p className="text-white/20 text-[11px] mt-0.5">{timeAgo(lead.created_at)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Playbook view */}
        {tab === "playbook" && <Playbook />}

        {/* Budget Tiers view */}
        {tab === "budget" && <BudgetTiers />}

        {/* Expenses view */}
        {tab === "expenses" && <Expenses />}

        {/* Calendar view */}
        {tab === "calendar" && <CalendarView leads={leads} token={token} onLeadUpdate={(updated) => setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))} />}

        {/* Templates view */}
        {tab === "templates" && <SiteTemplates />}

        {/* Discovery Call view */}
        {tab === "discovery" && <DiscoveryCall />}

        {/* Marketing view */}
        {tab === "marketing" && <Marketing />}

        {/* Email Templates view */}
        {tab === "emails" && <EmailTemplates token={token} />}

        {/* Projects view */}
        {tab === "projects" && (
          <div>
            {/* Hosting overview strip */}
            {projects.length > 0 && (() => {
              const managed = projects.filter(p => p.delivery_type === "managed" && p.hosting_status === "active");
              const mrr = managed.reduce((sum, p) => sum + (p.monthly_rate || 49), 0);
              const expiring = projects.filter(p => {
                if (!p.delivery_expires_at) return false;
                const days = Math.ceil((new Date(p.delivery_expires_at).getTime() - Date.now()) / 86400000);
                return days >= 0 && days <= 7;
              });
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Managed Clients", value: managed.length, color: "#34D399" },
                    { label: "Monthly Recurring", value: `$${mrr}/mo`, color: "#60A5FA" },
                    { label: "Annual Value", value: `$${mrr * 12}/yr`, color: "#A78BFA" },
                    { label: "Expiring Soon", value: expiring.length, color: expiring.length > 0 ? "#FB923C" : "#9CA3AF" },
                  ].map(s => (
                    <div key={s.label} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-4">
                      <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">{s.label}</p>
                      <p className="font-black text-xl" style={{ color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="flex items-center justify-between mb-4">
              <p className="text-white/40 text-[13px]">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
              <button onClick={() => { setNewProjectLead(null); setShowNewProject(true); }}
                className="flex items-center gap-2 bg-[#2563EB] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1D4ED8] transition">
                + New Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-12 text-center">
                <p className="text-white/20 text-[15px]">No projects yet.</p>
                <p className="text-white/10 text-[13px] mt-1">Mark a lead as Won to convert it to a project.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(p => (
                  <ProjectCard key={p.id} p={p} token={token} invoices={invoices}
                    onInvoiceCreated={inv => setInvoices(ivs => [inv, ...ivs])}
                    onStatusChange={async (id, status) => {
                      const res = await fetch(`/api/admin/projects/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ status }),
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setProjects(ps => ps.map(x => x.id === id ? { ...x, ...updated } : x));
                      }
                    }}
                    onUpdate={updated => setProjects(ps => ps.map(x => x.id === updated.id ? updated : x))}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lead detail panel */}
      {selectedLead && (
        <LeadPanel
          lead={selectedLead}
          token={token}
          onClose={() => setSelectedLead(null)}
          onUpdate={updated => {
            setLeads(ls => ls.map(l => l.id === updated.id ? updated : l));
            setSelectedLead(updated);
          }}
          onConvert={lead => { setNewProjectLead(lead); setShowNewProject(true); setSelectedLead(null); }}
        />
      )}

      {/* New project modal */}
      {showNewProject && (
        <NewProjectModal
          lead={newProjectLead}
          token={token}
          onClose={() => setShowNewProject(false)}
          onCreated={p => {
            setProjects(ps => [p, ...ps]);
            setShowNewProject(false);
          }}
        />
      )}

    </div>
  );
}

// ─── Invoice Types ─────────────────────────────────────────────────────────────

type InvoiceStatus = "draft" | "sent" | "paid";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  project_name: string;
  line_items: LineItem[];
  notes: string;
  payment_instructions: string;
  due_date: string | null;
  status: InvoiceStatus;
  created_at: string;
  paid_at: string | null;
  project_id: string | null;
}

// ─── Invoices Tab ──────────────────────────────────────────────────────────────

function InvoicesTab({ invoices, token, onUpdate, onDelete, onNew }: {
  invoices: Invoice[];
  token: string;
  onUpdate: (inv: Invoice) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const total = (inv: Invoice) => inv.line_items.reduce((s, i) => s + i.quantity * i.rate, 0);

  const unpaidTotal = invoices
    .filter(i => i.status !== "paid")
    .reduce((s, i) => s + total(i), 0);

  const markPaid = async (inv: Invoice) => {
    const res = await fetch(`/api/admin/invoices/${inv.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "paid" }),
    });
    if (res.ok) onUpdate({ ...inv, status: "paid", paid_at: new Date().toISOString() });
  };

  const sendInvoice = async (inv: Invoice) => {
    const res = await fetch(`/api/admin/invoices/${inv.id}/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) onUpdate({ ...inv, status: "sent" });
    else alert("Failed to send invoice. Check your email config.");
  };

  const deleteInvoice = async (inv: Invoice) => {
    if (!window.confirm(`Delete ${inv.invoice_number}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/invoices/${inv.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) onDelete(inv.id);
  };

  const statusBadge = (s: InvoiceStatus) => {
    if (s === "paid") return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/15 text-green-400">PAID</span>;
    if (s === "sent") return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400">SENT</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-white/30">DRAFT</span>;
  };

  return (
    <div>
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Invoices", value: invoices.length, color: "#60A5FA" },
          { label: "Outstanding", value: fmt(unpaidTotal), color: "#FB923C" },
          { label: "Paid", value: invoices.filter(i => i.status === "paid").length, color: "#34D399" },
        ].map(s => (
          <div key={s.label} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-4">
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-1">{s.label}</p>
            <p className="font-black text-xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-white/40 text-[13px]">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}</p>
        <button onClick={onNew}
          className="flex items-center gap-2 bg-[#2563EB] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1D4ED8] transition">
          + New Invoice
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-12 text-center">
          <p className="text-white/20 text-[15px]">No invoices yet.</p>
          <p className="text-white/10 text-[13px] mt-1">Create your first invoice to send to a client.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <p className="text-white font-bold text-[15px]">{inv.invoice_number}</p>
                    {statusBadge(inv.status)}
                  </div>
                  <p className="text-white/50 text-[13px] truncate">{inv.client_name} · {inv.project_name}</p>
                  {inv.due_date && (
                    <p className="text-white/25 text-[11px] mt-0.5">
                      Due {new Date(inv.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-black text-xl">{fmt(total(inv))}</p>
                  {inv.paid_at && <p className="text-green-400/60 text-[11px] mt-0.5">Paid {new Date(inv.paid_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={`/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition" title="View invoice">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {inv.status !== "paid" && (
                    <button onClick={() => sendInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB]/20 hover:bg-[#2563EB]/40 text-[#60A5FA] text-[12px] font-semibold transition">
                      {inv.status === "sent" ? "Resend" : "Send"}
                    </button>
                  )}
                  {inv.status === "sent" && (
                    <button onClick={() => markPaid(inv)}
                      className="px-3 py-1.5 rounded-lg bg-green-500/15 hover:bg-green-500/25 text-green-400 text-[12px] font-semibold transition">
                      Mark Paid
                    </button>
                  )}
                  <button onClick={() => deleteInvoice(inv)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-400 transition">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── New Invoice Modal ─────────────────────────────────────────────────────────

const DEFAULT_PAYMENT = `Zelle: \nVenmo: \nPayPal: `;

function NewInvoiceModal({ token, prefill, onClose, onCreated }: {
  token: string;
  prefill?: { client_name: string; client_email: string; project_name: string; project_id: string };
  onClose: () => void;
  onCreated: (inv: Invoice) => void;
}) {
  const [form, setForm] = useState({
    client_name: prefill?.client_name || "",
    client_email: prefill?.client_email || "",
    project_name: prefill?.project_name || "",
    due_date: "", notes: "",
    payment_instructions: DEFAULT_PAYMENT,
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: "", quantity: 1, rate: 0 }]);
  const [saving, setSaving] = useState(false);

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const subtotal = lineItems.reduce((s, i) => s + i.quantity * i.rate, 0);

  const updateItem = (i: number, field: keyof LineItem, value: string | number) => {
    setLineItems(items => items.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const handleSave = async (andSend = false) => {
    setSaving(true);
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, line_items: lineItems, project_id: prefill?.project_id || null }),
    });
    if (!res.ok) { setSaving(false); return; }
    const inv = await res.json();
    if (andSend) {
      await fetch(`/api/admin/invoices/${inv.id}/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      inv.status = "sent";
    }
    onCreated(inv);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="bg-[#0F1117] border border-[#2A2D3A] rounded-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2D3A]">
          <p className="text-white font-bold text-[16px]">New Invoice</p>
          <button onClick={onClose} className="text-white/30 hover:text-white transition text-xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Client info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/30 text-[11px] uppercase tracking-widest font-semibold block mb-1.5">Client Name</label>
              <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
            <div>
              <label className="text-white/30 text-[11px] uppercase tracking-widest font-semibold block mb-1.5">Client Email</label>
              <input type="email" value={form.client_email} onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))}
                className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/30 text-[11px] uppercase tracking-widest font-semibold block mb-1.5">Project Name</label>
              <input value={form.project_name} onChange={e => setForm(f => ({ ...f, project_name: e.target.value }))}
                className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
            <div>
              <label className="text-white/30 text-[11px] uppercase tracking-widest font-semibold block mb-1.5">Due Date</label>
              <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
          </div>

          {/* Line items */}
          <div>
            <label className="text-white/30 text-[11px] uppercase tracking-widest font-semibold block mb-2">Line Items</label>
            <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[1fr_64px_96px_96px_32px] gap-0 px-4 py-2 border-b border-[#2A2D3A]">
                {["Description", "Qty", "Rate", "Amount", ""].map(h => (
                  <p key={h} className="text-white/20 text-[10px] uppercase tracking-widest font-semibold">{h}</p>
                ))}
              </div>
              {lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_64px_96px_96px_32px] gap-0 px-4 py-2.5 border-b border-[#2A2D3A] last:border-0 items-center">
                  <input value={item.description} onChange={e => updateItem(i, "description", e.target.value)}
                    placeholder="Description"
                    className="bg-transparent text-white text-[13px] focus:outline-none pr-3 placeholder-white/20" />
                  <input type="number" min="1" value={item.quantity} onChange={e => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                    className="bg-transparent text-white text-[13px] focus:outline-none w-full text-center" />
                  <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(i, "rate", parseFloat(e.target.value) || 0)}
                    className="bg-transparent text-white text-[13px] focus:outline-none w-full text-right pr-2" />
                  <p className="text-white/60 text-[13px] text-right">{fmt(item.quantity * item.rate)}</p>
                  <button onClick={() => setLineItems(items => items.filter((_, idx) => idx !== i))}
                    className="text-white/20 hover:text-red-400 transition text-center" disabled={lineItems.length === 1}>×</button>
                </div>
              ))}
              <div className="px-4 py-3 flex items-center justify-between border-t border-[#2A2D3A]">
                <button onClick={() => setLineItems(items => [...items, { description: "", quantity: 1, rate: 0 }])}
                  className="text-[#60A5FA] text-[12px] font-semibold hover:text-white transition">+ Add item</button>
                <p className="text-white font-black text-[15px]">Total: {fmt(subtotal)}</p>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          <div>
            <label className="text-white/30 text-[11px] uppercase tracking-widest font-semibold block mb-1.5">Payment Instructions</label>
            <textarea rows={3} value={form.payment_instructions} onChange={e => setForm(f => ({ ...f, payment_instructions: e.target.value }))}
              className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition resize-none font-mono" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-white/30 text-[11px] uppercase tracking-widest font-semibold block mb-1.5">Notes (optional)</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Payment terms, thank you note, etc."
              className="w-full bg-[#1A1D27] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-[#2563EB]/50 transition resize-none" />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-[#2A2D3A] text-white/50 font-semibold py-3 rounded-xl hover:text-white hover:border-white/20 transition text-[14px]">
            Cancel
          </button>
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex-1 border border-[#2563EB]/40 text-[#60A5FA] font-semibold py-3 rounded-xl hover:bg-[#2563EB]/10 transition disabled:opacity-50 text-[14px]">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex-1 bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-[#1D4ED8] transition disabled:opacity-50 text-[14px]">
            {saving ? "Sending…" : "Send to Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Playbook ──────────────────────────────────────────────────────────────────

const PHASES = [
  {
    number: "01",
    title: "Lead Comes In",
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
    icon: "📥",
    summary: "A potential client submits the contact form on the website.",
    steps: [
      { label: "Contact form submitted", detail: "Client fills out name, email, project type, budget, and message via the website contact form." },
      { label: "Lead saved to pipeline", detail: "Automatically stored in the database and appears as a 'New' lead in the Pipeline tab." },
      { label: "Email notification sent", detail: "You receive an immediate email notification so you can follow up fast." },
    ],
    tools: ["Contact Form", "Pipeline Tab", "Email Alert"],
    rule: "Respond within 24 hours. Speed signals professionalism.",
  },
  {
    number: "02",
    title: "Qualification & Discovery",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    icon: "🔍",
    summary: "Determine if this is a good fit, understand the project, and scope the work.",
    steps: [
      { label: "Move lead to 'Contacted'", detail: "Update the lead status in the pipeline to track your follow-up progress." },
      { label: "Discovery call or email exchange", detail: "Learn what they need: type of site, number of pages, features, timeline, and budget. Ask about their business goals." },
      { label: "Assess fit", detail: "Is the budget realistic? Is the scope clear? Do you have the skills? If not a fit, mark as Lost and move on." },
      { label: "Move lead to 'Proposal Sent'", detail: "Once you've agreed on scope verbally, send a written proposal by email outlining deliverables, timeline, and price." },
    ],
    tools: ["Pipeline Tab", "Lead Notes", "Email"],
    rule: "Never start work without a clear scope and a signed-off proposal.",
  },
  {
    number: "03",
    title: "Deposit & Kickoff",
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: "💰",
    summary: "Client agrees, pays the deposit, and the project officially begins.",
    steps: [
      { label: "Client accepts proposal", detail: "Verbal or written confirmation that they want to proceed." },
      { label: "Send deposit invoice (50%)", detail: "Generate an invoice from the project card for 50% of the agreed amount. Send via Zelle, Venmo, or PayPal." },
      { label: "Deposit received", detail: "The project slot is secured with the 50% deposit. Do not start design or development work until it clears." },
      { label: "Convert lead to project", detail: "Mark the lead as Won in the pipeline, then create a new Project card. Set the agreed budget, deadline, and start date." },
      { label: "Project status → Discovery", detail: "Begin gathering all assets: logo files, brand colors, copy, photos, login credentials for any existing platforms." },
    ],
    tools: ["Invoice Builder", "Projects Tab", "Zelle / Venmo / PayPal"],
    rule: "50% upfront, always. No exceptions. This filters serious clients from time-wasters.",
  },
  {
    number: "04",
    title: "Build",
    color: "#FB923C",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    icon: "🛠️",
    summary: "Design and develop the website. First draft delivered within 72 hours.",
    steps: [
      { label: "Project status → Building", detail: "Update the project card to 'Building' so you can track active work." },
      { label: "First draft in 72 hours", detail: "Deliver an initial version of the site within 72 hours of kickoff. It doesn't have to be perfect — it needs to be tangible." },
      { label: "Revision cycles", detail: "Share a staging URL or screen recordings. Collect feedback. Iterate. Revisions continue until the client is happy — this is what's promised on the website." },
      { label: "Project status → Review", detail: "Once you believe the site is ready, move to Review and ask for final client sign-off." },
      { label: "Final approval", detail: "Client explicitly approves the final design in writing (email is fine). This protects you from scope creep after delivery." },
    ],
    tools: ["Next.js", "Tailwind CSS", "Vercel Preview", "Projects Tab"],
    rule: "Keep the client updated every 2–3 days even if just to say 'still on track'. Silence creates anxiety.",
  },
  {
    number: "05",
    title: "Final Invoice & Delivery",
    color: "#F472B6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
    icon: "📦",
    summary: "Collect final payment, then hand over everything the client needs.",
    steps: [
      { label: "Send final invoice (50%)", detail: "Generate the second invoice for the remaining 50% of the project fee. Send it and wait for payment before delivering anything." },
      { label: "Final payment received", detail: "Once the balance is cleared, proceed with delivery. Mark the invoice as Paid." },
      { label: "Choose delivery type", detail: "File Handoff: upload the full source code to Google Drive. Managed Hosting: you deploy and maintain the site on Vercel." },
      { label: "Generate delivery page", detail: "In the project card, generate a password-protected delivery page. The client gets a unique URL and password to access their files." },
      { label: "Send delivery link to client", detail: "Email the client their delivery URL and password. The page shows their download link, credentials, and hosting options." },
      { label: "Mark files as downloaded", detail: "Once the client downloads, the system tracks it automatically via the delivery portal." },
    ],
    tools: ["Invoice Builder", "Delivery Portal", "Google Drive"],
    rule: "Files are stored for 30 days only. Make sure the client downloads and backs up before expiry.",
  },
  {
    number: "06",
    title: "Post-Launch",
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    icon: "🚀",
    summary: "Site is live. Keep the relationship warm and generate recurring revenue.",
    steps: [
      { label: "Project status → Launched", detail: "Mark the project as Launched in the admin panel. Job done." },
      { label: "Managed hosting upsell", detail: "If the client opted into managed hosting via the delivery page, you'll see an amber notification in their project card. Follow up to confirm billing and set up payment." },
      { label: "Billing start date set", detail: "In the project card, set the monthly rate, billing start date, and next billing date. Charge monthly via Zelle, Venmo, or PayPal." },
      { label: "1 hour edits per month", detail: "Managed clients get 1 hour of free edits every month included. Track your time. Anything over 1 hour is billed at your hourly rate." },
      { label: "Ask for a review", detail: "After a week or two, follow up and ask the client to leave a review. This is the most important thing you can do for future sales." },
    ],
    tools: ["Projects Tab", "Delivery Portal", "Monthly Billing"],
    rule: "A happy client is your best marketing. Ask for referrals and testimonials every time.",
  },
];

function Playbook() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-2xl flex-shrink-0">📋</div>
          <div>
            <h2 className="text-white font-black text-xl mb-1">byBrian — Business Playbook</h2>
            <p className="text-white/40 text-[14px] leading-relaxed">
              The complete end-to-end process for running this freelance web design business — from the first inquiry to a live site and recurring revenue. Follow this every time, for every client.
            </p>
          </div>
        </div>

        {/* Phase overview strip */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
          {PHASES.map(p => (
            <div key={p.number} className="rounded-xl p-3 text-center" style={{ background: p.bg, border: `1px solid ${p.border}` }}>
              <p className="text-lg mb-1">{p.icon}</p>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: p.color }}>{p.number}</p>
              <p className="text-white/60 text-[11px] font-semibold mt-0.5 leading-tight">{p.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phase cards */}
      {PHASES.map((phase, pi) => (
        <div key={phase.number} className="bg-[#1A1D27] border rounded-2xl overflow-hidden" style={{ borderColor: phase.border }}>
          {/* Phase header */}
          <div className="px-6 py-5 border-b flex items-center gap-4" style={{ borderColor: phase.border, background: phase.bg }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: phase.bg, border: `1px solid ${phase.border}` }}>
              {phase.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: phase.color }}>Phase {phase.number}</span>
                {pi < PHASES.length - 1 && <span className="text-white/20 text-[11px]">→</span>}
              </div>
              <h3 className="text-white font-black text-lg">{phase.title}</h3>
            </div>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-xs hidden md:block">{phase.summary}</p>
          </div>

          <div className="p-6 grid md:grid-cols-[1fr_220px] gap-6">
            {/* Steps */}
            <div className="space-y-3">
              {phase.steps.map((step, si) => (
                <div key={si} className="flex gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black" style={{ background: phase.bg, border: `1px solid ${phase.border}`, color: phase.color }}>
                      {si + 1}
                    </div>
                    {si < phase.steps.length - 1 && <div className="w-px flex-1 mt-2 mb-0" style={{ background: phase.border }} />}
                  </div>
                  <div className="pb-3">
                    <p className="text-white font-bold text-[13px] mb-0.5">{step.label}</p>
                    <p className="text-white/40 text-[12px] leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Tools used */}
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-3">Tools Used</p>
                <div className="flex flex-wrap gap-1.5">
                  {phase.tools.map(t => (
                    <span key={t} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: phase.bg, border: `1px solid ${phase.border}`, color: phase.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {/* Golden rule */}
              <div className="rounded-xl p-4" style={{ background: phase.bg, border: `1px solid ${phase.border}` }}>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: phase.color }}>Golden Rule</p>
                <p className="text-white/70 text-[12px] leading-relaxed italic">&ldquo;{phase.rule}&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Revenue model */}
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-6">
        <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-5">Revenue Model</p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: "🔨", label: "Project Fee", desc: "One-time payment for building the site. 50% upfront, 50% on delivery. Ranges from $500 (landing page) to $5,000+ (custom app).", color: "#60A5FA" },
            { icon: "🌐", label: "Monthly Care Plan", desc: "Recurring revenue from hosting + maintenance. Three tiers: $49 / $99 / $149 per month. Your passive income stream — every client is a candidate.", color: "#34D399" },
            { icon: "⚡", label: "Ad-hoc Edits", desc: "Work beyond the monthly inclusion billed at your hourly rate. New pages, integrations, redesigns — anything outside the plan scope.", color: "#FBBF24" },
          ].map(r => (
            <div key={r.label} className="bg-black/20 rounded-xl p-5">
              <div className="text-2xl mb-3">{r.icon}</div>
              <p className="text-white font-bold text-[14px] mb-1">{r.label}</p>
              <p className="text-white/40 text-[12px] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
        {/* Care plan tier breakdown */}
        <div>
          <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-3">Care Plan Tiers</p>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                name: "Basic — $49/mo", badge: null,
                includes: ["Hosting on Vercel (free tier)", "SSL certificate (auto)", "Uptime monitoring", "Daily GitHub backups", "Annual domain renewal pass-through"],
                yourCost: "$0/mo", yourTime: "~0 hrs",
                deliver: "Deploy site to Vercel, connect domain. GitHub = backup. Fully passive.",
              },
              {
                name: "Starter — $99/mo", badge: "Most sold",
                includes: ["Everything in Basic", "Up to 1 hr of edits/month", "Priority email support", "Same-day deployment of changes", "Change log sent to client monthly"],
                yourCost: "$0/mo", yourTime: "~1 hr",
                deliver: "Use Claude to make code changes in minutes. Push via GitHub → auto-deploys to Vercel. Track time, bill overages at hourly rate.",
              },
              {
                name: "Growth — $149/mo", badge: "Best margin",
                includes: ["Everything in Starter", "Up to 2 hrs of edits/month", "Monthly SEO performance report", "Google Search Console setup", "Core Web Vitals monitoring"],
                yourCost: "$0/mo", yourTime: "~2 hrs",
                deliver: "Pull data from Google Search Console + Vercel Analytics → paste into Claude → Claude generates a clean branded report. ~20 min per client.",
              },
            ].map(t => (
              <div key={t.name} className="bg-black/30 rounded-xl p-4 border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-white font-black text-[13px]">{t.name}</p>
                  {t.badge && <span className="text-[10px] font-bold bg-[#34D399]/20 text-[#34D399] px-2 py-0.5 rounded-full">{t.badge}</span>}
                </div>
                <ul className="space-y-1 mb-3">
                  {t.includes.map(i => (
                    <li key={i} className="text-white/45 text-[11px] flex items-start gap-1.5">
                      <span className="text-[#34D399] flex-shrink-0 mt-0.5">✓</span>{i}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">How to deliver</p>
                  <p className="text-white/40 text-[11px] leading-relaxed">{t.deliver}</p>
                  <div className="flex gap-3 pt-1">
                    <span className="text-[10px] font-bold text-emerald-400">Cost to you: {t.yourCost}</span>
                    <span className="text-[10px] font-bold text-blue-400">Time: {t.yourTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetTiers() {
  const tiers = [
    {
      range: "$0 – $499",
      label: "Not a Fit",
      color: "#EF4444",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
      icon: "🚫",
      summary: "Below minimum viable budget. Politely decline or refer to DIY platforms (Squarespace, Wix).",
      canDo: [
        "Single-page static site (if very simple)",
        "Template customization only — no custom design",
        "Basic HTML/CSS brochure page",
      ],
      cantDo: [
        "Custom design",
        "CMS or dynamic content",
        "E-commerce",
        "Meaningful SEO work",
        "Custom design or revisions",
      ],
      tools: [],
      note: "Recommend they start with Squarespace or a Webflow template. Revisit when budget grows.",
    },
    {
      range: "$500 – $999",
      label: "Starter",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      icon: "🌱",
      summary: "Entry-level custom site. Clean design, mobile-first, deployed and live.",
      canDo: [
        "3–5 page custom site (Home, About, Services, Contact + 1 more)",
        "Mobile-responsive layout",
        "Contact form wired to email (Resend free tier)",
        "Basic on-page SEO (meta titles, descriptions, OG tags)",
        "Deployed to Vercel (free tier)",
        "Revisions until you're happy",
        "GitHub repo handoff",
      ],
      cantDo: [
        "CMS / editable content",
        "E-commerce / payments",
        "Blog",
        "Custom animations",
        "CMS / editable content at this tier",
      ],
      tools: ["Next.js", "Tailwind", "Vercel (free)", "Resend (free)", "GitHub"],
      note: "This is the $500 flat-fee model. Position as 'fast, clean, professional — no frills.'",
    },
    {
      range: "$1,000 – $1,499",
      label: "Professional",
      color: "#3B82F6",
      bg: "rgba(59,130,246,0.08)",
      border: "rgba(59,130,246,0.2)",
      icon: "⚡",
      summary: "Full-featured brochure or portfolio site with CMS and polished design.",
      canDo: [
        "Up to 8 pages",
        "Headless CMS (Sanity.io free tier or Contentlayer)",
        "Client can edit content without touching code",
        "Custom animations / scroll reveals",
        "Blog or news section (optional)",
        "SEO optimization + sitemap + robots.txt",
        "Contact form + email automation",
        "Revisions until you're happy",
        "Vercel deployment + domain setup",
        "30-day post-launch support",
      ],
      cantDo: [
        "E-commerce / Stripe payments",
        "User accounts / auth",
        "Large-scale custom functionality",
      ],
      tools: ["Next.js", "Tailwind", "Vercel", "Sanity (free)", "Resend", "GitHub"],
      note: "This is the $1,200 model. Add $200–$300 for blog or extra pages.",
    },
    {
      range: "$1,500 – $2,499",
      label: "Advanced",
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.08)",
      border: "rgba(139,92,246,0.2)",
      icon: "🚀",
      summary: "Business site with Supabase backend, auth, booking, or lead capture.",
      canDo: [
        "Everything in Professional tier",
        "Supabase database (lead capture, form storage, simple CRM)",
        "User authentication (Supabase Auth)",
        "Admin dashboard for client to view submissions",
        "Booking / inquiry system",
        "Newsletter signup + email list (Resend or Loops)",
        "Custom interactive components",
        "Revisions until you're happy",
        "60-day post-launch support",
      ],
      cantDo: [
        "Full e-commerce with inventory management",
        "Complex payment flows",
        "Native mobile app",
      ],
      tools: ["Next.js", "Tailwind", "Vercel", "Supabase", "Resend", "GitHub", "Claude API (optional)"],
      note: "Scope carefully — Supabase auth + DB adds real complexity. Quote high end of range for auth.",
    },
    {
      range: "$2,500 – $4,999",
      label: "Custom Build",
      color: "#10B981",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      icon: "🛠️",
      summary: "E-commerce, SaaS MVP, or complex web app with full backend.",
      canDo: [
        "Stripe payment integration (one-time or subscriptions)",
        "E-commerce store (product pages, cart, checkout)",
        "SaaS MVP with user accounts + billing",
        "AI-powered features (Claude API integration)",
        "Multi-role dashboards",
        "Advanced Supabase (row-level security, realtime, storage)",
        "Custom API integrations (3rd-party services)",
        "Performance optimization + Core Web Vitals",
        "Unlimited revisions within scope",
        "90-day post-launch support",
      ],
      cantDo: [
        "Native mobile apps",
        "Ongoing retainer (handled separately)",
        "Large team features (roles, permissions at enterprise scale)",
      ],
      tools: ["Next.js", "Tailwind", "Vercel Pro", "Supabase Pro", "Stripe", "Claude API", "Resend", "GitHub"],
      note: "Milestone billing: ⅓ start / ⅓ mid / ⅓ delivery. Always get scope in writing.",
    },
    {
      range: "$5,000+",
      label: "Enterprise / Retainer",
      color: "#F97316",
      bg: "rgba(249,115,22,0.08)",
      border: "rgba(249,115,22,0.2)",
      icon: "🏢",
      summary: "Large custom platforms, ongoing development retainers, or multi-month projects.",
      canDo: [
        "Everything in Custom Build tier",
        "Full product development (multi-month)",
        "Monthly retainer for ongoing dev ($1,500–$3,000/mo)",
        "Team handoff with documentation",
        "Advanced AI integrations (RAG, embeddings, Claude agents)",
        "Custom design systems",
        "Dedicated Vercel / Supabase org setup",
        "SLAs and priority support",
      ],
      cantDo: [],
      tools: ["Full stack", "Vercel Pro/Enterprise", "Supabase Pro", "Stripe", "Claude API", "GitHub Teams"],
      note: "Require signed contract. Monthly retainers paid in advance. Scope change = new quote.",
    },
  ];

  const addons = [
    {
      category: "Extra Pages",
      items: [
        { name: "Each additional page (beyond base)", starter: "+$75", professional: "+$60", custom: "+$50" },
      ],
    },
    {
      category: "SEO",
      items: [
        { name: "Basic SEO (meta tags, OG, sitemap)", starter: "Included", professional: "Included", custom: "Included" },
        { name: "Full SEO optimization (schema, robots, keyword targeting)", starter: "+$150", professional: "+$100", custom: "Included" },
        { name: "Monthly SEO report (ongoing)", starter: "+$75/mo", professional: "+$75/mo", custom: "+$75/mo" },
      ],
    },
    {
      category: "Design & Animations",
      items: [
        { name: "Custom illustration or graphics", starter: "+$200", professional: "+$150", custom: "+$150" },
        { name: "Scroll animations / micro-interactions", starter: "+$150", professional: "+$100", custom: "Included" },
        { name: "Custom logo design", starter: "+$250", professional: "+$200", custom: "+$200" },
      ],
    },
    {
      category: "Content & Media",
      items: [
        { name: "Copywriting (per page)", starter: "+$100", professional: "+$75", custom: "+$75" },
        { name: "Photo sourcing / licensing", starter: "+$50", professional: "+$50", custom: "+$50" },
        { name: "Blog setup (structure only, no posts)", starter: "+$200", professional: "+$100", custom: "Included" },
      ],
    },
    {
      category: "Functionality",
      items: [
        { name: "CMS integration (client-editable content)", starter: "+$300", professional: "Included", custom: "Included" },
        { name: "Contact form + email notification", starter: "Included", professional: "Included", custom: "Included" },
        { name: "Booking / scheduling integration (Calendly etc.)", starter: "+$100", professional: "+$75", custom: "+$75" },
        { name: "E-commerce (product pages, cart, checkout)", starter: "N/A", professional: "N/A", custom: "Included" },
        { name: "Stripe payment integration", starter: "N/A", professional: "+$400", custom: "Included" },
        { name: "User auth / login system", starter: "N/A", professional: "N/A", custom: "Included" },
        { name: "Admin dashboard for client", starter: "N/A", professional: "+$300", custom: "Included" },
        { name: "3rd-party API integration", starter: "+$200", professional: "+$150", custom: "Included" },
      ],
    },
    {
      category: "Support & Extras",
      items: [
        { name: "Domain setup + DNS configuration", starter: "+$50", professional: "+$50", custom: "Included" },
        { name: "Speed / Core Web Vitals optimization", starter: "+$150", professional: "+$100", custom: "Included" },
        { name: "Rush delivery (under 1 week)", starter: "+$200", professional: "+$300", custom: "+$500" },
        { name: "Additional revision rounds (beyond 2 included)", starter: "+$75/ea", professional: "+$75/ea", custom: "+$75/ea" },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-white font-black text-[20px] mb-1">Budget Tiers</p>
        <p className="text-white/40 text-[13px]">What you can deliver at each price point using your current stack.</p>
      </div>

      {/* Pricing Builder */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#2A2D3A", background: "#1A1D27" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#2A2D3A" }}>
          <p className="text-white font-black text-[16px]">💲 Pricing Builder</p>
          <p className="text-white/40 text-[12px] mt-0.5">How much each add-on costs on top of the base price per tier.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b" style={{ borderColor: "#2A2D3A" }}>
                <th className="text-left px-5 py-3 text-white/30 font-semibold uppercase tracking-widest w-1/2">Add-on</th>
                <th className="text-center px-4 py-3 text-[#F59E0B] font-semibold uppercase tracking-widest">Starter<br/><span className="text-white/30 normal-case font-normal">from $750</span></th>
                <th className="text-center px-4 py-3 text-[#3B82F6] font-semibold uppercase tracking-widest">Professional<br/><span className="text-white/30 normal-case font-normal">from $1,200</span></th>
                <th className="text-center px-4 py-3 text-[#10B981] font-semibold uppercase tracking-widest">Custom<br/><span className="text-white/30 normal-case font-normal">from $3,000</span></th>
              </tr>
            </thead>
            <tbody>
              {addons.map((group) => (
                <>
                  <tr key={group.category} className="border-b" style={{ borderColor: "#2A2D3A", background: "rgba(255,255,255,0.02)" }}>
                    <td colSpan={4} className="px-5 py-2 text-white/50 font-bold uppercase tracking-widest text-[10px]">{group.category}</td>
                  </tr>
                  {group.items.map((item) => (
                    <tr key={item.name} className="border-b last:border-0" style={{ borderColor: "#2A2D3A" }}>
                      <td className="px-5 py-3 text-white/70 leading-snug">{item.name}</td>
                      <td className="text-center px-4 py-3 font-semibold" style={{ color: item.starter === "Included" ? "#10B981" : item.starter === "N/A" ? "#EF4444" : "#F59E0B" }}>{item.starter}</td>
                      <td className="text-center px-4 py-3 font-semibold" style={{ color: item.professional === "Included" ? "#10B981" : item.professional === "N/A" ? "#EF4444" : "#3B82F6" }}>{item.professional}</td>
                      <td className="text-center px-4 py-3 font-semibold" style={{ color: item.custom === "Included" ? "#10B981" : item.custom === "N/A" ? "#EF4444" : "#10B981" }}>{item.custom}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tiers.map((tier) => (
        <div key={tier.range} className="rounded-2xl border overflow-hidden" style={{ borderColor: tier.border, background: tier.bg }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: tier.border }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tier.icon}</span>
              <div>
                <p className="text-white font-black text-[16px]">{tier.range}</p>
                <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: tier.color }}>{tier.label}</p>
              </div>
            </div>
            <p className="text-white/50 text-[12px] max-w-xs text-right leading-relaxed hidden sm:block">{tier.summary}</p>
          </div>

          {/* Body */}
          <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: tier.border }}>
            {/* Can Do */}
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">✅ Included</p>
              <ul className="space-y-1.5">
                {tier.canDo.map(item => (
                  <li key={item} className="text-white/70 text-[12px] flex gap-2">
                    <span className="text-green-400 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Can't Do + Tools + Note */}
            <div className="p-5 space-y-4">
              {tier.cantDo.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">❌ Out of Scope</p>
                  <ul className="space-y-1.5">
                    {tier.cantDo.map(item => (
                      <li key={item} className="text-white/50 text-[12px] flex gap-2">
                        <span className="text-red-400 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tier.tools.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2">🛠 Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tier.tools.map(t => (
                      <span key={t} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: tier.color }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tier.note && (
                <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <p className="text-white/40 text-[11px] leading-relaxed italic">💡 {tier.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Expenses() {
  const categories = [
    {
      name: "AI & Development",
      icon: "🤖",
      color: "#8B5CF6",
      items: [
        { label: "Claude Max (Anthropic)", cost: "$100/mo", notes: "Used for code generation, client work, brainstorming. Tax deductible." },
        { label: "Claude API usage", cost: "Variable", notes: "Only if you build AI features into client sites. Pay per token." },
        { label: "GitHub Free", cost: "$0/mo", notes: "Free for public + private repos. Upgrade to Teams ($4/user/mo) if needed." },
      ],
    },
    {
      name: "Hosting & Deployment",
      icon: "🌐",
      color: "#3B82F6",
      items: [
        { label: "Vercel Hobby (your projects)", cost: "$0/mo", notes: "Free tier for personal projects and portfolio site." },
        { label: "Vercel Pro (client sites)", cost: "$20/mo", notes: "Required for commercial client deployments. Can bill back to client." },
        { label: "Vercel Pro (per client add-on)", cost: "+$10/mo/site", notes: "Each additional site beyond free quota on Pro plan." },
        { label: "Netlify (alternative)", cost: "$0–$19/mo", notes: "Good fallback if Vercel isn't the right fit for a project." },
      ],
    },
    {
      name: "Database & Backend",
      icon: "🗄️",
      color: "#10B981",
      items: [
        { label: "Supabase Free", cost: "$0/mo", notes: "2 free projects. Pauses after 1 week of inactivity. Good for dev." },
        { label: "Supabase Pro", cost: "$25/mo/project", notes: "Required for production client databases. No pause, daily backups." },
        { label: "PlanetScale / Neon (alt)", cost: "$0–$19/mo", notes: "Alternative Postgres hosts if Supabase isn't the fit." },
      ],
    },
    {
      name: "Email",
      icon: "📧",
      color: "#F59E0B",
      items: [
        { label: "Resend Free", cost: "$0/mo", notes: "3,000 emails/mo free. Plenty for contact forms on small sites." },
        { label: "Google Workspace", cost: "$6/mo/user", notes: "Professional @yourdomain.com email for client-facing communication." },
      ],
    },
    {
      name: "Domains",
      icon: "🔗",
      color: "#EF4444",
      items: [
        { label: "Your domain (portfolio)", cost: "~$12–$15/yr", notes: "Namecheap or Cloudflare Registrar. Cheapest renewal rates." },
        { label: "Client domain (if managed)", cost: "~$12–$15/yr", notes: "Bill back to client + small markup for your time managing it." },
        { label: "Cloudflare DNS (free)", cost: "$0/mo", notes: "Use Cloudflare for DNS on all sites — faster, free SSL, DDoS protection." },
      ],
    },
    {
      name: "Design & Assets",
      icon: "🎨",
      color: "#EC4899",
      items: [
        { label: "Figma Free", cost: "$0/mo", notes: "3 projects free. Enough for most freelance work." },
        { label: "Figma Professional", cost: "$15/mo", notes: "Unlimited projects. Worth it once you have 2+ active clients." },
        { label: "Unsplash / Pexels", cost: "$0", notes: "Free stock photos for placeholder/client use (with attribution check)." },
        { label: "Lucide / Heroicons", cost: "$0", notes: "Open source icon sets. Always use these first." },
      ],
    },
    {
      name: "Payments & Admin",
      icon: "💳",
      color: "#14B8A6",
      items: [
        { label: "Stripe (client payments)", cost: "2.9% + $0.30/txn", notes: "No monthly fee. Taken per transaction. Use for all project invoices." },
        { label: "Wave (invoicing)", cost: "$0", notes: "Free invoicing tool. Integrates with Stripe for online payment." },
        { label: "Calendly Free", cost: "$0/mo", notes: "1 event type free. Enough for discovery calls." },
        { label: "Notion Free", cost: "$0/mo", notes: "Project notes, client briefs, content planning." },
      ],
    },
  ];

  const totalFixed = 20 + 20 + 25 + 6 + 15;
  const totalEstimate = `~$${totalFixed}–$${totalFixed + 50}/mo`;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white font-black text-[20px] mb-1">Expenses</p>
          <p className="text-white/40 text-[13px]">Monthly cost breakdown to run your freelance operation.</p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">Est. Monthly Burn</p>
          <p className="text-white font-black text-[22px]">{totalEstimate}</p>
          <p className="text-white/30 text-[10px]">at full capacity (1+ active client)</p>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat.name} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#2A2D3A]">
            <span className="text-xl">{cat.icon}</span>
            <p className="font-bold text-[14px]" style={{ color: cat.color }}>{cat.name}</p>
          </div>
          <div className="divide-y divide-[#2A2D3A]">
            {cat.items.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[13px] font-semibold">{item.label}</p>
                  <p className="text-white/35 text-[11px] leading-relaxed mt-0.5">{item.notes}</p>
                </div>
                <span className="text-[13px] font-bold flex-shrink-0" style={{ color: cat.color }}>{item.cost}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5">
        <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-4">Cost Scenarios</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Just Starting", cost: "$20/mo", desc: "Claude Pro only. Everything else free tier. No active clients.", color: "#F59E0B" },
            { label: "1 Active Client", cost: "$65–$90/mo", desc: "Claude Pro + Vercel Pro + Supabase Pro + Google email.", color: "#3B82F6" },
            { label: "2–3 Clients", cost: "$100–$150/mo", desc: "All above + Figma Pro + extra Supabase projects as needed.", color: "#10B981" },
          ].map(s => (
            <div key={s.label} className="bg-black/20 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-1">{s.label}</p>
              <p className="font-black text-[20px] mb-1" style={{ color: s.color }}>{s.cost}</p>
              <p className="text-white/40 text-[11px] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SiteTemplates() {
  const templates = [
    {
      type: "E-Commerce Store",
      emoji: "🛍️",
      color: "#F59E0B",
      border: "rgba(245,158,11,0.2)",
      bg: "rgba(245,158,11,0.06)",
      tier: "Custom ($2,500+)",
      stack: ["Next.js", "Stripe", "Supabase", "Vercel"],
      pages: ["Home", "Shop / Collection", "Product Detail", "Cart", "Checkout", "Order Confirmation", "Account / Orders", "About", "Contact"],
      mustHave: [
        "Product catalog with categories + filters",
        "Product pages: photos, description, variants (size/color), Add to Cart",
        "Cart sidebar or page (persistent across sessions)",
        "Stripe checkout (one-time payments)",
        "Order confirmation email (via Resend)",
        "Mobile-first checkout flow",
        "Inventory display (in stock / out of stock)",
        "SEO: product meta titles, OG images",
      ],
      niceToHave: [
        "Discount/promo code support (Stripe coupons)",
        "Customer login + order history (Supabase Auth)",
        "Product reviews section",
        "Wishlist / save for later",
        "Related products carousel",
        "Abandoned cart email",
      ],
      clientNeeds: [
        "Product list with names, descriptions, prices, variants",
        "Product photos (high-res, white/neutral background preferred)",
        "Brand logo + color palette",
        "Shipping policy, return policy copy",
        "Stripe account connected",
        "Domain purchased",
      ],
      questions: [
        "How many products do you have?",
        "Do products have variants (sizes, colors)?",
        "Do you need customer accounts or is guest checkout fine?",
        "Do you ship physically or is this digital/service?",
        "Do you have existing photos or need placeholder images?",
      ],
    },
    {
      type: "Restaurant & Hospitality",
      emoji: "🍽️",
      color: "#EF4444",
      border: "rgba(239,68,68,0.2)",
      bg: "rgba(239,68,68,0.06)",
      tier: "Starter–Professional ($500–$1,200)",
      stack: ["Next.js", "Vercel", "Resend", "Sanity (optional CMS)"],
      pages: ["Home", "Menu", "About / Story", "Reservations", "Gallery", "Contact / Location"],
      mustHave: [
        "Full menu display (sections: starters, mains, drinks, desserts)",
        "Hours + location with Google Maps embed",
        "Reservation link (OpenTable, Resy, or simple form)",
        "Mobile-responsive — most users visit on phone",
        "Hero with food/ambiance photography",
        "Contact form or click-to-call button",
        "Social media links (Instagram especially)",
      ],
      niceToHave: [
        "Online ordering integration (Slice, Toast, or custom)",
        "Events / specials section",
        "Gift card link",
        "Photo gallery / Instagram feed embed",
        "CMS so owner can update menu without dev help",
      ],
      clientNeeds: [
        "Menu (PDF or text — every item, price, description)",
        "Photos of food, interior, exterior",
        "Logo + brand colors",
        "Hours of operation",
        "Address + parking info",
        "Reservation platform they use (or none yet)",
      ],
      questions: [
        "Do you take reservations? Through what platform?",
        "Do you offer online ordering or delivery?",
        "Do you want to update the menu yourself (CMS) or have me do it?",
        "Do you have professional food photos or need to use stock?",
        "Any events, specials, or seasonal menus to highlight?",
      ],
    },
    {
      type: "Portfolio & Personal Brand",
      emoji: "✦",
      color: "#8B5CF6",
      border: "rgba(139,92,246,0.2)",
      bg: "rgba(139,92,246,0.06)",
      tier: "Starter–Professional ($500–$1,200)",
      stack: ["Next.js", "Vercel", "Sanity or Contentlayer", "Resend"],
      pages: ["Home", "Work / Projects", "Project Detail", "About", "Services (optional)", "Contact"],
      mustHave: [
        "Full-screen hero with name + tagline",
        "Project gallery with categories",
        "Individual project pages (problem, approach, result + screenshots)",
        "About page with bio + headshot",
        "Contact form with inquiry type",
        "Smooth page transitions / reveal animations",
        "Downloadable resume link (optional)",
      ],
      niceToHave: [
        "CMS for adding new projects without code",
        "Case study format (long-form write-ups)",
        "Testimonials section",
        "Blog",
        "Password-protected work (for NDA projects)",
      ],
      clientNeeds: [
        "3–10 portfolio pieces with project descriptions",
        "Screenshots or mockups of each project",
        "Headshot / profile photo",
        "Short bio (2–3 sentences)",
        "Services or skills they offer",
        "Resume PDF (optional)",
      ],
      questions: [
        "What's your primary goal — job hunting, freelance clients, or brand building?",
        "How many projects do you want to feature?",
        "Do you have case studies written or just screenshots?",
        "Do you want a blog or writing section?",
        "Do you want to update projects yourself (CMS)?",
      ],
    },
    {
      type: "Business & Services",
      emoji: "💼",
      color: "#3B82F6",
      border: "rgba(59,130,246,0.2)",
      bg: "rgba(59,130,246,0.06)",
      tier: "Starter–Advanced ($500–$2,000)",
      stack: ["Next.js", "Vercel", "Resend", "Supabase (if lead capture needed)", "Calendly"],
      pages: ["Home", "Services", "About / Team", "Pricing (optional)", "Testimonials", "Contact / Book a Call"],
      mustHave: [
        "Clear above-the-fold headline: who you help + how",
        "Services breakdown (what's included, who it's for)",
        "Trust signals: testimonials, logos, credentials",
        "Multiple CTAs throughout (contact form + calendar booking)",
        "Mobile-first, fast-loading",
        "Basic SEO setup",
        "Google Analytics / tracking pixel",
      ],
      niceToHave: [
        "Pricing page",
        "FAQ section",
        "Case studies / results",
        "Lead magnet + email capture (Supabase + Resend)",
        "Live chat widget (Crisp, Tawk.to — free tiers)",
        "Blog for SEO",
      ],
      clientNeeds: [
        "Description of services (what they do, for whom, outcomes)",
        "2–5 client testimonials",
        "Headshots of team members",
        "Calendly or booking platform link",
        "Logo + brand colors",
        "Any credentials, certifications, or client logos",
      ],
      questions: [
        "What's your primary conversion action — form fill, call booking, or phone call?",
        "Do you have testimonials ready to use?",
        "Do you want a pricing page or keep it inquiry-only?",
        "Do you have existing branding (logo, colors, fonts)?",
        "Do you have a CRM or how do you manage leads now?",
      ],
    },
    {
      type: "Real Estate & Property",
      emoji: "🏡",
      color: "#10B981",
      border: "rgba(16,185,129,0.2)",
      bg: "rgba(16,185,129,0.06)",
      tier: "Professional–Advanced ($1,200–$2,500)",
      stack: ["Next.js", "Supabase", "Vercel", "Resend", "Google Maps API"],
      pages: ["Home", "Listings / Properties", "Property Detail", "About Agent", "Buyers Guide", "Sellers Guide", "Contact"],
      mustHave: [
        "Property listing cards with photo, price, beds/baths, sqft",
        "Individual property pages with photo gallery",
        "Search/filter by price, beds, neighborhood",
        "Lead capture form on every listing",
        "Agent bio + credentials",
        "Contact form + direct phone CTA",
        "Google Maps embed on property pages",
        "Mobile-first — buyers browse on phones",
      ],
      niceToHave: [
        "Virtual tour embed (YouTube/Matterport)",
        "Mortgage calculator",
        "Neighborhood info pages",
        "IDX feed integration (MLS listings — requires 3rd party service)",
        "Market stats / blog",
      ],
      clientNeeds: [
        "Current listings (address, price, photos, description, details)",
        "Agent headshot + bio + credentials",
        "Brokerage logo if needed",
        "Contact preference (form vs. direct phone/email)",
        "Any buyer/seller resources to include",
      ],
      questions: [
        "Do you need IDX/MLS integration or will you manually add listings?",
        "How many active listings do you typically have?",
        "Is this for one agent or a team?",
        "Do you want buyers to schedule showings through the site?",
        "Do you have professional listing photos?",
      ],
    },
    {
      type: "Health, Wellness & Fitness",
      emoji: "💪",
      color: "#14B8A6",
      border: "rgba(20,184,166,0.2)",
      bg: "rgba(20,184,166,0.06)",
      tier: "Professional–Advanced ($1,200–$2,500)",
      stack: ["Next.js", "Supabase", "Vercel", "Resend", "Calendly or Acuity"],
      pages: ["Home", "Services / Classes", "Schedule", "About", "Pricing / Memberships", "Testimonials", "Contact / Book"],
      mustHave: [
        "Hero with strong result-oriented headline",
        "Services or class types breakdown",
        "Pricing / membership tiers",
        "Online booking or schedule link (Calendly, Mindbody, Acuity)",
        "Trainer / practitioner bio + credentials",
        "Client transformation stories / testimonials",
        "Contact form + location/hours",
        "Mobile-first — clients book on their phones",
      ],
      niceToHave: [
        "Class schedule embed (Mindbody, Pike13)",
        "Member login area",
        "Blog / nutrition / workout tips",
        "Lead magnet (free class, eBook) + email capture",
        "Before/after photo gallery",
        "Waivers / intake forms integration",
      ],
      clientNeeds: [
        "List of services / class types offered",
        "Pricing and membership options",
        "Photos of studio, trainer, or classes in action",
        "Bio + certifications",
        "Booking platform they use",
        "Testimonials (before/after descriptions welcome)",
      ],
      questions: [
        "Do you have an existing booking system (Mindbody, Acuity, Calendly)?",
        "Do you offer in-person, virtual, or both?",
        "Do you want memberships / recurring billing on the site?",
        "Do you have client transformation photos you can share?",
        "Is this a solo practice or do you have a team?",
      ],
    },
  ];

  const [selected, setSelected] = useState<string>(templates[0].type);
  const active = templates.find(t => t.type === selected)!;

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-white font-black text-[20px] mb-1">Site Templates</p>
        <p className="text-white/40 text-[13px]">Everything you need to scope, quote, and build each site type.</p>
      </div>

      {/* Type selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {templates.map(t => (
          <button key={t.type} onClick={() => setSelected(t.type)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold transition border"
            style={{
              background: selected === t.type ? t.bg : "rgba(255,255,255,0.04)",
              borderColor: selected === t.type ? t.border : "rgba(255,255,255,0.06)",
              color: selected === t.type ? t.color : "rgba(255,255,255,0.4)",
            }}>
            <span>{t.emoji}</span>
            <span className="hidden sm:inline">{t.type}</span>
          </button>
        ))}
      </div>

      {/* Active template detail */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: active.border, background: active.bg }}>
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b" style={{ borderColor: active.border }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{active.emoji}</span>
            <div>
              <p className="text-white font-black text-[18px]">{active.type}</p>
              <p className="text-[12px] font-bold" style={{ color: active.color }}>{active.tier}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {active.stack.map(s => (
              <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.3)", color: active.color }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: active.border }}>
          {/* Left col */}
          <div className="p-5 space-y-5">
            {/* Pages */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">📄 Pages to Build</p>
              <div className="flex flex-wrap gap-1.5">
                {active.pages.map(p => (
                  <span key={p} className="text-[12px] px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
            {/* Must have */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">✅ Must Have</p>
              <ul className="space-y-1.5">
                {active.mustHave.map(item => (
                  <li key={item} className="text-[12px] text-white/70 flex gap-2">
                    <span style={{ color: active.color }}>•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Nice to have */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">✨ Nice to Have</p>
              <ul className="space-y-1.5">
                {active.niceToHave.map(item => (
                  <li key={item} className="text-[12px] text-white/50 flex gap-2">
                    <span className="text-white/20">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right col */}
          <div className="p-5 space-y-5">
            {/* What you need from client */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">📋 What You Need from the Client</p>
              <ul className="space-y-1.5">
                {active.clientNeeds.map(item => (
                  <li key={item} className="text-[12px] text-white/70 flex gap-2">
                    <span style={{ color: active.color }}>→</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Discovery questions */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">❓ Key Questions to Ask</p>
              <ul className="space-y-2">
                {active.questions.map((q, i) => (
                  <li key={i} className="text-[12px] text-white/70 bg-black/20 rounded-lg px-3 py-2 flex gap-2">
                    <span className="font-bold flex-shrink-0" style={{ color: active.color }}>{i + 1}.</span>{q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoveryCall() {
  const sections = [
    {
      phase: "Open (0–3 min)",
      color: "#60A5FA",
      bg: "rgba(96,165,250,0.08)",
      border: "rgba(96,165,250,0.2)",
      icon: "👋",
      goal: "Build rapport. Set the agenda. Make them comfortable.",
      script: `"Hey [Name], great to finally connect — I've been looking forward to this. So I've got us down for about 30 minutes. My plan is to spend most of the time understanding your business, what you're trying to accomplish with the site, and by the end I should be able to give you a good sense of what I'd build and what it would cost. Does that work for you?"

[Wait for response]

"Perfect. And just so you know — there's no pressure here. This is really just a conversation so I can understand your situation. If it ends up being a good fit, great, if not, I'll still point you in the right direction. Sound good?"`,
      bullets: [],
    },
    {
      phase: "Business Context (3–8 min)",
      color: "#34D399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
      icon: "🏢",
      goal: "Understand what they do, who they serve, and what makes them different.",
      script: `"Before we get into the website, I want to understand your business a little better. Can you give me the quick pitch — what do you do, and who do you do it for?"

[Listen. Don't interrupt. Take notes.]

"Got it. And how long have you been running [business name]?"

"Who's your typical customer? Like, paint me a picture of the person you most love working with."

"What makes you different from competitors — why do clients pick you over someone else?"`,
      bullets: [
        "What does the business do?",
        "How long have they been operating?",
        "Who is their ideal customer?",
        "What's their differentiator?",
      ],
    },
    {
      phase: "Current Online Presence (8–13 min)",
      color: "#FBBF24",
      bg: "rgba(251,191,36,0.08)",
      border: "rgba(251,191,36,0.2)",
      icon: "🔍",
      goal: "Find the pain. Understand what's broken or missing.",
      script: `"Tell me about your current website — do you have one?"

[If yes:]
"Can you pull it up? I want to take a look with you. What do you hate about it? What do you wish it did differently?"
"Is it getting you any business right now, or do most customers come from word of mouth / referrals?"
"When someone lands on it, what do you want them to do — call you, fill out a form, buy something?"

[If no:]
"So how are people finding you right now — is it mostly referrals, social media, in-person?"
"Has not having a website cost you business — like, have you ever lost a client because they couldn't find you online?"`,
      bullets: [
        "Do they have a site? What do they dislike about it?",
        "Is the site currently bringing in business?",
        "What's the primary conversion action?",
        "How do customers find them now?",
      ],
    },
    {
      phase: "Goals & Vision (13–18 min)",
      color: "#F97316",
      bg: "rgba(249,115,22,0.08)",
      border: "rgba(249,115,22,0.2)",
      icon: "🎯",
      goal: "Define what success looks like. Get specific.",
      script: `"So let's talk about the new site. What does a home run look like for you — what would this website need to do for you to feel like it was worth every penny?"

"If the site is working perfectly 6 months from now, what's different about your business?"

"Do you have sites you love the look of? Even outside your industry — anything that feels like the vibe you want?"

"What pages do you know you need? Like, what sections are non-negotiable?"

"Is there anything the site absolutely needs to do — take bookings, show a menu, let people buy online, something else?"`,
      bullets: [
        "What does a successful outcome look like?",
        "Design inspiration / reference sites?",
        "Non-negotiable pages and features?",
        "Primary action the site needs to drive?",
      ],
    },
    {
      phase: "Content & Assets (18–22 min)",
      color: "#A78BFA",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.2)",
      icon: "📸",
      goal: "Find out what you have to work with. Content is often the bottleneck.",
      script: `"This is usually the part that surprises people — the website is only as good as the content that goes in it. So let me ask you about what you already have.

Do you have a logo? Brand colors or fonts you use consistently?"

"Do you have professional photos — of your business, your product, your team, your work?"

[If no:] "That's completely fine — we can use high-quality stock photography to start. A lot of clients start that way."

"Who's going to write the copy — the actual words on the site? Do you have someone for that, or do you want me to handle that?"

"Will you need to update the site yourself after launch — like, change prices, add photos, update a menu — or are you comfortable reaching out to me when you need changes?"`,
      bullets: [
        "Logo + brand assets ready?",
        "Professional photos available?",
        "Who writes the copy?",
        "Do they need a CMS to self-update?",
      ],
    },
    {
      phase: "Budget & Timeline (22–26 min)",
      color: "#EC4899",
      bg: "rgba(236,72,153,0.08)",
      border: "rgba(236,72,153,0.2)",
      icon: "💰",
      goal: "Qualify the budget without being awkward. Set realistic timeline expectations.",
      script: `"Let me ask you about budget — and I promise this isn't a trap. I just want to make sure I'm proposing something that actually works for you. Do you have a ballpark in mind for this project?"

[If they give a number:]
"Good to know. That's definitely workable — here's roughly what I can do in that range…" [reference your tiers]

[If they say 'I don't know':]
"No worries — most people don't. Here's how I'd frame it: my starting point for a clean custom site is $500. A more full-featured site with a CMS, more pages, and SEO work usually lands around $1,200–$2,500. And for e-commerce or something with a backend, we're typically talking $2,500 and up. Does any of that range feel realistic for where you're at?"

"And timeline — is there a date you're working toward? A launch, a season, an event?"`,
      bullets: [
        "What's their budget range?",
        "Is the budget flexible for must-haves?",
        "Any hard deadline (event, season, launch)?",
        "Hosting preference — take the code or managed hosting?",
      ],
    },
    {
      phase: "Wrap Up & Next Steps (26–30 min)",
      color: "#14B8A6",
      bg: "rgba(20,184,166,0.08)",
      border: "rgba(20,184,166,0.2)",
      icon: "✅",
      goal: "Close cleanly. Set clear expectations for what happens next.",
      script: `"This was super helpful — I feel like I have a really clear picture of what you need.

Here's what I'm going to do: I'll put together a proposal that outlines exactly what I'd build, what's included, the timeline, and the investment. I'll get that to you within 24–48 hours. Does that work?"

[If they're clearly interested:]
"Is there anything else I should know before I write that up — anything we didn't cover that matters to you?"

"And just to confirm — you're the decision maker on this, or is there anyone else I should loop in on the proposal?"

"Once you get the proposal, if everything looks good, the way I work is: 50% deposit upfront to kick things off, 50% on delivery. You always get the full source code — it's yours. Any questions before I let you go?"

"Awesome — talk soon, [Name]. I'll have something in your inbox by [specific day]."`,
      bullets: [
        "Confirm proposal timeline (24–48 hrs)",
        "Ask if they're the sole decision maker",
        "Remind them of deposit terms",
        "End with a specific follow-up date",
      ],
    },
  ];

  const objections = [
    {
      objection: "\"I need to think about it.\"",
      response: "\"Totally fair. What's the main thing giving you pause — is it the investment, the timing, or something about the project itself? I want to make sure the proposal I send addresses whatever's on your mind.\"",
    },
    {
      objection: "\"Can you do it cheaper?\"",
      response: "\"I can work with different budgets by scoping differently — fewer pages, no CMS, simpler design. Tell me what your hard ceiling is and I'll show you exactly what's possible in that range.\"",
    },
    {
      objection: "\"I have a friend who can do it for $100.\"",
      response: "\"That's totally an option. The difference usually comes down to timeline, quality, and what happens after — a professional build is faster, cleaner, and I'm here if something breaks. But if the budget isn't there right now, I'd never talk you out of starting somewhere.\"",
    },
    {
      objection: "\"We're not ready yet — still figuring things out.\"",
      response: "\"Makes sense. What would need to be true for you to feel ready? Sometimes the website actually helps you get clear on the business — but I'd rather know you're committed before we start.\"",
    },
    {
      objection: "\"Can I see examples of your work first?\"",
      response: "\"Absolutely — I'll include relevant examples in the proposal. Is there a specific type of site or industry you'd want to see?\"",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="text-white font-black text-[20px] mb-1">Discovery Call Script</p>
        <p className="text-white/40 text-[13px]">30-minute framework to qualify, scope, and close new clients.</p>
      </div>

      {/* Timeline bar */}
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5 mb-2">
        <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-4">Call Timeline</p>
        <div className="flex gap-1 flex-wrap">
          {sections.map(s => (
            <div key={s.phase} className="flex-1 min-w-[80px] rounded-lg px-2 py-2 text-center" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <p className="text-[10px] font-bold" style={{ color: s.color }}>{s.phase.split("(")[1]?.replace(")", "") ?? ""}</p>
              <p className="text-white/50 text-[10px] mt-0.5">{s.icon}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      {sections.map((s, i) => (
        <div key={s.phase} className="rounded-2xl border overflow-hidden" style={{ borderColor: s.border, background: s.bg }}>
          <div className="flex items-center gap-3 px-5 py-3.5 border-b" style={{ borderColor: s.border }}>
            <span className="text-xl">{s.icon}</span>
            <div className="flex-1">
              <p className="font-black text-white text-[15px]">{s.phase}</p>
              <p className="text-[11px] italic" style={{ color: s.color }}>{s.goal}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.3)", color: s.color }}>Step {i + 1}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: s.border }}>
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">🗣 Script</p>
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-white/70 text-[12px] leading-relaxed whitespace-pre-line">{s.script}</p>
              </div>
            </div>
            {s.bullets.length > 0 && (
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-3">📌 Cover These Points</p>
                <ul className="space-y-2">
                  {s.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-[12px] text-white/60 bg-black/20 rounded-lg px-3 py-2">
                      <span style={{ color: s.color }} className="flex-shrink-0">✓</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Objection handling */}
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A2D3A]">
          <p className="text-white font-black text-[15px]">🛡️ Objection Handling</p>
          <p className="text-white/40 text-[12px] mt-0.5">What to say when they push back</p>
        </div>
        <div className="divide-y divide-[#2A2D3A]">
          {objections.map(o => (
            <div key={o.objection} className="p-5 grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2">They say:</p>
                <p className="text-white font-bold text-[13px]">{o.objection}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-white/30 mb-2">You say:</p>
                <p className="text-white/60 text-[12px] leading-relaxed italic">{o.response}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────

interface CallEntry {
  id: string;
  leadId?: string;
  name: string;
  email?: string;
  type: "callback" | "discovery";
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  note?: string;
  createdAt: string;
}

const STORAGE_KEY = "admin_call_entries";

function loadEntries(): CallEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

function saveEntries(entries: CallEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function CalendarView({ leads, token, onLeadUpdate }: { leads: Lead[]; token: string; onLeadUpdate: (l: Lead) => void }) {
  const [entries, setEntries] = useState<CallEntry[]>(() => loadEntries());
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", type: "callback" as "callback" | "discovery", date: "", time: "", note: "" });

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // Auto-import leads with call_scheduled status that aren't already tracked
  const scheduledLeads = leads.filter(l => l.status === "call_scheduled");
  const trackedLeadIds = new Set(entries.map(e => e.leadId).filter(Boolean));
  const untracked = scheduledLeads.filter(l => !trackedLeadIds.has(l.id));

  const importLead = (lead: Lead) => {
    const entry: CallEntry = {
      id: `lead-${lead.id}`,
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      type: "discovery",
      date: tomorrow,
      time: "",
      note: lead.budget ? `Budget: ${lead.budget}` : "",
      createdAt: new Date().toISOString(),
    };
    const updated = [...entries, entry];
    setEntries(updated);
    saveEntries(updated);
  };

  const addEntry = () => {
    if (!form.name || !form.date) return;
    const entry: CallEntry = {
      id: `manual-${Date.now()}`,
      name: form.name,
      email: form.email || undefined,
      type: form.type,
      date: form.date,
      time: form.time || undefined,
      note: form.note || undefined,
      createdAt: new Date().toISOString(),
    };
    const updated = [...entries, entry];
    setEntries(updated);
    saveEntries(updated);
    setForm({ name: "", email: "", type: "callback", date: "", time: "", note: "" });
    setShowAdd(false);
  };

  const clearEntry = async (entry: CallEntry) => {
    // If linked to a lead, move lead back to "contacted"
    if (entry.leadId) {
      const lead = leads.find(l => l.id === entry.leadId);
      if (lead) {
        const res = await fetch(`/api/admin/leads/${entry.leadId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: "contacted" }),
        });
        if (res.ok) onLeadUpdate({ ...lead, status: "contacted" });
      }
    }
    const updated = entries.filter(e => e.id !== entry.id);
    setEntries(updated);
    saveEntries(updated);
  };

  const updateDate = (id: string, date: string) => {
    const updated = entries.map(e => e.id === id ? { ...e, date } : e);
    setEntries(updated);
    saveEntries(updated);
  };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const getDayLabel = (date: string) => {
    if (date === today) return { label: "Today", color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
    if (date === tomorrow) return { label: "Tomorrow", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
    if (date < today) return { label: "Overdue", color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
    const d = new Date(date + "T00:00:00");
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      color: "#60A5FA",
      bg: "rgba(96,165,250,0.08)",
    };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-white font-black text-[20px] mb-1">Calendar</p>
          <p className="text-white/40 text-[13px]">Upcoming callbacks and 30-min discovery calls.</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 bg-[#2563EB] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#1D4ED8] transition flex-shrink-0">
          + Add Call
        </button>
      </div>

      {/* Auto-import banner */}
      {untracked.length > 0 && (
        <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-5">
          <p className="text-amber-300 font-bold text-[13px] mb-3">
            📬 {untracked.length} lead{untracked.length > 1 ? "s" : ""} marked &ldquo;Call Scheduled&rdquo; — add to calendar?
          </p>
          <div className="space-y-2">
            {untracked.map(lead => (
              <div key={lead.id} className="flex items-center justify-between gap-3 bg-black/20 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white font-semibold text-[13px]">{lead.name}</p>
                  <p className="text-white/40 text-[11px]">{lead.email}{lead.budget ? ` · ${lead.budget}` : ""}</p>
                </div>
                <button onClick={() => importLead(lead)}
                  className="text-amber-300 text-[12px] font-bold px-3 py-1.5 rounded-lg border border-amber-400/30 hover:bg-amber-400/10 transition flex-shrink-0">
                  Add → Tomorrow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5 space-y-4">
          <p className="text-white font-bold text-[14px]">New Call Reminder</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/30 text-[10px] uppercase tracking-widest font-semibold block mb-1.5">Client Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith"
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
            <div>
              <label className="text-white/30 text-[10px] uppercase tracking-widest font-semibold block mb-1.5">Email</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com"
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
            <div>
              <label className="text-white/30 text-[10px] uppercase tracking-widest font-semibold block mb-1.5">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "callback" | "discovery" }))}
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition">
                <option value="callback">📞 Call Back</option>
                <option value="discovery">🎯 Discovery Call (30 min)</option>
              </select>
            </div>
            <div>
              <label className="text-white/30 text-[10px] uppercase tracking-widest font-semibold block mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} min={today}
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
            <div>
              <label className="text-white/30 text-[10px] uppercase tracking-widest font-semibold block mb-1.5">Time (optional)</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
            <div>
              <label className="text-white/30 text-[10px] uppercase tracking-widest font-semibold block mb-1.5">Note</label>
              <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Budget, context…"
                className="w-full bg-[#0F1117] border border-[#2A2D3A] rounded-xl px-4 py-2.5 text-white text-[13px] placeholder-white/20 focus:outline-none focus:border-[#2563EB]/50 transition" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-white/40 hover:text-white text-[13px] transition">Cancel</button>
            <button onClick={addEntry} className="px-5 py-2 rounded-xl bg-[#2563EB] text-white font-semibold text-[13px] hover:bg-[#1D4ED8] transition">Add to Calendar</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {sorted.length === 0 && !showAdd && (
        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-white font-bold text-[15px] mb-1">No calls scheduled</p>
          <p className="text-white/30 text-[13px]">Add a callback or discovery call using the button above.</p>
        </div>
      )}

      {/* Call list */}
      {sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map(entry => {
            const day = getDayLabel(entry.date);
            const isOverdue = entry.date < today;
            return (
              <div key={entry.id} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl overflow-hidden">
                <div className="flex items-start gap-4 p-5">
                  {/* Date badge */}
                  <div className="flex-shrink-0 rounded-xl px-3 py-2 text-center min-w-[72px]" style={{ background: day.bg, border: `1px solid ${day.color}30` }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: day.color }}>{day.label}</p>
                    {entry.time && <p className="text-white font-bold text-[14px] mt-0.5">{entry.time}</p>}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-white font-bold text-[15px]">{entry.name}</p>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: entry.type === "discovery" ? "rgba(167,139,250,0.15)" : "rgba(96,165,250,0.15)", color: entry.type === "discovery" ? "#A78BFA" : "#60A5FA" }}>
                        {entry.type === "discovery" ? "🎯 Discovery · 30 min" : "📞 Call Back"}
                      </span>
                    </div>
                    {entry.email && <p className="text-white/40 text-[12px]">{entry.email}</p>}
                    {entry.note && <p className="text-white/30 text-[12px] mt-1 italic">{entry.note}</p>}
                    {isOverdue && <p className="text-red-400 text-[11px] font-semibold mt-1">⚠ Overdue — reschedule or clear</p>}

                    {/* Reschedule date picker */}
                    <div className="flex items-center gap-2 mt-3">
                      <label className="text-white/25 text-[10px] uppercase tracking-widest font-semibold">Reschedule:</label>
                      <input type="date" defaultValue={entry.date} min={today}
                        onChange={e => updateDate(entry.id, e.target.value)}
                        className="bg-[#0F1117] border border-[#2A2D3A] rounded-lg px-2.5 py-1 text-white/60 text-[12px] focus:outline-none focus:border-[#2563EB]/50 transition" />
                    </div>
                  </div>

                  {/* Done button */}
                  <button onClick={() => clearEntry(entry)}
                    className="flex-shrink-0 flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-[12px] font-bold px-3 py-2 rounded-xl transition">
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                    Done
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Email Templates ─────────────────────────────────────────────────────────

const EMAIL_FIELDS = [
  {
    key: "email_quote_subject",
    label: "Subject Line",
    hint: "The email subject the lead sees in their inbox.",
    rows: 1,
  },
  {
    key: "email_quote_greeting",
    label: "Greeting",
    hint: "Opening line. Use {{firstName}} for their first name.",
    rows: 1,
  },
  {
    key: "email_quote_intro",
    label: "Intro Paragraph",
    hint: "First paragraph after the greeting.",
    rows: 3,
  },
  {
    key: "email_quote_closing",
    label: "Closing Paragraph",
    hint: "Personal closing before 'Talk soon, Brian'.",
    rows: 3,
  },
] as const;

const EMAIL_DEFAULTS: Record<string, string> = {
  email_quote_subject:  "You're in good hands, {{firstName}} — here's what's next",
  email_quote_greeting: "Hey {{firstName}}!",
  email_quote_intro:    "I've received your quote request and I'm looking forward to learning more about your project.",
  email_quote_closing:  "You made a great decision reaching out — I can't wait to bring your vision to life. If anything comes to mind before then, just reply to this email. I'm always happy to chat.",
};

function EmailTemplates({ token }: { token: string }) {
  const [values, setValues] = useState<Record<string, string>>(EMAIL_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setValues(prev => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  const preview = (key: string) =>
    (values[key] || "").replace(/\{\{firstName\}\}/g, "Jane").replace(/\{\{name\}\}/g, "Jane Smith");

  if (loading) return <p className="text-white/30 text-[13px]">Loading…</p>;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5">
        <p className="text-white font-black text-[17px] mb-1">📧 Quote Confirmation Email</p>
        <p className="text-white/40 text-[13px]">
          This email is sent automatically to every lead when they submit the contact form. Edit any part below — changes take effect on the next submission.
        </p>
        <p className="text-white/25 text-[11px] mt-2">Use <span className="text-[#60A5FA] font-mono">{"{{firstName}}"}</span> to personalize with the lead's first name.</p>
      </div>

      <div className="space-y-4">
        {EMAIL_FIELDS.map(field => (
          <div key={field.key} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-bold text-[14px]">{field.label}</p>
              <p className="text-white/25 text-[11px]">{field.hint}</p>
            </div>
            <textarea
              rows={field.rows}
              value={values[field.key] || ""}
              onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
              className="w-full bg-black/30 border border-[#2A2D3A] focus:border-[#2563EB] rounded-xl px-4 py-3 text-white text-[14px] placeholder-white/20 focus:outline-none transition resize-none mb-3"
            />
            <div className="bg-black/20 rounded-lg px-3 py-2">
              <p className="text-white/20 text-[10px] uppercase tracking-widest font-semibold mb-1">Preview</p>
              <p className="text-white/50 text-[12px] leading-relaxed">{preview(field.key)}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving}
        className="w-full py-3.5 rounded-xl font-bold text-[14px] transition bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-50">
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save Email Template"}
      </button>
    </div>
  );
}

// ─── Marketing ────────────────────────────────────────────────────────────────

function Marketing() {
  const sections = [
    {
      title: "🎯 Your Target Market — South Jersey + Philly Tri-State",
      color: "#60A5FA",
      bg: "rgba(96,165,250,0.06)",
      border: "rgba(96,165,250,0.15)",
      content: [
        {
          heading: "Who to go after first",
          items: [
            "South Jersey towns: Cherry Hill, Voorhees, Marlton, Moorestown, Mount Laurel, Haddonfield, Medford",
            "Philadelphia: Fishtown, Manayunk, South Philly, Northern Liberties, Chestnut Hill — all small business dense",
            "Delaware: Wilmington, Newark — lower competition than Philly, lots of service businesses with budget",
            "Best niches: restaurants, salons/spas, contractors, real estate agents, fitness studios, med spas, dentists, accountants",
            "These businesses NEED websites but most still have outdated or no site — perfect entry market",
          ],
        },
        {
          heading: "Why your location is an advantage",
          items: [
            "You can offer in-person meetings — huge trust builder vs. remote-only freelancers",
            "Philly has a massive small business scene but few local devs doing modern builds",
            "South Jersey suburbs are full of service businesses in your $500–$3k sweet spot",
            "\"Local designer who actually shows up\" is a real differentiator — use it in every pitch",
          ],
        },
      ],
    },
    {
      title: "📱 Social Media Strategy",
      color: "#A78BFA",
      bg: "rgba(167,139,250,0.06)",
      border: "rgba(167,139,250,0.15)",
      content: [
        {
          heading: "Instagram — highest ROI for your niche",
          items: [
            "Post before/after website redesigns — \"I rebuilt this restaurant's site in 72 hours\" gets huge engagement",
            "Reels over everything: screen-record your builds, design process, time-lapses of you working",
            "Story polls: 'Which homepage do you prefer — A or B?' = massive engagement + educational",
            "Local hashtags: #SouthJersey #PhillySmallBusiness #CherryHillNJ #PhillyBusiness",
            "Tag local businesses in your content even in non-promo posts — they notice and follow",
            "Target: 3–4 posts/week + 5 stories/day when actively growing",
          ],
        },
        {
          heading: "TikTok / YouTube Shorts — fastest growth right now",
          items: [
            "\"I rebuilt a local business's website in 60 seconds\" format performs extremely well",
            "\"Things your website is costing you\" — pain-point content business owners share to their audience",
            "\"Small business website mistakes\" series — positions you as the expert, gets saved constantly",
            "No face needed — screen recording + voiceover works perfectly for web design content",
            "One viral video can generate 5–10 inbound leads — worth the time investment",
          ],
        },
        {
          heading: "LinkedIn — for higher-budget clients ($1,200+)",
          items: [
            "Post case studies: 'Client had no online presence. 3 weeks later, first inquiry from Google.'",
            "Connect with Philadelphia-area business owners, real estate agents, consultants",
            "Comment on posts from Philly business communities — visibility without having to post daily",
          ],
        },
        {
          heading: "Facebook — still huge for local service businesses",
          items: [
            "Join every South Jersey and Philly local business Facebook group you can find",
            "Don't spam — answer questions, be helpful, only mention your services when genuinely relevant",
            "\"Recommend a web designer\" posts happen constantly in these groups — be active and visible",
            "Groups to join: South Jersey Business Network, Cherry Hill Business Community, NJ Small Business Owners, Philly Small Biz",
          ],
        },
      ],
    },
    {
      title: "⚡ Ways to Get Clients Fast — First 30 Days",
      color: "#34D399",
      bg: "rgba(52,211,153,0.06)",
      border: "rgba(52,211,153,0.15)",
      content: [
        {
          heading: "Direct outreach — highest conversion rate",
          items: [
            "Google \"[city] [business type]\" and find businesses with bad or no websites — message them directly on Instagram or Facebook",
            "Walk into local businesses in Cherry Hill, Haddonfield, Voorhees — introduce yourself, leave a card with your website URL",
            "Sample pitch: \"I noticed your website hasn't been updated in a while — I help businesses like yours get a modern site in 2 weeks. Here's what I built recently.\"",
            "Target restaurants in Philly — high volume, all need updated sites, most budgets are $500–$1,200",
            "Goal: reach out to 10 businesses per day. 10/day × 30 days = 300 contacts. At 3% close rate = 9 clients",
          ],
        },
        {
          heading: "Referral engine — cheapest client acquisition",
          items: [
            "Offer $100–$150 cash for every referral who signs — tell every client about it at kickoff",
            "After every project: send a handwritten thank-you note + referral card — memorable, costs $2",
            "Ask for the referral at peak happiness: the moment you launch their site",
            "\"Who else do you know that could use something like this?\" — ask it every single time",
          ],
        },
        {
          heading: "Local listings & platforms",
          items: [
            "Google Business Profile — set up immediately as a web designer in Cherry Hill / South Jersey. Free and drives local search.",
            "Yelp — list as a web designer in Cherry Hill, Philadelphia. Free tier is enough to start.",
            "Thumbtack and Bark.com — pay-per-lead, good for getting first clients fast ($50 budget goes far)",
            "Nextdoor — businesses post looking for services constantly, monitor your local area",
          ],
        },
        {
          heading: "Networking — underrated in 2026",
          items: [
            "South Jersey Chamber of Commerce events — every city has one, attend monthly, hand out cards",
            "BNI (Business Network International) — referral-focused, only one web designer per chapter allowed",
            "Philadelphia SCORE events — free org full of small business owners who need websites",
            "Cherry Hill Business Association, Mount Laurel Chamber — show up twice and you'll know everyone",
          ],
        },
      ],
    },
    {
      title: "💸 Discounts, Deals & Promotions That Work",
      color: "#FBBF24",
      bg: "rgba(251,191,36,0.06)",
      border: "rgba(251,191,36,0.15)",
      content: [
        {
          heading: "Launch offers — use now while building portfolio",
          items: [
            "\"First 3 clients this month get $200 off\" — creates urgency, fills your calendar fast",
            "\"Refer a friend — you both save $100\" — viral referral loop that costs you little",
            "\"Free SEO audit\" — low-barrier lead gen, easy upsell into a full build",
            "\"Free 1-page website for a local nonprofit\" — great portfolio piece + community goodwill",
          ],
        },
        {
          heading: "Seasonal promotions — Philly/NJ specific",
          items: [
            "January: \"New Year, New Website\" — businesses love the fresh-start narrative",
            "March/April: tax refund season — small business owners spend on growth here",
            "September: back-to-business push after summer — huge for restaurants and service businesses",
            "November/December: skip discounts — businesses panic-spend on marketing before year end, charge full rate",
          ],
        },
        {
          heading: "Bundling — increases average deal size",
          items: [
            "Website + logo design bundle: add $200–$400, feels like a deal to the client",
            "Website + 3 months of Growth Care at $149/mo — fast-tracks recurring revenue and gives client real SEO value",
            "Website + care plan: pitch the $99/mo Starter plan at every single project — most clients say yes when it's bundled at close",
            "\"Launch Package\" (site + logo + Google Business setup + social headers): charge $1,500+ for what takes you 2 extra hours",
          ],
        },
      ],
    },
    {
      title: "📣 Building Your Audience — First 100 Followers & Beyond",
      color: "#FB923C",
      bg: "rgba(251,146,60,0.06)",
      border: "rgba(251,146,60,0.15)",
      content: [
        {
          heading: "Instagram growth tactics",
          items: [
            "Follow and genuinely engage with every South Jersey and Philly small business you can find — many follow back",
            "Comment on local business posts: \"Love what you do at [business] — your site could really show that off\" — soft pitch, high response rate",
            "Start with your personal network: post your site launch and APEX demo on your personal Instagram, ask friends to share",
            "Collab: offer a discounted or free site to a popular local business or influencer in exchange for a shoutout to their audience",
            "Consistency wins — 30 days of daily posts gets you to 200–500 followers minimum",
          ],
        },
        {
          heading: "Content that gets shared in this region",
          items: [
            "\"South Jersey businesses doing it right online\" — feature locals, they share it to their audiences",
            "\"Philly small business spotlight\" — tag them, their followers see your name",
            "\"Before/after: I rebuilt this Cherry Hill business's website\" — local specificity = shareable",
            "\"Website red flags every business owner should know\" — everyone shares this with their network",
          ],
        },
      ],
    },
    {
      title: "🗺️ Philly Tri-State Specific Playbook",
      color: "#EC4899",
      bg: "rgba(236,72,153,0.06)",
      border: "rgba(236,72,153,0.15)",
      content: [
        {
          heading: "Philadelphia — 20 min away, use it",
          items: [
            "Fishtown, Northern Liberties, Manayunk — constantly opening restaurants, studios, boutiques — all need sites",
            "Check Philly Instagram tags: #phillybusiness #phillyrestaurant — every tagged business is a potential lead",
            "Center City service businesses (law firms, accountants, consultants) — higher budgets, want polished sites",
            "Philly Startup Leaders community — small agencies and startups frequently need web work",
          ],
        },
        {
          heading: "South Jersey sweet spots",
          items: [
            "Cherry Hill: highest concentration of small businesses in South Jersey, affluent clientele, strong budgets",
            "Voorhees / Marlton: med spas, dental offices, fitness studios — can all pay $1,200+ and want quality",
            "Haddonfield / Moorestown: boutique retail, upscale restaurants — image-conscious, will pay for premium",
            "Medford / Medford Lakes: newer businesses, less competition from other designers",
          ],
        },
        {
          heading: "Delaware — seriously underrated",
          items: [
            "Wilmington has a massive financial/corporate sector — bigger budgets than typical small business",
            "Newark (near U of Delaware): tons of young businesses with modern taste and startup energy",
            "No sales tax in Delaware — businesses there are used to spending and less price-sensitive",
            "Far less competition than Philly or NJ — you could own this market quickly",
          ],
        },
        {
          heading: "Best industries in this region",
          items: [
            "Restaurants & bars (highest volume, fastest decisions) — South Philly, Fishtown, Cherry Hill",
            "Med spas & beauty (fastest growing, high budgets) — Voorhees, Marlton, Main Line PA",
            "Real estate agents (recurring needs, referral machines) — Cherry Hill, Moorestown, Philly suburbs",
            "Contractors & home services (almost always have terrible sites) — all of South Jersey",
            "Fitness studios & personal trainers (you have a demo site for this already) — everywhere",
          ],
        },
      ],
    },
    {
      title: "📆 30-Day Action Plan",
      color: "#34D399",
      bg: "rgba(52,211,153,0.06)",
      border: "rgba(52,211,153,0.15)",
      content: [
        {
          heading: "Week 1 — Foundation",
          items: [
            "Set up Google Business Profile as a web designer in Cherry Hill / South Jersey",
            "Create Instagram, TikTok, LinkedIn with the same handle everywhere",
            "Post your personal site launch + APEX demo on all platforms",
            "Join 5 South Jersey + 5 Philly Facebook business groups",
            "List on Thumbtack and Bark.com with a $50 starting budget",
          ],
        },
        {
          heading: "Week 2 — Outreach",
          items: [
            "Identify 50 local businesses with bad or no websites via Google Maps",
            "Send 10 DMs per day on Instagram or Facebook — keep messages short and specific",
            "Attend 1 local chamber or networking event this week",
            "Post 1 Reel or TikTok showing a build or before/after",
            "Ask 5 people in your personal network directly for a referral",
          ],
        },
        {
          heading: "Week 3 — Content + Momentum",
          items: [
            "Post a South Jersey business spotlight featuring a local business — tag them",
            "Create a lead magnet post: \"5 things your website is costing you\" as a carousel",
            "Follow up on all week 2 outreach that didn't respond",
            "Film a screen-recorded time-lapse of the APEX site build — post as a Reel",
            "Aim to land your first paid project — even $500 starts the momentum",
          ],
        },
        {
          heading: "Week 4 — Close & Systematize",
          items: [
            "Close 1–2 clients — collect deposit, start work",
            "Ask every new client for a Google review immediately after they sign",
            "Build a weekly content schedule you can actually maintain going forward",
            "Document what's working in outreach — double down on it",
            "End-of-month goal: 1 paying client, 200+ Instagram followers, 50+ Google Maps profile views",
          ],
        },
      ],
    },
    {
      title: "🛠️ How to Deliver Each Care Plan (With Your Tools)",
      color: "#34D399",
      bg: "rgba(52,211,153,0.06)",
      border: "rgba(52,211,153,0.15)",
      content: [
        {
          heading: "Basic — $49/mo (fully passive, $0 cost)",
          items: [
            "Vercel: deploy the site once, connect the client's domain — SSL is automatic, deploys run on git push",
            "GitHub: every commit is a versioned backup — no separate backup tool needed",
            "Uptime: Vercel's free tier shows uptime and alerts. Zero config required.",
            "Domain: client buys their own, or you buy it at cost + $10/yr markup — either is fine",
            "Your monthly effort: literally 0 hours unless something breaks. Pure margin.",
          ],
        },
        {
          heading: "Starter — $99/mo (1 hr edits, Claude does the work)",
          items: [
            "Client emails or texts a request (text change, new image, new section) — you handle it within 48hrs",
            "Open the project in Claude Code, describe the change — Claude writes the code in minutes",
            "Push to GitHub → Vercel auto-deploys in ~30 seconds. Done.",
            "Track time per client. 1 hr is the included limit — anything extra is billed at your hourly rate",
            "Monthly: send a 3-line email: 'Here's what changed this month. Let me know if you need anything.' Clients love the communication.",
            "Real math: $99 × 10 clients = $990/mo passive. At avg 30 min/client that's $198/hr effective rate.",
          ],
        },
        {
          heading: "Growth — $149/mo (SEO report = the reason clients stay)",
          items: [
            "Step 1: Set up Google Search Console on the client's site (free, 10 min one-time setup) — gives you keywords, impressions, clicks, ranking positions",
            "Step 2: Enable Vercel Analytics (free tier) — Core Web Vitals, page views, top pages",
            "Step 3: Each month, export/screenshot the GSC data + Vercel performance numbers",
            "Step 4: Paste into Claude with: 'Generate a professional monthly SEO report for [Client Name] based on this data' — Claude produces a clean, readable report in 60 seconds",
            "Step 5: Send the report as a PDF or Google Doc. Clients see real numbers and feel like they have an agency, not a freelancer.",
            "Supabase: optional — store month-over-month metrics in a simple table so you can show trend data over time. Impressive at the 3-month mark.",
            "Real math: $149 × 10 clients = $1,490/mo. At ~2 hrs/client that's $74/hr — but the perceived value is $300/hr+ to the client.",
          ],
        },
        {
          heading: "Upsell playbook — turning one-time builds into recurring revenue",
          items: [
            "At project kickoff: mention the care plan as part of your onboarding — 'After launch, I offer three support plans. Most clients go with the $99 Starter.'",
            "At launch: pitch the plan at peak client happiness — the moment the site goes live, they're most likely to say yes",
            "Frame it as protection: 'For $99/month I make sure the site stays fast, secure, and updated — without you having to think about it'",
            "Annual option: offer $990/yr for Starter ($99 × 10 = they save 2 months). $1,490/yr for Growth. Upfront cash = better for your cash flow.",
            "Goal: every project should end with a signed care plan. 10 clients at $99 = $990/mo recurring before you land client 11.",
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5">
        <p className="text-white font-black text-[17px] mb-1">📣 Marketing Playbook</p>
        <p className="text-white/40 text-[13px]">Your complete strategy for landing clients in South Jersey, Philadelphia, and the tri-state area.</p>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="rounded-2xl border overflow-hidden" style={{ borderColor: section.border, background: section.bg }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: section.border }}>
            <p className="text-white font-black text-[15px]">{section.title}</p>
          </div>
          <div className="p-5 grid md:grid-cols-2 gap-6">
            {section.content.map((block) => (
              <div key={block.heading}>
                <p className="text-[11px] uppercase tracking-widest font-bold mb-3" style={{ color: section.color }}>{block.heading}</p>
                <ul className="space-y-2">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/65 leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: section.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
