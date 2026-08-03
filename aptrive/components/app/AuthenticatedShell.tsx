"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart2,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  CalendarCheck,
  Command,
  LayoutDashboard,
  Library,
  ListChecks,
  Medal,
  Search,
  Settings,
  Target,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppNotificationCenter from "@/components/app/AppNotificationCenter";
import AuthAccountMenu from "@/components/app/AuthAccountMenu";
import CommandPalette from "@/components/app/CommandPalette";
import type { NotificationItem } from "@/components/NotificationBell";
import type { HeaderUser } from "@/components/UserMenu";

type AuthenticatedShellProps = {
  user: HeaderUser;
  notifications: NotificationItem[];
  unreadCount: number;
  children: React.ReactNode;
};

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: Brain },
  { href: "/library", label: "Library", icon: Library },
  { href: "/leaderboard", label: "Rankings", icon: Trophy },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const workspaceNav = [
  { href: "/practice/bookmarks", label: "Bookmarks", icon: BookOpen },
  { href: "/practice/revision", label: "Revision", icon: ListChecks },
  { href: "/practice/subjects", label: "Subjects", icon: BarChart3 },
  { href: "/onboarding", label: "Personalize Plan", icon: Target },
];

export default function AuthenticatedShell({
  user,
  notifications,
  unreadCount,
  children,
}: AuthenticatedShellProps) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);

  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-fg">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[17.5rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#e6ebf7] bg-white/78 px-5 py-6 backdrop-blur-2xl xl:flex xl:flex-col">
          <Link href="/dashboard" className="flex items-center gap-3 px-2" aria-label="Aptrive dashboard">
            <span className="grid h-14 w-14 place-items-center rounded-[1rem] bg-white shadow-[0_16px_32px_rgba(66,82,220,0.14)]">
              <Image src="/logo-mark.png" alt="" width={42} height={47} className="h-11 w-auto" priority />
            </span>
            <span>
              <span className="block font-display text-2xl font-bold tracking-normal text-[#08112f]">Aptrive</span>
              <span className="block text-xs font-semibold text-emerald-500">Study OS</span>
            </span>
          </Link>

          <div className="mt-8 rounded-[1rem] border border-[#e2e8f6] bg-gradient-to-br from-white to-[#f3f6ff] p-4 shadow-[0_18px_48px_rgba(42,59,118,0.07)]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Zap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#111a3a]">Daily Focus</p>
                <p className="text-xs text-[#657199]">One precision sprint</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e9eef9]">
              <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-emerald-400 to-blue-500" />
            </div>
          </div>

          <nav className="mt-8 space-y-1.5" aria-label="Authenticated navigation">
            {primaryNav.map((item) => (
              <ShellNavItem key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>

          <div className="mt-8">
            <p className="px-3 text-xs font-bold uppercase tracking-[0.12em] text-[#7a86aa]">Workspace</p>
            <nav className="mt-3 space-y-1.5" aria-label="Study workspace">
              {workspaceNav.map((item) => (
                <ShellNavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>

          <div className="mt-auto rounded-[1.1rem] border border-[#e2e8f6] bg-white/82 p-4 shadow-[0_18px_48px_rgba(42,59,118,0.07)]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-violet-600">
                <Medal className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-[#111a3a]">Pro Plan</p>
                <p className="text-xs text-[#657199]">AI recommendations active</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-[#e6ebf7]/90 bg-white/78 backdrop-blur-2xl">
            <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3 xl:hidden">
                <Link href="/dashboard" className="grid h-12 w-12 place-items-center rounded-[0.95rem] bg-white shadow-sm">
                  <Image src="/logo-mark.png" alt="" width={38} height={42} className="h-10 w-auto" priority />
                </Link>
                <div>
                  <p className="font-display text-lg font-bold text-[#08112f]">Aptrive</p>
                  <p className="text-xs font-semibold text-emerald-500">Study OS</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="hidden h-11 w-full max-w-[36rem] items-center gap-3 rounded-[0.9rem] border border-[#e1e7f5] bg-[#f8faff] px-4 text-left text-sm text-[#7480a8] shadow-inner md:flex"
                aria-label="Open command center"
              >
                <Search className="h-5 w-5 text-[#4d5d91]" aria-hidden="true" />
                Search topics, tests, notes...
                <kbd className="ml-auto inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-bold text-[#6c759b] shadow-sm">
                  <Command className="h-3 w-3" aria-hidden="true" /> K
                </kbd>
              </button>

              <div className="ml-auto flex items-center gap-3">
                <Link
                  href="/practice"
                  className="pressable hidden h-10 items-center gap-2 rounded-[0.75rem] bg-[#111a3a] px-4 text-sm font-bold text-white sm:inline-flex"
                >
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                  Start Session
                </Link>
                <div className="hidden sm:block">
                  <AppNotificationCenter initialNotifications={notifications} initialUnreadCount={unreadCount} />
                </div>
                <button className="relative grid h-10 w-10 place-items-center rounded-full text-[#4d5d91] transition hover:bg-[#eef3ff] sm:hidden" aria-label="Notifications">
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </button>
                <AuthAccountMenu user={user} />
              </div>
            </div>
          </header>

          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </section>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}

function ShellNavItem({
  item,
  pathname,
}: {
  item: { href: string; label: string; icon: LucideIcon };
  pathname: string;
}) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`group relative flex h-12 items-center gap-3 rounded-[0.85rem] px-3 text-sm font-bold transition ${
        isActive
          ? "bg-[#eef2ff] text-blue-700 shadow-sm"
          : "text-[#263457] hover:bg-white hover:text-[#101936]"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && <span className="absolute left-0 h-6 w-1 rounded-r-full bg-blue-600" />}
      <Icon className={`h-5 w-5 transition ${isActive ? "text-blue-600" : "text-[#657199] group-hover:text-blue-600"}`} aria-hidden="true" />
      {item.label}
    </Link>
  );
}
