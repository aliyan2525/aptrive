import "server-only";
import { createClient } from "@/lib/supabase/server";

export type RevisionQuestionSummary = {
  questionId: string;
  prompt: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subjectName: string | null;
  lastAnsweredAt: string;
};

/**
 * Every question the user most recently got wrong, deduped so a
 * question that was eventually answered correctly on a later attempt
 * drops out of the revision list automatically.
 */
export async function listIncorrectQuestions(
  userId: string,
  limit = 50
): Promise<RevisionQuestionSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_responses")
    .select(
      "question_id, is_correct, answered_at, questions(prompt, topic, difficulty, subjects(name))"
    )
    .eq("user_id", userId)
    .order("answered_at", { ascending: false });

  if (error) throw error;

  type Row = {
    question_id: string;
    is_correct: boolean;
    answered_at: string;
    questions: {
      prompt: string;
      topic: string;
      difficulty: "Easy" | "Medium" | "Hard";
      subjects: { name: string } | null;
    } | null;
  };
  const rows = (data ?? []) as unknown as Row[];

  const latestByQuestion = new Map<string, Row>();
  for (const row of rows) {
    if (!latestByQuestion.has(row.question_id)) {
      latestByQuestion.set(row.question_id, row);
    }
  }

  return Array.from(latestByQuestion.values())
    .filter((row) => !row.is_correct && row.questions)
    .slice(0, limit)
    .map((row) => ({
      questionId: row.question_id,
      prompt: row.questions!.prompt,
      topic: row.questions!.topic,
      difficulty: row.questions!.difficulty,
      subjectName: row.questions!.subjects?.name ?? null,
      lastAnsweredAt: row.answered_at,
    }));
}
