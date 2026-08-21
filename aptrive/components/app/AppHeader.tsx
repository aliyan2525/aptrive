"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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

export default function AppHeader({ notifications, unreadCount, user }: AppHeaderProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-white/76 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
          
          {/* Mobile Logo */}
          <div className="flex items-center xl:hidden">
             <AppLogo className="px-0" />
          </div>

          {/* Search Command */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden h-11 w-full max-w-[44rem] items-center gap-3 rounded-2xl border border-line bg-white/72 px-4 text-left text-sm text-muted shadow-[0_8px_24px_rgba(62,72,130,0.05)] backdrop-blur-xl transition-colors hover:bg-white md:flex xl:ml-0 ml-4"
            aria-label="Open command center"
          >
            <Search className="h-4.5 w-4.5 text-violet-600" aria-hidden="true" />
            <span>Search topics, tests, or ask anything...</span>
            <span className="ml-auto hidden items-center gap-2 rounded-xl border border-line bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-700 sm:inline-flex"><span aria-hidden="true">✦</span> Ask AI</span>
            <kbd className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-bold text-muted shadow-sm">⌘ K</kbd>
          </button>

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden" />

          {/* Profile & Notifications */}
          <div className="flex items-center gap-3 sm:gap-4">
            <AppNotificationCenter initialNotifications={notifications} initialUnreadCount={unreadCount} />
            <AuthAccountMenu user={user} />
          </div>
        </div>
      </header>
      
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
