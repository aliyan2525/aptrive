import { createClient } from "@/lib/supabase/server";

/**
 * Lightweight catalog reads used to populate admin dropdowns
 * (subject -> practice set pickers on the question form and
 * importer). Kept separate from lib/library-data.ts, which is
 * still mock data for the public-facing Library page.
 */
export async function listSubjectsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listPracticeSetsForAdmin(subjectId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("practice_sets")
    .select("id, slug, title, subject_id, status, question_count")
    .order("title", { ascending: true });

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPracticeSetBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sets")
    .select("id, slug, title, subject_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
