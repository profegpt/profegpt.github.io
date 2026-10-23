import { renderHome } from './views/home.js';
import { renderTranslatorPage } from './views/translator.js';
import { renderConjugator } from './views/conjugator.js';
import { renderDictionary } from './views/dictionary.js';
import { renderChat } from './views/chat.js';
import { clear } from './lib/dom.js';
import { mountSettings } from './lib/settings.js';
import { t } from './lib/i18n.js';
import {
  DEFAULT_STUDY, page, pageOf, setStudyLang, studyFromPath,
} from './lib/study.js';
import { BASE, withBase, withoutBase } from './lib/site.js';

/**
 * Every language has the same four pages, under its own prefix: /es/chat,
 * /fr/conjugacion, /it/diccionario. The paths keep their Spanish names on every
 * side — they are the site's, not the language's, and links that already exist
 * should keep working.
 *
 * The bare / is the home page, which belongs to no language.
 */
const ROUTES = [
  { path: '/', nav: 'traductor', render: renderTranslatorPage },
  { path: '/conjugacion', nav: 'conjugacion', render: renderConjugator },
  { path: '/diccionario', nav: 'diccionario', render: renderDictionary },
  { path: '/chat', nav: 'chat', render: renderChat },
];

const HOME = { path: '/', nav: null, render: renderHome, home: true };

const main = document.getElementById('main');

mountSettings(document.querySelector('.nav__end'));

/**
 * The site's own address, for the footer. Shown everywhere except on it — the
 * Apps Script build, a local server — so a reader always has the real URL to
 * bookmark or pass on. The address is its own label in every language.
 */
const WEBSITE = 'https://profegpt.github.io';

const NAV_KEYS = {
  traductor: 'translator',
  conjugacion: 'conjugation',
  diccionario: 'dictionary',
  chat: 'chat',
};

const NAV_PATHS = {
  traductor: '/#traductor',
  conjugacion: '/conjugacion',
  diccionario: '/diccionario',
  chat: '/chat',
};

/** Whether the page on screen is the home page, which has no language's links. */
let onHome = false;

function paintChrome() {
  document.documentElement.classList.toggle('is-home', onHome);
  for (const link of document.querySelectorAll('[data-nav]')) {
    const path = NAV_PATHS[link.dataset.nav];
    link.href = path.startsWith('/#') ? `${page()}${path.slice(1)}` : page(path);
    link.textContent = t(`nav.${NAV_KEYS[link.dataset.nav]}`);
  }
  const brand = document.querySelector('.nav__brand');
  brand.href = withBase('/');
  brand.title = t('home.back');
  document.querySelector('.skip-link').textContent = t('meta.skip');
  const footer = document.querySelector('.footer__text');
  clear(footer);
  // The dictionary's credit is a footnote on the dictionary page, where the
  // definitions are, rather than a line on every page of the site.
  if (`${window.location.origin}${BASE}` !== WEBSITE) {
    footer.appendChild(Object.assign(document.createElement('a'), {
      className: 'footer__site', href: WEBSITE, target: '_blank', rel: 'noopener', textContent: WEBSITE.replace(/^https:\/\//, ''),
    }));
  }
  footer.appendChild(Object.assign(document.createElement('span'), {
    className: 'footer__legal',
    textContent: t('meta.copyright'),
  }));
}

let teardown = null;
// Includes the query, so /conjugacion?v=ir re-renders when arriving from
// /conjugacion — the verb lives in the query, not the path.
let currentKey = null;

/**
 * The route for an address, settling the study language on the way.
 *
 * An address with no language on it that is not the home page is an old link
 * from before the languages had prefixes — /conjugacion?v=ir, say. Those were
 * all Spanish, so they are moved onto the Spanish side rather than broken.
 */
function match() {
  const { pathname, search, hash } = window.location;
  const study = studyFromPath(pathname);

  if (!study) {
    const path = withoutBase(pathname);
    if (path === '/' || path === '') return HOME;
    history.replaceState({}, '', withBase(`/${DEFAULT_STUDY}${path}${search}${hash}`));
    return match();
  }

  setStudyLang(study);
  const rest = pageOf(pathname).replace(/\/+$/, '') || '/';
  return ROUTES.find((route) => route.path === rest) ?? ROUTES[0];
}

function markActive(nav) {
  for (const link of document.querySelectorAll('[data-nav]')) {
    link.classList.toggle('is-active', link.dataset.nav === nav);
  }
}

function scrollToHash(hash) {
  if (!hash) return false;
  const target = document.getElementById(hash.slice(1));
  if (!target) return false;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

async function navigate() {
  const route = match();
  const { hash } = window.location;

  if (onHome !== Boolean(route.home)) {
    onHome = Boolean(route.home);
    paintChrome();
  }

  const key = window.location.pathname + window.location.search;
  if (key !== currentKey) {
    if (typeof teardown === 'function') teardown();
    teardown = null;
    clear(main);
    // Each page is drawn with its own picture, chosen in CSS off this.
    main.dataset.page = route.home ? 'home' : route.nav;
    document.title = route.home || route.path === '/'
      ? t('meta.home')
      : `ProfeGPT · ${t(`nav.${NAV_KEYS[route.nav]}`)}`;
    teardown = (await route.render(main)) || null;
    currentKey = key;
    if (!hash) window.scrollTo({ top: 0 });
  }

  markActive(route.nav);
  // Let the freshly mounted view lay out before jumping to an anchor.
  if (hash) requestAnimationFrame(() => scrollToHash(hash));
}

function onClick(event) {
  const link = event.target.closest('a[data-link]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

  const url = new URL(link.href, window.location.origin);
  if (url.origin !== window.location.origin) return;

  event.preventDefault();

  const samePage = url.pathname === window.location.pathname;
  if (samePage && url.hash) {
    history.replaceState({}, '', url.pathname + url.hash);
    scrollToHash(url.hash);
    return;
  }
  if (samePage && !url.hash && !window.location.hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  history.pushState({}, '', url.pathname + url.search + url.hash);
  navigate();
}

/** Views call this to move between pages from code. */
export function go(to) {
  const url = new URL(to, window.location.origin);
  history.pushState({}, '', url.pathname + url.search + url.hash);
  navigate();
}


document.addEventListener('click', onClick);
window.addEventListener('popstate', () => navigate());

// A language change rebuilds the current view, since every string is baked in
// at render time rather than bound. The home page is the exception: it repaints
// its own few words in place, so the chosen box keeps its focus.
window.addEventListener('langchange', () => {
  paintChrome();
  if (onHome) return;
  currentKey = null;
  navigate();
});

// A change of study language comes either from the address — in which case
// navigate() is already rebuilding the view — or from a box being chosen on
// the home page, which only needs the header and footer to follow.
window.addEventListener('studychange', paintChrome);

paintChrome();

navigate();
