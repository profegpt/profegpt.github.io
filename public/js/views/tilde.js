import { el, icon, ICONS, clear } from '../lib/dom.js';
import { t } from '../lib/i18n.js';
import { page } from '../lib/study.js';
import { PERSON_LABELS } from '../lib/conjugator.js';
import {
  MAX_GUESSES, answerFor, check, currentStreak, emptyStats, keyStates, letters, lexicon,
  nextMidnight, puzzleNumber, record, score, shareText,
} from '../lib/tilde.js';

/**
 * Tilde, the daily word game — on the Spanish side only (the router offers it
 * nowhere else). The rules are lib/tilde.js; this is the board, the keyboard
 * and what is kept between visits.
 *
 * The words are two generated modules (scripts/build-tilde.mjs), a few hundred
 * kilobytes between them, so they are imported here, when the page opens, and
 * not with the rest of the site. The Apps Script build, which has no files to
 * fetch, carries them inline and hands them over the same way.
 *
 * What is kept is the day's guesses, whether the hint was used, and the stats,
 * all in this browser's storage. Nothing leaves it: there is no server behind
 * the game, so it plays the same on the Node server, on GitHub Pages and on
 * Apps Script. Storage that is blocked costs only the memory of it.
 */

const STORE = 'profegpt:tilde';

const KEY_ROWS = [
  ['á', 'é', 'í', 'ó', 'ú', 'ü'],
  [...'qwertyuiop'],
  [...'asdfghjklñ'],
  ['enter', ...'zxcvbnm', 'delete'],
];

/**
 * Typing an accent on a keyboard that has none: the vowel, then the mark.
 * a then ' gives á, u then " gives ü, n then ~ gives ñ. A Spanish keyboard or a
 * Mac's dead keys send the accented letter itself, which needs nothing here.
 */
const ACUTE = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
const MARKS = { "'": ACUTE, '´': ACUTE, '"': { u: 'ü' }, '¨': { u: 'ü' }, '~': { n: 'ñ' } };

/** The imperative has persons the tense tables do not: usted and ustedes alone. */
const IMPERATIVE_PERSONS = { tu: 'tú', usted: 'usted', ustedes: 'ustedes' };

/** How long a row takes to turn over, so the result waits for the last tile. */
const FLIP_STEP = 70;
const FLIP_TIME = 220;

function readStore() {
  try { return JSON.parse(localStorage.getItem(STORE)) ?? {}; } catch { return {}; }
}

function writeStore(value) {
  try { localStorage.setItem(STORE, JSON.stringify(value)); } catch { /* blocked: this visit only */ }
}

const still = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// The words, loaded once a visit and kept, so coming back to the page is instant.
let loading = null;
function loadWords() {
  loading ??= Promise.all([import('../data/tilde-answers.js'), import('../data/tilde-words.js')])
    .then(([answers, guesses]) => ({ answers: answers.ANSWERS, lex: lexicon(guesses.GUESSES) }))
    .catch((error) => { loading = null; throw error; });
  return loading;
}

export function renderTilde(main) {
  const root = el('div', { class: 'tilde' },
    el('p', { class: 'tilde__loading' }, el('span', { class: 'spinner' }), ' ', t('tilde.loading')));

  main.append(el('div', { class: 'page shell' },
    el('div', { class: 'page__head' },
      el('p', { class: 'eyebrow' }, t('tilde.title')),
      el('h1', {}, t('tilde.title')),
      el('p', {}, t('tilde.lead'))),
    root,
    footnote()));

  let game = null;
  let midnight = null;
  let alive = true;

  // A page left open past midnight starts the new puzzle by itself.
  function start() {
    loadWords().then((data) => {
      if (!alive) return;
      game?.stop();
      clear(root);
      game = play(root, data);
    }).catch(() => {
      if (!alive) return;
      clear(root);
      root.append(el('p', { class: 'error' }, t('tilde.loadFailed')));
    });
    clearTimeout(midnight);
    midnight = setTimeout(start, Math.max(1000, nextMidnight() - Date.now() + 500));
  }
  start();

  return () => {
    alive = false;
    game?.stop();
    clearTimeout(midnight);
  };
}

