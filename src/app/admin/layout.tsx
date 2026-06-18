'use client';

import { useEffect, useState } from 'react';
import LoginGate from '@/components/admin/LoginGate';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'auth' | 'guest'>('loading');

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then(d => setStatus(d.authenticated ? 'auth' : 'guest'))
      .catch(() => setStatus('guest'));
  }, []);

  if (status === 'loading') {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: '#0E0C0A' }}
      >
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#0EA5E9', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (status === 'guest') {
    return <LoginGate onSuccess={() => setStatus('auth')} />;
  }

  return <AdminShell>{children}</AdminShell>;
}
