import { getChromePath, getLocale, markCurrentNav } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * WKND header — template-slotted (#95) from the authored /nav document.
 *
 * Document contract (one section per role, in order):
 *   0 account  — greeting <p> (hidden, as on wknd.site), Sign In <p><a>, Sign Out <p><a> (hidden)
 *   1 language — toggle <p><a>en-US</a></p> + country <ul> (li: title, nested <ul> of locale links)
 *   2 brand    — <p><a><picture></a></p> (logo)
 *   3 nav      — <ul><li>Home (hidden)<ul>section links</ul></li></ul>
 *   4 tools    — search <p><a title="Search">Search</a></p> (icon-only; label kept for a11y)
 *
 * Coming-soon locale homes author section 3 as the level-0 item only (no nested <ul>).
 *
 * Document per page (scripts.js getChromePath): `nav` page metadata, else the locale root's
 * own `nav` document (/ca/en/nav, /us/es/nav …), else the site default /nav (en-US) — also
 * the fallback when a locale document is missing.
 *
 * Authored nodes are MOVED into the prototype's chrome template (EW1); wrappers carry the
 * classes (EW2). Behaviour is the live site's, nothing more: body.scrolly at scrollTop > 15,
 * the language menu (showMenu / open, left = toggle.position().left - 240, any outside click
 * closes) and the <=1024px slide-in panel (body.navPanel-visible). Derived from the page, as
 * wknd.site's language navigation does: current-page markers on the nav (aria-current /
 * is-active), the toggle flag from the authored locale label, the active locale link pointing
 * at the current page, and same-language locale links (en-US / en-CA) upgraded to the current
 * page's counterpart when it exists (checked once, on the first menu open).
 *
 * @ew-exempt <ul> mobile-nav — presentational clone of the header nav list (EW4, instrumentation
 * stripped); the header nav list is the editable original
 */

const DESKTOP = window.matchMedia('(min-width: 1025px)');
const SCROLLY_AT = 15; // live clientlib-site: body.scrolly while scrollTop > 15
const MENU_OFFSET = 240; // live clientlib-site: left = toggle.position().left - 240

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children.filter(Boolean));
  return el;
}

/** The authored elements of one /nav section, in order. */
function sectionNodes(fragment, index) {
  const section = fragment.querySelectorAll(':scope > .section')[index];
  if (!section) return [];
  return [...section.querySelectorAll(':scope > .default-content-wrapper > *')];
}

/**
 * decorateButtons() (bare-links-too) buttonized the chrome's solo-link paragraphs while the
 * fragment was decorated; chrome links are not CTAs — undo it (classes + the derived title).
 */
function unbutton(root) {
  root.querySelectorAll('p.button-wrapper').forEach((p) => {
    p.classList.remove('button-wrapper');
    if (!p.classList.length) p.removeAttribute('class');
  });
  root.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
    if (a.title === a.textContent) a.removeAttribute('title');
  });
}

/** Delivered lists wrap a nested item's own link in a <p> (#98): unwrap it. */
function unwrapListParagraphs(list) {
  list.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
}

/** The media pipeline offers a webp rendition of SVG logos; keep the vector. */
function keepVector(root) {
  root.querySelectorAll('picture').forEach((picture) => {
    const img = picture.querySelector('img');
    if (img && /\.svg(\?|$)/.test(img.getAttribute('src') || '')) {
      picture.querySelectorAll('source:not([type="image/svg+xml"])').forEach((s) => s.remove());
    }
  });
}

/** EW4: a presentational clone must not carry the workspace's editor indices or ids. */
function stripInstrumentation(root) {
  [root, ...root.querySelectorAll('*')].forEach((node) => {
    [...node.attributes]
      .filter((attr) => /^data-(prose|image|block)-index$/.test(attr.name) || attr.name === 'id')
      .forEach((attr) => node.removeAttribute(attr.name));
  });
}

const flagUrl = (country) => `url("${window.hlx?.codeBasePath || ''}/icons/flags/${country}.svg")`;
const countryOf = (locale) => (/^[a-z]{2}-([a-z]{2})$/i.exec(locale.trim()) || [])[1]?.toUpperCase();

function buildAccount(nodes) {
  const greeting = nodes.find((n) => !n.querySelector('a'));
  const [signIn, signOut, ...rest] = nodes.filter((n) => n.querySelector('a'));
  return div(
    'utility-bar-sign-in',
    greeting && div('sign-in-greeting', greeting),
    signIn && div('sign-in-link', signIn),
    signOut && div('sign-out-link', signOut),
    ...rest,
  );
}

/**
 * wknd.site language copies: a locale link of the CURRENT page's language (en-US <-> en-CA)
 * points at the same page in that locale when it exists, else stays the locale home.
 */
function linkCounterparts(list) {
  const here = getLocale();
  if (!here) return;
  const suffix = window.location.pathname.slice(here.root.length).replace(/\.html$/, '');
  if (!suffix || suffix === '/') return;
  list.querySelectorAll('a[href]').forEach(async (a) => {
    const url = new URL(a.href);
    const locale = getLocale(url.pathname);
    if (url.origin !== window.location.origin || !locale) return;
    if (locale.language !== here.language || locale.root === here.root) return;
    const counterpart = `${locale.root}${suffix}`;
    try {
      const resp = await fetch(`${counterpart}.plain.html`, { method: 'HEAD' });
      if (resp.ok) a.setAttribute('href', counterpart);
    } catch {
      // network failure: keep the locale home
    }
  });
}

