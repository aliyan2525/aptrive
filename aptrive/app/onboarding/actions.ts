"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { saveOnboarding, type OnboardingInput } from "@/lib/repositories/onboarding.repository";

export async function completeOnboardingAction(input: OnboardingInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  await saveOnboarding(supabase, user.id, input);

  // The dashboard reads student_profiles/goal_progress server-side on
  // every request, but it can be cached by the Next.js router cache
  // between navigations — revalidate so the user lands on a dashboard
  // that reflects what they just entered, not a stale empty state.
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
