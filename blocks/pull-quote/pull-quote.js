/**
 * pull-quote — the wknd magazine article quote box (source .cmp-text--quote): a grey
 * panel holding the quotation (36px Asar, 80px yellow rule under it) and an optional
 * attribution line (Source Sans, no underline).
 *
 * Contract: stardust/eds-schema/us-en-magazine-guide-la-skateparks-html.json →
 *   section "pull-quote" (2 body items: quotation + attribution, 2 editable texts).
 * Model: one row (extra rows are read in order), any cells:
 *   the quotation : <blockquote> (a quotation authored as a plain <p> before any
 *                   blockquote is accepted and styled as the quotation)
 *   attribution   : the other paragraphs (<p><u>Name - Role</u></p> on the source)
 * Decode tier: template-slotted (one inner panel = the source .cmp-text). Authored nodes
 * are MOVED (EW1) into the generated `.inner` wrapper; the wrapper carries the layout
 * (EW2); re-entrant (EW9).
 */

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

// every authored element of every cell, in order; bare cell text is MOVED into a <p>
function collect(block) {
  const out = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.children.length) out.push(...cell.children);
      else if (cell.textContent.trim()) {
        const p = el('p');
        p.append(...cell.childNodes);
        out.push(p);
      }
    });
  });
  return out;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .inner')) return; // EW9: already decorated

  const nodes = collect(block);
  const inner = el('div', 'inner');
  const hasQuote = nodes.some((n) => n.matches('blockquote'));
  nodes.forEach((n, i) => {
    // no authored blockquote: the first text node is the quotation
    if (!hasQuote && i === 0 && n.matches('p')) {
      const quote = el('div', 'quotation');
      quote.append(n);
      inner.append(quote);
      return;
    }
    inner.append(n);
  });
  block.replaceChildren(inner);
}
