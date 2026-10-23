# EDS conversion log — wknd.site /us/en.html (replica archetype us-en-html)

Written by stardust:deploy via replica Phase 5 · started 2026-10-16T13:17:00Z · branch `feat/wknd-home-replica`
Target: org `savitaagre` · site `edsmsm` · DA content `https://content.da.live/savitaagre/edsmsm`
Preview host: `feat-wknd-home-replica--edsmsm--savitaagre.aem.page` (label 36 chars ≤ 63)
DA path: `/us/en` (matches the source URL `/us/en.html`)

## Step 2 — names + reuse (locked; single-page conversion, no naming questions)

| Prototype section | D1 block? | D11 collection pattern | EDS name | Decode tier |
|---|---|---|---|---|
| `header.site-header` | chrome | header | `header` (rebuilt, from `/nav`) | template-slotted |
| `section.hero-carousel` | yes (interactive, 3 slides) | carousel (row per slide: image \| text) | `hero-carousel` — `carousel` powers the adventure galleries (16 pages), so archetype-prefixed | reconstructive (repeat group) |
| `.featured-teaser` | yes (2-col composition) | columns (image \| text) | `featured-teaser` | template-slotted |
| `.section-title--underline` ×2 | no — default content | — | section style `title-underline` | default content |
| `h3` "Where do you want to go?" | no — default content | — | default content | default content |
| `.image-list` ×2 | yes (repeat group) | cards (row per card: image \| text) | `image-list` — `cards` exists (unused by current content), left untouched | reconstructive |
| `.btn-primary` ×2 | no — default content (bare-links-too) | — | `a.button` | default content |
| `.separator` ×2 | no — default content (`<hr>`) | — | default content | default content |
| `.hero-teaser--imagebottom` | yes (full-bleed image + overlapping card) | hero | `hero-teaser` — `hero` exists (unused by current content), left untouched | template-slotted |
| `footer.site-footer` | chrome | footer | `footer` (rebuilt, from `/footer`) | template-slotted |

**Foundation reuse decision.** Baseline gate of the EXISTING implementation (same code, served at
`main--edscapstoneajay--ajayajju2412.aem.page/us/en`) vs live: **50.91 % at 1440** (header band 44.6 % hot) —
not reusable at replica fidelity. The foundation is rebuilt from the gated prototype. Existing custom
properties and block-facing classes in `styles/styles.css` are kept (additive), so the 16 adventure and
5 magazine documents keep resolving their tokens. Nothing on this site is previewed or published yet.

## Dynamic surface (stardust/dynamic-features.md)

- `hero-carousel`: click switching (prev / next / indicators), fadeIn .5s; no autoplay (dead on live).
- `header`: `body.scrolly` at scrollTop > 15; language menu (`left = toggle.position().left − 240`,
  `showMenu`/`open`, outside click closes); mobile nav `body.navPanel-visible` (≤1024).
- D1 Sign In / D2 tags / D3 locales: interim static paths (owner decisions open).

## Publish decision

Preview only (`--no-publish`) through delivery. **Published live on the owner's request (2026-10-16):** `/us/en`, `/nav`, `/footer` → https://feat-wknd-home-replica--edsmsm--savitaagre.aem.live/us/en (live gate 1440 0.25 % Δh 0, 360 1.73 % Δh −1).

## Step 3 — Foundation (C0)

- `styles/brand.css`: every pre-existing custom property kept (`--text-color` … `--link-hover-color`,
  all `--body-font-size-*` / `--heading-font-size-*`); prototype `:root` tokens lifted verbatim beside
  them (`--text`, `--brand-yellow`, `--surface-*`, `--font-*`, `--fs-*`, `--button-size`,
  `--utility-height`, `--shell` 1164px, `--gutter` 14px) plus `--max-width` 1680px (cap-probe shell cap).
  `--nav-height` 200px (>=1025) / 130px (<=1024) = the source page-root padding-top.
