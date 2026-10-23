/**
 * download-card — the wknd article download panel (source .cmp-download): an uppercase
 * linked title, a description line, the file properties (filename · size · format; the
 * labels are visually hidden as on the source) and the dark "Download" action button with
 * the download glyph.
 *
 * Contract: stardust/eds-schema/us-en-magazine-guide-la-skateparks-html.json →
 *   section "download-card" (title cta, description, 3 property units of label + value,
 *   action cta; 2 editable texts).
 * Model (one row per part, classified by content — never by row index):
 *   title       : a heading, usually holding the file link (<h3><a href>Download PDF</a></h3>)
 *   description : a text paragraph (<p>Get the Full Story</p>)
 *   property    : a two-cell row  label | value  (Filename | ultimateguidetolaskateparks.pdf)
 *   action      : a link paragraph (<p><a href>Download PDF</a></p>)
 * Decode tier: template-slotted (title / description / properties / action slots; the
 * properties are a repeat group → dl > div > dt + dd). Authored nodes are MOVED (EW1) into
 * generated wrappers that carry the layout (EW2); the action moves as its <p> (EW3);
 * leftovers are kept after the description; re-entrant (EW9).
 * @ew-exempt property labels ("Filename", "Size", "Format") are visually hidden as on the
 * source (.cmp-download__property-label); they stay the authored text, moved into <dt>.
 */

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

const isHeading = (n) => /^H[1-6]$/.test(n.tagName);
const isLinkParagraph = (n) => n.matches('p')
  && n.querySelectorAll('a[href]').length === 1
  && n.textContent.trim() === n.querySelector('a[href]').textContent.trim();

// a CTA here is a styled download link, not a site button: undo decorateButtons()
function unbutton(p) {
  p.classList.remove('button-wrapper');
  if (!p.classList.length) p.removeAttribute('class');
  p.querySelectorAll('a').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    if (!a.classList.length) a.removeAttribute('class');
    if (a.title === a.textContent) a.removeAttribute('title');
  });
}

// the authored content of a cell: its element children, or its bare text nodes
const contentOf = (cell) => (cell.children.length ? [...cell.children] : [...cell.childNodes]);

export default function decorate(block) {
  if (block.querySelector(':scope > .properties, :scope > .action, :scope > .title')) return; // EW9

  const slots = {
    title: null, description: [], properties: [], action: null, rest: [],
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const textOnly = (c) => !c.querySelector('a[href], h1, h2, h3, h4, h5, h6, picture, img');
    if (cells.length === 2 && cells.every(textOnly) && cells.every((c) => c.textContent.trim())) {
      slots.properties.push(cells);
      return;
    }
    cells.forEach((cell) => {
      contentOf(cell).forEach((n) => {
        if (n.nodeType !== 1) {
          if (n.textContent.trim()) {
            const p = el('p');
            p.append(n);
            slots.description.push(p);
          }
          return;
        }
        if (isHeading(n) && !slots.title) slots.title = n;
        else if (isLinkParagraph(n) && !slots.action) slots.action = n;
        else if (n.textContent.trim() && !slots.properties.length && !slots.action) {
          slots.description.push(n);
        } else if (n.textContent.trim()) slots.rest.push(n);
      });
    });
  });

  const children = [];
  if (slots.title) {
    const title = el('div', 'title');
    title.append(slots.title);
    children.push(title);
  }
  if (slots.description.length || slots.rest.length) {
    const description = el('div', 'description');
    description.append(...slots.description, ...slots.rest);
    children.push(description);
  }
  if (slots.properties.length) {
    const dl = el('dl', 'properties');
    slots.properties.forEach(([label, value]) => {
      const item = el('div', 'property');
      const dt = el('dt', 'property-label');
      dt.append(...label.childNodes);
      const dd = el('dd', 'property-content');
      dd.append(...value.childNodes);
      item.append(dt, dd);
      dl.append(item);
    });
    children.push(dl);
  }
  if (slots.action) {
    unbutton(slots.action);
    const action = el('div', 'action');
    action.append(slots.action);
    children.push(action);
  }
  block.replaceChildren(...children);
}
