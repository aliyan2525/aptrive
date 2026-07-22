import "server-only";

type OptionRow = { id: string; is_correct: boolean };

export type GradeResult = {
  isCorrect: boolean;
  correctOptionId: string | null;
};

/**
 * Grades a single-answer MCQ attempt. Never trust a client-supplied
 * `isCorrect` flag — this is the one place that decides correctness,
 * always run server-side (Server Action), against the options fetched
 * fresh from the DB for this question.
 */
export function gradeMcqAttempt(
  options: OptionRow[],
  selectedOptionId: string | null
): GradeResult {
  const correctOption = options.find((o) => o.is_correct);
  const correctOptionId = correctOption?.id ?? null;

  if (!selectedOptionId) {
    return { isCorrect: false, correctOptionId };
  }

  return {
    isCorrect: selectedOptionId === correctOptionId,
    correctOptionId,
  };
}
