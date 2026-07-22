"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getPublishedQuestionIdsForTopic,
  getQuestionRowsByIds,
} from "@/lib/repositories/questions.repository";
import { gradeAttempt } from "@/lib/services/scoring";
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
    return { isCorrect: false, error: "Question not found.", correctOptionId: null };
  }

  const questionType = (questionRow.question_type as
    | "single_choice"
    | "multiple_choice"
    | "numeric"
    | null) ?? "single_choice";

  // Build options for MCQ grading
  const options = (questionRow.question_options ?? []).map((o) => ({
    id: o.id,
    is_correct: !!o.is_correct,
  })) as { id: string; is_correct: boolean }[];

  const grade = gradeAttempt({
    questionType: questionType === null ? "single_choice" : questionType,
    options: questionType === "numeric" ? undefined : options,
    selectedOptionId: input.selectedOptionId ?? null,
    selectedOptionIds: input.selectedOptionIds ?? null,
    numericAnswer: input.numericAnswer ?? null,
    numericAnswerValue: questionRow.numeric_answer_value ?? null,
    numericAnswerTolerance: questionRow.numeric_answer_tolerance ?? null,
  });

  // For compatibility, keep selected_option_id populated with the
  // first selected option when multiple selectedOptionIds are present.
  const compatibilitySelectedId =
    input.selectedOptionId ?? (input.selectedOptionIds && input.selectedOptionIds[0]) ?? null;

  await recordResponse({
    supabase,
    sessionId: input.sessionId,
    userId: user.id,
    questionId: input.questionId,
    selectedOptionId: compatibilitySelectedId,
    selectedOptionIds: input.selectedOptionIds ?? null,
    isCorrect: grade.isCorrect,
    timeSpentSeconds: input.timeSpentSeconds,
  });

  return {
    isCorrect: grade.isCorrect,
    correctOptionId: grade.correctOptionId ?? null,
    correctOptionIds: grade.correctOptionIds ?? null,
    correctNumericValue: grade.correctNumericValue ?? null,
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
