import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { getStudentProfile } from "@/lib/repositories/onboarding.repository";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Onboarding - Aptrive",
  description: "Personalize your Aptrive dashboard, goals, and study plan.",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  const existingProfile = await getStudentProfile(supabase, user.id);

  return <OnboardingFlow existingProfile={existingProfile} />;
}
