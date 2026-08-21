"use client";

import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Store,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
  X,
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

type Company = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

type Dealer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  code: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;

  company: Company;

  _count: {
    customers: number;
    vehicles: number;
  };
};

type DealerCustomer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  code: string;
  isActive: boolean;
};

type DealerVehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;
  status: string;

  device?: {
    id: string;
    imei: string;
    model: string | null;
  } | null;

  customer?: {
    id: string;
    name: string;
  } | null;
};

type DealerDetail = Dealer & {
  customers: DealerCustomer[];
  vehicles: DealerVehicle[];
};

type DealersResponse = {
  success: boolean;
  count: number;
  data: Dealer[];
  message?: string;
};

type DealerResponse = {
  success: boolean;
  message?: string;
  data?: Dealer;
};

type DealerDetailResponse = {
  success: boolean;
  message?: string;
  data?: DealerDetail;
};

const API_BASE =
  process.env.NEXT_PUBLIC_NAVII_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

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

function getCurrentUser(): AuthUser | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const stored =
    localStorage.getItem(
      "navii_user",
    );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored,
    ) as AuthUser;
  } catch {
    return null;
  }
}

function getAuthHeaders(
  includeContentType = false,
): HeadersInit {
  const token =
    getAccessToken();

  const headers: Record<
    string,
    string
  > = {};

  if (includeContentType) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  return headers;
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

function DealersPageContent() {
  const [
    dealers,
    setDealers,
  ] =
    useState<Dealer[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
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
    search,
    setSearch,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<
      "ALL" | "ACTIVE" | "INACTIVE"
    >("ALL");

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
    editingId,
    setEditingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    detailDealer,
    setDetailDealer,
  ] =
    useState<
      DealerDetail | null
    >(null);

  const [
    detailLoading,
    setDetailLoading,
  ] =
    useState(false);

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    code,
    setCode,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

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

  const loadDealers =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          getAccessToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        const response =
          await fetch(
            `${API_BASE}/api/gps/dealers`,
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
            "You do not have permission to view dealers.",
          );
        }

        const result =
          await readJson<DealersResponse>(
            response,
          );

        if (
          !response.ok
        ) {
          throw new Error(
            result.message ||
              `Dealer API returned ${response.status}`,
          );
        }

        setDealers(
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
            : "Unable to load dealers",
        );
      } finally {
        setLoading(
          false,
        );
      }
    }, [
      handleUnauthorized,
    ]);

  useEffect(() => {
    void loadDealers();
  }, [loadDealers]);

  function resetForm() {
    setEditingId(null);

    setName("");
    setCode("");
    setEmail("");
    setPhone("");
    setPassword("");
    setShowPassword(false);
  }

  function startEdit(
    dealer: Dealer,
  ) {
    setEditingId(
      dealer.id,
    );

    setName(
      dealer.name,
    );

    setCode(
      dealer.code,
    );

    setEmail(
      dealer.email ?? "",
    );

    setPhone(
      dealer.phone ?? "",
    );

    setPassword("");
    setShowPassword(false);

    setError(null);
    setSuccess(null);

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }

  async function saveDealer() {
    if (
      !name.trim()
    ) {
      setError(
        "Dealer name is required.",
      );
      return;
    }

    if (
      !code.trim()
    ) {
      setError(
        "Dealer code is required.",
      );
      return;
    }

    if (
      !email.trim()
    ) {
      setError(
        "Dealer login email is required.",
      );
      return;
    }

    if (
      !editingId &&
      (
        !password ||
        password.length <
          8
      )
    ) {
      setError(
        "Login password must contain at least 8 characters.",
      );
      return;
    }

    const token =
      getAccessToken();

    const currentUser =
      getCurrentUser();

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (
      !editingId &&
      !currentUser?.companyId
    ) {
      setError(
        "Company ID is missing from logged-in session.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          editingId
            ? `${API_BASE}/api/gps/dealers/${editingId}`
            : `${API_BASE}/api/gps/dealers`,
          {
            method:
              editingId
                ? "PATCH"
                : "POST",

            headers:
              getAuthHeaders(
                true,
              ),

            body:
              JSON.stringify(
                editingId
                  ? {
                      name:
                        name.trim(),

                      code:
                        code.trim(),

                      email:
                        email
                          .trim()
                          .toLowerCase(),

                      phone:
                        phone.trim() ||
                        null,
                    }
                  : {
                      name:
                        name.trim(),

                      code:
                        code.trim(),

                      email:
                        email
                          .trim()
                          .toLowerCase(),

                      phone:
                        phone.trim() ||
                        undefined,

                      password,

                      companyId:
                        currentUser!
                          .companyId,

                      isActive:
                        true,
                    },
              ),
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
          "You do not have permission to save dealers.",
        );
      }

      const result =
        await readJson<DealerResponse>(
          response,
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            `Dealer API returned ${response.status}`,
        );
      }

      if (!result.data) {
        throw new Error(
          "Dealer API returned no dealer data.",
        );
      }

      const saved =
        result.data;

      if (editingId) {
        setDealers(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                editingId
                  ? saved
                  : item,
            ),
        );

        setSuccess(
          result.message ||
            "Dealer updated successfully.",
        );
      } else {
        setDealers(
          (current) => [
            saved,
            ...current,
          ],
        );

        setSuccess(
          result.message ||
            "Dealer and login account created successfully.",
        );
      }

      resetForm();

      await loadDealers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save dealer",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleDealer(
    dealer: Dealer,
  ) {
    const token =
      getAccessToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setActionLoading(
      dealer.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/dealers/${dealer.id}`,
          {
            method:
              "PATCH",

            headers:
              getAuthHeaders(
                true,
              ),

            body:
              JSON.stringify({
                isActive:
                  !dealer.isActive,
              }),
          },
        );

      const result =
        await readJson<DealerResponse>(
          response,
        );

      if (
        !response.ok ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to update dealer",
        );
      }

      setDealers(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              dealer.id
                ? result.data as Dealer
                : item,
          ),
      );

      setSuccess(
        result.data.isActive
          ? "Dealer activated successfully."
          : "Dealer deactivated successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update dealer",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  async function viewDealer(
    dealer: Dealer,
  ) {
    setDetailLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/dealers/${dealer.id}`,
          {
            method:
              "GET",

            headers:
              getAuthHeaders(),

            cache:
              "no-store",
          },
        );

      const result =
        await readJson<DealerDetailResponse>(
          response,
        );

      if (
        !response.ok ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to load dealer details",
        );
      }

      setDetailDealer(
        result.data,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load dealer details",
      );
    } finally {
      setDetailLoading(false);
    }
  }

  async function deleteDealer(
    dealer: Dealer,
  ) {
    const confirmed =
      window.confirm(
        `Delete dealer "${dealer.name}" and its linked login account?`,
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(
      dealer.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/dealers/${dealer.id}`,
          {
            method:
              "DELETE",

            headers:
              getAuthHeaders(),
          },
        );

      const result =
        await readJson<{
          success?: boolean;
          message?: string;
        }>(
          response,
        );

      if (
        response.status ===
        401
      ) {
        handleUnauthorized();
        return;
      }

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            `Delete API returned ${response.status}`,
        );
      }

      setDealers(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              dealer.id,
          ),
      );

      if (
        editingId ===
        dealer.id
      ) {
        resetForm();
      }

      if (
        detailDealer?.id ===
        dealer.id
      ) {
        setDetailDealer(
          null,
        );
      }

      setSuccess(
        result.message ||
          "Dealer deleted successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete dealer",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  const filteredDealers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return dealers.filter(
        (dealer) => {
          const statusMatch =
            statusFilter ===
              "ALL" ||
            (statusFilter ===
              "ACTIVE" &&
              dealer.isActive) ||
            (statusFilter ===
              "INACTIVE" &&
              !dealer.isActive);

          if (!statusMatch) {
            return false;
          }

          if (!query) {
            return true;
          }

          return [
            dealer.name,
            dealer.code,
            dealer.email ??
              "",
            dealer.phone ??
              "",
            dealer.company
              ?.name ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(query);
        },
      );
    }, [
      dealers,
      search,
      statusFilter,
    ]);

  const activeCount =
    dealers.filter(
      (dealer) =>
        dealer.isActive,
    ).length;

  const inactiveCount =
    dealers.length -
    activeCount;

  const totalCustomers =
    dealers.reduce(
      (total, dealer) =>
        total +
        (dealer._count
          ?.customers ?? 0),
      0,
    );

  const totalVehicles =
    dealers.reduce(
      (total, dealer) =>
        total +
        (dealer._count
          ?.vehicles ?? 0),
      0,
    );

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1750px]">

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              CHANNEL MANAGEMENT
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Dealers
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Dealer network,
              login accounts,
              customers and
              vehicle allocation
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
                loading
              }
              onClick={() =>
                void loadDealers()
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
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />

            {success}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Dealers"
            value={
              dealers.length
            }
            icon={<Store />}
          />

          <StatCard
            title="Active"
            value={
              activeCount
            }
            icon={
              <CheckCircle2 />
            }
          />

          <StatCard
            title="Inactive"
            value={
              inactiveCount
            }
            icon={
              <ToggleLeft />
            }
          />

          <StatCard
            title="Customers"
            value={
              totalCustomers
            }
            icon={<Users />}
          />

          <StatCard
            title="Vehicles"
            value={
              totalVehicles
            }
            icon={
              <Building2 />
            }
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[420px_1fr]">

          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {editingId
                    ? "Edit Dealer"
                    : "Add Dealer"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {editingId
                    ? "Update dealer and linked login details"
                    : "Create dealer record and login account"}
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/[0.05]"
                  title="Cancel Edit"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <Field label="Dealer Name">
                <input
                  value={name}
                  onChange={(
                    event,
                  ) =>
                    setName(
                      event.target
                        .value,
                    )
                  }
                  className="input-field"
                  placeholder="Dealer name"
                />
              </Field>

              <Field label="Dealer Code">
                <input
                  value={code}
                  onChange={(
                    event,
                  ) =>
                    setCode(
                      event.target
                        .value,
                    )
                  }
                  className="input-field"
                  placeholder="DLR-002"
                />
              </Field>

              <Field label="Login Email">
                <input
                  type="email"
                  value={email}
                  onChange={(
                    event,
                  ) =>
                    setEmail(
                      event.target
                        .value,
                    )
                  }
                  className="input-field"
                  placeholder="dealer@example.com"
                />
              </Field>

              <Field label="Phone">
                <input
                  value={phone}
                  onChange={(
                    event,
                  ) =>
                    setPhone(
                      event.target
                        .value,
                    )
                  }
                  className="input-field"
                  placeholder="Phone number"
                />
              </Field>

              {!editingId && (
                <Field label="Login Password">
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        password
                      }
                      onChange={(
                        event,
                      ) =>
                        setPassword(
                          event.target
                            .value,
                        )
                      }
                      className="input-field password-field"
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) =>
                            !value,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500">
                    Password creates
                    the dealer login.
                    Password reset can
                    be managed separately.
                  </p>
                </Field>
              )}

              <button
                type="button"
                disabled={
                  saving
                }
                onClick={() =>
                  void saveDealer()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold transition hover:bg-sky-400 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Pencil className="h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Dealer & Login
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">

            <div className="flex flex-col gap-4 border-b border-white/10 p-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="font-semibold">
                  Dealer Network
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {
                    filteredDealers.length
                  }{" "}
                  of{" "}
                  {
                    dealers.length
                  }{" "}
                  dealer records
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#07101f] px-4 py-2.5">
                  <Search className="h-4 w-4 text-slate-500" />

                  <input
                    value={
                      search
                    }
                    onChange={(
                      event,
                    ) =>
                      setSearch(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search dealer..."
                    className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-500"
                  />
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
                        .value as
                        | "ALL"
                        | "ACTIVE"
                        | "INACTIVE",
                    )
                  }
                  className="rounded-xl border border-white/10 bg-[#07101f] px-4 py-2.5 text-sm outline-none"
                >
                  <option value="ALL">
                    All Status
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {loading &&
            dealers.length ===
              0 ? (
              <div className="flex min-h-[320px] items-center justify-center text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading dealers...
              </div>
            ) : filteredDealers.length >
              0 ? (
              <div className="divide-y divide-white/10">
                {filteredDealers.map(
                  (dealer) => (
                    <div
                      key={
                        dealer.id
                      }
                      className="flex flex-col justify-between gap-5 p-5 xl:flex-row xl:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {
                              dealer.name
                            }
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              dealer.isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-500/10 text-slate-400"
                            }`}
                          >
                            {dealer.isActive
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-400">
                          Code:{" "}
                          {
                            dealer.code
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />

                            {dealer.email ??
                              "No email"}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />

                            {dealer.phone ??
                              "No phone"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                          <span>
                            Customers:{" "}
                            <strong className="text-white">
                              {dealer
                                ._count
                                ?.customers ??
                                0}
                            </strong>
                          </span>

                          <span>
                            Vehicles:{" "}
                            <strong className="text-white">
                              {dealer
                                ._count
                                ?.vehicles ??
                                0}
                            </strong>
                          </span>

                          <span>
                            Company:{" "}
                            <strong className="text-white">
                              {dealer
                                .company
                                ?.name ??
                                "—"}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">

                        <button
                          type="button"
                          disabled={
                            detailLoading
                          }
                          onClick={() =>
                            void viewDealer(
                              dealer,
                            )
                          }
                          title="View Details"
                          className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2.5 text-sky-400 transition hover:bg-sky-500/20"
                        >
                          {detailLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              dealer,
                            )
                          }
                          title="Edit Dealer"
                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-400 transition hover:bg-amber-500/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            dealer.id
                          }
                          onClick={() =>
                            void toggleDealer(
                              dealer,
                            )
                          }
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            dealer.isActive
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          {dealer.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}

                          {dealer.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            dealer.id
                          }
                          onClick={() =>
                            void deleteDealer(
                              dealer,
                            )
                          }
                          title="Delete Dealer"
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
                        >
                          {actionLoading ===
                          dealer.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>

                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <Store className="h-10 w-10 text-slate-600" />

                <p className="mt-3 font-semibold">
                  No dealers found
                </p>
              </div>
            )}
          </section>
        </div>

        <style jsx>{`
          .input-field {
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

          .password-field {
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }

          .input-field:focus {
            border-color: rgba(
              14,
              165,
              233,
              0.6
            );
          }
        `}</style>

        {detailDealer && (
          <DealerDetailModal
            dealer={
              detailDealer
            }
            onClose={() =>
              setDetailDealer(
                null,
              )
            }
          />
        )}
      </div>
    </div>
  );
}

