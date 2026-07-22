import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

type BookmarkRow = Database["public"]["Tables"]["bookmarks"]["Row"];

export type BookmarkedQuestionSummary = {
  questionId: string;
  prompt: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subjectName: string | null;
  bookmarkedAt: string;
};

export async function listBookmarkedQuestionsWithDetails(
  userId: string
): Promise<BookmarkedQuestionSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(
      "created_at, question_id, questions(id, prompt, topic, difficulty, subjects(name))"
    )
    .eq("user_id", userId)
    .not("question_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Nested/embedded selects aren't typed by database.types.ts yet (no
  // Relationships metadata), and this project's postgrest-js version
  // doesn't infer plain Row types from `.select()` strings either — so
  // every query result here is cast to a hand-declared shape immediately,
  // matching the convention in lib/dashboard-data.ts.
  type Row = {
    created_at: string;
    question_id: string;
    questions: {
      prompt: string;
      topic: string;
      difficulty: "Easy" | "Medium" | "Hard";
      subjects: { name: string } | null;
    } | null;
  };
  const rows = (data ?? []) as unknown as Row[];

  return rows
    .filter((b) => b.questions)
    .map((b) => ({
      questionId: b.question_id,
      prompt: b.questions!.prompt,
      topic: b.questions!.topic,
      difficulty: b.questions!.difficulty,
      subjectName: b.questions!.subjects?.name ?? null,
      bookmarkedAt: b.created_at,
    }));
}

export async function listBookmarkedQuestionIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("question_id")
    .eq("user_id", userId)
    .not("question_id", "is", null);

  if (error) throw error;
  const rows = (data ?? []) as unknown as Pick<BookmarkRow, "question_id">[];
  return rows.map((b) => b.question_id as string).filter(Boolean);
}

export async function isQuestionBookmarked(
  userId: string,
  questionId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/** Returns the new bookmarked state (true = now bookmarked). */
export async function toggleQuestionBookmark(
  userId: string,
  questionId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: existing, error: findError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (findError) throw findError;
  const existingRow = existing as unknown as Pick<BookmarkRow, "id"> | null;

  if (existingRow) {
    const { error } = await supabase.from("bookmarks").delete().eq("id", existingRow.id);
    if (error) throw error;
    return false;
  }

  const payload: Database["public"]["Tables"]["bookmarks"]["Insert"] = {
    user_id: userId,
    question_id: questionId,
  };

  // `.insert()`'s expected parameter type resolves to `never[]` in this
  // project's postgrest-js version (see note above) — a same-shape cast
  // can't satisfy that, so this is the one spot that needs `as any`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- postgrest-js resolves insert/update payload types to `never` here; see comment above.
  const { error } = await supabase.from("bookmarks").insert(payload as any);
  if (error) throw error;
  return true;
}
