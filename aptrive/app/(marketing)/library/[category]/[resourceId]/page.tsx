import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, contentTypeLabels, resources } from "@/lib/library-data";
import { AuthenticatedLibraryResource } from "@/components/library/AuthenticatedLibraryDetails";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ category: string; resourceId: string }>;
};

export async function generateStaticParams() {
  return resources.map((resource) => ({
    category: resource.categorySlug,
    resourceId: resource.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, resourceId } = await params;
  const resource = resources.find(
    (item) => item.categorySlug === category && item.id === resourceId
  );

  if (!resource) return {};

  return {
    title: `${resource.title} — Library — Aptrive`,
    description: `Open ${resource.title} from the Aptrive library.`,
  };
}

export default async function LibraryResourcePage({ params }: PageProps) {
  const { category, resourceId } = await params;
  const resource = resources.find(
    (item) => item.categorySlug === category && item.id === resourceId
  );
  const categoryInfo = categories.find((item) => item.slug === category);

  if (!resource || !categoryInfo) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <AuthenticatedLibraryResource resource={resource} categoryName={categoryInfo.name} />;
  }

  return (
    <section className="container-aptrive py-16 md:py-24">
      <Link href={`/library/${category}`} className="text-xs font-medium text-muted hover:text-teal">
        ← Back to {categoryInfo.name}
      </Link>

      <div className="mt-4 max-w-3xl rounded-md border border-line bg-panel p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-2">
          <span>{contentTypeLabels[resource.contentType]}</span>
          <span>·</span>
          <span>{resource.difficulty}</span>
          <span>·</span>
          <span>{resource.language}</span>
          {resource.examTag && <><span>·</span><span>{resource.examTag}</span></>}
          {resource.university && <><span>·</span><span>{resource.university}</span></>}
        </div>

        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {resource.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          Topic: {resource.topic}
          {resource.chapter ? ` — ${resource.chapter}` : ""}.
        </p>

        <div className="mt-6 grid gap-3 text-xs text-muted sm:grid-cols-3">
          <div className="rounded-sm border border-line bg-panel-2 p-3">Questions: {resource.questionCount > 0 ? resource.questionCount : "Reference"}</div>
          <div className="rounded-sm border border-line bg-panel-2 p-3">Estimated time: ~{resource.estimatedMinutes} minutes</div>
          <div className="rounded-sm border border-line bg-panel-2 p-3">Updated: {resource.updatedAt}</div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/practice" className="rounded-sm bg-teal px-5 py-2.5 text-sm font-semibold text-graphite hover:opacity-90">Open in Practice</Link>
          <Link href={`/library/${category}`} className="rounded-sm border border-line-strong px-5 py-2.5 text-sm font-semibold text-fg hover:border-teal/50">Browse more resources</Link>
        </div>
      </div>
    </section>
  );
}
