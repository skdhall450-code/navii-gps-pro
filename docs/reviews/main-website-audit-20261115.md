# Main website audit fixes — review candidate

Based on main `5672172` (15 November 2026). No production release.

## Changes
- Shared legacy Footer uses the existing official shop destination helper, matching headers and new-tab isolation.
- `/shop-now` keeps its URL, canonical, branding and hero. It now guides visitors to the official shop, without conflicting legacy prices or missing-photo cards. Legacy pricing calculators remain unchanged and tested.
- Home/software/contact copy references Android and web, not unverified iOS availability. Alerts and school-parent access are configuration-dependent, not guaranteed instantaneous delivery.
- G17 specification table includes model and exact-unit voltage/network verification, warranty and package/renewal confirmation requirements. No exact variant, numerical voltage, warranty duration, price or new commercial terms are invented.
- Remove duplicate homepage stats band and CTA stats. Keep all informational SEO sections, URLs, internal links, assets and black-blue styling.
- Replace unsupported satisfaction/absolute security/experience counters in the touched blocks. Retain owner-supplied 25K vehicles/500 clients as marketing figures, not a live count. Illustrative dashboard metrics remain labelled sample/demo. A new substantiation review is still needed before treating any historical marketing number as currently verified.

## Boundaries
`shop.naviigps.com`, Razorpay, backend, customer panel, device settings, main branch and production are untouched. Branch-specific Vercel deployment is disabled. Existing PR44/108 overlap some public-copy concepts but bundle different work; they are not modified or claimed integrated by this narrow candidate.

## Review still needed
- Exact G17 hardware variant, label/spec sheet, current warranty, renewals and approved downloadable manuals. Do not restore unconditional voltage/network promises from historical notes.
- Real desktop/mobile browser layout and Shop Now interaction checks. Local sandboxed Chromium fails before loading with OS `socket() failed: Operation not permitted`; no security bypass attempted.
- A final render review and user approval before any production release. This document is a change review, not a live preview.

## Requested motion restoration
Fresh live HTML/CSS on 15 November showed a static review grid and a one-shot 4-second hero float, identical to the original PR134 motion source. Static preview screenshots were captured with reduced motion. The review motion was not removed by PR134.

The user's subsequent direction explicitly asks for visible floating glow and running reviews. The draft now adds continuous decorative hero glow/float and a smoothly moving review strip. Both have pause/resume controls and respect live reduced-motion changes; reviews pause on hover/focus and retain an accessible static original list. No JavaScript means static content. Existing copy and original review records are unchanged. A normal browser test records actual movement, pause/resume, narrow-layout containment, reduced-motion behavior and a read-only live baseline video; videos are evidence, not a live deployment.
