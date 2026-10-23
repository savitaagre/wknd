/* us-en-adventures-html — adventure category tabs (client-only filter).
   Observed on live (stardust/replica/motion/us-en-adventures-html.json): a tab click moves
   cmp-tabs__tab--active to the clicked tab and cmp-tabs__tabpanel--active to its panel;
   no transition, no animation, no hover change. Panels are pre-rendered — nothing is fetched. */
(() => {
  document.querySelectorAll('.adventure-tabs').forEach((root) => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        t.classList.toggle('cmp-tabs__tab--active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (!panel) return;
        panel.classList.toggle('cmp-tabs__tabpanel--active', on);
        if (on) panel.removeAttribute('aria-hidden');
        else panel.setAttribute('aria-hidden', 'true');
      });
    };
    tabs.forEach((tab) => tab.addEventListener('click', () => select(tab)));
  });
})();
