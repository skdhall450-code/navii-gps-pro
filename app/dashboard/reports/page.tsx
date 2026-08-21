"use client";

import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Download,
  Gauge,
  MapPin,
  RefreshCw,
  Route,
  Search,
  Timer,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

type Device = {
  id: string;
  imei: string;
  model: string | null;
  simNumber: string | null;
  isActive?: boolean;
};

type Vehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;
  status: "MOVING" | "IDLE" | "OFFLINE";
  speed: number;
  ignition: boolean;
  battery: number | null;
  latitude: number | null;
  longitude: number | null;
  lastUpdate: string | null;
  device?: Device | null;
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

type ReportSummary = {
  totalPoints: number;
  totalDistanceKm: number;
  maxSpeedKph: number;
  averageSpeedKph: number;
  runningSeconds: number;
  idleSeconds: number;
  ignitionOnSeconds: number;
  ignitionOffSeconds: number;
  totalAlerts?: number;
  openAlerts?: number;
  resolvedAlerts?: number;
  geofenceEntries?: number;
  geofenceExits?: number;
};

type ReportVehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;
  status: string;
  device: {
    id: string;
    imei: string;
    model: string | null;
    simNumber: string | null;
  } | null;
};

type ReportPeriod = {
  from: string | null;
  to: string | null;
};

type ReportLocation = {
  latitude: number;
  longitude: number;
  recordedAt: string;
} | null;

type TripResponse = {
  success: boolean;
  message?: string;
  data: {
    vehicle: ReportVehicle;
    period: ReportPeriod;
    summary: ReportSummary;
    startLocation: ReportLocation;
    endLocation: ReportLocation;
    positions: Position[];
  };
};

type SummaryResponse = {
  success: boolean;
  message?: string;
  data: {
    vehicle: ReportVehicle;
    period: ReportPeriod;
    summary: ReportSummary;
    startLocation: ReportLocation;
    endLocation: ReportLocation;
  };
};

type AlertRecord = {
  id: string;
  type: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
};

type AlertResponse = {
  success: boolean;
  count: number;
  data: AlertRecord[];
  message?: string;
};

