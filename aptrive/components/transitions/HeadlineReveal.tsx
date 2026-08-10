"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import { ElementType } from "react";

type HeadlineTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";

interface HeadlineRevealProps {
  /** Each entry renders as its own masked line, revealed in a staggered sequence. */
  lines: string[];
  /** Heading tag to render — defaults to h1 since the first use is the Hero headline. */
  as?: HeadlineTag;
  className?: string;
  lineClassName?: string;
  delay?: number;
}

export default function HeadlineReveal({
  lines,
  as: Tag = "h1",
  className,
  lineClassName,
  delay = 0,
}: HeadlineRevealProps) {
  const MotionTag = motion.create(Tag as ElementType);

  const containerVariants: Variants = {
    hidden: { opacity: 1 }, // Mask is always visible, contents are hidden by translation
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }, // equivalent to power4.out
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={containerVariants}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={cn("block", lineClassName)}
            variants={lineVariants}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
