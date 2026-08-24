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
    <div className="app-shell min-h-screen bg-[#f7f9ff] text-fg dark:bg-[#0a0a0a]">
      <div className={`app-layout ${sidebarCollapsed ? "app-layout--collapsed" : ""}`}>
        <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />

        <section className="workspace-surface min-w-0 flex min-h-screen flex-col">
          <AppHeader user={user} notifications={notifications} unreadCount={unreadCount} />
          <div className="app-content min-w-0 flex-1">{children}</div>
        </section>
      </div>
    </div>
  );
}
