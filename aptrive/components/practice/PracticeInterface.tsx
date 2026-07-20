"use client";

import { useEffect, useMemo, useState } from "react";

type Preset = {
  name: string;
  shortName: string;
  minutes: number;
  accent: string;
  palette: string;
  nav: "section-tabs" | "compact-grid" | "review-rail" | "linear";
  timer: "top-right" | "top-center" | "side";
  verified: boolean;
  evidence: string;
  sections: { name: string; count: number }[];
};

const presets: Record<string, Preset> = {
  nust: {
    name: "NUST NET",
    shortName: "NUST",
    minutes: 180,
    accent: "#23d5c4",
    palette: "Teal control states with a section-first question palette.",
    nav: "section-tabs",
    timer: "top-right",
    verified: true,
    evidence: "Official NUST pages publish NET subject weightings; interface details are presented as a CBT approximation.",
    sections: [
      { name: "Math", count: 100 },
      { name: "Physics", count: 60 },
      { name: "English", count: 40 },
    ],
  },
  fast: {
    name: "FAST",
    shortName: "FAST",
    minutes: 120,
    accent: "#60a5fa",
    palette: "Blue section timing, compact test summary, independent section rhythm.",
    nav: "compact-grid",
    timer: "top-center",
    verified: true,
    evidence: "FAST-NUCES publishes timed sections and on-screen result summary guidance; exact UI is approximated.",
    sections: [
      { name: "English", count: 10 },
      { name: "IQ", count: 20 },
      { name: "Basic Math", count: 20 },
      { name: "Adv. Math", count: 50 },
    ],
  },
  comsats: {
    name: "COMSATS",
    shortName: "CUI",
    minutes: 120,
    accent: "#c9a24b",
    palette: "Gold progress states with straightforward MCQ review.",
    nav: "linear",
    timer: "top-right",
    verified: false,
    evidence: "Approximation for NAT-style practice; official computer UI should be confirmed before parity claims.",
    sections: [
      { name: "Quant", count: 30 },
      { name: "Analytical", count: 30 },
      { name: "Verbal", count: 30 },
    ],
  },
  giki: {
    name: "GIKI",
    shortName: "GIKI",
    minutes: 120,
    accent: "#34d399",
    palette: "Green review states for a focused engineering/computing test.",
    nav: "review-rail",
    timer: "side",
    verified: true,
    evidence: "GIKI describes an online/computer-based undergraduate admission test; layout is an approximation.",
    sections: [
      { name: "Math", count: 30 },
      { name: "Physics", count: 30 },
      { name: "English", count: 20 },
    ],
  },
  pieas: {
    name: "PIEAS",
    shortName: "PIEAS",
    minutes: 120,
    accent: "#f472b6",
    palette: "Rose STEM assessment styling with prominent timer.",
    nav: "compact-grid",
    timer: "top-right",
    verified: false,
    evidence: "Approximation based on public entry-test expectations; exact UI needs official confirmation.",
    sections: [
      { name: "Math", count: 30 },
      { name: "Physics", count: 30 },
      { name: "Chemistry", count: 20 },
    ],
  },
  uet: {
    name: "UET ECAT",
    shortName: "UET",
    minutes: 100,
    accent: "#f97316",
    palette: "Orange speed-test states for 100 MCQs in 100 minutes.",
    nav: "compact-grid",
    timer: "top-center",
    verified: true,
    evidence: "UET ECAT is publicly described as a computer-based MCQ test; layout is a practice approximation.",
    sections: [
      { name: "Math", count: 30 },
      { name: "Physics", count: 30 },
      { name: "Chem/CS", count: 30 },
      { name: "English", count: 10 },
    ],
  },
};

const questions = [
  {
    prompt: "If x^2 - 5x + 6 = 0, what is the sum of its roots?",
    topic: "Quadratic equations",
    section: "Math",
    options: ["2", "3", "5", "6"],
    answer: "5",
    explanation: "For ax^2 + bx + c = 0, the sum of roots is -b/a. Here it is 5.",
  },
  {
    prompt: "A body moving with constant acceleration has velocity 10 m/s after 5 seconds from rest. Find acceleration.",
    topic: "Kinematics",
    section: "Physics",
    options: ["1 m/s^2", "2 m/s^2", "5 m/s^2", "10 m/s^2"],
    answer: "2 m/s^2",
    explanation: "Using v = u + at, 10 = 0 + 5a, so a = 2 m/s^2.",
  },
  {
    prompt: "Choose the grammatically correct sentence.",
    topic: "Subject verb agreement",
    section: "English",
    options: ["He do his work.", "He does his work.", "He doing his work.", "He done his work."],
    answer: "He does his work.",
    explanation: "A singular subject in the simple present takes the verb form 'does'.",
  },
  {
    prompt: "Find the next term: 3, 6, 12, 24, ?",
    topic: "Number series",
    section: "IQ",
    options: ["30", "36", "42", "48"],
    answer: "48",
    explanation: "Each term doubles the previous term.",
  },
  {
    prompt: "The derivative of sin x is:",
    topic: "Calculus",
    section: "Math",
    options: ["cos x", "-cos x", "tan x", "-sin x"],
    answer: "cos x",
    explanation: "The standard derivative is d/dx(sin x) = cos x.",
  },
  {
    prompt: "Which quantity is conserved in an elastic collision?",
    topic: "Momentum and energy",
    section: "Physics",
    options: ["Momentum only", "Kinetic energy only", "Both momentum and kinetic energy", "Neither"],
    answer: "Both momentum and kinetic energy",
    explanation: "In an elastic collision, total momentum and total kinetic energy are both conserved.",
  },
];

