import { contentTypeLabels, type LibraryResource } from "@/lib/library-data";
import DifficultyBadge from "./DifficultyBadge";

export default function ResourceCard({
  resource,
}: {
  resource: LibraryResource;
}) {
  return (
    <div className="flex flex-col rounded-md border border-line bg-panel p-5 transition-colors hover:border-teal/40">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-teal">
          {contentTypeLabels[resource.contentType]}
        </span>
        {resource.premium ? (
          <span className="font-mono-data shrink-0 rounded-sm border border-gold/40 bg-gold-dim px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-gold">
            Premium
          </span>
        ) : (
          <span className="font-mono-data shrink-0 rounded-sm border border-line-strong px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
            Free
          </span>
        )}
      </div>

      <h3 className="font-display mt-3 text-base font-semibold leading-snug text-fg">
        {resource.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        {resource.university && <span>{resource.university}</span>}
        {resource.examTag && (
          <>
            <span className="text-muted-2">·</span>
            <span>{resource.examTag}</span>
          </>
        )}
        <span className="text-muted-2">·</span>
        <span>{resource.topic}</span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <DifficultyBadge difficulty={resource.difficulty} />
        {resource.solved && (
          <span className="font-mono-data text-[10px] uppercase tracking-[0.12em] text-muted-2">
            Solved
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted-2">
        <span className="font-mono-data">
          {resource.questionCount > 0
            ? `${resource.questionCount} questions`
            : "Reference material"}
        </span>
        <span className="font-mono-data">~{resource.estimatedMinutes} min</span>
      </div>

      <button className="mt-4 rounded-sm border border-teal/40 bg-teal-dim py-2 text-sm font-medium text-teal transition-colors hover:bg-teal hover:text-graphite">
        Open
      </button>
    </div>
  );
}
