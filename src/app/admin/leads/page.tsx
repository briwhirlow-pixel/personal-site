'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Phone,
  Mail,
  Globe,
  DollarSign,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

const BLUE = '#0EA5E9';
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  website_type: string;
  budget: string;
  launch_date: string;
  message: string;
  status: string;
  notes: string;
  discount_type: string | null;
  discount_value: number | null;
  discount_note: string | null;
  created_at: string;
  updated_at: string;
}

const statuses = ['all', 'new', 'contacted', 'call_scheduled', 'proposal_sent', 'won', 'lost', 'archived'] as const;

const statusColors: Record<string, string> = {
  new: '#0EA5E9',
  contacted: '#A78BFA',
  call_scheduled: '#F59E0B',
  proposal_sent: '#FB923C',
  won: '#22C55E',
  lost: '#EF4444',
  archived: '#6B7280',
};

const statusLabels: Record<string, string> = {
  all: 'All',
  new: 'New',
  contacted: 'Contacted',
  call_scheduled: 'Call Set',
  proposal_sent: 'Proposal',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<Record<string, string>>({});

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) throw new Error('Failed to load leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateLead(id: string, updates: Partial<Lead>) {
    setUpdating(id);
    const res = await fetch('/api/admin/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLeads(prev => prev.map(l => l.id === id ? updated : l));
    }
    setUpdating(null);
  }

  const filtered = leads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.website_type?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (error) {
    return (
      <div className="rounded-xl p-8 text-center mt-8" style={{ background: '#1A1815' }}>
        <AlertCircle size={28} style={{ color: '#F87171' }} className="mx-auto mb-3" />
        <p className="text-[14px] font-semibold mb-1" style={{ color: '#F0ECE4' }}>Could not load leads</p>
        <p className="text-[13px] mb-4" style={{ color: 'rgba(240,236,228,0.5)' }}>{error}</p>
        <button
          onClick={() => { setError(''); setLoading(true); fetchLeads(); }}
          className="px-4 py-2 rounded-lg text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
          style={{ background: `${BLUE}18`, color: BLUE, '--tw-ring-color': BLUE } as React.CSSProperties}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="font-display font-extrabold tracking-[-0.025em] text-[24px] sm:text-[28px] mb-5"
        style={{ color: '#F0ECE4' }}
      >
        Leads
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'rgba(240,236,228,0.35)' }}
        />
        <input
          type="search"
          placeholder="Search leads..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border-0 pl-10 pr-4 py-3 text-[16px] focus:outline-none focus-visible:ring-2"
          style={{
            background: '#1A1815',
            color: '#F0ECE4',
            caretColor: BLUE,
            '--tw-ring-color': BLUE,
          } as React.CSSProperties}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1 no-scrollbar">
        {statuses.map(s => {
          const active = filter === s;
          const count = s === 'all' ? leads.length : leads.filter(l => l.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="shrink-0 px-3 py-2.5 rounded-lg text-[12px] font-semibold capitalize focus:outline-none focus-visible:ring-2"
              style={{
                background: active ? (s === 'all' ? 'rgba(240,236,228,0.1)' : `${statusColors[s]}20`) : 'transparent',
                color: active ? (s === 'all' ? '#F0ECE4' : statusColors[s]) : 'rgba(240,236,228,0.45)',
                minHeight: 44,
                transition: `background 200ms ${EASE}, color 200ms ${EASE}`,
                '--tw-ring-color': BLUE,
              } as React.CSSProperties}
            >
              {statusLabels[s]} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Leads list */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-xl h-16 animate-pulse" style={{ background: '#1A1815' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl p-10 text-center" style={{ background: '#1A1815' }}>
          <p className="text-[14px]" style={{ color: 'rgba(240,236,228,0.45)' }}>
            {search ? 'No matches' : 'No leads in this category'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => {
            const expanded = expandedId === lead.id;
            const isUpdating = updating === lead.id;

            return (
              <div
                key={lead.id}
                className="rounded-xl overflow-hidden"
                style={{ background: '#1A1815' }}
              >
                {/* Summary row */}
                <button
                  onClick={() => {
                    setExpandedId(expanded ? null : lead.id);
                    if (!expanded && !editNotes[lead.id]) {
                      setEditNotes(prev => ({ ...prev, [lead.id]: lead.notes || '' }));
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                  style={{
                    minHeight: 56,
                    transition: `background 200ms ${EASE}`,
                    '--tw-ring-color': BLUE,
                  } as React.CSSProperties}
                  onPointerDown={e => { e.currentTarget.style.background = 'rgba(240,236,228,0.02)'; }}
                  onPointerUp={e => { e.currentTarget.style.background = ''; }}
                  onPointerLeave={e => { e.currentTarget.style.background = ''; }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-semibold text-[14px]"
                    style={{
                      background: `${statusColors[lead.status] || BLUE}18`,
                      color: statusColors[lead.status] || BLUE,
                    }}
                  >
                    {lead.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate" style={{ color: '#F0ECE4' }}>
                      {lead.name}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(240,236,228,0.45)' }}>
                      {lead.website_type}{lead.budget ? ` / ${lead.budget}` : ''} / {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0"
                    style={{
                      background: `${statusColors[lead.status] || '#6B7280'}20`,
                      color: statusColors[lead.status] || '#6B7280',
                    }}
                  >
                    {lead.status?.replace('_', ' ')}
                  </span>
                  {expanded ? (
                    <ChevronUp size={16} style={{ color: 'rgba(240,236,228,0.3)' }} className="shrink-0" />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'rgba(240,236,228,0.3)' }} className="shrink-0" />
                  )}
                </button>

                {/* Expanded details */}
                {expanded && (
                  <div
                    className="px-3.5 pb-4 space-y-4"
                    style={{ borderTop: '1px solid rgba(240,236,228,0.06)' }}
                  >
                    {/* Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus-visible:ring-2"
                          style={{
                            background: '#0E0C0A',
                            color: BLUE,
                            minHeight: 44,
                            transition: `transform 150ms ${EASE}`,
                            '--tw-ring-color': BLUE,
                          } as React.CSSProperties}
                          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                          onPointerUp={e => { e.currentTarget.style.transform = ''; }}
                          onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
                        >
                          <Mail size={15} /> {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus-visible:ring-2"
                          style={{
                            background: '#0E0C0A',
                            color: '#22C55E',
                            minHeight: 44,
                            transition: `transform 150ms ${EASE}`,
                            '--tw-ring-color': '#22C55E',
                          } as React.CSSProperties}
                          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
                          onPointerUp={e => { e.currentTarget.style.transform = ''; }}
                          onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
                        >
                          <Phone size={15} /> {lead.phone}
                        </a>
                      )}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2">
                      <DetailChip icon={Globe} label="Type" value={lead.website_type} />
                      <DetailChip icon={DollarSign} label="Budget" value={lead.budget || 'Not set'} />
                      <DetailChip icon={Calendar} label="Launch" value={lead.launch_date || 'Flexible'} />
                      <DetailChip icon={Calendar} label="Submitted" value={formatDate(lead.created_at)} />
                    </div>

                    {/* Message */}
                    {lead.message && (
                      <div className="rounded-lg p-3" style={{ background: '#0E0C0A' }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(240,236,228,0.35)' }}>
                          Message
                        </p>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(240,236,228,0.7)' }}>
                          {lead.message}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'rgba(240,236,228,0.35)' }}>
                        <MessageSquare size={11} /> Notes
                      </label>
                      <textarea
                        value={editNotes[lead.id] ?? lead.notes ?? ''}
                        onChange={e => setEditNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        rows={2}
                        placeholder="Add notes..."
                        className="w-full rounded-lg border-0 p-3 resize-none focus:outline-none focus-visible:ring-1"
                        style={{
                          background: '#0E0C0A',
                          color: '#F0ECE4',
                          caretColor: BLUE,
                          fontSize: 16,
                          '--tw-ring-color': 'rgba(14,165,233,0.3)',
                        } as React.CSSProperties}
                      />
                      {(editNotes[lead.id] ?? '') !== (lead.notes ?? '') && (
                        <button
                          onClick={() => updateLead(lead.id, { notes: editNotes[lead.id] } as Partial<Lead>)}
                          disabled={isUpdating}
                          className="mt-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus-visible:ring-2"
                          style={{
                            background: `${BLUE}20`,
                            color: BLUE,
                            transition: `transform 150ms ${EASE}`,
                            '--tw-ring-color': BLUE,
                          } as React.CSSProperties}
                        >
                          {isUpdating ? 'Saving...' : 'Save notes'}
                        </button>
                      )}
                    </div>

                    {/* Status changer */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(240,236,228,0.35)' }}>
                        Update Status
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {statuses.filter(s => s !== 'all').map(s => (
                          <button
                            key={s}
                            onClick={() => updateLead(lead.id, { status: s } as Partial<Lead>)}
                            disabled={isUpdating || lead.status === s}
                            className="px-3 py-2.5 rounded-lg text-[11px] font-semibold capitalize disabled:opacity-30 focus:outline-none focus-visible:ring-2"
                            style={{
                              background: lead.status === s ? `${statusColors[s]}30` : 'rgba(240,236,228,0.05)',
                              color: lead.status === s ? statusColors[s] : 'rgba(240,236,228,0.45)',
                              minHeight: 44,
                              transition: `background 200ms ${EASE}`,
                              '--tw-ring-color': BLUE,
                            } as React.CSSProperties}
                          >
                            {statusLabels[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DetailChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg px-3 py-2" style={{ background: '#0E0C0A' }}>
      <p className="text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1" style={{ color: 'rgba(240,236,228,0.35)' }}>
        <Icon size={10} style={{ color: 'rgba(240,236,228,0.35)' }} /> {label}
      </p>
      <p className="text-[13px] font-medium mt-0.5 truncate" style={{ color: 'rgba(240,236,228,0.7)' }}>
        {value}
      </p>
    </div>
  );
}
