# Dependency security review — 11 October 2026

This patch keeps the existing React 19.1.0 and Next 15 major, preserves address main `8440462a79f0803927d45d0a051bf93b0502c610`, and retains the review branch's Vercel deployment guard. It does not deploy or change authentication.

## Targeted changes

- Next and eslint-config-next: 15.5.22 → 15.5.27. This covers the reported AVIF optimizer / Windows RCE and later cache-poisoning ranges without a major framework upgrade.
- Existing Sharp override: 0.35.3 → 0.35.5, including the native libvips packages. Updating Next alone would leave the old explicit override in effect.
- source-map-js: 1.2.1 → 1.2.2.
- Development graph: brace-expansion 1.x → 1.1.21 and 5.x → 5.0.12; js-yaml 4.x → 4.3.2. Version-scoped overrides preserve dependency majors.

Fresh lockfile audits after these updates report **zero production graph findings** with `--omit=dev`. This means no advisory was reported by that query; it does not prove absence of unknown vulnerabilities or certify production configuration.

## Unresolved development-only chain

The full audit still reports five package nodes for **one underlying advisory**, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm):

`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces 3.0.3`

The current advisory has no published patched Braces release. npm suggests downgrading eslint-config-next to 14.2.35, which would cross the framework major and is not applied. This chain is absent from the production audit and is used for repository-controlled lint/glob inputs; no HTTP request path to it was identified. Do not feed untrusted glob patterns into build tooling. Track an upstream patch or a separately reviewed replacement; this document does not mark the issue resolved or grant blanket risk acceptance.

## Validation and release boundary

Validate with a fresh `npm ci`, full and production-only audits, unit/rendered tests, ESLint, TypeScript, production build, all public SEO checks, and the paired private synthetic browser workflow. That workflow additionally checks real image optimization on loopback and retains its external-network fence. Passing test results are recorded in the PR/CI, not inferred from this document.

The branch guard only disables `codex/panel-phase1-20261011`; merging into an enabled production branch can trigger its normal deployment. Deployment requires separate approval and backend compatibility gates.
