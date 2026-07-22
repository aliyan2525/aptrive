import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type Profile = Tables["profiles"]["Row"];

export const STAFF_ROLES: Profile["role"][] = ["instructor", "content_manager", "administrator"];

export type StaffContext = {
  userId: string;
  email: string;
  fullName: string | null;
  role: Profile["role"];
};

/**
 * Server-only guard for every /admin route and admin server action.
 * Redirects unauthenticated users to /login, and redirects signed-in
 * users without a staff role back to the dashboard.
 *
 * This mirrors RLS (public.is_staff() in 0002_library_content.sql) —
 * it does not replace it. RLS is what actually stops a non-staff user
 * from writing to questions/practice_sets; this guard just keeps them
 * out of the admin UI and gives a clean redirect instead of a wall of
 * failed queries.
 */
export async function requireStaff(): Promise<StaffContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  // Cast required: this project's hand-authored Database type doesn't
  // carry Supabase's generated Relationships metadata, which the
  // client's type builder needs even for plain (non-embedded) selects
  // — see lib/dashboard-data.ts for the established precedent of
  // casting every query result rather than relying on inference.
  const profile = data as Pick<Profile, "role" | "full_name"> | null;
  const role = profile?.role ?? "student";

  if (!STAFF_ROLES.includes(role)) {
    redirect("/dashboard?error=not_authorized");
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? null,
    role,
  };
}
