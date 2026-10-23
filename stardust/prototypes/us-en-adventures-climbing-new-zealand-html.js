// stardust:replica — interaction parity for wknd.site /us/en/adventures/climbing-new-zealand.html
// (layer 2 of 2).
// Loaded AFTER canon.js (header scroll morph, language menu, mobile nav live there).
// Only behaviours motion-observe saw fire on the live page are implemented
// (stardust/replica/motion/us-en-adventures-climbing-new-zealand-html.json); state class names
// mirror the live ones.
(() => {
  // Trip gallery carousel: prev / next / indicator switch the active slide (fadeIn .5s via CSS).
  // No autoplay — 0 idle class mutations on live.
  document.querySelectorAll('.trip-gallery__carousel').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('.trip-gallery__item')];
    const dots = [...carousel.querySelectorAll('.trip-gallery__indicator')];
    if (slides.length < 2) return;
    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('cmp-carousel__item--active')));
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('cmp-carousel__item--active', n === index));
      dots.forEach((d, n) => {
        d.classList.toggle('cmp-carousel__indicator--active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
        d.tabIndex = n === index ? 0 : -1;
      });
    };
    carousel.querySelector('.trip-gallery__action--previous')?.addEventListener('click', () => show(index - 1));
    carousel.querySelector('.trip-gallery__action--next')?.addEventListener('click', () => show(index + 1));
    dots.forEach((d, n) => d.addEventListener('click', () => show(n)));
  });

  // Content tabs: a tab click activates its panel (live: cmp-tabs__tab--active +
  // cmp-tabs__tabpanel--active).
  document.querySelectorAll('.content-tabs__inner').forEach((tabs) => {
    const tabEls = [...tabs.querySelectorAll('.content-tabs__tab')];
    const panels = tabEls.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const select = (i) => {
      tabEls.forEach((t, n) => {
        const on = n === i;
        t.classList.toggle('cmp-tabs__tab--active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const p = panels[n];
        if (!p) return;
        p.classList.toggle('cmp-tabs__tabpanel--active', on);
        if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
    };
    tabEls.forEach((t, n) => t.addEventListener('click', () => select(n)));
  });
})();
