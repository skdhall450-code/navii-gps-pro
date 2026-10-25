"use client";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { normalizeVehicleType } from "@/lib/vehicle-presentation";
import styles from "./customer.module.css";
type Props = {
    latitude: number;
    longitude: number;
    vehicleType?: string | null;
    label: string;
};
function Recenter({ latitude, longitude }: Props) { const map = useMap(); return <button className={styles.recenter} onClick={() => map.setView([latitude, longitude], Math.max(map.getZoom(), 14))}>Recenter</button>; }
export default function CustomerMap(props: Props) {
    const [tileError, setTileError] = useState(false);
    const [tileAttempt, setTileAttempt] = useState(0);
    const icon = L.icon({ iconUrl: `/assets/customer-vehicles/${normalizeVehicleType(props.vehicleType).toLowerCase()}.svg`, iconSize: [76, 42], iconAnchor: [38, 30] });
    return <div className={styles.map} data-testid="customer-map" aria-label={`Map for ${props.label}`}><MapContainer center={[props.latitude, props.longitude]} zoom={15} scrollWheelZoom touchZoom doubleClickZoom className={styles.leaflet}><TileLayer key={tileAttempt} eventHandlers={{ tileerror: () => setTileError(true) }} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/><Marker position={[props.latitude, props.longitude]} icon={icon} title={props.label}/><Recenter {...props}/></MapContainer>{tileError && <div className={styles.tileError} role="status">Map tiles could not load. GPS details remain below.<button onClick={() => { setTileError(false); setTileAttempt(value => value + 1); }}>Retry map</button></div>}</div>;
}
