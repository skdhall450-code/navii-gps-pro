"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Archive,
  CalendarClock,
  CheckCircle2,
  Download,
  FileImage,
  History,
  Loader2,
  Paperclip,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  completionInput,
  costItemsFromForm,
  editRecordForm,
  formatDate,
  formatInstant,
  formatMoney,
  newRecordForm,
  recordInput,
  todayInIndia,
  validateAttachment,
  type CompletionForm,
  type MaintenanceCategory,
  type MaintenanceRecord,
  type MaintenanceVehicle,
  type RecordForm,
} from "@/lib/maintenance";
import {
  addMaintenanceAttachment,
  downloadMaintenanceAttachment,
  getMaintenanceRecord,
  MaintenanceApiError,
  saveMaintenanceRecord,
} from "@/lib/maintenance-api";
import {
  MaintenanceSaveAttempt,
  type MaintenanceSaveOperation,
} from "@/lib/maintenance-save";
import s from "./maintenance.module.css";

export type DialogMode = "view" | "create" | "edit" | "complete" | "archive";
type Props = {
  mode: DialogMode;
  record?: MaintenanceRecord;
  category: MaintenanceCategory;
  vehicles: MaintenanceVehicle[];
  initialVehicleId?: string;
  canManage: boolean;
  onClose: () => void;
  onMode: (mode: DialogMode, record: MaintenanceRecord) => void;
  onSaved: (record: MaintenanceRecord) => void;
};
const ACTION_LABELS: Record<string, string> = {
  CREATED: "Record added",
  UPDATED: "Record updated",
  COMPLETED: "Completed",
  RENEWED: "Renewed",
  ARCHIVED: "Archived",
  ATTACHMENT_ADDED: "Private image added",
};
const renewalCategory = (category: MaintenanceCategory) =>
  category === "REGISTRATION" || category === "INSURANCE";
const completionLabel = (category: MaintenanceCategory) =>
  renewalCategory(category)
    ? "Record renewal"
    : category === "CHALLAN"
      ? "Record payment"
      : "Mark completed";

