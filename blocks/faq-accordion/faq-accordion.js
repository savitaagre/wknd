/**
 * faq-accordion — the FAQ question list (source .cmp-accordion, 7 items on wknd.site/us/en/faqs):
 * uppercase question rows over a 2px #ebebeb rule with a plus glyph at the right; a row click
 * opens its OWN answer (fadeIn .5s) and swaps the glyph to minus. Several items may be open at
 * once; all start collapsed (dynamics row #5, motion/us-en-faqs-html.json).
 *
 * Contract: stardust/eds-schema/us-en-faqs-html.json → sections[0] "faq-accordion" (7 × item).
 * Model: ONE ROW PER QUESTION
 *   cell 1: the question — a heading (h3 on the source) or a paragraph
 *   cell 2: the answer — any default content (p, h2–h6, ul/ol, picture …)
 *   A one-cell row is split on its first heading: heading = question, the rest = answer.
 * Decode tier: reconstructive (repeat group: one item per row). Authored nodes are MOVED (EW1)
 * into generated wrappers (.item > .header > .title + button.toggle, .panel). EW7: the question
 * sits in the sibling div.title, the whole header row takes the click, and the generated
 * text-less button is the glyph-only toggle (name via aria-labelledby → the title wrapper).
 * The question's own nodes sit in a style-free span.label inside the authored heading, as
 * the source's text sits in span.cmp-accordion__title inside its h3 (no styling depends on it).
 * State classes mirror the live ones (cmp-accordion__button--expanded,
 * cmp-accordion__panel--expanded / --hidden).
 */

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

const isHeading = (n) => n.nodeType === 1 && /^H[1-6]$/.test(n.tagName);
const hasContent = (n) => n.nodeType === 1 || n.textContent.trim();

// cell → its authored nodes (elements; bare text moved into a <p> — HARNESS-ONLY, EW5)
function nodesOf(cell) {
  if (!cell) return [];
  return [...cell.childNodes].filter(hasContent).map((n) => {
    if (n.nodeType === 1) return n;
    const p = document.createElement('p');
    p.append(n);
    return p;
  });
}

// row → { question: Node[], answer: Node[] }
function splitRow(row) {
  const cells = [...row.children];
  if (cells.length > 1) {
    return { question: nodesOf(cells[0]), answer: cells.slice(1).flatMap(nodesOf) };
  }
  const nodes = nodesOf(cells[0]);
  const h = nodes.findIndex(isHeading);
  const at = h >= 0 ? h : 0;
  return {
    question: nodes.slice(at, at + 1),
    answer: [...nodes.slice(0, at), ...nodes.slice(at + 1)],
  };
}

export default function decorate(block) {
  const rows = [...block.children].filter((r) => r.children.length || r.textContent.trim());
  if (!rows.length) return;
  // id from the block's document position (re-entrant, EW9: no module state)
  const index = [...document.querySelectorAll('.faq-accordion')].indexOf(block);
  const id = `faq-accordion-${Math.max(index, 0) + 1}`;
  const list = el('div', 'items');

  rows.forEach((row, i) => {
    const { question, answer } = splitRow(row);
    const n = i + 1;
    const item = el('div', 'item faq-accordion__item');
    const header = el('div', 'header');
    const title = el('div', 'title', { id: `${id}-item-${n}-title` });
    question.forEach((q) => {
      // the source keeps the question text in an inline span inside its h3
      // (h3 > button > span.cmp-accordion__title): the authored element stays, its
      // own nodes move into a style-free span (textContent unchanged, EW1)
      if (q.querySelector(':scope > span.label')) return;
      const label = el('span', 'label');
      label.append(...q.childNodes);
      q.append(label);
    });
    title.append(...question);
    const toggle = el('button', 'toggle', {
      type: 'button',
      id: `${id}-item-${n}-button`,
      'aria-controls': `${id}-item-${n}-panel`,
      'aria-expanded': 'false',
      'aria-labelledby': title.id,
    });
    toggle.append(el('span', 'toggle-icon', { 'aria-hidden': 'true' }));
    header.append(title, toggle);

    const panel = el('div', 'panel cmp-accordion__panel--hidden', {
      id: `${id}-item-${n}-panel`,
      role: 'region',
      'aria-labelledby': title.id,
      'aria-hidden': 'true',
    });
    panel.append(...answer);

    header.addEventListener('click', () => {
      const open = !toggle.classList.contains('cmp-accordion__button--expanded');
      toggle.classList.toggle('cmp-accordion__button--expanded', open);
      header.classList.toggle('expanded', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // live order: the incoming state class is added before the outgoing one is removed
      const [add, remove] = open
        ? ['cmp-accordion__panel--expanded', 'cmp-accordion__panel--hidden']
        : ['cmp-accordion__panel--hidden', 'cmp-accordion__panel--expanded'];
      panel.classList.add(add);
      panel.classList.remove(remove);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });

    item.append(header, panel);
    list.append(item);
  });

  block.replaceChildren(list);
}
