# Renewal worklist and scheduled-report contracts

## Local implementation, 23 October 2026

This additive web change is based on main `1826ac7ae66252a70f771d9f208c58986791b345`.
It adds `/dashboard/renewals`, its component, two helpers and focused regression tests.
It does not replace existing billing, maintenance, reports, alert-policy or public SEO pages.
The existing CI glob already runs both new `*.test.mjs` suites.

The worklist reads the existing `GET /api/auth/me` and
`GET /api/gps/billing/subscriptions` contracts. It performs GET requests only.
No subscription changes, payments, renewals, notification sends, production jobs,
credentials, database migrations or feature flags are added or enabled.

For the coordinated dashboard integration, add a navigation item named
**Renewal worklist**, path `/dashboard/renewals`, icon `CalendarClock`, roles
`SUPER_ADMIN`, `ADMIN`, `DEALER`, `CUSTOMER`. The health/readiness integration owns
`app/dashboard/layout.tsx`; this isolated patch intentionally does not edit it.
The route validates the current actor itself and does not rely on sidebar visibility.

### What already exists

- The subscription service returns all visible subscription periods, with dates,
  effective status and recorded company/dealer/customer identities. A renewal
  creates another subscription row; it does not overwrite the previous period.
- The effective status already distinguishes suspended/cancelled, future,
  expired and expiring periods. Its warning is 7 days for a monthly plan and
  30 days otherwise. There is no 15-day operational worklist or renewal reminder
  delivery ledger in the inspected service.
- The billing response selection in draft backend #9 preserves the fields used
  here. The worklist also accepts the older, broader response, then retains only
  billing identity, plan name, period dates and status. It never retains prices,
  telemetry, SIM data, contacts or invoice/payment details.

Sources: backend main `838990ebfb66a17d5e62cf8fd3468fa5dfc92397`,
`src/gps/subscription.service.ts`, `src/gps/subscription.controller.ts`;
backend #9 `548a1e1f7ff50618ba03536cfa6cfac5eb956e98`,
`src/gps/billing-response.select.ts`.

### New read-only behavior

- One row per vehicle with visible billing history. A renewed vehicle is not
  labelled expired because an old period is expired.
- Current ordinary periods and exactly adjoining future renewals form continuous
  coverage. The final end of that chain is the renewal review date. A gap cannot
  be bridged. Suspended/cancelled periods never extend coverage; conflicting
  current records or suspension inside a continuous chain require review.
- Cumulative next-7, next-15 and next-30-day filters use precise 24-hour durations
  at the displayed snapshot time. Expired/gap/suspended/conflicting records have
  a separate Needs review view; upcoming-only and cancelled-only histories remain
  available under All records.
- A later cancelled period does not erase an earlier ended coverage period.
  Such a history remains Coverage ended under Needs review, rather than a
  due-soon reminder. Cancellation is not proof that further billing review is
  unnecessary; the worklist does not decide that business action.
- Asia/Kolkata and UTC change date display, not expiry arithmetic. Exact UTC
  timestamps are retained. No inferred local midnight or daylight-saving offset
  is used for the worklist windows.
- The snapshot is refreshed on entry, explicit Refresh and window focus. Failed
  refreshes clear prior records; there is no background reminder scheduler.
- The full GET sequence, including JSON bodies, has a 15-second deadline. Newer
  requests, changed sessions, unmounts, authorization failures and incomplete
  lists cannot restore stale records or appear as an empty success.
- Super admins see their own company here. Dealers/customers see only recorded
  billing scope; this is not a claim about the vehicle's current assignment.
  Vehicles with no visible subscription history are explicitly outside this view.
- Automatic-renewal flags are not treated as confirmed renewal or payment.

### Security release dependency

**Do not describe these frontend checks as server authorization hardening.**
The promoted backend #8 source `76f91ea1ac20246c7e5096bea1a62e7e4b0467f1`
still uses JWT-derived identity for the subscription GET. A direct API caller can
bypass browser checks. Backend #6's current-database actor guard is not present
in that release. Before releasing this view, the coordinated backend hardening
must validate the current user/company/role and active linked dealer/customer
on `GET /api/gps/billing/subscriptions`, with direct-API regression tests for
stale tokens, moved accounts, disabled linkage and cross-company access.

