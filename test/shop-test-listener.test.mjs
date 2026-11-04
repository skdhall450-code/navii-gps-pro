import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  listenerProof,
  verifyListenerProof,
  isVerifiedLoopbackSocket,
} from "../lib/shop-test-listener.ts";
const secret = "offline-fixture-harness-not-real-secret";
const origin = "http://127.0.0.1:3000";
test("dedicated launcher refuses production before opening a listener", () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/start-shop-test.mjs", "39122"],
    {
      env: {
        ...process.env,
        NODE_ENV: "production",
        SHOP_TEST_UI_ENABLED: "1",
        SHOP_TEST_HARNESS_TOKEN: secret,
      },
      encoding: "utf8",
      timeout: 15000,
    },
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /Explicit development test configuration required/,
  );
});
test("only a bound loopback listener and loopback socket can attest requests", () => {
  assert.equal(
    isVerifiedLoopbackSocket("127.0.0.1", "127.0.0.1", "127.0.0.1"),
    true,
  );
  for (const values of [
    ["0.0.0.0", "127.0.0.1", "127.0.0.1"],
    ["::", "::1", "::1"],
    ["127.0.0.1", "127.0.0.1", "203.0.113.2"],
    ["127.0.0.1", "192.0.2.1", "127.0.0.1"],
  ])
    assert.equal(isVerifiedLoopbackSocket(...values), false);
});
test("Host and Origin spoofing cannot replace method/path-bound listener proof", () => {
  const now = Date.now(),
    time = String(now),
    proof = listenerProof("POST", "/api/shop-test", time, origin, secret);
  assert.equal(
    verifyListenerProof(
      "POST",
      "/api/shop-test",
      time,
      origin,
      proof,
      secret,
      now,
    ),
    true,
  );
  for (const [method, path, t, p, key, clock] of [
    ["POST", "/api/shop-test", time, null, secret, now],
    ["POST", "/api/shop-test", time, "a".repeat(64), secret, now],
    ["GET", "/api/shop-test", time, proof, secret, now],
    ["POST", "/other", time, proof, secret, now],
    ["POST", "/api/shop-test", time, proof, "wrong-secret", now],
    ["POST", "/api/shop-test", time, proof, secret, now + 10001],
    ["POST", "/api/shop-test", time, proof, secret, now - 10001],
  ])
    assert.equal(
      verifyListenerProof(method, path, t, origin, p, key, clock),
      false,
    );
  assert.equal(
    verifyListenerProof(
      "POST",
      "/api/shop-test",
      time,
      "http://localhost:3000",
      proof,
      secret,
      now,
    ),
    false,
  );
});
