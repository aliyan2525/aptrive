"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  ListChecks,
  Trophy,
  BarChart3,
  Target,
  Settings,
  Rocket,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLogo from "./AppLogo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Practice", href: "/practice", icon: Brain },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Rankings", href: "/leaderboard", icon: Trophy },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex flex-col border-r border-line bg-white/78 px-5 py-7 backdrop-blur-xl h-screen sticky top-0 left-0 overflow-y-auto no-scrollbar">
      <AppLogo />
      
      <nav className="mt-10 flex-1 space-y-2" aria-label="Sidebar Navigation">
        {navItems.map((item) => (
          <SideNavItem 
            key={item.label} 
            {...item} 
            active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))} 
          />
        ))}
      </nav>

      <div className="mt-8 mb-4 rounded-[1.5rem] border border-white/80 bg-gradient-to-br from-white to-violet-50/50 p-5 shadow-[0_18px_45px_rgba(62,72,130,0.08)] shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 shadow-sm">
          <Rocket className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-4 text-sm font-bold text-fg">Pro Plan</p>
        <p className="mt-1.5 text-xs font-medium leading-relaxed text-muted">You are unlocking your full potential.</p>
        <Link href="/onboarding" className="pressable mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-[13px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_24px_rgba(79,70,229,0.2)]">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          Upgrade Plan
        </Link>
      </div>
    </aside>
  );
}

function SideNavItem({ label, href, icon: Icon, active }: { label: string; href: string; icon: LucideIcon; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-bold transition-all duration-300 ${
        active 
          ? "bg-violet-50 text-violet-700 shadow-sm ring-1 ring-inset ring-violet-200/50" 
          : "text-muted hover:bg-black/[0.03] hover:text-fg"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={`h-4.5 w-4.5 transition-colors ${active ? "text-violet-600" : "text-muted-2 group-hover:text-fg"}`} aria-hidden="true" />
      {label}
    </Link>
  );
}
