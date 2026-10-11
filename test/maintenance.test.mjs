import assert from "node:assert/strict";
import test from "node:test";
import {
  canManageMaintenance,
  completionInput,
  costItemsFromForm,
  editRecordForm,
  formatDate,
  formatInstant,
  formatMoney,
  isDateOnly,
  newRecordForm,
  parseMoney,
  recordInput,
  todayInIndia,
  validateAttachment,
  validateDateRange,
} from "../lib/maintenance.ts";
import {
  buildMaintenanceQuery,
  maintenanceRequest,
  MaintenanceApiError,
} from "../lib/maintenance-api.ts";

const form = {
  ...newRecordForm("SERVICE", "synthetic-vehicle"),
  title: "Oil service",
  dueDate: "2026-10-11",
};

test("calendar dates reject rollover and unsupported years, preserve leap days", () => {
  for (const value of [
    "2026-02-29",
    "2026-02-31",
    "10/11/2026",
    "2026-10-11T00:00:00Z",
    "1999-12-31",
    "2101-01-01",
    "",
  ])
    assert.equal(isDateOnly(value), false, value);
  for (const value of ["2024-02-29", "2026-10-11", "2000-01-01", "2100-12-31"])
    assert.equal(isDateOnly(value), true, value);
  assert.equal(todayInIndia(new Date("2026-10-10T18:29:59Z")), "2026-10-10");
  assert.equal(todayInIndia(new Date("2026-10-10T18:30:00Z")), "2026-10-11");
  assert.equal(formatDate(null), "Not recorded");
  assert.equal(formatDate("2026-02-31"), "Not recorded");
  assert.match(formatDate("2026-10-11"), /11.*Oct.*2026/);
});

test("money uses integer paise and rejects hidden rounding, negative, exponent or excess amounts", () => {
  assert.equal(parseMoney("0"), 0);
  assert.equal(parseMoney("10.01"), 1001);
  assert.equal(parseMoney("12.5"), 1250);
  assert.equal(parseMoney("10000000.00"), 1000000000);
  for (const value of [
    "",
    "-1",
    "1.001",
    "1e3",
    "NaN",
    "Infinity",
    "1,000",
    "10000000.01",
  ])
    assert.throws(() => parseMoney(value), value);
  assert.equal(
    costItemsFromForm([
      { description: " Oil ", amount: "10.01" },
      { description: "Labour", amount: "0.09" },
    ]).reduce((sum, item) => sum + item.amountPaise, 0),
    1010,
  );
  assert.throws(() => costItemsFromForm([{ description: "", amount: "1" }]));
  assert.throws(() =>
    costItemsFromForm([
      { description: "A", amount: "10000000" },
      { description: "B", amount: "1" },
    ]),
  );
  assert.throws(() =>
    costItemsFromForm(Array(31).fill({ description: "A", amount: "0" })),
  );
  assert.match(formatMoney(12345), /123.45/);
});

test("record form validates required fields, date order and due-soon window", () => {
  assert.deepEqual(recordInput(form), {
    vehicleId: "synthetic-vehicle",
    category: "SERVICE",
    title: "Oil service",
    dueDate: "2026-10-11",
    validFromDate: undefined,
    referenceNumber: undefined,
    provider: undefined,
    notes: undefined,
    reminderDays: 30,
  });
  for (const patch of [
    { vehicleId: "" },
    { title: "" },
    { title: "x".repeat(121) },
    { dueDate: "2026-02-31" },
    { validFromDate: "2026-10-12" },
    { reminderDays: "-1" },
    { reminderDays: "91" },
    { reminderDays: "1.5" },
    { notes: "x".repeat(2001) },
  ])
    assert.throws(() => recordInput({ ...form, ...patch }));
  assert.equal(recordInput({ ...form, reminderDays: "0" }).reminderDays, 0);
  assert.equal(
    validateDateRange("2026-10-12", "2026-10-11"),
    "The start date must be on or before the end date.",
  );
  assert.equal(validateDateRange("2026-10-11", "2026-10-11"), null);
  assert.equal(validateDateRange("", ""), null);
});

test("read-only roles and attachments enforce the server contract", () => {
  for (const role of ["ADMIN", "SUPER_ADMIN", "DEALER"])
    assert.equal(canManageMaintenance(role), true);
  for (const role of ["CUSTOMER", "USER", undefined, "admin"])
    assert.equal(canManageMaintenance(role), false);
  validateAttachment({ type: "image/png", size: 2 * 1024 * 1024 });
  validateAttachment({ type: "image/jpeg", size: 1 });
  for (const file of [
    { type: "application/pdf", size: 100 },
    { type: "image/svg+xml", size: 100 },
    { type: "image/png", size: 0 },
    { type: "image/png", size: 2097153 },
  ])
    assert.throws(() => validateAttachment(file));
});

