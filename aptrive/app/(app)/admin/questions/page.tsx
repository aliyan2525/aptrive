import Link from "next/link";
import { listQuestionsForAdmin } from "@/lib/admin/questions";
import { listSubjectsForAdmin } from "@/lib/admin/catalog";
import type { QuestionStatus, Difficulty } from "@/lib/database.types";

const STATUS_OPTIONS: (QuestionStatus | "all")[] = ["all", "draft", "in_review", "published", "archived"];
const DIFFICULTY_OPTIONS: (Difficulty | "all")[] = ["all", "Easy", "Medium", "Hard"];

function statusBadgeClass(status: QuestionStatus) {
  switch (status) {
    case "published":
      return "bg-teal-dim text-teal";
    case "in_review":
      return "bg-gold-dim text-gold";
    case "archived":
      return "bg-panel-2 text-muted-2";
    default:
      return "border border-line-strong text-muted";
  }
}

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;

  const [{ rows, total, totalPages }, subjects] = await Promise.all([
    listQuestionsForAdmin({
      search: params.search,
      status: (params.status as QuestionStatus | "all") ?? "all",
      subjectId: params.subject,
      difficulty: (params.difficulty as Difficulty | "all") ?? "all",
      page,
    }),
    listSubjectsForAdmin(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow">Content</div>
          <h1 className="font-display mt-2 text-3xl font-semibold text-fg">Questions</h1>
          <p className="mt-1 text-sm text-muted">{total.toLocaleString()} total</p>
        </div>
        <Link
          href="/admin/questions/new"
          className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite"
        >
          New question
        </Link>
      </div>

      {/* Filters — a plain GET form keeps the whole page server-rendered
          and shareable via URL, no client JS required. */}
      <form className="mt-6 grid grid-cols-2 gap-3 rounded-md border border-line bg-panel p-4 md:grid-cols-5">
        <input
          type="text"
          name="search"
          defaultValue={params.search ?? ""}
          placeholder="Search prompt text…"
          className="col-span-2 rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg md:col-span-2"
        />
        <select
          name="status"
          defaultValue={params.status ?? "all"}
          className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          name="difficulty"
          defaultValue={params.difficulty ?? "all"}
          className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg"
        >
          {DIFFICULTY_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d === "all" ? "All difficulties" : d}
            </option>
          ))}
        </select>
        <select
          name="subject"
          defaultValue={params.subject ?? ""}
          className="rounded-sm border border-line-strong bg-graphite px-3 py-2 text-sm text-fg"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-sm border border-line-strong px-3 py-2 text-sm text-fg hover:border-teal/50"
        >
          Apply filters
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-md border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel-2 text-xs uppercase tracking-wide text-muted-2">
            <tr>
              <th className="px-4 py-3">Prompt</th>
              <th className="px-4 py-3">Subject / Set</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No questions match these filters.
                </td>
              </tr>
            )}
            {rows.map((q) => (
              <tr key={q.id} className="border-t border-line hover:bg-panel-2/50">
                <td className="max-w-md px-4 py-3">
                  <Link href={`/admin/questions/${q.id}/edit`} className="text-fg hover:text-teal">
                    {q.prompt.length > 90 ? `${q.prompt.slice(0, 90)}…` : q.prompt}
                  </Link>
                  {q.ai_generated && (
                    <span className="ml-2 rounded-sm bg-gold-dim px-1.5 py-0.5 text-[10px] uppercase text-gold">
                      AI
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">
                  {q.subjects?.name ?? "—"} / {q.practice_sets?.title ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted">{q.difficulty}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-sm px-2 py-1 text-xs uppercase tracking-wide ${statusBadgeClass(q.status)}`}
                  >
                    {q.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-2">{new Date(q.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{ pathname: "/admin/questions", query: { ...params, page: String(p) } }}
              className={`rounded-sm px-3 py-1 ${
                p === page ? "bg-teal-dim text-fg" : "text-muted hover:bg-panel-2"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
