"use client";

import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Battery,
  Car,
  Clock3,
  Gauge,
  History,
  MapPin,
  Navigation,
  Power,
  RadioTower,
  RefreshCw,
  Satellite,
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
  isActive: boolean;
  vehicleId: string;
  createdAt?: string;
  updatedAt?: string;
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
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
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
  const text = await response.text();

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

function VehicleDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const vehicleId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [history, setHistory] =
    useState<Position[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [lastRefresh, setLastRefresh] =
    useState<Date | null>(null);

  const handleUnauthorized =
    useCallback(() => {
      localStorage.removeItem(
        "navii_access_token",
      );

      localStorage.removeItem(
        "navii_user",
      );

      router.replace("/login");
    }, [router]);

  const loadVehicle =
    useCallback(async () => {
      if (!vehicleId) {
        setError(
          "Invalid vehicle ID.",
        );
        setLoading(false);
        return;
      }

      const token =
        getAccessToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      try {
        setRefreshing(true);
        setError(null);

        const vehicleResponse =
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
          vehicleResponse.status ===
          401
        ) {
          handleUnauthorized();
          return;
        }

        if (
          vehicleResponse.status ===
          403
        ) {
          setVehicle(null);
          setHistory([]);

          throw new Error(
            "You do not have permission to access vehicle data.",
          );
        }

        const vehicleResult =
          await readJson<VehiclesResponse>(
            vehicleResponse,
          );

        if (!vehicleResponse.ok) {
          throw new Error(
            vehicleResult.message ||
              `Vehicles API returned ${vehicleResponse.status}`,
          );
        }

        const vehicleList =
          Array.isArray(
            vehicleResult.data,
          )
            ? vehicleResult.data
            : [];

        const foundVehicle =
          vehicleList.find(
            (item) =>
              item.id === vehicleId,
          ) ?? null;

        /*
         * Important security behaviour:
         *
         * /api/gps/vehicles is already
         * backend role/ownership scoped.
         *
         * If this ID is not present in the
         * scoped response, this account
         * must not display the vehicle.
         */
        if (!foundVehicle) {
          setVehicle(null);
          setHistory([]);

          throw new Error(
            "Vehicle not found or you do not have permission to access it.",
          );
        }

        setVehicle(foundVehicle);

        const historyResponse =
          await fetch(
            `${API_BASE}/api/gps/history/${vehicleId}?limit=20`,
            {
              method: "GET",
              headers:
                getAuthHeaders(),
              cache: "no-store",
            },
          );

        if (
          historyResponse.status ===
          401
        ) {
          handleUnauthorized();
          return;
        }

        if (
          historyResponse.status ===
          403
        ) {
          setHistory([]);

          throw new Error(
            "You do not have permission to view history for this vehicle.",
          );
        }

        const historyResult =
          await readJson<HistoryResponse>(
            historyResponse,
          );

        if (!historyResponse.ok) {
          throw new Error(
            historyResult.message ||
              `History API returned ${historyResponse.status}`,
          );
        }

        setHistory(
          Array.isArray(
            historyResult.data,
          )
            ? historyResult.data
            : [],
        );

        setLastRefresh(
          new Date(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load vehicle",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, [
      vehicleId,
      handleUnauthorized,
    ]);

  useEffect(() => {
    void loadVehicle();

    const timer =
      window.setInterval(() => {
        void loadVehicle();
      }, 5000);

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [loadVehicle]);

  const latestHistory =
    history[0] ?? null;

  const historyCount =
    history.length;

  const maxSpeed =
    useMemo(() => {
      return history.reduce(
        (maximum, item) =>
          Math.max(
            maximum,
            Number(
              item.speed || 0,
            ),
          ),
        0,
      );
    }, [history]);

  if (
    loading &&
    !vehicle
  ) {
    return (
      <div className="flex min-h-[calc(100vh-78px)] items-center justify-center text-white">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-sky-400" />

          <p className="mt-4 text-slate-400">
            Loading vehicle
            details...
          </p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-[calc(100vh-78px)] p-6 text-white">
        <div className="mx-auto max-w-[1000px] rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h1 className="text-xl font-bold">
            Vehicle Unavailable
          </h1>

          <p className="mt-2 text-red-300">
            {error ??
              "Unable to find this vehicle."}
          </p>

          <Link
            href="/dashboard/vehicles"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold transition hover:bg-sky-400"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Link
              href="/dashboard/vehicles"
              className="mt-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
                VEHICLE DETAILS
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                {vehicle.vehicleNo}
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                {vehicle.name ??
                  "NAVII GPS Vehicle"}
              </p>
            </div>
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
              disabled={refreshing}
              onClick={() =>
                void loadVehicle()
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm transition hover:bg-white/[0.08] disabled:opacity-50"
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

            <Link
              href="/live-tracking"
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold transition hover:bg-sky-400"
            >
              <MapPin className="h-4 w-4" />

              Live Tracking
            </Link>

            <Link
              href="/history"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold transition hover:bg-white/[0.08]"
            >
              <History className="h-4 w-4" />

              Playback
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <TelemetryCard
            label="Vehicle Status"
            value={vehicle.status}
            icon={<RadioTower />}
            accent={
              vehicle.status ===
              "MOVING"
                ? "green"
                : vehicle.status ===
                    "IDLE"
                  ? "amber"
                  : "red"
            }
          />

          <TelemetryCard
            label="Speed"
            value={`${Number(
              vehicle.speed || 0,
            ).toFixed(1)} km/h`}
            icon={<Gauge />}
          />

          <TelemetryCard
            label="Ignition"
            value={
              vehicle.ignition
                ? "ON"
                : "OFF"
            }
            icon={<Power />}
            accent={
              vehicle.ignition
                ? "green"
                : "default"
            }
          />

          <TelemetryCard
            label="Battery"
            value={
              vehicle.battery !== null
                ? `${vehicle.battery.toFixed(
                    3,
                  )} V`
                : "—"
            }
            icon={<Battery />}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                <Car className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Vehicle Information
                </h2>

                <p className="text-xs text-slate-400">
                  Fleet registration
                  and current state
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <InfoRow
                label="Vehicle Number"
                value={
                  vehicle.vehicleNo
                }
              />

              <InfoRow
                label="Vehicle Name"
                value={
                  vehicle.name ?? "—"
                }
              />

              <InfoRow
                label="Status"
                value={
                  vehicle.status
                }
              />

              <InfoRow
                label="Speed"
                value={`${vehicle.speed} km/h`}
              />

              <InfoRow
                label="Ignition"
                value={
                  vehicle.ignition
                    ? "ON"
                    : "OFF"
                }
              />

              <InfoRow
                label="Battery"
                value={
                  vehicle.battery !==
                  null
                    ? `${vehicle.battery.toFixed(
                        3,
                      )} V`
                    : "—"
                }
              />

              <InfoRow
                label="Last Update"
                value={
                  vehicle.lastUpdate
                    ? new Date(
                        vehicle.lastUpdate,
                      ).toLocaleString()
                    : "—"
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                <Satellite className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  GPS Device
                </h2>

                <p className="text-xs text-slate-400">
                  Installed tracker
                  information
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <InfoRow
                label="Model"
                value={
                  vehicle.device
                    ?.model ?? "—"
                }
              />

              <InfoRow
                label="IMEI"
                value={
                  vehicle.device
                    ?.imei ?? "—"
                }
              />

              <InfoRow
                label="SIM Number"
                value={
                  vehicle.device
                    ?.simNumber ?? "—"
                }
              />

              <InfoRow
                label="Device Status"
                value={
                  vehicle.device
                    ? vehicle.device
                        .isActive
                      ? "ACTIVE"
                      : "INACTIVE"
                    : "—"
                }
              />

              <InfoRow
                label="Device ID"
                value={
                  vehicle.device?.id ??
                  "—"
                }
              />

              <InfoRow
                label="Protocol"
                value="NTCB / FLEX"
              />

              <InfoRow
                label="TCP Server"
                value="Port 5001"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                <Navigation className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Current Location
                </h2>

                <p className="text-xs text-slate-400">
                  Latest recorded GPS
                  coordinates
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <LocationCard
                label="Latitude"
                value={
                  vehicle.latitude !==
                  null
                    ? vehicle.latitude.toFixed(
                        6,
                      )
                    : "—"
                }
              />

              <LocationCard
                label="Longitude"
                value={
                  vehicle.longitude !==
                  null
                    ? vehicle.longitude.toFixed(
                        6,
                      )
                    : "—"
                }
              />
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#07101f] p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-sky-400" />

                <div>
                  <p className="text-xs text-slate-400">
                    Latest Position
                  </p>

                  <p className="mt-1 font-mono text-sm">
                    {vehicle.latitude ??
                      "—"}
                    ,{" "}
                    {vehicle.longitude ??
                      "—"}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/live-tracking"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold transition hover:bg-sky-400"
            >
              <MapPin className="h-4 w-4" />

              Open on Live Map
            </Link>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                <Clock3 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  History Summary
                </h2>

                <p className="text-xs text-slate-400">
                  Latest position
                  records
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat
                label="Loaded Points"
                value={historyCount.toString()}
              />

              <MiniStat
                label="Max Speed"
                value={`${maxSpeed.toFixed(
                  1,
                )} km/h`}
              />

              <MiniStat
                label="Latest Battery"
                value={
                  latestHistory?.battery !==
                    null &&
                  latestHistory?.battery !==
                    undefined
                    ? `${latestHistory.battery.toFixed(
                        3,
                      )} V`
                    : "—"
                }
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-slate-400">
                  <tr>
                    <th className="p-3">
                      Time
                    </th>

                    <th className="p-3">
                      Speed
                    </th>

                    <th className="p-3">
                      Battery
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history
                    .slice(0, 5)
                    .map(
                      (item) => (
                        <tr
                          key={
                            item.id
                          }
                          className="border-t border-white/10"
                        >
                          <td className="p-3 text-slate-300">
                            {new Date(
                              item.recordedAt,
                            ).toLocaleString()}
                          </td>

                          <td className="p-3">
                            {
                              item.speed
                            }{" "}
                            km/h
                          </td>

                          <td className="p-3">
                            {item.battery !==
                            null
                              ? `${item.battery.toFixed(
                                  3,
                                )} V`
                              : "—"}
                          </td>
                        </tr>
                      ),
                    )}

                  {history.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-6 text-center text-slate-500"
                      >
                        No position
                        history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Link
              href="/history"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold transition hover:bg-white/[0.08]"
            >
              <History className="h-4 w-4" />

              Full Route Playback
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function VehicleDetailsPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
        "CUSTOMER",
      ]}
    >
      <VehicleDetailsContent />
    </RoleRouteGuard>
  );
}

function TelemetryCard({
  label,
  value,
  icon,
  accent = "default",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?:
    | "default"
    | "green"
    | "amber"
    | "red";
}) {
  const accentClasses = {
    default:
      "bg-sky-500/10 text-sky-400",
    green:
      "bg-emerald-500/10 text-emerald-400",
    amber:
      "bg-amber-500/10 text-amber-400",
    red:
      "bg-red-500/10 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${accentClasses[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.06] py-3 last:border-none">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="max-w-[65%] break-all text-right text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}

function LocationCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07101f] p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-mono text-lg font-semibold text-sky-300">
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07101f] p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>
    </div>
  );
}