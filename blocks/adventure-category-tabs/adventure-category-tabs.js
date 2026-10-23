/**
 * adventure-category-tabs — the wknd adventures listing's category tabs
 * (source .cmp-tabs: All / Climbing / Cycling / Skiing / Surfing / Travel), a
 * CLIENT-ONLY filter over the adventure-card-grid in the same section
 * (stardust/dynamic-features.md row 4, listings contract: no index, nothing
 * fetched — the cards are authored rows of the grid, each with a category cell).
 *
 * Contract: stardust/eds-schema/us-en-adventures-html.json → "adventure-category-tabs"
 * (6 tab labels).
 * Model: ONE ROW PER TAB, one cell: the tab label.
 *   row 1     the unfiltered tab ("All") — shows every card
 *   rows 2..n a category; it shows the cards whose category cell lists the
 *             label (case-insensitive)
 * Decode tier: reconstructive (repeat group). The authored label nodes are
 * MOVED into generated li[role=tab] hosts (EW1; li, never <button>, EW7).
 * Behaviour (observed on live, stardust/replica/motion/us-en-adventures-html.json):
 * a tab click moves cmp-tabs__tab--active to the clicked tab and re-activates
 * the panel (cmp-tabs__tabpanel--active); no transition, no hover change, no
 * keyboard handling (none observed). Live state class names are kept (motion
 * parity); adventure-tabs__tablist / __tab are the unit-geometry hooks
 * (stardust/replica/units.json "adventure-category-tab").
 * Re-entrant (EW9): a decorated block is left as it is.
 */

const ACTIVE_TAB = 'cmp-tabs__tab--active';
const ACTIVE_PANEL = 'cmp-tabs__tabpanel--active';
const GRID = '.adventure-card-grid';

let instances = 0;

const keyOf = (tab) => tab.textContent.trim().toLowerCase();

function panelOf(section) {
  return section ? section.querySelector(`${GRID} .panel`) : null;
}

function applyFilter(section, tab, all) {
  const panel = panelOf(section);
  if (!panel) return;
  const key = all ? '' : keyOf(tab);
  panel.querySelectorAll('.item').forEach((item) => {
    const cats = (item.dataset.categories || '').split('|');
    item.hidden = Boolean(key) && !cats.includes(key);
  });
}

function link(block) {
  const section = block.closest('.section');
  const panel = panelOf(section);
  if (!panel) return;
  const tabs = [...block.querySelectorAll('[role="tab"]')];
  const active = tabs.find((t) => t.classList.contains(ACTIVE_TAB)) || tabs[0];
  if (!panel.id) panel.id = `${block.dataset.tabsId}-panel`;
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', active.id);
  tabs.forEach((t) => t.setAttribute('aria-controls', panel.id));
  applyFilter(section, active, active === tabs[0]);
}

function select(block, tab) {
  const tabs = [...block.querySelectorAll('[role="tab"]')];
  tabs.forEach((t) => {
    const on = t === tab;
    t.classList.toggle(ACTIVE_TAB, on);
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
  });
  const section = block.closest('.section');
  const panel = panelOf(section);
  if (!panel) return;
  panel.setAttribute('aria-labelledby', tab.id);
  applyFilter(section, tab, tab === tabs[0]);
  // the source swaps panels: the active-panel class is re-added to the shown one
  panel.classList.remove(ACTIVE_PANEL);
  requestAnimationFrame(() => panel.classList.add(ACTIVE_PANEL));
}

export default async function decorate(block) {
  if (block.querySelector(':scope > ol.tablist')) return;
  instances += 1;
  block.dataset.tabsId = `adventure-tabs-${instances}`;

  const list = document.createElement('ol');
  list.className = 'tablist adventure-tabs__tablist';
  list.setAttribute('role', 'tablist');

  [...block.children].forEach((row) => {
    const cell = row.children.length ? row.children[0] : row;
    if (!cell.textContent.trim()) return;
    const tab = document.createElement('li');
    tab.className = 'tab adventure-tabs__tab';
    tab.setAttribute('role', 'tab');
    tab.append(...cell.childNodes);
    list.append(tab);
  });

  const tabs = [...list.children];
  tabs.forEach((tab, i) => {
    tab.id = `${block.dataset.tabsId}-tab-${i}`;
    tab.classList.toggle(ACTIVE_TAB, i === 0);
    tab.setAttribute('aria-selected', String(i === 0));
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', () => select(block, tab));
  });

  block.replaceChildren(list);

  // the grid may decorate before or after this block: link now, and again
  // when the grid announces itself
  link(block);
  const section = block.closest('.section');
  if (section) section.addEventListener('adventure-card-grid:decorated', () => link(block));
}
