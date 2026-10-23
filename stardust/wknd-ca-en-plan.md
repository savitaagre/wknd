# WKND Canada (/ca/en) same-design migration — plan & tracker

Source: https://wknd.site/ca/en.html and its subpages
Flow: replica (same design, near pixel-perfect) — stardust `replica`, continuing the run-2 inventory
Branch: `feat/wknd-ca-en` (from `aem-20261023-1633` @ c795fb2, which branches from `main` @ 71d7e86)
Target: site `wknd`, DA `savitaagre/wknd`, under `/ca/en/…` — PREVIEW ONLY (owner, 2026-10-23)
Preview host: https://feat-wknd-ca-en--wknd--savitaagre.aem.page
Started: 2026-10-23 · Approvals: hands-off · Gate widths 1440, 360

## Decisions (owner, 2026-10-23)

| Decision | Answer |
|---|---|
| Target | wknd site, under /ca/en (same site as the US pages; Canada chrome already built) |
| Branch | new feature branch from the current work (not from main — main lacks every run-2 artifact) |
| Delivery | preview only, never published |

## Why the phases are not re-run from zero

The run-2 `extract --prep` (2026-10-23) already captured all 29 /ca/en pages live (29/29 provenance),
typed them, and Phase 3–4 gated one archetype per page type, including the en-CA chrome
(members-only listing, the first /ca/en archetype: 0.01 % / 0.08 %). The skills' own rule is that a
re-run is required only when the source changed or the scope grows beyond the inventory
(`extract --refresh <slug>`; replica § Phase 1). Step 1 below verifies the capture is still current
instead of assuming it.

## Scope — 29 /ca/en pages + the archetypes they depend on

| Type | /ca/en pages | Archetype (must be live + gated first — handoff contract #126) |
|---|---|---|
| landing | ca/en | us/en (us-en-html) |
| listing | ca/en/adventures | us/en/adventures |
| program | 16 × ca/en/adventures/* | us/en/adventures/climbing-new-zealand |
| magazine-listing | ca/en/magazine | us/en/magazine |
| article | 5 × ca/en/magazine/* + 2 × ca/en/magazine/members-only/* | us/en/magazine/guide-la-skateparks |
| members-only-listing | ca/en/magazine/members-only | itself (delivered; gate pub1 partly run) |
| faq | ca/en/faqs | us/en/faqs |
| static | ca/en/about-us | us/en/about-us |

Chrome: /ca/en/nav, /ca/en/footer (+ /nav, /footer for the US archetypes, /fragments/sign-in) — the
foundation's locale rule picks them. They must be re-PUT into DA `wknd`: the owner's folder moves put
the C0 documents in `wknd-test` and the old edsmsm content in `wknd`.
Out of scope (linked from the CA header/footer): /us/en/ai-powered-search, /ca/fr (coming soon) →
E2 decides deliver vs repoint; /us/en/errors/sign-in (Sign In failure target) = capture gap.

## Steps

| # | Step | Status | Notes |
|---|---|---|---|
| 0 | Branch, plan, tracking | done | feat/wknd-ca-en @ c795fb2, branch host serves code |
| 1 | Source freshness check of the 29 /ca/en captures (+ the 7 archetypes) | done | 36/36 re-captured live, 0 content changes |
| 2 | Chrome documents back into DA wknd (nav, footer, /ca/en/nav, /ca/en/footer, fragments/sign-in, shell) + preview | done | 6/6 PUT + previewed on feat-wknd-ca-en; .plain.html 200, 0 about:error |
| 3 | C-archetype units: program, listing, faq, static, landing, article, magazine-listing (us/en reps) on the preview | pending | resume the paused program/listing work |
| 4 | Members-only: finish its published-origin gate | pending | pub1 at 1440 ran: chrome-parity 3 deltas, unit-geometry selector error |
| 5 | Cluster units: the 28 /ca/en siblings (sibling-variance, migrate render, chain, gate-all) | pending | |
| 6 | C-final: foundation requests, gate-all over the delivered roster, coverage | pending | |
| 7 | D/E (preview regime): root redirect n/a (CA scope), E link audit on /ca/en, report | pending | live-only checks recorded as pending-until-publish |

## Log

- 2026-10-23 Paused wave-1a cluster work committed (c795fb2, lint 0 errors, foundation unchanged 32 files);
  `feat/wknd-ca-en` created from it and pushed; branch host serves the new blocks (200).
- 2026-10-23 Freshness: 36/36 unchanged. Media ledger rotated (stale after the owner's folder moves:
  27 images listed as uploaded to wknd are in wknd-test) → media-ledger-wknd.pre-folder-move.json; chrome
  logos re-recorded (byte-identical in wknd/media/chrome). Chrome docs 6/6 re-delivered (branch must be the
  host form `feat-wknd-ca-en` in admin calls — the slash form 404s every preview).
