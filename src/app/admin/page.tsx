'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Inbox,
  Clock,
  ChevronRight,
  Megaphone,
} from 'lucide-react';

const BLUE = '#0EA5E9';

interface Stats {
  newLeads: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  totalLeads: number;
  activeProjects: number;
  launchedProjects: number;
  totalRevenue: number;
  monthlyRecurring: number;
  pipelineByStatus: Record<string, number>;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  website_type: string;
  budget: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: '#0EA5E9',
  contacted: '#A78BFA',
  call_scheduled: '#F59E0B',
  proposal_sent: '#FB923C',
  won: '#22C55E',
  lost: '#EF4444',
  archived: '#6B7280',
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/leads').then(r => r.json()),
    ]).then(([s, l]) => {
      setStats(s);
      setLeads(Array.isArray(l) ? l.slice(0, 5) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: BLUE, borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1
          className="font-display font-extrabold tracking-[-0.025em] text-[24px] sm:text-[28px]"
          style={{ color: '#F0ECE4' }}
        >
          Dashboard
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(240,236,228,0.4)' }}>
          Welcome back, Brian
        </p>
      </div>

      {/* Stat cards — 2x2 on mobile, 4 across on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Inbox}
          label="New Leads"
          value={stats?.newLeads ?? 0}
          sub={`${stats?.leadsThisWeek ?? 0} this week`}
          accent={BLUE}
        />
        <StatCard
          icon={FolderKanban}
          label="Active Projects"
          value={stats?.activeProjects ?? 0}
          sub={`${stats?.launchedProjects ?? 0} launched`}
          accent="#22C55E"
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          sub="All time paid"
          accent="#F59E0B"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly Recurring"
          value={`$${(stats?.monthlyRecurring ?? 0).toLocaleString()}`}
          sub="Active hosting"
          accent="#A78BFA"
        />
      </div>

      {/* Pipeline bar */}
      {stats && (stats.totalLeads > 0) && (
        <div className="mt-6 rounded-xl p-4" style={{ background: '#1A1815' }}>
          <p className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(240,236,228,0.4)' }}>
            Pipeline
          </p>
          <div className="flex rounded-lg overflow-hidden h-3 gap-0.5">
            {Object.entries(stats.pipelineByStatus).map(([status, count]) => {
              if (!count) return null;
              const pct = (count / stats.totalLeads) * 100;
              return (
                <div
                  key={status}
                  className="rounded-sm"
                  style={{
                    width: `${Math.max(pct, 4)}%`,
                    background: statusColors[status] || '#6B7280',
                  }}
                  title={`${status}: ${count}`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {Object.entries(stats.pipelineByStatus).map(([status, count]) => {
              if (!count) return null;
              return (
                <span key={status} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(240,236,228,0.5)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: statusColors[status] }} />
                  {status.replace('_', ' ')} ({count})
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent leads */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold" style={{ color: 'rgba(240,236,228,0.6)' }}>
            Recent Leads
          </p>
          <Link
            href="/admin/leads"
            className="flex items-center gap-1 text-[12px] font-medium transition-colors"
            style={{ color: BLUE }}
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        <div className="space-y-2">
          {leads.length === 0 && (
            <div
              className="rounded-xl p-8 text-center"
              style={{ background: '#1A1815' }}
            >
              <Users size={28} style={{ color: 'rgba(240,236,228,0.15)' }} className="mx-auto mb-2" />
              <p className="text-[13px]" style={{ color: 'rgba(240,236,228,0.3)' }}>No leads yet</p>
            </div>
          )}
          {leads.map(lead => (
            <Link
              key={lead.id}
              href="/admin/leads"
              className="flex items-center gap-3 rounded-xl p-3.5 transition-colors active:scale-[0.99]"
              style={{ background: '#1A1815' }}
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
                <p className="text-[11px] truncate" style={{ color: 'rgba(240,236,228,0.4)' }}>
                  {lead.website_type}{lead.budget ? ` · ${lead.budget}` : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                  style={{
                    background: `${statusColors[lead.status] || '#6B7280'}20`,
                    color: statusColors[lead.status] || '#6B7280',
                  }}
                >
                  {lead.status?.replace('_', ' ')}
                </span>
                <p className="text-[10px] mt-0.5 flex items-center justify-end gap-1" style={{ color: 'rgba(240,236,228,0.25)' }}>
                  <Clock size={9} /> {timeAgo(lead.created_at)}
                </p>
              </div>
              <ChevronRight size={16} style={{ color: 'rgba(240,236,228,0.15)' }} className="shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/admin/leads"
          className="rounded-xl p-4 flex items-center gap-3 transition-colors active:scale-[0.98]"
          style={{ background: '#1A1815', border: '1px solid rgba(14,165,233,0.15)' }}
        >
          <Users size={20} style={{ color: BLUE }} />
          <span className="text-[13px] font-semibold" style={{ color: '#F0ECE4' }}>Manage Leads</span>
        </Link>
        <Link
          href="/admin/marketing"
          className="rounded-xl p-4 flex items-center gap-3 transition-colors active:scale-[0.98]"
          style={{ background: '#1A1815', border: '1px solid rgba(240,236,228,0.06)' }}
        >
          <Megaphone size={20} style={{ color: '#F59E0B' }} />
          <span className="text-[13px] font-semibold" style={{ color: '#F0ECE4' }}>Marketing</span>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  sub: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#1A1815' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'rgba(240,236,228,0.4)' }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}15` }}
        >
          <Icon size={16} strokeWidth={1.75} style={{ color: accent }} />
        </div>
      </div>
      <p className="font-display font-extrabold text-[22px] sm:text-[26px] tracking-[-0.02em]" style={{ color: '#F0ECE4' }}>
        {value}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(240,236,228,0.3)' }}>
        {sub}
      </p>
    </div>
  );
}
