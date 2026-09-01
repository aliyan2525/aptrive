import { describe, it, expect } from "vitest";
import { estimateNustAdmissionChance } from "@/lib/merit-chance";
import type { NustProgram } from "@/lib/nust-programs";

const mockProgram: NustProgram = {
  code: "SEECS-S605",
  name: "Bachelor of Software Engineering",
  school: "SEECS",
  category: "Engineering Program",
  topMerit: { merit: 6, netMarks: 170, cummAggregate: 86.77922 },
  lastMerit: { merit: 846, netMarks: 140, cummAggregate: 75.17727 },
};

describe("estimateNustAdmissionChance", () => {
  it("should estimate 'very-high' chance when margin is >= 1.5 points above cutoff", () => {
    const result = estimateNustAdmissionChance(77.0, mockProgram);
    expect(result.chance).toBe("very-high");
    expect(result.label).toBe("Very High");
    expect(result.margin).toBe(1.82);
    expect(result.description).toContain("1.82 points above");
  });

  it("should estimate 'high' chance when margin is between 0.5 and 1.5 points", () => {
    const result = estimateNustAdmissionChance(76.0, mockProgram);
    expect(result.chance).toBe("high");
    expect(result.label).toBe("High");
    expect(result.margin).toBe(0.82);
  });

  it("should estimate 'moderate' chance when margin is between 0 and 0.5 points", () => {
    const result = estimateNustAdmissionChance(75.3, mockProgram);
    expect(result.chance).toBe("moderate");
    expect(result.label).toBe("Moderate");
  });

  it("should estimate 'low' chance when margin is between -1.5 and 0 points", () => {
    const result = estimateNustAdmissionChance(74.5, mockProgram);
    expect(result.chance).toBe("low");
    expect(result.label).toBe("Low");
    expect(result.description).toContain("below");
  });

  it("should estimate 'very-low' chance when margin is below -1.5 points", () => {
    const result = estimateNustAdmissionChance(70.0, mockProgram);
    expect(result.chance).toBe("very-low");
    expect(result.label).toBe("Very Low");
  });
});
