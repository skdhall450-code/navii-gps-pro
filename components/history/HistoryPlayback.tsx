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
  CalendarDays,
  Clock,
  Gauge,
  History,
  MapPin,
  Pause,
  Play,
  Power,
  RefreshCw,
  RotateCcw,
  Route,
  SkipBack,
  SkipForward,
  Timer,
  Truck,
} from "lucide-react";

type Device = {
  imei: string;
  model: string | null;
};

type Vehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;
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

const playbackIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:46px;
      height:46px;
      border-radius:50%;
      background:#071426;
      border:3px solid #38bdf8;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 0 22px rgba(56,189,248,.7);
      color:#38bdf8;
      font-size:12px;
      font-weight:800;
    ">
      GPS
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 23],
});

const startIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:30px;
      height:30px;
      border-radius:50%;
      background:#10b981;
      border:3px solid white;
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-weight:bold;
      box-shadow:0 0 12px rgba(16,185,129,.7);
    ">S</div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const endIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:30px;
      height:30px;
      border-radius:50%;
      background:#ef4444;
      border:3px solid white;
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-weight:bold;
      box-shadow:0 0 12px rgba(239,68,68,.7);
    ">E</div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function getAccessToken() {
  if (
    typeof window === "undefined"
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

function PlaybackMapController({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map =
    useMap();

  useEffect(() => {
    map.panTo(
      [
        latitude,
        longitude,
      ],
      {
        animate: true,
        duration: 0.4,
      },
    );
  }, [
    latitude,
    longitude,
    map,
  ]);

  return null;
}

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const radius = 6371;

  const dLat =
    ((lat2 - lat1) *
      Math.PI) /
    180;

  const dLon =
    ((lon2 - lon1) *
      Math.PI) /
    180;

  const a =
    Math.sin(
      dLat / 2,
    ) ** 2 +
    Math.cos(
      (lat1 * Math.PI) /
        180,
    ) *
      Math.cos(
        (lat2 * Math.PI) /
          180,
      ) *
      Math.sin(
        dLon / 2,
      ) ** 2;

  return (
    2 *
    radius *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )
  );
}

