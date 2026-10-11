"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do you provide GPS installation?",
    answer:
      "Share your vehicle and location so we can confirm installation availability, arrangements and any charges in your quotation.",
  },
  {
    question: "Do you provide AIS 140 GPS devices?",
    answer:
      "Ask about device options and confirm model-specific certification, state approvals and fit for your vehicle before ordering.",
  },
  {
    question: "Can I monitor vehicles from mobile?",
    answer:
      "Use the Android app for your assigned customer, dealer or admin account, or the web dashboard. Ask NAVII GPS to confirm iPhone or older-app compatibility for your account.",
  },
  {
    question: "Do you provide fleet management software?",
    answer:
      "The platform provides vehicle views, recorded history, configured geofence alerts and reports. Availability depends on hardware, subscription and account permissions.",
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