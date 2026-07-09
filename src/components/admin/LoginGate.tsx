'use client';

import { useState, useId } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const BLUE = '#0EA5E9';
const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

export default function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const errorId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        setError('Wrong password');
        setPassword('');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-5" style={{ background: '#0E0C0A' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-display font-extrabold tracking-[-0.025em] text-[28px]">
            <span style={{ color: '#F0ECE4' }}>built</span>
            <span style={{ color: BLUE }}>by</span>
            <span style={{ color: '#F0ECE4' }}>brian</span>
          </span>
          <p
            className="font-bold uppercase tracking-[0.34em] mt-2"
            style={{ color: 'rgba(240,236,228,0.5)', fontSize: 11 }}
          >
            web design
          </p>
          <p className="font-serif italic mt-4" style={{ color: 'rgba(240,236,228,0.45)', fontSize: 15 }}>
            Admin Portal Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl p-6" style={{ background: '#1A1815' }}>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(14,165,233,0.12)' }}
            >
              <Lock size={18} style={{ color: BLUE }} />
            </div>
            <div>
              <p className="font-semibold text-[15px]" style={{ color: '#F0ECE4' }}>Sign In</p>
              <p className="text-[12px]" style={{ color: 'rgba(240,236,228,0.45)' }}>Enter your admin password</p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              autoFocus
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              className="w-full rounded-lg border-0 pr-14 py-3.5 px-4 text-[16px] font-medium placeholder:font-normal focus:outline-none focus-visible:ring-2"
              style={{
                background: '#0E0C0A',
                color: '#F0ECE4',
                caretColor: BLUE,
                // @ts-expect-error CSS custom property
                '--tw-ring-color': BLUE,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg focus:outline-none focus-visible:ring-2 active:scale-[0.95]"
              style={{
                color: 'rgba(240,236,228,0.45)',
                transition: `transform 150ms ${EASE}, opacity 150ms ${EASE}`,
                // @ts-expect-error CSS custom property
                '--tw-ring-color': BLUE,
              }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p id={errorId} className="text-[13px] mt-2 font-medium" style={{ color: '#F87171' }} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg py-3.5 mt-4 font-semibold text-[15px] disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: BLUE,
              color: '#0E0C0A',
              transition: `transform 150ms ${EASE}, opacity 150ms ${EASE}`,
              // @ts-expect-error CSS custom property
              '--tw-ring-color': BLUE,
              '--tw-ring-offset-color': '#1A1815',
            }}
            onPointerDown={e => {
              if (!loading && password) (e.currentTarget.style.transform = 'scale(0.97)');
            }}
            onPointerUp={e => { e.currentTarget.style.transform = ''; }}
            onPointerLeave={e => { e.currentTarget.style.transform = ''; }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
