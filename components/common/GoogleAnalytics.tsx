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
  parameters: Record<string, string | number | boolean>,
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

      const label = [
        action.textContent,
        action.getAttribute("aria-label"),
        action.getAttribute("title"),
      ]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      let eventName = action.getAttribute("data-ga-event");
      let channel = action.getAttribute("data-ga-channel") ?? "";

      if (eventName) {
        // Explicit tracking attributes take priority for icon-only actions.
      } else if (href.includes("wa.me")) {
        if (/brochure|datasheet|manual|download/i.test(label)) {
          eventName = "brochure_request_click";
        } else {
          eventName = pathname.startsWith("/products")
            ? "product_enquiry_click"
            : "whatsapp_click";
        }

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
      } else if (/get quote|request (a )?quote/i.test(label)) {
        eventName = "get_quote_click";
        channel = "website";
      }

      if (!eventName) {
        return;
      }

      sendGoogleAnalyticsEvent(eventName, {
        interaction_channel: channel,
        page_path: pathname,
        link_text: label.slice(0, 100),
        product_slug: pathname.startsWith("/products/")
          ? pathname.split("/")[2] ?? ""
          : "",
      });
    };

    const handleSuccessfulLead = (): void => {
      sendGoogleAnalyticsEvent("contact_form_submit", {
        interaction_channel: "contact_form",
        page_path: pathname,
        form_name: "free_consultation",
      });

      sendGoogleAnalyticsEvent("generate_lead", {
        interaction_channel: "contact_form",
        page_path: pathname,
        form_name: "free_consultation",
        lead_type: "sales_enquiry",
      });
    };

    document.addEventListener("click", handleClick, true);

    window.addEventListener("navii:lead-submitted", handleSuccessfulLead);

    return () => {
      document.removeEventListener("click", handleClick, true);

      window.removeEventListener("navii:lead-submitted", handleSuccessfulLead);
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
          className="fixed inset-x-3 bottom-3 z-[10000] mx-auto max-w-5xl rounded-2xl border border-cyan-300/40 bg-[#06142E]/95 p-4 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 sm:flex">
              <Cookie size={23} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1 md:flex md:items-center md:gap-5">
              <h2 id="analytics-consent-title" className="shrink-0 text-base font-bold">
                Your privacy choices
              </h2>

              <p id="analytics-consent-description" className="mt-1 text-xs leading-5 text-slate-300 md:mt-0">
                Optional analytics helps us improve the website. Necessary features work either way. Read our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={useNecessaryOnly} className="flex-1 rounded-xl border border-slate-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-slate-300 hover:bg-white/10 md:flex-none">
                Necessary Only
              </button>
              <button type="button" onClick={acceptAnalytics} className="flex-1 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-cyan-400 md:flex-none">
                Accept Analytics
              </button>
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
