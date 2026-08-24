"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  LayoutDashboard,
  Rocket,
  Settings,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLogo from "./AppLogo";

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Practice", href: "/practice", icon: Brain },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Rankings", href: "/leaderboard", icon: Trophy },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`app-sidebar ${collapsed ? "app-sidebar--collapsed" : ""}`}
      aria-label="Authenticated navigation"
    >
      <div className="app-sidebar__top">
        <AppLogo compact={collapsed} />
        <button
          type="button"
          onClick={onToggle}
          className="app-sidebar__toggle pressable"
          aria-expanded={!collapsed}
          aria-controls="authenticated-sidebar-navigation"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <div className="app-sidebar__eyebrow app-sidebar-label">Workspace</div>
      <nav id="authenticated-sidebar-navigation" className="app-sidebar__nav" aria-label="Sidebar navigation">
        {navItems.map((item) => (
          <SideNavItem
            key={item.label}
            {...item}
            collapsed={collapsed}
            active={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`))}
          />
        ))}
      </nav>

      <div className="app-sidebar__footer">
        <div className="app-sidebar__plan">
          <div className="app-sidebar__plan-icon">
            <Rocket className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="app-sidebar-label min-w-0">
            <p className="truncate text-sm font-bold text-fg">Pro Plan</p>
            <p className="mt-1 text-xs font-medium leading-relaxed text-muted">You are unlocking your full potential.</p>
          </div>
          <Link
            href="/onboarding"
            className="app-sidebar__upgrade pressable app-sidebar-label"
            aria-label="Upgrade plan"
          >
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Upgrade plan
          </Link>
          {collapsed && (
            <Link
              href="/onboarding"
              className="app-sidebar__collapsed-action pressable"
              aria-label="Upgrade plan"
              title="Upgrade plan"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

function SideNavItem({
  label,
  href,
  icon: Icon,
  active,
  collapsed,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={`app-sidebar__item group ${active ? "app-sidebar__item--active" : ""}`}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
    >
      <span className="app-sidebar__item-icon">
        <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
      </span>
      <span className="app-sidebar-label truncate">{label}</span>
      {active && <span className="app-sidebar__active-dot" aria-hidden="true" />}
    </Link>
  );
}
