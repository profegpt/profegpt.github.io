import { el, icon } from '../lib/dom.js';
import { art } from '../lib/art.js';
import { t } from '../lib/i18n.js';
import { DEFAULT_STUDY, page, setStudyLang, studyLang } from '../lib/study.js';

/**
 * The home page: the site's name, and the languages it can be about.
 *
 * It is a level above every language — /es, /fr, /it, /de, /nl and /pt each
 * have their own front page with the translator on it — so it is deliberately small. A title,
 * the choice, and a way in.
 *
 * Choosing a card does not go anywhere by itself. It previews: the page's own
 * words turn to that language, so the reader sees what they are about to walk
 * into. Enter, the
 * button, or a second click on the chosen box goes in. Spanish is chosen when
 * the page opens, whatever was read last, because it is the site's default.
 *
 * The boxes are a radio group, so the arrow keys move between them and Enter
 * commits — the keyboard path is the same three steps as the mouse one.
 */

const LANGUAGES = [
  { code: 'es', name: 'Español', english: 'Spanish' },
  { code: 'fr', name: 'Français', english: 'French' },
  { code: 'it', name: 'Italiano', english: 'Italian' },
  { code: 'pt', name: 'Português', english: 'Portuguese' },
];

export function renderHome(main) {
  // The page opens on Spanish, and every visit starts there.
  setStudyLang(DEFAULT_STUDY);

  const lead = el('p', { class: 'home__lead' });
  const choose = el('span', {});
  const enterLabel = el('span', {});
  const soonTitle = el('span', { class: 'langbox__name' });
  const soonBody = el('span', { class: 'langbox__english' });

  const enter = el('button', { class: 'btn btn--primary home__enter', type: 'button', onclick: () => go() },
    enterLabel, icon('M5 12h14m0 0-6-6m6 6-6 6', { size: 16 }));

  const boxes = LANGUAGES.map((language) => {
    const box = el('button', {
      class: 'langbox',
      type: 'button',
      role: 'radio',
      'data-code': language.code,
      onclick: () => {
        // A second click on the one already chosen is as good as Enter.
        if (studyLang() === language.code) { go(); return; }
        select(language.code);
      },
      ondblclick: () => go(),
    },
    picture(language.code),
    el('span', { class: 'langbox__code' }, language.code.toUpperCase()),
    el('span', { class: 'langbox__name' }, language.name),
    el('span', { class: 'langbox__english' }, language.english));
    return box;
  });

  // Not a button: there is nothing to press yet.
  const soon = el('div', { class: 'langbox langbox--soon', 'aria-disabled': 'true' },
    art('soon', { className: 'langbox__art' }),
    // An empty code line, so the name sits level with the other three.
    el('span', { class: 'langbox__code', 'aria-hidden': 'true' }, '\u00a0'),
    soonTitle,
    soonBody);

  const grid = el('div', {
    class: 'langgrid',
    role: 'radiogroup',
    'aria-labelledby': 'home-choose',
  }, ...boxes, soon);

  // Duolingo's front page: the name huge on the left with a line under it, the
  // globe on the right, and the choice below a rule.
  const hero = el('section', { class: 'hero shell' },
    el('div', { class: 'hero__copy' },
      el('h1', { class: 'hero__title' }, 'profegpt'),
      lead),
    el('div', { class: 'hero__art' }, spinningGlobe()));

  const section = el('section', { class: 'home shell' },
    el('h2', { class: 'section__title', id: 'home-choose' }, choose),
    grid,
    el('div', { class: 'home__go' }, enter));

  main.append(hero, el('hr', { class: 'rule' }), section);

  /** The page's own words, in whichever language is chosen. */
  function paint() {
    lead.textContent = t('home.lead');
    choose.textContent = t('home.choose');
    enterLabel.textContent = t('home.enter');
    soonTitle.textContent = t('home.soon');
    soonBody.textContent = t('home.soonBody');
    document.title = t('home.title');

    for (const box of boxes) {
      const on = box.dataset.code === studyLang();
      box.classList.toggle('is-active', on);
      box.setAttribute('aria-checked', String(on));
      // Roving tabindex: Tab lands on the chosen box, arrows move within.
      box.tabIndex = on ? 0 : -1;
    }
  }

  function select(code, { focus = false } = {}) {
    setStudyLang(code);
    paint();
    if (focus) boxes.find((box) => box.dataset.code === code)?.focus();
  }

  function go() {
    history.pushState({}, '', page('/', studyLang()));
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function onKey(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    // Typing in the settings menu's passcode field is not choosing a language.
    if (event.target.closest?.('input, textarea, .settings')) return;

    const index = LANGUAGES.findIndex((language) => language.code === studyLang());
    const count = LANGUAGES.length;
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (step) {
      event.preventDefault();
      select(LANGUAGES[(index + step + count) % count].code, { focus: true });
      return;
    }
    // The boxes stand in rows, so up and down move a row rather than one box.
    // Below the last full row the nearest thing underneath is the last box.
    const row = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (row) {
      event.preventDefault();
      const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
      let next = index + row * columns;
      if (next >= count && Math.floor(index / columns) < Math.floor((count - 1) / columns)) next = count - 1;
      if (next >= 0 && next < count) select(LANGUAGES[next].code, { focus: true });
      return;
    }
    if (event.key === 'Enter') {
      // A focused button would fire its own click on Enter as well; one go is enough.
      event.preventDefault();
      go();
    }
  }

  // Rest on a card for a moment and its landmark is built; leave and it resets.
  const timers = new Map();
  for (const box of boxes) {
    box.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse' || reducedMotion()) return;
      clearTimeout(timers.get(box));
      timers.set(box, setTimeout(() => box.classList.add('is-building'), BUILD_DELAY));
    });
    box.addEventListener('pointerleave', () => {
      clearTimeout(timers.get(box));
      box.classList.remove('is-building');
    });
  }

  paint();
  document.addEventListener('keydown', onKey);
  window.addEventListener('langchange', paint);
  return () => {
    for (const timer of timers.values()) clearTimeout(timer);
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('langchange', paint);
  };
}

