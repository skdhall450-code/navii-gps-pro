"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarClock,
  Car,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Loader2,
  Plus,
  ReceiptIndianRupee,
  RefreshCw,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  EMPTY_FILTERS,
  STATUS_LABELS,
  canManageMaintenance,
  formatDate,
  formatMoney,
  validateDateRange,
  type DueStatus,
  type MaintenanceCategory,
  type MaintenanceFilters,
  type MaintenanceList,
  type MaintenanceRecord,
  type MaintenanceVehicle,
} from "@/lib/maintenance";
import {
  getMaintenanceRecord,
  listMaintenance,
  listMaintenanceVehicles,
  MaintenanceApiError,
} from "@/lib/maintenance-api";
import { LatestMaintenanceRead } from "@/lib/maintenance-save";
import MaintenanceDialog, { type DialogMode } from "./MaintenanceDialog";
import s from "./maintenance.module.css";

const CATEGORY_ICONS = {
  SERVICE: Wrench,
  REGISTRATION: FileText,
  INSURANCE: ShieldCheck,
  INSPECTION: ClipboardCheck,
  CHALLAN: ReceiptIndianRupee,
};
const ADD_LABELS = {
  SERVICE: "Add service",
  REGISTRATION: "Add registration",
  INSURANCE: "Add insurance",
  INSPECTION: "Add inspection",
  CHALLAN: "Add challan",
};

