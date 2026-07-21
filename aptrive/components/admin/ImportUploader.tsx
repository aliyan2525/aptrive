"use client";

import { useActionState } from "react";
import { uploadImportAction, type ActionState } from "@/app/admin/actions";

type PracticeSetOption = { id: string; title: string; subject_id: string };
type SubjectOption = { id: string; name: string };

const initialState: ActionState = { error: null };

export default function ImportUploader({
  subjects,
  practiceSets,
}: {
  subjects: SubjectOption[];
  practiceSets: PracticeSetOption[];
}) {
  const [state, formAction, pending] = useActionState(uploadImportAction, initialState);

  return (
    <form action={formAction} className="rounded-md border border-line bg-panel p-6">
      <label className="grid gap-2 text-sm font-medium text-fg">
        Target practice set
        <select
          name="target_practice_set_id"
          required
          className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg"
        >
          <option value="">Select a practice set…</option>
          {subjects.map((subject) => (
            <optgroup key={subject.id} label={subject.name}>
              {practiceSets
                .filter((p) => p.subject_id === subject.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>

      <label className="mt-5 grid gap-2 text-sm font-medium text-fg">
        CSV file
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
          className="rounded-sm border border-line-strong bg-graphite px-4 py-2 text-sm text-fg file:mr-4 file:rounded-sm file:border-0 file:bg-teal-dim file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-teal"
        />
      </label>

      <details className="mt-4 text-xs text-muted">
        <summary className="cursor-pointer text-teal">Expected column format</summary>
        <p className="mt-2 leading-relaxed">
          Header row with: <code>prompt</code>, <code>option_a</code>, <code>option_b</code>,{" "}
          <code>option_c</code> (optional), <code>option_d</code> (optional), <code>option_e</code>{" "}
          (optional), <code>option_f</code> (optional), <code>correct_option</code> (letter A–F),{" "}
          <code>explanation</code>, <code>difficulty</code> (Easy/Medium/Hard), <code>topic</code>,{" "}
          <code>chapter</code> (optional), <code>time_estimate_seconds</code> (optional),{" "}
          <code>source</code> (optional), <code>source_year</code> (optional), <code>tags</code>{" "}
          (comma-separated, optional).
        </p>
      </details>

      {state.error && (
        <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-sm bg-teal px-5 py-2.5 text-sm font-semibold text-graphite disabled:opacity-50"
      >
        {pending ? "Validating…" : "Upload & validate"}
      </button>
    </form>
  );
}
