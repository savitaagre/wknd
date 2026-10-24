/* stardust:provenance — writtenBy: stardust:replica · phase: recreate
   AI-Powered Search — at-rest UI behaviour only, as observed on live without a backend
   (stardust/replica/motion/us-en-ai-powered-search-html.json + typed/clear probe):
   - typing shows the clear button; clearing empties the input and hides it again;
   - the summary toggle is a native checkbox (checked state + .15s CSS transitions);
   - the input focus ring is CSS (:focus).
   No query is sent and no results are rendered: search (row #6) and the AI summary
   (row #7, decision D4) are delivered in Phase 5. Loaded after canon.js. */
(() => {
  const root = document.querySelector('.ai-search');
  if (!root) return;
  const form = root.querySelector('.ai-search__form');
  const input = root.querySelector('.ai-search__input');
  const clear = root.querySelector('.ai-search__clear');
  if (!form || !input || !clear) return;

  const syncClear = () => { clear.hidden = input.value === ''; };

  input.addEventListener('input', syncClear);
  clear.addEventListener('click', () => {
    input.value = '';
    syncClear();
  });
  // Live never navigates on submit (the component runs the query in place); the query itself is
  // Phase 5.
  form.addEventListener('submit', (e) => e.preventDefault());
  syncClear();
})();