export default function PracticeInterface() {
  const [presetKey, setPresetKey] = useState("nust");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [mode, setMode] = useState<"practice" | "exam">("practice");
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(presets.nust.minutes * 60);

  const preset = presets[presetKey];
  const current = questions[index];
  const answered = Object.keys(answers).length;
  const score = useMemo(
    () => questions.filter((question, questionIndex) => answers[questionIndex] === question.answer).length,
    [answers]
  );
  const selected = answers[index];
  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const sectionProgress = current.section;

  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  if (submitted) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-graphite px-4 py-8 pb-24 md:px-6">
        <div className="container-aptrive">
          <section className="motion-card rounded-md border border-line bg-panel p-6 md:p-8">
            <div className="eyebrow">Session complete</div>
            <h1 className="font-display mt-3 text-3xl font-semibold text-fg md:text-5xl">
              {accuracy >= 70 ? "Strong session. Keep the streak alive." : "Good reps. Now review the gaps."}
            </h1>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultStat label="Score" value={`${score}/${questions.length}`} />
              <ResultStat label="Accuracy" value={`${accuracy}%`} />
              <ResultStat label="Answered" value={`${answered}/${questions.length}`} />
              <ResultStat label="XP earned" value={`${score * 35 + answered * 5}`} />
            </div>
            <div className="mt-8 grid gap-4">
              {questions.map((question, questionIndex) => {
                const answer = answers[questionIndex] ?? "Not answered";
                const correct = answer === question.answer;
                return (
                  <div key={question.prompt} className="rounded-md border border-line bg-panel-2 p-4">
                    <div className="flex flex-wrap justify-between gap-3">
                      <p className="font-medium text-fg">Q{questionIndex + 1}. {question.topic}</p>
                      <span className={correct ? "text-teal" : "text-gold"}>{correct ? "Correct" : "Review"}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">Your answer: {answer}</p>
                    <p className="mt-1 text-sm text-muted">Correct answer: {question.answer}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{question.explanation}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => resetSession(setSubmitted, setAnswers, setFlagged, setBookmarked, setIndex)} className="pressable rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite">
                Start another session
              </button>
              <button type="button" onClick={() => setSubmitted(false)} className="pressable rounded-sm border border-line-strong px-4 py-2 text-sm text-fg">
                Back to review
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-4 py-6 pb-24 md:px-6">
      <div className="container-aptrive">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="eyebrow">Practice session</div>
            <h1 className="font-display mt-2 text-3xl font-semibold text-fg">Computer-based testing studio</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={presetKey}
              onChange={(event) => {
                const nextKey = event.target.value;
                setPresetKey(nextKey);
                setSecondsLeft(presets[nextKey].minutes * 60);
              }}
              className="rounded-sm border border-line-strong bg-panel px-3 py-2 text-sm text-fg"
            >
              {Object.entries(presets).map(([key, item]) => <option key={key} value={key}>{item.name}</option>)}
            </select>
            <select value={mode} onChange={(event) => setMode(event.target.value as "practice" | "exam")} className="rounded-sm border border-line-strong bg-panel px-3 py-2 text-sm text-fg">
              <option value="practice">Practice feedback</option>
              <option value="exam">Exam simulation</option>
            </select>
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-md border border-line bg-panel p-4 text-xs leading-relaxed text-muted md:grid-cols-[1fr_auto]">
          <div>
            <span className="font-semibold text-fg">{preset.name}</span>: {preset.palette} {preset.evidence}
          </div>
          <span className={`rounded-sm px-2 py-1 ${preset.verified ? "bg-teal-dim text-teal" : "bg-gold-dim text-gold"}`}>
            {preset.verified ? "Verified source pattern" : "Approximation"}
          </span>
        </div>

        <section className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          <aside className="motion-card rounded-md border border-line bg-panel p-4">
            <p className="text-xs uppercase tracking-wide text-muted-2">Interface sections</p>
            <div className="mt-4 flex gap-2 overflow-x-auto lg:block lg:space-y-2">
              {preset.sections.map((section) => (
                <button
                  key={section.name}
                  type="button"
                  className={`whitespace-nowrap rounded-sm border px-3 py-2 text-xs ${sectionProgress === section.name ? "text-graphite" : "text-muted"}`}
                  style={{
                    borderColor: sectionProgress === section.name ? preset.accent : "var(--line)",
                    background: sectionProgress === section.name ? preset.accent : "var(--panel-2)",
                  }}
                >
                  {section.name} <span className="font-mono-data">{section.count}</span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs uppercase tracking-wide text-muted-2">Question palette</p>
            <div className="mt-4 grid grid-cols-6 gap-2 lg:grid-cols-5">
              {questions.map((_, questionIndex) => (
                <button
                  key={questionIndex}
                  type="button"
                  onClick={() => setIndex(questionIndex)}
                  className="grid h-10 place-items-center rounded-sm border text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: index === questionIndex ? preset.accent : "var(--line)",
                    background: answers[questionIndex] ? "var(--teal-dim)" : flagged.includes(questionIndex) ? "var(--gold-dim)" : "var(--panel-2)",
                    color: "var(--fg)",
                  }}
                  aria-current={index === questionIndex ? "true" : undefined}
                >
                  {questionIndex + 1}
                </button>
              ))}
            </div>
          </aside>

          <section className="motion-card rounded-md border border-line bg-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-2">Question {index + 1} of {questions.length}</p>
                <p className="mt-1 text-sm text-muted">{current.section} - {current.topic}</p>
              </div>
              <div className="font-mono-data rounded-sm border border-line-strong px-3 py-2 text-sm text-fg" style={{ borderColor: preset.accent }}>
                {formatTime(secondsLeft)}
              </div>
            </div>

            <div className="p-5 md:p-8">
              <p className="text-lg leading-relaxed text-fg">{current.prompt}</p>
              <div className="mt-6 grid gap-3">
                {current.options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = option === current.answer;
                  const showFeedback = mode === "practice" && selected;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswers({ ...answers, [index]: option })}
                      className="pressable rounded-md border p-4 text-left text-sm"
                      style={{
                        borderColor: showFeedback && isCorrect ? "var(--teal)" : isSelected ? preset.accent : "var(--line)",
                        background: showFeedback && isCorrect ? "var(--teal-dim)" : isSelected ? "var(--panel-2)" : "transparent",
                        color: "var(--fg)",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {mode === "practice" && selected && (
                <div className="mt-6 rounded-md border border-line bg-panel-2 p-4 text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-fg">{selected === current.answer ? "Correct." : "Review this."}</span> {current.explanation}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => toggle(index, flagged, setFlagged)} className="pressable rounded-sm border border-line-strong px-3 py-2 text-sm text-fg">
                  {flagged.includes(index) ? "Unflag" : "Flag"}
                </button>
                <button type="button" onClick={() => toggle(index, bookmarked, setBookmarked)} className="pressable rounded-sm border border-line-strong px-3 py-2 text-sm text-fg">
                  {bookmarked.includes(index) ? "Saved" : "Bookmark"}
                </button>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIndex(Math.max(0, index - 1))} className="pressable rounded-sm border border-line-strong px-4 py-2 text-sm text-fg">Previous</button>
                <button type="button" onClick={() => index === questions.length - 1 ? setSubmitted(true) : setIndex(index + 1)} className="pressable rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite">
                  {index === questions.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </section>

          <aside className="motion-card rounded-md border border-line bg-panel p-4">
            <p className="text-xs uppercase tracking-wide text-muted-2">Session analytics</p>
            <div className="mt-4 space-y-4">
              <Metric label="Progress" value={`${answered}/${questions.length}`} />
              <Metric label="Score" value={mode === "practice" ? `${score}/${answered || 0}` : "Hidden"} />
              <Metric label="Flagged" value={flagged.length.toString()} />
              <Metric label="Bookmarked" value={bookmarked.length.toString()} />
              <Metric label="Interface" value={preset.shortName} />
            </div>
            <button type="button" onClick={() => setSubmitted(true)} className="pressable mt-6 w-full rounded-sm bg-gold px-4 py-3 text-sm font-semibold text-graphite">
              Submit session
            </button>
          </aside>
        </section>
      </div>
    </main>
  );
}

function resetSession(
  setSubmitted: (value: boolean) => void,
  setAnswers: (value: Record<number, string>) => void,
  setFlagged: (value: number[]) => void,
  setBookmarked: (value: number[]) => void,
  setIndex: (value: number) => void
) {
  setSubmitted(false);
  setAnswers({});
  setFlagged([]);
  setBookmarked([]);
  setIndex(0);
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-graphite p-5">
      <p className="text-xs uppercase tracking-wide text-muted-2">{label}</p>
      <p className="font-display mt-2 text-2xl font-semibold text-fg">{value}</p>
    </div>
  );
}

function toggle(value: number, list: number[], setList: (next: number[]) => void) {
  setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line pb-3 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-mono-data text-right text-fg">{value}</span>
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
