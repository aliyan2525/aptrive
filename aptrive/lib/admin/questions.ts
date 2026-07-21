import { createClient } from "@/lib/supabase/server";
import type { Database, QuestionStatus, Difficulty } from "@/lib/database.types";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type OptionRow = Database["public"]["Tables"]["question_options"]["Row"];

export type QuestionWithOptions = QuestionRow & {
  options: OptionRow[];
  subjects: { name: string } | null;
  practice_sets: { title: string } | null;
};

export type QuestionListFilters = {
  search?: string;
  status?: QuestionStatus | "all";
  subjectId?: string;
  practiceSetId?: string;
  difficulty?: Difficulty | "all";
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 25;

/**
 * Searchable/filterable question list for the admin table. Uses
 * offset pagination — fine at the row counts this table will see for
 * a while; switch to keyset (createdAt/id cursor) if it ever needs to
 * comfortably page past the tens of thousands of rows mark.
 */
export async function listQuestionsForAdmin(filters: QuestionListFilters) {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("questions")
    .select(
      "id, prompt, difficulty, topic, chapter, status, tags, ai_generated, human_reviewed, current_version, updated_at, subjects(name), practice_sets(title)",
      { count: "exact" }
    )
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (filters.search) {
    query = query.ilike("prompt", `%${filters.search}%`);
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.subjectId) {
    query = query.eq("subject_id", filters.subjectId);
  }
  if (filters.practiceSetId) {
    query = query.eq("practice_set_id", filters.practiceSetId);
  }
  if (filters.difficulty && filters.difficulty !== "all") {
    query = query.eq("difficulty", filters.difficulty);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    rows: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getQuestionForAdmin(id: string): Promise<QuestionWithOptions | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*, options:question_options(*), subjects(name), practice_sets(title)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...(data as unknown as QuestionRow),
    options: ((data as unknown as { options: OptionRow[] }).options ?? []).sort(
      (a, b) => a.position - b.position
    ),
    subjects: (data as unknown as { subjects: { name: string } | null }).subjects,
    practice_sets: (data as unknown as { practice_sets: { title: string } | null }).practice_sets,
  };
}

export async function listQuestionVersions(questionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_versions")
    .select("*")
    .eq("question_id", questionId)
    .order("version_number", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export type QuestionOptionInput = {
  content: string;
  is_correct: boolean;
};

export type QuestionFormInput = {
  practice_set_id: string;
  subject_id: string;
  prompt: string;
  explanation: string | null;
  difficulty: Difficulty;
  topic: string;
  chapter: string | null;
  time_estimate_seconds: number;
  status: QuestionStatus;
  source: string | null;
  source_year: number | null;
  tags: string[];
  ai_generated: boolean;
  options: QuestionOptionInput[];
};

/**
 * Creates a question and its options in one call. Not wrapped in an
 * explicit SQL transaction (the anon client can't open one) — if the
 * options insert fails after the question insert succeeds, the
 * question is deleted again so we don't leave an optionless row
 * behind. Acceptable for admin-authored content at this volume; the
 * CSV importer (lib/admin/import.ts) does the same pattern per row.
 */
export async function createQuestion(input: QuestionFormInput, createdBy: string) {
  const supabase = await createClient();

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .insert({
      practice_set_id: input.practice_set_id,
      subject_id: input.subject_id,
      prompt: input.prompt,
      explanation: input.explanation,
      difficulty: input.difficulty,
      topic: input.topic,
      chapter: input.chapter,
      time_estimate_seconds: input.time_estimate_seconds,
      status: input.status,
      source: input.source,
      source_year: input.source_year,
      tags: input.tags,
      ai_generated: input.ai_generated,
      created_by: createdBy,
    })
    .select("id")
    .single();

  if (questionError) throw questionError;

  const { error: optionsError } = await supabase.from("question_options").insert(
    input.options.map((option, index) => ({
      question_id: question.id,
      content: option.content,
      is_correct: option.is_correct,
      position: index,
    }))
  );

  if (optionsError) {
    await supabase.from("questions").delete().eq("id", question.id);
    throw optionsError;
  }

  return question.id as string;
}

/**
 * Updates a question's fields and fully replaces its options
 * (delete + re-insert, simplest correct way to handle option
 * add/remove/reorder from a form without diffing). The
 * `snapshot_question_version` trigger (0005 migration) captures the
 * pre-update state automatically when prompt/explanation/status/
 * difficulty change.
 */
export async function updateQuestion(
  id: string,
  input: QuestionFormInput,
  reviewedBy: string
) {
  const supabase = await createClient();

  const { error: questionError } = await supabase
    .from("questions")
    .update({
      practice_set_id: input.practice_set_id,
      subject_id: input.subject_id,
      prompt: input.prompt,
      explanation: input.explanation,
      difficulty: input.difficulty,
      topic: input.topic,
      chapter: input.chapter,
      time_estimate_seconds: input.time_estimate_seconds,
      status: input.status,
      source: input.source,
      source_year: input.source_year,
      tags: input.tags,
      ai_generated: input.ai_generated,
      reviewed_by: reviewedBy,
    })
    .eq("id", id);

  if (questionError) throw questionError;

  const { error: deleteError } = await supabase
    .from("question_options")
    .delete()
    .eq("question_id", id);
  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase.from("question_options").insert(
    input.options.map((option, index) => ({
      question_id: id,
      content: option.content,
      is_correct: option.is_correct,
      position: index,
    }))
  );
  if (insertError) throw insertError;
}

export async function setQuestionStatus(id: string, status: QuestionStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("questions").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function duplicateQuestion(id: string, createdBy: string) {
  const supabase = await createClient();
  const original = await getQuestionForAdmin(id);
  if (!original) throw new Error("Question not found");

  const newId = await createQuestion(
    {
      practice_set_id: original.practice_set_id,
      subject_id: original.subject_id,
      prompt: `${original.prompt} (copy)`,
      explanation: original.explanation,
      difficulty: original.difficulty,
      topic: original.topic,
      chapter: original.chapter,
      time_estimate_seconds: original.time_estimate_seconds,
      status: "draft",
      source: original.source,
      source_year: original.source_year,
      tags: original.tags,
      ai_generated: original.ai_generated,
      options: original.options.map((o) => ({ content: o.content, is_correct: o.is_correct })),
    },
    createdBy
  );

  const { error } = await supabase
    .from("questions")
    .update({ duplicated_from_id: id })
    .eq("id", newId);
  if (error) throw error;

  return newId;
}
