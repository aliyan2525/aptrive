"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter, Menu, Search, X } from "lucide-react";
import AppNotificationCenter from "./AppNotificationCenter";
import AuthAccountMenu from "./AuthAccountMenu";
import CommandPalette from "./CommandPalette";
import type { NotificationItem } from "@/components/NotificationBell";
import type { HeaderUser } from "@/components/UserMenu";
import AppLogo from "./AppLogo";

interface AppHeaderProps {
  notifications: NotificationItem[];
  unreadCount: number;
  user: HeaderUser;
}

const mobileLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Practice", href: "/practice" },
  { label: "Library", href: "/library" },
  { label: "Rankings", href: "/leaderboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Goals", href: "/goals" },
  { label: "Settings", href: "/settings" },
];

export default function AppHeader({ notifications, unreadCount, user }: AppHeaderProps) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("mobile-scroll-lock", mobileOpen);
    return () => document.body.classList.remove("mobile-scroll-lock");
  }, [mobileOpen]);


  return (
    <>
      <header className="relative sticky top-0 z-40 border-b border-line/80 bg-white/76 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
          <div className="flex items-center gap-2 xl:hidden">
            <AppLogo className="px-0" />
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="pressable inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/80 text-fg xl:hidden"
              aria-expanded={mobileOpen}
              aria-controls="authenticated-mobile-nav"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="ml-4 hidden h-11 w-full max-w-[44rem] items-center gap-3 rounded-2xl border border-line bg-white/72 px-4 text-left text-sm text-muted shadow-[0_8px_24px_rgba(62,72,130,0.05)] backdrop-blur-xl transition-colors hover:bg-white md:flex xl:ml-0"
            aria-label="Open command center"
          >
            <Search className="h-4.5 w-4.5 text-violet-600" aria-hidden="true" />
            <span className="min-w-0 truncate">Search topics, tests, or ask anything...</span>
            <kbd className="hidden shrink-0 rounded-lg border border-line bg-white px-2 py-1 text-xs font-bold text-muted shadow-sm sm:inline-block">⌘ K</kbd>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setFilterOpen((open) => !open)} aria-expanded={filterOpen} aria-controls="authenticated-filter-menu" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white/80 px-3 text-sm font-semibold text-muted transition hover:border-violet-300 hover:text-fg">
              <Filter className="h-4 w-4 text-violet-600" aria-hidden="true" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <AppNotificationCenter initialNotifications={notifications} initialUnreadCount={unreadCount} />
            <AuthAccountMenu user={user} />
          </div>
        </div>
        {filterOpen && (
          <div id="authenticated-filter-menu" role="menu" className="absolute right-3 top-[calc(100%+0.75rem)] z-50 w-[min(19rem,calc(100vw-1.5rem))] rounded-2xl border border-line bg-white/95 p-3 shadow-[0_18px_50px_rgba(33,45,92,0.14)] backdrop-blur-2xl">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-2">Filter workspace</p>
            <div className="grid gap-1">
              {[
                ["Library resources", "/library"],
                ["Practice sets", "/practice"],
                ["Progress analytics", "/analytics"],
                ["Rankings", "/leaderboard"],
              ].map(([label, href]) => (
                <Link key={href} href={href} role="menuitem" onClick={() => setFilterOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition hover:bg-violet-50 hover:text-violet-700">{label}</Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div id="authenticated-mobile-nav" className="fixed inset-x-0 top-[4.5rem] z-30 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-white/95 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_18px_50px_rgba(33,45,92,0.12)] backdrop-blur-2xl xl:hidden">
          <nav className="grid gap-1" aria-label="Authenticated mobile navigation">
            {mobileLinks.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold transition-colors ${active ? "bg-violet-50 text-violet-700" : "text-muted hover:bg-slate-900/[0.04] hover:text-fg"}`}>{item.label}</Link>;
            })}
          </nav>
        </div>
      )}

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
