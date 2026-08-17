import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import type { HeaderUser } from "@/components/UserMenu";
import { listNotifications, countUnreadNotifications } from "@/lib/repositories/notifications.repository";
import { STAFF_ROLES } from "@/lib/admin/auth";

export default async function AuthHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let headerUser: HeaderUser | null = null;
  let notifications: Awaited<ReturnType<typeof listNotifications>> = [];
  let unreadCount = 0;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const profile = data as { role: string } | null;

    headerUser = {
      fullName:
        (user.user_metadata?.full_name as string | undefined) ??
        user.email ??
        "Student",
      email: user.email ?? "",
      avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      isStaff: profile?.role
        ? (STAFF_ROLES as readonly string[]).includes(profile.role)
        : false,
    };

    [notifications, unreadCount] = await Promise.all([
      listNotifications(supabase, user.id),
      countUnreadNotifications(supabase, user.id),
    ]);
  }

  return <Header user={headerUser} notifications={notifications} unreadCount={unreadCount} />;
}

