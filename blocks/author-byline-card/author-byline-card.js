/**
 * author-byline-card — the wknd magazine article author card (source contributor byline
 * experience fragment: .separator + .cmp-byline + .cmp-buildingblock--btn-list): a grey
 * rule, a round 60×60 avatar beside the author name (h2) and the occupations line, and a
 * row of dark icon-only social buttons (Facebook / Twitter / Instagram, authored order).
 *
 * Contract: stardust/eds-schema/us-en-magazine-guide-la-skateparks-html.json →
 *   section "author-byline-card" (heading + eyebrow + 3 ctas + 1 img; 2 editable texts).
 * Model: one row, three cells (any split is accepted — nodes are classified by content):
 *   image cell : <picture>/<img> (alt verbatim — empty on the source)
 *   text cell  : <h2> author name, <p> occupations
 *   links cell : a <ul> of <li><a href title="accessible name">Facebook</a></li>
 *                (one link per <p> is accepted too)
 * Decode tier: template-slotted (rule | byline 9/12 | social 3/12, the source grid
 * columns). Authored nodes are MOVED (EW1) into generated wrappers that carry the layout
 * (EW2); a node that fits no slot stays in the byline (leftovers pass); re-entrant (EW9).
 * Social links: the authored title becomes the accessible name (aria-label, as on the
 * source; DA has no aria-label field); the network glyph sits in a generated, text-free
 * inline span (source .cmp-button__icon); the network is read from the link LABEL first
 * (several source hrefs are placeholders such as `#`).
 * @ew-exempt social link labels ("Facebook", …) are visually hidden — icon-only buttons as
 * on the source (.cmp-button__text); they stay the authored text nodes, moved into a span.
 */

const NETWORKS = ['facebook', 'twitter', 'instagram'];

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const mediaOf = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));
const hasLinks = (n) => n.matches('a') || !!n.querySelector('a[href]');

// every authored element of every cell, in order; bare cell text is MOVED into a <p>
function collect(block) {
  const out = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) out.push(...kids);
      else if (cell.textContent.trim()) {
        const p = el('p');
        p.append(...cell.childNodes);
        out.push(p);
      }
    });
  });
  return out;
}

function networkOf(a) {
  const probes = [a.textContent, a.getAttribute('aria-label'), a.title, a.getAttribute('href')];
  for (let i = 0; i < probes.length; i += 1) {
    const v = (probes[i] || '').toLowerCase();
    const hit = NETWORKS.find((nw) => v.includes(nw));
    if (hit) return hit;
  }
  return '';
}

// icon-only social button: undo decorateButtons(), name it, add the glyph span
function decorateSocialLink(a) {
  const p = a.closest('p');
  if (p) p.classList.remove('button-wrapper');
  if (p && !p.classList.length) p.removeAttribute('class');
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  if (!a.classList.length) a.removeAttribute('class');
  if (a.querySelector(':scope > .social-icon')) return; // EW9: already decorated
  const name = a.getAttribute('aria-label') || a.title || a.textContent.trim();
  if (name) a.setAttribute('aria-label', name);
  a.removeAttribute('title');
  const network = networkOf(a);
  const text = el('span', 'social-text');
  text.append(...a.childNodes); // moved, not copied (EW1)
  const icon = el('span', network ? `social-icon social-icon-${network}` : 'social-icon');
  icon.setAttribute('aria-hidden', 'true');
  a.append(icon, text);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .byline')) return; // EW9: already decorated

  const slots = {
    media: null, name: null, occupations: null, social: [], rest: [],
  };
  collect(block).forEach((n) => {
    const m = mediaOf(n);
    if (m && !n.textContent.trim()) {
      if (!slots.media) slots.media = m.closest('picture') || m;
      else slots.rest.push(n);
    } else if (hasLinks(n)) {
      slots.social.push(n);
    } else if (isHeading(n) && !slots.name) {
      slots.name = n;
    } else if (n.textContent.trim() && slots.name && !slots.occupations && !isHeading(n)) {
      slots.occupations = n;
    } else if (n.textContent.trim() || m) {
      slots.rest.push(n);
    }
  });

  const rule = el('div', 'rule'); // decorative (source .separator hr), text-free

  const byline = el('div', 'byline');
  if (slots.media) {
    const image = el('div', 'image');
    image.append(slots.media);
    byline.append(image);
  }
  if (slots.name) {
    const name = el('div', 'name');
    name.append(slots.name);
    byline.append(name);
  }
  if (slots.occupations) {
    const occupations = el('div', 'occupations');
    occupations.append(slots.occupations);
    byline.append(occupations);
  }
  if (slots.rest.length) {
    const body = el('div', 'body');
    body.append(...slots.rest);
    byline.append(body);
  }

  const children = [rule, byline];
  if (slots.social.length) {
    const social = el('div', 'social');
    social.append(...slots.social);
    social.querySelectorAll('a[href]').forEach(decorateSocialLink);
    children.push(social);
  }
  block.replaceChildren(...children);
}
