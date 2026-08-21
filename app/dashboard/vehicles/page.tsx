"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Battery,
  Car,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Gauge,
  History,
  Loader2,
  MapPin,
  Plus,
  Power,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Store,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

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

type VehicleStatus =
  | "MOVING"
  | "IDLE"
  | "OFFLINE";

type Dealer = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
};

type Customer = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  dealerId: string | null;
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
  status: VehicleStatus;
  speed: number;
  ignition: boolean;
  battery: number | null;
  latitude: number | null;
  longitude: number | null;
  lastUpdate: string | null;

  companyId: string;
  dealerId: string | null;
  customerId: string | null;

  dealer?: Dealer | null;
  customer?: Customer | null;
  device?: Device | null;
};

type VehiclesResponse = {
  success: boolean;
  data: Vehicle[];
  message?: string;
};

type VehicleResponse = {
  success: boolean;
  message?: string;
  data?: Vehicle;
};

type DealersResponse = {
  success: boolean;
  count: number;
  data: Dealer[];
  message?: string;
};

type CustomersResponse = {
  success: boolean;
  count: number;
  data: Customer[];
  message?: string;
};

type StatusFilter =
  | "ALL"
  | VehicleStatus;

type VehicleForm = {
  vehicleNo: string;
  name: string;
  imei: string;
  model: string;
  simNumber: string;
  dealerId: string;
  customerId: string;
};

