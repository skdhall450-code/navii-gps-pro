/**
 * NAVII GPS subscription catalog (proposal, not deployed).
 * Rates are INR base platform amounts per vehicle per YEAR, exclusive of GST.
 * This module does not apply entitlements, charge customers, or send device commands.
 */
export type SubscriptionPlanCode = "LITE" | "BASIC" | "PRO" | "PRO_MAX";
export type MapProvider = "OPENSTREETMAP" | "GOOGLE_MAPS";
export type SupportTier = "STANDARD" | "VIP" | "DEDICATED_PROPOSED";
export type ReportingInterval = { movingSeconds: number; parkedSeconds: number };
export type SubscriptionPlan = Readonly<{
  code: SubscriptionPlanCode;
  annualPricePaisePerVehicle: number;
  currency: "INR";
  maxNamedUsers: number | null;
  completedMonthsHistory: number;
  includeCurrentMonth: true;
  mapProvider: MapProvider;
  reportingInterval: ReportingInterval | "DEVICE_CONFIGURABLE_PROPOSED";
  standardReports: "LIMITED" | "MAJORITY" | "ALL" | "ALL_PLUS_CUSTOM";
  alerts: "LIMITED" | "ALL" | "ALL_PLUS_AI_PROPOSED";
  support: SupportTier;
  status: "SPEC_ONLY";
}>;
export const NAVII_PLANS: Readonly<Record<SubscriptionPlanCode, SubscriptionPlan>> = {
  LITE: { code: "LITE", annualPricePaisePerVehicle: 10000, currency: "INR", maxNamedUsers: 1,
    completedMonthsHistory: 1, includeCurrentMonth: true, mapProvider: "OPENSTREETMAP",
    reportingInterval: { movingSeconds: 30, parkedSeconds: 3600 }, standardReports: "LIMITED",
    alerts: "LIMITED", support: "STANDARD", status: "SPEC_ONLY" },
  BASIC: { code: "BASIC", annualPricePaisePerVehicle: 15000, currency: "INR", maxNamedUsers: 3,
    completedMonthsHistory: 3, includeCurrentMonth: true, mapProvider: "GOOGLE_MAPS",
    reportingInterval: { movingSeconds: 10, parkedSeconds: 300 }, standardReports: "MAJORITY",
    alerts: "LIMITED", support: "STANDARD", status: "SPEC_ONLY" },
  PRO: { code: "PRO", annualPricePaisePerVehicle: 20000, currency: "INR", maxNamedUsers: null,
    completedMonthsHistory: 24, includeCurrentMonth: true, mapProvider: "GOOGLE_MAPS",
    reportingInterval: { movingSeconds: 10, parkedSeconds: 300 }, standardReports: "ALL",
    alerts: "ALL", support: "VIP", status: "SPEC_ONLY" },
  PRO_MAX: { code: "PRO_MAX", annualPricePaisePerVehicle: 25000, currency: "INR", maxNamedUsers: null,
    completedMonthsHistory: 36, includeCurrentMonth: true, mapProvider: "GOOGLE_MAPS",
    reportingInterval: "DEVICE_CONFIGURABLE_PROPOSED", standardReports: "ALL_PLUS_CUSTOM",
    alerts: "ALL_PLUS_AI_PROPOSED", support: "DEDICATED_PROPOSED", status: "SPEC_ONLY" }
};
export function annualBaseChargePaise(plan: SubscriptionPlanCode, vehicles: number): number {
  if (!Number.isSafeInteger(vehicles) || vehicles < 1) throw new RangeError("vehicles must be a positive safe integer");
  const price = NAVII_PLANS[plan]?.annualPricePaisePerVehicle;
  if (price === undefined) throw new RangeError("unknown plan");
  const total = vehicles * price;
  if (!Number.isSafeInteger(total)) throw new RangeError("charge exceeds safe integer range");
  return total;
}
