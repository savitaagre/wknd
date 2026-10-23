/**
 * contributor-card — wknd About Us person grid ("Our Contributors" / "WKND Guides"):
 * per person a round 164×164 avatar, the name (h3), the role line (h5) and a row of
 * dark icon-only social buttons (Facebook / Twitter / Instagram, in authored order).
 *
 * Contract: stardust/eds-schema/us-en-about-us-html.json → sections[0] (4 cards),
 *   sections[1] (3 cards); unit 2 headings + 3 ctas + 1 img. Unit-geometry build
 *   selector (stardust/replica/units.json contributor-card): `section.contributor`.
 * Model: ONE ROW PER PERSON, two cells: image | text
 *   image cell: <picture>/<img> (alt verbatim — empty on the source)
 *   text cell : <h3> name, <h5> role, then the social links — a <ul> of
 *               <li><a href title="accessible name">Facebook</a></li>
 *               (one link per <p> is accepted too)
 * Decode tier: reconstructive (repeat group). Nodes are classified by content, never by
 * cell index; a flattened single row is segmented on the avatar / name boundary; a node
 * that fits no role is kept in the card (leftovers pass). Authored nodes are MOVED (EW1);
 * generated wrappers carry the layout classes (EW2); re-entrant (EW9).
 * Social links: the authored title becomes the accessible name (aria-label, as on the
 * source; DA has no aria-label field); the network glyph sits in a generated, text-free
 * inline span (source .cmp-button__icon); the network is read from the link LABEL, never
 * the href (several source hrefs are placeholders such as `#`).
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

// cell-level collector: the element children of every cell, in order; a cell holding only
// bare text gets its text nodes MOVED into a <p> (harness-only fallback, never a copy)
function collectNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) {
      // a media-led paragraph that also folds the text (one <p> per cell) is expanded
      if (kids.length === 1 && kids[0].matches('p') && kids[0].querySelector('picture, img')
        && kids[0].textContent.trim()) {
        out.push(...[...kids[0].children]);
      } else {
        out.push(...kids);
      }
    } else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

function newCard() {
  return {
    media: null, name: null, role: null, social: [], rest: [],
  };
}

function place(card, n) {
  const m = mediaOf(n);
  if (m && !n.textContent.trim()) {
    if (!card.media) card.media = m.closest('picture') || m;
    else card.rest.push(n);
  } else if (isHeading(n) && !hasLinks(n)) {
    if (!card.name) card.name = n;
    else if (!card.role) card.role = n;
    else card.rest.push(n);
  } else if (hasLinks(n)) {
    card.social.push(n);
  } else if (n.textContent.trim()) {
    if (card.name && !card.role && !card.social.length) card.role = n;
    else card.rest.push(n);
  }
}

// a new card opens on a second avatar or a second name heading (flattened authoring)
function opens(card, n) {
  const m = mediaOf(n);
  if (m && !n.textContent.trim()) return !!card.media && !!(card.name || card.social.length);
  if (isHeading(n) && !hasLinks(n)) return !!card.name && !!card.role;
  return false;
}

function toCards(block) {
  const rows = [...block.children];
  const empty = (c) => !c.media && !c.name && !c.role && !c.social.length && !c.rest.length;
  if (rows.length > 1) {
    return rows.map((row) => {
      const card = newCard();
      collectNodes(row).forEach((n) => place(card, n));
      return card;
    }).filter((c) => !empty(c));
  }
  const cards = [];
  let card = newCard();
  collectNodes(rows[0] || block).forEach((n) => {
    if (opens(card, n)) {
      cards.push(card);
      card = newCard();
    }
    place(card, n);
  });
  cards.push(card);
  return cards.filter((c) => !empty(c));
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
  if (a.querySelector(':scope > .contributor-social-icon')) return; // EW9: already decorated
  const name = a.getAttribute('aria-label') || a.title || a.textContent.trim();
  if (name) a.setAttribute('aria-label', name);
  a.removeAttribute('title');
  const network = networkOf(a);
  const text = el('span', 'contributor-social-text');
  text.append(...a.childNodes); // moved, not copied (EW1)
  const icon = el('span', network
    ? `contributor-social-icon contributor-social-icon-${network}`
    : 'contributor-social-icon');
  icon.setAttribute('aria-hidden', 'true');
  a.append(icon, text);
}

export default function decorate(block) {
  if (block.querySelector(':scope > section.contributor')) return; // EW9: re-entrant

  const cards = toCards(block);
  const sections = cards.map((card) => {
    const section = el('section', 'contributor');
    if (card.media) {
      const image = el('div', 'contributor-image');
      image.append(card.media);
      section.append(image);
    }
    if (card.name) {
      const name = el('div', 'contributor-name');
      name.append(card.name);
      section.append(name);
    }
    if (card.role) {
      const role = el('div', 'contributor-role');
      role.append(card.role);
      section.append(role);
    }
    if (card.rest.length) {
      const body = el('div', 'contributor-body');
      body.append(...card.rest);
      section.append(body);
    }
    if (card.social.length) {
      const social = el('div', 'contributor-social');
      social.append(...card.social);
      social.querySelectorAll('a[href]').forEach(decorateSocialLink);
      section.append(social);
    }
    return section;
  });

  block.replaceChildren(...sections);
}
