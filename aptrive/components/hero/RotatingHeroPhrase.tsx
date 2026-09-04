"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = ["beautiful", "focused", "confident", "measurable"];

export default function RotatingHeroPhrase() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || phrases.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span>beautiful</span>;
  }

  return (
    <span className="hero-phrase-slot relative inline-grid min-w-[7.2ch] align-baseline" aria-hidden="true">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={phrases[index]}
          className="col-start-1 row-start-1 text-primary"
          initial={{ opacity: 0, y: "0.5em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.5em", filter: "blur(6px)", transition: { duration: 0.3 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
