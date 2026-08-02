"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 37) % 86)}%`,
  top: `${6 + ((index * 29) % 78)}%`,
  size: 1 + (index % 4) * 0.6,
  duration: 8 + (index % 7),
  delay: (index % 9) * 0.35,
}));

export default function HeroAtmosphere() {
  return (
    <div className="pointer-events-none absolute -inset-x-24 -inset-y-12 z-40 hidden overflow-visible lg:block" aria-hidden="true">
      <div className="absolute left-[44%] top-[8%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.34),rgba(125,211,252,0.12)_38%,transparent_70%)] blur-2xl" />
      <div className="absolute left-[62%] top-[22%] h-[360px] w-px rotate-[22deg] bg-gradient-to-b from-transparent via-white/45 to-transparent blur-[0.4px]" />
      <div className="absolute left-[72%] top-[10%] h-[420px] w-px rotate-[35deg] bg-gradient-to-b from-transparent via-cyan-200/28 to-transparent blur-[0.4px]" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, particle.id % 2 ? 8 : -8, 0],
            opacity: [0.18, 0.68, 0.18],
            scale: [1, 1.45, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
