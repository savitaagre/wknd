/**
 * content-tabs — the adventure-detail tabs (source .cmp-tabs with one content
 * fragment per panel): an uppercase tab strip (active tab #202020 / white) over
 * rich-text panels (headings, paragraphs, full-width images with optional
 * captions, play3-bulleted lists). A tab click activates its panel, as on live
 * (cmp-tabs__tab--active / cmp-tabs__tabpanel--active, no animation).
 *
 * Contract: stardust/eds-schema/us-en-adventures-climbing-new-zealand-html.json →
 * sections[5] "content-tabs" (3 × panel).
 * Model: ONE ROW PER TAB
 *   two cells  : label | panel body
 *   three cells: label | panel title (the fragment title — hidden, as on live) | panel body
 *   panel body : any default content — h2/h3, p, picture, ul/ol. An image paragraph
 *                followed by a paragraph that is entirely <em> is that image's caption.
 * Decode tier: reconstructive (repeat group: one tab per row). Authored nodes
 * are MOVED (EW1) into generated wrappers; the tab label (text node or <p>) is
 * moved into the generated li[role=tab] — never a <button> (EW7).
 * @ew-exempt tablist aria-label: "adventure trip details" is the source tabs
 * component's configured accessible name (identical on all 32 program pages),
 * not authored copy.
 */

const TABLIST_LABEL = 'adventure trip details';

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

const hasMedia = (n) => n.nodeType === 1 && (n.matches('picture, img') || !!n.querySelector('picture, img'));

// a caption: a paragraph whose whole text is one <em>, right after an image
function isCaption(n) {
  if (!n || n.nodeType !== 1 || !n.matches('p') || hasMedia(n)) return false;
  const em = n.querySelector('em');
  return !!em && em.textContent.trim() === n.textContent.trim() && !!n.textContent.trim();
}

// body cell → panel nodes; image paragraphs (+ caption) grouped in .image wrappers
function buildBody(cell) {
  const body = el('div', 'body');
  const kids = [...cell.childNodes].filter((n) => n.nodeType === 1 || n.textContent.trim());
  for (let i = 0; i < kids.length; i += 1) {
    const n = kids[i];
    if (n.nodeType !== 1) {
      // HARNESS-ONLY fallback (EW5): bare text → move the node into a <p>
      const p = document.createElement('p');
      p.append(n);
      body.append(p);
    } else if (hasMedia(n)) {
      const image = el('div', 'image');
      image.append(n);
      if (isCaption(kids[i + 1])) {
        const caption = el('div', 'caption');
        caption.append(kids[i + 1]);
        image.append(caption);
        i += 1;
      }
      body.append(image);
    } else {
      body.append(n);
    }
  }
  return body;
}

export default async function decorate(block) {
  const rows = [...block.children].filter((r) => r.children.length || r.textContent.trim());
  if (!rows.length) return;

  const blocks = [...document.querySelectorAll('.content-tabs')];
  const id = `content-tabs-${Math.max(blocks.indexOf(block), 0) + 1}`;
  const inner = el('div', 'tabs', { id });
  // content-tabs__tablist / __tab: the units.json build hooks (program-content-tabs)
  const tablist = el('ol', 'tablist content-tabs__tablist', {
    role: 'tablist',
    'aria-label': TABLIST_LABEL,
  });
  const tabs = [];
  const panels = [];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const [labelCell] = cells;
    const bodyCell = cells.length > 1 ? cells[cells.length - 1] : null;
    const titleCell = cells.length > 2 ? cells[1] : null;

    const tab = el('li', 'tab content-tabs__tab', {
      id: `${id}-tab-${i + 1}`,
      role: 'tab',
      'aria-controls': `${id}-panel-${i + 1}`,
    });
    if (labelCell) tab.append(...labelCell.childNodes);

    const panel = el('div', 'panel', {
      id: `${id}-panel-${i + 1}`,
      role: 'tabpanel',
      tabindex: '0',
      'aria-labelledby': tab.id,
    });
    const article = el('article', 'fragment');
    if (titleCell && titleCell.textContent.trim()) {
      const title = el('div', 'title');
      title.append(...titleCell.childNodes);
      article.append(title);
    }
    if (bodyCell) article.append(buildBody(bodyCell));
    panel.append(article);

    tabs.push(tab);
    panels.push(panel);
  });

  const select = (index) => {
    tabs.forEach((t, n) => {
      const on = n === index;
      t.classList.toggle('cmp-tabs__tab--active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[n].classList.toggle('cmp-tabs__tabpanel--active', on);
      if (on) panels[n].removeAttribute('aria-hidden');
      else panels[n].setAttribute('aria-hidden', 'true');
    });
  };
  tabs.forEach((t, n) => {
    t.addEventListener('click', () => select(n));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(n);
      }
    });
  });
  select(0);

  tablist.append(...tabs);
  inner.append(tablist, ...panels);
  block.replaceChildren(inner);
}
