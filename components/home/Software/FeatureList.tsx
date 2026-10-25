"use client";
import styles from "../sections-premium.module.css";


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
      <h3
        className="text-3xl font-semibold sm:text-4xl text-white"
      >
        Everything You Need
        <span className="block text-blue-300">
          In One Platform
        </span>
      </h3>

      <p
        className="mt-6 max-w-xl text-lg leading-8 text-slate-300"
      >
        Monitor vehicles, drivers, fuel, alerts, reports and complete fleet
        operations from one secure cloud dashboard.
      </p>

      <div className="mt-12 grid gap-5">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`${styles.card} group flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-5  transition-all duration-300 hover:border-cyan-400/40`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
              {feature.icon}
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-bold text-white transition group-hover:text-blue-300">
                {feature.title}
              </h4>

              <p className="mt-2 leading-7 text-slate-300">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}