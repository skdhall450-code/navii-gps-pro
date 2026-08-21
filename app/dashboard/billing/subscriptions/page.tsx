"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
  ReactNode,
} from "react";

import {
  AlertTriangle,
  Ban,
  CalendarCheck2,
  Car,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  PauseCircle,
  Pencil,
  PlayCircle,
  Plus,
  Radio,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "DEALER"
  | "CUSTOMER"
  | "USER";

type SubscriptionStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "EXPIRING"
  | "EXPIRED"
  | "SUSPENDED"
  | "CANCELLED";

type BillingCycle =
  | "MONTHLY"
  | "YEARLY";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  dealerId?: string | null;
  customerId?: string | null;
};

type BillingPlan = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  billingCycle: BillingCycle;
  durationMonths: number;
  pricePerUnit: string;
  currency: string;
  taxRate: string;
  isActive: boolean;
  companyId: string;
};

type Device = {
  id: string;
  imei: string;
  model?: string | null;
  simNumber?: string | null;
  isActive?: boolean;
};

type Vehicle = {
  id: string;
  vehicleNo: string;
  name?: string | null;
  companyId: string;
  dealerId?: string | null;
  customerId?: string | null;
  device?: Device | null;
};

type BasicAccount = {
  id: string;
  name: string;
  code?: string;
};

type Subscription = {
  id: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  priceAtPurchase: string;
  taxRateAtPurchase: string;
  currency: string;
  autoRenew: boolean;
  notes?: string | null;

  companyId: string;
  planId: string;
  vehicleId: string;
  deviceId?: string | null;
  dealerId?: string | null;
  customerId?: string | null;

  createdAt: string;
  updatedAt: string;

  plan: BillingPlan;
  vehicle: Vehicle;
  device?: Device | null;
  dealer?: BasicAccount | null;
  customer?: BasicAccount | null;

  _count?: {
    invoices?: number;
  };
};

type ApiResponse<T> = {
  success?: boolean;
  count?: number;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
};

type CreateFormState = {
  planId: string;
  vehicleId: string;
  startDate: string;
  autoRenew: boolean;
  notes: string;
};

type EditFormState = {
  status: SubscriptionStatus;
  autoRenew: boolean;
  notes: string;
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

const STATUS_OPTIONS: SubscriptionStatus[] = [
  "UPCOMING",
  "ACTIVE",
  "EXPIRING",
  "EXPIRED",
  "SUSPENDED",
  "CANCELLED",
];

const STATUS_META: Record<
  SubscriptionStatus,
  {
    label: string;
    icon: LucideIcon;
    className: string;
  }
> = {
  UPCOMING: {
    label: "Upcoming",
    icon: Clock3,
    className:
      "border-sky-500/25 bg-sky-500/10 text-sky-300",
  },

  ACTIVE: {
    label: "Active",
    icon: CheckCircle2,
    className:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  },

  EXPIRING: {
    label: "Expiring",
    icon: AlertTriangle,
    className:
      "border-amber-500/25 bg-amber-500/10 text-amber-300",
  },

  EXPIRED: {
    label: "Expired",
    icon: Ban,
    className:
      "border-red-500/25 bg-red-500/10 text-red-300",
  },

  SUSPENDED: {
    label: "Suspended",
    icon: PauseCircle,
    className:
      "border-orange-500/25 bg-orange-500/10 text-orange-300",
  },

  CANCELLED: {
    label: "Cancelled",
    icon: X,
    className:
      "border-slate-500/25 bg-slate-500/10 text-slate-300",
  },
};

function getTodayInputValue() {
  const now = new Date();

  const localDate =
    new Date(
      now.getTime() -
        now.getTimezoneOffset() *
          60 *
          1000,
    );

  return localDate
    .toISOString()
    .slice(0, 10);
}

function getErrorMessage(
  value: unknown,
): string {
  if (
    typeof value === "object" &&
    value !== null
  ) {
    const data =
      value as {
        message?: string | string[];
        error?: string;
      };

    if (
      Array.isArray(data.message)
    ) {
      return data.message.join(", ");
    }

    if (
      typeof data.message ===
      "string"
    ) {
      return data.message;
    }

    if (
      typeof data.error ===
      "string"
    ) {
      return data.error;
    }
  }

  return "Something went wrong. Please try again.";
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    localStorage.getItem(
      "navii_access_token",
    );

  if (!token) {
    throw new Error(
      "Login session not found. Please login again.",
    );
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,

        cache: "no-store",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",

          ...(
            options.headers as
              | Record<
                  string,
                  string
                >
              | undefined
          ),
        },
      },
    );

  const payload =
    await response
      .json()
      .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload),
    );
  }

  return payload as T;
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatCurrency(
  value:
    | number
    | string
    | null
    | undefined,
  currency = "INR",
) {
  const amount =
    Number(value ?? 0);

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(
    Number.isFinite(amount)
      ? amount
      : 0,
  );
}

