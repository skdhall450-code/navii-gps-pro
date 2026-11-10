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
  const params = new URLSearchParams({ from, to, timezone: filters.timezone, limit: filters.kind === "ACTIVITY" ? "20000" : "500" });
  if (filters.kind === "ALERTS") params.set("alertContract", ALERT_CONTRACT_VERSION);
  return params.toString();
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

export type HistoricalIgnition = { ignition?: boolean | null; ignitionSource?: string | null; ignitionObservedAt?: string | null; recordedAt: string };
// Historical freshness is relative to this row, never the browser's current clock.
// Match the current ACC contract's five-minute window / thirty-second clock tolerance.
export function historicalIgnitionLabel(position: HistoricalIgnition): 'ON' | 'OFF' | 'Stale' | 'Unavailable' {
  const recordedAt = typeof position.recordedAt === 'string' ? Date.parse(position.recordedAt) : NaN;
  const observedAt = typeof position.ignitionObservedAt === 'string' ? Date.parse(position.ignitionObservedAt) : NaN;
  if (typeof position.ignition !== 'boolean' || position.ignitionSource !== 'ACC' ||
    !Number.isFinite(recordedAt) || !Number.isFinite(observedAt) || observedAt > recordedAt + 30_000) return 'Unavailable';
  if (recordedAt - observedAt > 300_000) return 'Stale';
  return position.ignition ? 'ON' : 'OFF';
}
export const ENGINE_TOTALS_UNAVAILABLE = 'Engine-derived activity totals are unavailable because the report does not verify ACC observations across the aggregated period. GPS coverage does not establish ignition coverage.';

export type ReportPosition = HistoricalIgnition & { id: string; latitude: number | null; longitude: number | null; speed: number | null; ignition: boolean | null; battery: number | null; recordedAt: string };
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
    ["Engine-derived activity basis", ENGINE_TOTALS_UNAVAILABLE],
    ["Moving seconds", "Unavailable"], ["Engine-on idle seconds", "Unavailable"],
    ["Parked seconds", "Unavailable"], ["Unknown state seconds", "Unavailable"],
    ["Average speed basis", "Time-weighted over observed valid intervals"], ["Average speed km/h", report.summary.averageSpeedKph], [],
    ["Recorded at UTC", `Recorded at (${filters.timezone})`, "Latitude", "Longitude", "Reported speed km/h", "Ignition", "Battery V"],
    ...report.positions.map(p => [p.recordedAt, formatReportTime(p.recordedAt, filters.timezone), p.latitude, p.longitude, p.speed, historicalIgnitionLabel(p), p.battery]),
  ]);
}


