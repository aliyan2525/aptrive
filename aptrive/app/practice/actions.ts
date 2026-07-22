"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getQuestionRowsByIds } from "@/lib/repositories/questions.repository";
import { gradeMcqAttempt } from "@/lib/services/scoring";
import {
  completeSession as completeSessionRepo,
  createAdHocSession,
  recordResponse,
} from "@/lib/repositories/practice.repository";
import { toggleQuestionBookmark } from "@/lib/repositories/bookmarks.repository";

export type SubmitAnswerInput = {
  sessionId: string;
  questionId: string;
  selectedOptionId: string | null;
  timeSpentSeconds: number;
};

export type SubmitAnswerResult = {
  isCorrect: boolean;
  correctOptionId: string | null;
  error?: string;
};

/**
 * The only sanctioned write path for a question attempt. Re-fetches
 * the question's real answer key server-side and grades against that
 * — a client can never post a fabricated "correct" result. Progress
 * (topic mastery, streaks, daily activity) updates automatically via
 * the DB trigger on question_responses; this action doesn't touch it.
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

  const [questionRow] = await getQuestionRowsByIds([input.questionId]);
  if (!questionRow) {
    return { isCorrect: false, correctOptionId: null, error: "Question not found." };
  }

  const { isCorrect, correctOptionId } = gradeMcqAttempt(
    questionRow.question_options,
    input.selectedOptionId
  );

  await recordResponse({
    supabase,
    sessionId: input.sessionId,
    userId: user.id,
    questionId: input.questionId,
    selectedOptionId: input.selectedOptionId,
    isCorrect,
    timeSpentSeconds: input.timeSpentSeconds,
  });

  return { isCorrect, correctOptionId };
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
