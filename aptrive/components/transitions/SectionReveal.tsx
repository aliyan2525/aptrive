"use client";

import React, { type ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  /** Animate this element's direct children individually, staggered, instead of the wrapper as one block. Use for card grids/lists. */
  stagger?: boolean;
  /** Starting offset in px that the content rises from. */
  y?: number;
  delay?: number;
}

export default function SectionReveal({
  children,
  className = "",
  stagger = false,
  y = 32,
  delay = 0,
}: SectionRevealProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: stagger ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.165, 0.84, 0.44, 1],
        staggerChildren: stagger ? 0.08 : 0,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.165, 0.84, 0.44, 1] },
    },
  };

  if (!stagger) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    );
  }

  // With stagger, we map children and wrap them so they stagger automatically.
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      variants={containerVariants}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
