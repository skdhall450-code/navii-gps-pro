# Device Health Centre v1

Route: `/dashboard/device-health`. Navigation is shown to SUPER_ADMIN, ADMIN and
DEALER accounts. The page independently verifies the current server-side profile
before requesting records; cached browser roles do not grant access.

## What it checks

- Offline: an enabled device's valid last communication is over 10 minutes old.
- Awaiting GPS: communication is current but a valid, current GPS fix is not.
- Incomplete activation: disabled device, missing communication timestamp, or a
  known missing customer assignment.
- Subscription attention: no current date-based access for administrators;
  visible dealer records needing review; or visible contiguous coverage ending
  within seven days. Overlapping and adjacent renewals extend that coverage.
- Unconfirmed evidence: missing scope, unavailable endpoint, invalid/future
  timestamp, omitted customer assignment, or unconfirmed tracking access.

Counts are device counts and can overlap across issue categories. Sorting places
offline/GPS evidence first, then activation/subscription, then unknown evidence.
Search supports vehicle number, model, IMEI and terminal ID. Observation ages are
not represented as incident start times or confirmed outage duration.

## Data and access

Only authenticated, uncached GET requests are used:

1. `/api/auth/me`
2. `/api/gps/device-management`
3. `/api/gps/billing/subscriptions`
4. `/api/gps/latest`

Each successful snapshot uses current responses, without mixing cached billing
with a new device response. Optional endpoint failures create explicit unknown
checks and a warning. Invalid/partial device lists, authentication failures and
required endpoint failures clear the displayed result. Requests time out after
15 seconds; polling runs every 30 seconds in visible tabs and does not overlap.
Unmounts and cross-tab session changes abort requests. Late responses cannot
restore a previous account's data.

Current profile company/dealer IDs must match every returned device for ADMIN
and DEALER; SUPER_ADMIN can view cross-company records. This is defense in depth,
not a replacement for current-identity authorization on the backend. An older
JWT-based backend can still transmit obsolete-scope data before the frontend
rejects it. Enforce current DB identity on the related endpoints before rollout.

Dealer subscription absence is not proof of no subscription: billing scope may
be narrower than device scope. Presence in the dealer's operational list is
positive access evidence. Other records are labelled scoped/unconfirmed.
Vehicle detail links appear only for confirmed operational IDs. The direct map
shortcut is omitted in this current-main reconciliation because the existing map
does not yet honor a per-vehicle URL selection. Setup
and assignment links point to existing pages; no command is prepared or sent.

## Deliberately unavailable

The existing endpoints do not provide SIM expiry/health, persisted technician
incident notes, incident resolution history, customer-login verification, or a
confirmed reason for lost connectivity. The UI does not fabricate these states.
There is no mutation, alert send, SMS send, remote command or native mobile change
in this slice.

## Validation

Run `node --experimental-strip-types --test test/*.test.mjs test/*.test.cjs`, `npm run lint`, `npx tsc --noEmit
--incremental false`, and `npm run build`.

The health suites include classification boundaries, dealer and administrator
scope, date-based/overlapping subscription coverage, malformed/partial responses,
unknown observations, safe links, rendered empty/error evidence, timeout,
overlap, session switch and unmount cases. Hook/SSR tests are synthetic and do not
replace browser QA. Real browser layout, keyboard/navigation behavior and live
backend verification remain rollout checks; no live environment was changed.

## Current-main reconciliation — 2026-10-23

The candidate is based on web main `1826ac7ae66252a70f771d9f208c58986791b345`
(PR67). It extracts the existing PR45 Health Centre without replacing public
SEO, maintenance, reports, device commands, dashboard session cancellation or CI.
The only existing setup change adds optional assignment fields to its TypeScript
type; command preparation and device progress behavior remain unchanged.

Backend source main `838990ebfb66a17d5e62cf8fd3468fa5dfc92397` still authorizes
device-management, billing/subscriptions and latest from JWT identity. Backend
draft PR6 adds current DB identity guards for those exact reads. The deployed
backend was promoted separately from a private PR8-based candidate, so source
main does not establish what is running. Verify the actual runtime contains
those protections before rollout; do not redeploy from stale main or assume the
guards are absent on the server. No backend release or feature enablement is
included here. The frontend rejects explicitly inactive profile associations,
but it cannot replace server-side current-identity authorization.

The operations audit also checked immutable promoted PR8 source `76f91ea1ac20246c7e5096bea1a62e7e4b0467f1`: it lacks the same current-database guard.
That establishes a prerequisite for the known promoted baseline; a later private
runtime update, if any, is still unverified. A narrow guard-only backend change
can address this without enabling sharing or deploying the rest of PR6.
