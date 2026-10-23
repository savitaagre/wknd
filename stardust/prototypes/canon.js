// stardust:replica — wknd.site SHARED CANON behaviour (layer 1 of 2; load BEFORE <slug>.js).
// Site-wide chrome only: header scroll morph, language menu, mobile navigation.
// Moved verbatim from the gated landing prototype us-en-html.js — do NOT edit from an
// archetype; file a request in stardust/replica/canon-requests.md (see CANON.md).
// Only behaviours motion-observe saw fire on the live page are implemented
// (stardust/replica/motion/us-en-html*.json); state class names mirror the live ones.
(() => {
  const { body } = document;

  // Header scroll morph: body.scrolly while scrollTop > 15 (lifted from clientlib-site JS).
  const updateScrolly = () => body.classList.toggle('scrolly', window.scrollY > 15);
  updateScrolly();
  document.addEventListener('scroll', updateScrolly, { capture: false, passive: true });

  // Language menu — the live state machine (clientlib-site JS): a toggle click places
  // the menu at `left = toggle.position().left - 240`, toggles `showMenu` / `open`;
  // any click elsewhere closes it.
  const langToggle = document.querySelector('.lang-toggle');
  const langMenu = document.querySelector('.lang-menu');
  if (langToggle && langMenu) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      // jQuery .position(): fractional, relative to offsetParent
      const parent = langToggle.offsetParent || document.body;
      const left = langToggle.getBoundingClientRect().left - parent.getBoundingClientRect().left;
      langMenu.style.left = `${left - 240}px`;
      langMenu.classList.toggle('showMenu');
      langToggle.classList.toggle('open');
      langToggle.setAttribute('aria-expanded', 'true');
    });
    window.addEventListener('click', (e) => {
      if (e.target !== langToggle && langToggle.classList.contains('open')) {
        langMenu.classList.remove('showMenu');
        langToggle.classList.remove('open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile navigation (≤1024): body.navPanel-visible slides the panel in (transform .5s via CSS).
  const mobileToggle = document.querySelector('.mobile-toggle__link');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !body.classList.contains('navPanel-visible');
      body.classList.toggle('navPanel-visible', open);
      mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
