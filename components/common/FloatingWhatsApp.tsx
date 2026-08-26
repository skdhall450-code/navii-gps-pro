"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const phone = "917717394007";

  return (
    <motion.a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.4,
      }}
      whileHover={{
        scale: 1.12,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="fixed bottom-5 right-4 z-40 sm:bottom-6 sm:right-6 lg:bottom-44"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse Ring */}

      <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"></span>

      {/* Main Button */}

      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-500/50 transition-all duration-300 hover:shadow-green-400/70 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
        <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7 lg:h-[34px] lg:w-[34px]" />
      </div>
    </motion.a>
  );
}
