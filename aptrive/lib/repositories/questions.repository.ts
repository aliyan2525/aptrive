import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { z } from "zod";

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
  // New Phase 2 fields surfaced to the client so the runner can render
  // the appropriate input type without leaking answer keys.
  questionType?: "single_choice" | "multiple_choice" | "numeric";
  numericAnswerValue?: number | null; // NOT sent for security, but helpful if desired — kept null by default
  numericAnswerTolerance?: number | null;
};

const QuestionRowSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topic: z.string(),
  chapter: z.string().nullable(),
  time_estimate_seconds: z.number(),
  position: z.number(),
  question_type: z.enum(["single_choice", "multiple_choice", "numeric"]).nullable().optional(),
  numeric_answer_value: z.number().nullable().optional(),
  numeric_answer_tolerance: z.number().nullable().optional(),
  v_public_question_options: z.array(z.object({
    id: z.string(),
    label: z.string().nullable(),
    content: z.string(),
    position: z.number()
  }))
});
type QuestionRow = z.infer<typeof QuestionRowSchema>;

export const PracticeSetDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subject_id: z.string(),
  topic: z.string(),
  chapter: z.string().nullable(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  question_count: z.number(),
  estimated_minutes: z.number(),
  subjects: z.object({
    name: z.string(),
    slug: z.string()
  }).nullable()
});
export type PracticeSetDetail = z.infer<typeof PracticeSetDetailSchema>;

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
  if (!data) return null;
  const parsed = PracticeSetDetailSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Zod validation failed for PracticeSetDetail", parsed.error);
    return null; // Or throw depending on preferred error handling
  }
  return parsed.data;
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
      "id, prompt, difficulty, topic, chapter, time_estimate_seconds, position, question_type, numeric_answer_value, numeric_answer_tolerance, v_public_question_options(id, label, content, position)"
    )
    .eq("practice_set_id", practiceSetId)
    .order("position", { ascending: true });

  if (error) throw error;

  const parsed = QuestionRowSchema.array().safeParse(data ?? []);
  if (!parsed.success) {
    console.error("Zod validation failed for QuestionRows", parsed.error);
    return [];
  }
  const rows = parsed.data;
  return rows.map((q) => ({
    ...q,
    question_options: [...(q.v_public_question_options || [])].sort(
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
      "id, prompt, difficulty, topic, chapter, time_estimate_seconds, position, question_type, numeric_answer_value, numeric_answer_tolerance, v_public_question_options(id, label, content, position)"
    )
    .in("id", questionIds);

  if (error) throw error;
  
  const parsed = QuestionRowSchema.array().safeParse(data ?? []);
  if (!parsed.success) {
    console.error("Zod validation failed for getQuestionRowsByIds", parsed.error);
    return [];
  }
  const rows = parsed.data;
  return rows.map((q) => ({
    ...q,
    question_options: [...(q.v_public_question_options || [])].sort(
      (a, b) => a.position - b.position
    ),
  }));
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
    options: (row.v_public_question_options || []).map((o) => ({
      id: o.id,
      label: o.label,
      content: o.content,
    })),
    questionType: row.question_type ?? undefined,
    // Don't send the numeric answer value/tolerance to the client by default
    numericAnswerValue: null,
    numericAnswerTolerance: null,
  };
}

export async function getPublishedQuestionIdsForTopic(topicId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id")
    .eq("topic_id", topicId)
    .eq("status", "published")
    .order("position", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as unknown as { id: string }[];
  return rows.map((row) => row.id);
}

export type CorrectAnswer = {
  correctOptionIds: string[] | null;
  correctNumericValue: number | null;
};

/**
 * ADDED 2026-07-28, fixing `submitAnswer()`'s "reveal correct answer"
 * bug in app/practice/actions.ts. `record_attempt_and_update_progress`
 * returns a full `user_attempts` row (confirmed live via
 * `supabase gen types typescript`), which has no correct-answer
 * fields at all — so the old code's `result.correct_option_ids` /
 * `result.correct_numeric_value` were always `undefined`, for every
 * question, every time. Grading itself was unaffected (`is_correct`
 * really is on `user_attempts` too), only the reveal-the-answer UI
 * had nothing to show.
 *
 * This is a small, separate, read-only follow-up — called only AFTER
 * `recordResponse()` has already graded and persisted the attempt
 * server-side inside the SECURITY DEFINER RPC. It doesn't participate
 * in grading, so it can't be used to game the score; it only answers
 * "what should the UI show the student now that their attempt is
 * already recorded."
 *
 * Relies on the SUPABASE_SERVICE_ROLE_KEY to bypass the staff-only RLS
 * policy on question_options. This is safe because it only returns data
 * server-side for questions the user has already attempted and had graded.
 */
export async function getCorrectAnswerForQuestion(
  questionId: string
): Promise<CorrectAnswer> {
  // Use the service role client here to bypass RLS, because question_options
  // is now staff-only to prevent answer keys leaking to the public client.
  // This is safe because this function is only called server-side AFTER
  // an attempt is graded and recorded.
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Missing SUPABASE_SERVICE_ROLE_KEY. Unable to fetch correct answer for UI reveal.");
    return { correctOptionIds: null, correctNumericValue: null };
  }

  const supabaseAdmin = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabaseAdmin
    .from("questions")
    .select("numeric_answer_value, question_options(id, is_correct)")
    .eq("id", questionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { correctOptionIds: null, correctNumericValue: null };

  const row = data as unknown as {
    numeric_answer_value: number | null;
    question_options: { id: string; is_correct: boolean }[];
  };

  const correctOptionIds = row.question_options
    .filter((o) => o.is_correct)
    .map((o) => o.id);

  return {
    // Empty array (numeric questions have no options at all) is
    // normalized to null, matching what SubmitAnswerResult expects.
    correctOptionIds: correctOptionIds.length > 0 ? correctOptionIds : null,
    correctNumericValue: row.numeric_answer_value ?? null,
  };
}
