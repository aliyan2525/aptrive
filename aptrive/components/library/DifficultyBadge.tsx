import type { Difficulty } from "@/lib/library-data";

const styles: Record<Difficulty, string> = {
  Easy: "border-teal/40 bg-teal-dim text-teal",
  Medium: "border-gold/40 bg-gold-dim text-gold",
  Hard: "border-red-400/40 bg-red-400/10 text-red-300",
};

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty;
}) {
  return (
    <span
      className={`font-mono-data inline-block rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
