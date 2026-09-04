"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Bell, CheckCheck, Sparkles } from "lucide-react";
import {
  markAllNotificationsReadAction,
  toggleNotificationReadAction,
} from "@/app/actions/notifications";
import type { NotificationItem } from "@/components/NotificationBell";

const fallbackItems = [
  { title: "AI reminder", body: "Your strongest next move is a 20-minute algebra sprint.", time: "now" },
  { title: "Study streak", body: "One completed session protects today's streak.", time: "12m" },
  { title: "Mock test", body: "FAST mock test preparation is ready when you are.", time: "1h" },
];

export default function AppNotificationCenter({
  initialNotifications,
  initialUnreadCount,
}: {
  initialNotifications: NotificationItem[];
  initialUnreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

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

  function handleToggleRead(notification: NotificationItem) {
    const markAsRead = !notification.read_at;
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
        setItems((prev) => prev.map((item) => (item.id === notification.id ? notification : item)));
        setUnreadCount((prev) => Math.max(0, prev + (markAsRead ? 1 : -1)));
      }
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        aria-expanded={open}
        className="relative grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-white/60 backdrop-blur-md text-[#4d5d91] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_16px_rgba(46,39,97,0.03)] transition-all hover:bg-white/80 hover:text-violet-700 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_6px_24px_rgba(46,39,97,0.06)] hover:border-white/80"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-[80] w-[22rem] overflow-hidden rounded-[1.2rem] border border-white/70 bg-white/90 shadow-[0_28px_90px_rgba(16,28,66,0.22)] backdrop-blur-3xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-[#e7ecf8] bg-gradient-to-br from-white to-[#f4f7ff] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#111a3a]">Notification Center</p>
              <p className="text-xs font-semibold text-[#657199]">Activity, reminders, and achievements</p>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={isPending || unreadCount === 0}
              className="grid h-9 w-9 place-items-center rounded-full text-blue-600 transition hover:bg-blue-50 disabled:opacity-40"
              aria-label="Mark all notifications as read"
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {items.length > 0 ? (
              items.map((notification) => (
                <div key={notification.id} className={`rounded-[1rem] p-3 ${notification.read_at ? "" : "bg-blue-50/80"}`}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-white text-blue-600 shadow-sm">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      {notification.action_url ? (
                        <Link href={notification.action_url} onClick={() => setOpen(false)} className="text-sm font-bold text-[#111a3a] hover:text-blue-700">
                          {notification.title}
                        </Link>
                      ) : (
                        <p className="text-sm font-bold text-[#111a3a]">{notification.title}</p>
                      )}
                      <p className="mt-1 text-xs leading-5 text-[#657199]">{notification.body}</p>
                      <button
                        type="button"
                        onClick={() => handleToggleRead(notification)}
                        disabled={isPending}
                        className="mt-2 text-xs font-bold text-blue-600 hover:underline disabled:opacity-50"
                      >
                        {notification.read_at ? "Mark unread" : "Mark read"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              fallbackItems.map((item) => (
                <div key={item.title} className="rounded-[1rem] p-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-blue-600">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#111a3a]">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-[#657199]">{item.body}</p>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-[#8a95b8]">{item.time}</span>
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
