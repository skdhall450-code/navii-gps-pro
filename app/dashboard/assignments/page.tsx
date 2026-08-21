"use client";

import {
  Car,
  CheckCircle2,
  CircleDot,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Store,
  Unlink,
  UserRound,
  Users,
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
};

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

type Vehicle = {
  id: string;
  vehicleNo: string;
  name: string | null;

  status:
    | "MOVING"
    | "IDLE"
    | "OFFLINE";

  dealerId: string | null;
  customerId: string | null;

  device?: Device | null;

  dealer?: Dealer | null;
  customer?: Customer | null;
};

type VehiclesResponse = {
  success: boolean;
  data: Vehicle[];
  message?: string;
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

type AssignmentResponse = {
  success: boolean;
  message?: string;
  data?: Vehicle;
};

type AssignmentFilter =
  | "ALL"
  | "ASSIGNED"
  | "UNASSIGNED";

type VehicleStatusFilter =
  | "ALL"
  | "MOVING"
  | "IDLE"
  | "OFFLINE";

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

function AssignmentsPageContent() {
  const [
    vehicles,
    setVehicles,
  ] =
    useState<Vehicle[]>([]);

  const [
    dealers,
    setDealers,
  ] =
    useState<Dealer[]>([]);

  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>([]);

  const [
    currentUser,
    setCurrentUser,
  ] =
    useState<
      AuthUser | null
    >(null);

  const [
    selectedDealer,
    setSelectedDealer,
  ] =
    useState<
      Record<string, string>
    >({});

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] =
    useState<
      Record<string, string>
    >({});

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    savingVehicleId,
    setSavingVehicleId,
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
    assignmentFilter,
    setAssignmentFilter,
  ] =
    useState<AssignmentFilter>(
      "ALL",
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<VehicleStatusFilter>(
      "ALL",
    );

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

  const syncSelectionState =
    useCallback(
      (
        vehicleList: Vehicle[],
      ) => {
        const dealerMap: Record<
          string,
          string
        > = {};

        const customerMap: Record<
          string,
          string
        > = {};

        vehicleList.forEach(
          (vehicle) => {
            dealerMap[
              vehicle.id
            ] =
              vehicle.dealerId ??
              "";

            customerMap[
              vehicle.id
            ] =
              vehicle.customerId ??
              "";
          },
        );

        setSelectedDealer(
          dealerMap,
        );

        setSelectedCustomer(
          customerMap,
        );
      },
      [],
    );

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

        const vehiclesResponse =
          await fetch(
            `${API_BASE}/api/gps/vehicles`,
            {
              method: "GET",

              headers:
                getAuthHeaders(),

              cache:
                "no-store",
            },
          );

        if (
          vehiclesResponse.status ===
          401
        ) {
          handleUnauthorized();
          return;
        }

        if (
          vehiclesResponse.status ===
          403
        ) {
          throw new Error(
            "You do not have permission to view vehicles.",
          );
        }

        const vehiclesJson =
          await readJson<VehiclesResponse>(
            vehiclesResponse,
          );

        if (
          !vehiclesResponse.ok
        ) {
          throw new Error(
            vehiclesJson.message ||
              `Vehicles API returned ${vehiclesResponse.status}`,
          );
        }

        const vehicleList =
          Array.isArray(
            vehiclesJson.data,
          )
            ? vehiclesJson.data
            : [];

        setVehicles(
          vehicleList,
        );

        syncSelectionState(
          vehicleList,
        );

        const customersResponse =
          await fetch(
            `${API_BASE}/api/gps/customers`,
            {
              method: "GET",

              headers:
                getAuthHeaders(),

              cache:
                "no-store",
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
              `Customers API returned ${customersResponse.status}`,
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
                `Dealers API returned ${dealersResponse.status}`,
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
        }

        setLastRefresh(
          new Date(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load vehicle assignments",
        );
      } finally {
        setLoading(false);
      }
    }, [
      handleUnauthorized,
      syncSelectionState,
    ]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const isDealer =
    currentUser?.role ===
    "DEALER";

  const filteredVehicles =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return vehicles.filter(
        (vehicle) => {
          const isAssigned =
            Boolean(
              vehicle.dealerId ||
                vehicle.customerId,
            );

          const matchesAssignment =
            assignmentFilter ===
              "ALL" ||
            (
              assignmentFilter ===
                "ASSIGNED" &&
              isAssigned
            ) ||
            (
              assignmentFilter ===
                "UNASSIGNED" &&
              !isAssigned
            );

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            vehicle.status ===
              statusFilter;

          if (
            !matchesAssignment ||
            !matchesStatus
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          const searchable = [
            vehicle.vehicleNo,
            vehicle.name ?? "",
            vehicle.device
              ?.imei ?? "",
            vehicle.device
              ?.model ?? "",
            vehicle.dealer
              ?.name ?? "",
            vehicle.customer
              ?.name ?? "",
          ]
            .join(" ")
            .toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    }, [
      vehicles,
      search,
      assignmentFilter,
      statusFilter,
    ]);

  function getCustomersForDealer(
    dealerId: string,
    currentCustomerId?: string,
  ) {
    return customers.filter(
      (customer) => {
        if (
          customer.id ===
          currentCustomerId
        ) {
          return true;
        }

        if (
          !customer.isActive
        ) {
          return false;
        }

        if (isDealer) {
          return (
            customer.dealerId ===
            currentUser?.dealerId
          );
        }

        if (!dealerId) {
          return (
            !customer.dealerId
          );
        }

        return (
          customer.dealerId ===
          dealerId
        );
      },
    );
  }

  function handleDealerChange(
    vehicleId: string,
    dealerId: string,
  ) {
    setSelectedDealer(
      (current) => ({
        ...current,
        [vehicleId]:
          dealerId,
      }),
    );

    setSelectedCustomer(
      (current) => ({
        ...current,
        [vehicleId]:
          "",
      }),
    );
  }

  function resetVehicleSelection(
    vehicle: Vehicle,
  ) {
    setSelectedDealer(
      (current) => ({
        ...current,
        [vehicle.id]:
          vehicle.dealerId ??
          "",
      }),
    );

    setSelectedCustomer(
      (current) => ({
        ...current,
        [vehicle.id]:
          vehicle.customerId ??
          "",
      }),
    );
  }

  function hasChanges(
    vehicle: Vehicle,
  ) {
    const currentDealer =
      vehicle.dealerId ?? "";

    const currentCustomer =
      vehicle.customerId ?? "";

    const nextDealer =
      isDealer
        ? currentUser?.dealerId ??
          ""
        : selectedDealer[
            vehicle.id
          ] ?? "";

    const nextCustomer =
      selectedCustomer[
        vehicle.id
      ] ?? "";

    return (
      currentDealer !==
        nextDealer ||
      currentCustomer !==
        nextCustomer
    );
  }

  async function saveAssignment(
    vehicleId: string,
  ) {
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

    setSavingVehicleId(
      vehicleId,
    );

    setError(null);
    setSuccess(null);

    try {
      const dealerId =
        user.role ===
        "DEALER"
          ? user.dealerId ??
            null
          : selectedDealer[
                vehicleId
              ] || null;

      const customerId =
        selectedCustomer[
          vehicleId
        ] || null;

      if (
        user.role ===
          "DEALER" &&
        !dealerId
      ) {
        throw new Error(
          "Dealer account is not linked to a dealer record.",
        );
      }

      if (customerId) {
        const customer =
          customers.find(
            (item) =>
              item.id ===
              customerId,
          );

        if (!customer) {
          throw new Error(
            "Selected customer is invalid.",
          );
        }

        if (
          dealerId &&
          customer.dealerId !==
            dealerId
        ) {
          throw new Error(
            "Selected customer does not belong to this dealer.",
          );
        }

        if (
          !customer.isActive
        ) {
          throw new Error(
            "Selected customer is inactive.",
          );
        }
      }

      const response =
        await fetch(
          `${API_BASE}/api/gps/vehicle-assignments/${vehicleId}`,
          {
            method:
              "PATCH",

            headers:
              getAuthHeaders(
                true,
              ),

            body:
              JSON.stringify({
                dealerId,
                customerId,
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
          "You do not have permission to update this vehicle assignment.",
        );
      }

      const result =
        await readJson<AssignmentResponse>(
          response,
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            `Assignment API returned ${response.status}`,
        );
      }

      await loadData();

      setSuccess(
        result.message ||
          "Vehicle assignment updated successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update vehicle assignment",
      );
    } finally {
      setSavingVehicleId(
        null,
      );
    }
  }

  async function unassignVehicle(
    vehicle: Vehicle,
  ) {
    const token =
      getAccessToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    const text =
      isDealer
        ? `Remove customer assignment from "${vehicle.vehicleNo}"?`
        : `Remove dealer and customer assignment from "${vehicle.vehicleNo}"?`;

    const confirmed =
      window.confirm(
        text,
      );

    if (!confirmed) {
      return;
    }

    setSavingVehicleId(
      vehicle.id,
    );

    setError(null);
    setSuccess(null);

    try {
      const response =
        await fetch(
          `${API_BASE}/api/gps/vehicle-assignments/${vehicle.id}/unassign`,
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
          "You do not have permission to unassign this vehicle.",
        );
      }

      const result =
        await readJson<AssignmentResponse>(
          response,
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.message ||
            `Unassign API returned ${response.status}`,
        );
      }

      await loadData();

      setSuccess(
        result.message ||
          (
            isDealer
              ? "Customer removed from vehicle successfully."
              : "Vehicle unassigned successfully."
          ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to unassign vehicle",
      );
    } finally {
      setSavingVehicleId(
        null,
      );
    }
  }

  const assignedCount =
    vehicles.filter(
      (vehicle) =>
        Boolean(
          vehicle.dealerId ||
            vehicle.customerId,
        ),
    ).length;

  const unassignedCount =
    vehicles.length -
    assignedCount;

  const activeDealerCount =
    dealers.filter(
      (dealer) =>
        dealer.isActive,
    ).length;

  const activeCustomerCount =
    customers.filter(
      (customer) =>
        customer.isActive,
    ).length;

  return (
    <div className="min-h-[calc(100vh-78px)] p-6 text-white">
      <div className="mx-auto max-w-[1750px]">

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-400">
              VEHICLE OWNERSHIP
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Vehicle Assignments
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {isDealer
                ? "Manage customer assignments for your dealer vehicles"
                : "Assign vehicles to dealers and customers"}
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

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Vehicles"
            value={
              vehicles.length
            }
            icon={<Car />}
          />

          <StatCard
            title="Assigned"
            value={
              assignedCount
            }
            icon={
              <CheckCircle2 />
            }
          />

          <StatCard
            title="Unassigned"
            value={
              unassignedCount
            }
            icon={<Unlink />}
          />

          <StatCard
            title={
              isDealer
                ? "Active Customers"
                : "Active Dealers"
            }
            value={
              isDealer
                ? activeCustomerCount
                : activeDealerCount
            }
            icon={
              isDealer
                ? <Users />
                : <Store />
            }
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1426]">

          <div className="flex flex-col gap-4 border-b border-white/10 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold">
                Assignment Directory
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {
                  filteredVehicles.length
                }{" "}
                of{" "}
                {
                  vehicles.length
                }{" "}
                vehicles
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
                  placeholder="Search vehicle, IMEI, dealer, customer..."
                  className="w-64 bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>

              <select
                value={
                  assignmentFilter
                }
                onChange={(
                  event,
                ) =>
                  setAssignmentFilter(
                    event.target
                      .value as AssignmentFilter,
                  )
                }
                className="filter-field"
              >
                <option value="ALL">
                  All Assignments
                </option>

                <option value="ASSIGNED">
                  Assigned
                </option>

                <option value="UNASSIGNED">
                  Unassigned
                </option>
              </select>

              <select
                value={
                  statusFilter
                }
                onChange={(
                  event,
                ) =>
                  setStatusFilter(
                    event.target
                      .value as VehicleStatusFilter,
                  )
                }
                className="filter-field"
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

          {loading &&
          vehicles.length ===
            0 ? (
            <div className="flex min-h-[320px] items-center justify-center text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading assignments...
            </div>
          ) : filteredVehicles.length >
            0 ? (
            <div className="divide-y divide-white/10">

              {filteredVehicles.map(
                (vehicle) => {
                  const dealerValue =
                    isDealer
                      ? currentUser
                          ?.dealerId ??
                        ""
                      : selectedDealer[
                          vehicle.id
                        ] ?? "";

                  const customerValue =
                    selectedCustomer[
                      vehicle.id
                    ] ?? "";

                  const availableCustomers =
                    getCustomersForDealer(
                      dealerValue,
                      vehicle.customerId ??
                        undefined,
                    );

                  const saving =
                    savingVehicleId ===
                    vehicle.id;

                  const isAssigned =
                    Boolean(
                      vehicle.dealerId ||
                        vehicle.customerId,
                    );

                  const dirty =
                    hasChanges(
                      vehicle,
                    );

                  return (
                    <div
                      key={
                        vehicle.id
                      }
                      className="p-5"
                    >
                      <div className="grid gap-5 2xl:grid-cols-[1.25fr_1fr_1fr_auto] 2xl:items-end">

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Car className="h-5 w-5 text-sky-400" />

                            <h3 className="font-semibold">
                              {
                                vehicle.vehicleNo
                              }
                            </h3>

                            <StatusBadge
                              status={
                                vehicle.status
                              }
                            />

                            {dirty && (
                              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold text-sky-400">
                                UNSAVED
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm text-slate-400">
                            {vehicle.name ??
                              "Vehicle"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {vehicle.device
                              ?.model ??
                              "Unknown model"}{" "}
                            · IMEI{" "}
                            {vehicle.device
                              ?.imei ??
                              "—"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-4 text-xs">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Store className="h-3.5 w-3.5" />

                              Current Dealer:{" "}
                              <strong className="text-white">
                                {vehicle.dealer
                                  ?.name ??
                                  "Unassigned"}
                              </strong>
                            </span>

                            <span className="flex items-center gap-1.5 text-slate-400">
                              <UserRound className="h-3.5 w-3.5" />

                              Current Customer:{" "}
                              <strong className="text-white">
                                {vehicle.customer
                                  ?.name ??
                                  "Unassigned"}
                              </strong>
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-slate-400">
                            Dealer
                          </label>

                          {isDealer ? (
                            <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3 text-sm text-sky-300">
                              {vehicle.dealer
                                ?.name ??
                                "My Dealer Account"}
                            </div>
                          ) : (
                            <select
                              value={
                                dealerValue
                              }
                              onChange={(
                                event,
                              ) =>
                                handleDealerChange(
                                  vehicle.id,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              className="select-field"
                            >
                              <option value="">
                                No Dealer
                              </option>

                              {dealers
                                .filter(
                                  (
                                    dealer,
                                  ) =>
                                    dealer.isActive ||
                                    dealer.id ===
                                      vehicle.dealerId,
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
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs text-slate-400">
                            Customer
                          </label>

                          <select
                            value={
                              customerValue
                            }
                            onChange={(
                              event,
                            ) =>
                              setSelectedCustomer(
                                (
                                  current,
                                ) => ({
                                  ...current,

                                  [vehicle.id]:
                                    event
                                      .target
                                      .value,
                                }),
                              )
                            }
                            className="select-field"
                          >
                            <option value="">
                              No Customer
                            </option>

                            {availableCustomers.map(
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
                        </div>

                        <div className="flex flex-wrap gap-2">

                          {dirty && (
                            <button
                              type="button"
                              disabled={
                                saving
                              }
                              onClick={() =>
                                resetVehicleSelection(
                                  vehicle,
                                )
                              }
                              title="Discard Changes"
                              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] disabled:opacity-50"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={
                              saving ||
                              !dirty
                            }
                            onClick={() =>
                              void saveAssignment(
                                vehicle.id,
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-xs font-semibold transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {saving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}

                            Save
                          </button>

                          <button
                            type="button"
                            disabled={
                              saving ||
                              (
                                isDealer
                                  ? !vehicle.customerId
                                  : !isAssigned
                              )
                            }
                            onClick={() =>
                              void unassignVehicle(
                                vehicle,
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Unlink className="h-4 w-4" />

                            {isDealer
                              ? "Remove Customer"
                              : "Unassign"}
                          </button>

                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <Users className="h-10 w-10 text-slate-600" />

              <p className="mt-3 font-semibold">
                No vehicles found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the
                current search or
                filters.
              </p>
            </div>
          )}
        </section>

        <style jsx>{`
          .filter-field,
          .select-field {
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
            min-width: 145px;
          }

          .select-field {
            width: 100%;
          }

          .filter-field:focus,
          .select-field:focus {
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

export default function AssignmentsPage() {
  return (
    <RoleRouteGuard
      allowedRoles={[
        "SUPER_ADMIN",
        "ADMIN",
        "DEALER",
      ]}
    >
      <AssignmentsPageContent />
    </RoleRouteGuard>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "MOVING"
    | "IDLE"
    | "OFFLINE";
}) {
  const classes = {
    MOVING:
      "bg-emerald-500/10 text-emerald-400",

    IDLE:
      "bg-amber-500/10 text-amber-400",

    OFFLINE:
      "bg-slate-500/10 text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes[status]}`}
    >
      <CircleDot className="h-3 w-3" />

      {status}
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