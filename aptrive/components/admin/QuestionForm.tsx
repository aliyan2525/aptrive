"use client";

import { useMemo, useState, useTransition } from "react";
import type { Difficulty, QuestionStatus } from "@/lib/database.types";
import type { QuestionFormInput, QuestionWithOptions } from "@/lib/admin/questions";
import { createQuestionAction, updateQuestionAction } from "@/app/admin/actions";

type SubjectOption = { id: string; name: string };
type PracticeSetOption = { id: string; title: string; subject_id: string };

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const STATUSES: QuestionStatus[] = ["draft", "in_review", "published", "archived"];

type OptionDraft = { content: string; is_correct: boolean };

function emptyOptions(): OptionDraft[] {
  return [
    { content: "", is_correct: true },
    { content: "", is_correct: false },
    { content: "", is_correct: false },
    { content: "", is_correct: false },
  ];
}

export default function QuestionForm({
  subjects,
  practiceSets,
  existing,
}: {
  subjects: SubjectOption[];
  practiceSets: PracticeSetOption[];
  existing?: QuestionWithOptions | null;
}) {
  const [subjectId, setSubjectId] = useState(existing?.subject_id ?? subjects[0]?.id ?? "");
  const [practiceSetId, setPracticeSetId] = useState(existing?.practice_set_id ?? "");
  const [prompt, setPrompt] = useState(existing?.prompt ?? "");
  const [explanation, setExplanation] = useState(existing?.explanation ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? "Medium");
  const [topic, setTopic] = useState(existing?.topic ?? "");
  const [chapter, setChapter] = useState(existing?.chapter ?? "");
  const [timeEstimate, setTimeEstimate] = useState(existing?.time_estimate_seconds ?? 60);
  const [status, setStatus] = useState<QuestionStatus>(existing?.status ?? "draft");
  const [source, setSource] = useState(existing?.source ?? "");
  const [sourceYear, setSourceYear] = useState<string>(
    existing?.source_year ? String(existing.source_year) : ""
  );
  const [tags, setTags] = useState((existing?.tags ?? []).join(", "));
  const [aiGenerated, setAiGenerated] = useState(existing?.ai_generated ?? false);
  const [options, setOptions] = useState<OptionDraft[]>(
    existing?.options?.length
      ? existing.options.map((o) => ({ content: o.content, is_correct: o.is_correct }))
      : emptyOptions()
  );

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filteredPracticeSets = useMemo(
    () => practiceSets.filter((p) => p.subject_id === subjectId),
    [practiceSets, subjectId]
  );

  function updateOption(index: number, content: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, content } : o)));
  }

  function setCorrect(index: number) {
    setOptions((prev) => prev.map((o, i) => ({ ...o, is_correct: i === index })));
  }

  function addOption() {
    if (options.length >= 6) return;
    setOptions((prev) => [...prev, { content: "", is_correct: false }]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (!next.some((o) => o.is_correct)) next[0].is_correct = true;
      return next;
    });
  }

  function validate(): string | null {
    if (!prompt.trim()) return "Question text is required.";
    if (!practiceSetId) return "Choose which practice set this belongs to.";
    if (!topic.trim()) return "Topic is required.";
    const filled = options.filter((o) => o.content.trim().length > 0);
    if (filled.length < 2) return "At least 2 options are required.";
    if (!options.some((o) => o.is_correct && o.content.trim().length > 0)) {
      return "Mark one option as correct.";
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    const input: QuestionFormInput = {
      practice_set_id: practiceSetId,
      subject_id: subjectId,
      prompt: prompt.trim(),
      explanation: explanation.trim() || null,
      difficulty,
      topic: topic.trim(),
      chapter: chapter.trim() || null,
      time_estimate_seconds: Number(timeEstimate) || 60,
      status,
      source: source.trim() || null,
      source_year: sourceYear ? Number(sourceYear) : null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      ai_generated: aiGenerated,
      options: options.filter((o) => o.content.trim().length > 0),
    };

    startTransition(async () => {
      const result = existing
        ? await updateQuestionAction(existing.id, input)
        : await createQuestionAction(input);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <div className="rounded-md border border-line bg-panel p-6">
          <label className="grid gap-2 text-sm font-medium text-fg">
            Question text (Markdown / LaTeX supported at render time)
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="rounded-sm border border-line-strong bg-graphite px-4 py-3 text-sm text-fg"
              placeholder="e.g. Solve for x: $2x + 5 = 17$"
            />
          </label>

          <div className="mt-6">
            <p className="text-sm font-medium text-fg">Options</p>
            <div className="mt-3 space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrect(index)}
                    aria-label={`Mark option ${index + 1} correct`}
                    className={`mt-2 h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${
                      option.is_correct ? "border-teal bg-teal" : "border-line-strong"
                    }`}
                  />
                  <input
                    type="text"
                    value={option.content}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1 rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="mt-1 text-xs text-muted hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 text-sm text-teal hover:underline"
              >
                + Add option
              </button>
            )}
            <p className="mt-2 text-xs text-muted-2">Click the circle to mark the correct option.</p>
          </div>

          <label className="mt-6 grid gap-2 text-sm font-medium text-fg">
            Explanation
            <textarea
              value={explanation ?? ""}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              className="rounded-sm border border-line-strong bg-graphite px-4 py-3 text-sm text-fg"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-sm bg-teal px-5 py-2.5 text-sm font-semibold text-graphite disabled:opacity-50"
          >
            {pending ? "Saving…" : existing ? "Save changes" : "Create question"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-md border border-line bg-panel p-6">
          <p className="text-sm font-medium text-fg">Classification</p>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm text-fg">
              Subject
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setPracticeSetId("");
                }}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Practice set
              <select
                value={practiceSetId}
                onChange={(e) => setPracticeSetId(e.target.value)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                <option value="">Select a practice set…</option>
                {filteredPracticeSets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Topic
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              />
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Chapter (optional)
              <input
                value={chapter ?? ""}
                onChange={(e) => setChapter(e.target.value)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              />
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Difficulty
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Estimated time (seconds)
              <input
                type="number"
                min={10}
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(Number(e.target.value))}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              />
            </label>
          </div>
        </div>

        <div className="rounded-md border border-line bg-panel p-6">
          <p className="text-sm font-medium text-fg">Publishing</p>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm text-fg">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuestionStatus)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Source (optional)
              <input
                value={source ?? ""}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. NUST NET 2023"
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              />
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Source year (optional)
              <input
                type="number"
                value={sourceYear}
                onChange={(e) => setSourceYear(e.target.value)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              />
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Tags (comma-separated)
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. numerical, formula-based"
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-fg">
              <input
                type="checkbox"
                checked={aiGenerated}
                onChange={(e) => setAiGenerated(e.target.checked)}
                className="h-4 w-4 rounded border-line-strong"
              />
              AI-generated (needs human review before publishing)
            </label>
          </div>
        </div>

        {existing && (
          <a
            href={`/admin/questions/${existing.id}/versions`}
            className="block rounded-md border border-line bg-panel p-4 text-sm text-muted hover:border-teal/50 hover:text-fg"
          >
            View version history →
          </a>
        )}
      </div>
    </form>
  );
}
