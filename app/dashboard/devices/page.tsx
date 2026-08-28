"use client";

import Link from "next/link";

import {
  Activity,
  Car,
  CheckCircle2,
  Edit3,
  Eye,
  Loader2,
  Plus,
  Power,
  RadioTower,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Smartphone,
  Trash2,
  X,
  XCircle,
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

type Dealer = {
  id: string;
  name: string;
  code: string;
};

type Customer = {
  id: string;
  name: string;
  code: string;
};

type Vehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;
  status:
    | "MOVING"
    | "IDLE"
    | "OFFLINE";

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

  device?: {
    id: string;
    imei: string;
    model: string | null;
    simNumber: string | null;
    isActive: boolean;
  } | null;
};

type Device = {
  id: string;
  imei: string;
  model: string | null;
  simNumber: string | null;
  isActive: boolean;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string | null;

  vehicle: Vehicle;
};

type DevicesResponse = {
  success: boolean;
  count: number;
  data: Device[];
  message?: string;
};

type DeviceResponse = {
  success: boolean;
  message?: string;
  data?: Device;
};

type VehiclesResponse = {
  success: boolean;
  data: Vehicle[];
  message?: string;
};

type DeviceForm = {
  imei: string;
  model: string;
  simNumber: string;
  vehicleId: string;
};

