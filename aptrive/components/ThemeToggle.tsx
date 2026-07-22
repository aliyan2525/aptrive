"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "aptrive-theme";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {
      // ignore
    }
    // fall back to system preference
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // ignore
    }
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
  }, [theme]);

  function toggle() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="pressable h-9 w-9 rounded-sm border border-line bg-panel flex items-center justify-center"
    >
      {theme === "dark" ? (
        // Sun icon for light mode toggle
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" />
          <g stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </g>
        </svg>
      ) : (
        // Moon icon for dark mode toggle
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
