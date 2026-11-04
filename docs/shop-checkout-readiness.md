# Shop checkout foundation (not enabled)

## Findings, 4 November 2026

The website is a Next.js App Router application. `/shop-now` renders
`components/shop/ShopOffers.tsx` using `lib/shop-offers.ts`. Existing prices,
18% GST, service charges, per-model shipping policy and rupee rounding remain
unchanged. There are nine models and ten variants. Installation, availability,
AIS validity and service coverage still require confirmation in the existing UI.

The repository's sole existing business API route is `/api/enquiries`; it sends
notifications and is not durable order storage. Dashboard code calls the separate
`api.naviigps.com` tracking service. No shop order schema, database connection,
payment API or authorized shop backend contract was found here. A notification
receipt, local file or Vercel instance memory must not substitute for a database.

The supplied public URL is:
https://razorpay.me/@naviigpsindiaopcprivatelimite

Read-only inspection of its HTML showed merchant title **NAVII GPS INDIA OPC
PRIVATE LIMITED**, active status, INR, no fixed amount, unrestricted repeat
payments (`times_payable: null`) and a required free-text Comment. The page
description asks customers to enter the amount. This is a reusable merchant
payment page, not an order-specific checkout session. No payment, form submission,
personal information submission or merchant settings change was performed.
Its existence does not demonstrate API access, webhook configuration or reliable
mapping to a website order. Do not add invented amount/reference URL parameters.

## Implemented and safe to review

`lib/shop-checkout.ts` provides a server-only foundation:

- Strict single-product/variant selection; totals recomputed from the canonical
  catalog. Reject client amounts and quantity fields. Multi-unit shipping rules
  are not invented.
- Timing-safe HMAC SHA256 signature verification, with missing/malformed input
  rejected. Checkout signature uses the order ID loaded from server storage.
- Callback confirmation requires an authenticated server-side fetch of the
  matching captured Razorpay payment, including exact order, amount and currency.
- Raw-byte signed webhook processing for `payment.captured` and `order.paid`.
  Other events cannot mark paid or downgrade an order. Unknown shop orders are
  ignored because the merchant also accepts non-shop payments.
- Durable-store interface specifies atomic pending-to-paid transition, unique
  payment IDs and duplicate handling. Database/API failures propagate, so the
  future HTTP adapter must not acknowledge success on storage failure.

Only a test fixture implements that interface. It is NOT a production database
adapter, concurrency proof for a real database, or working order-booking system.
There are no production payment endpoints or enabled public checkout buttons,
new credentials, database mutations, deployments or live charges.

## Smallest next step

Identify the authorized order database/backend and its repository/schema or
provide access to its existing implementation. Confirm stock, installation,
delivery eligibility and service coverage before enabling automated sale.
Then implement and review:

1. Durable order/customer/address tables and immutable price snapshots. Use
   unpredictable access tokens (stored hashed) or authenticated ownership for
   order reads. Never expose other customers' addresses or order status.
2. A transactionally unique idempotency key per checkout; bind it to the normalized
   request and reject conflicting reuse. Persist pending order before contacting
   Razorpay. Persist its provider order ID before exposing Checkout. Reconcile
   provider timeouts/ambiguous creates instead of blindly creating another order.
3. A server-authenticated Razorpay Orders API adapter with credentials supplied
   directly in the hosting secret manager, beginning in test mode. Never put a
   secret in chat, source control, public env vars, client bundles or logs.
4. Bounded request bodies, same-origin checkout creation, distributed rate limits,
   customer/address validation and availability checks. A signed webhook endpoint
   must read untouched bytes and return a retryable failure on persistence errors.
5. A real database transaction implementing `ShopPaymentStore`, with unique
   provider order/payment IDs, compare-and-set status, and a unique fulfillment
   outbox row. Test actual concurrent callback/webhook delivery and DB rollback.
6. Checkout UI with quantity fixed at one until shipping policy is approved,
   customer details, amount breakdown, cancellation/retry/pending states and
   server-verified status polling. Redirects never prove payment. API outages
   should show pending verification, not ask the customer to pay again.
7. Webhook setup in the merchant dashboard and separate test/live secrets through
   approved secure configuration. Run test-mode end-to-end checks, delayed
   capture, retries, refunds/manual reconciliation and fulfillment deduplication.
   Define refund/return and delivery policies before live launch.

