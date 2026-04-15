# Tydl pricing, payout and timing logic (launch v1)

This spec is built around the current launch model already in your repo: **interior cleaning only**, package-based pricing on the front end, and internal time/payout logic for operations.

## Core launch rules

- Launch scope: regular clean, one-off clean, deep clean, end of tenancy.

- Front end shows fixed package prices only.

- Time, staff count, payout, margin and assignment logic stay internal.

- Regular cleans are for **maintained homes only**. If condition is neglected, the system should route the customer to one-off or deep clean first.

- Best rule for recurring customers: **first visit can be priced as one-off/deep if the home is not maintenance-ready; recurring pricing starts from clean #2.**

- Gross margin below means **customer price minus cleaner payout** only. It does **not** yet remove Stripe/card fees, refunds/credits, support time, or VAT if you register later.


## 1) Regular clean (customer-facing packages)

Use these for weekly, fortnightly and monthly **maintenance** cleans. Keep the slot length the same by property size; do not inflate time just because frequency changes. Protect quality by upgrading the **first** visit where needed.


| Property | Weekly price | Weekly time | Weekly payout | Weekly gross margin | Fortnightly price | Fortnightly time | Fortnightly payout | Fortnightly gross margin | Monthly price | Monthly time | Monthly payout | Monthly gross margin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1-1 | £49 | 2.5h | £40 | £9 (18%) | £50 | 2.5h | £40 | £10 (20%) | £55 | 2.5h | £41 | £14 (25%) |
| 2-1 | £59 | 3h | £48 | £11 (19%) | £60 | 3h | £48 | £12 (20%) | £65 | 3h | £50 | £15 (23%) |
| 3-1 | £69 | 3.5h | £56 | £13 (19%) | £70 | 3.5h | £56 | £14 (20%) | £75 | 3.5h | £58 | £17 (23%) |
| 3-2 | £79 | 4h | £64 | £15 (19%) | £80 | 4h | £64 | £16 (20%) | £85 | 4h | £66 | £19 (22%) |
| 4-2 | £89 | 4.5h | £72 | £17 (19%) | £90 | 4.5h | £72 | £18 (20%) | £95 | 4.5h | £74 | £21 (22%) |
| 5-3 | £109 | 5.5h | £88 | £21 (19%) | £110 | 5.5h | £88 | £22 (20%) | £115 | 5.5h | £91 | £24 (21%) |

**Cleaner rate used internally:** weekly £16/h, fortnightly £16/h, monthly £16.50/h.

**Assignment rule:** 1 cleaner by default. Split into 2 cleaners only if customer needs a compressed window and margin still works.


## 2) One-off clean

Use for homes that are broadly tidy but need a stronger reset than a maintenance clean. This is also the right first visit for many customers who want to move into recurring service.


| Property | Customer price | Estimated labour-hours | Typical team | Cleaner payout | Gross margin |
|---|---:|---:|---|---:|---:|
| 1-1 | £59 | 2.75h | 1 cleaner | £47 | £12 (20%) |
| 2-1 | £69 | 3.25h | 1 cleaner | £55 | £14 (20%) |
| 3-1 | £79 | 3.75h | 1 cleaner | £64 | £15 (19%) |
| 3-2 | £89 | 4.25h | 1 cleaner | £72 | £17 (19%) |
| 4-2 | £99 | 4.75h | 1 cleaner | £81 | £18 (18%) |
| 5-3 | £119 | 5.75h | 1 cleaner / 2 cleaners optional | £98 | £21 (18%) |

**Cleaner rate used internally:** £17/h.


## 3) Deep clean

Use for neglected homes, first cleans with heavy build-up, post-illness resets, spring-clean level work, and homes coming back under control.


| Property | Customer price | Estimated labour-hours | Typical team | Cleaner payout | Gross margin |
|---|---:|---:|---|---:|---:|
| 1-1 | £115 | 4.5h | 1 cleaner | £81 | £34 (30%) |
| 2-1 | £139 | 5.5h | 1 cleaner | £99 | £40 (29%) |
| 3-1 | £165 | 6.5h | 1 cleaner / 2 cleaners optional | £117 | £48 (29%) |
| 3-2 | £189 | 7.5h | 1 cleaner / 2 cleaners optional | £135 | £54 (29%) |
| 4-2 | £219 | 8.5h | 1 cleaner / 2 cleaners optional | £153 | £66 (30%) |
| 5-3 | £269 | 10.5h | 2 cleaners recommended | £189 | £80 (30%) |

**Cleaner rate used internally:** £18/h.


## 4) End of tenancy

Treat this as a fixed checklist package, not a loose hourly clean. Most 2-bed+ jobs should be assigned as a team clean.


| Property | Customer price | Total labour-hours | Typical team | Cleaner payout | Gross margin |
|---|---:|---:|---|---:|---:|
| studio-1 | £175 | 6h | 1 cleaner (or 2 x 3h) | £108 | £67 (38%) |
| 1-1 | £205 | 7h | 1 cleaner long slot / 2 cleaners | £126 | £79 (39%) |
| 2-1 | £260 | 9.5h | 2 cleaners | £171 | £89 (34%) |
| 2-2 | £295 | 11h | 2 cleaners | £198 | £97 (33%) |
| 3-1 | £325 | 12h | 2 cleaners | £216 | £109 (34%) |
| 3-2 | £355 | 13h | 2 cleaners | £234 | £121 (34%) |
| 4-2 | £395 | 15h | 2 cleaners or 3 cleaners | £270 | £125 (32%) |
| 5-3 | £465 | 18h | 3 cleaners preferred | £324 | £141 (30%) |

