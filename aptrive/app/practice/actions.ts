"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPublishedQuestionIdsForTopic } from "@/lib/repositories/questions.repository";
import {
  completeSession as completeSessionRepo,
  createAdHocSession,
  recordResponse,
} from "@/lib/repositories/practice.repository";
import { toggleQuestionBookmark } from "@/lib/repositories/bookmarks.repository";

export type SubmitAnswerInput = {
  sessionId: string;
  questionId: string;
  // single-choice clients may post `selectedOptionId`; multiple-choice
  // clients should post `selectedOptionIds`. Numeric clients post
  // `numericAnswer`.
  selectedOptionId?: string | null;
  selectedOptionIds?: string[] | null;
  numericAnswer?: number | null;
  timeSpentSeconds: number;
};

export type SubmitAnswerResult = {
  isCorrect: boolean;
  // single-choice
  correctOptionId?: string | null;
  // multiple-choice
  correctOptionIds?: string[] | null;
  // numeric
  correctNumericValue?: number | null;
  error?: string;
};

/**
 * The only sanctioned write path for a question attempt. Grading now
 * happens server-side inside `record_attempt_and_update_progress`
 * (SECURITY DEFINER, re-fetches the real answer key itself) — a
 * client can never post a fabricated "correct" result, and this
 * action no longer needs to fetch the question or call
 * `gradeAttempt` locally to grade it. Progress (topic progress, XP,
 * streaks) updates atomically inside the RPC; this action doesn't
 * touch it directly.
 *
 * `SubmitAnswerInput`/`SubmitAnswerResult` are unchanged so the
 * calling UI (components/practice/PracticeRunner.tsx) needed no
 * changes.
 */
export async function submitAnswer(
  input: SubmitAnswerInput
): Promise<SubmitAnswerResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isCorrect: false, correctOptionId: null, error: "Not signed in." };
  }

  // Normalize single-choice input onto the array shape the RPC expects.
  const selectedOptionIds =
    input.selectedOptionIds ?? (input.selectedOptionId ? [input.selectedOptionId] : null);

  const result = await recordResponse({
    supabase,
    practiceSessionId: input.sessionId,
    userId: user.id,
    questionId: input.questionId,
    selectedOptionIds,
    numericAnswer: input.numericAnswer ?? null,
    timeSpentSeconds: input.timeSpentSeconds,
  });

  const correctOptionIds = result.correct_option_ids ?? null;

  return {
    isCorrect: result.is_correct,
    // Single-choice callers read `correctOptionId`; derive it from the
    // (always single-element, for single_choice questions) array the
    // RPC returns.
    correctOptionId: correctOptionIds?.[0] ?? null,
    correctOptionIds,
    correctNumericValue: result.correct_numeric_value ?? null,
  };
}

export async function completeSessionAction(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in.");

  const result = await completeSessionRepo(sessionId, user.id);
  revalidatePath("/dashboard");
  revalidatePath("/practice/revision");
  return result;
}

/** Starts a free-form session (revision or bookmarks) over an explicit
 * question list, then sends the learner straight into it. */
export async function startAdHocSession(
  kind: "revision" | "bookmarks",
  questionIds: string[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/practice/revision");
  if (questionIds.length === 0) return;

  const session = await createAdHocSession(user.id, kind, questionIds);
  redirect(`/practice/session/${session.id}`);
}

export async function startTopicPractice(topicId: string, topicName: string, subjectSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/practice/subjects/${subjectSlug}`);
  }

  const questionIds = await getPublishedQuestionIdsForTopic(topicId);
  if (questionIds.length === 0) {
    redirect(`/practice/subjects/${subjectSlug}?empty=1`);
  }

  const session = await createAdHocSession(user.id, "topic", questionIds, {
    topic_id: topicId,
    topic_name: topicName,
    subject_slug: subjectSlug,
  });
  redirect(`/practice/session/${session.id}`);
}

export async function toggleBookmarkAction(questionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in.");

  const nowBookmarked = await toggleQuestionBookmark(user.id, questionId);
  revalidatePath("/practice/bookmarks");
  return nowBookmarked;
}
