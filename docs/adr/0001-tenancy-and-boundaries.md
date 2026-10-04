# ADR 0001 — Tenancy and domain boundaries

Date: 2026-10-04. Status: accepted foundation direction.

## Context

Restobook serves multiple independent clients, brands and outlets. Most workflows need atomic coordination between tables, bookings, orders and settlement. A solo founder benefits from one operational database and clear data boundaries.

## Decision

Shared PostgreSQL with tenant_id on tenant-owned entities; RLS plus explicit scoped query services and composite references. Tenant→organization→outlet→floor→table hierarchy. Reservation, dining session, order, kitchen ticket, bill and payment remain separate aggregates. One table per session, one allocation per reservation and one current bill per session in V1.

## Alternatives

Database per tenant increases provisioning/migration/backup overhead; leave as a future enterprise isolation option. A session disguised as an order fails for repeated submissions and walk-ins. A single table status containing booking/kitchen/payment stages cannot show simultaneous future reservation and current occupancy.

## Consequences and verification

Runtime role/transaction context and pooled connection tests are mandatory. Database constraints defend concurrent bookings/seating. Derived badges add UI work but keep physical service state coherent. M1 verifies two-tenant RLS and cross-tenant references; M3/M5/M6 verify transactions.
