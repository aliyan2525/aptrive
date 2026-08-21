"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { saveOnboarding, type OnboardingInput } from "@/lib/repositories/onboarding.repository";

export async function saveSettingsAction(input: OnboardingInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  await saveOnboarding(supabase, user.id, input);
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/profile");
}
