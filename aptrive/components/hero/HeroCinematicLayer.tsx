"use client";

import { motion, useReducedMotion, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_SIGNAL_EVENT } from "./heroSignal";

export default function HeroCinematicLayer() {
  const reducedMotion = useReducedMotion();
  const motionAllowed = reducedMotion === false;
  const [active, setActive] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 80, damping: 24, mass: 0.8 });
  const y = useSpring(mouseY, { stiffness: 80, damping: 24, mass: 0.8 });

  useEffect(() => {
    const handleSignal = (event: Event) => {
      setActive(Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active));
    };
    window.addEventListener(HERO_SIGNAL_EVENT, handleSignal);
    return () => window.removeEventListener(HERO_SIGNAL_EVENT, handleSignal);
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;
    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        mouseX.set((event.clientX / window.innerWidth - 0.5) * 18);
        mouseY.set((event.clientY / window.innerHeight - 0.5) * 12);
      });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [motionAllowed, mouseX, mouseY]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{ x: motionAllowed ? x : 0, y: motionAllowed ? y : 0 }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(111,69,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(111,69,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_76%)]" />
        <div className="absolute left-[58%] top-[18%] h-[38vw] w-[38vw] max-h-[560px] max-w-[560px] rounded-full border border-violet-400/20" />
        <div className="absolute left-[62%] top-[24%] h-[28vw] w-[28vw] max-h-[420px] max-w-[420px] rounded-full border border-teal-400/20" />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-[12%] h-px w-[min(76vw,880px)] -translate-x-1/2 origin-left bg-gradient-to-r from-transparent via-violet-500/45 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: active ? 0.86 : 0.48 }}
        transition={{ duration: motionAllowed ? 1.3 : 0, delay: motionAllowed ? 0.35 : 0, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="absolute left-[8%] top-[18%] hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500/70 md:block"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: motionAllowed ? 0.7 : 0, delay: motionAllowed ? 0.55 : 0 }}
      >
        Aptrive / 01 — read the signal
      </motion.div>

      <motion.div
        className="absolute right-[8%] top-[18%] hidden text-right text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-500/70 md:block"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: motionAllowed ? 0.7 : 0, delay: motionAllowed ? 0.7 : 0 }}
      >
        Interactive pathway / 04 stages
      </motion.div>

      <motion.div
        className="absolute bottom-[9%] left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500/65 sm:flex"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionAllowed ? 0.7 : 0, delay: motionAllowed ? 1 : 0 }}
      >
        <span className="h-px w-10 bg-neutral-400/50" />
        Scroll to trace your path
        <span className="h-px w-10 bg-neutral-400/50" />
      </motion.div>
    </div>
  );
}
