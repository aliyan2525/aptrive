import { createClient } from "@/lib/supabase/server";
import { parseCsvToRecords, type CsvRecord } from "@/lib/admin/csv";
import type { Database, Difficulty } from "@/lib/database.types";

// Our hand-authored Database type (like the rest of this codebase's
// database.types.ts) doesn't carry Supabase's generated `Relationships`
// metadata, so embedded selects such as `practice_sets(title, slug)`
// can't be type-inferred by the client and need an explicit cast at
// the boundary — same convention lib/dashboard-data.ts already uses
// for `user_achievements.select("...achievements(name, icon, ...)")`.
type ImportBatchRow = Database["public"]["Tables"]["import_batches"]["Row"] & {
  practice_sets: { title: string; slug: string } | null;
};

/**
 * CSV import pipeline: validate -> preview -> commit -> rollback.
 *
 * Expected columns (header row, any order):
 *   prompt, option_a, option_b, option_c, option_d, option_e, option_f,
 *   correct_option, explanation, difficulty, topic, chapter,
 *   time_estimate_seconds, source, source_year, tags
 *
 * - option_e / option_f are optional (2-6 options total).
 * - correct_option is a letter (A-F) matching a non-empty option.
 * - difficulty must be Easy / Medium / Hard.
 * - tags is a comma-separated list, optional.
 *
 * Every row imports into ONE practice set chosen for the whole batch
 * (a CSV is "the questions for this past paper / topic set"), rather
 * than letting each row target a different practice set — keeps the
 * validation surface small and matches how content actually arrives
 * (one file per past paper / chapter set).
 */

const OPTION_COLUMNS = ["option_a", "option_b", "option_c", "option_d", "option_e", "option_f"] as const;
const VALID_DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const REQUIRED_COLUMNS = ["prompt", "option_a", "option_b", "correct_option", "difficulty", "topic"];

export type ValidatedRow = {
  rowNumber: number;
  raw: CsvRecord;
  status: "valid" | "warning" | "error";
  errors: string[];
  warnings: string[];
};

function normalizeForDuplicateCheck(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function validateCsvRows(csvText: string, existingPrompts: string[]): ValidatedRow[] {
  const records = parseCsvToRecords(csvText);
  const seenNormalized = new Map<string, number>(); // normalized prompt -> first row number in this batch
  const existingNormalized = new Set(existingPrompts.map(normalizeForDuplicateCheck));

  return records.map((raw, index) => {
    const rowNumber = index + 1;
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const col of REQUIRED_COLUMNS) {
      if (!raw[col] || raw[col].trim().length === 0) {
        errors.push(`Missing required value for "${col}"`);
      }
    }

    const options = OPTION_COLUMNS.map((col) => raw[col]?.trim() ?? "").filter((v) => v.length > 0);
    if (options.length < 2) {
      errors.push("At least 2 non-empty options are required");
    }
    if (options.length > 6) {
      errors.push("At most 6 options are supported");
    }

    const correctLetter = (raw.correct_option ?? "").trim().toUpperCase();
    const correctIndex = correctLetter ? correctLetter.charCodeAt(0) - 65 : -1;
    if (!correctLetter) {
      errors.push('Missing "correct_option" (expected a letter A-F)');
    } else if (correctIndex < 0 || correctIndex >= OPTION_COLUMNS.length) {
      errors.push(`"correct_option" value "${correctLetter}" is not a valid option letter`);
    } else if (correctIndex >= options.length || !raw[OPTION_COLUMNS[correctIndex]]?.trim()) {
      errors.push(`"correct_option" points to option ${correctLetter}, which is empty`);
    }

    const difficulty = (raw.difficulty ?? "").trim();
    if (difficulty && !VALID_DIFFICULTIES.includes(difficulty as Difficulty)) {
      errors.push(`"difficulty" must be one of Easy, Medium, Hard (got "${difficulty}")`);
    }

    if (raw.source_year && raw.source_year.trim() && Number.isNaN(Number(raw.source_year))) {
      errors.push('"source_year" must be a number');
    }
    if (
      raw.time_estimate_seconds &&
      raw.time_estimate_seconds.trim() &&
      Number.isNaN(Number(raw.time_estimate_seconds))
    ) {
      errors.push('"time_estimate_seconds" must be a number');
    }

    if (raw.prompt) {
      const normalized = normalizeForDuplicateCheck(raw.prompt);
      if (existingNormalized.has(normalized)) {
        warnings.push("A question with near-identical text already exists in this practice set");
      }
      const firstSeenAt = seenNormalized.get(normalized);
      if (firstSeenAt !== undefined) {
        warnings.push(`Near-duplicate of row ${firstSeenAt} in this same file`);
      } else {
        seenNormalized.set(normalized, rowNumber);
      }
    }

    return {
      rowNumber,
      raw,
      status: errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid",
      errors,
      warnings,
    };
  });
}

