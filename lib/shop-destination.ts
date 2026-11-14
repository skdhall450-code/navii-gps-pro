/** Approved public NAVII storefront; legacy shop pages remain available. */
export const NAVII_SHOP_URL = "https://navii-gps-public-v2.skdhall450.chatgpt.site/";

export function shopNavigationProps(href: string) {
  if (href !== "/shop-now") return { href };
  return {
    href: NAVII_SHOP_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    title: "Open NAVII Shop in a new tab",
  };
}
