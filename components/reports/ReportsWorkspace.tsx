"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowDownToLine, CalendarDays, FileBarChart, Loader2, Printer, Search } from "lucide-react";
import { activityCsv, csvRows, durationLabel, formatReportTime, isActivityReport, presetRange, reportQuery, type ActivityReport, type ReportFilters, type ReportPreset, type ReportTimezone } from "@/lib/report-workspace";

const API = (process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.naviigps.com").replace(/\/$/, "");
const input = "mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-[#091524] px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 disabled:opacity-50";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-40";
type Vehicle = { id: string; vehicleNo: string; name?: string | null };
type Alert = { id: string; type: string; message: string; isResolved: boolean; createdAt: string };
type AlertReport = { definitionsVersion: string; data: Alert[]; period: { from: string; to: string }; coverage: { pointLimit: number; returnedCount: number; truncated: boolean; dataComplete: boolean; complete: boolean } };
type Result = { filters: ReportFilters; vehicle: Vehicle; createdAt: string; activity?: ActivityReport; alerts?: AlertReport };

function hasAlertReport(value: unknown): value is AlertReport {
  if (!value || typeof value !== "object") return false;
  const r = value as Partial<AlertReport>;
  return r.definitionsVersion === "2026-10-11" && Array.isArray(r.data) && r.data.every(a => a && typeof a.id === "string" && typeof a.type === "string" && typeof a.message === "string" && typeof a.isResolved === "boolean" && Number.isFinite(Date.parse(a.createdAt))) && !!r.period && Number.isFinite(Date.parse(r.period.from)) && Number.isFinite(Date.parse(r.period.to)) && !!r.coverage && typeof r.coverage.truncated === "boolean";
}

export default function ReportsWorkspace() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({ vehicleId: "", ...presetRange("TODAY", "Asia/Kolkata"), timezone: "Asia/Kolkata", preset: "TODAY", kind: "ACTIVITY" });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [notice, setNotice] = useState("");
  const request = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const invalidatePending = useCallback(() => { request.current?.abort(); sequence.current++; }, []);

  useEffect(() => {
    const controller = new AbortController(); let alive = true;
    const token = localStorage.getItem("navii_access_token");
    if (!token) { router.replace("/login"); return; }
    const timer = setTimeout(() => controller.abort(), 20_000);
    async function load() {
      try {
        const response = await fetch(`${API}/api/gps/vehicles`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal, cache: "no-store" });
        if (response.status === 401) { router.replace("/login"); return; }
        if (!response.ok) throw new Error("Vehicle list could not be loaded. Refresh this page to try again.");
        const body = await response.json();
        if (!body.success || !Array.isArray(body.data)) throw new Error("Unexpected vehicle list. Refresh and try again.");
        const valid: Vehicle[] = body.data.filter((v: Vehicle) => v && typeof v.id === "string" && typeof v.vehicleNo === "string");
        if (!alive || controller.signal.aborted) return;
        setVehicles(valid);
        const requested = new URL(window.location.href).searchParams.get("vehicleId");
        setFilters(current => ({ ...current, vehicleId: valid.some(v => v.id === requested) ? requested! : valid.length === 1 ? valid[0].id : "" }));
      } catch (e) { if (alive) setError(controller.signal.aborted ? "Vehicle list timed out. Refresh this page to try again." : e instanceof Error ? e.message : "Unable to load vehicles."); }
      finally { clearTimeout(timer); if (alive) setVehiclesLoading(false); }
    }
    void load();
    return () => { alive = false; clearTimeout(timer); controller.abort(); invalidatePending(); };
  }, [router, invalidatePending]);

  function update(change: Partial<ReportFilters>) { setFilters(current => ({ ...current, ...change })); setNotice(""); }
  function selectPreset(preset: ReportPreset, timezone = filters.timezone) { update({ preset, timezone, ...(preset === "CUSTOM" ? {} : presetRange(preset, timezone)) }); }
  async function generate(event: React.FormEvent) {
    event.preventDefault(); let qs: string;
    try { qs = reportQuery(filters); } catch (e) { setError((e as Error).message); return; }
    const selected = vehicles.find(v => v.id === filters.vehicleId);
    if (!selected) { setError("Choose a vehicle available to your account."); return; }
    const token = localStorage.getItem("navii_access_token");
    if (!token) { router.replace("/login"); return; }
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    const id = ++sequence.current; const snapshot = { ...filters };
    const timer = setTimeout(() => controller.abort(), 30_000);
    setLoading(true); setError(""); setNotice("");
    try {
      const endpoint = snapshot.kind === "ACTIVITY" ? "trip" : "alerts";
      const response = await fetch(`${API}/api/gps/reports/v2/${endpoint}/${encodeURIComponent(snapshot.vehicleId)}?${qs}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: controller.signal });
      if (response.status === 401) { router.replace("/login"); return; }
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.success) throw new Error(response.status === 403 ? "This vehicle needs the right account access and an active subscription." : typeof body?.message === "string" ? body.message : "Report could not be generated. Try again.");
      if (id !== sequence.current || controller.signal.aborted) return;
      const expected = new URLSearchParams(qs);
      const returnedPeriod = snapshot.kind === "ACTIVITY" ? body.data?.period : body.period;
      if (returnedPeriod?.from !== expected.get("from") || returnedPeriod?.to !== expected.get("to")) throw new Error("Report dates do not match the request. Generate again.");
      if (snapshot.kind === "ACTIVITY") {
        if (!isActivityReport(body.data) || body.data.definitionsVersion !== "2026-10-11" || body.data.vehicle.id !== selected.id) throw new Error("The updated report service is required before accurate reports can be shown. Contact your administrator.");
        setResult({ filters: snapshot, vehicle: selected, createdAt: new Date().toISOString(), activity: body.data });
      } else {
        if (!hasAlertReport(body)) throw new Error("The updated report service is required to show report completeness. Contact your administrator.");
        setResult({ filters: snapshot, vehicle: selected, createdAt: new Date().toISOString(), alerts: body });
      }
      setQuery(""); setPage(0);
    } catch (e) { if (id === sequence.current) setError(controller.signal.aborted ? "Report timed out. Try a shorter period or generate again." : e instanceof Error ? e.message : "Report unavailable."); }
    finally { clearTimeout(timer); if (id === sequence.current) { setLoading(false); request.current = null; } }
  }
  function cancel() { sequence.current++; request.current?.abort(); request.current = null; setLoading(false); setNotice("Generation cancelled. Any earlier report below is unchanged."); }
  function download() {
    if (!result) return;
    const r = result;
    const csv = r.activity ? activityCsv(r.activity, r.filters) : csvRows([
      ["NAVII GPS alert history"], ["Vehicle", r.vehicle.vehicleNo], ["Timezone", r.filters.timezone], ["From inclusive", r.alerts!.period.from], ["To exclusive", r.alerts!.period.to], ["Truncated", r.alerts!.coverage.truncated], [],
      ["Recorded at UTC", `Recorded at (${r.filters.timezone})`, "Type", "Message", "Status"],
      ...r.alerts!.data.map(a => [a.createdAt, formatReportTime(a.createdAt, r.filters.timezone), a.type, a.message, a.isResolved ? "Resolved" : "Open"]),
    ]);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `navii-${r.filters.kind.toLowerCase()}-${r.vehicle.vehicleNo.replace(/[^a-zA-Z0-9_-]/g, "_")}-${r.filters.fromLocal.slice(0, 10)}.csv`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice("CSV download requested, including the generated dates and coverage details.");
  }
  const changed = !!result && JSON.stringify(result.filters) !== JSON.stringify(filters);
  const activity = result?.activity; const coverage = activity?.coverage;
  const positions = activity?.positions.filter(p => [p.recordedAt, p.latitude, p.longitude, p.speed].join(" ").toLowerCase().includes(query.toLowerCase())) ?? [];
  const alerts = result?.alerts?.data.filter(a => [a.type, a.message, a.isResolved ? "resolved" : "open"].join(" ").toLowerCase().includes(query.toLowerCase())) ?? [];
  const count = activity ? positions.length : alerts.length; const pages = Math.max(1, Math.ceil(count / 25)); const currentPage = Math.min(page, pages - 1);

  return <div className="navii-report-workspace mx-auto max-w-[1500px] p-4 text-slate-100 sm:p-6 lg:p-8">
    <style>{`@media print { body { background: white !important; } .navii-report-workspace, .navii-report-workspace * { color: #111 !important; background: white !important; box-shadow: none !important; border-color: #bbb !important; } .navii-report-workspace { padding: 0; } .navii-report-workspace table { min-width: 0; font-size: 10px; } }`}</style>
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">Fleet operations</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Reports</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Vehicle activity and alerts, with clear dates and honest data coverage.</p></div>{result && <div className="flex flex-wrap gap-2 print:hidden"><button className={button} onClick={download}><ArrowDownToLine size={16} />Download CSV</button><button className={button} onClick={() => window.print()}><Printer size={16} />Print summary</button></div>}</header>
    <form onSubmit={generate} className="rounded-2xl border border-white/10 bg-[#0a1426] p-4 sm:p-5 print:hidden">
      <fieldset disabled={vehiclesLoading}><legend className="text-base font-semibold">Choose your report</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">{([ ["ACTIVITY", "Vehicle activity", "GPS distance, movement, engine-on idle and parked time."], ["ALERTS", "Alert history", "Recorded alerts and their current resolution status."] ] as const).map(([kind, title, description]) => <label key={kind} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${filters.kind === kind ? "border-sky-400/60 bg-sky-500/10" : "border-white/10 hover:bg-white/5"}`}><input type="radio" name="report-kind" checked={filters.kind === kind} onChange={() => update({ kind })} className="mt-1 accent-sky-400" /><span><span className="block text-sm font-semibold">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-300">{description}</span></span></label>)}</div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <label className="text-sm font-medium text-slate-300">Vehicle<select value={filters.vehicleId} onChange={e => update({ vehicleId: e.target.value })} className={input} required><option value="">{vehiclesLoading ? "Loading vehicles…" : "Choose a vehicle"}</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNo}{v.name ? ` · ${v.name}` : ""}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-300">Period<select value={filters.preset} onChange={e => selectPreset(e.target.value as ReportPreset)} className={input}><option value="TODAY">Today</option><option value="LAST_7_DAYS">Last 7 days</option><option value="THIS_MONTH">This month</option><option value="CUSTOM">Custom dates</option></select></label>
          <label className="text-sm font-medium text-slate-300">Timezone<select value={filters.timezone} onChange={e => selectPreset(filters.preset, e.target.value as ReportTimezone)} className={input}><option value="Asia/Kolkata">India · IST (UTC+05:30)</option><option value="UTC">UTC (UTC+00:00)</option></select></label>
          <label className="text-sm font-medium text-slate-300">Start date & time<input type="datetime-local" value={filters.fromLocal} onChange={e => update({ fromLocal: e.target.value, preset: "CUSTOM" })} className={input} required /></label>
          <label className="text-sm font-medium text-slate-300">End date & time<input type="datetime-local" value={filters.toLocal} onChange={e => update({ toLocal: e.target.value, preset: "CUSTOM" })} className={input} required /></label>
        </div>
      </fieldset>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4"><p className="max-w-2xl text-xs leading-5 text-slate-400">Maximum 31 days. Start included; end excluded. Presets end at the next midnight. Unobserved time is shown separately.</p><div className="flex gap-2">{loading && <button type="button" className={button} onClick={cancel}>Cancel</button>}<button type="submit" disabled={loading || vehiclesLoading || !vehicles.length} className={button + " border-sky-400/50 bg-sky-500 text-slate-950 hover:bg-sky-400"}>{loading ? <Loader2 size={17} className="animate-spin" /> : <FileBarChart size={17} />}{loading ? "Generating…" : "Generate report"}</button></div></div>
    </form>
    {error && <div role="alert" className="mt-4 flex gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-200"><AlertTriangle size={20} className="mt-0.5 shrink-0" /><p>{error}{result ? " The earlier report remains below." : ""}</p></div>}
    {notice && <p role="status" className="mt-4 text-sm text-sky-200">{notice}</p>}
    {!vehiclesLoading && !vehicles.length && !error && <Empty title="No vehicles available" description="Ask your administrator to check your vehicle assignment and subscription. Reports only show vehicles you can access." />}
    {!result && vehicles.length > 0 && <Empty title="Your report starts here" description="Choose a vehicle and a date range, then generate a report. Nothing is sent or scheduled." />}
    {result && <section className="mt-6 space-y-5" aria-label="Generated report">
      {changed && <p role="status" className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200 print:hidden">Filters have changed. Generate again to update the report. Downloads use the dates below.</p>}
      <div className="border-b border-white/10 pb-4"><h2 className="text-xl font-semibold">{result.vehicle.vehicleNo} · {activity ? "Vehicle activity" : "Alert history"}</h2><p className="mt-2 flex items-center gap-2 text-sm text-slate-300"><CalendarDays size={16} className="shrink-0" />{formatReportTime(activity?.period.from ?? result.alerts?.period.from, result.filters.timezone)} → {formatReportTime(activity?.period.to ?? result.alerts?.period.to, result.filters.timezone)}</p><p className="mt-1 text-xs text-slate-400">{result.filters.timezone} · End excluded · Generated {formatReportTime(result.createdAt, result.filters.timezone)}</p></div>
      {activity && coverage && <>
        <div className={`rounded-xl border p-4 ${coverage.complete ? "border-emerald-400/30 bg-emerald-500/10" : "border-amber-400/30 bg-amber-500/10"}`}><h3 className="font-semibold">{coverage.complete ? "Activity coverage complete" : "Partial activity coverage"}</h3><p className="mt-1 text-sm leading-6">{coverage.coveragePercent.toFixed(1)}% observed · {durationLabel(coverage.unobservedSeconds)} unobserved · {coverage.gapCount} telemetry gaps.</p>{(coverage.truncated || coverage.pathTruncated) && <p className="mt-1 text-sm text-amber-200">Point limit reached. {coverage.truncated ? "Totals cover only the loaded portion." : "The exported point list is partial."} Choose a shorter period.</p>}{coverage.distanceComplete === false && <p className="mt-1 text-sm text-amber-200">GPS distance is partial because gaps or rejected segments were excluded.</p>}{Date.parse(activity.period.to) > Date.parse(result.createdAt) && <p className="mt-1 text-sm leading-6">This period includes future time, which is counted as unobserved. Coverage cannot be complete yet.</p>}<p className="mt-1 text-xs leading-5 text-slate-300">GPS gaps are not counted as parked or idle time. Unknown state means readings cannot safely establish activity.</p></div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric title="Estimated GPS distance" value={coverage.distanceObservedSeconds > 0 ? `${activity.summary.totalDistanceKm.toFixed(2)} km` : "Unavailable"} note="Not a vehicle odometer" /><Metric title="Time-weighted average speed" value={activity.summary.averageSpeedKph === null ? "Unavailable" : `${activity.summary.averageSpeedKph.toFixed(1)} km/h`} note="Observed intervals only" /><Metric title="Highest reported speed" value={activity.summary.maxSpeedKph === null ? "Unavailable" : `${activity.summary.maxSpeedKph.toFixed(1)} km/h`} note="Recorded GPS readings" /><Metric title="GPS readings" value={activity.summary.totalPoints.toLocaleString("en-IN")} note={coverage.truncated ? "Capped data set" : "Within selected period"} /></div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric title="Moving" value={durationLabel(activity.summary.runningSeconds)} note="Ignition on, speed >2 km/h" /><Metric title="Engine-on idle" value={durationLabel(activity.summary.idleSeconds)} note="Ignition on, speed ≤2 km/h" /><Metric title="Parked" value={durationLabel(activity.summary.parkedSeconds)} note="Ignition off, speed ≤2 km/h" /><Metric title="Unknown state" value={durationLabel(activity.summary.unknownSeconds)} note="Observed, not classifiable" /></div>
        <details className="rounded-xl border border-white/10 bg-[#0a1426] p-4"><summary className="cursor-pointer text-sm font-semibold text-sky-300">How these numbers are calculated</summary><div className="mt-3 space-y-2 text-sm leading-6 text-slate-300"><p>Distance is estimated between accepted GPS readings. Long gaps and rejected jumps break the route. Average speed is weighted by observed time, not the number of messages.</p><p>Ignition comes from stored device data. Older records may contain defaults or a previous reading; this report cannot verify historic sensor wiring. Fuel, savings and driver scores are not inferred.</p><p>First reading: {formatReportTime(coverage.firstRecordedAt, result.filters.timezone)}. Last reading: {formatReportTime(coverage.lastRecordedAt, result.filters.timezone)}. Rejected distance segments: {coverage.distanceRejectedSegments ?? 0}.</p></div></details>
      </>}
      {result.alerts && <div className="rounded-xl border border-white/10 bg-[#0a1426] p-4"><p className="font-semibold">{result.alerts.data.length} recorded alerts</p><p className="mt-1 text-sm text-slate-300">{result.alerts.coverage.truncated ? "Partial result: record limit reached. Choose a shorter period." : "All matching records in this period are included."} Resolution status is current at generation time; this does not prove notification delivery.</p></div>}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4"><h3 className="font-semibold">{activity ? "Recorded positions" : "Recorded alerts"}</h3><label className="relative print:hidden"><span className="sr-only">Search report rows</span><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} placeholder="Search report rows" className="min-h-10 w-full rounded-lg border border-white/15 bg-[#091524] py-2 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:w-72" /></label></div>
        {!count ? <div className="p-8 text-center"><p className="font-medium">{query ? "No matching rows" : "No recorded data in this period"}</p><p className="mt-2 text-sm text-slate-400">{query ? "Try a different search." : "Try another period or check the device connection. No data does not establish that the vehicle was stationary."}</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><caption className="sr-only">Generated report, 25 rows per page. CSV contains every returned row.</caption><thead className="border-b border-white/10 bg-white/[0.03] text-xs text-slate-300"><tr><th className="px-4 py-3">Time ({result.filters.timezone})</th>{activity ? <><th className="px-4 py-3">Latitude / longitude</th><th className="px-4 py-3">Reported speed</th><th className="px-4 py-3">Ignition</th><th className="px-4 py-3">Battery</th></> : <><th className="px-4 py-3">Type</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Status</th></>}</tr></thead><tbody>{activity ? positions.slice(currentPage * 25, (currentPage + 1) * 25).map(p => <tr key={p.id} className="border-b border-white/5 last:border-0"><td className="whitespace-nowrap px-4 py-3 text-slate-300">{formatReportTime(p.recordedAt, result.filters.timezone)}</td><td className="px-4 py-3 font-mono text-xs">{p.latitude === null || p.longitude === null ? "Unavailable" : `${p.latitude.toFixed(5)}, ${p.longitude.toFixed(5)}`}</td><td className="px-4 py-3">{p.speed === null ? "Unknown" : `${p.speed.toFixed(1)} km/h`}</td><td className="px-4 py-3">{p.ignition === null ? "Unknown" : p.ignition ? "On" : "Off"}</td><td className="px-4 py-3">{p.battery === null ? "Unavailable" : `${p.battery.toFixed(2)} V`}</td></tr>) : alerts.slice(currentPage * 25, (currentPage + 1) * 25).map(a => <tr key={a.id} className="border-b border-white/5 last:border-0"><td className="whitespace-nowrap px-4 py-3 text-slate-300">{formatReportTime(a.createdAt, result.filters.timezone)}</td><td className="px-4 py-3">{a.type.replaceAll("_", " ")}</td><td className="max-w-md px-4 py-3 leading-6 text-slate-300">{a.message}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${a.isResolved ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-200"}`}>{a.isResolved ? "Resolved" : "Open"}</span></td></tr>)}</tbody></table></div>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4 text-xs text-slate-400"><p>{count} matching rows · Page {currentPage + 1} of {pages}. CSV includes every returned row.</p><div className="flex gap-2 print:hidden"><button className={button} disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button><button className={button} disabled={currentPage >= pages - 1} onClick={() => setPage(currentPage + 1)}>Next</button></div></div>
      </div>
    </section>}
  </div>;
}
function Metric({ title, value, note }: { title: string; value: string; note: string }) { return <div className="rounded-xl border border-white/10 bg-[#0a1426] p-4"><p className="text-xs font-medium leading-5 text-slate-300">{title}</p><p className="mt-2 break-words text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs leading-5 text-slate-400">{note}</p></div>; }
function Empty({ title, description }: { title: string; description: string }) { return <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center"><FileBarChart size={30} className="mx-auto text-sky-400" /><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-300">{description}</p></div>; }