This view compares token scope against fresh `/auth/me` before its billing read,
validates every displayed row, requires active linked dealer/customer profiles
and rechecks the actor before showing results. These checks reduce accidental
stale-session display, but cannot replace the server guard or provide a
transactional snapshot across all three requests. Backend history remains
recorded-party billing history, not current-fleet authorization.

Signed-in browser QA and coordinated navigation integration are additional
release gates. Nothing in this local change authorizes publication or rollout.

## Scheduled reports: existing versus missing

Current web main has `components/reports/ReportsWorkspace.tsx` and
`lib/report-workspace.ts`: manual activity and alert reports, explicit dates,
Asia/Kolkata/UTC display, at most 31 days, client CSV with formula escaping,
and browser print/Save as PDF. The CSV uses the server's summary/coverage;
it does not calculate a second set of telemetry totals.

Backend #8/#9 contains these JSON routes:

- `GET /api/gps/reports/v2/trip/:vehicleId`
- `GET /api/gps/reports/v2/summary/:vehicleId`
- `GET /api/gps/reports/v2/alerts/:vehicleId`

The API validates explicit UTC ranges and an IANA display timezone. It reports
partial coverage, unknown ignition, rejected distance segments and truncation.
Trip aggregation is bounded at 20,000 points; alert rows are bounded at 5,000
(the current web request asks for 500). These limits must survive a scheduled
report; scheduling cannot promise complete historical coverage.

No report-schedule model, durable report job/lease, private generated-report
artifact, report delivery outbox, server CSV/PDF download contract or schedule
management endpoint exists in the inspected #8/#9 tree/schema. AlertPolicy's
`DAILY_WINDOW` is a condition-preview schedule, not a report delivery scheduler.
Maintenance `reminderAt` is a date worklist field, not a notification queue.
Existing Expo push handles geofence entry/exit and is not a report or renewal
delivery service. It has no durable job/receipt contract to reuse for this task.

Sources: backend #9 `src/gps/report.controller.ts`, `report.service.ts`,
`report-calculation.ts`, `docs/report-definitions.md`, `prisma/schema.prisma`;
backend main `src/gps/push-notification.service.ts`;
web main `components/reports/ReportsWorkspace.tsx`, `lib/report-workspace.ts`.

### Concrete next local implementation outcome

The next bounded server slice can provide **disabled schedule setup and a
synthetic occurrence preview**, without a running scheduler or external sender:

1. Add a company/actor-owned, revisioned `ReportSchedule` record with a disabled
   default, one scoped vehicle, report kind `ACTIVITY` or `ALERTS`, timezone
   `Asia/Kolkata` or `UTC`, daily or weekly cadence, explicit local run time,
   retention duration and audit records. No arbitrary email recipients or
   automatic enablement. Reject `enabled: true` until a separate worker release.
2. Add current-database-authenticated CRUD and preview endpoints. Revalidate
   vehicle/company/role/subscription scope on every read/change and before any
   later generation/download. Use revision CAS and atomic audit writes.
3. Preview the next three future occurrences and completed half-open report
   periods. Daily means the preceding complete local calendar day; weekly means
   the preceding seven complete days. Restrict the first version to the two
   existing web timezones. Display the exact UTC bounds and the current report
   limits. Preview computes metadata only and does not run a telemetry query.
4. Verify tenant/role changes, disabled accounts, revision conflicts, midnight,
   month/year/leap boundaries and queue-disabled behavior using synthetic data
   and a disposable PostgreSQL database. There must be no timer, cron, provider
   I/O or production credential in this disabled setup slice.

Before any scheduled generation can be enabled, implement durable occurrence
keys `(scheduleId, revision, scheduledFor)`, bounded worker leases/retries and
expiry, revision/ownership rechecks, private artifact access and retention, and
explicit skip-on-downtime behavior. Do not replay historical missed periods.
Delivery is a separate opt-in contract with verified recipients and an audited
outbox; browser CSV/print and geofence Expo push do not satisfy it. Enabling jobs,
sending mail/push or adding delivery credentials requires separate authorization.

Scheduled-report persistence and preview are a plan, not implemented or saved
settings in this patch. No placeholder schedule UI implies otherwise.
