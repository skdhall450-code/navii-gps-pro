"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    vehicles: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    const enquiryMessage = [
      "Namaste NAVII GPS team,",
      "",
      "Thank you for contacting NAVII GPS INDIA.",
      "We have received your enquiry and our team will contact you shortly.",
      "",
      `Name: ${form.name.trim()}`,
      `Company: ${form.company.trim() || "Not provided"}`,
      `Email: ${form.email.trim()}`,
      `Mobile: ${form.phone.trim()}`,
      `Number of vehicles: ${form.vehicles || "Not provided"}`,
      `Requirement: ${form.message.trim() || "Not provided"}`,
      "",
      "Source: naviigps.com/contact",
    ].join("\n");

    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: form.phone, body: enquiryMessage }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "WhatsApp message could not be sent.");
      }

      setStatusMessage(
        "Your enquiry was submitted successfully. A WhatsApp confirmation has been sent to your mobile number.",
      );
    } catch (error) {
      console.error(error);
      setStatusMessage(
        "Your enquiry was received, but WhatsApp confirmation could not be sent. Please contact our team directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            ENQUIRY FORM
          </span>
          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Request a Free Consultation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Fill in the details below and our team will contact you shortly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-[32px] sm:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" required />
            <input type="text" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" />
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" required />
            <input type="tel" name="phone" placeholder="Mobile Number" value={form.phone} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" required />
            <input type="number" name="vehicles" placeholder="Number of Vehicles" value={form.vehicles} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 md:col-span-2" />
            <textarea name="message" rows={6} placeholder="Tell us about your requirement..." value={form.message} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 md:col-span-2" />
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            <MessageCircle size={18} />
            {isSubmitting ? "Sending..." : "Submit & Get WhatsApp Confirmation"}
          </button>

          {statusMessage && (
            <p role="status" aria-live="polite" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
              {statusMessage}
            </p>
          )}

          <p className="mt-4 text-sm text-slate-500">
            By submitting, you agree to receive a WhatsApp confirmation related to this enquiry. Prefer email? {" "}
            <a href="mailto:info@naviigps.com" className="font-semibold text-cyan-700 hover:underline">Write to info@naviigps.com</a>
          </p>
        </form>
      </div>
    </section>
  );
}
