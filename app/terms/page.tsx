import type { Metadata } from "next";

import LegalPage, {
  type LegalSection,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms governing access to the NAVII GPS INDIA website, GPS devices, fleet management software, subscriptions and related services.",
  alternates: {
    canonical:
      "https://naviigps.com/terms",
  },
  openGraph: {
    title:
      "Terms & Conditions | NAVII GPS INDIA",
    description:
      "Terms governing NAVII GPS INDIA products, software, subscriptions and related services.",
    url:
      "https://naviigps.com/terms",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "NAVII GPS INDIA Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Terms & Conditions | NAVII GPS INDIA",
    description:
      "Terms for NAVII GPS INDIA products, software and services.",
    images: ["/og-image.jpg"],
  },
};

const sections: LegalSection[] = [
  {
    title: "1. Acceptance of these terms",
    paragraphs: [
      "These Terms & Conditions govern access to the NAVII GPS INDIA website, dashboard, GPS devices, software, subscriptions, installation, support and related services provided by NAVII GPS INDIA (OPC) PVT LTD.",
      "By using the website, creating an account, accepting a quotation, purchasing a product or using a service, you agree to these terms and any applicable written quotation, invoice, subscription plan, product warranty or service agreement.",
    ],
  },
  {
    title: "2. Eligibility and authority",
    paragraphs: [
      "You must be legally capable of entering into a binding agreement. If you act for a company, dealer, customer, fleet owner or another organisation, you confirm that you are authorised to bind that entity and manage its users, vehicles and devices.",
    ],
  },
  {
    title: "3. Products and services",
    bullets: [
      "GPS tracking devices, connected sensors, accessories and installation support.",
      "Fleet management, live tracking, history, alerts, reports, geofencing and device-management software.",
      "Dealer, customer, administrator and user accounts with role-scoped access.",
      "Subscription, invoice, payment-recording and business-management features.",
      "Technical support, configuration, maintenance and related professional services.",
    ],
  },
  {
    title: "4. Quotations, pricing and orders",
    paragraphs: [
      "Product availability, specifications, taxes, installation charges, subscription fees, delivery estimates and commercial terms are confirmed in the applicable quotation or invoice. Website descriptions are general information and do not by themselves create a binding sales offer.",
      "Unless an online checkout is expressly provided, purchases and payments are completed through an authorised quotation, invoice or written confirmation. We may reject or cancel an order affected by pricing, availability, compliance or verification errors.",
    ],
  },
  {
    title: "5. Accounts and credentials",
    bullets: [
      "Provide accurate and current registration, company, dealer, customer and vehicle information.",
      "Keep passwords and access tokens confidential and immediately report suspected unauthorised access.",
      "Create accounts only for authorised persons and assign the minimum appropriate role.",
      "Accept responsibility for activity performed through accounts under your control unless caused by our proven failure to apply reasonable safeguards.",
    ],
  },
  {
    title: "6. Lawful tracking and user responsibility",
    paragraphs: [
      "You may install or use a tracking device only on vehicles or assets you own, control or are legally authorised to monitor. You are responsible for providing all notices and obtaining all permissions required from drivers, employees, customers or other affected persons.",
      "The services must not be used for unlawful surveillance, stalking, harassment, theft, fraud, interference with a vehicle, violation of privacy or any activity prohibited by law.",
    ],
  },
  {
    title: "7. GPS accuracy and safety limitations",
    paragraphs: [
      "GPS location, speed, ignition, battery, alert and sensor information can be delayed, incomplete or inaccurate because of satellite visibility, mobile-network coverage, device placement, power loss, hardware condition, configuration, environmental conditions or third-party systems.",
      "The service is an operational assistance tool and is not a substitute for safe driving, emergency services, insurance, regulatory compliance or independent verification. We do not guarantee theft prevention, vehicle recovery or uninterrupted real-time communication.",
    ],
  },
  {
    title: "8. Installation and device care",
    paragraphs: [
      "Installation should be performed according to the product guide and, where recommended, by an authorised technician. Incorrect wiring, unauthorised modification, water damage, unsuitable voltage, tampering or misuse may affect safety, performance and warranty coverage.",
      "You must maintain suitable SIM, network, power and vehicle conditions required for the device and service.",
    ],
  },
  {
    title: "9. Subscriptions and service access",
    paragraphs: [
      "Software access may depend on an active subscription, assigned device and confirmed payment. Plan duration, renewal, taxes, included features and usage scope are specified in the selected plan or invoice.",
      "We may restrict or suspend access for expired subscriptions, overdue amounts, security threats, unlawful activity or material breach, after any notice required by the applicable agreement or law.",
    ],
  },
  {
    title: "10. Cancellation, returns, refunds and warranty",
    paragraphs: [
      "Cancellation, return, replacement, warranty and refund eligibility will be governed by the applicable written quotation, invoice, product warranty, condition of goods and mandatory consumer law.",
      "Approved refunds, if any, will follow the agreed payment method and processing timeline. Nothing in these terms excludes statutory rights that cannot legally be waived.",
    ],
  },
  {
    title: "11. Acceptable use",
    bullets: [
      "Do not bypass security, probe systems, introduce malware, overload services or access another user's information.",
      "Do not reverse engineer, copy, resell or commercially exploit software except where expressly authorised in writing.",
      "Do not manipulate device data, invoices, payment records or account roles for fraudulent or unlawful purposes.",
      "Do not upload content that infringes intellectual property, privacy or other legal rights.",
    ],
  },
  {
    title: "12. Intellectual property",
    paragraphs: [
      "The NAVII GPS name, logos, website, software, interface, documentation, graphics and original content are owned by or licensed to NAVII GPS INDIA (OPC) PVT LTD and are protected by applicable intellectual-property laws.",
      "We grant authorised users a limited, revocable, non-exclusive and non-transferable right to use the services for their intended business purpose during the applicable service period.",
    ],
  },
  {
    title: "13. Third-party services",
    paragraphs: [
      "Our services may interact with mobile networks, SIM providers, maps, cloud hosting, WhatsApp, payment channels and other third parties. Their availability and separate terms may affect functionality.",
      "Links to third-party websites are provided for convenience and do not imply control or endorsement of all third-party content.",
    ],
  },
  {
    title: "14. Availability, liability and force majeure",
    paragraphs: [
      "We aim to provide reliable services but do not promise that every feature will be uninterrupted or error-free. Planned maintenance, emergency repairs, cyber incidents, network failures, government action, natural events and circumstances beyond reasonable control may interrupt service.",
      "To the maximum extent permitted by law, liability will be limited according to the applicable agreement and will not include indirect, incidental or consequential losses where such exclusion is legally valid. This limitation does not apply where liability cannot lawfully be excluded.",
    ],
  },
  {
    title: "15. Changes, governing law and contact",
    paragraphs: [
      "We may update these terms to reflect service, security or legal changes. Material changes will apply from the stated effective date, subject to applicable law and existing written agreements.",
      "These terms are governed by the laws of India. Disputes will be subject to courts of competent jurisdiction in Punjab, India, unless another forum is required by applicable law or agreed in writing.",
      "Questions may be sent to helpline@naviigps.com or info@naviigps.com, or delivered to our corporate office at Dera Bassi, Punjab.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="SERVICE & WEBSITE TERMS"
      title="Terms & Conditions"
      description="The rules governing use of NAVII GPS products, connected devices, fleet software, subscriptions and support services."
      effectiveDate="23 August 2026"
      lastUpdated="23 August 2026"
      variant="terms"
      sections={sections}
    />
  );
}