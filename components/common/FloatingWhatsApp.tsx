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
      className="fixed bottom-44 right-6 z-[100]"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse Ring */}

      <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping"></span>

      {/* Main Button */}

      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-500/50 transition-all duration-300 hover:shadow-green-400/70">
        <FaWhatsapp size={34} />
      </div>
    </motion.a>
  );
}
