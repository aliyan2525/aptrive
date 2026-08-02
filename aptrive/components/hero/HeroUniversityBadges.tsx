"use client";

import { motion } from "framer-motion";

interface BadgeConfig {
  label: string;
  top: string;
  left: string;
  size: number; // px, both width and height
  floatDuration: number;
  floatDelay: number;
}

// Positions/sizes approximate the reference composition: a large
// badge upper-right, a mid-sized one at the right edge, and two
// smaller ones clustered lower-center — a scattered, not gridded,
// arrangement so they read as "orbiting" rather than a list.
const BADGES: BadgeConfig[] = [
  { label: "NUST", top: "8%", left: "80%", size: 104, floatDuration: 7, floatDelay: 0 },
  { label: "FAST", top: "54%", left: "89%", size: 86, floatDuration: 6, floatDelay: 1.1 },
  { label: "LUMS", top: "75%", left: "58%", size: 78, floatDuration: 7.5, floatDelay: 0.6 },
  { label: "LUMS", top: "88%", left: "76%", size: 70, floatDuration: 6.5, floatDelay: 1.6 },
];

/**
 * Glass "recognized institution" badges — a text abbreviation inside
 * a glassmorphic circle, rather than a reproduced university logo.
 * Real institutional logos are trademarked artwork this decorative
 * composition shouldn't reproduce; the intended reading ("recognized
 * institutions orbit this platform") survives fine as styled text.
 *
 * Gated to `lg` and up for the same reason as HeroOrbitIcons — these
 * are absolutely positioned against the two-column hero layout.
 */
export default function HeroUniversityBadges() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
      {BADGES.map((badge, i) => (
        <motion.div
          key={i}
          className="absolute flex items-center justify-center rounded-full border border-white/70 bg-white/75 text-center font-display font-semibold leading-none text-neutral-700 shadow-[0_12px_40px_-12px_rgba(30,41,59,0.3)] backdrop-blur-xl"
          style={{
            top: badge.top,
            left: badge.left,
            width: badge.size,
            height: badge.size,
            fontSize: badge.size * 0.16,
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: badge.floatDuration,
            delay: badge.floatDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {badge.label}
        </motion.div>
      ))}
    </div>
  );
}