export function StatusBadge({ status }: { status: DueStatus }) {
  const tone =
    status === "OVERDUE"
      ? s.badgeOverdue
      : ["DUE_SOON", "DUE_TODAY"].includes(status)
        ? s.badgeSoon
        : status === "COMPLETED"
          ? s.badgeComplete
          : status === "ARCHIVED"
            ? s.badgeCancelled
            : "";
  return (
    <span className={`${s.badge} ${tone}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function MaintenanceWorkspace() {
  const [category, setCategory] = useState<MaintenanceCategory>("SERVICE");
  const [draftFilters, setDraftFilters] = useState<MaintenanceFilters>({
    ...EMPTY_FILTERS,
  });
  const [filters, setFilters] = useState<MaintenanceFilters>({
    ...EMPTY_FILTERS,
  });
  const [offset, setOffset] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<MaintenanceList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<MaintenanceApiError | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<MaintenanceVehicle[]>([]);
  const [vehicleError, setVehicleError] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [canManage, setCanManage] = useState(false);
  const [dialog, setDialog] = useState<{
    mode: DialogMode;
    record?: MaintenanceRecord;
  } | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const detailRequest = useRef(new LatestMaintenanceRead());
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    const pendingDetail = detailRequest.current;
    try {
      setCanManage(
        canManageMaintenance(
          JSON.parse(localStorage.getItem("navii_user") || "{}").role,
        ),
      );
    } catch {
      setCanManage(false);
    }
    return () => {
      alive.current = false;
      pendingDetail.cancel();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setVehiclesLoading(true);
    setVehicleError(false);
    listMaintenanceVehicles(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setVehicles(result);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setVehicleError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setVehiclesLoading(false);
      });
    return () => controller.abort();
  }, [refresh]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setData(null);
    listMaintenance(category, filters, offset, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          if (result.total > 0 && offset >= result.total)
            setOffset(Math.floor((result.total - 1) / 20) * 20);
          else setData(result);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError" && !controller.signal.aborted)
          setError(error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [category, filters, offset, refresh]);

  const openRecord = useCallback(async (id: string) => {
    const controller = detailRequest.current.begin();
    setOpeningId(id);
    setError(null);
    try {
      const record = await getMaintenanceRecord(id, controller.signal);
      if (detailRequest.current.isCurrent(controller) && alive.current)
        setDialog({ mode: "view", record });
    } catch (error) {
      if (detailRequest.current.isCurrent(controller) && alive.current)
        setError(error as MaintenanceApiError);
    } finally {
      if (detailRequest.current.isCurrent(controller) && alive.current)
        setOpeningId(null);
    }
  }, []);

  function cancelDetail() {
    detailRequest.current.cancel();
    setOpeningId(null);
  }
  function createRecord() {
    cancelDetail();
    setMessage(null);
    setDialog({ mode: "create" });
  }
  const refreshList = () => {
    cancelDetail();
    setRefresh((value) => value + 1);
  };
  const filtered = Object.values(filters).some(Boolean);
  const activeIcon = CATEGORY_ICONS[category];
  const Icon = activeIcon;
  const summary = data?.summary;

  return (
    <section className={s.workspace} aria-labelledby="maintenance-title">
      <div className={s.header}>
        <div>
          <p className={s.eyebrow}>Fleet care</p>
          <h1 id="maintenance-title" className={s.title}>
            Maintenance &amp; Documents
          </h1>
          <p className={s.subtitle}>
            Keep service dates, vehicle documents and costs together. See what
            needs attention and keep a clear history.
          </p>
        </div>
        <div className={s.actions}>
          <button
            type="button"
            className={s.button}
            onClick={refreshList}
            disabled={loading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
          {canManage && (
            <button
              type="button"
              className={s.primary}
              onClick={createRecord}
              disabled={
                vehiclesLoading || vehicleError || vehicles.length === 0
              }
            >
              <Plus size={17} aria-hidden="true" />
              {ADD_LABELS[category]}
            </button>
          )}
        </div>
      </div>

      {!canManage && (
        <p className={s.notice}>
          <ShieldCheck size={17} aria-hidden="true" />
          You have view-only access. Contact your dealer or administrator to add
          or update records.
        </p>
      )}
      {message && (
        <p className={`${s.notice} ${s.success}`} role="status">
          <CheckCircle2 size={17} aria-hidden="true" />
          {message}
        </p>
      )}
      {error && (
        <div className={`${s.notice} ${s.error}`} role="alert">
          <AlertCircle size={17} aria-hidden="true" />
          <div>
            {error.message}
            {error.status === 401 ? (
              <p>
                <Link href="/login" className={s.linkButton}>
                  Sign in again
                </Link>
              </p>
            ) : (
              <p>
                <button
                  className={s.linkButton}
                  type="button"
                  onClick={refreshList}
                >
                  Retry loading records
                </button>
              </p>
            )}
          </div>
        </div>
      )}
      {vehicleError && (
        <div className={`${s.notice} ${s.error}`} role="alert">
          <AlertCircle size={17} aria-hidden="true" />
          <div>
            The vehicle list couldn&apos;t load. Record creation is unavailable
            until it loads.{" "}
            <button
              className={s.linkButton}
              type="button"
              onClick={refreshList}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {!vehiclesLoading && !vehicleError && vehicles.length === 0 && (
        <p className={s.notice}>
          <Car size={17} aria-hidden="true" />
          No vehicles are available in your account. Add or assign a vehicle
          first.
        </p>
      )}

      <div className={s.tabs} aria-label="Record categories">
        {(Object.keys(CATEGORY_LABELS) as MaintenanceCategory[]).map(
          (value) => {
            const TabIcon = CATEGORY_ICONS[value];
            return (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                className={`${s.tab} ${category === value ? s.tabActive : ""}`}
                onClick={() => {
                  setCategory(value);
                  setOffset(0);
                  setMessage(null);
                  detailRequest.current.cancel();
                  setOpeningId(null);
                }}
              >
                <TabIcon size={17} aria-hidden="true" />
                {CATEGORY_LABELS[value]}
              </button>
            );
          },
        )}
      </div>

      <div
        className={s.stats}
        aria-label="Summary for all matching records"
        aria-busy={loading}
      >
        {[
          {
            label: "Matching records",
            value: data?.total,
            note: "All pages in this filter",
            icon: Icon,
            tone: "",
          },
          {
            label: "Due soon / today",
            value: summary ? summary.DUE_SOON + summary.DUE_TODAY : undefined,
            note: "Within each due-soon window",
            icon: CalendarClock,
            tone: s.soon,
          },
          {
            label: "Overdue",
            value: summary?.OVERDUE,
            note: "Past the recorded due date",
            icon: AlertCircle,
            tone: s.overdue,
          },
          {
            label: "Completed",
            value: summary?.COMPLETED,
            note: "Completed records in this filter",
            icon: CheckCircle2,
            tone: s.complete,
          },
        ].map((stat) => (
          <div className={s.stat} key={stat.label}>
            <div className={s.statLabel}>
              {stat.label}
              <stat.icon size={17} className={stat.tone} aria-hidden="true" />
            </div>
            <p className={`${s.statValue} ${stat.tone}`}>{stat.value ?? "—"}</p>
            <p className={s.statNote}>{stat.note}</p>
          </div>
        ))}
      </div>

      <div className={s.panel}>
        <form
          className={s.toolbar}
          onSubmit={(event) => {
            event.preventDefault();
            const error = validateDateRange(
              draftFilters.fromDate,
              draftFilters.toDate,
            );
            setFilterError(error);
            if (!error) {
              cancelDetail();
              setFilters({ ...draftFilters });
              setOffset(0);
            }
          }}
        >
          <div className={s.filterGrid}>
            <label className={s.field}>
              Search records
              <input
                className={s.input}
                type="search"
                maxLength={100}
                placeholder="Title, reference or provider"
                value={draftFilters.search}
                onChange={(event) =>
                  setDraftFilters({
                    ...draftFilters,
                    search: event.target.value,
                  })
                }
              />
            </label>
            <label className={s.field}>
              Vehicle
              <select
                className={s.input}
                value={draftFilters.vehicleId}
                onChange={(event) =>
                  setDraftFilters({
                    ...draftFilters,
                    vehicleId: event.target.value,
                  })
                }
              >
                <option value="">All vehicles</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNo}
                    {vehicle.name ? ` · ${vehicle.name}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.field}>
              Status
              <select
                className={s.input}
                value={draftFilters.dueStatus}
                onChange={(event) =>
                  setDraftFilters({
                    ...draftFilters,
                    dueStatus: event.target.value,
                  })
                }
              >
                <option value="">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.field}>
              Due from
              <input
                className={s.input}
                type="date"
                min="2000-01-01"
                max="2100-12-31"
                value={draftFilters.fromDate}
                onChange={(event) =>
                  setDraftFilters({
                    ...draftFilters,
                    fromDate: event.target.value,
                  })
                }
              />
            </label>
            <label className={s.field}>
              Due to
              <input
                className={s.input}
                type="date"
                min="2000-01-01"
                max="2100-12-31"
                value={draftFilters.toDate}
                onChange={(event) =>
                  setDraftFilters({
                    ...draftFilters,
                    toDate: event.target.value,
                  })
                }
              />
            </label>
          </div>
          {filterError && (
            <p role="alert" className={s.overdue}>
              {filterError}
            </p>
          )}
          <div className={s.filterInfo}>
            <span>Due dates and statuses use India time (Asia/Kolkata).</span>
            <div className={s.actions}>
              <button
                type="button"
                className={s.linkButton}
                onClick={() => {
                  cancelDetail();
                  setDraftFilters({ ...EMPTY_FILTERS });
                  setFilters({ ...EMPTY_FILTERS });
                  setFilterError(null);
                  setOffset(0);
                }}
              >
                Clear filters
              </button>
              <button type="submit" className={s.button}>
                Apply filters
              </button>
            </div>
          </div>
        </form>
        <div className={s.listHeader}>
          <div>
            <h2 className={s.sectionTitle}>{CATEGORY_LABELS[category]}</h2>
            <p className={s.hint}>
              {data
                ? `${data.total} matching ${data.total === 1 ? "record" : "records"} · As of ${formatDate(data.asOfDate)}`
                : "Recorded dates, costs and private files"}
            </p>
          </div>
          {data && data.total > 0 && (
            <span className={s.hint}>
              {offset + 1}–{Math.min(offset + data.data.length, data.total)} of{" "}
              {data.total}
            </span>
          )}
        </div>
        {loading ? (
          <div className={s.empty} role="status">
            <Loader2 size={28} className={s.spinner} aria-hidden="true" />
            <p>Loading records…</p>
          </div>
        ) : error && !data ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <AlertCircle size={26} aria-hidden="true" />
            </div>
            <h2>Records couldn&apos;t load</h2>
            <p>
              Refresh the list to try again. No empty totals are shown while
              data is unavailable.
            </p>
            <button type="button" onClick={refreshList} className={s.button}>
              Retry
            </button>
          </div>
        ) : data?.data.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <Icon size={27} aria-hidden="true" />
            </div>
            <h2>
              {filtered
                ? "No matching records"
                : `No ${CATEGORY_LABELS[category].toLowerCase()} yet`}
            </h2>
            <p>
              {filtered
                ? "Try a different vehicle, date range or status to find your records."
                : "Add the first record to track its due date, costs and supporting images."}
            </p>
            {!filtered && canManage && vehicles.length > 0 && (
              <button
                className={s.primary}
                type="button"
                onClick={createRecord}
              >
                <Plus size={16} aria-hidden="true" />
                {ADD_LABELS[category]}
              </button>
            )}
          </div>
        ) : (
          <ul className={s.records}>
            {data?.data.map((record) => (
              <li className={s.record} key={record.id}>
                <div>
                  <p className={s.vehicle}>
                    <Car size={13} aria-hidden="true" />
                    {record.vehicle?.vehicleNo ||
                      vehicles.find(
                        (vehicle) => vehicle.id === record.vehicleId,
                      )?.vehicleNo ||
                      "Vehicle"}
                  </p>
                  <h3 className={s.recordTitle}>{record.title}</h3>
                  <p className={s.recordMeta}>
                    {record.referenceNumber || "No reference recorded"}
                    {record.attachmentsCount
                      ? ` · ${record.attachmentsCount} ${record.attachmentsCount === 1 ? "file" : "files"}`
                      : ""}
                  </p>
                </div>
                <div className={s.recordDateWrap}>
                  <StatusBadge status={record.dueStatus} />
                  <p className={s.recordMeta}>
                    {record.state === "COMPLETED" ? "Completed" : "Due date"}
                  </p>
                  <p className={s.recordDate}>
                    {formatDate(
                      record.state === "COMPLETED"
                        ? record.completedDate
                        : record.dueDate,
                    )}
                  </p>
                </div>
                <div className={s.recordCost}>
                  <p className={s.hint}>Last recorded cost</p>
                  <p className={s.money}>
                    {record.costItems?.length
                      ? formatMoney(record.totalCostPaise)
                      : "Not recorded"}
                  </p>
                </div>
                <div className={s.recordAction}>
                  <button
                    type="button"
                    className={s.button}
                    onClick={() => void openRecord(record.id)}
                    disabled={openingId === record.id}
                    aria-label={`View ${record.title}`}
                  >
                    {openingId === record.id && (
                      <Loader2
                        size={15}
                        className={s.spinner}
                        aria-hidden="true"
                      />
                    )}
                    View record
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {data && data.total > 20 && (
          <div className={s.listHeader}>
            <span className={s.hint}>20 records per page</span>
            <div className={s.actions}>
              <button
                className={s.button}
                type="button"
                disabled={offset === 0 || loading}
                onClick={() => {
                  cancelDetail();
                  setOffset((value) => Math.max(0, value - 20));
                }}
              >
                Previous
              </button>
              <button
                className={s.button}
                type="button"
                disabled={offset + data.data.length >= data.total || loading}
                onClick={() => {
                  cancelDetail();
                  setOffset((value) => value + 20);
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <p className={s.footerNote}>
        <ShieldCheck size={15} aria-hidden="true" />
        Records are maintained manually. Due-soon windows only change status
        labels; saving does not send email, SMS or push notifications.
      </p>
      {dialog && (
        <MaintenanceDialog
          key={`${dialog.mode}-${dialog.record?.id || "new"}-${dialog.record?.version || 0}`}
          mode={dialog.mode}
          record={dialog.record}
          category={category}
          vehicles={vehicles}
          initialVehicleId={filters.vehicleId}
          canManage={canManage}
          onClose={() => {
            setDialog(null);
            refreshList();
          }}
          onMode={(mode, record) => {
            cancelDetail();
            setDialog({ mode, record });
          }}
          onSaved={(record) => {
            if (!alive.current) return;
            setMessage("Record saved.");
            setDialog({ mode: "view", record });
            refreshList();
          }}
        />
      )}
    </section>
  );
}
