import { describe, it, expect } from "vitest";
import {
  universitySchema,
  testSchema,
  chapterSchema,
  parseOrThrow,
} from "./catalog";

describe("universitySchema", () => {
  it("accepts valid input and normalizes blank optional fields to null", () => {
    const result = universitySchema.parse({
      name: "MIT",
      slug: "mit",
      logoUrl: "",
      description: undefined,
    });
    expect(result).toEqual({ name: "MIT", slug: "mit", logoUrl: null, description: null });
  });

  it("rejects an empty name", () => {
    expect(universitySchema.safeParse({ name: "  ", slug: "mit" }).success).toBe(false);
  });

  it("rejects a slug with spaces or uppercase letters", () => {
    expect(universitySchema.safeParse({ name: "MIT", slug: "M I T" }).success).toBe(false);
  });

  it("rejects a slug with underscores", () => {
    expect(universitySchema.safeParse({ name: "MIT", slug: "m_i_t" }).success).toBe(false);
  });

  it("accepts a well-formed logo URL", () => {
    const result = universitySchema.parse({
      name: "MIT",
      slug: "mit",
      logoUrl: "https://example.com/logo.png",
    });
    expect(result.logoUrl).toBe("https://example.com/logo.png");
  });

  it("rejects a malformed logo URL", () => {
    expect(
      universitySchema.safeParse({ name: "MIT", slug: "mit", logoUrl: "not-a-url" }).success
    ).toBe(false);
  });

  it("rejects a name over 200 characters", () => {
    expect(
      universitySchema.safeParse({ name: "a".repeat(201), slug: "mit" }).success
    ).toBe(false);
  });
});

describe("testSchema", () => {
  it("treats an empty universityId as null (test not tied to a university)", () => {
    const result = testSchema.parse({ universityId: "", name: "Entry Test", slug: "entry-test" });
    expect(result.universityId).toBeNull();
  });

  it("rejects a universityId that isn't a valid uuid", () => {
    expect(
      testSchema.safeParse({ universityId: "not-a-uuid", name: "Entry Test", slug: "entry-test" })
        .success
    ).toBe(false);
  });
});

describe("chapterSchema", () => {
  it("requires subjectId to be a valid uuid", () => {
    expect(
      chapterSchema.safeParse({
        subjectId: "not-a-uuid",
        name: "Algebra",
        slug: "algebra",
        orderIndex: 0,
      }).success
    ).toBe(false);
  });

  it("rejects a negative orderIndex", () => {
    expect(
      chapterSchema.safeParse({
        subjectId: "00000000-0000-0000-0000-000000000000",
        name: "Algebra",
        slug: "algebra",
        orderIndex: -1,
      }).success
    ).toBe(false);
  });

  it("rejects a non-integer orderIndex", () => {
    expect(
      chapterSchema.safeParse({
        subjectId: "00000000-0000-0000-0000-000000000000",
        name: "Algebra",
        slug: "algebra",
        orderIndex: 1.5,
      }).success
    ).toBe(false);
  });
});

describe("parseOrThrow", () => {
  it("returns the parsed data on success", () => {
    const result = parseOrThrow(universitySchema, { name: "MIT", slug: "mit" });
    expect(result.name).toBe("MIT");
  });

  it("throws a plain Error with the first validation message on failure", () => {
    expect(() => parseOrThrow(universitySchema, { name: "", slug: "mit" })).toThrow(
      "Name is required"
    );
  });
});
