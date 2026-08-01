import { contentTypeLabels, type LibraryResource } from "@/lib/library-data";
import DifficultyBadge from "./DifficultyBadge";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, FileText, CheckCircle2 } from "lucide-react";

export default function ResourceCard({
  resource,
  index = 0,
}: {
  resource: LibraryResource;
  index?: number;
}) {
  const isVideo = resource.contentType === "video";
  const Icon = isVideo ? PlayCircle : FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 hover:border-line-strong cursor-pointer">
        {/* Soft Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none mix-blend-plus-lighter dark:mix-blend-overlay" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-teal" />
            <span className="font-mono-data text-[10px] uppercase tracking-[0.14em] text-teal">
              {contentTypeLabels[resource.contentType]}
            </span>
          </div>
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

        <h3 className="font-display mt-4 text-lg font-semibold leading-snug text-fg group-hover:text-teal transition-colors">
          {resource.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted relative z-10">
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

        <div className="mt-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <DifficultyBadge difficulty={resource.difficulty} />
            {resource.solved && (
              <div className="flex items-center gap-1 text-teal">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="font-mono-data text-[10px] uppercase tracking-[0.12em]">
                  Solved
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex-1" />

        <div className="mt-4 flex items-center justify-between border-t border-line/40 pt-4 text-xs text-muted-2 relative z-10">
          <span className="font-mono-data font-medium text-fg">
            {resource.questionCount > 0
              ? `${resource.questionCount} questions`
              : "Reference material"}
          </span>
          <div className="flex items-center gap-4">
            <span className="font-mono-data">~{resource.estimatedMinutes} min</span>
            <ArrowRight className="h-4 w-4 text-teal opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 -ml-2 group-hover:ml-0" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
