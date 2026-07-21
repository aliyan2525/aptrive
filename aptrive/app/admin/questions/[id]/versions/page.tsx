import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestionForAdmin, listQuestionVersions } from "@/lib/admin/questions";

export default async function QuestionVersionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [question, versions] = await Promise.all([
    getQuestionForAdmin(id),
    listQuestionVersions(id),
  ]);

  if (!question) notFound();

  return (
    <div>
      <Link href={`/admin/questions/${id}/edit`} className="text-sm text-teal hover:underline">
        ← Back to editor
      </Link>
      <div className="eyebrow mt-4">Version history</div>
      <h1 className="font-display mt-2 text-3xl font-semibold text-fg">
        Currently v{question.current_version}
      </h1>

      <div className="mt-8 space-y-4">
        {versions.length === 0 && (
          <p className="text-sm text-muted">
            No prior versions yet — this question hasn't been edited since it was created.
          </p>
        )}
        {versions.map((v) => (
          <details key={v.id} className="rounded-md border border-line bg-panel p-5">
            <summary className="cursor-pointer text-sm font-medium text-fg">
              v{v.version_number} — {new Date(v.created_at).toLocaleString()}
              {v.change_summary ? ` · ${v.change_summary}` : ""}
            </summary>
            <pre className="mt-4 max-h-96 overflow-auto rounded-sm bg-graphite p-4 text-xs text-muted">
              {JSON.stringify(v.snapshot, null, 2)}
            </pre>
          </details>
        ))}
      </div>
    </div>
  );
}
