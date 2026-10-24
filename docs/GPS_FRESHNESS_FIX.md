# GPS freshness display fix

A recent heartbeat previously kept the map badge LIVE while displaying stored
speed and coordinates from an old GPS fix. Dashboard and vehicle pages also
used persisted movement status without checking the fix timestamp.

This patch separates communication from GPS freshness on the live map, vehicle
detail, vehicle list, and dashboard. It preserves the map's existing two-minute
LIVE window for GPS data, with a separate ten-minute communication expiry and
up to one minute of tolerated clock skew. An active device needs both recent
communication and a recent, valid coordinate pair before current telemetry is
shown. A heartbeat alone cannot update GPS age.

Stale speed, ignition and battery display `Unavailable`; they are never replaced
with zero. Last-known coordinates and the GPS timestamp remain available on the
map and detail view. Movement badges, counters and the vehicle status filter use
the same freshness policy. A five-second clock also ages cached readings when
API requests fail. Genuine fresh zero speed and historical readings are retained.

The helper and clock are adapted from the unmerged panel-accuracy work in PR #44.
This isolated patch does not include that PR's website, SEO, billing-readiness,
navigation or device-setup changes. The GPS display window here is two minutes;
PR #44 used a shared ten-minute GPS/communication window.

## Validation and release

- Regression fixtures cover recent heartbeat plus stale GPS, genuine zero speed,
  invalid/missing coordinates and timestamps, disabled devices, and clock expiry.
- Render tests cover all four affected screens and preserve historical readings.
- Run `npm run lint`, `npx tsc --noEmit`,
  `node --experimental-strip-types --test test/*.test.mjs test/*.test.cjs`, and
  `npm run build`. The normal PR workflow also checks rendered SEO output.
- Confirm the actual customer panel deployment and perform authenticated browser
  checks against a stale vehicle and a device sending fresh GPS before release.

This is a display correction. It does not repair old database snapshots, alter
device settings, improve a device's GPS fix, or prove physical location/speed
accuracy. The separately installed backend timestamp guard prevents new older
packets from overwriting newer live data. Existing snapshots behind history still
require a guarded reconciliation. Windows production cutover remains on HOLD.
