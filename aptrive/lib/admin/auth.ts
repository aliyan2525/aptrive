import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const STAFF_ROLES: Profile["role"][] = ["instructor", "content_manager", "administrator"];

export type StaffContext = {
  userId: string;
  email: string;
  fullName: string | null;
  role: Profile["role"];
};

/**
 * Server-only guard for every /admin route and admin server action.
 * Redirects unauthenticated users to /login, and renders a plain
 * "not authorized" redirect for signed-in users without a staff role.
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role ?? "student") as Profile["role"];

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
