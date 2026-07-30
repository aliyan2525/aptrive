import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import type { NotificationItem } from "@/components/NotificationBell";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

function toNotificationItem(row: Notification): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    notification_type: row.type,
    read_at: row.read_at,
    action_url: row.link_href,
    created_at: row.created_at,
  };
}

// This project's hand-authored Database type has no generated
// Relationships metadata, which makes .update()'s argument type
// resolve to `never`. Matching the established workaround in
// lib/admin/import.ts: cast the query-builder itself, not the
// payload, and cast reads back to the real row type.

/**
 * Most recent notifications for the bell dropdown. RLS
 * (notifications_select_own) already scopes this to the caller's own
 * rows — the .eq(user_id) here is defense-in-depth, matching the
 * convention documented in lib/dashboard-data.ts.
 */
export async function listNotifications(
  supabase: SupabaseClient<Database>,
  userId: string,
  limit = 15
): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load notifications: ${error.message}`);
  }

  return (data ?? []).map(toNotificationItem);
}

export async function countUnreadNotifications(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    throw new Error(`Failed to count unread notifications: ${error.message}`);
  }

  return count ?? 0;
}

/**
 * Toggles a single notification between read/unread. `notifications`
 * has no separate "is_read" boolean — read state is the presence/
 * absence of `read_at` — so toggling means setting it to now() or
 * back to null depending on current state.
 *
 * RLS (notifications_update_own) enforces `user_id = auth.uid()` on
 * the underlying UPDATE regardless of what's passed here; the
 * `.eq("user_id", userId)` filter just makes a mismatched call return
 * zero rows affected instead of relying solely on RLS to no-op it.
 */
export async function toggleNotificationRead(
  supabase: SupabaseClient<Database>,
  userId: string,
  notificationId: string,
  markAsRead: boolean
): Promise<void> {
    const { error } = await supabase.from("notifications")
    .update({ read_at: markAsRead ? new Date().toISOString() : null })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to update notification: ${error.message}`);
  }
}

/** Marks every unread notification for this user as read — the bell
 * dropdown's "Mark all as read" action. */
export async function markAllNotificationsRead(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
    const { error } = await supabase.from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    throw new Error(`Failed to mark notifications as read: ${error.message}`);
  }
}