const BUILD_DELAY = 700;

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/*
 * Where each landmark stands on its 560 x 480 canvas (scripts/draw-art.py):
 * left and right edges, top and foot. The crane stands just left of it and
 * lifts a beam from the foot to the top while the landmark is revealed
 * behind the beam, a band at a time.
 */
const SITES = {
  es: { left: 103, right: 363, top: 51, foot: 423 },
  fr: { left: 107, right: 321, top: 45, foot: 430 },
  it: { left: 136, right: 272, top: 85, foot: 392 },
  // draw-art.py prints these three as it draws them
  de: { left: 61, right: 377, top: 65, foot: 411 },
  nl: { left: 70, right: 338, top: 62, foot: 414 },
  pt: { left: 72, right: 358, top: 65, foot: 411 },
};

function crane({ left, right, top, foot }) {
  const mast = left - 34;
  const jib = Math.max(8, top - 40);
  const cx = Math.round((left + right) / 2);
  const beamW = Math.round((right - left) * 0.8);
  const hookH = 12;
  const cable = foot - 6 - hookH - (jib + 10);
  return `<svg class="langbox__crane" viewBox="0 0 560 480" aria-hidden="true">
    <rect x="${mast}" y="${jib}" width="14" height="${foot - jib}" rx="4" fill="#FFC800"/>
    <rect x="${mast + 8}" y="${jib}" width="6" height="${foot - jib}" rx="3" fill="#E5A400"/>
    <rect x="${mast - 36}" y="${jib}" width="${cx - mast + 64}" height="10" rx="5" fill="#FFC800"/>
    <rect x="${mast - 36}" y="${jib + 6}" width="${cx - mast + 64}" height="4" rx="2" fill="#E5A400"/>
    <rect x="${mast - 34}" y="${jib + 10}" width="22" height="18" rx="4" fill="#777777"/>
    <rect x="${mast + 14}" y="${jib + 10}" width="18" height="16" rx="4" fill="#1CB0F6"/>
    <rect x="${mast - 18}" y="${foot - 8}" width="50" height="10" rx="5" fill="#AFAFAF"/>
    <g class="langbox__lift">
      <rect class="langbox__cable" x="${cx - 1.5}" y="${jib + 10}" width="3" height="${cable}" fill="#4B4B4B"/>
      <g class="langbox__beam">
        <rect x="${cx - 8}" y="${foot - 6 - hookH}" width="16" height="${hookH}" rx="3" fill="#777777"/>
        <rect x="${cx - beamW / 2}" y="${foot - 6}" width="${beamW}" height="12" rx="6" fill="#CD7900"/>
        <rect x="${cx - beamW / 2}" y="${foot - 6}" width="${beamW}" height="8" rx="4" fill="#FF9600"/>
      </g>
    </g>
  </svg>`;
}

