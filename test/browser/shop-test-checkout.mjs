import assert from "node:assert/strict";
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";

const base = "http://127.0.0.1:39120";
let server,
  browser,
  log = "";
async function start(mode) {
  console.log(`Starting isolated checkout fixture: ${mode}`);
  server = spawn(
    process.execPath,
    mode === "isolated"
      ? ["scripts/start-shop-test.mjs", "39120"]
      : [
          "node_modules/next/dist/bin/next",
          mode,
          "--hostname",
          "127.0.0.1",
          "--port",
          "39120",
        ],
    {
      env: {
        ...process.env,
        NODE_ENV: mode === "start" ? "production" : "development",
        SHOP_TEST_UI_ENABLED: "1",
        SHOP_TEST_HARNESS_TOKEN: "offline-harness-fixture-not-a-real-key",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  for (const stream of [server.stdout, server.stderr])
    stream.on("data", (data) => {
      log = (log + data).slice(-6000);
    });
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw Error(log);
    try {
      const r = await fetch(base + "/shop-test");
      if (r.status === 200 || r.status === 404) return r.status;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw Error("Test server did not start: " + log);
}
async function stop() {
  if (server?.exitCode === null) {
    const child = server;
    const exit = new Promise((resolve) => child.once("exit", resolve));
    child.kill();
    const deadline = setTimeout(() => {
      if (child.exitCode === null) {
        console.log(
          "Stopping fixture child after bounded graceful-shutdown wait",
        );
        child.kill("SIGKILL");
      }
    }, 5000);
    try {
      await exit;
    } finally {
      clearTimeout(deadline);
    }
  }
}
try {
  assert.equal(
    await start("start"),
    404,
    "Production must refuse test UI even with opt-in",
  );
  assert.equal(
    (
      await fetch(base + "/api/shop-test", {
        method: "POST",
        headers: { Origin: base, "Content-Type": "application/json" },
        body: "{}",
      })
    ).status,
    404,
  );
  await stop();
  assert.equal(await start("dev"), 200);
  assert.equal(
    (
      await fetch(base + "/api/shop-test", {
        method: "POST",
        headers: {
          Host: "127.0.0.1:39120",
          Origin: base,
          "Content-Type": "application/json",
          "x-shop-listener-time": String(Date.now()),
          "x-shop-listener-proof": "a".repeat(64),
        },
        body: "{}",
      })
    ).status,
    404,
    "Spoofed Host/Origin/proof on direct Next dev cannot reach proxy",
  );
  await stop();
  assert.equal(await start("isolated"), 200);
  assert.equal(
    (
      await fetch(base + "/api/shop-test", {
        method: "POST",
        headers: { Origin: base, "Content-Type": "application/json" },
        body: "{}",
      })
    ).status,
    400,
    "Verified loopback launcher reaches validation without contacting backend",
  );
  assert.equal(
    (
      await fetch(base + "/api/shop-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
    ).status,
    404,
    "Missing Origin refused before proxying",
  );
  assert.equal(
    (
      await fetch(base + "/api/shop-test", {
        method: "POST",
        headers: {
          Origin: "https://example.test",
          "Content-Type": "application/json",
        },
        body: "{}",
      })
    ).status,
    404,
    "Cross-origin refused before proxying",
  );
  browser = await chromium.launch({
    headless: true,
    ...(process.env.SHOP_BROWSER_EXECUTABLE
      ? { executablePath: process.env.SHOP_BROWSER_EXECUTABLE }
      : {}),
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const creates = [];
  let paid = false,
    confirmed = false,
    statusChecks = 0;
  const summary = () => ({
    id: "00000000-0000-4000-8000-000000000001",
    status: paid ? "PAID" : "PAYMENT_PENDING",
    amount: 252500,
    currency: "INR",
    keyId: "rzp_test_fixture",
    razorpayOrderId: "order_fixture",
  });
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.href === "https://checkout.razorpay.com/v1/checkout.js")
      return route.fulfill({
        contentType: "text/javascript",
        body: 'window.Razorpay=class {constructor(options){this.options=options;}open(){this.options.handler({razorpay_payment_id:"pay_fixture",razorpay_signature:"fixture"});}};',
      });
    if (url.origin !== base) return route.abort();
    if (url.pathname === "/api/shop-test") {
      const input = route.request().postDataJSON();
      if (input.action === "create") {
        creates.push(input);
        if (creates.length === 1)
          return route.fulfill({
            status: 400,
            json: { message: "Invalid contact details" },
          });
        if (creates.length === 2)
          return route.fulfill({
            status: 503,
            json: { message: "Temporary setup delay. Retry same attempt." },
          });
      }
      if (input.action === "confirm") {
        confirmed = true;
        return route.fulfill({
          status: 503,
          json: { message: "Verification pending" },
        });
      }
      if (input.action === "status" && confirmed && ++statusChecks > 1)
        paid = true;
      return route.fulfill({ json: summary() });
    }
    return route.continue();
  });
  await page.goto(base + "/shop-test");
  const consent = page.getByRole("button", {
    name: "Necessary Only",
    exact: true,
  });
  if (await consent.isVisible()) await consent.click();
  for (const [name, value] of Object.entries({
    name: "Fixture Buyer",
    email: "fixture@example.test",
    phone: "9876543210",
    address: "Fixture address",
    city: "Fixture city",
    state: "Punjab",
    postalCode: "140603",
  }))
    await page.locator(`[name="${name}"]`).fill(value);
  await page
    .getByRole("button", { name: "Create test order", exact: true })
    .click();
  await page.getByText("Invalid contact details", { exact: true }).waitFor();
  assert.equal(
    await page.locator('[name="phone"]').isEnabled(),
    true,
    "Validation rejection unlocks customer fields",
  );
  await page.locator('[name="phone"]').fill("9876543211");
  await page
    .getByRole("button", { name: "Create test order", exact: true })
    .click();
  await page
    .getByText("Temporary setup delay. Retry same attempt.", { exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Retry same test order", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Open Razorpay Test Mode", exact: true })
    .waitFor();
  assert.equal(creates.length, 3);
  assert.notEqual(
    creates[0].key,
    creates[1].key,
    "Rejected input starts a corrected attempt",
  );
  assert.equal(creates[1].payload.customer.phone, "9876543211");
  assert.equal(creates[1].key, creates[2].key);
  assert.equal(creates[1].access, creates[2].access);
  assert.deepEqual(creates[1].payload, creates[2].payload);
  assert.equal(creates[1].payload.amount, undefined);
  assert.ok((await page.locator("main").innerText()).includes("2,525.00"));
  await page
    .getByRole("button", { name: "Open Razorpay Test Mode", exact: true })
    .click();
  await page
    .getByText(
      "Payment confirmation pending. Check status; do not pay again.",
      { exact: true },
    )
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Open Razorpay Test Mode", exact: true })
      .count(),
    0,
    "Pending verification cannot reopen payment",
  );
  assert.equal(
    await page
      .getByText(
        "Test payment verified by server. No delivery will be created.",
        { exact: true },
      )
      .count(),
    0,
  );
  await page
    .getByRole("button", { name: "Check server status", exact: true })
    .click();
  await page
    .getByText(
      "Status: PAYMENT_PENDING. Keep this attempt; do not pay again.",
      { exact: true },
    )
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Open Razorpay Test Mode", exact: true })
      .count(),
    0,
    "Pending server status must not unlock another payment",
  );
  await page
    .getByRole("button", { name: "Check server status", exact: true })
    .click();
  await page
    .getByText(
      "Test payment verified by server. No delivery will be created.",
      { exact: true },
    )
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Open Razorpay Test Mode", exact: true })
      .count(),
    0,
  );
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await mkdir("test-results/shop-test", { recursive: true });
  await page.screenshot({
    path: "test-results/shop-test/verified-mobile.png",
    fullPage: true,
  });
  console.log(
    "PASS: production refusal, retry identity, canonical total, pending confirmation and server-verified status; provider requests mocked.",
  );
} finally {
  await browser?.close();
  await stop();
}
