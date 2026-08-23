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

  const [statusMessage, setStatusMessage] =
    useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const enquiryMessage = [
      "Hello NAVII GPS team,",
      "",
      "I would like to request a free consultation.",
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

    const whatsappUrl =
      `https://wa.me/917717394007?text=${encodeURIComponent(
        enquiryMessage,
      )}`;

    setStatusMessage(
      "WhatsApp opened with your enquiry. Please review the message and press Send in WhatsApp.",
    );

    const openedWindow =
      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer",
      );

    if (!openedWindow) {
      window.location.href =
        whatsappUrl;
    }
  };

  return (
    <section
      id="contact-form"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-4xl px-6">

        <div className="mb-12 text-center">

          <span className="rounded-full bg-cyan-100 px-5 py-2 text-sm font-semibold text-cyan-700">
            ENQUIRY FORM
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-slate-900">
            Request a Free Consultation
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Fill in the details below and our team will
            contact you shortly.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] bg-white p-10 shadow-2xl"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 p-4 outline-none focus:border-cyan-500"
              required
            />

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 p-4 outline-none focus:border-cyan-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 p-4 outline-none focus:border-cyan-500"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 p-4 outline-none focus:border-cyan-500"
              required
            />

            <input
              type="number"
              name="vehicles"
              placeholder="Number of Vehicles"
              value={form.vehicles}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 p-4 outline-none focus:border-cyan-500 md:col-span-2"
            />

            <textarea
              name="message"
              rows={6}
              placeholder="Tell us about your requirement..."
              value={form.message}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 p-4 outline-none focus:border-cyan-500 md:col-span-2"
            />

          </div>

          <button
            type="submit"
            className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >

            <MessageCircle size={18} />

            Continue on WhatsApp

          </button>

          {statusMessage && (
            <p
              role="status"
              aria-live="polite"
              className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
            >
              {statusMessage}
            </p>
          )}

          <p className="mt-4 text-sm text-slate-500">
            Your enquiry is not sent until you press
            Send in WhatsApp. Prefer email?{" "}
            <a
              href="mailto:info@naviigps.com"
              className="font-semibold text-cyan-700 hover:underline"
            >
              Write to info@naviigps.com
            </a>
          </p>

        </form>

      </div>

    </section>
  );
}