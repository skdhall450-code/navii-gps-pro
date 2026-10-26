# Live refresh reliability

The live map polls current vehicle data every five seconds while visible. Each
resource has at most one request in flight and a 15-second deadline, including
response-body parsing. Late responses from timed-out requests, old selections or
unmounted screens cannot update the UI. Visibility restoration and browser online
events request a fresh snapshot. Manual refresh coalesces with existing work.

Selected route history refreshes every 15 seconds (at most 100 points) and on
selection/manual refresh. History belongs to its vehicle ID; changing vehicles
cannot show another vehicle's route. History failures remain visible independently
of successful fleet requests. GPS freshness still uses the device GPS timestamp,
not the request time or heartbeat; an old speed is not a live speed.

## Verification

- `node --experimental-strip-types --test test/*.test.mjs test/*.test.cjs`
- `npm run lint` and `npm run build`
- `node test/browser/gps-freshness.mjs`
- `node test/browser/live-refresh.mjs`

Browser tests intercept all external requests with synthetic fixtures. They cover
route reselection races, periodic history, independent errors, slow/late requests,
timeout recovery, hidden tabs and navigation cleanup. Existing freshness tests
verify stale speed suppression and measured zero on four GPS screens.

## Production observation and capacity

Public health only proves endpoint reachability. Authenticated fleet acceptance
must compare receive time, persistence time, API GPS timestamp and rendered GPS
timestamp for the same authorized vehicle. Observe API p50/p95/p99 latency, response
bytes, errors, pending ingestion age, save latency, database pool wait and device
contact versus valid position counts. Never inject test packets into production.

This change is not a 100,000-device capacity certification. The current latest API
returns the accessible fleet as one response and the map renders all returned
markers. Larger fleets need an access-controlled bounded snapshot/delta API,
viewport aggregation or clustering, and virtualized lists before the browser can
handle that scale. Backend capacity requires isolated staged load tests (including
reconnect bursts, realistic packet cadence, persistence and concurrent panel users).
At an assumed 10-second interval, 100,000 devices imply 10,000 location reports per
second before heartbeats/retries; this is arithmetic, not measured capacity.

Hourly external inspection is configured separately for public availability and
repository failures. It does not cover private fleet freshness or provide instant
alerts. A server-side telemetry monitor and alert destination remain necessary for
continuous production detection. Automatic repair must use a verified fault and
bounded recovery; stale GPS alone is not justification for restarting services or
changing tracker configuration. Preserve the fenced legacy source after migration.
