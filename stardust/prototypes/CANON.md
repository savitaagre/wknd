# WKND prototype canon (shared layers for archetype prototypes)

Read this before authoring any new archetype prototype under `stardust/prototypes/`.
Procedure: replica `recreation-procedure.md` § Cumulative archetype prototypes — each new
prototype imports the gated shared layers and iterates only on its NEW modules.

Origin: split verbatim (selectors, values, relative rule order unchanged) out of the gated
landing prototype `us-en-html` (https://wknd.site/us/en.html). Proof the split is
render-neutral — gate round `canon1` (`stardust/replica/gates/us-en-html-{1440,360}/`):
1440 = 0.20 % Δh 0, 360 = 2.08 % Δh −1, identical to the approved values.

**canon2** (canon owner, after four archetypes were gated): the queued requests in
`stardust/replica/canon-requests.md` were back-ported — h1 / h5 sizes, the current-page nav
state, separator modifiers, glyph classes plus / minus / play3, and the shared content modules
hero-teaser (base), image-list, breadcrumb, share-bar — each MOVED unchanged from the archetype
file that authored it, the duplicates and compensations removed from the archetype files.
Re-gate `canon2` (pixel rounds; evidence `diff-canon2.png` in each `stardust/replica/gates/<slug>-<w>/`),
identical to the approved values on all four: us-en-html 1440 0.20 % Δh 0 · 360 2.08 % Δh −1;
us-en-adventures-climbing-new-zealand-html 0.03 % · 0.40 %; us-en-adventures-html 0.19 % ·
1.02 %; us-en-faqs-html 0.03 % · 0.03 % (Δh 0).

**canon3** (canon owner, seven archetypes gated): `.featured-teaser*` (home + magazine),
`.separator--space-medium`, `.social-btn--secondary` (about + magazine article — identical values),
the `.text-small p` utility (about + FAQ) MOVED unchanged, duplicates removed from the archetype
files; the language-toggle flag became markup-driven (§ Locale chrome) with the US render
unchanged. Kept per archetype: `.members-teaser*` (one template), the article breadcrumb
`--grid` variant. Re-gate `canon3` (pixel rounds; `diff-canon3.png`), identical to the approved
values on all seven: us-en-html 0.20 % Δh 0 · 2.08 % Δh −1; NZ 0.03 % · 0.40 %; adventures
0.19 % · 1.02 %; faqs 0.03 % · 0.03 %; guide-la-skateparks 0.09 % · 0.15 % (Δh −1 @360);
magazine 0.23 % · 0.16 %; about-us 0.10 % · 0.18 % (every other Δh 0).

## Layers

Load order is fixed: **canon first, then the archetype file** (CSS and JS).

| File | Owns |
|---|---|
| `canon.css` | `@font-face` (Asar 400, Source Sans Pro 300/400/600 + italics, wknd-icon-font); `:root` tokens; reset/base (`box-sizing`, `body`, `a`, `p`, `img`, lists); headings h1–h6 (§ Headings); icon font base `.icon` + glyph classes; header (`.site-header`, `.utility-bar`, sign-in, `.lang-toggle` (+ flag classes `--us|ca|ch|de|fr|es|it`) / `.lang-menu`, `.header-bar`, logo, `.header-nav` incl. the current-page state, `.header-search`, `.scrolly` morph); mobile nav (`.mobile-toggle`, `.mobile-nav`, `body.navPanel-visible`); page shell (`.page-root`, `.page-main`, `.fixed-container`, `.col`); buttons (`.btn-teaser`, `.btn-primary`); section titles (`.section-title`, `--underline`); `.separator` + `--space-small` / `--hidden` / `--space-medium`; text utility `.text-small`; footer (`.site-footer*` incl. the current-page state, `.social-btn` + `--secondary`); the shared parts of the source breakpoints (≥1025, 1025–1200, ≥1201, ≤1024, ≤475); the shared content modules (§ Shared modules: `.hero-teaser*` base, `.image-list*`, `.breadcrumb*`, `.share-bar*`, `.featured-teaser*`) with their ≥1165 / ≤767 rules. |
| `canon.js` | Header scroll morph (`body.scrolly` while `scrollY > 15`, lifted from clientlib-site JS); language menu state machine (`.lang-toggle` → `.lang-menu.showMenu` / `.open`, positioned at toggle left − 240, outside click closes); mobile nav (`.mobile-toggle__link` toggles `body.navPanel-visible`). The sign-in control has no behaviour (static link; greeting/sign-out hidden, as on live logged-out). |
| `us-en-html.css` | Home-only modules: `.hero-carousel*` (+ `@keyframes fadeIn`), its ≤767 rule, and the R-01 h1 guard (§ Headings). |
| `us-en-html.js` | Home-only: hero carousel prev/next/indicators (no autoplay — never fired on live). |
| `us-en-adventures-html.css` | Listing: `.page-title`, `.adventure-tabs*`, and the standalone-hero divergence of `.hero-teaser` (§ Shared modules). |
| `us-en-faqs-html.css` | FAQ: `.faq-layout*`, `.faq-lead-image`, `.faq-accordion*` (state-driven plus/minus glyph), `.help-contact*`, `.faq-intro`. |
| `us-en-adventures-climbing-new-zealand-html.css` | Program: `.trip-gallery*`, `.trip-layout` / `.trip-grid*`, `.trip-title`, `.trip-facts*`, `.content-tabs*`, `.trip-content*` (incl. the play3 rich-text bullet). |
| `us-en-magazine-html.css` | Magazine listing: `.members-teaser*` (members-only locked teaser, lock badge pseudo `\e98f`; per-archetype until a second template uses it). |
| `us-en-magazine-guide-la-skateparks-html.css` | Article: `.article-grid*`, `.article-layout*`, `.article-image`, the `.breadcrumb-bar--grid` variant (§ Shared modules), `.article-body__title`, `.pull-quote*`, `.author-byline*` / `.author-social`, `.download-card*`, `.up-next*`. |
| `us-en-about-us-html.css` | About: `.contributor-grid`, `.contributor*` (cards; buttons are canon `.social-btn--secondary`). |

Each new archetype adds `<slug>-proposed.html`, `<slug>.css`, `<slug>.js` (JS only if the
page has observed behaviour). Slug = the inventory page slug, e.g. `us-en-adventures-html`.
The gate is `stardust/scripts/replica/gate.sh <slug> <live-url> http://localhost:8791/<slug>-proposed.html <w> <iter>`
(run it via `bash …` through `run-bg.mjs`; the copy is not executable).

### The rule

**Never edit `canon.css` / `canon.js` from an archetype.** If the shared layer is wrong for
your page (header/footer drift on this template, a base rule that does not hold), keep the
compensation in `<slug>.css` and append a request to `stardust/replica/canon-requests.md`:
`- [<archetype slug>] <selector/rule> — <change> — evidence: <gate dir / measure line>`.
Canon changes are back-ported centrally and every approved archetype is re-gated.
Reusing a module another archetype authored: if it is in § Shared modules, just use the canon
classes; otherwise do NOT link the other archetype's CSS — copy the needed rules into
`<slug>.css` and file a request to promote them into canon.

Canon chrome is a snapshot of the HOME template: open every new archetype's gate with the
chrome crop / `chrome-parity.mjs` against the NEW page's live chrome first.

## Headings

Canon sizes: h1 40px (source `.h1,h1 { font-size: var(--fontSizeH1,40px) }`), h2 36px, h3 24px,
h4 16px, h5 14px (source `--fontSizeH5`); h6 has no size (UA). h1–h3 Asar 400, margins 27 / 13.5;
h4–h6 Source Sans 600 uppercase; line-height 1.5 on all.

**Home h1 (register R-01).** The delivered home has an `<h1>` (hero slide 1 "WKND Adventures")
that must render exactly like the source `h2` (Asar 36px/54px, same margins). The canon h1 40px
must never reach it: keep the class `hero-teaser__title` on that h1 (its 36px/54px rule beats the
element rule), and `us-en-html.css` carries the guard `.hero-carousel h1 { font-size: 36px }`.
A delivered block for the landing hero must carry the same guard. (The gated prototype keeps the
source `h2`; R-01 is applied at delivery.) The same applies to R-02 (coming-soon locale homes):
a promoted `h2` → `h1` keeps the h2 size via its own class.

## Shared modules (canon-owned since canon2; canon3 additions marked)

| module | classes | source | notes |
|---|---|---|---|
| hero-teaser | `.hero-teaser`, `__image`, `__content`, `__title`, `__description`, `__actions`, `--imagebottom` | `.cmp-teaser` (in `.cmp-carousel`, `--hero`) | Canon = the home carousel-slide values (image auto height <1165; ≥1165 640px image + 180px white overlay at −180). **Divergent, per archetype:** the standalone `.cmp-teaser--hero` (listing / coming-soon) adds `<1165 .hero-teaser__image { height/max-height 400px }` + `img { height: 100% }` and `≥1165 .hero-teaser__content { height: 180px }` — in `us-en-adventures-html.css`; copy those (not the base) for another standalone hero. |
| image-list | `.image-list`, `__item`, `__image`, `__title`, `__description` (+ `-link`s) | `.cmp-image-list` | 4-up 260px cards, 200px images; ≤767 space-between. Home + listing (unit family `adventure-card-grid`). |
| underlined-section-title | `.section-title.section-title--underline` on `h1` or `h2` (h3 `--small` on home) | `.cmp-title--underline .cmp-title__text:after` | h2 inside `.col`; margins 27 / 13.5; 84px × 2px `#ffea00` rule, padding-top 8. Holds at h1 unchanged (h 70 = 60 + 8 + 2). Listing / about / faqs / magazine / programs titles. |
| breadcrumb | `.breadcrumb-bar` > `.breadcrumb` > `.breadcrumb__list` > `.breadcrumb__item` (last: `--active` + `aria-current="page"`) > `.breadcrumb__link` | `.cmp-breadcrumb`, `.cmp-breadcrumb--fixed` | max-width 1164 content-box + 14px padding; play3 separator in `#ffea00`; ≤767 list 12px. Programs, magazine articles. **Divergent, per archetype (canon3):** magazine articles use the plain `.cmp-breadcrumb` as a 12-col grid column inside the fixed container — `.breadcrumb-bar.breadcrumb-bar--grid` (float left, clear both, width 100 %, max-width none, margin 0, border-box) + `.breadcrumb-bar--grid .breadcrumb__list { margin-top: 1em; padding-top: 12px }`, ≤1024 `margin-top: 0` — in `us-en-magazine-guide-la-skateparks-html.css`; copy those (not the base) for the other 11 article pages. |
| share-bar | `.share-bar` > `h5.share-bar__title` + `.share-bar__buttons` (`__fb`, `__pin`) | `.title h5` + `.sharing` | Title = canon h5; buttons height 0 (FB / Pinterest SDKs never hydrate on live). Programs, magazine articles. |
| separator | `.separator` (`hr` inside) + `--space-small`, `--space-medium`, `--hidden` | `.cmp-separator`, `--space-small`, `--space-medium`, `--hidden` | 64px margins; `--space-small` 1em; `--space-medium` 2em (canon3, magazine); `--hidden` no rule. |
| featured-teaser | `.featured-teaser` > `__content` (`p.__pretitle`, `h2.__title`, `__description`, `__actions` > `a.btn-teaser`) + `__image` > `__frame` > `img` | `.cmp-teaser--featured` | canon3. Row-reverse flex: image flex 2, grey content flex 1, padding 63/36/36; ≤767 column, content margin-top −18. Home + magazine listing; the CTA label is content ("Full Article" home, "Read More" magazine). |
| social-btn secondary | `.social-btn.social-btn--secondary` | `.cmp-button--secondary .cmp-button` | canon3. Dark 48×48 icon-only button (`#202020` / `--text-inverse`) on the footer `.social-btn` base. About contributor cards, magazine article author byline. |
| text-small | `.text-small` on the text container (its `p`s get 14px) | `.cmp-text--font-small p` | canon3. Size only — canon `p` keeps line-height 2.5 (35px), justify, margin-bottom 13.5. About intros, FAQ help-contact (which adds its own `text-align: left`). |

## Current-page nav state (markup-driven, canon2)

Source styles `.cmp-navigation__item--level-1.cmp-navigation__item--active` (header: yellow
background; footer: `#f7f7f7` + underline). Prototypes mirror the live markup; no `href`
selectors in archetype CSS:

- **On the item's own page** (live: `aria-current="page"` on the link): put
  `aria-current="page"` on that link in `.header-nav ul`, `.mobile-nav` and `.site-footer__nav ul`
  (adventures → Adventures, faqs → FAQs). On the home, live marks the hidden Home link: put it
  on both `.nav-home` links and the `.mobile-nav__home` link (unstyled — `.nav-home` is hidden
  and sits outside the `ul`).
- **On a deeper page of that section** (live: `--active` on the `<li>`, no `aria-current`):
  put `class="is-active"` on the level-1 `<li>` (header, mobile nav, footer) — e.g. programs →
  Adventures.
- Canon: `.header-nav ul a[aria-current="page"], .header-nav li.is-active > a` → yellow;
  `.site-footer__nav ul a[aria-current="page"], .site-footer__nav li.is-active > a` → light +
  underline. The mobile nav has no current-state style on live.

## Locale chrome (markup-driven, canon3)

Lifted from the captured DOM (`stardust/current/pages/{us-en,ca-en,us-es,ca-fr,ch-*,de-de,es-es,fr-fr,it-it}-html.html`)
and the source CSS (live sets the toggle flag inline from the active countrycode; flag files =
`.cmp-languagenavigation__item--countrycode-<CC>`). No CSS changes per locale — only the markup
below. Everything not listed stays exactly as § Header / § Footer markup (incl. the search link
`/us/en/ai-powered-search.html` on every locale, and the full 7-country language menu).

**Toggle flag + label (every page):** `<a class="lang-toggle lang-toggle--<cc>" … aria-label="Toggle Language <locale>"><locale></a>`
— `<cc>` = the page's country (lower-case: `us`, `ca`, `ch`, `de`, `fr`, `es`, `it`), `<locale>` =
`en-US`, `en-CA`, `fr-CA`, `es-US`, `de-CH`, … Canon `.lang-toggle--<cc>` sets
`background-image: url(assets/flags/<CC>.svg)`; position / size / repeat stay on `.lang-toggle`. A
toggle without a `--<cc>` class shows no flag. In `.lang-menu`, move `lang-menu__country--active`
to the page's country `<li>` and `lang-menu__locale--active` to the page's locale `<li>`.
Set `<html lang="<locale>">`.

**A /ca/en page (CA, full nav)** changes vs the US markup:
- toggle `lang-toggle lang-toggle--ca`, label + aria-label `en-CA`; `lang-menu__country--active` on
  `.lang-menu__country--ca`, `lang-menu__locale--active` on the `/ca/en.html` locale (and off the US ones).
- every chrome `href` under `/us/en` → `/ca/en` (header + footer logo, `.nav-home` ×2,
  `.mobile-nav__home`, the four nav links in header, mobile nav and footer); current-page markers
  as § Current-page nav state. Search href unchanged (`/us/en/ai-powered-search.html`).
- footer: ONE extra paragraph, first in `.site-footer__text`, before the copyright:
  `<p>Canadian specific footer. This footer serves as an example of <a title="localization" href="https://experienceleague.adobe.com/docs/experience-manager-core-components/using/get-started/localization.html" target="_blank" rel="noopener noreferrer">localization features with Core Components&nbsp;</a></p>`
  (live: its own `.cmp-text--font-xsmall` column; styled by the canon `.site-footer__text p` / `a`
  rules, no new CSS). Live measure (CA vs US home): footer +28.5 px @1440 (one 15px line + 13.5
  margin), +43.5 px @360 (two lines); header boxes identical; toggle box identical, only
  `background-image` CA.svg vs US.svg.

**A coming-soon locale home (/us/es, /ca/fr, /ch/{de,fr,it}, /de/de, /fr/fr, /es/es, /it/it)**
changes vs the US markup:
- toggle `lang-toggle--<cc>` + its locale label (us-es → `--us` / `es-US`; ca-fr → `--ca` / `fr-CA`;
  ch-* → `--ch`; de-de → `--de`; fr-fr → `--fr`; es-es → `--es`; it-it → `--it`); menu active markers moved.
- logo `href` (header + footer) → the locale home (`/us/es.html` …).
- **nav has no level-1 items**: live renders only the hidden level-0 item, labelled in the locale
  (`Español`, `Français`, `Deutsch`, `Italiano`) with `aria-current="page"`. Markup: header
  `<nav class="header-nav"><a class="nav-home" href="/us/es.html" aria-current="page" hidden>Español</a></nav>`
  (no `<ul>`); footer `.site-footer__nav` the same (nav-home only, no `<ul>`); mobile nav
  `<li class="mobile-nav__home"><a href="/us/es.html" aria-current="page">Español</a></li>` with no
  nested `<ul>` (the mobile Home item is the only visible nav item).
- footer otherwise unchanged (English copyright / disclaimer / Adobe Stock lines, Follow Us, social
  buttons); no Canadian note, also not on /ca/fr.
- the search link stays `/us/en/ai-powered-search.html`. Main content is the archetype's job (R-02 h1).

## Page skeleton

```html
<head>
  …
  <link rel="icon" type="image/png" href="assets/favicon.png">
  <link rel="stylesheet" href="canon.css">
  <link rel="stylesheet" href="<slug>.css">
</head>
<body>
  <header class="site-header">…</header>          <!-- fixed; copy verbatim below -->
  <div class="mobile-toggle" id="toggleNav">…</div> <!-- siblings of the header, OUTSIDE .page-root -->
  <nav class="mobile-nav" id="mobileNav">…</nav>
  <div class="page-root">                           <!-- shell: max-width 1680, padding-top 200 / 130 (≤1024) clears the fixed header; slides with the mobile nav -->
    <main class="page-main">
      … page modules …
    </main>
    <footer class="site-footer">…</footer>          <!-- INSIDE .page-root, after main -->
  </div>
  <script src="canon.js" defer></script>
  <script src="<slug>.js" defer></script>
</body>
```

### Content root (`--main` scoping)

- Build side: `<main class="page-main">` inside `<div class="page-root">`. Live side: the
  WKND page has `main.container.responsivegrid`. Both match the gate's default `--main main`,
  so no `--main` flag is needed; if you must be explicit use `--main main` (never
  `.page-main`, which does not exist on live).
- Header root = `header` (`.site-header`), footer root = `footer` (`.site-footer`) — compared
  beside main by default. Keep `.mobile-toggle` / `.mobile-nav` outside `<header>` as above.
- Content containers inside main: full-bleed modules sit directly in `main`; capped content
  goes in `<div class="fixed-container">` (max-width `--shell` 1164px, centred at ≥1025) with
  one `<div class="col">` (14px gutters, flow-root) per grid row/component.

## Header markup (copy verbatim)

Structure = every element/class/id/aria attribute. **Content** (may differ per locale/page;
change only these): sign-in labels (`Welcome`, `Sign In`, `Sign Out`); the locale label text
`en-US` and its `aria-label` (`Toggle Language en-US`); the toggle flag class
`lang-toggle--us` (one of `--us|ca|ch|de|fr|es|it`, § Locale chrome); `lang-menu__country--active` / `lang-menu__locale--active` markers on the current
locale; country titles, locale links/labels; logo `href`; nav labels + hrefs (Magazine,
Adventures, FAQs, About Us) — keep `.header-nav ul` and `.mobile-nav` in sync; the
current-page markers (`aria-current="page"` / `li.is-active`, § Current-page nav state); search
`href`/`aria-label`/`title`. The hidden `.nav-home` link is structure (mirrors live).

```html
<body>
  <header class="site-header">
    <div class="utility-bar">
      <div class="utility-bar__inner">
        <div class="utility-bar__sign-in">
          <span class="sign-in-greeting">Welcome</span>
          <a class="sign-in-link" href="#sign-in">Sign In</a>
          <a class="sign-out-link" href="#sign-out">Sign Out</a>
        </div>
        <div class="utility-bar__lang">
          <a class="lang-toggle lang-toggle--us" id="langNavToggleHeader" href="#langNavToggle" aria-label="Toggle Language en-US" aria-expanded="false" aria-controls="lang-menu">en-US</a>
          <nav class="lang-menu" id="lang-menu">
            <ul class="lang-menu__countries">
              <li class="lang-menu__country lang-menu__country--us lang-menu__country--active">
                <span class="lang-menu__title">United States</span>
                <ul class="lang-menu__locales">
                  <li class="lang-menu__locale lang-menu__locale--active"><a href="/us/en.html" hreflang="en-US" lang="en-US" title="WKND Adventures and Travel">en-US</a></li>
                  <li class="lang-menu__locale"><a href="/us/es.html" hreflang="es-US" lang="es-US" title="Español">es-US</a></li>
                </ul>
              </li>
              <li class="lang-menu__country lang-menu__country--ca">
                <span class="lang-menu__title">Canada</span>
                <ul class="lang-menu__locales">
                  <li class="lang-menu__locale"><a href="/ca/en.html" hreflang="en-CA" lang="en-CA" title="WKND Adventures and Travel">en-CA</a></li>
                  <li class="lang-menu__locale"><a href="/ca/fr.html" hreflang="fr-CA" lang="fr-CA" title="Français">fr-CA</a></li>
                </ul>
              </li>
              <li class="lang-menu__country lang-menu__country--ch">
                <span class="lang-menu__title">Switzerland</span>
                <ul class="lang-menu__locales">
                  <li class="lang-menu__locale"><a href="/ch/de.html" hreflang="de-CH" lang="de-CH" title="Deutsch">de-CH</a></li>
                  <li class="lang-menu__locale"><a href="/ch/fr.html" hreflang="fr-CH" lang="fr-CH" title="Français">fr-CH</a></li>
                  <li class="lang-menu__locale"><a href="/ch/it.html" hreflang="it-CH" lang="it-CH" title="Italiano">it-CH</a></li>
                </ul>
              </li>
              <li class="lang-menu__country lang-menu__country--de">
                <span class="lang-menu__title">Germany</span>
                <ul class="lang-menu__locales">
                  <li class="lang-menu__locale"><a href="/de/de.html" hreflang="de-DE" lang="de-DE" title="Deutsch">de-DE</a></li>
                </ul>
              </li>
              <li class="lang-menu__country lang-menu__country--fr">
                <span class="lang-menu__title">France</span>
                <ul class="lang-menu__locales">
                  <li class="lang-menu__locale"><a href="/fr/fr.html" hreflang="fr-FR" lang="fr-FR" title="Français">fr-FR</a></li>
                </ul>
              </li>
              <li class="lang-menu__country lang-menu__country--es">
                <span class="lang-menu__title">Spain</span>
                <ul class="lang-menu__locales">
                  <li class="lang-menu__locale"><a href="/es/es.html" hreflang="es-ES" lang="es-ES" title="Español">es-ES</a></li>
                </ul>
              </li>
              <li class="lang-menu__country lang-menu__country--it">
                <span class="lang-menu__title">Italy</span>
                <ul class="lang-menu__locales">
                  <li class="lang-menu__locale"><a href="/it/it.html" hreflang="it-IT" lang="it-IT" title="Italiano">it-IT</a></li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div class="header-bar">
      <div class="header-bar__inner">
        <div class="header-bar__logo">
          <a href="/us/en.html"><img src="assets/media/wknd-logo-dk.svg" alt="WKND Logo" width="300" height="112"></a>
        </div>
        <nav class="header-nav">
          <a class="nav-home" href="/us/en.html" hidden>Home</a>
          <ul>
            <li><a href="/us/en/magazine.html">Magazine</a></li>
            <li><a href="/us/en/adventures.html">Adventures</a></li>
            <li><a href="/us/en/faqs.html">FAQs</a></li>
            <li><a href="/us/en/about-us.html">About Us</a></li>
          </ul>
        </nav>
        <a class="header-search" href="/us/en/ai-powered-search.html" aria-label="Search" title="Search"><span class="icon icon--search" aria-hidden="true"></span></a>
      </div>
    </div>
  </header>

  <div class="mobile-toggle" id="toggleNav"><a class="mobile-toggle__link" href="#mobileNav" aria-label="Open hidden mobile navigation" aria-expanded="false"><span class="icon icon--menu" aria-hidden="true"></span></a></div>
  <nav class="mobile-nav" id="mobileNav">
    <ul>
      <li class="mobile-nav__home"><a href="/us/en.html">Home</a>
        <ul>
          <li><a href="/us/en/magazine.html">Magazine</a></li>
          <li><a href="/us/en/adventures.html">Adventures</a></li>
          <li><a href="/us/en/faqs.html">FAQs</a></li>
          <li><a href="/us/en/about-us.html">About Us</a></li>
        </ul>
      </li>
    </ul>
```

## Footer markup (copy verbatim)

**Content**: logo `href`; nav labels + hrefs (same four as the header) and the current-page
markers (§ Current-page nav state); `Follow Us`; social
hrefs / aria-labels / text (`#facebookwknd`, `#twitterWKND`, `#instagramwknd`); the three
`.site-footer__text` paragraphs (copyright, disclaimer with its links, Adobe Stock line).
Everything else is structure.

```html

    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__row">
          <div class="site-footer__logo"><a href="/us/en.html"><img src="assets/media/wknd-logo-light.svg" alt="WKND Logo" width="300" height="112"></a></div>
          <nav class="site-footer__nav" aria-label="Footer navigation">
            <a class="nav-home" href="/us/en.html" hidden>Home</a>
            <ul>
              <li><a href="/us/en/magazine.html">Magazine</a></li>
              <li><a href="/us/en/adventures.html">Adventures</a></li>
              <li><a href="/us/en/faqs.html">FAQs</a></li>
              <li><a href="/us/en/about-us.html">About Us</a></li>
            </ul>
          </nav>
          <div class="site-footer__follow"><h4>Follow Us</h4></div>
          <div class="site-footer__social">
            <a class="social-btn" href="#facebookwknd" aria-label="Facebook WKND Button"><span class="icon icon--facebook" aria-hidden="true"></span><span class="social-btn__text">Facebook</span></a>
            <a class="social-btn" href="#twitterWKND" aria-label="Twitter WKND Button"><span class="icon icon--twitter" aria-hidden="true"></span><span class="social-btn__text">Twitter</span></a>
            <a class="social-btn" href="#instagramwknd" aria-label="Instagram WKND"><span class="icon icon--instagram" aria-hidden="true"></span><span class="social-btn__text">Instagram</span></a>
          </div>
        </div>
        <div class="site-footer__separator"></div>
        <div class="site-footer__text">
          <p>Ⓒ 2019,&nbsp;&nbsp;WKND Site.</p>
          <p>WKND is a fictitious adventure and travel website created by Adobe to demonstrate how anyone can use Adobe Experience Manager to build a beautiful, feature-rich website over a single weekend. This site is built entirely with Adobe Experience Manager&nbsp;<a href="https://docs.adobe.com/content/help/en/experience-manager-core-components/using/introduction.html">Core Components</a>&nbsp;and&nbsp;<a href="https://github.com/adobe/aem-project-archetype">Archetype</a>&nbsp;that are available as open source code to the public. The entire&nbsp;<a href="https://github.com/adobe/aem-guides-wknd/">site source code</a>&nbsp;is available as open source as well and is accompanied with a&nbsp;<a href="https://docs.adobe.com/content/help/en/experience-manager-learn/getting-started-wknd-tutorial-develop/overview.html">detailed tutorial</a>&nbsp;on how to recreate the site.</p>
          <p>Many of the beautiful images in the WKND site are available for purchase via&nbsp;<a href="https://stock.adobe.com/">Adobe Stock</a>.</p>
        </div>
      </div>
```

## Assets (`stardust/prototypes/assets/`, referenced relatively)

- `favicon.png`
- `fonts/`: `asar-400.woff2`, `source-sans-pro-{300,400,600}.woff2`,
  `source-sans-pro-{300,400,600}-italic.woff2`, `wknd-icon-font.ttf` (all declared in canon.css).
- `flags/`: `US.svg`, `CA.svg`, `CH.svg`, `DE.svg`, `FR.svg`, `ES.svg`, `IT.svg` (language menu +
  toggle `.lang-toggle--<cc>`; byte-identical to `stardust/current/assets/media/flags/`).
- `media/`: logos `wknd-logo-dk.svg` (header), `wknd-logo-light.svg` (footer); home media
  `adobestock-{122615840,140634652,151584995,156407519,164735399,184591344,185234795,216674449,231698835}.jpeg`,
  `article-01-picture-01.png`, `beach-walking.jpeg`, `skitouring5sjoeberg.jpeg`, `surfer-wave-02.jpeg`.
- Site-wide harvested media (123 files): `stardust/current/assets/media/`, index
  `stardust/current/assets/media/_index.tsv` (TSV: live source path → local file, e.g.
  `/us/en/_jcr_content/root/container/carousel/item_….coreimg.jpeg/…/adobestock-216674449.jpeg`
  → `stardust/current/assets/media/adobestock-216674449-cbf8bf8d.jpeg`). Copy what your page
  needs into `stardust/prototypes/assets/media/` (strip the hash suffix, as the home did) and
  reference it as `assets/media/<name>`; do not overwrite an existing file with different bytes.

## Icon font (`wknd-icon-font`, `--font-icon`)

Usage: `<span class="icon icon--<name>" aria-hidden="true"></span>`. `.icon::before` sets the
font; canon defines these glyph classes:

| class | glyph |
|---|---|
| `.icon--search` | `\e913` |
| `.icon--facebook` | `\e902` |
| `.icon--twitter` | `\e901` |
| `.icon--instagram` | `\e903` |
| `.icon--menu` | `\e916` |
| `.icon--plus` | `\e911` (accordion collapsed) |
| `.icon--minus` | `\e910` (accordion expanded) |
| `.icon--play3` | `\ea1c` (breadcrumb separator / rich-text bullet) |

Pseudo-element uses of a glyph (breadcrumb separator, FAQ accordion state swap, rich-text
bullet) keep their own `content:` rule in the module that owns them.

Home-only (us-en-html.css): carousel arrows `.hero-carousel__action--previous` `\e90f`,
`--next` `\e90e`. Other glyphs in the font (source `.wkndicon-*`, clientlib-site CSS) — define
the class in `<slug>.css` as `.icon--<name>::before { content: "\eXXX"; }` and file a canon
request: google `e900`, social-share `e904`, map `e905`, alert `e906`, download `e907`,
info `e908`, email `e909`, comment `e90a`, share `e90b`, user `e90c`, home `e90d`,
right-arrow `e90e`, left-arrow `e90f`, location `e912`, delete `e914`, cart `e915`,
lock `e98f` (used as pseudo content by the magazine `.members-teaser::before`, per-archetype),
unlocked `e990`.

## Tokens (canon `:root`)

`--text #202020`, `--text-inverse #ebebeb`, `--text-muted dimgray`, `--link #0045ff`,
`--brand-yellow #ffea00`, `--surface-grey #ebebeb`, `--surface-light #f7f7f7`, `--body-bg #fff`,
`--font-sans`, `--font-serif` (Asar), `--font-icon`, `--fs-small 14px`, `--fs-xsmall 12px`,
`--button-size 48px`, `--utility-height 25px`, `--shell 1164px`, `--gutter 14px`.
Source breakpoints: 767/768, 1024/1025, 1164/1165, 1200/1201 — reuse them verbatim.
