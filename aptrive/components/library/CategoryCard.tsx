import Link from "next/link";
import type { LibraryCategory } from "@/lib/library-data";

export default function CategoryCard({
  category,
}: {
  category: LibraryCategory;
}) {
  if (category.comingSoon) {
    return (
      <div className="flex flex-col rounded-md border border-line bg-panel p-6 opacity-60">
        <span className="font-mono-data text-xs uppercase tracking-[0.14em] text-muted-2">
          Coming soon
        </span>
        <span className="font-display mt-3 text-xl font-semibold text-fg">
          {category.name}
        </span>
        <p className="mt-2 flex-1 text-sm text-muted">
          {category.description}
        </p>
      </div>
    );
  }

  const { easy, medium, hard } = category.difficultyDistribution;

  return (
    <Link
      href={`/library/${category.slug}`}
      className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors hover:border-teal/50"
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-xl font-semibold text-fg">
          {category.name}
        </span>
        <span className="font-mono-data text-xs text-muted-2">
          {category.practiceSets} sets
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm text-muted">{category.description}</p>

      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="font-mono-data text-fg">
          {category.totalQuestions.toLocaleString()} questions
        </span>
        <span className="font-mono-data text-muted-2">
          {category.estimatedStudyTime}
        </span>
      </div>

      {/* difficulty distribution bar */}
      <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div style={{ width: `${easy}%` }} className="bg-teal" />
        <div style={{ width: `${medium}%` }} className="bg-gold" />
        <div style={{ width: `${hard}%` }} className="bg-red-400" />
      </div>

      <span className="mt-5 text-sm font-medium text-teal opacity-0 transition-opacity group-hover:opacity-100">
        Explore {category.name} →
      </span>
    </Link>
  );
}
