"use client";

import * as React from "react";
import { FeaturedTest } from "@/components/mock-tests/FeaturedTest";
import { TestFilters } from "@/components/mock-tests/TestFilters";
import { TestList } from "@/components/mock-tests/TestList";
import { TestHistory } from "@/components/mock-tests/TestHistory";
import { TestCardProps } from "@/components/mock-tests/TestCard";
import { motion } from "framer-motion";

// Mock Data Adapter for AI Prediction Engine
const MOCK_TESTS: TestCardProps[] = [
  {
    id: "nust-net-1",
    university: "NUST",
    examType: "NET Engineering",
    duration: 180,
    questions: 200,
    difficulty: "Hard",
    estimatedScore: 142,
    aiRecommendation: "Focus on Conic Sections and Electromagnetism to boost score.",
    isNew: true,
  },
  {
    id: "fast-nu-1",
    university: "FAST NU",
    examType: "Computing",
    duration: 120,
    questions: 100,
    difficulty: "Medium",
    estimatedScore: 72,
    aiRecommendation: "Solid math basics, needs speed improvement in IQ section.",
  },
  {
    id: "lums-sbasse-1",
    university: "LUMS",
    examType: "SBASSE Scientific",
    duration: 100,
    questions: 80,
    difficulty: "Hard",
    estimatedScore: 58,
    aiRecommendation: "Review Advanced Chemistry concepts before attempting.",
  },
  {
    id: "giki-1",
    university: "GIKI",
    examType: "Engineering",
    duration: 120,
    questions: 120,
    difficulty: "Medium",
    estimatedScore: 85,
    aiRecommendation: "Great physics foundation, optimize time per question.",
  },
];

export default function PracticePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterUniversity, setFilterUniversity] = React.useState("");

  const filteredTests = React.useMemo(() => {
    return MOCK_TESTS.filter((test) => {
      const matchesSearch = test.university.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            test.examType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUni = filterUniversity ? test.university === filterUniversity : true;
      return matchesSearch && matchesUni;
    });
  }, [searchQuery, filterUniversity]);

  const handleStartFeatured = () => {
    console.log("Starting featured test...");
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 md:px-8">
      <div className="container-aptrive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <header className="mb-12">
            <h1 className="text-display-2 mb-4">
              Mock <span className="aurora-text">Tests</span>
            </h1>
            <p className="text-body-lg max-w-2xl">
              AI-generated, dynamically scaled mock tests based on your performance. Predict your actual exam scores before test day.
            </p>
          </header>

          <FeaturedTest
            university="NUST"
            examType="NET Engineering"
            predictedPercentile={88}
            description="Your AI model suggests taking a full-length NET mock today. Your recent physics accuracy has improved by 14%."
            onStart={handleStartFeatured}
          />

          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-semibold text-[var(--fg)]">Available Tests</h2>
            </div>
            
            <TestFilters 
              onSearch={setSearchQuery}
              onFilterChange={(type, val) => {
                if (type === "university") setFilterUniversity(val);
              }}
            />
            
            <TestList tests={filteredTests} />
          </section>

          <section>
            <TestHistory />
          </section>
        </motion.div>
      </div>
    </main>
  );
}
