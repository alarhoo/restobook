# API boundaries and contract specification

Base `/api/v1`. Use runtime DTO validation and generated OpenAPI during M1/M2. This document is the planned contract, not a runnable server or a completed OpenAPI schema.

## Conventions

Resource IDs are opaque UUIDs. Tenant comes from validated host/context, not body. Dates/timestamps use ISO-8601 UTC strings; availability requests include local date and server outlet timezone. Money = decimal string minor units plus currency. Mutations return resource ID, status and numeric version. Lists use cursor pagination, bounded limits and explicit filters. Staff methods use verified identity; guest routes use narrowly scoped cookies where required.

Command endpoints require `Idempotency-Key` for creation, seating, check-in, acceptance, bill issuance, void and settlement. Key is scoped by tenant, principal, command and relevant parent resource. Persist request hash and committed response atomically. Same body/key returns original result; changed body/key → `IDEMPOTENCY_CONFLICT`. Use `If-Match: "<version>"` for mutable aggregate commands; conflicting versions → 409 `STALE_VERSION`. Retain operational idempotency at least 24h (initial target); retain financial dedupe with financial history.

Errors: `{ "error": { "code": "TABLE_UNAVAILABLE", "message": "Choose another table or refresh availability.", "correlationId": "...", "fields": [] } }`. 400 malformed/invalid input; 401 missing/expired authentication; 403 permission/entitlement denial within known scope; 404 absent/inaccessible resource; 409 state/version/allocation/price conflict; 429 rate limit. Do not leak another tenant's object existence or database error text.

## Endpoint inventory

| Method and path | Caller / permission | Behavior |
|---|---|---|
| GET `/public/outlets` | Public | Published outlets for resolved tenant |
| GET `/public/outlets/:slug/menu` | Public | Published offerings and safe snapshots/version |
| GET `/public/tables/:qrToken` | Public | Safe table label/outlet/menu link and join availability, no session contents |
| POST `/guest/session-joins` | Public + rate limit | QR token/PIN exchange for participant cookie |
| GET `/guest/session` | Participant | Own capability/session summary, no other diners |
| POST `/guest/orders` | Participant | Submit server-priced order for current session |
| GET `/guest/orders` | Participant | Only own orders |
| POST `/guest/orders/:id/cancel` | Participant | Only own PLACED order |
| POST `/guest/checkout-request` | Participant | Request checkout; no financial mutation |
| GET `/public/outlets/:slug/availability` | Public | Date/party/preference → offered start slots |
| POST `/public/outlets/:slug/reservations` | Public + rate limit | Atomic allocation, confirmation and secret link |
| POST `/guest/reservation-access` | Token holder | Exchange reservation token for restricted cookie |
| GET `/guest/reservation` | Reservation cookie | Own confirmation/details |
| POST `/guest/reservation/cancel` | Reservation cookie | Cancel confirmed reservation |
| GET `/outlets/:id/tables` | Scoped `session.read`/host projection | Floor-map state, next bookings, permission-filtered totals |
| POST `/outlets/:id/sessions` | `table.seat` | Walk-in table claim, party and waiter |
| POST `/outlets/:id/tables/:tableId/clean` | `table.clean` | CLEANING → AVAILABLE |
| POST `/outlets/:id/tables/:tableId/blocks` | `floor.manage` | Schedule claim respecting booking collisions |
| GET/POST `/outlets/:id/reservations` | `reservation.manage` | Staff list / assisted creation |
| PATCH `/outlets/:id/reservations/:reservationId` | `reservation.manage` | Atomic amendments with version |
| POST `/outlets/:id/reservations/:reservationId/check-in` | `table.seat` + reservation scope | Exactly one dining session |
| POST `/outlets/:id/reservations/:reservationId/reassign` | `reservation.manage` | Move claim atomically |
| POST `/outlets/:id/reservations/:reservationId/no-show` | `reservation.manage` | Release future claim with reason |
| POST `/outlets/:id/reservations/:reservationId/cancel` | `reservation.manage` | Staff cancel with reason |
| GET `/outlets/:id/sessions/:sessionId` | `session.read` | Scoped operational detail |
| POST `/outlets/:id/sessions/:sessionId/orders` | `order.create` | Assisted order with same validation |
| POST `/outlets/:id/orders/:orderId/accept` | `order.accept` | Create tickets and outbox atomically |
| POST `/outlets/:id/orders/:orderId/reject` | `order.reject` | Reason; only PLACED |
| POST `/outlets/:id/order-items/:itemId/void` | `order-item.void` | Manager void with reason before final settlement |
| GET `/outlets/:id/stations/:stationId/tickets` | Chef station scope | Safe KDS projection |
| POST `/outlets/:id/tickets/:ticketId/prepare` | `kitchen.prepare` | Advance eligible items |
| POST `/outlets/:id/order-items/:itemId/ready` | `kitchen.ready` | Assigned station item ready |
| POST `/outlets/:id/order-items/:itemId/serve` | `order.serve` | Ready → served |
| POST `/outlets/:id/sessions/:sessionId/checkout-request` | `checkout.request` | Stop new guest orders |
| POST `/outlets/:id/sessions/:sessionId/checkout-withdraw` | `checkout.request` | Before issued bill, resume ordering |
| POST `/outlets/:id/sessions/:sessionId/close-empty` | `table.seat` | Close unused session with guards/reason |
| GET `/outlets/:id/sessions/:sessionId/bill-preview` | `bill.issue` | Derived totals and issuance blockers |
| POST `/outlets/:id/sessions/:sessionId/bills` | `bill.issue` | Immutable final bill; discount requires extra permission |
| POST `/outlets/:id/bills/:billId/void` | `bill.void` | Unpaid bill only; audit and reopen |
| POST `/outlets/:id/bills/:billId/payments` | `payment.record` | Exact manual settlement; atomic close/cleaning |
| GET `/events` | Scoped authorized connection | SSE update hints; scope filters validated |

