import { z } from "zod";

/**
 * Shared validation for the admin catalog actions (createUniversity,
 * createChapter, createTopic, createSubtopic, etc. — app/admin/catalog/actions.ts).
 *
 * Before this, those actions took raw strings straight into an insert/update
 * with no length or format checks (unlike app/contact/actions.ts, which
 * validates by hand). This gives them the same bar, but as one shared set
 * of field schemas instead of duplicating checks per action.
 *
 * Kept deliberately permissive on content (this is trusted staff input
 * behind requireStaff(), not public input) — the point is catching
 * accidental bad data (empty names, multi-KB pastes into a text field,
 * a slug with spaces that breaks routing), not defending against a
 * hostile admin.
 */

const name = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(200, "Name must be 200 characters or fewer");

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(200, "Slug must be 200 characters or fewer")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers, and hyphens only (e.g. \"linear-algebra\")"
  );

// Optional free-text fields: blank input from a form (empty string) should
// mean "not set", matching the `|| null` the actions did before.
const optionalText = (maxLength: number, label: string) =>
  z
    .string()
    .trim()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer`)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

const description = optionalText(2000, "Description");

const logoUrl = z
  .string()
  .trim()
  .max(2000, "Logo URL must be 2000 characters or fewer")
  .url("Logo URL must be a valid URL")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

const orderIndex = z
  .number()
  .int("Order must be a whole number")
  .min(0, "Order can't be negative")
  .max(100_000, "Order is too large");

const id = z.string().uuid("Invalid id");
const optionalId = z
  .string()
  .uuid("Invalid id")
  .optional()
  .or(z.literal(""))
  .or(z.null())
  .transform((v) => (v ? v : null));

export const universitySchema = z.object({
  name,
  slug,
  logoUrl,
  description,
});

export const testSchema = z.object({
  universityId: optionalId,
  name,
  slug,
  description,
});

export const chapterSchema = z.object({
  subjectId: id,
  name,
  slug,
  orderIndex,
});

export const topicSchema = z.object({
  chapterId: id,
  name,
  slug,
  orderIndex,
});

export const subtopicSchema = z.object({
  topicId: id,
  name,
  slug,
  orderIndex,
});

/**
 * Parses `input` with `schema`; on failure throws a plain Error with the
 * first validation issue's message, which app/admin/error.tsx already
 * surfaces to the admin (same pattern deleteOrExplain() uses for
 * FK-violation errors below).
 */
export function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid input");
  }
  return result.data;
}
