import http from "node:http";
import next from "next";
import {
  isVerifiedLoopbackSocket,
  listenerProof,
} from "../lib/shop-test-listener.ts";

if (
  process.env.NODE_ENV === "production" ||
  process.env.SHOP_TEST_UI_ENABLED !== "1" ||
  (process.env.SHOP_TEST_HARNESS_TOKEN?.length ?? 0) < 32
)
  throw Error("Explicit development test configuration required");
const port = Number(process.argv[2] ?? "3000");
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw Error("Invalid local test port");
const app = next({ dev: true, hostname: "127.0.0.1", port });
await app.prepare();
const handle = app.getRequestHandler();
const server = http.createServer((req, res) => {
  const address = server.address();
  if (
    !address ||
    typeof address === "string" ||
    !isVerifiedLoopbackSocket(
      address.address,
      req.socket.localAddress,
      req.socket.remoteAddress,
    )
  ) {
    res.writeHead(403);
    res.end();
    return;
  }
  // Untrusted callers cannot supply an attestation or alter forwarded origin.
  delete req.headers["x-shop-listener-proof"];
  delete req.headers["x-shop-listener-time"];
  delete req.headers["x-shop-listener-origin"];
  delete req.headers["x-forwarded-host"];
  delete req.headers["x-forwarded-proto"];
  if (![`127.0.0.1:${port}`, `localhost:${port}`].includes(req.headers.host)) {
    res.writeHead(400);
    res.end();
    return;
  }
  const origin = `http://${req.headers.host}`;
  const path = new URL(req.url ?? "/", `http://127.0.0.1:${port}`).pathname;
  if (path === "/api/shop-test") {
    const issuedAt = String(Date.now());
    req.headers["x-shop-listener-time"] = issuedAt;
    req.headers["x-shop-listener-origin"] = origin;
    req.headers["x-shop-listener-proof"] = listenerProof(
      req.method ?? "",
      path,
      issuedAt,
      origin,
      process.env.SHOP_TEST_HARNESS_TOKEN,
    );
  }
  void handle(req, res);
});
server.listen(port, "127.0.0.1");
async function close() {
  server.close();
  await app.close();
}
process.once("SIGTERM", () => {
  void close();
});
process.once("SIGINT", () => {
  void close();
});
