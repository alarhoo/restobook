# Versioned foundation backlog

This is a build plan, not automatically created GitHub issues. Convert items to issues only if requested. Each item links to a milestone; acceptance references detailed scenarios in [acceptance.md](acceptance.md).

| ID | Milestone | Work | Acceptance criteria |
|---|---|---|---|
| RB-001 | M1 | Scaffold Nx/pnpm apps, boundary tags, strict TS/lint | Frozen install; builds/lint/typecheck pass; no web→API imports; documented local start |
| RB-002 | M1 | Tenant domains, staff identity/membership and RLS | A cannot read/write B; missing context denied; pool reuse safe; composite FKs deny mismatches (AC-01) |
| RB-003 | M1 | Migrations, seeds, API errors and command foundation | Two synthetic tenants/outlets; repeatable migration; typed errors; idempotency/version primitives (AC-02) |
| RB-004 | M2 | Provision owner, organizations/outlets/settings | Resumable setup; invitation single-use; reviewed currency/timezone/hours; no owner escalation |
| RB-005 | M2 | Floor/table/station setup and QR print | Correct capacity/geometry; QR contains opaque locator only; revoke/rotate works (AC-03) |
| RB-006 | M2 | Menu catalogue/modifiers/offerings/publication | Outlet-specific prices; modifier bounds; safe uploads; drafts hidden; station required (AC-04) |
| RB-007 | M3 | Seat session and participant join | Atomic seating; upcoming-booking warning/guard; join PIN rotated; guests isolated (AC-05) |
| RB-008 | M3 | Cart/order submission and waiter acceptance | Server prices; MENU_CHANGED explicit; same retry returns one order; accept/reject queues (AC-06) |
| RB-009 | M4 | KDS station tickets and item service | Station routing; partial readiness doesn't complete whole order; audited void (AC-07) |
| RB-010 | M4 | Floor/waiter screens and realtime hints | Correct badges; keyboard/list alternative; reconnect snapshot and duplicate handling (AC-08) |
| RB-011 | M5 | Bill calculations/issue/void/print | Exact money rounding; manager discount; immutable bill snapshots and unique number (AC-09) |
| RB-012 | M5 | Manual payment/session close/clean | Cash/card/UPI record; exact total; one concurrent settlement; capabilities revoked (AC-10) |
| RB-013 | M6 | Public availability and booking allocation | Hours/capacity/blocks/buffer respected; final-table race only one success (AC-11) |
| RB-014 | M6 | Reservation secret access, host board, check-in | Secret token scoped; cancel/no-show releases; reassign atomic; one session (AC-12) |
| RB-015 | M7 | Staff grants/branding/entitlements/platform tools | Revocation effective; outlet quotas atomic; suspended/downgraded sessions safely finish (AC-13) |
| RB-016 | M8 | Infrastructure/release/monitoring/backup | Immutable digests; manual promotion; private secret references; measured restore (AC-14) |
| RB-017 | M8 | Accessible/responsive pilot end-to-end test | Guest/waiter mobile and staff desktop usable; keyboard complete; failure messaging (AC-15) |

Dependencies: RB-002/003 before tenant CRUD; RB-005/006 before RB-007/008; RB-008 before kitchen; kitchen before final billing; core isolation before public booking. Scoped entitlements apply from the first feature, even while plan administration waits for M7.
