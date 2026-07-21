"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { commitImportBatchAction, rollbackImportBatchAction } from "@/app/admin/actions";

export default function ImportBatchActions({
  batchId,
  status,
  hasErrors,
}: {
  batchId: string;
  status: string;
  hasErrors: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  function commit() {
    setError(null);
    startTransition(async () => {
      try {
        await commitImportBatchAction(batchId);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Commit failed.");
      }
    });
  }

  function rollback() {
    setError(null);
    startTransition(async () => {
      try {
        await rollbackImportBatchAction(batchId);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Rollback failed.");
      }
    });
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {status === "ready" && (
          <button
            type="button"
            disabled={pending}
            onClick={commit}
            className="rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-graphite disabled:opacity-50"
          >
            {pending ? "Importing…" : hasErrors ? "Import valid + warning rows" : "Import all rows"}
          </button>
        )}
        {status === "completed" && (
          <button
            type="button"
            disabled={pending}
            onClick={rollback}
            className="rounded-sm border border-red-500/40 px-4 py-2 text-sm text-red-400 disabled:opacity-50"
          >
            {pending ? "Rolling back…" : "Roll back this import"}
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  );
}
