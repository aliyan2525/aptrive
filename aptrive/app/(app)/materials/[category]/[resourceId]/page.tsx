import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { categories, resources } from "@/lib/library-data";
import { AuthenticatedLibraryResource } from "@/components/library/AuthenticatedLibraryDetails";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return resources.map((r) => ({
    category: r.categorySlug,
    resourceId: r.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; resourceId: string }>;
}): Promise<Metadata> {
  const { category: slug, resourceId } = await params;
  const resource = resources.find(
    (r) => r.id === resourceId && r.categorySlug === slug
  );
  if (!resource) return {};
  return {
    title: `${resource.title} — Materials — Aptrive`,
    description: `Open ${resource.title} from the Aptrive library.`,
  };
}

export default async function ResourceMaterialsPage({
  params,
}: {
  params: Promise<{ category: string; resourceId: string }>;
}) {
  const { category: slug, resourceId } = await params;
  const category = categories.find((c) => c.slug === slug);
  const resource = resources.find(
    (r) => r.id === resourceId && r.categorySlug === slug
  );

  if (!category || category.comingSoon || !resource) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/materials/${slug}/${resourceId}`);
  }

  return <AuthenticatedLibraryResource resource={resource} categoryName={category.name} />;
}
