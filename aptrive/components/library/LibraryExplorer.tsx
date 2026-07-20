"use client";

import { useMemo, useState } from "react";
import {
  contentTypeLabels,
  difficulties,
  examTags,
  universityTags,
  type ContentType,
  type Difficulty,
  type LibraryResource,
} from "@/lib/library-data";
import ResourceCard from "./ResourceCard";

const contentTypeOptions = Object.entries(contentTypeLabels) as [
  ContentType,
  string
][];

export default function LibraryExplorer({
  resources,
}: {
  resources: LibraryResource[];
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [contentType, setContentType] = useState<ContentType | "all">("all");
  const [university, setUniversity] = useState<string>("all");
  const [examTag, setExamTag] = useState<string>("all");
  const [accessFilter, setAccessFilter] = useState<
    "all" | "free" | "premium"
  >("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (q) {
        const haystack = `${r.title} ${r.topic} ${r.chapter ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (difficulty !== "all" && r.difficulty !== difficulty) return false;
      if (contentType !== "all" && r.contentType !== contentType) return false;
      if (university !== "all" && r.university !== university) return false;
      if (examTag !== "all" && r.examTag !== examTag) return false;
      if (accessFilter === "free" && r.premium) return false;
      if (accessFilter === "premium" && !r.premium) return false;
      return true;
    });
  }, [resources, query, difficulty, contentType, university, examTag, accessFilter]);

  const availableUniversities = useMemo(
    () =>
      universityTags.filter((u) => resources.some((r) => r.university === u)),
    [resources]
  );
  const availableExamTags = useMemo(
    () => examTags.filter((t) => resources.some((r) => r.examTag === t)),
    [resources]
  );

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, topic, or chapter…"
          className="w-full rounded-sm border border-line-strong bg-panel px-4 py-3 text-sm text-fg placeholder:text-muted-2 focus:border-teal/60"
        />
      </div>

      {/* Filter row */}
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value as ContentType | "all")}
          className="rounded-sm border border-line-strong bg-panel px-3 py-2 text-xs text-fg"
        >
          <option value="all">All resource types</option>
          {contentTypeOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | "all")}
          className="rounded-sm border border-line-strong bg-panel px-3 py-2 text-xs text-fg"
        >
          <option value="all">All difficulties</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {availableUniversities.length > 0 && (
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="rounded-sm border border-line-strong bg-panel px-3 py-2 text-xs text-fg"
          >
            <option value="all">All universities</option>
            {availableUniversities.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        )}

        {availableExamTags.length > 0 && (
          <select
            value={examTag}
            onChange={(e) => setExamTag(e.target.value)}
            className="rounded-sm border border-line-strong bg-panel px-3 py-2 text-xs text-fg"
          >
            <option value="all">All entry tests</option>
            {availableExamTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <div className="flex overflow-hidden rounded-sm border border-line-strong">
          {(["all", "free", "premium"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setAccessFilter(opt)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                accessFilter === opt
                  ? "bg-teal text-graphite"
                  : "bg-panel text-muted hover:text-fg"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 flex items-center justify-between">
        <span className="font-mono-data text-xs text-muted-2">
          {filtered.length} of {resources.length} resources
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-md border border-line bg-panel p-10 text-center text-sm text-muted">
          No resources match these filters. Try broadening your search.
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
