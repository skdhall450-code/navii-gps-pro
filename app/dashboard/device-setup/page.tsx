"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Plus, RefreshCw, Trash2 } from "lucide-react";
import RoleRouteGuard from "@/components/auth/RoleRouteGuard";
import { DEVICE_CATALOG_CATEGORIES, DEVICE_MODEL_CATALOG, SAFE_SMS_PROFILES, catalogModelNames, findCatalogEntry, findSmsCommand, findSmsProfile, supportsSmsProfile } from "@/lib/device-command-profiles";
import { deviceProgress, isRegistered, registerDeviceBatch, RegistrationError, parseDeviceRows, prepareCommand, type RegistrationResult, type RegistrationRow, type SetupDevice } from "@/lib/device-setup";

const API = (process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.naviigps.com").replace(/\/$/, "");
const inputStyle = "w-full min-h-11 rounded-xl border border-white/15 bg-[#091524] px-3 py-2 text-sm text-white outline-none focus:border-sky-400 disabled:opacity-50";
const buttonStyle = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";
type Draft = RegistrationRow & { key: number; result?: RegistrationResult };
const emptyRow = (key: number): Draft => ({ key, model: "", imei: "", simNumber: "" });
function dateLabel(value: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toLocaleString() : "Unavailable";
}

export default function DeviceSetupPage() {
  return <RoleRouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DEALER"]}><DeviceSetup /></RoleRouteGuard>;
}

function DeviceSetup() {
  const router = useRouter();
  const [devices, setDevices] = useState<SetupDevice[]>([]);
  const [rows, setRows] = useState<Draft[]>([emptyRow(0)]);
  const nextKey = useRef(1);
  const [paste, setPaste] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [template, setTemplate] = useState("");
  const [profileId, setProfileId] = useState("");
  const [profileCommandId, setProfileCommandId] = useState("");
  const [server, setServer] = useState("148.66.158.29");
  const [port, setPort] = useState("5001");
  const [apn, setApn] = useState("");
  const [password, setPassword] = useState("0000");
  const [now, setNow] = useState(() => Date.now());
  const [lastSync, setLastSync] = useState<number | null>(null);
  const fetchController = useRef<AbortController | null>(null);
  const alive = useRef(true);

  const authorization = useCallback(() => {
    const token = localStorage.getItem("navii_access_token");
    if (!token) { router.replace("/login"); throw new Error("Please sign in again."); }
    return { Authorization: "Bearer " + token };
  }, [router]);

  const refresh = useCallback(async () => {
    if (fetchController.current) return;
    const controller = new AbortController();
    fetchController.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 15_000);
    try {
      const response = await fetch(API + "/api/gps/device-management", { headers: authorization(), cache: "no-store", signal: controller.signal });
      if (response.status === 401) { router.replace("/login"); throw new Error("Session expired. Please sign in again."); }
      if (!response.ok) throw new Error("Cannot check devices (" + response.status + ").");
      const json = await response.json();
      if (!json.success || !Array.isArray(json.data)) throw new Error("Unexpected device list from the server.");
      if (alive.current && !controller.signal.aborted) { setDevices(json.data); setLastSync(Date.now()); setError(""); }
    } catch (caught) {
      if (alive.current && (!controller.signal.aborted || timedOut)) setError(timedOut ? "Connection check timed out." : caught instanceof Error ? caught.message : "Connection check unavailable.");
    } finally {
      clearTimeout(timeout); fetchController.current = null;
      if (alive.current) setLoading(false);
    }
  }, [authorization, router]);

  useEffect(() => {
    alive.current = true;
    void refresh();
    const timer = setInterval(() => { setNow(Date.now()); void refresh(); }, 5_000);
    return () => { alive.current = false; clearInterval(timer); fetchController.current?.abort(); };
  }, [refresh]);

  function updateRow(key: number, field: keyof RegistrationRow, value: string) {
    setRows(current => current.map(row => row.key === key ? { ...row, [field]: value, result: undefined } : row));
  }
  async function register() {
    if (savingRef.current) return;
    const pending = rows.filter(row => !isRegistered(row.result));
    if (!pending.length) return;
    savingRef.current = true; setSaving(true); setRegistrationMessage("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);
    try {
      const results = await registerDeviceBatch(API, authorization(), pending.map(({ model, imei, simNumber }) => ({ model, imei, simNumber })), controller.signal);
      const byKey = new Map(pending.map((row, index) => [row.key, results[index]]));
      setRows(current => current.map(row => byKey.has(row.key) ? { ...row, result: byKey.get(row.key) } : row));
      setRegistrationMessage(results.filter(isRegistered).length + " of " + pending.length + " registered. Review any row errors.");
      await refresh();
    } catch (caught) {
      if (caught instanceof RegistrationError && caught.status === 401) router.replace("/login");
      setRegistrationMessage(caught instanceof Error && caught.name !== "AbortError" ? caught.message : "Request timed out. Refresh devices before retrying; matching registrations will not be duplicated.");
    } finally { clearTimeout(timeout); savingRef.current = false; setSaving(false); }
  }
  function importRows() {
    try {
      const imported = parseDeviceRows(paste);
      const existing = rows.filter(row => row.model || row.imei || row.simNumber);
      if (existing.length + imported.length > 100) throw new Error("Keep each batch within 100 devices.");
      setRows([...existing, ...imported.map(row => ({ ...row, key: nextKey.current++ }))]);
      setPaste(""); setRegistrationMessage("");
    } catch (caught) { setRegistrationMessage(caught instanceof Error ? caught.message : "Check the pasted rows."); }
  }
  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setNotice("Copied. Send this command to the device SIM using your SMS app."); }
    catch { setNotice("Copy unavailable. Select the command text and copy it manually."); }
  }

  const registeredModels = devices.map(device => device.model?.trim()).filter((value): value is string => !!value);
  const models = [...new Set([...catalogModelNames(), ...registeredModels])].sort();
  const selectedCatalogEntry = findCatalogEntry(model);
  const selectedProfile = findSmsProfile(profileId);
  const selectedProfileCommand = findSmsCommand(profileId, profileCommandId);
  const visible = devices.filter(device => [device.model, device.imei, device.simNumber, device.vehicle.vehicleNo].some(value => value?.toLowerCase().includes(query.trim().toLowerCase())));
  const targets = devices.filter(device => selected.includes(device.id));
  const config = { model, template, server, port, apn, password };
  const live = devices.filter(device => deviceProgress(device, now).stage === "Live").length;
  const connected = devices.filter(device => deviceProgress(device, now).connected).length;

  return <main className="min-h-screen bg-[#050b16] p-4 text-slate-100 sm:p-6 lg:p-8">
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-400">NAVII / Device setup</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add devices. Check they are live.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Register model, IMEI and SIM phone number. Prepare the manufacturer's SMS command, then watch for the device connection and GPS fix.</p>
      </div><Link href="/dashboard/devices" className={buttonStyle}>Manage existing devices</Link>
    </header>
    <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {[["Registered", devices.length], ["Device connected", connected], ["GPS live", live], ["Awaiting GPS", connected - live]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-[#0a1525] p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}
    </div>
    <section className="mb-6 rounded-2xl border border-white/10 bg-[#0a1525] p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">1. Register devices</h2><p className="mt-1 text-sm text-slate-400">Up to 100 per batch. Add vehicle details later in Vehicles. Include + and country code in SIM phone numbers.</p></div><span className="text-sm text-slate-400">{rows.length} / 100</span></div>
      <details className="mt-5 rounded-xl border border-sky-400/20 bg-sky-500/5 p-4">
        <summary className="cursor-pointer text-sm font-medium text-sky-300">NAVII supported-device catalog ({DEVICE_MODEL_CATALOG.length} entries)</summary>
        <p className="mt-3 text-xs leading-5 text-slate-400">Verified means the SMS format has a traceable manual. Protocol identified still needs a matching NAVII receiver. Manual required entries stay selectable for registration but do not receive guessed commands.</p>
        <div className="mt-4 space-y-4">{DEVICE_CATALOG_CATEGORIES.map(category => {
          const entries = DEVICE_MODEL_CATALOG.filter(entry => entry.category === category);
          return <div key={category}><h3 className="text-sm font-semibold text-slate-200">{category} ({entries.length})</h3>
            <div className="mt-2 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-b border-white/10 text-slate-400"><tr><th className="p-2">Model</th><th className="p-2">Manufacturer</th><th className="p-2">Network</th><th className="p-2">Protocol</th><th className="p-2">Verification</th></tr></thead><tbody>{entries.map(entry => <tr key={entry.model} className="border-b border-white/5"><td className="p-2 font-medium">{entry.model}{entry.aliases?.length ? <span className="block text-slate-500">Alias: {entry.aliases.join(", ")}</span> : null}</td><td className="p-2">{entry.manufacturer}</td><td className="p-2">{entry.network}</td><td className="p-2">{entry.protocol}</td><td className="p-2"><span className={"rounded-full px-2 py-1 " + (entry.status === "VERIFIED_COMMANDS" ? "bg-emerald-500/15 text-emerald-300" : entry.status === "ACCESSORY_ONLY" ? "bg-violet-500/15 text-violet-300" : "bg-amber-500/15 text-amber-300")}>{entry.status.replaceAll("_", " ")}</span>{entry.sourceUrl ? <a className="ml-2 text-sky-300 underline" href={entry.sourceUrl} target="_blank" rel="noreferrer">Source</a> : null}</td></tr>)}</tbody></table></div>
          </div>;
        })}</div>
      </details>
      <fieldset disabled={saving} className="mt-5 space-y-3">
        <datalist id="device-models">{models.map(value => <option key={value} value={value} />)}</datalist>
        {rows.map((row, index) => <div key={row.key} className="rounded-xl border border-white/10 p-3">
          <div className="grid items-end gap-3 sm:grid-cols-[1fr_1.4fr_1.4fr_auto]">
            <label className="text-xs text-slate-400">Model - row {index + 1}<input aria-label={"Model row " + (index + 1)} list="device-models" className={inputStyle + " mt-2"} value={row.model} maxLength={80} onChange={event => updateRow(row.key, "model", event.target.value)} placeholder="PT06" disabled={isRegistered(row.result)} /></label>
            <label className="text-xs text-slate-400">IMEI<input aria-label={"IMEI row " + (index + 1)} className={inputStyle + " mt-2 font-mono"} value={row.imei} inputMode="numeric" maxLength={15} onChange={event => updateRow(row.key, "imei", event.target.value)} placeholder="15 digits" disabled={isRegistered(row.result)} /></label>
            <label className="text-xs text-slate-400">SIM phone number<input aria-label={"SIM phone number row " + (index + 1)} className={inputStyle + " mt-2 font-mono"} value={row.simNumber} inputMode="tel" maxLength={16} onChange={event => updateRow(row.key, "simNumber", event.target.value)} placeholder="+919876543210" disabled={isRegistered(row.result)} /></label>
            <button type="button" aria-label={"Remove row " + (index + 1)} className={buttonStyle} onClick={() => setRows(current => current.length === 1 ? [emptyRow(nextKey.current++)] : current.filter(item => item.key !== row.key))}><Trash2 size={16} /></button>
          </div>{row.result && <p className={"mt-3 text-sm " + (isRegistered(row.result) ? "text-emerald-300" : "text-amber-300")}>{row.result.message}</p>}
        </div>)}
        <div className="flex flex-wrap gap-3"><button type="button" className={buttonStyle} disabled={rows.length >= 100} onClick={() => setRows(current => [...current, emptyRow(nextKey.current++)])}><Plus size={16} />Add another device</button>
          <button type="button" className={buttonStyle} onClick={() => setRows(current => { const pending = current.filter(row => !isRegistered(row.result)); return pending.length ? pending : [emptyRow(nextKey.current++)]; })}>Clear registered rows</button></div>
        <details className="rounded-xl border border-white/10 p-4"><summary className="cursor-pointer text-sm text-sky-300">Paste rows from Excel</summary><p className="mt-3 text-xs leading-5 text-slate-400">Three columns: Model, IMEI, SIM phone number. Tabs or commas, one device per line, no heading. Format IMEI and SIM columns as text to preserve digits.</p><textarea aria-label="Device rows from Excel" rows={4} maxLength={20000} className={inputStyle + " mt-3 font-mono"} value={paste} onChange={event => setPaste(event.target.value)} /><button type="button" className={buttonStyle + " mt-3"} disabled={!paste.trim()} onClick={importRows}>Add pasted rows</button></details>
      </fieldset>
      <div className="mt-5 flex flex-wrap items-center gap-4"><button type="button" disabled={saving || rows.every(row => isRegistered(row.result))} onClick={() => void register()} className={buttonStyle + " border-sky-400/40 bg-sky-500/20 text-sky-100"}>{saving ? "Registering..." : "Register devices"}</button><p role="status" className="text-sm text-slate-300">{registrationMessage}</p></div>
    </section>
    <section className="mb-6 rounded-2xl border border-white/10 bg-[#0a1525] p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">2. Select devices</h2><p className="mt-1 text-sm text-slate-400">Refreshes every 5 seconds. Connection and GPS updates are current for 10 minutes.</p><p className="mt-1 text-xs text-slate-400">Last checked: {lastSync ? new Date(lastSync).toLocaleTimeString() : "Waiting"}</p></div><button type="button" onClick={() => void refresh()} className={buttonStyle}><RefreshCw size={16} />Refresh</button></div>
      {error && <p role="alert" className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">{error} Status below is based on the last received data.</p>}
      <label className="mt-5 block text-xs text-slate-400">Search devices<input className={inputStyle + " mt-2 max-w-lg"} value={query} onChange={event => setQuery(event.target.value)} placeholder="Model, IMEI, SIM or vehicle" /></label>
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-white/10 text-xs text-slate-400"><tr><th className="p-3">Select</th><th className="p-3">Device</th><th className="p-3">SIM / vehicle</th><th className="p-3">Connection</th><th className="p-3">GPS</th></tr></thead><tbody>
        {visible.map(device => { const progress = deviceProgress(device, now); return <tr key={device.id} className="border-b border-white/5"><td className="p-3"><input type="checkbox" aria-label={"Select device " + device.imei} checked={selected.includes(device.id)} onChange={event => setSelected(current => event.target.checked ? [...current, device.id] : current.filter(id => id !== device.id))} className="h-5 w-5 accent-sky-400" /></td><td className="p-3"><p className="font-medium">{device.model || "Unknown model"}</p><p className="mt-1 font-mono text-xs text-slate-400">{device.imei}</p><span className={"mt-2 inline-block rounded-full px-2 py-1 text-xs " + (progress.stage === "Live" ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700/50 text-slate-300")}>{progress.stage}</span></td><td className="p-3"><p className="font-mono text-xs">{device.simNumber || "Not provided"}</p><p className="mt-2 text-xs text-slate-400">{device.vehicle.vehicleNo}</p></td><td className="p-3"><p>{progress.connection}</p><p className="mt-2 text-xs text-slate-400">{dateLabel(device.lastSeenAt)}</p></td><td className="p-3"><p>{progress.gps}</p><p className="mt-2 text-xs text-slate-400">{dateLabel(device.vehicle.lastUpdate)}</p></td></tr>; })}
      </tbody></table>{!visible.length && <p className="p-8 text-center text-sm text-slate-400">{loading ? "Loading devices..." : "No matching devices. Register a device or clear your search."}</p>}</div>
      <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" className={buttonStyle} onClick={() => setSelected(visible.map(device => device.id))}>Select shown devices ({visible.length})</button><button type="button" className={buttonStyle} onClick={() => setSelected([])}>Clear selection</button><p className="text-sm text-slate-400">{targets.length} selected, including devices outside the current search</p></div>
    </section>
    <section className="rounded-2xl border border-sky-400/20 bg-[#0a1525] p-4 sm:p-6">
      <h2 className="text-xl font-semibold">3. Prepare SMS commands</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Use the exact command for your model and firmware. The SIM needs an active SMS/data plan. Open SMS on your phone to send, or copy the command. Automatic SMS delivery is not connected.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs text-slate-400">Command model<select className={inputStyle + " mt-2"} value={model} onChange={event => { setModel(event.target.value); setProfileId(""); setProfileCommandId(""); setTemplate(""); }}><option value="">Choose model</option>{models.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <label className="text-xs text-slate-400">Verified command profile<select className={inputStyle + " mt-2"} value={profileId} onChange={event => {
          const nextProfile = findSmsProfile(event.target.value);
          const first = nextProfile?.commands[0];
          setProfileId(event.target.value); setProfileCommandId(first?.id || ""); setTemplate(first?.template || "");
        }}><option value="">Manual command</option>{SAFE_SMS_PROFILES.map(profile => <option key={profile.id} value={profile.id} disabled={!!model && !supportsSmsProfile(profile, model)}>{profile.label}</option>)}</select></label>
        <label className="text-xs text-slate-400">Setup step<select className={inputStyle + " mt-2"} value={profileCommandId} disabled={!selectedProfile} onChange={event => {
          const command = findSmsCommand(profileId, event.target.value);
          setProfileCommandId(event.target.value); setTemplate(command?.template || "");
        }}><option value="">Choose command</option>{selectedProfile?.commands.map(command => <option key={command.id} value={command.id}>{command.label}</option>)}</select></label>
        <label className="text-xs text-slate-400">Server IP / hostname<input className={inputStyle + " mt-2"} value={server} onChange={event => setServer(event.target.value)} /></label>
        <label className="text-xs text-slate-400">Port<input className={inputStyle + " mt-2"} value={port} inputMode="numeric" onChange={event => setPort(event.target.value)} /></label>
        <label className="text-xs text-slate-400">SIM operator APN<input className={inputStyle + " mt-2"} value={apn} onChange={event => setApn(event.target.value)} placeholder="From your SIM operator" /></label>
        <label className="text-xs text-slate-400">Device SMS password<input className={inputStyle + " mt-2 font-mono"} value={password} maxLength={16} onChange={event => setPassword(event.target.value)} placeholder="Only for profiles that require it" /></label>
      </div>
      {model && selectedCatalogEntry && <div className={"mt-4 rounded-xl border p-3 text-xs leading-5 " + (selectedCatalogEntry.status === "VERIFIED_COMMANDS" ? "border-emerald-400/20 bg-emerald-500/5 text-emerald-100" : "border-amber-400/20 bg-amber-500/5 text-amber-100")}><p><strong>{selectedCatalogEntry.model}</strong> · {selectedCatalogEntry.manufacturer} · {selectedCatalogEntry.network}</p><p>Catalog status: {selectedCatalogEntry.status.replaceAll("_", " ")}. Protocol: {selectedCatalogEntry.protocol}.</p>{selectedCatalogEntry.note && <p>{selectedCatalogEntry.note}</p>}{selectedCatalogEntry.status !== "VERIFIED_COMMANDS" && <p>No automatic command is enabled for this model until its exact supplier manual and firmware are confirmed.</p>}</div>}
      {selectedProfile && <div className="mt-4 rounded-xl border border-sky-400/20 bg-sky-500/5 p-3 text-xs leading-5 text-slate-300"><p>{selectedProfile.note}</p><p className="mt-1">Receiver protocol: {selectedProfile.protocol}. Source: <a className="text-sky-300 underline" href={selectedProfile.sourceUrl} target="_blank" rel="noreferrer">{selectedProfile.sourceLabel}</a>.</p>{selectedProfileCommand && <p className="mt-1">Required fields: {selectedProfileCommand.requires.length ? selectedProfileCommand.requires.join(", ") : "none"}.</p>}</div>}
      <label className="mt-4 block text-xs text-slate-400">Manufacturer's SMS command<textarea rows={3} maxLength={500} className={inputStyle + " mt-2 font-mono"} value={template} onChange={event => setTemplate(event.target.value)} placeholder="Paste the exact command from the device manual" /></label>
      <p className="mt-2 text-xs leading-5 text-slate-400">Optional placeholders: {"{IMEI}, {SIM}, {SERVER}, {PORT}, {APN}, {PASSWORD}"}. Prepare and send one command at a time in the manufacturer's specified order.</p>
      <p role="status" className="mt-4 text-sm text-sky-300">{notice}</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">{targets.map(device => {
        let prepared: ReturnType<typeof prepareCommand> | null = null; let problem = "";
        try {
          if (targets.filter(target => target.simNumber === device.simNumber).length > 1) throw new Error("Multiple selected devices have this SIM number. Check the SIM assignments first.");
          prepared = prepareCommand(device, config);
        } catch (caught) { problem = caught instanceof Error ? caught.message : "Check command details."; }
        return <article key={device.id} className="rounded-xl border border-white/10 bg-[#07111f] p-4"><p className="font-medium">{device.model} <span className="font-mono text-xs text-slate-400">{device.imei}</span></p><p className="mt-2 text-sm text-slate-400">To: {device.simNumber || "SIM number missing"}</p>{prepared ? <><pre className="mt-4 whitespace-pre-wrap break-all rounded-lg bg-black/30 p-3 font-mono text-sm text-sky-200">{prepared.body}</pre><div className="mt-4 flex flex-wrap gap-3"><a className={buttonStyle} href={prepared.href} onClick={() => setNotice("SMS handoff requested. Review and send in your SMS app; if it does not open, use Copy command. Check the device connection above to confirm it comes online.")}>Open SMS</a><button type="button" className={buttonStyle} onClick={() => void copy(prepared!.body)}><Copy size={16} />Copy command</button></div></> : <p className="mt-4 text-sm text-amber-300">{problem}</p>}</article>;
      })}</div>{!targets.length && <p className="mt-5 text-sm text-slate-400">Select registered devices above to prepare their commands.</p>}
    </section>
  </main>;
}
