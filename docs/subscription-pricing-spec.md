# NAVII GPS — Four-Plan Subscription & Pricing Specification
Status: DEVELOPMENT PROPOSAL ONLY. No production deployment, live billing, migrations or GPS device commands.

## 1. Pricing and commercial assumptions
Annual **base platform fee per vehicle** in INR excluding GST, GPS hardware, SIM/data, installation, Google Maps paid consumption, AI/video storage and other separately billed services.
| Plan | INR / vehicle / year | Named users | Available history | Moving / parked reporting | Maps |
| --- | ---: | ---: | --- | --- | --- |
| LITE | 100 | 1 | Previous 1 complete calendar month + current | 30s / 1h | OpenStreetMap |
| BASIC | 150 | 3 | Previous 3 complete calendar months + current | 10s / 5m | Google Maps |
| PRO | 200 | Unlimited* | Previous 24 complete calendar months + current | 10s / 5m | Google Maps |
| PRO MAX | 250 | Unlimited* | Previous 36 complete calendar months + current (proposed) | Configurable subject to hardware (proposed) | Google Maps + optional advanced layers |

*Unlimited named users means no fixed seat entitlement limit; reasonable infrastructure, abuse and usage limits remain applicable. Each rate is tentative until approved for sale.
Example: 100 PRO vehicles x INR 200 = INR 20,000 annual base platform charge before taxes/add-ons.
Plan changes never silently reprice existing contracts. No automatic renewals or payments are introduced here.

## 2. Features and entitlements
All four include web/app access, dashboard, analytics, administration/settings, time policies, client reports, users/groups (subject to seat limit), usage insights, fleet management, live monitoring, trip replay, maintenance, dynamic alerts/reports, E-Fence, Q ticketing, notifications, newsfeed, managed service reports, customization/integration and API integration.
- LITE: limited alerts and standard reports, standard support, 1 user.
- BASIC: limited alerts, majority standard reports, standard support, 3 users.
- PRO: all alerts and standard reports, VIP support, unlimited users.
- PRO MAX: inherits PRO, and proposes AI anomaly detection/fleet health, predictive maintenance, advanced report builder, enterprise multi-branch, webhooks, audit/SLA center and optional video, sensors, white label and route optimization. Hardware/provider dependencies need separate approval and metering.
- "Limited", "majority", "all", and API/customization access must be implemented as explicit versioned permissions and quotas, not ambiguous UI strings.

## 3. Required data model (backend; migration NOT yet approved)
- PlanCatalog(plan_code PK, catalog_version, annual_price_paise, currency, feature_json, effective_from, retired_at).
- TenantSubscription(id, tenant_id, plan_code, catalog_version, start_at, end_at, state [TRIAL,ACTIVE,EXPIRED,SUSPENDED,CANCELLED], price_snapshot_paise, tax_snapshot, renewal_policy, created_at).
- SubscriptionDevice(id, subscription_id, device_id, active_from, active_until); do not count a device twice during overlapping intervals.
- TenantMembership(id, tenant_id, user_id, role, status); enforce max **active named** users transactionally, including concurrent invitations.
- SubscriptionEntitlement(subscription_id, key, permitted, quota, revision) optional explicit override, auditable.
- BillingQuote(id, tenant_id, plan_code, vehicle_count, amount_paise, GST_details, created_at, expiry_at); invoice/payment integration is a separate project.
- AuditEvent(tenant_id, actor_id, action, target_id, occurred_at, before_json, after_json); redact secrets.

## 4. API contracts (proposed, not existing)
GET /api/subscriptions/plans -> public safe catalog, published effective revision.
GET /api/me/features -> effective plan, entitlements, usage, expiry (authenticated, tenant scoped).
POST /api/admin/subscriptions/quote -> quote only, admin scoped, immutable pricing snapshot.
POST /api/admin/subscriptions/assign -> super admin approved transaction with optimistic concurrency; no payment transaction implied.
GET /api/me/subscription -> current tenant plan, active seats, device count, accessible history window.
Mutating APIs require CSRF defenses where applicable, authenticated server-side role checks, tenant isolation, idempotency keys and audit logging.
**Do not authorize using localStorage or frontend menu checks.** Return 403 for denied features/tenants and 409 for exceeded plan limits.

## 5. Data retention & reporting policy
History windows are visibility and retention rules, not automatic destructive deletes. First establish the schema, archive location, legal/business obligations, backup coverage, restore test and precise date boundary semantics. Plan downgrade must not delete records without approved retention policy and recovery path. Use indexed tenant/device/timestamp queries and preaggregates for analytics. Current month defined in the tenant's agreed reporting timezone; raw timestamps in UTC.

## 6. Reporting interval implementation
"LogOn / LogOff" is interpreted as device moving/parked GPS reporting frequency, **not authentication logoff**. Device protocols differ; 10s/5m or 30s/1h must be applied only where hardware supports commands and acknowledgements. Avoid mass commands. Use per-model command adapter, rate limits, ACK timeout, opt-in rollout, and observed telemetry verification; retain currently working GT06 gateway, tracking windows and device forwarding.

## 7. Web + app behavior
One backend entitlement service shared by Next.js dashboard and Expo customer/dealer/admin apps. Use plan-aware navigation and feature upsell messages, but backend denies unauthorized actions. PRO MAX additions stay feature-flagged OFF until verified. Never put privileged entitlement controls only in mobile bundles.

## 8. Work batches & acceptance
P0 locate NestJS/Prisma source and mobile repositories, read-only audit, verify API/role ownership and live dependencies.
P1 subscription catalog, backend evaluation, tenant isolation, quote tests, transactional seat/device limits.
P2 feature map, report/alert quotas, data window checks, mobile/web screens, observability.
P3 device interval adapter tests in isolated staging; PRO MAX AI/integrations behind OFF flags; load tests and operating cost review.
Acceptance tests: 1 LITE login succeeds, 2nd active user rejected; BASIC 3 allowed/4th denied; PRO/MAX no seat count limit but tenant isolation mandatory; stale/expired subscription denial; 1/3/24/36 prior complete months + current visibility; quote 100 PRO vehicles = INR 20,000 base; cross-tenant API access returns 403; incompatible GPS device gets no reporting command; no database deletions.
Production rollout requires separate explicit approval after tests, rollback plan, database restore verification and cost sign-off.

## 9. Current implementation boundary
The website repository contains Next.js/React frontend and /dashboard auth/telemetry UI, but the actual NestJS/Prisma backend and Expo app source were not located in this audit. The companion `lib/subscriptions/plans.ts` is only a type-safe non-wired catalog. It does **not** activate subscription enforcement, payments, device reporting policies, or history deletion.
