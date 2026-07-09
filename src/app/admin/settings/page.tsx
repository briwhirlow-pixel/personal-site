'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Mail,
  Save,
  Check,
  LogOut,
  Shield,
  Database,
  AlertCircle,
} from 'lucide-react';

const BLUE = '#0EA5E9';
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

interface SettingsMap {
  [key: string]: string;
}

const templateKeys = [
  { key: 'email_quote_subject', label: 'Email Subject', placeholder: 'New inquiry from {{firstName}}' },
  { key: 'email_quote_greeting', label: 'Greeting', placeholder: 'Hey {{firstName}}!' },
  { key: 'email_quote_intro', label: 'Intro Paragraph', placeholder: 'Thanks for reaching out about your {{websiteType}} project...' },
  { key: 'email_quote_closing', label: 'Closing', placeholder: 'Looking forward to chatting!' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to load settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.href = '/admin';
  }

  if (error) {
    return (
      <div className="rounded-xl p-8 text-center mt-8" style={{ background: '#1A1815' }}>
        <AlertCircle size={28} style={{ color: '#F87171' }} className="mx-auto mb-3" />
        <p className="text-[14px] font-semibold mb-1" style={{ color: '#F0ECE4' }}>Could not load settings</p>
        <p className="text-[13px] mb-4" style={{ color: 'rgba(240,236,228,0.5)' }}>{error}</p>
        <button
          onClick={() => { setError(''); setLoading(true); fetchSettings(); }}
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
        Settings
      </h1>

      {loading ? (
        <div className="space-y-4">
          <div className="rounded-xl h-72 animate-pulse" style={{ background: '#1A1815' }} />
          <div className="rounded-xl h-24 animate-pulse" style={{ background: '#1A1815' }} />
          <div className="rounded-xl h-24 animate-pulse" style={{ background: '#1A1815' }} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Email templates */}
          <div className="rounded-xl p-4" style={{ background: '#1A1815' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(14,165,233,0.12)' }}
              >
                <Mail size={15} style={{ color: BLUE }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: '#F0ECE4' }}>Email Templates</p>
                <p className="text-[11px]" style={{ color: 'rgba(240,236,228,0.45)' }}>
                  Auto-reply when leads submit the contact form
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {templateKeys.map(t => (
                <div key={t.key}>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: 'rgba(240,236,228,0.35)' }}>
                    {t.label}
                  </label>
                  {t.key.includes('intro') || t.key.includes('closing') ? (
                    <textarea
                      value={settings[t.key] ?? ''}
                      onChange={e => setSettings(prev => ({ ...prev, [t.key]: e.target.value }))}
                      rows={3}
                      placeholder={t.placeholder}
                      className="w-full rounded-lg border-0 px-3 py-2.5 resize-none focus:outline-none focus-visible:ring-1"
                      style={{
                        background: '#0E0C0A',
                        color: '#F0ECE4',
                        fontSize: 16,
                        caretColor: BLUE,
                        '--tw-ring-color': 'rgba(14,165,233,0.3)',
                      } as React.CSSProperties}
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[t.key] ?? ''}
                      onChange={e => setSettings(prev => ({ ...prev, [t.key]: e.target.value }))}
                      placeholder={t.placeholder}
                      className="w-full rounded-lg border-0 px-3 py-2.5 focus:outline-none focus-visible:ring-1"
                      style={{
                        background: '#0E0C0A',
                        color: '#F0ECE4',
                        fontSize: 16,
                        caretColor: BLUE,
                        '--tw-ring-color': 'rgba(14,165,233,0.3)',
                      } as React.CSSProperties}
                    />
                  )}
                </div>
              ))}

              <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(240,236,228,0.35)' }}>
                Variables: {'{{firstName}}'}, {'{{budget}}'}, {'{{websiteType}}'}, {'{{launchDate}}'}
              </p>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold focus:outline-none focus-visible:ring-2"
                style={{
                  background: saved ? '#22C55E' : BLUE,
                  color: '#0E0C0A',
                  minHeight: 44,
                  transition: `background 300ms ${EASE}, transform 150ms ${EASE}`,
                  '--tw-ring-color': saved ? '#22C55E' : BLUE,
                } as React.CSSProperties}
                onPointerDown={e => { if (!saving) e.currentTarget.style.transform = 'scale(0.97)'; }}
                onPointerUp={e => { e.currentTarget.style.transform = ''; }}
                onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
              >
                {saved ? <Check size={15} /> : saving ? null : <Save size={15} />}
                {saving ? 'Saving...' : saved ? 'Saved' : 'Save Templates'}
              </button>
            </div>
          </div>

          {/* Info cards */}
          <div className="rounded-xl p-4" style={{ background: '#1A1815' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.12)' }}
              >
                <Database size={15} style={{ color: '#22C55E' }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: '#F0ECE4' }}>Database</p>
                <p className="text-[11px]" style={{ color: 'rgba(240,236,228,0.45)' }}>Supabase connected</p>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(240,236,228,0.5)' }}>
              Leads, projects, and invoices stored in Supabase with row-level security.
              Public visitors can only submit new leads. All other operations require admin auth.
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ background: '#1A1815' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(167,139,250,0.12)' }}
              >
                <Shield size={15} style={{ color: '#A78BFA' }} />
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: '#F0ECE4' }}>Security</p>
                <p className="text-[11px]" style={{ color: 'rgba(240,236,228,0.45)' }}>Password protected, session cookies</p>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(240,236,228,0.5)' }}>
              Admin password is stored server-side in environment variables.
              Sessions use httpOnly cookies that persist for 30 days.
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-semibold focus:outline-none focus-visible:ring-2"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#EF4444',
              minHeight: 48,
              transition: `background 200ms ${EASE}, transform 150ms ${EASE}`,
              '--tw-ring-color': '#EF4444',
            } as React.CSSProperties}
            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onPointerUp={e => { e.currentTarget.style.transform = ''; }}
            onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
