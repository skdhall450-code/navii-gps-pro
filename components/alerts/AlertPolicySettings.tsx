"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BellOff, Plus, RefreshCw, Settings2 } from "lucide-react";
import {
  ALERT_POLICY_PRIORITIES,
  ALERT_POLICY_TYPES,
  AlertPolicyRequestError,
  policyWriteMayHaveCommitted,
  nextPolicySaveUncertainty,
  type PolicySaveRecoveryEvent,
  blankAlertPolicy,
  minuteToTime,
  timeToMinute,
  validateAlertPolicy,
  type AlertPolicy,
  type AlertPolicyInput,
  type PolicyVehicle,
} from "@/lib/alert-policies";

const API_BASE =
  process.env.NEXT_PUBLIC_NAVII_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.naviigps.com";
const fieldClass =
  "mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-[#07101f] px-3 py-2 text-sm text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 disabled:opacity-50";
const buttonClass =
  "rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50";
const typeLabel = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());

type PolicyResponse = {
  success?: boolean;
  message?: string;
  data?: AlertPolicy[];
  vehicles?: PolicyVehicle[];
  canManage?: boolean;
  truncated?: boolean;
};

export default function AlertPolicySettings({
  onUnauthorized,
}: {
  onUnauthorized: () => void;
}) {
  const [policies, setPolicies] = useState<AlertPolicy[]>([]);
  const [vehicles, setVehicles] = useState<PolicyVehicle[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AlertPolicy | null>(null);
  const [form, setForm] = useState<AlertPolicyInput>(blankAlertPolicy);
  const [saving, setSaving] = useState(false);
  const [uncertainSave, setUncertainSave] = useState(false);
  const uncertainSaveRef = useRef(false);
  const [simulating, setSimulating] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; text: string } | null>(
    null,
  );
  const simulationRef = useRef(false);
  const savingRef = useRef(false);
  const mounted = useRef(true);
  const nameRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const refreshRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const requests = useRef(new Set<AbortController>());
  const loadSequence = useRef(0);

  const recoverSave = useCallback((event: PolicySaveRecoveryEvent) => {
    const next = nextPolicySaveUncertainty(uncertainSaveRef.current, event);
    uncertainSaveRef.current = next;
    setUncertainSave(next);
  }, []);

  const request = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const isWrite =
        init.method === "PATCH" ||
        (init.method === "POST" && !path.endsWith("/simulate"));
      const token = localStorage.getItem("navii_access_token");
      if (!token) {
        onUnauthorized();
        throw new Error("Please sign in again.");
      }
      const controller = new AbortController();
      requests.current.add(controller);
      let timedOut = false;
      const timeout = window.setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, 15000);
      try {
        const response = await fetch(
          `${API_BASE}/api/gps/alert-policies${path}`,
          {
            ...init,
            signal: controller.signal,
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              ...init.headers,
            },
          },
        );
        if (response.status === 401) {
          onUnauthorized();
          throw new Error("Please sign in again.");
        }
        if (response.status === 404)
          throw new Error(
            path
              ? "This configuration or vehicle was not found or is no longer accessible. Cancel editing and refresh the list."
              : "Alert configuration is not available on this server yet. No configuration changes were made by this request.",
          );
        const data = await response.json().catch(() => {
          throw new AlertPolicyRequestError(
            "The server returned an unreadable response.",
            isWrite && policyWriteMayHaveCommitted(response.status),
          );
        });
        if (!data || typeof data !== "object" || Array.isArray(data))
          throw new AlertPolicyRequestError(
            "The server returned an invalid response.",
            isWrite && policyWriteMayHaveCommitted(response.status),
          );
        if (!response.ok || data.success !== true)
          throw new AlertPolicyRequestError(
            data.message || "Could not save or load alert settings.",
            isWrite && policyWriteMayHaveCommitted(response.status),
          );
        return data;
      } catch (error) {
        if (controller.signal.aborted && !timedOut)
          throw new DOMException("Request canceled", "AbortError");
        if (
          error instanceof TypeError ||
          (error instanceof DOMException && error.name === "AbortError")
        )
          throw new AlertPolicyRequestError(
            isWrite
              ? "The save request was interrupted."
              : "Could not load configurations. Check your connection and refresh.",
            isWrite,
          );
        throw error;
      } finally {
        window.clearTimeout(timeout);
        requests.current.delete(controller);
      }
    },
    [onUnauthorized],
  );

  const load = useCallback(async () => {
    const sequence = ++loadSequence.current;
    setLoading(true);
    setError("");
    try {
      const result: PolicyResponse = await request("");
      if (!Array.isArray(result.data) || !Array.isArray(result.vehicles))
        throw new Error("The server returned incomplete alert settings.");
      if (mounted.current && sequence === loadSequence.current) {
        setError("");
        recoverSave("REFRESH_SUCCEEDED");
        setPolicies(result.data);
        setVehicles(result.vehicles);
        setCanManage(result.canManage === true);
        setTruncated(result.truncated === true);
      }
    } catch (error) {
      if (
        mounted.current &&
        sequence === loadSequence.current &&
        !(error instanceof DOMException && error.name === "AbortError")
      )
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load alert settings.",
        );
    } finally {
      if (mounted.current && sequence === loadSequence.current)
        setLoading(false);
    }
  }, [request, recoverSave]);

  useEffect(() => {
    mounted.current = true;
    void load();
    const pending = requests.current;
    return () => {
      mounted.current = false;
      for (const request of pending) request.abort();
    };
  }, [load]);
  useEffect(() => {
    if (open) nameRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open && !loading && !saving && returnFocusRef.current) {
      returnFocusRef.current.focus();
      returnFocusRef.current = null;
    }
  }, [open, loading, saving]);

  async function simulate(policy: AlertPolicy) {
    if (simulationRef.current) return;
    simulationRef.current = true;
    setSimulating(policy.id);
    setPreview(null);
    setError("");
    try {
      const result = await request(
        `/${encodeURIComponent(policy.id)}/simulate`,
        {
          method: "POST",
          body: JSON.stringify({
            events: [
              {
                at: new Date().toISOString(),
                vehicleId: policy.vehicleId,
                type: policy.type,
              },
            ],
          }),
        },
      );
      const descriptions: Record<string, string> = {
        MATCH: "This synthetic event matches the saved configuration.",
        DISABLED:
          "Configuration is disabled, so this synthetic event does not match.",
        EVENT_MISMATCH:
          "This synthetic event does not match the saved vehicle or event type.",
        OUTSIDE_SCHEDULE: "The current time is outside the saved daily window.",
        COOLDOWN: "This synthetic event is inside the cooldown period.",
      };
      const description = descriptions[result.data?.[0]?.reason];
      if (
        !description ||
        result.mode !== "SIMULATION_ONLY" ||
        result.externalDelivery !== false
      )
        throw new Error("The server returned an invalid simulation result.");
      if (mounted.current)
        setPreview({
          id: policy.id,
          text: `${description} Dry run only; no alert or notification was created. Each preview starts with a fresh cooldown.`,
        });
    } catch (error) {
      if (mounted.current)
        setError(
          error instanceof Error
            ? error.message
            : "Unable to preview configuration.",
        );
    } finally {
      simulationRef.current = false;
      if (mounted.current) setSimulating(null);
    }
  }

  function closeForm() {
    if (savingRef.current) return;
    recoverSave("CANCEL");
    returnFocusRef.current = uncertainSaveRef.current
      ? refreshRef.current
      : editRef.current || addRef.current;
    setOpen(false);
    setEditing(null);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (savingRef.current || uncertainSaveRef.current) return;
    const validation = validateAlertPolicy(form);
    if (validation) {
      setError(validation);
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await request(
        editing ? `/${encodeURIComponent(editing.id)}` : "",
        {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify({
            ...form,
            name: form.name.trim(),
            timeZone: form.timeZone.trim(),
            ...(editing ? { revision: editing.revision } : {}),
          }),
        },
      );
      if (!result.data?.id || !Number.isInteger(result.data.revision))
        throw new AlertPolicyRequestError("Save result is uncertain.", true);
      if (!mounted.current) return;
      setOpen(false);
      setEditing(null);
      setPreview(null);
      setNotice(
        "Configuration saved. Live detection and external notifications are unchanged.",
      );
      returnFocusRef.current = addRef.current;
      await load();
    } catch (error) {
      if (mounted.current) {
        const uncertain =
          error instanceof AlertPolicyRequestError && error.uncertain;
        if (uncertain) recoverSave("UNCERTAIN_FAILURE");
        setError(
          uncertain
            ? "Save status is uncertain. Cancel this form, then refresh configurations before trying again; the save may already have completed."
            : error instanceof Error
              ? error.message
              : "Unable to save configuration.",
        );
      }
    } finally {
      savingRef.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  return (
    <section
      aria-labelledby="policy-heading"
      className="mb-6 rounded-2xl border border-sky-500/20 bg-[#0a1426]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5">
        <div>
          <h2
            id="policy-heading"
            className="flex items-center gap-2 text-lg font-bold"
          >
            <Settings2 aria-hidden="true" className="h-5 w-5 text-sky-400" />
            Alert configuration
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Save vehicle event policies for in-panel review and simulation.
            These settings do not change live alert detection.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            ref={refreshRef}
            type="button"
            className={`${buttonClass} border border-white/15 text-slate-300`}
            disabled={loading || saving || open}
            onClick={() => void load()}
            aria-label="Refresh alert configurations"
          >
            <RefreshCw
              aria-hidden="true"
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          {canManage && (
            <button
              ref={addRef}
              type="button"
              disabled={loading || saving || open || uncertainSave}
              className={`${buttonClass} flex items-center gap-2 bg-sky-600 text-white hover:bg-sky-500`}
              onClick={() => {
                editRef.current = null;
                setForm(blankAlertPolicy());
                setEditing(null);
                setOpen(true);
                setError("");
                setNotice("");
              }}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add configuration
            </button>
          )}
        </div>
      </div>
      <div className="p-5">
        <p className="mb-4 flex items-start gap-2 rounded-xl border border-slate-600/50 bg-slate-950/40 p-3 text-xs leading-5 text-slate-300">
          <BellOff
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
          />
          Email, WhatsApp and push delivery are OFF for every configuration
          here. Existing notification senders are unchanged.
        </p>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200"
          >
            {error}
          </p>
        )}
        {uncertainSave && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100"
          >
            Saving is locked until you cancel editing and successfully refresh
            the configuration list.
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200"
          >
            {notice}
          </p>
        )}
        {open && (
          <form
            onSubmit={save}
            aria-labelledby="policy-form-heading"
            aria-busy={saving}
            className="mb-5 rounded-xl border border-sky-400/25 bg-slate-950/40 p-4 sm:p-5"
          >
            <h3 id="policy-form-heading" className="mb-5 font-semibold">
              {editing ? "Edit configuration" : "New configuration"}
            </h3>
            <fieldset
              disabled={saving}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              <label className="text-sm text-slate-300">
                Event type
                <select
                  className={fieldClass}
                  value={form.type}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      type: event.target.value as AlertPolicyInput["type"],
                    })
                  }
                >
                  {ALERT_POLICY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {typeLabel(type)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Alert name
                <input
                  ref={nameRef}
                  required
                  maxLength={80}
                  className={fieldClass}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Evening vehicle alerts"
                />
              </label>
              <label className="text-sm text-slate-300">
                Vehicle
                <select
                  required
                  className={fieldClass}
                  value={form.vehicleId}
                  onChange={(event) =>
                    setForm({ ...form, vehicleId: event.target.value })
                  }
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicleNo}
                      {vehicle.name ? ` · ${vehicle.name}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Priority
                <select
                  className={fieldClass}
                  value={form.priority}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priority: event.target
                        .value as AlertPolicyInput["priority"],
                    })
                  }
                >
                  {ALERT_POLICY_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {typeLabel(priority)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Cooldown (minutes)
                <input
                  type="number"
                  required
                  min={1}
                  max={10080}
                  step={1}
                  className={fieldClass}
                  value={
                    Number.isNaN(form.cooldownMinutes)
                      ? ""
                      : form.cooldownMinutes
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      cooldownMinutes: event.target.valueAsNumber,
                    })
                  }
                />
                <span className="mt-1 block text-xs text-slate-400">
                  1–10,080 minutes between accepted simulated events.
                </span>
              </label>
              <div>
                <span className="text-sm text-slate-300">Schedule mode</span>
                <p className={`${fieldClass} flex items-center`}>
                  Daily time window
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Repeats every day in the selected timezone.
                </p>
              </div>
              <label className="text-sm text-slate-300">
                Start time
                <input
                  type="time"
                  required
                  className={fieldClass}
                  value={
                    Number.isNaN(form.startMinute)
                      ? ""
                      : minuteToTime(form.startMinute)
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      startMinute: timeToMinute(event.target.value),
                    })
                  }
                />
              </label>
              <label className="text-sm text-slate-300">
                End time
                <input
                  type="time"
                  required
                  className={fieldClass}
                  value={
                    Number.isNaN(form.endMinute)
                      ? ""
                      : minuteToTime(form.endMinute)
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      endMinute: timeToMinute(event.target.value),
                    })
                  }
                />
              </label>
              <label className="text-sm text-slate-300">
                Timezone
                <input
                  required
                  maxLength={100}
                  list="policy-timezones"
                  className={fieldClass}
                  value={form.timeZone}
                  onChange={(event) =>
                    setForm({ ...form, timeZone: event.target.value })
                  }
                  placeholder="Asia/Kolkata"
                />
                <datalist id="policy-timezones">
                  <option value="Asia/Kolkata" />
                  <option value="UTC" />
                  <option value="Asia/Dubai" />
                  <option value="Europe/London" />
                  <option value="Australia/Sydney" />
                </datalist>
              </label>
              <p className="text-xs leading-5 text-slate-400 sm:col-span-2 xl:col-span-3">
                Start is included, end is excluded. An end earlier than the
                start runs overnight. Times follow local clock changes. Calendar
                date ranges, weekdays, business hours and all-day mode are not
                supported yet.
              </p>
              <label className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm text-slate-200 sm:col-span-2 xl:col-span-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-sky-500 focus-visible:outline-2 focus-visible:outline-sky-400"
                  checked={form.enabled}
                  onChange={(event) =>
                    setForm({ ...form, enabled: event.target.checked })
                  }
                />
                <span>
                  Enable configuration for in-panel simulation
                  <span className="mt-1 block text-xs text-slate-400">
                    Does not activate live detection or send notifications. New
                    configurations start disabled.
                  </span>
                </span>
              </label>
            </fieldset>
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={closeForm}
                className={`${buttonClass} border border-white/15`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uncertainSave || vehicles.length === 0}
                className={`${buttonClass} bg-sky-600 text-white hover:bg-sky-500`}
              >
                {saving ? "Saving…" : "Save configuration"}
              </button>
            </div>
          </form>
        )}
        {loading ? (
          <p role="status" className="py-4 text-sm text-slate-400">
            Loading configurations…
          </p>
        ) : !error && policies.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">
            No configurations saved.
            {canManage
              ? " Add one to prepare a vehicle policy."
              : " Your administrator can create configurations."}
          </p>
        ) : (
          <ul className="grid gap-3 lg:grid-cols-2">
            {policies.map((policy) => (
              <li
                key={policy.id}
                className="rounded-xl border border-white/10 bg-slate-950/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold">{policy.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {policy.vehicle.vehicleNo} · {typeLabel(policy.type)} ·{" "}
                      {typeLabel(policy.priority)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[11px] ${policy.enabled ? "bg-sky-500/15 text-sky-300" : "bg-slate-500/15 text-slate-400"}`}
                  >
                    {policy.enabled ? "Config enabled" : "Config disabled"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Daily {minuteToTime(policy.startMinute)}–
                  {minuteToTime(policy.endMinute)}
                  {policy.endMinute < policy.startMinute
                    ? " (overnight)"
                    : ""}{" "}
                  · {policy.timeZone}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    {policy.cooldownMinutes} min cooldown · Revision{" "}
                    {policy.revision}
                  </p>
                  {canManage && (
                    <button
                      type="button"
                      disabled={open || saving || loading || uncertainSave}
                      className={`${buttonClass} border border-white/10 py-1.5 text-sky-300`}
                      onClick={(event) => {
                        editRef.current = event.currentTarget;
                        const {
                          name,
                          type,
                          vehicleId,
                          priority,
                          cooldownMinutes,
                          scheduleMode,
                          timeZone,
                          startMinute,
                          endMinute,
                          enabled,
                        } = policy;
                        setForm({
                          name,
                          type,
                          vehicleId,
                          priority,
                          cooldownMinutes,
                          scheduleMode,
                          timeZone,
                          startMinute,
                          endMinute,
                          enabled,
                          emailEnabled: false,
                          whatsappEnabled: false,
                          pushEnabled: false,
                        });
                        setEditing(policy);
                        setOpen(true);
                        setError("");
                        setNotice("");
                      }}
                    >
                      Edit<span className="sr-only"> {policy.name}</span>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  disabled={Boolean(simulating) || saving || open}
                  onClick={() => void simulate(policy)}
                  className={`${buttonClass} mt-3 border border-white/10 py-1.5 text-slate-300`}
                >
                  {simulating === policy.id ? "Previewing…" : "Preview now"}
                  <span className="sr-only"> {policy.name}</span>
                </button>
                {preview?.id === policy.id && (
                  <p
                    role="status"
                    className="mt-3 text-xs leading-5 text-sky-200"
                  >
                    {preview.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
        {truncated && (
          <p className="mt-3 text-xs text-amber-200">
            Showing the first 200 configurations and 500 eligible vehicles. Ask
            your administrator if a vehicle is missing.
          </p>
        )}
      </div>
    </section>
  );
}
