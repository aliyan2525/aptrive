"use client";

import { useState } from "react";
import type { NotificationItem } from "@/components/NotificationBell";
import type { HeaderUser } from "@/components/UserMenu";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

type AuthenticatedShellProps = {
  user: HeaderUser;
  notifications: NotificationItem[];
  unreadCount: number;
  children: React.ReactNode;
};

export default function AuthenticatedShell({
  user,
  notifications,
  unreadCount,
  children,
}: AuthenticatedShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-shell min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(231,237,255,0.7),transparent_25rem),radial-gradient(circle_at_85%_25%,rgba(191,246,239,0.3),transparent_25rem),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] text-fg dark:bg-[#0a0a0a]">
      {/* Ambient color glows behind the app */}
      <div className="pointer-events-none fixed -top-32 right-[-8%] h-[640px] w-[640px] rounded-full bg-cyan-200/20 blur-[130px] z-0" />
      <div className="pointer-events-none fixed bottom-[-14%] right-[8%] h-[520px] w-[520px] rounded-full bg-violet-200/20 blur-[130px] z-0" />
      <div className="pointer-events-none fixed left-[-15%] top-1/3 h-[440px] w-[440px] rounded-full bg-sky-100/40 blur-[120px] z-0" />

      <div className={`app-layout relative z-10 ${sidebarCollapsed ? "app-layout--collapsed" : ""}`}>
        <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />

        <section className="workspace-surface min-w-0 flex min-h-screen flex-col">
          <AppHeader user={user} notifications={notifications} unreadCount={unreadCount} />
          <div className="app-content min-w-0 flex-1">{children}</div>
        </section>
      </div>
    </div>
  );
}
