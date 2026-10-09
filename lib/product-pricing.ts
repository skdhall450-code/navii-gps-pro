import type { ProductPricing } from "../components/products/data/productsData";

const inrToPaise = (amount: number) => {
  const paise = Math.round(amount * 100);
  if (!Number.isFinite(amount) || amount < 0 || !Number.isSafeInteger(paise)) {
    throw new RangeError("Prices must be non-negative amounts in INR.");
  }
  return paise;
};

export const formatInrPaise = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(paise / 100);

/** The quoted GST-inclusive bundle is authoritative; round tax per bundle, then multiply. */
export function getProductPriceBreakdown(pricing: ProductPricing, quantity = 1) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new RangeError("Quantity must be a positive safe integer.");
  }
  if (!Number.isFinite(pricing.gstRatePercent) || pricing.gstRatePercent < 0) {
    throw new RangeError("GST rate must be non-negative.");
  }
  const devicePaise = inrToPaise(pricing.deviceSaleInr);
  const simAnnualPaise = inrToPaise(pricing.airtelSimMonthlyInr) * 12;
  const platformAnnualPaise = inrToPaise(pricing.platformAnnualInr);
  const firstYearPaise = inrToPaise(pricing.firstYearTotalInr);
  const subtotalPaise = devicePaise + simAnnualPaise + platformAnnualPaise;
  const gstPaise = Math.round(firstYearPaise * pricing.gstRatePercent / (100 + pricing.gstRatePercent));
  const renewalSubtotalPaise = simAnnualPaise + platformAnnualPaise;
  const renewalGstPaise = Math.round(renewalSubtotalPaise * pricing.gstRatePercent / 100);
  if (subtotalPaise + gstPaise !== firstYearPaise) {
    throw new RangeError("Bundle components must match the quoted GST-inclusive price.");
  }
  if (!Number.isSafeInteger(firstYearPaise * quantity)) {
    throw new RangeError("Quantity exceeds supported price precision.");
  }
  return {
    quantity,
    devicePaise: devicePaise * quantity,
    simAnnualPaise: simAnnualPaise * quantity,
    platformAnnualPaise: platformAnnualPaise * quantity,
    subtotalPaise: subtotalPaise * quantity,
    gstPaise: gstPaise * quantity,
    firstYearPaise: firstYearPaise * quantity,
    renewalSubtotalPaise: renewalSubtotalPaise * quantity,
    renewalGstPaise: renewalGstPaise * quantity,
    renewalAnnualPaise: (renewalSubtotalPaise + renewalGstPaise) * quantity,
  };
}
