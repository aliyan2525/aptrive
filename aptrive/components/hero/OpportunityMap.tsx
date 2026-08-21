"use client";

import Image from "next/image";
import { useState, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import UniversityLogo from "@/components/UniversityLogo";

type UnivNode = {
  id: string;
  name: string;
  path: string;
  loc: string;
  x: number; // Desktop X position relative to center
  y: number; // Desktop Y position relative to center
};

const universities: UnivNode[] = [
  { id: "nust", name: "NUST", path: "NET Â· Engineering", loc: "Islamabad", x: -190, y: -160 },
  { id: "fast", name: "FAST", path: "NU Test Â· Computing", loc: "Multiple campuses", x: 170, y: -180 },
  { id: "lums", name: "LUMS", path: "Undergraduate", loc: "Lahore", x: 230, y: 30 },
  { id: "giki", name: "GIKI", path: "Admission Test", loc: "Topi", x: 130, y: 190 },
  { id: "uet", name: "UET", path: "ECAT", loc: "Lahore", x: -140, y: 210 },
  { id: "comsats", name: "COMSATS", path: "NTS NAT", loc: "Multiple campuses", x: -240, y: 60 },
  { id: "pieas", name: "PIEAS", path: "Admission Test", loc: "Islamabad", x: -20, y: -250 },
  { id: "ned", name: "NED", path: "Pre-Engineering", loc: "Karachi", x: 30, y: 250 },
];

export default function OpportunityMap() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const clipId = useId();
  const prefersReducedMotion = useReducedMotion();

  // If reduced motion is preferred, we use simpler interaction states without drawing/pulsing
  const drawDuration = prefersReducedMotion ? 0 : 1.5;
  const pulseDuration = prefersReducedMotion ? 0 : 3;

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center lg:h-[650px] xl:-ml-12">
      {/* 
        DESKTOP / TABLET VISUALIZATION 
        Hidden on small screens.
      */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center">
        {/* SVG Paths connecting center to nodes */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" 
          viewBox="-400 -400 800 800"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id={`${clipId}-fade`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(20, 184, 166, 0.4)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
            </linearGradient>
          </defs>

          {universities.map((u, i) => {
            const isHovered = hoveredId === u.id;
            const isOtherHovered = hoveredId !== null && !isHovered;
            
            // Draw a smooth cubic bezier from center (0,0) to the node (u.x, u.y)
            const cp1x = u.x * 0.1;
            const cp1y = u.y * 0.8;
            const cp2x = u.x * 0.8;
            const cp2y = u.y * 0.1;
            const pathD = `M 0 0 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${u.x} ${u.y}`;

            return (
              <g key={`path-${u.id}`}>
                {/* Background path line */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={cn(
                    "text-black/[0.04] transition-colors duration-300",
                    isHovered && "text-teal-500/30",
                    isOtherHovered && "opacity-30"
                  )}
                  initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: drawDuration, delay: prefersReducedMotion ? 0 : i * 0.1, ease: "easeInOut" }}
                />
                
                {/* 
                  Intelligence pulse that occasionally runs along the path. 
                  Only visible when not hovering something else. Disabled on reduced motion.
                */}
                {!prefersReducedMotion && (
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={`url(#${clipId}-fade)`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={cn(
                      "transition-opacity duration-300",
                      isOtherHovered ? "opacity-0" : "opacity-100"
                    )}
                    initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 0.2, 0], 
                      pathOffset: [0, 0.8, 1],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: pulseDuration,
                      repeat: Infinity,
                      delay: i * 1.2 + 2, // Staggered delays
                      ease: "linear",
                      repeatDelay: i * 0.75 + 3, // Random pause between pulses
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Aptrive Node */}
        <motion.div 
          className="absolute z-20 flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-[0_8px_32px_-8px_rgba(15,23,42,0.12)] border border-black/[0.04]"
          initial={{ scale: prefersReducedMotion ? 1 : 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-50 to-indigo-50 flex items-center justify-center border border-black/[0.02]">
             <Image src="/logo-mark.png" alt="Aptrive" width={32} height={32} className="h-8 w-8 object-contain" />
          </div>
        </motion.div>

        {/* University Nodes */}
        {universities.map((u, i) => {
          const isHovered = hoveredId === u.id;
          const isOtherHovered = hoveredId !== null && !isHovered;

          return (
            <motion.div
              key={u.id}
              className={cn(
                "absolute z-10 flex flex-col items-center transition-all duration-300",
                isOtherHovered && "opacity-40 grayscale-[0.5]"
              )}
              style={{
                left: `calc(50% + ${u.x}px)`,
                top: `calc(50% + ${u.y}px)`,
                x: "-50%",
                y: "-50%"
              }}
              initial={{ opacity: 0, y: prefersReducedMotion ? "-50%" : "-40%" }}
              animate={{ opacity: 1, y: "-50%" }}
              transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.5 + i * 0.08 }}
              onMouseEnter={() => setHoveredId(u.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* The node dot/card */}
              <div 
                className={cn(
                  "relative flex items-center gap-3 bg-white border border-black/[0.06] rounded-full p-1.5 pr-4 cursor-pointer transition-all duration-300",
                  "hover:shadow-[0_8px_24px_-8px_rgba(20,184,166,0.25)] hover:border-teal-500/30",
                  !prefersReducedMotion && "hover:-translate-y-1"
                )}
              >
                <UniversityLogo university={u.id} displayName={u.name} size={32} className="shadow-none border-black/[0.03] bg-neutral-50 mix-blend-normal" />
                <span className="font-display font-semibold text-sm text-neutral-800 tracking-tight">{u.name}</span>
              </div>

              {/* Hover Tooltip Info Panel */}
              <div 
                className={cn(
                  "absolute top-full mt-3 w-48 bg-white border border-black/[0.06] rounded-2xl p-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.15)] pointer-events-none transition-all duration-300 origin-top",
                  isHovered ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2"
                )}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1">{u.name}</div>
                <div className="text-sm font-medium text-neutral-900 leading-tight mb-1">{u.path}</div>
                <div className="text-xs text-neutral-500 mb-3">{u.loc}</div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600">
                  Explore path <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 
        MOBILE VISUALIZATION 
        A compact vertical layout shown only on small screens.
      */}
      <div className="md:hidden flex flex-col items-center justify-center w-full max-w-sm mx-auto h-full">
        <motion.div 
          className="flex flex-col items-center z-10 bg-white border border-black/[0.06] p-4 rounded-3xl shadow-sm mb-6"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Image src="/logo-mark.png" alt="Aptrive" width={48} height={48} className="mb-2 h-12 w-12 object-contain" />
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Your Path</div>
        </motion.div>

        {/* Vertical line connecting top to the grid */}
        <div className="w-px h-8 bg-gradient-to-b from-teal-500/40 to-transparent -mt-6 mb-4" />

        <div className="grid grid-cols-2 gap-3 w-full px-4">
          {universities.slice(0, 6).map((u, i) => (
            <motion.div 
              key={`mob-${u.id}`}
              className="flex flex-col gap-2 bg-white border border-black/[0.04] rounded-2xl p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)]"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : i * 0.1 + 0.3 }}
            >
              <div className="flex items-center gap-2">
                <UniversityLogo university={u.id} displayName={u.name} size={24} className="shadow-none" />
                <span className="font-display font-semibold text-xs text-neutral-800 truncate">{u.name}</span>
              </div>
              <div className="text-[10px] text-neutral-500 leading-tight truncate">{u.path}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 text-xs text-neutral-400 font-medium">+ multiple other pathways</div>
      </div>
    </div>
  );
}



