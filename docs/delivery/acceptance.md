# Acceptance scenarios

These are specifications to automate during implementation, not passing tests today.

| ID | Scenario | Required result |
|---|---|---|
| AC-01 | Tenant A/outlet A calls API with tenant B or outlet B ID; DB connection reused A→B | No read/write or live-subscription leakage; absent context denies; wrong composite reference fails |
| AC-02 | Same command key/body retried; then same key with altered body; transaction fails halfway | One committed result; altered body conflicts; rollback leaves no orphan audit/outbox/business state |
| AC-03 | Copy table QR; no active session; later new party starts | Menu safe; no private history; copied QR alone insufficient; old capability remains revoked |
| AC-04 | Draft/unavailable offering; invalid modifier count; changed price/version | Draft hidden, invalid choices rejected; price change requires explicit cart reconfirmation |
| AC-05 | Two staff seat same table; two participants join; previous capability used | One active session; each guest sees own orders only; old capability denied |
| AC-06 | Lost order response and retry; two distinct submissions | Retry returns same order; distinct keys create distinct valid orders; server price snapshots immutable |
| AC-07 | Order contains bar and kitchen items; only bar ready; then all served | Separate tickets; aggregate not READY until all eligible ready/served; billing blocked until served |
| AC-08 | Disconnect/restart, duplicate/reordered event hints, revoked user remains subscribed | Snapshot restores truth; no repeated mutation; revoked access closes/denies stream |
| AC-09 | Small amounts, odd discount remainder, multiple tax components, menu later repriced | Deterministic integer totals; discount only authorized; issued snapshots never change |
| AC-10 | Two concurrent exact payment posts; lost response retry; unpaid bill void; cleaning | One settlement; idempotent receipt; void preserved/new number on reissue; table not available until cleaned |
| AC-11 | Two guests reserve last table; adjacent intervals and cleaning buffer; table block race | One success; half-open boundaries consistent; blocks and bookings share definitive collision guard |
| AC-12 | Reassign booking while destination gets occupied; double check-in; expired cancellation token | Atomic failure preserves original; one session; secret access denied; cancellation releases only own claim |
| AC-13 | Cashier tries discount; chef reads contacts; membership revoked; billing module disabled mid-visit | Denied permissions/PII; revocation effective; ongoing visit completes but new disabled-module work blocked |
| AC-14 | Deploy QA/PROD, restore backup, apply incompatible migration | Same digests promoted manually; measured restore; incompatible change blocked/reviewed |
| AC-15 | Mobile guest and waiter; keyboard staff floor list; no network; server failure | Usable layouts/accessibility; no queued silent writes; clear retry/uncertainty; no fake confirmation |

## Required pilot walkthrough

Create tenant and owner → configure outlet/floor/tables/stations/menu → publish → seat walk-in → join two guest devices → submit separate orders → waiter accepts → kitchen/bar prepare → waiter serves → request/issue bill → record manual UPI → session closed and capability revoked → cleaning → available.

Then reserve for another party → concurrent conflicting booking denied → host checks in → same dining flow. Repeat with a second tenant and verify no shared data, navigation or event leakage.

## Test evidence format

For each implemented slice record command, environment/database role, fixture scopes, outcome, and relevant screenshot or E2E trace. Document unimplemented/blocked scenarios explicitly. Document validation alone cannot satisfy any application scenario above.
