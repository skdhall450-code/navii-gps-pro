"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#06142E]"
        >
          <div className="flex flex-col items-center">

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
              className="mb-8 h-24 w-24 rounded-full border-4 border-cyan-500 border-t-transparent"
            />

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-extrabold text-white"
            >
              NAVII
              <span className="text-cyan-300"> GPS</span>
            </motion.h1>

            <p className="mt-3 text-slate-300">
              Loading Smart GPS Platform...
            </p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}