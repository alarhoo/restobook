# Delivery, CI, and environments

## Branch and review policy

Feature/fix branch → PR → main for this new repository. If dev/qa promotion branches are introduced later, all changes still arrive by PR and QA/PROD releases require explicit manual promotion. Never commit development directly to main. The sole initial main commit is repository initialization because GitHub requires a base commit for feature branches and PRs.

Foundation PR remains reviewable; it is not automatically merged. Repository branch protection is not configured by files alone. An administrator must enable required reviews/checks and prohibit direct/force pushes before code collaboration. The foundation workflow validates documents; it is not yet application CI.

## M1 CI

Frozen pnpm install; format/lint/typecheck; meaningful unit/integration tests; Nx affected build/tests where safe; foundation validation always. Database tests use ephemeral PostgreSQL and the runtime role. Establish tested Node/pnpm/Angular/Nx/Nest/PrimeNG compatibility and commit exact versions and lockfile. Frontend bundle budgets and public dependency/security review become release checks.

## Build once, promote

Build immutable containers for guest, restaurant, tenant, platform and API from one source revision. Track each image digest in a release manifest. DEV deploy may follow an approved merge once configured; QA and PROD always use manual promotion of those same digests and environment approvals. Do not rebuild with QA/PROD-specific frontend constants.

Runtime public configuration exposes API base URL, identity public client settings, environment label and safe feature presentation flags. Tenant configuration comes from API, not build time. Secrets remain server-side Secret Manager references. Backend enforces entitlements even if a UI feature flag is changed. Marketing site, custom domains, and additional deployables are not silently added.

## Infrastructure target

Reusable Terraform modules for Cloud Run/Cloud SQL/storage/identities; environment configs DEV/QA/PROD in asia-south1. Remote state, least-privilege GitHub OIDC/workload federation, separate service identities, resource limits and backups. Terraform apply and database migration jobs require reviewed plans and explicit environment release authorization. No placeholder workflow should claim to provision working infrastructure.

Migration sequence: compatible expansion first, apply reviewed migration, deploy compatible app, backfill if needed, remove obsolete schema in a later release. Rollback app image only if schema remains compatible; restore is not a routine schema rollback. Test migration from previous version with representative synthetic data.

## Pilot gate

Configured tenant/domain and staff provider; verified RLS runtime role; reviewed taxes/receipt policy and privacy retention; restore test; measured load/reconnect test; logs/alerts; no real customer credentials in repository; outlet staff trained on join PIN, order acceptance, manual payment records and cleaning. See acceptance scenarios for required workflows.
