"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Fades/rises each new route in on navigation.
 *
 * Scoped honestly: in the App Router, the previous route's server-
 * rendered tree is torn down as soon as the new route's payload
 * arrives, which cuts an exit animation short more often than not —
 * there's no reliable way around that without restructuring routing
 * around a client-held "previous children" cache, which is a much
 * bigger change than this phase calls for. What this component
 * reliably delivers is a smooth *entrance* for the incoming page,
 * keyed by pathname so each route remounts and re-triggers it. If a
 * true crossfade becomes a priority later, revisit with
 * app/template.tsx in the mix.
 *
 * `MotionConfig reducedMotion="user"` makes every motion.* element
 * inside — not just this one — respect prefers-reduced-motion
 * automatically, so nothing here needs a manual media-query check.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
