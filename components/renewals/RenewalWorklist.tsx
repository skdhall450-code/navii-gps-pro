"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, RefreshCw, Search } from "lucide-react";
import { buildRenewalWorklist, filterRenewalRows, renewalStateLabel, type RenewalFilter } from "@/lib/renewal-worklist";
import { loadRenewalSnapshot, type RenewalSnapshot } from "@/lib/renewal-worklist-client";

const filters: { value: RenewalFilter; label: string }[] = [
  { value: "DAYS7", label: "Next 7 days" }, { value: "DAYS15", label: "Next 15 days" }, { value: "DAYS30", label: "Next 30 days" },
  { value: "ATTENTION", label: "Needs review" }, { value: "ALL", label: "All records" },
];
const tokenNow = () => localStorage.getItem("navii_access_token");
export default function RenewalWorklist() {
  const [snapshot, setSnapshot] = useState<RenewalSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<RenewalFilter>("DAYS30");
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("Asia/Kolkata");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let mounted = true;
    let generation = 0;
    let requestController: AbortController | undefined;
    let observedToken: string | null = null;
    const load = async () => {
      requestController?.abort();
      const controller = new AbortController();
      requestController = controller;
      const current = ++generation;
      observedToken = tokenNow();
      setSnapshot(null); setError(""); setLoading(true);
      try {
        if (!observedToken) throw new Error("Sign in to review subscription renewals.");
        const result = await loadRenewalSnapshot(observedToken, tokenNow, controller.signal);
        if (mounted && current === generation && !controller.signal.aborted) setSnapshot(result);
      } catch (cause) {
        if (mounted && current === generation && !controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Renewals could not be loaded. Please refresh.");
      } finally {
        if (mounted && current === generation) setLoading(false);
      }
    };
    const checkSession = () => { if (tokenNow() !== observedToken) { setSearch(""); setFilter("DAYS30"); void load(); } };
    const refocus = () => { if (document.visibilityState === "visible") void load(); };
    void load();
    window.addEventListener("storage", checkSession);
    window.addEventListener("focus", refocus);
    const timer = setInterval(checkSession, 1000);
    return () => { mounted = false; generation++; requestController?.abort(); clearInterval(timer); window.removeEventListener("storage", checkSession); window.removeEventListener("focus", refocus); };
  }, [refresh]);

  const rows = useMemo(() => snapshot ? buildRenewalWorklist(snapshot.subscriptions, snapshot.asOf) : [], [snapshot]);
  const visible = filterRenewalRows(rows, filter, search);
  const date = (value: string | number) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: zone }).format(new Date(value));
  return <main className="mx-auto max-w-[1500px] space-y-6 p-4 text-slate-100 sm:p-6 lg:p-8">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-300"><CalendarClock size={20} /> Subscription review</p><h1 className="text-3xl font-bold">Renewal worklist</h1><p className="mt-2 max-w-3xl text-sm text-slate-300">Review coverage ending in 7, 15 or 30 days. Continuous renewal periods are grouped into one row per vehicle.</p></div>
      <button type="button" onClick={() => setRefresh(n => n + 1)} disabled={loading} className="flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
    </header>
    <section className="rounded-xl border border-sky-900 bg-sky-950/30 p-4 text-sm text-slate-300">
      <p>Based on subscription records visible to your billing account, within your company. These records do not confirm payment, current vehicle assignment or device connectivity.</p>
      <p className="mt-2">This page does not send reminders or renew subscriptions. <Link href="/dashboard/billing/subscriptions" className="font-semibold text-sky-300 underline">Review subscriptions</Link> for any manual follow-up.</p>
    </section>
    {error && <div role="alert" className="rounded-lg border border-rose-800 bg-rose-950/30 p-4 text-sm text-rose-200">{error} <Link href="/login" className="underline">Sign in</Link></div>}
    {loading ? <p role="status" className="p-6 text-slate-300">Loading current billing access and subscription periods…</p> : snapshot && <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="text-xs text-slate-400">Snapshot: {date(snapshot.asOf)} ({zone}). Refresh after a renewal or subscription change.</p>
        <label className="text-sm">Display timezone <select value={zone} onChange={e => setZone(e.target.value)} className="ml-2 rounded border border-slate-600 bg-slate-900 p-2"><option value="Asia/Kolkata">Asia/Kolkata</option><option value="UTC">UTC</option></select></label>
      </div>
      <nav aria-label="Renewal filters" className="flex flex-wrap gap-2">{filters.map(item => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className={`rounded-lg border px-4 py-2 text-sm ${filter === item.value ? "border-sky-500 bg-sky-900 text-white" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}>{item.label} <span className="ml-1 font-bold">{filterRenewalRows(rows, item.value).length}</span></button>)}</nav>
      <p className="text-xs text-slate-400">The day filters overlap: 15 days includes the next 7 days. Each day is 24 hours from the snapshot; timezone changes the displayed dates only. Cancelled and suspended periods do not extend coverage. A future period extends current coverage only when it starts exactly at the previous period’s end.</p>
      <label className="flex max-w-md items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"><Search size={16} /><span className="sr-only">Search vehicle or plan</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicle or plan" className="w-full bg-transparent text-sm outline-none" /></label>
      <p role="status" className="text-sm text-slate-400">{visible.length} of {rows.length} vehicles with visible subscription history</p>
      {visible.length === 0 ? <div className="rounded-xl border border-slate-700 p-8 text-center"><h2 className="font-semibold">No records match this view</h2><p className="mt-2 text-sm text-slate-400">Check Needs review or All records. Vehicles without visible subscription history are not included.</p></div> : <div className="overflow-x-auto rounded-xl border border-slate-700"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-900 text-slate-300"><tr><th className="p-4">Vehicle / plan</th><th className="p-4">Review state</th><th className="p-4">Coverage end ({zone})</th><th className="p-4">Next step</th></tr></thead><tbody>{visible.map(row => <tr key={row.vehicleId} className="border-t border-slate-800 align-top"><td className="p-4"><p className="font-semibold">{row.vehicleNo}</p><p className="mt-1 text-xs text-slate-400">{row.planName}</p></td><td className="p-4"><p className={row.state === "DUE" ? "text-amber-300" : ["EXPIRED", "GAP", "SUSPENDED", "REVIEW"].includes(row.state) ? "text-rose-300" : "text-slate-300"}>{renewalStateLabel(row.state)}</p>{row.state === "DUE" && <p className="mt-1 text-xs text-slate-400">Within {row.daysRemaining} day{row.daysRemaining === 1 ? "" : "s"}</p>}</td><td className="p-4"><time dateTime={row.endDate}>{date(row.endDate)}</time>{["GAP", "UPCOMING"].includes(row.state) && row.nextStart && <p className="mt-1 text-xs text-slate-400">Next period starts {date(row.nextStart)}</p>}</td><td className="max-w-md p-4 text-slate-300">{row.detail}</td></tr>)}</tbody></table></div>}
    </>}
  </main>;
}
