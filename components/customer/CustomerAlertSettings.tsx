"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { isCustomerWriteVerified, type PendingCustomerWrite, blankCustomerCircle, blankCustomerSetting, parseCustomerRecipients, validateCustomerCircle, validateCustomerSetting, type CustomerAlertCapabilities, type CustomerAlertInput, type CustomerAlertSetting, type CustomerAlertVehicle, type CustomerCircle, type CustomerCircleInput } from "@/lib/customer-alert-settings";
import { useCustomerSession } from "./CustomerSession";
import styles from "./customer-settings.module.css";
const API = process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.naviigps.com";
const GeofenceMap = dynamic(() => import("@/components/geofences/GeofenceMap"), { ssr: false, loading: () => <p>Loading area map…</p> });
const SETTINGS = "/api/gps/customer-alert-settings";
const CIRCLES = "/api/gps/customer-geofences";
class RequestError extends Error { constructor(message: string, readonly status: number) { super(message); } }
type SettingsResponse = { data: CustomerAlertSetting[]; vehicles: CustomerAlertVehicle[]; capabilities: CustomerAlertCapabilities; truncated?: boolean };
type CircleResponse = { data: CustomerCircle[]; truncated?: boolean };
export default function CustomerAlertSettings() {
 const router = useRouter();
 const customer = useCustomerSession();
 const identity = useRef(customer?.id); identity.current = customer?.id;
 const verifiedToken = useRef(customer?.sessionToken); verifiedToken.current = customer?.sessionToken;
 const pending = useRef<PendingCustomerWrite | null>(null);
 const recoveryKey = `navii-customer-pending:${customer?.id || "none"}`;
 const keepPending = useCallback((value: PendingCustomerWrite | null) => { pending.current = value; setUncertain(Boolean(value)); try { if(value) sessionStorage.setItem(recoveryKey, JSON.stringify(value)); else sessionStorage.removeItem(recoveryKey); return true; } catch { return false; } }, [recoveryKey]);
 const validSession = useCallback((session: {token: string | null; id: string | undefined}) => mounted.current && session.id === identity.current && Boolean(session.token) && session.token === verifiedToken.current && localStorage.getItem("navii_access_token") === session.token, []);
 const [vehicles, setVehicles] = useState<CustomerAlertVehicle[]>([]);
 const [settings, setSettings] = useState<CustomerAlertSetting[]>([]);
 const [circles, setCircles] = useState<CustomerCircle[]>([]);
 const [capabilities, setCapabilities] = useState<CustomerAlertCapabilities | null>(null);
 const [vehicleId, setVehicleId] = useState("");
 const [form, setForm] = useState<CustomerAlertInput>(blankCustomerSetting);
 const [recipients, setRecipients] = useState("");
 const [circle, setCircle] = useState<CustomerCircleInput>(blankCustomerCircle);
 const [editing, setEditing] = useState<CustomerCircle | null>(null);
 const [centreChosen, setCentreChosen] = useState(false);
 const [loading, setLoading] = useState(true);
 const [busy, setBusy] = useState(false);
 const [uncertain, setUncertain] = useState(false);
 const [error, setError] = useState("");
 const [notice, setNotice] = useState("");
 const [unavailable, setUnavailable] = useState(false);
 const [truncated, setTruncated] = useState(false);
 const mounted = useRef(true);
 const writeLock = useRef(false);
 const reads = useRef<AbortController | null>(null);
 const selection = useRef("");
 const request = useCallback(async (path: string, init: RequestInit, session: {token: string | null; id: string | undefined}) => {
  if (!mounted.current) throw new DOMException("Page is no longer active.", "AbortError");
  const token = session.token;
  if (!validSession(session)) throw new DOMException("Session changed; sign in again to reload settings.", "AbortError");
  if (!token) { router.replace("/login"); throw new RequestError("Please sign in again.", 401); }
  const timeout = new AbortController(); const timer = window.setTimeout(() => timeout.abort(), 15000);
  const signal = init.signal ? AbortSignal.any([init.signal, timeout.signal]) : timeout.signal;
  try {
  const response = await fetch(`${API}${path}`, { ...init, signal, cache: "no-store", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
  if (signal.aborted || !validSession(session)) throw new DOMException("Request no longer applies to this session.", "AbortError");
  if (response.status === 401) { localStorage.removeItem("navii_access_token"); localStorage.removeItem("navii_user"); router.replace("/login"); }
  if (!response.ok) throw new RequestError(response.status === 409 ? "Settings changed elsewhere. Review the refreshed values before saving again." : response.status === 403 ? "Your account does not have access to these settings." : [404,503].includes(response.status) ? "Customer alert setup is currently unavailable on this server." : "The request could not be completed.", response.status);
  const body = await response.json();
  if (signal.aborted || !validSession(session)) throw new DOMException("Session changed; response ignored.", "AbortError");
  if (body.success === false) throw new RequestError(body.message || "The request could not be completed.", 500);
  return body;
  } finally { window.clearTimeout(timer); }
 }, [router, validSession]);
 const abandonChangedSession = useCallback(() => {
  setCapabilities(null); setVehicles([]); setSettings([]); setCircles([]); setLoading(false); setBusy(false);
  setError("Your session changed. Sign in again to load the correct account.");
  router.replace("/login");
 }, [router]);
 const load = useCallback(async (origin?: {token: string | null; id: string | undefined}) => {
  const session = origin || {token: verifiedToken.current || null, id: identity.current};
  if (!origin && !validSession(session)) { if (mounted.current) abandonChangedSession(); return false; }
  reads.current?.abort(); const controller = new AbortController(); reads.current = controller;
  try {
   const data: SettingsResponse = await request(SETTINGS, { signal: controller.signal }, session);
   if (!Array.isArray(data.data) || !Array.isArray(data.vehicles) || (!data.capabilities || ["geofenceWrite", "overspeedConfiguration", "eventEvaluation", "emailDelivery", "smsDelivery", "lowBattery"].some(key => typeof (data.capabilities as unknown as Record<string, unknown>)[key] !== "boolean"))) throw Error("Unexpected settings response. No changes were made.");
   const areas: CircleResponse = await request(CIRCLES, { signal: controller.signal }, session);
   if (!Array.isArray(areas.data)) throw Error("Unexpected geofence response. No changes were made.");
   if (!validSession(session) || controller.signal.aborted) return false;
   const nextId = data.vehicles.some(v => v.id === selection.current) ? selection.current : data.vehicles[0]?.id || "";
   selection.current = nextId; setVehicleId(nextId); setVehicles(data.vehicles); setSettings(data.data); setCircles(areas.data); setCapabilities(data.capabilities); setUnavailable(false); setTruncated(data.truncated === true);
   const next = data.data.find(s => s.vehicleId === nextId) || blankCustomerSetting(); setForm(next); setRecipients(next.emailRecipients.join(", ")); setEditing(null); setCircle(blankCustomerCircle()); setCentreChosen(false); setError("");
   if (pending.current && isCustomerWriteVerified(pending.current, data.data, areas.data, { complete: data.truncated === false && areas.truncated === false, eligibleVehicleIds: data.vehicles.map(vehicle => vehicle.id) })) { keepPending(null); setNotice("The stored change has been verified. Email delivery remains unavailable."); }
   else setUncertain(Boolean(pending.current));
   return true;
  } catch (e) {
   if (!validSession(session) || controller.signal.aborted) return false;
   setCapabilities(null);
   if (e instanceof RequestError && [401,403,404,503].includes(e.status)) { setCapabilities(null); setVehicles([]); setSettings([]); setCircles([]); }
   if (e instanceof RequestError && [404,503].includes(e.status)) setUnavailable(true);
   setError(e instanceof Error ? e.message : "Unable to load settings."); return false;
  } finally { if (mounted.current && !controller.signal.aborted) setLoading(false); }
 }, [request, validSession, keepPending, abandonChangedSession]);
 useEffect(() => { mounted.current = true; try { const saved = sessionStorage.getItem(recoveryKey); if (saved) { pending.current = JSON.parse(saved); setUncertain(true); setNotice("A previous change needs verification. Refreshing stored values before allowing another write."); } } catch { /* Keep existing in-memory state. */ } void load(); return () => { mounted.current = false; reads.current?.abort(); }; }, [load, recoveryKey]);
 function selectVehicle(id: string) { selection.current = id; setVehicleId(id); const next = settings.find(s => s.vehicleId === id) || blankCustomerSetting(); setForm(next); setRecipients(next.emailRecipients.join(", ")); setEditing(null); setCircle(blankCustomerCircle()); setCentreChosen(false); setNotice(""); setError(""); }
 async function write(path: string, method: string, payload: Record<string, unknown>) {
  if (writeLock.current || pending.current || uncertain || loading) return;
  if (path.startsWith(CIRCLES) ? capabilities?.geofenceWrite !== true : capabilities?.overspeedConfiguration !== true) { setError("This action is not available for your account."); return; }
  const session = {token: verifiedToken.current || null, id: identity.current};
  if (!validSession(session)) { if (mounted.current) abandonChangedSession(); return; }
  const operation = { path, method, vehicleId, payload: method === "POST" ? {...payload, clientRequestId: crypto.randomUUID()} : payload, beforeIds: circles.map(area => area.id) };
  writeLock.current = true; setBusy(true); setError(""); setNotice("");
  if (!keepPending(operation)) { setBusy(false); writeLock.current = false; setError("Browser recovery storage is unavailable. No request was sent; enable session storage before making changes."); return; }
  let outcome = "Save request completed; stored values have been refreshed. Email delivery remains unavailable.";
  try { await request(path, { method, body: JSON.stringify(operation.payload) }, session); }
  catch (e) { outcome = e instanceof Error ? e.message : "The save result is uncertain."; if (validSession(session) && e instanceof RequestError && e.status >= 400 && e.status < 500 && e.status !== 408) keepPending(null); }
  const verified = await load(session);
  if (validSession(session)) { setBusy(false); setNotice(verified && !pending.current ? outcome : "Save result not verified. Changes remain blocked until a refresh confirms the operation; do not recreate the area."); }
  writeLock.current = false;
 }
 async function saveSettings(event: FormEvent) { event.preventDefault(); const input = { revision: form.revision, overspeedEnabled: form.overspeedEnabled, speedLimitKph: form.speedLimitKph, cooldownMinutes: form.cooldownMinutes, emailRequested: form.emailRequested, emailRecipients: parseCustomerRecipients(recipients) }; const invalid = validateCustomerSetting(input); if (invalid) { setError(invalid); return; } await write(`${SETTINGS}/${encodeURIComponent(vehicleId)}`, "PUT", input); }
 async function saveCircle(event: FormEvent) { event.preventDefault(); if (!centreChosen) { setError("Choose an area centre on the map or confirm the entered coordinates before saving."); return; } const input = { ...circle, name: circle.name.trim() }; const invalid = validateCustomerCircle(input); if (invalid) { setError(invalid); return; } await write(editing ? `${CIRCLES}/${encodeURIComponent(editing.id)}` : CIRCLES, editing ? "PATCH" : "POST", editing ? { ...input, revision: editing.revision } : { ...input, vehicleId }); }
 const disabled = busy || uncertain || loading;
 const ownCircles = circles.filter(area => area.vehicleId === vehicleId);
 return <div className={styles.page} data-testid="customer-alert-settings"><header><p className={styles.eyebrow}>YOUR VEHICLE PREFERENCES</p><h1>Areas & alert settings</h1><p>Choose your areas, speed limit and future email recipients.</p><button type="button" disabled={busy} onClick={() => { setError(""); void load(); }}>Refresh saved settings</button></header>
 {error && <p role="alert" className={styles.error}>{error}</p>}{notice && <p role="status" className={styles.notice}>{notice}</p>}
 {loading ? <p role="status">Loading settings…</p> : unavailable ? <section className={styles.card}><h2>Setup is not available yet</h2><p>Customer alert configuration is not currently available on this server. Existing vehicle tracking is unchanged.</p></section> : !capabilities ? <p>Settings could not be loaded. Refresh to try again.</p> : !vehicles.length ? <section className={styles.card}><h2>No eligible vehicles</h2><p>An active vehicle assignment is required to configure these preferences.</p></section> : <>
 <aside className={styles.notice}><strong>Configuration only — email and SMS are not sending.</strong><p>{capabilities.eventEvaluation === true ? "Event evaluation is available; saved preferences do not activate email delivery." : "Event evaluation is not enabled. Saving a speed limit or area does not activate alerts."} Low-battery alerts are unavailable until supported device telemetry is verified.</p></aside>
 {truncated && <p role="status">Only part of your eligible vehicle list was returned. Contact support if a vehicle is missing.</p>}
 <label className={styles.vehicle}>Vehicle<select value={vehicleId} disabled={disabled} onChange={event => selectVehicle(event.target.value)}>{vehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id}>{vehicle.name || vehicle.vehicleNo} · {vehicle.vehicleNo}</option>)}</select></label>
 <div className={styles.grid}><section className={styles.card}><h2>Speed & email preferences</h2><form onSubmit={event => void saveSettings(event)}><fieldset disabled={disabled || capabilities.overspeedConfiguration !== true}><label className={styles.check}><input type="checkbox" checked={form.overspeedEnabled} onChange={event => setForm({ ...form, overspeedEnabled: event.target.checked })}/>Request overspeed events</label><label>Speed limit (km/h)<input type="number" min="1" max="250" step="1" required value={form.speedLimitKph} onChange={event => setForm({ ...form, speedLimitKph: Number(event.target.value) })}/></label><label>Minimum repeat interval (minutes)<input type="number" min="1" max="1440" step="1" required value={form.cooldownMinutes} onChange={event => setForm({ ...form, cooldownMinutes: Number(event.target.value) })}/></label><label>Future email recipients<textarea rows={3} value={recipients} placeholder="name@example.com, other@example.com" onChange={event => setRecipients(event.target.value)} aria-describedby="email-help"/></label><p id="email-help">Up to five addresses. Stored as unverified preferences only; no email will be sent.</p><label className={styles.check}><input type="checkbox" checked={form.emailRequested} onChange={event => setForm({ ...form, emailRequested: event.target.checked })}/>Request email alerts when delivery becomes available</label><button type="submit">Save preferences</button></fieldset></form></section>
 <section className={styles.card}><h2>{editing ? "Edit your area" : "Create your area"}</h2><p>Circular geofences use a centre point and radius. Up to 20 areas per vehicle.</p><p id="area-map-help">Click the map to place the centre, or enter exact coordinates below. This preview is not your vehicle’s location.</p><div className={styles.areaMap} aria-describedby="area-map-help"><GeofenceMap geofences={[]} latitude={circle.latitude} longitude={circle.longitude} radius={circle.radius} editable={!disabled && capabilities.geofenceWrite === true} onCenterChange={(latitude, longitude) => { setCircle(current => ({ ...current, latitude, longitude })); setCentreChosen(true); }}/></div><form onSubmit={event => void saveCircle(event)}><fieldset disabled={disabled || capabilities.geofenceWrite !== true}><label>Area name<input maxLength={80} required value={circle.name} onChange={event => setCircle({ ...circle, name: event.target.value })}/></label><div className={styles.coordinates}><label>Latitude<input type="number" min="-90" max="90" step="any" required value={circle.latitude} onChange={event => { setCircle({ ...circle, latitude: Number(event.target.value) }); setCentreChosen(false); }}/></label><label>Longitude<input type="number" min="-180" max="180" step="any" required value={circle.longitude} onChange={event => { setCircle({ ...circle, longitude: Number(event.target.value) }); setCentreChosen(false); }}/></label></div><button type="button" onClick={() => { if (Number.isFinite(circle.latitude) && Math.abs(circle.latitude) <= 90 && Number.isFinite(circle.longitude) && Math.abs(circle.longitude) <= 180) { setCentreChosen(true); setError(""); } else setError("Enter valid centre coordinates first."); }}>Use these coordinates</button><p role="status">{centreChosen ? "Area centre selected." : "No area centre selected. The map starts at a placeholder location."}</p><label>Radius (metres)<input type="number" min="50" max="100000" step="any" required value={circle.radius} onChange={event => setCircle({ ...circle, radius: Number(event.target.value) })}/></label><p>A radius of {circle.radius || 0} m covers a diameter of {(circle.radius || 0) * 2} m.</p><label className={styles.check}><input type="checkbox" checked={circle.isActive} onChange={event => setCircle({ ...circle, isActive: event.target.checked })}/>Include this area in evaluation when available</label><label className={styles.check}><input type="checkbox" checked={circle.alertOnEntry} onChange={event => setCircle({ ...circle, alertOnEntry: event.target.checked })}/>Entry events</label><label className={styles.check}><input type="checkbox" checked={circle.alertOnExit} onChange={event => setCircle({ ...circle, alertOnExit: event.target.checked })}/>Exit events</label><div className={styles.actions}><button type="submit" disabled={!editing && ownCircles.length >= 20}>{editing ? "Save area" : "Create area"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setCircle(blankCustomerCircle()); setCentreChosen(false); }}>Cancel edit</button>}</div></fieldset></form></section></div>
 <section className={styles.card}><h2>Your saved areas</h2><p>These are your customer-created areas, separate from areas managed by your provider.</p>{!ownCircles.length ? <p>No customer-created areas for this vehicle.</p> : <ul className={styles.areas}>{ownCircles.map(area => <li key={area.id}><div><strong>{area.name}</strong><p>{area.radius} m radius · {area.latitude}, {area.longitude}</p><small>{area.isActive ? "Included in configuration" : "Excluded from configuration"} · Entry {area.alertOnEntry ? "on" : "off"} · Exit {area.alertOnExit ? "on" : "off"}</small></div><div className={styles.actions}><button disabled={disabled || capabilities.geofenceWrite !== true} onClick={() => { if (capabilities.geofenceWrite !== true || disabled) return; setEditing(area); setCentreChosen(true); setCircle({ name: area.name, latitude: area.latitude, longitude: area.longitude, radius: area.radius, isActive: area.isActive, alertOnEntry: area.alertOnEntry, alertOnExit: area.alertOnExit }); }}>Edit {area.name}</button><button disabled={disabled || capabilities.geofenceWrite !== true} onClick={() => { if (capabilities.geofenceWrite !== true || disabled) return; if (window.confirm(`Delete your area “${area.name}”?`)) void write(`${CIRCLES}/${encodeURIComponent(area.id)}`, "DELETE", { revision: area.revision }); }}>Delete {area.name}</button></div></li>)}</ul>}</section>
 </> }</div>;
}