function StatusBadge({
  status,
}: {
  status: SubscriptionStatus;
}) {
  const meta =
    STATUS_META[status];

  const Icon =
    meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {meta.label}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#091625] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${iconClassName}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}

        {required && (
          <span className="ml-1 text-red-400">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function IconButton({
  title,
  onClick,
  disabled,
  children,
  danger,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "border-red-500/25 text-red-400 hover:bg-red-500/10"
          : "border-white/10 text-slate-400 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function SubscriptionsPage() {
  const [
    subscriptions,
    setSubscriptions,
  ] =
    useState<Subscription[]>(
      [],
    );

  const [
    plans,
    setPlans,
  ] =
    useState<BillingPlan[]>(
      [],
    );

  const [
    vehicles,
    setVehicles,
  ] =
    useState<Vehicle[]>(
      [],
    );

  const [
    currentRole,
    setCurrentRole,
  ] =
    useState<UserRole | null>(
      null,
    );

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    optionsLoading,
    setOptionsLoading,
  ] =
    useState(false);

  const [
    busyAction,
    setBusyAction,
  ] =
    useState<string | null>(
      null,
    );

  const [
    feedback,
    setFeedback,
  ] =
    useState<Feedback | null>(
      null,
    );

  const [
    createModalOpen,
    setCreateModalOpen,
  ] =
    useState(false);

  const [
    editTarget,
    setEditTarget,
  ] =
    useState<Subscription | null>(
      null,
    );

  const [
    createForm,
    setCreateForm,
  ] =
    useState<CreateFormState>({
      planId: "",
      vehicleId: "",
      startDate:
        getTodayInputValue(),
      autoRenew: false,
      notes: "",
    });

  const [
    editForm,
    setEditForm,
  ] =
    useState<EditFormState>({
      status: "ACTIVE",
      autoRenew: false,
      notes: "",
    });

  const canManage =
    currentRole ===
      "SUPER_ADMIN" ||
    currentRole ===
      "ADMIN";

  const loadSubscriptions =
    useCallback(
      async (
        showLoader = true,
      ) => {
        if (showLoader) {
          setLoading(true);
        }

        try {
          const response =
            await apiRequest<
              ApiResponse<
                Subscription[]
              >
            >(
              "/api/gps/billing/subscriptions",
            );

          setSubscriptions(
            Array.isArray(
              response.data,
            )
              ? response.data
              : [],
          );
        }
        catch (error) {
          setFeedback({
            type: "error",
            message:
              error instanceof Error
                ? error.message
                : "Unable to load subscriptions.",
          });
        }
        finally {
          if (showLoader) {
            setLoading(false);
          }
        }
      },
      [],
    );

  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "navii_user",
      );

    if (storedUser) {
      try {
        const user =
          JSON.parse(
            storedUser,
          ) as AuthUser;

        setCurrentRole(
          user.role,
        );
      }
      catch {
        setCurrentRole(null);
      }
    }

    void loadSubscriptions();
  }, [loadSubscriptions]);

  const loadCreateOptions =
    async () => {
      setOptionsLoading(true);

      try {
        const [
          plansResponse,
          vehiclesResponse,
        ] =
          await Promise.all([
            apiRequest<
              ApiResponse<
                BillingPlan[]
              >
            >(
              "/api/gps/billing/plans",
            ),

            apiRequest<
              ApiResponse<
                Vehicle[]
              >
            >(
              "/api/gps/vehicle-management",
            ),
          ]);

        const activePlans =
          (
            Array.isArray(
              plansResponse.data,
            )
              ? plansResponse.data
              : []
          ).filter(
            (plan) =>
              plan.isActive,
          );

        setPlans(activePlans);

        setVehicles(
          Array.isArray(
            vehiclesResponse.data,
          )
            ? vehiclesResponse.data
            : [],
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to load plans and vehicles.",
        });
      }
      finally {
        setOptionsLoading(false);
      }
    };

  const openCreateModal =
    () => {
      setFeedback(null);

      setCreateForm({
        planId: "",
        vehicleId: "",
        startDate:
          getTodayInputValue(),
        autoRenew: false,
        notes: "",
      });

      setCreateModalOpen(true);

      void loadCreateOptions();
    };

  const openEditModal =
    (
      subscription:
        Subscription,
    ) => {
      setFeedback(null);

      setEditTarget(
        subscription,
      );

      setEditForm({
        status:
          subscription.status,
        autoRenew:
          subscription.autoRenew,
        notes:
          subscription.notes ??
          "",
      });
    };

  const handleCreate =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        !createForm.planId ||
        !createForm.vehicleId ||
        !createForm.startDate
      ) {
        setFeedback({
          type: "error",
          message:
            "Plan, vehicle and start date are required.",
        });

        return;
      }

      setBusyAction(
        "create",
      );

      setFeedback(null);

      try {
        const response =
          await apiRequest<
            ApiResponse<Subscription>
          >(
            "/api/gps/billing/subscriptions",
            {
              method: "POST",

              body: JSON.stringify({
                planId:
                  createForm.planId,

                vehicleId:
                  createForm.vehicleId,

                startDate:
                  `${createForm.startDate}T00:00:00.000Z`,

                autoRenew:
                  createForm.autoRenew,

                notes:
                  createForm.notes
                    .trim() ||
                  null,
              }),
            },
          );

        setCreateModalOpen(
          false,
        );

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Subscription created successfully.",
        });

        await loadSubscriptions(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to create subscription.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const handleEdit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (!editTarget) {
        return;
      }

      setBusyAction(
        `edit-${editTarget.id}`,
      );

      setFeedback(null);

      try {
        const response =
          await apiRequest<
            ApiResponse<Subscription>
          >(
            `/api/gps/billing/subscriptions/${editTarget.id}`,
            {
              method: "PATCH",

              body: JSON.stringify({
                status:
                  editForm.status,

                autoRenew:
                  editForm.autoRenew,

                notes:
                  editForm.notes
                    .trim() ||
                  null,
              }),
            },
          );

        setEditTarget(null);

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Subscription updated successfully.",
        });

        await loadSubscriptions(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to update subscription.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const updateStatus =
    async (
      subscription:
        Subscription,
      status:
        SubscriptionStatus,
      successMessage: string,
    ) => {
      setBusyAction(
        `status-${subscription.id}`,
      );

      setFeedback(null);

      try {
        await apiRequest<
          ApiResponse<Subscription>
        >(
          `/api/gps/billing/subscriptions/${subscription.id}`,
          {
            method: "PATCH",

            body: JSON.stringify({
              status,
            }),
          },
        );

        setFeedback({
          type: "success",
          message:
            successMessage,
        });

        await loadSubscriptions(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to update subscription status.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const handleRenew =
    async (
      subscription:
        Subscription,
    ) => {
      const confirmed =
        window.confirm(
          `Renew subscription for ${subscription.vehicle.vehicleNo}? The new period will start after the current subscription ends.`,
        );

      if (!confirmed) {
        return;
      }

      setBusyAction(
        `renew-${subscription.id}`,
      );

      setFeedback(null);

      try {
        const response =
          await apiRequest<
            ApiResponse<Subscription>
          >(
            `/api/gps/billing/subscriptions/${subscription.id}/renew`,
            {
              method: "POST",

              body: JSON.stringify({}),
            },
          );

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Subscription renewed successfully.",
        });

        await loadSubscriptions(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to renew subscription.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };
  const handleCancel =
    async (
      subscription:
        Subscription,
    ) => {
      const confirmed =
        window.confirm(
          `Cancel subscription for ${subscription.vehicle.vehicleNo}?`,
        );

      if (!confirmed) {
        return;
      }

      await updateStatus(
        subscription,
        "CANCELLED",
        "Subscription cancelled successfully.",
      );
    };

  const handleDelete =
    async (
      subscription:
        Subscription,
    ) => {
      const confirmed =
        window.confirm(
          `Permanently delete the cancelled subscription for ${subscription.vehicle.vehicleNo}?`,
        );

      if (!confirmed) {
        return;
      }

      setBusyAction(
        `delete-${subscription.id}`,
      );

      setFeedback(null);

      try {
        const response =
          await apiRequest<
            ApiResponse<unknown>
          >(
            `/api/gps/billing/subscriptions/${subscription.id}`,
            {
              method: "DELETE",
            },
          );

        setFeedback({
          type: "success",
          message:
            response.message ||
            "Subscription deleted successfully.",
        });

        await loadSubscriptions(
          false,
        );
      }
      catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to delete subscription.",
        });
      }
      finally {
        setBusyAction(null);
      }
    };

  const filteredSubscriptions =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) {
        return subscriptions;
      }

      return subscriptions.filter(
        (subscription) => {
          const imei =
            subscription.device
              ?.imei ||
            subscription.vehicle
              .device?.imei ||
            "";

          const searchable =
            [
              subscription.vehicle
                .vehicleNo,

              subscription.vehicle
                .name,

              subscription.plan
                .name,

              subscription.plan
                .code,

              subscription.status,

              imei,

              subscription.dealer
                ?.name,

              subscription.customer
                ?.name,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      searchTerm,
      subscriptions,
    ]);

  const statistics =
    useMemo(() => {
      return {
        total:
          subscriptions.length,

        active:
          subscriptions.filter(
            (item) =>
              item.status ===
                "ACTIVE" ||
              item.status ===
                "UPCOMING",
          ).length,

        expiring:
          subscriptions.filter(
            (item) =>
              item.status ===
              "EXPIRING",
          ).length,

        attention:
          subscriptions.filter(
            (item) =>
              item.status ===
                "EXPIRED" ||
              item.status ===
                "SUSPENDED",
          ).length,
      };
    }, [subscriptions]);

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
      <main className="min-h-screen bg-[#050b14] px-5 py-8 text-white md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-500/25 bg-sky-500/10 text-sky-400">
                  <CalendarCheck2 className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
                    Billing Management
                  </p>

                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                    Vehicle Subscriptions
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                Manage per-vehicle GPS plan validity,
                renewals and subscription status.
              </p>

              {!canManage &&
                currentRole && (
                  <p className="mt-2 text-xs text-sky-400">
                    Your account has secure read-only
                    subscription access.
                  </p>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  void loadSubscriptions()
                }
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.06] disabled:opacity-50"
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

              {canManage && (
                <button
                  type="button"
                  onClick={
                    openCreateModal
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />

                  Create Subscription
                </button>
              )}
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Subscriptions"
              value={statistics.total}
              icon={CalendarCheck2}
              iconClassName="border-sky-500/25 bg-sky-500/10 text-sky-400"
            />

            <StatCard
              title="Active / Upcoming"
              value={statistics.active}
              icon={CheckCircle2}
              iconClassName="border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
            />

            <StatCard
              title="Expiring"
              value={statistics.expiring}
              icon={Clock3}
              iconClassName="border-amber-500/25 bg-amber-500/10 text-amber-400"
            />

            <StatCard
              title="Needs Attention"
              value={statistics.attention}
              icon={AlertTriangle}
              iconClassName="border-red-500/25 bg-red-500/10 text-red-400"
            />
          </section>

          {feedback && (
            <div
              className={`mt-5 rounded-2xl border px-5 py-4 text-sm ${
                feedback.type ===
                "success"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/25 bg-red-500/10 text-red-300"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#081523]">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Subscription Directory
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredSubscriptions.length} subscription(s) shown
                </p>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  placeholder="Search vehicle, IMEI, plan or status..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500/50"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-9 w-9 animate-spin text-sky-400" />

                  <p className="mt-4 text-sm text-slate-400">
                    Loading subscriptions...
                  </p>
                </div>
              </div>
            ) : filteredSubscriptions.length ===
              0 ? (
              <div className="flex min-h-[360px] items-center justify-center px-5">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-500">
                    <CalendarCheck2 className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    No subscriptions found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {searchTerm
                      ? "No subscription matches your search."
                      : canManage
                        ? "Create the first vehicle subscription."
                        : "No subscription is currently assigned to your account."}
                  </p>

                  {canManage &&
                    !searchTerm && (
                      <button
                        type="button"
                        onClick={
                          openCreateModal
                        }
                        className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white hover:bg-sky-400"
                      >
                        <Plus className="h-4 w-4" />

                        Create First Subscription
                      </button>
                    )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[1180px] w-full text-left">
                  <thead className="border-b border-white/10 bg-white/[0.015]">
                    <tr className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      <th className="px-5 py-4 font-semibold">
                        Vehicle / Device
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Plan
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Validity
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Price
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Account
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Renewal
                      </th>

                      {canManage && (
                        <th className="px-5 py-4 text-right font-semibold">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {filteredSubscriptions.map(
                      (subscription) => {
                        const imei =
                          subscription
                            .device
                            ?.imei ||
                          subscription
                            .vehicle
                            .device
                            ?.imei ||
                          "Not linked";

                        const rowBusy =
                          busyAction
                            ?.includes(
                              subscription.id,
                            ) ?? false;

                        return (
                          <tr
                            key={
                              subscription.id
                            }
                            className="transition hover:bg-white/[0.02]"
                          >
                            <td className="px-5 py-5">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                                  <Car className="h-5 w-5" />
                                </div>

                                <div>
                                  <p className="font-bold text-white">
                                    {
                                      subscription
                                        .vehicle
                                        .vehicleNo
                                    }
                                  </p>

                                  {subscription
                                    .vehicle
                                    .name && (
                                    <p className="mt-1 text-xs text-slate-400">
                                      {
                                        subscription
                                          .vehicle
                                          .name
                                      }
                                    </p>
                                  )}

                                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                    <Radio className="h-3.5 w-3.5" />

                                    {imei}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5">
                              <p className="font-semibold text-white">
                                {
                                  subscription
                                    .plan.name
                                }
                              </p>

                              <p className="mt-1 text-xs font-semibold text-sky-400">
                                {
                                  subscription
                                    .plan.code
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  subscription
                                    .plan
                                    .billingCycle
                                }{" "}
                                ·{" "}
                                {
                                  subscription
                                    .plan
                                    .durationMonths
                                }{" "}
                                month(s)
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="text-sm text-slate-300">
                                {formatDate(
                                  subscription.startDate,
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                to
                              </p>

                              <p className="mt-1 text-sm font-semibold text-white">
                                {formatDate(
                                  subscription.endDate,
                                )}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="flex items-center font-bold text-white">
                                <IndianRupee className="mr-1 h-4 w-4 text-emerald-400" />

                                {formatCurrency(
                                  subscription.priceAtPurchase,
                                  subscription.currency,
                                ).replace(
                                  "₹",
                                  "",
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Tax{" "}
                                {
                                  subscription.taxRateAtPurchase
                                }
                                %
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="text-sm font-semibold text-white">
                                {subscription
                                  .customer
                                  ?.name ||
                                  subscription
                                    .dealer
                                    ?.name ||
                                  "Company Account"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {subscription
                                  .customer
                                  ? "Customer"
                                  : subscription
                                        .dealer
                                        ? "Dealer"
                                        : "Direct"}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <StatusBadge
                                status={
                                  subscription.status
                                }
                              />
                            </td>

                            <td className="px-5 py-5">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                                  subscription.autoRenew
                                    ? "text-emerald-300"
                                    : "text-slate-500"
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    subscription.autoRenew
                                      ? "bg-emerald-400"
                                      : "bg-slate-600"
                                  }`}
                                />

                                {subscription.autoRenew
                                  ? "Auto renew"
                                  : "Manual"}
                              </span>
                            </td>

                            {canManage && (
                              <td className="px-5 py-5">
                                <div className="flex justify-end gap-2">
                                  {subscription.status !==
                                      "CANCELLED" &&
                                    subscription.status !==
                                      "SUSPENDED" && (
                                      <IconButton
                                        title="Renew subscription"
                                        disabled={
                                          rowBusy
                                        }
                                        onClick={() =>
                                          void handleRenew(
                                            subscription,
                                          )
                                        }
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                      </IconButton>
                                    )}
                                  <IconButton
                                    title="Edit subscription"
                                    disabled={
                                      rowBusy
                                    }
                                    onClick={() =>
                                      openEditModal(
                                        subscription,
                                      )
                                    }
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </IconButton>

                                  {subscription.status ===
                                  "SUSPENDED" ? (
                                    <IconButton
                                      title="Restore subscription"
                                      disabled={
                                        rowBusy
                                      }
                                      onClick={() =>
                                        void updateStatus(
                                          subscription,
                                          "ACTIVE",
                                          "Subscription restored successfully.",
                                        )
                                      }
                                    >
                                      <PlayCircle className="h-4 w-4" />
                                    </IconButton>
                                  ) : subscription.status !==
                                      "CANCELLED" &&
                                    subscription.status !==
                                      "EXPIRED" ? (
                                    <IconButton
                                      title="Suspend subscription"
                                      disabled={
                                        rowBusy
                                      }
                                      onClick={() =>
                                        void updateStatus(
                                          subscription,
                                          "SUSPENDED",
                                          "Subscription suspended successfully.",
                                        )
                                      }
                                    >
                                      <PauseCircle className="h-4 w-4" />
                                    </IconButton>
                                  ) : null}

                                  {subscription.status !==
                                    "CANCELLED" && (
                                    <IconButton
                                      title="Cancel subscription"
                                      disabled={
                                        rowBusy
                                      }
                                      onClick={() =>
                                        void handleCancel(
                                          subscription,
                                        )
                                      }
                                      danger
                                    >
                                      <Ban className="h-4 w-4" />
                                    </IconButton>
                                  )}

                                  {subscription.status ===
                                    "CANCELLED" && (
                                    <IconButton
                                      title="Delete subscription"
                                      disabled={
                                        rowBusy
                                      }
                                      onClick={() =>
                                        void handleDelete(
                                          subscription,
                                        )
                                      }
                                      danger
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </IconButton>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {createModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#091625] shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                    Billing Subscription
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Create Subscription
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCreateModalOpen(
                      false,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={
                  handleCreate
                }
                className="p-6"
              >
                {optionsLoading ? (
                  <div className="flex min-h-[250px] items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-400" />

                      <p className="mt-3 text-sm text-slate-400">
                        Loading plans and vehicles...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {plans.length ===
                      0 && (
                      <div className="mb-5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-300">
                        No active billing plan is available.{" "}

                        <Link
                          href="/dashboard/billing/plans"
                          className="font-bold underline"
                        >
                          Create or activate a plan
                        </Link>
                        .
                      </div>
                    )}

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        label="Billing Plan"
                        required
                      >
                        <select
                          value={
                            createForm.planId
                          }
                          onChange={(event) =>
                            setCreateForm(
                              (current) => ({
                                ...current,
                                planId:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                          className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                        >
                          <option value="">
                            Select active plan
                          </option>

                          {plans.map(
                            (plan) => (
                              <option
                                key={
                                  plan.id
                                }
                                value={
                                  plan.id
                                }
                              >
                                {
                                  plan.name
                                }{" "}
                                -{" "}
                                {
                                  plan.billingCycle
                                }{" "}
                                -{" "}
                                {formatCurrency(
                                  plan.pricePerUnit,
                                  plan.currency,
                                )}
                              </option>
                            ),
                          )}
                        </select>
                      </FormField>

                      <FormField
                        label="Vehicle / Device"
                        required
                      >
                        <select
                          value={
                            createForm.vehicleId
                          }
                          onChange={(event) =>
                            setCreateForm(
                              (current) => ({
                                ...current,
                                vehicleId:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                          className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                        >
                          <option value="">
                            Select vehicle
                          </option>

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
                                -{" "}
                                {vehicle
                                  .device
                                  ?.imei ||
                                  "No device"}
                              </option>
                            ),
                          )}
                        </select>
                      </FormField>

                      <FormField
                        label="Start Date"
                        required
                      >
                        <input
                          type="date"
                          value={
                            createForm.startDate
                          }
                          onChange={(event) =>
                            setCreateForm(
                              (current) => ({
                                ...current,
                                startDate:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                          className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none [color-scheme:dark] focus:border-sky-500/50"
                        />
                      </FormField>

                      <FormField label="Renewal Setting">
                        <label className="flex h-12 cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#050c17] px-4">
                          <span className="text-sm text-slate-300">
                            Enable auto renewal
                          </span>

                          <input
                            type="checkbox"
                            checked={
                              createForm.autoRenew
                            }
                            onChange={(event) =>
                              setCreateForm(
                                (
                                  current,
                                ) => ({
                                  ...current,
                                  autoRenew:
                                    event
                                      .target
                                      .checked,
                                }),
                              )
                            }
                            className="h-4 w-4 accent-sky-500"
                          />
                        </label>
                      </FormField>
                    </div>

                    <div className="mt-5">
                      <FormField label="Notes">
                        <textarea
                          rows={4}
                          value={
                            createForm.notes
                          }
                          onChange={(event) =>
                            setCreateForm(
                              (current) => ({
                                ...current,
                                notes:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                          placeholder="Optional subscription notes..."
                          className="w-full resize-none rounded-xl border border-white/10 bg-[#050c17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500/50"
                        />
                      </FormField>
                    </div>
                  </>
                )}

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setCreateModalOpen(
                        false,
                      )
                    }
                    className="h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      optionsLoading ||
                      plans.length ===
                        0 ||
                      busyAction ===
                        "create"
                    }
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyAction ===
                    "create" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    Create Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#091625] shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                    Subscription Management
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-white">
                    Edit Subscription
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {
                      editTarget
                        .vehicle
                        .vehicleNo
                    }{" "}
                    ·{" "}
                    {
                      editTarget.plan
                        .name
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditTarget(
                      null,
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={
                  handleEdit
                }
                className="p-6"
              >
                <div className="grid gap-5">
                  <FormField
                    label="Subscription Status"
                    required
                  >
                    <select
                      value={
                        editForm.status
                      }
                      onChange={(event) =>
                        setEditForm(
                          (current) => ({
                            ...current,

                            status:
                              event
                                .target
                                .value as SubscriptionStatus,
                          }),
                        )
                      }
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#050c17] px-4 text-sm text-white outline-none focus:border-sky-500/50"
                    >
                      {STATUS_OPTIONS.map(
                        (status) => (
                          <option
                            key={
                              status
                            }
                            value={
                              status
                            }
                          >
                            {
                              STATUS_META[
                                status
                              ].label
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </FormField>

                  <FormField label="Renewal Setting">
                    <label className="flex h-12 cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#050c17] px-4">
                      <span className="text-sm text-slate-300">
                        Enable auto renewal
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          editForm.autoRenew
                        }
                        onChange={(event) =>
                          setEditForm(
                            (current) => ({
                              ...current,

                              autoRenew:
                                event
                                  .target
                                  .checked,
                            }),
                          )
                        }
                        className="h-4 w-4 accent-sky-500"
                      />
                    </label>
                  </FormField>

                  <FormField label="Notes">
                    <textarea
                      rows={4}
                      value={
                        editForm.notes
                      }
                      onChange={(event) =>
                        setEditForm(
                          (current) => ({
                            ...current,

                            notes:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      placeholder="Optional subscription notes..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#050c17] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500/50"
                    />
                  </FormField>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setEditTarget(
                        null,
                      )
                    }
                    className="h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      busyAction ===
                      `edit-${editTarget.id}`
                    }
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 disabled:opacity-50"
                  >
                    {busyAction ===
                    `edit-${editTarget.id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    Update Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </RoleRouteGuard>
  );
}