export default function DealersPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
      ]}
    >
      <DealersPageContent />
    </RoleRouteGuard>
  );
}

function DealerDetailModal({
  dealer,
  onClose,
}: {
  dealer: DealerDetail;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-white/10 bg-[#081221] shadow-2xl">

        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#081221] p-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-400">
              DEALER DETAILS
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {dealer.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/[0.05]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DetailCard
              label="Dealer Code"
              value={
                dealer.code
              }
            />

            <DetailCard
              label="Status"
              value={
                dealer.isActive
                  ? "ACTIVE"
                  : "INACTIVE"
              }
            />

            <DetailCard
              label="Customers"
              value={String(
                dealer._count
                  .customers,
              )}
            />

            <DetailCard
              label="Vehicles"
              value={String(
                dealer._count
                  .vehicles,
              )}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 text-sm">
            <p>
              <span className="text-slate-500">
                Email:
              </span>{" "}
              {dealer.email ??
                "—"}
            </p>

            <p className="mt-2">
              <span className="text-slate-500">
                Phone:
              </span>{" "}
              {dealer.phone ??
                "—"}
            </p>

            <p className="mt-2">
              <span className="text-slate-500">
                Company:
              </span>{" "}
              {dealer.company
                ?.name ?? "—"}
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">
              Customers
            </h3>

            {dealer.customers
              ?.length ? (
              <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                {dealer.customers.map(
                  (customer) => (
                    <div
                      key={
                        customer.id
                      }
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {
                            customer.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            customer.code
                          }{" "}
                          ·{" "}
                          {customer.email ??
                            "No email"}
                        </p>
                      </div>

                      <span
                        className={
                          customer.isActive
                            ? "text-xs text-emerald-400"
                            : "text-xs text-slate-500"
                        }
                      >
                        {customer.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No customers assigned.
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-3 font-semibold">
              Assigned Vehicles
            </h3>

            {dealer.vehicles
              ?.length ? (
              <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                {dealer.vehicles.map(
                  (vehicle) => (
                    <div
                      key={
                        vehicle.id
                      }
                      className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {
                            vehicle.vehicleNo
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          IMEI:{" "}
                          {vehicle.device
                            ?.imei ??
                            "—"}
                        </p>
                      </div>

                      <div className="text-right text-xs text-slate-400">
                        <p>
                          {
                            vehicle.status
                          }
                        </p>

                        <p className="mt-1">
                          Customer:{" "}
                          {vehicle.customer
                            ?.name ??
                            "Unassigned"}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No vehicles assigned.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>
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