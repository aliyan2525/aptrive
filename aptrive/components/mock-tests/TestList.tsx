"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TestCard, TestCardProps } from "./TestCard";

interface TestListProps {
  tests: TestCardProps[];
}

export const TestList = ({ tests }: TestListProps) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <AnimatePresence mode="popLayout">
        {tests.map((test) => (
          <motion.div
            key={test.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          >
            <TestCard {...test} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
