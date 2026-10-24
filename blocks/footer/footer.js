import { getChromePath, markCurrentNav } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * WKND footer — template-slotted (#95) from the authored /footer document.
 *
 * Document contract (one section per role, in order):
 *   0 brand  — <p><a><picture></a></p> (light logo)
 *   1 nav    — <ul><li>Home (hidden)<ul>section links</ul></li></ul>
 *   2 social — <h4>Follow Us</h4> + <ul> of icon-only links (title = accessible name)
 *   3 legal  — the copyright / disclaimer paragraphs (/ca/en: the Canadian note first)
 * Coming-soon locale homes author section 1 as the level-0 item only (no nested <ul>).
 *
 * Document per page (scripts.js getChromePath): `footer` page metadata, else the locale
 * root's own `footer` document (/ca/en/footer …), else /footer (en-US; also the fallback).
 * Current-page markers (aria-current / is-active) are derived from the page, as on live.
 *
 * Authored nodes are MOVED into the prototype's footer template (EW1); wrappers carry the
 * classes (EW2). Anything authored beyond the contract lands in the legal slot (leftovers).
 */

function div(className, ...children) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...children.filter(Boolean));
  return el;
}

function sectionNodes(fragment, index) {
  const section = fragment.querySelectorAll(':scope > .section')[index];
  if (!section) return [];
  return [...section.querySelectorAll(':scope > .default-content-wrapper > *')];
}

/** decorateButtons() (bare-links-too) also ran on the fragment; footer links are not CTAs. */
function unbutton(root) {
  root.querySelectorAll('p.button-wrapper').forEach((p) => {
    p.classList.remove('button-wrapper');
    if (!p.classList.length) p.removeAttribute('class');
  });
  root.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
  });
}

function keepVector(root) {
  root.querySelectorAll('picture').forEach((picture) => {
    const img = picture.querySelector('img');
    if (img && /\.svg(\?|$)/.test(img.getAttribute('src') || '')) {
      picture.querySelectorAll('source:not([type="image/svg+xml"])').forEach((s) => s.remove());
    }
  });
}

/** Icon-only social buttons: the authored title becomes the accessible name, the label hides. */
function decorateSocial(list) {
  list.querySelectorAll('a').forEach((a) => {
    a.setAttribute('aria-label', a.title || a.textContent.trim());
    a.removeAttribute('title');
    const span = document.createElement('span');
    span.className = 'social-btn-text';
    span.append(...a.childNodes); // moved, not copied (EW1)
    // the glyph sits in an empty inline span, as on the source (.cmp-button__icon)
    const network = ['facebook', 'twitter', 'instagram'].find((n) => a.href.toLowerCase().includes(n));
    const icon = document.createElement('span');
    icon.className = network ? `social-icon social-icon-${network}` : 'social-icon';
    icon.setAttribute('aria-hidden', 'true');
    a.append(icon, span);
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerPath = getChromePath('footer');
  let fragment = await loadFragment(footerPath);
  if (!fragment && footerPath !== '/footer') fragment = await loadFragment('/footer');
  if (!fragment) return;
  unbutton(fragment);
  keepVector(fragment);

  const navNodes = sectionNodes(fragment, 1);
  navNodes.forEach((n) => {
    n.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
    if (n.tagName === 'UL') markCurrentNav(n);
  });
  const nav = document.createElement('nav');
  nav.className = 'site-footer-nav';
  nav.setAttribute('aria-label', 'Footer navigation');
  nav.append(...navNodes);

  const socialNodes = sectionNodes(fragment, 2);
  const follow = socialNodes.filter((n) => /^H[1-6]$/.test(n.tagName));
  const social = socialNodes.filter((n) => !follow.includes(n));
  social.forEach(decorateSocial);

  const legal = [3, 4, 5, 6].flatMap((i) => sectionNodes(fragment, i));

  block.replaceChildren(div(
    'site-footer-inner',
    div(
      'site-footer-row',
      div('site-footer-logo', ...sectionNodes(fragment, 0)),
      nav,
      div('site-footer-follow', ...follow),
      div('site-footer-social', ...social),
    ),
    div('site-footer-separator'),
    div('site-footer-text', ...legal),
  ));
}
