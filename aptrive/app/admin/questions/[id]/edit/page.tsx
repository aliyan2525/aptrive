import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuestionForm from "@/components/admin/QuestionForm";
import { getQuestionForAdmin } from "@/lib/admin/questions";
import { 
  listSubjectsForAdmin, 
  listPracticeSetsForAdmin,
  listUniversitiesForAdmin,
  listTestsForAdmin,
  listChaptersForAdmin,
  listTopicsForAdmin,
  listSubtopicsForAdmin,
  listDifficultyLevelsForAdmin
} from "@/lib/admin/catalog";
import QuestionStatusActions from "@/components/admin/QuestionStatusActions";

export const metadata: Metadata = { title: "Edit question — Aptrive Admin" };

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [
    question, 
    subjects, 
    practiceSets,
    universities,
    tests,
    chapters,
    topics,
    subtopics,
    difficultyLevels
  ] = await Promise.all([
    getQuestionForAdmin(id),
    listSubjectsForAdmin(),
    listPracticeSetsForAdmin(),
    listUniversitiesForAdmin(),
    listTestsForAdmin(),
    listChaptersForAdmin(),
    listTopicsForAdmin(),
    listSubtopicsForAdmin(),
    listDifficultyLevelsForAdmin(),
  ]);

  if (!question) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow">Content</div>
          <h1 className="font-display mt-2 text-3xl font-semibold text-fg">Edit question</h1>
          <p className="mt-1 text-sm text-muted">
            v{question.current_version} · {question.subjects?.name} / {question.practice_sets?.title}
          </p>
        </div>
        <QuestionStatusActions questionId={question.id} currentStatus={question.status} />
      </div>
      <div className="mt-8">
        <QuestionForm 
          subjects={subjects} 
          practiceSets={practiceSets} 
          universities={universities}
          tests={tests}
          chapters={chapters}
          topics={topics}
          subtopics={subtopics}
          difficultyLevels={difficultyLevels}
          existing={question} 
        />
      </div>
    </div>
  );
}

