import { NextRequest, NextResponse } from "next/server";
import { verifyListenerProof } from "@/lib/shop-test-listener";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const origin = new URL(request.url);
  if (
    process.env.NODE_ENV === "production" ||
    process.env.SHOP_TEST_UI_ENABLED !== "1" ||
    !["localhost", "127.0.0.1"].includes(origin.hostname) ||
    request.headers.get("origin") !==
      request.headers.get("x-shop-listener-origin") ||
    !process.env.SHOP_TEST_HARNESS_TOKEN ||
    !verifyListenerProof(
      request.method,
      origin.pathname,
      request.headers.get("x-shop-listener-time"),
      request.headers.get("x-shop-listener-origin"),
      request.headers.get("x-shop-listener-proof"),
      process.env.SHOP_TEST_HARNESS_TOKEN,
    )
  )
    return new NextResponse(null, { status: 404 });
  const reader = request.body?.getReader();
  if (!reader)
    return NextResponse.json({ message: "Missing request" }, { status: 400 });
  const parts: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    length += part.value.length;
    if (length > 16384) {
      await reader.cancel();
      return NextResponse.json(
        { message: "Request too large" },
        { status: 413 },
      );
    }
    parts.push(part.value);
  }
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(Buffer.concat(parts).toString("utf8"));
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !["create", "status", "confirm"].includes(String(data.action)) ||
    typeof data.access !== "string" ||
    !/^[a-f0-9]{64}$/.test(data.access)
  ) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
  if (
    data.action !== "create" &&
    (typeof data.id !== "string" || !/^[a-f0-9-]{36}$/.test(data.id))
  )
    return NextResponse.json({ message: "Invalid order" }, { status: 400 });
  const path =
    data.action === "create"
      ? "orders"
      : `orders/${data.id}${data.action === "confirm" ? "/confirm" : ""}`;
  try {
    const result = await fetch(`http://127.0.0.1:4101/shop-test/${path}`, {
      method: data.action === "status" ? "GET" : "POST",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SHOP_TEST_HARNESS_TOKEN}`,
        "X-Shop-Access-Token": data.access,
        "Idempotency-Key": typeof data.key === "string" ? data.key : "",
      },
      ...(data.action === "status"
        ? {}
        : { body: JSON.stringify(data.payload) }),
    });
    const body: unknown = await result.json();
    return NextResponse.json(body, {
      status: result.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Verification unavailable. Keep this attempt and check again; do not start another payment.",
      },
      { status: 503 },
    );
  }
}
