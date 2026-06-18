'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Megaphone,
  Settings,
  LogOut,
} from 'lucide-react';

const BLUE = '#0EA5E9';

const tabs = [
  { href: '/admin', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.href = '/admin';
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-dvh flex" style={{ background: '#0E0C0A' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-[240px] shrink-0 border-r"
        style={{ background: '#141210', borderColor: 'rgba(240,236,228,0.06)' }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5">
          <span className="font-display font-extrabold tracking-[-0.025em] text-[17px]">
            <span style={{ color: '#F0ECE4' }}>built</span>
            <span style={{ color: BLUE }}>by</span>
            <span style={{ color: '#F0ECE4' }}>brian</span>
          </span>
          <p
            className="font-bold uppercase tracking-[0.3em] mt-1"
            style={{ color: 'rgba(240,236,228,0.35)', fontSize: 9 }}
          >
            web design
          </p>
          <p className="font-serif italic mt-2" style={{ color: 'rgba(240,236,228,0.3)', fontSize: 12 }}>
            Admin Portal Dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {tabs.map(tab => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                style={{
                  background: active ? 'rgba(14,165,233,0.1)' : 'transparent',
                  color: active ? BLUE : 'rgba(240,236,228,0.55)',
                }}
              >
                <tab.icon size={18} strokeWidth={1.75} />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium w-full transition-colors"
            style={{ color: 'rgba(240,236,228,0.35)' }}
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 flex border-t z-50"
        style={{
          background: '#141210',
          borderColor: 'rgba(240,236,228,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {tabs.map(tab => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
              style={{
                color: active ? BLUE : 'rgba(240,236,228,0.35)',
                minHeight: 52,
              }}
            >
              <tab.icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
