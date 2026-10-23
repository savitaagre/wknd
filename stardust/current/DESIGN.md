<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-23T07:52:00Z
  readArtifacts: stardust/current/_brand-extraction.json, stardust/current/_computed-styles.json (65 pages x 360/1440), stardust/current/pages/*.json + *.html, stardust/replica/capture/css/clientlib-site.lc-edab4768979fadcb02662ded9e221c99-lc.min.css, stardust/current/DESIGN.json
  scope: site, 65 pages (+ index alias), --prep
  mode: descriptive (current state, not a target)
  supersedes: pilot 2026-10-16 (single page /us/en)
-->
---
name: WKND
description: WKND is a collective of outdoors, music, crafts, adventure sports, and travel enthusiasts that want to share our experiences, connections, and expertise with the world.
colors:
  background: "#ffffff"
  text: "#202020"
  brand-yellow: "#ffea00"
  surface-grey: "#ebebeb"
  surface-light: "#f7f7f7"
  text-muted: "#696969"
  link-blue: "#0045ff"
  indicator-grey: "#afafaf"
  indicator-active: "rgba(0, 0, 0, 0.8)"
  hairline-light: "rgba(255, 255, 255, 0.05)"
  input-border: "#cccccc"
typography:
  h1:
    fontFamily: "Asar, Georgia, 'Times New Roman', Times, serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  h2:
    fontFamily: "Asar, Georgia, 'Times New Roman', Times, serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  h3:
    fontFamily: "Asar, Georgia, 'Times New Roman', Times, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  h4:
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  h5:
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "normal"
  paragraph:
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 2.5
  list-item:
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  legal:
    fontFamily: "'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  none: "0"
  avatar: "30px"
  dot: "50%"
  toggle: "0 2px 2px 0"
spacing:
  gutter: "14px"
  heading-top: "27px"
  heading-bottom: "13.5px"
  content-max: "1164px"
  shell-max: "1680px"
components:
  button-primary:
    backgroundColor: "{colors.brand-yellow}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "1em 2.5em"
  button-base:
    backgroundColor: "{colors.surface-grey}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.surface-grey}"
    rounded: "{rounded.none}"
    size: "48px"
  nav-item-active:
    backgroundColor: "{colors.brand-yellow}"
    textColor: "{colors.text}"
    padding: "0 17px"
  tab-active:
    backgroundColor: "{colors.text}"
    textColor: "{colors.background}"
    padding: ".5rem 1rem"
  card-image-list:
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    width: "274px"
  panel-featured:
    backgroundColor: "{colors.surface-grey}"
    rounded: "{rounded.none}"
  footer:
    backgroundColor: "{colors.text}"
    textColor: "{colors.surface-grey}"
---

# Design System: WKND (current state)

## Overview

**Creative North Star: "The weekend outdoor magazine"**

WKND reads as an outdoor-travel magazine assembled from stock AEM Core Components: full-bleed
landscape photography, a quiet serif (Asar) for titles, a humanist sans (Source Sans Pro) for
everything else, and one flat signal yellow reserved for action and for the short rule under
section titles. Surfaces are flat and square; depth comes from photography and `#ebebeb` panels,
not shadows.

The same chrome frames all 65 pages: a fixed white header (logo, Sign In, flag + locale toggle,
uppercase nav with the active section filled yellow, search) and a `#202020` footer band (light
logo, nav, "Follow Us" icon buttons, legal copy). It varies in three ways only: the locale toggle
(en-US with the US flag on 27 pages, en-CA with the CA flag on 29), a "Canadian specific footer"
note on the 29 `/ca/en` pages, and the 9 coming-soon locale homes, whose header and footer
navigation shrink to a single item in the local language.

Density is editorial: running text is 18px on a 45px line (2.5), cards are a 4-up grid at 274px,
and the content column is capped at 1164px inside a 1680px shell. Type does not scale between
360 and 1440 — every heading level computes to the same size at both widths.

**Key Characteristics:**
- Flat and square: radius 0 on buttons, cards, images, panels, tabs; circles only on carousel dots and people.
- One saturated accent, `#ffea00`, for CTAs, the active nav item, hovers and the 84px title rule.
- Asar 400 titles over Source Sans Pro body and labels.
- Photography first; descriptions in muted `#696969`, uppercase, single-line.
- Airy running text (18px / 2.5).
- No responsive type scaling.

## Colors

A near-monochrome ink-on-paper palette with a single loud yellow.

### Primary
- **WKND Yellow** (#ffea00): fills every primary CTA (`View Trips`, `Full Article`, `See Trip`,
  `All Articles`, `All Trips`, `Read More`), the active header nav item, nav and up-next hovers;
  draws the 84px × 2px rule under underlined titles and pull quotes; colours the breadcrumb chevron
  glyph and the members-only lock corner. Census: background only (156 elements); the rules and
  glyph are pseudo-elements cited from the stylesheet.

### Secondary
- **Link Blue** (#0045ff): inline links (FAQ contact, footer credits) and the article sidebar
  up-next titles (236 elements, text only).

### Neutral
- **Paper** (#ffffff): page ground and the hero content card.
- **Ink** (#202020): all text, the footer band, the active tab, secondary (icon) buttons.
- **Panel Grey** (#ebebeb, cluster with #f7f7f7): featured-teaser and pull-quote panels, base
  button, the up-next left rule, and light text on the ink footer.
- **Muted Grey** (#696969): image-list card descriptions.
- **Indicator Grey** (#afafaf) / **Indicator Scrim** (rgba(0, 0, 0, 0.8)): inactive / active
  carousel dots.
- **Hairline on Ink** (rgba(255, 255, 255, 0.05)): link borders in the mobile navigation drawer.
- **Input Border** (#cccccc): the AI-search text field (one page).

### Named Rules
**The Yellow Means Act Rule.** `#ffea00` fills only calls to action, active and hover states, and
draws the title underline; it never colours body text or a large background field.

## Typography

**Display Font:** Asar (with Georgia, "Times New Roman", Times, serif)
**Body Font:** Source Sans Pro (with "Helvetica Neue", Helvetica, Arial, sans-serif)

**Character:** A soft, slightly calligraphic serif for titles against a clean humanist sans that
carries every label in uppercase; the pairing reads as print magazine rather than app.

### Hierarchy
- **Display / h1** (Asar 400, 40px, line-height 60px): page and article titles, most with the yellow underline rule.
- **Headline / h2** (Asar 400, 36px, 54px): section titles, hero / featured / next-adventure teaser titles; pull quotes also set at 36px.
- **Title / h3** (Asar 400, 24px, 36px): "Where do you want to go?", contributor names.
- **Label heading / h4** (Source Sans Pro 600, 16px, 24px, uppercase): article byline ("By …"), footer "Follow Us".
- **Small label / h5** (Source Sans Pro 600, 14px, 21px, uppercase): "Share this Adventure", "SHARE THIS STORY", contributor roles.
- **Body** (Source Sans Pro 400, 18px, line-height 45px / 2.5): article and adventure running text; list items 18px / 27px.
- **Label** (Source Sans Pro 600, 14px, uppercase): buttons, nav (400), tabs, card descriptions (14px uppercase, `#696969`).
- **Legal** (Source Sans Pro 400, 12px): footer copy.

The scale is ad-hoc (40 → 36 → 24 → 16 → 14; ratios 1.111, 1.5, 1.5, 1.143). Weights loaded
site-wide: Asar 400; Source Sans Pro 400 and 600 (normal and italic). 300 is requested by the
stylesheet but never used. FAQ accordion `<button>`s compute to the browser default Arial
13.33px because the site CSS sets no font on them.

### Named Rules
**The Serif For Titles Only Rule.** Asar appears on h1–h3 and pull quotes only; h4–h6, labels and
all running text are Source Sans Pro.

## Layout

A 1680px shell (`div.root.container`, cap-probe) holds a fixed header and full-bleed bands; content
sits in a centred column capped at 1164px (`max-width: 873pt` above 1025px) with 14px side
gutters. Full-bleed bands: the home hero carousel, the "Next Adventures" teaser, the adventures
index hero, the coming-soon hero. Adventure detail pages place a mini gallery carousel under the
breadcrumb, then the title, a trip-facts list with share links beside the Overview / Itinerary /
What to Bring tabs. Articles run a main column with a right sidebar (share, download, up-next
list). Image-list cards flow 4-up at 274px. Source breakpoints: 767/768px, 1024/1025px, 1164/1165px,
1200/1201px (see DESIGN.json `extensions.breakpoints`). Spacing is em/rem-based without a regular
scale (1em, 14px, 1rem, .5em, 2rem most frequent; headings 27px above / 13.5px below).

## Elevation & Depth

Flat. The only shadow on the site is the inset edge of the mobile navigation drawer.

### Shadow Vocabulary
- **Inset edge** (`box-shadow: rgba(0, 0, 0, 0.35) -3px 0px 5px 0px inset`): `#mobileNav`, one per page.

### Named Rules
**The Flat By Default Rule.** Content never casts a shadow; layering is done with `#ebebeb`
panels and photography.

## Shapes

Square everywhere: buttons, cards, images, panels, tabs and inputs have `border-radius: 0`
(`var(--buttonBorderRadius, 0)`). Circles appear only on 10px carousel dots (50%), about-us
contributor portraits (50%) and the 60px article byline avatar (30px). The mobile nav toggle
carries a 0 2px 2px 0 corner. The only gradient deployed is the yellow corner triangle behind the
lock glyph on members-only teasers.

## Components

### Buttons
- **Shape:** square (0).
- **Primary:** `#ffea00` on `#202020` text, Source Sans Pro 600 14px uppercase, padding 1em 2.5em (14px 35px). No hover change.
- **Base / Secondary:** base `.cmp-button` is `#ebebeb`, 48px tall; secondary inverts to `#202020` with `#ebebeb` text and is used for the 48px icon-only social buttons (wknd-icon-font glyphs).
- **Header search:** icon button; hover/focus fill `#ffea00`, focus-visible 2px `#202020` outline.

### Cards / Containers
- **Image-list card:** square photo, uppercase 600 18px title, one-line uppercase 14px `#696969` description with ellipsis; no background, border or shadow.
- **Featured teaser:** image (709px) beside a `#ebebeb` panel (427px) with "Featured Article" pretitle, Asar title, description and the primary button.
- **Hero teaser:** full-bleed photo with a white 180px content card pulled up over its bottom edge.
- **Members-only teaser:** list teaser with a yellow corner triangle and lock glyph; its "Read More" is not a link in the capture.
- **Pull quote:** `#ebebeb` panel, Asar 36px blockquote, 5pc yellow rule, underlined attribution.

### Inputs / Fields
- **AI search field:** 1px `#cccccc` border, square; an AI-summary toggle with a 16px radius (one page).

### Navigation
- **Header:** uppercase 14px Source Sans Pro; active section filled `#ffea00` (padding 0 17px); hover/focus also fill yellow. Language toggle shows the country flag + locale code (en-US / en-CA / per locale).
- **Mobile:** slide-in drawer (`#mobileNav`, transform .5s ease, inset shadow) opened by `#toggleNav`; links turn yellow on hover.
- **Footer:** links in `#ebebeb` on `#202020`, underline on hover.
- **Breadcrumb:** on all adventure and article pages; yellow chevron glyph (U+EA1C) separators.
- **Tabs:** uppercase 14px; active tab `#202020` with white text.

### Signature Components
- **Hero carousel** (home, us/en + ca/en): three full-bleed teaser slides, prev/next arrows (icon font), dot indicators.
- **Trip facts** (32 adventure pages): Activity, Adventure Type, Trip Length, Group Size, Difficulty, Price as a definition list.
- **Up-next list** (12 articles): sidebar links with a 5px `#ebebeb` left rule; hover fills yellow.

## Do's and Don'ts

### Do:
- **Do** keep `#ffea00` for actions, active states and the 84px title underline.
- **Do** keep photography full-bleed and square-cornered.
- **Do** keep Asar 400 for titles and Source Sans Pro for everything else.
- **Do** keep running text at 18px with the 45px (2.5) line-height.

### Don't:
- **Don't** add radius, gradients or shadows to content components — the system is flat and square.
- **Don't** use yellow for body text or large background fields.
- **Don't** treat the Arial on FAQ accordion buttons as a brand face; it is a browser default.
