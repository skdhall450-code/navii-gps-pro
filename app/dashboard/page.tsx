"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  BatteryCharging,
  Car,
  CircleDot,
  Gauge,
  RadioTower,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

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
  status: "MOVING" | "IDLE" | "OFFLINE";
  speed: number;
  ignition: boolean;
  battery: number | null;
  latitude: number | null;
  longitude: number | null;
  lastUpdate: string | null;
  device?: Device | null;
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

function DashboardContent() {
  const router = useRouter();

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [loading, setLoading] =
    useState(true);

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

  const loadVehicles =
    useCallback(async () => {
      const token =
        getAccessToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      try {
        setError(null);

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
          response.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        if (
          response.status === 403
        ) {
          setVehicles([]);

          throw new Error(
            "You do not have permission to access dashboard vehicle data.",
          );
        }

        const result =
          await readJson<VehiclesResponse>(
            response,
          );

        if (!response.ok) {
          throw new Error(
            result.message ||
              `API returned ${response.status}`,
          );
        }

        if (!result.success) {
          throw new Error(
            result.message ||
              "GPS API returned an unsuccessful response",
          );
        }

        setVehicles(
          Array.isArray(result.data)
            ? result.data
            : [],
        );

        setLastRefresh(
          new Date(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load GPS vehicles",
        );
      } finally {
        setLoading(false);
      }
    }, [handleUnauthorized]);

  useEffect(() => {
    void loadVehicles();

    const timer =
      window.setInterval(() => {
        void loadVehicles();
      }, 5000);

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [loadVehicles]);

  const stats = useMemo(() => {
    const total =
      vehicles.length;

    const moving =
      vehicles.filter(
        (vehicle) =>
          vehicle.status ===
          "MOVING",
      ).length;

    const idle =
      vehicles.filter(
        (vehicle) =>
          vehicle.status ===
          "IDLE",
      ).length;

    const offline =
      vehicles.filter(
        (vehicle) =>
          vehicle.status ===
          "OFFLINE",
      ).length;

    const online =
      total - offline;

    const devices =
      vehicles.filter(
        (vehicle) =>
          Boolean(
            vehicle.device,
          ),
      ).length;

    const batteryOk =
      vehicles.filter(
        (vehicle) =>
          vehicle.battery !==
            null &&
          vehicle.battery >=
            3.5,
      ).length;

    return {
      total,
      online,
      moving,
      idle,
      offline,
      devices,
      batteryOk,
    };
  }, [vehicles]);

  const cards = [
    {
      title: "Total Vehicles",
      value: stats.total,
      icon: Car,
    },
    {
      title: "Online Vehicles",
      value: stats.online,
      icon: RadioTower,
    },
    {
      title: "Moving",
      value: stats.moving,
      icon: Gauge,
    },
    {
      title: "Idle",
      value: stats.idle,
      icon: CircleDot,
    },
    {
      title: "Devices",
      value: stats.devices,
      icon: ShieldCheck,
    },
    {
      title: "Offline",
      value: stats.offline,
      icon: RadioTower,
    },
    {
      title: "Open Alerts",
      value: 0,
      icon: AlertTriangle,
    },
    {
      title: "Battery OK",
      value: stats.batteryOk,
      icon: BatteryCharging,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              CONTROL CENTER
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              NAVII GPS Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Live fleet, device and platform monitoring
            </p>
          </div>

          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-slate-400">
                Updated{" "}
                {lastRefresh.toLocaleTimeString()}
              </span>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                void loadVehicles()
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm hover:bg-white/[0.08] disabled:opacity-50"
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
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            API Error: {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon =
              card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-[#0a1426] p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {card.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {loading &&
                      vehicles.length ===
                        0
                        ? "..."
                        : card.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Live Fleet Overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Real-time GPS vehicle data
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                LIVE
              </span>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-white/[0.04] text-slate-400">
                  <tr>
                    <th className="p-4">
                      Vehicle
                    </th>

                    <th className="p-4">
                      Device
                    </th>

                    <th className="p-4">
                      IMEI
                    </th>

                    <th className="p-4">
                      Status
                    </th>

                    <th className="p-4">
                      Speed
                    </th>

                    <th className="p-4">
                      Battery
                    </th>

                    <th className="p-4">
                      Ignition
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map(
                    (vehicle) => (
                      <tr
                        key={
                          vehicle.id
                        }
                        className="border-t border-white/10"
                      >
                        <td className="p-4 font-semibold">
                          {
                            vehicle.vehicleNo
                          }
                        </td>

                        <td className="p-4 text-slate-300">
                          {vehicle
                            .device
                            ?.model ??
                            "—"}
                        </td>

                        <td className="p-4 font-mono text-xs text-slate-300">
                          {vehicle
                            .device
                            ?.imei ??
                            "—"}
                        </td>

                        <td className="p-4">
                          <StatusBadge
                            status={
                              vehicle.status
                            }
                          />
                        </td>

                        <td className="p-4">
                          {Number(
                            vehicle.speed ||
                              0,
                          ).toFixed(
                            1,
                          )}{" "}
                          km/h
                        </td>

                        <td className="p-4">
                          {vehicle.battery !==
                          null
                            ? `${vehicle.battery.toFixed(
                                2,
                              )} V`
                            : "—"}
                        </td>

                        <td className="p-4">
                          <span
                            className={
                              vehicle.ignition
                                ? "text-emerald-400"
                                : "text-slate-400"
                            }
                          >
                            {vehicle.ignition
                              ? "ON"
                              : "OFF"}
                          </span>
                        </td>
                      </tr>
                    ),
                  )}

                  {!loading &&
                    vehicles.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={
                            7
                          }
                          className="p-8 text-center text-slate-400"
                        >
                          No vehicles
                          found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <h2 className="text-lg font-semibold">
              System Health
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              NAVII GPS platform services
            </p>

            <div className="mt-5 space-y-4">
              <HealthRow
                label="Backend API"
                status={
                  error
                    ? "Error"
                    : "Online"
                }
                healthy={!error}
              />

              <HealthRow
                label="GPS Vehicle API"
                status={
                  error
                    ? "Disconnected"
                    : "Connected"
                }
                healthy={!error}
              />

              <HealthRow
                label="Fleet Data"
                status={`${stats.total} Vehicle${
                  stats.total === 1
                    ? ""
                    : "s"
                }`}
                healthy={!error}
              />

              <HealthRow
                label="Auto Refresh"
                status="Every 5 sec"
                healthy
              />
            </div>

            <div className="mt-5 rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-4">
              <p className="text-xs text-slate-400">
                API Endpoint
              </p>

              <p className="mt-2 break-all font-mono text-xs text-sky-300">
                {API_BASE}
                /api/gps/vehicles
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
        "CUSTOMER",
        "USER",
      ]}
    >
      <DashboardContent />
    </RoleRouteGuard>
  );
}

function StatusBadge({
  status,
}: {
  status: Vehicle["status"];
}) {
  const styles = {
    MOVING:
      "bg-emerald-500/10 text-emerald-400",

    IDLE:
      "bg-amber-500/10 text-amber-400",

    OFFLINE:
      "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function HealthRow({
  label,
  status,
  healthy,
}: {
  label: string;
  status: string;
  healthy: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="text-sm text-slate-300">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            healthy
              ? "bg-emerald-400"
              : "bg-red-400"
          }`}
        />

        <span
          className={`text-sm font-semibold ${
            healthy
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}