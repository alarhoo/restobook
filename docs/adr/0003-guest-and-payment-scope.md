# ADR 0003 — Guest session access and payment scope

Date: 2026-10-04. Status: accepted foundation direction.

## Context

Guest menu access should be easy, but copied table QR codes must not reveal another party's orders or let outsiders open sessions. A full POS/payment/PMS replacement would expand MVP risk and scope.

## Decision

QR identifies table only. Staff activates the session; guest enters rotating PIN and receives a participant-bound secure capability. Each guest reads only their own orders; staff views the session. V1 supports one final bill and one exact manual cash/card/UPI payment record. No provider verification, partial/split tender, room charging, settled-bill edit or automated refund.

## Alternatives

QR-only session access is convenient but permits remote joins with copied links. Required guest accounts add friction and unnecessary identity data. Shared guest bill/order visibility can reveal another diner's contents. Gateway/POS integration adds webhook, reconciliation, refund and operational dependencies before the core workflow is proven.

## Consequences and verification

PIN activation adds a host task; validate ergonomics with pilots. Lost capability needs staff rejoin. Manual settlement requires cashier trust and audit, and must be labeled clearly. M3 tests cross-participant/old-session access; M5 tests settlement retries and immutability. Gateway integration later requires a new payment lifecycle ADR.
