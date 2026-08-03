import { redirect } from "next/navigation";
import AuthenticatedShell from "@/components/app/AuthenticatedShell";
import type { HeaderUser } from "@/components/UserMenu";
import { STAFF_ROLES } from "@/lib/admin/auth";
import { countUnreadNotifications, listNotifications } from "@/lib/repositories/notifications.repository";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as { role: string } | null;
  const headerUser: HeaderUser = {
    fullName:
      (user.user_metadata?.full_name as string | undefined) ??
      user.email ??
      "Student",
    email: user.email ?? "",
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    isStaff: profile?.role ? STAFF_ROLES.includes(profile.role as (typeof STAFF_ROLES)[number]) : false,
  };

  const [notifications, unreadCount] = await Promise.all([
    listNotifications(supabase, user.id),
    countUnreadNotifications(supabase, user.id),
  ]);

  return (
    <AuthenticatedShell
      user={headerUser}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      {children}
    </AuthenticatedShell>
  );
}