const EMPTY_FORM: VehicleForm = {
  vehicleNo: "",
  name: "",
  imei: "",
  model: "",
  simNumber: "",
  dealerId: "",
  customerId: "",
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

function VehiclesPageContent() {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [dealers, setDealers] =
    useState<Dealer[]>([]);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [
    currentUser,
    setCurrentUser,
  ] = useState<AuthUser | null>(
    null,
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(
      null,
    );

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [success, setSuccess] =
    useState<string | null>(
      null,
    );

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>(
    "ALL",
  );

  const [
    lastRefresh,
    setLastRefresh,
  ] = useState<Date | null>(
    null,
  );

  const [
    showCreateForm,
    setShowCreateForm,
  ] = useState(false);

  const [
    editingVehicle,
    setEditingVehicle,
  ] = useState<Vehicle | null>(
    null,
  );

  const [form, setForm] =
    useState<VehicleForm>(
      EMPTY_FORM,
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

  const loadVehicles =
    useCallback(async () => {
      try {
        setError(null);

        const token =
          getAccessToken();

        const user =
          getStoredUser();

        if (!token || !user) {
          handleUnauthorized();
          return;
        }

        setCurrentUser(user);

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
          throw new Error(
            "You do not have permission to view vehicles.",
          );
        }

        const result =
          await readJson<VehiclesResponse>(
            response,
          );

        if (!response.ok) {
          throw new Error(
            result.message ||
              `Vehicles API returned ${response.status}`,
          );
        }

        setVehicles(
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
            : "Unable to load vehicles",
        );
      } finally {
        setLoading(false);
      }
    }, [handleUnauthorized]);

  const loadManagementLists =
    useCallback(async () => {
      const user =
        getStoredUser();

      const token =
        getAccessToken();

      if (!token || !user) {
        return;
      }

      if (
        user.role !==
          "SUPER_ADMIN" &&
        user.role !== "ADMIN"
      ) {
        return;
      }

      try {
        const [
          dealersResponse,
          customersResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE}/api/gps/dealers`,
            {
              headers:
                getAuthHeaders(),
              cache: "no-store",
            },
          ),

          fetch(
            `${API_BASE}/api/gps/customers`,
            {
              headers:
                getAuthHeaders(),
              cache: "no-store",
            },
          ),
        ]);

        if (
          dealersResponse.status ===
            401 ||
          customersResponse.status ===
            401
        ) {
          handleUnauthorized();
          return;
        }

        const dealersJson =
          await readJson<DealersResponse>(
            dealersResponse,
          );

        const customersJson =
          await readJson<CustomersResponse>(
            customersResponse,
          );

        if (
          dealersResponse.ok
        ) {
          setDealers(
            Array.isArray(
              dealersJson.data,
            )
              ? dealersJson.data
              : [],
          );
        }

        if (
          customersResponse.ok
        ) {
          setCustomers(
            Array.isArray(
              customersJson.data,
            )
              ? customersJson.data
              : [],
          );
        }
      } catch {
        // Main vehicle page can still
        // operate if dropdown metadata
        // temporarily fails.
      }
    }, [handleUnauthorized]);

  useEffect(() => {
    void loadVehicles();
    void loadManagementLists();

    const timer =
      window.setInterval(() => {
        void loadVehicles();
      }, 5000);

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [
    loadVehicles,
    loadManagementLists,
  ]);

  const canManage =
    currentUser?.role ===
      "SUPER_ADMIN" ||
    currentUser?.role ===
      "ADMIN";

  const filteredCustomers =
    useMemo(() => {
      if (!form.dealerId) {
        return customers.filter(
          (customer) =>
            customer.isActive,
        );
      }

      return customers.filter(
        (customer) =>
          customer.isActive &&
          customer.dealerId ===
            form.dealerId,
      );
    }, [
      customers,
      form.dealerId,
    ]);

  function updateForm(
    key: keyof VehicleForm,
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  }

  function handleDealerChange(
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        dealerId: value,
        customerId: "",
      }),
    );
  }

  function openCreate() {
    setEditingVehicle(null);
    setForm(EMPTY_FORM);
    setError(null);
    setSuccess(null);
    setShowCreateForm(true);
  }

  function closeForm() {
    setEditingVehicle(null);
    setShowCreateForm(false);
    setForm(EMPTY_FORM);
  }

  function openEdit(
    vehicle: Vehicle,
  ) {
    setEditingVehicle(vehicle);

    setForm({
      vehicleNo:
        vehicle.vehicleNo,

      name:
        vehicle.name ?? "",

      imei:
        vehicle.device?.imei ??
        "",

      model:
        vehicle.device?.model ??
        "",

      simNumber:
        vehicle.device
          ?.simNumber ?? "",

      dealerId:
        vehicle.dealerId ?? "",

      customerId:
        vehicle.customerId ?? "",
    });

    setShowCreateForm(true);
    setError(null);
    setSuccess(null);
  }

  async function createVehicle() {
    const user =
      currentUser ||
      getStoredUser();

    if (!user) {
      handleUnauthorized();
      return;
    }

    if (!form.vehicleNo.trim()) {
      setError(
        "Vehicle number is required.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/vehicle-management`,
          {
            method: "POST",

            headers:
              getAuthHeaders(
                true,
              ),

            body: JSON.stringify(
              {
                vehicleNo:
                  form.vehicleNo
                    .trim()
                    .toUpperCase(),

                name:
                  form.name.trim() ||
                  undefined,

                companyId:
                  user.companyId,

                imei:
                  form.imei.trim() ||
                  undefined,

                model:
                  form.model.trim() ||
                  undefined,

                simNumber:
                  form.simNumber.trim() ||
                  undefined,

                dealerId:
                  form.dealerId ||
                  null,

                customerId:
                  form.customerId ||
                  null,
              },
            ),
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
        throw new Error(
          "You do not have permission to create vehicles.",
        );
      }

      const result =
        await readJson<VehicleResponse>(
          response,
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Vehicle API returned ${response.status}`,
        );
      }

      setSuccess(
        result.message ||
          "Vehicle created successfully.",
      );

      closeForm();

      await loadVehicles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create vehicle",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateVehicle() {
    if (!editingVehicle) {
      return;
    }

    if (!form.vehicleNo.trim()) {
      setError(
        "Vehicle number is required.",
      );
      return;
    }

    if (!form.imei.trim()) {
      setError(
        "IMEI cannot be empty when editing a linked device.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/vehicle-management/${editingVehicle.id}`,
          {
            method: "PATCH",

            headers:
              getAuthHeaders(
                true,
              ),

            body: JSON.stringify(
              {
                vehicleNo:
                  form.vehicleNo
                    .trim()
                    .toUpperCase(),

                name:
                  form.name.trim() ||
                  null,

                imei:
                  form.imei.trim(),

                model:
                  form.model.trim() ||
                  null,

                simNumber:
                  form.simNumber.trim() ||
                  null,
              },
            ),
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
        throw new Error(
          "You do not have permission to update vehicles.",
        );
      }

      const result =
        await readJson<VehicleResponse>(
          response,
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Vehicle API returned ${response.status}`,
        );
      }

      setSuccess(
        result.message ||
          "Vehicle updated successfully.",
      );

      closeForm();

      await loadVehicles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update vehicle",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleDevice(
    vehicle: Vehicle,
  ) {
    if (!vehicle.device) {
      setError(
        "This vehicle has no linked device.",
      );
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/vehicle-management/${vehicle.id}`,
          {
            method: "PATCH",

            headers:
              getAuthHeaders(
                true,
              ),

            body: JSON.stringify(
              {
                isActive:
                  !vehicle.device
                    .isActive,
              },
            ),
          },
        );

      const result =
        await readJson<VehicleResponse>(
          response,
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update device status",
        );
      }

      setSuccess(
        vehicle.device.isActive
          ? "Device deactivated successfully."
          : "Device activated successfully.",
      );

      await loadVehicles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update device",
      );
    }
  }

  async function deleteVehicle(
    vehicle: Vehicle,
  ) {
    const confirmed =
      window.confirm(
        `Delete ${vehicle.vehicleNo}?\n\nVehicle can only be deleted if it has no GPS history, alerts or geofences.`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(vehicle.id);
    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/vehicle-management/${vehicle.id}`,
          {
            method: "DELETE",

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

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Delete API returned ${response.status}`,
        );
      }

      setSuccess(
        result.message ||
          "Vehicle deleted successfully.",
      );

      await loadVehicles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete vehicle",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredVehicles =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return vehicles.filter(
        (vehicle) => {
          const matchesStatus =
            statusFilter ===
              "ALL" ||
            vehicle.status ===
              statusFilter;

          const searchText = [
            vehicle.vehicleNo,
            vehicle.name ?? "",
            vehicle.device?.imei ??
              "",
            vehicle.device?.model ??
              "",
            vehicle.device
              ?.simNumber ?? "",
            vehicle.dealer?.name ??
              "",
            vehicle.customer?.name ??
              "",
          ]
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            searchText.includes(
              query,
            );

          return (
            matchesStatus &&
            matchesSearch
          );
        },
      );
    }, [
      vehicles,
      search,
      statusFilter,
    ]);

  const counts =
    useMemo(
      () => ({
        total:
          vehicles.length,

        moving:
          vehicles.filter(
            (vehicle) =>
              vehicle.status ===
              "MOVING",
          ).length,

        idle:
          vehicles.filter(
            (vehicle) =>
              vehicle.status ===
              "IDLE",
          ).length,

        offline:
          vehicles.filter(
            (vehicle) =>
              vehicle.status ===
              "OFFLINE",
          ).length,
      }),
      [vehicles],
    );

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              FLEET MANAGEMENT
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Vehicles
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Monitor vehicles,
              devices and fleet
              ownership
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
              disabled={loading}
              onClick={() =>
                void loadVehicles()
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm transition hover:bg-white/[0.08]"
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
                onClick={openCreate}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />

                Add Vehicle
              </button>
            )}
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

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Vehicles"
            value={counts.total}
            icon={<Car />}
          />

          <StatCard
            title="Moving"
            value={counts.moving}
            icon={<Gauge />}
          />

          <StatCard
            title="Idle"
            value={counts.idle}
            icon={<Clock3 />}
          />

          <StatCard
            title="Offline"
            value={counts.offline}
            icon={<ShieldCheck />}
          />
        </div>

        {canManage &&
          showCreateForm && (
            <section className="mb-6 rounded-2xl border border-sky-500/20 bg-[#0a1426] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    {editingVehicle
                      ? "Edit Vehicle & Device"
                      : "Add Vehicle & Device"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {editingVehicle
                      ? "Update vehicle and linked GPS device details"
                      : "Create a vehicle with an optional GPS device"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Vehicle Number *">
                  <input
                    value={
                      form.vehicleNo
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        "vehicleNo",
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                    placeholder="PB70AB1234"
                  />
                </Field>

                <Field label="Vehicle Name">
                  <input
                    value={
                      form.name
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        "name",
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                    placeholder="Vehicle name"
                  />
                </Field>

                <Field label="GPS IMEI">
                  <input
                    value={
                      form.imei
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        "imei",
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                    placeholder="15 digit IMEI"
                  />
                </Field>

                <Field label="Device Model">
                  <input
                    value={
                      form.model
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        "model",
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                    placeholder="SMART S-2435"
                  />
                </Field>

                <Field label="SIM Number">
                  <input
                    value={
                      form.simNumber
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        "simNumber",
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                    placeholder="SIM number"
                  />
                </Field>

                {!editingVehicle && (
                  <>
                    <Field label="Dealer">
                      <select
                        value={
                          form.dealerId
                        }
                        onChange={(
                          event,
                        ) =>
                          handleDealerChange(
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
                            (
                              dealer,
                            ) =>
                              dealer.isActive,
                          )
                          .map(
                            (
                              dealer,
                            ) => (
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
                    </Field>

                    <Field label="Customer">
                      <select
                        value={
                          form.customerId
                        }
                        onChange={(
                          event,
                        ) =>
                          updateForm(
                            "customerId",
                            event.target
                              .value,
                          )
                        }
                        className="input-field"
                      >
                        <option value="">
                          No Customer
                        </option>

                        {filteredCustomers.map(
                          (
                            customer,
                          ) => (
                            <option
                              key={
                                customer.id
                              }
                              value={
                                customer.id
                              }
                            >
                              {
                                customer.name
                              }{" "}
                              —{" "}
                              {
                                customer.code
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </Field>
                  </>
                )}
              </div>

              {editingVehicle && (
                <p className="mt-4 text-xs text-slate-400">
                  Dealer/customer ownership is managed from the{" "}
                  <Link
                    href="/dashboard/assignments"
                    className="font-semibold text-sky-400 hover:text-sky-300"
                  >
                    Assignments
                  </Link>{" "}
                  module.
                </p>
              )}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    editingVehicle
                      ? void updateVehicle()
                      : void createVehicle()
                  }
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold hover:bg-sky-400 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {editingVehicle
                    ? "Save Changes"
                    : "Create Vehicle"}
                </button>
              </div>
            </section>
          )}

        <div className="mb-5 rounded-2xl border border-white/10 bg-[#0a1426] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#07101f] px-4 py-3">
              <Search className="h-5 w-5 text-slate-500" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search vehicle, IMEI, model, SIM, dealer, customer..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter,
                  )
                }
                className="rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm outline-none"
              >
                <option value="ALL">
                  All Status
                </option>

                <option value="MOVING">
                  Moving
                </option>

                <option value="IDLE">
                  Idle
                </option>

                <option value="OFFLINE">
                  Offline
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Vehicle List
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Showing{" "}
                {
                  filteredVehicles.length
                }{" "}
                of {vehicles.length}{" "}
                vehicles
              </p>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              LIVE DATA
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1550px] text-left text-sm">
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
                    Dealer
                  </th>
                  <th className="p-4">
                    Customer
                  </th>
                  <th className="p-4">
                    Status
                  </th>
                  <th className="p-4">
                    Speed
                  </th>
                  <th className="p-4">
                    Ignition
                  </th>
                  <th className="p-4">
                    Battery
                  </th>
                  <th className="p-4">
                    Device State
                  </th>
                  <th className="p-4">
                    Last Update
                  </th>
                  <th className="p-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map(
                  (vehicle) => (
                    <tr
                      key={
                        vehicle.id
                      }
                      className="border-t border-white/10 transition hover:bg-white/[0.025]"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-sky-500/10 p-2 text-sky-400">
                            <Car className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold">
                              {
                                vehicle.vehicleNo
                              }
                            </p>

                            <p className="text-xs text-slate-500">
                              {vehicle.name ||
                                "NAVII GPS Vehicle"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-300">
                        {vehicle.device
                          ?.model ||
                          "—"}
                      </td>

                      <td className="p-4 font-mono text-xs text-slate-300">
                        {vehicle.device
                          ?.imei ||
                          "—"}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-sky-400" />

                          <span className="text-slate-300">
                            {vehicle
                              .dealer
                              ?.name ||
                              "Unassigned"}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-sky-400" />

                          <span className="text-slate-300">
                            {vehicle
                              .customer
                              ?.name ||
                              "Unassigned"}
                          </span>
                        </div>
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
                        ).toFixed(1)}{" "}
                        km/h
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

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-sky-400" />

                          {vehicle.battery !==
                          null
                            ? `${vehicle.battery.toFixed(
                                2,
                              )} V`
                            : "—"}
                        </div>
                      </td>

                      <td className="p-4">
                        {vehicle.device ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              vehicle.device
                                .isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {vehicle.device
                              .isActive
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            NO DEVICE
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-xs text-slate-400">
                        {vehicle.lastUpdate
                          ? new Date(
                              vehicle.lastUpdate,
                            ).toLocaleString()
                          : "—"}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href="/live-tracking"
                            title="Live Tracking"
                            className="action-button text-sky-400"
                          >
                            <MapPin className="h-4 w-4" />
                          </Link>

                          <Link
                            href="/history"
                            title="History"
                            className="action-button text-slate-300"
                          >
                            <History className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/dashboard/vehicles/${vehicle.id}`}
                            title="Details"
                            className="action-button text-slate-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          {canManage && (
                            <>
                              <button
                                type="button"
                                title="Edit Vehicle"
                                onClick={() =>
                                  openEdit(
                                    vehicle,
                                  )
                                }
                                className="action-button text-amber-400"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              {vehicle.device && (
                                <button
                                  type="button"
                                  title={
                                    vehicle
                                      .device
                                      .isActive
                                      ? "Deactivate Device"
                                      : "Activate Device"
                                  }
                                  onClick={() =>
                                    void toggleDevice(
                                      vehicle,
                                    )
                                  }
                                  className={`action-button ${
                                    vehicle
                                      .device
                                      .isActive
                                      ? "text-orange-400"
                                      : "text-emerald-400"
                                  }`}
                                >
                                  <Power className="h-4 w-4" />
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={
                                  deletingId ===
                                  vehicle.id
                                }
                                title="Delete Vehicle"
                                onClick={() =>
                                  void deleteVehicle(
                                    vehicle,
                                  )
                                }
                                className="action-button text-red-400 disabled:opacity-40"
                              >
                                {deletingId ===
                                vehicle.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ),
                )}

                {!loading &&
                  filteredVehicles.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={12}
                        className="p-10 text-center text-slate-400"
                      >
                        No matching
                        vehicles found.
                      </td>
                    </tr>
                  )}

                {loading &&
                  vehicles.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={12}
                        className="p-10 text-center text-slate-400"
                      >
                        Loading
                        vehicles...
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
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

          .input-field:focus {
            border-color: rgba(
              14,
              165,
              233,
              0.6
            );
          }

          .action-button {
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
              0.04
            );
            padding: 0.5rem;
            transition: 0.2s;
          }

          .action-button:hover {
            background: rgba(
              255,
              255,
              255,
              0.09
            );
          }
        `}</style>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
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
      <VehiclesPageContent />
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
  value: number;
  icon: React.ReactNode;
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

function StatusBadge({
  status,
}: {
  status: VehicleStatus;
}) {
  const styles: Record<
    VehicleStatus,
    string
  > = {
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