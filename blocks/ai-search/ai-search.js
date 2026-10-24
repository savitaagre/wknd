/**
 * ai-search — the AI-Powered Search page (source .cmp-contentaisearch on
 * wknd.site/us/en/ai-powered-search): a 32px search field (search icon, hidden spinner, clear
 * button that appears while the field has text), the "Show AI-generated summary" switch
 * (checked at rest) and the summary / error / results panels, all hidden at rest.
 *
 * Contract: stardust/eds-schema/us-en-ai-powered-search-html.json → sections[0] "ai-search".
 * Model: KEY | VALUE rows (the source component's i18n strings, verbatim). Keys (any case):
 *   Title (the page h1 — register R-03, visually hidden) · Label · Placeholder · Clear ·
 *   Summary toggle · Generating · Summary title · Summary attribution · Sources · Disclaimer ·
 *   Error · Retry · Results layout · Cards · List · Search results · Load more
 * A missing row leaves its slot empty; unknown rows are kept, hidden, at the end.
 * Decode tier: template-slotted — the source composition is generated as empty slots and
 * every authored value node is MOVED (EW1) into its slot. EW7: no <button> hosts authored
 * text — Try again / Cards / List / Load more are div[role=button] (focusable, Enter/Space).
 *
 * Behaviour (live, motion/us-en-ai-powered-search-html.json): 2px #202020 focus ring; typing
 * shows the clear button; clear empties the field and hides it; Enter runs the query in place
 * (never navigates). Dynamics rows #6 / #7 — INTERIM tier (preview only, the query index
 * builds from the live tree): the query reads /query-index.json when it exists and renders
 * the hits with the source's result markup (list rows / cards); when the index is missing the
 * page stays exactly as at rest (no results, nothing recorded). The source search service is
 * never called. D4: there is no generative backend — the switch works visually, no answer is
 * produced and the summary panels stay hidden (the source's RESULTS_ONLY fallback).
 *
 * @ew-exempt config row keys ("Title", "Label" …) — slot names, not rendered (as metadata keys)
 * @ew-exempt derived attribute texts (Placeholder, Clear, Results layout, Search results, and
 * the switch's aria-label) — form controls cannot host authored text; the cell text becomes
 * the input placeholder / aria-label (edited in the document table)
 * @ew-exempt index result rows — titles and descriptions come from /query-index.json
 */

const INDEX = '/query-index.json';
const PAGE_SIZE = 10;
const MIN_SPINNER = 300; // source: the field spinner shows at least 300 ms

function el(tag, className, attrs = {}) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

const hasContent = (n) => n.nodeType === 1 || n.textContent.trim();

// cell → its authored nodes (elements; bare text moved into a <p> — HARNESS-ONLY, EW5)
function nodesOf(cell) {
  if (!cell) return [];
  return [...cell.childNodes].filter(hasContent).map((n) => {
    if (n.nodeType === 1) return n;
    const p = document.createElement('p');
    p.append(n);
    return p;
  });
}

const keyOf = (text) => text.toLowerCase().replace(/[^a-z]+/g, ' ').trim();

function show(node, on) {
  if (node) node.hidden = !on;
}

function asButton(node, onActivate) {
  node.setAttribute('role', 'button');
  node.tabIndex = 0;
  node.addEventListener('click', onActivate);
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  });
  return node;
}

// ---------- interim index (rows #6 / #7) ----------

let indexPromise;

async function fetchIndexPage(offset) {
  const url = offset ? `${INDEX}?offset=${offset}` : INDEX;
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const json = await resp.json();
  return json && Array.isArray(json.data) ? json : null;
}

function loadIndex() {
  if (!indexPromise) {
    indexPromise = (async () => {
      const first = await fetchIndexPage(0);
      if (!first) return null;
      const rows = [...first.data];
      const total = Number(first.total) || rows.length;
      const step = first.data.length || total;
      const pages = [];
      for (let at = rows.length; at < total && pages.length < 20; at += step) {
        pages.push(fetchIndexPage(at));
      }
      (await Promise.all(pages)).forEach((page) => {
        if (page) rows.push(...page.data);
      });
      return rows;
    })().catch(() => null);
  }
  return indexPromise;
}

function localeRoot() {
  const m = window.location.pathname.match(/^\/[a-z]{2}\/[a-z]{2}(?=\/|$)/);
  return m ? m[0] : '';
}

