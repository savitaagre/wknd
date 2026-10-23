// stardust:replica — wknd.site FAQ archetype behaviour (layer 2 of 2; load AFTER canon.js).
// faq-accordion: only what motion-observe saw fire on the live page
// (stardust/replica/motion/us-en-faqs-html.json): a button click toggles its OWN item —
// button gets `cmp-accordion__button--expanded`, the panel swaps `cmp-accordion__panel--hidden`
// for `cmp-accordion__panel--expanded` (CSS fadeIn .5s on show); other open items stay open
// (multi-expansion — clicking item 2 left item 1 expanded; a second click on item 1 collapsed it).
// No hover change fired on the buttons or the help links. State class names mirror the live ones.
(() => {
  document.querySelectorAll('.faq-accordion__button').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.addEventListener('click', () => {
      const open = !button.classList.contains('cmp-accordion__button--expanded');
      button.classList.toggle('cmp-accordion__button--expanded', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      // same order as live: the incoming state class is added before the outgoing one is removed
      const [add, remove] = open
        ? ['cmp-accordion__panel--expanded', 'cmp-accordion__panel--hidden']
        : ['cmp-accordion__panel--hidden', 'cmp-accordion__panel--expanded'];
      panel.classList.add(add);
      panel.classList.remove(remove);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  });
})();
