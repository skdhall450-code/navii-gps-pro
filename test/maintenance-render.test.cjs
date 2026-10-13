/* eslint-disable @typescript-eslint/no-require-imports -- This isolated CJS test installs a temporary TypeScript/CSS require loader for React server rendering. */
/* Server-rendered component contract checks; these are not browser-interaction tests. */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const root = path.resolve(__dirname, "..");
const previousResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  return previousResolve.call(
    this,
    request.startsWith("@/") ? path.join(root, request.slice(2)) : request,
    parent,
    ...args,
  );
};
require.extensions[".tsx"] = require.extensions[".ts"] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  });
  module._compile(result.outputText, filename);
};
require.extensions[".css"] = (module) => {
  module.exports = {};
};
const Workspace =
  require("../components/maintenance/MaintenanceWorkspace.tsx").default;
const Dialog =
  require("../components/maintenance/MaintenanceDialog.tsx").default;
const record = {
  id: "synthetic-record",
  version: 1,
  vehicleId: "synthetic-vehicle",
  vehicle: { id: "synthetic-vehicle", vehicleNo: "DEMO-001" },
  category: "SERVICE",
  state: "ACTIVE",
  dueStatus: "DUE_SOON",
  title: "Synthetic oil service",
  dueDate: "2026-10-21",
  reminderDays: 30,
  totalCostPaise: 0,
  costItems: [],
  manualOdometerKm: null,
  odometerSource: null,
  attachments: [],
  history: [],
  createdAt: "2026-10-11T10:00:00Z",
  updatedAt: "2026-10-11T10:00:00Z",
};
const props = {
  mode: "view",
  record,
  category: "SERVICE",
  vehicles: [record.vehicle],
  canManage: true,
  onClose() {},
  onMode() {},
  onSaved() {},
};
const render = (patch) =>
  renderToStaticMarkup(React.createElement(Dialog, { ...props, ...patch }));

test("workspace renders all categories with accessible filters and honest loading totals", () => {
  const html = renderToStaticMarkup(React.createElement(Workspace));
  for (const label of [
    "Maintenance &amp; Documents",
    "Services",
    "Registration",
    "Insurance",
    "Inspections",
    "Challans",
    "Search records",
    "All vehicles",
    "All statuses",
    "Due from",
    "Due to",
    "Loading records",
  ])
    assert.ok(html.includes(label), label);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /Asia\/Kolkata/);
  assert.match(html, /saving does not send email, SMS or push notifications/);
});
test("view-only dialog has no edit, completion, archive or upload controls", () => {
  const html = render({ canManage: false });
  assert.doesNotMatch(
    html,
    />Edit<|>Archive<|>Mark completed<|Add a private image|Upload image/,
  );
  assert.match(html, /aria-labelledby="maintenance-dialog-title"/);
  assert.match(html, /Manual odometer reading/);
  assert.match(html, /Not recorded/);
  assert.doesNotMatch(html, /0 km|₹0/);
});
test("archive retains history; archived record cannot be edited or uploaded", () => {
  const html = render({
    record: { ...record, state: "ARCHIVED", dueStatus: "ARCHIVED" },
  });
  assert.doesNotMatch(
    html,
    />Edit<|>Archive<|>Mark completed<|Add a private image/,
  );
  assert.match(
    render({ mode: "archive" }),
    /history and private files are retained/,
  );
});
test("create labels all fields and does not promise unsupported notifications or PDF files", () => {
  const html = render({ mode: "create", record: undefined });
  for (const label of [
    "Vehicle *",
    "Title *",
    "Due date",
    "Reference / bill number",
    "Provider / workshop",
    "Status label only. No notifications are sent.",
    "Save record",
    "Cancel",
  ])
    assert.ok(html.includes(label), label);
  assert.match(html, /maxLength="120"/);
  assert.match(html, /maxLength="2000"/);
  assert.match(html, /JPG or PNG/);
  assert.doesNotMatch(html, /type="file"/);
});
test("manual odometer exists only on service completion and unknown cost stays unknown", () => {
  const html = render({ mode: "complete" });
  assert.match(html, /Manual odometer reading \(km, optional\)/);
  assert.match(html, /not a GPS or sensor reading/);
  assert.match(html, /Not recorded/);
  assert.doesNotMatch(
    render({ mode: "complete", record: { ...record, category: "INSPECTION" } }),
    /Manual odometer reading/,
  );
  const challan = render({
    mode: "complete",
    record: { ...record, category: "CHALLAN" },
  });
  assert.match(challan, /Record payment/);
  assert.doesNotMatch(challan, /Next due date|Manual odometer reading/);
});
test("renewal shows existing expiry and a clearly labelled new expiry", () => {
  const html = render({
    mode: "complete",
    record: { ...record, category: "INSURANCE" },
  });
  assert.match(html, /Record renewal/);
  assert.match(html, /Current expiry/);
  assert.match(html, /New expiry date/);
  assert.match(html, /Save renewal/);
});
test("history renders old references and itemized costs as escaped text", () => {
  const html = render({
    record: {
      ...record,
      history: [
        {
          id: "h",
          version: 1,
          action: "RENEWED",
          occurredAt: "2026-10-11T10:00:00Z",
          actor: { id: "actor", name: "Example staff" },
          snapshot: {
            dueDate: "2026-10-21",
            referenceNumber: "<script>old-ref</script>",
            provider: "Old insurer",
          },
          details: {
            costItems: [{ description: "Oil", amountPaise: 12345 }],
            manualOdometerKm: 0,
          },
        },
      ],
    },
  });
  assert.match(html, /Old insurer/);
  assert.match(html, /123.45/);
  assert.match(html, /Manual odometer: 0 km/);
  assert.match(html, /&lt;script&gt;old-ref&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>old-ref/);
});
test("mutation record without detail does not claim missing attachment data is empty", () => {
  const html = render({
    record: {
      ...record,
      attachments: undefined,
      history: undefined,
      attachmentsCount: 2,
    },
  });
  assert.match(html, /Attachments have not loaded/);
  assert.doesNotMatch(html, /No images attached/);
  assert.match(html, /Load full history and attachments/);
});
