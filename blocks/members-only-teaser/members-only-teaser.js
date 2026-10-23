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
 * Model: cards — ONE ROW PER TEASER, two cells: image | text
 *   image cell: <picture>/<img> (alt verbatim — empty on the source)
 *   text cell : <h2> title, <p> description, <p> action — "Read More" as plain
 *               text where the source has no link (/us/en), <p><a href>Read
 *               More</a></p> where it links (/ca/en); render exactly as authored.
 * Decode tier: reconstructive (repeat group). One teaser per row when the block
 * has several rows; a flattened single cell is segmented on its headings.
 * Nodes are classified by content, never by index: media → image; the first
 * heading → title; a link-only paragraph → action; otherwise, when two or more
 * text nodes follow the heading, the LAST one is the action label; everything
 * else (leftovers pass) → description. Authored nodes are MOVED (EW1); the
 * action moves as its <p> (EW3); no <button> hosts text (EW7); re-entrant (EW9).
 * Hook: every teaser is `div.item.members-teaser` — the build selector of the
 * unit-geometry row `members-only-teaser` in stardust/replica/units.json.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

// Cell-level collector (#62/#68/#104) — expands a media-led cell folded into one <p>.
function collectNodes(scope) {
  const out = [];
  scope.querySelectorAll(':scope > div').forEach((cell) => {
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
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // a single-paragraph cell is delivered as bare text: wrap the existing
      // text nodes, never copy text (EW1)
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
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

function toGroups(block) {
  const rows = [...block.children];
  if (rows.length > 1) return rows.map((row) => collectNodes(row));
  const groups = [];
  let group = [];
  collectNodes(rows[0] || block).forEach((n) => {
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
// undo decorateButtons() and its derived title (= the link text)
function unbutton(p) {
  p.classList.remove('button-wrapper');
  if (!p.classList.length) p.removeAttribute('class');
  p.querySelectorAll('a').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
    if (a.title === a.textContent) a.removeAttribute('title');
  });
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .item.members-teaser')) return; // re-entrant (EW9)
  const teasers = toGroups(block)
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
