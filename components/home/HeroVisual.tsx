"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

export default function HeroVisual() {
    const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

const handleMouseMove = (
  e: React.MouseEvent<HTMLDivElement>
) => {
  const rect = e.currentTarget.getBoundingClientRect();

  mouseX.set(e.clientX - rect.left - rect.width / 2);
  mouseY.set(e.clientY - rect.top - rect.height / 2);
};

const handleMouseLeave = () => {
  mouseX.set(0);
  mouseY.set(0);
};
  return (
    <motion.div
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: 60 }}
      animate={{
        opacity: 1,
        x: 0,
        y: [0, -15, 0],
      }}
      transition={{
        duration: 1,
        y: {
          duration: 5,
          repeat: Infinity,
        },
      }}
      className="relative flex justify-center"
    >
      {/* World Map */}

      <div className="absolute inset-0 z-0 flex items-center justify-center">

        <Image
          src="/assets/backgrounds/world-map.png"
          alt="World Map"
          width={900}
          height={900}
          className="object-contain opacity-25"
        />

      </div>

      {/* Animated Connection Lines */}

      <svg
        className="absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 600 700"
        fill="none"
      >

        <motion.path
          d="M330 260 C430 250 500 310 530 380"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.path
          d="M330 320 C220 330 150 260 90 180"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

      </svg>

      {/* Floating Particles */}

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-10 h-2 w-2 rounded-full bg-cyan-300"
          style={{
            left: `${20 + i * 8}%`,
            top: `${15 + (i % 4) * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
          }}
        />
      ))}
            {/* GPS Pulse */}

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute bottom-24 left-1/2 z-20 h-6 w-6 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_35px_#22d3ee]"
      />

      {/* Floating Card 1 */}

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-6 top-20 z-30 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur-xl"
      >
        <p className="text-sm text-cyan-300">
          📍 Live Tracking
        </p>

        <h3 className="mt-1 text-3xl font-bold">
          25K+
        </h3>

        <p className="text-xs text-blue-100">
          Active Vehicles
        </p>

      </motion.div>

      {/* Floating Card 2 */}

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-4 right-2 z-30 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur-xl"
      >
        <p className="text-sm text-cyan-300">
          🚛 Fleet Online
        </p>

        <h3 className="mt-1 text-3xl font-bold text-green-400">
          98%
        </h3>

        <p className="text-xs text-blue-100">
          Connected
        </p>

      </motion.div>

      {/* Experience Card */}

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute right-16 top-0 z-30 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 shadow-xl backdrop-blur-xl"
      >
        <p className="text-xs text-cyan-300">
          ⭐ Experience
        </p>

        <h3 className="mt-1 text-2xl font-bold">
          10+
        </h3>

        <p className="text-xs text-blue-100">
          Years
        </p>

      </motion.div>

      {/* Dashboard */}

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        className="absolute -right-8 top-24 z-30 w-64 rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between">

          <span className="text-sm text-cyan-300">
            Live Dashboard
          </span>

          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold">
            Online
          </span>

        </div>

        <div className="mt-5 space-y-3">

          <div className="flex justify-between">
            <span className="text-sm text-blue-100">
              Active Vehicles
            </span>

            <span className="font-bold">
              25,486
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-blue-100">
              Today&apos;s Trips
            </span>

            <span className="font-bold">
              4,250
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-blue-100">
              Alerts
            </span>

            <span className="font-bold text-yellow-300">
              18
            </span>
          </div>

        </div>

      </motion.div>
            {/* Hero Device */}

      <motion.div
  style={{
    rotateX,
    rotateY,
    transformPerspective: 1200,
  }}
  className="relative z-20 flex h-[700px] w-[600px] items-center justify-center rounded-[40px] border border-cyan-400/30 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl shadow-[0_0_120px_rgba(34,211,238,0.25)] hover:shadow-[0_0_160px_rgba(34,211,238,0.5)] transition-all duration-700"
>

        {/* Device Glow */}

        <div className="absolute h-64 w-64 rounded-full bg-cyan-400/30 blur-[120px]" />

        {/* Rotating Ring 1 */}

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-[420px] w-[420px] rounded-full border border-cyan-400/20"
        />

        {/* Rotating Ring 2 */}

        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-[500px] w-[500px] rounded-full border border-blue-400/10"
        />

        {/* Scanner Light */}

        <motion.div
          animate={{
            y: [-180, 180, -180],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-36 w-[260px] rounded-full bg-cyan-300/20 blur-3xl"
        />

        {/* GPS Device */}

                <Image
  src="/assets/hero/hero.png"
  alt="NAVII GPS Device"
  width={560}
  height={700}
  priority
  className="relative z-10 h-auto w-auto drop-shadow-[0_0_60px_rgba(34,211,238,0.8)]"
/>

</motion.div>

</motion.div>
);
}