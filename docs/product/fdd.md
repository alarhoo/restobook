# Functional design (FDD)

## F01 — Onboarding and publication

Platform operator creates a tenant and owner invitation. Owner verifies identity with the configured provider, accepts membership, creates organization and outlet, selects timezone/currency, and configures hours. They create floor/table positions and capacities, kitchen stations, menu items, outlet offerings, prices, modifiers, and allergen tags. Publication validates required fields and station routes. The guest URL shows only published data; draft items never leak.

Self-serve provisioning can follow once this flow is proven. Invitations are single-use, expiry-bound, tied to a verified email, and cannot escalate privileges. Onboarding steps are resumable. An owner can preview the published guest experience before printing QR codes.

## F02 — Reservation

Guest selects outlet, local date, party size, time, and optional section preference. Availability returns slots, not table identifiers. Guest provides name and phone; email and special requests are optional. Phone is contact data, not a verified identity in V1. Rate limits and abuse controls apply.

Creation allocates one table with sufficient seats using smallest-fit capacity, section preference, then stable table identifier. Configurable illustrative defaults: 90-minute visit, 15-minute cleaning buffer, 15-minute booking slots, 30-day horizon. No promised availability based on an average dining duration. Atomic allocation checks hours, closures, table blocks, future allocations, and current occupancy. Two requests competing for the final table cannot both succeed.

A successful reservation is immediately confirmed; host confirmation is not an additional V1 stage. Return a confirmation reference and secret management link. Secret link permits viewing/canceling this reservation only. Staff may create phone bookings with the same constraints. Guest modifications in V1 cancel and rebook, with clear warning that the original slot may be lost; staff amendments occur transactionally.

Host records arrival and checks in to the assigned available table. Check-in creates exactly one session. Late/no-show policies are outlet-configured; staff marks no-show, not an unimplemented cron job. Cancellation or no-show releases the future allocation. Host may reassign a future reservation atomically; guests never choose exact tables.

## F03 — Walk-in and table activation

Host chooses an available table and enters party size; name/phone are optional for a walk-in. Capacity, blocks, and upcoming reservations constrain admission. Host sees the next booking and confirms a departure deadline. If there is insufficient time for the configured visit and buffer, choose another table or explicitly amend the booking with permission; do not silently overbook.

Opening a session claims one table, assigns waiter if supplied, records seating time, and creates a rotating join PIN. QR codes contain only a cryptographically random public table token. Guest scans QR and enters the PIN shared at seating. Server returns a scoped capability in a secure HttpOnly cookie. Multiple guests may join the same session; each has a separate participant identity and sees only their own orders. Waiter and cashier can view the whole session.

An available table's QR shows a menu and an instruction to ask staff to open a session. A copied QR alone cannot open/inspect a session. PIN brute force is rate-limited; closing the session invalidates all capabilities. Never reuse a PIN across parties. Guests may request the bill without exposing another participant's order details.

## F04 — Menu and ordering

Guest browses categories, searches items, filters dietary tags, opens item detail, selects variant and modifier choices, enters a short preparation note, and builds a cart. Allergens are descriptive tags, not medical guarantees. Selection counts and modifier compatibility are checked in the UI and again on the server.

On submission the server resolves current published offerings and prices, checks availability and session status, creates immutable order/item snapshots, and returns the server totals. If the displayed offering version or price changed, respond with `MENU_CHANGED` and fresh details; require explicit reconfirmation rather than silently changing the price. A repeated idempotency key with the same request returns the original result. Different content under the same key is a conflict. Multiple distinct orders per session are valid.

Waiter accepts or rejects a placed order. Acceptance creates station tickets atomically via durable outbox events. Out-of-stock after placement is handled before acceptance by rejection and a clear reason. V1 does not support partially accepting an order; staff may reject and assist with a replacement. Accepted items may be voided only by manager with a reason; propagate cancellation to kitchen and bill eligibility.

## F05 — Kitchen and service

Menu offerings specify a station. Accepted items route to one ticket per station per order. Chef marks ticket preparing and individual items ready. Waiter marks each ready item served. Order status is derived from non-voided items, never blindly advanced when one station finishes. Ticket views show quantities, notes, table, elapsed time, and allergies from snapshots. Guests see their own item progress.

KDS and waiter screens reconnect and refetch persisted data after loss of connection. Duplicate events do not repeat commands. Chefs cannot change menu prices, view guest contact details, or issue bills.

## F06 — Billing and settlement

Guest or staff requests bill. Session becomes checkout requested, guest ordering is disabled, and waiter confirms service progress. Any placed but unaccepted order must be accepted/rejected first. All non-voided accepted items must be served before bill issuance; unresolved items block issuance. Cashier issues one final bill for the session. Store server-computed line, tax, fee, discount, rounding, and total snapshots, a scoped sequential bill number, and calculation version.

Only a manager may authorize a manual discount, within configured limits, with an audit reason. V1 amounts are tax-exclusive; no service charge by default. Tax rates must be explicitly configured per outlet/category before billing is enabled; do not guess statutory rates. The operational bill is not marketed as a compliant fiscal invoice until jurisdiction-specific requirements are validated.

Cashier records one successful manual cash/card/UPI payment for the exact remaining total, with reference for non-cash payments. It is operator-recorded settlement, not gateway verification. Lock bill during posting, deduplicate command, reject overpayment or closed bill. Partial and split tender are deferred. Refund/void after settlement requires a later controlled correction flow; do not edit financial history. Before settlement, a manager may void an issued bill with reason, reopen ordering, and reissue with a new number.

Settlement closes the session and revokes guest access; table becomes cleaning. Staff marks cleaning complete before it becomes available. A historical bill remains accessible only to authorized staff. A guest may save their acknowledgement while capability is active; no shared bill disclosure in V1.

## F07 — Administration and entitlements

Tenant admins manage only their tenant. Outlet managers have scoped operational and limited configuration permissions. Publish, price change, permission change, rejection, item void, discount, bill void, and settlement are audited with actor and reason where needed. Platform operators manage tenant provisioning and plan grants through separate platform APIs and identity roles, not blanket access to guest data.

Suspended tenants retain staff read-only access to outstanding operational/financial data for authorized resolution. Public ordering/booking is disabled. A billing/module downgrade cannot strand an open session: allow completion under its opening entitlement snapshot, block new sessions that need disabled modules. Tenant deletion requires an explicit export/retention process beyond MVP.

## Failure behavior

Errors identify the recoverable action without exposing another tenant's records. Guest lost capability requires staff-assisted rejoin, not phone-number lookup. Stale table commands prompt refresh. Payment recording errors must show uncertainty and retrieve authoritative state before retrying. Reservation confirmation failures never show success unless persisted. Do not send SMS/email in MVP; display/download confirmation and clearly label delivery integrations as future work.
