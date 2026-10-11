export const REPORT_TIMEZONES = ["Asia/Kolkata", "UTC"] as const;
export type ReportTimezone = typeof REPORT_TIMEZONES[number];
export type ReportPreset = "TODAY" | "LAST_7_DAYS" | "THIS_MONTH" | "CUSTOM";
export type ReportKind = "ACTIVITY" | "ALERTS";
export type ReportFilters = { vehicleId: string; fromLocal: string; toLocal: string; timezone: ReportTimezone; preset: ReportPreset; kind: ReportKind };
const MINUTE = 60_000;
const DAY = 86_400_000;
const offset = (zone: ReportTimezone) => zone === "Asia/Kolkata" ? 330 * MINUTE : 0;

export function localDateTime(timestamp: number, zone: ReportTimezone): string {
  return new Date(timestamp + offset(zone)).toISOString().slice(0, 16);
}

export function localToIso(value: string, zone: ReportTimezone): string {
  if (!REPORT_TIMEZONES.includes(zone)) throw new Error("Choose a supported timezone.");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("Enter a complete date and time.");
  const parsed = Date.parse(value + ":00.000Z");
  if (!Number.isFinite(parsed) || new Date(parsed).toISOString().slice(0, 16) !== value) throw new Error("Enter a valid date and time.");
  return new Date(parsed - offset(zone)).toISOString();
}

export function presetRange(preset: Exclude<ReportPreset, "CUSTOM">, zone: ReportTimezone, now = Date.now()) {
  const shifted = new Date(now + offset(zone));
  const dayStart = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
  const start = preset === "LAST_7_DAYS" ? dayStart - 6 * DAY : preset === "THIS_MONTH" ? Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), 1) : dayStart;
  return { fromLocal: new Date(start).toISOString().slice(0, 16), toLocal: new Date(dayStart + DAY).toISOString().slice(0, 16) };
}

export function reportQuery(filters: ReportFilters): string {
  if (!filters.vehicleId.trim()) throw new Error("Choose a vehicle first.");
  const from = localToIso(filters.fromLocal, filters.timezone);
  const to = localToIso(filters.toLocal, filters.timezone);
  const duration = Date.parse(to) - Date.parse(from);
  if (duration <= 0) throw new Error("End time must be after start time.");
  if (duration > 31 * DAY) throw new Error("Choose a period of 31 days or less.");
  return new URLSearchParams({ from, to, timezone: filters.timezone, limit: filters.kind === "ACTIVITY" ? "20000" : "500" }).toString();
}

export function formatReportTime(value: string | null | undefined, timezone: ReportTimezone) {
  if (!value || !Number.isFinite(Date.parse(value))) return "Unavailable";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: timezone }).format(new Date(value));
}

