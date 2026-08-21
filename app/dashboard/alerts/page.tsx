"use client";

import Link from "next/link";

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  MapPin,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Siren,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "DEALER"
  | "CUSTOMER"
  | "USER";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  dealerId?: string | null;
  customerId?: string | null;
};

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

type AlertType =
  | "OVERSPEED"
  | "GEOFENCE"
  | "GEOFENCE_ENTRY"
  | "GEOFENCE_EXIT"
  | "IGNITION"
  | "SOS"
  | "POWER_CUT"
  | "OFFLINE";

type AlertRecord = {
  id: string;
  type: AlertType;
  message: string;
  isResolved: boolean;
  vehicleId: string;
  createdAt: string;
  resolvedAt: string | null;
  vehicle: Vehicle;
};

type AlertsResponse = {
  success: boolean;
  count: number;
  data: AlertRecord[];
  message?: string;
};

type AlertResponse = {
  success: boolean;
  data?: AlertRecord;
  message?: string;
};

type StatusFilter =
  | "ALL"
  | "OPEN"
  | "RESOLVED";

type Severity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "INFO";

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

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value =
    localStorage.getItem(
      "navii_user",
    );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(
      value,
    ) as AuthUser;
  } catch {
    return null;
  }
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

function getSeverity(
  type: AlertType,
): Severity {
  if (
    type === "SOS" ||
    type === "POWER_CUT"
  ) {
    return "CRITICAL";
  }

  if (
    type === "OVERSPEED" ||
    type === "GEOFENCE_EXIT" ||
    type === "OFFLINE"
  ) {
    return "HIGH";
  }

  if (
    type === "GEOFENCE_ENTRY" ||
    type === "IGNITION"
  ) {
    return "MEDIUM";
  }

  return "INFO";
}

