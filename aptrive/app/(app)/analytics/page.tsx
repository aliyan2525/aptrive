"use client";

import * as React from "react";
import { PredictionEngine } from "@/components/analytics/PredictionEngine";
import { SubjectRadar } from "@/components/analytics/SubjectRadar";
import { TrendChart } from "@/components/analytics/TrendChart";
import { AIInsights } from "@/components/analytics/AIInsights";
import { StudyHeatmap } from "@/components/analytics/StudyHeatmap";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const radarData = [
    { subject: "Mathematics", score: 88 },
    { subject: "Physics", score: 72 },
    { subject: "Chemistry", score: 64 },
    { subject: "English", score: 81 },
    { subject: "Intelligence", score: 65 },
  ];

  const trendData = [
    { label: "W1", value: 30 },
    { label: "W2", value: 45 },
    { label: "W3", value: 40 },
    { label: "W4", value: 65 },
    { label: "W5", value: 55 },
    { label: "W6", value: 85 },
  ];

  const insights = [
    "Mathematics is accelerating. Your algebra accuracy improved by 12% over the last six sessions.",
    "Physics needs precision. Revise electromagnetism formulas before attempting the next timed mock.",
    "Readiness is trending up. Two more consistent sessions should lift your blended score meaningfully.",
  ];

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 md:px-8">
      <div className="container-aptrive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h1 className="text-display-2 mb-2">
                Performance <span className="aurora-text">Analytics</span>
              </h1>
              <p className="text-body-lg max-w-2xl">
                Deep intelligence across practice accuracy, pace, and university readiness.
              </p>
            </div>
            <Link
              href="/practice"
              className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--teal)] to-[var(--blue)] px-6 text-sm font-bold text-white shadow-[0_10px_30px_rgba(102,255,255,0.24)] hover:shadow-[0_15px_40px_rgba(102,255,255,0.35)] transition-all"
            >
              Start Practice
              <Zap className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* AI Prediction Widget */}
          <PredictionEngine
            admissionProbability={84}
            estimatedAggregate={78.5}
            readinessScore={72}
          />

          {/* Middle Row: Radar and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubjectRadar data={radarData} />
            <AIInsights insights={insights} />
          </div>

          {/* Bottom Row: Trend and Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TrendChart data={trendData} />
            </div>
            <div className="lg:col-span-1">
              <StudyHeatmap />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
