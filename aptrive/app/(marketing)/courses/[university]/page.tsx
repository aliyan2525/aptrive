import { redirect } from "next/navigation";
import { getAllCourseSlugs, resolveUniversityByCourseSlug } from "@/lib/universities";
import { getUniversityExperienceSlug } from "@/lib/university-experiences";

type Props = {
  params: Promise<{ university: string }>;
};

export async function generateStaticParams() {
  return getAllCourseSlugs().map((slug) => ({
    university: slug,
  }));
}

export default async function UniversityCoursePage({ params }: Props) {
  const p = await params;
  const uni = resolveUniversityByCourseSlug(p.university);
  if (!uni) redirect("/courses");

  redirect(`/universities/${getUniversityExperienceSlug(uni.id)}`);
}
