'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FolderKanban,
  Globe,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

const BLUE = '#0EA5E9';
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

interface Project {
  id: string;
  name: string;
  client_name: string;
  client_email: string;
  agreed_budget: number | null;
  start_date: string | null;
  deadline: string | null;
  status: string;
  site_url: string | null;
  notes: string | null;
  monthly_rate: number | null;
  hosting_status: string | null;
  created_at: string;
}

const phaseColors: Record<string, string> = {
  discovery: '#A78BFA',
  building: '#0EA5E9',
  review: '#F59E0B',
  launched: '#22C55E',
};

const phaseLabels: Record<string, string> = {
  discovery: 'Discovery',
  building: 'Building',
  review: 'Review',
  launched: 'Launched',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error('Failed to load projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  if (error) {
    return (
      <div className="rounded-xl p-8 text-center mt-8" style={{ background: '#1A1815' }}>
        <AlertCircle size={28} style={{ color: '#F87171' }} className="mx-auto mb-3" />
        <p className="text-[14px] font-semibold mb-1" style={{ color: '#F0ECE4' }}>Could not load projects</p>
        <p className="text-[13px] mb-4" style={{ color: 'rgba(240,236,228,0.5)' }}>{error}</p>
        <button
          onClick={() => { setError(''); setLoading(true); fetchProjects(); }}
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
        Projects
      </h1>

      {/* Phase summary */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 no-scrollbar">
        {Object.entries(phaseLabels).map(([key, label]) => {
          const count = projects.filter(p => p.status === key).length;
          return (
            <div
              key={key}
              className="shrink-0 rounded-xl px-4 py-3 min-w-[100px]"
              style={{ background: '#1A1815' }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: phaseColors[key] }}>
                {label}
              </p>
              <p className="font-display font-extrabold text-[20px] mt-0.5" style={{ color: '#F0ECE4' }}>
                {count}
              </p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-xl h-16 animate-pulse" style={{ background: '#1A1815' }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl p-10 text-center" style={{ background: '#1A1815' }}>
          <FolderKanban size={28} style={{ color: 'rgba(240,236,228,0.15)' }} className="mx-auto mb-2" />
          <p className="text-[14px]" style={{ color: 'rgba(240,236,228,0.45)' }}>
            No projects yet — won leads appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map(project => {
            const expanded = expandedId === project.id;
            const color = phaseColors[project.status] || BLUE;

            return (
              <div key={project.id} className="rounded-xl overflow-hidden" style={{ background: '#1A1815' }}>
                <button
                  onClick={() => setExpandedId(expanded ? null : project.id)}
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
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <FolderKanban size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate" style={{ color: '#F0ECE4' }}>
                      {project.name}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(240,236,228,0.45)' }}>
                      {project.client_name}
                      {project.agreed_budget ? ` / $${project.agreed_budget.toLocaleString()}` : ''}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0"
                    style={{ background: `${color}20`, color }}
                  >
                    {phaseLabels[project.status] || project.status}
                  </span>
                  {expanded ? (
                    <ChevronUp size={16} style={{ color: 'rgba(240,236,228,0.3)' }} className="shrink-0" />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'rgba(240,236,228,0.3)' }} className="shrink-0" />
                  )}
                </button>

                {expanded && (
                  <div className="px-3.5 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid rgba(240,236,228,0.06)' }}>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoCell icon={DollarSign} label="Budget" value={project.agreed_budget ? `$${project.agreed_budget.toLocaleString()}` : '—'} />
                      <InfoCell icon={Calendar} label="Deadline" value={formatDate(project.deadline)} />
                      <InfoCell icon={Calendar} label="Started" value={formatDate(project.start_date)} />
                      <InfoCell icon={DollarSign} label="Monthly" value={project.monthly_rate ? `$${project.monthly_rate}/mo` : '—'} />
                    </div>

                    {project.site_url && (
                      <a
                        href={project.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium focus:outline-none focus-visible:ring-2"
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
                        <Globe size={14} />
                        {project.site_url.replace(/^https?:\/\//, '')}
                        <ExternalLink size={12} className="ml-auto" style={{ color: 'rgba(14,165,233,0.5)' }} />
                      </a>
                    )}

                    {project.notes && (
                      <div className="rounded-lg p-3" style={{ background: '#0E0C0A' }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(240,236,228,0.35)' }}>
                          Notes
                        </p>
                        <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(240,236,228,0.7)' }}>
                          {project.notes}
                        </p>
                      </div>
                    )}
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

function InfoCell({
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
