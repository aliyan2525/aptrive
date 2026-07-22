"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/admin/auth";

// -- Universities ----------------------------------------------------
export async function createUniversity(name: string, slug: string, logoUrl?: string, description?: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("universities") as any).insert({
    name,
    slug,
    logo_url: logoUrl || null,
    description: description || null,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateUniversity(id: string, name: string, slug: string, logoUrl?: string, description?: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("universities") as any).update({
    name,
    slug,
    logo_url: logoUrl || null,
    description: description || null,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteUniversity(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("universities").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

// -- Tests -----------------------------------------------------------
export async function createTest(universityId: string | null, name: string, slug: string, description?: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("tests") as any).insert({
    university_id: universityId || null,
    name,
    slug,
    description: description || null,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateTest(id: string, universityId: string | null, name: string, slug: string, description?: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("tests") as any).update({
    university_id: universityId || null,
    name,
    slug,
    description: description || null,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteTest(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("tests").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

// -- Chapters --------------------------------------------------------
export async function createChapter(subjectId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("chapters") as any).insert({
    subject_id: subjectId,
    name,
    slug,
    order_index: orderIndex,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateChapter(id: string, subjectId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("chapters") as any).update({
    subject_id: subjectId,
    name,
    slug,
    order_index: orderIndex,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteChapter(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("chapters").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

// -- Topics ----------------------------------------------------------
export async function createTopic(chapterId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("topics") as any).insert({
    chapter_id: chapterId,
    name,
    slug,
    order_index: orderIndex,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateTopic(id: string, chapterId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("topics") as any).update({
    chapter_id: chapterId,
    name,
    slug,
    order_index: orderIndex,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteTopic(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("topics").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

// -- Subtopics -------------------------------------------------------
export async function createSubtopic(topicId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("subtopics") as any).insert({
    topic_id: topicId,
    name,
    slug,
    order_index: orderIndex,
  });
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function updateSubtopic(id: string, topicId: string, name: string, slug: string, orderIndex: number) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await (supabase.from("subtopics") as any).update({
    topic_id: topicId,
    name,
    slug,
    order_index: orderIndex,
  }).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}

export async function deleteSubtopic(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("subtopics").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/catalog");
}
