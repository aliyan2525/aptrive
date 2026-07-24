"use client";

import { useMemo, useState, useTransition } from "react";
import type { Difficulty, QuestionStatus, BloomLevel, QuestionType } from "@/lib/database.types";
import type { QuestionFormInput, QuestionWithOptions } from "@/lib/admin/questions";
import { createQuestionAction, updateQuestionAction } from "@/app/admin/actions";

type CatalogItem = { id: string; name: string };
type UniversityOption = { id: string; name: string };
type TestOption = { id: string; name: string; university_id: string | null };
type DifficultyLevelOption = { id: string; label: string; rank: number };
type ChapterOption = { id: string; name: string; subject_id: string };
type TopicOption = { id: string; name: string; chapter_id: string };
type SubtopicOption = { id: string; name: string; topic_id: string };

const STATUSES: QuestionStatus[] = ["draft", "in_review", "published", "archived"];
const BLOOM_LEVELS: BloomLevel[] = ["remember", "understand", "apply", "analyze", "evaluate", "create"];
const QUESTION_TYPES: QuestionType[] = ["single_choice", "multiple_choice", "numeric"];

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
  universities,
  tests,
  chapters,
  topics,
  subtopics,
  difficultyLevels,
  existing,
}: {
  subjects: CatalogItem[];
  practiceSets: { id: string; title: string; subject_id: string }[];
  universities: UniversityOption[];
  tests: TestOption[];
  chapters: ChapterOption[];
  topics: TopicOption[];
  subtopics: SubtopicOption[];
  difficultyLevels: DifficultyLevelOption[];
  existing?: QuestionWithOptions | null;
}) {
  const [subjectId, setSubjectId] = useState(existing?.subject_id ?? subjects[0]?.id ?? "");
  const [practiceSetId, setPracticeSetId] = useState(existing?.practice_set_id ?? "");
  const [prompt, setPrompt] = useState(existing?.prompt ?? "");
  const [explanation, setExplanation] = useState(existing?.explanation ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? "Medium");
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

  // Phase 0/1 fields
  const [universityId, setUniversityId] = useState(existing?.university_id ?? "");
  const [testId, setTestId] = useState(existing?.test_id ?? "");
  const [chapterId, setChapterId] = useState(existing?.chapter_id ?? "");
  const [topicId, setTopicId] = useState(existing?.topic_id ?? "");
  const [subtopicId, setSubtopicId] = useState(existing?.subtopic_id ?? "");
  const [difficultyLevelId, setDifficultyLevelId] = useState(
    existing?.difficulty_level_id ?? difficultyLevels.find(d => d.label === "Medium")?.id ?? difficultyLevels[0]?.id ?? ""
  );
  const [bloomLevel, setBloomLevel] = useState<BloomLevel>(existing?.bloom_level ?? "remember");
  const [questionType, setQuestionType] = useState<QuestionType>(existing?.question_type ?? "single_choice");
  const [numericAnswerValue, setNumericAnswerValue] = useState(
    existing?.numeric_answer_value !== undefined && existing?.numeric_answer_value !== null
      ? String(existing.numeric_answer_value)
      : ""
  );
  const [numericAnswerTolerance, setNumericAnswerTolerance] = useState(
    existing?.numeric_answer_tolerance !== undefined && existing?.numeric_answer_tolerance !== null
      ? String(existing.numeric_answer_tolerance)
      : ""
  );

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filteredPracticeSets = useMemo(
    () => practiceSets.filter((p) => p.subject_id === subjectId),
    [practiceSets, subjectId]
  );

  const filteredTests = useMemo(
    () => universityId ? tests.filter((t) => t.university_id === universityId) : tests,
    [tests, universityId]
  );

  const filteredChapters = useMemo(
    () => subjectId ? chapters.filter((c) => c.subject_id === subjectId) : chapters,
    [chapters, subjectId]
  );

  const filteredTopics = useMemo(
    () => chapterId ? topics.filter((t) => t.chapter_id === chapterId) : topics,
    [topics, chapterId]
  );

  const filteredSubtopics = useMemo(
    () => topicId ? subtopics.filter((s) => s.topic_id === topicId) : subtopics,
    [subtopics, topicId]
  );

  function updateOption(index: number, content: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, content } : o)));
  }

  function toggleCorrect(index: number) {
    if (questionType === "single_choice") {
      setOptions((prev) => prev.map((o, i) => ({ ...o, is_correct: i === index })));
    } else {
      setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, is_correct: !o.is_correct } : o)));
    }
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
    if (!chapterId) return "Chapter is required.";
    if (!topicId) return "Topic is required.";
    if (!difficultyLevelId) return "Difficulty level is required.";

    if (questionType === "numeric") {
      if (!numericAnswerValue.trim() || isNaN(Number(numericAnswerValue))) {
        return "Numeric answer value must be a valid number.";
      }
      if (numericAnswerTolerance.trim() && isNaN(Number(numericAnswerTolerance))) {
        return "Numeric answer tolerance must be a valid number.";
      }
    } else {
      const filled = options.filter((o) => o.content.trim().length > 0);
      if (filled.length < 2) return "At least 2 options are required.";
      if (!options.some((o) => o.is_correct && o.content.trim().length > 0)) {
        return "At least one option must be marked correct.";
      }
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

    // The `topic`/`chapter` columns are legacy free-text fields kept
    // for older UI/reporting code that reads them by name (see
    // lib/repositories/catalog.repository.ts's normalizeTopicKey /
    // masteryByTopicName). This form only exposes the normalized
    // Chapter/Topic *selects* (chapterId/topicId) — there's no separate
    // free-text input for them — so derive the legacy strings from the
    // selected records rather than from untethered state that never had
    // an input wired to it (previously always submitted as "").
    const selectedChapterName = chapters.find((c) => c.id === chapterId)?.name ?? null;
    const selectedTopicName = topics.find((t) => t.id === topicId)?.name ?? "";

    const input: QuestionFormInput = {
      practice_set_id: practiceSetId,
      subject_id: subjectId,
      prompt: prompt.trim(),
      explanation: explanation.trim() || null,
      difficulty,
      topic: selectedTopicName,
      chapter: selectedChapterName,
      time_estimate_seconds: Number(timeEstimate) || 60,
      status,
      source: source.trim() || null,
      source_year: sourceYear ? Number(sourceYear) : null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      ai_generated: aiGenerated,
      options: questionType === "numeric" ? [] : options.filter((o) => o.content.trim().length > 0),
      // Relational inputs
      university_id: universityId || null,
      test_id: testId || null,
      chapter_id: chapterId,
      topic_id: topicId,
      subtopic_id: subtopicId || null,
      difficulty_level_id: difficultyLevelId,
      bloom_level: bloomLevel,
      question_type: questionType,
      numeric_answer_value: questionType === "numeric" ? Number(numericAnswerValue) : null,
      numeric_answer_tolerance: questionType === "numeric" && numericAnswerTolerance ? Number(numericAnswerTolerance) : null,
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
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-fg">Question Layout</span>
            <div className="flex gap-2">
              {QUESTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQuestionType(type)}
                  className={`rounded-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-wide border transition-all ${
                    questionType === type ? "border-teal bg-teal text-graphite" : "border-line text-muted hover:text-fg"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-sm font-medium text-fg">
            Question text (Markdown & LaTeX supported)
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="rounded-sm border border-line-strong bg-graphite px-4 py-3 text-sm text-fg focus:border-teal"
              placeholder="e.g. Solve for x: $2x + 5 = 17$"
            />
          </label>

          {/* Conditional Answer Types */}
          {questionType === "numeric" ? (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className="grid gap-2 text-sm font-medium text-fg">
                Correct Answer Value
                <input
                  type="text"
                  value={numericAnswerValue}
                  onChange={(e) => setNumericAnswerValue(e.target.value)}
                  placeholder="e.g. 12"
                  className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-fg">
                Tolerance Margin (optional)
                <input
                  type="text"
                  value={numericAnswerTolerance}
                  onChange={(e) => setNumericAnswerTolerance(e.target.value)}
                  placeholder="e.g. 0.05"
                  className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
                />
              </label>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm font-medium text-fg">Options</p>
              <div className="mt-3 space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleCorrect(index)}
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
              <p className="mt-2 text-xs text-muted-2">
                {questionType === "single_choice"
                  ? "Mark the correct option's circle."
                  : "Mark all correct option circles (multiple correct choices)."}
              </p>
            </div>
          )}

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

        {/* Live Student Previewer */}
        <div className="rounded-md border border-line bg-panel p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">Student Preview</h3>
          <div className="border border-line bg-graphite p-6 rounded-md">
            <p className="text-fg leading-relaxed whitespace-pre-wrap">{prompt || "Draft prompt text will render here..."}</p>
            {questionType === "numeric" ? (
              <div className="mt-4">
                <input
                  type="text"
                  disabled
                  placeholder="Enter numerical response..."
                  className="w-full max-w-xs rounded-sm border border-line bg-panel px-4 py-2 text-sm text-muted"
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-2">
                {options.map((option, idx) => (
                  <div
                    key={idx}
                    className="border border-line rounded-md p-4 text-left text-sm text-muted bg-panel-2"
                  >
                    <span className="font-semibold text-fg mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {option.content || "Empty option"}
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <p className="text-sm font-medium text-fg">Classification & Taxonomy</p>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm text-fg">
              University (optional)
              <select
                value={universityId}
                onChange={(e) => {
                  setUniversityId(e.target.value);
                  setTestId("");
                }}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                <option value="">No specific university</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Test (optional)
              <select
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                <option value="">No specific test</option>
                {filteredTests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Subject
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setPracticeSetId("");
                  setChapterId("");
                  setTopicId("");
                  setSubtopicId("");
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
              Chapter
              <select
                value={chapterId}
                onChange={(e) => {
                  setChapterId(e.target.value);
                  setTopicId("");
                  setSubtopicId("");
                }}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                <option value="">Select a chapter…</option>
                {filteredChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Topic
              <select
                value={topicId}
                onChange={(e) => {
                  setTopicId(e.target.value);
                  setSubtopicId("");
                }}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                <option value="">Select a topic…</option>
                {filteredTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Subtopic (optional)
              <select
                value={subtopicId}
                onChange={(e) => setSubtopicId(e.target.value)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                <option value="">No subtopic</option>
                {filteredSubtopics.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Difficulty Rank
              <select
                value={difficultyLevelId}
                onChange={(e) => setDifficultyLevelId(e.target.value)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                {difficultyLevels.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-fg">
              Bloom Taxonomy level
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value as BloomLevel)}
                className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
              >
                {BLOOM_LEVELS.map((b) => (
                  <option key={b} value={b}>
                    {b}
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
          <p className="text-sm font-medium text-fg">Publishing & Metadata</p>
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

