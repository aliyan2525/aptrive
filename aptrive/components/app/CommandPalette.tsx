"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, BookOpen, Brain, Gauge, GraduationCap, Search, Settings, Target, Trophy, X } from "lucide-react";

const commands = [
  { href: "/dashboard", title: "Mission Control", group: "Navigation", keywords: "dashboard home overview", icon: Gauge },
  { href: "/practice", title: "Start Practice", group: "Study", keywords: "questions session test", icon: Brain },
  { href: "/practice/subjects", title: "Browse Subjects", group: "Study", keywords: "topics math physics chemistry", icon: Target },
  { href: "/practice/revision", title: "Revision Queue", group: "Study", keywords: "review mistakes weak topics", icon: BookOpen },
  { href: "/materials", title: "Library", group: "Resources", keywords: "notes videos concepts", icon: BookOpen },
  { href: "/leaderboard", title: "Rankings", group: "Progress", keywords: "leaderboard rank score", icon: Trophy },
  { href: "/goals", title: "Goals", group: "Planning", keywords: "goals streak target progress", icon: Target },
  { href: "/analytics", title: "Analytics", group: "Progress", keywords: "analytics insights charts performance", icon: BarChart3 },
  { href: "/settings", title: "Settings", group: "Account", keywords: "settings appearance notifications profile", icon: Settings },
  { href: "/onboarding", title: "University Target", group: "Planning", keywords: "university target personalize", icon: GraduationCap },
  { href: "/profile", title: "Profile Settings", group: "Account", keywords: "account profile settings", icon: Gauge },
];

export default function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(true);
      }
      if (event.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((item) =>
      `${item.title} ${item.group} ${item.keywords}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#07102e]/28 p-4 backdrop-blur-sm" role="presentation" onMouseDown={() => onOpenChange(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Aptrive command center"
        className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-[1.35rem] border border-white/60 bg-white/88 shadow-[0_36px_120px_rgba(15,28,70,0.28)] backdrop-blur-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#e6ebf7] px-5 py-4">
          <Search className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search routes, topics, practice, goals..."
            className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#111a3a] outline-none placeholder:text-[#7a86aa]"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid h-9 w-9 place-items-center rounded-full text-[#657199] transition hover:bg-[#eef3ff] hover:text-[#111a3a]"
            aria-label="Close command center"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[28rem] overflow-y-auto p-3">
          {results.length ? (
            results.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="group flex items-center gap-4 rounded-[1rem] px-4 py-3 transition hover:bg-[#f1f5ff]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-[0.85rem] bg-white text-blue-600 shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#111a3a]">{item.title}</span>
                    <span className="block text-xs font-semibold text-[#7a86aa]">{item.group}</span>
                  </span>
                  <span className="ml-auto text-xs font-bold text-[#8a95b8] opacity-0 transition group-hover:opacity-100">Open</span>
                </Link>
              );
            })
          ) : (
            <div className="grid place-items-center px-6 py-12 text-center">
              <p className="font-display text-lg font-bold text-[#111a3a]">No matches yet</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#657199]">
                Try searching for practice, library, rankings, goals, or your university target.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
