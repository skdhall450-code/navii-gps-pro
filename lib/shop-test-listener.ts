import { createHmac, timingSafeEqual } from "node:crypto";

// Reuse the configured test harness secret; no credential is created or exposed.
export function listenerProof(
  method: string,
  path: string,
  issuedAt: string,
  origin: string,
  secret: string,
) {
  return createHmac("sha256", secret)
    .update(`navii-loopback-v1\n${method}\n${path}\n${issuedAt}\n${origin}`)
    .digest("hex");
}

export function verifyListenerProof(
  method: string,
  path: string,
  issuedAt: string | null,
  origin: string | null,
  proof: string | null,
  secret: string,
  now = Date.now(),
) {
  if (
    secret.length < 32 ||
    !origin ||
    !/^http:\/\/(?:127\.0\.0\.1|localhost):\d{4,5}$/.test(origin) ||
    !issuedAt ||
    !/^\d{13}$/.test(issuedAt) ||
    !proof ||
    !/^[a-f0-9]{64}$/.test(proof) ||
    Math.abs(now - Number(issuedAt)) > 10000
  )
    return false;
  return timingSafeEqual(
    Buffer.from(proof, "hex"),
    Buffer.from(listenerProof(method, path, issuedAt, origin, secret), "hex"),
  );
}

export function isVerifiedLoopbackSocket(
  listenerAddress: unknown,
  localAddress: unknown,
  remoteAddress: unknown,
) {
  return (
    listenerAddress === "127.0.0.1" &&
    localAddress === "127.0.0.1" &&
    remoteAddress === "127.0.0.1"
  );
}