**Cleaner rate used internally:** £18/h.

**Important:** edge cases should trigger manual review instead of instant-book: nicotine staining, mould treatment, rubbish removal, severe pet hair, biohazard, flea treatment, post-build dust everywhere, or furnished homes with unusually high clutter.


## 5) Add-ons


| Add-on | Customer price | Extra time | Cleaner payout | Gross margin |
|---|---:|---:|---:|---:|
| Oven | £25 | 45 min | £18 | £7 (28%) |
| Fridge | £12 | 20 min | £8 | £4 (33%) |
| Interior windows - small | £15 | 30 min | £10 | £5 (33%) |
| Interior windows - medium | £25 | 45 min | £17 | £8 (32%) |
| Interior windows - large | £35 | 60 min | £24 | £11 (31%) |
| Bed change (per bed) | £6 | 10 min | £4 | £2 (33%) |

**Add-on rules**

- Oven is best attached to one-off, deep clean, or end of tenancy. Allow it on recurring only if slot capacity remains.

- Interior windows should be capped per visit if the total slot becomes unrealistic.

- Bed change should be capped at a sensible number, e.g. 6 beds, then manual review.


## 6) Supplies logic

Your repo already uses three supply states: customer provides, cleaner products, cleaner full kit.


| Supply option | Customer surcharge | Cleaner payout | Gross margin |
|---|---:|---:|---:|
| Products Pack - 1-2 bed | £5 | £4 | £1 (20%) |
| Products Pack - 3-4 bed | £7 | £6 | £1 (14%) |
| Products Pack - 5+ bed | £9 | £8 | £1 (11%) |
| Full Kit - 1-2 bed | £12 | £10 | £2 (17%) |
| Full Kit - 3-4 bed | £15 | £13 | £2 (13%) |
| Full Kit - 5+ bed | £18 | £16 | £2 (11%) |

**Recommended logic**

- `customer-provides`: no surcharge, no supply payout.

- `cleaner-products`: cleaner brings chemicals/cloths/basic consumables only.

- `cleaner-full-kit`: cleaner brings vacuum, mop, bucket, products, and core kit.

- If parking or paid access is required, add a pass-through fee after review rather than hiding it in the base package.


## 7) Condition routing rules


### Regular clean

- Show a simple question such as: `Is the home already kept on top of, or does it need bringing back under control first?`

- If the answer suggests grime build-up, grease, limescale, long gaps between cleans, pet hair everywhere, or neglected bathrooms/kitchen, **do not** allow regular-clean pricing for the first visit.

- Route to one-off clean or deep clean first.


### One-off clean

- Base price assumes `standard lived-in condition`.

- Heavy condition uplift: **+15%**.

- If condition is beyond that, route to deep clean instead of stacking more uplifts.


### Deep clean

- Base price assumes `heavy but normal domestic dirt`.

- Heavy uplift: **+15%**.

- Severe uplift: **+30%**.

- Hoarding, waste, bodily fluids, infestation, or specialist restoration = manual quote only.


### End of tenancy

- Keep pricing fixed for most bookings.

- Only trigger review/manual quote for true edge cases, not standard move-out dirt.


## 8) Extra bathroom / larger-property rule

Your current repo matrix is intentionally simple. To avoid gaps in live quoting, add these rules:

- If the selected bed/bath combo is not in the table, map to the nearest lower package and then add an **extra bathroom uplift**.

- Extra bathroom uplift:

  - regular clean: **+£10**, +0.5h, +£7 payout

  - one-off clean: **+£10**, +0.5h, +£7 payout

  - deep clean: **+£20**, +0.75h, +£14 payout

  - end of tenancy: **+£30**, +1h, +£18 payout

- Above **5 bed / 3 bath**, use manual review instead of instant-book.


## 9) Booking restrictions / ops rules

- Minimum lead time: 24 hours.

- Same-day or next-morning urgent bookings should be hidden at launch unless you are manually dispatching.

- Keep Saturday live only if cleaner availability supports it. Leave Sunday off at launch unless there is a premium.

- Cleaner acceptance window: 30–60 minutes before auto-reoffer.

- Recurring cleaner payout should stay locked to the plan unless support approves a change.

- Repeat-customer credits and refunds should come out of platform margin, not the cleaner, unless there is a clear service failure.


## 10) Cancellations and no-shows (recommended)

- Customer cancellation >24h before arrival: free.

- Customer cancellation 12–24h before arrival: 25% fee.

- Customer cancellation <12h or no access/no-show: 50% fee.

- Cleaner payout on late cancellation after assignment: 40–50% of the cancellation fee.

- If the cleaner cancels late, customer gets priority rebooking or full refund.


## 11) Logic summary for engineering

```ts
price = baseServicePrice
  + conditionUplift
  + extraBathroomUplift
  + addonsTotal
  + suppliesSurcharge

cleanerPayout = baseServicePayout
  + conditionPayoutUplift
  + extraBathroomPayout
  + addonPayouts
  + suppliesPayout

grossPlatformContribution = price - cleanerPayout
```


## 12) Recommendation

For the live site, keep **interior-only MVP pricing** exactly in this structure. Do **not** launch exterior cleaning in the same booking flow yet. Exterior has different staffing, equipment, access, weather, risk and insurance logic, so it should be a separate service layer later.
