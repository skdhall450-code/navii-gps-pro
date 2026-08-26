"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Cookie, Settings2 } from "lucide-react";

const GA_MEASUREMENT_ID = "G-XCKRML3X4X";

const CONSENT_STORAGE_KEY = "navii_analytics_consent";

type ConsentChoice = "granted" | "denied" | null;

type GoogleTagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

const googleTagConfiguration =
  "window.gtag('js', new Date());" +
  "window.gtag('config', '" +
  GA_MEASUREMENT_ID +
  "', {" +
  "allow_google_signals: false," +
  "allow_ad_personalization_signals: false" +
  "});";

function updateGoogleConsent(choice: "granted" | "denied"): void {
  const analyticsWindow = window as GoogleTagWindow;

  analyticsWindow.gtag?.("consent", "update", {
    analytics_storage: choice,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function sendGoogleAnalyticsEvent(
  eventName: string,
  parameters: Record<string, string>,
): void {
  const analyticsWindow = window as GoogleTagWindow;

  analyticsWindow.gtag?.("event", eventName, {
    ...parameters,
    transport_type: "beacon",
  });
}

function deleteAnalyticsCookies(): void {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter(
      (name): name is string =>
        Boolean(name) && (name === "_ga" || name.startsWith("_ga_")),
    );

  const hostname = window.location.hostname;

  const rootDomain = hostname.split(".").slice(-2).join(".");

  for (const name of cookieNames) {
    document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";

    document.cookie =
      name + "=; Max-Age=0; path=/; domain=" + hostname + "; SameSite=Lax";

    if (rootDomain.includes(".")) {
      document.cookie =
        name + "=; Max-Age=0; path=/; domain=." + rootDomain + "; SameSite=Lax";
    }
  }
}

function AnalyticsScripts() {
  return (
    <>
      <Script
        src={"https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID}
        strategy="afterInteractive"
      />

      <Script
        id="navii-google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: googleTagConfiguration,
        }}
      />
    </>
  );
}

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState<ConsentChoice>(null);

  const [hydrated, setHydrated] = useState(false);

  const pathname = usePathname();

  const previousPathname = useRef(pathname);

  useEffect(() => {
    let storedChoice: string | null = null;

    try {
      storedChoice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch {
      storedChoice = null;
    }

    if (storedChoice === "granted" || storedChoice === "denied") {
      updateGoogleConsent(storedChoice);

      setConsent(storedChoice);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    if (consent !== "granted") {
      return;
    }

    sendGoogleAnalyticsEvent("page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [consent, pathname]);

  useEffect(() => {
    if (consent !== "granted") {
      return;
    }

    const handleClick = (event: MouseEvent): void => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const action = event.target.closest("a, button");

      if (!action) {
        return;
      }

      const href =
        action instanceof HTMLAnchorElement
          ? (action.getAttribute("href") ?? "")
          : "";

      const label =
        action.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";

      let eventName: string | null = null;
      let channel = "";

      if (href.includes("wa.me")) {
        eventName = pathname.startsWith("/products")
          ? "product_enquiry_click"
          : "whatsapp_click";

        channel = "whatsapp";
      } else if (href.startsWith("tel:")) {
        eventName = "phone_click";
        channel = "phone";
      } else if (href.startsWith("mailto:")) {
        eventName = "email_click";
        channel = "email";
      } else if (
        /request demo|book demo|discuss your requirement/i.test(label)
      ) {
        eventName = "demo_request_click";
        channel = "website";
      }

      if (!eventName) {
        return;
      }

      sendGoogleAnalyticsEvent(eventName, {
        interaction_channel: channel,
        page_path: pathname,
      });
    };

    const handleSubmit = (): void => {
      if (pathname !== "/contact") {
        return;
      }

      sendGoogleAnalyticsEvent("contact_form_submit", {
        interaction_channel: "contact_form",
        page_path: pathname,
      });
    };

    document.addEventListener("click", handleClick, true);

    document.addEventListener("submit", handleSubmit, true);

    return () => {
      document.removeEventListener("click", handleClick, true);

      document.removeEventListener("submit", handleSubmit, true);
    };
  }, [consent, pathname]);

  const acceptAnalytics = (): void => {
    updateGoogleConsent("granted");

    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    } catch {
      // Analytics still works for this page load.
    }

    setConsent("granted");
  };

  const useNecessaryOnly = (): void => {
    updateGoogleConsent("denied");

    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    } catch {
      // The denied state remains active.
    }

    setConsent("denied");
  };

  const reopenSettings = (): void => {
    updateGoogleConsent("denied");

    deleteAnalyticsCookies();

    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Reload still restores denied defaults.
    }

    window.location.reload();
  };

  if (!hydrated) {
    return null;
  }

  return (
    <>
      {consent === "granted" && <AnalyticsScripts />}

      {consent === null ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
          data-cookie-consent="banner"
          className="fixed inset-x-4 bottom-4 z-[10000] mx-auto max-w-2xl rounded-2xl border border-cyan-300/40 bg-[#06142E]/95 p-5 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 sm:flex">
              <Cookie size={23} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 id="analytics-consent-title" className="text-lg font-bold">
                Your privacy choices
              </h2>

              <p
                id="analytics-consent-description"
                className="mt-2 text-sm leading-6 text-slate-300"
              >
                We use optional Google Analytics to understand website usage and
                improve NAVII GPS services. It loads only if you accept.
                Necessary website functionality remains available either way.
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Read our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                >
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={useNecessaryOnly}
                  className="rounded-xl border border-slate-500 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-white/10"
                >
                  Necessary Only
                </button>

                <button
                  type="button"
                  onClick={acceptAnalytics}
                  className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
                >
                  Accept Analytics
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={reopenSettings}
          data-cookie-settings="true"
          className="fixed bottom-4 left-4 z-[90] flex items-center gap-2 rounded-full border border-slate-300 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur transition hover:border-cyan-400 hover:text-cyan-700"
          aria-label="Open analytics cookie settings"
        >
          <Settings2 size={15} aria-hidden="true" />
          Cookie settings
        </button>
      )}
    </>
  );
}
