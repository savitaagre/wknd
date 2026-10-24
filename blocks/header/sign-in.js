import { loadFragment } from '../fragment/fragment.js';

/**
 * WKND Sign In modal — the source's `[data-modal-url]` experience fragment
 * (language-masters/en/site/sign-in), rebuilt UI-only from the authored /fragments/sign-in
 * document. Owner decision D1: there is no authentication backend, so NOTHING is ever sent:
 * the inputs carry no `name` (a form without named fields serializes nothing), submission is
 * always prevented, and Enter / the SIGN IN control only navigate to the authored target (the
 * source's invalid-login landing page) without any credential.
 *
 * Document contract (section 0): headings (Sign In, Welcome Back) · one <p> per field label
 * (USERNAME, PASSWORD — a label matching /password/ becomes a password field) · link <p>s (the
 * LAST one is the submit control, its href the landing target; the others stay text links).
 *
 * Behaviour = live clientlib-site: a click (or Enter) on the Sign In trigger fades the modal in
 * (300 ms), any click outside it fades it out (200 ms) and is swallowed, clicking the trigger
 * again closes it; focus stays on the trigger; no scroll lock; Escape does not close it.
 *
 * @ew-exempt <p> field labels — kept in the DOM (visually hidden, inside the field's <label>);
 * the same text is the input's placeholder / aria-label (derived config, form controls cannot
 * host authored text)
 */

export const SIGN_IN_FRAGMENT = '/fragments/sign-in';
const FADE_IN = 300; // live: jQuery fadeIn(300)
const FADE_OUT = 200; // live: jQuery fadeOut(200)
const SWING = 'cubic-bezier(0.37, 0, 0.63, 1)'; // jQuery "swing" easing
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children.filter(Boolean));
  return node;
}

function fade(node, from, to, duration) {
  if (REDUCED.matches || !node.animate) return Promise.resolve();
  return node.animate([{ opacity: from }, { opacity: to }], { duration, easing: SWING }).finished
    .catch(() => {});
}

function buildField(label, index) {
  const text = label.textContent.trim();
  const input = document.createElement('input');
  input.className = 'sign-in-input';
  input.type = /password/i.test(text) ? 'password' : 'text';
  input.id = `sign-in-field-${index}`;
  input.placeholder = text;
  input.setAttribute('aria-label', text);
  input.spellcheck = true;
  label.classList.add('sign-in-label');
  const wrap = el('label', 'sign-in-field', label, input);
  wrap.htmlFor = input.id;
  return wrap;
}

/**
 * Builds the modal from the authored fragment (prefetched once) and wires the trigger.
 * @param {Element} block The header block (the modal lives inside it, fixed to the viewport)
 * @param {Function} unbutton The header's decorateButtons() undo
 */
export default async function decorateSignIn(block, unbutton) {
  const trigger = block.querySelector('.sign-in-link a');
  if (!trigger) return;
  const fragment = await loadFragment(SIGN_IN_FRAGMENT);
  const section = fragment?.querySelector(':scope > .section > .default-content-wrapper');
  if (!section) return;
  unbutton(fragment);

  const nodes = [...section.children];
  const headings = nodes.filter((n) => /^H[1-6]$/.test(n.tagName));
  // pipeline heading ids (#sign-in) would collide with the trigger's hash and the page's own ids
  headings.forEach((h) => h.removeAttribute('id'));
  const labels = nodes.filter((n) => n.tagName === 'P' && !n.querySelector('a'));
  const links = nodes.filter((n) => n.tagName === 'P' && n.querySelector('a'));
  const submitP = links.pop();
  const submit = submitP?.querySelector('a');

  const form = el('form', 'sign-in-form', ...labels.map(buildField));
  form.noValidate = true;
  links.forEach((p) => {
    p.classList.add('sign-in-text');
    form.append(p);
  });
  if (submit) {
    submitP.classList.add('sign-in-actions');
    submit.classList.add('sign-in-submit');
    submit.setAttribute('role', 'button');
    form.append(submitP);
  }
  const leftovers = nodes.filter((n) => !headings.includes(n) && !form.contains(n));
  const panel = el('div', 'sign-in-panel', ...headings, form, ...leftovers);
  panel.append(el('div', 'sign-in-separator'));
  const modal = el('div', 'sign-in-modal', panel);
  modal.id = 'wknd-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', headings[0]?.textContent.trim() || 'Sign In');
  block.append(modal);

  // D1: never send credentials — the landing target is reached by a plain GET, fields unnamed
  const land = () => {
    if (submit) window.location.assign(submit.href);
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    land();
  });
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('input')) {
      e.preventDefault();
      land();
    }
  });

  let open = false;
  let busy = false;
  const show = async () => {
    busy = true;
    open = true;
    modal.classList.add('is-open');
    await fade(modal, 0, 1, FADE_IN);
    busy = false;
  };
  const hide = async () => {
    busy = true;
    await fade(modal, 1, 0, FADE_OUT);
    modal.classList.remove('is-open');
    form.reset();
    open = false;
    busy = false;
  };
  document.addEventListener('click', (e) => {
    if (open) {
      // live: a click anywhere outside the modal (the trigger included) closes it and is swallowed
      if (!modal.contains(e.target)) {
        e.preventDefault();
        if (!busy) hide();
      }
      return;
    }
    if (!busy && trigger.contains(e.target)) {
      e.preventDefault();
      show();
    }
  });
}
