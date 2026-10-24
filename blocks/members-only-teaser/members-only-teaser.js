/**
 * members-only-teaser — the wknd magazine "Members Only" locked teasers
 * (source .teaser.cmp-teaser--list.cmp-teaser--secure in body.anonymous — the
 * captured signed-out state, dynamic-features row #11 static-snapshot): a
 * yellow lock badge (wknd-icon-font U+E98F), the faded (opacity .65) teaser,
 * an uppercase title, a muted description and a grey "Read More" box; the
 * image sits BELOW the text and the box (the floated content leaves no room
 * beside it for the 100 %-wide inline image — the origin's own layout).
 *
 * Contract: stardust/eds-schema/us-en-magazine-html.json → sections[2]
 *   "members-only-teaser" (repeat DIV.members-teaser ×2: 1 heading + 1 img +
 *   description + action label).
 * Model: cards — ONE ROW PER TEASER; cells by content, in reading order:
 *   image       : <picture>/<img> (alt verbatim — empty on the source)
 *   title       : <h2>
 *   description : a RICH-TEXT description (the source's <p>) is authored in the
 *                 title cell, below the heading — it keeps its paragraph margin;
 *                 a PLAIN-TEXT description (the source's bare text) is a cell of
 *                 its own — its slot gets the `plain` wrapper class (no margin)
 *   action      : its own cell — "Read More" as plain text where the source has
 *                 no link (/us/en), a link where it links (/ca/en); rendered
 *                 exactly as authored. (A <p> action in the title cell works too.)
 * Decode tier: reconstructive (repeat group). One teaser per row when the block
 * has several rows; a flattened single cell is segmented on its headings.
 * Nodes are classified by content, never by index: media → image; the first
 * heading → title; a link-only paragraph → action; otherwise, when two or more
 * text nodes follow the heading, the LAST one is the action label; everything
 * else (leftovers pass) → description. Authored nodes are MOVED (EW1) — every
 * <p> survives (the editor attaches to it); the action moves as its <p> (EW3)
 * and is styled through `.action p` (EW2); no <button> hosts text (EW7);
 * re-entrant (EW9).
 * Hook: every teaser is `div.item.members-teaser` — the build selector of the
 * unit-geometry row `members-only-teaser` in stardust/replica/units.json.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';
const BLOCK_LEVEL = 'p, h1, h2, h3, h4, h5, h6, ul, ol, div, blockquote, pre, table, hr';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

// Cell-level collector (#62/#68/#104). A one-paragraph cell is delivered as bare
// inline content and aem.js wrapTextNodes() gives it a lone <p>: that <p> is
// recorded in `lone` (a cell of its own). A cell with block-level children
// yields those children (a media-led <p> gives up its picture).
function collectNodes(scope, lone) {
  const out = [];
  scope.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.some((k) => k.matches(BLOCK_LEVEL))) {
      const only = kids.length === 1 && kids[0].matches('p')
        && cell.textContent.trim() === kids[0].textContent.trim();
      kids.forEach((k) => {
        const pic = k.matches('p') && k.querySelector(':scope > picture, :scope > img');
        if (pic && k.textContent.trim()) out.push(pic);
        if (only && k.textContent.trim()) lone.add(k);
        out.push(k);
      });
    } else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5; wrapTextNodes does it at runtime): move the
      // cell's inline nodes into a <p>, never copy text
      const p = el('p');
      p.append(...cell.childNodes);
      cell.append(p);
      lone.add(p);
      out.push(p);
    } else if (cell.querySelector('picture, img')) {
      out.push(cell.querySelector('picture') || cell.querySelector('img'));
    }
  });
  return out;
}

const mediaOf = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));
const isLinkOnly = (n) => {
  if (n.matches('a')) return true;
  const links = n.matches('p') ? n.querySelectorAll('a') : [];
  return links.length === 1 && n.textContent.trim() === links[0].textContent.trim();
};

function toGroups(block, lone) {
  const rows = [...block.children];
  if (rows.length > 1) return rows.map((row) => collectNodes(row, lone));
  const groups = [];
  let group = [];
  collectNodes(rows[0] || block, lone).forEach((n) => {
    if (n.matches(HEADING) && group.some((g) => g.matches(HEADING))) {
      groups.push(group);
      group = [];
    }
    group.push(n);
  });
  groups.push(group);
  return groups;
}

function classify(nodes) {
  const teaser = {
    media: null, title: null, description: [], action: null,
  };
  const text = [];
  const after = []; // text nodes that follow the title (all of them when there is none)
  nodes.forEach((n) => {
    const m = mediaOf(n);
    if (m && !teaser.media && !n.textContent.trim()) teaser.media = m.closest('picture') || m;
    else if (n.matches(HEADING) && !teaser.title) {
      teaser.title = n;
      after.length = 0;
    } else if (n.textContent.trim() || m) {
      text.push(n);
      after.push(n);
    }
  });
  const linked = after.filter(isLinkOnly);
  if (linked.length) [teaser.action] = linked.slice(-1);
  else if (after.length > 1) [teaser.action] = after.slice(-1);
  teaser.description = text.filter((n) => n !== teaser.action);
  return teaser;
}

// the action link is the source .cmp-teaser__action-link, not a site CTA:
// undo decorateButtons()
function unbutton(p) {
  p.classList.remove('button-wrapper');
  if (!p.classList.length) p.removeAttribute('class');
  p.querySelectorAll('a').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
  });
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .item.members-teaser')) return; // re-entrant (EW9)
  const lone = new WeakSet();
  const teasers = toGroups(block, lone)
    .map(classify)
    .filter((t) => t.media || t.title || t.description.length || t.action);

  const items = teasers.map((t) => {
    const item = el('div', 'item members-teaser');
    const inner = el('div', 'inner');
    const content = el('div', 'content');
    if (t.title) {
      const title = el('div', 'title');
      title.append(t.title);
      content.append(title);
    }
    if (t.description.length) {
      const description = el('div', 'description');
      if (t.description.every((n) => lone.has(n))) description.classList.add('plain');
      description.append(...t.description);
      content.append(description);
    }
    if (t.action) {
      const action = el('div', 'action');
      if (t.action.matches('p')) unbutton(t.action);
      action.append(t.action);
      content.append(action);
    }
    inner.append(content);
    if (t.media) {
      const image = el('div', 'image');
      image.append(t.media);
      inner.append(image);
    }
    item.append(inner);
    return item;
  });

  block.replaceChildren(...items);
}