Admin resource families: `/organizations`, `/outlets`, `/outlets/:id/settings`, `/outlets/:id/floors`, `/outlets/:id/tables`, `/outlets/:id/stations`, `/menu/items`, `/menu/modifier-groups`, `/outlets/:id/offerings`, `/outlets/:id/menus`, `/staff/invitations`, `/staff/memberships`, `/branding`, `/subscription`. Implement explicit CRUD commands, publication and validation during relevant slice; there is no generic unrestricted admin mutation endpoint. Platform families `/platform/tenants`, `/platform/tenants/:id/entitlements`, `/platform/audit` require platform identity.

## Example: guest order

```json
{
  "items": [{
    "offeringId": "offering-uuid",
    "offeringVersion": 3,
    "variantId": "variant-uuid",
    "quantity": 2,
    "modifierOptionIds": ["option-uuid"],
    "note": "Less spicy"
  }]
}
```

Never accept authoritative item price, tax, tenant/session/participant identity from this body. Server identifies session/participant from capability, snapshots the catalogue, and returns totals:

```json
{
  "id": "order-uuid",
  "status": "PLACED",
  "version": 1,
  "currency": "INR",
  "netAmountMinor": "96000"
}
```

This illustrative amount represents two ₹420 items plus a ₹60 add-on each, before reviewed tax. Unknown/offline/out-of-stock offering → typed error; version/price drift → `MENU_CHANGED` with safe updated offering projection. Menu response includes variant and modifier constraints; the guest cart retains selected identities and versions.

## Example: reservation

Request: `{ "startAt": "2026-10-10T14:30:00Z", "partySize": 4, "sectionPreference": "indoor", "guest": { "name": "Demo Guest", "phone": "+919000000000" } }`. This is 20:00 in Asia/Kolkata. API computes duration/buffer, allocates privately, returns reference and management URL, never private table assignments. Phone in this example is synthetic.

## Example: settlement

POST payment: `{ "method": "UPI", "amountMinor": "100800", "reference": "operator-entered-reference" }` with idempotency and bill version. Validate exact outstanding amount and currency from bill. Return payment record plus SETTLED bill, CLOSED session, CLEANING table. If response is lost, retrieve authoritative bill state before assuming failed payment. No endpoint claims provider verification.

## Event contract

`{ "eventId": "uuid", "type": "order.item-ready", "resourceId": "uuid", "version": 5, "occurredAt": "ISO UTC" }`. Authorized channel already binds scope. Hint payload omits private contents; consumers refetch. Version helps discard stale hints; it is not proof of complete event history. Provide heartbeat/reconnect and snapshot fallback.
