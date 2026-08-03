import * as React from "react";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";
import { History, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

interface HistoryItem {
  id: string;
  date: string;
  university: string;
  score: number;
  maxScore: number;
  percentile: number;
  trend: "up" | "down" | "flat";
}

export const TestHistory = () => {
  const history: HistoryItem[] = [
    { id: "1", date: "Today", university: "NUST NET", score: 145, maxScore: 200, percentile: 92, trend: "up" },
    { id: "2", date: "Yesterday", university: "FAST NU", score: 68, maxScore: 100, percentile: 85, trend: "down" },
    { id: "3", date: "Oct 12", university: "NUST NET", score: 130, maxScore: 200, percentile: 78, trend: "up" },
  ];

  return (
    <LiquidGlassCard intensity="low" className="p-6 md:p-8 mt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--panel)] flex items-center justify-center border border-[var(--line)] shadow-sm">
          <History className="w-5 h-5 text-[var(--teal)]" />
        </div>
        <div>
          <h3 className="text-xl font-display font-semibold text-[var(--fg)]">Performance History</h3>
          <p className="text-sm text-[var(--muted)]">Your recent test attempts and score progression.</p>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar -mx-6 md:mx-0 px-6 md:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--line-strong)] text-xs uppercase tracking-wider text-[var(--muted-2)]">
              <th className="pb-4 font-medium">Date</th>
              <th className="pb-4 font-medium">Test</th>
              <th className="pb-4 font-medium text-right">Score</th>
              <th className="pb-4 font-medium text-right">Percentile</th>
              <th className="pb-4 font-medium text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[var(--fg)]">
            {history.map((item) => (
              <tr key={item.id} className="border-b border-[var(--line)]/50 last:border-0 hover:bg-[var(--line)]/20 transition-colors">
                <td className="py-4 text-[var(--muted)]">{item.date}</td>
                <td className="py-4 font-medium">{item.university}</td>
                <td className="py-4 text-right">
                  <span className="font-bold">{item.score}</span>
                  <span className="text-[var(--muted-2)]">/{item.maxScore}</span>
                </td>
                <td className="py-4 text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--panel-2)] border border-[var(--line)]">
                    <span className="font-semibold aurora-text">{item.percentile}</span>
                    <span className="text-[10px] text-[var(--muted-2)]">PR</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end">
                    {item.trend === "up" && <TrendingUp className="w-4 h-4 text-[var(--success)]" />}
                    {item.trend === "down" && <TrendingDown className="w-4 h-4 text-[var(--danger)]" />}
                    {item.trend === "flat" && <Minus className="w-4 h-4 text-[var(--muted)]" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LiquidGlassCard>
  );
};
