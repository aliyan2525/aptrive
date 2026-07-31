"use client";

import { useMemo, useState, useTransition } from "react";
import UniversityLogo from "@/components/UniversityLogo";
import { completeOnboardingAction } from "@/app/(app)/onboarding/actions";
import type { OnboardingInput } from "@/lib/repositories/onboarding.repository";

const steps = ["Identity", "Target", "Academics", "Schedule", "Plan"];
const universities = ["NUST", "FAST", "COMSATS", "GIKI", "PIEAS", "UET"];

// value = what's stored in student_profiles.entry_test (Postgres enum:
// NET | ECAT | MDCAT | NAT | SAT | GAT | OTHER — see supabase/migrations/0004).
const testOptions = [
  { label: "NUST NET", value: "NET" },
  { label: "ECAT", value: "ECAT" },
  { label: "MDCAT", value: "MDCAT" },
  { label: "NTS / NAT", value: "NAT" },
  { label: "SAT", value: "SAT" },
  { label: "GAT", value: "GAT" },
  { label: "Other", value: "OTHER" },
];

// value = student_profiles.education_level enum: matric | intermediate |
// a_levels | undergraduate | other.
const educationOptions = [
  { label: "Matric", value: "matric" },
  { label: "Intermediate / FSc", value: "intermediate" },
  { label: "A-Levels", value: "a_levels" },
  { label: "Undergraduate (transfer)", value: "undergraduate" },
  { label: "Other", value: "other" },
];

// value = student_profiles.preferred_schedule enum.
const scheduleOptions = [
  { label: "Early morning", value: "early_morning" },
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
  { label: "Night", value: "night" },
  { label: "Flexible", value: "flexible" },
];

const subjects = ["Mathematics", "Physics", "English", "Intelligence", "Computer Science"];

type OnboardingFlowProps = {
  /** Pre-fills the form when the user has a partial/existing profile
   * (e.g. they left onboarding halfway and came back). Undefined for a
   * brand-new user. */
  existingProfile?: {
    display_name: string | null;
    target_university: string | null;
    target_degree: string | null;
    entry_test: string | null;
    education_level: string | null;
    matric_marks: number | null;
    intermediate_marks: number | null;
    expected_test_date: string | null;
    preferred_schedule: string | null;
    daily_study_target_minutes: number;
    weak_subjects: string[];
  } | null;
};

