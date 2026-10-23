<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-23T07:56:00Z
  readArtifacts: stardust/current/pages/*.json + *.html (65 pages + index alias), stardust/current/_brand-extraction.json, stardust/current/_crawl-log.json, stardust/current/_dynamics.json, stardust/state.json
  scope: site, 65 pages, --prep
  mode: descriptive (current state, not a target)
  supersedes: pilot 2026-10-16 (single page /us/en)
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — from the FAQ answer "Who is WKND's intended audience?" (us-en-faqs-html slots.accordion), the navigation and the page inventory._
People looking for outdoor and adventure trips and the stories behind them. The site's own
answer: "WKND is designed to be inclusive of all age ranges, abilities, and budget-levels. We
strive to cater to the thrill-seeking adrenaline junkie BASE-jumpers as well as novices that have
a spare weekend and interest in trying something new." Secondary audiences named in the copy:
guest writers ("Can I contribute to WKND? Yes!"), local promoters who sponsor adventures, and
signed-in members (a Members Only magazine section).

## Product Purpose

"WKND is a collective of outdoors, music, crafts, adventure sports, and travel enthusiasts that
want to share our experiences, connections, and expertise with the world. Our objective is create
a community to help like-minded adventure seekers find fun, engaging, and responsible ways to to
enjoy life and create lasting memories." (FAQs intro, verbatim.) The site does two jobs: a
**magazine** (7 stories in ca/en, 5 in us/en, 2 of them members-only) and an **adventures
catalogue** (16 guided trips per locale with trip facts, itinerary and packing list). Every
teaser routes to one or the other.

The FAQ also states plainly: "No. The WKND is a fictional online magazine and adventure company
… designed to demonstrate functionality for Adobe Experience Manager."

## Positioning

_provenance: inferred — from hero, teaser and listing copy._
Guided, curated adventures told through first-person magazine storytelling: "With WKND
Adventures, you don't just see the world -- you experience its cultures, flavors and wonders."
Certified guides give "access to attractions and perspectives not found on the pages of a guide
book" (About Us).

## Capabilities and Constraints

- **Inventory (65 pages):** landing 2 (us/en, ca/en; `/` → index alias of /us/en) · adventure
  detail 32 · magazine article 12 · adventures index 2 · magazine index 2 · members-only index 1
  · FAQs 2 · About Us 2 · coming-soon locale homes 9 (us/es, ca/fr, ch/de, ch/fr, ch/it, de/de,
  fr/fr, es/es, it/it) · AI-powered search 1 (us/en).
- **Locales:** content in en-US and en-CA (identical page sets, CA adds a "Canadian specific
  footer" note); 9 further locales show only a "WKND Adventures and Travel - Coming Soon!" hero.
- **Adventure detail:** breadcrumb, gallery carousel, trip facts (Activity, Adventure Type, Trip
  Length, Group Size, Difficulty, Price — e.g. "Price 5000.0", rendered as a raw number), share
  links, Overview / Itinerary / What to Bring tabs. Two DOM sub-templates (8 trips each).
- **Adventures index:** category tabs All / Climbing / Cycling / Skiing / Surfing / Travel over
  card grids.
- **Magazine:** featured article, "All Articles" grid, "Members Only" teasers ("Sign in to
  un-lock exclusive content for WKND members only!"); article pages carry byline, author card,
  pull quotes, up-next list, and on two stories a PDF download.
- **Members-only:** the two members-only articles and their index render without sign-in in the
  capture (vision check: "NOT gated").
- **Sign In / Sign Out:** header modal triggers (`#sign-in`, `#sign-out`; `_dynamics.json`).
- **AI-powered search** (/us/en/ai-powered-search): client-rendered search with an "Show
  AI-generated summary" toggle, "Powered by Content AI", Cards/List result layouts; results are
  empty in the capture.
- **Contact:** "Give us a call at 1-800-800-0000. E-mail us at info@wknd.com" (FAQs aside).
- **Platform facts:** Adobe Experience Manager Core Components + Archetype (footer copy);
  Adobe Stock imagery; Google Fonts (Asar, Source Sans Pro) and a site icon font.

## Brand Commitments

- **Register:** `brand` — editorial/marketing site: photo heroes, teaser CTAs, magazine stories,
  no auth wall on content; the AI-search page is the only tool-like surface.
- **Name and marks:** "WKND" wordmark, dark (header) and light (footer) SVG variants; favicon set
  32–512px.
- **Voice (observed):** aspirational, second-person invitations ("Join us on one of our next
  adventures", "Let us help you make your New Zealand climbing vacation a memory you will cherish
  forever!"), place-led headlines, first-person travel essays, an occasional joke ("Is a hot dog a
  sandwich?").
- **Personality (observed):** outdoorsy, magazine-like, calm photography with one loud yellow
  accent; flat and square.
- **Anti-references (observed):** none stated by the site. Visually it avoids rounded cards,
  shadows, gradients and colour beyond yellow — descriptive, not a rule the owner has made binding.
- **Same-design migration (flow: replica):** the current design is the target; this file
  describes it and does not propose changes.

## Evidence on Hand

- Page records with typed slots: `stardust/current/pages/<slug>.json` (65 + `index` alias; § `slots`)
- Rendered DOM sidecars: `stardust/current/pages/<slug>.html`
- Screenshots: `stardust/current/assets/screenshots/<slug>.png` (+ `-thumb.png`)
- Computed-style census, 65 pages × 360/1440: `stardust/current/_computed-styles.json`
- Brand surface: `stardust/current/_brand-extraction.json`; design tokens: `stardust/current/DESIGN.md`, `DESIGN.json` (incl. `extensions.modules[]`, 22 module candidates)
- Media: 129 local files for 266 source URLs in `stardust/current/assets/media/` (`_index.tsv`), incl. hidden carousel slides, inactive tab panels, contributor portraits, flags and favicons
- Fonts: Asar 400, Source Sans Pro 300/400/600 normal + italic (OFL), wknd-icon-font (site-owned): `stardust/current/assets/fonts/`
- Logo: `stardust/current/assets/logo.svg`; favicon: `stardust/current/assets/favicon.png`
- Source stylesheets: `stardust/replica/capture/css/`
- Dynamic surface: `stardust/current/_dynamics.json`, `_crawl-log.json#dynamicSurface`
- Absent — do not fabricate: testimonials, pricing tables, booking or checkout flows, newsletter
  forms, video, author bios beyond name + roles, real search results, members-only gating.

## Product Principles

_provenance: inferred — from the copy and the structure every page shares._
1. Photography sells the trip; copy invites.
2. Every block leads somewhere — a trip or a story.
3. One action colour, used consistently.
4. Accessible to every budget and ability (the site's own stated audience).

## Accessibility & Inclusion

_provenance: inferred — from the captured DOM; no stated standard._
18% of recorded images (71 of 394) and 24% of in-content `<img>`s in the DOM carry empty `alt`
(mostly article body photos and contributor portraits). Icon-only buttons carry an
`aria-label` ("Facebook", "Search", "Facebook WKND Button"); their text span is `display: none`.
Section CTAs have aria-labels that differ from their visible text ("All Articles" →
"read our articles", "All Trips" → "explore our adventures"). No accessibility statement was
captured.
