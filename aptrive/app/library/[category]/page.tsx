import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, resources } from "@/lib/library-data";
import LibraryExplorer from "@/components/library/LibraryExplorer";

export function generateStaticParams() {
  return categories
    .filter((c) => !c.comingSoon)
    .map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} — Library — Aptrive`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category || category.comingSoon) notFound();

  const categoryResources = resources.filter((r) => r.categorySlug === slug);

  return (
    <section className="container-aptrive py-16 md:py-24">
      <Link
        href="/library"
        className="text-xs font-medium text-muted hover:text-teal"
      >
        ← All subjects
      </Link>

      <div className="mt-4 max-w-xl">
        <div className="eyebrow">{category.name}</div>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
          {category.name} library
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {category.description}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
        <div>
          <div className="font-mono-data text-xl font-medium text-fg">
            {category.totalQuestions.toLocaleString()}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
            Total questions
          </div>
        </div>
        <div>
          <div className="font-mono-data text-xl font-medium text-fg">
            {category.practiceSets}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
            Practice sets
          </div>
        </div>
        <div>
          <div className="font-mono-data text-xl font-medium text-fg">
            {category.estimatedStudyTime}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
            Est. study time
          </div>
        </div>
        <div>
          <div className="font-mono-data text-xl font-medium text-fg">
            {category.lastUpdated}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
            Last updated
          </div>
        </div>
      </div>

      <div className="mt-10">
        <LibraryExplorer resources={categoryResources} />
      </div>
    </section>
  );
}