/** A language's picture as layers: the landmark, its food in front, and a crane. */
function picture(code) {
  const site = SITES[code];
  const box = el('span', { class: 'langbox__art langbox__pic' },
    art(`${code}-landmark`, { className: 'langbox__layer langbox__landmark' }),
    art(`${code}-food`, { className: 'langbox__layer langbox__food' }));
  if (!site) return box;
  const rise = site.foot - site.top;
  const cable = site.foot - 6 - 12 - (Math.max(8, site.top - 40) + 10);
  box.style.setProperty('--top', `${(site.top / 480 * 100).toFixed(2)}%`);
  box.style.setProperty('--foot', `${(site.foot / 480 * 100).toFixed(2)}%`);
  box.style.setProperty('--rise', `${-rise}px`);
  box.style.setProperty('--cable', ((cable - rise) / cable).toFixed(3));
  box.insertAdjacentHTML('beforeend', crane(site));
  return box;
}

/*
 * The home picture, with the globe's sphere drawn again on top of it for a
 * moment: the same sea, land and clouds as mascot.svg, twice side by side,
 * slid one width east and then taken away, so the globe turns once and
 * stops exactly as drawn. Every time the home page is drawn: on opening the
 * site, and on coming back to it.
 */
const LAND = [
  [-93.4, -134.9, 81.3, 79.6, 39.8], [-134.9, -86.5, 79.6, 86.5, 41.5], [32.9, -86.5, 60.5, 50.2, 25.1],
  [57.1, -126.3, 84.8, 69.2, 34.6], [-6.9, -27.7, 119.4, 81.3, 40.6], [36.3, 15.6, 69.2, 74.4, 34.6],
  [-138.4, 17.3, 93.4, 83, 41.5],
];
const CLOUDS = [
  [-31.1, -106.4, 53.6, 33.7, 16.9], [-115.9, -83.9, 70.9, 33.7, 16.9], [-77, -61.4, 54.5, 33.7, 16.9],
  [79.6, 28.5, 55.4, 33.7, 16.9], [13.8, 74.4, 76.1, 32.9, 16.4],
];
const rects = (list, fill) => list.map(([x, y, w, h, r]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`).join('');

function spinningGlobe() {
  const wrap = el('span', { class: 'hero__globe' }, art('mascot'));
  if (reducedMotion()) return wrap;
  const face = rects(LAND, '#78C800') + rects(CLOUDS, '#CCEFFF');
  wrap.insertAdjacentHTML('beforeend', `<svg class="hero__spin" viewBox="0 0 560 480" aria-hidden="true">
    <clipPath id="hero-spin-clip"><circle r="128"/></clipPath>
    <g transform="translate(272 206) scale(0.92)" clip-path="url(#hero-spin-clip)">
      <rect x="-130" y="-130" width="260" height="260" fill="#92E4FF"/>
      <g class="hero__spin-face">${face}<g transform="translate(-260 0)">${face}</g></g>
    </g>
  </svg>`);
  const overlay = wrap.lastElementChild;
  overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
  // A safety net, in case the animation never runs (a background tab).
  setTimeout(() => overlay.remove(), 3000);
  return wrap;
}
