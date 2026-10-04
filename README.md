# Restobook

Multi-tenant restaurant and hotel dining SaaS: digital menus, reservations, table operations, QR ordering, kitchen tickets, and basic billing.

**Status:** product and engineering foundation. Application code, deployed services, payment integrations, and runnable Nx projects are not yet present.

## Start here

1. Read [AGENTS.md](AGENTS.md) before changing this repository.
2. Read the [foundation index](docs/README.md), [product brief](docs/product/product-brief.md), and [architecture](docs/architecture/system-design.md).
3. Implement [Milestone M1](docs/delivery/implementation-plan.md) on a new feature branch after this foundation is merged.
4. Run `node tools/check-foundation.mjs` to validate foundation documents and local links.

## Chosen direction

- Angular + PrimeNG, with signals and lazy feature routes; mobile-first guest and waiter experiences.
- Four frontend applications: guest, restaurant operations, tenant administration, platform operations.
- One NestJS modular API; PostgreSQL shared database with tenant isolation and RLS.
- Nx + pnpm workspace, Drizzle persistence, external identity provider for staff.
- Separate reservation, dining session, order, kitchen ticket, bill, and payment records.
- GCP target in `asia-south1`; build once and manually promote immutable images to QA and production.

Exact dependency versions are resolved and compatibility checked during M1, then pinned. These are architecture decisions, not claims of an installed runtime.

## First usable workflow

Tenant creates an outlet, floor, tables, and menu → staff seats a walk-in → guest joins an activated table using its QR code and rotating PIN → guest orders → kitchen prepares → waiter serves → cashier issues and settles a bill → staff cleans and releases the table.

Reservations join this workflow through host check-in. QR codes identify tables; they never authorize access to a previous guest's session.

See the [implementation plan](docs/delivery/implementation-plan.md) for milestone acceptance gates and the [decision register](docs/adr/README.md) for assumptions that need later confirmation.
