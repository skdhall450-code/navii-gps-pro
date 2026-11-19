import { createHmac, timingSafeEqual } from "node:crypto";
import { getCompleteShopPrice, shopOffers } from "./shop-offers.ts";

/** Server-only checkout primitives. No payment route is enabled until durable storage exists. */
export function quoteShopItem(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid selection");
  const selection = input as Record<string, unknown>;
  // Single-unit orders only until multi-unit shipping policy is approved.
  if (Object.keys(selection).some(key => !["offerId", "variantId"].includes(key))) throw new Error("Unexpected checkout field");
  const offer = shopOffers.find(item => item.id === selection.offerId);
  const variant = offer?.variants.find(item => item.id === selection.variantId);
  if (!offer || !variant) throw new Error("Unknown product or variant");
  const price = getCompleteShopPrice(variant.baseInr, offer.chargePolicy);
  return { offerId: offer.id, variantId: variant.id, name: offer.name, variant: variant.label,
    quantity: 1 as const, currency: "INR" as const, amount: price.payablePaise, price };
}

export function verifyRazorpaySignature(message: string | Buffer, signature: unknown, secret: string): boolean {
  if (!secret || typeof signature !== "string" || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(message).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export type StoredShopOrder = {
  id: string;
  razorpayOrderId: string;
  amount: number;
  currency: "INR";
  status: "pending" | "paid";
  paymentId?: string;
};

export type CapturedPayment = {
  id: string; order_id: string; amount: number; currency: string;
  status: string; captured: boolean;
};

export interface ShopPaymentStore {
  findByRazorpayOrderId(id: string): Promise<StoredShopOrder | null>;
  /** MUST atomically compare immutable order fields, enforce unique payment ID, and
   * transition pending -> paid. Identical repeat returns duplicate. Never fulfill here.
   * Commit a unique fulfillment outbox event in the same transaction if needed. */
  recordCapturedPayment(order: StoredShopOrder, paymentId: string): Promise<"paid" | "duplicate">;
}

function assertCaptured(order: StoredShopOrder, payment: CapturedPayment) {
  if (!/^pay_[a-zA-Z0-9]+$/.test(payment.id) || payment.order_id !== order.razorpayOrderId ||
      payment.amount !== order.amount || payment.currency !== order.currency ||
      payment.status !== "captured" || payment.captured !== true ||
      !Number.isSafeInteger(order.amount) || order.amount <= 0 ||
      (order.status === "paid" && order.paymentId !== payment.id)) {
    throw new Error("Payment does not match a captured order");
  }
}

/** Fetch must use authenticated Razorpay server API; never supply client payment data. */
export async function confirmCheckoutPayment(
  order: StoredShopOrder,
  callback: { paymentId: string; signature: string },
  secret: string,
  fetchPayment: (id: string) => Promise<CapturedPayment>,
  store: ShopPaymentStore,
) {
  if (!/^pay_[a-zA-Z0-9]+$/.test(callback.paymentId) || !verifyRazorpaySignature(
    `${order.razorpayOrderId}|${callback.paymentId}`, callback.signature, secret,
  )) throw new Error("Invalid checkout signature");
  const payment = await fetchPayment(callback.paymentId);
  if (payment.id !== callback.paymentId) throw new Error("Payment ID mismatch");
  assertCaptured(order, payment);
  return store.recordCapturedPayment(order, payment.id);
}

/** Call with untouched request bytes. Storage errors must propagate for webhook retry. */
export async function processShopWebhook(rawBody: Buffer, signature: unknown, secret: string, store: ShopPaymentStore) {
  if (rawBody.length > 65536 || !verifyRazorpaySignature(rawBody, signature, secret)) throw new Error("Invalid webhook signature");
  const event = JSON.parse(rawBody.toString("utf8"));
  // Authorization/failure events never mark paid or downgrade an already-paid order.
  if (event.event !== "payment.captured" && event.event !== "order.paid") return "ignored";
  const payment = event.payload?.payment?.entity as CapturedPayment | undefined;
  if (!payment || typeof payment.order_id !== "string") throw new Error("Missing payment");
  const order = await store.findByRazorpayOrderId(payment.order_id);
  // This merchant may also accept payments outside this shop.
  if (!order) return "ignored";
  assertCaptured(order, payment);
  return store.recordCapturedPayment(order, payment.id);
}
