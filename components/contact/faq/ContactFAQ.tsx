"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do you provide GPS installation?",
    answer:
      "Yes. We provide professional GPS tracker installation across India through our support network.",
  },
  {
    question: "Do you provide AIS 140 GPS devices?",
    answer:
      "Yes. NAVII GPS offers AIS 140 compliant GPS tracking devices for commercial vehicles.",
  },
  {
    question: "Can I monitor vehicles from mobile?",
    answer:
      "Yes. Our Android, iOS and Web Platform allow real-time tracking from anywhere.",
  },
  {
    question: "Do you provide fleet management software?",
    answer:
      "Yes. We provide enterprise fleet management software with reports, geo-fencing, alerts and analytics.",
  },
];

export default function ContactFAQ() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-5xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            FAQ
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="mt-16 space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={faq.question}
              className="rounded-2xl border border-slate-200 bg-white shadow-lg"
            >

              <button
                onClick={() =>
                  setActive(active === index ? null : index)
                }
                className="flex w-full items-center justify-between p-6 text-left"
              >

                <span className="text-lg font-semibold">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`transition ${
                    active === index ? "rotate-180" : ""
                  }`}
                />

              </button>

              {active === index && (

                <div className="border-t border-slate-200 px-6 py-5 text-slate-600 leading-7">

                  {faq.answer}

                </div>

              )}

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}