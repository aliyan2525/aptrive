"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const steps = ["Identity", "Target", "Academics", "Schedule", "Plan"];
const universities = ["NUST", "FAST", "COMSATS", "GIKI", "PIEAS", "UET"];
const tests = ["NET", "ECAT", "MDCAT", "FAST Admission Test", "GIKI Test"];
const subjects = ["Mathematics", "Physics", "English", "Intelligence", "Computer Science"];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    displayName: "",
    university: "NUST",
    program: "Computer Science",
    test: "NET",
    education: "Intermediate / A-Level",
    matric: "",
    intermediate: "",
    testDate: "",
    schedule: "Evening",
    dailyTarget: "90",
    improvement: ["Mathematics", "Physics"],
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
              <SelectField label="Target university" value={form.university} options={universities} onChange={(university) => setForm({ ...form, university })} />
              <TextField label="Target degree/program" value={form.program} onChange={(program) => setForm({ ...form, program })} />
              <SelectField label="Entry test" value={form.test} options={tests} onChange={(test) => setForm({ ...form, test })} />
            </Fieldset>
          )}

          {step === 2 && (
            <Fieldset title="Add academic context">
              <SelectField label="Current education level" value={form.education} options={["Matric", "Intermediate / A-Level", "Gap year", "Undergraduate transfer"]} onChange={(education) => setForm({ ...form, education })} />
              <TextField label="Matric marks" value={form.matric} onChange={(matric) => setForm({ ...form, matric })} />
              <TextField label="Intermediate marks" value={form.intermediate} onChange={(intermediate) => setForm({ ...form, intermediate })} />
              <TextField label="Expected entry test date" type="date" value={form.testDate} onChange={(testDate) => setForm({ ...form, testDate })} />
            </Fieldset>
          )}

          {step === 3 && (
            <Fieldset title="Set your rhythm">
              <SelectField label="Preferred study schedule" value={form.schedule} options={["Morning", "Afternoon", "Evening", "Late night"]} onChange={(schedule) => setForm({ ...form, schedule })} />
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
                This preview can be saved to Supabase next; the schema already has profile, goals, notifications, and progress tables ready for it.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {plan.map((item) => (
                  <div key={item.label} className="rounded-md border border-line bg-panel-2 p-5">
                    <p className="text-xs uppercase tracking-wide text-muted-2">{item.label}</p>
                    <p className="font-display mt-2 text-xl font-semibold text-fg">{item.value}</p>
                  </div>
                ))}
              </div>
              <Link href="/dashboard" className="mt-8 inline-flex rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite">
                Go to dashboard
              </Link>
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

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-fg">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-sm border border-line-strong bg-graphite px-4 py-3 text-sm text-fg">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
