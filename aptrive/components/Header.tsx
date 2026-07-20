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

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-graphite/90 backdrop-blur">
      <SiteNav user={headerUser} />
    </header>
  );
}
