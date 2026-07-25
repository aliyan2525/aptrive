"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  toggleNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/app/actions/notifications";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  notification_type: "reminder" | "deadline" | "achievement" | "material" | "system";
  read_at: string | null;
  action_url: string | null;
  created_at: string;
};

type NotificationBellProps = {
  initialNotifications: NotificationItem[];
  initialUnreadCount: number;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell({ initialNotifications, initialUnreadCount }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleToggleRead(notification: NotificationItem) {
    const markAsRead = !notification.read_at;
    // Optimistic update — the toggle should feel instant; the server
    // action is the source of truth and revalidates on completion.
    setItems((prev) =>
      prev.map((item) =>
        item.id === notification.id
          ? { ...item, read_at: markAsRead ? new Date().toISOString() : null }
          : item
      )
    );
    setUnreadCount((prev) => Math.max(0, prev + (markAsRead ? -1 : 1)));

    startTransition(async () => {
      try {
        await toggleNotificationReadAction(notification.id, markAsRead);
      } catch {
        // Revert on failure.
        setItems((prev) =>
          prev.map((item) => (item.id === notification.id ? notification : item))
        );
        setUnreadCount((prev) => Math.max(0, prev + (markAsRead ? 1 : -1)));
      }
    });
  }

  function handleMarkAllRead() {
    const previousItems = items;
    const previousUnread = unreadCount;
    setItems((prev) => prev.map((item) => ({ ...item, read_at: item.read_at ?? new Date().toISOString() })));
    setUnreadCount(0);

    startTransition(async () => {
      try {
        await markAllNotificationsReadAction();
      } catch {
        setItems(previousItems);
        setUnreadCount(previousUnread);
      }
    });
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        ripple={false}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative border border-line hover:border-teal/40"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal px-1 font-mono-data text-[10px] font-semibold text-graphite">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-80 rounded-xl border border-line bg-panel/95 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-semibold text-fg">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-xs font-medium text-teal hover:underline disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">
                Nothing here yet — practice milestones and admission reminders will show up as they happen.
              </p>
            ) : (
              items.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-line px-4 py-3 last:border-0 ${
                    notification.read_at ? "" : "bg-teal-dim/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {notification.action_url ? (
                        <Link
                          href={notification.action_url}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium text-fg hover:text-teal"
                        >
                          {notification.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-fg">{notification.title}</p>
                      )}
                      <p className="mt-1 text-xs leading-relaxed text-muted">{notification.body}</p>
                      <p className="mt-1.5 font-mono-data text-[10px] uppercase tracking-wide text-muted-2">
                        {timeAgo(notification.created_at)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleRead(notification)}
                      disabled={isPending}
                      className="shrink-0 text-[11px] font-medium text-muted hover:text-teal disabled:opacity-50"
                    >
                      {notification.read_at ? "Mark unread" : "Mark read"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
