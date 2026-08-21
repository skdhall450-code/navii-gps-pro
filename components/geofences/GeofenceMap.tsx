"use client";

import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import {
  useEffect,
} from "react";

import L from "leaflet";

type Geofence = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  active: boolean;
  vehicleNo: string;
};

type Props = {
  geofences: Geofence[];

  latitude: number;
  longitude: number;
  radius: number;

  vehicleNo?: string | null;
  vehicleLatitude?: number | null;
  vehicleLongitude?: number | null;

  selectedGeofenceId?: string | null;

  editable?: boolean;

  onCenterChange?: (
    latitude: number,
    longitude: number,
  ) => void;
};

const selectedCenterIcon =
  L.divIcon({
    className: "",

    html: `
      <div style="
        width:34px;
        height:34px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#071426;
        border:3px solid #38bdf8;
        box-shadow:0 0 20px rgba(56,189,248,.75);
        color:#38bdf8;
        font-size:11px;
        font-weight:800;
      ">
        ZONE
      </div>
    `,

    iconSize: [
      34,
      34,
    ],

    iconAnchor: [
      17,
      17,
    ],

    popupAnchor: [
      0,
      -20,
    ],
  });

const vehicleIcon =
  L.divIcon({
    className: "",

    html: `
      <div style="
        width:42px;
        height:42px;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#071426;
        border:3px solid #22c55e;
        box-shadow:0 0 18px rgba(34,197,94,.65);
        color:#22c55e;
        font-size:11px;
        font-weight:800;
      ">
        GPS
      </div>
    `,

    iconSize: [
      42,
      42,
    ],

    iconAnchor: [
      21,
      21,
    ],

    popupAnchor: [
      0,
      -24,
    ],
  });

function MapController({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map =
    useMap();

  useEffect(() => {
    if (
      !Number.isFinite(
        latitude,
      ) ||
      !Number.isFinite(
        longitude,
      )
    ) {
      return;
    }

    map.setView(
      [
        latitude,
        longitude,
      ],
      Math.max(
        map.getZoom(),
        15,
      ),
      {
        animate: true,
      },
    );
  }, [
    latitude,
    longitude,
    map,
  ]);

  return null;
}

function MapClickHandler({
  enabled,
  onCenterChange,
}: {
  enabled: boolean;
  onCenterChange?: (
    latitude: number,
    longitude: number,
  ) => void;
}) {
  useMapEvents({
    click(event) {
      if (
        !enabled ||
        !onCenterChange
      ) {
        return;
      }

      onCenterChange(
        Number(
          event.latlng.lat.toFixed(
            6,
          ),
        ),
        Number(
          event.latlng.lng.toFixed(
            6,
          ),
        ),
      );
    },
  });

  return null;
}

export default function GeofenceMap({
  geofences,
  latitude,
  longitude,
  radius,
  vehicleNo,
  vehicleLatitude,
  vehicleLongitude,
  selectedGeofenceId,
  editable = false,
  onCenterChange,
}: Props) {
  const safeLatitude =
    Number.isFinite(
      latitude,
    )
      ? latitude
      : 30.6043;

  const safeLongitude =
    Number.isFinite(
      longitude,
    )
      ? longitude
      : 76.8631;

  const safeRadius =
    Number.isFinite(
      radius,
    ) &&
    radius > 0
      ? radius
      : 100;

  const hasVehicleLocation =
    typeof vehicleLatitude ===
      "number" &&
    Number.isFinite(
      vehicleLatitude,
    ) &&
    typeof vehicleLongitude ===
      "number" &&
    Number.isFinite(
      vehicleLongitude,
    );

  return (
    <MapContainer
      center={[
        safeLatitude,
        safeLongitude,
      ]}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController
        latitude={
          safeLatitude
        }
        longitude={
          safeLongitude
        }
      />

      <MapClickHandler
        enabled={
          editable
        }
        onCenterChange={
          onCenterChange
        }
      />

      {/*
       * Selected / edited geofence
       * preview.
       */}
      <Circle
        center={[
          safeLatitude,
          safeLongitude,
        ]}
        radius={
          safeRadius
        }
        pathOptions={{
          color:
            "#38bdf8",

          fillColor:
            "#38bdf8",

          weight: 3,

          fillOpacity:
            0.14,
        }}
      />

      <Marker
        position={[
          safeLatitude,
          safeLongitude,
        ]}
        icon={
          selectedCenterIcon
        }
      >
        <Popup>
          <strong>
            Geofence Center
          </strong>

          <br />

          Latitude:{" "}
          {safeLatitude.toFixed(
            6,
          )}

          <br />

          Longitude:{" "}
          {safeLongitude.toFixed(
            6,
          )}

          <br />

          Radius:{" "}
          {safeRadius} m

          {editable && (
            <>
              <br />
              Click anywhere on
              the map to move
              this center.
            </>
          )}
        </Popup>
      </Marker>

      {/*
       * Actual selected vehicle
       * position.
       */}
      {hasVehicleLocation && (
        <Marker
          position={[
            vehicleLatitude as number,
            vehicleLongitude as number,
          ]}
          icon={
            vehicleIcon
          }
        >
          <Popup>
            <strong>
              {vehicleNo ||
                "Selected Vehicle"}
            </strong>

            <br />

            Current GPS
            Position

            <br />

            {(vehicleLatitude as number).toFixed(
              6,
            )}
            ,{" "}
            {(vehicleLongitude as number).toFixed(
              6,
            )}
          </Popup>
        </Marker>
      )}

      {/*
       * Existing saved
       * geofences.
       */}
      {geofences.map(
        (geofence) => {
          const selected =
            geofence.id ===
            selectedGeofenceId;

          return (
            <Circle
              key={
                geofence.id
              }
              center={[
                geofence.latitude,
                geofence.longitude,
              ]}
              radius={
                geofence.radius
              }
              pathOptions={{
                color:
                  selected
                    ? "#f59e0b"
                    : geofence.active
                      ? "#22c55e"
                      : "#64748b",

                fillColor:
                  selected
                    ? "#f59e0b"
                    : geofence.active
                      ? "#22c55e"
                      : "#64748b",

                weight:
                  selected
                    ? 4
                    : 3,

                fillOpacity:
                  selected
                    ? 0.22
                    : geofence.active
                      ? 0.12
                      : 0.05,

                opacity:
                  geofence.active
                    ? 1
                    : 0.45,
              }}
            >
              <Popup>
                <strong>
                  {
                    geofence.name
                  }
                </strong>

                <br />

                Vehicle:{" "}
                {
                  geofence.vehicleNo
                }

                <br />

                Radius:{" "}
                {
                  geofence.radius
                }{" "}
                m

                <br />

                Status:{" "}
                {geofence.active
                  ? "Active"
                  : "Inactive"}
              </Popup>
            </Circle>
          );
        },
      )}
    </MapContainer>
  );
}