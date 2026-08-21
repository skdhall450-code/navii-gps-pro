"use client";

import dynamic from "next/dynamic";

import {
  CheckCircle2,
  Circle as CircleIcon,
  Edit3,
  Loader2,
  MapPinned,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import RoleRouteGuard from "@/components/auth/RoleRouteGuard";

const GeofenceMap = dynamic(
  () =>
    import(
      "@/components/geofences/GeofenceMap"
    ),
  {
    ssr: false,
  },
);

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
  latitude: number | null;
  longitude: number | null;
  lastUpdate: string | null;
  device: Device | null;
};

type ApiGeofence = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle | null;
};

type MapGeofence = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  active: boolean;
  vehicleNo: string;
};

type GeofencesResponse = {
  success: boolean;
  count: number;
  data: ApiGeofence[];
  message?: string;
};

type GeofenceResponse = {
  success: boolean;
  message?: string;
  data?: ApiGeofence;
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

function getStoredUser(): AuthUser | null {
  if (
    typeof window ===
    "undefined"
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

function GeofencesPageContent() {
  const [
    geofences,
    setGeofences,
  ] =
    useState<
      ApiGeofence[]
    >([]);

  const [
    vehicles,
    setVehicles,
  ] =
    useState<Vehicle[]>(
      [],
    );

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
    deletingId,
    setDeletingId,
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
    selectedGeofenceId,
    setSelectedGeofenceId,
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
    successMessage,
    setSuccessMessage,
  ] =
    useState<
      string | null
    >(null);

  const [
    lastRefresh,
    setLastRefresh,
  ] =
    useState<
      Date | null
    >(null);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    name,
    setName,
  ] =
    useState(
      "Office Geofence",
    );

  const [
    selectedVehicleId,
    setSelectedVehicleId,
  ] =
    useState("");

  const [
    latitude,
    setLatitude,
  ] =
    useState(
      30.6043,
    );

  const [
    longitude,
    setLongitude,
  ] =
    useState(
      76.8631,
    );

  const [
    radius,
    setRadius,
  ] =
    useState(100);

  const [
    active,
    setActive,
  ] =
    useState(true);

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

      if (
        !token ||
        !user
      ) {
        handleUnauthorized();
        return;
      }

      setCurrentUser(user);

      try {
        setError(null);

        const [
          geofenceResponse,
          vehicleResponse,
        ] =
          await Promise.all([
            fetch(
              `${API_BASE}/api/gps/geofences`,
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
              `${API_BASE}/api/gps/vehicles`,
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
          geofenceResponse.status ===
            401 ||
          vehicleResponse.status ===
            401
        ) {
          handleUnauthorized();
          return;
        }

        const geofenceJson =
          await readJson<GeofencesResponse>(
            geofenceResponse,
          );

        const vehicleJson =
          await readJson<VehiclesResponse>(
            vehicleResponse,
          );

        if (
          !geofenceResponse.ok
        ) {
          throw new Error(
            geofenceJson.message ||
              `Geofence API returned ${geofenceResponse.status}`,
          );
        }

        if (
          !vehicleResponse.ok
        ) {
          throw new Error(
            vehicleJson.message ||
              `Vehicle API returned ${vehicleResponse.status}`,
          );
        }

        const geofenceList =
          Array.isArray(
            geofenceJson.data,
          )
            ? geofenceJson.data
            : [];

        const vehicleList =
          Array.isArray(
            vehicleJson.data,
          )
            ? vehicleJson.data
            : [];

        setGeofences(
          geofenceList,
        );

        setVehicles(
          vehicleList,
        );

        setSelectedVehicleId(
          (current) => {
            if (
              current &&
              vehicleList.some(
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
              vehicleList[0]
                ?.id ?? ""
            );
          },
        );

        setLastRefresh(
          new Date(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load geofences",
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
    void loadData();
  }, [loadData]);

  const canManage =
    currentUser?.role ===
      "SUPER_ADMIN" ||
    currentUser?.role ===
      "ADMIN" ||
    currentUser?.role ===
      "DEALER";

  const isCustomer =
    currentUser?.role ===
    "CUSTOMER";

  const selectedVehicle =
    useMemo(
      () =>
        vehicles.find(
          (vehicle) =>
            vehicle.id ===
            selectedVehicleId,
        ) ?? null,
      [
        vehicles,
        selectedVehicleId,
      ],
    );

  useEffect(() => {
    if (
      editingId ||
      !selectedVehicle
    ) {
      return;
    }

    if (
      typeof
        selectedVehicle.latitude ===
        "number" &&
      typeof
        selectedVehicle.longitude ===
        "number"
    ) {
      setLatitude(
        selectedVehicle.latitude,
      );

      setLongitude(
        selectedVehicle.longitude,
      );
    }
  }, [
    selectedVehicle,
    editingId,
  ]);

  function resetForm() {
    setEditingId(null);
    setSelectedGeofenceId(
      null,
    );

    setName(
      "Office Geofence",
    );

    setRadius(100);
    setActive(true);

    const vehicle =
      vehicles.find(
        (item) =>
          item.id ===
          selectedVehicleId,
      );

    if (
      vehicle &&
      typeof
        vehicle.latitude ===
        "number" &&
      typeof
        vehicle.longitude ===
        "number"
    ) {
      setLatitude(
        vehicle.latitude,
      );

      setLongitude(
        vehicle.longitude,
      );
    }
  }

  function handleVehicleChange(
    vehicleId: string,
  ) {
    setSelectedVehicleId(
      vehicleId,
    );

    const vehicle =
      vehicles.find(
        (item) =>
          item.id ===
          vehicleId,
      );

    if (
      !editingId &&
      vehicle &&
      typeof
        vehicle.latitude ===
        "number" &&
      typeof
        vehicle.longitude ===
        "number"
    ) {
      setLatitude(
        vehicle.latitude,
      );

      setLongitude(
        vehicle.longitude,
      );
    }
  }

  function handleMapCenterChange(
    nextLatitude: number,
    nextLongitude: number,
  ) {
    if (!canManage) {
      return;
    }

    setLatitude(
      nextLatitude,
    );

    setLongitude(
      nextLongitude,
    );
  }

  function editGeofence(
    geofence: ApiGeofence,
  ) {
    setEditingId(
      geofence.id,
    );

    setSelectedGeofenceId(
      geofence.id,
    );

    setName(
      geofence.name,
    );

    setSelectedVehicleId(
      geofence.vehicleId,
    );

    setLatitude(
      geofence.latitude,
    );

    setLongitude(
      geofence.longitude,
    );

    setRadius(
      geofence.radius,
    );

    setActive(
      geofence.isActive,
    );

    setError(null);
    setSuccessMessage(
      null,
    );

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }

  async function saveGeofence() {
    if (!canManage) {
      setError(
        "You do not have permission to manage geofences.",
      );
      return;
    }

    if (!name.trim()) {
      setError(
        "Geofence name is required.",
      );
      return;
    }

    if (
      !selectedVehicleId
    ) {
      setError(
        "Vehicle is required.",
      );
      return;
    }

    if (
      !Number.isFinite(
        latitude,
      ) ||
      latitude < -90 ||
      latitude > 90
    ) {
      setError(
        "Invalid latitude.",
      );
      return;
    }

    if (
      !Number.isFinite(
        longitude,
      ) ||
      longitude < -180 ||
      longitude > 180
    ) {
      setError(
        "Invalid longitude.",
      );
      return;
    }

    if (
      !Number.isFinite(
        radius,
      ) ||
      radius <= 0
    ) {
      setError(
        "Radius must be greater than 0.",
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(
      null,
    );

    try {
      const url =
        editingId
          ? `${API_BASE}/api/gps/geofences/${editingId}`
          : `${API_BASE}/api/gps/geofences`;

      const method =
        editingId
          ? "PATCH"
          : "POST";

      const response =
        await fetch(
          url,
          {
            method,

            headers:
              getAuthHeaders(
                true,
              ),

            body:
              JSON.stringify({
                name:
                  name.trim(),

                latitude,

                longitude,

                radius,

                vehicleId:
                  selectedVehicleId,

                isActive:
                  active,
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
          "You do not have permission to save this geofence.",
        );
      }

      const result =
        await readJson<GeofenceResponse>(
          response,
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            `Geofence API returned ${response.status}`,
        );
      }

      if (!result.data) {
        throw new Error(
          "Geofence API returned no geofence data.",
        );
      }

      if (editingId) {
        setGeofences(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                editingId
                  ? result.data as ApiGeofence
                  : item,
            ),
        );

        setSuccessMessage(
          "Geofence updated successfully.",
        );
      } else {
        setGeofences(
          (current) => [
            result.data as ApiGeofence,
            ...current,
          ],
        );

        setSuccessMessage(
          "Geofence created successfully.",
        );
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save geofence",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleGeofence(
    geofence: ApiGeofence,
  ) {
    if (!canManage) {
      return;
    }

    setError(null);
    setSuccessMessage(
      null,
    );

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/geofences/${geofence.id}`,
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
                  !geofence.isActive,
              }),
          },
        );

      const result =
        await readJson<GeofenceResponse>(
          response,
        );

      if (
        !response.ok ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            "Unable to update geofence",
        );
      }

      setGeofences(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              geofence.id
                ? result.data as ApiGeofence
                : item,
          ),
      );

      setSuccessMessage(
        result.data.isActive
          ? "Geofence enabled."
          : "Geofence disabled.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update geofence",
      );
    }
  }

  async function deleteGeofence(
    geofence: ApiGeofence,
  ) {
    if (!canManage) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${geofence.name}" permanently?`,
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      geofence.id,
    );

    setError(null);
    setSuccessMessage(
      null,
    );

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/geofences/${geofence.id}`,
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

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Delete API returned ${response.status}`,
        );
      }

      setGeofences(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              geofence.id,
          ),
      );

      if (
        editingId ===
        geofence.id
      ) {
        resetForm();
      }

      setSuccessMessage(
        result.message ||
          "Geofence deleted successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete geofence",
      );
    } finally {
      setDeletingId(
        null,
      );
    }
  }

  const filteredGeofences =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return geofences;
      }

      return geofences.filter(
        (item) => {
          const searchable = [
            item.name,
            item.vehicle
              ?.vehicleNo ?? "",
            item.vehicle
              ?.name ?? "",
            item.vehicle
              ?.device?.imei ??
              "",
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      geofences,
      search,
    ]);

  const mapGeofences =
    useMemo<
      MapGeofence[]
    >(
      () =>
        geofences.map(
          (item) => ({
            id:
              item.id,

            name:
              item.name,

            latitude:
              item.latitude,

            longitude:
              item.longitude,

            radius:
              item.radius,

            active:
              item.isActive,

            vehicleNo:
              item.vehicle
                ?.vehicleNo ??
              "Unassigned",
          }),
        ),
      [geofences],
    );

  const activeCount =
    geofences.filter(
      (item) =>
        item.isActive,
    ).length;

  const inactiveCount =
    geofences.length -
    activeCount;

  const assignedVehicles =
    new Set(
      geofences.map(
        (item) =>
          item.vehicleId,
      ),
    ).size;

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1750px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              LOCATION CONTROL
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Geofences
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {isCustomer
                ? "View GPS boundaries assigned to your vehicles"
                : "Create, edit and monitor GPS boundary zones"}
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

        {successMessage && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Geofences"
            value={
              geofences.length
            }
            icon={
              <MapPinned />
            }
          />

          <StatCard
            title="Active"
            value={
              activeCount
            }
            icon={
              <ShieldCheck />
            }
          />

          <StatCard
            title="Inactive"
            value={
              inactiveCount
            }
            icon={
              <CircleIcon />
            }
          />

          <StatCard
            title="Assigned Vehicles"
            value={
              assignedVehicles
            }
            icon={
              <MapPinned />
            }
          />
        </div>

        <div
          className={`grid gap-5 ${
            canManage
              ? "xl:grid-cols-[430px_1fr]"
              : "grid-cols-1"
          }`}
        >
          {canManage && (
            <section className="rounded-2xl border border-white/10 bg-[#0a1426] p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                    {editingId ? (
                      <Edit3 className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      {editingId
                        ? "Edit Geofence"
                        : "Create Geofence"}
                    </h2>

                    <p className="text-xs text-slate-400">
                      Click map to set
                      geofence center
                    </p>
                  </div>
                </div>

                {editingId && (
                  <button
                    type="button"
                    title="Cancel Edit"
                    onClick={
                      resetForm
                    }
                    className="rounded-lg border border-white/10 p-2 text-slate-400 hover:bg-white/[0.06]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <Field label="Geofence Name">
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
                  />
                </Field>

                <Field label="Vehicle">
                  <select
                    value={
                      selectedVehicleId
                    }
                    onChange={(
                      event,
                    ) =>
                      handleVehicleChange(
                        event.target
                          .value,
                      )
                    }
                    className="input-field"
                  >
                    {vehicles.length ===
                      0 && (
                      <option value="">
                        No vehicles
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

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Latitude">
                    <input
                      type="number"
                      step="0.000001"
                      value={
                        latitude
                      }
                      onChange={(
                        event,
                      ) =>
                        setLatitude(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="input-field"
                    />
                  </Field>

                  <Field label="Longitude">
                    <input
                      type="number"
                      step="0.000001"
                      value={
                        longitude
                      }
                      onChange={(
                        event,
                      ) =>
                        setLongitude(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="input-field"
                    />
                  </Field>
                </div>

                <Field label="Radius (meters)">
                  <input
                    type="number"
                    min={1}
                    value={
                      radius
                    }
                    onChange={(
                      event,
                    ) =>
                      setRadius(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                    className="input-field"
                  />

                  <input
                    type="range"
                    min={20}
                    max={5000}
                    step={10}
                    value={Math.min(
                      Math.max(
                        radius,
                        20,
                      ),
                      5000,
                    )}
                    onChange={(
                      event,
                    ) =>
                      setRadius(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                    className="mt-3 w-full"
                  />
                </Field>

                <label className="flex items-center justify-between rounded-xl border border-white/10 bg-[#07101f] px-4 py-3">
                  <span className="text-sm text-slate-300">
                    Active Geofence
                  </span>

                  <input
                    type="checkbox"
                    checked={
                      active
                    }
                    onChange={(
                      event,
                    ) =>
                      setActive(
                        event.target
                          .checked,
                      )
                    }
                    className="h-4 w-4"
                  />
                </label>

                {selectedVehicle && (
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.05] p-4">
                    <p className="text-xs text-slate-400">
                      Selected Vehicle
                    </p>

                    <p className="mt-1 font-semibold">
                      {
                        selectedVehicle.vehicleNo
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      IMEI:{" "}
                      {selectedVehicle
                        .device
                        ?.imei ??
                        "—"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      GPS:{" "}
                      {selectedVehicle.latitude !=
                        null &&
                      selectedVehicle.longitude !=
                        null
                        ? `${selectedVehicle.latitude.toFixed(
                            6,
                          )}, ${selectedVehicle.longitude.toFixed(
                            6,
                          )}`
                        : "No live position"}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    saving ||
                    !selectedVehicleId
                  }
                  onClick={() =>
                    void saveGeofence()
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
                      <Edit3 className="h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Geofence
                    </>
                  )}
                </button>
              </div>
            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="font-semibold">
                Geofence Map
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {canManage
                  ? "Click anywhere on map to move the geofence center"
                  : "Saved GPS boundaries and vehicle positions"}
              </p>
            </div>

            <div className="h-[650px]">
              <GeofenceMap
                geofences={
                  mapGeofences
                }
                latitude={
                  latitude
                }
                longitude={
                  longitude
                }
                radius={
                  radius
                }
                vehicleNo={
                  selectedVehicle
                    ?.vehicleNo ??
                  null
                }
                vehicleLatitude={
                  selectedVehicle
                    ?.latitude ??
                  null
                }
                vehicleLongitude={
                  selectedVehicle
                    ?.longitude ??
                  null
                }
                selectedGeofenceId={
                  selectedGeofenceId
                }
                editable={
                  Boolean(
                    canManage,
                  )
                }
                onCenterChange={
                  handleMapCenterChange
                }
              />
            </div>
          </section>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold">
                Saved Geofences
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Permanent geofence records and alert zones
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
                placeholder="Search geofence, vehicle, IMEI..."
                className="w-64 bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {loading &&
          geofences.length ===
            0 ? (
            <div className="flex min-h-[220px] items-center justify-center text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading geofences...
            </div>
          ) : filteredGeofences.length >
            0 ? (
            <div className="divide-y divide-white/10">
              {filteredGeofences.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    onClick={() => {
                      setSelectedGeofenceId(
                        item.id,
                      );

                      setLatitude(
                        item.latitude,
                      );

                      setLongitude(
                        item.longitude,
                      );

                      setRadius(
                        item.radius,
                      );
                    }}
                    className={`flex cursor-pointer flex-col justify-between gap-4 p-5 transition lg:flex-row lg:items-center ${
                      selectedGeofenceId ===
                      item.id
                        ? "bg-sky-500/[0.05]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                        <MapPinned className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {
                              item.name
                            }
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              item.isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-500/10 text-slate-400"
                            }`}
                          >
                            {item.isActive
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-400">
                          {item.vehicle
                            ?.vehicleNo ??
                            "Unassigned"}{" "}
                          · Radius{" "}
                          {
                            item.radius
                          }{" "}
                          m
                        </p>

                        <p className="mt-1 font-mono text-xs text-slate-500">
                          {
                            item.latitude
                          }
                          ,{" "}
                          {
                            item.longitude
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          IMEI:{" "}
                          {item.vehicle
                            ?.device
                            ?.imei ??
                            "—"}
                        </p>
                      </div>
                    </div>

                    {canManage && (
                      <div
                        className="flex gap-2"
                        onClick={(
                          event,
                        ) =>
                          event.stopPropagation()
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            editGeofence(
                              item,
                            )
                          }
                          className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400 transition hover:bg-amber-500/20"
                          title="Edit Geofence"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void toggleGeofence(
                              item,
                            )
                          }
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs transition hover:bg-white/[0.08]"
                        >
                          {item.isActive
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            item.id
                          }
                          onClick={() =>
                            void deleteGeofence(
                              item,
                            )
                          }
                          className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
                        >
                          {deletingId ===
                          item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
              <MapPinned className="h-10 w-10 text-slate-600" />

              <h3 className="mt-4 font-semibold">
                No Geofences Found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                No GPS boundaries
                are available.
              </p>
            </div>
          )}
        </section>

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
        `}</style>
      </div>
    </div>
  );
}

export default function GeofencesPage() {
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
      <GeofencesPageContent />
    </RoleRouteGuard>
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