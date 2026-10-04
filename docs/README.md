# Foundation index

The foundation defines the target product and build strategy. Only the document validation tooling is executable today.

| Document | Purpose |
|---|---|
| [Product brief](product/product-brief.md) | Users, hierarchy, scope, packaging, assumptions |
| [Functional design](product/fdd.md) | Rules and end-to-end workflows |
| [State machines](product/state-machines.md) | Commands, transitions, invariants |
| [Screen catalogue](product/screens.md) | Routes, roles, content, and acceptance expectations |
| [UX rules](product/ux-rules.md) | Floorplans, forms, responsive and accessible behavior |
| [System design / TDD](architecture/system-design.md) | Applications, modules, deployment, reliability |
| [Data model and ERD](architecture/data-model.md) | Entities, references, constraints, concurrency |
| [API contracts](architecture/api-contracts.md) | Endpoints, DTO examples, failures, idempotency |
| [Security and permissions](architecture/security.md) | Tenant context, guest access, RBAC, entitlements |
| [Engineering standards](engineering/standards.md) | Coding, lint, testing, documentation conventions |
| [Delivery and environments](engineering/delivery.md) | PRs, CI, runtime config, promotions |
| [Implementation plan](delivery/implementation-plan.md) | Milestones, acceptance gates, dependencies |
| [Versioned backlog](delivery/backlog.md) | Concrete build items and acceptance criteria |
| [Acceptance scenarios](delivery/acceptance.md) | Critical product and isolation scenarios |
| [Current status](delivery/status.md) | Implemented versus planned |
| [ADRs](adr/README.md) | Decisions and open questions |

## Source-of-truth order

AGENTS.md governs repository work. Accepted ADRs govern architecture. FDD governs business behavior; data model and API contracts must match it. Backlog and screens refine delivery, not override security rules. Resolve inconsistencies explicitly before implementation.

## Product vocabulary

Tenant = paying SaaS customer. Organization = a brand/company operated by that tenant. Outlet = a dining venue. Floor = physical floor/section grouping. Dining table = seating resource. Dining session = one party's visit. Reservation = a future booking. Order = one submission during a visit. Kitchen ticket = station work. Bill = issued financial snapshot. Payment record = recorded or provider-confirmed settlement evidence.

Documentation reviewed against official PostgreSQL RLS and Cloud Run connection guidance on 2026-10-04; see sources in the TDD. Commercial and operational defaults remain product assumptions.
