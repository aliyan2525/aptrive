import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPracticeSetBySlug } from "@/lib/repositories/questions.repository";
import {
  getQuestionRowsForPracticeSet,
  toClientQuestion,
} from "@/lib/repositories/questions.repository";
import {
  getOrCreatePracticeSetSession,
  getSessionResponses,
} from "@/lib/repositories/practice.repository";
import { listBookmarkedQuestionIds } from "@/lib/repositories/bookmarks.repository";
import PracticeRunner from "@/components/practice/PracticeRunner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ practiceSetSlug: string }>;
}): Promise<Metadata> {
  const { practiceSetSlug } = await params;
  const set = await getPracticeSetBySlug(practiceSetSlug);
  if (!set) return {};
  return { title: `${set.title} — Practice — Aptrive` };
}

export default async function PracticeSetSessionPage({
  params,
}: {
  params: Promise<{ practiceSetSlug: string }>;
}) {
  const { practiceSetSlug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/practice/set/${practiceSetSlug}`);
  }

  const set = await getPracticeSetBySlug(practiceSetSlug);
  if (!set) notFound();

  const [questionRows, session, bookmarkedIds] = await Promise.all([
    getQuestionRowsForPracticeSet(set.id),
    getOrCreatePracticeSetSession(user.id, set.id, set.subject_id, set.question_count),
    listBookmarkedQuestionIds(user.id),
  ]);

  const responses = await getSessionResponses(session.id, user.id);
  const questions = questionRows.map(toClientQuestion);
  const subjectSlug = set.subjects?.slug ?? "";

  return (
    <div className="container-aptrive">
      <PracticeRunner
        sessionId={session.id}
        title={set.title}
        backHref={subjectSlug ? `/practice/subjects/${subjectSlug}` : "/practice/subjects"}
        backLabel="Back to subject"
        questions={questions}
        initialResponses={responses}
        initialBookmarkedIds={bookmarkedIds}
      />
    </div>
  );
}
