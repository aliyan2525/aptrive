import { categories } from "@/lib/library-data";

export const siteStats = {
  totalQuestions: categories.reduce((sum, c) => sum + c.totalQuestions, 0),
  practiceSets: categories.reduce((sum, c) => sum + c.practiceSets, 0),
  activeStudents: 500,
  satisfactionRate: 94,
  subjects: categories.filter((c) => !c.comingSoon).length,
} as const;

export function formatStat(n: number): string {
  return n.toLocaleString();
}
