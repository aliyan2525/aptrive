import * as React from "react";
import { cn } from "@/lib/cn";
import { motion, HTMLMotionProps } from "framer-motion";

interface LiquidGlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
  interactive?: boolean;
}

export const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ children, className, glowColor = "rgba(255, 255, 255, 0.4)", intensity = "medium", interactive = false, ...props }, ref) => {
    
    const intensityMap = {
      low: "backdrop-blur-md bg-white/40 dark:bg-black/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
      medium: "backdrop-blur-xl bg-white/60 dark:bg-[#0a0a0a]/60 shadow-[0_8px_32px_rgba(31,38,135,0.07)] border border-white/20 dark:border-white/10",
      high: "backdrop-blur-2xl bg-white/80 dark:bg-[#111]/80 shadow-[0_16px_40px_rgba(31,38,135,0.1)] border border-white/40 dark:border-white/15",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[1.5rem]",
          intensityMap[intensity],
          interactive && "cursor-pointer transition-all duration-300 hover:shadow-[0_20px_50px_rgba(31,38,135,0.12)] hover:-translate-y-1",
          className
        )}
        style={{
          boxShadow: interactive ? undefined : `0 8px 32px 0 ${glowColor.replace(/[\d.]+\)$/g, '0.07)')}`,
        }}
        whileHover={interactive ? { scale: 1.01 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";
