# Engineering standards

## Code and lint baseline

TypeScript strict mode, explicit API DTOs, validated inputs, exhaustive domain enums, no `any` except a narrow documented boundary using unknown first. Prefer const, consistent imports, no floating promises, no unused symbols, no console in application code, no arbitrary lint disables. ESLint flat configuration, typescript-eslint typed rules for application projects, Angular template rules, React rules only if React is later approved. Formatting through Prettier with editor/CI consistency.

The user's existing personal ESLint rules have not been supplied. M1 adds a reviewed shared baseline and documents how to extend it; it must not claim equivalence to an unseen custom rule set. No reusable global skill is installed by this foundation.

Angular: standalone components, signals for local/reactive state, computed derivation rather than effect-driven copying, lazy feature routes, typed forms, OnPush where applicable, explicit loading/error states. RxJS remains appropriate for streams/cancellation. Never create a second source of truth by duplicating query state into signals without ownership rules.

NestJS: domain modules, thin controllers, runtime validation, explicit permission guards plus service ownership checks, transactional commands, typed errors. Persistence code centralizes scoped transactions. Database row types do not become public DTOs.

## Repository conventions

Lowercase kebab-case filenames; feature/domain folders; purposeful shared code; tests near source or domain test directory. Store ADRs and FDD/TDD alongside code; no generated documentation replacing business rules. CI checks every changed relevant project. Commits use `docs:`, `feat:`, `fix:`, `test:`, `chore:`, `refactor:` with a concrete scope when helpful.

Dependencies are pinned after compatibility verification, lockfile committed, install frozen in CI. Approve only known required package build scripts. No secrets in `.env` commits; provide names with safe placeholders in `.env.example` at scaffold time. Upgrade major dependencies through focused PRs.

## Tests that matter

- Pure business calculations: money, discount allocation, modifier rules, item-derived progress.
- PostgreSQL integration: RLS with runtime role, composite FKs, reservation races, double seating, concurrent settlement, rollback and idempotency.
- API tests: permission/entitlement boundaries, scoped projections, invalid DTOs, conflict behavior, retries.
- Browser E2E: configure venue, activate/join/order, prepare/serve/settle/clean; book/check in; two tenants; accessible keyboard paths.
- Live updates: duplicate hints, reconnect, no stale capability subscription, polling fallback.

Use actual PostgreSQL for constraint/RLS tests; SQLite or mocked repositories cannot verify these properties. Testcontainers or ephemeral CI PostgreSQL are acceptable. Avoid tests that only reproduce implementation structure. New features must exercise relevant adverse paths.

## Definition of done

Feature matches FDD and contracts; permissions/tenancy tested; loading/empty/errors/online behavior complete; no console failures or dead UI; useful automated tests pass; migrations versioned and reviewed; documentation/status updated; PR describes outcome, validation and limitations. Screenshot review includes mobile guest/waiter and desktop staff. Deployment done only when explicitly requested and release gates pass.
