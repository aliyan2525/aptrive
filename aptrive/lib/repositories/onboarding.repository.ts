import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

type StudentProfile = Database["public"]["Tables"]["student_profiles"]["Row"];
type StudentProfileInsert = Database["public"]["Tables"]["student_profiles"]["Insert"];
type EntryTest = Database["public"]["Enums"]["entry_test"];
type EducationLevel = Database["public"]["Enums"]["education_level"];
type StudySchedule = Database["public"]["Enums"]["study_schedule"];

// This project's hand-authored Database type has no generated
// Relationships metadata, which makes .upsert()'s argument type
// resolve to `never`. Matching the established workaround in
// lib/admin/import.ts: cast the query-builder itself, not the
// payload, and cast reads back to the real row type.

export type OnboardingInput = {
  displayName: string;
  targetUniversity: string;
  targetProgram: string;
  entryTest: EntryTest;
  educationLevel: EducationLevel;
  matricMarks: number | null;
  intermediateMarks: number | null;
  expectedTestDate: string | null; // ISO date (yyyy-mm-dd) or null
  preferredStudySchedule: StudySchedule;
  dailyStudyTargetMinutes: number;
  improvementSubjects: string[];
};

/**
 * Reads the signed-in user's onboarding/academic profile, or null if
 * they haven't completed onboarding yet. Used both by the dashboard
 * (already wired — see lib/dashboard-data.ts) and by the onboarding
 * flow itself to pre-fill the form on a return visit.
 */
export async function getStudentProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<StudentProfile | null> {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load student profile: ${error.message}`);
  }

  return data;
}

/**
 * Upserts the student's onboarding profile and ensures a today-dated
 * daily `goal_progress` row exists so the dashboard's goal card has
 * something real to compare against on day one, before the user has
 * necessarily set an explicit goal anywhere else.
 *
 * Two separate writes, not a single RPC — student_profiles and
 * goal_progress are independent tables with independent RLS "own row"
 * policies, and Postgres has no cross-table upsert primitive. If the
 * goal_progress insert fails after the profile write succeeds, the
 * profile write itself is still valid and shouldn't be rolled back
 * for it: a missing goal row degrades gracefully (dashboard just shows
 * no daily goal yet), whereas a missing profile is the actual
 * onboarding-completion signal. So profile write failures throw;
 * goal-row failures are logged and swallowed.
 */
export async function saveOnboarding(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: OnboardingInput
): Promise<StudentProfile> {
  const profilePayload: StudentProfileInsert = {
    user_id: userId,
    display_name: input.displayName || null,
    target_university: input.targetUniversity || null,
    target_degree: input.targetProgram || null,
    entry_test: input.entryTest || null,
    education_level: input.educationLevel || null,
    matric_marks: input.matricMarks,
    intermediate_marks: input.intermediateMarks,
    expected_test_date: input.expectedTestDate,
    preferred_schedule: input.preferredStudySchedule || null,
    daily_study_target_minutes: input.dailyStudyTargetMinutes,
    weak_subjects: input.improvementSubjects,
  };

    const { data, error } = await supabase.from("student_profiles")
    .upsert(profilePayload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to save onboarding profile: ${error.message}`);
  }

  const today = new Date().toISOString().slice(0, 10);
    const { error: goalError } = await supabase.from("study_goals").upsert(
    {
      user_id: userId,
      period: "daily",
      period_start: today,
      target_minutes: input.dailyStudyTargetMinutes,
      target_questions: 20,
    },
    { onConflict: "user_id,period,period_start", ignoreDuplicates: true }
  );

  if (goalError) {
    // Non-fatal — see function comment above.
    console.error("saveOnboarding: failed to seed today's goal_progress row", goalError.message);
  }

  return data as StudentProfile;
}

/** Whether this user still needs to go through onboarding. Used by
 * middleware to redirect first-time users, and by any page that wants
 * to gate on onboarding completion. */
export function needsOnboarding(profile: StudentProfile | null): boolean {
  return !profile;
}