function AlertsPageContent() {
  const [
    alerts,
    setAlerts,
  ] =
    useState<
      AlertRecord[]
    >([]);

  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<
      AuthUser | null
    >(null);

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
    actionLoading,
    setActionLoading,
  ] =
    useState<
      string | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    success,
    setSuccess,
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
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "ALL",
    );

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<
      "ALL" | AlertType
    >("ALL");

  const [
    severityFilter,
    setSeverityFilter,
  ] =
    useState<
      "ALL" | Severity
    >("ALL");

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

  const loadAlerts =
    useCallback(
      async (
        manual = false,
      ) => {
        try {
          if (manual) {
            setRefreshing(
              true,
            );
          }

          setError(null);

          const token =
            getAccessToken();

          const user =
            getStoredUser();

          if (
            !token ||
            !user
          ) {
            handleUnauthorized();
            return;
          }

          setCurrentUser(
            user,
          );

          const response =
            await fetch(
              `${API_BASE}/api/gps/alerts`,
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
              "You do not have permission to view alerts.",
            );
          }

          const result =
            await readJson<AlertsResponse>(
              response,
            );

          if (
            !response.ok
          ) {
            throw new Error(
              result.message ||
                `Alerts API returned ${response.status}`,
            );
          }

          if (
            !result.success
          ) {
            throw new Error(
              result.message ||
                "Alerts API returned unsuccessful response",
            );
          }

          setAlerts(
            Array.isArray(
              result.data,
            )
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
              : "Unable to load alerts",
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

  useEffect(() => {
    void loadAlerts();

    const timer =
      window.setInterval(
        () => {
          void loadAlerts();
        },
        5000,
      );

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [loadAlerts]);

  const canManageAlerts =
    currentUser?.role ===
      "SUPER_ADMIN" ||
    currentUser?.role ===
      "ADMIN" ||
    currentUser?.role ===
      "DEALER";

  async function resolveAlert(
    alert: AlertRecord,
  ) {
    if (
      !canManageAlerts
    ) {
      setError(
        "You do not have permission to resolve alerts.",
      );
      return;
    }

    setActionLoading(
      alert.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/alerts/${alert.id}/resolve`,
          {
            method:
              "PATCH",

            headers:
              getAuthHeaders(),
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
          "You do not have permission to resolve this alert.",
        );
      }

      const result =
        await readJson<AlertResponse>(
          response,
        );

      if (
        !response.ok ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to resolve alert",
        );
      }

      setAlerts(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              alert.id
                ? result.data as AlertRecord
                : item,
          ),
      );

      setSuccess(
        result.message ||
          "Alert resolved successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resolve alert",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  async function reopenAlert(
    alert: AlertRecord,
  ) {
    if (
      !canManageAlerts
    ) {
      setError(
        "You do not have permission to reopen alerts.",
      );
      return;
    }

    setActionLoading(
      alert.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/alerts/${alert.id}/reopen`,
          {
            method:
              "PATCH",

            headers:
              getAuthHeaders(),
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
          "You do not have permission to reopen this alert.",
        );
      }

      const result =
        await readJson<AlertResponse>(
          response,
        );

      if (
        !response.ok ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to reopen alert",
        );
      }

      setAlerts(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              alert.id
                ? result.data as AlertRecord
                : item,
          ),
      );

      setSuccess(
        result.message ||
          "Alert reopened successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reopen alert",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  const filteredAlerts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return alerts.filter(
        (alert) => {
          const severity =
            getSeverity(
              alert.type,
            );

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            (statusFilter ===
              "OPEN" &&
              !alert.isResolved) ||
            (statusFilter ===
              "RESOLVED" &&
              alert.isResolved);

          const matchesType =
            typeFilter ===
              "ALL" ||
            alert.type ===
              typeFilter;

          const matchesSeverity =
            severityFilter ===
              "ALL" ||
            severity ===
              severityFilter;

          const searchable = [
            alert.type,
            alert.message,
            alert.vehicle
              .vehicleNo,
            alert.vehicle
              .name ?? "",
            alert.vehicle
              .device?.imei ??
              "",
            alert.vehicle
              .device?.model ??
              "",
          ]
            .join(" ")
            .toLowerCase();

          return (
            matchesStatus &&
            matchesType &&
            matchesSeverity &&
            (!query ||
              searchable.includes(
                query,
              ))
          );
        },
      );
    }, [
      alerts,
      search,
      statusFilter,
      typeFilter,
      severityFilter,
    ]);

  const stats =
    useMemo(() => {
      const open =
        alerts.filter(
          (alert) =>
            !alert.isResolved,
        ).length;

      const resolved =
        alerts.filter(
          (alert) =>
            alert.isResolved,
        ).length;

      const critical =
        alerts.filter(
          (alert) =>
            getSeverity(
              alert.type,
            ) ===
            "CRITICAL",
        ).length;

      const geofence =
        alerts.filter(
          (alert) =>
            alert.type ===
              "GEOFENCE_ENTRY" ||
            alert.type ===
              "GEOFENCE_EXIT",
        ).length;

      return {
        total:
          alerts.length,
        open,
        resolved,
        critical,
        geofence,
      };
    }, [alerts]);

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1750px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              EVENT MONITORING
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Alerts
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Live GPS event monitoring,
              acknowledgement and alert
              history
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
              disabled={
                refreshing
              }
              onClick={() =>
                void loadAlerts(
                  true,
                )
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm transition hover:bg-white/[0.08] disabled:opacity-50"
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
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            API Error: {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Alerts"
            value={
              stats.total
            }
            icon={<Bell />}
          />

          <StatCard
            title="Open Alerts"
            value={
              stats.open
            }
            icon={
              <ShieldAlert />
            }
          />

          <StatCard
            title="Resolved"
            value={
              stats.resolved
            }
            icon={
              <CheckCircle2 />
            }
          />

          <StatCard
            title="Critical"
            value={
              stats.critical
            }
            icon={<Siren />}
          />

          <StatCard
            title="Geofence Events"
            value={
              stats.geofence
            }
            icon={<MapPin />}
          />
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-[#0a1426] p-4">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#07101f] px-4 py-3">
              <Search className="h-5 w-5 text-slate-500" />

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
                placeholder="Search vehicle, IMEI, device, alert message..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Filter className="h-4 w-4" />
            </div>

            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                )
              }
              className="filter-field"
            >
              <option value="ALL">
                All Status
              </option>

              <option value="OPEN">
                Open
              </option>

              <option value="RESOLVED">
                Resolved
              </option>
            </select>

            <select
              value={
                severityFilter
              }
              onChange={(
                event,
              ) =>
                setSeverityFilter(
                  event.target
                    .value as
                    | "ALL"
                    | Severity,
                )
              }
              className="filter-field"
            >
              <option value="ALL">
                All Severity
              </option>

              <option value="CRITICAL">
                Critical
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="INFO">
                Info
              </option>
            </select>

            <select
              value={
                typeFilter
              }
              onChange={(
                event,
              ) =>
                setTypeFilter(
                  event.target
                    .value as
                    | "ALL"
                    | AlertType,
                )
              }
              className="filter-field"
            >
              <option value="ALL">
                All Alert Types
              </option>

              <option value="GEOFENCE_ENTRY">
                Geofence Entry
              </option>

              <option value="GEOFENCE_EXIT">
                Geofence Exit
              </option>

              <option value="OVERSPEED">
                Overspeed
              </option>

              <option value="IGNITION">
                Ignition
              </option>

              <option value="SOS">
                SOS
              </option>

              <option value="POWER_CUT">
                Power Cut
              </option>

              <option value="OFFLINE">
                Offline
              </option>

              <option value="GEOFENCE">
                Geofence
              </option>
            </select>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Alert History
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Showing{" "}
                {
                  filteredAlerts.length
                }{" "}
                of {alerts.length} alerts
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              LIVE DATABASE
            </span>
          </div>

          {loading &&
          alerts.length ===
            0 ? (
            <div className="flex min-h-[300px] items-center justify-center text-slate-400">
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Loading alerts...
            </div>
          ) : filteredAlerts.length >
            0 ? (
            <div className="divide-y divide-white/10">
              {filteredAlerts.map(
                (alert) => (
                  <AlertRow
                    key={
                      alert.id
                    }
                    alert={
                      alert
                    }
                    loading={
                      actionLoading ===
                      alert.id
                    }
                    canManage={
                      Boolean(
                        canManageAlerts,
                      )
                    }
                    onResolve={() =>
                      void resolveAlert(
                        alert,
                      )
                    }
                    onReopen={() =>
                      void reopenAlert(
                        alert,
                      )
                    }
                  />
                ),
              )}
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center p-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />

              <h3 className="mt-4 text-lg font-semibold">
                No Matching Alerts
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                No alerts match the
                current search and
                filters.
              </p>
            </div>
          )}
        </section>

        <style jsx>{`
          .filter-field {
            border-radius: 0.75rem;
            border: 1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
            background: #07101f;
            padding: 0.75rem
              1rem;
            font-size: 0.875rem;
            color: white;
            outline: none;
          }
        `}</style>
      </div>
    </div>
  );
}

export default function AlertsPage() {
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
      <AlertsPageContent />
    </RoleRouteGuard>
  );
}

