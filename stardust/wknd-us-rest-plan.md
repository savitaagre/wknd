# WKND — remaining pages (run 4) — plan & tracker

Source: https://wknd.site/ — the 29 captured pages not delivered by runs 2–3
Flow: replica (same design) — stardust `replica` Phase 5 on the run-2 inventory
Branch: `feat/wknd-us-rest` (from `main` @ 800b79b, which contains runs 2–3 via PR #2)
Target: site `wknd`, DA `savitaagre/wknd` — PREVIEW ONLY (owner)
Preview host: https://feat-wknd-us-rest--wknd--savitaagre.aem.page (admin branch `feat-wknd-us-rest`)
Started: 2026-10-24 · Approvals: hands-off · Gate widths 1440, 360

## Scope — 29 pages

| Cluster | Pages | Archetype | Notes |
|---|---|---|---|
| program-us | 15 × /us/en/adventures/* | us-en-adventures-climbing-new-zealand (live, gated) | siblings only |
| article-us | 4 × /us/en/magazine/{arctic-surfing, san-diego-surf, ski-touring, western-australia} | us-en-magazine-guide-la-skateparks (live, gated) | siblings only |
| coming-soon | /us/es (archetype) + ca/fr, ch/de, ch/fr, ch/it, de/de, fr/fr, es/es, it/it | us-es-html (prototype gated, not delivered) | R-02 h1; per-locale nav/footer docs (C0 copies now in DA wknd-test) |
| search | /us/en/ai-powered-search | itself (prototype gated, not delivered) | R-03 hidden h1; dynamics #6 search UI — index needs a live publish (preview only → interim), #7 AI summary D4 |

## Steps

| # | Step | Status | Notes |
|---|---|---|---|
| 0 | Branch, plan, tracking | done | feat/wknd-us-rest @ main 800b79b; branch host serves code |
| 1 | Freshness re-capture of the 29 pages | done | 30/30 unchanged |
| 2 | Cluster units (program-us, article-us, coming-soon, search) | done | 29/29 PASS both widths |
| 3 | C-final: queued requests once, roster gate-all over the 29 run-4 pages, verify, link audit | done | owner 2026-10-24: final check over this run's 29 pages only (the 36 run-3 pages had their own C-final) |
| 4 | PR to main with preview links | pending | merge only on owner request |

## Log

- 2026-10-24 Branch feat/wknd-us-rest created from main after PR #2; prototype server restarted (8791).

## Final report (2026-10-24)

**Delivered (preview only):** the remaining 29 pages on https://feat-wknd-us-rest--wknd--savitaagre.aem.page —
with runs 2–3 every one of the 65 captured wknd.site pages is migrated and verified (65/65).

| Cluster | Pages | 1440 worst | 360 worst |
|---|---|---|---|
| program-us | 15 × /us/en/adventures/* | 1.08 % | 2.84 % |
| article-us | 4 × /us/en/magazine/* | 0.81 % | 4.05 % |
| coming-soon | /us/es + 8 locale homes (+ 18 locale nav/footer docs) | 0.26 % | 0.38 % |
| search | /us/en/ai-powered-search | PASS | 0.02 % |

Final roster (fresh captures): 1440 29/29 PASS (worst 1.08 %), 360 29/29 PASS (worst 4.05 %); verify 65/65;
link audit 25/25 internal targets resolve. 0 new foundation requests.

**Open / owner decisions:** D1 sign-in backend (incl. /us/en/errors/sign-in, left as is), D2 analytics tags,
D4 AI search summary; search results need the query index (built from the live tree); live publish +
Phase D (sitemap, root `/` → /us/en redirect, query index) when preview-only is lifted; merge feat/wknd-us-rest.
