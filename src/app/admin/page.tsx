"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type LeadStatus = "new" | "contacted" | "call_scheduled" | "proposal_sent" | "won" | "lost";
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

function ProjectCard({ p, token, onStatusChange, onUpdate }: {
  p: Project; token: string;
  onStatusChange: (id: string, status: ProjectStatus) => void;
  onUpdate: (p: Project) => void;
}) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
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
    <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl overflow-hidden">
      {/* Row */}
      <div className="p-5 flex items-center gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
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
        </div>
        <div className="hidden md:flex items-center gap-6 text-right flex-shrink-0">
          {p.agreed_budget && (
            <div>
              <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">Budget</p>
              <p className="text-white text-[14px] font-semibold">{p.agreed_budget}</p>
            </div>
          )}
          {p.delivery_type === "managed" && p.monthly_rate && (
            <div>
              <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">MRR</p>
              <p className="text-green-400 text-[14px] font-semibold">${p.monthly_rate}/mo</p>
            </div>
          )}
          {daysLeft !== null && p.delivery_type === "handoff" && (
            <div>
              <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">Expires</p>
              <p className={`text-[14px] font-semibold ${daysLeft <= 7 ? "text-red-400" : "text-amber-400"}`}>{daysLeft}d left</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex gap-2">
            {PROJECT_STATUSES.map(s => (
              <button key={s.key} title={s.label} onClick={() => onStatusChange(p.id, s.key)}
                className="w-7 h-7 rounded-full border-2 transition hover:scale-110"
                style={{ borderColor: s.color, background: p.status === s.key ? s.color : "transparent" }} />
            ))}
          </div>
          <button onClick={() => setOpen(o => !o)}
            className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition">
            {open ? "▲ Close" : "📦 Delivery"}
          </button>
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
        </div>
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
        <div className="p-6 border-t border-[#2A2D3A] flex gap-3">
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
  const [tab, setTab] = useState<"pipeline" | "projects">("pipeline");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectLead, setNewProjectLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Check for saved token on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchData = useCallback(async (t: string) => {
    setLoading(true);
    const [leadsRes, projRes] = await Promise.all([
      fetch("/api/admin/leads", { headers: { Authorization: `Bearer ${t}` } }),
      fetch("/api/admin/projects", { headers: { Authorization: `Bearer ${t}` } }),
    ]);
    if (leadsRes.status === 401) { localStorage.removeItem("admin_token"); setToken(null); return; }
    try {
      const leadsData = await leadsRes.json();
      const projData = await projRes.json();
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setProjects(Array.isArray(projData) ? projData : []);
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
          <button onClick={() => { localStorage.removeItem("admin_token"); setToken(null); }}
            className="text-white/30 hover:text-white text-[13px] transition">
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
        <div className="flex gap-1 mb-6 bg-[#1A1D27] rounded-xl p-1 w-fit border border-[#2A2D3A]">
          {(["pipeline", "projects"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition capitalize ${
                tab === t ? "bg-[#2563EB] text-white" : "text-white/40 hover:text-white"
              }`}>
              {t === "pipeline" ? `Pipeline (${leads.length})` : `Projects (${projects.length})`}
            </button>
          ))}
        </div>

        {/* Pipeline view */}
        {tab === "pipeline" && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {LEAD_STATUSES.map(s => {
              const colLeads = leads.filter(l => l.status === s.key);
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
                  <ProjectCard key={p.id} p={p} token={token}
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
