import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ClientOption = {
  id: string;
  label: string | null;
  content: string;
};

/** Question shape safe to send to a Client Component — never carries
 * `is_correct`, so the answer key can't leak into the browser bundle
 * or dev tools network tab. */
export type ClientQuestion = {
  id: string;
  prompt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  chapter: string | null;
  timeEstimateSeconds: number;
  options: ClientOption[];
};

type QuestionRow = {
  id: string;
  prompt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  chapter: string | null;
  time_estimate_seconds: number;
  position: number;
  question_options: {
    id: string;
    label: string | null;
    content: string;
    is_correct: boolean;
    position: number;
  }[];
};

export type PracticeSetDetail = {
  id: string;
  slug: string;
  title: string;
  subject_id: string;
  topic: string;
  chapter: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  question_count: number;
  estimated_minutes: number;
  subjects: { name: string; slug: string } | null;
};

export async function getPracticeSetBySlug(
  slug: string
): Promise<PracticeSetDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sets")
    .select(
      "id, slug, title, subject_id, topic, chapter, difficulty, question_count, estimated_minutes, subjects(name, slug)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  // Nested/embedded selects aren't typed by database.types.ts yet (no
  // Relationships metadata) — safe to assert since the shape is fixed
  // by the `.select()` string above.
  return data as unknown as PracticeSetDetail | null;
}

/**
 * Full question + option rows for a practice set, ordered for a stable
 * session. Only ever call this from server-side code (Server Component
 * or Server Action) — it includes `is_correct` on purpose, for grading.
 */
export async function getQuestionRowsForPracticeSet(
  practiceSetId: string
): Promise<QuestionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, prompt, difficulty, topic, chapter, time_estimate_seconds, position, question_options(id, label, content, is_correct, position)"
    )
    .eq("practice_set_id", practiceSetId)
    .order("position", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as unknown as QuestionRow[];
  return rows.map((q) => ({
    ...q,
    question_options: [...q.question_options].sort(
      (a, b) => a.position - b.position
    ),
  }));
}

export async function getQuestionRowsByIds(
  questionIds: string[]
): Promise<QuestionRow[]> {
  if (questionIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, prompt, difficulty, topic, chapter, time_estimate_seconds, position, question_options(id, label, content, is_correct, position)"
    )
    .in("id", questionIds);

  if (error) throw error;
  return (data ?? []) as unknown as QuestionRow[];
}

/** Strips `is_correct` before the question is handed to a Client Component. */
export function toClientQuestion(row: QuestionRow): ClientQuestion {
  return {
    id: row.id,
    prompt: row.prompt,
    difficulty: row.difficulty,
    topic: row.topic,
    chapter: row.chapter,
    timeEstimateSeconds: row.time_estimate_seconds,
    options: row.question_options.map((o) => ({
      id: o.id,
      label: o.label,
      content: o.content,
    })),
  };
}
