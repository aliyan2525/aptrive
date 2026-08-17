"use client";

import type { NotificationItem } from "@/components/NotificationBell";
import type { HeaderUser } from "@/components/UserMenu";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

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
  return (
    <div className="app-shell min-h-screen bg-[#f7f9ff] dark:bg-[#0a0a0a] text-fg">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Unified Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <section className="workspace-surface min-w-0 flex flex-col min-h-screen">
          {/* Unified Header */}
          <AppHeader 
            user={user}
            notifications={notifications}
            unreadCount={unreadCount}
          />

          {/* Page Content */}
          <div className="app-content flex-1">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}


