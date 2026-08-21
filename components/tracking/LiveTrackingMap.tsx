"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  Battery,
  CircleDot,
  Crosshair,
  Gauge,
  MapPin,
  Navigation,
  Power,
  RefreshCw,
  Route,
  Satellite,
  Search,
  Truck,
  Wifi,
  WifiOff,
} from "lucide-react";

type VehicleStatus =
  | "MOVING"
  | "IDLE"
  | "OFFLINE";

type CommunicationState =
  | "LIVE"
  | "STALE"
  | "OFFLINE";

type Device = {
  id: string;
  imei: string;
  model: string | null;
  simNumber: string | null;
  isActive: boolean;
};

type Vehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;
  status: VehicleStatus;
  speed: number;
  ignition: boolean;
  battery: number | null;
  latitude: number | null;
  longitude: number | null;
  lastUpdate: string | null;
  device: Device | null;
};

type Position = {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  ignition: boolean;
  battery: number | null;
  recordedAt: string;
};

type VehiclesResponse = {
  success: boolean;
  data: Vehicle[];
  message?: string;
};

type HistoryResponse = {
  success: boolean;
  count: number;
  data: Position[];
  message?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_NAVII_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

const LIVE_TIMEOUT_MS =
  2 * 60 * 1000;

const OFFLINE_TIMEOUT_MS =
  10 * 60 * 1000;

function getAccessToken() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "navii_access_token",
  );
}

function getAuthHeaders(): HeadersInit {
  const token =
    getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization:
      `Bearer ${token}`,
  };
}

