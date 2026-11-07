const faqs = [
  {
    question: "Do you provide GPS installation?",
    answer:
      "Contact NAVII GPS with your vehicle type and location to confirm installation availability, compatibility and charges.",
  },
  {
    question: "Do you provide AIS 140 GPS devices?",
    answer:
      "Contact NAVII GPS about AIS 140 device options. Confirm the exact model, applicable approval documents and requirements for your vehicle and state before ordering.",
  },
  {
    question: "Can I monitor vehicles from mobile?",
    answer:
      "Supported vehicles can be monitored through the NAVII GPS mobile and web platform after installation and configuration. Confirm app availability and access for your deployment.",
  },
  {
    question: "Do you provide fleet management software?",
    answer:
      "Ask NAVII GPS to confirm the vehicle views, recorded history, geofence alerts and reports available for your hardware, subscription and account permissions.",
  },
];


export default function ContactFAQ() {
  return <section className="bg-slate-50 py-24">
    <div className="mx-auto max-w-5xl px-6">
      <h2 className="text-center text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
      <div className="mt-16 space-y-5">
        {faqs.map((faq, index) => <details key={faq.question} open={index === 0} className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <summary className="cursor-pointer p-6 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-cyan-700">{faq.question}</summary>
          <p className="border-t border-slate-200 px-6 py-5 leading-7 text-slate-600">{faq.answer}</p>
        </details>)}
      </div>
    </div>
  </section>;
}
