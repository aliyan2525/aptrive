"use client";

import { motion } from "framer-motion";
import {
  Atom,
  Binary,
  BookOpen,
  BrainCircuit,
  Code2,
  FlaskConical,
  FunctionSquare,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

interface OrbitIconConfig {
  Icon: LucideIcon;
  label: string;
  radiusX: number;
  radiusY: number;
  phase: number;
  duration: number;
  size: "sm" | "md" | "lg";
  delay: number;
  tilt: number;
}

const CHIP_SIZE: Record<OrbitIconConfig["size"], string> = {
  sm: "h-9 w-9 rounded-2xl",
  md: "h-12 w-12 rounded-[1.05rem]",
  lg: "h-16 w-16 rounded-[1.35rem]",
};

const ICON_SIZE: Record<OrbitIconConfig["size"], string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

const ORBIT_ICONS: OrbitIconConfig[] = [
  { Icon: BookOpen, label: "Learning", radiusX: 215, radiusY: 132, phase: 220, duration: 24, size: "lg", delay: 0, tilt: -16 },
  { Icon: FunctionSquare, label: "Formula", radiusX: 178, radiusY: 166, phase: 168, duration: 30, size: "sm", delay: 0.3, tilt: 18 },
  { Icon: Code2, label: "Code practice", radiusX: 238, radiusY: 118, phase: 148, duration: 28, size: "md", delay: 0.6, tilt: -28 },
  { Icon: FlaskConical, label: "Chemistry", radiusX: 250, radiusY: 154, phase: 104, duration: 34, size: "md", delay: 0.15, tilt: 24 },
  { Icon: Atom, label: "Physics", radiusX: 214, radiusY: 190, phase: 42, duration: 32, size: "sm", delay: 0.45, tilt: -8 },
  { Icon: BrainCircuit, label: "AI guidance", radiusX: 266, radiusY: 168, phase: 330, duration: 36, size: "md", delay: 0.25, tilt: 14 },
  { Icon: GraduationCap, label: "Admission", radiusX: 230, radiusY: 206, phase: 286, duration: 38, size: "lg", delay: 0.9, tilt: -22 },
  { Icon: Binary, label: "Analytics", radiusX: 162, radiusY: 104, phase: 20, duration: 22, size: "sm", delay: 0.7, tilt: 12 },
];

function orbitPath(config: OrbitIconConfig, offset = 0) {
  return Array.from({ length: 9 }, (_, index) => {
    const angle = ((config.phase + offset + index * 45) * Math.PI) / 180;
    return {
      x: Math.cos(angle) * config.radiusX,
      y: Math.sin(angle) * config.radiusY,
      scale: 0.82 + (Math.sin(angle) + 1) * 0.14,
      opacity: 0.58 + (Math.sin(angle) + 1) * 0.18,
    };
  });
}

export default function HeroOrbitIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2">
        {ORBIT_ICONS.map((config) => {
          const path = orbitPath(config);
          return (
            <motion.div
              key={config.label}
              className={`absolute flex ${CHIP_SIZE[config.size]} items-center justify-center border border-white/65 bg-white/62 text-neutral-700 shadow-[0_18px_42px_-18px_rgba(30,41,59,0.34),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl`}
              style={{ marginLeft: -24, marginTop: -24, rotate: config.tilt }}
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{
                x: path.map((point) => point.x),
                y: path.map((point) => point.y),
                scale: path.map((point) => point.scale),
                opacity: path.map((point) => point.opacity),
                rotate: [config.tilt, config.tilt + 8, config.tilt - 5, config.tilt],
              }}
              transition={{
                duration: config.duration,
                delay: config.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <config.Icon className={ICON_SIZE[config.size]} strokeWidth={1.55} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
