<!-- stardust provenance: skill=stardust:dynamics (via replica Phase 2, run 2) · phase=plan (curated) · 2026-10-23T08:20:00Z -->
# Dynamic features — plan (wknd.site full site)

| phase | rows | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|---|
| P1 chrome | 8, 9, 10 (UI) | header language switcher, mobile menu, Sign In control per the header contract | nav document per locale (`/nav`, `/ca/en/nav`, coming-soon nav) | `chrome-compare` exit 0 vs the 3 contracts, 1440 + 390 | D1 (backend only) | S |
| P2 interactions | 1, 2, 3, 5 | carousels, adventure tabs, FAQ accordion — block JS | block tables per deploy § 8 (EW1–EW10) | motion-observe live vs build, motion-compare | none | M |
| P3 client filter | 4 | adventures category tabs over authored cards | cards authored with a category cell | click each tab, card counts = source (All 16) | none | S |
| P4 search | 6, 7 (UI) | `helix-query.yaml` + search page block reading `/query-index.json` | every page emits title/description | `search-query` "surf" count 8 + top-3 titles on the published origin | D4 (generative answer) | M |
| P5 locale trees | 13 | /us/en + /ca/en trees, coming-soon homes, per-locale nav/footer | locale-tree folders; switcher links → new-site paths | rollout link audit: 0 internal 404 | none (decided 2026-10-23) | M |
| — | 11, 12, 14 | none (interim: static / off) | — | presence only | D1, D2 | — |
