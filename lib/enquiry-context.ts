/** Only public, non-personal context belongs in enquiry routing fields. */
export const ENQUIRY_INTENTS = {
  consultation: "Product consultation",
  "software-demo": "Software demo",
  "product-quote": "Product quote",
  "fleet-quote": "Fleet or dealer quote",
  "mobile-access": "Mobile app access",
  support: "Existing customer support",
} as const;

export type EnquiryIntent = keyof typeof ENQUIRY_INTENTS;
export type EnquiryContext = { intent: EnquiryIntent; product: string; source: string };

const sources: Record<string, string> = {
  home: "/", software: "/software", products: "/products", store: "/shop-now",
  about: "/about", contact: "/contact",
};
const products = new Set([
  "g17-gps-tracker", "gs900-4g-gps-tracker", "bt50-vehicle-gps-tracker",
  "ev02-gps-tracker", "ai-dash-camera", "fuel-monitoring-sensor", "smart-e-lock",
]);

export function normalizeEnquiryContext(value: Record<string, unknown>): EnquiryContext {
  const intent = typeof value.intent === "string" && Object.hasOwn(ENQUIRY_INTENTS, value.intent)
    ? value.intent as EnquiryIntent : "consultation";
  const product = typeof value.product === "string" && products.has(value.product) ? value.product : "";
  const sourceKey = typeof value.source === "string" && Object.hasOwn(sources, value.source) ? value.source : "contact";
  return { intent, product, source: sources[sourceKey] };
}

export function enquirySourceKey(path: string): string {
  if (path.startsWith("/products/") && products.has(path.slice(10))) return "products";
  return Object.entries(sources).find(([, value]) => value === path)?.[0] ?? "contact";
}

export const ATTRIBUTION_STORAGE_KEY = "navii_enquiry_attribution";
export const ANALYTICS_CONSENT_KEY = "navii_analytics_consent";
const campaignKeys = ["utm_source", "utm_medium"] as const;
// Finite, non-personal reporting categories only. Never accept arbitrary campaign
// names or identifiers. Add campaign codes only after business review.
const attributionValues = {
  utm_source: new Set(["google", "bing", "facebook", "instagram", "youtube", "linkedin", "whatsapp", "email", "direct"]),
  utm_medium: new Set(["organic", "search", "cpc", "ppc", "paid-search", "paid_search", "paid-social", "paid_social", "social", "email", "referral", "display", "qr"]),
};
export type CampaignAttribution = Partial<Record<typeof campaignKeys[number] | "landing_path", string>>;

export function normalizeAttribution(value: unknown): CampaignAttribution {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const result: CampaignAttribution = {};
  for (const key of campaignKeys) {
    const item = input[key];
    if (typeof item === "string" && item.length <= 16 && attributionValues[key].has(item.toLowerCase())) {
      result[key] = item.toLowerCase();
    }
  }
  const path = input.landing_path;
  if (typeof path === "string" && (Object.values(sources).includes(path)
    || (path.startsWith("/products/") && products.has(path.slice(10))))) result.landing_path = path;
  return result;
}

export function readCampaignAttribution(): CampaignAttribution {
  try {
    if (window.localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted") return {};
    return normalizeAttribution(JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "{}"));
  } catch { return {}; }
}

export function captureCampaignAttribution(): void {
  try {
    if (window.localStorage.getItem(ANALYTICS_CONSENT_KEY) !== "granted") {
      window.sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
      return;
    }
    if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;
    const query = new URLSearchParams(window.location.search);
    const context = normalizeAttribution({
      ...Object.fromEntries(campaignKeys.map((key) => [key, query.get(key)])),
      landing_path: window.location.pathname,
    });
    if (context.landing_path && campaignKeys.some((key) => context[key])) {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(context));
    }
  } catch { /* Storage is optional; the enquiry continues without attribution. */ }
}

export function clearCampaignAttribution(): void {
  try { window.sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY); } catch { /* Optional storage. */ }
}
