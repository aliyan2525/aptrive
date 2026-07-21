const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aptrive",
  url: "https://aptrive.com",
  logo: "https://aptrive.com/logo-mark.png",
  description:
    "Intelligent learning platform for Pakistan's competitive university entrance examinations.",
  areaServed: "PK",
  sameAs: [],
};

/**
 * Site-wide Organization schema. Render this once, in the root layout.
 */
export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

type CourseSchemaProps = {
  name: string;
  description: string;
  educationalLevel?: string;
};

/**
 * Per-course Course schema. Render this inside each individual course
 * page (e.g. app/courses/nust-net/page.tsx) with that course's own
 * name/description — do NOT render this globally, or every page on the
 * site will claim to be the same course.
 */
export function CourseSchema({
  name,
  description,
  educationalLevel = "High school / Intermediate",
}: CourseSchemaProps) {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "Aptrive",
    },
    educationalLevel,
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      category: "Free tier available",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
    />
  );
}
