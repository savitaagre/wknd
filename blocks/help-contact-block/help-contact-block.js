/**
 * help-contact-block — the FAQ page's "Need more help?" aside (source: a hidden small separator,
 * an h3 title, a 14px left-aligned text with the phone / e-mail links).
 *
 * Contract: stardust/eds-schema/us-en-faqs-html.json → sections[1] "help-contact-block".
 * Model: one cell (or several rows) — a heading, then the contact text (p, ul/ol …).
 * Decode tier: template-slotted — `.title` (the first heading) and `.body` (everything else,
 * in authored order) are generated empty and the authored nodes are MOVED into them (EW1).
 * The source's hidden separator is decorative: CSS spacing only, no authored row.
 */

const isHeading = (n) => n.nodeType === 1 && /^H[1-6]$/.test(n.tagName);

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const nodes = (cells.length ? cells : [block]).flatMap((cell) => [...cell.childNodes])
    .filter((n) => n.nodeType === 1 || n.textContent.trim())
    .map((n) => {
      if (n.nodeType === 1) return n;
      // HARNESS-ONLY fallback (EW5): bare cell text → move the text node into a <p>
      const p = document.createElement('p');
      p.append(n);
      return p;
    });
  if (!nodes.length) return;

  const title = document.createElement('div');
  title.className = 'title';
  const body = document.createElement('div');
  body.className = 'body';
  const heading = nodes.find(isHeading);
  if (heading) title.append(heading);
  body.append(...nodes.filter((n) => n !== heading));

  block.replaceChildren(...[title, body].filter((w) => w.childNodes.length));
}
