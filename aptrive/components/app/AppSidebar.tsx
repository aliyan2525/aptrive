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
    <aside className="hidden xl:flex flex-col border-r border-[var(--line)] bg-[var(--panel)]/78 px-5 py-7 backdrop-blur-xl h-screen sticky top-0 left-0 overflow-y-auto no-scrollbar">
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

      <div className="mt-8 mb-4 rounded-[1.25rem] border border-[#e3e8f7] bg-gradient-to-br from-white to-[#f1f4ff] p-5 shadow-[0_20px_50px_rgba(51,70,130,0.08)] dark:from-[#111] dark:to-[#1a1a2e] dark:border-white/10 shrink-0">
        <Rocket className="h-9 w-9 text-violet-500" aria-hidden="true" />
        <p className="mt-4 text-sm font-bold text-blue-700 dark:text-blue-400">Pro Plan</p>
        <p className="mt-2 text-sm leading-relaxed text-[#667196] dark:text-gray-400">You are unlocking your full potential.</p>
        <Link href="/onboarding" className="pressable mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[0.7rem] bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
          <Zap className="h-4 w-4" aria-hidden="true" />
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
      className={`group flex h-12 items-center gap-3 rounded-[0.7rem] px-4 text-sm font-semibold transition-all duration-200 ${
        active 
          ? "bg-[#f0f1ff] dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm" 
          : "text-[#172247] dark:text-gray-300 hover:bg-[#f7f9ff] dark:hover:bg-white/5"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={`h-5 w-5 transition-colors ${active ? "text-blue-600 dark:text-blue-400" : "text-[#657199] dark:text-gray-500 group-hover:text-[#172247] dark:group-hover:text-gray-200"}`} aria-hidden="true" />
      {label}
    </Link>
  );
}
