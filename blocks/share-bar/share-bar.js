/**
 * share-bar — "Share this …" title plus the social share placeholders (source
 * .title h5 + .sharing). On live the Facebook / Pinterest SDKs never hydrate, so
 * the buttons box is 0px tall: the block renders the same two unhydrated hooks
 * (a Facebook share placeholder for the current page and the Pinterest
 * "pin it" link) — generated, text-free, no SDK loaded.
 *
 * Contract: stardust/eds-schema/us-en-adventures-climbing-new-zealand-html.json →
 * sections[4] "share-bar" (1 heading). Generic: programs and magazine articles.
 * Model: one row, one cell: the title heading (<h5> on the source), plus any
 * other authored content, kept in order.
 * Decode tier: template-slotted (title slot + generated buttons). Authored
 * nodes are MOVED (EW1).
 */

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

export default async function decorate(block) {
  const title = el('div', 'title');
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    title.append(...cell.childNodes);
  });
  if (!title.childNodes.length) title.append(...block.childNodes);

  const buttons = el('div', 'buttons');
  const pageUrl = `${window.location.origin}${window.location.pathname}`;
  buttons.append(
    el('div', 'fb', { 'data-href': pageUrl, 'data-layout': 'button_count', 'data-size': 'small' }),
    el('a', 'pin', {
      href: 'https://www.pinterest.com/pin/create/button/',
      'data-pin-do': 'buttonPin',
      'data-pin-count': 'beside',
      'data-pin-save': 'true',
    }),
  );
  block.replaceChildren(title, buttons);
}