// ---------------------------------------------------------------------------

function play(root, { answers, lex }) {
  const number = Math.max(1, puzzleNumber());
  const entry = answerFor(number, answers);
  const answer = entry.word;
  const size = letters(answer).length;

  const stored = readStore();
  let stats = { ...emptyStats(), ...stored.stats };
  const saved = stored.game?.number === number ? stored.game : null;
  const state = {
    guesses: (saved?.guesses ?? []).filter((guess) => typeof guess === 'string' && letters(guess).length === size).slice(0, MAX_GUESSES),
    hint: Boolean(saved?.hint),
    typing: [],
  };
  const persist = () => writeStore({ stats, game: { number, guesses: state.guesses, hint: state.hint } });
  const won = () => state.guesses.at(-1) === answer;
  let timer = null;
  const over = () => won() || state.guesses.length >= MAX_GUESSES;

  // --- the board -----------------------------------------------------------

  const rows = Array.from({ length: MAX_GUESSES }, (_, r) => el('div', {
    class: 'tilde__row', role: 'group', 'aria-label': t('tilde.row', { n: r + 1 }),
  }, ...Array.from({ length: size }, () => el('div', { class: 'tile' }))));
  const board = el('div', { class: 'tilde__board', 'aria-label': t('tilde.board') }, ...rows);
  // The board, the bar over it and the hint are all as wide as the word.
  root.style.setProperty('--size', size);

  function paintRow(r, word, { reveal = false } = {}) {
    const chars = letters(word);
    const states = r < state.guesses.length ? score(word, answer) : null;
    [...rows[r].children].forEach((tile, i) => {
      const letter = chars[i] ?? '';
      tile.textContent = letter;
      tile.className = 'tile';
      tile.removeAttribute('aria-label');
      tile.style.animationDelay = '';
      if (!letter) return;
      if (!states) { tile.classList.add('tile--filled'); return; }
      tile.classList.add(`tile--${states[i]}`);
      tile.setAttribute('aria-label', `${letter}, ${t(`tilde.state.${states[i]}`)}`);
      if (reveal && !still()) {
        tile.classList.add('tile--flip');
        tile.style.animationDelay = `${i * FLIP_STEP}ms`;
      }
    });
  }

  const paintTyping = () => {
    if (state.guesses.length < MAX_GUESSES) paintRow(state.guesses.length, state.typing.join(''));
  };

  // --- the line under it ---------------------------------------------------

  const message = el('p', { class: 'tilde__message', 'aria-live': 'polite' });
  const say = (...parts) => message.replaceChildren(...parts);

  /** "¿Querías decir canción?" — and the word, pressed, goes into the row. */
  function offer(suggestions) {
    const parts = [t('tilde.didYouMean'), ' '];
    suggestions.slice(0, 3).forEach((word, i) => {
      if (i) parts.push(` ${t('tilde.or')} `);
      parts.push(el('button', {
        class: 'tilde__suggestion',
        type: 'button',
        lang: 'es',
        onclick: () => { state.typing = letters(word); paintTyping(); say(); },
      }, word));
    });
    parts.push('?');
    say(...parts);
  }

  // --- the keyboard --------------------------------------------------------

  const keys = new Map();
  const keyboard = el('div', { class: 'keys', role: 'group', 'aria-label': t('tilde.keyboard') },
    ...KEY_ROWS.map((row, r) => el('div', { class: `keys__row${r === 0 ? ' keys__row--accents' : ''}` },
      ...row.map((key) => {
        const label = key === 'enter' ? t('tilde.enter') : key === 'delete' ? icon(ICONS.backspace, { size: 22 }) : key;
        const button = el('button', {
          class: `key${key.length > 1 ? ' key--wide' : ''}`,
          type: 'button',
          'data-key': key,
          'aria-label': key === 'delete' ? t('tilde.delete') : null,
          // The keyboard never takes focus, so Enter afterwards still means
          // "send this guess" rather than "press the last key again".
          onmousedown: (event) => event.preventDefault(),
          onclick: () => press(key),
        }, label);
        keys.set(key, button);
        return button;
      }))));

  function paintKeys() {
    const known = keyStates(state.guesses, answer);
    for (const [key, button] of keys) {
      button.classList.remove('key--correct', 'key--accent', 'key--present', 'key--absent');
      if (known.has(key)) button.classList.add(`key--${known.get(key)}`);
    }
  }

  function press(key) {
    if (over()) return;
    if (key === 'enter') { submit(); return; }
    say();
    if (key === 'delete') state.typing.pop();
    else if (state.typing.length < size) state.typing.push(key);
    paintTyping();
  }

  function mark(symbol) {
    const last = state.typing.at(-1);
    const marked = MARKS[symbol]?.[last];
    if (!marked || over()) return;
    state.typing[state.typing.length - 1] = marked;
    paintTyping();
  }

  function submit() {
    if (state.typing.length < size) { say(t('tilde.tooShort')); return; }
    const word = state.typing.join('');
    const verdict = check(word, lex);
    if (!verdict.ok) {
      // Not a word: the turn is kept, and an accent slip is offered its word.
      if (verdict.suggestions.length) offer(verdict.suggestions);
      else say(t('tilde.unknown', { word }));
      return;
    }
    state.guesses.push(word);
    state.typing = [];
    if (over()) stats = record(stats, number, state.guesses, answer);
    persist();
    paintRow(state.guesses.length - 1, word, { reveal: true });
    paintTyping();
    paintKeys();
    if (over()) {
      hintButton.hidden = true;
      const wait = still() ? 0 : (size - 1) * FLIP_STEP + FLIP_TIME;
      timer = setTimeout(finish, wait);
    }
  }

  function onKey(event) {
    if (event.ctrlKey || event.metaKey || event.defaultPrevented) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input, textarea, select, [contenteditable], .settings')) return;
    const { key } = event;
    if (key === 'Enter') {
      // Enter on a focused button or link is that button's.
      if (target?.closest('button, a')) return;
      event.preventDefault();
      press('enter');
    } else if (key === 'Backspace') {
      event.preventDefault();
      press('delete');
    } else if (key in MARKS) {
      event.preventDefault();
      mark(key);
    } else {
      const letter = key.normalize('NFC').toLowerCase();
      if (/^[a-zñáéíóúü]$/.test(letter)) {
        event.preventDefault();
        press(letter);
      }
    }
  }
  document.addEventListener('keydown', onKey);

  // --- the hint ------------------------------------------------------------

  const hintBox = el('div', { class: 'tilde__hint', hidden: true });
  const hintButton = el('button', {
    class: 'btn btn--sm',
    type: 'button',
    title: t('tilde.hintLabel'),
    onclick: () => { state.hint = true; persist(); showHint(); },
  }, icon(ICONS.bulb, { size: 16 }), t('tilde.hint'));

  function showHint() {
    hintButton.hidden = true;
    hintBox.hidden = false;
    hintBox.replaceChildren(
      el('p', { class: 'tilde__label' }, t('tilde.hintTitle')),
      el('p', { class: 'tilde__sentence', lang: 'es' }, ...blanked(entry.hint.text, size)),
      el('p', { class: 'tilde__english', lang: 'en' }, entry.hint.en),
      credit(entry.hint));
  }

  // --- the end -------------------------------------------------------------

  function finish() {
    keyboard.replaceWith(result());
    paintStats();
  }

  function result() {
    const verdict = won() ? t('tilde.won').split('|')[state.guesses.length - 1] : t('tilde.lost');
    const share = el('button', { class: 'btn btn--primary', type: 'button' }, icon(ICONS.copy, { size: 16 }), t('tilde.share'));
    share.addEventListener('click', async () => {
      const done = await copy(shareText(number, state.guesses, answer, { hint: state.hint }));
      share.lastChild.textContent = done ? t('tilde.copied') : t('tilde.copyFailed');
      setTimeout(() => { if (share.isConnected) share.lastChild.textContent = t('tilde.share'); }, 1600);
    });

    const lemma = entry.kind === 'verb' ? entry.forms[0].lemma : null;
    const look = el('a', {
      class: 'btn',
      href: `${page('/diccionario')}?q=${encodeURIComponent(lemma ?? answer)}`,
      'data-link': '',
    }, t('tilde.lookUp'), icon('M5 12h14m0 0-6-6m6 6-6 6', { size: 14 }));
    const conjugate = lemma ? el('a', {
      class: 'btn',
      href: `${page('/conjugacion')}?v=${encodeURIComponent(lemma)}`,
      'data-link': '',
    }, t('tilde.conjugate', { verb: lemma })) : null;

    return el('section', { class: 'tilde__result', 'aria-live': 'polite' },
      el('p', { class: `tilde__verdict${won() ? '' : ' tilde__verdict--lost'}` }, verdict),
      el('p', { class: 'tilde__label' }, t('tilde.was')),
      el('h2', { class: 'tilde__answer', lang: 'es' }, answer),
      ...describe(entry),
      el('div', { class: 'tilde__example' },
        el('p', { class: 'tilde__sentence', lang: 'es' }, ...filled(entry.hint.text, answer)),
        el('p', { class: 'tilde__english', lang: 'en' }, entry.hint.en),
        credit(entry.hint)),
      el('div', { class: 'tilde__actions' }, share, look, conjugate),
      el('p', { class: 'tilde__next' }, t('tilde.tomorrow')));
  }

  // --- the side: how to play, and the numbers ---------------------------------

  const statsBox = el('section', { class: 'tilde__card tilde__stats' });

  function paintStats() {
    const rate = stats.played ? Math.round((stats.won / stats.played) * 100) : 0;
    const most = Math.max(1, ...stats.dist);
    const today = over() && won() && stats.last === number ? state.guesses.length : 0;
    statsBox.replaceChildren(
      el('h2', { class: 'tilde__card-title' }, t('tilde.stats')),
      el('dl', { class: 'tilde__numbers' },
        ...[[stats.played, 'played'], [rate, 'winRate'], [currentStreak(stats, number), 'streak'], [stats.best, 'best']]
          .map(([value, label]) => el('div', {}, el('dd', {}, String(value)), el('dt', {}, t(`tilde.${label}`))))),
      el('p', { class: 'tilde__label' }, t('tilde.guesses')),
      el('div', { class: 'tilde__dist' },
        ...stats.dist.map((count, i) => el('div', { class: `tilde__bar${today === i + 1 ? ' is-today' : ''}` },
          el('span', {}, String(i + 1)),
          el('span', { class: 'tilde__fill', style: { width: `${Math.max(8, (count / most) * 100)}%` } }, String(count))))));
  }

  const sample = (letter, kind) => el('span', { class: `tile tile--sample tile--${kind}`, 'aria-hidden': 'true' }, letter);
  const how = el('section', { class: 'tilde__card tilde__how', id: 'como-se-juega' },
    el('h2', { class: 'tilde__card-title' }, t('tilde.how')),
    el('p', {}, t('tilde.howLead')),
    el('p', {}, t('tilde.howColours')),
    el('ul', { class: 'tilde__legend' },
      el('li', {}, sample('ó', 'correct'), el('span', {}, t('tilde.correct'))),
      el('li', {}, sample('a', 'accent'), el('span', {}, t('tilde.accent'))),
      el('li', {}, sample('e', 'present'), el('span', {}, t('tilde.present'))),
      el('li', {}, sample('r', 'absent'), el('span', {}, t('tilde.absent')))),
    el('p', {}, t('tilde.howEnye')),
    el('p', {}, t('tilde.howKeys')),
    el('p', {}, t('tilde.howHint')),
    el('p', {}, t('tilde.howShare')));

  // --- put together ----------------------------------------------------------

  // On a phone the how-to is below the keyboard; the ? goes down to it.
  const help = el('a', {
    class: 'btn btn--sm tilde__help', href: '#como-se-juega', 'data-link': '', 'aria-label': t('tilde.how'), title: t('tilde.how'),
  }, '?');
  const bar = el('div', { class: 'tilde__bar-top' },
    el('p', { class: 'tilde__meta' },
      el('span', {}, t('tilde.number', { n: number })),
      el('span', {}, t('tilde.letters', { n: size }))),
    el('div', { class: 'tilde__tools' }, hintButton, help));

  root.append(
    el('div', { class: 'tilde__play' }, bar, hintBox, board, message, keyboard),
    el('div', { class: 'tilde__side' }, how, statsBox));

  state.guesses.forEach((guess, r) => paintRow(r, guess));
  paintTyping();
  paintKeys();
  paintStats();
  if (state.hint) showHint();
  if (over()) {
    hintButton.hidden = true;
    finish();
  }

  return {
    stop() {
      document.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    },
  };
}