/**
 * Step 1: upload + validate. Creates the batch and its rows with
 * per-row status, but does NOT touch the `questions` table — nothing
 * is imported until commitImportBatch is called on a reviewed batch.
 */
export async function createImportBatch(params: {
  fileName: string;
  targetPracticeSetId: string;
  csvText: string;
  createdBy: string;
}) {
  const supabase = await createClient();

  const { data: existingQuestions, error: existingError } = await supabase
    .from("questions")
    .select("prompt")
    .eq("practice_set_id", params.targetPracticeSetId);
  if (existingError) throw existingError;

  const validated = validateCsvRows(
    params.csvText,
    (existingQuestions ?? []).map((q) => q.prompt)
  );

  const counts = validated.reduce(
    (acc, row) => {
      acc[row.status]++;
      return acc;
    },
    { valid: 0, warning: 0, error: 0 } as Record<"valid" | "warning" | "error", number>
  );

  const { data: batch, error: batchError } = await supabase
    .from("import_batches")
    .insert({
      file_name: params.fileName,
      target_practice_set_id: params.targetPracticeSetId,
      status: "ready",
      total_rows: validated.length,
      valid_rows: counts.valid,
      warning_rows: counts.warning,
      error_rows: counts.error,
      created_by: params.createdBy,
    })
    .select("id")
    .single();
  if (batchError) throw batchError;

  const { error: rowsError } = await supabase.from("import_batch_rows").insert(
    validated.map((row) => ({
      batch_id: batch.id,
      row_number: row.rowNumber,
      raw_data: row.raw,
      row_status: row.status,
      errors: row.errors,
      warnings: row.warnings,
    }))
  );
  if (rowsError) {
    await supabase.from("import_batches").delete().eq("id", batch.id);
    throw rowsError;
  }

  return batch.id as string;
}

export async function getImportBatch(batchId: string) {
  const supabase = await createClient();
  const { data: batch, error: batchError } = await supabase
    .from("import_batches")
    .select("*, practice_sets(title, slug)")
    .eq("id", batchId)
    .maybeSingle();
  if (batchError) throw batchError;
  if (!batch) return null;

  const { data: rows, error: rowsError } = await supabase
    .from("import_batch_rows")
    .select("*")
    .eq("batch_id", batchId)
    .order("row_number", { ascending: true });
  if (rowsError) throw rowsError;

  return { batch: batch as unknown as ImportBatchRow, rows: rows ?? [] };
}

export async function listImportBatches(): Promise<ImportBatchRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("import_batches")
    .select("*, practice_sets(title, slug)")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as unknown as ImportBatchRow[];
}

function buildOptionsFromRow(raw: CsvRecord) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  const columns = ["option_a", "option_b", "option_c", "option_d", "option_e", "option_f"];
  const correctLetter = (raw.correct_option ?? "").trim().toUpperCase();

  return columns
    .map((col, index) => ({ content: raw[col]?.trim() ?? "", letter: letters[index] }))
    .filter((o) => o.content.length > 0)
    .map((o, index) => ({
      content: o.content,
      is_correct: o.letter === correctLetter,
      position: index,
    }));
}

/**
 * Step 2: commit. Imports every row that isn't a hard error (valid +
 * warning rows — warnings are surfaced for human judgment, not
 * blocking) as a `draft` question, one row at a time so a single bad
 * row doesn't abort the whole batch. Per-row failures are recorded on
 * the row itself and reflected in the batch's final counts.
 */
