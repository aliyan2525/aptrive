"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import {
  createQuestion,
  updateQuestion,
  setQuestionStatus,
  duplicateQuestion,
  type QuestionFormInput,
} from "@/lib/admin/questions";
import {
  createImportBatch,
  commitImportBatch,
  rollbackImportBatch,
} from "@/lib/admin/import";
import type { QuestionStatus } from "@/lib/database.types";

export type ActionState = { error: string | null };

// -- Questions --------------------------------------------------------

export async function createQuestionAction(input: QuestionFormInput): Promise<ActionState> {
  const staff = await requireStaff();

  let id: string;
  try {
    id = await createQuestion(input, staff.userId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not create question." };
  }

  // redirect() throws internally by design — it must happen outside
  // the try/catch above, or Next.js's own control-flow exception gets
  // swallowed as if it were a real error.
  revalidatePath("/admin/questions");
  redirect(`/admin/questions/${id}/edit?created=1`);
}

export async function updateQuestionAction(
  id: string,
  input: QuestionFormInput
): Promise<ActionState> {
  const staff = await requireStaff();

  try {
    await updateQuestion(id, input, staff.userId);
    revalidatePath("/admin/questions");
    revalidatePath(`/admin/questions/${id}/edit`);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not update question." };
  }

  return { error: null };
}

export async function setQuestionStatusAction(id: string, status: QuestionStatus) {
  await requireStaff();
  await setQuestionStatus(id, status);
  revalidatePath("/admin/questions");
  revalidatePath(`/admin/questions/${id}/edit`);
}

export async function duplicateQuestionAction(id: string) {
  const staff = await requireStaff();
  const newId = await duplicateQuestion(id, staff.userId);
  revalidatePath("/admin/questions");
  redirect(`/admin/questions/${newId}/edit?duplicated=1`);
}

// -- Import -------------------------------------------------------------

export async function uploadImportAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const staff = await requireStaff();

  const file = formData.get("file") as File | null;
  const targetPracticeSetId = String(formData.get("target_practice_set_id") || "");

  if (!file || file.size === 0) {
    return { error: "Choose a CSV file to upload." };
  }
  if (!targetPracticeSetId) {
    return { error: "Choose which practice set these questions belong to." };
  }
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return { error: "Only .csv files are supported right now." };
  }

  const csvText = await file.text();
  if (!csvText.trim()) {
    return { error: "That file appears to be empty." };
  }

  let batchId: string;
  try {
    batchId = await createImportBatch({
      fileName: file.name,
      targetPracticeSetId,
      csvText,
      createdBy: staff.userId,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not validate the file." };
  }

  redirect(`/admin/import/${batchId}`);
}

export async function commitImportBatchAction(batchId: string) {
  const staff = await requireStaff();
  await commitImportBatch(batchId, staff.userId);
  revalidatePath(`/admin/import/${batchId}`);
  revalidatePath("/admin/import");
  revalidatePath("/admin/questions");
}

export async function rollbackImportBatchAction(batchId: string) {
  await requireStaff();
  await rollbackImportBatch(batchId);
  revalidatePath(`/admin/import/${batchId}`);
  revalidatePath("/admin/import");
  revalidatePath("/admin/questions");
}
