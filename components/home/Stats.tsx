import styles from "./premium-home.module.css";
import PremiumReveal from "./PremiumReveal";
const stats = [
  {
    number: "25K+",
    title: "Active Vehicles",
  },
  {
    number: "500+",
    title: "Dealers Network",
  },
  {
    number: "10K+",
    title: "Happy Customers",
  },
  {
    number: "100+",
    title: "Cities Covered",
  },
];

export default function Stats() {
  return (
    <section className={styles.statsBand}>
      <div className="mx-auto max-w-7xl px-6">

        <div className={styles.statsGrid}>

          {stats.map((item) => (
            <PremiumReveal
              key={item.title}
              className={styles.statTile}
            >
              <h2 className={styles.statNumber}>
                {item.number}
              </h2>

              <p className={styles.statLabel}>
                {item.title}
              </p>
            </PremiumReveal>
          ))}

        </div>

      </div>
    </section>
  );
}