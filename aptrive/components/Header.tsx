import SiteNav from "@/components/SiteNav";
import type { HeaderUser } from "@/components/UserMenu";
import type { NotificationItem } from "@/components/NotificationBell";
import { STAFF_ROLES } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { countUnreadNotifications, listNotifications } from "@/lib/repositories/notifications.repository";

export default async function Header({
  user,
  notifications = [],
  unreadCount = 0,
}: {
  user?: HeaderUser | null;
  notifications?: NotificationItem[];
  unreadCount?: number;
}) {
  let resolvedUser = user;
  let resolvedNotifications = notifications;
  let resolvedUnreadCount = unreadCount;

  if (user === undefined) {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const [{ data: profile }, notificationList, unread] = await Promise.all([
        supabase.from("profiles").select("role").eq("id", authUser.id).maybeSingle(),
        listNotifications(supabase, authUser.id),
        countUnreadNotifications(supabase, authUser.id),
      ]);

      resolvedUser = {
        fullName: (authUser.user_metadata?.full_name as string | undefined) ?? authUser.email ?? "Student",
        email: authUser.email ?? "",
        avatarUrl: (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
        isStaff: profile?.role ? STAFF_ROLES.includes(profile.role as (typeof STAFF_ROLES)[number]) : false,
      };
      resolvedNotifications = notificationList;
      resolvedUnreadCount = unread;
    } else {
      resolvedUser = null;
    }
  }

  return <SiteNav user={resolvedUser ?? null} notifications={resolvedNotifications} unreadCount={resolvedUnreadCount} />;
}
