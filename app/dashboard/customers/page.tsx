"use client";

import {
  Car,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Store,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserRound,
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
  email?: string | null;
  phone?: string | null;
};

type Dealer = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  companyId?: string;
};

type CustomerVehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;
  status: string;
  speed?: number;
  ignition?: boolean;
  lastUpdate?: string | null;

  device?: {
    id: string;
    imei: string;
    model: string | null;
    simNumber?: string | null;
    isActive?: boolean;
  } | null;
};

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  code: string;
  address: string | null;
  isActive: boolean;

  companyId: string;
  dealerId: string | null;

  createdAt: string;
  updatedAt: string;

  company?: Company | null;
  dealer: Dealer | null;

  _count: {
    vehicles: number;
  };
};

type CustomerDetail =
  Customer & {
    vehicles: CustomerVehicle[];
  };

type CustomersResponse = {
  success: boolean;
  count: number;
  data: Customer[];
  message?: string;
};

type CustomerResponse = {
  success: boolean;
  message?: string;
  data?: Customer;
};

type CustomerDetailResponse = {
  success: boolean;
  message?: string;
  data?: CustomerDetail;
};

type DealersResponse = {
  success: boolean;
  count: number;
  data: Dealer[];
  message?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_NAVII_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";

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

function getStoredUser(): AuthUser | null {
  if (
    typeof window === "undefined"
  ) {
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

function CustomersPageContent() {
  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>([]);

  const [
    dealers,
    setDealers,
  ] =
    useState<Dealer[]>([]);

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
    detailLoading,
    setDetailLoading,
  ] =
    useState(false);

  const [
    detailCustomer,
    setDetailCustomer,
  ] =
    useState<
      CustomerDetail | null
    >(null);

  const [
    editingId,
    setEditingId,
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
    dealerFilter,
    setDealerFilter,
  ] =
    useState("ALL");

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
    address,
    setAddress,
  ] =
    useState("");

  const [
    dealerId,
    setDealerId,
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

  const loadData =
    useCallback(async () => {
      try {
        setLoading(true);
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

        const customersResponse =
          await fetch(
            `${API_BASE}/api/gps/customers`,
            {
              method: "GET",

              headers:
                getAuthHeaders(),

              cache: "no-store",
            },
          );

        if (
          customersResponse.status ===
          401
        ) {
          handleUnauthorized();
          return;
        }

        if (
          customersResponse.status ===
          403
        ) {
          throw new Error(
            "You do not have permission to view customers.",
          );
        }

        const customersJson =
          await readJson<CustomersResponse>(
            customersResponse,
          );

        if (
          !customersResponse.ok
        ) {
          throw new Error(
            customersJson.message ||
              `Customer API returned ${customersResponse.status}`,
          );
        }

        setCustomers(
          Array.isArray(
            customersJson.data,
          )
            ? customersJson.data
            : [],
        );

        if (
          user.role ===
            "SUPER_ADMIN" ||
          user.role === "ADMIN"
        ) {
          const dealersResponse =
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
            dealersResponse.status ===
            401
          ) {
            handleUnauthorized();
            return;
          }

          if (
            dealersResponse.status ===
            403
          ) {
            throw new Error(
              "You do not have permission to view dealers.",
            );
          }

          const dealersJson =
            await readJson<DealersResponse>(
              dealersResponse,
            );

          if (
            !dealersResponse.ok
          ) {
            throw new Error(
              dealersJson.message ||
                `Dealer API returned ${dealersResponse.status}`,
            );
          }

          setDealers(
            Array.isArray(
              dealersJson.data,
            )
              ? dealersJson.data
              : [],
          );
        } else {
          setDealers([]);

          setDealerId(
            user.dealerId ??
              "",
          );
        }

        setLastRefresh(
          new Date(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load customers",
        );
      } finally {
        setLoading(false);
      }
    }, [
      handleUnauthorized,
    ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const isDealer =
    currentUser?.role ===
    "DEALER";

  const canDelete =
    currentUser?.role ===
      "SUPER_ADMIN" ||
    currentUser?.role ===
      "ADMIN";

  function resetForm() {
    setEditingId(null);

    setName("");
    setCode("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPassword("");
    setShowPassword(false);

    if (isDealer) {
      setDealerId(
        currentUser?.dealerId ??
          "",
      );
    } else {
      setDealerId("");
    }
  }

  function startEdit(
    customer: Customer,
  ) {
    setEditingId(
      customer.id,
    );

    setName(
      customer.name,
    );

    setCode(
      customer.code,
    );

    setEmail(
      customer.email ?? "",
    );

    setPhone(
      customer.phone ?? "",
    );

    setAddress(
      customer.address ?? "",
    );

    setDealerId(
      customer.dealerId ??
        "",
    );

    setPassword("");
    setShowPassword(false);

    setError(null);
    setSuccess(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveCustomer() {
    if (!name.trim()) {
      setError(
        "Customer name is required.",
      );
      return;
    }

    if (!code.trim()) {
      setError(
        "Customer code is required.",
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Customer login email is required.",
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

    const user =
      currentUser ||
      getStoredUser();

    if (
      !token ||
      !user
    ) {
      handleUnauthorized();
      return;
    }

    if (!user.companyId) {
      setError(
        "Company ID is missing from logged-in session.",
      );
      return;
    }

    const effectiveDealerId =
      user.role ===
      "DEALER"
        ? user.dealerId ??
          null
        : dealerId ||
          null;

    if (
      user.role ===
        "DEALER" &&
      !effectiveDealerId
    ) {
      setError(
        "Dealer account is not linked to a dealer record.",
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
            ? `${API_BASE}/api/gps/customers/${editingId}`
            : `${API_BASE}/api/gps/customers`,
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
                        code
                          .trim()
                          .toUpperCase(),

                      email:
                        email
                          .trim()
                          .toLowerCase(),

                      phone:
                        phone.trim() ||
                        null,

                      address:
                        address.trim() ||
                        null,

                      dealerId:
                        effectiveDealerId,
                    }
                  : {
                      name:
                        name.trim(),

                      code:
                        code
                          .trim()
                          .toUpperCase(),

                      email:
                        email
                          .trim()
                          .toLowerCase(),

                      password,

                      phone:
                        phone.trim() ||
                        undefined,

                      address:
                        address.trim() ||
                        undefined,

                      companyId:
                        user.companyId,

                      dealerId:
                        effectiveDealerId,

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
          "You do not have permission to save this customer.",
        );
      }

      const result =
        await readJson<CustomerResponse>(
          response,
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            `Customer API returned ${response.status}`,
        );
      }

      if (!result.data) {
        throw new Error(
          "Customer API returned no customer data.",
        );
      }

      const saved =
        result.data;

      if (editingId) {
        setCustomers(
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
            "Customer updated successfully.",
        );
      } else {
        setCustomers(
          (current) => [
            saved,
            ...current,
          ],
        );

        setSuccess(
          result.message ||
            "Customer and login account created successfully.",
        );
      }

      resetForm();

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save customer",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleCustomer(
    customer: Customer,
  ) {
    const token =
      getAccessToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setActionLoading(
      customer.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/customers/${customer.id}`,
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
                  !customer.isActive,
              }),
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
          "You do not have permission to update this customer.",
        );
      }

      const result =
        await readJson<CustomerResponse>(
          response,
        );

      if (
        !response.ok ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to update customer",
        );
      }

      setCustomers(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              customer.id
                ? result.data as Customer
                : item,
          ),
      );

      setSuccess(
        result.data.isActive
          ? "Customer activated successfully."
          : "Customer deactivated successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update customer",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  async function viewCustomer(
    customer: Customer,
  ) {
    setDetailLoading(true);
    setError(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/customers/${customer.id}`,
          {
            method: "GET",

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
          "You do not have permission to view this customer.",
        );
      }

      const result =
        await readJson<CustomerDetailResponse>(
          response,
        );

      if (
        !response.ok ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to load customer details",
        );
      }

      setDetailCustomer(
        result.data,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer details",
      );
    } finally {
      setDetailLoading(false);
    }
  }

  async function deleteCustomer(
    customer: Customer,
  ) {
    if (!canDelete) {
      setError(
        "Only Super Admin or Admin can delete customers.",
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete customer "${customer.name}" and its linked login account?`,
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(
      customer.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/customers/${customer.id}`,
          {
            method:
              "DELETE",

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
          "You do not have permission to delete this customer.",
        );
      }

      const result =
        await readJson<{
          success?: boolean;
          message?: string;
        }>(
          response,
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            `Delete API returned ${response.status}`,
        );
      }

      setCustomers(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              customer.id,
          ),
      );

      if (
        editingId ===
        customer.id
      ) {
        resetForm();
      }

      if (
        detailCustomer?.id ===
        customer.id
      ) {
        setDetailCustomer(
          null,
        );
      }

      setSuccess(
        result.message ||
          "Customer deleted successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete customer",
      );
    } finally {
      setActionLoading(
        null,
      );
    }
  }

  const filteredCustomers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return customers.filter(
        (customer) => {
          const matchesStatus =
            statusFilter ===
              "ALL" ||
            (
              statusFilter ===
                "ACTIVE" &&
              customer.isActive
            ) ||
            (
              statusFilter ===
                "INACTIVE" &&
              !customer.isActive
            );

          const matchesDealer =
            dealerFilter ===
              "ALL" ||
            (
              dealerFilter ===
                "UNASSIGNED" &&
              !customer.dealerId
            ) ||
            customer.dealerId ===
              dealerFilter;

          if (
            !matchesStatus ||
            !matchesDealer
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          const searchable = [
            customer.name,
            customer.code,
            customer.email ??
              "",
            customer.phone ??
              "",
            customer.address ??
              "",
            customer.dealer
              ?.name ?? "",
            customer.dealer
              ?.code ?? "",
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      customers,
      search,
      statusFilter,
      dealerFilter,
    ]);

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.isActive,
    ).length;

  const inactiveCustomers =
    customers.length -
    activeCustomers;

  const assignedVehicles =
    customers.reduce(
      (total, customer) =>
        total +
        (
          customer._count
            ?.vehicles ?? 0
        ),
      0,
    );

  const linkedDealers =
    new Set(
      customers
        .map(
          (customer) =>
            customer.dealerId,
        )
        .filter(Boolean),
    ).size;

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1750px]">

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              CUSTOMER MANAGEMENT
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Customers
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Customer accounts,
              dealer relationships
              and vehicle allocation
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
                void loadData()
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
            title="Total Customers"
            value={
              customers.length
            }
            icon={<Users />}
          />

          <StatCard
            title="Active"
            value={
              activeCustomers
            }
            icon={
              <CheckCircle2 />
            }
          />

          <StatCard
            title="Inactive"
            value={
              inactiveCustomers
            }
            icon={
              <ToggleLeft />
            }
          />

          <StatCard
            title="Linked Dealers"
            value={
              linkedDealers
            }
            icon={<Store />}
          />

          <StatCard
            title="Vehicles"
            value={
              assignedVehicles
            }
            icon={<Car />}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[430px_1fr]">

          <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">
                  {editingId
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {editingId
                    ? "Update customer and linked login details"
                    : "Create customer record and login account"}
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  title="Cancel Edit"
                  onClick={
                    resetForm
                  }
                  className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/[0.05]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <Field label="Customer Name">
                <input
                  value={
                    name
                  }
                  onChange={(
                    event,
                  ) =>
                    setName(
                      event.target
                        .value,
                    )
                  }
                  className="input-field"
                  placeholder="Customer name"
                />
              </Field>

              <Field label="Customer Code">
                <input
                  value={
                    code
                  }
                  onChange={(
                    event,
                  ) =>
                    setCode(
                      event.target
                        .value,
                    )
                  }
                  className="input-field"
                  placeholder="CUS-002"
                />
              </Field>

              <Field label="Dealer">
                {isDealer ? (
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3 text-sm text-sky-300">
                    My Dealer Account
                  </div>
                ) : (
                  <select
                    value={
                      dealerId
                    }
                    onChange={(
                      event,
                    ) =>
                      setDealerId(
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                  >
                    <option value="">
                      No Dealer
                    </option>

                    {dealers
                      .filter(
                        (dealer) =>
                          dealer.isActive ||
                          dealer.id ===
                            dealerId,
                      )
                      .map(
                        (dealer) => (
                          <option
                            key={
                              dealer.id
                            }
                            value={
                              dealer.id
                            }
                          >
                            {
                              dealer.name
                            }{" "}
                            —{" "}
                            {
                              dealer.code
                            }
                          </option>
                        ),
                      )}
                  </select>
                )}
              </Field>

              <Field label="Login Email">
                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={(
                    event,
                  ) =>
                    setEmail(
                      event.target
                        .value,
                    )
                  }
                  className="input-field"
                  placeholder="customer@example.com"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500">
                    Password is used
                    for the customer
                    login account.
                  </p>
                </Field>
              )}

              <Field label="Phone">
                <input
                  value={
                    phone
                  }
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

              <Field label="Address">
                <textarea
                  value={
                    address
                  }
                  onChange={(
                    event,
                  ) =>
                    setAddress(
                      event.target
                        .value,
                    )
                  }
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Customer address"
                />
              </Field>

              <button
                type="button"
                disabled={
                  saving
                }
                onClick={() =>
                  void saveCustomer()
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                    Create Customer & Login
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">

            <div className="flex flex-col gap-4 border-b border-white/10 p-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="font-semibold">
                  Customer Directory
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {
                    filteredCustomers.length
                  }{" "}
                  of{" "}
                  {
                    customers.length
                  }{" "}
                  customer records
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row">

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
                    placeholder="Search customer..."
                    className="w-52 bg-transparent text-sm outline-none placeholder:text-slate-500"
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
                  className="filter-field"
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

                {!isDealer && (
                  <select
                    value={
                      dealerFilter
                    }
                    onChange={(
                      event,
                    ) =>
                      setDealerFilter(
                        event.target
                          .value,
                      )
                    }
                    className="filter-field"
                  >
                    <option value="ALL">
                      All Dealers
                    </option>

                    <option value="UNASSIGNED">
                      No Dealer
                    </option>

                    {dealers.map(
                      (dealer) => (
                        <option
                          key={
                            dealer.id
                          }
                          value={
                            dealer.id
                          }
                        >
                          {
                            dealer.name
                          }
                        </option>
                      ),
                    )}
                  </select>
                )}
              </div>
            </div>

            {loading &&
            customers.length ===
              0 ? (
              <div className="flex min-h-[320px] items-center justify-center text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading customers...
              </div>
            ) : filteredCustomers.length >
              0 ? (
              <div className="divide-y divide-white/10">
                {filteredCustomers.map(
                  (customer) => (
                    <div
                      key={
                        customer.id
                      }
                      className="flex flex-col justify-between gap-5 p-5 xl:flex-row xl:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <UserRound className="h-4 w-4 text-sky-400" />

                          <h3 className="font-semibold">
                            {
                              customer.name
                            }
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              customer.isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-500/10 text-slate-400"
                            }`}
                          >
                            {customer.isActive
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Code:{" "}
                          {
                            customer.code
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />

                            {customer.email ??
                              "No email"}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />

                            {customer.phone ??
                              "No phone"}
                          </span>
                        </div>

                        {customer.address && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />

                            {
                              customer.address
                            }
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                          <span>
                            Dealer:{" "}
                            <strong className="text-white">
                              {customer
                                .dealer
                                ?.name ??
                                "Unassigned"}
                            </strong>
                          </span>

                          <span>
                            Vehicles:{" "}
                            <strong className="text-white">
                              {customer
                                ._count
                                ?.vehicles ??
                                0}
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
                            void viewCustomer(
                              customer,
                            )
                          }
                          title="View Details"
                          className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2.5 text-sky-400 transition hover:bg-sky-500/20 disabled:opacity-50"
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
                              customer,
                            )
                          }
                          title="Edit Customer"
                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-400 transition hover:bg-amber-500/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading ===
                            customer.id
                          }
                          onClick={() =>
                            void toggleCustomer(
                              customer,
                            )
                          }
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            customer.isActive
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          {customer.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}

                          {customer.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        {canDelete && (
                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              customer.id
                            }
                            onClick={() =>
                              void deleteCustomer(
                                customer,
                              )
                            }
                            title="Delete Customer"
                            className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
                          >
                            {actionLoading ===
                            customer.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}

                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <Users className="h-10 w-10 text-slate-600" />

                <p className="mt-3 font-semibold">
                  No customers found
                </p>
              </div>
            )}
          </section>
        </div>

        <style jsx>{`
          .input-field,
          .filter-field {
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

          .filter-field {
            width: auto;
            min-width: 140px;
          }

          .password-field {
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }

          .input-field:focus,
          .filter-field:focus {
            border-color: rgba(
              14,
              165,
              233,
              0.6
            );
          }
        `}</style>

        {detailCustomer && (
          <CustomerDetailModal
            customer={
              detailCustomer
            }
            onClose={() =>
              setDetailCustomer(
                null,
              )
            }
          />
        )}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
      ]}
    >
      <CustomersPageContent />
    </RoleRouteGuard>
  );
}

function CustomerDetailModal({
  customer,
  onClose,
}: {
  customer: CustomerDetail;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-white/10 bg-[#081221] shadow-2xl">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#081221] p-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-400">
              CUSTOMER DETAILS
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {customer.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/[0.05]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DetailCard
              label="Customer Code"
              value={
                customer.code
              }
            />

            <DetailCard
              label="Status"
              value={
                customer.isActive
                  ? "ACTIVE"
                  : "INACTIVE"
              }
            />

            <DetailCard
              label="Dealer"
              value={
                customer.dealer
                  ?.name ??
                "Unassigned"
              }
            />

            <DetailCard
              label="Vehicles"
              value={String(
                customer._count
                  ?.vehicles ?? 0,
              )}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 text-sm">
            <p>
              <span className="text-slate-500">
                Email:
              </span>{" "}
              {customer.email ??
                "—"}
            </p>

            <p className="mt-2">
              <span className="text-slate-500">
                Phone:
              </span>{" "}
              {customer.phone ??
                "—"}
            </p>

            <p className="mt-2">
              <span className="text-slate-500">
                Address:
              </span>{" "}
              {customer.address ??
                "—"}
            </p>

            <p className="mt-2">
              <span className="text-slate-500">
                Company:
              </span>{" "}
              {customer.company
                ?.name ?? "—"}
            </p>

            <p className="mt-2">
              <span className="text-slate-500">
                Dealer Code:
              </span>{" "}
              {customer.dealer
                ?.code ?? "—"}
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">
                Assigned Vehicles
              </h3>

              <span className="text-xs text-slate-500">
                {customer.vehicles
                  ?.length ?? 0}{" "}
                vehicle(s)
              </span>
            </div>

            {customer.vehicles
              ?.length ? (
              <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                {customer.vehicles.map(
                  (vehicle) => (
                    <div
                      key={
                        vehicle.id
                      }
                      className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-sky-400" />

                          <p className="font-medium">
                            {
                              vehicle.vehicleNo
                            }
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            vehicle.name ??
                            "No vehicle name"
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          IMEI:{" "}
                          {vehicle.device
                            ?.imei ??
                            "—"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Device:{" "}
                          {vehicle.device
                            ?.model ??
                            "—"}
                        </p>
                      </div>

                      <div className="text-right text-xs">
                        <p
                          className={
                            vehicle.status ===
                            "MOVING"
                              ? "text-emerald-400"
                              : vehicle.status ===
                                  "IDLE"
                                ? "text-amber-400"
                                : "text-slate-400"
                          }
                        >
                          {
                            vehicle.status
                          }
                        </p>

                        {vehicle.lastUpdate && (
                          <p className="mt-2 text-slate-500">
                            {new Date(
                              vehicle.lastUpdate,
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
                <Car className="mx-auto h-8 w-8 text-slate-600" />

                <p className="mt-3 text-sm text-slate-500">
                  No vehicles assigned
                  to this customer.
                </p>
              </div>
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