- `styles/styles.css`: structural layer kept verbatim (body gate, `header { height: var(--nav-height) }`
  + visibility reservation, `main > .section` scaffold). Fixed chrome (#108-variant): `body > header`
  is `position: fixed` (height auto, so the floating box never covers content when the scroll morph
  shrinks it); the in-flow reservation is `main { padding-top: var(--nav-height) }` — the late header
  load shifts nothing. `main` and `body > footer` are capped at 1680px (the source page root);
  the footer host box (48px top margin, 16/24 padding, #202020) is lifted onto `body > footer` (#31).
  <=1024: `body.navPanel-visible` translates `main` + footer 275px (the source page root).
- Global rules lifted from the prototype: border-box reset, body 18px/1.5, `p` 18px/2.5 justify
  0 0 13.5px, h1–h3 Asar 400 (40/36/24) 27px/13.5px, h4–h6 Source Sans Pro 600 uppercase with UA
  margins (h4 21.28px as on live), links #0045ff with NO global hover (live has none — the old
  underline hover is removed), section-title underline now `padding-top: 8px` (live
  `.cmp-title--underline`; was `margin-top: 12px`) and written with descendant selectors (EW10).
- `img { display: block; max-width: 100%; height: auto }` (#36). The gated geometry DOES depend on
  inline images in four places — header/footer logos (done here: `display: inline` in the chrome
  CSS), and the hero-teaser, image-list and featured-teaser media (prototype `img` is inline):
  those blocks must set `display: inline` (vertical-align baseline) locally.
- Button system: `a.button` = prototype `.btn-primary` (#ffea00, #202020, 600 14px/21px uppercase,
  no radius, 48px tall, 16px 32px, no hover — none on live); `p.button-wrapper` is a flex row with
  no margin (48px tall, like the prototype's flow-root `.col`). Edit-mode repaint (a) + (b) shipped.
- Section scaffold retuned to the prototype rhythm: `main > .section { margin: 0 }`; wrappers
  `padding: 0 14px`, `max-width: 1164px` at >=1025px; full-bleed escape for
  `.hero-carousel-wrapper` / `.hero-teaser-wrapper`. **Deviation risk:** the 16 adventure and
  5 magazine documents were built on the old 40px section margins / 24–32px padding / 1680px
  wrappers; their tokens all still resolve, but their spacing follows the new scaffold.
- Lint: `stardust/prototypes/us-en-html.js` got 3 behaviour-neutral targeted edits (destructuring,
  two line-length splits) — `eslint .` covers it. Chrome CSS disables `no-descending-specificity`
  (independent regions share element tails) and, scoped, `selector-class-pattern` for the live
  state names `showMenu` / `navPanel-visible`.
- Token gate: blocks reference two undeclared properties, both intentional per-element inline
  properties set by `header.js` (`--lang-flag` with a US fallback, `--flag` per country).

## Step 5 — Buttons

- Runtime is bare-links-too (`runtime-contract.json`): `p.button-wrapper > a.button(.primary)`.
  The foundation paints `a.button` as the prototype `.btn-primary` (no inner text span needed:
  48px border-box with 16px 32px padding puts the 21px label exactly where the span sat).
  `.primary` / `.accent` share the yellow paint; `.secondary` keeps an inset 2px outline for the
  other documents. Chrome fragments are also run through decorateButtons(); header/footer undo it.

## Step 4 — Fonts

- `fonts/*.woff2` did NOT match the capture: all seven were a different subset build (Asar 14 KB vs
  22 KB captured). Replaced with `stardust/current/assets/fonts/` (byte-identical to the gated
  prototype's). Roboto files left in place (unreferenced; harmless).
- `wknd-icon-font.ttf` copied to `fonts/`, `@font-face` (font-display: block) in `styles/fonts.css`.
- Metric-matched `source-sans-pro-fallback` (Arial) and `asar-fallback` (Times New Roman) faces in
  styles.css, named second in both stacks. Values per the #11 recipe (fontTools unavailable, so
  head/hhea/cmap/hmtx were read from the woff2 brotli stream directly); size-adjust uses the
  capsize frequency-weighted a–z+space advance, because the subsets' OS/2 xAvgCharWidth is
  polluted by non-Latin glyphs: SSP vs Arial 94.16 / 104.51 / 28.99 %, Asar vs Times New Roman
  105.13 / 113.76 / 52.98 % (size / ascent / descent; line-gap 0). Linux capture hosts have no
  Arial/Times, so stitch-shot warns that the two `-fallback` faces failed to load — expected,
  the brand faces load (verified: Asar 400, SSP 400/600, wknd-icon-font).
  Latin `unicode-range` only, so glyphs outside the brand subset (footer "Ⓒ") fall through to the
  source's own system stack. head.html carries no font lines.
- Favicon: `stardust/current/assets/favicon.png` → `/favicon.png`, one `<link rel="icon">` in
  head.html (favicon.ico untouched). Flags: `icons/flags/*.svg` (code-served, root-relative).

## Step 6 — Chrome

- `/nav` (DA `nav.html`, source `stardust/deploy/content/nav.html`) — 5 sections, template-slotted
  by index: 0 account (Welcome / Sign In / Sign Out), 1 language (en-US toggle + 7-country list),
  2 brand (logo), 3 nav (Home > Magazine, Adventures, FAQs, About Us), 4 tools (Search).
  `/footer` — 4 sections: 0 brand (light logo), 1 nav (Home > 4), 2 social (h4 Follow Us + 3 links,
  title = aria-label), 3 legal (3 paragraphs). Logos are DA media (`media/chrome/*.svg`, pure
  vector); the blocks drop the pipeline's webp `<source>` for SVG pictures so the vector renders.
- Decode: node-slotting (EW1) — authored `<p>`/`<ul>`/`<h4>` are moved into wrapper slots and styled
  through descendant selectors (EW2); the delivered `li > p > a` (#98) is unwrapped; icon-only
  controls (search, social) move their authored label into a hidden span. The mobile panel is a
  stripped clone of the nav list (EW4, `@ew-exempt`). decorateButtons() (bare-links-too) runs on
  the fragments, so both blocks undo `.button` / `.button-wrapper` / derived titles on chrome links.
- Behaviour = the progress.json motion ledger, header only: body.scrolly (> 15), language menu
  (left = toggle.position().left − 240, showMenu / open, outside click closes), mobile panel
  (body.navPanel-visible, .5s). Hovers: header nav + search #ffea00, footer nav underline. Extra
  (no visual change): the closed mobile panel is also `visibility: hidden` (off-canvas links are
  not focusable), Escape closes it, reduced-motion drops the transitions.
- D3 (owner decision, OPEN): language-menu locale links keep the source paths verbatim
  (`/us/es.html`, `/ca/en.html` …) — they 404 on EDS until those locale trees migrate. D1 (open):
  Sign In / Sign Out stay `#sign-in` / `#sign-out` with no backend.
- Internal chrome hrefs are root-relative and extensionless (`/us/en`, `/us/en/magazine`,
  `/us/en/ai-powered-search` …); footer legal links stay external, fully qualified.

## C0 deploy + chrome gate (preview only)

- Code: `feat/wknd-home-replica` pushed, code sync 202, `/blocks/header/header.js` served.
- DA: `media/chrome/wknd-logo-dk.svg` + `wknd-logo-light.svg` (201), `nav.html`, `footer.html`,
  `drafts/wknd-shell.html` (sanitised, 200/201); preview 200 ×3 (never published live).
  Delivered `nav.plain.html` / `footer.plain.html` 200, 0 `about:error`; delivered SVGs are
  byte-identical to the capture.
- chrome-parity vs live (`drafts/wknd-shell`): header 1440 6/6 texts + 360 2/2 texts, 0 geometry /
  style deltas; the ONE reported delta is the logo icon signature (`wknd-logo-dk.svg` →
  `media_1930…svg`) — content-addressed DA media naming, same bytes. Footer: every item offset by
  the same Δy (short shell main: −3090 @1440, −4856 @360), internal geometry/style identical.
- crop-compare header band vs live: 1440 y0+200 100.00 %; 360 y0+117 99.86 % (the shell page is
  1018px tall at 360, so the stitched capture repeats the fixed header at the y=118 seam).
- Behaviour probe (EDS shell vs prototype, identical results): scrolly at 16px → bar 15/5 +
  shadow, header 193.6 → 113.6px; language menu left 881.98px (= prototype), showMenu/open,
  7 flags, en-US underlined, outside click closes; hovers #ffea00 / underline; 360 panel
  −275 → 0, toggle x 285, main x 275; Welcome / Sign Out / Home present and unrendered; no
  `<header>` inside the blocks; 0 console errors.

## C-ARCHETYPE landing / us-en-html (archetype-landing unit)

### Step 2b — section schema + decode tiers

- `stardust/eds-schema/us-en-html.json` via `section-schema.mjs`. The script only sees `<section>` /
  `[data-section]`; the prototype has one `<section>`, so the schema was generated from an annotated
  COPY (`stardust/.work/schema/us-en-html-annotated.html`: `<base href=":8791">` + `data-section` on
  `.featured-teaser`, both `.image-list`, `.hero-teaser--imagebottom`; the gated prototype is untouched).
  5 sections: hero-carousel (3 × slide, uniform: 1 heading/1 body/1 cta/1 img), featured-teaser
  (body/heading/body/cta/img), image-list ×2 (4 × unit: 1 cta + 1 img + description), hero-teaser.
- Tiers: `hero-carousel` reconstructive (row per slide: image | text; heading-boundary fallback for a
  flattened cell), `image-list` reconstructive (row per card: image | text), `featured-teaser` and
  `hero-teaser` template-slotted (empty slot template, nodes MOVED by role). Section titles, the two
  buttons and "Where do you want to go?" are default content.

### Step 7/8 — blocks (new; no existing block touched)

- `blocks/hero-carousel/` — slides `.slide > .teaser > .content (.title/.description/.actions) + .media`,
  generated text-free controls (`button.action.previous/.next` with an empty inline `span.action-icon`
  glyph, `ol.indicators > li.indicator`, aria-label only, #100). Live state classes
  `cmp-carousel__item--active` / `cmp-carousel__indicator--active`, `@keyframes fadeIn` (live name,
  stylelint-disabled), no autoplay. First slide img `loading=eager` + `fetchpriority=high`; media
  slot reserved (640px box ≥1165px, img width/height ratio below).
- `blocks/featured-teaser/`, `blocks/hero-teaser/` — prototype rules verbatim under the block class;
  teaser CTA repainted as the source `.btn-teaser` (float, 1em 2.5em, 49px) over `a.button`.
- `blocks/image-list/` — `ul.items > li.item > article > a.image-link (generated, text-free, href of the
  title link) > .image > picture`, `.title > p > a` (decorateButtons undone: card link, not a CTA),
  `.description > p` (260px nowrap ellipsis).
- Inline images (C0 note): `display: inline; vertical-align: baseline` in hero-carousel, hero-teaser,
  featured-teaser, image-list. Column BFCs: `.featured-teaser-wrapper`, `.image-list-container > div`,
  `.hero-teaser-container .default-content-wrapper` are `flow-root` (the source `.col`); the
  hero-carousel wrapper is deliberately NOT (its floated controls overhang the 72px margin as on live).
- Separators: two empty sections with section-metadata `style: separator` (no authored `<hr>`, #119),
  drawn by an interim scoped rule in `image-list.css` (`.image-list-container + .separator`: 64px
  padding, 1px solid #ebebeb box inside the 1136px content box) → foundation request.
- Delivery-pipeline carries: the pipeline emits authored image titles as `data-title` → each block
  restores `title`; derived CTA titles (= text, from decorateButtons) are dropped; the two section
  buttons' source aria-labels are authored as link titles and promoted to `aria-label` by image-list
  for its own section CTA (interim → foundation request).
- Heading outline: the first slide title "WKND Adventures" is the page's one `<h1>` (#35/#57; the
  source has no h1 — semantic only, styled 36px/54px like the h2s); all other titles keep source levels.
- Round-trip (`block-roundtrip.mjs --ew`, :8791 prototype, `--map hero-teaser=.hero-teaser--imagebottom`):
  every block exit 0, whole page exit 0 — 0 structural 🔴, EW editable 37/37, dead 0, duplicated 0.
  🟡 MISSING BODY ×5 = the prototype's hidden control/indicator labels (not generated, #100); 🟠 EXTRA
  = section-head default content beside the block (expected).

### Step 9 — document

- `stardust/deploy/content/us/en.html`: metadata section (Title "WKND Adventures and Travel",
  Description = source meta description, Image = the source og:image URL, Template landing), then
  hero-carousel | featured-teaser | Recent Articles + image-list + All Articles | separator |
  Next Adventures + hero-teaser | Where do you want to go? + image-list + All Trips | separator.
  Text, alt and title verbatim from the prototype (6 image titles). Internal hrefs root-relative,
  extensionless.
- Media: 13 editorial images → `media/home/` via `da-media-upload.mjs --manifest` (manifest excludes the
  two logo SVGs; `DA_TOKEN=injected` placeholder accepted) — 13 OK, ledger `stardust/deploy/media-ledger.json`.
- `davids-model-lint` PASS 0 🔴 0 🟡. `localize-links --source-host wknd.site --content stardust/deploy/content`
  then `--check` PASS; the plain pass also normalised C0's `nav.html` en-US link `/us/en.html` → `/us/en`
  (the target now exists) — nav re-PUT (200) + re-previewed (200).

### Local QA (structural only)

- `build-harness.mjs` + `qa-gate.mjs --schema … --design DESIGN.json --full-bleed hero-carousel,hero-teaser`:
  PASS 26 ok / 0 warn / 0 fail (one h1, schema unit counts 3/4/4, both full-bleed wrappers 1440/1440,
  cap 1680 @2560). The harness strips metadata as its own section — the metadata block therefore sits
  in a dedicated first section. measure.mjs harness vs prototype: scrollHeight 3754 = 3754 @1440,
  5875 = 5875 @360. `npm run lint` 0 errors; `foundation-freeze check` unchanged (31 files).

### Deploy (preview only)

- Commits `e073181` (blocks + document), `9efefc9` (title / aria-label carries); pushed; code sync 202;
  served block JS/CSS byte-identical to the repo. DA PUT `/us/en.html` 201 then 200; preview 200 ×2.
- `.plain.html` 200: 8 sections (metadata section empty), 13 `<img>` / 13 alt, 0 `about:error`, one h1,
  no `/img/`; head: title, description, og:image (source URL), template landing.
- `ai-readability.mjs`: strict 100 %, code 100 % (main served gap 0 / 467).
- Computed-style guard (1440 + 360): 5 blocks decorated + `data-block-name`, flex where expected,
  3 slides (1 active), cards 4/4, 11 visible images all `clientWidth > 0`, 0 pageerror, overflow 0,
  docH 3754 / 5875.

### Published-origin gate (preview origin)

- pub1: 1440 0.25 % Δh 0, 360 1.73 % Δh −1; content-diff 8 🔴 (2 MISSING ARIA-LABEL real → fixed).
- pub2 (final; 2 of 3 rounds used): **1440 0.25 % Δh 0** (max band 0.9 % y1000–1500, image rendition
  texture), **360 1.73 % Δh −1** (max band 5.1 % y4000–4500 card photos, 4.7 % y4500–5000, 4.5 %
  footer tail, 3.5 % Climbing NZ photo — the prototype round's rendition-texture residuals); overflow
  ok; clip 0; content-presence MISSING 0 / HIDDEN 0; chrome-parity: only the 2 known DA media-hash
  logo filenames; crop-compare header 100.00 % / 99.86 %, footer 100.00 % / 99.23 % (360: `--y-b` +1).
  content-diff 6 🔴 at each width, all justified: ROLE SWAP + MISSING CTA "San Diego Surf Spots" = one
  pairing artifact (the source's visually hidden indicator label of the same text pairs with the
  card link; the build's indicators carry aria-label only, #100; content-presence finds the link);
  MISSING ICON ×4 = frozen C0 chrome glyph structure (pixels identical) → foundation request.
- Motion (motion-observe on the preview, same pokes as `motion/us-en-html.json` + the 8 hover families):
  10 parity, 0 missing, 0 extra (`motion/us-en-html-eds.json`); 360 mobile nav 3 parity
  (`motion/us-en-html-360-eds.json`).
- gate-all: state.json has the page `approved` with no `liveUrl` (gate-all selects `deployed` rows),
  so it ran on a temporary state copy (`stardust/.work/schema/state-gate-all.json`, ledger untouched):
  `--only us-en-html` 1440 PASS 0.25 % Δh 0, 360 PASS 1.73 % Δh −1, clip 0, content 0/0 (browser
  tier chromium-fallback — Chrome not installed).
- Residual 🟡: Climbing NZ image title not delivered (title == alt; the pipeline drops it).

## C-final (main agent, 2026-10-16T14:36:23Z)

- foundation-freeze check before applying: unchanged (31 files). Requests applied once (commit 4e3fc33):
  generic `main > .section.separator`; decorateButtons() promotes an authored title ≠ text to aria-label;
  restoreImageTitles() in decorateMain; header/footer icon glyphs in empty inline spans; obsolete
  splitHomepageSections() removed. Interim copies removed from the blocks. Re-frozen after.
- hero-carousel indicators mirror the hidden live slide titles (@ew-exempt presentational copy).
- Register R-01 (applied): hero slide 1 title authored as the page's one h1 (no visual change).
- Published-origin gate pub3: 1440 0.25 % Δh 0 · 360 1.73 % Δh −1 · 0 structural 🔴 · presence MISSING 0 /
  HIDDEN 0 · clip 0 · overflow ok · crops header 100.00 / 99.86 %, footer 100.00 / 96.91 % (99.23 % with
  the 1px rendition offset aligned) · motion 10/10 + 3/3 · gate-all (full verdict) PASS at 1440 and 360.
- gate-all reads `status: deployed` + `liveUrl`, which state.mjs cannot write; it ran on a derived copy
  (stardust/.work/rollout/state-deployed.json) — state.json itself is `migrated`.
- Publish: still preview-only. Nothing published live.

## Run 2 — C0 foundation (canon3, site `wknd`, 2026-10-23)

Target: DA `savitaagre/wknd` (content.da.live/savitaagre/wknd), preview `main--wknd--savitaagre.aem.page`
(code still from savitaagre/edsmsm main — the feature branch is NOT pushed). Owner: preview only, nothing live.
Reused from the pilot C0 unchanged: brand.css tokens (h1 40 / h5 14 already canon), fonts/, favicon,
head.html, the fixed-chrome shell, buttons, header/footer template-slotted decode (tier: template-slotted).

- **Canon3 deltas applied.** Current-page state (canon2): `markCurrentNav()` in scripts.js puts
  `aria-current="page"` on the link to the current page and `li.is-active` on the level-1 item whose link
  is an ancestor of the path (header list before the mobile clone, footer list); header CSS paints both
  yellow, footer CSS light + underline (descendant selectors, EW2). Locale chrome (canon3): `<html lang>`
  from the path (`getLocale()`: `/{country}/{language}` → `en-CA`, `es-US` …; en-US otherwise); the
  toggle flag stays derived from the authored locale label (`--lang-flag`, code-served `/icons/flags/`)
  — the EDS equivalent of the canon `.lang-toggle--<cc>` class, no per-locale CSS. Utilities as section
  styles: `separator` + `space-small` / `space-medium` / `no-rule`, `text-small` (styles.css).
- **Open canon requests folded in.** (1) standalone hero-teaser heights: stay per-block (not foundation).
  (2) coming-soon nav markup: the EDS nav list already keeps the level-0 `ul > li` wrapper; the
  coming-soon documents author the level-0 item only (`<ul><li><a href="/us/es">Español</a></li></ul>`),
  no nested list; the 16px item margin is scoped to `li li`, so the level-0 item stays 0 high, as live.
  (3) en-CA active-link wording: the active locale link's href is set to the current page; beyond the
  request, the live language copies (captured on all 54 US/CA pages) are mirrored — the en-US/en-CA link
  of the current language points at the counterpart page when `<counterpart>.plain.html` answers HEAD
  200, checked once on the first menu open (no request at page load), else stays the locale home
  (US ai-powered-search → /ca/en, CA members-only → /us/en, as live).
- **Nav/footer selection rule** (`getChromePath()`, runtime-contract.json `chromeSelection`): page
  metadata `nav`/`footer` wins; else `<locale root>/nav|footer` for every locale except /us/en; else
  the root `nav` / `footer` documents; a missing locale document falls back to the root ones. No page
  metadata needed.
- **Documents** (stardust/deploy/content/, one-shot generator stardust/.work/c0/probes/gen-chrome.mjs):
  root `nav` + `footer` (en-US), `ca/en/{nav,footer}` (CA toggle label, /ca/en hrefs, Canadian note first
  in legal), the 9 coming-soon locales `{us/es,ca/fr,ch/de,ch/fr,ch/it,de/de,fr/fr,es/es,it/it}/{nav,footer}`
  (own toggle label, locale-home logo href, level-0 item labelled Español / Français / Deutsch /
  Italiano), `drafts/wknd-shell`. Every document ends with a dedicated metadata section
  `Robots | noindex` (a dedicated section: build-harness drops a section that holds the metadata block,
  and it can never fold into a chrome slot). Language-menu hrefs are now extensionless (`/us/es` …;
  all locales migrate — owner 2026-10-23).
- **Media.** `da-media-upload.mjs --scope chrome` → `media/chrome/wknd-logo-{dk,light}.svg` 201 ×2 (pure
  vector, no data URIs). NEW ledger `stardust/deploy/media-ledger-wknd.json` — the default ledger holds the
  pilot's edsmsm uploads and the script keys by media path only (foundation-requests.md, run 2).
- **Lint.** `npm run lint:fix` + `npm run lint`: 0 errors (1 pre-existing no-console warning in
  stardust/scripts/deploy/sanitise.js). Fixed: 8 max-len comment lines in the gated prototype JS
  (us-en-adventures-climbing-new-zealand-html.js, us-en-ai-powered-search-html.js) and their migrated
  copies — comment wraps only. `lint:breakpoints` not added: DESIGN.json has no
  `extensions.breakpoints.target` (the script skips; contract condition not met).
- **Local QA.** `build-harness.mjs` + `qa-gate.mjs` on the shell: PASS 11 ok / 0 warn / 0 fail (one h1,
  header + footer loaded and non-empty, cap 1164 @2560). `block-roundtrip --ew`: N/A for chrome (fragment-
  fed blocks; the script decorates in-page block tables only). Chrome probe (local code against the
  DELIVERED wknd documents, 16 simulated paths, 1440 + 360): 0 page errors; lang / toggle / flag / logo
  href / level-0 label / markers / mobile list / CA note all as § Locale chrome; FAQs aria-current,
  article → Magazine is-active, program → Adventures is-active; header 194 / 117, footer 260 / 593 (US),
  289 / 637 (CA), 260 / 463 (coming-soon) = the gated prototypes us-en-html / ca-en-magazine-members-only-
  html / us-es-html at both widths.
- **Deploy (preview only).** `deploy-batch.mjs --no-publish --paths` (ledger stardust/deploy/ledger-c0.json):
  23/23 PUT 201, preview 200. `.plain.html` 23/23: 200, sections intact, 0 `about:error`, no `/img/`,
  1 logo `<img>` per chrome document, exactly one h1 on the shell; `<meta name="robots" content="noindex">`
  delivered. Published-origin chrome gate: PENDING the code push.

### C0 round 2 — header contract (coordinator gate: crops PASS, chrome-compare 6 🔴 / 2 🟡)

- **Sign In modal (🔴 state-missing + keyboard, 1440 + 390).** Live: `[data-modal-url]` click → GET the
  `language-masters/en/site/sign-in` experience fragment → `#wknd-modal` appended, jQuery fadeIn(300);
  any document click outside it fadeOut(200) + removed (the click swallowed); no Escape, focus stays on the
  trigger, no scroll lock. Rebuilt UI-only (D1): authored `/fragments/sign-in` (h1 Sign In, h3 Welcome
  Back, USERNAME / PASSWORD label paragraphs, FORGOT YOUR PASSWORD? `#`, SIGN IN link) decorated by
  `blocks/header/sign-in.js` into the source structure (fixed 450px box, `.cmp-layout-container--modal`
  panel: margin 2rem, padding 2rem 1.75rem, #202020, shadow 0 10px 20px dimgray; inputs 14px, 1px #ebebeb
  r4, 2rem 1rem; yellow 180px SIGN IN; gradient 2px separator; ≤767 margin 0 / max-width 340). Values
  from clientlib-site + the live fragment (fetched to stardust/.work/c0/signin/). Fade by WAAPI (no CSS
  transition, so no motion delta — live animates via jQuery). Measured vs live with the modal open: every
  element rect identical at 1440 and 390; panel crop pixel diff 0.00 % at both widths. Hidden at rest:
  `display: none` until opened.
- **D1 interim (no credentials ever sent).** Inputs carry no `name`; submit is always prevented; Enter in a
  field or the SIGN IN control navigates by plain GET to the authored target
  `/us/en/errors/sign-in?resource=%2F&j_reason=invalid_login&j_reason_code=invalid_login` — the page the
  source lands on after its (always invalid here) POST. That page is NOT in the inventory: a capture gap
  for E2 (until delivered it 404s on EDS).
- **🔴 control-missing "search" was the modal.** chrome-compare's `searches()` collects every input the
  explorer typed into; on the source those are the Sign In modal's USERNAME / PASSWORD fields (probe
  "sign", submit → the invalid-login URL). The header Search link itself pairs fine by key `search`
  (source `#button-f5a05c82f1` / build `.header-search a`: both role link, kind search, rect
  1240,85,48,48 @1440 / 342,40,48,48 @390, href ai-powered-search). Fixed by the modal's fields.
- **🟡 link-missing /us/en (top-level).** Not the nav-home item: it is the LOGO link (source
  `#image-1f45f4e6a7>a`, name "", rect 152,119,128,23 @1440 / 28,77,128,23 @390, href /us/en.html); the
  build logo link has the same empty name, rect and href (/us/en). pairControls pairs by `key` (empty on
  both sides) or by family (`link` is not a family), so an unnamed link can never pair — a comparer
  false positive, left as 🟡 (no header-decisions entry).