The merchant page may support a separately agreed manual reconciliation flow,
but it is not enabled or treated as automatic checkout in this draft.

## Reference contracts

- https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps
- https://razorpay.com/docs/webhooks/payments
- https://razorpay.com/docs/webhooks/orders

Run `node --experimental-strip-types --test test/shop-checkout.test.mjs` for
offline fixtures. No actual payment provider request is made by these tests.

## Follow-up: isolated backend and local test UI

Backend draft: https://github.com/skdhall450-code/navii-gps-backend/pull/44
implements separate shop tables, immutable snapshots, transactional paid/outbox
processing and a test-only NestJS service. This supersedes the initial absence
of an implementation candidate, but does not establish deployed service identity
or authorize production database/service changes.

This website now has a development-only `/shop-test` page and `/api/shop-test`
proxy. Both refuse production NODE_ENV even when opted in. They are absent from
normal shop navigation and sitemap; live `/shop-now` remains enquiry-only.

For an authorized local test setup, use `SHOP_TEST_UI_ENABLED=1` and securely set
`SHOP_TEST_HARNESS_TOKEN` to match the separately configured local backend. Run
`node scripts/start-shop-test.mjs 3000` (Node 24) rather than a general Next dev
listener. This launcher binds only 127.0.0.1, checks the actual listener and socket
addresses, strips supplied forwarding/proof headers, and authenticates its local
request attestation with the existing harness secret. No new credential is created.
The proxy refuses unsigned requests even if Host/Origin headers are spoofed on a
network-bound ordinary Next dev server. Do not expose the launcher with a tunnel
or reverse proxy. The proxy also requires same-origin loopback requests
and only calls fixed `http://127.0.0.1:4101/shop-test` paths. No backend URL is
accepted from the browser. Harness credentials stay on the server. Backend must
have its separate local test DB and merchant test credentials configured securely.
No such credentials have been created, requested in chat or installed here.

The UI uses fictional details, one-unit selection, server-calculated totals,
retained attempt keys on retries, Test Mode key checks and server-confirmed status.
Rejected input unlocks the form for correction; uncertain creation failures keep
the same attempt. Once Checkout opens, another payment cannot be opened from this
tab, including after cancellation, callback failure or a still-pending status.
An operator must verify whether a retry is safe; automatic recovery is not supplied.
It never marks paid from the Checkout callback alone. Keep the tab open: this
minimal test harness keeps its attempt in memory and has no recovery after refresh.
Production guest-order recovery, persisted cart/session, approved shipping/refund
policies and reconciliation are still launch gates.

`node test/browser/shop-test-checkout.mjs` checks production refusal, mobile layout,
modal dismissal, constructor/open failures, pre-hydration form locking,
same-attempt retry, callback failure and server-confirmed success with all provider
and payment requests mocked. It requires a production build first, then starts
local production/development servers; optional `SHOP_BROWSER_EXECUTABLE` selects
an installed Chromium executable. It does not submit a real/test-mode payment to
Razorpay. Actual merchant test-mode end-to-end verification remains outstanding.

Next and matching eslint-config-next are updated to compatible patch 15.5.29.
The unused `@tailwindcss/vite` plugin is removed: this Next application configures
`@tailwindcss/postcss` and has no Vite imports/configuration. A direct Vite patch
attempt encountered incompatible optional peer resolution; it was not forced.
The sharp override remains 0.35.5. Audit entries
are package/advisory reports rather than distinct proven exploits; the sharp
workaround already addressed the documented Next image condition. Review the
current lockfile audit separately from production applicability.

## Environment discovery checkpoint

Metadata-only inspection found no shop/Razorpay test variables in the selected
machine's process, user or machine environment, no local `.env` in either isolated
checkout, and no saved Codex Cloud environments. A PostgreSQL 16 service exists,
but its databases/data were not inspected or accessed; it is not verified as an
isolated test instance. Hosting/merchant secret stores were not available through
the connected tool metadata, so absence there is not established.

Smallest owner action: identify an approved isolated test machine/environment and
have its administrator securely configure the documented test-only variables from
the merchant's existing Razorpay Test Mode credentials, then report only the
environment name and that configuration is complete. Do not send secret values in
chat. If no test credentials or environment exist, provision those through the
owner's approved secure process before an actual provider end-to-end test.