function toLocalInputValue(
  date: Date,
) {
  const pad = (
    value: number,
  ) =>
    String(
      value,
    ).padStart(
      2,
      "0",
    );

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(
    date.getDate(),
  )}T${pad(
    date.getHours(),
  )}:${pad(
    date.getMinutes(),
  )}`;
}

function formatDuration(
  seconds: number,
) {
  if (
    !Number.isFinite(
      seconds,
    ) ||
    seconds <= 0
  ) {
    return "0m";
  }

  const hours =
    Math.floor(
      seconds / 3600,
    );

  const minutes =
    Math.floor(
      (seconds % 3600) /
        60,
    );

  const secs =
    Math.floor(
      seconds % 60,
    );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

export default function HistoryPlayback() {
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
    useState("");

  const [
    positions,
    setPositions,
  ] =
    useState<Position[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    vehiclesLoading,
    setVehiclesLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0);

  const [
    playing,
    setPlaying,
  ] =
    useState(false);

  const [
    playbackSpeed,
    setPlaybackSpeed,
  ] =
    useState(1);

  const [
    fromValue,
    setFromValue,
  ] =
    useState("");

  const [
    toValue,
    setToValue,
  ] =
    useState("");

  const selectedVehicle =
    useMemo(
      () =>
        vehicles.find(
          (vehicle) =>
            vehicle.id ===
            selectedVehicleId,
        ) ?? null,
      [
        vehicles,
        selectedVehicleId,
      ],
    );

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

  const setTodayRange =
    useCallback(() => {
      const now =
        new Date();

      const start =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
        );

      setFromValue(
        toLocalInputValue(
          start,
        ),
      );

      setToValue(
        toLocalInputValue(
          now,
        ),
      );
    }, []);

  const setLast24Hours =
    useCallback(() => {
      const now =
        new Date();

      const start =
        new Date(
          now.getTime() -
            24 *
              60 *
              60 *
              1000,
        );

      setFromValue(
        toLocalInputValue(
          start,
        ),
      );

      setToValue(
        toLocalInputValue(
          now,
        ),
      );
    }, []);

  useEffect(() => {
    setTodayRange();
  }, [setTodayRange]);

  const loadVehicles =
    useCallback(async () => {
      try {
        const token =
          getAccessToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        setVehiclesLoading(
          true,
        );

        setError(null);

        const response =
          await fetch(
            `${API_BASE}/api/gps/vehicles`,
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
            "You do not have permission to view vehicles.",
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
              `Vehicles API returned ${response.status}`,
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
              list[0]?.id ??
              ""
            );
          },
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load vehicle list",
        );

        setVehicles([]);
        setSelectedVehicleId(
          "",
        );
      } finally {
        setVehiclesLoading(
          false,
        );
      }
    }, [
      handleUnauthorized,
    ]);

  const loadHistory =
    useCallback(async () => {
      if (
        !selectedVehicleId
      ) {
        setPositions([]);
        return;
      }

      const token =
        getAccessToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      if (
        fromValue &&
        toValue &&
        new Date(
          fromValue,
        ).getTime() >
          new Date(
            toValue,
          ).getTime()
      ) {
        setError(
          "From date/time must be before To date/time.",
        );
        return;
      }

      setLoading(true);
      setPlaying(false);
      setCurrentIndex(0);
      setError(null);

      try {
        const params =
          new URLSearchParams();

        params.set(
          "limit",
          "10000",
        );

        if (fromValue) {
          params.set(
            "from",
            new Date(
              fromValue,
            ).toISOString(),
          );
        }

        if (toValue) {
          params.set(
            "to",
            new Date(
              toValue,
            ).toISOString(),
          );
        }

        const response =
          await fetch(
            `${API_BASE}/api/gps/history/${selectedVehicleId}?${params.toString()}`,
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
            "You do not have permission to view history for this vehicle.",
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

        const ordered = [
          ...(Array.isArray(
            result.data,
          )
            ? result.data
            : []),
        ]
          .reverse()
          .filter(
            (position) =>
              Number.isFinite(
                position.latitude,
              ) &&
              Number.isFinite(
                position.longitude,
              ),
          );

        setPositions(
          ordered,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load history",
        );

        setPositions([]);
      } finally {
        setLoading(false);
      }
    }, [
      selectedVehicleId,
      fromValue,
      toValue,
      handleUnauthorized,
    ]);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    if (
      selectedVehicleId &&
      fromValue &&
      toValue
    ) {
      void loadHistory();
    }
  }, [
    selectedVehicleId,
    fromValue,
    toValue,
    loadHistory,
  ]);

  useEffect(() => {
    if (
      !playing ||
      positions.length <= 1
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setCurrentIndex(
            (index) => {
              if (
                index >=
                positions.length -
                  1
              ) {
                setPlaying(
                  false,
                );

                return index;
              }

              return (
                index + 1
              );
            },
          );
        },
        1000 /
          playbackSpeed,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    playing,
    playbackSpeed,
    positions.length,
  ]);

  const currentPosition =
    positions[
      currentIndex
    ] ?? null;

  const routeCoordinates =
    useMemo(
      () =>
        positions.map(
          (
            position,
          ) =>
            [
              position.latitude,
              position.longitude,
            ] as [
              number,
              number,
            ],
        ),
      [positions],
    );

  const travelledCoordinates =
    useMemo(
      () =>
        positions
          .slice(
            0,
            currentIndex +
              1,
          )
          .map(
            (
              position,
            ) =>
              [
                position.latitude,
                position.longitude,
              ] as [
                number,
                number,
              ],
          ),
      [
        positions,
        currentIndex,
      ],
    );

  const totalDistance =
    useMemo(() => {
      let total = 0;

      for (
        let index = 1;
        index <
        positions.length;
        index++
      ) {
        total +=
          distanceKm(
            positions[
              index - 1
            ].latitude,
            positions[
              index - 1
            ].longitude,
            positions[
              index
            ].latitude,
            positions[
              index
            ].longitude,
          );
      }

      return total;
    }, [positions]);

  const maxSpeed =
    useMemo(
      () =>
        positions.reduce(
          (
            max,
            position,
          ) =>
            Math.max(
              max,
              Number(
                position.speed ??
                  0,
              ),
            ),
          0,
        ),
      [positions],
    );

  const averageSpeed =
    useMemo(() => {
      if (
        positions.length ===
        0
      ) {
        return 0;
      }

      const total =
        positions.reduce(
          (
            sum,
            position,
          ) =>
            sum +
            Number(
              position.speed ??
                0,
            ),
          0,
        );

      return (
        total /
        positions.length
      );
    }, [positions]);

  const movingPoints =
    useMemo(
      () =>
        positions.filter(
          (position) =>
            Number(
              position.speed ??
                0,
            ) > 2,
        ).length,
      [positions],
    );

  const stoppedPoints =
    positions.length -
    movingPoints;

  const startPosition =
    positions[0] ??
    null;

  const endPosition =
    positions.length
      ? positions[
          positions.length -
            1
        ]
      : null;

  const routeDurationSeconds =
    useMemo(() => {
      if (
        !startPosition ||
        !endPosition
      ) {
        return 0;
      }

      return Math.max(
        0,
        (
          new Date(
            endPosition.recordedAt,
          ).getTime() -
          new Date(
            startPosition.recordedAt,
          ).getTime()
        ) / 1000,
      );
    }, [
      startPosition,
      endPosition,
    ]);

  const progress =
    positions.length > 1
      ? (currentIndex /
          (positions.length -
            1)) *
        100
      : 0;

  const defaultCenter:
    [number, number] =
    currentPosition
      ? [
          currentPosition.latitude,
          currentPosition.longitude,
        ]
      : [
          30.6043,
          76.8631,
        ];

  function resetPlayback() {
    setPlaying(false);
    setCurrentIndex(0);
  }

  function previousPoint() {
    setPlaying(false);

    setCurrentIndex(
      (index) =>
        Math.max(
          index - 1,
          0,
        ),
    );
  }

  function nextPoint() {
    setPlaying(false);

    setCurrentIndex(
      (index) =>
        Math.min(
          index + 1,
          Math.max(
            positions.length -
              1,
            0,
          ),
        ),
    );
  }

  return (
    <div className="min-h-screen bg-[#050b18] text-white">
      <header className="border-b border-white/10 bg-[#081121] px-6 py-5">
        <div className="mx-auto max-w-[1800px]">
          <p className="text-xs font-semibold tracking-[0.3em] text-sky-400">
            NAVII GPS INDIA
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            History & Route
            Playback
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Historical GPS route,
            trip statistics and
            interactive playback
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-5">
        <div className="mb-5 rounded-2xl border border-white/10 bg-[#0a1426] p-5">
          <div className="grid gap-4 xl:grid-cols-5">
            <Field label="Vehicle">
              <select
                value={
                  selectedVehicleId
                }
                disabled={
                  vehiclesLoading ||
                  vehicles.length ===
                    0
                }
                onChange={(
                  event,
                ) =>
                  setSelectedVehicleId(
                    event.target
                      .value,
                  )
                }
                className="field"
              >
                {vehicles.length ===
                  0 && (
                  <option value="">
                    No vehicles
                  </option>
                )}

                {vehicles.map(
                  (vehicle) => (
                    <option
                      key={
                        vehicle.id
                      }
                      value={
                        vehicle.id
                      }
                    >
                      {
                        vehicle.vehicleNo
                      }
                    </option>
                  ),
                )}
              </select>
            </Field>

            <Field label="From">
              <input
                type="datetime-local"
                value={
                  fromValue
                }
                onChange={(
                  event,
                ) =>
                  setFromValue(
                    event.target
                      .value,
                  )
                }
                className="field"
              />
            </Field>

            <Field label="To">
              <input
                type="datetime-local"
                value={toValue}
                onChange={(
                  event,
                ) =>
                  setToValue(
                    event.target
                      .value,
                  )
                }
                className="field"
              />
            </Field>

            <Field label="Device">
              <div className="field">
                {selectedVehicle
                  ?.device?.model ??
                  "—"}
              </div>
            </Field>

            <Field label="IMEI">
              <div className="field font-mono text-xs">
                {selectedVehicle
                  ?.device?.imei ??
                  "—"}
              </div>
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  setTodayRange
                }
                className="secondary-button"
              >
                Today
              </button>

              <button
                type="button"
                onClick={
                  setLast24Hours
                }
                className="secondary-button"
              >
                Last 24 Hours
              </button>
            </div>

            <button
              type="button"
              disabled={
                loading ||
                !selectedVehicleId
              }
              onClick={() =>
                void loadHistory()
              }
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-sky-400 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Load History
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            API Error: {error}
          </div>
        )}

        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard
            icon={
              <History />
            }
            label="GPS Points"
            value={
              positions.length.toString()
            }
          />

          <StatCard
            icon={<Route />}
            label="Distance"
            value={`${totalDistance.toFixed(
              2,
            )} km`}
          />

          <StatCard
            icon={<Timer />}
            label="Duration"
            value={formatDuration(
              routeDurationSeconds,
            )}
          />

          <StatCard
            icon={<Gauge />}
            label="Max Speed"
            value={`${maxSpeed.toFixed(
              1,
            )} km/h`}
          />

          <StatCard
            icon={<Gauge />}
            label="Avg Speed"
            value={`${averageSpeed.toFixed(
              1,
            )} km/h`}
          />

          <StatCard
            icon={<Truck />}
            label="Playback"
            value={
              positions.length
                ? `${
                    currentIndex +
                    1
                  } / ${
                    positions.length
                  }`
                : "0 / 0"
            }
          />
        </div>

        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={
              <Power />
            }
            label="Moving Points"
            value={movingPoints.toString()}
          />

          <InfoCard
            icon={
              <Pause />
            }
            label="Stopped Points"
            value={stoppedPoints.toString()}
          />

          <InfoCard
            icon={
              <CalendarDays />
            }
            label="Route Start"
            value={
              startPosition
                ? new Date(
                    startPosition.recordedAt,
                  ).toLocaleString()
                : "—"
            }
          />

          <InfoCard
            icon={<Clock />}
            label="Route End"
            value={
              endPosition
                ? new Date(
                    endPosition.recordedAt,
                  ).toLocaleString()
                : "—"
            }
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <h2 className="text-lg font-semibold">
                Route Playback
              </h2>

              <p className="text-xs text-slate-400">
                {loading
                  ? "Loading history..."
                  : positions.length
                    ? `${positions.length} GPS points loaded`
                    : "No GPS history loaded"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                title="Reset"
                onClick={
                  resetPlayback
                }
                disabled={
                  !positions.length
                }
                className="control-button"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                title="Previous"
                onClick={
                  previousPoint
                }
                disabled={
                  !positions.length
                }
                className="control-button"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPlaying(
                    (value) =>
                      !value,
                  )
                }
                disabled={
                  positions.length <=
                  1
                }
                className="rounded-lg bg-sky-500 p-2.5 transition hover:bg-sky-400 disabled:opacity-40"
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                title="Next"
                onClick={
                  nextPoint
                }
                disabled={
                  !positions.length
                }
                className="control-button"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              <select
                value={
                  playbackSpeed
                }
                onChange={(
                  event,
                ) =>
                  setPlaybackSpeed(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="rounded-lg border border-white/10 bg-[#07101f] px-3 py-2 text-sm"
              >
                <option
                  value={0.5}
                >
                  0.5x
                </option>

                <option
                  value={1}
                >
                  1x
                </option>

                <option
                  value={2}
                >
                  2x
                </option>

                <option
                  value={5}
                >
                  5x
                </option>

                <option
                  value={10}
                >
                  10x
                </option>
              </select>
            </div>
          </div>

          <div className="h-[650px]">
            <MapContainer
              center={
                defaultCenter
              }
              zoom={16}
              scrollWheelZoom
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {routeCoordinates.length >
                1 && (
                <Polyline
                  positions={
                    routeCoordinates
                  }
                  pathOptions={{
                    weight: 4,
                    opacity: 0.35,
                  }}
                />
              )}

              {travelledCoordinates.length >
                1 && (
                <Polyline
                  positions={
                    travelledCoordinates
                  }
                  pathOptions={{
                    weight: 6,
                    opacity: 0.9,
                  }}
                />
              )}

              {startPosition && (
                <Marker
                  position={[
                    startPosition.latitude,
                    startPosition.longitude,
                  ]}
                  icon={startIcon}
                >
                  <Popup>
                    Route Start
                  </Popup>
                </Marker>
              )}

              {endPosition && (
                <Marker
                  position={[
                    endPosition.latitude,
                    endPosition.longitude,
                  ]}
                  icon={endIcon}
                >
                  <Popup>
                    Route End
                  </Popup>
                </Marker>
              )}

              {currentPosition && (
                <>
                  <PlaybackMapController
                    latitude={
                      currentPosition.latitude
                    }
                    longitude={
                      currentPosition.longitude
                    }
                  />

                  <Marker
                    position={[
                      currentPosition.latitude,
                      currentPosition.longitude,
                    ]}
                    icon={
                      playbackIcon
                    }
                  >
                    <Popup>
                      <strong>
                        {selectedVehicle
                          ?.vehicleNo ??
                          "Vehicle"}
                      </strong>

                      <br />

                      Speed:{" "}
                      {Number(
                        currentPosition.speed ??
                          0,
                      ).toFixed(
                        1,
                      )}{" "}
                      km/h

                      <br />

                      Ignition:{" "}
                      {currentPosition.ignition
                        ? "ON"
                        : "OFF"}

                      <br />

                      Battery:{" "}
                      {currentPosition.battery !=
                      null
                        ? currentPosition.battery.toFixed(
                            2,
                          )
                        : "—"}{" "}
                      V

                      <br />

                      {new Date(
                        currentPosition.recordedAt,
                      ).toLocaleString()}
                    </Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          </div>

          <div className="border-t border-white/10 p-5">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>
                {positions.length
                  ? `${progress.toFixed(
                      0,
                    )}% complete`
                  : "No playback data"}
              </span>

              <span>
                {currentPosition
                  ? new Date(
                      currentPosition.recordedAt,
                    ).toLocaleString()
                  : "—"}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(
                positions.length -
                  1,
                0,
              )}
              value={Math.min(
                currentIndex,
                Math.max(
                  positions.length -
                    1,
                  0,
                ),
              )}
              disabled={
                positions.length <=
                1
              }
              onChange={(
                event,
              ) => {
                setPlaying(
                  false,
                );

                setCurrentIndex(
                  Number(
                    event.target
                      .value,
                  ),
                );
              }}
              className="w-full disabled:opacity-40"
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <InfoCard
                icon={
                  <MapPin />
                }
                label="Coordinates"
                value={
                  currentPosition
                    ? `${currentPosition.latitude.toFixed(
                        6,
                      )}, ${currentPosition.longitude.toFixed(
                        6,
                      )}`
                    : "—"
                }
              />

              <InfoCard
                icon={
                  <Gauge />
                }
                label="Speed"
                value={
                  currentPosition
                    ? `${Number(
                        currentPosition.speed ??
                          0,
                      ).toFixed(
                        1,
                      )} km/h`
                    : "—"
                }
              />

              <InfoCard
                icon={
                  <Power />
                }
                label="Ignition"
                value={
                  currentPosition
                    ? currentPosition.ignition
                      ? "ON"
                      : "OFF"
                    : "—"
                }
              />

              <InfoCard
                icon={
                  <Battery />
                }
                label="Battery"
                value={
                  currentPosition
                    ?.battery !=
                  null
                    ? `${currentPosition.battery.toFixed(
                        2,
                      )} V`
                    : "—"
                }
              />

              <InfoCard
                icon={
                  <Clock />
                }
                label="Time"
                value={
                  currentPosition
                    ? new Date(
                        currentPosition.recordedAt,
                      ).toLocaleTimeString()
                    : "—"
                }
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          .field {
            width: 100%;
            min-height: 46px;
            border-radius: 0.75rem;
            border: 1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
            background: #07101f;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            color: white;
            outline: none;
          }

          .secondary-button {
            border-radius: 0.75rem;
            border: 1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
            background: rgba(
              255,
              255,
              255,
              0.04
            );
            padding: 0.625rem
              1rem;
            font-size: 0.875rem;
            transition: 0.2s;
          }

          .secondary-button:hover {
            background: rgba(
              255,
              255,
              255,
              0.08
            );
          }

          .control-button {
            border-radius: 0.5rem;
            border: 1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
            background: rgba(
              255,
              255,
              255,
              0.05
            );
            padding: 0.625rem;
            transition: 0.2s;
          }

          .control-button:hover {
            background: rgba(
              255,
              255,
              255,
              0.1
            );
          }

          .control-button:disabled {
            opacity: 0.4;
          }
        `}</style>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs text-slate-400">
        {label}
      </label>

      {children}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon:
    React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
        {icon}
      </div>

      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon:
    React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2 text-sky-400">
        {icon}

        <span className="text-xs text-slate-400">
          {label}
        </span>
      </div>

      <p className="font-semibold">
        {value}
      </p>
    </div>
  );
}