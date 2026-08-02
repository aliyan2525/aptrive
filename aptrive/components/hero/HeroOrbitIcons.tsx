"use client";

import { motion } from "framer-motion";
import { BookOpen, Code2, GraduationCap, Gem, Atom, type LucideIcon } from "lucide-react";

interface OrbitIconConfig {
  Icon: LucideIcon;
  top: string;
  left: string;
  size: "sm" | "md" | "lg";
  floatDuration: number;
  floatDelay: number;
  floatDistance: number;
}

const CHIP_SIZE: Record<OrbitIconConfig["size"], string> = {
  sm: "h-9 w-9 rounded-xl",
  md: "h-12 w-12 rounded-2xl",
  lg: "h-16 w-16 rounded-2xl",
};

const ICON_SIZE: Record<OrbitIconConfig["size"], string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

// Positions are percentages of the Hero's right-column bounding box,
// matching the reference composition's layout: book upper-left, code
// + graduation cap trailing down the left edge, small gem near the
// core, three molecule/AI-node clusters scattered upper- and
// mid-right.
const ORBIT_ICONS: OrbitIconConfig[] = [
  { Icon: BookOpen, top: "8%", left: "8%", size: "lg", floatDuration: 7, floatDelay: 0, floatDistance: 14 },
  { Icon: Code2, top: "45%", left: "5%", size: "md", floatDuration: 6, floatDelay: 0.8, floatDistance: 10 },
  { Icon: GraduationCap, top: "64%", left: "1%", size: "lg", floatDuration: 8, floatDelay: 1.4, floatDistance: 16 },
  { Icon: Gem, top: "29%", left: "5%", size: "sm", floatDuration: 5, floatDelay: 0.4, floatDistance: 8 },
  { Icon: Atom, top: "6%", left: "54%", size: "sm", floatDuration: 6.5, floatDelay: 1.1, floatDistance: 10 },
  { Icon: Atom, top: "28%", left: "79%", size: "md", floatDuration: 7.5, floatDelay: 0.2, floatDistance: 12 },
  { Icon: Atom, top: "61%", left: "89%", size: "sm", floatDuration: 6, floatDelay: 1.8, floatDistance: 9 },
];

/**
 * Frosted-glass "knowledge fragment" chips orbiting the planet — an
 * HTML/CSS overlay rather than modeled 3D geometry, so a book / code /
 * graduation cap / molecule read instantly and crisply (a lucide
 * glyph inside a glass chip) instead of an abstracted low-poly shape
 * a viewer has to guess at. Each chip only bobs independently — a
 * static composition with gentle per-object float, matching the
 * reference image rather than a spinning carousel.
 *
 * Only shown at the `lg` breakpoint and up, same as the two-column
 * hero grid itself (`lg:grid-cols-...` in page.tsx) — below that the
 * right column sits full-width under the copy, where these absolutely
 * positioned chips would overlap the headline instead of framing the
 * planet.
 */
export default function HeroOrbitIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
      {ORBIT_ICONS.map((config, i) => (
        <motion.div
          key={i}
          className={`absolute flex ${CHIP_SIZE[config.size]} items-center justify-center border border-white/60 bg-white/70 text-neutral-700 shadow-[0_8px_30px_-8px_rgba(30,41,59,0.25)] backdrop-blur-xl`}
          style={{ top: config.top, left: config.left }}
          animate={{ y: [0, -config.floatDistance, 0] }}
          transition={{
            duration: config.floatDuration,
            delay: config.floatDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <config.Icon className={ICON_SIZE[config.size]} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}