export const ALERT_CONTRACT_VERSION = "source-records-v1";
export const ALERT_SOURCES = ["LEGACY_ALERT", "CUSTOMER_ALERT_EVENT"] as const;
export type AlertSource = typeof ALERT_SOURCES[number];
export type AlertResolution = "OPEN" | "RESOLVED" | "UNAVAILABLE";
export type AlertRecord = { id: string; sourceId: string; type: string; message: string; reportTime: string; storedAt: string; resolutionStatus: AlertResolution; resolvedAt: string | null };
export type AlertSourceReport = {
  source: AlertSource; timeBasis: "CREATED_AT" | "OBSERVED_AT"; scope: "CURRENT_VEHICLE_ACCESS" | "CURRENT_CUSTOMER_ASSIGNMENT";
  coverage: { pointLimit: number; returnedCount: number; truncated: boolean; dataComplete: boolean; complete: boolean };
  data: AlertRecord[];
};
export type AlertReport = {
  success: true; status: "available"; definitionsVersion: "2026-10-11"; alertContractVersion: typeof ALERT_CONTRACT_VERSION;
  vehicle: { id: string; vehicleNo: string; name: string | null };
  period: { from: string; to: string; timezone: ReportTimezone; endExclusive: true; defaulted: false };
  sources: AlertSourceReport[];
};
export const ALERT_RECORDS_NOTICE = "Stored records, not unique incidents. The two streams may overlap and are not deduplicated. These records do not establish complete real-world alert history or notification delivery. Event capture or evaluation may be disabled; stored query completeness does not prove that capture or evaluation was active.";
export const ALERT_SOURCE_LABELS: Record<AlertSource, { title: string; timeBasis: string; scope: string }> = {
  LEGACY_ALERT: { title: "Legacy alerts", timeBasis: "Created time (stored record creation)", scope: "Current vehicle access. Legacy records are vehicle-linked; ownership at the time of each record is not established. Legacy records only; customer alert events are shown separately." },
  CUSTOMER_ALERT_EVENT: { title: "Customer alert events", timeBasis: "Observed time (telemetry observation)", scope: "Current customer assignment only. Prior customer assignments are omitted. No current customer assignment returns no records. Resolution status is unavailable for this source." },
};
export function alertResolutionLabel(status: AlertResolution) { return status === "OPEN" ? "Open" : status === "RESOLVED" ? "Resolved" : "Unavailable"; }
export function filterAlertRecords(records: AlertRecord[], query: string, status: AlertResolution | "ALL" = "ALL") {
  return records.filter(row => (status === "ALL" || row.resolutionStatus === status) &&
    [row.type, row.message, alertResolutionLabel(row.resolutionStatus), row.reportTime, row.storedAt].join(" ").toLowerCase().includes(query.toLowerCase()));
}
// This validator is the negotiated wire boundary. Missing/old/partial metadata must not become a success view.
export function isAlertReport(value: unknown, filters: ReportFilters): value is AlertReport {
  const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
  const iso = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString() === v;
  const text = (v: unknown): v is string => typeof v === "string" && v.length > 0;
  let query: URLSearchParams;
  try { query = new URLSearchParams(reportQuery(filters)); } catch { return false; }
  if (filters.kind !== "ALERTS" || !object(value) || value.success !== true || value.status !== "available" ||
    value.definitionsVersion !== "2026-10-11" || value.alertContractVersion !== ALERT_CONTRACT_VERSION ||
    !object(value.vehicle) || value.vehicle.id !== filters.vehicleId || !text(value.vehicle.vehicleNo) ||
    !(value.vehicle.name === null || typeof value.vehicle.name === "string") || !object(value.period) ||
    value.period.from !== query.get("from") || value.period.to !== query.get("to") ||
    value.period.timezone !== filters.timezone || value.period.endExclusive !== true || value.period.defaulted !== false ||
    !Array.isArray(value.sources) || value.sources.length !== ALERT_SOURCES.length) return false;
  const from = Date.parse(query.get("from")!); const to = Date.parse(query.get("to")!);
  const seenSources = new Set<string>();
  return value.sources.every(source => {
    if (!object(source) || !ALERT_SOURCES.includes(source.source as AlertSource) || seenSources.has(source.source as string)) return false;
    seenSources.add(source.source as string);
    const legacy = source.source === "LEGACY_ALERT";
    if (source.timeBasis !== (legacy ? "CREATED_AT" : "OBSERVED_AT") || source.scope !== (legacy ? "CURRENT_VEHICLE_ACCESS" : "CURRENT_CUSTOMER_ASSIGNMENT") ||
      !object(source.coverage) || !Array.isArray(source.data)) return false;
    const c = source.coverage;
    if (c.pointLimit !== Number(query.get("limit")) || !Number.isSafeInteger(c.returnedCount) || c.returnedCount !== source.data.length ||
      source.data.length > Number(c.pointLimit) || typeof c.truncated !== "boolean" ||
      c.dataComplete !== !c.truncated || c.complete !== !c.truncated || (c.truncated && source.data.length !== c.pointLimit)) return false;
    const seenIds = new Set<string>();
    let previous: { time: number; id: string } | undefined;
    return source.data.every(row => {
      if (!object(row) || !text(row.sourceId) || row.id !== `${source.source}:${row.sourceId}` || seenIds.has(row.sourceId) ||
        !text(row.type) || typeof row.message !== "string" || !iso(row.reportTime) || !iso(row.storedAt) ||
        !(row.resolvedAt === null || iso(row.resolvedAt))) return false;
      const time = Date.parse(row.reportTime);
      if (time < from || time >= to || (previous && (time > previous.time || (time === previous.time && row.sourceId <= previous.id)))) return false;
      if (legacy ? (row.storedAt !== row.reportTime || !["OPEN", "RESOLVED"].includes(row.resolutionStatus as string) || (row.resolutionStatus === "OPEN" && row.resolvedAt !== null)) :
        (row.resolutionStatus !== "UNAVAILABLE" || row.resolvedAt !== null)) return false;
      seenIds.add(row.sourceId); previous = { time, id: row.sourceId };
      return true;
    });
  });
}
export function alertsCsv(report: AlertReport, filters: ReportFilters) {
  return csvRows([
    ["NAVII GPS alert source records"], ["Vehicle", report.vehicle.vehicleNo], ["Timezone", filters.timezone],
    ["From inclusive", report.period.from], ["To exclusive", report.period.to],
    ["Alert contract", report.alertContractVersion], ["Definitions version", report.definitionsVersion],
    ["Record interpretation", ALERT_RECORDS_NOTICE], ["Export scope", "All returned records from both sources, regardless of screen search, status filter or page"],
    ...report.sources.flatMap(source => {
      const labels = ALERT_SOURCE_LABELS[source.source]; const c = source.coverage;
      return [[], ["Source", source.source, labels.title], ["Time basis", source.timeBasis, labels.timeBasis], ["Access scope", source.scope, labels.scope],
        ["Stored records returned", c.returnedCount], ["Per-source record limit", c.pointLimit], ["Stored query truncated", c.truncated],
        ["Stored query complete", c.complete], ["Stored data complete", c.dataComplete],
        ["Coverage note", c.truncated ? "Record limit reached; omitted records remain. Choose a shorter period." : "All stored records matching this source scope and time basis at generation are returned; this is not complete real-world history."],
        ["Source", "Time basis", "Scope", "Namespaced ID", "Source ID", "Report time UTC", `Report time (${filters.timezone})`, "Stored at UTC", "Type", "Message", "Resolution status", "Resolved at UTC"],
        ...source.data.map(row => [source.source, source.timeBasis, source.scope, row.id, row.sourceId, row.reportTime, formatReportTime(row.reportTime, filters.timezone), row.storedAt, row.type, row.message, alertResolutionLabel(row.resolutionStatus), row.resolvedAt]),
      ];
    }),
  ]);
}
