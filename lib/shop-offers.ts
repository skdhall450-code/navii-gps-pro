/** Owner-supplied offers, 25 October 2026. Prices below exclude GST. */
export type ShopOffer = {
  id: string;
  name: string;
  category: string;
  mrpInr?: number;
  image?: string;
  productHref?: string;
  variants: { id: string; label: string; baseInr: number }[];
};

export const shopOffers: ShopOffer[] = [
  {
    id: "bt50", name: "BT-50 GPS", category: "GPS device", mrpInr: 3000,
    image: "/assets/products/bt50/main.png", productHref: "/products/bt50-vehicle-gps-tracker",
    variants: [{ id: "device", label: "Device price", baseInr: 1200 }],
  },
  {
    id: "gx03", name: "GX03 GPS", category: "GPS device", mrpInr: 3500,
    variants: [{ id: "device", label: "Device price", baseInr: 1500 }],
  },
  {
    id: "gs900", name: "GS900 GPS", category: "GPS device", mrpInr: 3500,
    image: "/assets/products/gs900/main.png", productHref: "/products/gs900-4g-gps-tracker",
    variants: [{ id: "device", label: "Device price", baseInr: 1500 }],
  },
  {
    id: "s15", name: "S-15 Magnetic GPS", category: "Wireless GPS", mrpInr: 5600,
    variants: [{ id: "device", label: "Device price", baseInr: 3000 }],
  },
  {
    id: "ais140", name: "AIS 140", category: "Validity options",
    variants: [
      { id: "one-year", label: "1-year validity", baseInr: 5000 },
      { id: "two-years", label: "2-year validity", baseInr: 6500 },
    ],
  },
];

export const SHOP_GST_PERCENT = 18;
export const SHOP_WHATSAPP = "917717394007";

export function getShopOfferPrice(baseInr: number) {
  const basePaise = Math.round(baseInr * 100);
  if (!Number.isFinite(baseInr) || baseInr < 0 || !Number.isSafeInteger(basePaise)) {
    throw new RangeError("Invalid device price.");
  }
  const gstPaise = Math.round(basePaise * SHOP_GST_PERCENT / 100);
  const totalPaise = basePaise + gstPaise;
  if (!Number.isSafeInteger(totalPaise)) throw new RangeError("Price exceeds supported precision.");
  return { basePaise, gstPaise, totalPaise };
}

export function getShopEnquiryUrl(offer: ShopOffer, variant: ShopOffer["variants"][number]) {
  const price = getCompleteShopPrice(variant.baseInr);
  const money = (paise: number) => `INR ${(paise / 100).toFixed(2)}`;
  const chargeSummary = price.charges.map(charge => `${charge.label}: ${money(charge.basePaise)} + GST ${money(charge.gstPaise)}`).join("; ");
  const message = `Hello NAVII GPS, I am interested in ${offer.name} (${variant.label}). Device: ${money(price.device.basePaise)} + GST ${money(price.device.gstPaise)}. ${chargeSummary}. Total including 18% GST and these charges: ${money(price.totalPaise)}. Please confirm availability, exact service/validity inclusions, installation charges and final order details. No payment has been made.`;

  return `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export const SHOP_CHARGES = [
  { id: "sim", label: "Airtel SIM · 12 months", baseInr: 45 * 12 },
  { id: "platform", label: "Software platform fee", baseInr: 150 },
  { id: "shipping", label: "Shipping & handling", baseInr: 250 },
] as const;

export function getCompleteShopPrice(deviceBaseInr: number) {
  const device = getShopOfferPrice(deviceBaseInr);
  const charges = SHOP_CHARGES.map(charge => ({ ...charge, ...getShopOfferPrice(charge.baseInr) }));
  const extraBasePaise = charges.reduce((sum, charge) => sum + charge.basePaise, 0);
  const extraGstPaise = charges.reduce((sum, charge) => sum + charge.gstPaise, 0);
  const basePaise = device.basePaise + extraBasePaise;
  const gstPaise = device.gstPaise + extraGstPaise;
  const totalPaise = basePaise + gstPaise;
  if (!Number.isSafeInteger(totalPaise)) throw new RangeError("Price exceeds supported precision.");
  return { device, charges, extraBasePaise, extraGstPaise, extraTotalPaise: extraBasePaise + extraGstPaise, basePaise, gstPaise, totalPaise };
}
