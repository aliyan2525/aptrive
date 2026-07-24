import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;
type SessionRow = Database["public"]["Tables"]["practice_sessions"]["Row"];
type SessionInsert = Database["public"]["Tables"]["practice_sessions"]["Insert"];
type UserAttemptRow = Database["public"]["Tables"]["user_attempts"]["Row"];
type RecordAttemptResult =
  Database["public"]["Functions"]["record_attempt_and_update_progress"]["Returns"];

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

export type AdHocSessionKind = "revision" | "bookmarks" | "topic";

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
  questionIds: string[],
  metadata?: Record<string, unknown>
): Promise<SessionCore & { metadata: Record<string, unknown> }> {
  const supabase = await createClient();

  const payload: SessionInsert = {
    user_id: userId,
    mode: "practice",
    status: "in_progress",
    total_questions: questionIds.length,
    metadata: { session_kind: kind, question_ids: questionIds, ...(metadata ?? {}) },
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

/**
 * Reads answered-so-far state for a practice session from
 * `user_attempts` (source of truth as of the user_attempts migration —
 * see PRACTICE_MIGRATION_WRITEUP.md). `selected_option_id` is derived
 * as the first entry of `selected_option_ids` for single-choice
 * compatibility with existing UI code that still reads the singular
 * field. `flagged_for_review` from the legacy `question_responses`
 * shape was dropped: it wasn't read by any UI component
 * (components/practice/PracticeRunner.tsx destructures the response
 * shape but never uses that field), so it isn't part of `user_attempts`
 * — see the writeup for this scope decision.
 */
export async function getSessionResponses(sessionId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_attempts")
    .select("question_id, selected_option_ids, is_correct")
    .eq("practice_session_id", sessionId)
    .eq("user_id", userId);

  if (error) throw error;
  const rows = (data ?? []) as unknown as Pick<
    UserAttemptRow,
    "question_id" | "selected_option_ids" | "is_correct"
  >[];

  return rows.map((row) => ({
    question_id: row.question_id,
    selected_option_id: row.selected_option_ids?.[0] ?? null,
    selected_option_ids: row.selected_option_ids ?? null,
    is_correct: row.is_correct,
  }));
}

/**
 * Records (or, if the learner changes their answer before finishing
 * the session, revises) one question's attempt by calling
 * `record_attempt_and_update_progress` — the only sanctioned write
 * path into `user_attempts` (it has no client-writable RLS policy).
 * Grading now happens server-side inside the RPC against the real
 * answer key; this function no longer accepts a pre-graded
 * `isCorrect` from the caller. Progress side effects
 * (user_topic_progress, user_xp_ledger, user_streaks) are handled
 * atomically by the RPC — this function does not duplicate that logic.
 *
 * The `practice_sessions.correct_count`/`incorrect_count` recompute-
 * and-update step from the legacy version of this function is
 * intentionally gone: those columns are no longer written to by this
 * path (see PRACTICE_MIGRATION_WRITEUP.md — "computed on read"
 * decision). `completeSession` below computes the score straight from
 * `user_attempts`.
 */
export async function recordResponse(params: {
  supabase?: SupabaseServer;
  practiceSessionId: string;
  userId: string;
  questionId: string;
  selectedOptionIds?: string[] | null;
  numericAnswer?: number | null;
  timeSpentSeconds: number;
}) {
  const supabase = params.supabase ?? (await createClient());

  const { data, error } = await supabase.rpc("record_attempt_and_update_progress", {
    attempt: {
      practice_session_id: params.practiceSessionId,
      question_id: params.questionId,
      selected_option_ids: params.selectedOptionIds ?? null,
      numeric_answer_given: params.numericAnswer ?? null,
      time_taken_seconds: params.timeSpentSeconds,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves this RPC's `attempt: Record<string, unknown>` arg to `never` against a specific object literal; see comment above.
  } as any);

  if (error) throw error;
  return data as unknown as RecordAttemptResult;
}

/**
 * Score is computed fresh from `user_attempts` grouped by
 * `practice_session_id` rather than read from the cached
 * `practice_sessions.correct_count`/`incorrect_count` columns — those
 * columns are kept in the schema for historical rows but are no
 * longer written to by this path, so reading them here would silently
 * go stale. See PRACTICE_MIGRATION_WRITEUP.md for the full decision
 * writeup.
 */
export async function completeSession(sessionId: string, userId: string) {
  const supabase = await createClient();

  const [{ data: sessionData, error: fetchError }, { data: attemptsData, error: attemptsError }] =
    await Promise.all([
      supabase
        .from("practice_sessions")
        .select("total_questions")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .single(),
      supabase
        .from("user_attempts")
        .select("is_correct")
        .eq("practice_session_id", sessionId)
        .eq("user_id", userId),
    ]);

  if (fetchError) throw fetchError;
  if (attemptsError) throw attemptsError;

  const session = sessionData as unknown as { total_questions: number };
  const attempts = (attemptsData ?? []) as unknown as Pick<UserAttemptRow, "is_correct">[];

  const answered = attempts.length;
  const correct = attempts.filter((a) => a.is_correct).length;
  const scorePercent = answered > 0 ? Math.round((correct / answered) * 10000) / 100 : 0;

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
