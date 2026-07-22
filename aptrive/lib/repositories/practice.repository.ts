import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;
type SessionRow = Database["public"]["Tables"]["practice_sessions"]["Row"];
type SessionInsert = Database["public"]["Tables"]["practice_sessions"]["Insert"];
type ResponseInsert = Database["public"]["Tables"]["question_responses"]["Insert"];

type SessionCore = Pick<
  SessionRow,
  "id" | "total_questions" | "correct_count" | "incorrect_count" | "skipped_count" | "status"
>;

/**
 * All Supabase call sites below cast query results to the hand-declared
 * Row types immediately (matching lib/dashboard-data.ts's convention),
 * and cast insert/update payloads with `as any` at the call site. This
 * project's installed postgrest-js version doesn't infer types from
 * `.select()`/`.insert()` strings against the hand-authored Database
 * type, so both directions resolve to `never` without the casts.
 */

export async function getOrCreatePracticeSetSession(
  userId: string,
  practiceSetId: string,
  subjectId: string,
  totalQuestions: number
): Promise<SessionCore> {
  const supabase = await createClient();

  const { data: existing, error: findError } = await supabase
    .from("practice_sessions")
    .select("id, total_questions, correct_count, incorrect_count, skipped_count, status")
    .eq("user_id", userId)
    .eq("practice_set_id", practiceSetId)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;
  const existingRow = existing as unknown as SessionCore | null;
  if (existingRow) return existingRow;

  const payload: SessionInsert = {
    user_id: userId,
    practice_set_id: practiceSetId,
    subject_id: subjectId,
    mode: "practice",
    status: "in_progress",
    total_questions: totalQuestions,
  };

  const { data: created, error: createError } = await supabase
    .from("practice_sessions")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves insert/update payload types to `never` here; see comment above.
    .insert(payload as any)
    .select("id, total_questions, correct_count, incorrect_count, skipped_count, status")
    .single();

  if (createError) throw createError;
  return created as unknown as SessionCore;
}

export type AdHocSessionKind = "revision" | "bookmarks";

/** Ad-hoc session not tied to a single practice set — used for
 * revision (incorrect questions) and "practice my bookmarks" flows.
 * `mode` is kept as `practice` because the DB check constraint on
 * `practice_sessions.mode` only allows
 * ('practice','mock','exam','daily-challenge') — adding a `revision`
 * value would need its own migration. Instead the distinction (and
 * the intended question list, which has nowhere else to live since
 * there's no exam_questions-style join table for free-form sessions)
 * is stashed in the `metadata` jsonb column at creation time. */
export async function createAdHocSession(
  userId: string,
  kind: AdHocSessionKind,
  questionIds: string[]
): Promise<SessionCore & { metadata: Record<string, unknown> }> {
  const supabase = await createClient();

  const payload: SessionInsert = {
    user_id: userId,
    mode: "practice",
    status: "in_progress",
    total_questions: questionIds.length,
    metadata: { session_kind: kind, question_ids: questionIds },
  };

  const { data, error } = await supabase
    .from("practice_sessions")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves insert/update payload types to `never` here; see comment above.
    .insert(payload as any)
    .select(
      "id, total_questions, correct_count, incorrect_count, skipped_count, status, metadata"
    )
    .single();

  if (error) throw error;
  return data as unknown as SessionCore & { metadata: Record<string, unknown> };
}

export async function getSessionById(sessionId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sessions")
    .select(
      "id, mode, status, total_questions, correct_count, incorrect_count, skipped_count, metadata"
    )
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as
    | (SessionCore & { mode: string; metadata: Record<string, unknown> })
    | null;
}

export async function getSessionResponses(sessionId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_responses")
    .select("question_id, selected_option_id, selected_option_ids, is_correct, flagged_for_review")
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []) as unknown as {
    question_id: string;
    selected_option_id: string | null;
    is_correct: boolean;
    flagged_for_review: boolean;
  }[];
}

/**
 * Records (or overwrites, if the learner changes their answer before
 * finishing the session) one question's response, then recomputes the
 * parent session's counters. Grading happens in the caller — this
 * function only persists an already-graded result.
 *
 * Everything downstream (topic_mastery, daily_activity, study_streaks)
 * is kept in sync automatically by the `on_question_response_insert`
 * trigger already installed in 0003_progress_practice_engagement.sql —
 * this function does not duplicate that logic.
 */
export async function recordResponse(params: {
  supabase?: SupabaseServer;
  sessionId: string;
  userId: string;
  questionId: string;
  selectedOptionId: string | null;
  selectedOptionIds?: string[] | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  flaggedForReview?: boolean;
}) {
  const supabase = params.supabase ?? (await createClient());

  // Use `any` here because the typed ResponseInsert lacks the new
  // selected_option_ids column in the hand-authored types.
  const payload: any = {
    session_id: params.sessionId,
    user_id: params.userId,
    question_id: params.questionId,
    selected_option_id: params.selectedOptionId,
    selected_option_ids: params.selectedOptionIds ?? null,
    is_correct: params.isCorrect,
    flagged_for_review: params.flaggedForReview ?? false,
    time_spent_seconds: params.timeSpentSeconds,
  };

  const { error: upsertError } = await supabase
    .from("question_responses")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves insert/update payload types to `never` here; see comment above.
    .upsert(payload as any, { onConflict: "session_id,question_id" });

  if (upsertError) throw upsertError;

  const { data: responsesData, error: countError } = await supabase
    .from("question_responses")
    .select("is_correct")
    .eq("session_id", params.sessionId);

  if (countError) throw countError;
  const responses = (responsesData ?? []) as unknown as { is_correct: boolean }[];

  const correct = responses.filter((r) => r.is_correct).length;
  const incorrect = responses.length - correct;

  const { error: updateError } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves insert/update payload types to `never` here; see comment above.
    supabase.from("practice_sessions") as any
  )
    .update({ correct_count: correct, incorrect_count: incorrect })
    .eq("id", params.sessionId)
    .eq("user_id", params.userId);

  if (updateError) throw updateError;

  return { correct, incorrect };
}

export async function completeSession(sessionId: string, userId: string) {
  const supabase = await createClient();

  const { data: sessionData, error: fetchError } = await supabase
    .from("practice_sessions")
    .select("total_questions, correct_count, incorrect_count")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw fetchError;
  const session = sessionData as unknown as {
    total_questions: number;
    correct_count: number;
    incorrect_count: number;
  };

  const answered = session.correct_count + session.incorrect_count;
  const scorePercent =
    answered > 0 ? Math.round((session.correct_count / answered) * 10000) / 100 : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves insert/update payload types to `never` here; see comment above.
  const { error } = await (supabase.from("practice_sessions") as any)
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      score_percent: scorePercent,
      skipped_count: Math.max(session.total_questions - answered, 0),
    })
    .eq("id", sessionId)
    .eq("user_id", userId);

  if (error) throw error;
  return { scorePercent };
}
