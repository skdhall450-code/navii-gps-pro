# Health and renewal readiness integration — 2026-10-23

Base: web main `1826ac7ae66252a70f771d9f208c58986791b345` (merged PR67).

## Included

- Read-only Device Health Centre at `/dashboard/device-health`: offline versus
  recent communication without a current GPS fix, registration/assignment gaps,
  subscription attention, unknown evidence, timestamps, filters and safe links.
- Read-only Renewal worklist at `/dashboard/renewals`: current scoped subscription
  evidence, 7/15/30-day review windows, contiguous coverage and explicit unknowns.
- Role-specific navigation; no notifications, commands, billing mutations or
  scheduled sends. Scheduled-report contract assessment is documentation only.

This extracts the existing reviewed Health Centre from PR45 and adds the reviewed
renewal worklist. It is not a merge of the old PR44/45 branches. Current SEO content
(including PR65/66/67), maintenance/documents, reports, alert-policy work, command
preparation, dependency lock, all-suite CI and dashboard session cancellation are
preserved. The only existing functional file edit is the two navigation entries;
`lib/device-setup.ts` gains optional assignment type fields without behavior change.

## Excluded

Temporary sharing remains a separate, unpublished readiness artifact and is not
part of this candidate: no manager, `/share`, viewer assets, menu or sharing-header
changes. Existing alerts and report screens are unchanged. No unimplemented
scheduler or notification controls are presented as working.

## Release prerequisites

The frontend verifies current `/api/auth/me` before its data reads, but this is not
server authorization. The known promoted backend PR8 source lacks current-database
identity guards on device-management, subscriptions and latest. Confirm actual
runtime and release the separately reviewed narrow guard fix if missing before
rollout. Do not deploy from the intentionally stale backend main checkout or
bundle sharing enablement into that change.

Review live response completeness/scoping using authorized admin/dealer/customer
sessions and test authenticated navigation, session switches, filters, refresh,
Back/Forward and narrow layouts in a real browser. Local component/hook tests are
synthetic. The cloud browser could not reach the local workspace preview; no
screenshot or authenticated browser pass is claimed. Publication, backend changes,
merge and production rollout require separate authorization.

## Checks

Use the existing CI command (both formats remain included):

    node --experimental-strip-types --test test/*.test.mjs test/*.test.cjs
    npm run lint
    npx tsc --noEmit --incremental false
    npm run build
    npm run seo:check:source
    npm run seo:check

The baseline dependencies are installed from its unchanged lockfile. No dependency
or runtime configuration change is required by the web candidate.
