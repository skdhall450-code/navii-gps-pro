import styles from "../sections-premium.module.css";

type FAQ = { id: number; question: string; answer: string };

export default function FAQItem({ faq }: { faq: FAQ }) {
  return (
    <details className={styles.faq} name="navii-home-faq" open={faq.id === 1}>
      <summary className="text-lg font-semibold text-white md:text-xl">
        {faq.question}
      </summary>
      <p>{faq.answer}</p>
    </details>
  );
}