function buildLanguage(nodes) {
  const toggleP = nodes.find((n) => n.tagName === 'P' && n.querySelector('a'));
  const list = nodes.find((n) => n.tagName === 'UL');
  const wrap = div('utility-bar-lang');
  if (!toggleP) return wrap;

  const toggle = toggleP.querySelector('a');
  const current = toggle.textContent.trim();
  const toggleWrap = div('lang-toggle', toggleP);
  const cc = countryOf(current);
  if (cc) toggleWrap.style.setProperty('--lang-flag', flagUrl(cc));
  toggle.id = 'langNavToggleHeader';
  toggle.setAttribute('aria-label', `Toggle Language ${current}`);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'lang-menu');
  wrap.append(toggleWrap);

  if (!list) return wrap;
  const menu = document.createElement('nav');
  menu.className = 'lang-menu';
  menu.id = 'lang-menu';
  [...list.children].forEach((country) => {
    // country title: an authored <p> (delivered) or a bare text node — wrap, never copy
    const title = div('lang-menu-title');
    [...country.childNodes]
      .filter((n) => n.nodeName !== 'UL' && (n.nodeType === 1 || n.textContent.trim()))
      .forEach((n) => title.append(n));
    country.prepend(title);
    const links = [...country.querySelectorAll('a')];
    const code = links.map((a) => countryOf(a.textContent)).find(Boolean);
    if (code) country.style.setProperty('--flag', flagUrl(code));
    links.forEach((a) => {
      const locale = a.textContent.trim();
      if (countryOf(locale)) {
        a.hreflang = locale;
        a.lang = locale;
        a.rel = 'alternate';
      }
      if (locale === current) {
        a.setAttribute('aria-current', 'true');
        // live: the active locale's link is the current page itself
        if (getLocale()?.root === getLocale(new URL(a.href).pathname)?.root) {
          a.setAttribute('href', window.location.pathname);
        }
      }
    });
  });
  menu.append(list);
  wrap.append(menu);

  let counterpartsChecked = false;
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (!counterpartsChecked) {
      counterpartsChecked = true;
      linkCounterparts(list);
    }
    // jQuery .position(): the fractional box relative to the offsetParent
    const parent = toggle.offsetParent || document.body;
    const left = toggle.getBoundingClientRect().left - parent.getBoundingClientRect().left;
    menu.style.left = `${left - MENU_OFFSET}px`;
    menu.classList.toggle('showMenu');
    toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', toggle.classList.contains('open') ? 'true' : 'false');
  });
  window.addEventListener('click', (e) => {
    if (e.target !== toggle && toggle.classList.contains('open')) {
      menu.classList.remove('showMenu');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  return wrap;
}

function buildSearch(nodes) {
  const wrap = div('header-search', ...nodes);
  const link = wrap.querySelector('a');
  if (link) {
    const label = link.textContent.trim();
    link.setAttribute('aria-label', label);
    link.title = link.title || label;
    // icon-only control: the authored label moves into a hidden span (EW1: moved, not copied)
    const span = document.createElement('span');
    span.className = 'header-search-label';
    span.append(...link.childNodes);
    // the glyph sits in an empty inline span, as on the source (.cmp-button__icon--search)
    const icon = document.createElement('span');
    icon.className = 'header-search-icon';
    icon.setAttribute('aria-hidden', 'true');
    link.append(icon, span);
  }
  return wrap;
}

function buildMobile(navList) {
  const toggle = div('mobile-toggle');
  toggle.id = 'toggleNav';
  const link = document.createElement('a');
  link.className = 'mobile-toggle-link';
  link.href = '#mobileNav';
  link.setAttribute('aria-label', 'Open hidden mobile navigation');
  link.setAttribute('aria-expanded', 'false');
  const icon = document.createElement('span');
  icon.className = 'mobile-toggle-icon';
  icon.setAttribute('aria-hidden', 'true');
  link.append(icon);
  toggle.append(link);

  const panel = document.createElement('nav');
  panel.className = 'mobile-nav';
  panel.id = 'mobileNav';
  if (navList) {
    const clone = navList.cloneNode(true);
    stripInstrumentation(clone);
    panel.append(clone);
  }

  const setOpen = (open) => {
    document.body.classList.toggle('navPanel-visible', open);
    link.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setOpen(!document.body.classList.contains('navPanel-visible'));
  });
  DESKTOP.addEventListener('change', () => setOpen(false));
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && document.body.classList.contains('navPanel-visible')) setOpen(false);
  });
  return [toggle, panel];
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navPath = getChromePath('nav');
  let fragment = await loadFragment(navPath);
  if (!fragment && navPath !== '/nav') fragment = await loadFragment('/nav');
  if (!fragment) return;
  unbutton(fragment);
  keepVector(fragment);

  const navList = sectionNodes(fragment, 3).find((n) => n.tagName === 'UL');
  if (navList) {
    unwrapListParagraphs(navList);
    markCurrentNav(navList); // before the mobile clone, which carries the markers as on live
  }
  const nav = document.createElement('nav');
  nav.className = 'header-nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.append(...sectionNodes(fragment, 3));

  const site = div(
    'site-header',
    div('utility-bar', div(
      'utility-bar-inner',
      buildAccount(sectionNodes(fragment, 0)),
      buildLanguage(sectionNodes(fragment, 1)),
    )),
    div('header-bar', div(
      'header-bar-inner',
      div('header-bar-logo', ...sectionNodes(fragment, 2)),
      nav,
      buildSearch(sectionNodes(fragment, 4)),
    )),
  );

  block.replaceChildren(site, ...buildMobile(navList));

  // header scroll morph (live: body.scrolly while scrollTop > 15)
  const updateScrolly = () => {
    document.body.classList.toggle('scrolly', window.scrollY > SCROLLY_AT);
  };
  updateScrolly();
  document.addEventListener('scroll', updateScrolly, { passive: true });
}
