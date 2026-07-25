import type { NustProgram } from "@/lib/nust-programs";

export type AdmissionChance = "very-low" | "low" | "moderate" | "high" | "very-high";

export type ChanceResult = {
  chance: AdmissionChance;
  label: string;
  /** userAggregate - lastMerit.cummAggregate, in percentage points */
  margin: number;
  description: string;
};

const CHANCE_LABELS: Record<AdmissionChance, string> = {
  "very-low": "Very Low",
  low: "Low",
  moderate: "Moderate",
  high: "High",
  "very-high": "Very High",
};

/**
 * Estimates admission chance for a NUST program by comparing the
 * user's calculated aggregate against that program's *last* year's
 * closing merit (the lowest aggregate that was actually admitted).
 *
 * Bands step in 0.5-point margins above/below that cutoff. This is a
 * heuristic, not a probability model — cutoffs move every cycle, and
 * a healthy margin above last year's line is not a guarantee.
 */
export function estimateNustAdmissionChance(
  userAggregate: number,
  program: NustProgram
): ChanceResult {
  const margin = userAggregate - program.lastMerit.cummAggregate;

  let chance: AdmissionChance;
  if (margin < -1.5) chance = "very-low";
  else if (margin < 0) chance = "low";
  else if (margin < 0.5) chance = "moderate";
  else if (margin < 1.5) chance = "high";
  else chance = "very-high";

  const roundedMargin = Math.round(margin * 100) / 100;
  const direction = margin >= 0 ? "above" : "below";
  const description = `${Math.abs(roundedMargin).toFixed(2)} points ${direction} last cycle's closing merit for ${program.name} (${program.lastMerit.cummAggregate.toFixed(2)}%).`;

  return { chance, label: CHANCE_LABELS[chance], margin: roundedMargin, description };
}

export const CHANCE_COLORS: Record<AdmissionChance, string> = {
  "very-low": "var(--danger)",
  low: "var(--warning)",
  moderate: "var(--gold)",
  high: "var(--success)",
  "very-high": "var(--teal)",
};
