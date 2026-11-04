"use client";
import { FormEvent, useState } from "react";
import { shopOffers } from "@/lib/shop-offers";
import { formatInrPaise } from "@/lib/product-pricing";

type Order = {
  id: string;
  status: string;
  amount?: number;
  currency?: string;
  razorpayOrderId?: string;
  keyId?: string;
};
type Attempt = { key: string; access: string; payload: unknown; order?: Order };
type Callback = { razorpay_payment_id: string; razorpay_signature: string };
type RazorpayWindow = Window & {
  Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
};
const randomToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(32)), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");

class CheckoutError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export default function ShopTestCheckout() {
  const [selection, setSelection] = useState("g17:device");
  const [attempt, setAttempt] = useState<Attempt>();
  const [busy, setBusy] = useState(false);
  const [paymentOpened, setPaymentOpened] = useState(false);
  const [message, setMessage] = useState(
    "Use fictional customer details. No real purchases or deliveries.",
  );
  async function api(
    action: string,
    current: Attempt,
    payload?: unknown,
  ): Promise<Order> {
    const response = await fetch("/api/shop-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        key: current.key,
        access: current.access,
        id: current.order?.id,
        payload,
      }),
    });
    const result = await response.json();
    if (!response.ok)
      throw new CheckoutError(
        result.message || "Test checkout unavailable",
        response.status,
      );
    return result as Order;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget),
      [offerId, variantId] = selection.split(":");
    const customer = Object.fromEntries(
      ["name", "email", "phone", "address", "city", "state", "postalCode"].map(
        (key) => [key, data.get(key)],
      ),
    );
    const current = attempt ?? {
      key: randomToken(),
      access: randomToken(),
      payload: { selection: { offerId, variantId }, customer },
    };
    setAttempt(current);
    try {
      const order = await api("create", current, current.payload);
      setAttempt({ ...current, order });
      setMessage(
        order.status === "PAYMENT_PENDING"
          ? "Test order saved. Review the total, then open Razorpay Test Mode."
          : "Setup needs review. Do not create another payment.",
      );
    } catch (error) {
      // The backend rejects invalid input before creating an order. Allow correction.
      // Network errors/conflicts keep the exact attempt because creation is uncertain.
      if (
        error instanceof CheckoutError &&
        error.status === 400 &&
        !current.order
      )
        setAttempt(undefined);
      setMessage(
        error instanceof Error ? error.message : "Test checkout unavailable",
      );
    } finally {
      setBusy(false);
    }
  }
  async function status(current: Attempt) {
    setBusy(true);
    try {
      const order = await api("status", current);
      setAttempt({ ...current, order });
      setMessage(
        order.status === "PAID"
          ? "Test payment verified by server. No delivery will be created."
          : `Status: ${order.status}. Keep this attempt; do not pay again.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status unavailable");
    } finally {
      setBusy(false);
    }
  }
  async function pay(current: Attempt) {
    const order = current.order;
    if (
      !order ||
      paymentOpened ||
      order.status !== "PAYMENT_PENDING" ||
      !order.keyId?.startsWith("rzp_test_") ||
      !order.razorpayOrderId
    )
      return;
    setBusy(true);
    try {
      const target = window as RazorpayWindow;
      if (!target.Razorpay)
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Razorpay test checkout did not load"));
          document.head.appendChild(script);
        });
      if (!target.Razorpay) throw new Error("Razorpay unavailable");
      // A pending/cancelled callback is not proof that another payment is safe.
      setPaymentOpened(true);
      new target.Razorpay({
        key: order.keyId,
        order_id: order.razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        name: "NAVII GPS — TEST ONLY",
        description: "Test order. No goods will be shipped.",
        handler: async (value: Callback) => {
          try {
            await api("confirm", current, {
              paymentId: value.razorpay_payment_id,
              signature: value.razorpay_signature,
            });
            await status(current);
          } catch {
            setMessage(
              "Payment confirmation pending. Check status; do not pay again.",
            );
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setMessage(
              "Checkout closed. Check status; payment retry needs operator verification.",
            );
            setBusy(false);
          },
        },
      }).open();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Checkout unavailable",
      );
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-slate-100">
      <div className="mx-auto max-w-2xl">
        <p className="rounded-xl border border-amber-500 bg-amber-950 p-4 text-amber-100">
          TEST MODE ONLY · Fictional details · No delivery
        </p>
        <h1 className="my-6 text-3xl font-bold">NAVII GPS checkout test</h1>
        <form
          onSubmit={submit}
          className="grid gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-6"
        >
          <label>
            Device
            <select
              disabled={!!attempt}
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
              className="mt-2 block w-full rounded-lg bg-slate-800 p-3"
            >
              {shopOffers.flatMap((o) =>
                o.variants.map((v) => (
                  <option key={`${o.id}:${v.id}`} value={`${o.id}:${v.id}`}>
                    {o.name} · {v.label}
                  </option>
                )),
              )}
            </select>
          </label>
          <fieldset disabled={!!attempt} className="grid gap-4 sm:grid-cols-2">
            {[
              "name",
              "email",
              "phone",
              "address",
              "city",
              "state",
              "postalCode",
            ].map((key) => (
              <label key={key} className="capitalize">
                {key === "postalCode" ? "PIN code" : key}
                <input
                  required
                  name={key}
                  type={key === "email" ? "email" : "text"}
                  maxLength={key === "address" ? 300 : 100}
                  className="mt-2 block w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
                />
              </label>
            ))}
          </fieldset>
          {!attempt?.order && (
            <button
              disabled={busy}
              className="rounded-lg bg-blue-600 p-3 font-semibold disabled:opacity-50"
            >
              {busy
                ? "Saving…"
                : attempt
                  ? "Retry same test order"
                  : "Create test order"}
            </button>
          )}
        </form>
        <p role="status" className="my-5 rounded-lg bg-slate-800 p-4">
          {message}
        </p>
        {attempt?.order && (
          <section className="rounded-2xl border border-slate-700 p-6">
            <h2 className="text-xl font-semibold">Test order summary</h2>
            <p className="my-3 break-all">{attempt.order.id}</p>
            <p>{attempt.order.status}</p>
            {attempt.order.amount !== undefined && (
              <p className="my-4 text-2xl font-bold">
                {formatInrPaise(attempt.order.amount)} including GST and
                published charges
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                disabled={busy}
                onClick={() => status(attempt)}
                className="rounded-lg bg-slate-700 p-3 disabled:opacity-50"
              >
                Check server status
              </button>
              {attempt.order.status === "PAYMENT_PENDING" && !paymentOpened && (
                <button
                  disabled={busy}
                  onClick={() => pay(attempt)}
                  className="rounded-lg bg-blue-600 p-3 disabled:opacity-50"
                >
                  Open Razorpay Test Mode
                </button>
              )}
            </div>
          </section>
        )}
        <p className="mt-5 text-sm text-slate-400">
          Keep this tab open until verification completes. This development-only
          page is not available in production builds.
        </p>
      </div>
    </main>
  );
}
