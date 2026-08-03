"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { LiquidGlassCard } from "../ui/LiquidGlassCard";

interface FilterOption {
  label: string;
  value: string;
}

interface TestFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (type: string, value: string) => void;
}

export const TestFilters = ({ onSearch, onFilterChange }: TestFiltersProps) => {
  const categories = ["All", "NUST", "FAST", "GIKI", "PIEAS", "LUMS"];
  const [activeCategory, setActiveCategory] = React.useState("All");

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    onFilterChange("university", cat === "All" ? "" : cat);
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search mock tests..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-[var(--panel-2)] border border-[var(--line)] rounded-2xl py-3 pl-12 pr-4 text-[var(--fg)] placeholder-[var(--muted-2)] focus:outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all"
          />
        </div>

        {/* Categories */}
        <LiquidGlassCard intensity="low" className="flex-1 w-full flex items-center gap-2 p-2 overflow-x-auto no-scrollbar rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                activeCategory === cat
                  ? "bg-[var(--teal)] text-white shadow-md shadow-[var(--teal)]/20"
                  : "text-[var(--muted)] hover:bg-[var(--line)] hover:text-[var(--fg)]"
              )}
            >
              {cat}
            </button>
          ))}
          <div className="flex-1" />
          <button className="flex items-center gap-2 px-4 py-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors rounded-xl hover:bg-[var(--line)]">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </LiquidGlassCard>
      </div>
    </div>
  );
};
