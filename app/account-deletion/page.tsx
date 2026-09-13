import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { PageSchema } from "@/components/seo/PageSchema";

export const metadata: Metadata = {
  title: "Delete your NAVII GPS account and data",
  description:
    "Request deletion of your NAVII GPS Admin, Dealer or Customer account and associated personal data through NAVII GPS support.",
  alternates: { canonical: "https://naviigps.com/account-deletion" },
};

const requestEmail =
  "mailto:helpline@naviigps.com?subject=" +
  encodeURIComponent("NAVII GPS account and data deletion request") +
  "&body=" +
  encodeURIComponent(
    "Please delete my NAVII GPS account and associated personal data.\n\n" +
      "App name (Admin, Dealer or Customer):\n" +
      "Registered email address or account ID:\n" +
      "Company or dealer name (if applicable):\n" +
      "Please explain any data that must be retained, the reason and the applicable retention period.\n",
  );

const sections: LegalSection[] = [
  {
    title: "1. Request account and data deletion",
    paragraphs: [
      "This page is for users of NAVII GPS Admin, NAVII GPS Dealer and NAVII GPS Customer, provided by NAVII GPS INDIA (OPC) PRIVATE LIMITED. You can request deletion without signing in to or reinstalling the app.",
      "Email helpline@naviigps.com with the subject NAVII GPS account and data deletion request. Include your app name, registered email address or account ID, and company or dealer name if applicable. State that you want your account and associated personal data deleted. Do not send your password, one-time codes or payment card details.",
    ],
    extra: (
      <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
        <a
          href={requestEmail}
          className="inline-flex min-h-12 items-center rounded-xl bg-cyan-800 px-5 py-3 font-semibold text-white transition hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-800"
        >
          Email account deletion request
        </a>
        <p className="mt-4 text-sm leading-6 text-slate-700">
          The button opens an email draft. Review it and send it to submit your
          request. If no email app opens, send the request from your usual email
          service to <strong className="break-all">helpline@naviigps.com</strong>.
          Opening this page or the email draft does not delete your account.
        </p>
      </div>
    ),
  },
  {
    title: "2. Verification and request scope",
    paragraphs: [
      "Requests are handled by support, subject to verification of your identity and authority, as described in our Privacy Policy. Sending from your registered email address helps identify your account. If you have lost access to that address, mention this in your request so support can discuss verification.",
      "If your login is used across NAVII services, identify the account and services you want deleted. For a company-managed account or a shared vehicle, identify which personal data belongs to you and which company you represent. Deleting a login does not by itself authorise deletion of another user's account or company-owned fleet records.",
    ],
  },
  {
    title: "3. Data covered by a deletion request",
    bullets: [
      "Your login account, account identifiers, name, email address, phone number and address where held.",
      "Personal data associated with your account, including vehicle and device assignments, GPS location and route history, alerts, geofences and reports, where attributable to you and within your authority to request deletion.",
      "Account-linked service and support records, subject to the retention exceptions below.",
    ],
    paragraphs: [
      "Please identify any particular vehicle, device or record you want included. A request for account deletion includes associated personal data; it is different from logging out, uninstalling the app or temporarily disabling an account.",
    ],
  },
  {
    title: "4. Information that may be retained",
    paragraphs: [
      "Our Privacy Policy allows limited retention for accounting and legal compliance, fraud prevention, security, backups, dispute resolution and contractual claims. This can include invoices and transaction records, security or fraud records, records needed for a dispute, and backup copies. Records belonging to another user or an organisation are subject to that party's rights and authority.",
      "Retention periods depend on the record and the applicable purpose or legal requirement; our current Privacy Policy does not specify one fixed period for every record. In your request, ask support to identify any data that must be retained, its reason and the applicable retention period, including any backup retention period.",
    ],
    extra: (
      <Link
        href="/privacy-policy#section-9"
        className="mt-4 inline-block font-semibold text-cyan-800 underline underline-offset-4"
      >
        Read the NAVII GPS Privacy Policy
      </Link>
    ),
  },
  {
    title: "5. Request deletion of specific data",
    paragraphs: [
      "You may also send an erasure request for specific personal data without requesting deletion of your whole account. Describe the records and the account they relate to in your email to helpline@naviigps.com. The same identity, authority and retention considerations apply.",
    ],
  },
];

export default function AccountDeletionPage() {
  return (
    <>
      <PageSchema
        path="/account-deletion"
        name="Delete your NAVII GPS account and data"
        description={metadata.description}
      />
      <LegalPage
        eyebrow="ACCOUNT & PERSONAL DATA"
        title="Delete your NAVII GPS account"
        description="Request deletion of your account and associated personal data by emailing NAVII GPS support. No app login is required to send a request."
        effectiveDate="13 September 2026"
        lastUpdated="13 September 2026"
        variant="privacy"
        sections={sections}
      />
    </>
  );
}