// ---------------------------------------------------------------------------

/** What the answer is: a verb form's infinitive, tense and person, or a word's kind and meaning. */
function describe(entry) {
  if (entry.kind !== 'verb') {
    return [el('p', { class: 'tilde__what' },
      el('span', {}, t(`tilde.kind.${entry.kind.replace('.', '')}`)),
      el('span', { class: 'tilde__gloss', lang: 'en' }, entry.gloss))];
  }
  const glossed = new Set();
  return entry.forms.slice(0, 3).map((form) => {
    const persons = form.persons.map((person) => PERSON_LABELS[person] ?? IMPERATIVE_PERSONS[person] ?? person);
    const tense = t(`tilde.tense.${form.tense}`);
    return el('p', { class: 'tilde__what' },
      el('strong', { lang: 'es' }, form.lemma),
      el('span', {}, persons.length ? `${tense}, ${persons.join(` ${t('tilde.or')} `)}` : tense),
      // The meaning once a verb, however many of its tenses the form is.
      glossed.has(form.lemma) ? null : (glossed.add(form.lemma), el('span', { class: 'tilde__gloss', lang: 'en' }, form.gloss)));
  });
}

/** The hint sentence with a gap as long as the word: "_ _ _ _ _ ayuda." */
function blanked(text, size) {
  const [before, after = ''] = text.split('____');
  return [before, el('span', { class: 'tilde__blank', 'aria-label': t('tilde.blank') }, '_'.repeat(size)), after];
}

