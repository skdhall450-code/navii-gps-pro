"use client";

import { Download, FileCheck2, FileClock, Loader2, Mail, RefreshCw, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { canRetryHandover, fetchHandoverArtifact, fetchHandovers, handoverPresentation, retryHandover } from "@/lib/customer-handover";
import type { ArtifactFormat, Handover, HandoverScope } from "@/lib/customer-handover";

const badgeColors = {
  sky: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  amber: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  red: "bg-red-500/10 text-red-300 ring-red-500/20",
  slate: "bg-slate-500/10 text-slate-300 ring-slate-500/20",
};

function getToken() { return localStorage.getItem("navii_access_token") || ""; }
function isAbort(error: unknown) { return error instanceof Error && error.name === "AbortError"; }
function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString();
}

export default function HandoverPanel({ apiBase, customerId, vehicleId }: { apiBase: string } & HandoverScope) {
  const headingId = useId();
  const [jobs, setJobs] = useState<Handover[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const mounted = useRef(false);
  const requestVersion = useRef(0);
  const readController = useRef<AbortController | null>(null);
  const actionController = useRef<AbortController | null>(null);
  const actionLock = useRef(false);

  const refresh = useCallback(async () => {
    const version = ++requestVersion.current;
    readController.current?.abort();
    const controller = new AbortController();
    readController.current = controller;
    setLoading(true);
    setError(null);
    try {
      const scope: HandoverScope = customerId ? { customerId } : { vehicleId: vehicleId || "" };
      const result = await fetchHandovers(apiBase, getToken(), scope, controller.signal);
      if (mounted.current && version === requestVersion.current) setJobs(result);
    } catch (err) {
      if (mounted.current && version === requestVersion.current && !isAbort(err)) {
        setJobs([]);
        setError(err instanceof Error ? err.message : "Unable to load handovers.");
      }
    } finally {
      if (mounted.current && version === requestVersion.current) setLoading(false);
    }
  }, [apiBase, customerId, vehicleId]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => {
      mounted.current = false;
      readController.current?.abort();
      actionController.current?.abort();
    };
  }, [refresh]);

  async function download(job: Handover, format: ArtifactFormat) {
    if (actionLock.current || loading || !job.artifactsReady) return;
    actionLock.current = true;
    setBusy(`${job.id}:${format}`);
    setError(null);
    setNotice(null);
    const controller = new AbortController();
    actionController.current = controller;
    try {
      const blob = await fetchHandoverArtifact(apiBase, getToken(), job, format, controller.signal);
      if (!mounted.current || controller.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `NAVII-handover-${job.id.replace(/[^a-zA-Z0-9_-]/g, "")}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      if (mounted.current && !isAbort(err)) setError(err instanceof Error ? err.message : "Unable to download this file.");
    } finally {
      actionLock.current = false;
      if (mounted.current) setBusy(null);
    }
  }

  async function retry(job: Handover) {
    if (actionLock.current || loading || !canRetryHandover(job)) return;
    const confirmed = window.confirm(
      `Retry the existing handover email to ${job.retryRecipientEmail}?` +
      (job.ownerCopyEmail ? `\nOwner copy: ${job.ownerCopyEmail}` : "") +
      "\n\nThe server will recheck the current assignment, confirmed recipient and delivery settings. This may submit a welcome email with handover files to the provider.",
    );
    if (!confirmed) return;
    actionLock.current = true;
    setBusy(`${job.id}:retry`);
    setError(null);
    setNotice(null);
    const controller = new AbortController();
    actionController.current = controller;
    try {
      const result = await retryHandover(apiBase, getToken(), job, controller.signal);
      if (!mounted.current || controller.signal.aborted) return;
      setNotice(`Retry recorded. ${handoverPresentation(result.status).label}.`);
      await refresh();
    } catch (err) {
      if (mounted.current && !isAbort(err)) {
        setError(err instanceof Error ? err.message : "Retry could not be confirmed. Refresh to check its status before trying again.");
        // Discard stale retry controls after an uncertain response or changed recipient.
        setJobs([]);
      }
    } finally {
      actionLock.current = false;
      if (mounted.current) setBusy(null);
    }
  }

  return (
    <section aria-labelledby={headingId} className="rounded-xl border border-sky-500/20 bg-[#07101f]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 p-4">
        <div>
          <h3 id={headingId} className="flex items-center gap-2 text-sm font-semibold text-white"><Mail className="h-4 w-4 text-sky-400" /> Customer handovers</h3>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">PDF + PNG for new customer-device assignments. Email stays off until delivery is configured and checked. Earlier assignments are not backfilled.</p>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={loading || Boolean(busy)} className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-40">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh handovers
        </button>
      </div>

      {error && <p role="alert" className="m-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs leading-relaxed text-red-300">{error}</p>}
      {notice && <p role="status" className="m-4 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-xs text-sky-300">{notice}</p>}
      {loading && jobs.length === 0 ? (
        <p role="status" className="flex items-center gap-2 p-5 text-sm text-slate-400"><Loader2 className="h-4 w-4 animate-spin" /> Loading handovers...</p>
      ) : !error && jobs.length === 0 ? (
        <div className="p-5 text-sm text-slate-400"><p className="font-medium text-slate-300">No handover records yet</p><p className="mt-2 text-xs leading-relaxed">A future successful customer-device assignment creates a record. Opening this panel does not generate or send a handover.</p></div>
      ) : (
        <ul className="divide-y divide-white/10">
          {jobs.map((job) => {
            const presentation = handoverPresentation(job.status);
            return (
              <li key={job.id} className="space-y-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-medium text-white">{job.recipientEmail || "Delivery address missing"}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Created {formatTime(job.createdAt)}</p>
                    {job.ownerCopyEmail && <p className="mt-1 break-all text-[11px] text-slate-500">Owner copy: {job.ownerCopyEmail}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${badgeColors[presentation.tone]}`}>{presentation.label}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Handover files</p>
                    <p className={`mt-2 flex items-center gap-2 text-xs font-medium ${job.artifactsReady ? "text-emerald-300" : "text-slate-300"}`}>
                      {job.artifactsReady ? <FileCheck2 className="h-4 w-4" /> : <FileClock className="h-4 w-4" />}
                      {job.artifactsReady ? "PDF + PNG ready" : "Files not ready"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Email delivery</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{presentation.detail}</p>
                    {job.status === "ACCEPTED" && job.acceptedAt && <p className="mt-1 text-[11px] text-slate-500">Accepted {formatTime(job.acceptedAt)}</p>}
                  </div>
                </div>
                {job.reason && <p className="break-words text-xs leading-relaxed text-slate-400">Reason: {job.reason.replace(/_/g, " ")}</p>}
                {(job.artifactsReady || canRetryHandover(job)) && <div className="flex flex-wrap gap-2">
                  {job.artifactsReady && (["pdf", "png"] as const).map((format) => (
                    <button key={format} type="button" disabled={Boolean(busy) || loading} onClick={() => void download(job, format)} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 disabled:opacity-40">
                      {busy === `${job.id}:${format}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Download {format.toUpperCase()}
                    </button>
                  ))}
                  {canRetryHandover(job) && <button type="button" disabled={Boolean(busy) || loading} onClick={() => void retry(job)} className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/20 disabled:opacity-40">
                    {busy === `${job.id}:retry` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Review retry
                  </button>}
                </div>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
