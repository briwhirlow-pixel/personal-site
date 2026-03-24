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
        <button onClick={() => { localStorage.removeItem("admin_token"); setToken(null); }}
          className="text-white/30 hover:text-white text-[13px] transition">
          Sign out
        </button>
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
                  <div key={p.id} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-5 flex items-center gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-white font-bold text-[15px] truncate">{p.name}</p>
                        <ProjectBadge status={p.status} />
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
                      {p.deadline && (
                        <div>
                          <p className="text-white/20 text-[10px] uppercase tracking-widest mb-0.5">Deadline</p>
                          <p className="text-white text-[14px] font-semibold">{new Date(p.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {PROJECT_STATUSES.map(s => (
                        <button key={s.key} title={s.label}
                          onClick={async () => {
                            const res = await fetch(`/api/admin/projects/${p.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ status: s.key }),
                            });
                            if (res.ok) {
                              const updated = await res.json();
                              setProjects(ps => ps.map(x => x.id === p.id ? updated : x));
                            }
                          }}
                          className="w-7 h-7 rounded-full border-2 transition hover:scale-110"
                          style={{
                            borderColor: s.color,
                            background: p.status === s.key ? s.color : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  </div>
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
