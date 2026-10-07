# Phase 1 web integration: local review package

Baseline: the published PR44 tree at `53cced0734c11b55d0ba8b664308772ad7aa7b7b`
in `skdhall450-code/navii-gps-pro`. The integration was assembled in a new isolated
copy. No shared baseline, remote branch, deployment or live account was modified.

## Included

- Device Health Centre: role-verified, scoped read-only diagnostics and next steps.
- Smart Alerts: exact-repeat grouping, filters and persisted workflow controls
  when the companion backend advertises the supported record version.
- Temporary Live Links: authenticated management and a standalone private viewer,
  gated off by the companion backend until separately approved release checks.
- Dashboard navigation for each feature, and CI running every `test/*.test.mjs`.

Two integration-review findings were corrected:

1. Next's global headers can override route-handler headers. A later `/share`
   configuration rule preserves `Referrer-Policy: no-referrer` and
   `X-Frame-Options: DENY`; actual production-server HTTP probes confirmed them.
2. A second `/share#secret` can be same-document navigation. The viewer now scrubs
   every new fragment, invalidates the previous session and late responses,
   clears the old location, and verifies the new capability. Back without a
   fragment clears the session. Synthetic regression tests cover these cases.

Independent re-review found no remaining concrete integration issue.

## Verified locally

Runtime: Node 24.19.0. No `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` fixture was enabled
for the integration build. Individual-worker notes describe earlier independent
checks; these results cover the final combined source.

- 160/160 Node tests, using the exact CI `--experimental-strip-types` invocation.
- Full ESLint, with no errors or warnings.
- TypeScript `--noEmit --incremental false`.
- Normal production `npm run build`, including all new routes.
- SEO source checks, rendered checks and the 1,718-public-URL audit.
- Eleven HTTP probes against a locally started production Next server: standalone
  viewer content, cache/referrer/frame/CSP headers, absence of marketing and Next
  layout scripts, exact JS/CSS assets, dashboard noindex headers, sitemap exclusion.
- Clean patch application against the unchanged baseline and `git diff --check`.

The temporary local server was stopped after the probes. The production HTTP
checks did not invoke authenticated APIs, create a capability or share a location.

## Remaining release gates

- Real browser layout, keyboard, history/BFCache and mounted interactions remain
  unverified. Chromium attempts in the feature workers were blocked by the local
  environment. Synthetic hooks/DOM tests and HTTP probes do not replace this QA.
- Node 22 is configured in CI but was not executed in this Node 24 local runtime.
  Remote CI has not run for this unpublished package.
- Apply and validate the companion backend migrations/current-identity checks
  through a separately authorized release. No database or live API was changed
  by this web integration task.
- Keep `LIVE_TRACKING_LINKS_ENABLED=false` until the backend's native PostgreSQL
  concurrency, ingress rate-capacity and log-redaction checks are cleared and
  enablement is approved. No feature flag was changed here.
- No automatic SMS/WhatsApp, escalation sends, native mobile feature, remote
  device command, credential change, push, merge or deployment is included.
