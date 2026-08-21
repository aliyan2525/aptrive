import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/settings/SettingsClient";
import { createClient } from "@/lib/supabase/server";
import { getStudentProfile } from "@/lib/repositories/onboarding.repository";

export const metadata: Metadata = {
  title: "Settings - Aptrive",
  description: "Manage your Aptrive account settings and study preferences.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/settings");

  const profile = await getStudentProfile(supabase, user.id);

  return (
    <div className="py-6 sm:py-8">
      <SettingsClient
        user={{
          email: user.email ?? "",
          displayName: profile?.display_name ?? user.user_metadata?.full_name ?? "Aptrive student",
        }}
        profile={profile}
      />
    </div>
  );
}
