# Smart Alerts Phase 1: local implementation

## Delivered in this slice

- Existing `/dashboard/alerts` becomes an open-event queue with exact-repeat grouping. A group matches company, vehicle, alert type, exact message and resolved state, spans at most five minutes, and retains every original event ID. This is a presentation grouping, not deletion or notification suppression.
- Expand a group to inspect its original events. Resolve/reopen individual events or all currently displayed events in one group using the existing authenticated server endpoints. Batches are sequential, stop at the first failure, and report the number of server-confirmed changes. There is no background retry of an uncertain mutation.
- Filter by status, type-derived severity, recorded-time range, message/vehicle/device/IMEI/terminal ID, or supported acknowledgement state. Exact timestamps use UTC and explicitly mean server-record creation time, not validated device occurrence time.
- Version-gated, persisted self-ownership, acknowledgement and explicit acknowledgement deadlines, through `PATCH /api/gps/alerts/:id/workflow`. Acknowledging does not resolve the event. Only the current owner can acknowledge/set a deadline. Backend-authorized administrators can reclaim an orphaned assignment; reclaim resets acknowledgement and deadline.
- Overdue acknowledgements are an in-app review queue based on the server's deadline status. No scheduler, external escalation or external notification is implied.
- Polling is serialized, superseded reads cannot overwrite writes, and data is cleared on account/scope changes or access denial. Twelve-second response/body timeouts make reads and uncertain writes recoverable. Transient failures preserve the last confirmed records with a stale warning and disabled actions; a read reconciles state after an uncertain mutation.
- Customers/users remain read-only. Backend authorization must validate the current database actor and current vehicle/company/dealer/subscription scope; client checks are supplementary.

## Backend contract

Every upgraded record adds:

- `workflowVersion: 1` (capability marker), `workflowRevision` (persisted concurrency counter)
- `owner: {id, name} | null`, `assignedAt`
- `acknowledgedAt`, `acknowledgedBy: {id, name} | null`
- `acknowledgementDueAt`, `deadlineStatus: NONE | PENDING | OVERDUE | ACKNOWLEDGED | RESOLVED`
- `ownershipRecoverable` boolean, calculated for the current viewer

Workflow request bodies:

- `{ "action": "TAKE_OWNERSHIP" }`
- `{ "action": "ACKNOWLEDGE" }`
- `{ "action": "SET_DEADLINE", "acknowledgementDueAt": "2026-10-08T10:00:00.000Z" }`
- `{ "action": "SET_DEADLINE", "acknowledgementDueAt": null }`

Successful writes return `{ success: true, data: AlertRecord }`. Deadlines must be future, explicit-timezone timestamps within 30 days. The web offers 30 minutes, 1 hour, 4 hours, 24 hours, or clearing the deadline. An older server remains usable for grouped events and resolve/reopen; workflow controls are absent until a complete supported record is returned. This is capability compatibility, not proof that backend migrations have run.

## Still outside this slice

1. Arbitrary assignment to another person or reassignment of a still-eligible owner. This slice provides self-claim and tightly scoped orphan recovery.
2. Automatic escalation jobs, notifications, WhatsApp/SMS, delivery consent/cost handling, escalation destinations and retry policies. None is configured or sent.
3. Night-movement generation. It needs persisted per-vehicle/company rule configuration, an explicit IANA time zone and local schedule (including daylight-saving policy), trusted fresh GPS/movement evidence, a configured movement threshold, event-time/ingestion-time handling and restart-safe deduplication/cooldown state. Existing alert enums/configuration do not establish these contracts.
4. Prolonged-stop/idling generation. It needs a configured duration/speed policy, explicit known ignition validity rather than a carried-forward/default value, fresh ordered telemetry, gap handling, restart-safe duration state and source-specific capability validation. Existing `Position` ignition values can use carried-forward/default data, so they do not by themselves prove engine-idling duration.
5. Server-side incident/deduplication models or suppression of repeated push notifications. Every original backend event is preserved and this page only groups exact repeats.
6. Mobile app workflow controls, live production verification, publication, migration execution, deployment and production notification sending.

## Verification and release checklist

- Run `node --test test/*.test.mjs`, `npm run lint`, and `npx tsc --noEmit` in the web checkout.
- Run backend validation/generation, unit/security tests, typecheck and build; inspect the workflow migration and audit table before deployment.
- Apply the migration through the normal authorized database release process, then release the backend before relying on workflow controls.
- Verify current-actor authorization and subscription/tenant boundaries against a disposable database and staging accounts, including stale JWTs, owner loss/reclaim, concurrent writes and audit rollback. Unit tests do not substitute for this deployment check.
- Run real browser QA for desktop/mobile, reload, repeated clicks, filtering after writes, ownership/deadline controls, access revocation and delayed network responses.

Local verification in this environment: 109 web tests passed (37 Smart Alerts model/client tests and 12 rendered-component tests plus 60 existing tests); full lint had zero errors/warnings; TypeScript passed. A complete Next build passed with cached existing font assets. A normal unmodified build failed fetching Google Fonts from the restricted environment; font retrieval is therefore not live-verified. A synthetic Playwright QA script was prepared but Chromium could not launch because its local Unix socket was prohibited, including an approved escalation attempt. No browser interaction or screenshots are claimed. These limits do not change the unit/component evidence.
