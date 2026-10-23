/**
 * hero-teaser — full-bleed image with an overlapping white text card at
 * >=1165px (wknd "Climbing New Zealand" teaser, image anchored to its bottom).
 *
 * Contract: stardust/eds-schema/us-en-html.json → sections[3] "hero-teaser"
 * (1 heading + 1 body + 1 cta + 1 img).
 * Model: hero — one row, two cells: image | text
 *   image cell: <picture>/<img> (alt + title carried verbatim)
 *   text cell : <h2> title, <p> description, <p><a> CTA (decorateButtons → a.button)
 * Decode tier: template-slotted (node-slotting). The prototype's DOM is a
 * template of EMPTY slots (.content > .title / .description / .actions,
 * .media); authored nodes are MOVED in by role (EW1), CTAs as their <p> (EW3).
 * Anything unclassified lands in .description (leftovers pass).
 * Every slot is optional (the listing hero has no CTA, the coming-soon hero
 * only a title); empty slots are not rendered.
 * Variants (CSS only, the content model is the same):
 *   (none)       home "Next Adventures" teaser — image anchored to its bottom
 *   standalone   source .cmp-teaser--hero outside a carousel (adventures
 *                listing, coming-soon homes) — centred image, 400px media box
 *                below 1165px, 180px content band above
 *   Contract: stardust/eds-schema/us-en-adventures-html.json → "hero-teaser"
 *   (1 heading + 1 body + 1 img).
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

// A CTA title derived by decorateButtons() (= its text) is not on the source
// and is dropped. (Image titles are restored once in decorateMain.)
function dropDerivedTitles(root) {
  root.querySelectorAll('a[title]').forEach((a) => {
    if (a.title === a.textContent) a.removeAttribute('title');
  });
}

const isCta = (n) => {
  if (n.matches('a')) return true;
  const links = n.matches('p') ? n.querySelectorAll('a') : [];
  return links.length === 1 && n.textContent.trim() === links[0].textContent.trim();
};

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const content = el('div', 'content');
  const title = el('div', 'title');
  const description = el('div', 'description');
  const actions = el('div', 'actions');
  const media = el('div', 'media');

  nodes.forEach((n) => {
    const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
    if (pic && !media.childElementCount) {
      media.append(pic.closest('picture') || pic);
    } else if (n.matches(HEADING) && !title.childElementCount) {
      title.append(n);
    } else if (isCta(n)) {
      actions.append(n);
    } else if (n.textContent.trim() || n.querySelector('picture, img')) {
      description.append(n);
    }
  });

  [title, description, actions].forEach((slot) => {
    if (slot.childElementCount) content.append(slot);
  });
  block.replaceChildren(content, media);
  dropDerivedTitles(block);
}
