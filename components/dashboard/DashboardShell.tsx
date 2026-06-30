'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircleMore,
  Plug,
  Settings,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type NavItem = {
  path: string;
  label: string;
  title: string;
  Icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Home', title: 'Home', Icon: LayoutDashboard },
  { path: '/dashboard/chats', label: 'Chats', title: 'Chats', Icon: MessageCircleMore },
  { path: '/dashboard/shortcuts', label: 'Shortcuts', title: 'Shortcuts', Icon: Zap },
  { path: '/dashboard/bookings-orders', label: 'Bookings & Orders', title: 'Bookings & Orders', Icon: Calendar },
  { path: '/dashboard/link-apps', label: 'Link Apps', title: 'Link Apps', Icon: Plug },
  { path: '/dashboard/reports', label: 'Reports', title: 'Reports', Icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', title: 'Settings', Icon: Settings },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      setCheckingSession(false);
    }

    verifyAuth();
  }, [router]);

  const activeItem = useMemo(() => {
    return (
      NAV_ITEMS.find((item) => {
        if (item.path === '/dashboard') {
          return pathname === '/dashboard' || pathname === '/dashboard/home';
        }
        return pathname === item.path || pathname.startsWith(`${item.path}/`);
      }) ?? NAV_ITEMS[0]
    );
  }, [pathname]);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch {
      setIsSigningOut(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-xs text-zinc-500">Loading Dock...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row bg-zinc-50 text-zinc-900">
      <aside
        className={`hidden md:flex relative flex-col bg-[#0B1528] border-r border-[#16233f] text-white transition-[width] duration-200 ease-in-out ${
          sidebarExpanded ? 'w-60' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-[#16233f]">
          {sidebarExpanded ? (
            <img src="/dock-logo.svg" alt="Dock logo" className="h-8 w-auto" />
          ) : (
            <img src="/dock-icon.svg" alt="Dock icon" className="h-8 w-8 mx-auto" />
          )}
          <button
            type="button"
            onClick={() => setSidebarExpanded((prev) => !prev)}
            className="h-9 w-9 flex items-center justify-center rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {NAV_ITEMS.map(({ path, label, Icon }) => {
            const isActive =
              path === '/dashboard'
                ? pathname === '/dashboard' || pathname === '/dashboard/home'
                : pathname === path || pathname.startsWith(`${path}/`);

            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                title={label}
                className={`w-full h-11 rounded-md flex items-center transition-colors ${
                  sidebarExpanded ? 'px-3 gap-3 justify-start' : 'justify-center'
                } ${
                  isActive
                    ? 'bg-[#FB5801] text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} strokeWidth={2.25} className="flex-shrink-0" />
                {sidebarExpanded && <span className="text-sm font-semibold truncate">{label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute left-0 right-0 bottom-0 px-2 pb-3">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Sign out"
            className={`w-full h-11 rounded-md flex items-center text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 ${
              sidebarExpanded ? 'px-3 gap-3 justify-start' : 'justify-center'
            }`}
          >
            <LogOut size={20} strokeWidth={2.25} className="flex-shrink-0" />
            {sidebarExpanded && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50">
        <div className="flex-shrink-0 border-b border-zinc-200 bg-white px-4 py-4 md:px-6">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">{activeItem.title}</h1>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-hide">
          {NAV_ITEMS.map(({ path, label, Icon }) => {
            const isActive =
              path === '/dashboard'
                ? pathname === '/dashboard' || pathname === '/dashboard/home'
                : pathname === path || pathname.startsWith(`${path}/`);

            return (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'text-amber-700 bg-amber-600/10'
                    : 'text-zinc-400 hover:text-zinc-500'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="md:hidden h-16 flex-shrink-0" />
    </div>
  );
}
