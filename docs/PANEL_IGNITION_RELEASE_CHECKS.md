# Ignition provenance and report print contract

Current ignition requires a boolean value, `ignitionSource: "ACC"`, and an independent, valid `ignitionObservedAt`. Missing provenance, invalid timestamps, observations over 30 seconds in the future, or disconnected/disabled devices render Unavailable. Verified observations older than five minutes render Stale. Charging, voltage, motion, fresh GPS fixes and carried booleans cannot establish or refresh ACC provenance.

Historical rows compare the ACC observation timestamp with the row recorded time, not the current browser time. Report tables, CSV exports and replay cards/popups use the same provenance rule. A retained observation keeps its original timestamp.

Engine-derived aggregate totals remain unavailable until the server supplies a reviewed aggregate provenance contract. Individual verified rows and complete GPS coverage do not certify period-wide engine state. GPS distance, speed and coverage remain visible.

Report-specific print styles suppress navigation and cookie overlays and fit all table columns. Normal screen layouts retain their existing scrolling and controls. Printing retains the displayed table page; CSV includes all returned rows.

## Validation and release boundaries

Local integration validation on main `0c135e4` passed 160 unit/render tests, lint, a production build with 2,109 generated pages, eight synthetic browser suites, all 2,035 public URLs, QR decoding, and desktop/mobile report print/PDF checks. Windows/Node24 local results do not replace clean Node22 CI.

Before release, verify backend schema/runtime compatibility, tenant/account scope, real device ACC observations and independent timestamps, alert capability and delivery, migration safety and restore/rollback evidence. Synthetic fixtures are not physical-device or production acceptance. Do not infer aggregate engine coverage from GPS coverage.

This remains a review draft. The draft branch disables automatic Vercel deployment. No merge, deployment, device command or production write is part of this change.