const EMPTY_FORM: DeviceForm = {
  imei: "",
  model: "",
  simNumber: "",
  vehicleId: "",
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

function DevicesContent() {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

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

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
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
  ] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const [
    lastRefresh,
    setLastRefresh,
  ] = useState<Date | null>(
    null,
  );

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingDevice,
    setEditingDevice,
  ] = useState<Device | null>(
    null,
  );

  const [form, setForm] =
    useState<DeviceForm>(
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

  const loadData =
    useCallback(async () => {
      const token =
        getAccessToken();

      const user =
        getStoredUser();

      if (!token || !user) {
        handleUnauthorized();
        return;
      }

      setCurrentUser(user);

      try {
        setError(null);

        const [
          devicesResponse,
          vehiclesResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE}/api/gps/device-management`,
            {
              method: "GET",
              headers:
                getAuthHeaders(),
              cache: "no-store",
            },
          ),

          fetch(
            `${API_BASE}/api/gps/vehicles`,
            {
              method: "GET",
              headers:
                getAuthHeaders(),
              cache: "no-store",
            },
          ),
        ]);

        if (
          devicesResponse.status ===
            401 ||
          vehiclesResponse.status ===
            401
        ) {
          handleUnauthorized();
          return;
        }

        if (
          devicesResponse.status ===
          403
        ) {
          throw new Error(
            "You do not have permission to access GPS devices.",
          );
        }

        const devicesJson =
          await readJson<DevicesResponse>(
            devicesResponse,
          );

        const vehiclesJson =
          await readJson<VehiclesResponse>(
            vehiclesResponse,
          );

        if (!devicesResponse.ok) {
          throw new Error(
            devicesJson.message ||
              `Device API returned ${devicesResponse.status}`,
          );
        }

        if (!vehiclesResponse.ok) {
          throw new Error(
            vehiclesJson.message ||
              `Vehicle API returned ${vehiclesResponse.status}`,
          );
        }

        setDevices(
          Array.isArray(
            devicesJson.data,
          )
            ? devicesJson.data
            : [],
        );

        setVehicles(
          Array.isArray(
            vehiclesJson.data,
          )
            ? vehiclesJson.data
            : [],
        );

        setLastRefresh(
          new Date(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load GPS devices",
        );
      } finally {
        setLoading(false);
      }
    }, [handleUnauthorized]);

  useEffect(() => {
    void loadData();

    const timer =
      window.setInterval(() => {
        void loadData();
      }, 5000);

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [loadData]);

  const canManage =
    currentUser?.role ===
      "SUPER_ADMIN" ||
    currentUser?.role ===
      "ADMIN";

  const availableVehicles =
    useMemo(() => {
      return vehicles.filter(
        (vehicle) => {
          if (
            editingDevice &&
            vehicle.id ===
              editingDevice.vehicleId
          ) {
            return true;
          }

          return !vehicle.device;
        },
      );
    }, [
      vehicles,
      editingDevice,
    ]);

  function updateForm(
    key: keyof DeviceForm,
    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  }

  function openCreate() {
    setEditingDevice(null);
    setForm(EMPTY_FORM);
    setError(null);
    setSuccess(null);
    setShowForm(true);
  }

  function openEdit(
    device: Device,
  ) {
    setEditingDevice(device);

    setForm({
      imei:
        device.imei,

      model:
        device.model ?? "",

      simNumber:
        device.simNumber ?? "",

      vehicleId:
        device.vehicleId,
    });

    setError(null);
    setSuccess(null);
    setShowForm(true);
  }

  function closeForm() {
    setEditingDevice(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  async function createDevice() {
    if (!form.imei.trim()) {
      setError(
        "IMEI is required.",
      );
      return;
    }

    if (!form.vehicleId) {
      setError(
        "Please select a vehicle.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/device-management`,
          {
            method: "POST",

            headers:
              getAuthHeaders(
                true,
              ),

            body: JSON.stringify(
              {
                imei:
                  form.imei.trim(),

                model:
                  form.model.trim() ||
                  null,

                simNumber:
                  form.simNumber.trim() ||
                  null,

                vehicleId:
                  form.vehicleId,

                isActive: true,
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
          "You do not have permission to create GPS devices.",
        );
      }

      const result =
        await readJson<DeviceResponse>(
          response,
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Device API returned ${response.status}`,
        );
      }

      setSuccess(
        result.message ||
          "GPS device created successfully.",
      );

      closeForm();

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create GPS device",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateDevice() {
    if (!editingDevice) {
      return;
    }

    if (!form.imei.trim()) {
      setError(
        "IMEI cannot be empty.",
      );
      return;
    }

    if (!form.vehicleId) {
      setError(
        "Vehicle is required.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/device-management/${editingDevice.id}`,
          {
            method: "PATCH",

            headers:
              getAuthHeaders(
                true,
              ),

            body: JSON.stringify(
              {
                imei:
                  form.imei.trim(),

                model:
                  form.model.trim() ||
                  null,

                simNumber:
                  form.simNumber.trim() ||
                  null,

                vehicleId:
                  form.vehicleId,
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
          "You do not have permission to update GPS devices.",
        );
      }

      const result =
        await readJson<DeviceResponse>(
          response,
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Device API returned ${response.status}`,
        );
      }

      setSuccess(
        result.message ||
          "GPS device updated successfully.",
      );

      closeForm();

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update GPS device",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleDevice(
    device: Device,
  ) {
    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/device-management/${device.id}`,
          {
            method: "PATCH",

            headers:
              getAuthHeaders(
                true,
              ),

            body: JSON.stringify(
              {
                isActive:
                  !device.isActive,
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
          "You do not have permission to update GPS devices.",
        );
      }

      const result =
        await readJson<DeviceResponse>(
          response,
        );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update device status",
        );
      }

      setSuccess(
        device.isActive
          ? "GPS device deactivated successfully."
          : "GPS device activated successfully.",
      );

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update device status",
      );
    }
  }

  async function deleteDevice(
    device: Device,
  ) {
    const confirmed =
      window.confirm(
        `Delete GPS device ${device.imei}?\n\nThe linked vehicle will NOT be deleted.`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      device.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/device-management/${device.id}`,
          {
            method: "DELETE",

            headers:
              getAuthHeaders(),
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
          "You do not have permission to delete GPS devices.",
        );
      }

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
          "GPS device deleted successfully.",
      );

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete GPS device",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredDevices =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return devices.filter(
        (device) => {
          const matchesStatus =
            statusFilter ===
              "ALL" ||
            (statusFilter ===
              "ACTIVE" &&
              device.isActive) ||
            (statusFilter ===
              "INACTIVE" &&
              !device.isActive);

          const searchable = [
            device.imei,
            device.model ?? "",
            device.simNumber ??
              "",
            device.vehicle
              .vehicleNo,
            device.vehicle.name ??
              "",
            device.vehicle
              .dealer?.name ??
              "",
            device.vehicle
              .customer?.name ??
              "",
          ]
            .join(" ")
            .toLowerCase();

          return (
            matchesStatus &&
            (!query ||
              searchable.includes(
                query,
              ))
          );
        },
      );
    }, [
      devices,
      search,
      statusFilter,
    ]);

  const stats =
    useMemo(() => {
      const active =
        devices.filter(
          (device) =>
            device.isActive,
        ).length;

      const inactive =
        devices.length -
        active;

      const communicating =
        devices.filter(
          (device) =>
            isDeviceCommunicating(
              device,
            ),
        ).length;

      return {
        total:
          devices.length,
        active,
        inactive,
        communicating,
      };
    }, [devices]);

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              DEVICE MANAGEMENT
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              GPS Devices
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage GPS trackers,
              IMEI numbers, SIM cards
              and linked vehicles
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

            {canManage && (
              <button
                type="button"
                onClick={
                  openCreate
                }
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold transition hover:bg-sky-400"
              >
                <Plus className="h-4 w-4" />

                Add Device
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
            title="Total Devices"
            value={
              stats.total
            }
            icon={
              <Smartphone />
            }
          />

          <StatCard
            title="Active"
            value={
              stats.active
            }
            icon={
              <CheckCircle2 />
            }
          />

          <StatCard
            title="Communicating"
            value={
              stats.communicating
            }
            icon={
              <RadioTower />
            }
          />

          <StatCard
            title="Inactive"
            value={
              stats.inactive
            }
            icon={
              <XCircle />
            }
          />
        </div>

        {canManage &&
          showForm && (
            <section className="mb-6 rounded-2xl border border-sky-500/20 bg-[#0a1426] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    {editingDevice
                      ? "Edit GPS Device"
                      : "Add GPS Device"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {editingDevice
                      ? "Update IMEI, model, SIM or linked vehicle"
                      : "Link a new GPS device to an available vehicle"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="IMEI *">
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

                <Field label="Linked Vehicle *">
                  <select
                    value={
                      form.vehicleId
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        "vehicleId",
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                  >
                    <option value="">
                      Select vehicle
                    </option>

                    {availableVehicles.map(
                      (
                        vehicle,
                      ) => (
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
                          {vehicle.name
                            ? ` — ${vehicle.name}`
                            : ""}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
              </div>

              {!editingDevice &&
                availableVehicles.length ===
                  0 && (
                  <p className="mt-4 text-xs text-amber-400">
                    No vehicle without
                    a GPS device is
                    currently available.
                    Create a vehicle
                    first or remove an
                    existing device link.
                  </p>
                )}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    editingDevice
                      ? void updateDevice()
                      : void createDevice()
                  }
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {editingDevice
                    ? "Save Changes"
                    : "Create Device"}
                </button>
              </div>
            </section>
          )}

        <div className="mb-5 rounded-2xl border border-white/10 bg-[#0a1426] p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
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
                placeholder="Search IMEI, model, SIM, vehicle, dealer, customer..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
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
              className="rounded-xl border border-white/10 bg-[#07101f] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="ALL">
                All Devices
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

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Device List
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Showing{" "}
                {
                  filteredDevices.length
                }{" "}
                of {devices.length}{" "}
                devices
              </p>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              LIVE DATA
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] text-left text-sm">
              <thead className="bg-white/[0.04] text-slate-400">
                <tr>
                  <th className="p-4">
                    Device
                  </th>

                  <th className="p-4">
                    IMEI
                  </th>

                  <th className="p-4">
                    Vehicle
                  </th>

                  <th className="p-4">
                    Dealer
                  </th>

                  <th className="p-4">
                    Customer
                  </th>

                  <th className="p-4">
                    SIM
                  </th>

                  <th className="p-4">
                    Device
                  </th>

                  <th className="p-4">
                    Vehicle Status
                  </th>

                  <th className="p-4">
                    Last Communication
                  </th>

                  <th className="p-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map(
                  (device) => (
                    <tr
                      key={
                        device.id
                      }
                      className="border-t border-white/10 transition hover:bg-white/[0.025]"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-sky-500/10 p-2 text-sky-400">
                            <ShieldCheck className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-semibold">
                              {device.model ??
                                "GPS Tracker"}
                            </p>

                            <p className="text-xs text-slate-500">
                              NAVII GPS
                              Device
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-xs text-slate-300">
                        {
                          device.imei
                        }
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-sky-400" />

                          <Link
                            href={`/dashboard/vehicles/${device.vehicle.id}`}
                            className="font-semibold transition hover:text-sky-400"
                          >
                            {
                              device
                                .vehicle
                                .vehicleNo
                            }
                          </Link>
                        </div>
                      </td>

                      <td className="p-4 text-slate-300">
                        {device.vehicle
                          .dealer?.name ??
                          "Unassigned"}
                      </td>

                      <td className="p-4 text-slate-300">
                        {device.vehicle
                          .customer
                          ?.name ??
                          "Unassigned"}
                      </td>

                      <td className="p-4 text-slate-300">
                        {device.simNumber ??
                          "—"}
                      </td>

                      <td className="p-4">
                        <DeviceStatus
                          active={
                            device.isActive
                          }
                        />
                      </td>

                      <td className="p-4">
                        <VehicleStatus
                          status={
                            device.vehicle
                              .status
                          }
                        />
                      </td>

                      <td className="p-4 text-xs text-slate-400">
                        {device.lastSeenAt
                          ? new Date(
                              device.lastSeenAt,
                            ).toLocaleString()
                          : device.vehicle
                                .lastUpdate
                            ? new Date(
                                device.vehicle
                                  .lastUpdate,
                              ).toLocaleString()
                            : "?"}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/vehicles/${device.vehicle.id}`}
                            title="View Vehicle"
                            className="action-button text-sky-400"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href="/live-tracking"
                            title="Live Tracking"
                            className="action-button text-slate-300"
                          >
                            <Activity className="h-4 w-4" />
                          </Link>

                          {canManage && (
                            <>
                              <button
                                type="button"
                                title="Edit Device"
                                onClick={() =>
                                  openEdit(
                                    device,
                                  )
                                }
                                className="action-button text-amber-400"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                title={
                                  device.isActive
                                    ? "Deactivate Device"
                                    : "Activate Device"
                                }
                                onClick={() =>
                                  void toggleDevice(
                                    device,
                                  )
                                }
                                className={`action-button ${
                                  device.isActive
                                    ? "text-orange-400"
                                    : "text-emerald-400"
                                }`}
                              >
                                <Power className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                disabled={
                                  deletingId ===
                                  device.id
                                }
                                title="Delete Device"
                                onClick={() =>
                                  void deleteDevice(
                                    device,
                                  )
                                }
                                className="action-button text-red-400 disabled:opacity-40"
                              >
                                {deletingId ===
                                device.id ? (
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
                  filteredDevices.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-10 text-center text-slate-400"
                      >
                        No matching GPS
                        devices found.
                      </td>
                    </tr>
                  )}

                {loading &&
                  devices.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-10 text-center text-slate-400"
                      >
                        Loading GPS
                        devices...
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

const DEVICE_COMMUNICATION_TIMEOUT_MS =
  10 * 60 * 1000;

function isDeviceCommunicating(
  device: Device,
): boolean {
  const value =
    device.lastSeenAt ??
    device.vehicle.lastUpdate;

  if (!value) {
    return false;
  }

  const timestamp =
    new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return false;
  }

  return (
    Date.now() - timestamp <=
    DEVICE_COMMUNICATION_TIMEOUT_MS
  );
}

export default function DevicesPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
      ]}
    >
      <DevicesContent />
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

function DeviceStatus({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active
            ? "bg-emerald-400"
            : "bg-red-400"
        }`}
      />

      {active
        ? "ACTIVE"
        : "INACTIVE"}
    </span>
  );
}

function VehicleStatus({
  status,
}: {
  status:
    | "MOVING"
    | "IDLE"
    | "OFFLINE";
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