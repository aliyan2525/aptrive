import Link from "next/link";
import type { PracticeSetSummary } from "@/lib/repositories/catalog.repository";

export default function PracticeSetCard({ set }: { set: PracticeSetSummary }) {
  return (
    <Link
      href={`/practice/set/${set.slug}`}
      className="block rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-line-strong"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.14em] text-muted">
          {set.chapter ?? set.topic}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            set.difficulty === "Easy"
              ? "bg-teal-dim text-teal"
              : set.difficulty === "Medium"
              ? "bg-gold-dim text-gold"
              : "bg-panel-2 text-muted"
          }`}
        >
          {set.difficulty}
        </span>
      </div>

      <h3 className="font-display mt-3 text-base font-semibold text-fg">
        {set.title}
      </h3>

      <div className="mt-4 flex items-center gap-4 font-mono-data text-xs text-muted">
        <span>{set.questionCount} questions</span>
        <span>{set.estimatedMinutes} min</span>
        {set.isPremium ? <span className="text-gold">Premium</span> : null}
      </div>
    </Link>
  );
}
