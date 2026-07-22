"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { submitAnswer, completeSessionAction } from "@/app/practice/actions";
import type { ClientQuestion } from "@/lib/repositories/questions.repository";
import BookmarkButton from "./BookmarkButton";

type ExistingResponse = {
  question_id: string;
  selected_option_id: string | null;
  selected_option_ids?: string[] | null;
  is_correct: boolean;
};

type Props = {
  sessionId: string;
  title: string;
  backHref: string;
  backLabel: string;
  questions: ClientQuestion[];
  initialResponses: ExistingResponse[];
  initialBookmarkedIds: string[];
};

type AnswerState = Record<
  string,
  {
    selectedOptionId: string | null;
    selectedOptionIds?: string[] | null;
    numericAnswer?: number | null;
    isCorrect: boolean;
    correctOptionId: string | null;
    correctOptionIds?: string[] | null;
  }
>;

export default function PracticeRunner({
  sessionId,
  title,
  backHref,
  backLabel,
  questions,
  initialResponses,
  initialBookmarkedIds,
}: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>(() => {
    const initial: AnswerState = {};
    for (const r of initialResponses) {
      initial[r.question_id] = {
        selectedOptionId: r.selected_option_id,
        selectedOptionIds: r.selected_option_ids ?? null,
        isCorrect: r.is_correct,
        correctOptionId: null,
      };
    }
    return initial;
  });
  const [pending, startTransition] = useTransition();
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [bookmarked, setBookmarked] = useState<Set<string>>(
    () => new Set(initialBookmarkedIds)
  );
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const question = questions[index];
  const answered = answers[question?.id ?? ""];
  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => Object.values(answers).filter((a) => a.isCorrect).length,
    [answers]
  );

  // For single-choice questions we submit immediately on click.
  async function submitSingle(optionId: string) {
    if (answered || pending) return;

    startTransition(async () => {
      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
      const result = await submitAnswer({
        sessionId,
        questionId: question.id,
        selectedOptionId: optionId,
        timeSpentSeconds,
      });

      setAnswers((prev) => ({
        ...prev,
        [question.id]: {
          selectedOptionId: optionId,
          isCorrect: result.isCorrect,
          correctOptionId: result.correctOptionId ?? null,
        },
      }));
    });
  }

  // For multiple-choice questions, collect selections locally and submit
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set());
  function toggleMulti(optionId: string) {
    if (answered || pending) return;
    setMultiSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(optionId)) copy.delete(optionId);
      else copy.add(optionId);
      return copy;
    });
  }

  async function submitMulti() {
    if (answered || pending) return;
    const selected = Array.from(multiSelected);
    startTransition(async () => {
      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
      const result = await submitAnswer({
        sessionId,
        questionId: question.id,
        selectedOptionIds: selected,
        timeSpentSeconds,
      });

      setAnswers((prev) => ({
        ...prev,
        [question.id]: {
          selectedOptionId: selected[0] ?? null,
          selectedOptionIds: selected,
          isCorrect: result.isCorrect,
          correctOptionIds: result.correctOptionIds ?? null,
          correctOptionId: result.correctOptionId ?? null,
        },
      }));
      setMultiSelected(new Set());
    });
  }

  // Numeric answer flow
  const [numericDraft, setNumericDraft] = useState<string>("");
  async function submitNumeric() {
    if (answered || pending) return;
    const numericVal = numericDraft.trim() === "" ? null : Number(numericDraft);
    startTransition(async () => {
      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
      const result = await submitAnswer({
        sessionId,
        questionId: question.id,
        numericAnswer: numericVal,
        timeSpentSeconds,
      });

      setAnswers((prev) => ({
        ...prev,
        [question.id]: {
          selectedOptionId: null,
          numericAnswer: numericVal,
          isCorrect: result.isCorrect,
          correctOptionId: result.correctOptionId ?? null,
          correctNumericValue: result.correctNumericValue ?? null,
        },
      }));
      setNumericDraft("");
    });
  }

  function goTo(nextIndex: number) {
    setIndex(nextIndex);
    setQuestionStartedAt(Date.now());
  }

  function handleFinish() {
    startTransition(async () => {
      const result = await completeSessionAction(sessionId);
      setScore(result.scorePercent);
      setFinished(true);
    });
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="eyebrow">Session complete</div>
        <h1 className="font-display mt-3 text-3xl font-semibold text-fg">
          {score}% correct
        </h1>
        <p className="mt-2 text-sm text-muted">
          {correctCount} of {questions.length} questions answered correctly.
        </p>
        <Link
          href={backHref}
          className="mt-8 inline-block rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite"
        >
          {backLabel}
        </Link>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="py-16 text-center text-sm text-muted">
        This set has no questions yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-10">
      <div className="flex items-center justify-between">
        <Link href={backHref} className="text-xs font-medium text-muted hover:text-teal">
          ← {backLabel}
        </Link>
        <span className="font-mono-data text-xs text-muted">
          {index + 1} / {questions.length} · {answeredCount} answered
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-display text-sm font-medium text-fg">{title}</span>
      </div>

      <div className="mt-2 h-1 w-full rounded-full bg-panel-2">
        <div
          className="h-1 rounded-full bg-teal transition-all"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="eyebrow">{question.topic}</div>
          <BookmarkButton
            questionId={question.id}
            initialBookmarked={bookmarked.has(question.id)}
            onToggled={(next) =>
              setBookmarked((prev) => {
                const copy = new Set(prev);
                if (next) copy.add(question.id);
                else copy.delete(question.id);
                return copy;
              })
            }
          />
        </div>

        <h2 className="font-display mt-4 text-lg leading-relaxed text-fg">
          {question.prompt}
        </h2>

        <div className="mt-6 flex flex-col gap-3">
          {question.questionType === "numeric" ? (
            <div>
              <input
                type="text"
                value={numericDraft}
                onChange={(e) => setNumericDraft(e.target.value)}
                placeholder="Enter numerical response..."
                className="w-full max-w-xs rounded-sm border border-line bg-panel px-4 py-2 text-sm text-fg"
                disabled={!!answered || pending}
              />
              <div className="mt-3">
                <button
                  type="button"
                  onClick={submitNumeric}
                  disabled={pending || !!answered}
                  className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite disabled:opacity-50"
                >
                  Submit answer
                </button>
              </div>
            </div>
          ) : question.questionType === "multiple_choice" ? (
            <div>
              {question.options.map((option) => {
                const isSelected = multiSelected.has(option.id);
                const isCorrectOption = answered && answered.correctOptionIds?.includes(option.id);
                const showAsWrong = answered && isSelected && !answered.isCorrect;

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={!!answered || pending}
                    onClick={() => toggleMulti(option.id)}
                    className={`flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      isCorrectOption
                        ? "border-teal bg-teal-dim text-fg"
                        : showAsWrong
                        ? "border-gold bg-gold-dim text-fg"
                        : isSelected
                        ? "border-teal text-fg"
                        : "border-line text-muted hover:border-line-strong hover:text-fg"
                    } ${answered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span className={`h-4 w-4 rounded-sm border ${isSelected ? 'bg-teal border-teal' : 'border-line'}`} />
                    {option.label ? (
                      <span className="mr-2 font-mono-data text-xs text-muted">
                        {option.label}
                      </span>
                    ) : null}
                    {option.content}
                  </button>
                );
              })}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={submitMulti}
                  disabled={pending || !!answered}
                  className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite disabled:opacity-50"
                >
                  Submit answer
                </button>
                <button
                  type="button"
                  onClick={() => setMultiSelected(new Set())}
                  disabled={pending || !!answered}
                  className="rounded-sm border border-line px-4 py-2 text-sm text-fg"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            question.options.map((option) => {
              const isSelected = answered?.selectedOptionId === option.id;
              const isCorrectOption = answered && answered.correctOptionId === option.id;
              const showAsWrong = answered && isSelected && !answered.isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={!!answered || pending}
                  onClick={() => submitSingle(option.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    isCorrectOption
                      ? "border-teal bg-teal-dim text-fg"
                      : showAsWrong
                      ? "border-gold bg-gold-dim text-fg"
                      : isSelected
                      ? "border-teal text-fg"
                      : "border-line text-muted hover:border-line-strong hover:text-fg"
                  } ${answered ? "cursor-default" : "cursor-pointer"}`}
                >
                  {option.label ? (
                    <span className="mr-2 font-mono-data text-xs text-muted">
                      {option.label}
                    </span>
                  ) : null}
                  {option.content}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
          className="text-xs font-medium text-muted hover:text-fg disabled:opacity-30"
        >
          ← Previous
        </button>

        {index < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="rounded-full border border-line px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-fg hover:border-line-strong"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={handleFinish}
            className="rounded-full bg-teal px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-graphite disabled:opacity-50"
          >
            Finish session
          </button>
        )}
      </div>
    </div>
  );
}
