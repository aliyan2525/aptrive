import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseSchema } from "@/components/StructuredData";
import UniversityExperiencePage from "@/components/university/UniversityExperiencePage";
import {
  getUniversityExperienceBySlug,
  universityExperiences,
} from "@/lib/university-experiences";

type Props = {
  params: Promise<{ university: string }>;
};

export async function generateStaticParams() {
  return universityExperiences.map((experience) => ({
    university: experience.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const experience = getUniversityExperienceBySlug(p.university);
  if (!experience) return {};

  return {
    title: `${experience.university.name} University Experience - Aptrive`,
    description: experience.identity.subhead,
  };
}

export default async function UniversityPage({ params }: Props) {
  const p = await params;
  const experience = getUniversityExperienceBySlug(p.university);
  if (!experience) notFound();

  return (
    <>
      <CourseSchema
        name={`${experience.university.name} Preparation`}
        description={experience.identity.subhead}
      />
      <UniversityExperiencePage experience={experience} />
    </>
  );
}
