# Alert report browser gate

The existing `SEO and Build Quality` workflow runs
`node test/browser/alert-report-contract.mjs` after the production build and
browser prerequisites. It runs after a successful build even if an earlier
check failed, unless the job is cancelled. Failure is not ignored. A dedicated
always-run artifact step retains `test-results/alert-report-contract` for seven
days, including failure JSON/server logs and any completed CSV, PDF or screenshots.

Prerequisites are the existing locked npm dependencies, a completed `npm run
build`, a free loopback port 39131, and sandbox-capable Chromium. CI uses the
runner's preinstalled stable Chrome, as the other customer browser suites do.
Local use defaults to Playwright's installed Chromium. An explicit
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` overrides that selection without disabling
the sandbox. No new dependencies, credentials, services or deployment steps are
introduced.

The suite starts and owns a loopback Next production server. Missing builds fail
before startup. Readiness is bounded to 45 seconds with bounded health requests
and checks that this child, rather than an existing listener, became ready.
Browser launch is bounded to 30 seconds, actions/waits to 10 seconds, and
navigation to 15 seconds. Failures produce a nonzero exit and diagnostic JSON.
Cleanup closes the browser, terminates the server, and escalates only that child
to SIGKILL after five seconds if needed. CI bounds the step to three minutes.

The standard build API origin and the existing loopback QA origins are synthetic
route matches only. They are never forwarded to a backend. Unknown API paths and
writes fail the acceptance state. Other external API/auth/telemetry requests are
aborted and fail the state. Local API endpoints, image proxy requests and writes
are blocked; loopback page/assets are fetched without following redirects.
Service workers are disabled. WebSockets are mocked and closed without connecting
to a server. Analytics consent is denied before the first page loads.

Browser-free checks:

- `node test/browser/alert-report-contract.mjs --list` prints the nine existing
  acceptance checks, prerequisite/browser configuration and `acceptance: NOT RUN`.
  It does not start a server/browser or create acceptance artifacts.
- `node --experimental-strip-types --test test/alert-browser-ci.test.mjs` verifies
  workflow discovery, browser configuration, missing-build failure diagnostics,
  and synthetic HTTP/WebSocket routing with test doubles and no sockets.
- The existing workflow's `test/*.test.mjs` glob includes this regression file.

This local CI derivative has not run actual browser, download, print or PDF
acceptance. The prior environment denied Chromium startup with socket EPERM;
that launch has not been retried or bypassed. Configuration/unit checks are not
browser evidence. The production app/report contract and current-main SEO are
unchanged by this wiring. Exact-candidate browser execution on a supported,
authorized runner remains a release gate; no remote CI or deployment is triggered
by preparing these local files.
