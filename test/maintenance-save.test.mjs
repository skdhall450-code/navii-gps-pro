import assert from "node:assert/strict";
import test from "node:test";
import { MaintenanceSaveAttempt } from "../lib/maintenance-save.ts";
const operation = () => ({
  path: "",
  method: "POST",
  body: { idempotencyKey: "synthetic-key-001", title: "Oil service" },
});
test("repeated clicks while saving never start another write", () => {
  const attempt = new MaintenanceSaveAttempt();
  assert.ok(attempt.begin(operation));
  assert.equal(
    attempt.begin(() => {
      throw Error("must not run");
    }),
    null,
  );
  attempt.succeeded();
  assert.ok(attempt.begin(operation));
});
test("uncertain retry reuses identical payload, key and version despite changed input", () => {
  const attempt = new MaintenanceSaveAttempt();
  const input = {
    path: "/record/complete",
    method: "POST",
    body: {
      version: 3,
      completedDate: "2026-10-11",
      costItems: [{ description: "Oil", amountPaise: 1001 }],
    },
  };
  const first = attempt.begin(() => input);
  input.body.version = 4;
  input.body.costItems[0].amountPaise = 9000;
  attempt.failed(true);
  const second = attempt.begin(() => {
    throw Error("must not rebuild");
  });
  assert.deepEqual(second, first);
  assert.equal(second.body.version, 3);
  assert.equal(second.body.costItems[0].amountPaise, 1001);
});
test("definitive rejection permits corrected data while preserving no queued writes", () => {
  const attempt = new MaintenanceSaveAttempt();
  attempt.begin(operation);
  attempt.failed(false);
  const changed = attempt.begin(() => ({
    ...operation(),
    body: { version: 4, title: "Corrected title" },
  }));
  assert.equal(changed.body.title, "Corrected title");
  attempt.succeeded();
});
test("validation failure does not lock the editor or create a pending request", () => {
  const attempt = new MaintenanceSaveAttempt();
  assert.throws(() =>
    attempt.begin(() => {
      throw Error("invalid");
    }),
  );
  assert.ok(attempt.begin(operation));
});

const { LatestMaintenanceRead } = await import("../lib/maintenance-save.ts");
const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};
test("slow View cannot replace a newer Add dialog or discard its draft", async () => {
  const gate = new LatestMaintenanceRead();
  const response = deferred();
  let screen = "list";
  const request = gate.begin();
  const read = response.promise.then(() => {
    if (gate.isCurrent(request)) screen = "old-record";
  });
  gate.cancel();
  screen = "create-with-entered-draft";
  response.resolve();
  await read;
  assert.equal(screen, "create-with-entered-draft");
  assert.equal(request.signal.aborted, true);
});
test("out-of-order View requests only show the most recently chosen record", async () => {
  const gate = new LatestMaintenanceRead();
  const a = deferred();
  const b = deferred();
  let screen = "";
  const requestA = gate.begin();
  const readA = a.promise.then(() => {
    if (gate.isCurrent(requestA)) screen = "A";
  });
  const requestB = gate.begin();
  const readB = b.promise.then(() => {
    if (gate.isCurrent(requestB)) screen = "B";
  });
  b.resolve();
  await readB;
  a.resolve();
  await readA;
  assert.equal(screen, "B");
});
test("Close or navigation cancels any pending record opening", async () => {
  const gate = new LatestMaintenanceRead();
  const response = deferred();
  let opened = false;
  const request = gate.begin();
  const read = response.promise.then(() => {
    if (gate.isCurrent(request)) opened = true;
  });
  gate.cancel();
  response.resolve();
  await read;
  assert.equal(opened, false);
});
