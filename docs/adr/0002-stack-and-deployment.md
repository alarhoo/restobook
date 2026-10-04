# ADR 0002 — Stack and deployment

Date: 2026-10-04. Status: accepted foundation direction.

## Context

The developer already works in Angular/NestJS/PostgreSQL and wants reusable, documented engineering rules. Operational screens need responsive rich controls while guests need mobile-first browser use.

## Decision

Nx + pnpm; Angular/PrimeNG and signals; four web surfaces with shared libraries; one NestJS modular API; Drizzle and PostgreSQL-native migrations; GCP Cloud Run/Cloud SQL in asia-south1 target. SSE update hints with snapshot recovery and shared fanout when deployed across instances. Dependency versions pinned after M1 compatibility validation.

## Alternatives

React is viable but adds a second chosen frontend stack without a current need. Microservices make cross-domain commands and delivery more complex. Prisma is viable; Drizzle was selected to keep SQL/RLS/exclusion behavior explicit. WebSockets are viable for future bidirectional needs; HTTP commands plus SSE fit current flow.

## Consequences and verification

Custom floor-map/timeline/flexible-column compositions are needed. Multi-instance live updates and scheduled outbox dispatch require deliberate infrastructure. No silent background work or affinity guarantee. M1 validates builds/boundaries; M4 validates reconnect/fanout; M8 validates immutable release and restore.
