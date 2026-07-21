import { notFound } from "next/navigation";
import Link from "next/link";
import { getImportBatch } from "@/lib/admin/import";
import ImportBatchActions from "@/components/admin/ImportBatchActions";

function rowStatusClass(status: string) {
  switch (status) {
    case "valid":
      return "bg-teal-dim text-teal";
    case "warning":
      return "bg-gold-dim text-gold";
    default:
      return "bg-red-500/10 text-red-400";
  }
}

export default async function ImportBatchPage({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const result = await getImportBatch(batchId);
  if (!result) notFound();

  const { batch, rows } = result;

  return (
    <div>
      <Link href="/admin/import" className="text-sm text-teal hover:underline">
        ← Back to imports
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="eyebrow">Import batch</div>
          <h1 className="font-display mt-2 text-3xl font-semibold text-fg">{batch.file_name}</h1>
          <p className="mt-1 text-sm text-muted">
            Target: {batch.practice_sets?.title ?? "Unknown"} · Status:{" "}
            <span className="text-fg">{batch.status.replace("_", " ")}</span>
          </p>
        </div>
        <ImportBatchActions batchId={batch.id} status={batch.status} hasErrors={batch.error_rows > 0} />
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="rounded-md border border-line bg-panel p-4">
          <p className="text-xs uppercase text-muted-2">Total rows</p>
          <p className="font-mono-data mt-1 text-2xl text-fg">{batch.total_rows}</p>
        </div>
        <div className="rounded-md border border-line bg-panel p-4">
          <p className="text-xs uppercase text-muted-2">Valid</p>
          <p className="font-mono-data mt-1 text-2xl text-teal">{batch.valid_rows}</p>
        </div>
        <div className="rounded-md border border-line bg-panel p-4">
          <p className="text-xs uppercase text-muted-2">Warnings</p>
          <p className="font-mono-data mt-1 text-2xl text-gold">{batch.warning_rows}</p>
        </div>
        <div className="rounded-md border border-line bg-panel p-4">
          <p className="text-xs uppercase text-muted-2">Errors</p>
          <p className="font-mono-data mt-1 text-2xl text-red-400">{batch.error_rows}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-md border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel-2 text-xs uppercase tracking-wide text-muted-2">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Prompt</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line align-top">
                <td className="px-4 py-3 text-muted-2">{row.row_number}</td>
                <td className="max-w-md px-4 py-3 text-fg">
                  {(row.raw_data as Record<string, string>).prompt?.slice(0, 100) || "—"}
                  {row.question_id && (
                    <Link
                      href={`/admin/questions/${row.question_id}/edit`}
                      className="ml-2 text-xs text-teal hover:underline"
                    >
                      view →
                    </Link>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-sm px-2 py-1 text-xs uppercase ${rowStatusClass(row.row_status)}`}>
                    {row.row_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {[...(row.errors ?? []), ...(row.warnings ?? [])].map((msg, i) => (
                    <p key={i}>{msg}</p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
