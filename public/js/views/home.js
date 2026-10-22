import { el, icon, ICONS } from '../lib/dom.js';
import { startWallpaper, wallpaperLayer } from '../lib/wallpaper.js';
import { t } from '../lib/i18n.js';
import { DEFAULT_STUDY, page, setStudyLang, studyLang } from '../lib/study.js';

/**
 * The home page: the site's name, and the languages it can be about.
 *
 * It is a level above every language — /es, /fr and /it each have their own
 * front page with the translator on it — so it is deliberately small. A title,
 * the choice, and a way in.
 *
 * Choosing a box does not go anywhere by itself. It previews: the wallpaper
 * turns to that language's city and the page's own words turn to that
 * language, so the reader sees what they are about to walk into. Enter, the
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
];

export function renderHome(main) {
  // The page opens on Spanish, and every visit starts there.
  setStudyLang(DEFAULT_STUDY);

  const wallpaper = wallpaperLayer();

  const lead = el('p', { class: 'home__lead' });
  const choose = el('p', { class: 'eyebrow', id: 'home-choose' });
  const enterLabel = el('span', {});
  const hint = el('p', { class: 'home__hint' });
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
    el('span', { class: 'langbox__code' }, language.code.toUpperCase()),
    el('span', { class: 'langbox__name' }, language.name),
    el('span', { class: 'langbox__english' }, language.english));
    return box;
  });

  // Not a button: there is nothing to press yet.
  const soon = el('div', { class: 'langbox langbox--soon', 'aria-disabled': 'true' },
    el('span', { class: 'langbox__code' }, icon('M12 5v14M5 12h14', { size: 22 })),
    soonTitle,
    soonBody);

  const grid = el('div', {
    class: 'langgrid',
    role: 'radiogroup',
    'aria-labelledby': 'home-choose',
  }, ...boxes, soon);

  const section = el('section', { class: 'home shell' },
    el('div', { class: 'home__inner' },
      el('h1', { class: 'hero__title home__title' }, 'ProfeGPT'),
      lead,
      choose,
      grid,
      el('div', { class: 'home__go' }, enter, hint)));

  main.append(wallpaper, section);

  /** The page's own words, in whichever language is chosen. */
  function paint() {
    lead.textContent = t('home.lead');
    choose.textContent = t('home.choose');
    enterLabel.textContent = t('home.enter');
    hint.textContent = t('home.hint');
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
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (step) {
      event.preventDefault();
      const next = LANGUAGES[(index + step + LANGUAGES.length) % LANGUAGES.length];
      select(next.code, { focus: true });
      return;
    }
    if (event.key === 'Enter') {
      // A focused button would fire its own click on Enter as well; one go is enough.
      event.preventDefault();
      go();
    }
  }

  paint();
  document.addEventListener('keydown', onKey);
  window.addEventListener('langchange', paint);
  const stopWallpaper = startWallpaper(wallpaper, null);

  return () => {
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('langchange', paint);
    stopWallpaper();
  };
}
