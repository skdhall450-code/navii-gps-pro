# Temporary Live Links: frontend integration

New routes: `/dashboard/live-links` (authenticated management) and `/share`
(standalone public document). Add dashboard navigation for all existing authenticated
roles, but let the backend determine current sharing entitlement. A missing/disabled
backend leaves creation disabled with an honest message. No simulated success path
exists in the application.

The standalone route handler deliberately bypasses root layout/analytics so a
capability cannot be captured by marketing scripts. It uses a restrictive CSP,
no-store, no-referrer, noindex and no third-party resource. The secret lives only
in the URL fragment until synchronously removed, then in memory. API fetches omit
cookies and referrer, prohibit redirects and use Authorization instead of token
URLs. Current/last-known GPS is visibly distinguished; coordinates are shown
without third-party maps, history or account/customer information.

The `/share` Next configuration override preserves no-referrer and DENY after
global site headers are applied. Opening a second fragment link in the same tab
scrubs the new secret immediately, invalidates the old vehicle session and starts
a new check. Back navigation without a fragment clears the capability.

Creation requires an explicit location-sharing acknowledgement. A token is shown
once, copied only when the user presses Copy, and cleared on vehicle switch,
pagehide/Back-Forward cache, or session change. Requests bind to the captured login
session; cross-tab/same-tab account change cannot restore stale results or create
under a newly switched account. Refresh and lifecycle generation checks reject
old responses. The viewer clears before every poll and visibility transition,
uses a conservative request-start expiry clock and rejects malformed payloads.

Required companion: navii-gps-backend temporary-tracking-link migration/module.
`LIVE_TRACKING_LINKS_ENABLED` must remain false pending separate migration/release
approval and the backend release gates. Both API URL frontend environment variables
should point to the same intended backend.

Local checks:

    node --test test/live-links-*.test.mjs
    npx tsc --noEmit
    npx eslint app/dashboard/live-links/page.tsx app/share/route.ts

The focused tests run actual viewer JavaScript in a DOM stub and transpiled React
code with controlled hooks; they do not prove a real browser's behavior. Real
Chromium smoke was attempted with local-only fixtures but could not launch because
its socket() call was blocked with EPERM, including the reviewed permission retry.
Run real-browser initial load, reload, Back/Forward cache, session switch,
visibility, response-after-expiry and interrupted/repeated create/revoke before
release. Verify production response headers as Next configuration and ingress can
modify headers. No live token, location, deployment or external share was performed.

The backend currently keys one public limit by direct socket address. Behind the
loopback proxy this can become a shared 240/minute cap. Actual ingress rate capacity
and Authorization/response-body log redaction are enablement blockers. Do not
silently trust X-Forwarded-For or enable the feature to work around those checks.
