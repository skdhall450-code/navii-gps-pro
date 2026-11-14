"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, RefreshCw, Route, Shield, LocateFixed } from "lucide-react";
import { useTrackingNow } from "@/hooks/use-tracking-now";
import { getTelemetry, hasCoordinates, TRACKING_LABELS, type TrackingVehicle } from "@/lib/tracking-state";
import { normalizeVehicleType, getVehicleTypeLabel, formatSimNumber } from "@/lib/vehicle-presentation";
import { useCustomerSession } from "./CustomerSession";
import styles from "./customer.module.css";
const CustomerMap = dynamic(() => import("./CustomerMap"), { ssr: false, loading: () => <div className={styles.mapLoading}>Loading map…</div> });
type Vehicle = TrackingVehicle & {
    id: string;
    vehicleNo: string;
    name: string | null;
    vehicleType?: string | null;
    device?: {
        id: string;
        imei: string;
        simNumber?: string | null;
        model?: string | null;
        isActive: boolean;
        lastSeenAt?: string | null;
    } | null;
};
const API = process.env.NEXT_PUBLIC_NAVII_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.naviigps.com";
function time(value: string | null | undefined) { if (!value || !Number.isFinite(Date.parse(value)))
    return "Not available"; return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }); }
export default function CustomerHome() {
    const user = useCustomerSession();
    const router = useRouter();
    const now = useTrackingNow();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selection, setSelection] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshed, setRefreshed] = useState<string | null>(null);
    const request = useRef<AbortController | null>(null);
    const refresh = useCallback(async () => { request.current?.abort(); const controller = new AbortController(); request.current = controller; let timedOut = false; const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 20000); try {
        const token = user?.sessionToken;
        if (!token || localStorage.getItem("navii_access_token") !== token) {
            router.replace("/login");
            return;
        }
        const response = await fetch(`${API}/api/gps/vehicles`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal, cache: "no-store" });
        if (controller.signal.aborted || localStorage.getItem("navii_access_token") !== token)
            return;
        if (response.status === 401) {
            setVehicles([]);
            localStorage.removeItem("navii_access_token");
            localStorage.removeItem("navii_user");
            router.replace("/login");
            return;
        }
        if (response.status === 403) {
            setVehicles([]);
            throw Error("You do not have access to these vehicles.");
        }
        const body = await response.json();
        if (!response.ok || body.success === false || !Array.isArray(body.data))
            throw Error("Tracking could not be refreshed. Please try again.");
        if (controller.signal.aborted || localStorage.getItem("navii_access_token") !== token)
            return;
        setVehicles(body.data);
        setSelection(current => body.data.some((v: Vehicle) => v.id === current) ? current : body.data[0]?.id || "");
        setError("");
        setRefreshed(new Date().toISOString());
    }
    catch (e) {
        if (timedOut && request.current === controller)
            setError("Tracking request timed out. Please refresh to try again.");
        else if (!controller.signal.aborted)
            setError(e instanceof Error ? e.message : "Tracking could not be refreshed.");
    }
    finally {
        clearTimeout(timeout);
        if (request.current === controller) {
            request.current = null;
            if (!controller.signal.aborted || timedOut)
                setLoading(false);
        }
    } }, [router, user?.sessionToken]);
    useEffect(() => { void refresh(); const timer = setInterval(() => { if (!request.current)
        void refresh(); }, 5000); return () => { clearInterval(timer); request.current?.abort(); }; }, [refresh]);
    const vehicle = vehicles.find(v => v.id === selection);
    const telemetry = vehicle ? getTelemetry(vehicle, now) : null;
    return <div className={styles.home} data-testid="customer-home"><section className={styles.welcome}><div><p className={styles.eyebrow}>WELCOME TO YOUR NAVII</p><h1>A clearer view.<br /><span>Every journey.</span></h1><p>Your vehicles and their latest reported location, together.</p></div><button className={styles.refresh} onClick={() => void refresh()} aria-label="Refresh tracking"><RefreshCw size={18}/><span>Refresh</span></button></section>
 {error && <div role="alert" className={styles.error}>{error}{vehicles.length > 0 && " Showing the last received data; check its timestamp."}</div>}
 {loading ? <div className={styles.empty} role="status">Loading your vehicles…</div> : !vehicle ? <div className={styles.empty}><LocateFixed size={32}/><h2>{error ? "Tracking unavailable" : "No vehicles assigned yet"}</h2><p>{error ? "Refresh to try again." : "Your assigned vehicles will appear here when available."}</p></div> : <><div className={styles.trackingGrid}><section className={styles.mapCard}><div className={styles.sectionHead}><div><p className={styles.eyebrow}>YOUR VEHICLE</p><label htmlFor="customer-vehicle">Vehicle</label><select id="customer-vehicle" value={selection} onChange={event => setSelection(event.target.value)}>{vehicles.map(v => <option key={v.id} value={v.id}>{v.name || v.vehicleNo} · {v.vehicleNo}</option>)}</select></div><span className={styles.status}>{TRACKING_LABELS[telemetry!.state]}</span></div>
 {hasCoordinates(vehicle) ? <CustomerMap key={vehicle.id} latitude={vehicle.latitude!} longitude={vehicle.longitude!} vehicleType={vehicle.vehicleType} label={vehicle.name || vehicle.vehicleNo}/> : <div className={styles.mapLoading}><LocateFixed size={30}/><p>No GPS fix available</p><small>The map will appear after the device reports a location.</small></div>}
 <div className={styles.mapCaption}><span>{telemetry!.gps}</span><span>GPS reported: {time(vehicle.lastUpdate)}</span></div>
 <dl className={styles.identifiers} data-testid="customer-device-details"><div><dt>Device name</dt><dd>{vehicle.name || vehicle.vehicleNo}</dd></div><div><dt>IMEI no.</dt><dd>{vehicle.device?.imei || "Not assigned"}</dd></div><div><dt>Mobile no.</dt><dd>{formatSimNumber(vehicle.device?.simNumber)}</dd></div></dl></section>
 <aside className={styles.vehiclePanel}><div className={styles.vehicleHero}><p className={styles.eyebrow}>{getVehicleTypeLabel(vehicle.vehicleType)}</p><Image src={`/assets/customer-vehicles/${normalizeVehicleType(vehicle.vehicleType).toLowerCase()}.svg`} width={400} height={160} alt={getVehicleTypeLabel(vehicle.vehicleType)}/><h2>{vehicle.vehicleNo}</h2><p>{vehicle.name || "Your vehicle"}</p></div><div className={styles.telemetry}><div><span>Speed</span><strong>{telemetry!.speed}</strong></div><div><span>Ignition</span><strong>{telemetry!.ignition}</strong></div><div><span>Reported voltage</span><strong>{telemetry!.battery}</strong></div><div><span>Device connection</span><strong>{telemetry!.connection}</strong></div></div><p className={styles.freshness}>View refreshed: {time(refreshed)}<br />A refreshed view does not mean a new GPS fix.</p><Link className={styles.primaryLink} href="/dashboard/live-tracking">Open full tracking<ArrowUpRight size={18}/></Link></aside></div>
 <section className={styles.quickLinks} aria-label="Explore your journeys"><Link href="/dashboard/history"><Route /><div><h2>Journey history</h2><p>Look back at recorded routes.</p></div><ArrowUpRight /></Link><Link href="/dashboard/customer-settings"><LocateFixed /><div><h2>Alert preferences</h2><p>Areas, speed limits and notification options.</p></div><ArrowUpRight /></Link><Link href="/dashboard/alerts"><Shield /><div><h2>Alerts & activity</h2><p>Review available vehicle events.</p></div><ArrowUpRight /></Link></section></>}
 <p className={styles.footerNote}>NAVII GPS · Connected with clarity{user?.name ? ` · ${user.name}` : ""}</p></div>;
}
