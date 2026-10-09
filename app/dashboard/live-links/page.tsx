"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

type Vehicle = { id: string; vehicleNo: string };
type TrackingLink = { id: string; vehicleId: string; createdAt: string; expiresAt: string; revokedAt: string | null };
const API = process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.naviigps.com";
async function request<T>(path: string, init: RequestInit = {}, expectedToken?: string | null): Promise<T> {
  const token = localStorage.getItem("navii_access_token");
  if (!token) throw new Error("Please sign in again.");
  if (expectedToken !== undefined && token !== expectedToken) throw new Error("Your account changed. Reload this page before managing links.");
  const response = await fetch(`${API}${path}`, { ...init, credentials: "omit", cache: "no-store", redirect: "error", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers } });
  const body = await response.json().catch(() => null);
  if (localStorage.getItem("navii_access_token") !== token) throw new Error("Your account changed. Reload this page before managing links.");
  if (!response.ok || !body?.success) {
    if (response.status === 401) throw new Error("Your session expired. Please sign in again.");
    if (response.status === 404) throw new Error("This feature or vehicle is unavailable.");
    if (response.status === 403) throw new Error("Your current account cannot share this vehicle.");
    if (response.status === 429) throw new Error("Too many requests. Please wait a minute.");
    throw new Error(typeof body?.message === "string" ? body.message : "Tracking links are temporarily unavailable.");
  }
  return body.data as T;
}

function LiveLinkManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState<1 | 8>(1);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [created, setCreated] = useState<{ id: string; url: string; expiresAt: string } | null>(null);
  const [now, setNow] = useState(0);
  const active = useRef(true);
  const listGeneration = useRef(0);
  const lifecycleGeneration = useRef(0);
  const sessionToken = useRef<string | null>(null);

  useEffect(() => {
    active.current = true;
    sessionToken.current = localStorage.getItem("navii_access_token");
    const invalidateLifecycle = () => { lifecycleGeneration.current += 1; };
    const clearSecrets = () => { active.current = false; invalidateLifecycle(); ++listGeneration.current; setCreated(null); };
    const checkSession = () => {
      if (localStorage.getItem("navii_access_token") === sessionToken.current) return;
      clearSecrets(); setEnabled(false); setVehicles([]); setVehicleId(""); setLinks([]); setConsent(false); busyRef.current = false; setBusy(false);
      setError("Your account changed. Reload this page before managing links.");
    };
    const resume = () => { active.current = true; busyRef.current = false; setBusy(false); setCreated(null); checkSession(); };
    window.addEventListener("pagehide", clearSecrets);
    window.addEventListener("pageshow", resume);
    window.addEventListener("storage", checkSession);
    window.addEventListener("focus", checkSession);
    const controller = new AbortController();
    const timer = setInterval(() => { checkSession(); setNow(Date.now()); }, 1000);
    setNow(Date.now());
    void (async () => {
      try {
        const capability = await request<{ enabled: boolean }>("/api/gps/tracking-links/capabilities", { signal: controller.signal }, sessionToken.current);
        if (!capability.enabled) { setNotice("Temporary live links are disabled until the backend release and security checks are approved."); return; }
        const rows = await request<Vehicle[]>("/api/gps/vehicles", { signal: controller.signal }, sessionToken.current);
        if (!active.current) return;
        setVehicles(rows); setVehicleId(rows[0]?.id || ""); setEnabled(true);
      } catch (caught) { if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Unable to load tracking links."); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => { active.current = false; invalidateLifecycle(); window.removeEventListener("pagehide", clearSecrets); window.removeEventListener("pageshow", resume); window.removeEventListener("storage", checkSession); window.removeEventListener("focus", checkSession); controller.abort(); clearInterval(timer); };
  }, []);

  const loadLinks = useCallback(async (id: string, signal?: AbortSignal) => {
    const generation = ++listGeneration.current;
    const rows = await request<TrackingLink[]>(`/api/gps/tracking-links/vehicle/${encodeURIComponent(id)}`, { signal }, sessionToken.current);
    if (!signal?.aborted && active.current && generation === listGeneration.current) setLinks(rows);
  }, []);
  useEffect(() => {
    ++listGeneration.current; setLinks([]); setCreated(null); setConsent(false);
    if (!vehicleId || !enabled) return;
    const controller = new AbortController();
    void loadLinks(vehicleId, controller.signal).catch(caught => { if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : "Unable to load links."); });
    return () => controller.abort();
  }, [vehicleId, enabled, loadLinks]);

  async function createLink() {
    if (busyRef.current || !consent || !enabled || !vehicleId) return;
    const operation = lifecycleGeneration.current;
    ++listGeneration.current; busyRef.current = true; setBusy(true); setError(""); setCreated(null); setNotice("");
    try {
      const row = await request<TrackingLink & { token: string }>("/api/gps/tracking-links", { method: "POST", body: JSON.stringify({ vehicleId, durationHours: duration }) }, sessionToken.current);
      if (!active.current || operation !== lifecycleGeneration.current) return;
      if (!/^nvl_[A-Za-z0-9_-]{43}$/.test(row.token)) throw new Error("The server returned an invalid link. Review and revoke it before retrying.");
      setCreated({ id: row.id, url: `${window.location.origin}/share#${row.token}`, expiresAt: row.expiresAt });
      setConsent(false); setLinks(old => [{ id: row.id, vehicleId: row.vehicleId, createdAt: row.createdAt, expiresAt: row.expiresAt, revokedAt: row.revokedAt }, ...old]);
      setNotice("Link created. Copy it only for the intended recipient. The secret is shown once and is not saved in this browser.");
    } catch (caught) { if (active.current && operation === lifecycleGeneration.current) setError(`${caught instanceof Error ? caught.message : "Creation could not be confirmed."} If the request was interrupted, refresh the list before creating another link.`); }
    finally { if (operation === lifecycleGeneration.current) { busyRef.current = false; if (active.current) setBusy(false); } }
  }
  async function revoke(id: string) {
    if (busyRef.current) return;
    const operation = lifecycleGeneration.current;
    ++listGeneration.current; busyRef.current = true; setBusy(true); setError("");
    try {
      await request(`/api/gps/tracking-links/${encodeURIComponent(id)}/revoke`, { method: "POST" }, sessionToken.current);
      if (!active.current || operation !== lifecycleGeneration.current) return;
      setLinks(old => old.map(row => row.id === id ? { ...row, revokedAt: new Date().toISOString() } : row));
      if (created?.id === id) setCreated(null);
      setNotice("Link revoked. Future reads are denied; an already-open viewer clears when its next refresh starts (every 15 seconds while visible).");
    } catch (caught) { if (active.current && operation === lifecycleGeneration.current) setError(caught instanceof Error ? caught.message : "Revocation could not be confirmed. Retry or refresh the list."); }
    finally { if (operation === lifecycleGeneration.current) { busyRef.current = false; if (active.current) setBusy(false); } }
  }
  async function copy() {
    if (!created) return;
    try { await navigator.clipboard.writeText(created.url); setNotice("Link copied. Share it only with the intended recipient."); }
    catch { setNotice("Clipboard is unavailable. Select the link and copy it manually."); }
  }
  return <div className="mx-auto max-w-5xl space-y-6 p-4 text-slate-100 md:p-8">
    <header><p className="text-sm font-semibold text-cyan-300">VEHICLE-ONLY · READ-ONLY · EXPIRING</p><h1 className="mt-2 text-3xl font-bold">Temporary Live Links</h1><p className="mt-3 max-w-3xl text-slate-400">Give someone access to one vehicle’s latest GPS location for 1 or 8 hours. They cannot see your account, customer details or journey history. Revoke access whenever you need.</p></header>
    {loading && <p role="status">Checking availability…</p>}
    {error && <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-rose-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-cyan-100">{notice}</p>}
    <section className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">Create a temporary link</h2>
      <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2">Vehicle<select aria-label="Vehicle" disabled={!enabled || busy} value={vehicleId} onChange={event => { ++listGeneration.current; setError(""); setVehicleId(event.target.value); }} className="block w-full rounded-lg border border-slate-600 bg-slate-950 p-3">{!vehicles.length && <option value="">No accessible vehicles</option>}{vehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleNo}</option>)}</select></label>
      <label className="space-y-2">Expires after<select aria-label="Expires after" disabled={!enabled || busy} value={duration} onChange={event => setDuration(Number(event.target.value) as 1 | 8)} className="block w-full rounded-lg border border-slate-600 bg-slate-950 p-3"><option value={1}>1 hour</option><option value={8}>8 hours</option></select></label></div>
      <label className="flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" checked={consent} disabled={!enabled || busy} onChange={event => setConsent(event.target.checked)} className="mt-1"/>I understand anyone holding this link can view this vehicle’s latest location until expiry or revocation. I’ll share it only with the intended recipient.</label>
      <button type="button" disabled={!enabled || !vehicleId || !consent || busy} onClick={createLink} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-40">{busy ? "Please wait…" : "Create link"}</button>
    </section>
    {created && Date.parse(created.expiresAt) > now && <section className="space-y-3 rounded-2xl border border-amber-500/40 bg-amber-950/20 p-5"><h2 className="font-bold">Copy this link now</h2><p className="text-sm text-amber-100">Treat it as a private access key. Expires {new Date(created.expiresAt).toLocaleString()}.</p><input aria-label="Temporary tracking link" readOnly value={created.url} onFocus={event => event.target.select()} className="w-full rounded-lg border border-slate-600 bg-slate-950 p-3 text-sm"/><div className="flex gap-3"><button type="button" onClick={copy} className="rounded-lg bg-amber-300 px-4 py-2 font-bold text-slate-950">Copy link</button><button type="button" onClick={() => setCreated(null)} className="rounded-lg border border-slate-500 px-4 py-2">Hide link</button></div></section>}
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">Links for this vehicle</h2><button type="button" disabled={!enabled || !vehicleId || busy} onClick={() => void loadLinks(vehicleId).catch(caught => setError(caught instanceof Error ? caught.message : "Refresh failed."))} className="rounded-lg border border-slate-600 px-3 py-2 disabled:opacity-40">Refresh list</button></div><p className="mt-2 text-sm text-slate-400">All active links and the most recent 50 inactive links are listed. Original secrets cannot be retrieved.</p>
      {!links.length && <p className="py-6 text-slate-400">No links to display.</p>}
      <ul className="mt-3 divide-y divide-slate-700">{links.map(row => { const status = row.revokedAt ? "Revoked" : Date.parse(row.expiresAt) <= now ? "Expired" : "Active"; return <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{status}</p><p className="text-sm text-slate-400">Created {new Date(row.createdAt).toLocaleString()} · Expires {new Date(row.expiresAt).toLocaleString()}</p></div>{status === "Active" && <button type="button" disabled={busy} onClick={() => revoke(row.id)} className="rounded-lg border border-rose-500/50 px-4 py-2 text-rose-200 disabled:opacity-40">Revoke</button>}</li>; })}</ul>
    </section>
  </div>;
}
export default function LiveLinksPage() { return <RoleRouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DEALER", "CUSTOMER", "USER"]}><LiveLinkManager /></RoleRouteGuard>; }