function AlertRow({
  alert,
  loading,
  canManage,
  onResolve,
  onReopen,
}: {
  alert: AlertRecord;
  loading: boolean;
  canManage: boolean;
  onResolve: () => void;
  onReopen: () => void;
}) {
  const severity =
    getSeverity(
      alert.type,
    );

  const style =
    getTypeStyle(
      alert.type,
    );

  return (
    <div className="p-5 transition hover:bg-white/[0.025]">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div className="flex min-w-0 gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
          >
            {alert.type ===
            "POWER_CUT" ? (
              <Zap className="h-5 w-5" />
            ) : alert.type ===
              "SOS" ? (
              <Siren className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${style.badge}`}
              >
                {formatAlertType(
                  alert.type,
                )}
              </span>

              <SeverityBadge
                severity={
                  severity
                }
              />

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

            <p className="mt-2 font-semibold">
              {alert.message}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>
                Vehicle:{" "}
                <strong className="text-slate-300">
                  {
                    alert.vehicle
                      .vehicleNo
                  }
                </strong>
              </span>

              <span>
                IMEI:{" "}
                {alert.vehicle
                  .device?.imei ??
                  "—"}
              </span>

              <span>
                Device:{" "}
                {alert.vehicle
                  .device?.model ??
                  "—"}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />

                {new Date(
                  alert.createdAt,
                ).toLocaleString()}
              </span>
            </div>

            {alert.resolvedAt && (
              <p className="mt-2 text-xs text-emerald-500/80">
                Resolved:{" "}
                {new Date(
                  alert.resolvedAt,
                ).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/dashboard/vehicles/${alert.vehicleId}`}
            title="Vehicle Details"
            className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:bg-white/[0.08]"
          >
            <Eye className="h-4 w-4" />
          </Link>

          <Link
            href="/dashboard/live-tracking"
            title="Live Tracking"
            className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2.5 text-sky-400 transition hover:bg-sky-500/20"
          >
            <MapPin className="h-4 w-4" />
          </Link>

          {canManage &&
            (alert.isResolved ? (
              <button
                type="button"
                disabled={
                  loading
                }
                onClick={
                  onReopen
                }
                className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/20 disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reopen
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  loading
                }
                onClick={
                  onResolve
                }
                className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Resolve
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function SeverityBadge({
  severity,
}: {
  severity: Severity;
}) {
  const styles: Record<
    Severity,
    string
  > = {
    CRITICAL:
      "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",

    HIGH:
      "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20",

    MEDIUM:
      "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",

    INFO:
      "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/20",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
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

          <p className="mt-2 text-3xl font-bold">
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

function formatAlertType(
  type: AlertType,
) {
  return type
    .replaceAll(
      "_",
      " ",
    )
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase(),
    );
}

function getTypeStyle(
  type: AlertType,
) {
  if (
    type ===
    "GEOFENCE_ENTRY"
  ) {
    return {
      icon:
        "bg-emerald-500/10 text-emerald-400",

      badge:
        "bg-emerald-500/10 text-emerald-400",
    };
  }

  if (
    type ===
    "GEOFENCE_EXIT"
  ) {
    return {
      icon:
        "bg-orange-500/10 text-orange-400",

      badge:
        "bg-orange-500/10 text-orange-400",
    };
  }

  if (
    type === "SOS" ||
    type ===
      "POWER_CUT"
  ) {
    return {
      icon:
        "bg-red-500/10 text-red-400",

      badge:
        "bg-red-500/10 text-red-400",
    };
  }

  if (
    type ===
    "OFFLINE"
  ) {
    return {
      icon:
        "bg-slate-500/10 text-slate-300",

      badge:
        "bg-slate-500/10 text-slate-300",
    };
  }

  return {
    icon:
      "bg-amber-500/10 text-amber-400",

    badge:
      "bg-amber-500/10 text-amber-400",
  };
}