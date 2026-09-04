import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { categories, resources } from "@/lib/library-data";
import { AuthenticatedLibraryCategory } from "@/components/library/AuthenticatedLibraryDetails";
import { createClient } from "@/lib/supabase/server";

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
    title: `${category.name} Materials — Aptrive`,
    description: `Access your ${category.name} study resources.`,
  };
}

export default async function CategoryMaterialsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category || category.comingSoon) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/materials/${slug}`);
  }

  const categoryResources = resources.filter((r) => r.categorySlug === slug);

  return <AuthenticatedLibraryCategory category={category} categoryResources={categoryResources} />;
}