test("query carries inclusive due-date filters and always bounds the page", () => {
  const query = new URLSearchParams(
    buildMaintenanceQuery(
      "INSURANCE",
      {
        vehicleId: "vehicle/a",
        search: " a & b ",
        dueStatus: "OVERDUE",
        fromDate: "2026-01-01",
        toDate: "2026-12-31",
      },
      20,
    ),
  );
  assert.equal(query.get("limit"), "20");
  assert.equal(query.get("offset"), "20");
  assert.equal(query.get("search"), "a & b");
  assert.equal(query.get("vehicleId"), "vehicle/a");
  assert.equal(query.get("category"), "INSURANCE");
});

test("editing null fields keeps optional values blank, never fabricates odometer values", () => {
  const edited = editRecordForm({
    vehicleId: "v",
    category: "SERVICE",
    title: "A",
    dueDate: "2026-10-11",
    reminderDays: 0,
  });
  assert.equal(edited.validFromDate, "");
  assert.equal(edited.reminderDays, "0");
  assert.equal("manualOdometerKm" in edited, false);
});

// No live API requests. Synthetic session exists only for these request-adapter tests.
const originalWindow = globalThis.window;
const originalStorage = globalThis.localStorage;
globalThis.window = {};
globalThis.localStorage = { getItem: () => "synthetic-test-token" };
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
test("write adapter never automatically retries ambiguous writes and carries only session auth", async () => {
  let count = 0;
  await assert.rejects(
    maintenanceRequest(
      "/test",
      { method: "POST", body: '{"idempotencyKey":"synthetic"}' },
      async (_url, init) => {
        count++;
        assert.equal(
          init.headers.get("Authorization"),
          "Bearer synthetic-test-token",
        );
        assert.equal(init.headers.get("Content-Type"), "application/json");
        throw new TypeError("network");
      },
    ),
    (error) => error instanceof MaintenanceApiError && error.uncertain,
  );
  assert.equal(count, 1);
  await assert.rejects(
    maintenanceRequest("/test", { method: "POST" }, async () => json({}, 500)),
    (error) => error.uncertain,
  );
  await assert.rejects(
    maintenanceRequest("/test", {}, async () => json({}, 500)),
    (error) => !error.uncertain,
  );
});
test("auth, conflict and validation errors are definitive and unreadable write success is ambiguous", async () => {
  for (const status of [400, 401, 403, 404, 409])
    await assert.rejects(
      maintenanceRequest("/test", { method: "POST" }, async () =>
        json({ message: "Invalid request" }, status),
      ),
      (error) => error.status === status && !error.uncertain,
    );
  await assert.rejects(
    maintenanceRequest(
      "/test",
      { method: "POST" },
      async () => new Response("<html>"),
    ),
    (error) => error.uncertain,
  );
  await assert.rejects(
    maintenanceRequest("/test", {}, async () => {
      throw Object.assign(new Error("cancelled"), { name: "AbortError" });
    }),
    (error) => error.name === "AbortError",
  );
});
test.after(() => {
  globalThis.window = originalWindow;
  globalThis.localStorage = originalStorage;
});

