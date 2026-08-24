"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter, Menu, Search, Sparkles, X } from "lucide-react";
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

const pageTitles: Array<[string, string]> = [
  ["/dashboard", "Mission control"],
  ["/practice", "Practice lab"],
  ["/library", "Learning library"],
  ["/leaderboard", "Rankings"],
  ["/analytics", "Analytics"],
  ["/goals", "Goals"],
  ["/settings", "Settings"],
  ["/profile", "Profile"],
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

  const pageTitle = pageTitles.find(([href]) => pathname === href || pathname.startsWith(`${href}/`))?.[1] ?? "Workspace";

  return (
    <>
      <header className="app-header sticky top-0 z-40 border-b border-line/75 bg-white/78 backdrop-blur-xl">
        <div className="app-header__inner">
          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <AppLogo className="px-0" />
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="app-header__icon-button pressable xl:hidden"
              aria-expanded={mobileOpen}
              aria-controls="authenticated-mobile-nav"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          <div className="app-header__context hidden lg:flex">
            <span className="app-header__context-kicker">Workspace</span>
            <span className="app-header__context-divider" aria-hidden="true" />
            <span className="truncate">{pageTitle}</span>
          </div>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="app-header__search pressable"
            aria-label="Open search and command center"
          >
            <span className="app-header__search-icon" aria-hidden="true">
              <Search className="h-4 w-4" />
            </span>
            <span className="app-header__search-copy">
              <span className="app-header__search-kicker">Quick find</span>
              <span className="truncate">Search topics, tests, or ask anything</span>
            </span>
            <kbd className="app-header__shortcut">⌘ K</kbd>
          </button>

          <div className="app-header__actions">
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              aria-expanded={filterOpen}
              aria-controls="authenticated-filter-menu"
              className="app-header__filter pressable"
            >
              <Filter className="h-4 w-4 text-violet-600" aria-hidden="true" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <AppNotificationCenter initialNotifications={notifications} initialUnreadCount={unreadCount} />
            <AuthAccountMenu user={user} />
          </div>
        </div>

        {filterOpen && (
          <div id="authenticated-filter-menu" role="menu" className="app-header__filter-menu">
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
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/70 px-3 py-2.5 text-xs font-semibold text-violet-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Your workspace, one tap away.
          </div>
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
