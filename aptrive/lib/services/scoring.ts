import "server-only";

type OptionRow = { id: string; is_correct: boolean };

export type GradeResult = {
  isCorrect: boolean;
  // For single-answer MCQ
  correctOptionId?: string | null;
  // For multiple-answer MCQ
  correctOptionIds?: string[];
  // For numeric questions
  correctNumericValue?: number | null;
};

/**
 * Grades an attempt for single_choice, multiple_choice, or numeric
 * question types. This runs server-side against the DB-fetched answer
 * key and returns structured info the caller can persist and surface.
 */
export function gradeAttempt(params: {
  questionType: "single_choice" | "multiple_choice" | "numeric";
  options?: OptionRow[]; // required for MCQ types
  selectedOptionId?: string | null; // single-choice client input
  selectedOptionIds?: string[] | null; // multiple-choice client input
  numericAnswer?: number | null; // numeric client input
  numericAnswerValue?: number | null; // correct stored value from DB
  numericAnswerTolerance?: number | null; // allowed tolerance from DB
}): GradeResult {
  const { questionType } = params;

  if (questionType === "numeric") {
    const correct = params.numericAnswerValue ?? null;
    const tol = params.numericAnswerTolerance ?? 0;
    if (params.numericAnswer === undefined || params.numericAnswer === null || correct === null) {
      return { isCorrect: false, correctNumericValue: correct };
    }
    const diff = Math.abs((params.numericAnswer ?? 0) - (correct ?? 0));
    return { isCorrect: diff <= tol, correctNumericValue: correct };
  }

  // For MCQ types we need options populated
  const options = params.options ?? [];
  if (questionType === "multiple_choice") {
    const correctIds = options.filter((o) => o.is_correct).map((o) => o.id).sort();
    const selected = (params.selectedOptionIds ?? []).filter(Boolean).sort();

    // Consider exact-match as correct: all correct selected, no incorrects
    const isCorrect = JSON.stringify(correctIds) === JSON.stringify(selected);
    return { isCorrect, correctOptionIds: correctIds };
  }

  // Default: single_choice
  const correct = options.find((o) => o.is_correct)?.id ?? null;
  if (!params.selectedOptionId) return { isCorrect: false, correctOptionId: correct };
  return { isCorrect: params.selectedOptionId === correct, correctOptionId: correct };
}