const completionForm = {
  completedDate: "2026-10-11",
  nextDueDate: "",
  validFromDate: "",
  referenceNumber: "",
  provider: "",
  notes: "",
  manualOdometerKm: "",
  costItems: [],
};
const baseRecord = { version: 3, category: "SERVICE", dueDate: "2026-10-10" };
test("completion keeps unknown odometer absent and explicit zero manual", () => {
  const empty = completionInput(baseRecord, completionForm, "2026-10-11");
  assert.equal("manualOdometerKm" in empty, false);
  assert.deepEqual(empty.costItems, []);
  assert.equal(empty.version, 3);
  assert.equal(
    completionInput(
      baseRecord,
      { ...completionForm, manualOdometerKm: "0" },
      "2026-10-11",
    ).manualOdometerKm,
    0,
  );
  for (const reading of ["-1", "1.5", "10000001", "1e3"])
    assert.throws(() =>
      completionInput(
        baseRecord,
        { ...completionForm, manualOdometerKm: reading },
        "2026-10-11",
      ),
    );
  assert.equal(
    "manualOdometerKm" in
      completionInput(
        { ...baseRecord, category: "INSPECTION" },
        { ...completionForm, manualOdometerKm: "50" },
        "2026-10-11",
      ),
    false,
  );
});
test("completion enforces calendar order and permits dated next service only", () => {
  assert.throws(() =>
    completionInput(
      baseRecord,
      { ...completionForm, completedDate: "2026-10-12" },
      "2026-10-11",
    ),
  );
  assert.throws(() =>
    completionInput(
      baseRecord,
      { ...completionForm, nextDueDate: "2026-10-11" },
      "2026-10-11",
    ),
  );
  assert.equal(
    completionInput(
      baseRecord,
      { ...completionForm, nextDueDate: "2026-12-11" },
      "2026-10-11",
    ).nextDueDate,
    "2026-12-11",
  );
  assert.throws(() =>
    completionInput(
      { ...baseRecord, category: "CHALLAN" },
      { ...completionForm, nextDueDate: "2026-12-11" },
      "2026-10-11",
    ),
  );
});
test("renewal must advance previous expiry and records exact itemized paise", () => {
  const record = {
    ...baseRecord,
    category: "INSURANCE",
    dueDate: "2026-10-31",
  };
  for (const nextDueDate of ["", "2026-10-31", "2026-10-10"])
    assert.throws(() =>
      completionInput(record, { ...completionForm, nextDueDate }, "2026-10-11"),
    );
  assert.throws(() =>
    completionInput(
      record,
      {
        ...completionForm,
        nextDueDate: "2027-10-31",
        validFromDate: "2027-11-01",
      },
      "2026-10-11",
    ),
  );
  const input = completionInput(
    record,
    {
      ...completionForm,
      nextDueDate: "2027-10-31",
      costItems: [{ description: "Premium", amount: "2000.01" }],
    },
    "2026-10-11",
  );
  assert.equal(input.dueDate, "2027-10-31");
  assert.deepEqual(input.costItems, [
    { description: "Premium", amountPaise: 200001 },
  ]);
  assert.equal(input.referenceNumber, null);
  assert.equal("nextDueDate" in input, false);
});

test("read timeout cancels the request and remains retryable, never an uncertain write", async () => {
  let signal;
  await assert.rejects(
    maintenanceRequest(
      "/test",
      {},
      async (_url, init) => {
        signal = init.signal;
        return new Promise(() => {});
      },
      5,
    ),
    (error) =>
      error instanceof MaintenanceApiError &&
      !error.uncertain &&
      /timed out/.test(error.message),
  );
  assert.equal(signal.aborted, true);
});
test("write timeout is explicitly uncertain and performs no automatic retry", async () => {
  let calls = 0;
  await assert.rejects(
    maintenanceRequest(
      "/test",
      { method: "POST" },
      async () => {
        calls++;
        return new Promise(() => {});
      },
      5,
    ),
    (error) => error.uncertain && /same save/.test(error.message),
  );
  assert.equal(calls, 1);
});
test("response-body parsing is also deadline bounded", async () => {
  await assert.rejects(
    maintenanceRequest(
      "/test",
      {},
      async () => ({
        ok: true,
        status: 200,
        json: () => new Promise(() => {}),
      }),
      5,
    ),
    (error) => /timed out/.test(error.message),
  );
});
test("cancelled navigation returns AbortError without waiting for an uncooperative response", async () => {
  const controller = new AbortController();
  let calls = 0;
  const pending = maintenanceRequest(
    "/test",
    { signal: controller.signal },
    async () => {
      calls++;
      return new Promise(() => {});
    },
    500,
  );
  controller.abort();
  await assert.rejects(pending, (error) => error.name === "AbortError");
  assert.equal(calls, 1);
  await assert.rejects(
    maintenanceRequest("/test", { signal: controller.signal }, async () => {
      calls++;
    }),
    (error) => error.name === "AbortError",
  );
  assert.equal(calls, 1);
});

test("audit timestamps use India day across midnight while due dates stay date-only", () => {
  assert.match(formatInstant("2026-10-11T20:00:00Z"), /12 Oct 2026/);
  assert.match(formatInstant("2026-10-11T20:00:00Z"), /1:30/);
  assert.match(formatInstant("2026-10-11T18:29:00Z"), /11 Oct 2026/);
  assert.match(formatDate("2026-10-11"), /11 Oct 2026/);
  assert.equal(formatInstant("bad"), "Not recorded");
});
