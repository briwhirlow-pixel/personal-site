'use client';

import { useState } from 'react';
import {
  Megaphone,
  Target,
  Lightbulb,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Instagram,
  Globe,
  Users,
  Zap,
} from 'lucide-react';

const BLUE = '#0EA5E9';
const STORAGE_KEY = 'bbb-marketing-data';

interface Strategy {
  id: string;
  title: string;
  channel: string;
  status: 'idea' | 'active' | 'done';
  tasks: { id: string; text: string; done: boolean }[];
  notes: string;
}

const channelIcons: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  social: Instagram,
  seo: Globe,
  outreach: Users,
  content: Lightbulb,
  other: Zap,
};

const channelLabels: Record<string, string> = {
  social: 'Social Media',
  seo: 'SEO',
  outreach: 'Outreach',
  content: 'Content',
  other: 'Other',
};

const statusColors: Record<string, string> = {
  idea: '#A78BFA',
  active: '#0EA5E9',
  done: '#22C55E',
};

function loadData(): Strategy[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultStrategies();
  } catch {
    return defaultStrategies();
  }
}

function saveData(data: Strategy[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultStrategies(): Strategy[] {
  return [
    {
      id: uid(),
      title: 'Instagram Portfolio Posts',
      channel: 'social',
      status: 'active',
      tasks: [
        { id: uid(), text: 'Post 3 project showcases per week', done: false },
        { id: uid(), text: 'Create before/after carousel', done: false },
        { id: uid(), text: 'Write client testimonial graphics', done: false },
      ],
      notes: 'Focus on local businesses in South Jersey + Philly area',
    },
    {
      id: uid(),
      title: 'Google Business Profile',
      channel: 'seo',
      status: 'idea',
      tasks: [
        { id: uid(), text: 'Set up Google Business Profile', done: false },
        { id: uid(), text: 'Collect 5-star reviews from past clients', done: false },
        { id: uid(), text: 'Post weekly updates', done: false },
      ],
      notes: '',
    },
    {
      id: uid(),
      title: 'Local Business Outreach',
      channel: 'outreach',
      status: 'idea',
      tasks: [
        { id: uid(), text: 'Identify 20 local businesses with bad websites', done: false },
        { id: uid(), text: 'Create personalized audit for each', done: false },
        { id: uid(), text: 'Send cold email with free audit offer', done: false },
      ],
      notes: 'Target restaurants, salons, gyms in the area',
    },
  ];
}

export default function MarketingPage() {
  const [strategies, setStrategies] = useState<Strategy[]>(loadData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('social');

  function update(updated: Strategy[]) {
    setStrategies(updated);
    saveData(updated);
  }

  function addStrategy() {
    if (!newTitle.trim()) return;
    const s: Strategy = {
      id: uid(),
      title: newTitle.trim(),
      channel: newChannel,
      status: 'idea',
      tasks: [],
      notes: '',
    };
    update([s, ...strategies]);
    setNewTitle('');
    setShowAdd(false);
    setExpandedId(s.id);
  }

  function removeStrategy(id: string) {
    update(strategies.filter(s => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function toggleTask(stratId: string, taskId: string) {
    update(strategies.map(s =>
      s.id === stratId
        ? { ...s, tasks: s.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }
        : s
    ));
  }

  function addTask(stratId: string, text: string) {
    update(strategies.map(s =>
      s.id === stratId
        ? { ...s, tasks: [...s.tasks, { id: uid(), text, done: false }] }
        : s
    ));
  }

  function updateStatus(id: string, status: Strategy['status']) {
    update(strategies.map(s => s.id === id ? { ...s, status } : s));
  }

  function updateNotes(id: string, notes: string) {
    update(strategies.map(s => s.id === id ? { ...s, notes } : s));
  }

  const byStatus = {
    active: strategies.filter(s => s.status === 'active'),
    idea: strategies.filter(s => s.status === 'idea'),
    done: strategies.filter(s => s.status === 'done'),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1
          className="font-display font-extrabold tracking-[-0.025em] text-[24px] sm:text-[28px]"
          style={{ color: '#F0ECE4' }}
        >
          Marketing
        </h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors active:scale-[0.97]"
          style={{ background: `${BLUE}18`, color: BLUE, minHeight: 40 }}
        >
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl p-4 mb-4" style={{ background: '#1A1815' }}>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Strategy name..."
            autoFocus
            className="w-full rounded-lg border-0 px-3 py-2.5 text-[14px] mb-3 focus:outline-none focus:ring-1"
            style={{
              background: '#0E0C0A',
              color: '#F0ECE4',
              fontSize: 16,
              // @ts-expect-error ring
              '--tw-ring-color': BLUE,
            }}
          />
          <div className="flex gap-1.5 flex-wrap mb-3">
            {Object.entries(channelLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setNewChannel(key)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                style={{
                  background: newChannel === key ? `${BLUE}20` : 'rgba(240,236,228,0.05)',
                  color: newChannel === key ? BLUE : 'rgba(240,236,228,0.4)',
                  minHeight: 36,
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={addStrategy}
              disabled={!newTitle.trim()}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold disabled:opacity-30"
              style={{ background: BLUE, color: '#0E0C0A' }}
            >
              Create
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewTitle(''); }}
              className="px-4 py-2 rounded-lg text-[13px] font-semibold"
              style={{ color: 'rgba(240,236,228,0.4)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Summary chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
        {(['active', 'idea', 'done'] as const).map(s => (
          <div key={s} className="shrink-0 rounded-xl px-4 py-3 min-w-[100px]" style={{ background: '#1A1815' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider capitalize" style={{ color: statusColors[s] }}>
              {s}
            </p>
            <p className="font-display font-extrabold text-[20px] mt-0.5" style={{ color: '#F0ECE4' }}>
              {byStatus[s].length}
            </p>
          </div>
        ))}
      </div>

      {/* Strategies list */}
      {strategies.length === 0 ? (
        <div className="rounded-xl p-10 text-center" style={{ background: '#1A1815' }}>
          <Megaphone size={28} style={{ color: 'rgba(240,236,228,0.15)' }} className="mx-auto mb-2" />
          <p className="text-[14px]" style={{ color: 'rgba(240,236,228,0.3)' }}>No strategies yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {strategies.map(strat => {
            const expanded = expandedId === strat.id;
            const ChannelIcon = channelIcons[strat.channel] || Zap;
            const color = statusColors[strat.status];
            const doneTasks = strat.tasks.filter(t => t.done).length;

            return (
              <div key={strat.id} className="rounded-xl overflow-hidden" style={{ background: '#1A1815' }}>
                <button
                  onClick={() => setExpandedId(expanded ? null : strat.id)}
                  className="w-full flex items-center gap-3 p-3.5 text-left active:bg-white/[0.02]"
                  style={{ minHeight: 56 }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <ChannelIcon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate" style={{ color: '#F0ECE4' }}>
                      {strat.title}
                    </p>
                    <p className="text-[11px]" style={{ color: 'rgba(240,236,228,0.4)' }}>
                      {channelLabels[strat.channel]}
                      {strat.tasks.length > 0 ? ` · ${doneTasks}/${strat.tasks.length} tasks` : ''}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0"
                    style={{ background: `${color}20`, color }}
                  >
                    {strat.status}
                  </span>
                  {expanded ? (
                    <ChevronUp size={16} style={{ color: 'rgba(240,236,228,0.2)' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'rgba(240,236,228,0.2)' }} />
                  )}
                </button>

                {expanded && (
                  <div className="px-3.5 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid rgba(240,236,228,0.06)' }}>
                    {/* Status toggle */}
                    <div className="flex gap-1.5">
                      {(['idea', 'active', 'done'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(strat.id, s)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors"
                          style={{
                            background: strat.status === s ? `${statusColors[s]}25` : 'rgba(240,236,228,0.05)',
                            color: strat.status === s ? statusColors[s] : 'rgba(240,236,228,0.35)',
                            minHeight: 36,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Tasks */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(240,236,228,0.3)' }}>
                        Tasks
                      </p>
                      <div className="space-y-1">
                        {strat.tasks.map(task => (
                          <button
                            key={task.id}
                            onClick={() => toggleTask(strat.id, task.id)}
                            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left active:bg-white/[0.02]"
                            style={{ background: '#0E0C0A', minHeight: 44 }}
                          >
                            {task.done ? (
                              <CheckCircle2 size={16} style={{ color: '#22C55E' }} className="shrink-0" />
                            ) : (
                              <Circle size={16} style={{ color: 'rgba(240,236,228,0.2)' }} className="shrink-0" />
                            )}
                            <span
                              className="text-[13px]"
                              style={{
                                color: task.done ? 'rgba(240,236,228,0.3)' : 'rgba(240,236,228,0.7)',
                                textDecoration: task.done ? 'line-through' : 'none',
                              }}
                            >
                              {task.text}
                            </span>
                          </button>
                        ))}
                      </div>
                      <AddTaskInline onAdd={text => addTask(strat.id, text)} />
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(240,236,228,0.3)' }}>
                        Notes
                      </p>
                      <textarea
                        value={strat.notes}
                        onChange={e => updateNotes(strat.id, e.target.value)}
                        rows={2}
                        placeholder="Add notes..."
                        className="w-full rounded-lg border-0 p-3 text-[13px] resize-none focus:outline-none focus:ring-1"
                        style={{
                          background: '#0E0C0A',
                          color: '#F0ECE4',
                          fontSize: 16,
                          // @ts-expect-error ring
                          '--tw-ring-color': 'rgba(14,165,233,0.3)',
                        }}
                      />
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeStrategy(strat.id)}
                      className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                      style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}
                    >
                      <Trash2 size={12} /> Remove strategy
                    </button>
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

function AddTaskInline({ onAdd }: { onAdd: (text: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="flex items-center gap-1.5 mt-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
        style={{ color: 'rgba(240,236,228,0.3)' }}
      >
        <Plus size={13} /> Add task
      </button>
    );
  }

  return (
    <div className="flex gap-2 mt-1.5">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New task..."
        autoFocus
        onKeyDown={e => {
          if (e.key === 'Enter' && text.trim()) { onAdd(text.trim()); setText(''); }
          if (e.key === 'Escape') { setAdding(false); setText(''); }
        }}
        className="flex-1 rounded-lg border-0 px-3 py-2 text-[13px] focus:outline-none focus:ring-1"
        style={{
          background: '#0E0C0A',
          color: '#F0ECE4',
          fontSize: 16,
          // @ts-expect-error ring
          '--tw-ring-color': BLUE,
        }}
      />
      <button
        onClick={() => { if (text.trim()) { onAdd(text.trim()); setText(''); } }}
        className="px-3 py-2 rounded-lg text-[12px] font-semibold"
        style={{ background: `${BLUE}20`, color: BLUE }}
      >
        Add
      </button>
    </div>
  );
}
