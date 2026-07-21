"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { QuestionStatus } from "@/lib/database.types";
import { setQuestionStatusAction, duplicateQuestionAction } from "@/app/admin/actions";

export default function QuestionStatusActions({
  questionId,
  currentStatus,
}: {
  questionId: string;
  currentStatus: QuestionStatus;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function setStatus(status: QuestionStatus) {
    startTransition(async () => {
      await setQuestionStatusAction(questionId, status);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus !== "published" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("published")}
          className="rounded-sm bg-teal px-3 py-1.5 text-xs font-semibold text-graphite disabled:opacity-50"
        >
          Publish
        </button>
      )}
      {currentStatus === "published" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("draft")}
          className="rounded-sm border border-line-strong px-3 py-1.5 text-xs text-fg disabled:opacity-50"
        >
          Unpublish to draft
        </button>
      )}
      {currentStatus !== "archived" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => setStatus("archived")}
          className="rounded-sm border border-line-strong px-3 py-1.5 text-xs text-muted hover:text-red-400 disabled:opacity-50"
        >
          Archive
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => duplicateQuestionAction(questionId))}
        className="rounded-sm border border-line-strong px-3 py-1.5 text-xs text-fg disabled:opacity-50"
      >
        Duplicate
      </button>
    </div>
  );
}
