"use client";

import { useState } from "react";
import { findCatalogEntry } from "@/lib/device-command-profiles";
import { activationGuidance, deviceProgress, readPt06Status, type SetupDevice } from "@/lib/device-setup";

type Props = {
  device: SetupDevice;
  now: number;
  syncUnavailable: boolean;
  onPrepareStatus: () => void;
};

export default function DeviceActivationCheck({ device, now, syncUnavailable, onPrepareStatus }: Props) {
  const [reply, setReply] = useState("");
  const progress = deviceProgress(device, now);
  const pt06 = findCatalogEntry(device.model || "")?.profileId === "pictor-pt06-ev02";
  const reported = readPt06Status(reply);
  const replyHelp = reported.gps === "No fix"
    ? "The reply reports no GPS fix. Check the tracker placement and sky visibility, then check again."
    : reported.gprs === "Link down"
      ? "The reply reports a data connection problem. Check the SIM data plan and mobile signal."
      : reported.gps === "Fixed"
        ? "The tracker reported a GPS fix when it sent this reply. If NAVII still shows Awaiting GPS, retain the reply and ask support to check location packets and timestamps for this IMEI."
        : "GPS status is not recognized. A 'no data' reply alone does not identify the fault. Use the complete STATUS# reply and compare it with the server checks above.";

  return <section id="activation-check" aria-labelledby="activation-check-title" className="mt-6 scroll-mt-6 rounded-xl border border-sky-400/25 bg-sky-500/5 p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 id="activation-check-title" className="text-lg font-semibold">Activation check</h3>
        <p className="mt-1 text-sm text-slate-300">{device.model || "Unknown model"} · <span className="font-mono">{device.imei}</span></p>
      </div>
      <span className={"rounded-full px-3 py-1 text-xs " + (progress.stage === "Live" && !syncUnavailable ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700/50 text-slate-200")}>{syncUnavailable ? "Refresh unavailable" : progress.stage}</span>
    </div>
    <ol className="mt-4 grid gap-3 sm:grid-cols-3">
      {[
        { label: "1. Registered", result: device.isActive ? "Enabled" : "Disabled", complete: device.isActive },
        { label: "2. Device connection", result: progress.connection, complete: progress.connected && !syncUnavailable },
        { label: "3. GPS location", result: progress.gps, complete: progress.gpsFresh && device.isActive && !syncUnavailable },
      ].map(check => <li key={check.label} className="rounded-lg border border-white/10 bg-[#091524] p-3"><p className="text-xs text-slate-400">{check.label}</p><p className={"mt-2 text-sm font-medium " + (check.complete ? "text-emerald-300" : "text-slate-200")}>{check.result}</p></li>)}
    </ol>
    <p className="mt-4 text-sm leading-6 text-slate-300">{syncUnavailable ? "Refresh the device list before relying on these checks. The displayed timestamps are from the last successful update." : activationGuidance(device, now)}</p>
    {pt06 && <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex flex-wrap items-center gap-3"><button type="button" disabled={!device.isActive} onClick={onPrepareStatus} className="min-h-11 rounded-xl border border-sky-400/30 px-4 py-2 text-sm text-sky-200 hover:bg-sky-500/10 disabled:opacity-40">Prepare STATUS# for this device</button><p className="text-xs text-slate-400">Opens a command preview for this IMEI. Send it from your SMS app.</p></div>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-sky-300">Check a PT06 STATUS# reply</summary>
        <label className="mt-3 block text-xs text-slate-400">Paste the complete reply from this device<textarea value={reply} maxLength={2000} rows={3} onChange={event => setReply(event.target.value)} placeholder="GPRS: Link Up; GPS: Fixed;" className="mt-2 w-full rounded-xl border border-white/15 bg-[#091524] p-3 text-sm text-white outline-none focus:border-sky-400" /></label>
        <p className="mt-2 text-xs text-slate-400">This reply stays on this page and is cleared when you switch devices or reload. It does not change the server status.</p>
        {reply.trim() && <div role="status" className="mt-3 rounded-lg bg-[#091524] p-3 text-sm text-slate-300"><p>Reply reports: GPRS <strong>{reported.gprs}</strong> · GPS <strong>{reported.gps}</strong></p><p className="mt-2 leading-6">{replyHelp}</p></div>}
        <a href="https://pictortelematics.com/downloads/pt06-all-sms-command" target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-sky-300 underline">PT06 command reference</a>
      </details>
    </div>}
  </section>;
}
