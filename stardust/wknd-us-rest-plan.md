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
| 1 | Freshness re-capture of the 29 pages | pending | |
| 2 | Cluster units (program-us, article-us, coming-soon, search) | pending | |
| 3 | C-final: queued requests once, roster gate-all over all 65 pages, verify, link audit | pending | |
| 4 | PR to main with preview links | pending | merge only on owner request |

## Log

- 2026-10-24 Branch feat/wknd-us-rest created from main after PR #2; prototype server restarted (8791).
