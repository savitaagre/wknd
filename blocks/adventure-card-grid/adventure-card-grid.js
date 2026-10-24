/**
 * adventure-card-grid — the wknd adventures listing's card grid (source
 * .cmp-image-list inside the active .cmp-tabs panel): 260px cards — 260×200
 * image, uppercase title link, one-line ellipsised description. Filtered
 * client-side by an adventure-category-tabs block in the same section.
 *
 * Contract: stardust/eds-schema/us-en-adventures-html.json → "adventure-card-grid"
 * (16 × LI unit, uniform: 1 cta + 1 img + description).
 * Model: ONE ROW PER CARD (document-first listing, no index), cells:
 *   image      <picture>/<img> (alt carried verbatim)
 *   text       <p><a href>Title</a></p> (the card link), <p> description
 *   categories (optional, LAST cell, no link / image) — the tab labels the card
 *              is filed under, comma-separated ("Cycling, Travel"); empty or
 *              absent = shown under the unfiltered tab only
 * Decode tier: reconstructive (repeat group). One card per row; a flattened
 * single cell is segmented on the card link / image boundary. Authored nodes
 * are MOVED (EW1): the title paragraph keeps its link (decorateButtons' button
 * classes and derived title are undone — a card link is not a CTA); the image
 * is wrapped in a generated, text-free anchor to the same href (the source's
 * image link).
 * @ew-exempt categories cell — filter keys, not rendered on the source (there
 *   they are tab-panel membership); kept in the card as a hidden node, never dropped.
 * Hooks: li.image-list__item and the panel's cmp-tabs__tabpanel--active are the
 * unit-geometry selectors (stardust/replica/units.json "adventure-card-grid").
 * Re-entrant (EW9): a decorated block is left as it is.
 */

const ACTIVE_PANEL = 'cmp-tabs__tabpanel--active';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

// Cell-level collector (#62/#68/#104) — expands a media-led cell folded into one <p>.
function collectNodes(cell) {
  let kids = [...cell.children];
  if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')) {
    kids = [...kids[0].childNodes].map((n) => {
      if (n.nodeType === 1) return n;
      // HARNESS-ONLY fallback (EW5): bare text beside an image → move the node into a <p>
      if (n.textContent.trim()) {
        const p = document.createElement('p');
        p.append(n);
        return p;
      }
      return null;
    }).filter(Boolean);
  }
  if (kids.length) return kids;
  if (cell.textContent.trim()) {
    // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    return [p];
  }
  return [];
}

const mediaOf = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));
const isTitle = (n) => {
  if (n.matches('a')) return true;
  const links = n.matches('p, h2, h3, h4, h5, h6') ? n.querySelectorAll('a') : [];
  return links.length === 1 && n.textContent.trim() === links[0].textContent.trim();
};

function newCard() {
  return {
    media: null, title: null, body: [], categories: [],
  };
}

function place(card, n) {
  const m = mediaOf(n);
  if (m && !card.media) card.media = m.closest('picture') || m;
  else if (isTitle(n) && !card.title) card.title = n;
  else if (n.textContent.trim() || m) card.body.push(n);
}

// the categories cell: the last cell of a row of three or more, without link or image
function isCategoryCell(cell, i, cells) {
  return cells.length > 2 && i === cells.length - 1 && !cell.querySelector('a, picture, img');
}

function toCards(block) {
  const rows = [...block.children];
  if (rows.length > 1) {
    return rows.map((row) => {
      const card = newCard();
      const cells = [...row.children];
      cells.forEach((cell, i) => {
        if (isCategoryCell(cell, i, cells)) card.categories.push(...collectNodes(cell));
        else collectNodes(cell).forEach((n) => place(card, n));
      });
      return card;
    }).filter((c) => c.media || c.title || c.body.length);
  }
  const cards = [];
  let card = newCard();
  const cells = rows[0] ? [...rows[0].children] : [];
  cells.flatMap((cell) => collectNodes(cell)).forEach((n) => {
    const opens = (mediaOf(n) && card.media) || (isTitle(n) && card.title);
    if (opens) {
      cards.push(card);
      card = newCard();
    }
    place(card, n);
  });
  cards.push(card);
  return cards.filter((c) => c.media || c.title || c.body.length);
}

// a card link is not a CTA: undo decorateButtons() on it
function unbutton(node) {
  if (node.matches('p')) node.classList.remove('button-wrapper');
  if (!node.classList.length) node.removeAttribute('class');
  const a = node.matches('a') ? node : node.querySelector('a');
  if (!a) return null;
  a.classList.remove('button', 'primary', 'secondary', 'accent');
  if (!a.classList.length) a.removeAttribute('class');
  return a;
}

const categoryKeys = (nodes) => nodes
  .flatMap((n) => n.textContent.split(','))
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export default async function decorate(block) {
  if (block.querySelector(':scope > .panel')) return;
  const cards = toCards(block);
  const panel = el('div', `panel ${ACTIVE_PANEL}`);
  const list = el('ul', 'items');

  cards.forEach((card) => {
    const li = el('li', 'item image-list__item');
    const article = el('article');
    const link = card.title ? unbutton(card.title) : null;
    const href = link ? link.getAttribute('href') : null;

    if (card.media) {
      const image = el('div', 'image');
      image.append(card.media);
      if (href) {
        const imageLink = el('a', 'image-link');
        imageLink.href = href;
        imageLink.append(image);
        article.append(imageLink);
      } else {
        article.append(image);
      }
    }
    if (card.title) {
      const title = el('div', 'title');
      title.append(card.title);
      article.append(title);
    }
    if (card.body.length) {
      const description = el('div', 'description');
      description.append(...card.body);
      article.append(description);
    }
    if (card.categories.length) {
      li.dataset.categories = categoryKeys(card.categories).join('|');
      const categories = el('div', 'categories');
      categories.hidden = true;
      categories.append(...card.categories);
      article.append(categories);
    }
    li.append(article);
    list.append(li);
  });

  panel.append(list);
  block.replaceChildren(panel);

  // let a category-tabs block in this section link the panel and apply its filter
  const section = block.closest('.section');
  if (section) section.dispatchEvent(new CustomEvent('adventure-card-grid:decorated'));
}
