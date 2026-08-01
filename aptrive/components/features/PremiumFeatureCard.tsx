"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface PremiumFeatureCardProps {
  title: string;
  body: string;
  icon: ReactNode;
  delay?: number;
  color: "blue" | "teal" | "purple" | "orange";
}

const colorMap = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  teal: {
    bg: "bg-teal/10",
    text: "text-teal",
    border: "border-teal/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
  },
};

export default function PremiumFeatureCard({ title, body, icon, delay = 0, color }: PremiumFeatureCardProps) {
  const theme = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      className={`group relative h-full rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-panel p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] shadow-sm hover:shadow-md dark:shadow-none ${theme.glow}`}
    >
      {/* Decorative gradient blob inside card */}
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${theme.bg} blur-[50px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${theme.bg} ${theme.border} ${theme.text} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
        
        <h3 className="font-display text-2xl font-bold text-black dark:text-white tracking-tight mb-4 transition-colors">
          {title}
        </h3>
        
        <p className="text-black/60 dark:text-white/60 leading-relaxed font-light flex-1 transition-colors">
          {body}
        </p>

        {/* Subtle animated border on hover */}
        <div className="absolute inset-0 rounded-3xl border border-transparent transition-colors duration-500 group-hover:border-black/10 dark:group-hover:border-white/10 pointer-events-none" />
      </div>
    </motion.div>
  );
}
