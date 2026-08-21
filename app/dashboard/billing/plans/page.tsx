"use client";

import type {
  FormEvent,
} from "react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  CircleOff,
  CreditCard,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import RoleRouteGuard from "../../../../components/auth/RoleRouteGuard";

type BillingCycle =
  | "MONTHLY"
  | "YEARLY";

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
  createdAt: string;
  updatedAt: string;

  company?: {
    id: string;
    name: string;
  };

  _count?: {
    subscriptions: number;
  };
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role:
    | "SUPER_ADMIN"
    | "ADMIN"
    | "DEALER"
    | "CUSTOMER"
    | "USER";
  companyId: string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  error?: string;
  count?: number;
  data?: T;
};

type PlanFormState = {
  name: string;
  code: string;
  description: string;
  billingCycle: BillingCycle;
  pricePerUnit: string;
  taxRate: string;
  isActive: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

const EMPTY_FORM: PlanFormState = {
  name: "",
  code: "",
  description: "",
  billingCycle: "MONTHLY",
  pricePerUnit: "",
  taxRate: "0",
  isActive: true,
};

function formatMoney(
  value: string | number,
) {
  const amount =
    Number(value);

  if (
    !Number.isFinite(amount)
  ) {
    return "INR 0.00";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(amount);
}

function getStoredUser():
  AuthUser | null {
  try {
    const value =
      localStorage.getItem(
        "navii_user",
      );

    return value
      ? JSON.parse(value)
      : null;
  }
  catch {
    return null;
  }
}

export default function BillingPlansPage() {
  const [plans, setPlans] =
    useState<BillingPlan[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    formSubmitting,
    setFormSubmitting,
  ] = useState(false);

  const [
    busyPlanId,
    setBusyPlanId,
  ] = useState<string | null>(
    null,
  );

  const [search, setSearch] =
    useState("");

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    editingPlanId,
    setEditingPlanId,
  ] = useState<string | null>(
    null,
  );

  const [form, setForm] =
    useState<PlanFormState>({
      ...EMPTY_FORM,
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadPlans =
    useCallback(
      async (
        manualRefresh = false,
      ) => {
        const token =
          localStorage.getItem(
            "navii_access_token",
          );

        if (!token) {
          setError(
            "Authentication token is missing.",
          );

          setLoading(false);
          return;
        }

        if (manualRefresh) {
          setRefreshing(true);
        }
        else {
          setLoading(true);
        }

        setError("");

        try {
          const response =
            await fetch(
              `${API_URL}/api/gps/billing/plans`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },

                cache: "no-store",
              },
            );

          const json =
            await response.json() as
              ApiResponse<
                BillingPlan[]
              >;

          if (
            !response.ok ||
            !json.success
          ) {
            throw new Error(
              json.message ||
              "Unable to load billing plans.",
            );
          }

          setPlans(
            json.data || [],
          );
        }
        catch (requestError) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load billing plans.",
          );
        }
        finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const filteredPlans =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return plans;
      }

      return plans.filter(
        (plan) =>
          plan.name
            .toLowerCase()
            .includes(query) ||
          plan.code
            .toLowerCase()
            .includes(query) ||
          plan.billingCycle
            .toLowerCase()
            .includes(query),
      );
    }, [
      plans,
      search,
    ]);

  const activeCount =
    useMemo(
      () =>
        plans.filter(
          (plan) =>
            plan.isActive,
        ).length,
      [plans],
    );

  const monthlyCount =
    useMemo(
      () =>
        plans.filter(
          (plan) =>
            plan.billingCycle ===
            "MONTHLY",
        ).length,
      [plans],
    );

  const yearlyCount =
    useMemo(
      () =>
        plans.filter(
          (plan) =>
            plan.billingCycle ===
            "YEARLY",
        ).length,
      [plans],
    );

  function openCreateForm() {
    setEditingPlanId(null);

    setForm({
      ...EMPTY_FORM,
    });

    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(
    plan: BillingPlan,
  ) {
    setEditingPlanId(
      plan.id,
    );

    setForm({
      name: plan.name,
      code: plan.code,

      description:
        plan.description ||
        "",

      billingCycle:
        plan.billingCycle,

      pricePerUnit:
        String(
          plan.pricePerUnit,
        ),

      taxRate:
        String(
          plan.taxRate,
        ),

      isActive:
        plan.isActive,
    });

    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function closeForm() {
    if (formSubmitting) {
      return;
    }

    setFormOpen(false);
    setEditingPlanId(null);

    setForm({
      ...EMPTY_FORM,
    });
  }

  async function submitPlan(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const token =
      localStorage.getItem(
        "navii_access_token",
      );

    const user =
      getStoredUser();

    if (!token || !user) {
      setError(
        "Authentication information is missing.",
      );

      return;
    }

    const name =
      form.name.trim();

    const code =
      form.code
        .trim()
        .toUpperCase();

    const price =
      Number(
        form.pricePerUnit,
      );

    const taxRate =
      Number(
        form.taxRate,
      );

    if (!name) {
      setError(
        "Plan name is required.",
      );

      return;
    }

    if (!code) {
      setError(
        "Plan code is required.",
      );

      return;
    }

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError(
        "Price must be greater than zero.",
      );

      return;
    }

    if (
      !Number.isFinite(
        taxRate,
      ) ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      setError(
        "Tax rate must be between 0 and 100.",
      );

      return;
    }

    const payload:
      Record<string, unknown> = {
        name,
        code,

        description:
          form.description
            .trim() ||
          null,

        billingCycle:
          form.billingCycle,

        pricePerUnit:
          price,

        currency:
          "INR",

        taxRate,

        isActive:
          form.isActive,
      };

    if (!editingPlanId) {
      payload.companyId =
        user.companyId;
    }

    setFormSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const endpoint =
        editingPlanId
          ? `${API_URL}/api/gps/billing/plans/${editingPlanId}`
          : `${API_URL}/api/gps/billing/plans`;

      const response =
        await fetch(
          endpoint,
          {
            method:
              editingPlanId
                ? "PATCH"
                : "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const json =
        await response.json() as
          ApiResponse<BillingPlan>;

      if (
        !response.ok ||
        !json.success
      ) {
        throw new Error(
          json.message ||
          "Unable to save billing plan.",
        );
      }

      setSuccess(
        editingPlanId
          ? "Billing plan updated successfully."
          : "Billing plan created successfully.",
      );

      setFormOpen(false);
      setEditingPlanId(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadPlans(true);
    }
    catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save billing plan.",
      );
    }
    finally {
      setFormSubmitting(false);
    }
  }

  async function togglePlanStatus(
    plan: BillingPlan,
  ) {
    const token =
      localStorage.getItem(
        "navii_access_token",
      );

    if (!token) {
      setError(
        "Authentication token is missing.",
      );

      return;
    }

    setBusyPlanId(
      plan.id,
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `${API_URL}/api/gps/billing/plans/${plan.id}`,
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                isActive:
                  !plan.isActive,
              }),
          },
        );

      const json =
        await response.json() as
          ApiResponse<BillingPlan>;

      if (
        !response.ok ||
        !json.success
      ) {
        throw new Error(
          json.message ||
          "Unable to update plan status.",
        );
      }

      setSuccess(
        plan.isActive
          ? "Billing plan deactivated."
          : "Billing plan activated.",
      );

      await loadPlans(true);
    }
    catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update plan status.",
      );
    }
    finally {
      setBusyPlanId(null);
    }
  }

  async function deletePlan(
    plan: BillingPlan,
  ) {
    const confirmed =
      window.confirm(
        `Delete billing plan "${plan.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem(
        "navii_access_token",
      );

    if (!token) {
      setError(
        "Authentication token is missing.",
      );

      return;
    }

    setBusyPlanId(
      plan.id,
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `${API_URL}/api/gps/billing/plans/${plan.id}`,
          {
            method:
              "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      const json =
        await response.json() as
          ApiResponse<unknown>;

      if (
        !response.ok ||
        !json.success
      ) {
        throw new Error(
          json.message ||
          "Unable to delete billing plan.",
        );
      }

      setSuccess(
        "Billing plan deleted successfully.",
      );

      await loadPlans(true);
    }
    catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete billing plan.",
      );
    }
    finally {
      setBusyPlanId(null);
    }
  }

  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
      ]}
    >
      <section className="min-h-[calc(100vh-78px)] bg-[#050b16] px-5 py-6 text-white md:px-7 md:py-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10">
                  <CreditCard className="h-6 w-6 text-sky-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
                    Billing Management
                  </p>

                  <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                    Subscription Plans
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                Create monthly and yearly per-vehicle GPS subscription plans, configure INR pricing and manage plan availability.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  void loadPlans(
                    true,
                  )
                }
                disabled={
                  refreshing
                }
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
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

              <button
                type="button"
                onClick={
                  openCreateForm
                }
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />

                Create Plan
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Plans"
              value={plans.length}
              icon={CreditCard}
              color="sky"
            />

            <SummaryCard
              title="Active Plans"
              value={activeCount}
              icon={
                CheckCircle2
              }
              color="emerald"
            />

            <SummaryCard
              title="Monthly"
              value={monthlyCount}
              icon={
                CalendarDays
              }
              color="violet"
            />

            <SummaryCard
              title="Yearly"
              value={yearlyCount}
              icon={
                BadgeIndianRupee
              }
              color="amber"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] px-5 py-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#081321]">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-bold">
                  Plan Directory
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredPlans.length} plan(s) shown
                </p>
              </div>

              <div className="relative w-full lg:w-[360px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

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
                  placeholder="Search name, code or cycle..."
                  className="w-full rounded-xl border border-white/10 bg-[#050b16] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500/50"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-9 w-9 animate-spin text-sky-400" />

                  <p className="mt-3 text-sm text-slate-400">
                    Loading billing plans...
                  </p>
                </div>
              </div>
            ) : filteredPlans.length ===
              0 ? (
              <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <CreditCard className="h-8 w-8 text-slate-500" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    No billing plans found
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Create the first monthly or yearly GPS subscription plan.
                  </p>

                  {!search && (
                    <button
                      type="button"
                      onClick={
                        openCreateForm
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white"
                    >
                      <Plus className="h-4 w-4" />

                      Create First Plan
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-[0.16em] text-slate-500">
                        <th className="px-5 py-4">
                          Plan
                        </th>

                        <th className="px-5 py-4">
                          Cycle
                        </th>

                        <th className="px-5 py-4">
                          Price
                        </th>

                        <th className="px-5 py-4">
                          Tax
                        </th>

                        <th className="px-5 py-4">
                          Subscriptions
                        </th>

                        <th className="px-5 py-4">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPlans.map(
                        (plan) => {
                          const busy =
                            busyPlanId ===
                            plan.id;

                          return (
                            <tr
                              key={
                                plan.id
                              }
                              className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]"
                            >
                              <td className="px-5 py-5">
                                <p className="font-semibold">
                                  {
                                    plan.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-sky-400">
                                  {
                                    plan.code
                                  }
                                </p>

                                {plan.description && (
                                  <p className="mt-2 max-w-[320px] truncate text-xs text-slate-500">
                                    {
                                      plan.description
                                    }
                                  </p>
                                )}
                              </td>

                              <td className="px-5 py-5">
                                <span className="rounded-lg border border-violet-500/20 bg-violet-500/[0.08] px-3 py-1.5 text-xs font-semibold text-violet-300">
                                  {
                                    plan.billingCycle
                                  }
                                </span>

                                <p className="mt-2 text-xs text-slate-500">
                                  {
                                    plan.durationMonths
                                  }{" "}
                                  month(s)
                                </p>
                              </td>

                              <td className="px-5 py-5 font-semibold">
                                {formatMoney(
                                  plan.pricePerUnit,
                                )}
                              </td>

                              <td className="px-5 py-5 text-sm text-slate-300">
                                {Number(
                                  plan.taxRate,
                                ).toFixed(
                                  2,
                                )}
                                %
                              </td>

                              <td className="px-5 py-5">
                                <span className="rounded-lg bg-white/[0.05] px-3 py-1.5 text-sm font-semibold">
                                  {plan
                                    ._count
                                    ?.subscriptions ||
                                    0}
                                </span>
                              </td>

                              <td className="px-5 py-5">
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                    plan.isActive
                                      ? "bg-emerald-500/[0.10] text-emerald-300"
                                      : "bg-slate-500/[0.10] text-slate-400"
                                  }`}
                                >
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      plan.isActive
                                        ? "bg-emerald-400"
                                        : "bg-slate-500"
                                    }`}
                                  />

                                  {plan.isActive
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>

                              <td className="px-5 py-5">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    title="Edit plan"
                                    onClick={() =>
                                      openEditForm(
                                        plan,
                                      )
                                    }
                                    disabled={
                                      busy
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-300 disabled:opacity-50"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>

                                  <button
                                    type="button"
                                    title={
                                      plan.isActive
                                        ? "Deactivate plan"
                                        : "Activate plan"
                                    }
                                    onClick={() =>
                                      void togglePlanStatus(
                                        plan,
                                      )
                                    }
                                    disabled={
                                      busy
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-300 disabled:opacity-50"
                                  >
                                    {busy ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : plan.isActive ? (
                                      <CircleOff className="h-4 w-4" />
                                    ) : (
                                      <CheckCircle2 className="h-4 w-4" />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    title="Delete plan"
                                    onClick={() =>
                                      void deletePlan(
                                        plan,
                                      )
                                    }
                                    disabled={
                                      busy
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 p-4 lg:hidden">
                  {filteredPlans.map(
                    (plan) => {
                      const busy =
                        busyPlanId ===
                        plan.id;

                      return (
                        <article
                          key={
                            plan.id
                          }
                          className="rounded-2xl border border-white/10 bg-[#050b16] p-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold">
                                {
                                  plan.name
                                }
                              </h3>

                              <p className="mt-1 text-xs font-semibold text-sky-400">
                                {
                                  plan.code
                                }
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                plan.isActive
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : "bg-slate-500/10 text-slate-400"
                              }`}
                            >
                              {plan.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <MobileValue
                              label="Cycle"
                              value={
                                plan.billingCycle
                              }
                            />

                            <MobileValue
                              label="Price"
                              value={formatMoney(
                                plan.pricePerUnit,
                              )}
                            />

                            <MobileValue
                              label="Tax"
                              value={`${Number(
                                plan.taxRate,
                              ).toFixed(
                                2,
                              )}%`}
                            />

                            <MobileValue
                              label="Subscriptions"
                              value={String(
                                plan
                                  ._count
                                  ?.subscriptions ||
                                  0,
                              )}
                            />
                          </div>

                          <div className="mt-5 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(
                                  plan,
                                )
                              }
                              disabled={
                                busy
                              }
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-slate-300"
                            >
                              <Edit3 className="h-4 w-4" />

                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void togglePlanStatus(
                                  plan,
                                )
                              }
                              disabled={
                                busy
                              }
                              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/20 px-3 py-2.5 text-xs font-semibold text-amber-300"
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CircleOff className="h-4 w-4" />
                              )}

                              Toggle
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void deletePlan(
                                  plan,
                                )
                              }
                              disabled={
                                busy
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </article>
                      );
                    },
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {formOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#081321] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                    Billing Plan
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {editingPlanId
                      ? "Edit Plan"
                      : "Create Plan"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    formSubmitting
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={
                  submitPlan
                }
                className="space-y-5 p-6"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Plan Name"
                    required
                  >
                    <input
                      value={
                        form.name
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            current,
                          ) => ({
                            ...current,
                            name:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      placeholder="Example: NAVII Monthly"
                      className="form-input"
                    />
                  </FormField>

                  <FormField
                    label="Plan Code"
                    required
                  >
                    <input
                      value={
                        form.code
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            current,
                          ) => ({
                            ...current,
                            code:
                              event
                                .target
                                .value
                                .toUpperCase(),
                          }),
                        )
                      }
                      placeholder="Example: NAVII-MONTHLY"
                      className="form-input uppercase"
                    />
                  </FormField>
                </div>

                <FormField label="Description">
                  <textarea
                    value={
                      form.description
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,
                          description:
                            event
                              .target
                              .value,
                        }),
                      )
                    }
                    rows={3}
                    placeholder="Plan description and included services..."
                    className="form-input resize-none"
                  />
                </FormField>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Billing Cycle"
                    required
                  >
                    <select
                      value={
                        form.billingCycle
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            current,
                          ) => ({
                            ...current,

                            billingCycle:
                              event
                                .target
                                .value as BillingCycle,
                          }),
                        )
                      }
                      className="form-input"
                    >
                      <option value="MONTHLY">
                        Monthly - 1 month
                      </option>

                      <option value="YEARLY">
                        Yearly - 12 months
                      </option>
                    </select>
                  </FormField>

                  <FormField
                    label="Price Per Vehicle/Device"
                    required
                  >
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                        INR
                      </span>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={
                          form.pricePerUnit
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,

                              pricePerUnit:
                                event
                                  .target
                                  .value,
                            }),
                          )
                        }
                        placeholder="0.00"
                        className="form-input price-input"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="Tax Rate (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={
                        form.taxRate
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            current,
                          ) => ({
                            ...current,

                            taxRate:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Plan Status">
                    <label className="flex min-h-[48px] cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#050b16] px-4">
                      <span className="text-sm text-slate-300">
                        Active for new subscriptions
                      </span>

                      <input
                        type="checkbox"
                        checked={
                          form.isActive
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm(
                            (
                              current,
                            ) => ({
                              ...current,

                              isActive:
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

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      closeForm
                    }
                    disabled={
                      formSubmitting
                    }
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      formSubmitting
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {formSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    {editingPlanId
                      ? "Update Plan"
                      : "Create Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <style jsx>{`
          .form-input {
            width: 100%;
            min-height: 48px;
            border-radius: 0.75rem;
            border: 1px solid
              rgba(255, 255, 255, 0.1);
            background: #050b16;
            padding: 0.75rem 1rem;
            color: white;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 150ms ease;
          }

          .price-input {
            padding-left: 4.25rem;
          }
          .form-input:focus {
            border-color: rgba(
              14,
              165,
              233,
              0.55
            );
          }

          .form-input::placeholder {
            color: rgb(71, 85, 105);
          }
        `}</style>
      </section>
    </RoleRouteGuard>
  );
}

type SummaryCardProps = {
  title: string;
  value: number;

  icon:
    React.ComponentType<{
      className?: string;
    }>;

  color:
    | "sky"
    | "emerald"
    | "violet"
    | "amber";
};

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: SummaryCardProps) {
  const colorClasses = {
    sky: "border-sky-500/20 bg-sky-500/[0.07] text-sky-400",
    emerald:
      "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400",
    violet:
      "border-violet-500/20 bg-violet-500/[0.07] text-violet-400",
    amber:
      "border-amber-500/20 bg-amber-500/[0.07] text-amber-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#081321] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl border ${colorClasses[color]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

type MobileValueProps = {
  label: string;
  value: string;
};

function MobileValue({
  label,
  value,
}: MobileValueProps) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
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