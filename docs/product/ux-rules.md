# UX and floorplan rules

## Visual direction

Modern hospitality product: warm neutral surfaces, restrained accent colors, food photography for guest browsing, high-contrast operational badges for staff. Tenant primary color is validated for contrast; theme does not change semantic error/success meaning. Desktop staff views are information-dense; guest/waiter views are touch-first. Use PrimeNG components consistently, with a small token-based theme layer; verify the chosen PrimeNG release and Angular compatibility during M1.

## Floorplan decision rules

| Use case | Floorplan | Reason |
|---|---|---|
| Simple confirmation / small create (roughly 2–5 inputs) | Dialog | Short, reversible task |
| Staff/item/outlet list plus selected record | Responsive two-column list/detail | Preserves context and route |
| Complex details (outlet, menu item, session) | Object page with sections | Scannable related information |
| Long create/edit with variants/settings | Dedicated route | Validatable, resumable, deep-linked form |
| Temporal booking assignments | Timeline with accessible list | Shows resource/time overlap |
| Physical table operations | Floor map with list alternative and detail panel | Spatial task with accessible fallback |
| Kitchen production | Station board/cards | Work queue and item-level commands |

On small screens list and detail become separate routed pages with a clear back action. Do not shrink a desktop split view until unusable. PrimeNG supplies tables, dialogs, inputs, menus, tags, skeletons, toast and tabs; custom floor map, timeline, and object-page composition remain application code, not assumed ready-made widgets.

## Interaction and accessibility

Target WCAG 2.2 AA during implementation: keyboard operation, visible focus, semantic headings, text labels, sufficient contrast, status announcements, touch targets, reduced-motion support. Automated checks plus manual keyboard and mobile review are acceptance requirements. Status colors always have text/icon equivalents. Form errors connect to inputs and a summary for long forms.

Save actions distinguish draft, published, pending, and completed. Dirty forms warn before navigation. Long forms validate sections and summarize problems without discarding input. Avoid global toast-only errors for critical payment/reservation actions. Timestamps show outlet-local time and indicate timezone on reservations. Show currency consistently.

PWA install is optional; menu works in browser. Cache only public menu assets/data and shell resources. Never cache guest capabilities, bill details, staff API responses, or private orders. Connection state remains visible on live operations screens; disable unsafe writes when offline. Accessible empty states explain the next available action.