function searchIndex(rows, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const root = localeRoot();
  const here = window.location.pathname.replace(/\.html$/, '');
  return rows
    .filter((r) => r && r.path && r.path !== here && (!root || r.path.startsWith(`${root}/`)
      || r.path === root))
    .map((r, i) => {
      const title = String(r.title || '').toLowerCase();
      const desc = String(r.description || '').toLowerCase();
      let score = 0;
      const all = terms.every((t) => {
        const inTitle = title.includes(t);
        const inDesc = desc.includes(t);
        if (inTitle) score += 2;
        if (inDesc) score += 1;
        return inTitle || inDesc;
      });
      return { r, i, score: all ? score : 0 };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.r);
}

const isSafeImage = (src) => /^(\/(?!\/)|https?:\/\/)/i.test(src || '');

// one result in the source's item template (list rows or cards); index data, not authored text
function resultItem(row, layout) {
  const li = el('li', 'ai-search-item');
  const kind = layout === 'list' ? 'row' : 'card';
  const link = el('a', `ai-search-${kind}`, { href: row.path });
  const image = el('img', `ai-search-${kind}-image`, { alt: '', loading: 'lazy' });
  const src = row.image && !/default-meta-image/.test(row.image) ? row.image : '';
  if (isSafeImage(src)) image.src = src;
  else image.hidden = true;
  link.append(image);
  if (kind === 'card') {
    const placeholder = el('div', 'ai-search-card-image ai-search-card-image-placeholder', {
      'aria-hidden': 'true',
    });
    placeholder.hidden = !image.hidden;
    link.append(placeholder);
  }
  li.classList.toggle('ai-search-item-no-image', image.hidden);
  const body = el('div', `ai-search-${kind}-body`);
  const title = el('h3', `ai-search-${kind}-title`);
  title.textContent = row.title || row.path;
  const desc = el('p', `ai-search-${kind}-description`);
  desc.textContent = row.description || '';
  desc.hidden = !row.description;
  body.append(title, desc);
  link.append(body);
  li.append(link);
  return li;
}

// ---------- decorate ----------

export default function decorate(block) {
  if (block.querySelector(':scope > .ai-search-form')) return; // EW9: already decorated

  // rows → { key: Node[] } (authored value nodes, in order)
  const slots = {};
  const unknown = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) {
      unknown.push(...nodesOf(cells[0]));
      return;
    }
    const key = keyOf(cells[0].textContent);
    const nodes = cells.slice(1).flatMap(nodesOf);
    if (key && !slots[key]) slots[key] = nodes;
    else unknown.push(...nodes);
  });
  const take = (key) => slots[key] || [];
  const textOf = (key) => take(key).map((n) => n.textContent).join(' ').trim();
  const slot = (className, key, attrs) => {
    const wrap = el('div', className, attrs);
    wrap.append(...take(key));
    return wrap;
  };

  const uid = `ai-search-${Math.random().toString(36).slice(2, 8)}`;
  block.setAttribute('role', 'search');
  block.classList.add('ai-search-list');

  // page title (R-03: one visually hidden h1, the page's own captured title)
  const title = slot('ai-search-title', 'title');

  // ---- form ----
  const form = el('form', 'ai-search-form', { autocomplete: 'off' });
  const field = el('div', 'ai-search-field');
  const label = el('label', 'ai-search-label', { for: `${uid}-input` });
  label.append(...take('label'));
  const icon = el('span', 'ai-search-icon', { 'aria-hidden': 'true' });
  const spinner = el('span', 'ai-search-loading');
  spinner.hidden = true;
  const input = el('input', 'ai-search-input', {
    id: `${uid}-input`, type: 'text', name: 'q', autocomplete: 'off',
  });
  const placeholder = textOf('placeholder');
  if (placeholder) input.placeholder = placeholder;
  const clear = el('button', 'ai-search-clear', { type: 'button' });
  const clearLabel = textOf('clear');
  if (clearLabel) clear.setAttribute('aria-label', clearLabel);
  clear.append(el('span', 'ai-search-clear-icon', { 'aria-hidden': 'true' }));
  clear.hidden = true;
  field.append(label, icon, spinner, input, clear);

  const toggle = el('label', 'ai-search-toggle');
  const toggleInput = el('input', 'ai-search-toggle-input', { type: 'checkbox' });
  toggleInput.checked = true;
  const toggleText = textOf('summary toggle');
  if (toggleText) toggleInput.setAttribute('aria-label', toggleText);
  toggle.append(toggleInput, slot('ai-search-toggle-text', 'summary toggle'));
  form.append(field, toggle);

  // ---- summary (D4: never filled — no generative backend) ----
  const summaryLoading = el('div', 'ai-search-summary-loading', { 'aria-live': 'polite' });
  const loadingContent = el('div', 'ai-search-summary-loading-content');
  loadingContent.append(
    el('span', 'ai-search-summary-loading-indicator', { 'aria-hidden': 'true' }),
    slot('ai-search-summary-loading-text', 'generating'),
  );
  const loadingCard = el('div', 'ai-search-summary-card');
  loadingCard.append(loadingContent);
  summaryLoading.append(loadingCard);
  summaryLoading.hidden = true;

  const summary = el('div', 'ai-search-summary');
  const summaryCard = el('div', 'ai-search-summary-card');
  const header = el('div', 'ai-search-summary-header');
  const heading = el('div', 'ai-search-summary-heading');
  // the whitespace between the two lines keeps the source's text run ("… answer powered …")
  heading.append(
    slot('ai-search-summary-title', 'summary title'),
    '\n',
    slot('ai-search-summary-attribution', 'summary attribution'),
  );
  header.append(el('span', 'ai-search-summary-icon', { 'aria-hidden': 'true' }), heading);
  const sourcesSection = el('div', 'ai-search-sources-section');
  sourcesSection.append(slot('ai-search-sources-label', 'sources'), el('ul', 'ai-search-sources'));
  summaryCard.append(
    header,
    el('div', 'ai-search-summary-text'),
    sourcesSection,
    slot('ai-search-disclaimer', 'disclaimer'),
  );
  summary.append(summaryCard);
  summary.hidden = true;

  const error = el('div', 'ai-search-error');
  const retry = slot('ai-search-retry', 'retry');
  error.append(slot('ai-search-error-message', 'error'), retry);
  error.hidden = true;

  // ---- results ----
  const resultsSection = el('div', 'ai-search-results-section');
  const toolbar = el('div', 'ai-search-results-toolbar');
  const layoutGroup = el('div', 'ai-search-layout-toggle', { role: 'group' });
  const layoutLabel = textOf('results layout');
  if (layoutLabel) layoutGroup.setAttribute('aria-label', layoutLabel);
  const cardsBtn = slot('ai-search-layout-btn', 'cards', { 'aria-pressed': 'false' });
  const listBtn = slot('ai-search-layout-btn', 'list', { 'aria-pressed': 'true' });
  layoutGroup.append(cardsBtn, listBtn);
  toolbar.append(layoutGroup);
  const results = el('ul', 'ai-search-results');
  const resultsLabel = textOf('search results');
  if (resultsLabel) results.setAttribute('aria-label', resultsLabel);
  const loadMore = slot('ai-search-load-more', 'load more');
  loadMore.hidden = true;
  resultsSection.append(toolbar, results, loadMore);
  resultsSection.hidden = true;

  // unknown rows stay authored, out of sight (the derived attribute texts live on as the
  // placeholder / aria-labels above)
  const config = el('div', 'ai-search-config');
  config.hidden = true;
  config.append(...unknown);
  Object.keys(slots).filter((k) => ![
    'title', 'label', 'placeholder', 'clear', 'summary toggle', 'generating', 'summary title',
    'summary attribution', 'sources', 'disclaimer', 'error', 'retry', 'results layout', 'cards',
    'list', 'search results', 'load more',
  ].includes(k)).forEach((k) => config.append(...take(k)));

  block.replaceChildren(title, form, summaryLoading, summary, error, resultsSection);
  if (config.childNodes.length) block.append(config);

  // ---------- behaviour ----------
  let layout = 'list';
  let hits = [];
  let visible = 0;
  let current = '';
  let request = 0;

  const syncClear = () => show(clear, input.value.length > 0);
  const setLoading = (on) => {
    show(spinner, on);
    show(icon, !on);
  };

  const render = () => {
    if (!hits.length) {
      results.replaceChildren();
      show(resultsSection, false);
      show(loadMore, false);
      return;
    }
    results.replaceChildren(...hits.slice(0, visible).map((r) => resultItem(r, layout)));
    results.classList.remove('ai-search-results-refresh');
    results.classList.add('ai-search-results-refresh');
    show(resultsSection, true);
    show(loadMore, visible < hits.length);
  };

  const clearResults = () => {
    current = '';
    hits = [];
    visible = 0;
    request += 1;
    render();
    show(summary, false);
    show(summaryLoading, false);
    show(error, false);
    setLoading(false);
  };

  const runQuery = async () => {
    const query = input.value;
    if (!query) {
      clearResults();
      return;
    }
    if (query === current) return;
    current = query;
    request += 1;
    const id = request;
    const started = Date.now();
    setLoading(true);
    const rows = await loadIndex();
    if (id !== request) return;
    hits = rows ? searchIndex(rows, query) : [];
    visible = PAGE_SIZE;
    const wait = Math.max(0, MIN_SPINNER - (Date.now() - started));
    setTimeout(() => {
      if (id === request) setLoading(false);
    }, rows ? wait : 0);
    render();
  };

  input.addEventListener('input', syncClear);
  clear.addEventListener('click', () => {
    input.value = '';
    syncClear();
    clearResults();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runQuery();
  });
  toggleInput.addEventListener('change', () => {
    if (!toggleInput.checked) {
      show(summary, false);
      show(error, false);
      show(summaryLoading, false);
    }
  });
  const setLayout = (next) => {
    if (layout === next) return;
    layout = next;
    block.classList.toggle('ai-search-list', layout === 'list');
    block.classList.toggle('ai-search-card', layout === 'card');
    cardsBtn.setAttribute('aria-pressed', String(layout === 'card'));
    listBtn.setAttribute('aria-pressed', String(layout === 'list'));
    render();
  };
  asButton(cardsBtn, () => setLayout('card'));
  asButton(listBtn, () => setLayout('list'));
  asButton(loadMore, () => {
    visible += PAGE_SIZE;
    render();
  });
  asButton(retry, () => {});
}