export default function MaintenanceDialog(props: Props) {
  const {
    mode,
    record,
    category,
    vehicles,
    initialVehicleId,
    canManage,
    onClose,
    onMode,
    onSaved,
  } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const alive = useRef(true);
  const [form, setForm] = useState<RecordForm>(() =>
    record ? editRecordForm(record) : newRecordForm(category, initialVehicleId),
  );
  const [completion, setCompletion] = useState<CompletionForm>(() => ({
    completedDate: todayInIndia(),
    nextDueDate: "",
    validFromDate: "",
    referenceNumber: record?.referenceNumber || "",
    provider: record?.provider || "",
    notes: "",
    manualOdometerKm: "",
    costItems: [],
  }));
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const detailController = useRef<AbortController | null>(null);
  const [error, setError] = useState<MaintenanceApiError | null>(null);
  const [uncertain, setUncertain] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [downloadId, setDownloadId] = useState<string | null>(null);
  const [detail, setDetail] = useState(record);
  const saveAttempt = useRef(new MaintenanceSaveAttempt());
  const requestLock = useRef(false);
  const createKey = useRef<string | null>(null);
  const workingRecord = detail || record;
  const effectiveCategory = record?.category || category;
  const isRenewal = renewalCategory(effectiveCategory);

  useEffect(() => {
    alive.current = true;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      alive.current = false;
      detailController.current?.abort();
      if (dialog?.open) dialog.close();
    };
  }, []);
  useEffect(() => {
    if (
      mode !== "view" ||
      !record ||
      (record.history !== undefined && record.attachments !== undefined)
    )
      return;
    const controller = new AbortController();
    detailController.current = controller;
    setReading(true);
    getMaintenanceRecord(record.id, controller.signal)
      .then((latest) => {
        if (!controller.signal.aborted && alive.current) setDetail(latest);
      })
      .catch((error) => {
        if (!controller.signal.aborted && alive.current)
          setError(error as MaintenanceApiError);
      })
      .finally(() => {
        if (!controller.signal.aborted && alive.current) setReading(false);
      });
    return () => controller.abort();
  }, [mode, record]);
  useEffect(() => {
    if (!dirty && !busy && !uncertain) return;
    const prevent = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty, busy, uncertain]);

  function close() {
    if (busy) return;
    if (dirty || uncertain) {
      setDiscard(true);
      return;
    }
    detailController.current?.abort();
    onClose();
  }
  function update<K extends keyof RecordForm>(key: K, value: RecordForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setError(null);
  }
  function updateCompletion<K extends keyof CompletionForm>(
    key: K,
    value: CompletionForm[K],
  ) {
    setCompletion((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setError(null);
  }

  async function loadLatest() {
    if (!record || requestLock.current || reading) return;
    const controller = new AbortController();
    detailController.current = controller;
    setReading(true);
    try {
      const latest = await getMaintenanceRecord(record.id, controller.signal);
      if (!controller.signal.aborted && alive.current) {
        setDirty(false);
        setUncertain(false);
        setFile(null);
        if (mode === "view") {
          setDetail(latest);
          setError(null);
        } else onMode("view", latest);
      }
    } catch (error) {
      if (!controller.signal.aborted && alive.current)
        setError(error as MaintenanceApiError);
    } finally {
      if (!controller.signal.aborted && alive.current) setReading(false);
    }
  }

  function buildSave(): MaintenanceSaveOperation {
    if (mode === "create" || mode === "edit") {
      const input = recordInput(form);
      if (mode === "create") {
        createKey.current ||= crypto.randomUUID();
        return {
          path: "",
          method: "POST",
          body: { ...input, idempotencyKey: createKey.current },
        };
      }
      if (!record) throw new Error("Load the record before editing it.");
      // Empty strings intentionally clear optional fields on PATCH.
      return {
        path: `/${encodeURIComponent(record.id)}`,
        method: "PATCH",
        body: {
          version: record.version,
          title: input.title,
          dueDate: input.dueDate,
          validFromDate: form.validFromDate || null,
          referenceNumber: form.referenceNumber.trim() || null,
          provider: form.provider.trim() || null,
          notes: form.notes.trim() || null,
          reminderDays: input.reminderDays,
        },
      };
    }
    if (!record) throw new Error("Load the record before updating it.");
    if (mode === "archive")
      return {
        path: `/${encodeURIComponent(record.id)}/archive`,
        method: "POST",
        body: { version: record.version },
      };
    const body = completionInput(record, completion);
    return {
      path: `/${encodeURIComponent(record.id)}/${isRenewal ? "renew" : "complete"}`,
      method: "POST",
      body,
    };
  }
  async function submit() {
    if (requestLock.current || mode === "view" || !canManage) return;
    setError(null);
    let operation: MaintenanceSaveOperation | null;
    try {
      operation = saveAttempt.current.begin(buildSave);
    } catch (error) {
      setError(new MaintenanceApiError((error as Error).message));
      return;
    }
    // The exact payload and version/key survive an ambiguous response. Never silently retry.
    if (!operation) return;
    requestLock.current = true;
    setBusy(true);
    try {
      const saved = await saveMaintenanceRecord(
        operation.path,
        operation.body,
        operation.method,
      );
      if (!alive.current) return;
      setDirty(false);
      setUncertain(false);
      saveAttempt.current.succeeded();
      onSaved(saved);
    } catch (error) {
      if (!alive.current) return;
      const failure = error as MaintenanceApiError;
      setError(failure);
      setUncertain(failure.uncertain);
      saveAttempt.current.failed(failure.uncertain);
    } finally {
      requestLock.current = false;
      if (alive.current) setBusy(false);
    }
  }

  async function upload() {
    if (!workingRecord || !file || requestLock.current || uncertain) return;
    try {
      validateAttachment(file);
    } catch (error) {
      setError(new MaintenanceApiError((error as Error).message));
      return;
    }
    requestLock.current = true;
    setBusy(true);
    setError(null);
    try {
      const saved = await addMaintenanceAttachment(
        workingRecord.id,
        workingRecord.version,
        file,
      );
      if (!alive.current) return;
      setDirty(false);
      setFile(null);
      setDetail(saved);
      onSaved(saved);
    } catch (error) {
      if (!alive.current) return;
      const failure = error as MaintenanceApiError;
      setError(
        failure.uncertain
          ? new MaintenanceApiError(
              "The upload may have finished. Load the latest record to check its files before uploading again.",
              failure.status,
              true,
            )
          : failure,
      );
      setUncertain(failure.uncertain);
    } finally {
      requestLock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function download(id: string, filename: string) {
    if (!workingRecord || downloadId) return;
    setDownloadId(id);
    setError(null);
    try {
      const blob = await downloadMaintenanceAttachment(workingRecord.id, id);
      if (!alive.current) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      if (alive.current) setError(error as MaintenanceApiError);
    } finally {
      if (alive.current) setDownloadId(null);
    }
  }

  const title =
    mode === "create"
      ? `Add ${effectiveCategory === "SERVICE" ? "service" : effectiveCategory === "CHALLAN" ? "challan" : effectiveCategory.toLowerCase()}`
      : mode === "edit"
        ? "Edit record"
        : mode === "complete"
          ? completionLabel(effectiveCategory)
          : mode === "archive"
            ? "Archive record?"
            : workingRecord?.title || "Record details";
  const locked =
    busy ||
    reading ||
    uncertain ||
    [401, 403, 409].includes(error?.status || 0);
  let totalCost: string;
  try {
    totalCost =
      completion.costItems.length === 0
        ? "Not recorded"
        : formatMoney(
            costItemsFromForm(completion.costItems).reduce(
              (sum, item) => sum + item.amountPaise,
              0,
            ),
          );
  } catch {
    totalCost = "Check cost items";
  }

  return (
    <dialog
      ref={dialogRef}
      className={s.dialog}
      aria-labelledby="maintenance-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className={s.dialogHeader}>
        <div>
          <p className={s.eyebrow}>{CATEGORY_LABELS[effectiveCategory]}</p>
          <h2 id="maintenance-dialog-title">{title}</h2>
          {record && (
            <p className={s.hint}>
              {record.vehicle?.vehicleNo ||
                vehicles.find((vehicle) => vehicle.id === record.vehicleId)
                  ?.vehicleNo ||
                "Vehicle"}{" "}
              · Version {workingRecord?.version}
            </p>
          )}
        </div>
        <button
          type="button"
          className={s.iconButton}
          onClick={close}
          disabled={busy}
          aria-label="Close record"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      {discard && (
        <div className={s.discard} role="alert">
          <p>
            {uncertain
              ? "This save may already have finished. Close this record and refresh the list to check."
              : "Discard your unsaved changes?"}
          </p>
          <div className={s.actions}>
            <button
              className={s.button}
              type="button"
              onClick={() => setDiscard(false)}
            >
              Keep editing
            </button>
            <button className={s.button} type="button" onClick={onClose}>
              {uncertain ? "Close and refresh" : "Discard changes"}
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className={s.dialogBody}>
          {error && (
            <div className={`${s.notice} ${s.error}`} role="alert">
              <AlertCircle size={17} aria-hidden="true" />
              <div>
                {error.message}
                {error.status === 401 && (
                  <p>
                    <a href="/login" className={s.linkButton}>
                      Sign in again
                    </a>
                  </p>
                )}
                {record &&
                  (error.status === 409 || (uncertain && mode === "view")) && (
                    <p>
                      <button
                        className={s.linkButton}
                        type="button"
                        onClick={() => void loadLatest()}
                        disabled={busy || reading}
                      >
                        Load latest record
                      </button>
                      <br />
                      <span className={s.hint}>
                        Your unsaved changes will be discarded.
                      </span>
                    </p>
                  )}
              </div>
            </div>
          )}
          {(mode === "create" || mode === "edit") && (
            <>
              <fieldset disabled={locked} className={s.formGrid}>
                <label className={`${s.field} ${s.fullWidth}`}>
                  Vehicle *
                  <select
                    autoFocus
                    className={s.input}
                    value={form.vehicleId}
                    onChange={(event) =>
                      update("vehicleId", event.target.value)
                    }
                    required
                    disabled={mode === "edit"}
                  >
                    <option value="">Choose a vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option value={vehicle.id} key={vehicle.id}>
                        {vehicle.vehicleNo}
                        {vehicle.name ? ` · ${vehicle.name}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={`${s.field} ${s.fullWidth}`}>
                  Title *
                  <input
                    className={s.input}
                    maxLength={120}
                    required
                    placeholder={
                      effectiveCategory === "SERVICE"
                        ? "e.g. Engine oil and filter service"
                        : effectiveCategory === "INSURANCE"
                          ? "e.g. Commercial vehicle insurance"
                          : "Enter a clear record title"
                    }
                    value={form.title}
                    onChange={(event) => update("title", event.target.value)}
                  />
                </label>
                <label className={s.field}>
                  {isRenewal ? "Expiry date" : "Due date"} *
                  <input
                    className={s.input}
                    type="date"
                    min="2000-01-01"
                    max="2100-12-31"
                    required
                    value={form.dueDate}
                    onChange={(event) => update("dueDate", event.target.value)}
                  />
                </label>
                <label className={s.field}>
                  Start / issue date (optional)
                  <input
                    className={s.input}
                    type="date"
                    min="2000-01-01"
                    max={form.dueDate || "2100-12-31"}
                    value={form.validFromDate}
                    onChange={(event) =>
                      update("validFromDate", event.target.value)
                    }
                  />
                </label>
                <label className={s.field}>
                  Reference / bill number
                  <input
                    className={s.input}
                    maxLength={120}
                    value={form.referenceNumber}
                    onChange={(event) =>
                      update("referenceNumber", event.target.value)
                    }
                  />
                </label>
                <label className={s.field}>
                  Provider / workshop
                  <input
                    className={s.input}
                    maxLength={120}
                    value={form.provider}
                    onChange={(event) => update("provider", event.target.value)}
                  />
                </label>
                <label className={s.field}>
                  Show &quot;Due soon&quot; (days before)
                  <input
                    className={s.input}
                    type="number"
                    min={0}
                    max={90}
                    step={1}
                    required
                    value={form.reminderDays}
                    onChange={(event) =>
                      update("reminderDays", event.target.value)
                    }
                  />
                  <span className={s.hint}>
                    Status label only. No notifications are sent.
                  </span>
                </label>
                <label className={`${s.field} ${s.fullWidth}`}>
                  Notes
                  <textarea
                    className={s.input}
                    maxLength={2000}
                    value={form.notes}
                    onChange={(event) => update("notes", event.target.value)}
                  />
                </label>
              </fieldset>
              <p className={s.footerNote}>
                <Paperclip size={15} aria-hidden="true" />
                Save this record first, then add private JPG or PNG images (up
                to 2 MB each).
              </p>
            </>
          )}
          {mode === "complete" && record && (
            <>
              <p className={s.notice}>
                <History size={17} aria-hidden="true" />
                {isRenewal
                  ? `Current expiry: ${formatDate(record.dueDate)}. The previous document details and cost stay in history.`
                  : "This records a completed event and its cost. It does not make a payment or send a notification."}
              </p>
              <fieldset disabled={locked}>
                <div className={s.formGrid}>
                  <label className={s.field}>
                    {isRenewal
                      ? "Renewal"
                      : effectiveCategory === "CHALLAN"
                        ? "Payment"
                        : "Completion"}{" "}
                    date *
                    <input
                      autoFocus
                      className={s.input}
                      type="date"
                      min="2000-01-01"
                      max={todayInIndia()}
                      value={completion.completedDate}
                      required
                      onChange={(event) =>
                        updateCompletion("completedDate", event.target.value)
                      }
                    />
                  </label>
                  {(isRenewal ||
                    effectiveCategory === "SERVICE" ||
                    effectiveCategory === "INSPECTION") && (
                    <label className={s.field}>
                      {isRenewal
                        ? "New expiry date *"
                        : "Next due date (optional)"}
                      <input
                        className={s.input}
                        type="date"
                        min="2000-01-01"
                        max="2100-12-31"
                        required={isRenewal}
                        value={completion.nextDueDate}
                        onChange={(event) =>
                          updateCompletion("nextDueDate", event.target.value)
                        }
                      />
                      <span className={s.hint}>
                        {isRenewal
                          ? "Must be later than the current expiry."
                          : "Starts the next schedule on the same record."}
                      </span>
                    </label>
                  )}
                  {isRenewal && (
                    <>
                      <label className={s.field}>
                        New start / issue date
                        <input
                          className={s.input}
                          type="date"
                          min="2000-01-01"
                          max={completion.nextDueDate || "2100-12-31"}
                          value={completion.validFromDate}
                          onChange={(event) =>
                            updateCompletion(
                              "validFromDate",
                              event.target.value,
                            )
                          }
                        />
                      </label>
                      <label className={s.field}>
                        New reference number
                        <input
                          className={s.input}
                          maxLength={120}
                          value={completion.referenceNumber}
                          onChange={(event) =>
                            updateCompletion(
                              "referenceNumber",
                              event.target.value,
                            )
                          }
                        />
                      </label>
                      <label className={s.field}>
                        Provider
                        <input
                          className={s.input}
                          maxLength={120}
                          value={completion.provider}
                          onChange={(event) =>
                            updateCompletion("provider", event.target.value)
                          }
                        />
                      </label>
                    </>
                  )}
                  {effectiveCategory === "SERVICE" && (
                    <label className={`${s.field} ${s.fullWidth}`}>
                      Manual odometer reading (km, optional)
                      <input
                        className={s.input}
                        type="number"
                        min={0}
                        max={10000000}
                        step={1}
                        inputMode="numeric"
                        placeholder="Leave blank if unknown"
                        value={completion.manualOdometerKm}
                        onChange={(event) =>
                          updateCompletion(
                            "manualOdometerKm",
                            event.target.value,
                          )
                        }
                      />
                      <span className={s.hint}>
                        Entered by you. This is not a GPS or sensor reading and
                        will not drive service schedules.
                      </span>
                    </label>
                  )}
                </div>
                <div className={s.formSection}>
                  <div className={s.formSectionHeader}>
                    <h3>Itemized cost (INR)</h3>
                    <button
                      className={s.button}
                      type="button"
                      disabled={completion.costItems.length >= 30}
                      onClick={() =>
                        updateCompletion("costItems", [
                          ...completion.costItems,
                          { description: "", amount: "" },
                        ])
                      }
                    >
                      <Plus size={15} aria-hidden="true" />
                      Add item
                    </button>
                  </div>
                  <p className={s.hint}>
                    Enter each item&apos;s final amount, including any tax.
                    Leave the list empty if no cost is being recorded.
                  </p>
                  {completion.costItems.map((item, index) => (
                    <div className={s.costRow} key={index}>
                      <label className={s.field}>
                        Item {index + 1}
                        <input
                          className={s.input}
                          maxLength={120}
                          required
                          value={item.description}
                          placeholder="e.g. Engine oil"
                          onChange={(event) =>
                            updateCompletion(
                              "costItems",
                              completion.costItems.map((current, i) =>
                                i === index
                                  ? {
                                      ...current,
                                      description: event.target.value,
                                    }
                                  : current,
                              ),
                            )
                          }
                        />
                      </label>
                      <label className={s.field}>
                        Amount (₹)
                        <input
                          className={s.input}
                          type="text"
                          inputMode="decimal"
                          maxLength={12}
                          required
                          placeholder="0.00"
                          value={item.amount}
                          onChange={(event) =>
                            updateCompletion(
                              "costItems",
                              completion.costItems.map((current, i) =>
                                i === index
                                  ? { ...current, amount: event.target.value }
                                  : current,
                              ),
                            )
                          }
                        />
                      </label>
                      <button
                        className={s.iconButton}
                        type="button"
                        aria-label={`Remove cost item ${index + 1}`}
                        onClick={() =>
                          updateCompletion(
                            "costItems",
                            completion.costItems.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  <div className={s.total}>
                    <span>Total recorded cost</span>
                    <span>{totalCost}</span>
                  </div>
                </div>
                <label className={`${s.field} ${s.formSection}`}>
                  Completion / bill notes
                  <textarea
                    className={s.input}
                    maxLength={2000}
                    value={completion.notes}
                    onChange={(event) =>
                      updateCompletion("notes", event.target.value)
                    }
                  />
                </label>
              </fieldset>
            </>
          )}
          {mode === "archive" && (
            <p className={s.prewrap}>
              Archive “{record?.title}”? It will no longer be treated as an
              active due record. Its history and private files are retained and
              remain visible with the Archived status filter.
            </p>
          )}
          {mode === "view" && workingRecord && (
            <>
              <p className={s.notice}>
                <CalendarClock size={17} aria-hidden="true" />
                {STATUS_LABELS[workingRecord.dueStatus]} ·{" "}
                {workingRecord.state === "COMPLETED"
                  ? `Completed ${formatDate(workingRecord.completedDate)}`
                  : `Due ${formatDate(workingRecord.dueDate)}`}
              </p>
              <dl className={s.detailGrid}>
                <div>
                  <dt>{isRenewal ? "Expiry date" : "Due date"}</dt>
                  <dd>{formatDate(workingRecord.dueDate)}</dd>
                </div>
                <div>
                  <dt>Start / issue date</dt>
                  <dd>{formatDate(workingRecord.validFromDate)}</dd>
                </div>
                <div>
                  <dt>Reference / bill number</dt>
                  <dd>{workingRecord.referenceNumber || "Not recorded"}</dd>
                </div>
                <div>
                  <dt>Provider / workshop</dt>
                  <dd>{workingRecord.provider || "Not recorded"}</dd>
                </div>
                <div>
                  <dt>Due-soon window</dt>
                  <dd>{workingRecord.reminderDays} days · status only</dd>
                </div>
                <div>
                  <dt>Last recorded cost</dt>
                  <dd>
                    {workingRecord.costItems?.length
                      ? formatMoney(workingRecord.totalCostPaise)
                      : "Not recorded"}
                  </dd>
                </div>
                {effectiveCategory === "SERVICE" && (
                  <div className={s.fullWidth}>
                    <dt>Manual odometer reading</dt>
                    <dd>
                      {workingRecord.odometerSource === "MANUAL" &&
                      workingRecord.manualOdometerKm != null
                        ? `${workingRecord.manualOdometerKm.toLocaleString("en-IN")} km · Manually entered`
                        : "Not recorded"}
                    </dd>
                  </div>
                )}
              </dl>
              {workingRecord.notes && (
                <div className={s.formSection}>
                  <h3>Notes</h3>
                  <p className={s.prewrap}>{workingRecord.notes}</p>
                </div>
              )}
              {!!workingRecord.costItems?.length && (
                <div className={s.formSection}>
                  <h3>Latest itemized cost</h3>
                  <ul className={s.costList}>
                    {workingRecord.costItems.map((item, index) => (
                      <li key={index}>
                        <span>{item.description}</span>
                        <span>{formatMoney(item.amountPaise)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={s.total}>
                    <span>Total</span>
                    <span>{formatMoney(workingRecord.totalCostPaise)}</span>
                  </div>
                </div>
              )}
              <div className={s.formSection}>
                <h3>Private attachments</h3>
                <p className={s.hint}>
                  Available only to accounts with access to this vehicle. JPG
                  and PNG, up to 2 MB each; maximum 5 files. Files are retained
                  with the record.
                </p>
                {workingRecord.attachments !== undefined &&
                  workingRecord.attachments.length === 0 && (
                    <p className={`${s.hint} ${s.footerNote}`}>
                      No images attached.
                    </p>
                  )}
                {workingRecord.attachments === undefined && (
                  <p className={s.hint}>
                    {reading
                      ? "Loading attachments…"
                      : "Attachments have not loaded."}
                  </p>
                )}
                {(workingRecord.attachments || []).map((attachment) => (
                  <div className={s.attachment} key={attachment.id}>
                    <div>
                      <p className={s.attachmentName}>
                        <FileImage
                          size={14}
                          aria-hidden="true"
                          style={{ display: "inline", marginRight: 6 }}
                        />
                        {attachment.filename}
                      </p>
                      <p className={s.hint}>
                        {Math.ceil(attachment.sizeBytes / 1024)} KB ·{" "}
                        {formatInstant(attachment.createdAt)}
                      </p>
                    </div>
                    <button
                      className={s.iconButton}
                      type="button"
                      aria-label={`Download ${attachment.filename}`}
                      disabled={downloadId !== null}
                      onClick={() =>
                        void download(attachment.id, attachment.filename)
                      }
                    >
                      {downloadId === attachment.id ? (
                        <Loader2
                          size={17}
                          className={s.spinner}
                          aria-hidden="true"
                        />
                      ) : (
                        <Download size={17} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                ))}
                {canManage &&
                  workingRecord.attachments !== undefined &&
                  workingRecord.state !== "ARCHIVED" &&
                  (workingRecord.attachments?.length ||
                    workingRecord.attachmentsCount ||
                    0) < 5 && (
                    <div className={s.formSection}>
                      <label className={s.field}>
                        Add a private image
                        <input
                          className={s.input}
                          type="file"
                          accept="image/jpeg,image/png"
                          disabled={locked}
                          onChange={(event) => {
                            const next = event.target.files?.[0] || null;
                            setError(null);
                            setFile(null);
                            if (!next) {
                              setDirty(false);
                              return;
                            }
                            try {
                              validateAttachment(next);
                              setFile(next);
                              setDirty(true);
                            } catch (error) {
                              event.target.value = "";
                              setError(
                                new MaintenanceApiError(
                                  (error as Error).message,
                                ),
                              );
                            }
                          }}
                        />
                      </label>
                      {file && (
                        <div className={`${s.actions} ${s.footerNote}`}>
                          <button
                            className={s.primary}
                            type="button"
                            onClick={() => void upload()}
                            disabled={locked}
                          >
                            {busy ? (
                              <Loader2
                                size={16}
                                className={s.spinner}
                                aria-hidden="true"
                              />
                            ) : (
                              <Paperclip size={16} aria-hidden="true" />
                            )}
                            Upload image
                          </button>
                          <span className={s.hint}>{file.name}</span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div className={s.formSection}>
                <h3>Record history</h3>
                {workingRecord.history === undefined ? (
                  <p className={s.hint}>
                    Full history and files are not loaded yet.{" "}
                    <button
                      className={s.linkButton}
                      type="button"
                      disabled={busy || reading}
                      onClick={() => void loadLatest()}
                    >
                      Load full history and attachments
                    </button>
                  </p>
                ) : workingRecord.history.length === 0 ? (
                  <p className={s.hint}>No history entries available.</p>
                ) : (
                  <ol className={s.costList}>
                    {workingRecord.history.map((entry) => (
                      <li
                        key={entry.id}
                        style={{
                          display: "block",
                          paddingBottom: 12,
                          borderBottom: "1px solid #223148",
                        }}
                      >
                        <p className={s.recordTitle}>
                          {ACTION_LABELS[entry.action] || entry.action}
                        </p>
                        <p className={s.hint}>
                          {formatInstant(entry.occurredAt)} · Version{" "}
                          {entry.version}
                          {entry.actor?.name ? ` · ${entry.actor.name}` : ""}
                        </p>
                        {entry.snapshot.dueDate && (
                          <p className={s.hint}>
                            Recorded due date:{" "}
                            {formatDate(entry.snapshot.dueDate)}
                          </p>
                        )}
                        {entry.snapshot.referenceNumber && (
                          <p className={s.hint}>
                            Reference: {entry.snapshot.referenceNumber}
                          </p>
                        )}
                        {entry.snapshot.provider && (
                          <p className={s.hint}>
                            Provider: {entry.snapshot.provider}
                          </p>
                        )}
                        {entry.details.completedDate && (
                          <p className={s.hint}>
                            Event date:{" "}
                            {formatDate(entry.details.completedDate)}
                          </p>
                        )}
                        {entry.details.costItems && (
                          <ul className={s.costList} style={{ marginTop: 8 }}>
                            {entry.details.costItems.map((item, index) => (
                              <li key={index}>
                                <span>{item.description}</span>
                                <span>{formatMoney(item.amountPaise)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {entry.details.manualOdometerKm != null && (
                          <p className={s.hint}>
                            Manual odometer:{" "}
                            {entry.details.manualOdometerKm.toLocaleString(
                              "en-IN",
                            )}{" "}
                            km
                          </p>
                        )}
                        {entry.details.notes && (
                          <p className={s.prewrap}>{entry.details.notes}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <p className={s.footerNote}>
                <ShieldCheck size={15} aria-hidden="true" />
                Only the recorded dates are used for due status. No automatic
                messages are sent.
              </p>
            </>
          )}
        </div>
        <div className={s.dialogFooter}>
          {mode === "view" ? (
            <>
              <button
                className={s.button}
                type="button"
                onClick={close}
                disabled={busy}
              >
                Close
              </button>
              {canManage &&
                workingRecord &&
                workingRecord.state !== "ARCHIVED" &&
                !dirty &&
                !uncertain && (
                  <>
                    <button
                      className={s.button}
                      type="button"
                      disabled={busy || reading}
                      onClick={() => onMode("archive", workingRecord)}
                    >
                      <Archive size={15} aria-hidden="true" />
                      Archive
                    </button>
                    {workingRecord.state === "ACTIVE" && (
                      <>
                        <button
                          className={s.button}
                          type="button"
                          onClick={() => onMode("edit", workingRecord)}
                          disabled={busy || reading}
                        >
                          Edit
                        </button>
                        <button
                          className={s.primary}
                          type="button"
                          disabled={busy || reading}
                          onClick={() => onMode("complete", workingRecord)}
                        >
                          <CheckCircle2 size={16} aria-hidden="true" />
                          {completionLabel(effectiveCategory)}
                        </button>
                      </>
                    )}
                  </>
                )}
            </>
          ) : (
            <>
              <button
                type="button"
                className={s.button}
                onClick={close}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={s.primary}
                disabled={busy || [401, 403, 409].includes(error?.status || 0)}
              >
                {busy ? (
                  <Loader2 size={16} className={s.spinner} aria-hidden="true" />
                ) : (
                  <Save size={16} aria-hidden="true" />
                )}
                {busy
                  ? "Saving…"
                  : uncertain
                    ? "Retry same save"
                    : mode === "archive"
                      ? "Archive record"
                      : mode === "complete"
                        ? isRenewal
                          ? "Save renewal"
                          : "Save completion"
                        : "Save record"}
              </button>
            </>
          )}
        </div>
      </form>
    </dialog>
  );
}
