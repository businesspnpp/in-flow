'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Search } from 'lucide-react';
import { useDashboardHeader } from '@/components/dashboard/DashboardHeaderContext';
import {
  BarChart3,
  Calendar,
  House,
  LogOut,
  MessageCircleMore,
  ChevronLeft,
  ChevronRight,
  Plug,
  Settings,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

type NavItem = {
  path: string;
  label: string;
  title: string;
  Icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', label: 'Home', title: 'Home', Icon: House },
  { path: '/dashboard/chats', label: 'Chats', title: 'Chats', Icon: MessageCircleMore },
  { path: '/dashboard/tools', label: 'Tools', title: 'Tools', Icon: Wrench },
  { path: '/dashboard/bookings-orders', label: 'Bookings & Orders', title: 'Bookings & Orders', Icon: Calendar },
  { path: '/dashboard/link-apps', label: 'Link Apps', title: 'Link Apps', Icon: Plug },
  { path: '/dashboard/reports', label: 'Reports', title: 'Reports', Icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', title: 'Settings', Icon: Settings },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { headerConfig } = useDashboardHeader();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
          return pathname === '/dashboard' || pathname === '/dashboard/home'
        }
        return pathname === item.path || pathname.startsWith(`${item.path}/`);
      }) ?? NAV_ITEMS[0]
    );
  }, [pathname]);

  const defaultHeader = useMemo(() => {
    const byPath: Record<string, { subtitle: string; showSearch: boolean; searchPlaceholder: string }> = {
      '/dashboard': {
        subtitle: 'Overview of messages, bookings, and revenue health.',
        showSearch: false,
        searchPlaceholder: 'Search dashboard',
      },
      '/dashboard/chats': {
        subtitle: 'Find conversations, customers, and message context quickly.',
        showSearch: true,
        searchPlaceholder: 'Search chats or customers',
      },
      '/dashboard/tools': {
        subtitle: 'Launch tools and automations directly into conversations.',
        showSearch: false,
        searchPlaceholder: 'Search tools',
      },
      '/dashboard/bookings-orders': {
        subtitle: 'Track appointments, orders, and scheduling status.',
        showSearch: true,
        searchPlaceholder: 'Search bookings or orders',
      },
      '/dashboard/link-apps': {
        subtitle: 'Connect channels and manage integrations from one place.',
        showSearch: false,
        searchPlaceholder: 'Search integrations',
      },
      '/dashboard/reports': {
        subtitle: 'Read plain-English performance summaries and trends.',
        showSearch: false,
        searchPlaceholder: 'Search reports',
      },
      '/dashboard/settings': {
        subtitle: 'Control account, team, and profile preferences.',
        showSearch: false,
        searchPlaceholder: 'Search settings',
      },
    };

    return byPath[activeItem.path] ?? byPath['/dashboard'];
  }, [activeItem.path]);

  const headerTitle = headerConfig.title ?? activeItem.title;
  const headerSubtitle = headerConfig.subtitle ?? defaultHeader.subtitle;
  const isChatsRoute = pathname === '/dashboard/chats' || pathname.startsWith('/dashboard/chats/');
  const showSearch = isChatsRoute ? true : (headerConfig.showSearch ?? defaultHeader.showSearch);
  const searchPlaceholder = isChatsRoute
    ? 'Search chats or customers'
    : (headerConfig.searchPlaceholder ?? defaultHeader.searchPlaceholder);
  const isLinkAppsRoute = pathname === '/dashboard/link-apps' || pathname.startsWith('/dashboard/link-apps/');

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
        {/* Toggle Island Tab - Perfectly straddles the sidebar border */}
        <button
          type="button"
          onClick={() => setSidebarExpanded((prev) => !prev)}
          className="absolute top-6 -right-[12px] z-50 h-6 w-6 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-150 group"
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarExpanded ? (
            <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          ) : (
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          )}
        </button>

        {/* Clean Header Area without layout shifting button containers */}
        <div className="flex items-center h-[68px] px-3 border-b border-[#16233f] overflow-hidden flex-shrink-0">
          {sidebarExpanded ? (
            <img src="/dock-logo-2.png" alt="Dock logo" className="h-7 w-auto pl-1 transition-opacity duration-200" />
          ) : (
            <img src="/dock-icon-3.png" alt="Dock icon" className="h-11 w-11 mx-auto transition-opacity duration-200" />
          )}
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

        <div className="absolute left-0 right-0 bottom-0 px-2 pb-3 bg-[#0B1528]">
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
        <header className="sticky top-0 z-40 w-full flex-shrink-0 border-b border-zinc-200 bg-white">
          <div className="min-h-[68px] px-4 py-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,1fr)_minmax(340px,460px)_minmax(0,1fr)] md:gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black tracking-tight text-zinc-900">{headerTitle}</h1>
                <p className="mt-0.5 truncate text-xs text-zinc-500">{headerSubtitle}</p>
              </div>

              <div className="hidden md:block">
                {showSearch ? (
                  <div className="relative w-full">
                    <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder={searchPlaceholder}
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none transition focus:border-blue-400 focus:bg-white"
                    />
                  </div>
                ) : (
                  <div className="h-10" aria-hidden="true" />
                )}
              </div>

              <div className="flex items-center justify-start md:justify-end">
                {headerConfig.actions ?? <div className="h-10" aria-hidden="true" />}
              </div>
            </div>
          </div>
        </header>

        <div className={`flex-1 flex flex-col ${isLinkAppsRoute ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}>
          {children}
        </div>
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
