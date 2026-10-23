# Inconsistency register — wknd.site replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an improvement.
(The register was empty — pure replica — through Phase 4. The entry below was added at delivery, append-only.)

## R-01 — the page has no `<h1>`; the delivery contract requires exactly one

- **Evidence:** live heading outline of https://wknd.site/us/en.html has no `h1`
  (`stardust/current/pages/us-en-html.json` → `headings`: h2 ×5, h3 ×1, h4 ×1); the EDS delivery
  checks require exactly one `<h1>` in the delivered `.plain.html`
  (replica `reference/handoff-contract.md` § 2, deploy protocol step "`.plain.html`: … one `<h1>`").
- **Finding:** a structural/SEO defect of the source (no top-level heading), surfaced by the
  delivery contract — not a visual preference.
- **Minimal change:** the first hero slide's title "WKND Adventures" is authored as `<h1>` instead of
  `<h2>`, styled identically (Asar 400 36px/54px, same margins) — no visual change; every other
  heading keeps its source level.
- **Status:** applied
- **Where:** landing (`/us/en`) — `hero-carousel`, slide 1. Gate: pixel unchanged (1440 0.25 %,
  360 1.73 % on the preview origin); content-diff reports no ROLE SWAP for it.
- **Run 2 (2026-10-23, site scope):** R-01 also applies to `/ca/en` (same landing template, same outline).

## R-02 — coming-soon locale homes have no `<h1>`; the delivery contract requires exactly one

- **Evidence:** captured outlines of the 9 coming-soon pages (`stardust/current/pages/us-es-html.json`
  and its 8 duplicates ca-fr, ch-de, ch-fr, ch-it, de-de, es-es, fr-fr, it-it) → `headings`:
  `h2 "WKND Adventures and Travel - Coming Soon!"`, `h4 "Follow Us"`; no `h1`. Delivery requires one
  `<h1>` per `.plain.html` (handoff-contract.md § 2).
- **Finding:** structural/SEO defect of the source, surfaced by the delivery contract — not a visual preference.
- **Minimal change:** the hero title "WKND Adventures and Travel - Coming Soon!" is authored as `<h1>`
  instead of `<h2>`, styled identically to the source `h2` (same face, size, line-height, margins); no
  other heading changes level.
- **Status:** applied
- **Where:** coming-soon (9 pages) — `coming-soon-hero`.

## R-03 — the AI-Powered Search page has no heading at all; the delivery contract requires one `<h1>`

- **Evidence:** `stardust/current/pages/us-en-ai-powered-search-html.json` → `headings`: only the footer
  `h4 "Follow Us"`; page `<title>` is "AI-Powered Search" (captured, `title` field).
- **Finding:** structural/SEO defect of the source (a page without a top-level heading).
- **Minimal change:** a visually hidden `<h1>` carrying the page's own captured title text
  "AI-Powered Search" (no new wording, zero rendered pixels); nothing else changes.
- **Status:** applied
- **Where:** unique — `/us/en/ai-powered-search` (main content root, first child).

Hands-off policy for audit candidates: none adopted (no audit run; pure replica otherwise).
