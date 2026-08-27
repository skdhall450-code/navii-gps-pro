import type { Metadata } from "next";

import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how NAVII GPS INDIA collects, uses, protects and manages personal data across its website, GPS software and connected services.",
  alternates: {
    canonical: "https://naviigps.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | NAVII GPS INDIA",
    description:
      "Learn how NAVII GPS INDIA protects and manages personal data.",
    url: "https://naviigps.com/privacy-policy",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NAVII GPS INDIA Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | NAVII GPS INDIA",
    description: "How NAVII GPS INDIA protects and manages personal data.",
    images: ["/og-image.jpg"],
  },
};

const sections: LegalSection[] = [
  {
    title: "1. About this Privacy Policy",
    paragraphs: [
      "This Privacy Policy explains how NAVII GPS INDIA (OPC) PVT LTD collects, uses, stores, shares and protects personal data when you use our website, contact our team, purchase products, create an account, or use our GPS tracking, fleet management, billing and connected-device services.",
      "By providing personal data or using our services, you acknowledge the practices described in this policy. Where consent is required, we will seek it through an appropriate notice or affirmative action.",
    ],
  },
  {
    title: "2. Personal data we may collect",
    bullets: [
      "Identity and contact information such as name, company name, email address, mobile number, postal address and account identifiers.",
      "Account information such as role, company, dealer or customer association, authentication records and service preferences.",
      "Vehicle and device information such as vehicle number, device model, IMEI, SIM number, assignment records and installation details.",
      "GPS and telemetry information such as location, route history, speed, ignition, battery, alerts, geofence events and device timestamps.",
      "Commercial and billing information such as selected plan, subscription, invoice, payment status, transaction reference and tax-related records.",
      "Enquiry and communication data submitted through WhatsApp, email, telephone, forms or customer-support interactions.",
      "Technical information such as browser type, IP address, device information, timestamps, security logs and website usage data where collected.",
    ],
  },
  {
    title: "3. How we collect information",
    bullets: [
      "Directly from you, your company, dealer, customer, authorised representative, driver or account administrator.",
      "Automatically from GPS devices, connected sensors, software, mobile or web applications and server logs.",
      "From authorised installers, service partners, payment or communication providers and other parties involved in delivering requested services.",
      "From lawful public sources or authorities where permitted or required by applicable law.",
    ],
  },
  {
    title: "4. Why we process personal data",
    bullets: [
      "To respond to enquiries, provide quotations and arrange product demonstrations or consultations.",
      "To activate, operate, secure and support GPS tracking, fleet management, billing and connected-device services.",
      "To display live and historical vehicle information, alerts, reports, geofences, subscriptions and invoices to authorised users.",
      "To manage device installation, assignment, warranty, support, maintenance and service communications.",
      "To process manual payments, issue invoices and maintain financial or statutory records.",
      "To prevent fraud, abuse, unauthorised access, security incidents and violations of our terms.",
      "To comply with legal obligations, resolve disputes and enforce agreements.",
      "To improve product reliability, user experience and operational performance using appropriately controlled data.",
    ],
  },
  {
    title: "5. Consent and lawful processing",
    paragraphs: [
      "We process personal data for lawful purposes, including providing services requested by you, performing contractual obligations, complying with law, protecting legitimate interests and obtaining consent where applicable.",
      "You may withdraw consent for consent-based processing by contacting us. Withdrawal does not affect processing already completed and may limit services that require the relevant information.",
    ],
  },
  {
    title: "6. GPS location and authorised tracking",
    paragraphs: [
      "Our services may process precise and continuous vehicle or asset location. Customers, dealers and account administrators are responsible for ensuring they have all required ownership rights, notices, permissions and lawful authority before installing devices or tracking any vehicle, asset, employee or driver.",
      "Location data is made available only according to configured account roles and operational scope. Users must not use the service for unlawful surveillance, harassment or any activity that violates another person's rights.",
    ],
  },
  {
    title: "7. When information may be shared",
    bullets: [
      "With authorised employees, dealers, customers, installers and service partners who require access to deliver or support the requested service.",
      "With hosting, cloud, database, mapping, messaging, analytics, security and professional service providers under appropriate safeguards.",
      "With government, regulatory, judicial or law-enforcement authorities where disclosure is legally required or reasonably necessary.",
      "In connection with a lawful merger, restructuring, financing or transfer of business, subject to appropriate confidentiality and legal requirements.",
      "With another party when you direct us to share information or provide valid consent.",
    ],
  },
  {
    title: "8. WhatsApp and third-party services",
    paragraphs: [
      "The website enquiry form may open WhatsApp with a pre-filled message. The message is not sent until you choose to send it through WhatsApp. Once you use WhatsApp, Google Maps or another third-party service, that provider's privacy terms may also apply.",
      "We do not control independent third-party platforms. You should review their policies before submitting sensitive information.",
    ],
  },
  {
    title: "9. Data retention and security",
    paragraphs: [
      "We retain information only for as long as reasonably necessary for the stated purpose, active service, support, dispute resolution, security, backup, accounting and legal compliance. Different records may have different retention periods.",
      "We use reasonable administrative, technical and organisational safeguards, including access controls, authentication, network protection, secure backups and role-based permissions. No internet or storage system can be guaranteed completely secure.",
    ],
  },
  {
    title: "10. Your privacy rights",
    paragraphs: [
      "Subject to applicable law and verification of your identity and authority, you may request information about processing, access, correction, completion, updating or erasure of personal data, withdraw consent, or raise a grievance.",
      "Some information may be retained where required for legal compliance, fraud prevention, security, contractual claims or another lawful purpose. Requests may be sent to helpline@naviigps.com.",
    ],
  },
  {
    title: "11. Cookies and similar technology",
    paragraphs: [
      "We use essential local storage for authentication, security, preferences and core website or dashboard functionality. These technologies are necessary for the requested service and remain available regardless of your analytics choice.",
      "Google Analytics 4 is optional and its Google tag loads only after you select Accept Analytics. After acceptance, Google Analytics may process online identifiers, device and browser information, approximate location, referring pages, page views and website interactions to help us understand and improve website performance. Advertising storage, advertising user data and ad personalisation remain disabled in this implementation.",
      "You may select Necessary Only, accept analytics, or reopen Cookie settings to withdraw or change your choice. Withdrawing analytics consent removes accessible Google Analytics cookies and reloads the website without loading the analytics tag. Browser settings may also allow you to block or delete cookies, but doing so can affect login sessions and essential service functionality.",
    ],
  },
  {
    title: "12. Children, changes and grievances",
    paragraphs: [
      "Our commercial GPS and fleet services are not directed to children. Do not submit a child's personal data unless you have lawful authority and all required consent.",
      "We may update this policy when our services or legal obligations change. The revised version will display an updated date on this page.",
      "For a privacy request or grievance, email helpline@naviigps.com or write to our corporate office. Please include sufficient details for us to identify and respond to the request without sending unnecessary sensitive information.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY & DATA PROTECTION"
      title="Privacy Policy"
      description="How NAVII GPS INDIA handles personal, vehicle, device and location information across our website and connected GPS platform."
      effectiveDate="23 August 2026"
      lastUpdated="26 August 2026"
      variant="privacy"
      sections={sections}
    />
  );
}
