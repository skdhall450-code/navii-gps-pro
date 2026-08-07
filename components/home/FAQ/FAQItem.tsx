"use client";

import { motion, AnimatePresence } from "framer-motion";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

type Props = {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FAQItem({
  faq,
  isOpen,
  onToggle,
}: Props) {
  return (
    <motion.div
      layout
      whileHover={{
        y: -3,
      }}
      className="group overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40"
    >
      {/* Question */}

      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <h3 className="pr-6 text-lg font-semibold text-white md:text-xl">
          {faq.question}
        </h3>

        <motion.div
          animate={{
            rotate: isOpen ? 45 : 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-2xl font-bold text-cyan-300"
        >
          +
        </motion.div>
      </button>

      {/* Answer */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-cyan-400/10 px-6 pb-6 pt-5">
              <p className="leading-8 text-slate-300">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}