async function readJson<T>(
  response: Response,
): Promise<T> {
  const text =
    await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(
      text,
    ) as T;
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status})`,
    );
  }
}

function getCommunicationState(
  lastUpdate: string | null,
): CommunicationState {
  if (!lastUpdate) {
    return "OFFLINE";
  }

  const timestamp =
    new Date(
      lastUpdate,
    ).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    return "OFFLINE";
  }

  const age =
    Date.now() - timestamp;

  if (
    age <= LIVE_TIMEOUT_MS
  ) {
    return "LIVE";
  }

  if (
    age <=
    OFFLINE_TIMEOUT_MS
  ) {
    return "STALE";
  }

  return "OFFLINE";
}

function formatLastSeen(
  value: string | null,
) {
  if (!value) {
    return "Never";
  }

  const timestamp =
    new Date(
      value,
    ).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    return "Unknown";
  }

  const seconds =
    Math.max(
      0,
      Math.floor(
        (Date.now() -
          timestamp) /
          1000,
      ),
    );

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes =
    Math.floor(
      seconds / 60,
    );

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  return `${days}d ago`;
}

function createVehicleIcon(
  vehicle: Vehicle,
  selected: boolean,
) {
  const communication =
    getCommunicationState(
      vehicle.lastUpdate,
    );

  let border =
    "#64748b";

  let glow =
    "rgba(100,116,139,.5)";

  if (
    communication ===
    "LIVE"
  ) {
    if (
      vehicle.status ===
      "MOVING"
    ) {
      border =
        "#22c55e";

      glow =
        "rgba(34,197,94,.6)";
    } else {
      border =
        "#f59e0b";

      glow =
        "rgba(245,158,11,.6)";
    }
  } else if (
    communication ===
    "STALE"
  ) {
    border =
      "#f97316";

    glow =
      "rgba(249,115,22,.55)";
  } else {
    border =
      "#ef4444";

    glow =
      "rgba(239,68,68,.45)";
  }

  return L.divIcon({
    className: "",

    html: `
      <div style="
        width:${selected ? 48 : 42}px;
        height:${selected ? 48 : 42}px;
        border-radius:50%;
        background:#0f172a;
        border:${selected ? 4 : 3}px solid ${border};
        display:flex;
        align-items:center;
        justify-content:center;
        box-shadow:0 0 ${selected ? 26 : 18}px ${glow};
        color:${border};
        font-size:11px;
        font-weight:800;
        letter-spacing:.5px;
      ">
        GPS
      </div>
    `,

    iconSize: selected
      ? [48, 48]
      : [42, 42],

    iconAnchor: selected
      ? [24, 24]
      : [21, 21],

    popupAnchor: [
      0,
      -26,
    ],
  });
}

function MapUpdater({
  latitude,
  longitude,
  enabled,
  recenterTick,
}: {
  latitude: number;
  longitude: number;
  enabled: boolean;
  recenterTick: number;
}) {
  const map =
    useMap();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    map.setView(
      [
        latitude,
        longitude,
      ],
      map.getZoom() < 15
        ? 16
        : map.getZoom(),
      {
        animate: true,
      },
    );
  }, [
    latitude,
    longitude,
    enabled,
    recenterTick,
    map,
  ]);

  return null;
}

export default function LiveTrackingMap() {
  const [
    vehicles,
    setVehicles,
  ] =
    useState<Vehicle[]>(
      [],
    );

  const [
    selectedVehicleId,
    setSelectedVehicleId,
  ] =
    useState<
      string | null
    >(null);

  const [
    history,
    setHistory,
  ] =
    useState<Position[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] =
    useState(false);

  const [
    lastRefresh,
    setLastRefresh,
  ] =
    useState<Date | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    serverLive,
    setServerLive,
  ] =
    useState(false);

  const [
    autoFollow,
    setAutoFollow,
  ] =
    useState(true);

  const [
    recenterTick,
    setRecenterTick,
  ] =
    useState(0);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const selectedVehicle =
    useMemo(() => {
      return (
        vehicles.find(
          (vehicle) =>
            vehicle.id ===
            selectedVehicleId,
        ) ?? null
      );
    }, [
      vehicles,
      selectedVehicleId,
    ]);

  const handleUnauthorized =
    useCallback(() => {
      localStorage.removeItem(
        "navii_access_token",
      );

      localStorage.removeItem(
        "navii_user",
      );

      window.location.href =
        "/login";
    }, []);

  const loadVehicles =
    useCallback(
      async (
        manual = false,
      ) => {
        const token =
          getAccessToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        if (manual) {
          setRefreshing(
            true,
          );
        }

        try {
          const response =
            await fetch(
              `${API_BASE}/api/gps/latest`,
              {
                method:
                  "GET",

                headers:
                  getAuthHeaders(),

                cache:
                  "no-store",
              },
            );

          if (
            response.status ===
            401
          ) {
            handleUnauthorized();
            return;
          }

          if (
            response.status ===
            403
          ) {
            throw new Error(
              "You do not have permission to access live GPS tracking.",
            );
          }

          const result =
            await readJson<VehiclesResponse>(
              response,
            );

          if (
            !response.ok
          ) {
            throw new Error(
              result.message ||
                `GPS API returned ${response.status}`,
            );
          }

          if (
            !result.success
          ) {
            throw new Error(
              result.message ||
                "GPS API returned an unsuccessful response.",
            );
          }

          const list =
            Array.isArray(
              result.data,
            )
              ? result.data
              : [];

          setVehicles(
            list,
          );

          setSelectedVehicleId(
            (current) => {
              if (
                current &&
                list.some(
                  (
                    vehicle,
                  ) =>
                    vehicle.id ===
                    current,
                )
              ) {
                return current;
              }

              return (
                list[0]
                  ?.id ??
                null
              );
            },
          );

          setServerLive(
            true,
          );

          setLastRefresh(
            new Date(),
          );

          setError(
            null,
          );
        } catch (err) {
          setServerLive(
            false,
          );

          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load GPS data",
          );
        } finally {
          setLoading(
            false,
          );

          setRefreshing(
            false,
          );
        }
      },
      [
        handleUnauthorized,
      ],
    );

  const loadHistory =
    useCallback(
      async (
        vehicleId: string,
      ) => {
        const token =
          getAccessToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        try {
          setHistoryLoading(
            true,
          );

          const response =
            await fetch(
              `${API_BASE}/api/gps/history/${vehicleId}?limit=100`,
              {
                method:
                  "GET",

                headers:
                  getAuthHeaders(),

                cache:
                  "no-store",
              },
            );

          if (
            response.status ===
            401
          ) {
            handleUnauthorized();
            return;
          }

          if (
            response.status ===
            403
          ) {
            setHistory(
              [],
            );

            throw new Error(
              "You do not have permission to view this vehicle history.",
            );
          }

          const result =
            await readJson<HistoryResponse>(
              response,
            );

          if (
            !response.ok
          ) {
            throw new Error(
              result.message ||
                `History API returned ${response.status}`,
            );
          }

          const list =
            Array.isArray(
              result.data,
            )
              ? result.data
              : [];

          setHistory(
            [...list]
              .reverse()
              .filter(
                (
                  position,
                ) =>
                  Number.isFinite(
                    position.latitude,
                  ) &&
                  Number.isFinite(
                    position.longitude,
                  ),
              ),
          );
        } catch (err) {
          setHistory(
            [],
          );

          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load vehicle history",
          );
        } finally {
          setHistoryLoading(
            false,
          );
        }
      },
      [
        handleUnauthorized,
      ],
    );

  useEffect(() => {
    void loadVehicles();

    const interval =
      window.setInterval(
        () => {
          void loadVehicles();
        },
        5000,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [loadVehicles]);

  useEffect(() => {
    if (
      !selectedVehicleId
    ) {
      setHistory([]);
      return;
    }

    void loadHistory(
      selectedVehicleId,
    );
  }, [
    selectedVehicleId,
    loadHistory,
  ]);

  const filteredVehicles =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return vehicles;
      }

      return vehicles.filter(
        (vehicle) => {
          const text = [
            vehicle.vehicleNo,
            vehicle.name ?? "",
            vehicle.device
              ?.imei ?? "",
            vehicle.device
              ?.model ?? "",
          ]
            .join(" ")
            .toLowerCase();

          return text.includes(
            query,
          );
        },
      );
    }, [
      vehicles,
      search,
    ]);

  const validVehicles =
    useMemo(() => {
      return vehicles.filter(
        (vehicle) =>
          typeof
            vehicle.latitude ===
            "number" &&
          Number.isFinite(
            vehicle.latitude,
          ) &&
          typeof
            vehicle.longitude ===
            "number" &&
          Number.isFinite(
            vehicle.longitude,
          ),
      );
    }, [vehicles]);

  const routeCoordinates =
    useMemo(() => {
      return history.map(
        (position) =>
          [
            position.latitude,
            position.longitude,
          ] as [
            number,
            number,
          ],
      );
    }, [history]);

  const movingCount =
    useMemo(
      () =>
        vehicles.filter(
          (vehicle) =>
            vehicle.status ===
            "MOVING",
        ).length,
      [vehicles],
    );

  const idleCount =
    useMemo(
      () =>
        vehicles.filter(
          (vehicle) =>
            vehicle.status ===
            "IDLE",
        ).length,
      [vehicles],
    );

  const offlineCount =
    useMemo(
      () =>
        vehicles.filter(
          (vehicle) =>
            getCommunicationState(
              vehicle.lastUpdate,
            ) ===
            "OFFLINE",
        ).length,
      [vehicles],
    );

  const defaultLatitude =
    selectedVehicle
      ?.latitude ??
    30.6043;

  const defaultLongitude =
    selectedVehicle
      ?.longitude ??
    76.86310166666667;

  const selectedCommunication =
    selectedVehicle
      ? getCommunicationState(
          selectedVehicle.lastUpdate,
        )
      : "OFFLINE";

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-sky-400" />

          <p>
            Loading NAVII GPS
            Live Tracking...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b18] text-white">
      <div className="border-b border-white/10 bg-[#081121] px-6 py-5">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-sky-400">
              NAVII GPS INDIA
            </p>

            <h1 className="mt-1 text-2xl font-bold md:text-3xl">
              Live Vehicle Tracking
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Real-time GPS
              monitoring, telemetry
              and route history
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                void loadVehicles(
                  true,
                )
              }
              disabled={
                refreshing
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  serverLive
                    ? "animate-pulse bg-emerald-400"
                    : "bg-red-400"
                }`}
              />

              <div>
                <p className="text-xs text-slate-400">
                  API Status
                </p>

                <p
                  className={`text-sm font-semibold ${
                    serverLive
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {serverLive
                    ? "LIVE"
                    : "OFFLINE"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1800px] gap-5 p-5 xl:grid-cols-[370px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">
                Vehicles
              </h2>

              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs text-sky-400">
                {vehicles.length} Total
              </span>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#07101f] px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-500" />

              <input
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search vehicle / IMEI..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            {filteredVehicles.length >
            0 ? (
              <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {filteredVehicles.map(
                  (vehicle) => {
                    const selected =
                      selectedVehicleId ===
                      vehicle.id;

                    const communication =
                      getCommunicationState(
                        vehicle.lastUpdate,
                      );

                    return (
                      <button
                        key={
                          vehicle.id
                        }
                        type="button"
                        onClick={() => {
                          setSelectedVehicleId(
                            vehicle.id,
                          );

                          setAutoFollow(
                            true,
                          );

                          setRecenterTick(
                            (
                              current,
                            ) =>
                              current +
                              1,
                          );
                        }}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-sky-400 bg-sky-500/10"
                            : "border-white/10 bg-white/[0.03] hover:border-sky-500/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 gap-3">
                            <div className="rounded-xl bg-sky-500/10 p-2 text-sky-400">
                              <Truck className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold">
                                {
                                  vehicle.vehicleNo
                                }
                              </p>

                              <p className="truncate text-xs text-slate-400">
                                {vehicle
                                  .device
                                  ?.model ??
                                  "GPS Device"}
                              </p>
                            </div>
                          </div>

                          <CommunicationBadge
                            state={
                              communication
                            }
                          />
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                          <span>
                            Speed{" "}
                            {Number(
                              vehicle.speed ??
                                0,
                            ).toFixed(
                              1,
                            )}{" "}
                            km/h
                          </span>

                          <span>
                            {formatLastSeen(
                              vehicle.lastUpdate,
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
                No vehicles found.
              </div>
            )}
          </div>

          {selectedVehicle && (
            <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    Vehicle Telemetry
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {
                      selectedVehicle.vehicleNo
                    }
                  </p>
                </div>

                <CommunicationBadge
                  state={
                    selectedCommunication
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TelemetryCard
                  icon={
                    <Gauge />
                  }
                  label="Speed"
                  value={`${Number(
                    selectedVehicle.speed ??
                      0,
                  ).toFixed(
                    1,
                  )} km/h`}
                />

                <TelemetryCard
                  icon={
                    <Power />
                  }
                  label="Ignition"
                  value={
                    selectedVehicle.ignition
                      ? "ON"
                      : "OFF"
                  }
                />

                <TelemetryCard
                  icon={
                    <Battery />
                  }
                  label="Battery"
                  value={
                    selectedVehicle.battery !=
                    null
                      ? `${selectedVehicle.battery.toFixed(
                          2,
                        )} V`
                      : "—"
                  }
                />

                <TelemetryCard
                  icon={
                    <CircleDot />
                  }
                  label="GPS Status"
                  value={
                    selectedVehicle.status
                  }
                />
              </div>

              <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                <InfoLine
                  label="IMEI"
                  value={
                    selectedVehicle
                      .device
                      ?.imei ??
                    "—"
                  }
                />

                <InfoLine
                  label="Model"
                  value={
                    selectedVehicle
                      .device
                      ?.model ??
                    "—"
                  }
                />

                <InfoLine
                  label="SIM"
                  value={
                    selectedVehicle
                      .device
                      ?.simNumber ??
                    "—"
                  }
                />

                <InfoLine
                  label="Latitude"
                  value={
                    selectedVehicle.latitude !=
                    null
                      ? selectedVehicle.latitude.toFixed(
                          6,
                        )
                      : "—"
                  }
                />

                <InfoLine
                  label="Longitude"
                  value={
                    selectedVehicle.longitude !=
                    null
                      ? selectedVehicle.longitude.toFixed(
                          6,
                        )
                      : "—"
                  }
                />

                <InfoLine
                  label="Last Seen"
                  value={formatLastSeen(
                    selectedVehicle.lastUpdate,
                  )}
                />

                <InfoLine
                  label="Last Update"
                  value={
                    selectedVehicle.lastUpdate
                      ? new Date(
                          selectedVehicle.lastUpdate,
                        ).toLocaleString()
                      : "—"
                  }
                />
              </div>
            </div>
          )}
        </aside>

        <section className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              API Error: {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryCard
              title="Total Vehicles"
              value={
                vehicles.length.toString()
              }
              icon={<Truck />}
            />

            <SummaryCard
              title="Moving"
              value={
                movingCount.toString()
              }
              icon={
                <Navigation />
              }
            />

            <SummaryCard
              title="Idle"
              value={
                idleCount.toString()
              }
              icon={
                <CircleDot />
              }
            />

            <SummaryCard
              title="Offline"
              value={
                offlineCount.toString()
              }
              icon={
                <WifiOff />
              }
            />

            <SummaryCard
              title="Tracked"
              value={
                validVehicles.length.toString()
              }
              icon={
                <Satellite />
              }
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="font-semibold">
                  Live Map
                </h2>

                <p className="text-xs text-slate-400">
                  Auto refresh every
                  5 seconds
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setAutoFollow(
                      (
                        current,
                      ) =>
                        !current,
                    )
                  }
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    autoFollow
                      ? "border-sky-500/30 bg-sky-500/10 text-sky-400"
                      : "border-white/10 bg-white/[0.04] text-slate-400"
                  }`}
                >
                  <Crosshair className="h-4 w-4" />

                  Auto Follow{" "}
                  {autoFollow
                    ? "ON"
                    : "OFF"}
                </button>

                <button
                  type="button"
                  disabled={
                    !selectedVehicle ||
                    selectedVehicle.latitude ==
                      null ||
                    selectedVehicle.longitude ==
                      null
                  }
                  onClick={() => {
                    setAutoFollow(
                      true,
                    );

                    setRecenterTick(
                      (
                        current,
                      ) =>
                        current +
                        1,
                    );
                  }}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-40"
                >
                  <MapPin className="h-4 w-4" />

                  Recenter
                </button>

                <div className="ml-2 flex items-center gap-2 text-xs text-slate-400">
                  <RefreshCw className="h-4 w-4" />

                  {lastRefresh
                    ? `Updated ${lastRefresh.toLocaleTimeString()}`
                    : "Waiting..."}
                </div>
              </div>
            </div>

            <div className="h-[650px]">
              <MapContainer
                center={[
                  defaultLatitude,
                  defaultLongitude,
                ]}
                zoom={16}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {selectedVehicle
                  ?.latitude !=
                  null &&
                  selectedVehicle
                    .longitude !=
                    null && (
                    <MapUpdater
                      latitude={
                        selectedVehicle.latitude
                      }
                      longitude={
                        selectedVehicle.longitude
                      }
                      enabled={
                        autoFollow
                      }
                      recenterTick={
                        recenterTick
                      }
                    />
                  )}

                {routeCoordinates.length >
                  1 && (
                  <Polyline
                    positions={
                      routeCoordinates
                    }
                    pathOptions={{
                      weight: 4,
                      opacity: 0.75,
                    }}
                  />
                )}

                {validVehicles.map(
                  (vehicle) => {
                    const selected =
                      vehicle.id ===
                      selectedVehicleId;

                    return (
                      <Marker
                        key={
                          vehicle.id
                        }
                        position={[
                          vehicle.latitude as number,
                          vehicle.longitude as number,
                        ]}
                        icon={createVehicleIcon(
                          vehicle,
                          selected,
                        )}
                        eventHandlers={{
                          click:
                            () => {
                              setSelectedVehicleId(
                                vehicle.id,
                              );

                              setAutoFollow(
                                true,
                              );
                            },
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>
                              {
                                vehicle.vehicleNo
                              }
                            </strong>

                            <br />

                            {vehicle
                              .device
                              ?.model ??
                              "GPS Device"}

                            <br />

                            Speed:{" "}
                            {Number(
                              vehicle.speed ??
                                0,
                            ).toFixed(
                              1,
                            )}{" "}
                            km/h

                            <br />

                            Ignition:{" "}
                            {vehicle.ignition
                              ? "ON"
                              : "OFF"}

                            <br />

                            Battery:{" "}
                            {vehicle.battery !=
                            null
                              ? vehicle.battery.toFixed(
                                  2,
                                )
                              : "—"}{" "}
                            V

                            <br />

                            Last seen:{" "}
                            {formatLastSeen(
                              vehicle.lastUpdate,
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  },
                )}
              </MapContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                  <Route className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Route History
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {
                      history.length
                    }{" "}
                    GPS points loaded
                    for selected
                    vehicle
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  !selectedVehicleId ||
                  historyLoading
                }
                onClick={() => {
                  if (
                    selectedVehicleId
                  ) {
                    void loadHistory(
                      selectedVehicleId,
                    );
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm transition hover:bg-white/[0.08] disabled:opacity-40"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    historyLoading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh Route
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CommunicationBadge({
  state,
}: {
  state: CommunicationState;
}) {
  const styles: Record<
    CommunicationState,
    string
  > = {
    LIVE:
      "bg-emerald-500/10 text-emerald-400",

    STALE:
      "bg-orange-500/10 text-orange-400",

    OFFLINE:
      "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[state]}`}
    >
      {state === "LIVE" ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}

      {state}
    </span>
  );
}

function TelemetryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-2 h-5 w-5 text-sky-400">
        {icon}
      </div>

      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="text-right font-medium">
        {value}
      </span>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
          {icon}
        </div>
      </div>
    </div>
  );
}