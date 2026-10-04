# Restobook agent instructions

## Repository workflow

- Read this file, `docs/README.md`, and documents for the feature before edits.
- Never develop or commit directly on `main`, `qa`, or `dev`. Use a focused `feature/<scope>` or `fix/<scope>` branch and a PR. If only main exists, target main; do not create promotion branches without a delivery need.
- Preserve existing work. Inspect branch and working tree before changing files. Never force-push, silently reset changes, or merge your own PR without an instruction to merge.
- Use meaningful conventional commits. Separate independently reviewable changes. Update the PR around the final implementation, including validation and limitations.
- Do not create GitHub issues automatically. The versioned backlog is the initial planning record.
- All application, database, infrastructure, and environment changes must be versioned. Do not make manual production changes.

## Development strategy

- Documentation first: update functional behavior, contracts, data relationships, and acceptance criteria before or alongside code. Record a consequential architecture change in an ADR.
- Implement complete vertical slices. Wire persistence, authorization, errors, loading/empty states, navigation, and meaningful tests. No fake success actions, silent mock APIs, or dead buttons.
- Use the selected stack and modular boundaries. Shared libraries must have a clear consumer and purpose. Do not create microservices to anticipate hypothetical scale.
- Pin mutually compatible supported dependency versions at scaffold time. Use the package manager lockfile. Do not run uncontrolled latest-version upgrades.
- TypeScript strict mode; no implicit any, unexplained assertions, or broad disabling of lint rules. Prefer small pure functions and named domain types. Frontends cannot import API implementation or database schema.
- Apply the [engineering standards](docs/engineering/standards.md) and [UX rules](docs/product/ux-rules.md). No user's pre-existing custom ESLint configuration has been supplied; do not claim to have imported one.

## Mandatory domain rules

- Derive tenant identity from a verified hostname/domain mapping and authenticated membership or narrowly scoped guest capability. Never trust a tenant ID provided by a client as authorization.
- Check permissions, outlet scope, resource ownership, and module entitlement on the server. Test isolation with two tenants and two outlets.
- Use tenant-scoped composite references and RLS. Runtime database role must not own tables or bypass RLS; transaction-local tenant context must not leak across pooled connections.
- Reservation is not a dining session; a session contains multiple orders. Orders contain immutable item/price snapshots; kitchen progress is item-level; bills and payment records are independent.
- Enforce reservation collisions in the database. Use locks/constraints, command idempotency, and version checks for conflicting mutations. No in-memory-only correctness rules.
- Money uses integer minor units plus currency, never binary floating-point. Calculate totals on the server; tax and fee configuration require business review before live issuance.
- A table QR never contains a session credential or private guest information. Join only an active staff-opened session using its rotating PIN. Guests see only their own orders in V1.
- Never collect card credentials. Recorded manual payment is not a gateway-confirmed payment. No PMS room charging in MVP.
- Offline menus may be cached. Ordering, booking, billing, and settlement require online acknowledgement. Do not queue silent offline submissions.
- Durable state and audit records are authoritative. Real-time events may duplicate or disappear; clients refetch snapshots after reconnecting.

## Verification and handoff

- Run checks appropriate to the changes; record exact commands and results, including anything not run. Do not claim a deployed or tested application based on document validation.
- For application slices test failure paths, permission denial, cross-tenant access, retries, and concurrent conflicts, not just the happy path.
- Update `docs/delivery/status.md` and the feature acceptance checklist. Summarize outcome, validation, limitations, and next milestone.
- Keep secrets, PII, customer menus/images, and production exports out of this public repository. Use synthetic fixtures.
