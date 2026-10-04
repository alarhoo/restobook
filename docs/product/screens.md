# Screen catalogue

Routes below are client routes. Public routes resolve tenant by verified host mapping; `/o/:outletSlug` selects an outlet within that tenant. A deployment hostname is still to be selected. Platform routes live in their separate app. Codes are stable acceptance references.

| ID | App / route | Users | Content and primary action |
|---|---|---|---|
| G01 | Guest `/` | Public | Branded venue/outlet picker; choose outlet |
| G02 | Guest `/o/:outletSlug/menu` | Public | Categories, search, dietary filters, prices, cart badge |
| G03 | Guest `/o/:outletSlug/menu/items/:itemId` | Public | Image, allergens, variant/modifiers, add to cart |
| G04 | Guest `/t/:qrToken` | Public | Safe table resolution; active-table join PIN or browse menu |
| G05 | Guest `/cart` | Participant | Quantities/choices, price version, submit once, retry state |
| G06 | Guest `/orders` | Participant | Own orders, item progress, bill request, reconnect indicator |
| G07 | Guest `/o/:outletSlug/reserve` | Public | Date, time, guests, preference; select offered slot |
| G08 | Guest `/o/:outletSlug/reserve/details` | Public | Name/phone and optional notes; confirm allocation |
| G09 | Guest `/reservations/manage` | Secret-link holder | Confirmation/reference, details, cancel; token exchanged securely |
| R01 | Restaurant `/outlets/:outletId/floor` | Host, waiter, manager | Floor map, dual occupancy/reservation badges, select table |
| R02 | Restaurant `/outlets/:outletId/tables/:tableId` | Operational staff | Split detail of party/orders/next booking; seat, checkout, clean |
| R03 | Restaurant `/outlets/:outletId/reservations` | Host, manager | Time board plus accessible list; check in, reassign, cancel |
| R04 | Restaurant `/outlets/:outletId/reservations/new` | Host, manager | Assisted booking form using same availability rules |
| R05 | Restaurant `/outlets/:outletId/my-tables` | Waiter, manager | Assigned sessions, urgent ready/bill badges |
| R06 | Restaurant `/outlets/:outletId/sessions/:sessionId/order/new` | Waiter, manager | Assisted menu/cart; confirm guest-selected choices |
| R07 | Restaurant `/outlets/:outletId/orders` | Waiter, manager | Placed orders queue; accept or reject with reason |
| R08 | Restaurant `/outlets/:outletId/kitchen/:stationId` | Chef, manager | Station cards, elapsed time, prepare, ready items |
| R09 | Restaurant `/outlets/:outletId/ready` | Waiter, manager | Item pickup queue; mark served individually |
| R10 | Restaurant `/outlets/:outletId/checkout` | Cashier, manager | Checkout requests, service blockers; choose session |
| R11 | Restaurant `/outlets/:outletId/sessions/:sessionId/bill` | Cashier, manager | Totals preview, permitted discount, issue, record settlement |
| R12 | Restaurant `/outlets/:outletId/bills/:billId` | Cashier, manager | Immutable issued bill, print, void unpaid with permission |
| A01 | Tenant `/onboarding` | Owner | Resumable organization/outlet/menu checklist |
| A02 | Tenant `/organizations` | Owner, admin | Organization list and object details |
| A03 | Tenant `/outlets` | Owner, admin | Venue list, timezone/currency, operational status |
| A04 | Tenant `/outlets/new` | Owner, admin | Dedicated multi-section outlet form |
| A05 | Tenant `/outlets/:outletId/settings` | Admin, manager scoped | Hours, closures, duration, tax configuration, limits |
| A06 | Tenant `/outlets/:outletId/floors` | Admin, manager scoped | Floor list, editor, table geometry/capacities |
| A07 | Tenant `/outlets/:outletId/qr` | Admin, manager scoped | Preview/print table QR labels, rotate revoked tokens |
| A08 | Tenant `/menu/items` | Admin, manager scoped | Item catalogue list and detail |
| A09 | Tenant `/menu/items/new` | Admin, manager scoped | Dedicated item, variants, modifiers, allergens form |
| A10 | Tenant `/outlets/:outletId/menu` | Admin, manager scoped | Offerings, pricing, station, availability, publication |
| A11 | Tenant `/outlets/:outletId/stations` | Admin, manager scoped | Stations and routing validation |
| A12 | Tenant `/staff` | Owner, admin | Invitations, memberships, outlet grants, active/revoked state |
| A13 | Tenant `/roles` | Owner, admin | Fixed V1 role definitions and permission readout; assign via staff |
| A14 | Tenant `/branding` | Owner, admin | Logo/color preview and publish |
| A15 | Tenant `/subscription` | Owner | Effective modules, quotas, plan state; no live checkout yet |
| P01 | Platform `/tenants` | Platform admin | Tenant list, state, entitlement summary |
| P02 | Platform `/tenants/new` | Platform admin | Provision tenant and invitation |
| P03 | Platform `/tenants/:tenantId` | Platform admin | Provisioning/plan detail, suspension and audit |
| P04 | Platform `/operations` | Platform admin | Health/backlog metrics, failed jobs, no raw guest PII |
| P05 | Platform `/audit` | Platform admin | Privileged platform changes, support access metadata |

## Screen acceptance rules

Every screen must handle loading, empty, authorization denied, unavailable network, validation errors, recoverable server errors, and success where relevant. No sample data masquerading as persisted data outside explicitly labeled demo mode. Large inputs use dedicated routes; details use object pages and flexible columns instead of modal-only workflows.

Guest confirmations show outlet-local date/time, party size, reservation reference, and cancellation action. Guest menu prices are readable and images have meaningful alternatives. Cart shows changed-price acknowledgement before retry. A guest cannot access staff pages by guessing a route.

Floor map includes a list alternative, color-independent labels, keyboard navigation, floor selector, capacity, elapsed visit time, next booking, and session total only for authorized staff. Detail selection preserves deep-link route and browser history. Reservation drag/drop is a progressive enhancement; use explicit reassign controls in V1, with the same atomic command.

KDS prioritizes large touch targets and visible elapsed time. Cashier records payment only after showing amount and method. Duplicate taps disable the pending button while idempotency remains the correctness guard. Guest devices never display other participants' private order content.

No waitlist, table-transfer, room-charge, split-bill, automated notification, or gateway buttons are shown until those phases are implemented.
