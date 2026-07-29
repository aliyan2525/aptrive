import { describe, it, expect } from "vitest";
import { gradeAttempt } from "./scoring";

// gradeAttempt mirrors the server-side grading in
// record_attempt_and_update_progress (see supabase/migrations/
// 0009_practice_session_attempts.sql and the pgTAP tests under
// supabase/tests/database/). Keeping both in lockstep matters: this
// file is the fast/local layer, the pgTAP tests are the ones that
// actually guard the write path since the RPC — not this function —
// is what persists a score.

describe("gradeAttempt - single_choice", () => {
  const options = [
    { id: "right", is_correct: true },
    { id: "wrong", is_correct: false },
  ];

  it("grades the correct option as correct", () => {
    const result = gradeAttempt({
      questionType: "single_choice",
      options,
      selectedOptionId: "right",
    });
    expect(result.isCorrect).toBe(true);
    expect(result.correctOptionId).toBe("right");
  });

  it("grades a wrong option as incorrect", () => {
    const result = gradeAttempt({
      questionType: "single_choice",
      options,
      selectedOptionId: "wrong",
    });
    expect(result.isCorrect).toBe(false);
  });

  it("grades no selection as incorrect rather than throwing", () => {
    const result = gradeAttempt({
      questionType: "single_choice",
      options,
      selectedOptionId: null,
    });
    expect(result.isCorrect).toBe(false);
    expect(result.correctOptionId).toBe("right");
  });
});

describe("gradeAttempt - multiple_choice", () => {
  const options = [
    { id: "a", is_correct: true },
    { id: "b", is_correct: true },
    { id: "c", is_correct: false },
  ];

  it("requires an exact match of all correct options, no extras", () => {
    expect(
      gradeAttempt({ questionType: "multiple_choice", options, selectedOptionIds: ["a", "b"] })
        .isCorrect
    ).toBe(true);
  });

  it("is order-independent", () => {
    expect(
      gradeAttempt({ questionType: "multiple_choice", options, selectedOptionIds: ["b", "a"] })
        .isCorrect
    ).toBe(true);
  });

  it("rejects a partial selection (missing a correct option)", () => {
    expect(
      gradeAttempt({ questionType: "multiple_choice", options, selectedOptionIds: ["a"] })
        .isCorrect
    ).toBe(false);
  });

  it("rejects an over-selection (a correct option plus an incorrect one)", () => {
    expect(
      gradeAttempt({ questionType: "multiple_choice", options, selectedOptionIds: ["a", "b", "c"] })
        .isCorrect
    ).toBe(false);
  });

  it("treats no selection as incorrect", () => {
    expect(
      gradeAttempt({ questionType: "multiple_choice", options, selectedOptionIds: [] }).isCorrect
    ).toBe(false);
  });
});

describe("gradeAttempt - numeric", () => {
  it("grades an exact match as correct", () => {
    const result = gradeAttempt({
      questionType: "numeric",
      numericAnswer: 42,
      numericAnswerValue: 42,
      numericAnswerTolerance: 0,
    });
    expect(result.isCorrect).toBe(true);
  });

  it("grades a value within tolerance as correct", () => {
    const result = gradeAttempt({
      questionType: "numeric",
      numericAnswer: 42.3,
      numericAnswerValue: 42,
      numericAnswerTolerance: 0.5,
    });
    expect(result.isCorrect).toBe(true);
  });

  it("grades a value outside tolerance as incorrect", () => {
    const result = gradeAttempt({
      questionType: "numeric",
      numericAnswer: 43,
      numericAnswerValue: 42,
      numericAnswerTolerance: 0.5,
    });
    expect(result.isCorrect).toBe(false);
  });

  it("treats a missing answer as incorrect rather than throwing", () => {
    const result = gradeAttempt({
      questionType: "numeric",
      numericAnswer: null,
      numericAnswerValue: 42,
      numericAnswerTolerance: 0.5,
    });
    expect(result.isCorrect).toBe(false);
  });

  it("treats a missing stored correct value as incorrect rather than throwing", () => {
    const result = gradeAttempt({
      questionType: "numeric",
      numericAnswer: 42,
      numericAnswerValue: null,
      numericAnswerTolerance: 0.5,
    });
    expect(result.isCorrect).toBe(false);
  });

  it("defaults tolerance to 0 when not provided", () => {
    const result = gradeAttempt({
      questionType: "numeric",
      numericAnswer: 42.01,
      numericAnswerValue: 42,
      numericAnswerTolerance: null,
    });
    expect(result.isCorrect).toBe(false);
  });
});
