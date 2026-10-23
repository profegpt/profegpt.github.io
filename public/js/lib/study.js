/**
 * The language the site is *about*.
 *
 * ProfeGPT is one site with a side per language — Spanish, French, Italian —
 * each with the same pages and the same engines, pointed at
 * a different language. Everything that reads as content (verb forms,
 * dictionary headwords, grammar notes, the tutor's answers) comes from
 * whichever pack this returns.
 *
 * The address says which side you are on: /es/conjugacion, /fr/diccionario,
 * /it/chat. The bare / is the home page, where the language is chosen. So a
 * link someone sends you opens the language they were reading, rather than
 * whichever one your own browser happened to visit last.
 *
 * Distinct from lib/i18n.js, which is the language of the *chrome*. The two
 * are related but not the same: on the French side the interface is French or
 * English, on the Spanish side Spanish or English.
 */

import { withBase, withoutBase } from './site.js';

export const STUDY_LANGUAGES = ['es', 'fr', 'it'];

/** The default, and the one the home page has selected when it opens. */
export const DEFAULT_STUDY = 'es';

function valid(value) {
  return STUDY_LANGUAGES.includes(value) ? value : DEFAULT_STUDY;
}

/** The side of the site a path belongs to, or null for the home page. */
export function studyFromPath(pathname) {
  const first = withoutBase(pathname).split('/')[1];
  return STUDY_LANGUAGES.includes(first) ? first : null;
}

/** The rest of the path once the language is taken off: /es/chat → /chat. */
export function pageOf(pathname) {
  const path = withoutBase(pathname);
  return studyFromPath(path)
    ? path.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/'
    : path || '/';
}

// The engines and the tutor are tested in Node, which has no address bar; they
// are always told their language explicitly there.
const inBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

let current = valid(inBrowser ? studyFromPath(window.location.pathname) : null);

// The pre-paint script in index.html has usually set this already. Not on Apps
// Script, though, where the page's real path is only put in place after that
// script has run — so it is set again here, from the address as it now stands.
if (inBrowser && document.documentElement) document.documentElement.dataset.study = current;

/** @returns {'es'|'fr'|'it'} */
export function studyLang() {
  return current;
}

/**
 * A page on the current side of the site. Views link through this rather
 * than writing `/conjugacion` by hand, so a link never drops you from the
 * Italian side onto the Spanish one.
 *
 * `/` is the language's own front page — the translator — not the home page,
 * which is a level above every language.
 */
export function page(path = '/', study = current) {
  const rest = path === '/' ? '' : path;
  return withBase(`/${study}${rest}`);
}

/**
 * Switch the site's subject language.
 *
 * Fires `studychange` so anything painted outside a view — the header, the
 * footer — can follow. The router calls this as it navigates; nothing else
 * should need to, since the language lives in the address.
 */
export function setStudyLang(next) {
  const value = valid(next);
  if (value === current) return current;
  current = value;
  // Anything chosen in CSS by language reads this attribute, so it has to move
  // with the subject rather than waiting for a view to re-render.
  document.documentElement.dataset.study = current;
  window.dispatchEvent(new CustomEvent('studychange', { detail: { study: current } }));
  return current;
}
