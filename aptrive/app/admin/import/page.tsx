import Link from "next/link";
import type { Metadata } from "next";
import ImportUploader from "@/components/admin/ImportUploader";
import { listSubjectsForAdmin, listPracticeSetsForAdmin } from "@/lib/admin/catalog";
import { listImportBatches } from "@/lib/admin/import";

export const metadata: Metadata = { title: "Import — Aptrive Admin" };

function statusClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-teal-dim text-teal";
    case "failed":
      return "bg-red-500/10 text-red-400";
    case "rolled_back":
      return "bg-panel-2 text-muted-2";
    default:
      return "bg-gold-dim text-gold";
  }
}

export default async function ImportPage() {
  const [subjects, practiceSets, batches] = await Promise.all([
    listSubjectsForAdmin(),
    listPracticeSetsForAdmin(),
    listImportBatches(),
  ]);

  return (
    <div>
      <div className="eyebrow">Content</div>
      <h1 className="font-display mt-2 text-3xl font-semibold text-fg">Bulk import</h1>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Upload a CSV, review the validation results, then commit. Imported questions land as{" "}
        <span className="text-fg">drafts</span> — nothing is published automatically.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <ImportUploader subjects={subjects} practiceSets={practiceSets} />

        <div>
          <p className="text-sm font-medium text-fg">Recent batches</p>
          <div className="mt-3 space-y-3">
            {batches.length === 0 && <p className="text-sm text-muted">No imports yet.</p>}
            {batches.map((batch) => (
              <Link
                key={batch.id}
                href={`/admin/import/${batch.id}`}
                className="block rounded-md border border-line bg-panel p-4 transition-colors hover:border-teal/50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-fg">{batch.file_name}</p>
                  <span className={`rounded-sm px-2 py-0.5 text-xs uppercase ${statusClass(batch.status)}`}>
                    {batch.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {batch.practice_sets?.title ?? "Unknown set"} · {batch.valid_rows}/{batch.total_rows}{" "}
                  valid · {batch.error_rows} errors · {new Date(batch.created_at).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
