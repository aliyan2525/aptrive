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
      <header className="sticky top-0 z-40 border-b border-[#e8ecf8]/90 dark:border-white/10 bg-white/76 dark:bg-[#0a0a0a]/76 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
          
          {/* Mobile Logo */}
          <div className="flex items-center xl:hidden">
             <AppLogo className="px-0" />
          </div>

          {/* Search Command */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden h-11 w-full max-w-[38rem] items-center gap-3 rounded-[0.85rem] border border-[#e6ebf7] dark:border-white/10 bg-[#f8faff] dark:bg-white/5 px-4 text-left text-sm text-[#7883a9] dark:text-gray-400 shadow-inner md:flex transition-colors hover:bg-white dark:hover:bg-white/10 xl:ml-0 ml-4"
            aria-label="Open command center"
          >
            <Search className="h-5 w-5 text-[#4d5d91] dark:text-gray-400" aria-hidden="true" />
            <span>Search topics, tests, or something...</span>
            <kbd className="ml-auto rounded-md bg-white dark:bg-[#111] px-2 py-1 text-xs text-[#6c759b] dark:text-gray-400 shadow-sm border border-[#e6ebf7] dark:border-white/10">K</kbd>
          </button>

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden" />

          {/* Profile & Notifications */}
          <div className="flex items-center gap-4">
            <AppNotificationCenter initialNotifications={notifications} initialUnreadCount={unreadCount} />
            <AuthAccountMenu user={user} />
          </div>
        </div>
      </header>
      
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}