type VehiclesResponse = {
  success: boolean;
  data: Vehicle[];
  message?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_NAVII_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(
    "navii_access_token",
  );
}

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
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
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status})`,
    );
  }
}

function toLocalInputValue(
  date: Date,
) {
  const pad = (
    value: number,
  ) =>
    String(value).padStart(
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
  seconds?: number,
) {
  const value =
    Math.max(
      0,
      seconds ?? 0,
    );

  const hours =
    Math.floor(
      value / 3600,
    );

  const minutes =
    Math.floor(
      (value % 3600) /
        60,
    );

  const secs =
    Math.floor(
      value % 60,
    );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

function ReportsPageContent() {
  const [
    vehicles,
    setVehicles,
  ] =
    useState<Vehicle[]>([]);

  const [
    vehicleId,
    setVehicleId,
  ] =
    useState("");

  const [
    from,
    setFrom,
  ] =
    useState("");

  const [
    to,
    setTo,
  ] =
    useState("");

  const [
    summary,
    setSummary,
  ] =
    useState<
      SummaryResponse["data"] | null
    >(null);

  const [
    trip,
    setTrip,
  ] =
    useState<
      TripResponse["data"] | null
    >(null);

  const [
    alerts,
    setAlerts,
  ] =
    useState<AlertRecord[]>([]);

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
    search,
    setSearch,
  ] =
    useState("");

  const [
    alertSearch,
    setAlertSearch,
  ] =
    useState("");

  const [
    lastRefresh,
    setLastRefresh,
  ] =
    useState<
      Date | null
    >(null);

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

  const setToday =
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

      setFrom(
        toLocalInputValue(
          start,
        ),
      );

      setTo(
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

      setFrom(
        toLocalInputValue(
          start,
        ),
      );

      setTo(
        toLocalInputValue(
          now,
        ),
      );
    }, []);

  const setLast7Days =
    useCallback(() => {
      const now =
        new Date();

      const start =
        new Date(
          now.getTime() -
            7 *
              24 *
              60 *
              60 *
              1000,
        );

      setFrom(
        toLocalInputValue(
          start,
        ),
      );

      setTo(
        toLocalInputValue(
          now,
        ),
      );
    }, []);

  useEffect(() => {
    setToday();
  }, [setToday]);

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

        const response =
          await fetch(
            `${API_BASE}/api/gps/vehicles`,
            {
              method: "GET",
              headers:
                getAuthHeaders(),
              cache: "no-store",
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

        setVehicleId(
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
            : "Unable to load vehicles",
        );
      } finally {
        setVehiclesLoading(
          false,
        );
      }
    }, [
      handleUnauthorized,
    ]);

  const loadReport =
    useCallback(async () => {
      if (!vehicleId) {
        return;
      }

      const token =
        getAccessToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      if (
        from &&
        to &&
        new Date(
          from,
        ).getTime() >
          new Date(
            to,
          ).getTime()
      ) {
        setError(
          "From date/time must be before To date/time.",
        );
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params =
          new URLSearchParams();

        if (from) {
          params.set(
            "from",
            new Date(
              from,
            ).toISOString(),
          );
        }

        if (to) {
          params.set(
            "to",
            new Date(
              to,
            ).toISOString(),
          );
        }

        const query =
          params.toString()
            ? `?${params.toString()}`
            : "";

        const separator =
          query
            ? "&"
            : "?";

        const [
          summaryResponse,
          tripResponse,
          alertsResponse,
        ] =
          await Promise.all([
            fetch(
              `${API_BASE}/api/gps/reports/summary/${vehicleId}${query}`,
              {
                method:
                  "GET",
                headers:
                  getAuthHeaders(),
                cache:
                  "no-store",
              },
            ),

            fetch(
              `${API_BASE}/api/gps/reports/trip/${vehicleId}${query}${separator}limit=5000`,
              {
                method:
                  "GET",
                headers:
                  getAuthHeaders(),
                cache:
                  "no-store",
              },
            ),

            fetch(
              `${API_BASE}/api/gps/reports/alerts/${vehicleId}${query}${separator}limit=500`,
              {
                method:
                  "GET",
                headers:
                  getAuthHeaders(),
                cache:
                  "no-store",
              },
            ),
          ]);

        if (
          summaryResponse.status ===
            401 ||
          tripResponse.status ===
            401 ||
          alertsResponse.status ===
            401
        ) {
          handleUnauthorized();
          return;
        }

        if (
          summaryResponse.status ===
            403 ||
          tripResponse.status ===
            403 ||
          alertsResponse.status ===
            403
        ) {
          throw new Error(
            "You do not have permission to access reports for this vehicle.",
          );
        }

        const summaryJson =
          await readJson<SummaryResponse>(
            summaryResponse,
          );

        const tripJson =
          await readJson<TripResponse>(
            tripResponse,
          );

        const alertsJson =
          await readJson<AlertResponse>(
            alertsResponse,
          );

        if (
          !summaryResponse.ok
        ) {
          throw new Error(
            summaryJson.message ||
              `Summary API returned ${summaryResponse.status}`,
          );
        }

        if (!tripResponse.ok) {
          throw new Error(
            tripJson.message ||
              `Trip API returned ${tripResponse.status}`,
          );
        }

        if (
          !alertsResponse.ok
        ) {
          throw new Error(
            alertsJson.message ||
              `Alerts report API returned ${alertsResponse.status}`,
          );
        }

        setSummary(
          summaryJson.data,
        );

        setTrip(
          tripJson.data,
        );

        setAlerts(
          Array.isArray(
            alertsJson.data,
          )
            ? alertsJson.data
            : [],
        );

        setLastRefresh(
          new Date(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load report",
        );
      } finally {
        setLoading(false);
      }
    }, [
      vehicleId,
      from,
      to,
      handleUnauthorized,
    ]);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    if (
      vehicleId &&
      from &&
      to
    ) {
      void loadReport();
    }
  }, [
    vehicleId,
    from,
    to,
    loadReport,
  ]);

  const selectedVehicle =
    useMemo(
      () =>
        vehicles.find(
          (vehicle) =>
            vehicle.id ===
            vehicleId,
        ) ?? null,
      [
        vehicles,
        vehicleId,
      ],
    );

  const filteredPositions =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const positions =
        trip?.positions ??
        [];

      if (!query) {
        return positions;
      }

      return positions.filter(
        (position) => {
          const text = [
            position.latitude,
            position.longitude,
            position.speed,
            position.ignition
              ? "on"
              : "off",
            position.battery ??
              "",
            position.recordedAt,
          ]
            .join(" ")
            .toLowerCase();

          return text.includes(
            query,
          );
        },
      );
    }, [
      trip,
      search,
    ]);

  const filteredAlerts =
    useMemo(() => {
      const query =
        alertSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return alerts;
      }

      return alerts.filter(
        (alert) =>
          [
            alert.type,
            alert.message,
            alert.isResolved
              ? "resolved"
              : "open",
            alert.createdAt,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query),
      );
    }, [
      alerts,
      alertSearch,
    ]);

  const openAlerts =
    alerts.filter(
      (alert) =>
        !alert.isResolved,
    ).length;

  const resolvedAlerts =
    alerts.length -
    openAlerts;

  function exportCsv() {
    if (!trip) {
      return;
    }

    const rows = [
      [
        "Recorded At",
        "Latitude",
        "Longitude",
        "Speed km/h",
        "Ignition",
        "Battery V",
      ],

      ...trip.positions.map(
        (position) => [
          position.recordedAt,
          position.latitude,
          position.longitude,
          position.speed,
          position.ignition
            ? "ON"
            : "OFF",
          position.battery ??
            "",
        ],
      ),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const text =
              String(
                value,
              ).replace(
                /"/g,
                '""',
              );

            return `"${text}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        },
      );

    const url =
      URL.createObjectURL(
        blob,
      );

    const anchor =
      document.createElement(
        "a",
      );

    anchor.href = url;

    anchor.download =
      `navii-report-${
        summary?.vehicle
          .vehicleNo ??
        "vehicle"
      }-${new Date()
        .toISOString()
        .slice(
          0,
          10,
        )}.csv`;

    document.body.appendChild(
      anchor,
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(
      url,
    );
  }

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1750px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              ADVANCED FLEET ANALYTICS
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Reports
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Trip, distance,
              speed, ignition,
              geofence and alert
              analytics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-slate-400">
                Updated{" "}
                {lastRefresh.toLocaleTimeString()}
              </span>
            )}

            <button
              type="button"
              disabled={
                loading ||
                !vehicleId
              }
              onClick={() =>
                void loadReport()
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm transition hover:bg-white/[0.08] disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={
                exportCsv
              }
              disabled={
                !trip ||
                trip.positions
                  .length === 0
              }
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-sky-400 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />

              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-white/10 bg-[#0a1426] p-5">
          <div className="grid gap-4 xl:grid-cols-4">
            <Field label="Vehicle">
              <select
                value={
                  vehicleId
                }
                disabled={
                  vehiclesLoading
                }
                onChange={(
                  event,
                ) =>
                  setVehicleId(
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
                    available
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
                      }{" "}
                      —{" "}
                      {vehicle.device
                        ?.model ??
                        "GPS Device"}
                    </option>
                  ),
                )}
              </select>
            </Field>

            <Field label="From">
              <input
                type="datetime-local"
                value={from}
                onChange={(
                  event,
                ) =>
                  setFrom(
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
                value={to}
                onChange={(
                  event,
                ) =>
                  setTo(
                    event.target
                      .value,
                  )
                }
                className="field"
              />
            </Field>

            <div className="flex items-end">
              <button
                type="button"
                disabled={
                  loading ||
                  !vehicleId
                }
                onClick={() =>
                  void loadReport()
                }
                className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold transition hover:bg-sky-400 disabled:opacity-50"
              >
                {loading
                  ? "Generating..."
                  : "Generate Report"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={setToday}
                className="preset-button"
              >
                Today
              </button>

              <button
                type="button"
                onClick={
                  setLast24Hours
                }
                className="preset-button"
              >
                Last 24 Hours
              </button>

              <button
                type="button"
                onClick={
                  setLast7Days
                }
                className="preset-button"
              >
                Last 7 Days
              </button>
            </div>

            {selectedVehicle && (
              <div className="text-right text-xs text-slate-400">
                <span className="font-semibold text-white">
                  {
                    selectedVehicle.vehicleNo
                  }
                </span>

                {" · "}

                {selectedVehicle
                  .device?.imei ??
                  "No IMEI"}
              </div>
            )}
          </div>
        </section>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Distance"
            value={`${summary?.summary.totalDistanceKm ?? 0} km`}
            icon={<Route />}
          />

          <StatCard
            title="Max Speed"
            value={`${summary?.summary.maxSpeedKph ?? 0} km/h`}
            icon={<Gauge />}
          />

          <StatCard
            title="Average Speed"
            value={`${summary?.summary.averageSpeedKph ?? 0} km/h`}
            icon={<Activity />}
          />

          <StatCard
            title="GPS Points"
            value={
              summary?.summary.totalPoints ??
              0
            }
            icon={<MapPin />}
          />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Running Time"
            value={formatDuration(
              summary?.summary.runningSeconds,
            )}
            icon={<Zap />}
          />

          <StatCard
            title="Idle Time"
            value={formatDuration(
              summary?.summary.idleSeconds,
            )}
            icon={<Timer />}
          />

          <StatCard
            title="Ignition ON"
            value={formatDuration(
              summary?.summary.ignitionOnSeconds,
            )}
            icon={<Car />}
          />

          <StatCard
            title="Ignition OFF"
            value={formatDuration(
              summary?.summary.ignitionOffSeconds,
            )}
            icon={<Clock3 />}
          />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <InfoCard
            title="Total Alerts"
            value={
              summary?.summary.totalAlerts ??
              alerts.length
            }
          />

          <InfoCard
            title="Open Alerts"
            value={
              summary?.summary.openAlerts ??
              openAlerts
            }
          />

          <InfoCard
            title="Resolved"
            value={
              summary?.summary.resolvedAlerts ??
              resolvedAlerts
            }
          />

          <InfoCard
            title="Geofence Entry"
            value={
              summary?.summary.geofenceEntries ??
              0
            }
          />

          <InfoCard
            title="Geofence Exit"
            value={
              summary?.summary.geofenceExits ??
              0
            }
          />
        </div>

        <div className="mb-6 grid gap-5 xl:grid-cols-2">
          <LocationCard
            title="Start Location"
            location={
              summary?.startLocation ??
              null
            }
          />

          <LocationCard
            title="End Location"
            location={
              summary?.endLocation ??
              null
            }
          />
        </div>

        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">
                GPS Position History
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {
                  filteredPositions.length
                }{" "}
                of{" "}
                {trip?.positions
                  .length ??
                  0}{" "}
                positions
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#07101f] px-4 py-2.5">
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
                placeholder="Search coordinates, speed..."
                className="bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="max-h-[520px] overflow-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-[#0a1426] text-xs text-slate-400">
                <tr>
                  <th className="px-5 py-4">
                    Time
                  </th>

                  <th className="px-5 py-4">
                    Latitude
                  </th>

                  <th className="px-5 py-4">
                    Longitude
                  </th>

                  <th className="px-5 py-4">
                    Speed
                  </th>

                  <th className="px-5 py-4">
                    Ignition
                  </th>

                  <th className="px-5 py-4">
                    Battery
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPositions.map(
                  (position) => (
                    <tr
                      key={
                        position.id
                      }
                      className="border-t border-white/10 transition hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {new Date(
                          position.recordedAt,
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs">
                        {position.latitude.toFixed(
                          6,
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs">
                        {position.longitude.toFixed(
                          6,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {Number(
                          position.speed,
                        ).toFixed(
                          1,
                        )}{" "}
                        km/h
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            position.ignition
                              ? "text-emerald-400"
                              : "text-slate-400"
                          }
                        >
                          {position.ignition
                            ? "ON"
                            : "OFF"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {position.battery !=
                        null
                          ? `${Number(
                              position.battery,
                            ).toFixed(
                              2,
                            )} V`
                          : "—"}
                      </td>
                    </tr>
                  ),
                )}

                {!loading &&
                  filteredPositions.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-slate-500"
                      >
                        No GPS
                        positions found
                        for this period.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">
                Alert Events
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Geofence and
                system alert history
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#07101f] px-4 py-2.5">
              <Search className="h-4 w-4 text-slate-500" />

              <input
                value={
                  alertSearch
                }
                onChange={(
                  event,
                ) =>
                  setAlertSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search alert..."
                className="bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {filteredAlerts.length >
          0 ? (
            <div className="divide-y divide-white/10">
              {filteredAlerts.map(
                (alert) => (
                  <div
                    key={
                      alert.id
                    }
                    className="flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />

                        <span className="font-semibold">
                          {alert.type.replaceAll(
                            "_",
                            " ",
                          )}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            alert.isResolved
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {alert.isResolved
                            ? "RESOLVED"
                            : "OPEN"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        {
                          alert.message
                        }
                      </p>
                    </div>

                    <p className="shrink-0 text-xs text-slate-500">
                      {new Date(
                        alert.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="p-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />

              <p className="mt-3 text-sm text-slate-500">
                No alert events
                found for this
                period.
              </p>
            </div>
          )}
        </section>

        <style jsx>{`
          .field {
            width: 100%;
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

          .preset-button {
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
            font-size: 0.8rem;
            transition: 0.2s;
          }

          .preset-button:hover {
            background: rgba(
              255,
              255,
              255,
              0.08
            );
          }
        `}</style>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
        "CUSTOMER",
      ]}
    >
      <ReportsPageContent />
    </RoleRouteGuard>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
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
  title,
  value,
  icon,
}: {
  title: string;
  value:
    | string
    | number;
  icon:
    React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
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

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function LocationCard({
  title,
  location,
}: {
  title: string;
  location: ReportLocation;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-sky-400" />

        <p className="text-sm text-slate-400">
          {title}
        </p>
      </div>

      {location ? (
        <>
          <p className="mt-3 font-mono text-lg">
            {location.latitude.toFixed(
              6,
            )}
            ,{" "}
            {location.longitude.toFixed(
              6,
            )}
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />

            {new Date(
              location.recordedAt,
            ).toLocaleString()}
          </div>
        </>
      ) : (
        <p className="mt-3 text-slate-500">
          No data
        </p>
      )}
    </div>
  );
}