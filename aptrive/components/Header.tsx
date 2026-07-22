import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/SiteNav";
import type { HeaderUser } from "@/components/UserMenu";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let headerUser: HeaderUser | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    // Cast required: this project's hand-authored Database type has no
    // Relationships metadata, which the client's type builder needs
    // even for plain selects — see lib/admin/import.ts for the fuller
    // explanation and the convention this follows.
    const profile = data as { role: string } | null;

    headerUser = {
      fullName:
        (user.user_metadata?.full_name as string | undefined) ??
        user.email ??
        "Student",
      email: user.email ?? "",
      avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      isStaff: profile?.role
        ? ["instructor", "content_manager", "administrator"].includes(profile.role)
        : false,
    };
  }

  // SiteNav renders its own <header> so it can control sticky/hide-on-scroll
  // behavior as one unit — see components/SiteNav.tsx.
  return <SiteNav user={headerUser} />;
}