/** The same sentence with the word back in, capitalised where it opens it. */
function filled(text, word) {
  const [before, after = ''] = text.split('____');
  const opens = /^[¿¡«"“—\s]*$/.test(before);
  const shown = opens ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  return [before, el('strong', {}, shown), after];
}

/** Where the words and the sentences come from, as their licences ask. */
function footnote() {
  const link = (href, text) => el('a', { href, target: '_blank', rel: 'noopener' }, text);
  const [before, middle, after] = t('tilde.credits').split(/\{words\}|\{sentences\}/);
  return el('p', { class: 'page__footnote' },
    before, link('https://github.com/hermitdave/FrequencyWords', 'FrequencyWords (OpenSubtitles)'),
    middle, link('https://tatoeba.org', 'Tatoeba'), after);
}

function credit(hint) {
  return el('a', {
    class: 'tilde__credit',
    href: `https://tatoeba.org/en/sentences/show/${hint.id}`,
    target: '_blank',
    rel: 'noopener',
  }, t('tilde.from'));
}

/**
 * Copy to the clipboard. The Apps Script page runs in a frame that may not be
 * allowed the clipboard API, so a selected textarea and execCommand stand in.
 */
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = el('textarea', { class: 'tilde__copy', readOnly: true }, text);
    document.body.append(area);
    area.select();
    let done = false;
    try { done = document.execCommand('copy'); } catch { done = false; }
    area.remove();
    return done;
  }
}

