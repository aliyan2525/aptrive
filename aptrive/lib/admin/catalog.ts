import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type SubjectRow = Pick<Tables["subjects"]["Row"], "id" | "slug" | "name">;
type PracticeSetRow = Pick<
  Tables["practice_sets"]["Row"],
  "id" | "slug" | "title" | "subject_id" | "status" | "question_count"
>;
type PracticeSetLookupRow = Pick<Tables["practice_sets"]["Row"], "id" | "slug" | "title" | "subject_id">;

type UniversityRow = Pick<Tables["universities"]["Row"], "id" | "name" | "slug">;
type TestRow = Pick<Tables["tests"]["Row"], "id" | "name" | "slug" | "university_id">;
type DifficultyLevelRow = Pick<Tables["difficulty_levels"]["Row"], "id" | "label" | "rank">;
type ChapterRow = Pick<Tables["chapters"]["Row"], "id" | "name" | "slug" | "subject_id">;
type TopicRow = Pick<Tables["topics"]["Row"], "id" | "name" | "slug" | "chapter_id">;
type SubtopicRow = Pick<Tables["subtopics"]["Row"], "id" | "name" | "slug" | "topic_id">;

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

export async function listUniversitiesForAdmin(): Promise<UniversityRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("id, name, slug")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as UniversityRow[];
}

export async function listTestsForAdmin(): Promise<TestRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tests")
    .select("id, name, slug, university_id")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as TestRow[];
}

export async function listDifficultyLevelsForAdmin(): Promise<DifficultyLevelRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("difficulty_levels")
    .select("id, label, rank")
    .order("rank", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as DifficultyLevelRow[];
}

export async function listChaptersForAdmin(): Promise<ChapterRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("id, name, slug, subject_id")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as ChapterRow[];
}

export async function listTopicsForAdmin(): Promise<TopicRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("topics")
    .select("id, name, slug, chapter_id")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as TopicRow[];
}

export async function listSubtopicsForAdmin(): Promise<SubtopicRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subtopics")
    .select("id, name, slug, topic_id")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as SubtopicRow[];
}
