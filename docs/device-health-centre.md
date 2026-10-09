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
Vehicle detail and map links appear only for confirmed operational IDs. Setup
and assignment links point to existing pages; no command is prepared or sent.

## Deliberately unavailable

The existing endpoints do not provide SIM expiry/health, persisted technician
incident notes, incident resolution history, customer-login verification, or a
confirmed reason for lost connectivity. The UI does not fabricate these states.
There is no mutation, alert send, SMS send, remote command or native mobile change
in this slice.

## Validation

Run `node --test test/*.test.mjs`, `npm run lint`, `npx tsc --noEmit
--incremental false`, and `npm run build`.

The health suites include classification boundaries, dealer and administrator
scope, date-based/overlapping subscription coverage, malformed/partial responses,
unknown observations, safe links, rendered empty/error evidence, timeout,
overlap, session switch and unmount cases. Hook/SSR tests are synthetic and do not
replace browser QA. Real browser layout, keyboard/navigation behavior and live
backend verification remain rollout checks; no live environment was changed.
