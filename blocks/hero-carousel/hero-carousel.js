/**
 * hero-carousel — the WKND home hero: teaser slides (full-bleed image, white
 * card overlapping it at >=1165px) switched by previous / next / indicator
 * click with a .5s fadeIn. No autoplay: it never fires on wknd.site.
 *
 * Contract: stardust/eds-schema/us-en-html.json → sections[0] "hero-carousel"
 * (3 × slide, uniform: 1 heading + 1 body + 1 cta + 1 img).
 * Model: carousel — ONE ROW PER SLIDE, two cells: image | text
 *   image cell: <picture>/<img> (alt + title carried verbatim)
 *   text cell : <h1> (first slide — the page's one h1) or <h2> title,
 *               <p> description, <p><a> CTA (decorateButtons → a.button)
 * Decode tier: reconstructive (repeat group). One slide per row when the block
 * has several rows; a flattened single-cell shape is segmented on the heading
 * boundary (#69) — media before a heading belongs to that heading's slide.
 * Every authored node is MOVED (EW1); controls are generated (aria-label, #100);
 * each indicator carries a hidden copy of its slide title, as on live
 * (@ew-exempt). State classes mirror live:
 * cmp-carousel__item--active / cmp-carousel__indicator--active.
 */

const HEADING = 'h1, h2, h3, h4, h5, h6';

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

// Cell-level collector (#62/#68/#104): every authored element in order; a
// media-led cell folded into one <p> by wrapTextNodes is expanded back.
function collectNodes(scope) {
  const out = [];
  scope.querySelectorAll(':scope > div').forEach((cell) => {
    let kids = [...cell.children];
    if (kids.length === 1 && kids[0].tagName === 'P' && kids[0].querySelector('picture, img')) {
      kids = [...kids[0].childNodes].map((n) => {
        if (n.nodeType === 1) return n;
        // HARNESS-ONLY fallback (EW5): bare text beside an image → move the node into a <p>
        if (n.textContent.trim()) {
          const p = document.createElement('p');
          p.append(n);
          return p;
        }
        return null;
      }).filter(Boolean);
    }
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      // HARNESS-ONLY fallback (EW5): wrap the existing text nodes, never copy text
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      out.push(p);
    }
  });
  return out;
}

const isMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');
const media = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));
const isHeading = (n) => n.matches(HEADING);
// a CTA is a paragraph whose only content is one link (what decorateButtons buttonizes)
const isCta = (n) => {
  if (n.matches('a')) return true;
  const links = n.matches('p') ? n.querySelectorAll('a') : [];
  return links.length === 1 && n.textContent.trim() === links[0].textContent.trim();
};

function newGroup() {
  return {
    heading: null, media: null, body: [], ctas: [],
  };
}

function place(group, n) {
  if (isMedia(n) && !group.media) group.media = media(n);
  else if (isHeading(n) && !group.heading) group.heading = n;
  else if (isCta(n)) group.ctas.push(n);
  else group.body.push(n);
}

function toGroups(block) {
  const rows = [...block.children];
  if (rows.length > 1) {
    return rows.map((row) => {
      const g = newGroup();
      collectNodes(row).forEach((n) => place(g, n));
      return g;
    }).filter((g) => g.heading || g.media || g.body.length || g.ctas.length);
  }
  // flattened single row: segment on the heading boundary
  const groups = [];
  let g = newGroup();
  collectNodes(rows[0] || block).forEach((n) => {
    const opensByHeading = isHeading(n) && g.heading;
    const opensByMedia = isMedia(n) && g.heading && (g.media || g.body.length || g.ctas.length);
    if (opensByHeading || opensByMedia) {
      groups.push(g);
      g = newGroup();
    }
    place(g, n);
  });
  groups.push(g);
  return groups.filter((x) => x.heading || x.media || x.body.length || x.ctas.length);
}

function buildSlide(group, index, count, id) {
  const slide = el('div', 'slide', {
    id: `${id}-slide-${index + 1}`,
    role: 'tabpanel',
    'aria-roledescription': 'slide',
    'aria-label': `Slide ${index + 1} of ${count}`,
  });
  const teaser = el('div', 'teaser');
  const content = el('div', 'content');
  if (group.heading) content.append(wrapNode(group.heading, 'title'));
  if (group.body.length) {
    const description = el('div', 'description');
    description.append(...group.body);
    content.append(description);
  }
  if (group.ctas.length) {
    const actions = el('div', 'actions');
    actions.append(...group.ctas); // CTAs move as their <p> (EW3)
    content.append(actions);
  }
  const mediaSlot = el('div', 'media');
  if (group.media) mediaSlot.append(group.media.closest('picture') || group.media);
  teaser.append(content, mediaSlot);
  slide.append(teaser);
  return slide;
}

export default async function decorate(block) {
  const groups = toGroups(block);
  if (!groups.length) return;

  const blocks = [...document.querySelectorAll('.hero-carousel')];
  const id = `hero-carousel-${Math.max(blocks.indexOf(block), 0) + 1}`;
  const slidesWrap = el('div', 'slides');
  const slides = groups.map((g, i) => buildSlide(g, i, groups.length, id));
  slidesWrap.append(...slides);

  // LCP: the first slide's image loads eagerly at high priority; its slot is
  // reserved by the 640px media box (>=1165px) / the img width+height ratio.
  const lcp = slides[0].querySelector('img');
  if (lcp) {
    lcp.setAttribute('loading', 'eager');
    lcp.setAttribute('fetchpriority', 'high');
  }

  const parts = [slidesWrap];
  let dots = [];
  if (slides.length > 1) {
    const controls = el('div', 'controls');
    const prev = el('button', 'action previous', { type: 'button', 'aria-label': 'Previous' });
    const next = el('button', 'action next', { type: 'button', 'aria-label': 'Next' });
    [prev, next].forEach((b) => b.append(el('span', 'action-icon', { 'aria-hidden': 'true' })));
    controls.append(prev, next);

    const indicators = el('ol', 'indicators', { role: 'tablist', 'aria-label': 'Choose a slide to display' });
    // @ew-exempt indicator label: a hidden presentational copy of the slide's authored
    // heading, mirroring the live indicator text (font-size 0); the authored heading itself
    // is moved, never copied, and decorate() is re-entrant, so an edit re-labels the dot.
    dots = slides.map((s, i) => {
      const dot = el('li', 'indicator', {
        role: 'tab',
        'aria-label': `Slide ${i + 1}`,
        'aria-controls': s.id,
      });
      dot.textContent = s.querySelector(HEADING)?.textContent.trim() || '';
      return dot;
    });
    indicators.append(...dots);
    parts.push(controls, indicators);

    let index = 0;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('cmp-carousel__item--active', n === index));
      dots.forEach((d, n) => {
        d.classList.toggle('cmp-carousel__indicator--active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
        d.tabIndex = n === index ? 0 : -1;
      });
    };
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    dots.forEach((d, n) => {
      d.addEventListener('click', () => show(n));
      d.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          show(n);
        }
      });
    });
    show(0);
  } else {
    slides[0].classList.add('cmp-carousel__item--active');
  }

  block.replaceChildren(...parts);
}
