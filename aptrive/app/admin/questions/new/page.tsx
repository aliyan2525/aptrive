import type { Metadata } from "next";
import QuestionForm from "@/components/admin/QuestionForm";
import { listSubjectsForAdmin, listPracticeSetsForAdmin } from "@/lib/admin/catalog";

export const metadata: Metadata = { title: "New question — Aptrive Admin" };

export default async function NewQuestionPage() {
  const [subjects, practiceSets] = await Promise.all([
    listSubjectsForAdmin(),
    listPracticeSetsForAdmin(),
  ]);

  return (
    <div>
      <div className="eyebrow">Content</div>
      <h1 className="font-display mt-2 text-3xl font-semibold text-fg">New question</h1>
      <p className="mt-1 text-sm text-muted">Saved as a draft by default — publish when it's reviewed.</p>
      <div className="mt-8">
        <QuestionForm subjects={subjects} practiceSets={practiceSets} />
      </div>
    </div>
  );
}
