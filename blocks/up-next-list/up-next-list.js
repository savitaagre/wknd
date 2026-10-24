/**
 * up-next-list — the wknd article right-rail "up next" list (source .cmp-list--upnext):
 * one linked tile per article, the uppercase title over the publish date, a 5px grey left
 * border; hover turns the tile yellow with a dark border.
 *
 * Contract: stardust/eds-schema/us-en-magazine-guide-la-skateparks-html.json →
 *   section "up-next-list" (4 × LI unit: 1 cta + 2 text runs). Unit-geometry build
 *   selector (stardust/replica/units.json article-up-next): `.up-next__item`.
 * Model: ONE ROW PER ARTICLE, cells (or one cell with both paragraphs):
 *   title : <p><a href="/…/magazine/<article>">Article title</a></p>
 *   date  : <p>Wednesday, 30 Sep 2020</p>
 * Decode tier: reconstructive (repeat group): items are segmented on the title link;
 * every other text node of the row is its date line. The whole tile is the link (source
 * a.cmp-list__item-link): the href is read from the authored anchor, which is then
 * unwrapped (EW6) — its text nodes stay in the authored <p>, MOVED (EW1) into the
 * generated title / date wrappers (EW2). Re-entrant (EW9).
 * Article template (interim, with the section layout in up-next-list.css): an image
 * caption — a paragraph whose only content is one <em>, right after an image paragraph of
 * an `article-body` section — is marked `.image-caption` (class only; no node is moved).
 */

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

// the authored element children of a row's cells; bare cell text is MOVED into a <p>
function collect(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    if (cell.children.length) out.push(...cell.children);
    else if (cell.textContent.trim()) {
      const p = el('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

// undo decorateButtons() on the authored title paragraph (it is a list tile, not a CTA)
function unbutton(p) {
  p.classList.remove('button-wrapper');
  if (!p.classList.length) p.removeAttribute('class');
}

function toItems(block) {
  const items = [];
  let item = null;
  [...block.children].forEach((row) => {
    collect(row).forEach((n) => {
      const a = n.matches('a[href]') ? n : n.querySelector('a[href]');
      if (a) {
        item = { a, title: n, dates: [] };
        items.push(item);
      } else if (n.textContent.trim()) {
        if (item) item.dates.push(n);
        else {
          item = { a: null, title: n, dates: [] };
          items.push(item);
        }
      }
    });
    item = null; // a new row always opens a new item
  });
  return items;
}

// a caption paragraph: exactly one <em> child and no other text (whitespace aside); an
// <em><strong> line is body copy (the guide's bold-italic street addresses after a photo)
function isCaption(p) {
  const nodes = [...p.childNodes].filter((n) => n.nodeType !== 3 || n.textContent.trim());
  return nodes.length === 1 && nodes[0].nodeName === 'EM'
    && !nodes[0].querySelector('strong, b, img, picture');
}

function markCaptions(main) {
  main.querySelectorAll('.section.article-body .default-content-wrapper > p').forEach((p) => {
    const prev = p.previousElementSibling;
    if (prev && prev.matches('p') && prev.querySelector('img') && isCaption(p)) {
      p.classList.add('image-caption');
    }
  });
}

export default function decorate(block) {
  const main = block.closest('main');
  if (main) markCaptions(main);
  if (block.querySelector(':scope > ul.items')) return; // EW9: already decorated

  const list = el('ul', 'items');
  toItems(block).forEach(({ a, title, dates }) => {
    const li = el('li', 'item up-next__item');
    const link = el(a ? 'a' : 'div', 'link');
    if (a) {
      link.href = a.getAttribute('href');
      if (title !== a) {
        unbutton(title);
        a.replaceWith(...a.childNodes); // EW6: unwrap the inner anchor
      }
    }
    const titleBox = el('div', 'title');
    if (title === a) {
      // a bare link (no paragraph): its text nodes move into the title box
      titleBox.append(...a.childNodes);
      a.remove();
    } else {
      titleBox.append(title);
    }
    link.append(titleBox);
    if (dates.length) {
      const date = el('div', 'date');
      date.append(...dates);
      // the source separates title and date with whitespace (the tile's accessible name)
      link.append(' ', date);
    }
    li.append(link);
    list.append(li);
  });
  block.replaceChildren(list);
}
