import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getQuestionRowsByIds,
  toClientQuestion,
} from "@/lib/repositories/questions.repository";
import {
  getSessionById,
  getSessionResponses,
} from "@/lib/repositories/practice.repository";
import { listBookmarkedQuestionIds } from "@/lib/repositories/bookmarks.repository";
import PracticeRunner from "@/components/practice/PracticeRunner";

export default async function AdHocSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/practice/session/${sessionId}`);

  const session = await getSessionById(sessionId, user.id);
  if (!session) notFound();

  const sessionKind = (session.metadata?.session_kind as string | undefined) ?? "revision";
  const questionIds = (session.metadata?.question_ids as string[] | undefined) ?? [];
  const [questionRows, responses, bookmarkedIds] = await Promise.all([
    getQuestionRowsByIds(questionIds),
    getSessionResponses(session.id, user.id),
    listBookmarkedQuestionIds(user.id),
  ]);

  const rowsById = new Map(questionRows.map((row) => [row.id, row]));
  const orderedQuestions = questionIds
    .map((id) => rowsById.get(id))
    .filter((row): row is NonNullable<typeof row> => !!row)
    .map(toClientQuestion);

  const title = sessionKind === "revision" ? "Revision session" : "Bookmarked questions";
  const backHref = sessionKind === "revision" ? "/practice/revision" : "/practice/bookmarks";
  const backLabel =
    sessionKind === "revision" ? "Back to revision list" : "Back to bookmarks";

  return (
    <div className="container-aptrive">
      <PracticeRunner
        sessionId={session.id}
        title={title}
        backHref={backHref}
        backLabel={backLabel}
        questions={orderedQuestions}
        initialResponses={responses}
        initialBookmarkedIds={bookmarkedIds}
      />
    </div>
  );
}
