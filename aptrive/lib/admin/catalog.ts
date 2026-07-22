import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type SubjectRow = Pick<Tables["subjects"]["Row"], "id" | "slug" | "name">;
type PracticeSetRow = Pick<
  Tables["practice_sets"]["Row"],
  "id" | "slug" | "title" | "subject_id" | "status" | "question_count"
>;
type PracticeSetLookupRow = Pick<Tables["practice_sets"]["Row"], "id" | "slug" | "title" | "subject_id">;

/**
 * Lightweight catalog reads used to populate admin dropdowns
 * (subject -> practice set pickers on the question form and
 * importer). Kept separate from lib/library-data.ts, which is
 * still mock data for the public-facing Library page.
 *
 * Every result is cast to a hand-written row type — this project's
 * Database type has no Relationships metadata, so the Supabase client
 * can't reliably infer plain select() results either (same reasoning
 * as lib/dashboard-data.ts).
 */
export async function listSubjectsForAdmin(): Promise<SubjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, name")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as SubjectRow[];
}

export async function listPracticeSetsForAdmin(subjectId?: string): Promise<PracticeSetRow[]> {
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
  return (data ?? []) as unknown as PracticeSetRow[];
}

export async function getPracticeSetBySlug(slug: string): Promise<PracticeSetLookupRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sets")
    .select("id, slug, title, subject_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as PracticeSetLookupRow | null;
}
