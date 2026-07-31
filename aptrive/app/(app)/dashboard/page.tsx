import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getDashboardData } from "@/lib/dashboard-data";
import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const profile = profileData as Pick<Profile, "full_name" | "role" | "created_at"> | null;
  const dashboardData = await getDashboardData(user.id);
  const displayName =
    dashboardData.studentProfile?.display_name || profile?.full_name || user.email || "there";
  const firstName = displayName.split(" ")[0] || "there";

  return (
    <DashboardClient
      firstName={firstName}
      email={user.email ?? "Unknown"}
      role={profile?.role ?? "student"}
      memberSince={profile?.created_at ?? null}
      data={dashboardData}
    />
  );
}
