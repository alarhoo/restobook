# Product brief

## Problem and outcome

Restaurants and hotel dining outlets need one shared view of bookings, occupied tables, guest orders, kitchen progress, and bills. Restobook provides that view while keeping every client's operations separate. A solo founder should be able to build and operate the first version without managing a fleet of domain microservices.

This is hotel **dining** software; hotel room inventory and overnight accommodation booking are outside scope.

## Customer model

Tenant → Organization → Outlet → Floor → DiningTable.

One tenant can operate multiple brands and outlets. A small independent cafe uses the same hierarchy with one organization and one outlet. Menu items may be shared within a tenant; outlet offerings control publication, availability, and price. Staff identity is global, but authorization belongs to memberships and outlet grants.

## Surfaces

| Surface | Primary users | Key jobs |
|---|---|---|
| Guest PWA | Anonymous diners and booking guests | Browse published menu, reserve, join table, order, track own items, request bill |
| Restaurant console/PWA | Host, waiter, chef, cashier, manager | Floor map, seating, reservation board, orders, KDS, billing |
| Tenant administration | Owner and tenant admin | Organization/outlets, menu, floor setup, staff, roles, branding, entitlements |
| Platform console | Platform operator | Tenant provisioning, subscription state, audited support, operational visibility |

Tenant administration and restaurant console share libraries and identity but are independent applications. Four apps are target deployment boundaries; guest and restaurant slices are scaffolded first.

## MVP

Tenant provisioning and owner onboarding; organization/outlet setup; floors/tables and printable table QR links; menu categories/items/variants/modifiers; published outlet menu; staff seating and guest join; guest cart and orders; waiter operations; station-based KDS; live updates; basic reservations with automatic allocation; bill issuance; cash/card/UPI records; cleaning and release; staff roles and outlet scopes; branding; manual subscription/entitlement administration.

Staff can take assisted orders. Menu browsing does not require login. Guest ordering requires a scoped visit capability, not a customer account. V1 guest reservation status uses a secret link; phone OTP and notifications are later integrations.

## Deliberately later

Gateway payment collection, automated SaaS billing, room charges/PMS, POS connectors, combined tables, split bills, table transfer/merge, loyalty, inventory, accounting, payroll, delivery marketplace, guest CRM, custom domains, multilingual translations, advanced analytics, time-based/happy-hour pricing, discount promotions, and offline transactional operation.

Do not expose unsupported controls. Manual discounts with manager authorization are included; discount campaign engines are not.

## Packaging

Entitlements are feature keys (`reservations`, `qr-ordering`, `kds`, `billing`) with outlet/table limits. Base setup and menu browsing are core. Provision an MVP plan with all V1 modules; leave price amounts unset pending customer research. Sell principally per outlet, with future bundles or add-ons. Enforce quotas and modules server-side; disabling a module must allow already-created work to finish safely.

## Success measures

Pilot targets, to validate rather than promise: first outlet configured within 30 minutes; staff can seat a party in three main actions; guest can place a simple order within one minute of joining; no duplicate orders on retry; no double-confirmed table bookings; no cross-tenant resource access; all accepted orders and settlements survive a service restart.

## Assumptions and outstanding decisions

Initial pilot is India, one currency (INR) per outlet, Asia/Kolkata default timezone, English UI. Every outlet still stores its own timezone and currency. Taxes, fees, cancellation policy, business hours, slot duration, reservation horizon, and cleaning buffer are configurable and need owner review. The initial venue uses activated tables plus rotating PINs. Validate that workflow with real hosts before expanding. Product name Restobook follows the repository name; public brand/domain availability has not been checked.
