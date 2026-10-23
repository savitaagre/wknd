/**
 * trip-facts — the adventure's key facts (source .cmp-contentfragment--elements):
 * a hidden fragment title, then label / value pairs drawn as uppercase tiles
 * with a grey left rule (stacked at >=1025px, flowing side by side below).
 *
 * Contract: stardust/eds-schema/us-en-adventures-climbing-new-zealand-html.json →
 * sections[3] "trip-facts" (1 heading + 6 × item: label + value).
 * Model: key/value rows
 *   optional first row, one cell: <h3> fragment title (hidden, as on live)
 *   ONE ROW PER FACT, two cells: label | value
 * Variant: "Trip Facts (Grid)" (class grid) — the aem-Grid program sub-template
 * (guttered facts + share columns); the layout rules live in content-tabs.css.
 * Decode tier: reconstructive (repeat group: one fact per two-cell row; a
 * one-cell row holding a heading is the title, any other one-cell row is a
 * label without a value). Authored nodes are MOVED (EW1) into generated
 * dt / dd wrappers — text nodes included, never copied.
 */

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

const HEADING = 'h1, h2, h3, h4, h5, h6';

// a cell's nodes; a lone attribute-free <p> (wrapTextNodes() wraps plain cell text at runtime)
// gives up its children instead, so the text sits directly in the dt / dd as on live (EW1: moved)
function cellNodes(cell) {
  const kids = [...cell.children];
  const only = kids.length === 1 && kids[0].matches('p') && !kids[0].attributes.length
    && ![...cell.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  return only ? [...kids[0].childNodes] : [...cell.childNodes];
}

export default async function decorate(block) {
  const rows = [...block.children];
  const article = el('article', 'fragment');
  const list = el('dl', 'list');
  let title = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const heading = row.querySelector(HEADING);
    if (cells.length < 2 && heading && !title) {
      title = el('div', 'title');
      title.append(heading);
      return;
    }
    const [labelCell, ...valueCells] = cells.length ? cells : [row];
    if (!labelCell.textContent.trim() && !valueCells.some((c) => c.textContent.trim())) return;
    // trip-facts__item: the units.json build hook (program-trip-facts)
    const item = el('div', 'item trip-facts__item');
    const dt = el('dt', 'label');
    dt.append(...cellNodes(labelCell));
    item.append(dt);
    const dd = el('dd', 'value');
    valueCells.forEach((c) => dd.append(...cellNodes(c)));
    item.append(dd);
    list.append(item);
  });

  if (title) article.append(title);
  article.append(list);
  block.replaceChildren(article);
}
