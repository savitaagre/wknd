import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
  getMetadata,
} from './aem.js';

/** wknd.site locale roots are `/{country}/{language}`; `/us/en` uses the root chrome. */
const DEFAULT_LOCALE_ROOT = '/us/en';

/**
 * The locale a path belongs to, from its first two segments (`/ca/en/faqs` → en-CA).
 * @param {string} [pathname] Defaults to the current page
 * @returns {{root: string, country: string, language: string, tag: string}|null}
 */
export function getLocale(pathname = window.location.pathname) {
  const match = /^\/([a-z]{2})\/([a-z]{2})(?=[/.]|$)/.exec(pathname.toLowerCase());
  if (!match) return null;
  const [, country, language] = match;
  return {
    root: `/${country}/${language}`,
    country,
    language,
    tag: `${language}-${country.toUpperCase()}`,
  };
}

/**
 * The chrome document (`nav` / `footer`) for the current page:
 * 1. page metadata `nav` / `footer` (an author override) wins;
 * 2. else the locale root's own document (`/ca/en/nav`, `/us/es/footer` …);
 * 3. else the site default (`/nav`, `/footer`) — en-US and any non-locale page.
 * Callers fall back to the site default when a locale document does not exist.
 * @param {string} name `nav` or `footer`
 * @returns {string} the document path
 */
export function getChromePath(name) {
  const meta = getMetadata(name);
  if (meta) return new URL(meta, window.location).pathname;
  const locale = getLocale();
  if (locale && locale.root !== DEFAULT_LOCALE_ROOT) return `${locale.root}/${name}`;
  return `/${name}`;
}

const pagePath = (path) => path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';

/**
 * Current-page markers on a chrome nav list (wknd.site `--active` items): the link to the
 * current page gets `aria-current="page"`; on a deeper page the level-1 item whose link is an
 * ancestor of the current path gets `is-active` (e.g. a program page marks Adventures).
 * @param {Element} list The nav list (level-0 `ul > li` wrapping the level-1 `ul`)
 */
export function markCurrentNav(list) {
  const here = pagePath(window.location.pathname);
  list.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.href, window.location);
    if (url.origin !== window.location.origin) return;
    const target = pagePath(url.pathname);
    const item = a.closest('li');
    if (target === here) {
      a.setAttribute('aria-current', 'page');
    } else if (item?.parentElement.closest('li') && here.startsWith(`${target}/`)) {
      item.classList.add('is-active');
    }
  });
}

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    // DA has no aria-label field: an authored link title that differs from the
    // link text is also the source's accessible name (e.g. "read our articles").
    // The authored title itself is kept (source titles such as "localization"
    // survive); no title is derived from the link text (source links carry none).
    const authoredTitle = a.getAttribute('title');
    if (authoredTitle && authoredTitle !== a.textContent.trim() && !a.hasAttribute('aria-label')) {
      a.setAttribute('aria-label', authoredTitle);
    }
    const p = a.closest('p');
    const text = a.textContent.trim();

    // never buttonize breadcrumb trail links — they are navigation, not CTAs
    if (a.closest('.breadcrumbs')) return;

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    const strong = a.closest('strong');
    const em = a.closest('em');

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else if (em) {
      a.classList.add('secondary');
      em.replaceWith(a);
    } else {
      // wknd authors CTAs as a bare, single-link paragraph (no strong/em).
      // Promote any such solo-link paragraph to the signature yellow CTA so
      // every CTA-style link renders uniformly across templates. This only
      // catches paragraphs whose sole content is one link — block links that
      // are not wrapped in <p> (breadcrumbs) or live inside a heading (card
      // titles) never match, and header/footer are decorated separately.
      a.classList.add('primary');
    }
  });
}

/**
 * Apply section-metadata to its section, then remove the metadata block.
 *
 * The vendored scripts/aem.js in this project does NOT process
 * `<div class="section-metadata">` (it neither reads the `style` rows to add a
 * class to the section nor removes the block). Without this, a section style
 * (`separator`, `plain-title`, `article-body` …, styles/styles.css) never
 * reaches its section and the raw "style / …" table renders as a visible (and
 * 404-loading) block. Replicate the standard EDS behaviour here: read each
 * section-metadata block's `style` value(s), add them as classes to the parent
 * section, and drop the block. Runs after decorateSections (so wrappers exist)
 * and before decorateBlocks (so the block is gone before it would be decorated).
 */
function applySectionMetadata(main) {
  main.querySelectorAll(':scope > .section .section-metadata').forEach((meta) => {
    const section = meta.closest('.section');
    [...meta.children].forEach((row) => {
      const cells = [...row.children];
      const key = (cells[0]?.textContent || '').trim().toLowerCase();
      const val = (cells[1]?.textContent || '').trim();
      if (key === 'style' && val) {
        val.split(',').forEach((cls) => {
          const token = cls.trim().replace(/\s+/g, '-').toLowerCase();
          if (token) section.classList.add(token);
        });
      }
    });
    // remove the metadata block and its wrapper so it isn't decorated/shown
    (meta.closest('.section-metadata-wrapper') || meta).remove();
  });

  // drop any now-empty section wrappers left behind (a phantom grid / flex item)
  main.querySelectorAll(':scope > .section > div:empty').forEach((w) => w.remove());
}

/**
 * An image caption (source .cmp-image__title) is authored as a paragraph whose only
 * content is one <em>, right after an image paragraph. CSS cannot tell it from body
 * copy holding one inline <em> among text nodes, so it is marked `p.image-caption`
 * here (class only; no node moves). An <em><strong> line stays body copy.
 * @param {Element} main The main element
 */
function markImageCaptions(main) {
  main.querySelectorAll('.default-content-wrapper > p').forEach((p) => {
    const prev = p.previousElementSibling;
    if (!prev || !prev.matches('p') || !prev.querySelector('img')) return;
    const nodes = [...p.childNodes].filter((n) => n.nodeType !== 3 || n.textContent.trim());
    if (nodes.length === 1 && nodes[0].nodeName === 'EM'
      && !nodes[0].querySelector('strong, b, img, picture')) {
      p.classList.add('image-caption');
    }
  });
}

/**
 * The delivery pipeline emits an authored image `title` as `data-title`;
 * restore the attribute so images carry their authored title (source parity).
 * @param {Element} main The main element
 */
function restoreImageTitles(main) {
  main.querySelectorAll('img[data-title]').forEach((img) => {
    if (!img.title) img.title = img.dataset.title;
    img.removeAttribute('data-title');
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  restoreImageTitles(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  applySectionMetadata(main);
  markImageCaptions(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  // wknd.site: <html lang> is the page's locale (en-US, en-CA, es-US, de-CH …)
  document.documentElement.lang = getLocale()?.tag || 'en-US';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('body > header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  // magazine-article pages get a right-hand sidebar (share links + index-driven
  // related articles) and a two-column layout, matching wknd. No-op elsewhere.
  try {
    const { default: decorateMagazineSidebar } = await import('./magazine-sidebar.js');
    await decorateMagazineSidebar(main);
  } catch (e) {
    // sidebar is non-critical; ignore failures
  }

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('body > footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  import('./consent-check.js');
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
