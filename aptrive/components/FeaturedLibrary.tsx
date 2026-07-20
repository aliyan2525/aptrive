import Link from "next/link";
import { categories } from "@/lib/library-data";

export default function FeaturedLibrary() {
  const featured = categories.filter((c) => !c.comingSoon).slice(0, 4);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {featured.map((category) => (
        <Link
          key={category.slug}
          href={`/library/${category.slug}`}
          className="group flex flex-col rounded-md border border-line bg-panel p-6 transition-colors hover:border-teal/50"
        >
          <span className="font-display text-lg font-semibold text-fg">
            {category.name}
          </span>
          <span className="mt-2 font-mono-data text-xs text-muted">
            {category.totalQuestions.toLocaleString()} questions ·{" "}
            {category.practiceSets} sets
          </span>
          <span className="mt-6 text-sm font-medium text-teal opacity-0 transition-opacity group-hover:opacity-100">
            Browse →
          </span>
        </Link>
      ))}
    </div>
  );
}