export function durationLabel(seconds: number | null | undefined) {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) return "Unavailable";
  const rounded = Math.round(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m ${rounded % 60}s` : `${rounded}s`;
}

// Spreadsheet formula injection prevention applies to every exported cell.
export function csvCell(value: unknown) {
  let text = value === null || value === undefined ? "" : String(value);
  if (typeof value === "string" && /^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function csvRows(rows: unknown[][]) { return "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n"); }

export type ReportPosition = { id: string; latitude: number | null; longitude: number | null; speed: number | null; ignition: boolean | null; battery: number | null; recordedAt: string };
export type ActivityReport = {
  definitionsVersion?: string;
  vehicle: { id: string; vehicleNo: string; name: string | null };
  period: { from: string; to: string; timezone?: string };
  summary: { totalPoints: number; totalDistanceKm: number; maxSpeedKph: number | null; averageSpeedKph: number | null; runningSeconds: number; idleSeconds: number; parkedSeconds: number; unknownSeconds: number; ignitionOnSeconds: number; ignitionOffSeconds: number; ignitionUnknownSeconds: number };
  coverage: { requestedSeconds: number; coveredSeconds: number; unobservedSeconds: number; coveragePercent: number; distanceObservedSeconds: number; complete: boolean; dataComplete: boolean; distanceComplete: boolean; truncated: boolean; pathTruncated: boolean; pointLimit: number; firstRecordedAt: string | null; lastRecordedAt: string | null; gapCount: number; gapSeconds: number; invalidPointCount?: number; duplicatePointCount?: number; distanceRejectedSegments: number };
  positions: ReportPosition[];
};

export function isActivityReport(value: unknown): value is ActivityReport {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<ActivityReport>;
  const finite = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;
  return !!data.vehicle && typeof data.vehicle.id === "string" && typeof data.vehicle.vehicleNo === "string" && !!data.period &&
    Number.isFinite(Date.parse(data.period.from)) && Number.isFinite(Date.parse(data.period.to)) && !!data.summary &&
    [data.summary.totalPoints, data.summary.totalDistanceKm, data.summary.runningSeconds, data.summary.idleSeconds, data.summary.parkedSeconds, data.summary.unknownSeconds].every(finite) &&
    [data.summary.maxSpeedKph, data.summary.averageSpeedKph].every(v => v === null || finite(v)) &&
    !!data.coverage && [data.coverage.requestedSeconds, data.coverage.coveredSeconds, data.coverage.unobservedSeconds, data.coverage.coveragePercent, data.coverage.gapCount].every(finite) &&
    typeof data.coverage.distanceComplete === "boolean" && typeof data.coverage.complete === "boolean" && typeof data.coverage.dataComplete === "boolean" &&
    typeof data.coverage.truncated === "boolean" && typeof data.coverage.pathTruncated === "boolean" && Array.isArray(data.positions) &&
    data.positions.every(p => p && typeof p.id === "string" && Number.isFinite(Date.parse(p.recordedAt)) &&
      (p.latitude === null || (typeof p.latitude === "number" && Number.isFinite(p.latitude) && Math.abs(p.latitude) <= 90)) &&
      (p.longitude === null || (typeof p.longitude === "number" && Number.isFinite(p.longitude) && Math.abs(p.longitude) <= 180)) &&
      (p.speed === null || finite(p.speed)) && (p.ignition === null || typeof p.ignition === "boolean") && (p.battery === null || finite(p.battery)));
}

export function activityCsv(report: ActivityReport, filters: ReportFilters) {
  const c = report.coverage;
  return csvRows([
    ["NAVII GPS activity report"], ["Vehicle", report.vehicle.vehicleNo],
    ["Timezone", filters.timezone], ["From inclusive", report.period.from], ["To exclusive", report.period.to],
    ["Observed coverage percent", c.coveragePercent], ["Unobserved seconds", c.unobservedSeconds],
    ["Activity coverage complete", c.complete], ["Stored data complete", c.dataComplete],
    ["Distance coverage complete", c.distanceComplete], ["Rejected distance segments", c.distanceRejectedSegments],
    ["Distance observed seconds", c.distanceObservedSeconds],
    ["Aggregation truncated", c.truncated], ["Export path truncated", c.pathTruncated],
    ["Distance basis", "Estimated GPS distance; not odometer"], ["GPS distance km", c.distanceObservedSeconds > 0 ? report.summary.totalDistanceKm : "Unavailable"],
    ["Moving seconds", report.summary.runningSeconds], ["Engine-on idle seconds", report.summary.idleSeconds],
    ["Parked seconds", report.summary.parkedSeconds], ["Unknown state seconds", report.summary.unknownSeconds],
    ["Average speed basis", "Time-weighted over observed valid intervals"], ["Average speed km/h", report.summary.averageSpeedKph], [],
    ["Recorded at UTC", `Recorded at (${filters.timezone})`, "Latitude", "Longitude", "Reported speed km/h", "Ignition", "Battery V"],
    ...report.positions.map(p => [p.recordedAt, formatReportTime(p.recordedAt, filters.timezone), p.latitude, p.longitude, p.speed, p.ignition === null ? "Unknown" : p.ignition ? "On" : "Off", p.battery]),
  ]);
}
