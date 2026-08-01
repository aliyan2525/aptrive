"use client";

import { motion } from "framer-motion";

export default function FloatingStats() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
      {/* Stat 1: Top Left */}
      <motion.div
        animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 backdrop-blur-xl shadow-2xl shadow-blue-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
          </div>
          <div>
            <div className="text-xl font-display font-bold text-black dark:text-white">45,000+</div>
            <div className="text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50">Questions Solved</div>
          </div>
        </div>
      </motion.div>

      {/* Stat 2: Bottom Right */}
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-[10%] rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 backdrop-blur-xl shadow-2xl shadow-teal-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
          </div>
          <div>
            <div className="text-xl font-display font-bold text-black dark:text-white">12,500+</div>
            <div className="text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50">Admitted Students</div>
          </div>
        </div>
      </motion.div>

      {/* Floating Math Symbols */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[20%] text-6xl font-serif text-black/20 dark:text-white/10"
      >
        ∑
      </motion.div>
      <motion.div
        animate={{ y: [0, 40, 0], rotate: -45, opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[30%] left-[20%] text-6xl font-serif text-black/20 dark:text-white/10"
      >
        π
      </motion.div>
      <motion.div
        animate={{ x: [0, -30, 0], rotate: 45, opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 12, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[30%] text-5xl font-serif text-black/20 dark:text-white/10"
      >
        ∫
      </motion.div>
    </div>
  );
}
