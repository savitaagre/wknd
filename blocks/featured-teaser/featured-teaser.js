/**
 * featured-teaser — the wknd "Featured Article" band: grey text column (1/3)
 * beside a 2/3 image column (row-reverse); stacked below 768px.
 *
 * Contract: stardust/eds-schema/us-en-html.json → sections[1] "featured-teaser"
 * (eyebrow-like body + heading + body + cta + 1 img).
 * Model: columns — one row, two cells: image | text
 *   image cell: <picture>/<img> (alt + title carried verbatim)
 *   text cell : <p> pretitle ("Featured Article"), <h2> title,
 *               <p> description, <p><a> CTA (decorateButtons → a.button)
 * Decode tier: template-slotted (node-slotting). Template of EMPTY slots
 * (.content > .pretitle / .title / .description / .actions, .image > .frame);
 * authored nodes MOVED in by role (EW1): link-free text BEFORE the heading is
 * the pretitle, after it the description; CTAs move as their <p> (EW3).
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function el(tag, className) {
  const n = document.createElement(tag);
  n.className = className;
  return n;
}

// Cell-level collector (#62/#68/#104) — expands a media-led cell folded into one <p>.
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
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
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

const isCta = (n) => {
  if (n.matches('a')) return true;
  const links = n.matches('p') ? n.querySelectorAll('a') : [];
  return links.length === 1 && n.textContent.trim() === links[0].textContent.trim();
};

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const content = el('div', 'content');
  const pretitle = el('div', 'pretitle');
  const title = el('div', 'title');
  const description = el('div', 'description');
  const actions = el('div', 'actions');
  const image = el('div', 'image');
  const frame = el('div', 'frame');
  image.append(frame);

  nodes.forEach((n) => {
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (pic && !frame.childElementCount) {
      frame.append(pic.closest('picture') || pic);
    } else if (n.matches(HEADING) && !title.childElementCount) {
      title.append(n);
    } else if (isCta(n)) {
      actions.append(n);
    } else if (n.textContent.trim() || n.querySelector('picture, img')) {
      (title.childElementCount ? description : pretitle).append(n);
    }
  });

  [pretitle, title, description, actions].forEach((slot) => {
    if (slot.childElementCount) content.append(slot);
  });
  block.replaceChildren(content, image);
}
