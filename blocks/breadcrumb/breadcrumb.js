/**
 * breadcrumb — the WKND trail (source .cmp-breadcrumb, .cmp-breadcrumb--fixed):
 * uppercase 14px items separated by the yellow play3 glyph; the last item is the
 * current page (aria-current="page", not a link).
 *
 * Contract: stardust/eds-schema/us-en-adventures-climbing-new-zealand-html.json →
 * sections[0] "breadcrumb" (2 × LI unit: 1 cta + 1 text run).
 * Model (generic — programs and magazine articles): ONE ROW PER ITEM, one cell:
 *   ancestor item: <p><a href>Label</a></p> (or a bare link)
 *   current item : plain text / <p>Label</p> (the last row; no link)
 * A single flattened cell (several paragraphs, or one list) is read item by item.
 * Decode tier: reconstructive (repeat group). Authored nodes are MOVED (EW1)
 * into generated li wrappers; decorateButtons() is undone on trail links (a
 * breadcrumb link is navigation, not a CTA).
 */

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

// a trail link is not a CTA: undo decorateButtons() on it
function unbutton(node) {
  if (node.matches('p')) node.classList.remove('button-wrapper');
  if (!node.classList.length) node.removeAttribute('class');
  node.querySelectorAll('a').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
  });
}

// every authored item node, in order: list items' content, paragraphs, bare text
function collectItems(block) {
  const items = [];
  const takeCell = (cell) => {
    const kids = [...cell.children];
    if (!kids.length) {
      if (cell.textContent.trim()) items.push([...cell.childNodes]);
      return;
    }
    kids.forEach((k) => {
      if (k.matches('ul, ol')) {
        [...k.children].forEach((li) => items.push([...li.childNodes]));
      } else if (k.textContent.trim()) {
        items.push([k]);
      }
    });
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length) cells.forEach(takeCell);
    else if (row.textContent.trim()) items.push([row]);
  });
  return items;
}

export default async function decorate(block) {
  const items = collectItems(block);
  if (!items.length) return;

  const nav = el('nav', 'trail', { 'aria-label': 'Breadcrumb' });
  const list = el('ol', 'items');
  items.forEach((nodes, i) => {
    const li = el('li', 'item');
    nodes.forEach((n) => {
      if (n.nodeType === 1) unbutton(n);
      li.append(n);
    });
    if (i === items.length - 1) {
      li.classList.add('active');
      li.setAttribute('aria-current', 'page');
    }
    list.append(li);
  });
  nav.append(list);
  block.replaceChildren(nav);
}
