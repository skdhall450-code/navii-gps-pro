export const ALERT_POLICY_TYPES = [
  "OVERSPEED",
  "GEOFENCE_ENTRY",
  "GEOFENCE_EXIT",
  "IGNITION",
  "SOS",
  "POWER_CUT",
  "OFFLINE",
] as const;
export const ALERT_POLICY_PRIORITIES = [
  "INFO",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;
export type AlertPolicyInput = {
  name: string;
  type: (typeof ALERT_POLICY_TYPES)[number];
  vehicleId: string;
  priority: (typeof ALERT_POLICY_PRIORITIES)[number];
  cooldownMinutes: number;
  scheduleMode: "DAILY_WINDOW";
  timeZone: string;
  startMinute: number;
  endMinute: number;
  enabled: boolean;
  emailEnabled: false;
  whatsappEnabled: false;
  pushEnabled: false;
};
export type AlertPolicy = AlertPolicyInput & {
  id: string;
  revision: number;
  updatedAt: string;
  vehicle: { id: string; vehicleNo: string; name: string | null };
};
export type PolicyVehicle = AlertPolicy["vehicle"];
export const blankAlertPolicy = (): AlertPolicyInput => ({
  name: "",
  type: "OVERSPEED",
  vehicleId: "",
  priority: "HIGH",
  cooldownMinutes: 5,
  scheduleMode: "DAILY_WINDOW",
  timeZone: "Asia/Kolkata",
  startMinute: 540,
  endMinute: 1080,
  enabled: false,
  emailEnabled: false,
  whatsappEnabled: false,
  pushEnabled: false,
});
export function minuteToTime(minute: number): string {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}
export function timeToMinute(time: string): number {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) return NaN;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
export function validateAlertPolicy(input: AlertPolicyInput): string | null {
  if (
    !input.name.trim() ||
    input.name.trim().length > 80 ||
    /[\u0000-\u001f\u007f]/.test(input.name)
  )
    return "Enter an alert name of 1–80 characters without control characters.";
  if (!ALERT_POLICY_TYPES.includes(input.type))
    return "Choose a supported event type.";
  if (!input.vehicleId || input.vehicleId.length > 100)
    return "Choose a vehicle.";
  if (!ALERT_POLICY_PRIORITIES.includes(input.priority))
    return "Choose a priority.";
  if (
    !Number.isInteger(input.cooldownMinutes) ||
    input.cooldownMinutes < 1 ||
    input.cooldownMinutes > 10080
  )
    return "Cooldown must be a whole number from 1 to 10,080 minutes.";
  if (input.scheduleMode !== "DAILY_WINDOW")
    return "Only a daily time window is supported.";
  if (!input.timeZone || input.timeZone.length > 100)
    return "Enter a valid IANA timezone, for example Asia/Kolkata.";
  try {
    new Intl.DateTimeFormat("en", { timeZone: input.timeZone });
  } catch {
    return "Enter a valid IANA timezone, for example Asia/Kolkata.";
  }
  if (
    ![input.startMinute, input.endMinute].every(
      (value) => Number.isInteger(value) && value >= 0 && value < 1440,
    )
  )
    return "Enter a valid start and end time.";
  if (input.startMinute === input.endMinute)
    return "Start and end times must differ. Equal times do not mean all day.";
  if (typeof input.enabled !== "boolean")
    return "Choose whether this configuration is enabled.";
  if (
    input.emailEnabled !== false ||
    input.whatsappEnabled !== false ||
    input.pushEnabled !== false
  )
    return "External notifications must remain off.";
  return null;
}

export class AlertPolicyRequestError extends Error {
  uncertain: boolean;
  constructor(message: string, uncertain = false) {
    super(message);
    this.name = "AlertPolicyRequestError";
    this.uncertain = uncertain;
  }
}

/** Missing/malformed success, network interruption and server errors may follow a committed write. */
export function policyWriteMayHaveCommitted(status?: number): boolean {
  return (
    status === undefined || status >= 500 || (status >= 200 && status < 300)
  );
}

export type PolicySaveRecoveryEvent =
  "UNCERTAIN_FAILURE" | "CANCEL" | "REFRESH_FAILED" | "REFRESH_SUCCEEDED";
/** Closing the editor or a failed read never unlocks an uncertain write. */
export function nextPolicySaveUncertainty(
  current: boolean,
  event: PolicySaveRecoveryEvent,
): boolean {
  if (event === "UNCERTAIN_FAILURE") return true;
  if (event === "REFRESH_SUCCEEDED") return false;
  return current;
}
