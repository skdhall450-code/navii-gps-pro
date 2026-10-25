# Customer portal draft — 25 October 2026

## Scope and source

- Web base: `fb61073c9905c9aff62aa9150878b580767a9630` (main, merged PR 75).
- Customer/USER Home and navigation are selected only after the existing layout successfully verifies `/api/auth/me`. Admin/dealer dashboard markup and authorization remain intact.
- Shared login retains its current POST-login → GET-profile verification, normalized email, duplicate-submit guard, storage cleanup and routing. Visual changes use the original NAVII logo and existing Geist sans font.
- Detailed vehicle SVGs copied without alteration from approved native app source `372faf76a7e8de7f9e667897b7ae79d069d3580d`, `assets/images/customer-vehicles/`. All ten persisted vehicle types are mapped; unknown types use OTHER.
- No public marketing, pricing, contact details, metadata or SEO content changes. Existing public widgets gain a marker; CSS suppresses them only while the verified customer shell is present.

## Tracking behavior

- Existing authorized `/api/gps/vehicles` read endpoint, no production test calls.
- Light OpenStreetMap basemap with required attribution retained. Pinch, scroll and explicit zoom controls; explicit recenter; polls never reset viewport. Vehicle changes intentionally initialize the newly selected vehicle's map.
- Device name, IMEI and SIM/mobile are below, never over, the map.
- Existing GPS freshness and communication-state library drives all state/telemetry. Missing/empty/error and stale states are distinct. Voltage is reported as volts, not battery percentage. View-refresh time is separate from GPS fix time.
- Slow polls are not repeatedly aborted; manual refresh supersedes a prior request. Twenty-second timeout, cancellation checks, and abort on unmount. Authorization failure clears displayed vehicles; 401 retains the existing session-clear/login redirect behavior.
- Reduced-motion support, focus rings, labeled selection, skip link and touch controls.

## Alert capability boundary

New customer alert/geofence routes are a separate backend draft, not an activated service. The UI must handle missing/unsupported endpoints without pretending preferences were saved. Email addresses are requested preferences only until server capabilities and verified delivery infrastructure support sending. No SMS activation, paid service, low-battery percentage inference or engine command is introduced.

## Release gate

This is a review draft. Do not merge or deploy without review, supported browser verification and backend capability/tenant-isolation gates. No actual customer login, vehicle write, email, paid action or deployment is part of synthetic QA.

## Local validation status

- TypeScript, ESLint, production build, 133 regression/unit tests and source SEO checks passed locally.
- Rendered audit passed all 2,031 public URLs.
- Independent Home/login review passed after fixing slow-poll starvation and superseded-response handling.
- Chromium visual tests are defined with synthetic API/map fixtures. Local execution is blocked before page load by the environment's socket permissions; no sandbox bypass was attempted. CI artifacts are still required.
- The first Git publication attempt was denied by auto-review. The user subsequently explicitly authorized this customer-panel code to the named public web repository as a draft PR at 2026-10-25 13:01:56 UTC (`Sentinel_0698047e4e488191816bafb187febf5b`), after being told the destination and that live service would not change. Publication must still be verified before claiming a PR exists.

## Conservative write recovery

A pending customer write is stored per verified customer in sessionStorage, without a token. Session identity is pinned to the layout's verified profile/token. Circle creates use the backend's stable UUID idempotency contract; a generic successful GET never proves a timed-out write completed. Readback must match the operation and revision/key. DELETE absence additionally requires complete reads and continued vehicle eligibility. An uncommitted uncertain operation stays blocked; safe same-key retry/support recovery is a release follow-up, not a new-key automatic retry.

### CI browser compatibility

CI's bundled headless shell failed before page load with “No usable sandbox” under Ubuntu AppArmor. Customer tests keep `chromiumSandbox: true` and select the runner's preinstalled stable Chrome channel in CI. No security profile/kernel setting is weakened. Chromium documents Ubuntu's stable Chrome profile at https://chromium.googlesource.com/chromium/src/+/main/docs/security/apparmor-userns-restrictions.md ; runner software inventory: https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md .
