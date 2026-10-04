# Implementation plan

Implement in dependency order. Each milestone produces a reviewable PR and a working vertical slice. Estimates are intentionally unset until scaffold and the first pilot workflow reveal actual effort.

| Milestone | Deliverable | Exit gate |
|---|---|---|
| M0 — Foundation | Product/TDD/domain/contracts/screens/rules/backlog | Documentation validator passes; foundation PR reviewed |
| M1 — Workspace and isolation | Nx/pnpm, first apps/API, PostgreSQL migrations, identity/context/RLS, CI | Two-tenant deny tests, seeded synthetic venues, frozen build, health checks |
| M2 — Onboarding and published menu | Provision owner, outlet/floor/table/station/menu config, public browsing, QR print | Owner can publish a real persisted outlet; guest sees only published menu |
| M3 — Dining and orders | Staff seating, join PIN/capability, cart, assisted/guest order, accept/reject | Multiple guests/orders, price drift, duplicate retry and expired capability tested |
| M4 — Kitchen and live operations | Station tickets, item preparation/ready/service, floor and waiter views, realtime | Multi-station order aggregates correctly; restart/reconnect and polling fallback work |
| M5 — Billing and closure | Totals, manager discount, immutable bill, manual settlement, cleaning | Concurrent payment and retry create one settlement; history immutable |
| M6 — Reservations | Availability, allocation, guest management link, host board/check-in | Last-slot race, buffer boundaries, no-show/cancel/reassign, check-in idempotency pass |
| M7 — Tenant/platform administration | Staff grants, plans/modules/quotas, branding, audited support metadata | Module downgrade preserves open visits; cross-outlet grants and platform separation pass |
| M8 — Pilot hardening and deployment | Terraform, immutable image promotion, backups, accessibility, load/restore | Pilot release checklist complete; QA/PROD promotion manually authorized |

M2 uses minimum administrative configuration needed for the workflow. M7 completes administration rather than deferring all onboarding until after orders. Provision all MVP modules initially through explicit seed/provisioning entitlements, never by skipping server checks.

## Next instruction for a coding agent

“Read AGENTS.md and the foundation documents. Implement M1 on feature/workspace-foundation. Establish compatible pinned Nx/pnpm/Angular/PrimeNG/NestJS/Drizzle versions. Scaffold guest and restaurant web plus API first, with tenant/platform apps as needed for later slices. Add PostgreSQL migrations, scoped transaction context and RLS tests using the runtime role; seed two synthetic tenants/outlets; add health endpoints and CI. Run the checks, update status, commit focused changes and open a PR. Do not deploy or merge automatically.”

Before choosing an identity provider integration, confirm project credentials available for local test/dev; use a clearly test-only identity adapter until configured, never insecure tokens in production. Missing credentials should not block unrelated scaffold and isolation work.

## Review checkpoints

At M2 validate venue setup with a restaurant owner. At M3 validate QR/PIN and waiter acceptance ergonomics. At M5 validate calculations and operational receipt format with pilot owner and jurisdiction expertise. At M6 verify real seating/cancellation policies. Before M8 set hosting budgets, domains, retention and backup expectations.

## Later phases

Verified gateway payments/webhooks; waitlist and notifications; transfers/combined tables/split tender/refunds; custom domains and languages; POS/PMS integrations; advanced analytics and inventory. Each adds its own domain and security ADR. No later-phase feature is included in the MVP promise.
