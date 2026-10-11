# Maintenance & Documents frontend

## Scope

New `/dashboard/maintenance` page within the existing role-protected dashboard.
No shared layout, reports, login or alerts files are changed by this patch.

- Service schedules and completion history, registration/insurance renewals, inspections and challan payment records.
- Vehicle, search, inclusive due-date and status filters. Twenty records per page, full filtered-set status counts supplied by the backend.
- Itemized INR costs use integer paise; an empty cost list stays “Not recorded”, distinct from an explicit zero-cost item.
- Optional service odometer is explicitly manual (whole kilometres), never derived from GPS and never used to drive schedules.
- Private JPG/PNG images only, at most 2 MB each and five per record. Authentication is required for downloading; no public file URLs. PDFs are explicitly unsupported by this first backend contract.
- Admin/super-admin/dealer write controls. Customer/legacy user view-only. The backend independently enforces current tenant, role and assignment scope for every call.
- Native modal dialogs, labelled controls, visible status text, responsive compact lists, large focus targets and reduced-motion support.
- Date-only due/issue/completion values remain calendar dates. Audit and attachment timestamps render in Asia/Kolkata.
- Due-soon lead time only affects status. No SMS, push, email or automatic payment action is triggered.

## Integration

Add a `Wrench` navigation item to the shared dashboard layout:

- Label: `Maintenance & Docs`
- Route: `/dashboard/maintenance`
- Visible roles: `SUPER_ADMIN`, `ADMIN`, `DEALER`, `CUSTOMER`, `USER`

API base follows the existing precedence: `NEXT_PUBLIC_NAVII_API_URL`, `NEXT_PUBLIC_API_URL`, then the existing NAVII API origin. This patch does not change deployment variables.

The approved backend contract lives in the paired backend change's `docs/maintenance-api.md`. This frontend uses `/api/gps/vehicles` for scoped vehicle choices and `/api/gps/maintenance` for records. It accepts the backend's exact category/status enums, bounds, summaries and response shapes. Expanded attachments/history are fetched after a successful mutation because mutation responses contain only the base record.

## Safe interruption and retry

- Requests, including body parsing and private downloads, have a 20-second deadline.
- A read can be cancelled by closing the dialog. Newer category/filter/page/refresh/create/detail choices invalidate any older detail result. Unmounted screens never reopen or trigger a download.
- Saves are single-flight; no automatic retries. An uncertain result freezes the original serialized payload plus create idempotency key or existing record version. “Retry same save” reuses it exactly.
- A version conflict cannot overwrite newer data. The user may load the latest record, explicitly discarding the old unsaved draft.
- An uncertain upload must reload attachments rather than blindly upload again.
- Closing or Escape with changes asks whether to discard. A save in progress stays labelled “Saving…” until success/error/deadline; the app never claims a cancelled network write was rolled back.

## Verification

Run with the repository's installed dependencies:

```
node --test test/*.test.mjs test/maintenance-render.test.cjs
npx tsc --noEmit --incremental false
npx eslint app/dashboard/maintenance components/maintenance lib/maintenance*.ts
```

New tests cover strict dates/India midnight, exact paise/limits, empty vs zero costs, role controls, private image limits, filter encoding, completion/renewal ordering, manual-only readings, timeout/body-hang/abort handling, repeated saves, exact uncertain retries, and stale View→Add/View→View/Close results. Server-rendered component tests cover all categories, forms, read-only/archived actions, unknown values, renewal labels, escaped history, and unloaded details.

### Browser release gate (not yet verified in this executor)

The reference images 1.16–1.22 were inspected before implementation. Live desktop/mobile browser QA could not run: ordinary local Chromium failed on socket EPERM; the admitted escalation failed before execution in the environment's mount setup. Server-rendered tests do not establish pixel layout, focus restoration or real browser interactions.

Before publication, use synthetic accounts/data only and verify:

1. Desktop 1440 px and mobile 390 px: no horizontal page overflow, all footer actions reachable, category bar scrollable, long titles and filenames wrap.
2. Keyboard Tab/Shift+Tab focus containment; Escape/Close/Cancel discard prompt; focus returns to the initiating action.
3. Empty/loading/failed API, missing/expired session, role downgrade and inaccessible vehicle.
4. Create/edit, completion with and without next due date, renewal, archive, item costs and manual odometer.
5. Repeated clicks and interrupted/uncertain saves; identical retry; conflict reload; no unintended submit from attachment controls.
6. Slow View→Add, View→View, filters and Back/Forward; closing during detail read; response after navigation.
7. Real authenticated private image upload/download, invalid format/size, five-file cap and interrupted upload reload.
8. Summaries reconcile to filtered records across pages; timestamps cross India midnight correctly.

No production data, publication, push, deployment, migration execution or notifications are part of this frontend patch.
