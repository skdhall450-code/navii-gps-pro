"use client";

import { motion } from "framer-motion";

type Feature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

type Props = {
  features: Feature[];
};

export default function FeatureList({ features }: Props) {
  return (
    <div>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-white"
      >
        Everything You Need
        <span className="block text-cyan-300">
          In One Platform
        </span>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-6 max-w-xl text-lg leading-8 text-slate-300"
      >
        Monitor vehicles, drivers, fuel, alerts, reports and complete fleet
        operations from one secure cloud dashboard.
      </motion.p>

      <div className="mt-12 grid gap-5">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
            whileHover={{ x: 8 }}
            className="group flex items-start gap-5 rounded-2xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl">
              {feature.icon}
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-bold text-white transition group-hover:text-cyan-300">
                {feature.title}
              </h4>

              <p className="mt-2 leading-7 text-slate-300">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}