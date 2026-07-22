import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type SubjectRow = Database["public"]["Tables"]["subjects"]["Row"];
type PracticeSetRow = Database["public"]["Tables"]["practice_sets"]["Row"];

export type SubjectWithStats = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isComingSoon: boolean;
  practiceSetCount: number;
  questionCount: number;
};

export type PracticeSetSummary = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  chapter: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  questionCount: number;
  estimatedMinutes: number;
  isPremium: boolean;
};

/**
 * Catalog browsing: subjects with live counts pulled from the real
 * question bank (practice_sets / questions), replacing the static
 * lib/library-data.ts numbers for anything under /practice.
 *
 * Query results are cast to the hand-declared Row types immediately
 * after the Supabase call, matching the convention already used in
 * lib/dashboard-data.ts — the installed postgrest-js version doesn't
 * infer Row types from `.select()` strings against this hand-authored
 * Database type, so relying on inference resolves everything to
 * `never`.
 */
export async function listSubjectsWithStats(): Promise<SubjectWithStats[]> {
  const supabase = await createClient();

  const { data: subjectsData, error } = await supabase
    .from("subjects")
    .select("id, slug, name, description, is_coming_soon")
    .order("name", { ascending: true });

  if (error) throw error;
  const subjects = (subjectsData ?? []) as unknown as Pick<
    SubjectRow,
    "id" | "slug" | "name" | "description" | "is_coming_soon"
  >[];
  if (subjects.length === 0) return [];

  const { data: setsData, error: setsError } = await supabase
    .from("practice_sets")
    .select("subject_id, question_count");

  if (setsError) throw setsError;
  const sets = (setsData ?? []) as unknown as Pick<
    PracticeSetRow,
    "subject_id" | "question_count"
  >[];

  const statsBySubject = new Map<string, { sets: number; questions: number }>();
  for (const set of sets) {
    const entry = statsBySubject.get(set.subject_id) ?? { sets: 0, questions: 0 };
    entry.sets += 1;
    entry.questions += set.question_count ?? 0;
    statsBySubject.set(set.subject_id, entry);
  }

  return subjects.map((s) => {
    const stats = statsBySubject.get(s.id) ?? { sets: 0, questions: 0 };
    return {
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      isComingSoon: s.is_coming_soon,
      practiceSetCount: stats.sets,
      questionCount: stats.questions,
    };
  });
}

export async function getSubjectBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, name, description, is_coming_soon")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Pick<
    SubjectRow,
    "id" | "slug" | "name" | "description" | "is_coming_soon"
  > | null;
}

export async function listPracticeSetsForSubject(
  subjectId: string
): Promise<PracticeSetSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sets")
    .select(
      "id, slug, title, topic, chapter, difficulty, question_count, estimated_minutes, is_premium"
    )
    .eq("subject_id", subjectId)
    .order("topic", { ascending: true });

  if (error) throw error;

  const sets = (data ?? []) as unknown as Pick<
    PracticeSetRow,
    | "id"
    | "slug"
    | "title"
    | "topic"
    | "chapter"
    | "difficulty"
    | "question_count"
    | "estimated_minutes"
    | "is_premium"
  >[];

  return sets.map((set) => ({
    id: set.id,
    slug: set.slug,
    title: set.title,
    topic: set.topic,
    chapter: set.chapter,
    difficulty: set.difficulty,
    questionCount: set.question_count,
    estimatedMinutes: set.estimated_minutes,
    isPremium: set.is_premium,
  }));
}
