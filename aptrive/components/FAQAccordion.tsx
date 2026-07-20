const faqs = [
  {
    q: "Is Aptrive only for NUST NET?",
    a: "NUST NET is fully live today. ECAT and MDCAT tracks are being built on the same engine and are coming soon — your account and progress will carry over.",
  },
  {
    q: "How is the practice sequence personalized?",
    a: "Every attempt updates a topic-level mastery profile. Aptrive resequences upcoming questions toward your weakest topics instead of giving everyone the same fixed order.",
  },
  {
    q: "Are the mock tests timed like the real exam?",
    a: "Yes. Full-length mocks mirror the real exam's section timing and question distribution so results translate to actual test-day performance.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. Core diagnostics and a selection of practice questions are free. Full past papers, mock tests, and AI-generated practice sets are part of premium.",
  },
  {
    q: "Can I use Aptrive on mobile?",
    a: "The platform is fully responsive and works in any modern mobile browser, with a dedicated app planned as part of the roadmap.",
  },
];

export default function FAQAccordion() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((item) => (
        <details key={item.q} className="faq-item group py-5">
          <summary className="flex items-center justify-between gap-6">
            <span className="font-display text-base font-medium text-fg md:text-lg">
              {item.q}
            </span>
            <span className="faq-chevron font-mono-data shrink-0 text-xl text-teal">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
