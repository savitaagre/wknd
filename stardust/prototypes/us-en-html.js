// stardust:replica — interaction parity for wknd.site /us/en.html (layer 2 of 2: home-only).
// Loaded AFTER canon.js (header scroll morph, language menu, mobile nav live there).
// Only behaviours motion-observe saw fire on the live page are implemented
// (stardust/replica/motion/us-en-html*.json); state class names mirror the live ones.
(() => {
  // Hero carousel: prev / next / indicator switch the active slide (fadeIn .5s via CSS).
  // No autoplay — it never fired on live (0 idle class mutations).
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.hero-carousel__slide')];
    const dots = [...carousel.querySelectorAll('.hero-carousel__indicator')];
    let index = slides.findIndex((s) => s.classList.contains('cmp-carousel__item--active'));
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('cmp-carousel__item--active', n === index));
      dots.forEach((d, n) => {
        d.classList.toggle('cmp-carousel__indicator--active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
        d.tabIndex = n === index ? 0 : -1;
      });
    };
    carousel.querySelector('.hero-carousel__action--previous')?.addEventListener('click', () => show(index - 1));
    carousel.querySelector('.hero-carousel__action--next')?.addEventListener('click', () => show(index + 1));
    dots.forEach((d, n) => d.addEventListener('click', () => show(n)));
  }
})();
