# Architecture decisions

| ADR | Status | Decision |
|---|---|---|
| [0001 — Tenancy and boundaries](0001-tenancy-and-boundaries.md) | Accepted foundation direction | Shared PostgreSQL, RLS, scoped references, separate visits/orders/bills |
| [0002 — Stack and deployment](0002-stack-and-deployment.md) | Accepted foundation direction | Angular/Nest/Nx/Drizzle modular monolith; GCP target |
| [0003 — Guest access and payment scope](0003-guest-and-payment-scope.md) | Accepted foundation direction | Staff activation + PIN; private participant orders; manual payments V1 |

Accepted here means the foundation's implementation default; future changes need a superseding ADR and consistent contract/behavior updates.

## Open decisions before relevant milestone

- M1: exact compatible versions and identity integration/local test adapter.
- M2: real venue business hours, visit duration, buffer, taxes/fee treatment and receipt text; public host/domain.
- M3: pilot validation of staff activation/PIN and guest join friction.
- M5: tax/financial receipt requirements, bill sequence scope/fiscal-year reset policy and correction procedures.
- M6: cancellation/no-show policy, booking horizon and guest contact abuse controls.
- M8: hosting budget, real capacity targets, retention/deletion rules, backup/restore objectives, notification provider if later added.

## ADR template

Record context, decision, alternatives considered, consequences, verification, and date. Include status and replacement reference where superseded. Use a separate decision for new scope such as gateway payment, split bills, table merges or room charges.
