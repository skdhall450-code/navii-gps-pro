# Priority local discovery and mobile enquiry review — 19 November 2026

Continues draft PR #140 (`seo/local-discovery-20261117`) from head 579fc5038fd1523b3095bd7454074bb81506c011. Inspected open PRs, the main SEO maintenance ledger and PRs #138/#139/#140 before editing. PR #138 is now merged by another workflow; its final publication evidence is in that PR. PR #139 is still a separate draft. Do not reimplement either batch or infer release permission from their history.

## Evidence and change

The existing homepage draft adds direct links to Chandigarh, Dera Bassi, Mohali, Zirakpur and Kharar without new routes. Its pending mobile acceptance is the priority.

ContactForm fields inherit text-sm (14px) from their labels; they lack explicit width/min-width constraints inside grid tracks. Set all six visible input/textarea controls to text-base (16px), w-full and min-w-0, with min-w-0 labels. Preserve validation, field names, consent, submission logic and the offscreen honeypot.

Extend the existing Home browser suite with 320px and 390px touch-view journeys through every homepage city link and its primary enquiry link. Assert one H1, self-canonical, viewport overflow, actionable 44px controls, the contact anchor, required name/email/phone semantics and 16px field text. Also check all five discovery links without JavaScript. Screenshots and a partial/completed journey inventory use the existing Home CI artifact. A failed run's partial inventory is not an overall pass.

Requests stay isolated to local document/assets: external traffic, APIs and writes are blocked by the existing context. No form is filled/submitted, no phone/email/WhatsApp action is invoked. Existing workflow and browser launch configuration are unchanged.

## Validation and limits

- Node syntax, focused ESLint and diff whitespace checks passed before review publication.
- Local sandboxed Chromium preflight failed before page load with socket permission error; no bypass or local browser pass.
- Hosted final-head build, source/rendered SEO and mobile/browser results must be recorded in PR #140. Earlier CI applies only to the old head.
- Browser checks are synthetic review-build acceptance, not live mobile acceptance, Core Web Vitals, backend delivery or real enquiries.
- Google indexing, Search Console average position and actual enquiry conversion remain unverified. No authorized Search Console export is available in this run.

Keep draft. No main, production, database, service or routing changes; no IndexNow submission, outreach or spend. Next: inspect final-head CI, repair reproduced failures, retain evidence in PR #140, then continue the existing Delhi draft. Live acceptance waits for explicit release authorization.
