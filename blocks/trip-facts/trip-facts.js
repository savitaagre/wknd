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
    dt.append(...labelCell.childNodes);
    item.append(dt);
    const dd = el('dd', 'value');
    valueCells.forEach((c) => dd.append(...c.childNodes));
    item.append(dd);
    list.append(item);
  });

  if (title) article.append(title);
  article.append(list);
  block.replaceChildren(article);
}
