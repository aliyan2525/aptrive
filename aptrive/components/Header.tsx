import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/SiteNav";
import type { HeaderUser } from "@/components/UserMenu";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headerUser: HeaderUser | null = user
    ? {
        fullName:
          (user.user_metadata?.full_name as string | undefined) ??
          user.email ??
          "Student",
        email: user.email ?? "",
        avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      }
    : null;

  // SiteNav renders its own <header> so it can control sticky/hide-on-scroll
  // behavior as one unit — see components/SiteNav.tsx.
  return <SiteNav user={headerUser} />;
}
