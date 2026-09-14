"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";

const whatsappNumber = "917717394007";

type FormStatus = {
  kind: "success" | "error";
  message: string;
} | null;

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    vehicles: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<FormStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Your enquiry could not be delivered.");
      }

      setStatus({
        kind: "success",
        message:
          "Thank you. Your enquiry has reached the NAVII GPS team. We will contact you shortly.",
      });
      window.dispatchEvent(new Event("navii:lead-submitted"));
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        vehicles: "",
        message: "",
        website: "",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your enquiry could not be delivered. Please use WhatsApp below.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsAppUrl = useMemo(() => {
    const enquiryMessage = [
      "Namaste NAVII GPS team, I would like a consultation.",
      "",
      `Name: ${form.name.trim()}`,
      `Company: ${form.company.trim() || "Not provided"}`,
      `Email: ${form.email.trim()}`,
      `Mobile: ${form.phone.trim()}`,
      `Number of vehicles: ${form.vehicles || "Not provided"}`,
      `Requirement: ${form.message.trim() || "Not provided"}`,
    ].join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiryMessage)}`;
  }, [form]);

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
          method="post"
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:rounded-[32px] sm:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Full Name <span className="sr-only">(required)</span>
              <input type="text" name="name" autoComplete="name" maxLength={80} placeholder="Your full name" value={form.name} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 font-normal text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Company Name <span className="font-normal text-slate-500">(optional)</span>
              <input type="text" name="company" autoComplete="organization" maxLength={120} placeholder="Your company" value={form.company} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 font-normal text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email Address <span className="sr-only">(required)</span>
              <input type="email" name="email" autoComplete="email" maxLength={160} placeholder="name@company.com" value={form.email} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 font-normal text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Mobile Number <span className="sr-only">(required)</span>
              <input type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={24} placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 font-normal text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" required />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
              Number of Vehicles <span className="font-normal text-slate-500">(optional)</span>
              <input type="number" name="vehicles" inputMode="numeric" min="1" max="999999" placeholder="Example: 25" value={form.vehicles} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 font-normal text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
              Requirement <span className="font-normal text-slate-500">(optional)</span>
              <textarea name="message" rows={6} maxLength={2000} placeholder="Tell us about the vehicles, products or software you need..." value={form.message} onChange={handleChange} className="rounded-xl border border-slate-400 bg-white p-4 font-normal text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10" />
            </label>
            <label className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            <MessageCircle size={18} />
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </button>

          {status && (
            <div
              role={status.kind === "error" ? "alert" : "status"}
              aria-live="polite"
              className={`mt-5 rounded-xl border p-4 text-sm font-medium ${
                status.kind === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="flex items-start gap-2">
                {status.kind === "success" ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> : <AlertCircle className="mt-0.5 shrink-0" size={18} />}
                {status.message}
              </p>
              {status.kind === "error" && (
                <a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
                  <MessageCircle size={17} /> Send directly on WhatsApp
                </a>
              )}
            </div>
          )}

          <p className="mt-4 text-sm text-slate-500">
            By submitting, you agree that NAVII GPS may contact you about this enquiry. Prefer email? {" "}
            <a href="mailto:info@naviigps.com" className="font-semibold text-cyan-700 hover:underline">Write to info@naviigps.com</a>
          </p>
        </form>
      </div>
    </section>
  );
}
