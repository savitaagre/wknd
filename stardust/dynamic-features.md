<!-- stardust provenance: skill=stardust:dynamics (via replica Phase 2, run 2) · phase=triage (curated) · 2026-10-23T08:20:00Z · from stardust/dynamics/dynamic-features.generated-plan.md (30 rows, 10 archetypes, reach 66 pages) + vision check + header contract (3 variants) + search probe stardust/dynamics/search-probe-surf.json · target host not yet created (planned: main--wknd--savitaagre.aem.page) → no --target-origin probe yet -->
# Dynamic features — wknd.site (full site, all locales)

Supersedes the 2026-10-16 single-page inventory (/us/en only). Hands-off run: every non-`self` row ships
its interim tier and names the decision; nothing is `decided-out` without an owner statement.

## Listings contract

- **Adventures listing** (`/us/en/adventures`, `/ca/en/adventures`): 16 authored adventure cards in 6
  category tab panels (All 16, Climbing 2, Cycling 3, Skiing 3, Surfing 2, Travel 6 — counted in the rendered DOM by the listing worker). On the source the
  panels are pre-rendered AEM `image-list` components (no query at runtime) → authored rows in the
  document; the tab filter is client-only. No index is read. If the owner later wants them index-driven,
  each adventure page emits `<meta name="activity">`, `<meta name="adventure-type">`, `<meta name="trip-length">`,
  `<meta name="group-size">`, `<meta name="difficulty">`, `<meta name="price">` (values from the page's trip facts).
- **Magazine listing** (`/us/en/magazine`, `/ca/en/magazine`): featured teaser + 5-card "All Articles"
  grid + "Members Only" teasers — authored, fixed lists on the source → authored rows.
- **Home** "Recent Articles" / "Where do you want to go?" image lists: authored, fixed (as in the pilot).
- **Search index** (row 6): `/query-index.json` from `helix-query.yaml` in the code branch — path,
  title, description, image, lastModified, `template`; every migrated page emits `title` + `description`.

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | m-hero-carousel | home hero carousel (4 slides, prev/next, dots) | M | 2 landing | rebuild-native | self | pending | chrome-interaction | none | `.cmp-carousel` us-en-html.html; vision: 4 slides |
| 2 | m-trip-gallery-carousel | adventure gallery carousel (multi-slide sub-template; single-image on the other 8 trips) | M | 32 program | rebuild-native | self | pending | chrome-interaction | none | module `trip-gallery-carousel` 32 instances |
| 3 | m-content-tabs | adventure Overview / Itinerary / What to Bring tabs | M | 32 program | rebuild-native | self | pending | chrome-interaction | none | module `content-tabs` 32 instances |
| 4 | c-adventure-category-filter | adventures category tabs (6: All, Climbing, Cycling, Skiing, Surfing, Travel) over 16 cards | M (client-only) | 2 listing | client-only | self | pending | listing-client-filter | none | module `adventure-category-tabs` 2; 6 tab panels each |
| 5 | m-faq-accordion | FAQ accordion (7 items, collapsed) | M | 2 faq | rebuild-native | self | pending | chrome-interaction | none | module `faq-accordion` 2 |
| 6 | s-site-search | AI-Powered Search page: JS-submitted query over site pages; probe "surf" → 8 results, top: Surf Camp in Costa Rica · San Diego Surf Spots · Bali Surf Camp | S | 1 unique | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages) | dynamics/search-probe-surf.json; generated rows 22–23 |
| 7 | s-ai-summary | "Show AI-generated summary" toggle (Adobe Content AI generative answer + sources) | S / X | 1 unique | rebuild-native (UI) | needs-backend | pending | — | **D4** owner: generative answers on the new host? | `.cmp-contentaisearch__summary*` |
| 8 | m-header-language-switcher | header language/region switcher (en-US / en-CA toggle → 7 regions, 11 locales) | M | 65 | rebuild-native | self | pending | chrome-interaction | none (header contract is the spec) | chrome/header-contract*.json (2 controls, 4 states ×3 variants) |
| 9 | m-header-mobile-menu | mobile nav toggle | M | 65 | rebuild-native | self | pending | chrome-interaction | none | header contract @390 |
| 10 | x-sign-in | Sign In / Sign Out modal (`data-modal-url`, AEM-authenticated) | M / X | 65 | rebuild-native (UI only) | needs-backend | pending | chrome-interaction | **D1** owner: auth on the new host? | generated rows 21, 28, 29 merged |
| 11 | x-members-only-teasers | "Members Only" locked teasers on the magazine listing (sign-in gated on /us/en) | X | 2 magazine-listing | static-snapshot | needs-backend | pending | — | **D1** (same backend) | vision: lock-icon teasers |
| 12 | t-adobe-launch-analytics | Adobe Launch + Adobe Analytics / ECID + ad pixel + 2o7.net beacon | T | 65 | embed-passthrough (off) | needs-business-decision | pending | consent-gated-tags | **D2** owner: which tags on the new host | generated rows 24–27 merged |
| 13 | i18n-locale-trees | locale trees: /us/en (27), /ca/en (29, own header/footer variant), 9 coming-soon locale homes | I18N | 65 | rebuild-native | self | pending | locale-tree | decided by owner 2026-10-23: **all locales migrate** | generated rows 16–17; vision check |
| 14 | a-aem-runtime-plumbing | AEM runtime objects + data files: adobeDataLayer, Granite, CQ, contexthub.pagedata.json, currentuser.json, csrf token.json, user infinity.json | A / D | 65 | static-snapshot | self | pending | read-settings | none — renders nothing; consumers are rows 10 and 12 | generated rows 1–15 merged |

Notes:
- Row 14 is platform plumbing, not a feature: the 12 `data-fed / sheet-sync` drafts are AEM session and
  ContextHub files with no visible output; they ship nothing (reason recorded; unfreeze = D1 or D2 "keep").
- Rows 1–6, 8, 9, 13 are the `self` set. Motion rows (1–5, 8, 9) are implemented only after
  motion-observe confirms they fire (replica Phase 4 § Interaction parity).
- Row 6 parity: `search-query` check "surf" → expectCount 8, expectTitles [Surf Camp in Costa Rica,
  San Diego Surf Spots, Bali Surf Camp], expectIncludes /adventures/surf-camp-costa-rica.

## Decision batch

One message to the owner (hands-off: recorded, interim tiers ship, nothing decided-out):
- **D1 — Sign In / Members Only** (rows 10, 11): the source signs users in against AEM. Interim: the
  Sign In control and the locked teasers render as on the source; Sign In opens nothing (no backend).
- **D2 — Analytics / tags** (row 12): interim: no tag scripts on the EDS pages; the Launch property can be
  wired via the opt-in martech scaffold when the owner names the property.
- **D4 — AI-generated summary** (row 7): interim: the toggle renders; when checked it shows the regular
  index-backed results with no generative answer (stated in the UI), until a Content-AI endpoint exists.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| (none — decided-out needs an owner statement) | | |

## B2 verification (rollout, 2026-10-23)

Re-planned against the target host `https://main--wknd--savitaagre.aem.page` with the migrated archetypes:
30 draft rows · self 19 · owner batch 8 · delivered by the capture pipeline 2 · **host-bound 13/13** — the 13
first-party paths are the AEM session / ContextHub / CSRF / current-user files of row 14 (render nothing on
the source either). No disposition changes; every row keeps its disposition. Owner batch unchanged: D1, D2, D4.
Delivery note: the owner chose **preview only**; the search query index (row 6) builds from the LIVE tree,
so the search page can only be wired once pages are published — recorded as an interim (static UI) until then.
