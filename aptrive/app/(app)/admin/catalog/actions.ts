"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/admin/auth";
import {
  parseOrThrow,
  universitySchema,
  testSchema,
  chapterSchema,
  topicSchema,
  subtopicSchema,
} from "@/lib/validation/catalog";

// FIXED 2026-07-29: every delete below used to just `if (error) throw
// error`, letting a raw Postgres foreign-key-violation error (code
// 23503) bubble straight into app/admin/error.tsx's generic "Something
// went wrong" screen — confirmed live: `questions.chapter_id`,
// `questions.topic_id`, and `questions.subtopic_id` are all `ON DELETE
// RESTRICT`, so deleting a chapter/topic/subtopic that still has
// questions attached always hits this. This helper turns that specific
// case into a message that tells the admin exactly what's blocking the
// delete and how many rows are involved, instead of a raw exception.
async function deleteOrExplain(params: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  table: "universities" | "tests" | "chapters" | "topics" | "subtopics";
  id: string;
  entityLabel: string;
  dependentTable: "tests" | "questions";
  dependentColumn: string;
}) {
  const { supabase, table, id, entityLabel, dependentTable, dependentColumn } = params;
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      const { count } = await supabase
        .from(dependentTable)
        .select("id", { count: "exact", head: true })
        .eq(dependentColumn, id);
      const n = count ?? 0;
      throw new Error(
        n > 0
          ? `Can't delete this ${entityLabel} — ${n} ${dependentTable} record${n === 1 ? "" : "s"} still reference${n === 1 ? "s" : ""} it. Reassign or delete ${n === 1 ? "it" : "them"} first.`
          : `Can't delete this ${entityLabel} — other records still reference it.`
      );
    }
    throw error;
  }
}

// -- Universities ----------------------------------------------------
export async function createUniversity(name: string, slug: string, logoUrl?: string, description?: string) {
  await requireStaff();
  const input = parseOrThrow(universitySchema, { name, slug, logoUrl, description });
  const supabase = await createClient();
    const { error } = await supabase.from("universities").insert({
    name: input.name,
    slug: input.slug,
    logo_url: input.logoUrl,
    description: input.description,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateUniversity(id: string, name: string, slug: string, logoUrl?: string, description?: string) {
  await requireStaff();
  const input = parseOrThrow(universitySchema, { name, slug, logoUrl, description });
  const supabase = await createClient();
    const { error } = await supabase.from("universities").update({
    name: input.name,
    slug: input.slug,
    logo_url: input.logoUrl,
    description: input.description,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteUniversity(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await deleteOrExplain({
    supabase,
    table: "universities",
    id,
    entityLabel: "university",
    dependentTable: "tests",
    dependentColumn: "university_id",
  });
  revalidatePath("/admin/catalog");
}

// -- Tests -----------------------------------------------------------
export async function createTest(universityId: string | null, name: string, slug: string, description?: string) {
  await requireStaff();
  const input = parseOrThrow(testSchema, { universityId, name, slug, description });
  const supabase = await createClient();
    const { error } = await supabase.from("tests").insert({
    university_id: input.universityId,
    name: input.name,
    slug: input.slug,
    description: input.description,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateTest(id: string, universityId: string | null, name: string, slug: string, description?: string) {
  await requireStaff();
  const input = parseOrThrow(testSchema, { universityId, name, slug, description });
  const supabase = await createClient();
    const { error } = await supabase.from("tests").update({
    university_id: input.universityId,
    name: input.name,
    slug: input.slug,
    description: input.description,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteTest(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await deleteOrExplain({
    supabase,
    table: "tests",
    id,
    entityLabel: "test",
    dependentTable: "questions",
    dependentColumn: "test_id",
  });
  revalidatePath("/admin/catalog");
}

// -- Chapters --------------------------------------------------------
export async function createChapter(subjectId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const input = parseOrThrow(chapterSchema, { subjectId, name, slug, orderIndex });
  const supabase = await createClient();
    const { error } = await supabase.from("chapters").insert({
    subject_id: input.subjectId,
    name: input.name,
    slug: input.slug,
    order_index: input.orderIndex,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateChapter(id: string, subjectId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const input = parseOrThrow(chapterSchema, { subjectId, name, slug, orderIndex });
  const supabase = await createClient();
    const { error } = await supabase.from("chapters").update({
    subject_id: input.subjectId,
    name: input.name,
    slug: input.slug,
    order_index: input.orderIndex,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteChapter(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await deleteOrExplain({
    supabase,
    table: "chapters",
    id,
    entityLabel: "chapter",
    dependentTable: "questions",
    dependentColumn: "chapter_id",
  });
  revalidatePath("/admin/catalog");
}

// -- Topics ----------------------------------------------------------
export async function createTopic(chapterId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const input = parseOrThrow(topicSchema, { chapterId, name, slug, orderIndex });
  const supabase = await createClient();
    const { error } = await supabase.from("topics").insert({
    chapter_id: input.chapterId,
    name: input.name,
    slug: input.slug,
    order_index: input.orderIndex,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateTopic(id: string, chapterId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const input = parseOrThrow(topicSchema, { chapterId, name, slug, orderIndex });
  const supabase = await createClient();
    const { error } = await supabase.from("topics").update({
    chapter_id: input.chapterId,
    name: input.name,
    slug: input.slug,
    order_index: input.orderIndex,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteTopic(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await deleteOrExplain({
    supabase,
    table: "topics",
    id,
    entityLabel: "topic",
    dependentTable: "questions",
    dependentColumn: "topic_id",
  });
  revalidatePath("/admin/catalog");
}

// -- Subtopics -------------------------------------------------------
export async function createSubtopic(topicId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const input = parseOrThrow(subtopicSchema, { topicId, name, slug, orderIndex });
  const supabase = await createClient();
    const { error } = await supabase.from("subtopics").insert({
    topic_id: input.topicId,
    name: input.name,
    slug: input.slug,
    order_index: input.orderIndex,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateSubtopic(id: string, topicId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const input = parseOrThrow(subtopicSchema, { topicId, name, slug, orderIndex });
  const supabase = await createClient();
    const { error } = await supabase.from("subtopics").update({
    topic_id: input.topicId,
    name: input.name,
    slug: input.slug,
    order_index: input.orderIndex,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteSubtopic(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await deleteOrExplain({
    supabase,
    table: "subtopics",
    id,
    entityLabel: "subtopic",
    dependentTable: "questions",
    dependentColumn: "subtopic_id",
  });
  revalidatePath("/admin/catalog");
}
