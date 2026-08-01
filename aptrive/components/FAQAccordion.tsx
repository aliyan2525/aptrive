"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Is Aptrive only for NUST NET?",
    a: "NUST NET is fully live today. ECAT and MDCAT tracks are being built on the same engine and are coming soon — your account and progress will carry over.",
  },
  {
    q: "How is the practice sequence personalized?",
    a: "Every attempt updates a topic-level mastery profile. Aptrive resequences upcoming questions toward your weakest topics instead of giving everyone the same fixed order.",
  },
  {
    q: "Are the mock tests timed like the real exam?",
    a: "Yes. Full-length mocks mirror the real exam's section timing and question distribution so results translate to actual test-day performance.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. Core diagnostics and a selection of practice questions are free. Full past papers, mock tests, and AI-generated practice sets are part of premium.",
  },
  {
    q: "Can I use Aptrive on mobile?",
    a: "The platform is fully responsive and works in any modern mobile browser, with a dedicated app planned as part of the roadmap.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={item.q}
            className={`group rounded-2xl border transition-colors duration-300 ${isOpen ? "bg-black/5 border-black/10 dark:bg-white/10 dark:border-white/20" : "bg-white dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 hover:bg-black/5 dark:hover:bg-white/[0.04]"}`}
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-6 p-6 text-left focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className={`font-display text-lg font-medium transition-colors duration-300 ${isOpen ? "text-black dark:text-white" : "text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white"}`}>
                {item.q}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? "bg-teal-500 text-white dark:bg-teal dark:text-black" : "bg-black/5 text-black/50 dark:bg-white/5 dark:text-white/50 group-hover:bg-black/10 group-hover:text-black dark:group-hover:bg-white/10 dark:group-hover:text-white"}`}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-black/60 dark:text-white/60 leading-relaxed transition-colors">
                      {item.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
