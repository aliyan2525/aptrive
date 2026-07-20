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

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "NUST NET Preparation",
  description:
    "Mathematics-focused NUST NET preparation with diagnostics, adaptive practice, analytics, and timed mock exams.",
  provider: {
    "@type": "Organization",
    name: "Aptrive",
  },
  educationalLevel: "High school / Intermediate",
  inLanguage: "en",
  offers: {
    "@type": "Offer",
    category: "Free tier available",
  },
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
    </>
  );
}