export default function OnboardingFlow({ existingProfile }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: existingProfile?.display_name ?? "",
    displayName: existingProfile?.display_name ?? "",
    university: existingProfile?.target_university ?? "NUST",
    program: existingProfile?.target_degree ?? "Computer Science",
    test: existingProfile?.entry_test ?? "NET",
    education: existingProfile?.education_level ?? "intermediate",
    matric: existingProfile?.matric_marks?.toString() ?? "",
    intermediate: existingProfile?.intermediate_marks?.toString() ?? "",
    testDate: existingProfile?.expected_test_date ?? "",
    schedule: existingProfile?.preferred_schedule ?? "evening",
    dailyTarget: existingProfile?.daily_study_target_minutes?.toString() ?? "90",
    improvement: existingProfile?.weak_subjects?.length
      ? existingProfile.weak_subjects
      : ["Mathematics", "Physics"],
  });

  const completion = Math.round(((step + 1) / steps.length) * 100);
  const plan = useMemo(() => {
    const target = Number(form.dailyTarget) || 90;
    return [
      { label: "Daily focus block", value: `${Math.max(30, target - 20)} min` },
      { label: "Review buffer", value: "20 min" },
      { label: "Weekly mock cadence", value: target >= 90 ? "2 mocks" : "1 mock" },
      { label: "Priority subjects", value: form.improvement.join(", ") },
    ];
  }, [form.dailyTarget, form.improvement]);

  function handleFinish() {
    setSubmitError(null);
    const input: OnboardingInput = {
      displayName: form.displayName || form.fullName,
      targetUniversity: form.university,
      targetProgram: form.program,
      // form.test/education/schedule are always set from the fixed
      // testOptions/educationOptions/scheduleOptions value lists above,
      // whose values are the exact members of these DB enums — but the
      // `form` state itself is typed as plain `string` (its initial
      // shape merges with the loosely-typed `existingProfile` prop), so
      // TS can't infer the narrowing on its own.
      entryTest: form.test as OnboardingInput["entryTest"],
      educationLevel: form.education as OnboardingInput["educationLevel"],
      matricMarks: form.matric ? Number(form.matric) : null,
      intermediateMarks: form.intermediate ? Number(form.intermediate) : null,
      expectedTestDate: form.testDate || null,
      preferredStudySchedule: form.schedule as OnboardingInput["preferredStudySchedule"],
      dailyStudyTargetMinutes: Number(form.dailyTarget) || 90,
      improvementSubjects: form.improvement,
    };

    startTransition(async () => {
      try {
        // completeOnboardingAction redirects on success (throws
        // NEXT_REDIRECT internally), so this only returns on failure.
        await completeOnboardingAction(input);
      } catch (error) {
        // Next's redirect() throws a special error to unwind out of the
        // action — that's the success path, not a real failure, and
        // must not be shown to the user.
        const isRedirect =
          typeof error === "object" &&
          error !== null &&
          "digest" in error &&
          typeof (error as { digest?: unknown }).digest === "string" &&
          (error as { digest: string }).digest.startsWith("NEXT_REDIRECT");
        if (isRedirect) throw error;

        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong saving your profile. Please try again."
        );
      }
    });
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-graphite px-6 py-10">
      <div className="container-aptrive grid gap-8 lg:grid-cols-[0.9fr_1.3fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="eyebrow">Personal setup</div>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg">
            Build a study plan that fits your admission target.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Aptrive uses this profile to shape your dashboard, recommended practice, reminders, and future AI coaching.
          </p>
          <div className="mt-8 rounded-md border border-line bg-panel p-5">
            <div className="flex justify-between text-xs text-muted">
              <span>Progress</span>
              <span className="font-mono-data">{completion}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-panel-2">
              <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${completion}%` }} />
            </div>
            <div className="mt-5 space-y-2">
              {steps.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                    step === index ? "bg-teal-dim text-fg" : "text-muted hover:bg-panel-2"
                  }`}
                >
                  {item}
                  <span className="font-mono-data text-xs">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="rounded-md border border-line bg-panel p-6 md:p-8">
          {step === 0 && (
            <Fieldset title="Tell us who is learning">
              <TextField label="Full name" value={form.fullName} onChange={(fullName) => setForm({ ...form, fullName })} />
              <TextField label="Preferred display name" value={form.displayName} onChange={(displayName) => setForm({ ...form, displayName })} />
            </Fieldset>
          )}

          {step === 1 && (
            <Fieldset title="Choose your admission target">
              <SelectField label="Target university" value={form.university} options={universities} onChange={(university) => setForm({ ...form, university })} showLogo />
              <TextField label="Target degree/program" value={form.program} onChange={(program) => setForm({ ...form, program })} />
              <SelectField label="Entry test" value={form.test} options={testOptions} onChange={(test) => setForm({ ...form, test })} />
            </Fieldset>
          )}

          {step === 2 && (
            <Fieldset title="Add academic context">
              <SelectField label="Current education level" value={form.education} options={educationOptions} onChange={(education) => setForm({ ...form, education })} />
              <TextField label="Matric marks" value={form.matric} onChange={(matric) => setForm({ ...form, matric })} />
              <TextField label="Intermediate marks" value={form.intermediate} onChange={(intermediate) => setForm({ ...form, intermediate })} />
              <TextField label="Expected entry test date" type="date" value={form.testDate} onChange={(testDate) => setForm({ ...form, testDate })} />
            </Fieldset>
          )}

          {step === 3 && (
            <Fieldset title="Set your rhythm">
              <SelectField label="Preferred study schedule" value={form.schedule} options={scheduleOptions} onChange={(schedule) => setForm({ ...form, schedule })} />
              <TextField label="Daily study target (minutes)" value={form.dailyTarget} onChange={(dailyTarget) => setForm({ ...form, dailyTarget })} />
              <div>
                <label className="text-sm font-medium text-fg">Subjects needing improvement</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {subjects.map((subject) => {
                    const active = form.improvement.includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            improvement: active
                              ? form.improvement.filter((item) => item !== subject)
                              : [...form.improvement, subject],
                          })
                        }
                        className={`rounded-sm border px-3 py-2 text-xs font-medium ${
                          active ? "border-teal bg-teal text-graphite" : "border-line-strong text-muted hover:text-fg"
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Fieldset>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-semibold text-fg">Your personalized starter plan</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This saves your profile, target, and today&apos;s study goal — your dashboard will personalize around it right away.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {plan.map((item) => (
                  <div key={item.label} className="rounded-md border border-line bg-panel-2 p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-2">{item.label}</p>
                    <p className="font-display mt-2 text-xl font-semibold text-fg">{item.value}</p>
                  </div>
                ))}
              </div>
              {submitError && (
                <p className="mt-6 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {submitError}
                </p>
              )}
              <button
                type="button"
                onClick={handleFinish}
                disabled={isPending}
                className="mt-8 inline-flex rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite disabled:opacity-60"
              >
                {isPending ? "Saving…" : "Save and go to dashboard"}
              </button>
            </div>
          )}

          <div className="mt-8 flex justify-between border-t border-line pt-6">
            <button type="button" onClick={() => setStep(Math.max(0, step - 1))} className="rounded-sm border border-line-strong px-4 py-2 text-sm text-fg disabled:opacity-40" disabled={step === 0}>
              Back
            </button>
            <button type="button" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite" disabled={step === steps.length - 1}>
              Continue
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-fg">{title}</h2>
      <div className="mt-6 grid gap-5">{children}</div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-fg">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-sm border border-line-strong bg-graphite px-4 py-3 text-sm text-fg" />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  showLogo = false,
}: {
  label: string;
  value: string;
  options: string[] | { label: string; value: string }[];
  onChange: (value: string) => void;
  showLogo?: boolean;
}) {
  const normalized = options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt));
  return (
    <label className="grid gap-2 text-sm font-medium text-fg">
      {label}
      <div className="flex items-center gap-3">
        {showLogo && <UniversityLogo university={value} size={36} />}
        <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-sm border border-line-strong bg-graphite px-4 py-3 text-sm text-fg">
          {normalized.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </label>
  );
}