export async function commitImportBatch(batchId: string, createdBy: string) {
  const supabase = await createClient();

  const { data: batch, error: batchError } = await supabase
    .from("import_batches")
    .select("*")
    .eq("id", batchId)
    .maybeSingle();
  if (batchError) throw batchError;
  if (!batch) throw new Error("Import batch not found");
  if (batch.status !== "ready") {
    throw new Error(`Batch is "${batch.status}" and cannot be committed again`);
  }

  await supabase.from("import_batches").update({ status: "importing" }).eq("id", batchId);

  const { data: rows, error: rowsError } = await supabase
    .from("import_batch_rows")
    .select("*")
    .eq("batch_id", batchId)
    .in("row_status", ["valid", "warning"])
    .order("row_number", { ascending: true });
  if (rowsError) throw rowsError;

  let imported = 0;
  let failed = 0;

  for (const row of rows ?? []) {
    const raw = row.raw_data as CsvRecord;
    const options = buildOptionsFromRow(raw);

    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        practice_set_id: batch.target_practice_set_id,
        subject_id: (
          await supabase
            .from("practice_sets")
            .select("subject_id")
            .eq("id", batch.target_practice_set_id)
            .single()
        ).data?.subject_id,
        prompt: raw.prompt,
        explanation: raw.explanation || null,
        difficulty: raw.difficulty as Difficulty,
        topic: raw.topic,
        chapter: raw.chapter || null,
        time_estimate_seconds: raw.time_estimate_seconds ? Number(raw.time_estimate_seconds) : 60,
        status: "draft",
        source: raw.source || null,
        source_year: raw.source_year ? Number(raw.source_year) : null,
        tags: raw.tags ? raw.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        ai_generated: false,
        created_by: createdBy,
      })
      .select("id")
      .single();

    if (questionError || !question) {
      failed++;
      await supabase
        .from("import_batch_rows")
        .update({
          row_status: "error",
          errors: [...(row.errors ?? []), `Import failed: ${questionError?.message ?? "unknown error"}`],
        })
        .eq("id", row.id);
      continue;
    }

    const { error: optionsError } = await supabase.from("question_options").insert(
      options.map((o) => ({ ...o, question_id: question.id }))
    );

    if (optionsError) {
      await supabase.from("questions").delete().eq("id", question.id);
      failed++;
      await supabase
        .from("import_batch_rows")
        .update({
          row_status: "error",
          errors: [...(row.errors ?? []), `Options import failed: ${optionsError.message}`],
        })
        .eq("id", row.id);
      continue;
    }

    imported++;
    await supabase.from("import_batch_rows").update({ question_id: question.id }).eq("id", row.id);
  }

  await supabase
    .from("import_batches")
    .update({
      status: failed > 0 && imported === 0 ? "failed" : "completed",
      valid_rows: imported,
      error_rows: batch.error_rows + failed,
      completed_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  return { imported, failed };
}

/**
 * Step 3 (optional): rollback. Only allowed while every question the
 * batch created is still untouched (`status = draft`, `current_version
 * = 1`) — if a reviewer has already published or edited one of them,
 * rollback is refused rather than silently deleting reviewed work.
 */
export async function rollbackImportBatch(batchId: string) {
  const supabase = await createClient();

  const { data: batch, error: batchError } = await supabase
    .from("import_batches")
    .select("*")
    .eq("id", batchId)
    .maybeSingle();
  if (batchError) throw batchError;
  if (!batch) throw new Error("Import batch not found");
  if (batch.status !== "completed") {
    throw new Error(`Batch is "${batch.status}" and cannot be rolled back`);
  }

  const { data: rows, error: rowsError } = await supabase
    .from("import_batch_rows")
    .select("id, question_id")
    .eq("batch_id", batchId)
    .not("question_id", "is", null);
  if (rowsError) throw rowsError;

  const questionIds = (rows ?? []).map((r) => r.question_id).filter((id): id is string => !!id);
  if (questionIds.length === 0) {
    await supabase.from("import_batches").update({ status: "rolled_back" }).eq("id", batchId);
    return { deleted: 0 };
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, status, current_version")
    .in("id", questionIds);
  if (questionsError) throw questionsError;

  const untouched = (questions ?? []).filter((q) => q.status === "draft" && q.current_version === 1);
  if (untouched.length !== (questions ?? []).length) {
    throw new Error(
      "Cannot roll back: some imported questions have already been edited or published since import."
    );
  }

  const { error: deleteError } = await supabase.from("questions").delete().in("id", questionIds);
  if (deleteError) throw deleteError;

  await supabase.from("import_batches").update({ status: "rolled_back" }).eq("id", batchId);
  return { deleted: questionIds.length };
}
