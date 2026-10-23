/**
 * trip-gallery-carousel — the adventure-detail image gallery (source
 * .cmp-carousel.cmp-carousel--mini): full-width 400px cover images switched by
 * previous / next / indicator click with a .5s fadeIn. No autoplay (0 idle
 * mutations on live). A single-image gallery keeps the controls and its one
 * indicator, as on live (the "single" sub-template).
 *
 * Contract: stardust/eds-schema/us-en-adventures-climbing-new-zealand-html.json →
 * sections[1] "trip-gallery-carousel" (3 × slide, uniform: 1 img).
 * Model: ONE ROW PER SLIDE, one cell: <picture>/<img> (alt + title verbatim).
 * A flattened single cell holding several images is split image by image.
 * Decode tier: reconstructive (repeat group). Pictures are MOVED (EW1); the
 * controls are generated, text-free (aria-label only, #100).
 * State classes mirror live: cmp-carousel__item--active /
 * cmp-carousel__indicator--active.
 */

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

function collectMedia(block) {
  return [...block.querySelectorAll('picture, img')]
    .filter((m) => m.matches('picture') || !m.closest('picture'));
}

export default async function decorate(block) {
  const media = collectMedia(block);
  if (!media.length) return;

  const blocks = [...document.querySelectorAll('.trip-gallery-carousel')];
  const id = `trip-gallery-${Math.max(blocks.indexOf(block), 0) + 1}`;
  const content = el('div', 'content');
  const slides = media.map((m, i) => {
    const slide = el('div', 'slide', {
      id: `${id}-slide-${i + 1}`,
      role: 'tabpanel',
      'aria-roledescription': 'slide',
      'aria-label': `Slide ${i + 1} of ${media.length}`,
    });
    const image = el('div', 'image');
    image.append(m);
    slide.append(image);
    return slide;
  });
  content.append(...slides);

  // LCP: the first slide's image loads eagerly at high priority
  const lcp = slides[0].querySelector('img');
  if (lcp) {
    lcp.setAttribute('loading', 'eager');
    lcp.setAttribute('fetchpriority', 'high');
  }

  const actions = el('div', 'actions');
  const prev = el('button', 'action previous', { type: 'button', 'aria-label': 'Previous' });
  const next = el('button', 'action next', { type: 'button', 'aria-label': 'Next' });
  [prev, next].forEach((b) => b.append(el('span', 'action-icon', { 'aria-hidden': 'true' })));
  actions.append(prev, next);

  const indicators = el('ol', 'indicators', { role: 'tablist', 'aria-label': 'Choose a slide to display' });
  const dots = slides.map((s, i) => el('li', 'indicator', {
    role: 'tab',
    'aria-label': `Slide ${i + 1}`,
    'aria-controls': s.id,
  }));
  indicators.append(...dots);
  content.append(actions, indicators);

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
  if (slides.length > 1) {
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
  }
  show(0);

  const carousel = el('div', 'carousel', { role: 'group', 'aria-roledescription': 'carousel' });
  carousel.append(content);
  block.replaceChildren(carousel);
}
