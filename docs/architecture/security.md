# Security, tenancy, and permissions

## Tenant and identity boundary

Tenant domain mapping is server-managed and verified. Normalize hosts and trust forwarded headers only from the configured edge proxy. Public APIs expose only published projections. Staff tokens require signature/issuer/audience/expiry validation, active membership, permission and outlet grant. Platform identity is separate from tenant membership. A platform admin role never implies permission to read arbitrary guest orders through tenant APIs.

No client-supplied tenant ID, URL outlet ID, UUID, or role claim alone establishes ownership. Return non-disclosing 404 for inaccessible resources; use 403 when an already-authorized scope lacks a command permission. Queries, exports, subscriptions, caches, media paths, jobs and logs preserve tenant scope. Cache keys include tenant/outlet and visibility scope.

## Fixed V1 roles

Roles map to permissions; controllers and services check permissions, not UI role strings. Tenant owner/admin grants are tenant-wide; other roles have explicit outlet grants. The fixed role catalogue is read-only in V1; custom role editing is later. Owner has subscription/ownership functions; admin does not transfer ownership or elevate itself to owner. Chefs additionally have assigned station scopes.

| Permission | Owner | Admin | Manager | Host | Waiter | Chef | Cashier |
|---|---|---|---|---|---|---|---|
| organization/outlet/staff manage | Yes | Yes | No | No | No | No | No |
| menu/floor/station manage | Yes | Yes | Scoped | No | No | No | No |
| reservation create/amend/cancel | Yes | Yes | Scoped | Scoped | No | No | No |
| table seat/clean | Yes | Yes | Scoped | Scoped | Assigned clean | No | No |
| session/orders read | Yes | Yes | Scoped | Session summary | Assigned | Ticket projection | Checkout projection |
| order create/accept/reject/serve | Yes | Yes | Scoped | No | Assigned | No | No |
| kitchen prepare/ready | Yes | Yes | Scoped | No | No | Station | No |
| checkout request | Yes | Yes | Scoped | No | Assigned | No | Scoped |
| bill preview/issue/record payment | Yes | Yes | Scoped | No | No | No | Scoped |
| discount/item void/bill void | Yes | Yes | Scoped | No | No | No | No |
| subscription view | Yes | No | No | No | No | No | No |
| platform tenant provisioning | No | No | No | No | No | No | No |

Representative permission keys: `outlet.manage`, `staff.manage`, `menu.manage`, `floor.manage`, `reservation.manage`, `table.seat`, `table.clean`, `session.read`, `order.create`, `order.accept`, `order.reject`, `order.serve`, `kitchen.prepare`, `kitchen.ready`, `checkout.request`, `bill.issue`, `payment.record`, `bill.discount`, `order-item.void`, `bill.void`, `subscription.view`. Platform permissions use a separate `platform.*` namespace.

## Guest authorization

QR token is random table locator with stored hash; revoke/rotate without changing table ID. It identifies table and outlet, not a session. Staff opens session and shares a rotating PIN. Join returns a high-entropy session capability in Secure/HttpOnly/SameSite cookie, bound to tenant/outlet/session/participant and expiry. Join attempt throttling applies by IP/table/session; never expose PIN or hash in API reads.

Participant permissions: published menu; create order for own participant; read/cancel own PLACED order; request checkout for the session. Guest cannot list participants, read other orders, see shared bill lines, edit table status, or record payment. Cookie writes require Origin/CSRF validation. Table closes → revoke all participant capabilities. Revoked membership also terminates live subscriptions and invalidates access. PIN theft remains a risk; the pilot may require waiter approval for suspicious joins.

Reservation management token is separately scoped, random and stored hashed. Use fragment token on shared link, exchange via POST, then clear browser fragment and set scoped cookie. Do not persist secret link tokens in query logs, referrers or analytics. Management cookie is not a dining capability.

## Abuse, PII and media

Rate-limit public availability, booking, QR resolution/join and order commands. Enforce payload size, quantity/party-size limits, note length, input sanitization, and image upload types/size. Use signed upload URLs and validate finalized media before publication. Display notes as text, not trusted HTML. Strip EXIF metadata from guest-facing assets. Never accept image URLs that cause arbitrary server-side fetches.

Contact details visible only to reservation-authorized staff. Encrypt at rest through managed services and use restricted application access. No raw provider tokens, contact data, PINs or payment details in logs. Customer data must not be committed to this public repo. A before-pilot retention/deletion policy is required; do not invent a legal retention period.

## Entitlements and platform support

Entitlement checks are independent of RBAC. A permitted cashier cannot use a disabled billing module for new sessions. Limits are enforced transactionally on provisioning. Existing visits finish under their opening entitlement snapshot. Platform support access, if later needed, must be time-limited, tenant-approved where applicable, reasoned and audited; no hidden impersonation in V1.

Platform-owned tenant provisioning requires an isolated privileged service path and audited action. Bootstrap operator creation uses controlled infrastructure provisioning, not a public signup parameter. Identity secrets and runtime keys belong in Secret Manager; never frontend config.

## Required security verification

Two tenants, two outlets, two participants, revoked staff, expired/reused reservation token, closed session, forged host, cross-tenant IDs, stale session capability, missing DB tenant context, pooled connections, media path mismatch, and live-subscription denial. Verify unauthorized changes never commit. Test permission rules at API service boundary even when the UI hides controls.
