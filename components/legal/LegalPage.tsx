import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/FooterV2";

import {
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  extra?: ReactNode;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  variant: "privacy" | "terms";
  sections: LegalSection[];
};

export default function LegalPage({
  eyebrow,
  title,
  description,
  effectiveDate,
  lastUpdated,
  variant,
  sections,
}: LegalPageProps) {
  const HeroIcon =
    variant === "privacy"
      ? ShieldCheck
      : FileText;

  return (
    <>
      <Header />

      <main className="bg-slate-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#06142e] via-[#08224a] to-[#0b3474] px-6 py-20 text-white">
          <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />

          <div className="relative mx-auto max-w-5xl">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-300">
              <HeroIcon size={28} />
            </div>

            <p className="text-sm font-bold tracking-[0.24em] text-cyan-300">
              {eyebrow}
            </p>

            <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">
              {title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
              <span>Effective: {effectiveDate}</span>
              <span aria-hidden="true">•</span>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-12">
              <div className="space-y-10">
                {sections.map(
                  (
                    section,
                    index,
                  ) => (
                    <section
                      key={section.title}
                      id={
                        "section-" +
                        (index + 1)
                      }
                      className="scroll-mt-28"
                    >
                      <h2 className="text-2xl font-bold text-slate-900">
                        {section.title}
                      </h2>

                      {section.paragraphs?.map(
                        (paragraph) => (
                          <p
                            key={paragraph}
                            className="mt-4 leading-7 text-slate-600"
                          >
                            {paragraph}
                          </p>
                        ),
                      )}

                      {section.bullets && (
                        <ul className="mt-4 space-y-3 text-slate-600">
                          {section.bullets.map(
                            (item) => (
                              <li
                                key={item}
                                className="flex gap-3 leading-7"
                              >
                                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                                <span>{item}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      )}

                      {section.extra}
                    </section>
                  ),
                )}
              </div>
            </article>

            <aside className="h-fit rounded-3xl border border-cyan-200 bg-white p-7 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-slate-900">
                Contact NAVII GPS
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                For privacy, legal, account or service-related questions, contact our team.
              </p>

              <div className="mt-6 space-y-5 text-sm">
                <a
                  href="tel:+918899729705"
                  className="flex gap-3 text-slate-700 transition hover:text-cyan-700"
                >
                  <Phone
                    size={19}
                    className="shrink-0 text-cyan-600"
                  />
                  <span>
                    Sales
                    <br />
                    +91 88997 29705
                  </span>
                </a>

                <a
                  href="https://wa.me/917717394007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 text-slate-700 transition hover:text-emerald-700"
                >
                  <MessageCircle
                    size={19}
                    className="shrink-0 text-emerald-600"
                  />
                  <span>
                    WhatsApp
                    <br />
                    +91 77173 94007
                  </span>
                </a>

                <a
                  href="mailto:helpline@naviigps.com"
                  className="flex gap-3 text-slate-700 transition hover:text-cyan-700"
                >
                  <Mail
                    size={19}
                    className="shrink-0 text-cyan-600"
                  />
                  <span>
                    helpline@naviigps.com
                    <br />
                    info@naviigps.com
                  </span>
                </a>

                <div className="flex gap-3 text-slate-700">
                  <MapPin
                    size={19}
                    className="shrink-0 text-cyan-600"
                  />
                  <span>
                    SCO 46, 2nd Floor,
                    GBP Business Square,
                    Near GBP Rosewood Gate No. 1,
                    Barwala Road, Dera Bassi,
                    Punjab – 140507, India
                  </span>
                </div>
              </div>

              <p className="mt-7 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                Nothing on this page limits any rights or remedies that cannot legally be excluded under applicable law.
              </p>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}